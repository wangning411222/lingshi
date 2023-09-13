<template>
	<view class="u-wrap">
		<!-- 商家信息 -->
		<view>
			<view class="width100 d-row d-jc-centen padding-20" style="background: #333333">
				<view class="padding-right-20">
					<image class="s-head-img" mode="aspectFill" :src="form.logo"></image>
				</view>
				<view class="flex-1">
					<view class="colorWhite">已售{{ form.sales }}单 | {{ form.total_dishes }}种零食</view>
					<view class="colorWhite" style="max-width: 560rpx">
						<u-notice-bar type="none" :speed="80" color="#ffffff" mode="horizontal" :list="[form.notice]">
						</u-notice-bar>
					</view>
				</view>
			</view>
			<view v-if="coupon_list.length > 0"
				class="d-row d-ai-centen padding-left-10 padding-right-10 padding-top-20" style="flex-wrap: wrap">
				<view class="flex-1 d-row" @tap="couponClick()">
					<view v-for="(item, index) in coupon_list" :key="index" class="d-row margin-right-10">
						<view class="coupon1 font28 font-bold padding-left-10 padding-right-10"
							style="line-height: 40rpx"><text class="font22">￥</text>{{ item.rmbs }}</view>
						<view class="coupon2 font22 padding-left-10 padding-right-10" style="line-height: 40rpx">领取
						</view>
					</view>
				</view>
				<view>
					<u-icon name="arrow-right" color="#a1a1a1" size="28"></u-icon>
				</view>
			</view>
			<view class="d-row padding-left-10 padding-right-20">
				<view class="flex-1 padding-left-30">
					<view>
						<text :class="tabcurrent == 0 ? 'active' : ''" @tap="handelTab(0)"
							class="padding-top-30 padding-bottom-30 margin-right-100 gray3"
							style="display: inline-block">零食</text>
						<text :class="tabcurrent == 2 ? 'active' : ''" @tap="handelTab(2)"
							class="padding-top-30 padding-bottom-30 margin-right-100 gray3"
							style="display: inline-block">评价</text>
						<text :class="tabcurrent == 1 ? 'active' : ''" @tap="handelTab(1)"
							class="padding-top-30 padding-bottom-30 gray3" style="display: inline-block">店铺</text>
					</view>
				</view>
				<view style="align-self: center">
					<view @tap="handelShopSearch" class="gray3" style="
              padding: 8rpx 35rpx;
              border-radius: 50px;
              background-color: #eaeaea;
            ">
						<u-icon name="search"></u-icon>
						<text class="margin-left-10">搜索</text>
					</view>
				</view>
			</view>
			<u-line color="#cccccc" />
		</view>
		<!-- 零食 -->
		<view class="u-menu-wrap" v-if="tabcurrent == 0">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item, index) in cate_list" :key="index" class="u-tab-item"
					:class="[current == index ? 'u-tab-item-active' : '']" :data-current="index"
					@tap.stop="swichMenu(index)">
					<text class="u-line-1">{{ item.title }}</text>
				</view>
			</scroll-view>
			<block v-for="(item, index) in goods_list" :key="index">
				<scroll-view scroll-y class="right-box" v-show="current == index" @scrolltolower='scrollToLower' ref='a'>
					<view class="page-view">
						<view class="class-item">
							<view class="item-title">
								<text>{{ item.name }}</text>
							</view>
							<view class="item-container">
								<view class="thumb-box" v-for="(item1, index1) in item.list" :key="index1">
									<image class="item-menu-image" :src="item1.goods_pic" mode="aspectFill"></image>
									<view class="item-menu-name padding-left-20">
										<view @tap="handelGoodsDetail(item1)">
											<view>
												<text class="font32 font-bold">{{
                          item1.goods_name
                        }}</text>
											</view>
											<view class="padding-top-10">
												<text v-if="item1.goods_desc != ''"
													class="font24 gray3 margin-right-20">{{ item1.goods_desc }}</text>
												<text class="font24 gray3">月售{{ item1.sales }}份</text>
											</view>
										</view>
										<view class="d-row padding-top-20">
											<view class="color-orange flex-1 font38 font-bold"><text
													class="font28">¥</text>{{ item1.price }}</view>
											<view class="d-row">
												<view v-show="goodCartNum(item1.goods_id)"
													@tap="reducShopClick(item1, 1)" class="reduc">
													<u-icon name="minus-circle" color="#cccccc" size="60"></u-icon>
												</view>
												<view v-show="goodCartNum(item1.goods_id)" class="number">
													{{ goodCartNum(item1.goods_id) }}
												</view>
												<view @tap="addShopClick(item1, 1)" class="add">
													<u-icon name="plus-circle-fill" color="#ff8000" size="60"></u-icon>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
		<!-- 商家 -->
		<view v-if="tabcurrent == 1" class="width100">
			<view class="font-bold font30 padding-top-30 padding-left-30 padding-bottom-20">公告</view>
			<view class="padding-left-30 padding-right-30 gray3">{{
        form.notice
      }}</view>
			<view class="d-row width100 padding-top-30 padding-left-30 padding-right-30">
				<view class="font-bold font30 gray2">店铺地址</view>
				<view class="text-right flex-1">{{ form.address }}</view>
			</view>
			<view class="d-row width100 padding-top-30 padding-left-30 padding-right-30">
				<view class="font-bold font30 gray2">配送费</view>
				<view class="text-right flex-1">{{ form.delivery_rmbs }}</view>
			</view>
			<view class="d-row width100 padding-top-30 padding-left-30 padding-right-30">
				<view class="font-bold font30 gray2">起步价</view>
				<view class="text-right flex-1">{{ form.start_delivery_rmbs }}</view>
			</view>
			<view class="d-row width100 padding-top-30 padding-left-30 padding-right-30">
				<view class="font-bold font30 gray2">满多少免配送费</view>
				<view class="text-right flex-1">{{ form.enough_free_dyrmbs }}</view>
			</view>
		</view>
		<!-- 评价 -->
		<view v-if="tabcurrent == 2" class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="menu-scroll-view"
				style="padding-bottom:120rpx;">
				<hx-comment ref="comment" :companyid="companyid"></hx-comment>
			</scroll-view>
		</view>

		<view class="shop-car">
			<view style="margin: 0 auto" class="width100 d-row d-jc-between d-ai-centen">
				<view class="d-row d-jc-start d-ai-centen" style="height: 105rpx; padding-left: 10rpx"
					@tap="showShopCarModelClick">
					<view :animation="animationData" style="height: 105rpx; text-align: center; position: relative">
						<text v-show="getCartGoodsNumber > 0" class="shop-num">{{
              getCartGoodsNumber
            }}</text>
						<image class="shop-car-img" src="/static/cars.png"></image>
					</view>
					<view class="d-clo d-jc-around" style="height: 105rpx; margin-left: 10rpx">
						<view class="gray4 font36 font-bold" :class="{ colorWhite: getCartGoodsPrice > 0 }">
							{{
                getCartGoodsPrice > 0 ? "￥" + Math.round(getCartGoodsPrice*100)/100  : shopCarTip
              }}
						</view>
						<view class="gray2 font22">配送费 <text class="margin-10">¥{{ form.delivery_rmbs }}</text> |
							满￥{{ form.enough_free_dyrmbs }}免配送费</view>
					</view>
				</view>
				<view class="go gray4" style="height: 105rpx; width: 240rpx">
					<view v-if="form.business_status == 1" class="font28 text-center" style="
              height: 105rpx;
              line-height: 105rpx;
              background: #303030;
              color: #b3b3b3;
            ">
						已打烊
					</view>
					<view v-else>
						<view v-show="!disabledPay" @tap="goPay" class="font28 text-center" style="
                height: 105rpx;
                line-height: 105rpx;
                background: #ef5f1b;
                color: #ffffff;
              ">
							去结算
						</view>
						<view v-show="disabledPay" class="font28 text-center" style="
                height: 105rpx;
                line-height: 105rpx;
                background: #303030;
                color: #b3b3b3;
              ">
							{{
                getCartGoodsPrice > 0
                  ? disabledPay
                    ? `差${spread}元起送`
                    : goTitle
                  : goTitle
              }}
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-popup v-model="goodsDetailShow" mode="center" border-radius="14" width="80%" height="65%">
			<view>
				<image :src="goodsDetail.goods_pic" mode="aspectFill" style="height: 580rpx; width: 100%"></image>
			</view>
			<view class="padding-left-30 padding-top-20 padding-bottom-10"><text class="font-bold font32">{{
          goodsDetail.goods_name
        }}</text></view>
			<view class="padding-left-30"><text class="gray3 font22">月销{{ goodsDetail.sales }}份</text></view>
			<view class="d-row padding-top-10 padding-left-30 padding-right-30">
				<view class="color-orange flex-1 font34 font-bold">¥ {{ goodsDetail.price }}</view>
				<view class="d-row">
					<view v-show="goodCartNum(goodsDetail.goods_id)" @tap="reducShopClick(goodsDetail, 1)"
						class="reduc">
						<u-icon name="minus-circle" color="#cccccc" size="60"></u-icon>
					</view>
					<view v-show="goodCartNum(goodsDetail.goods_id)" class="number">
						{{ goodCartNum(goodsDetail.goods_id) }}
					</view>
					<view @tap="addShopClick(goodsDetail, 1)" class="add">
						<u-icon name="plus-circle-fill" color="#ff8000" size="60"></u-icon>
					</view>
				</view>
			</view>
		</u-popup>

		<u-toast ref="uToast" />
		<u-popup v-model="couponShow" mode="bottom">
			<view style="height: 60vh; position: relative">
				<view class="padding-left-20 padding-right-20 padding-bottom-50">
					<coupon v-for="(item, index) in coupon_list" :key="index" types="carts" v-bind:item="item"
						@receive="receive" theme="#ff6c00" color="#ffffff" solid="#ff6c00"></coupon>
				</view>
			</view>
		</u-popup>
		<u-mask :show="loadingmask">
			<view class="warp text-center d-row d-ai-centen" style="height: 100%">
				<view class="flex-1"><u-loading size="56" color="orange"></u-loading></view>
			</view>
		</u-mask>
	</view>
</template>
<script>
	import coupon from "@/components/coolc-coupon/coolc-coupon";
	import hxComment from "@/components/hx-comment/hx-comment.vue";
	export default {
		components: {
			coupon,
			hxComment,
		},
		data() {
			return {
				loadingmask: false,
				couponShow: false,
				tabcurrent: 0,
				form: {},
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度

				coupon_list: [],
				cate_list: [],
				goods_list: [],

				shopCarTip: "￥0.00",
				cart: [],
				animationData: {},
				goodsDetailShow: false,
				goodsDetail: {},
				companyid: ""
			};
		},
		onShow: function() {
			this.cart = uni.getStorageSync("cart") || [];
		},
		onShareAppMessage(res){
    return res
  },
		onUnload() {
			uni.setStorageSync("cart", []);
		},
		onLoad(option) {
			// 用户评价后跳转过来.展示评价列表
			if (option.type == "comment") {
				this.tabcurrent = 2;
			}
			var animation = uni.createAnimation({
				duration: 100,
				timingFunction: "ease",
			});
			this.animation = animation;

			if (option.companyid) {
				this.companyid = option.companyid;
				this.getCompanyRead({
					companyid: option.companyid,
					page: 1,
				});
			} else {
				this.form = JSON.parse(option.item);
				this.companyid = this.form.companyid;
				uni.setNavigationBarTitle({
					title: this.form.name,
				});

				this.getCompanyRead({
					companyid: this.form.companyid,
					page: 1,
				});
			}
		},

		computed: { 
			goTitle() {
				if (!this.disabledPay) return "去结算";
				return "¥" + this.form.start_delivery_rmbs + "起送";
			},
			goodCartNum() {
				//计算单个商品添加到购物车的数量
				return (id) =>
					this.cart.reduce((acc, cur) => {
						if (cur.goods_id === id) {
							return (acc += cur.number);
						}
						return acc;
					}, 0);
			},
			getCartGoodsNumber() {
				//计算购物车总数
				return this.cart.reduce((acc, cur) => acc + cur.number, 0);
			},
			getCartGoodsPrice() {
				//计算购物车总价
				return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0);
			},
			disabledPay() {
				//是否达到起送价
				return this.getCartGoodsPrice < this.form.start_delivery_rmbs ?
					true :
					false;
			},
			spread() {
				//差多少元起送
				return parseFloat(
					(this.form.start_delivery_rmbs - this.getCartGoodsPrice).toFixed(2)
				);
			},
		},
		methods: {
			// 评论到底了
			commentTobottom() {
				this.$refs.comment.getPostList()
			},
			getCompanyRead(data) {
				this.loadingmask = true;
				this.$store.dispatch("shops/companyRead", data).then((res) => {
					if (res.code == 0) {
						res.message.cate_list.map((item) => {
							this.goods_list.push({
								name: item.title,
								list: [],
							});
						});
						this.cate_list = res.message.cate_list;
						this.form = res.message.company;
						if (this.cate_list.length > 0) {
							this.goods_list[this.current]["list"] = res.message.goods_list;
						}

						this.coupon_list = res.message.coupon_list;
						uni.setNavigationBarTitle({
							title: this.form.name,
						});
					}
					this.loadingmask = false;
				});
			},
			couponClick() {
				this.couponShow = true;
			},
			receive(data) {
				let _this = this;

				this.$store
					.dispatch("shops/couponGet", {
						couponid: data.id
					})
					.then((res) => {
						if (res.code == 0) {
							_this.$refs.uToast.show({
								title: res.message,
								duration: 1000,
							});
						} else {
							_this.$refs.uToast.show({
								title: res.message,
								duration: 1000,
							});
						}
					});
			},
			handelTab(index) {
				this.tabcurrent = index;
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
        console.log(this.$refs.a,'22222222222222222222')
				if (index == this.current) return;
				this.current = index;
				// 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect("menu-scroll-view", "menuHeight");
					await this.getElRect("u-tab-item", "menuItemHeight");
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop =
					index * this.menuItemHeight +
					this.menuItemHeight / 2 -
					this.menuHeight / 2;
				if (this.goods_list[index]["list"].length == 0) {
					this.getCompanyRead({
						companyid: this.form.companyid,
						cateid: this.cate_list[index]["cateid"],
						page: 1,
					});
				}
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query
						.select("." + elClass)
						.fields({
							size: true
						}, (res) => {
							// 如果节点尚未生成，res值为null，循环调用执行
							if (!res) {
								setTimeout(() => {
									this.getElRect(elClass);
								}, 10);
								return;
							}
							this[dataVal] = res.height;
						})
						.exec();
				});
			},

			// 动画
			animation_fun() {
				this.animation.scale(0.8, 0.8).step();
				this.animation.scale(1.2, 1.2).step();
				this.animation.scale(1, 1).step();
				this.animationData = this.animation.export();
				setTimeout(() => {
					this.animationData = {};
				}, 150);
			},
			// 加购物车
			addShopClick(good, num) {
				const stock = Number(good.stock);
				const index = this.cart.findIndex((item) => {
					return item.goods_id === good.goods_id;
				});

				if (index > -1) {
					if (Number(this.cart[index]["number"]) >= stock) {
						this.$refs.uToast.show({
							title: "库存不足",
						});
						return false;
					}
					this.animation_fun();
					this.cart[index].number += num;
				} else {
					this.animation_fun();
					this.cart.push({
						goods_id: good.goods_id,
						goods_name: good.goods_name,
						goods_pic: good.goods_pic,
						price: good.price,
						number: num,
						goods_desc: good.goods_desc,
					});
				}
			},
			// 移出
			reducShopClick(good) {
				this.animation_fun();
				const index = this.cart.findIndex(
					(item) => item.goods_id === good.goods_id
				);
				this.cart[index].number -= 1;
				if (this.cart[index].number <= 0) {
					this.cart.splice(index, 1);
				}
				if (this.getCartGoodsNumber <= 0) {}
			},
			// 去支付
			goPay() {
				uni.showLoading({
					title: "加载中"
				});
				uni.setStorageSync("cart", JSON.parse(JSON.stringify(this.cart)));
				uni.navigateTo({
					url: "./pay?name=" +
						this.form.name +
						"&delivery_rmbs=" +
						this.form.delivery_rmbs +
						"&enough_free_dyrmbs=" +
						this.form.enough_free_dyrmbs +
						"&companyid=" +
						this.form.companyid,
					animationType: "pop-in",
					animationDuration: 2000,
				});
				uni.hideLoading();
			},
			// 搜索店铺
			handelShopSearch() {
				uni.setStorageSync("cart", JSON.parse(JSON.stringify(this.cart)));
				uni.navigateTo({
					url: "./search?shopid=12" + this.form.name,
				});
			},
			//
			handelGoodsDetail(item) {
				this.goodsDetail = item;
				this.goodsDetailShow = true;
			},
		},
	};
</script>
<style>
	.u-notice-bar {
		padding: 9px 0 !important;
	}
</style>
<style lang="scss" scoped>
	.coupon1 {
		border-radius: 6rpx;
		border: 1rpx solid #ff8b87;
		border-right-style: dashed;
		color: #ff756f;
		background-color: rgba(255, 159, 156, 0.3);
	}

	.coupon2 {
		border-radius: 6rpx;
		border: 1rpx solid #ff8b87;
		border-left: unset;
		color: #ff756f;
		background-color: rgba(255, 159, 156, 0.3);
	}

	.active {
		font-weight: bold;
		color: #767676;
		border-bottom: 3rpx solid #ff8000;
	}

	.s-head-img {
		width: 120rpx;
		height: 120rpx;
	}

	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}

	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}

	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-theme-color;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.u-tab-view {
		height: 100%;
	}

	.right-box {
		background-color: rgb(250, 250, 250);
	}

	.page-view {
		padding: 16rpx;
	}

	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}

	.class-item:last-child {
		min-height: 100vh;
	}

	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}

	.item-menu-name {
		flex: 1;
		font-weight: normal;
		font-size: 24rpx;
		color: $u-main-color;
	}

	.item-container {
		display: flex;
		flex-wrap: wrap;
	}

	.thumb-box {
		padding: 15rpx;

		width: 100%;
		display: flex;

		// margin-top: 10rpx;
	}

	.item-menu-image {
		width: 150rpx;
		height: 150rpx;
	}

	.shop-car {
		background-color: #333333;
		width: 100%;
		height: 105rpx;
		margin: 0 auto;
		position: fixed;
		bottom: 0;
		left: 0%;
		z-index: 1000;
	}

	.shop-num {
		position: absolute;
		top: -22rpx;
		right: -10rpx;
		z-index: 3;
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		border-radius: 50rpx;
		background: #ffbf65;
		color: #e84b16;
	}

	.shop-car-img {
		width: 120rpx;
		height: 120rpx;

		position: relative;
		top: -30rpx;
	}

	.colorWhiteBgBlue {
		background-color: #007aff !important;
		color: #ffffff !important;
	}

	.reduc {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		text-align: center;
		line-height: 60rpx;
	}

	.number {
		width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
	}

	.add {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		text-align: center;
		line-height: 60rpx;
	}
</style>