<template>
	<view>
		<view v-if="coupon.length > 0" class="padding-left-20 padding-right-20 padding-bottom-50">
			<coupon v-for="(item, index) in coupon" :key="index" v-bind:item="item" @use="use" theme="#ff6c00" color="#ffffff" solid="#ff6c00"></coupon>
		</view>
		<view v-else class="empty_box">
			<u-empty text="暂无可用优惠券" mode="coupon"></u-empty>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import coupon from '@/components/coolc-coupon/coolc-coupon';
	export default {
		components: {
			coupon
		},
		data() {
			return {
				coupon:[],
				maxpage:0,
				
			}
		},
		onLoad() {
			this.mycoupon();
		},
		methods: {
			mycoupon() {
				let _this = this;
				this.$store.dispatch('shops/mycoupon').then((res) => {
					if(res.code == 0) {
						this.coupon = res.message.coupon_list
						this.maxpage = res.message.maxpage
					}
				})
			},
			use(data) {
				console.log(data)
				uni.navigateTo({
					url:'/pages/store/index?companyid='+data.companyid
				})
			}
		}
	}
</script>

<style>
.empty_box {width: 100%;padding-top: 20vh;}
</style>
