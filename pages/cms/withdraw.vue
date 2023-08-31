<template>
	<view class="withdraw">
		<view class="withdraw-head">
			<view style="flex: 1;">
				<view>真实姓名</view>
				<view style="border-bottom: 1rpx solid #f4f4f4; margin-bottom: 30rpx;"><u-input v-model="real_name" placeholder="真实姓名" /></view>
				<view>支付宝账号</view>
				<view style="border-bottom: 1rpx solid #f4f4f4;"><u-input v-model="ali_account" placeholder="支付宝账号" /></view>
				
			</view>
		</view>
		<view class="withdraw-body">
			<text>提现金额</text>
			<view class="input-money">
				<text class="rmb">￥</text>
				<input v-model.number="extract" type="number" @input="checkMoney()"  class="t-input" />
			</view>
			<view class="info-money">
				<view v-if="is_out">
					<text class="info-money-num" style="color: #ff1e0f;">输入金额超过可提现余额，账户余额{{ pool }}元</text>
				</view>
				<view v-else-if="is_lowest">
					<text class="info-money-num" style="color: #ff1e0f;">最低{{ lowest }}元起提现，账户余额{{ pool }}元</text>
				</view>
				<view v-else>
					<text class="info-money-num">当前可提现余额{{ pool }}元，</text>
					<text class="info-money-all" @click="getAll">全部提现</text>
				</view>
			</view>
			<view :class="'tx' + (is_post ? '-active' : '')"><button @click="handleShowModel">提现</button></view>
			<view style="color: #bbbbbb; padding-top: 40rpx; font-size: 28rpx;">
				<view style="padding-bottom: 15rpx;">提示：</view>
				<view>
					<view style="padding-bottom: 10rpx;">暂时仅支持支付宝账户提现；</view>
					<!-- <view>2.{{ charge_text }}</view> -->
					
				</view>
			</view>
		</view>

		<u-modal v-model="showModal" title="提现确认" :title-style="{'padding-bottom':'40rpx'}" show-cancel-button="true" @confirm="getMoney">
			<view class="slot-content">
				<view style="text-align: left; padding: 30rpx 35rpx; background-color: #f4f4f4;">
					<view>
						<text>提现金额：</text>
						<text class="text-red fee">
							{{ money }}
							<em>元</em>
						</text>
					</view>
					<view class="margin-top-sm">
						<text>实际到账：</text>
						<text class="text-red fee">
							{{ real_money }}
							<em>元</em>
						</text>
					</view>
					<view class="margin-top-sm">
						<text>服务费：</text>
						<text class="text-red fee">
							{{ service_fee }}
							<em>元</em>
						</text>
					</view>
					<view class="margin-top-sm">
						<text>服务费率：</text>
						<text class="text-red">{{ fee }}%</text>
					</view>
				</view>
			</view>
		</u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { mapState,mapGetters } from 'vuex'
export default {
	data() {
		return {
			pool: 0,
			extract: '',
			service_fee: 0.0,
			showModal: false,
			is_out: false,
			is_lowest: false,
			is_post: false,
			lowest: 0,
			fee: 0,
			money: '',
			real_money: '',
			keyboradShow: false,
			isIphoneX: false,
			isRefuse: false,
			
			real_name:'',
			ali_account:''
			
		};
	},
	computed: {
		...mapGetters('user',[
			'userInfo'
		]),
		...mapGetters('config',[
			'charge_rate',
			'charge_text'
		])
	},
	onLoad() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.lowest = 100;
			this.fee = this.charge_rate;
			this.pool = this.userInfo.remain_rmbs;
		},
		getAll() {
			this.extract = parseInt(this.pool);
			this.checkMoney();
		},
		checkMoney() {
			if (!this.extract || this.extract < this.lowest) {
				this.is_lowest = true;
				this.is_post = false;
			} else if (this.extract > this.pool) {
				this.is_out = true;
				this.is_lowest = false;
				this.is_post = false;
			} else {
				this.is_out = false;
				this.is_lowest = false;
				this.is_post = true;
			}
			if (parseFloat(this.extract).toString() == 'NaN') {
				this.is_post = false;
				this.$refs.uToast.show({
					title: '输入金额不合法',
				})
			}
		},
		handleShowModel() {
			
			if (this.isRefuse) return;
			this.checkMoney();
			if (!this.is_post) return;
			
			if(!this.real_name){
				this.$refs.uToast.show({
					title: '请填写真实姓名',
				})
				return false;
			};
			if(!this.ali_account){
				this.$refs.uToast.show({
					title: '请填写支付宝账号',
				})
				return false;
			};
			
			
			this.money = this.extract;
			this.service_fee = Number((this.extract * (this.fee / 100)).toString().match(/^\d+(?:\.\d{0,2})?/));
			this.real_money = Number((this.extract - this.service_fee).toString().match(/^\d+(?:\.\d{0,2})?/));
			this.showModal = true;
		},
		getMoney() {
			let _this = this;
			let data = {
				'real_name':this.real_name,
				'ali_account':this.ali_account,
				'withdraw_rmbs':this.extract,
			}
			
			this.$store.dispatch('shops/moneywithdraw',data).then((res) => {
				if(res.code == 0 ) {
					_this.showModal = false;
					if (_this.isRefuse) return;
					_this.isRefuse = true;
					
					_this.user();
					setTimeout(() => {
						_this.$refs.uToast.show({
							title: '提现申请已提交，等待管理员处理',
						})
					}, 500);
					setTimeout(() => {
						uni.navigateBack();
					}, 1000);
				} else {
					_this.$refs.uToast.show({
						title: res.message
					})
				}
			});
			
			
		},
		user(){
			let _this = this;
			this.$store.dispatch('user/getRead').then((res) => {

			});
		}
	},
	onPullDownRefresh() {
		this.extract = '';
		this.loadData();
		this.is_out = false;
		this.is_lowest = false;
		this.is_post = false;
		setTimeout(function() {
			uni.stopPullDownRefresh();
		}, 500);
	}
};
</script>

<style lang="scss">
page {
	background-color: #ededed;
}
.text-red {
	color: #E54D42;
}
.margin-top-sm {
	margin-top: 20rpx;
}
.withdraw {
	padding: 20px;
	&-head {
		background-color: #ffffff;
		display: flex;
		align-content: center;
		padding: 20px 30px 0;
		font-size: 14px;
		&-to {
			font-size: 30rpx;
		}
		&-way {
			display: flex;
			flex-direction: column;
			align-content: center;
			margin-left: 20px;
			&-1 {
				color: #576b95;
				margin-bottom: 10px;
				.way-icon {
					width: 16px;
					height: 16px;
					margin-right: 5px;
					top: 2px;
				}
			}
			&-2 {
				color: #acacac;
				font-size: 12px;
			}
		}
	}
	&-body {
		background-color: #fff;
		padding: 30rpx 30px 20px;
		font-size: 14px;
		.input-money {
			display: flex;
			align-content: center;
			font-weight: 600;
			border-bottom: 0.5px solid #eaeef1;
			.rmb {
				font-size: 1.3em;
				top: 10px;
				position: relative;
			}
			.t-input {
				height: 1.9em;
				font-size: 1.6em;
				border: none;
				position: relative;
				left: 3.5%;
				outline: none;
			}
		}
		.info-money {
			margin-top: 10px;
			font-size: 12px;
			margin-bottom: 20px;
			&-num {
				color: #b2b2b2;
			}
			&-all {
				color: #576b95;
			}
		}
		.tx {
			button {
				color: #b2b2b2;
			}
		}
		.tx-active {
			button {
				color: #fff;
				background: #EA9518;
			}
		}
	}
	.keyboard {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: #ebebeb;
		display: flex;
		justify-content: center;
		z-index: 2;
		flex-wrap: wrap;
		transition: all 0.2s ease-in 0.2s;
	}
	.active {
		bottom: -400rpx;
	}
	.keyboard-item {
		box-sizing: border-box;
		width: 250rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: #fff;
		font-size: 40rpx;
		color: #333;
		height: 99rpx;
		border: 1rpx solid #ebebeb;
		border-top: none;
		border-left: none;
	}
	.hide {
		opacity: 0;
	}
	.delte {
		background: none;
		box-shadow: none;
	}
	.delte image {
		width: 60rpx;
		height: 60rpx;
	}
	.isIphone {
		padding-bottom: 68rpx !important;
	}
	.fee {
		em {
			font-size: 0.5rem;
			font-style: normal;
		}
	}
}
</style>
