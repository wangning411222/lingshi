<template>
	<view class="index">
		<view>
			<view class="more">
				<view class='mo'>
					<view class='mo_01'>数据交易</view>
					
				</view>
			</view>
			<view class="shuju">
				<view class="shuju_01">
					<view>今日订单/金额</view>
					<view class="shuju_01_s" v-if="order_data">{{order_data.today_total_count}} / ¥{{order_data.today_incomermbs}}</view>
				</view>
				<view class="shuju_01 no">
					<view>昨日订单/金额</view>
					<view class="shuju_01_s" v-if="order_data">{{order_data.yesterday_total_count}} /
						{{order_data.yesterday_incomermbs}}</view> 
				</view>
				<view class="shuju_01">
					<view>总订单数</view>
					<view class="shuju_01_s" v-if="order_data">{{order_data.total_count}}</view>
				</view>
				<view class="shuju_01 no">
					<view>总销售金额</view>
					<view class="shuju_01_s" v-if="order_data">¥ {{order_data.total_incomermbs}}</view>
				</view>
			</view>
			<view class="BH"></view>
			<view class="six">
				<!-- <view class="jiu_01">
					<navigator url="/pages/cms/edit/product/product">
						<view><img src="@/imgs/6.png" /></view>
						<view>添加商品</view>
					</navigator>
				</view> -->
				<view class="jiu_01">
					<navigator url="/pages/cms/edit/pro_manage/pro_manage">
						<view><img src="@/imgs/6.png" /></view>
						<view>商品管理</view>
					</navigator>
				</view>
				<view class="jiu_01" @click="jump_order">
					<view><img src="@/imgs/8.png" /></view>
					<view>订单管理</view>

				</view>
				<view class="jiu_01">
					<navigator url="/pages/cms/edit/shop/shop?title=门店编辑">
						<view><img src="@/imgs/5.png" /></view>
						<view>门店编辑</view>
					</navigator>
				</view>
				<!-- <view class="jiu_01">
					<navigator url="/pages/cms/user/tongji/tongji"> 
						<view><img src="@/imgs/date.png" /></view>
						<view>经营数据</view>
					</navigator>
				</view> -->

				<view class="jiu_01">
					<navigator url="/pages/cms/couponlist/couponlist">
						<view><img src="@/imgs/yhq.png" /></view>
						<view>优惠券</view>
					</navigator>
				</view>
				 <view class="jiu_01 ">
					<navigator url="/pages/cms/edit/product/addgroup/addgroup">
						<view><img src="@/imgs/people.png" /></view>
						<view>分类管理</view>
					</navigator>
				</view> 
				<view class="jiu_01">
					<navigator url="/pages/cms/merchantWallet"> 
						<view><img src="@/imgs/tixian.png" /></view>
						<view>提现</view>
					</navigator>
				</view>
				<view class="jiu_01">
					<navigator url="/pages/cms/channel"> 
						<view><img src="@/imgs/jinhuo.png" /></view>
						<view>进货</view>
					</navigator>
				</view>
				
			</view>
			<view class="BH"></view>

		</view>

	</view>
</template>

<script>
	import uniBadge from "@/components/uni/uni-badge/uni-badge.vue"
	import uniIcon from "@/components/uni/uni-icon/uni-icon.vue"
	export default {
		data() {
			return {

				shop: {},
				order_data: {
					today_total_count:'0',
					today_incomermbs:'0',
					
					yesterday_total_count:'0',
					yesterday_incomermbs:'0',
					
					total_count:'0',
					total_incomermbs:'0'
					
					
				},
			}
		},
		components: {
			uniIcon,
			uniBadge
		},
		onLoad() {
			this.getComStat()
			this._load()
		},
		methods: {
			getComStat(){
				this.$store.dispatch('shops/companyStatistics').then((res) => {
					if(res.code == 0 ) {
						this.order_data = res.message
					}
				})
			},
			jump_order() {
				uni.navigateTo({
				    url: '/pages/cms/merchantOrder'
				});
			},
			_load(callback = ()=>{}) {
				this.$store.dispatch('shops/companyread').then((res) => {
					if(res.code == 0 ) {
						callback()
					} else if(res.code == 1 ) {
						uni.navigateTo({
						    url: '/pages/cms/edit/shop/shop?title=门店信息'
						});
					}
				})
			},

			jump_yz(code){
				this.$api.http.post('order/mcms/hexiao', {
					number:code
				}).then(res => {
					if (res.status == 200) {
						this.$api.msg(res.msg);
						this.code = ''
					}
					if(res.status == 400){
						this.$api.msg(res.msg);
						this.code = ''
					}
				})
			},
		},
		onPullDownRefresh() {
			this._load(()=>{
				uni.stopPullDownRefresh();
			})
			
		}
	}
</script>


<style lang="scss">
	.index {
		background: #fff;
		font-size: 14px;

		.H50 {
			height: 50px;
		}

		.head {
			background: linear-gradient(to bottom, #52c693, #27a26c);
			text-align: center;
			padding: 20px 0 10px;
			color: #fff;
			font-size: 14px;
		}

		.jiu {
			padding: 10px;
			display: flex;
			flex-wrap: wrap;
			color: #fff;
		}

		.jiu_01 {
			width: 25%;
			text-align: center;
			padding: 15px 10px 15px;
			box-sizing: border-box;
			font-size: 12px;
		}
  
		.jiu_01 img {
			width: 32px;
			height: 32px; 
			margin-bottom: 10px;
		}

		.mo {
			padding: 10px;
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #f0f0f0;
			line-height: 20px;
		}

		.mo_01 {
			padding-left: 10px;
			box-sizing: border-box;
			width: 80%;
			height: 20px;
			overflow: hidden;
			border-left: 3px solid #EC521B;
			font-size: 14px;
			font-weight: bold;
		}

		.mo_01 span {
			color: #8E8E8E;
			font-weight: 100;
			font-size: 12px;
			padding-left: 10px;
		}

		.mo_02 {
			color: #D6D6D6;
		}

		.shuju {
			display: flex;
			flex-wrap: wrap;
		}

		.shuju_01 {
			width: 50%;
			text-align: center;
			padding: 18px 10px;
			box-sizing: border-box;
			font-size: 14px;
			line-height: 25px;
			font-size: 14px;
			border-right: 1px solid #f0f0f0;
			border-bottom: 1px solid #f0f0f0;
		}

		.shuju_01_s {
			color: #EB511B;
			font-weight: 800;
			font-size: 16px;
		}

		.no {
			border-right: none;
		}

		.BH {
			background-color: #F1F1F1;
			height: 5px;
		}

		.six {
			padding: 10px;
			display: flex;
			flex-wrap: wrap;
		}

		.list_01 {
			padding: 15px 10px 8px;
			border-bottom: 1px solid #F4F4F4;
			font-size: 12px;
		}
	}
</style>