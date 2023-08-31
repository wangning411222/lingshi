 <template>
	<view class="margin-center padding-bottom-30">
		<view class="d-row bg-color-white padding-left-40 font30 topNav">
			<view class="flex-1">
				<text class="active margin-right-100 gray3 padding-top-20 padding-bottom-20"
					style="display: inline-block;">订单</text>
			</view>
			<view @click="statusShow = true" class="padding-left-40 padding-right-40 margin-top-20 margin-bottom-20 gray2" style="border-left: 1rpx solid #eee;">
				{{ activeStatusLabel }}<u-icon class="margin-left-10" name="arrow-down-fill" color="#aaa" size="28"></u-icon>
			</view>
		</view>
		<!-- 商品列表1 -->
		<view v-if="orderList.length > 0">
			<view v-for="(item,index) in orderList" :key="index" @tap="handleDetail(index)" class="bg-color-white padding-20 border-radius-15 margin-top-30">
				<view class="d-row d-jc-between padding-10 font30 padding-bottom-10">
					<view class="font28">
						<text v-for="(it,idx) in item.goods_info_fmt" :key="idx" class="margin-right-20">
							<text class="font-bold">{{it.goods_name}}</text> 
							<text class="padding-left-10 padding-right-10 gray3" style="vertical-align: middle;">*</text> 
							<text class="font-bold font-30" style="color: red;">{{it.goods_num}}</text>
						</text>
					
					</view>
					<view class="padding-left-10">¥ <text class="font30">{{item.total_rmbs_fmt}}</text></view>
				</view>
				<view class="d-row d-jc-between d-ai-centen padding-10 padding-top-30">
          <view class="gray3">下单时间:{{item.create_time}}</view>
					<view v-if="item.status != 1" class="flex-1 gray3" style="text-align:right">
						<text>{{item.status_fmt}}</text>
					</view>
					<view v-if="item.status == 1" class="flex-1 text-right">
						<!-- <button class="custom-style1" @tap.stop="go('pay')">
							退款
						</button> -->
						<button class="custom-style" @tap.stop="delivery(item.orderid)">
							立即配送
						</button> 
					</view>
				</view>
			</view>
			<view v-if="maxpage > 1">
				<u-loadmore :status="status" />
			</view>
		</view>
		
		<view v-else class="empty_box">
			<u-empty text="暂无商品" mode="list"></u-empty>
		</view>
		<u-select v-model="statusShow" :list="statuslist" @confirm="confirm"></u-select>
		
		<u-popup v-model="orderDetailshow" mode="center" border-radius="14">
			<view class="padding-30 padding-bottom-50 padding-top-50 font30">

				<view class="d-row margin-bottom-30">
					<view class="text-right gray3" style="width: 120rpx;">姓   名：</view>
					<view class="flex-1">{{activeOrder.real_name}}</view>
				</view>
				<view class="d-row margin-bottom-30">
					<view class="text-right gray3" style="width: 120rpx;">手机号：</view>
					<view class="flex-1">{{activeOrder.phone}}</view>
				</view>
				<view class="d-row margin-bottom-30">
					<view class="text-right gray3" style="width: 120rpx;">地址：</view>
					<view class="flex-1">{{activeOrder.schoolinfo}}{{activeOrder.address}}</view>
				</view>
				<view class="d-row margin-bottom-30">
					<view class="text-right gray3" style="width: 120rpx;">备注：</view>
					<view class="flex-1">{{activeOrder.remark || '/'}}</view>
				</view>
        	<view class="d-row margin-bottom-30">
					<view class="text-right gray3" style="width: 160rpx;">下单时间：</view>
					<view class="flex-1">{{activeOrder.create_time}}</view>
				</view>
				<view class="d-row">
					<view class="text-right gray3" style="width: 120rpx;">优惠券：</view>
					<view class="flex-1">￥{{activeOrder.coupon_rmbs}}</view>
				</view>
				
			</view>
		</u-popup>
			
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderDetailshow:false,
				tabcurrent:0,
				statusShow:false,
				statuslist:[
					{
						value: 99,
						label: '全部'
					},
					{
						value: 1,
						label: '待配送'
					},
					{
						value: 2,
						label: '待收货'
					},
					{
						value: 3,
						label: '已完成'
					},
					{
						value: 5,
						label: '已退款'
					}
				],
				activeStatusLabel:'全部',
				activeStatus: 99,
				
				orderList:[],
				status: 'loadmore',
				page: 1,
				maxpage: 1,
				activeOrder:{}
			}
		},
		onLoad() {
			this.getorderlist({
				page:1,
				status:99
			},()=>{
				
			})
		},
		onReachBottom(){
			let _this = this;
			this.status = 'loading';
		
			if(this.maxpage > 1 && _this.page <= _this.maxpage) {
				this.getorderlist({
					status: this.activeStatus,

					page: this.page
				},function(){
					_this.status = 'loadmore';
				});
			}else {
				_this.status = 'nomore';
			}
			
		},
		methods: {
			getorderlist(data, callback = () => {}){
				this.$store.dispatch('shops/companyorderlist',data).then((res) => {
					if(res.code == 0) {
						this.orderList = this.orderList.concat(res.message.order_list)
						this.maxpage = res.message.maxpage
						if (res.message.maxpage > this.page) {
							this.page++
						}
						callback()
					}
				})
			},
			handleShop(){
				uni.navigateTo({
					url:'/pages/store/index'
				})
			},

			delivery(orderid){
				this.$store.dispatch('shops/companyorderupdate',{'orderid':orderid}).then((res) => {
					if(res.code == 0) {
							this.$refs.uToast.show({
                title: res.message,
                tupe:'success'
              })
              this.getorderlist()
					}
				})
			},
			confirm(e) {
				this.activeStatusLabel = e[0]['label']
				this.activeStatus = e[0]['value']
				
				this.orderList = [];
				this.status = 'loadmore';
				this.page = 1;
				this.maxpage = 1;
				
				this.getorderlist({
					status: this.activeStatus,
					page: this.page
				});
			},
			handleDetail(index){
				this.activeOrder = this.orderList[index]
				this.orderDetailshow = true
			}
		},
		onPullDownRefresh() {
			this.orderList=[];
			this.status= 'loadmore';
			this.page= 1;
			this.maxpage= 1;
			
			this.getorderlist({
				status: this.activeStatus,

				page: this.page
			},function(){
				uni.stopPullDownRefresh();
			});
			
		}
	}
</script>

<style>
.empty_box {width: 100%;padding-top: 20vh;}
.custom-style1 {display: inline-block; width: 160rpx;font-size: 26rpx; height: 60rpx; line-height: 60rpx; margin-right: 20rpx;  border-radius: 200rpx; color: #aaa;background: #fff; border: 1rpx solid #ccc;}
.custom-style {display: inline-block; width: 160rpx;font-size: 26rpx; height: 60rpx; line-height: 60rpx; border-radius: 200rpx; color: #efefef;background: linear-gradient(to right, #80D0C7, #0093E9);}
.topNav {position: sticky; top: 0; z-index: 3; width: 100%; }
.active {
	color: #fa792e;
	border-bottom: 5rpx solid #fa792e;
}
uni-page-head,uni-page,page{
	background-color: #f7f7f7;
}

.bgColor{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: #bbbbf3;
	z-index: -1;
}
</style>
