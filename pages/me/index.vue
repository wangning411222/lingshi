<template>
  <view>
    <u-navbar :is-back="false" title="　" :border-bottom="false" :background="{
      background: 'linear-gradient(to right, #80D0C7, #0093E9)',
    }"></u-navbar>
    <view v-if="!isAuthorized" class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
      <view class="u-m-r-10">
        <u-avatar size="large" mode="circle" @tap.stop="openAuthorizationModal" :src="userInfo.avatar_url_fmt"></u-avatar>
      </view>
      <view class="u-flex-1">
        <view class="u-font-18 u-p-b-20">未知用户</view>
      </view>

      <view class="u-m-l-10 u-p-10"> </view>
    </view>
    <view v-if="isAuthorized" class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
      <view class="u-m-r-10">
        <u-avatar @tap.stop="openAuthorizationModal" :src="userInfo.avatar_url_fmt" size="140"
          :show-level="true"></u-avatar>
      </view>
      <view class="u-flex-1">
        <view class="u-font-18 u-p-b-20 submit-btn" @tap.stop="openAuthorizationModal">{{ userInfo.nick_name || "用户" +
          userInfo.uid }}</view>
        <view class="role-name" v-if="userInfo.gid == '1'">
          <img src="../../imgs/chaoguan.svg" alt="">

        </view>
        <view class="role-name" v-if="userInfo.gid == '0'">
          <img src="../../imgs/putong.svg" alt="">

        </view>
        <view class="role-name" v-if="userInfo.gid == '5'">
          <img src="../../imgs/tuanzhang.svg" alt="">

        </view>
        <view class="role-name" v-if="userInfo.gid == '4'">
          <img src="../../imgs/tuanzhang_active.svg" alt="">

        </view>
        <view class="role-name" v-if="userInfo.gid == '2'">
          <img src="../../imgs/dianzhang_active.svg" alt="">

        </view>
        <view class="role-name" v-if="userInfo.gid == '3'">
          <img src="../../imgs/dianzhang.svg" alt="">

        </view>
      </view>
    </view>
    <view v-if="userInfo.gid == 3" class="padding-20">
      <u-alert-tips type="primary" title="已提交商家申请,审核中" :show-icon="true"></u-alert-tips>
    </view>
    <view v-if="userInfo.gid == 5" class="padding-20">
      <u-alert-tips type="primary" title="已提交跑腿申请,审核中" :show-icon="true"></u-alert-tips>
    </view>
    <view v-if="userInfo.gid == 2 || userInfo.gid == 4" class="u-m-t-20 bg-white" style="border-radius: 10rpx">
      <view @tap="merchant()" class="u-cell u-border-bottom" style="background-color: transparent">
        <u-icon name="grid" color="#80D0C7" size="50" class="u-cell__left-icon-wrap"></u-icon>
        <view class="u-cell_title" style="width: auto">商家管理</view>
        <view class="u-cell__value"></view>
        <u-icon name="arrow-right" color="#969799" size="28" class="u-icon-wrap u-cell__right-icon-wrap"
          style="transform: rotate(0deg)"></u-icon>
      </view>
    </view>

    <view class="u-m-t-20 bg-white" style="border-radius: 10rpx">
      <view @tap="my_coupons()" class="u-cell u-border-bottom" style="background-color: transparent">
        <u-icon name="coupon" color="#C7ACEF" size="50" class="u-cell__left-icon-wrap"></u-icon>
        <view class="u-cell_title" style="width: auto">我的优惠券</view>
        <view class="u-cell__value"></view>
        <u-icon name="arrow-right" color="#969799" size="28" class="u-icon-wrap u-cell__right-icon-wrap"
          style="transform: rotate(0deg)"></u-icon>
      </view>
      <view @tap="collectCoupons()" class="u-cell u-border-bottom" style="background-color: transparent">
        <u-icon name="coupon" color="#80D0C7" size="50" class="u-cell__left-icon-wrap"></u-icon>
        <view class="u-cell_title" style="width: auto">领券中心</view>
        <view class="u-cell__value"></view>
        <u-icon name="arrow-right" color="#969799" size="28" class="u-icon-wrap u-cell__right-icon-wrap"
          style="transform: rotate(0deg)"></u-icon>
      </view>

      <view @tap="my_address()" class="u-cell u-border-bottom" style="background-color: transparent">
        <u-icon name="map" color="#C7ACEF" size="50" class="u-cell__left-icon-wrap"></u-icon>
        <view class="u-cell_title" style="width: auto">我的地址</view>
        <view class="u-cell__value"></view>
        <u-icon name="arrow-right" color="#969799" size="28" class="u-icon-wrap u-cell__right-icon-wrap"
          style="transform: rotate(0deg)"></u-icon>
      </view>
       <view style="position: relative" @tap="toMyComment" v-if="userInfo.gid == '0'">
        <view class="u-cell u-border-bottom" style="background-color: transparent">
          <u-icon name="tags" color="#80D0C7" size="50" class="u-cell__left-icon-wrap"></u-icon>
          <view class="u-cell_title" style="width: auto">评价中心</view>
          <view style="flex: 1"></view>
          <u-icon name="arrow-right" class="u-icon-wrap u-cell__right-icon-wrap"></u-icon>
        </view>
      </view>
      <view @tap="feedback()" class="u-cell u-border-bottom" style="background-color: transparent">
        <u-icon name="edit-pen" color="#80D0C7" size="50" class="u-cell__left-icon-wrap"></u-icon>
        <view class="u-cell_title" style="width: auto">意见反馈</view>
        <view class="u-cell__value"></view>
        <u-icon name="arrow-right" color="#969799" size="28" class="u-icon-wrap u-cell__right-icon-wrap"
          style="transform: rotate(0deg)"></u-icon>
      </view>
      <view v-if="userInfo.gid == 0" @tap="handleApply(0)" class="u-cell u-border-bottom"
        style="background-color: transparent">
        <u-icon name="rmb-circle" color="#C7ACEF" size="50" class="u-cell__left-icon-wrap"></u-icon>
        <view class="u-cell_title" style="width: auto">申请零食店</view>
        <view class="u-cell__value"></view>
        <u-icon name="arrow-right" color="#969799" size="28" class="u-icon-wrap u-cell__right-icon-wrap"
          style="transform: rotate(0deg)"></u-icon>
      </view>
      <view v-if="userInfo.gid == 0" @tap="handleApply(1)" class="u-cell u-border-bottom"
        style="background-color: transparent">
        <u-icon name="rmb-circle" color="#80D0C7" size="50" class="u-cell__left-icon-wrap"></u-icon>
        <view class="u-cell_title" style="width: auto">申请团购店</view>
        <view class="u-cell__value"></view>
        <u-icon name="arrow-right" color="#969799" size="28" class="u-icon-wrap u-cell__right-icon-wrap"
          style="transform: rotate(0deg)"></u-icon>
      </view>

      <view style="position: relative">
        <view class="u-cell u-border-bottom" style="background-color: transparent">
          <u-icon name="kefu-ermai" color="#C7ACEF" size="50" class="u-cell__left-icon-wrap"></u-icon>
          <view class="u-cell_title" style="width: auto">联系我们</view>
          <view style="flex: 1"></view>
          <u-icon name="arrow-right" class="u-icon-wrap u-cell__right-icon-wrap"></u-icon>
        </view>
        <button class="call_us_btn" open-type="contact">联系我们</button>
      </view>
     
    </view>

    <u-toast ref="uToast" />
    <u-modal v-model="feedbackshow" :show-confirm-button="false" :show-title="false" :mask-close-able="true">
      <view class="slot-content">
        <view><u-image width="300rpx" height="300rpx" src="../../../static/favicon.ico"></u-image></view>
        <view style="padding-top: 30rpx">关注公众号，反馈您的问题</view>
      </view>
    </u-modal>
    <wx-user-info-modal v-model="showAuthorizationModal" @updated="updatedUserInfoEvent"></wx-user-info-modal>
  </view>
</template>

<script>
import WxUserInfoModal from "@/components/tuniaoui-wx-user-info/components/tuniaoui-wx-user-info/tuniaoui-wx-user-info.vue";
import { mapMutations, mapGetters } from "vuex";
import { domain } from "../../tools/utils.js";
export default {
  components: { WxUserInfoModal },
  data() {
    return {
      showAuthorizationModal: false,

      user_show: false, // 是否填写了资料
      feedbackshow: false,
    };
  },
  onLoad() {
    let _this = this;
    if (!this.isAuthorized) {
      uni.getUserProfile({
        desc: "获取你的昵称、头像、地区及性别",
        success: (res) => {
          let wxUserInfo = res.userInfo;
          _this.$store.dispatch("login/updateUserInfo", wxUserInfo);
        },
        fail: (res) => {
          console.log("您拒绝了请求");
          return;
        },
      });
    }

    this.$store.dispatch("login/checkLogin").then((res) => {
      if (res && res.code != 0) {
        _this.$refs.uToast.show({
          title: "登录失败",
        });
      } else {
        _this.user();
      }
    });
  },
  onShow() {
    this.user();
  },
  computed: {
    ...mapGetters("user", ["isAuthorized", "userInfo"]),
    ...mapGetters("config", ["config"]),
  },
  onShareAppMessage(res){
    return res
  },
  methods: {
    toMyComment(){
      console.log('222221111111111111')
      uni.navigateTo({
        url:'/pages/me/mycomment/mycomment'
      })
    },
    ...mapMutations("user", ["setUserInfo"]),
    wxlogin(e) {
      this.openAuthorizationModal();
    },
    // 打开获取用户信息弹框
    openAuthorizationModal() {
      this.showAuthorizationModal = true;
    },

    // 获取到的用户信息
    updatedUserInfoEvent(info) {
      console.log("获取到的用户信息", info);
      let userInfo = uni.getStorageSync("userInfo");
      const tempFilePaths = info.avatar;
      console.log(
        tempFilePaths,
        "tempFilePathstempFilePathstempFilePathstempFilePaths"
      );
      var that = this;
      uni.uploadFile({
        url:
          domain() +
          "/user-upimg.htm?token=" +
          userInfo.token +
          "&nickName=" +
          info.nickname, //仅为示例，非真实的接口地址
        filePath: tempFilePaths,
        name: "file",
        success: (uploadFileRes) => {
          that.$refs.uToast.show({
            title: "设置成功",
          });
          that.showAuthorizationModal = false;
          that.user();
        },
      });
    },
    user() {
      let _this = this;
      this.$store.dispatch("user/getRead").then((res) => {
        if (res.code == 0) {
          _this.setUserInfo(res.message);

          if (res.message.gid == 0 || res.message.gid == 5) {
            // 判断是否注册角色
            _this.role_model = true;
          } else {
            _this.role_model = false;

            console.log(res.message);
          }
        }
      });
      this.$store.dispatch("user/getUserInfo").then((res) => {
        if (res.code == 0) {
         
        }
      });
    },
    getPhoneNumber(e) {
      console.log(e.detail);

      this.$store
        .dispatch("user/setPhoneNum", {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        })
        .then((res) => {
          if (res.code == 0) {
            this.user();
          }
        });
    },

    my_coupons() {
      uni.navigateTo({
        url: "/pages/me/myCoupons",
      });
    },
    collectCoupons() {
      uni.navigateTo({
        url: "/pages/find/collectCoupons",
      });
    },

    my_address() {
      uni.navigateTo({
        url: "/pages/store/address?type=0",
      });
    },
    feedback() {
      uni.navigateTo({
        url: "/pages/me/feedback",
      });
    },
    handleApply(type) {
      if (type == 0) {
        uni.navigateTo({
          url: "/pages/index/join_form",
        });
      } else {
        uni.navigateTo({
          url: "/pages/index/service_form",
        });
      }
    },
    merchant() {
      let tampid = this.config.new_order_tmplid;
      let that = this;
      uni.requestSubscribeMessage({
        tmplIds: [tampid],
        success(res) {
          if (res[tampid] == "reject") {
            // 拒绝授权
            that.$refs.uToast.show({
              title: "为保证商户及时获取订单信息,请同意授权",
              type: "error",
            });
            return;
          }
          if (res[tampid] == "accept") {
            uni.navigateTo({
              url: "/pages/cms/merchantHomepage",
            });
          }
        },
      });
    },
    // merchant_homepage(){
    // 	uni.navigateTo({
    // 	    url: '/pages/me/merchantHomepage'
    // 	});
    // },

    // merchant_wallet(){
    // 	uni.navigateTo({
    // 	    url: '/pages/me/merchantWallet'
    // 	});
    // },
    // handleChannel(){
    // 	uni.navigateTo({
    // 	    url: '/pages/me/channel'
    // 	});
    // },
  },
};
</script>

<style lang="scss">
page {
  background-color: #ededed;
}

.u-flex-1 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.role-name {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  text {
    color: #fff;
    margin-right: 5rpx;
  }

  img {
    width: 180rpx;
    height: 90rpx;
  }
}

.camera {
  width: 54px;
  height: 44px;

  &:active {
    background-color: #ededed;
  }
}

.user-box {
  color: #ffffff;
  background: linear-gradient(to right, #80d0c7, #0093e9);
}

.authBtn {
  padding: 0 25rpx;
  font-size: 30rpx;
}

.slot-content {
  padding: 60rpx 0;
  text-align: center;

  .u-image {
    margin: 0 auto;
  }
}

.call_us_btn {
  font-size: 28rpx;
  opacity: 0;
  padding: 26rpx 32rpx;
  width: 750rpx;
  line-height: 54rpx;
  text-align: left;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
}

.u-cell {
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 35rpx 32rpx;
  font-size: 28rpx;
  line-height: 54rpx;
  color: #606266;
  background-color: #fff;
  text-align: left;
}

.u-cell__left-icon-wrap,
.u-cell__right-icon-wrap {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 48rpx;
}

.u-cell__left-icon-wrap {
  margin-right: 20rpx;
}

.u-cell__right-icon-wrap {
  margin-left: 10rpx;
  color: #969799;
  font-size: 28rpx;
}

.u-cell_title {
  font-size: 32rpx;
}

.u-cell__title,
.u-cell__value {
  flex: 1;
}
</style>
