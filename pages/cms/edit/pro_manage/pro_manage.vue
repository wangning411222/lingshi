<template>
	<view class="manage">
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="text"
			active-color="#F65256"></uni-segmented-control>
		<view class="">
			<!-- <view v-show="current === 0"></view> -->
			<view>
				<view class="one">
					<view v-if="list.length > 0">
						<block v-for="(item,index) of list" :key="index">
							<view class="d-row card" v-if="item.state!=current">
								<view class="padding-20" style="width: 240rpx; height: 240rpx;">
									<u-image width="100%" height="100%" :src="item.goods_pic" border-radius="10">
									</u-image>
								</view>
								<view class="desc">
									<view class="title font30">
										<view class='title_l'>
											{{item.goods_name}}
											<u-tag :text="item.cate_title" mode="dark" type="success" size="mini"/>
										</view>
									</view>
									<view class="price padding-top-10">¥ {{item.price}}</view>
									<view class="d-row padding-top-10">
										<view class="margin-right-20">规格：{{item.goods_desc}}</view>
										<view class="margin-right-20">库存：{{item.stock}}</view>
										<view class="xiaol">销量：{{item.sales}}</view>
									</view>
									<view class="btn padding-top-20">
										<view class="btn_01" @click="jump_edit(item.goods_id)">编辑</view>
										<view class="btn_01" @click="pull(item)" v-if="item.ischeck==1">下架
										</view>
										<view class="btn_01" @click="push(item)" v-if="item.ischeck==0">上架
										</view>
										<view class="btn_01" @click="del(item.goods_id, )">删除</view>
									</view>
								</view>
							</view>
						</block>
					</view>
					<view v-else class="empty_box">
						<u-empty text="暂无商品" mode="list"></u-empty>
					</view>
					<view class="tjsp">
						<navigator url="/pages/cms/edit/product/product">
							<view class="flex flex-direction">
								<button class="cu-btn bg-red margin-tb-sm lg">添加商品</button>
							</view>
						</navigator>
						<!-- <view class="tjsp_btn">添加商品</view> -->
					</view>
				</view>
			</view>

		</view>
		<view v-if="maxpage > 1">
			<u-loadmore :status="status" />
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import uniSegmentedControl from "@/components/uni/uni-segmented-control/uni-segmented-control.vue"
	export default {
		components: {
			uniSegmentedControl
		},
		data() {
			return {

				list: [],
				status: 'loadmore',
				page: 1,
				maxpage: 1,

				items: ['上架商品', '下架商品'],
				current: 0,

			}
		},
		onLoad() {
			this.get_pro({
				ischeck: 1,
				page: this.page
			})
		},
		onReachBottom(){
			let _this = this;
			this.status = 'loading';
		
			if(this.maxpage > 1 && _this.page <= _this.maxpage) {
				this.get_pro({
					ischeck: this.current == 0?1:0,
					page: this.page
				},function(){
					_this.status = 'loadmore';
				});
			}else {
				_this.status = 'nomore';
			}
			
		},
		methods: {
			get_pro(data, callback = () => {}) {
				this.$store.dispatch('shops/goodsmylist', data).then((res) => {
					if (res.code == 0) {
						this.list = this.list.concat(res.message.goods_list)

						this.maxpage = res.message.maxpage
						if (res.message.maxpage > this.page) {
							this.page++
						}
						callback()
					}
				})
			},

			pull(item) {
				const _this = this
				uni.showModal({
					title: '确定下架？',
					success(res) {
						if (res.confirm == true) {
							_this.$store.dispatch('shops/goodsischeck', {'goods_id':item.goods_id,'ischeck':0}).then((res) => {
								if (res.code == 0) {
									item['ischeck'] = 0
									_this.$refs.uToast.show({
										title: res.message,
										duration: 1000
									})
								}
							})
						}
					}
				})
			},
			del(id, index) {
				const _this = this
				uni.showModal({
					title: '确定删除？',
					success(res) {
						if (res.confirm == true) {
							_this.$store.dispatch('shops/goodsdelete', {
								'goods_id': id
							}).then((res) => {
								if (res.code == 0) {
									_this.list.splice(index, 1)
									_this.$refs.uToast.show({
										title: '删除成功',
										duration: 1000
									})
								}
							})
						}
					}
				})
			},
			push(item) {
				const _this = this
				uni.showModal({
					title: '确定上架？',
					success(res) {
						if (res.confirm == true) {
							_this.$store.dispatch('shops/goodsischeck', {'goods_id':item.goods_id,'ischeck':1}).then((res) => {
								if (res.code == 0) {
									item['ischeck'] = 1
									_this.$refs.uToast.show({
										title: res.message,
										duration: 1000
									})
								}
							})
						}
					}
				})
			},
			jump_edit(id) {
				uni.navigateTo({
					url: '/pages/cms/edit/product/product?goods_id=' + id
				})
			},
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
					this.list = []
					this.status= 'loadmore'
					this.page= 1
					this.maxpage= 1
					
					this.get_pro({
						ischeck: index == 0?1:0,
						page: this.page
					})
				}
			}
		},
		onPullDownRefresh() {
			this.list = []
			this.get_pro({
				ischeck: this.current == 0 ? 1 : 0,
				page: this.page
			}, () => {
				uni.stopPullDownRefresh();
			})
		}
	}
</script>

<style lang="less">
	.empty_box {
		width: 100%;
		padding-top: 20vh;
		// position: absolute;
		// left: 0;
		// top: 35%;
	}
	.manage {
		font-size: 14px;
		padding-bottom: 120rpx;
		.one {
			.card {
				display: flex;
				flex-direction: row;
				border-bottom: 1px solid #F2F2F2;
				justify-content: space-between;
				height: 240rpx;

				margin: 0 0 10px;
				background: #fff;

				.pic {
					display: flex;
					flex-direction: column;
					justify-content: center;
					width: 25%;
					height: 100%;
					vertical-align: middle;
				}

				.pic img {
					width: 100%;
					height: 80%;
					border-radius: 10rpx;
				}

				.desc {
					color: #8B8B8B;
					width: 70%;
					padding: 20rpx 20rpx 20rpx 0;
					text-align: left;
					font-size: 12px;

					.title {
						display: flex;
						flex-wrap: wrap;
					}

					.title_l {
						font-weight: bold;
						color: #333;
						overflow: hidden;

					}

					.price {
						color: red;
						font-size: 16px;
						font-weight: 900;
					}

					.kc {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;

						.xiaol {
							color: #8B8B8B;
						}
					}

					.btn {
						display: flex;
						justify-content: flex-end;

						.btn_01 {
							border: 1px solid #8B8B8B;
							border-radius: 3px;
							text-align: center;
							margin-left: 10px;
							padding: 1px 8px;
						}
					}
				}
			}

			.tjsp {
				padding: 0 10px 10px;
				position: fixed;
				bottom: 0;
				left: 0;
				width: 100%;
				box-sizing: border-box;
				z-index: 99;
				background-color: #fff;

				.tjsp_btn {
					background-color: #E5E5E5;
					padding: 10px;
					text-align: center;
					border-radius: 20px;
					background-color: #DF421D;
					color: #fff;
					width: 100%;
				}
			}

			.bg-red {
				background-color: #ff6634;
				color: #ffffff;
			}

		}
	}
</style>
