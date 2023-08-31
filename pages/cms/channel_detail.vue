<template>
	<view v-if="Object.keys(orderDetail).length > 0" class="padding-20 margin-center padding-bottom-150">
		<view class="bg-color-white padding-20 border-radius-15">
			<view>
				<u-icon name="order" color="#ef5f1b" size="35"></u-icon> 
				<text class="padding-left-20 font-bold font32">订单{{orderDetail.status_fmt}}</text>
			</view>
		</view>
		<!-- 配送地址 -->
		<view class="bg-color-white padding-20 border-radius-15 margin-top-20">
			<view class="font34 font-bold">
				<view>
					<u-icon name="map" color="#ef5f1b" size="35"></u-icon>
					<text class="padding-left-20">{{orderDetail.address}}</text>
				</view>
			</view>
			
		</view>
		<!-- 商品清单 -->
		<view class="bg-color-white padding-20 border-radius-15 margin-top-20">

			<view class="d-row d-jc-between padding-10 padding-bottom-20 border-bottom-2" v-for="(item,index) in orderDetail.goods_info_fmt"
				:key="index">
				<view class="d-row">
					<view class="d-clo d-ai-centen">
						<image style="width: 80rpx;height: 80rpx;" :src="item.goods_pic" mode="aspectFill"></image>
					</view>
					<view class="d-clo d-jc-between padding-left-10">
						<view class="font28 font-bold">{{item.goods_name}}</view>
					</view>
				</view>
				<view class="flex-1 text-right">
					<text>x{{item.goods_num}}</text>
				</view>
				<view class="text-right" style="width: 130rpx;">
					<text class="font-bold">¥{{item.price}}</text>
				</view>
			</view>


			<view class="d-row d-jc-between padding-10 padding-bottom-20 border-bottom-2">
				<view class="font-bold  font28">配送费</view>
				<view>¥{{orderDetail.delivery_rmbs}}</view>
			</view>
			
			<view class="d-row d-jc-between d-ai-centen padding-10 padding-top-30">
				<view class="gray3"> 
				
				</view>
				<view>合计：<label class="font-bold font40">¥ {{ orderDetail.total_rmbs_fmt }}</label></view>
			</view>

		</view>
		<!-- 支付方式 -->
		<view class="bg-color-white padding-20 border-radius-15 margin-top-20 font30">
			<view v-if="orderDetail.status == '1' || orderDetail.status == '2' || orderDetail.status == '3'" 
				class="d-row d-jc-between padding-top-20 padding-bottom-20" style="border-bottom: 1rpx solid #F7F7F7;">
				<view>支付方式</view>
				<view>微信支付</view>
			</view>
			<view class="d-row d-jc-between padding-top-20 padding-bottom-20">
				<view>备注</view>
				<view>
					<!-- <u-icon margin-left="10" name="arrow-right" color="#c1c1c1" size="28"></u-icon> -->
				</view>
			</view>
			<view class="gray3">
				{{orderDetail.remark || '无备注信息'}}
			</view>
		</view>
		<view class="bg-color-white padding-left-20 padding-right-20 padding-top-30 padding-bottom-30 border-radius-15 margin-top-20 font30">
			<view class="gray3 margin-bottom-30">
				<text class="gray2 margin-right-20 font-bold font28">订单编号</text>
				{{orderDetail.orderid}}
			</view>
			<view class="gray3 margin-bottom-30">
				<text class="gray2 margin-right-20 font-bold font28">下单时间</text>
				{{orderDetail.create_time}}
			</view>
			<view class="gray3">
				<text class="gray2 margin-right-20 font-bold font28">支付时间</text>
				{{orderDetail.pay_date_fmt}}
			</view>
		</view>

		<!-- 去支付 -->
		<view v-if="orderDetail.status == 0 || orderDetail.status == 2" class="pay d-row d-ai-centen padding-left-30 padding-right-30">
			<view class="flex-1 text-right " v-if="orderDetail.status == 0">

				<view class="go gray4 font28 colorWhiteBgBlue" style="display: inline-block;" @tap="goPayMoney(orderDetail.order_token)">
					支付
				</view>
			</view>
			<view class="flex-1 text-right " v-if="orderDetail.status == 2">
				<view class="go colorWhiteBgBlue gray4 font28  margin-right-20" style="display: inline-block;" @tap="receive(orderDetail.orderid)">
					确认收货
				</view>
			</view>
		</view>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		data() {
			return {
				order_token:'',
				orderDetail:{}
			}
		},

		computed: {
			// ...mapState(['orderType', 'address', 'store']),

		},
		onLoad(option) {
			this.order_token = option.order_token
			this.getorderread({
				'order_token':option.order_token
			})
		},
		methods: {
			getorderread(data){
				this.$store.dispatch('shops/companyorderread',data).then((res) => {
					if(res.code == 0) {
						this.orderDetail = res.message
					}
				})
				
			},

			receive(orderid){
				uni.showModal({
				    title: '提示',
				    content: '确认收货？',
				    success: (res) => {
				        if (res.confirm) {
				            this.$store.dispatch('shops/companyorderupdate',{'orderid':orderid}).then((res) => {
				            	if(res.code == 0) {
				            		this.$refs.uToast.show({
				            			title: res.message,
				            			duration:1000
				            		})
									this.getorderread({
										'order_token':this.order_token
									})
				            	} else {
				            
				            		this.$refs.uToast.show({
				            			title: res.message,
				            			duration:1000
				            		})
				            	}
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
			},
			goPayMoney(token) {
				let _this = this
				this.$store.dispatch('shops/companyorderpay',{'order_token':token}).then((res) => {
					if(res.code == 0) {
						let data = res.data
						uni.requestPayment({
						    provider: 'wxpay',
						    timeStamp: data.timeStamp,
						    nonceStr: data.nonceStr,
						    package: data.package,
						    signType: data.signType,
						    paySign: data.paySign,
						    success: function (res) {
						        console.log('success:' + JSON.stringify(res));
								
								_this.getorderread({
									'order_token':_this.order_token
								})
						    },
						    fail: function (err) {
						        console.log('fail:' + JSON.stringify(err));
						    }
						});
					} else {

						this.$refs.uToast.show({
							title: res.message,
							duration:1000
						})
					}
				})
			},

		}
	}
</script>

<style>
	page {
		background-color: #f7f7f7;
	}

	.pay {
		background-color: #ffffff;
		width: 100%;
		height: 95rpx;
		margin: 0 auto;
		
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 1000;
		
		box-shadow: 0px -1px 3px #ececec;
	}
	.cancelOrder {
		border: 1rpx solid #eeeeee;
		width: 200rpx;
		height: 65rpx;
		line-height: 65rpx;
		border-radius: 65rpx;
		background: #FFFFFF;
		color: #888888 !important;
		text-align: center;
	}
	.go {
		width: 200rpx;
		height: 65rpx;
		line-height: 65rpx;
		border-radius: 65rpx;
		background: linear-gradient(to right,#ff915a,#ff352e);
		color: #cecece !important;
		text-align: center;
	}

	.colorWhiteBgBlue {
		background-color: #007AFF !important;
		color: #FFFFFF !important;
	}

	.u-cell {
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
		box-sizing: border-box;
		width: 100%;
		padding: 26rpx 0;
		font-size: 22rpx;
		line-height: 45rpx;
		
		background-color: #fff;
		text-align: left;
	}

	.u-cell_title {
		padding-left: 15rpx;
		font-size: 28rpx;
	}

	.u-cell__value {
		flex: 1;
		overflow: hidden;
		text-align: right;
		vertical-align: middle;
		color: #909399;
		font-size: 26rpx;
	}

</style>
