<template>
	<view class="d-clo d-ai-centen">
		
		<!-- 我的收藏 -->
		<view class="width90 d-row d-jc-around" style="margin-top: 30rpx;height: 180rpx;"
			v-for="(item,index) in sList" :key="index" @tap="intoDetails(item)">
			<view class="s-head d-clo d-jc-centen d-ai-centen "><image class="s-head-img" :src="item.headImg"></image></view>
			<view class="s-detail d-clo d-jc-around">
				<view class="font-bold font32">{{item.name}}</view>
				<view class="font28 gray3">月销{{item.yx}}</view>
				<view class="d-row d-jc-between gray3">
					<view>起送 ¥{{item.qs}} | 配送 ¥{{item.ps}}</view>
					<view>{{item.sj}}分钟 {{item.jl}}m</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sList:[
					{
						id:'1',
						headImg:'/static/logo.png',
						name:'百果园',
						yx:'123',
						qs:'20',
						ps:'4',
						sj:'40',
						jl:'800'
					},
					{
						id:'2',
						headImg:'/static/logo.png',
						name:'百果园',
						yx:'123',
						qs:'20',
						ps:'4',
						sj:'40',
						jl:'800'
					},
					{
						id:'3',
						headImg:'/static/logo.png',
						name:'百果园',
						yx:'123',
						qs:'20',
						ps:'4',
						sj:'40',
						jl:'800'
					}
				]
			}
		},
		methods: {
			
		}
	}
</script>

<style>
.s-head{
		flex: 1;
	}
	.s-head-img{
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}
	.s-detail{
		flex: 3;
	}
</style>
