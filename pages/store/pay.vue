<template>
	<view class="padding-30 margin-center padding-bottom-150">

		<!-- 配送地址 -->
		<view v-if="Object.keys(address_detail).length == 0" class="bg-color-white padding-20 padding-top-50 padding-bottom-50 border-radius-15">
			<view class="font30" @tap="addressClick">
				<label>请选择收货地址</label>
				<view style="float: right;">
					<u-icon name="arrow-right" color="#c1c1c1" size="28"></u-icon>
				</view>
			</view>
		</view>
		<view v-if="Object.keys(address_detail).length > 0" class="bg-color-white padding-20 border-radius-15">
			<view class="font34 font-bold" @tap="addressClick">
				<label>
					<u-icon name="map" color="#ef5f1b" size="35"></u-icon>
					<text class="padding-left-20">{{address_detail.address}}</text>
				</label>
				<view style="float: right;">
					<u-icon name="arrow-right" color="#c1c1c1" size="28"></u-icon>
				</view>
			</view>
			<view class="margin-top-10 padding-left-50">{{address_detail.real_name}} {{address_detail.phone}}</view>
		</view>
		<!-- 商品清单 -->
		<view class="bg-color-white padding-20 border-radius-15 margin-top-20">
			<view class="padding-top-20 padding-bottom-30">
				<u-icon name="dianpu" custom-prefix="custom-icon" color="#ef5f1b" size="34"></u-icon>
				<text class="margin-left-10 gray3">{{shop_name}}</text>
			</view>
			<u-line color="#f3f3f3"/>
			<view class="d-row d-jc-between padding-10 padding-bottom-20" v-for="(item,index) in cart"
				:key="index">
				<view class="d-row">
					<view class="d-clo d-ai-centen">
						<image style="width: 100rpx;height: 100rpx;" :src="item.goods_pic" mode="aspectFill"></image>
					</view>
					<view class="d-clo d-jc-between padding-left-10">
						<view class="font28 font-bold">{{item.goods_name}}</view>
						<view class="font22 gray4">{{item.goods_desc}}</view>
					</view>
				</view>
				<view class="flex-1 text-right">
					<text>x{{item.number}}</text>
				</view>
				<view class="text-right" style="width: 130rpx;">
					<text class="font-bold">¥{{item.price}}</text>
				</view>
			</view>
			<u-line color="#f3f3f3" />
			<view class="d-row d-jc-between padding-10 padding-bottom-20 padding-top-20">
				<view class="font-bold font28">配送费</view>
				<view class="font-bold" v-if="total > Number(enough_free_dyrmbs)">免配送费</view>
				<view v-else>¥{{delivery_rmbs}}</view>
			</view>
			<view>
				<view @tap="couponClick" class="u-cell u-border-bottom u-col-center" style="background-color: transparent;">
					<u-icon name="quan" custom-prefix="custom-icon" color="#ef5f1b" size="38"></u-icon>
					<view class="u-cell_title" style="width: auto;">优惠券</view>
					<view class="u-cell__value">
						<text v-if="coupon.length > 0">{{activeCoupon}}</text>
						<text v-if="coupon.length == 0">暂无可用优惠券</text>
					</view>
					<u-icon name="arrow-right" color="#909399" size="26"></u-icon>
				</view>
			</view>
			<view class="d-row d-jc-between d-ai-centen padding-10 padding-top-30">
				<view class="gray3"> 
				
				</view>
				<view>共{{ numsum }}个商品，小计：<label class="font-bold font40">¥ {{ total }}</label></view>
			</view>

		</view>
		<!-- 支付方式 -->
		<view class="bg-color-white padding-20 border-radius-15 margin-top-20 font30">
			<view class="d-row d-jc-between padding-top-20 padding-bottom-30" style="border-bottom: 1rpx solid #F7F7F7;">
				<view>支付方式</view>
				<view>微信支付</view>
			</view>
			<view class="d-row d-jc-between padding-top-20 padding-bottom-20">
				<view>备注</view>
				<view>
					<!-- <u-icon margin-left="10" name="arrow-right" color="#c1c1c1" size="28"></u-icon> -->
				</view>
			</view>
			<view>
				<u-input v-model="model.remark" type="textarea" border="true" border-color="#f1f1f1" height="200" auto-height="true" />
			</view>
		</view>


		<!-- 去支付 -->
		<view class="pay">
			<view style="margin:0 auto;" class="width100 d-row d-jc-between">
				<view class="d-row d-jc-start d-ai-centen" style="padding-left: 10rpx;">
					<view class="d-ai-centen padding-left-10">
						<text style="vertical-align: middle;">合计</text>
						<text class="padding-left-10 text-bolder" style="vertical-align: middle;color: #ff6634;font-size: 37rpx;">¥ {{ total }}</text>
					</view>
				</view>
				<view class="go gray4">
					<view class="go gray4 font28 colorWhiteBgBlue" @tap="goPayMoney">
						提交订单
					</view>
				</view>

			</view>
		</view>


		<u-popup v-model="couponShow" mode="bottom">
			<view style="height: 60vh;position: relative;">
				<view class="padding-top-20 padding-bottom-20" style="background-color: #eeeeef; position: sticky; top: 0; z-index: 3;">
					<u-subsection :list="couponlist" :current="current" active-color="#ef5f1b" :animation="true" @change="couponTabChange"></u-subsection>
				</view>
				<view class="padding-left-20 padding-right-20 padding-bottom-50">
					<coupon v-for="(item, index) in coupon" :key="index" v-bind:item="item" @use="use" theme="#ff6c00" color="#ffffff" solid="#ff6c00"></coupon>
				</view>
			</view>
		</u-popup>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import coupon from '@/components/coolc-coupon/coolc-coupon';
	import { post, get, wx_pay, showToast } from '../../tools/utils.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			coupon
		},
		data() {
			return {
				couponShow: false,
				shop_name: '',
				delivery_rmbs:0, // 运费
				enough_free_dyrmbs:0, // 满多少免运费
				 
				cart: [],
				
				couponlist: [{
					name: '可用优惠券'
				}],
				current: 0,
				coupon:[],
				activeCoupon:'选择优惠券',
				activeCouponNum:'',
				model:{
					goods_ids:'',
					goods_nums:'',
					addressid:0,
					couponid:0,
					remark:''
				},
				address_detail:{}
			}
		},
		props: {
			index: 'index'
		},
		computed: {
			...mapState(['orderType', 'address', 'store']),
			numsum() {
				return this.cart.reduce((acc, cur) => acc + cur.number, 0)
			},
			total() {
				let total = this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0)
				// 判断是否选择优惠券
				if(Number(this.activeCouponNum) > 0) {
					total = total - Number(this.activeCouponNum)
				}
				// 判断金额是否符合免运费
				let enough_free_dyrmbs_fmt = Number(this.enough_free_dyrmbs)
				if(total < enough_free_dyrmbs_fmt) {
					total = total + Number(this.delivery_rmbs)
				}
				if(total < 0) {
					total = 0
				}
				return total
			},
			amount() {
				return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0)
			}
		},
		onLoad(option) {
			this.shop_name = option.name
			this.delivery_rmbs = option.delivery_rmbs
			this.enough_free_dyrmbs = option.enough_free_dyrmbs
			this.companyid = option.companyid
			this.cart = uni.getStorageSync('cart') || []
			
			let goods_ids = []
			let goods_nums = []
			this.cart.map((item)=>{
				goods_ids.push(item.goods_id)
				goods_nums.push(item.number)
			})
			this.model.goods_ids = goods_ids.toString()
			this.model.goods_nums = goods_nums.toString()
			
			this.addressdefault()
			this.mycoupon()
		},
		methods: {
			addressdefault(){
				let _this = this;
				this.$store.dispatch('shops/addressdefault',{}).then((res) => {
					if(res.code == 0) {
						let data = res.message;
						this.address_detail = data
						this.model.addressid = data.addressid
					}
				})
			},
			mycoupon() {
				console.log(this.companyid)
				let _this = this;
				this.$store.dispatch('shops/mycoupon',{'companyid':this.companyid}).then((res) => {
					if(res.code == 0) {
						this.coupon = res.message.coupon_list
						this.maxpage = res.message.maxpage
					}
				})
			},
			
			addressClick() {
				uni.navigateTo({
					url: './address?type=1',
					animationType: 'pop-in',
					animationDuration: 2000
				})
			},
			// 渲染地址
			chooseAddress(data){
				console.log(data)
				this.address_detail = data
				this.model.addressid = data.addressid
			},
			goPayMoney() {
				console.log(this.model)
				if(this.model.addressid == 0) {
					this.$refs.uToast.show({
						title: '请选择地址',
						duration:1000
					})
					return false
				}
				// uni.switchTab({
				// 	url: '../order/order-list',
				// 	animationType: 'pop-in',
				// 	animationDuration: 2000
				// })
				
				this.$store.dispatch('shops/addorder',this.model).then((res) => {
					if(res.code == 0) {
						this.toPay(res.message)
					} else {
						this.$refs.uToast.show({
							title: res.message,
							duration:1000
						})
					}
				})
				
			},
			toPay(token){
				this.$store.dispatch('shops/pay',{'order_token':token}).then((res) => {
				
					if(res.code == 0) {
					
						var data = res.message;
						uni.requestPayment({
						    provider: 'wxpay',
						    timeStamp: data.timeStamp,
						    nonceStr: data.nonceStr,
						    package: data.package,
						    signType: data.signType,
						    paySign: data.paySign,
						    success: function (res) {
						        console.log('success:' + JSON.stringify(res));
								
								uni.switchTab({
									url:'/pages/order/order-list'
								})
						    },
						    fail: function (err) {
						        console.log('fail:' + JSON.stringify(err));
						    }
						});
					} else {
						uni.switchTab({
							url:'/pages/order/order-list'
						})
						this.$refs.uToast.show({
							title: res.message,
							duration:1000
						})
					}
				})
			},
			couponClick() {
				if(this.coupon.length > 0) {
					this.couponShow = true
				}
			},
			couponTabChange(index) {
				this.current = index;
			},
			use(data) {

				if(this.total < Number(data.need_rmbs)){
					this.$refs.uToast.show({
						title: '未满足优惠券使用要求',
						duration:1000
					})
					return false
				}
				
				this.activeCoupon = '￥'+data.rmbs
				this.activeCouponNum = data.rmbs
				
				this.model.couponid = data.id
				
				this.couponShow = false
			}
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
		height: 105rpx;
		margin: 0 auto;
		
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 1000;
		
		box-shadow: 0px -1px 3px #ececec;
	}

	.go {
		width: 240rpx;
		height: 105rpx;
		line-height: 105rpx;
		background: linear-gradient(to right,#fbab7c,#de2406);
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
