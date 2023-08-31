<template>
	<view>
		<view class="padding-left-20 padding-right-20 padding-top-20 padding-bottom-50">
		
			<view v-if="coupon.length>0" v-for="(item, index) in coupon" :key="index" class="card d-row d-ai-centen bg-white padding-20 margin-bottom-20 border-radius-10">
				<view class="flex-1">
					<view class="gray3 d-row">
						<u-image @tap="intoDetails(item)" :src="item.logo" width="80rpx" height="80rpx" mode="aspectFill" border-radius="10" :lazy-load="true"></u-image>
						<text class="font26 margin-left-10" style="align-self: center;">{{item.company_name}}</text>
					</view>
					<view class="layof margin-top-20 margin-bottom-10">￥{{item.rmbs}}</view>
					<view class="gray3 ">满{{item.need_rmbs}}减{{item.rmbs}}元</view>
				</view>
				<view>
					<view @tap="receive(item)" class="get-btn" style="">领取</view>
				</view>
			</view>
			<view v-else class="empty_box">
				<u-empty text="暂无优惠券" mode="coupon"></u-empty>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {getLocalStorage} from '@/tools/utils.js';

	export default {

		data() {
			return {
				address_arr:[],
				coupon:[]
				
			}
		},
		onLoad(option) {
			this.type = option.type
			this.address_arr = getLocalStorage('address')
			this.getcoupon();
			
		},
		methods: {
			intoDetails(item) {
				uni.navigateTo({
					url: '../store/index?item=' + JSON.stringify(item),
					animationType: 'pop-in',
					animationDuration: 2000
				})
			},
			getcoupon() {
				let _this = this;
				this.$store.dispatch('shops/couponCenter',{
					building_num: this.address_arr.buid,
					schoolid: this.address_arr.schoolid,
					type: this.type
				}).then((res) => {
					if(res.code == 0) {
						this.coupon = res.message.coupon_list
					}
				})
			},
			receive(data) {
				let _this = this;
			
				this.$store.dispatch('shops/couponGet',{'couponid':data.couponid}).then((res) => {
					if(res.code == 0) {
						_this.$refs.uToast.show({
							title: res.message,
							duration:1000
						})
					} else {
						_this.$refs.uToast.show({
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
	page {background: linear-gradient(to right, #80D0C7, #0093E9);}
</style>
<style scoped>
	
.get-btn {
	color: #ffffff;
    background: #80D0C7;
	width: 146rpx;
	height: 52rpx;
	line-height: 50rpx;
	
	text-align: center;
	border-radius: 60rpx;
	
	border: 1px solid #0093E9;
	font-size: 24rpx;
}
.layof {
	    width: 100%;
	    height: 48rpx;
	    font-size: 44rpx;
	    color: #80D0C7;
	    font-weight: bold;
	}
	.empty_box {width: 100%;padding-top: 20vh;}
</style>
