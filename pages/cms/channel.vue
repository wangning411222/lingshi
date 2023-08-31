<template>
	<view class="u-wrap">
		<view class="padding-bottom-10 padding-top-10 padding-right-20 text-right">
			<navigator url="/pages/cms/channel_order" hover-class="navigator-hover" style="display: inline;">
			<view class="font22 padding-10" style="border: 1rpx solid #007AFF;border-radius: 10rpx; color: #007AFF; display: inline-block;">
				<u-icon name="list-dot" size="22"></u-icon> 进货记录
			</view>
			</navigator>
		</view>
		<view class="u-menu-wrap" v-if="tabcurrent == 0" >
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in cate_list" :key="index" class="u-tab-item" 
				:class="[current == index ? 'u-tab-item-active' : '']"
				 :data-current="index" @tap.stop="swichMenu(index)">
					<text class="u-line-1">{{item.title}}</text>
				</view>
			</scroll-view>
			<block v-for="(item,index) in goods_list" :key="index">
				<scroll-view scroll-y class="right-box" v-show="current == index">
					<view class="page-view">
						<view class="class-item">
							<view class="item-title">
								<text>{{item.name}}</text>
							</view>
							<view class="item-container">
								<view class="thumb-box" v-for="(item1, index1) in item.list" :key="index1">
									<image class="item-menu-image" :src="item1.goods_pic" mode="aspectFill"></image>
									<view class="item-menu-name padding-left-20">
										<view @tap="handelGoodsDetail(item1)">
											<view>
												<text class="font32 font-bold">{{item1.goods_name}}</text>
											</view>
											<view class="padding-top-10">
												<text v-if="item1.goods_desc != ''" class="font24 gray3 margin-right-20">{{item1.goods_desc}}</text>
												<text class="font24 gray3">月售{{item1.sales}}份</text>
											</view>
										</view>
										<view class="d-row padding-top-20">
											<view class="color-orange flex-1 font38 font-bold"><text class="font28">¥</text>{{item1.price}}</view>
											<view class="d-row">
												<view v-show="goodCartNum(item1.goods_id)" @tap="reducShopClick(item1,1)" class="reduc">
													<u-icon name="minus-circle" color="#cccccc" size="60"></u-icon>
												</view>
												<view v-show="goodCartNum(item1.goods_id)" class="number">
													{{ goodCartNum(item1.goods_id) }}</view>
												<view @tap="addShopClick(item1,1)" class="add">
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
		<view class="shop-car">
			<view style="margin:0 auto;" class="width100 d-row d-jc-between d-ai-centen">
				<view class="d-row d-jc-start d-ai-centen" style="height: 105rpx;padding-left: 10rpx;"
					@tap="showShopCarModelClick">
					<view :animation="animationData" style="height: 105rpx;text-align: center; position: relative;">

						<text v-show="getCartGoodsNumber > 0" class="shop-num">{{getCartGoodsNumber}}</text>
						<image class="shop-car-img" src="/static/cars.png"></image>
					</view>
					<view class="d-clo d-jc-around" style="height: 105rpx;margin-left: 10rpx;">
						<view class="gray4 font36 font-bold" :class="{colorWhite:getCartGoodsPrice > 0}">
							{{ getCartGoodsPrice>0?'￥'+ Math.round(getCartGoodsPrice*100)/100 :shopCarTip}}
						</view>
						<view class="gray2 font22">配送费 <text class="margin-10">¥{{form.delivery_rmbs}}</text> | 满￥{{form.enough_free_dyrmbs}}免配送费</view>
					</view>
				</view>
				<view class="go gray4" style="height: 105rpx; width: 240rpx;">

					<view v-show="!disabledPay" @tap="goPay" class="font28 text-center" style="height: 105rpx;line-height: 105rpx;  background: #ef5f1b; color: #FFFFFF;">
						去结算
					</view>
					<view v-show="disabledPay" class="font28 text-center" style="height: 105rpx;line-height: 105rpx;  background: #303030; color: #b3b3b3;">
						{{ getCartGoodsPrice > 0 ? (disabledPay ? `差${spread}元起送` : goTitle) : goTitle }}
					</view>
				</view>

			</view>
		</view>		
		<u-popup v-model="goodsDetailShow" mode="center" border-radius="14" width="80%" height="65%">
			<view>
				<image :src="goodsDetail.goods_pic" mode="aspectFill" style="height: 580rpx; width: 100%;"></image>
			</view>
			<view class="padding-left-30 padding-top-20 padding-bottom-10"><text class="font-bold font32">{{goodsDetail.goods_name}}</text></view>
			<view class="padding-left-30"><text class="gray3 font22">月销{{goodsDetail.sales}}份</text></view>
			<view class="d-row padding-top-10 padding-left-30 padding-right-30">
				<view class="color-orange flex-1 font34 font-bold">¥ {{goodsDetail.price}}</view>
				<view class="d-row">
					<view v-show="goodCartNum(goodsDetail.goods_id)" @tap="reducShopClick(goodsDetail,1)" class="reduc">
						<u-icon name="minus-circle" color="#cccccc" size="60"></u-icon>
					</view>
					<view v-show="goodCartNum(goodsDetail.goods_id)" class="number">
						{{ goodCartNum(goodsDetail.goods_id) }}</view>
					<view @tap="addShopClick(goodsDetail,1)" class="add">
						<u-icon name="plus-circle-fill" color="#ff8000" size="60"></u-icon>
					</view>
				</view>
			</view>
		</u-popup>
		
		<u-toast ref="uToast" />
		
		<u-mask :show="loadingmask">
			<view class="warp text-center d-row d-ai-centen" style="height: 100%;">
				<view class="flex-1"><u-loading size="56" color="orange"></u-loading></view>
			</view>
		</u-mask>
	</view>
</template>
<script>
	import {
		mapGetters
	} from 'vuex'
	import coupon from '@/components/coolc-coupon/coolc-coupon';
	export default {
		components: {
			coupon
		},
		data() {
			return {
				loadingmask: false,

				tabcurrent:0,
				form: {},
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度

				cate_list:[],
				goods_list:[],
				
				shopCarTip: '￥0.00',
				cart: [],
				animationData: {},
				
				goodsDetailShow: false,
				goodsDetail:{}
			}
		},
		onShow: function(){
			this.cart = uni.getStorageSync('purchase') || []
		},
		onUnload(){
			uni.setStorageSync('purchase',[]);
		},
		onLoad() {
			var animation = uni.createAnimation({
				duration: 100,
			    timingFunction: 'ease',
			})
			this.animation = animation
			
			this.form = {
				'start_delivery_rmbs':this.config.start_delivery_rmbs,
				'delivery_rmbs':this.config.delivery_rmbs,
				'enough_free_dyrmbs':this.config.enough_free_dyrmbs,
				'companyid':1
			}
			this.getCompanyRead({
				// 'companyid': 1,
				// 'page':1
			})
			
		},

		computed: {
			...mapGetters('config',[
				'config'
			]),
			goTitle() {
				if (!this.disabledPay) return "去结算"
				return "¥" + this.form.start_delivery_rmbs + "起送"
			},
			goodCartNum() { //计算单个商品添加到购物车的数量
				return (id) => this.cart.reduce((acc, cur) => {
					if (cur.goods_id === id) {
						return acc += cur.number
					}
					return acc
				}, 0)
			},
			getCartGoodsNumber() { //计算购物车总数
				return this.cart.reduce((acc, cur) => acc + cur.number, 0)
			},
			getCartGoodsPrice() { //计算购物车总价
				return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0)
			},
			disabledPay() { //是否达到起送价
				return ((this.getCartGoodsPrice < this.form.start_delivery_rmbs) ? true : false)
			},
			spread() { //差多少元起送
				return parseFloat((this.form.start_delivery_rmbs - this.getCartGoodsPrice).toFixed(2))
			}
		},
		methods: {
			getCompanyRead(data){
				this.loadingmask = true
				this.$store.dispatch('shops/companyplatform_goodslist',data).then((res) => {
					if(res.code == 0) {
						res.message.cate_list.map((item)=>{
							this.goods_list.push({
								'name':item.title,
								'list':[]
							})
						})
						this.cate_list = res.message.cate_list

						this.goods_list[this.current]['list'] = res.message.goods_list

					}
					this.loadingmask = false
				})
			},

			
			handelTab(index){
				this.tabcurrent = index
				console.log(this.tabcurrent)
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if(index == this.current) return ;
				this.current = index;
				// 如果为0，意味着尚未初始化
				if(this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
				
				console.log(index)
				if(this.goods_list[index]['list'].length == 0) {
					this.getCompanyRead({
						'cateid': this.cate_list[index]['cateid']
					})
				}
				
				
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({size: true},res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if(!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return ;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			},

			// 动画
			animation_fun(){
				this.animation.scale(0.8,0.8).step()
				this.animation.scale(1.2,1.2).step()
				this.animation.scale(1,1).step()
				this.animationData = this.animation.export()
				setTimeout(()=>{
					this.animationData = {}
				},150)
			},
			// 加购物车
			addShopClick(good, num) {
				const stock = Number(good.stock)
				const index = this.cart.findIndex(item => {
					return item.goods_id === good.goods_id
				})
				
				if (index > -1) {
					if(Number(this.cart[index]['number']) >= stock) {
						this.$refs.uToast.show({
							title: '库存不足'
						})
						return false
					}
					this.animation_fun()
					this.cart[index].number += num
				} else {
					this.animation_fun()
					this.cart.push({
						goods_id: good.goods_id,
						goods_name: good.goods_name,
						goods_pic: good.goods_pic,
						price: good.price,
						number: num,
						goods_desc: good.goods_desc
					})
				}

				
			},
			// 移出
			reducShopClick(good) {
				this.animation_fun()
				const index = this.cart.findIndex(item => item.goods_id === good.goods_id)
				this.cart[index].number -= 1
				if (this.cart[index].number <= 0) {
					this.cart.splice(index, 1)
				}
				if (this.getCartGoodsNumber <= 0) {}
			},
			// 去支付
			goPay(){
				uni.showLoading({title: '加载中'})
				uni.setStorageSync('purchase', JSON.parse(JSON.stringify(this.cart)))
				uni.navigateTo({
					url: './channel_pay?delivery_rmbs='+this.form.delivery_rmbs+'&enough_free_dyrmbs='+this.form.enough_free_dyrmbs+'&companyid='+this.form.companyid,
					animationType: 'pop-in',
					animationDuration: 2000
				})
				uni.hideLoading()
			},

			// 
			handelGoodsDetail(item){
				console.log(item)
				this.goodsDetail= item
				this.goodsDetailShow= true
			}
		}
	}
</script>
<style>
	.u-notice-bar {
		padding: 9px 0 !important;
	}
</style>
<style lang="scss" scoped>
	.coupon1 {border-radius: 6rpx; border: 1rpx solid #ff8b87; border-right-style: dashed; color:#ff756f; background-color: rgba(255, 159, 156,0.3);}
	.coupon2 {border-radius: 6rpx; border: 1rpx solid #ff8b87; border-left: unset; color:#ff756f; background-color: rgba(255, 159, 156,0.3);}
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
		background: #FFBF65;
		color: #e84b16;
	}

	.shop-car-img {
		width: 120rpx;
		height: 120rpx;

		position: relative;
		top: -30rpx;
	}

	.colorWhiteBgBlue {
		background-color: #007AFF !important;
		color: #FFFFFF !important;
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
