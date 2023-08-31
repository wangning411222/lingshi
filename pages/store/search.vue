<template>
	<view>
		<view class="padding-20">
			<u-search placeholder="搜索本店零食" v-model="keyword" 
			:clearabled="true" 
			@custom="tosearch" 
			@blur="keyword == ''?(search_show=false):(search_show=true)"
			@focus="search_show=true" 
			@clear="search_show=false"></u-search>
		</view>

		<view>
			<view class="thumb-box" v-for="(item1, index1) in foods" :key="index1">
				<image class="item-menu-image" :src="item1.goods_pic" mode=""></image>
				<view class="item-menu-name padding-left-20">
					<view>
						<text class="font34 font-bold">{{item1.goods_name}}</text>
					</view>
					<view class="padding-top-10">
						<text v-if="item1.goods_desc != ''" class="font24 gray3 margin-right-20">{{item1.goods_desc}}</text>
						<text class="font24 gray3">月售{{item1.sales}}份</text>
					</view>
					<view class="d-row padding-top-10">
						<view class="color-red flex-1 font34 font-bold">¥ {{item1.price}}</view>
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
		<u-toast ref="uToast" />
	</view>
</template>

<script>

	export default {
		data() {
			return {
				keyword:'',
				foods: [],
				cart:[],
				
			}
		},
		computed: {
			goTitle(){
				if(!this.disabledPay) return "去结算"
				return "¥"+this.form.start_delivery_rmbs+"起送"
			},
			goodCartNum() {	//计算单个商品添加到购物车的数量
				return (id) => this.cart.reduce((acc, cur) => {
					if(cur.goods_id === id) {
						return acc += cur.number
					}
					return acc
				}, 0)
			}
		},
		onLoad(option) {
			this.cart = uni.getStorageSync('cart') || []
		},
		methods: {
			tosearch() {
				this.$store.dispatch('shops/companySearch',{'keyword':this.keyword,'type':0}).then((res) => {
					if(res.code == 0) {
						this.foods = res.message
					}
				})
			},
			// 加购物车
			addShopClick(good,num){
				const stock = Number(good.stock)
				const index = this.cart.findIndex(item => {
					return item.goods_id === good.goods_id
				})
				if(index > -1) {
					if(Number(this.cart[index]['number']) >= stock) {
						this.$refs.uToast.show({
							title: '库存不足'
						})
						return false
					}
					this.cart[index].number += num
				} else {
					this.cart.push({
						goods_id: good.goods_id,
						goods_name: good.goods_name,
						goods_pic: good.goods_pic,
						price: good.price,
						number: num,
						goods_desc: good.goods_desc
					})
				}
				
				uni.setStorageSync('cart', JSON.parse(JSON.stringify(this.cart)))
			},
			// 移出
			reducShopClick(good){
				const index = this.cart.findIndex(item => item.goods_id === good.goods_id)
				this.cart[index].number -= 1
				if(this.cart[index].number <= 0) {
					this.cart.splice(index, 1)
				}
				uni.setStorageSync('cart', JSON.parse(JSON.stringify(this.cart)))
			},
		}
	}
</script>

<style>
.thumb-box {
	padding: 15rpx;
	
	width: 100%;
	display: flex;
	
	margin-top: 20rpx;
}
.item-menu-image {
	width: 120rpx;
	height: 120rpx;
}

.item-menu-name {
	flex: 1;
	font-weight: normal;
	font-size: 24rpx;
	color: $u-main-color;
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
