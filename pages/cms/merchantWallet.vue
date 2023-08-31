<template>
	<view>
		<view class="flexView" v-if="userInfo.uid">
			<view class="scrollView">
				<view class="head-read">
					<view class="flex">
						<image class="read-img" :src="userInfo.avatar_url_fmt" mode="aspectFill" />
						<view class="flex-box">
							<view class="flex-box-text">姓名：{{ userInfo.nick_name }}(ID:{{ userInfo.uid }})</view>
							<view class="flex-box-text">手机号：{{ userInfo.phone }}</view>
						</view>
						
					</view>
				</view>
				<view class="white-box">
					<view class="tx">
						<view class="tx-grid">
							<view class="tx-grid-text">
								<view class="title">可提现余额</view>
								<view class="money">
									<text>{{ userInfo.remain_rmbs }}</text>
									<text class="money-b">元</text>
								</view>
							</view>
						</view>
						<view class="tx-grid" @click="navTo('/pages/cms/withdraw')"><span class="tx-grid-comm-sign">立即提现</span></view>
					</view>
					<view class="palace palace-one">
						<view class="palace-grid">
							<view class="palace-grid-text">
								<view class="palace-grid-text-data">
									<text>{{ userInfo.current_withdraw_rmbs }}</text>
									<text class="palace-grid-text-data-b">元</text>
								</view>
								<view class="palace-grid-text-name">申请中</view>
							</view>
						</view>
						<view class="palace-grid">
							<view class="palace-grid-text">
								<view class="palace-grid-text-data">
									<text>{{ userInfo.income_rmbs }}</text>
									<text class="palace-grid-text-data-b">元</text>
								</view>
								<view class="palace-grid-text-name">总收入</view>
							</view>
						</view>
						<view class="palace-grid">
							<view class="palace-grid-text">
								<view class="palace-grid-text-data">
									<text>{{ userInfo.total_withdraw_rmbs }}</text>
									<text class="palace-grid-text-data-b">元</text>
								</view>
								<view class="palace-grid-text-name">累计提现</view>
							</view>
						</view>
					</view>
				</view>
				<view class="top">
					<tui-tabs
						:tabs="tabs"
						:height="88"
						:currentTab="currentTab"
						:sliderWidth="150"
						:sliderHeight="60"
						bottom="50%"
						itemWidth="50%"
						color="#888"
						selectedColor="#fff"
						sliderBgColor="#ff6634"
						@change="changeTab"
					></tui-tabs>
				</view>
				<view class="list-view" v-if="list.length > 0">
					<view class="list-item" v-for="(item, index) in list" :key="index" hover-class="hover" :hover-stay-time="150" bindtap="detail">
						<view class="content-box">
							<view class="des-box">
								<view class="tit">{{ currentTab == 1 ? '流水号：' + (90000000+Number(item.withdrawid)) : '订单号：' + item.orderid }}</view>
								<view v-if="currentTab == 1" style="margin-top: 12rpx;">
									账号：{{ item.ali_account }}
								</view>
								<view v-if="currentTab == 1" class="source" :style="{ color: item.status == 1 ? '#4caf50' : item.status == 2 ? '#ff1e0f' : '#00b7ff' }">
									提现{{ item.status == 1 ? '成功' : item.status == 2 ? '失败' : '处理中' }}
								</view>
								<view v-if="currentTab == 0" class="source" style="color: #4caf50;">
									收入来源：{{ item.payuid_format }}{{ item.paytype_fmt }}
								</view>
								<view class="time">{{ item.create_date_fmt }}</view>
							</view>
						</view>
						<view class="money" :class="{ less: is_withdraw }">{{ is_withdraw ? '-' : '+' }}{{ currentTab == 1 ? item.rmbs_fmt : item.incomermbs_fmt }}</view>
					</view>
				</view>
				<view v-if="list.length == 0" class="tip">暂无相关数据</view>
				<!-- <view class="tip">仅显示近半年内的收支记录</view> -->
			</view>

		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'
import tuiTabs from '@/components/tui-tabs/tui-tabs';
export default {
	components: {
		tuiTabs
	},
	data() {
		return {
			is_withdraw: false,
			list: [],
			userData: {},

			date: 'incomeMonth',
			
			currentTab: 0,
			tabs: [
				{
					name: '收入记录'
				},
				{
					name: '提现记录'
				}
			]
		};
	},
	computed:{
		...mapGetters('user',[
			'userInfo'
		])
	},
	onLoad() {

		this.getFundList();
	},
	methods: {
		changeTab(e) {
			this.currentTab = e.index;
			this.list = [];
			if (this.currentTab == 1) {
				this.is_withdraw = true;
			} else if (this.currentTab == 0) {
				this.date = 'incomeMonth';
				this.is_withdraw = false;
			}
			this.getFundList();
		},
		// init_list:function(callback=()=>{}){
		// 	let _this = this;
		// 	let data = {'page':1};
		
		// 	this.getFundList({'page':1},callback);
		// },
		getFundList(){
			let _this = this;
			if (this.currentTab == 1) {
				this.$store.dispatch('shops/moneyMoneyLog',{}).then((res) => {
					if(res.code == 0 ) {
						_this.list = res.message
					} else {
						_this.$refs.uToast.show({
							title: res.message
						})
					}
				});
			} else if (this.currentTab == 0) {
				this.$store.dispatch('shops/moneyWithdrawList',{}).then((res) => {
					if(res.code == 0 ) {
						_this.list = res.message
					} else {
						_this.$refs.uToast.show({
							title: res.message
						})
					}
				});
			}
		},
		navTo(url) {
			uni.navigateTo({
				url
			});
		}
	},
	onPullDownRefresh() {
		this.loadData();
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 500);
	}
};
</script>

<style lang="scss">

.ns {
	width: 100%;
	height: 60px;
	text-align: center;
	line-height: 200rpx;
	color: white;
	font-size: 34rpx;
	font-weight: bold;
	background: linear-gradient(to right, #ea9518, #ff6634);
}
.top {
	margin-top: 20rpx;
}
.flexView {
	width: 100%;
	height: 100%;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	.scrollView {
		width: 100%;
		height: 100%;
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		position: relative;
		padding-bottom: 116rpx;
		.head-read {
			background: linear-gradient(to right, #ea9518, #ff8440);
			background-color: #ff8440;
			padding-bottom: 100rpx;
			.flex {
				display: flex;
				align-items: center;
				padding: 50rpx;
				position: relative;
				.read-img {
					width: 120rpx;
					height: 120rpx;
					border-radius: 100%;
					overflow: hidden;
					margin-right: 20rpx;
					border: 4rpx solid rgba(255, 255, 255, 0.3);
				}
				.flex-box {
					flex: 1;
					min-width: 0;
					font-size: 26rpx;
					color: #333;
					&-text {
						margin: 10rpx 0;
						color: #f5f5f5;
						font-weight: normal;
					}
				}
				.arrow {
					position: relative;
					padding-right: 30rpx;
					span {
						font-size: 28rpx;
						color: white;
					}
					&:after {
						content: ' ';
						display: inline-block;
						height: 12rpx;
						width: 12rpx;
						border-width: 4rpx 4rpx 0 0;
						border-color: #848484;
						border-style: solid;
						transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
						position: relative;
						top: -4rpx;
						position: absolute;
						top: 50%;
						margin-top: -8rpx;
						right: 4rpx;
						border-radius: 2rpx;
					}
				}
				.arrow-one:after {
					border-color: white;
					margin-top: -6rpx;
				}
			}
		}
		.white-box {
			width: 94%;
			background: white;
			border-radius: 10rpx;
			margin: -120rpx auto 20rpx;
			box-shadow: 0 6rpx 20rpx #e7e7e7;
			.tx {
				padding-top: 26rpx;
				overflow: hidden;
				display: flex;
				justify-content: space-between;
				align-content: center;
				&-grid {
					box-sizing: border-box;
					&:first-child {
						margin-left: 40rpx;
					}
					&-comm-sign {
						display: block;
						border-radius: 40rpx 0 0 40rpx;
						font-size: 26rpx;
						padding: 16rpx 44rpx;
						background: linear-gradient(to right, #fef082, #ffc551);
						background-color: #fef082;
						color: #cf4400;
					}
					&-text {
						display: block;
						color: #333;
						font-size: 26rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						.title {
							font-size: 26rpx;
							font-weight: normal;
							color: #ff6423;
						}
						.money {
							font-size: 60rpx;
							color: #ff6423;
							letter-spacing: 2rpx;
							margin-bottom: 10rpx;
							&-b {
								font-size: 28rpx;
							}
						}
					}
				}
			}
			.palace {
				padding-bottom: 20rpx;
				overflow: hidden;
				display: flex;
				justify-content: center;
				&-grid {
					flex: 1;
					position: relative;
					box-sizing: border-box;
					&:not(:last-child) {
						&:after {
							width: 1rpx;
							height: 80rpx;
							background: #fddece;
							content: ' ';
							display: inline-block;
							position: absolute;
							top: 0;
							right: 0;
						}
					}
					&-text {
						display: block;
						text-align: center;
						color: #333;
						font-size: 32rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						&-name {
							font-size: 26rpx;
							font-weight: normal;
							color: #ff6634;
						}
						&-data {
							font-size: 32rpx;
							color: #ff6634;
							letter-spacing: 2rpx;
							margin-bottom: 5rpx;
							&-b {
								font-size: 20rpx;
							}
						}
					}
				}
			}
		}
	}
}
.list-view {
	position: relative;
	width: 100%;
	overflow: hidden;
}

.list-item {
	width: 100%;
	padding: 30rpx 28rpx;
	box-sizing: border-box;
	background: #fff;
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	border-bottom: 1rpx solid #eaeef1;
}

.item-last::after {
	left: 0 !important;
}

.content-box {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
}

.des-box {
	min-height: 80rpx;
	padding-left: 28rpx;
	box-sizing: border-box;
	vertical-align: top;
	color: #333;
	font-size: 24rpx;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.tit {
	font-size: 32rpx;
	max-width: 420rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
.source {
	margin: 12rpx 0;
}
.time {
	color: #888;
}

.money {
	font-size: 38rpx;
	font-weight: 500;
	color: #ff1e0f;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	padding-left: 20rpx;
}

.less {
	color: #4caf50 !important;
}
.tip {
	margin-top: 50rpx;
	display: flex;
	justify-content: center;
	align-content: center;
	font-size: 24rpx;
	color: #888;
}
</style>
