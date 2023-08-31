<template>
	<view class="coupon" style="padding-bottom: 120rpx;">
		<view class='po'>
			<view v-if="list.length > 0">
				<view v-for="(item,index) of list" :key="index">
					<view class='coupon'>
						<view class='cou_t'>
							<view class='cou_t_l'>
								<view :class='class_name'><span>¥</span>{{item.rmbs}}</view>
							</view>

							<view class='cou_t_r'>
								<view v-if="item.full == 0">
									<view class='cou_t_r_01'>{{item.name}}</view>
								</view>
								<view v-else>
									<view class='cou_t_r_01'>满{{item.need_rmbs}}减{{item.rmbs}}</view>
								</view>
								<view v-if="item.type == 1" class='cou_t_r_02'>剩余{{item.stock}}张</view>
								<view v-if="item.type == 0" class='cou_t_r_02'>无限量</view>
								<view class='cou_t_r_02 padding-top-10'>{{item.remark}}</view>
							</view>
							<view>
								<view v-if="item.isclose == 0" class="cou_t_rr" @click="close_coupon(item)">关闭</view>
								<view v-if="item.isclose == 1" class="cou_t_rr bg-green" @click="close_coupon(item)">开启</view>
								
								<view class="cou_t_rr cou_t_rr2 margin-top-20" @click="edit_coupon(item)">编辑</view>
							</view>
							
						</view>
						<view class='cou_d'>
							<view class='cou_t_r_02'>有效期：{{item.coupon_start_time}}至{{item.coupon_end_time}}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else class="empty_box">
				<u-empty text="暂无商品" mode="list"></u-empty>
			</view>
			<view class="coupon_btn">
				<navigator url="/pages/cms/coupon/coupon?title=添加优惠券">
					<view class=" flex flex-direction">
						<button class="btn cu-btn bg-red margin-tb-sm lg">添加店铺优惠券</button>
					</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {

				c_index: 0,
				list: [],
				class_name: 'cou_t_l_01',

				is_over: 2

			};
		},
		onLoad() {
			this.get_all_coupon()
		},
		methods: {
			time_over(time) {
				if (!time) {
					return false;
				}
				let a = new Date(time).getTime()
				let b = new Date().getTime()
				console.log(a)
				console.log(b)
				if (b > a) {
					return true;
				}
			},
			get_all_coupon(callback=()=>{}) {
				let _this = this;

				_this.$store.dispatch('shops/couponlist').then((res) => {
					if (res.code == 0) {
						_this.list = res.message
					}
					callback()
				});
			},
			close_coupon(item) {
				const _this = this
				uni.showModal({
					title: '提示',
					content: '确认修改状态？',
					success: function(res) {
						if (res.confirm) {
							let isclose = item.isclose == 1 ? 0: 1
							_this.$store.dispatch('shops/couponisclose',{'couponid':item.couponid,'isclose':isclose}).then((res) => {
								if (res.code == 0) {
									item.isclose = isclose
									_this.$refs.uToast.show({
										title: res.message
									})
									
								}
								
							});
							
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			edit_coupon(item){
				uni.navigateTo({
					url:'/pages/cms/coupon/coupon?title=添加优惠券&item='+JSON.stringify(item)
				})
			}
		},
		onPullDownRefresh() {
			this.list= []
			this.get_all_coupon(()=>{
				uni.stopPullDownRefresh();
			})
			
		}
	}
</script>

<style lang="scss">
	.empty_box {
		width: 100%;
		padding-top: 20vh;
	}

	.coupon {
		background-color: #F8F8F8;
		min-height: 100vh;
		padding-top: 1px;
		
		.po {
			z-index: 99;
			width: 100%;
		}

		.tab {
			padding: 10px 10px 0;
			display: flex;
			width: 100%;
			font-size: 14px;
			background-color: #fff;
		}

		.bb {
			padding-bottom: 5px;
			text-align: center;
			width: 50%;
		}

		.xz {
			border-bottom: 2px solid red;
			padding-bottom: 5px;
			width: 50%;
			text-align: center;
		}

		.coupon {
			margin: 15px;
			background-color: #fff;
			border: 1px solid #EEEEEE;
			border-radius: 5px;
			box-shadow: 2px 2px 2px #EEEEEE;
			color: #9FA0A2;
			min-height: 10px;
			position: relative;

			.ysy {
				position: absolute;
				right: 10px;
				top: 0;

				img {
					width: 80px;
					height: 80px;
					z-index: 99;
					margin-right: 100px;
				}
			}
		}

		.cou_t {
			display: flex;
			padding: 20px 10px 10px;
			justify-content: space-between;
			font-size: 12px;
			width: 100%;
			box-sizing: border-box;
		}

		.cou_t_l {
			flex-shrink: 0;
		}

		.cou_t_r {
			
			box-sizing: border-box;
			padding-left: 10px;
			flex-grow: 1;
		}

		.cou_t_rr {
			width: 70px;
			background-color: #EB113E;
			color: #fff;
			height: 25px;
			line-height: 25px;
			font-size: 12px;
			text-align: center;
			border-radius: 20px;
		}
		.cou_t_rr2{
			background-color: #00aaff;
		}
		.no-btn {
			width: 70px;
			height: 25px;
			line-height: 25px;
			font-size: 12px;
			text-align: center;
			margin: 15px 0 0 10px;
		}

		.btn_grey {
			width: 70px;
			background-color: #9FA0A2;
			color: #fff;
			height: 25px;
			line-height: 25px;
			font-size: 12px;
			text-align: center;
			margin: 15px 0 0 10px;
			border-radius: 20px;
		}

		.cou_t_l_01 {
			color: #FF4444;
			font-size: 26px;
			padding-top: 8px;
		}

		.cou_t_l_01 span {
			font-size: 12px;
		}

		.cou_sss {
			font-size: 26px;
			padding-top: 8px;
		}

		.cou_sss span {
			font-size: 12px;
		}

		.cou_t_r_01 {
			font-size: 18px;
			color: #323233;
			padding: 3px 0 5px;
		}

		.cou_d {
			background-color: #FAFAFA;
			padding: 6px 15px;
			border-top: 1px dashed #EBEDF0;
			font-size: 12px;
		}

		.H50 {
			height: 50px;
		}

		.coupon_btn {
			padding: 0 10px 10px;
			position: fixed;
			bottom: 0;
			z-index: 999;
			background-color: #F8F8F8;
			width: 100%;
			box-sizing: border-box;

			.btn {
				text-align: center;
				font-size: 16px;
				height: 45px;
				line-height: 45px;
				background-color: #e74c3c;
				color: #FFFFFF;
				border-radius: 5px;
			}
		}

	}
</style>
