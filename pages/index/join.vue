<template>
	<view class="padding-30">
		<view class="margin-top-20 margin-bottom-50">
			<view class="font40 margin-bottom-10">零点的定义和模式</view>
			<view>
				<text class="font24 se_title">
					<text class="se_title_bg">零点Store零食店的定义和模式</text>
				</text>
			</view>
		</view>
		<view class="d-row margin-bottom-30 margin-top-30 positionrelative">
			<view class="tag"></view>
			<view class="flex-1 padding-left-30">宿舍楼里的便利店</view>
		</view>
		<view class="d-row margin-bottom-30 margin-top-30 positionrelative">
			<view class="tag"></view>
			<view class="flex-1 padding-left-30">学校里的小旋风</view>
		</view>
		<view class="d-row margin-bottom-30 margin-top-30 positionrelative">
			<view class="tag"></view>
			<view class="flex-1 padding-left-30">平台提供小程序、经营方法顿以及商品（送货到各店长寝室楼里），（店长or小旋风）自己运营或组建团队运营</view>
		</view>

		<view class="margin-top-60 margin-bottom-50">
			<view class="font40 margin-bottom-10">做店长（小旋风）的好处</view>
			<view>
				<text class="font24 se_title">
					<text class="se_title_bg">做店长有哪些好处</text>
				</text>
			</view>
		</view>
		<view class="d-row margin-bottom-30 margin-top-30 positionrelative">
			<view class="tag"></view>
			<view class="flex-1 padding-left-30">多一份收入，【网红（店长or小旋风）月入过万，优秀（店长or小旋风）六七千，只要肯吃苦，月入几千很平常。大学时挣这些钱，非常有意义！非常香！】</view>
		</view>
		<view class="d-row margin-bottom-30 margin-top-30 positionrelative">
			<view class="tag"></view>
			<view class="flex-1 padding-left-30">锻炼各方面能力（比如说：人际交往能力、商业经营思维、团队管理能力等）</view>
		</view>

		<view class="margin-top-60 margin-bottom-50">
			<view class="font40 margin-bottom-10">How 怎么做</view>
			<view>
				<text class="font24 se_title">
					<text class="se_title_bg">几句话说不清，快上车</text>
				</text>
			</view>
		</view>
		<view class="d-row margin-bottom-30 margin-top-30 positionrelative">
			<view class="tag"></view>
			<view class="flex-1 padding-left-30">几句话说不清，快上车</view>
		</view>
		<view class="d-row margin-bottom-30 margin-top-30 positionrelative">
			<view class="tag"></view>
			<view class="flex-1 padding-left-30">提交申请后会有专业人员联系你，考察评估通过后为您开通店铺，TA将辅助你做一段时间，后续遇到问题也会提供所需帮助（有经验，有组织后，共进步，共欢笑）</view>
		</view>
		<view class="margin-bottom-30 margin-top-60">
			<view class="text-center custom-style" @tap="handelApply">
				<view>申请开店</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			
		},
		methods: {
			handelApply(){
				uni.navigateTo({
					url:'/pages/index/join_form'
				})
			}
		}
	}
</script>

<style>
	.custom-style {margin: 0 auto; padding: 30rpx 0; border-radius: 200rpx; color: #efefef;width: 100%;background: linear-gradient(to right, #80D0C7, #0093E9);}
	.se_title {
		display: inline-block;
		position: relative;
		height: 20rpx;
		vertical-align: bottom;
		background-image: linear-gradient(to right,#df3e1a,#ffbf65);
	}
	.se_title_bg {position: relative;top: -14rpx;}
	.positionrelative{position: relative;}
	.tag {position: absolute; left: 0; top: 10rpx; z-index: 2; width: 20rpx;height: 20rpx;border-radius: 20rpx;background: linear-gradient(to right, #80D0C7, #0093E9);}
</style>
