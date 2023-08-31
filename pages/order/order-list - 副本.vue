<template>
	<view class="margin-center">
		<view class="d-row bg-color-white padding-left-40 font30 topNav">
			<view class="flex-1">
				<text :class="tabcurrent == 0?'active' : ''"
					@tap="handelTab(0)"
					class="margin-right-100 gray3 padding-top-20 padding-bottom-20"
					style="display: inline-block;">零食</text>
				<text :class="tabcurrent == 1?'active' : ''"
					@tap="handelTab(1)"
					class="padding-top-20 padding-bottom-20 gray3"
					style="display: inline-block;">服务</text>
			</view>
			<view @click="statusShow = true" class="padding-left-40 padding-right-40 margin-top-20 margin-bottom-20 gray2" style="border-left: 1rpx solid #eee;">全部<u-icon class="margin-left-10" name="arrow-down-fill" color="#aaa" size="28"></u-icon> </view>
		</view>
		<!-- 商品列表1 -->
		<view class="bg-color-white padding-20 border-radius-15 margin-top-30">
			<view class="d-row d-jc-between padding-10 padding-bottom-20 border-bottom-2">
				<view class="d-row">
					<view class="d-clo d-ai-centen">
						<image style="width: 80rpx;height: 80rpx;" src="../../static/logo.png" ></image>
					</view>
					<view class="d-clo d-jc-between padding-left-20">
						<h3>西瓜</h3>
						<view>
						<text class="gray3 font22" >2021-01-12 09:15 </text>
						</view>
					</view>
				</view>
				<view class="d-clo d-ai-end">
					<view class="padding-bottom-20 gray2">待支付</view>
					
				</view>
			</view>
			
			
			<view class="d-row d-jc-between d-ai-centen padding-10 font30 padding-bottom-10">
				<view class="font22">草莓 + 西瓜</view>
				<view>¥ <text class="font-bold font36">15</text></view>
			</view>
			
			<view class="d-row d-jc-between d-ai-centen padding-10 padding-top-30">
				<view></view>
				<view>
					<button class="custom-style" @tap="go('pay')">
						去支付
					</button> 
				</view>
			</view>
			
		</view>
		
		
		<!-- 商品列表2 -->
		<view class="bg-color-white padding-20 border-radius-15 margin-top-30">
			<view class="d-row d-jc-between padding-10 padding-bottom-20 border-bottom-2">
				<view class="d-row">
					<view class="d-clo d-ai-centen">  <image style="width: 80rpx;height: 80rpx;" src="../../static/logo.png" ></image> </view>
					<view class="d-clo d-jc-between padding-left-10">  <h3>西瓜</h3> 
						<text class="font20 gray3">15小时 2分钟前</text> 
					</view>
				</view>
				<view class="d-clo d-ai-end">
					<view class="padding-bottom-20">已取消</view>
					<view> 
						<text class="font24 gray3">订单超时未支付</text>
					</view>
				</view>
			</view>
			
			
			<view class="d-row d-jc-between d-ai-centen padding-10 font30 padding-bottom-10">
				<view class="font22">益杯百香果 + 原味珍珠奶茶</view>
				<view>¥ <text class="font-bold font36">15</text></view>
			</view>
			
			<view class="d-row d-jc-between d-ai-centen padding-10 padding-top-30">
				<view></view>
				<view>
					<button plain type="primary" size="mini" @tap="go('one')">
						再来一单
					</button> 
				</view>
			</view>
			
		</view>
		
		
		<!-- 商品列表3 -->
		<view class="bg-color-white padding-20 border-radius-15 margin-top-30">
			<view class="d-row d-jc-between padding-10 padding-bottom-20 border-bottom-2">
				<view class="d-row">
					<view class="d-clo d-ai-centen">  <image style="width: 80rpx;height: 80rpx;" src="../../static/logo.png" ></image> </view>
					<view class="d-clo d-jc-between padding-left-10">  <h3>西瓜</h3> 
						<text class="font20 gray3">15小时 2分钟前</text> 
					</view>
				</view>
				<view class="d-clo d-ai-end">
					<view class="padding-bottom-20">已送达</view>
					<view> 
						<text class="font24 gray3"></text>
					</view>
				</view>
			</view>
			
			
			<view class="d-row d-jc-between d-ai-centen padding-10 font30 padding-bottom-10">
				<view class="font22">益杯百香果 + 原味珍珠奶茶</view>
				<view>¥ <text class="font-bold font36">15</text></view>
			</view>
			
		</view>
		
		<!-- 商品列表3 -->
		<view class="bg-color-white padding-20 border-radius-15 margin-top-30">
			<view class="d-row d-jc-between padding-10 padding-bottom-20 border-bottom-2">
				<view class="d-row">
					<view class="d-clo d-ai-centen">  <image style="width: 80rpx;height: 80rpx;" src="../../static/logo.png" ></image> </view>
					<view class="d-clo d-jc-between padding-left-10">  <h3>西瓜</h3> 
						<text class="font20 gray3">15小时 2分钟前</text> 
					</view>
				</view>
				<view class="d-clo d-ai-end">
					<view class="padding-bottom-20">已送达</view>
					<view> 
						<text class="font24 gray3"></text>
					</view>
				</view>
			</view>
			
			
			<view class="d-row d-jc-between d-ai-centen padding-10 font30 padding-bottom-10">
				<view class="font22">益杯百香果 + 原味珍珠奶茶</view>
				<view>¥ <text class="font-bold font36">15</text></view>
			</view>
			
		</view>
		<!-- 商品列表3 -->
		<view class="bg-color-white padding-20 border-radius-15 margin-top-30">
			<view class="d-row d-jc-between padding-10 padding-bottom-20 border-bottom-2">
				<view class="d-row">
					<view class="d-clo d-ai-centen">  <image style="width: 80rpx;height: 80rpx;" src="../../static/logo.png" ></image> </view>
					<view class="d-clo d-jc-between padding-left-10">  <h3>西瓜</h3> 
						<text class="font20 gray3">15小时 2分钟前</text> 
					</view>
				</view>
				<view class="d-clo d-ai-end">
					<view class="padding-bottom-20">已送达</view>
					<view> 
						<text class="font24 gray3"></text>
					</view>
				</view>
			</view>
			
			
			<view class="d-row d-jc-between d-ai-centen padding-10 font30 padding-bottom-10">
				<view class="font22">益杯百香果 + 原味珍珠奶茶</view>
				<view>¥ <text class="font-bold font36">15</text></view>
			</view>
			
		</view>
		<!-- 商品列表3 -->
		<view class="bg-color-white padding-20 border-radius-15 margin-top-30">
			<view class="d-row d-jc-between padding-10 padding-bottom-20 border-bottom-2">
				<view class="d-row">
					<view class="d-clo d-ai-centen">  <image style="width: 80rpx;height: 80rpx;" src="../../static/logo.png" ></image> </view>
					<view class="d-clo d-jc-between padding-left-10">  <h3>西瓜</h3> 
						<text class="font20 gray3">15小时 2分钟前</text> 
					</view>
				</view>
				<view class="d-clo d-ai-end">
					<view class="padding-bottom-20">已送达</view>
					<view> 
						<text class="font24 gray3"></text>
					</view>
				</view>
			</view>
			
			
			<view class="d-row d-jc-between d-ai-centen padding-10 font30 padding-bottom-10">
				<view class="font22">益杯百香果 + 原味珍珠奶茶</view>
				<view>¥ <text class="font-bold font36">15</text></view>
			</view>
			
		</view>
		<u-select v-model="statusShow" :list="statuslist" @confirm="confirm"></u-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabcurrent:0,
				statusShow:false,
				statuslist:[
					{
						value: '0',
						text: '全部'
					},
					{
						value: '1',
						text: '待支付'
					},
					{
						value: '2',
						text: '待接单'
					},
					{
						value: '3',
						text: '待配送'
					},
					{
						value: '4',
						text: '待收货'
					},
					{
						value: '5',
						text: '已完成'
					},
					{
						value: '6',
						text: '已取消'
					},
					{
						value: '7',
						text: '已退款'
					},
				]
			}
		},
		methods: {
			handelTab(index){
				this.tabcurrent = index
			},
			go(type){
				if('one'==type){
					console.log("one--------")
					uni.navigateTo({
						url: '../store/index',
						animationType: 'pop-in',
						animationDuration: 2000
					})
				}else if('pay'==type){
					console.log("pay--------")
					uni.navigateTo({
						url: '../store/pay',
						animationType: 'pop-in',
						animationDuration: 2000
					})
				}
			},
			confirm(e) {
				console.log(e);
			}
		}
	}
</script>

<style>
.custom-style {width: 160rpx;font-size: 26rpx; height: 60rpx; line-height: 60rpx; margin: 0 auto; border-radius: 200rpx; color: #efefef;background: linear-gradient(to right, #80D0C7, #0093E9);}
.topNav {position: sticky; top: 0; z-index: 3; width: 100%; }
.active {
	color: #fa792e;
	border-bottom: 5rpx solid #fa792e;
}
uni-page-head,uni-page,page{
	background-color: #f7f7f7;
}

.bgColor{
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: #bbbbf3;
	z-index: -1;
}
</style>
