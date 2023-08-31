<template>
  <view class="margin-center">
    <view class="d-row bg-color-white padding-left-40 font30 topNav">
      <view class="flex-1">
        <text :class="tabcurrent == 0 ? 'active' : ''" @tap="handelTab(0)"
          class="margin-right-100 gray3 padding-top-20 padding-bottom-20" style="display: inline-block">商品单</text>
        <text :class="tabcurrent == 1 ? 'active' : ''" @tap="handelTab(1)" class="padding-top-20 padding-bottom-20 gray3"
          style="display: inline-block">团购单</text>
      </view>
      <view @click="statusShow = true" class="padding-left-40 padding-right-40 margin-top-20 margin-bottom-20 gray2"
        style="border-left: 1rpx solid #eee">
        {{ activeStatusLabel
        }}<u-icon class="margin-left-10" name="arrow-down-fill" color="#aaa" size="28"></u-icon>
      </view>
    </view>
    <!-- 商品列表1 -->
    <view v-if="orderList.length > 0">
      <view v-for="(item, index) in orderList" :key="index"
        class="bg-color-white padding-20 border-radius-15 margin-top-30">
        <view @tap="handleShop(item.companyid)" class="d-row d-jc-between padding-10 padding-bottom-20 border-bottom-2">
          <view class="d-row">
            <view class="d-clo d-ai-centen">
              <u-image :src="item.logo" width="80rpx" height="80rpx" mode="aspectFill" border-radius="10"
                :lazy-load="true"></u-image>
            </view>
            <view class="d-clo d-jc-between padding-left-20">
              <view class="font-bold font32">{{ item.name }}</view>
              <view>
                <text class="gray3 font22">{{ item.create_time }}</text>
              </view>
            </view>
          </view>
          <view class="d-clo d-ai-end">
            <view class="padding-bottom-20 gray2">{{ item.status_fmt }}</view>
          </view>
        </view>
        <view class="d-row d-jc-between d-ai-centen padding-10 font30 padding-bottom-10" @tap="go(item.order_token)">
          <view class="font22 gray3">{{ item.goods_name }}等{{ item.goods_num }}件商品</view>
          <view>¥ <text class="font-bold font36">{{ item.total_rmbs }}</text></view>
        </view>

        <view class="d-row d-jc-between d-ai-centen padding-10 padding-top-30">
          <view></view>
          <view>
            <button v-if="item.status == 0" class="custom-style" @tap="go(item.order_token)">
              去支付
            </button>
            <button v-if="item.status == 1" class="custom-style">待配送</button>
            <button v-if="item.status == 2" class="custom-style" @tap="go(item.order_token)">
              去收货
            </button>
            <button v-if="item.postid == 0 && item.status == 3" class="custom-style" @tap="gocomment(item)">
              去评价
            </button>
          </view>
        </view>
      </view>
      <view v-if="maxpage > 1">
        <u-loadmore :status="status" />
      </view>
    </view>
    <view v-else class="empty_box">
      <u-empty text="暂无相关订单" mode="list"></u-empty>
    </view>

    <u-select v-model="statusShow" :list="statuslist" @confirm="confirm"></u-select>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabcurrent: 0,
      statusShow: false,
      statuslist: [
        {
          value: 99,
          label: "全部",
        },
        {
          value: 0,
          label: "待支付",
        },
        {
          value: 1,
          label: "待配送",
        },
        {
          value: 2,
          label: "待收货",
        },
        {
          value: 3,
          label: "已完成",
        },
        {
          value: 5,
          label: "已取消",
        },
        {
          value: 4,
          label: "已退款",
        },
      ],
      activeStatusLabel: "全部",
      activeStatus: 99,

      orderList: [],
      status: "loadmore",
      page: 1,
      maxpage: 1,
    };
  },
  onLoad() {
    // this.getorderlist({
    // 	page:1,
    // 	shop_type:0
    // },()=>{
    // })
  },
  onShareAppMessage(res) {
    return res
  },
  onShow() {
    // uni.startPullDownRefresh();
    // this.orderList=[];
    this.status = "loadmore";
    this.page = 1;
    this.maxpage = 1;

    this.getorderlist(
      {
        status: this.activeStatus,
        shop_type: this.tabcurrent,
        page: this.page,
      },
      function () { }
    );
  },
  onReachBottom() {
    let _this = this;
    this.status = "loading";

    if (this.maxpage > 1 && _this.page <= _this.maxpage) {
      this.getorderlist(
        {
          status: this.activeStatus,
          shop_type: this.tabcurrent,
          page: this.page,
          more: "more",
        },
        function () {
          _this.status = "loadmore";
        }
      );
    } else {
      _this.status = "nomore";
    }
  },
  methods: {
    // 去评价
    gocomment(item) {
      uni.navigateTo({
        url: `/pages/comment/comment?data=${encodeURIComponent(JSON.stringify(item))}`,
      });
    },
    getorderlist(data, callback = () => { }) {
      let more = data.more;
      this.$store.dispatch("shops/orderlist", data).then((res) => {
        if (res.code == 0) {
          if (more == "more") {
            this.orderList = this.orderList.concat(res.message.order_list);
          } else {
            this.orderList = res.message.order_list;
          }

          this.maxpage = res.message.maxpage;
          if (res.message.maxpage > this.page) {
            this.page++;
          }
          callback();
        }
      });
    },
    handelTab(index) {
      this.tabcurrent = index;

      this.activeStatusLabel = "全部";
      this.activeStatus = 99;

      this.orderList = [];
      this.status = "loadmore";
      this.page = 1;
      this.maxpage = 1;

      this.getorderlist(
        {
          shop_type: this.tabcurrent,
          page: this.page,
        },
        () => { }
      );
    },
    handleShop(companyid) {
      uni.navigateTo({
        url: "/pages/store/index?companyid=" + companyid,
      });
    },
    go(order_token) {
      uni.navigateTo({
        url: "/pages/order/order-detail?order_token=" + order_token,
        animationType: "pop-in",
        animationDuration: 2000,
      });
    },
    confirm(e) {
      this.activeStatusLabel = e[0]["label"];
      this.activeStatus = e[0]["value"];

      this.orderList = [];
      this.status = "loadmore";
      this.page = 1;
      this.maxpage = 1;

      this.getorderlist({
        shop_type: this.tabcurrent,
        status: this.activeStatus,
        page: this.page,
      });
    },
  },
  onPullDownRefresh() {
    this.orderList = [];
    this.status = "loadmore";
    this.page = 1;
    this.maxpage = 1;

    this.getorderlist(
      {
        status: this.activeStatus,
        shop_type: this.tabcurrent,
        page: this.page,
      },
      function () {
        uni.stopPullDownRefresh();
      }
    );
  },
};
</script>

<style>
.empty_box {
  width: 100%;
  padding-top: 20vh;
}

.custom-style {
  width: 160rpx;
  font-size: 26rpx;
  height: 60rpx;
  line-height: 60rpx;
  margin: 0 auto;
  border-radius: 200rpx;
  color: #efefef;
  background: linear-gradient(to right, #80d0c7, #0093e9);
}

.topNav {
  position: sticky;
  top: 0;
  z-index: 3;
  width: 100%;
}

.active {
  color: #80d0c7;
  border-bottom: 5rpx solid #80d0c7;
}

uni-page-head,
uni-page,
page {
  background-color: #f7f7f7;
}

.bgColor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #bbbbf3;
  z-index: -1;
}
</style>
