<template>
	<view class="padding-20">
		<view v-if="list.length > 0">
			<view v-for="(item,index) in list" :key="index" class="width100 height160 margin-bottom-20 bg-color-white d-row d-jc-between d-ai-centen ">
				<view @tap="chooseAddress(item)" class="d-clo d-jc-around height140 padding-20">
					<view class="font-bold font32">{{item.schoolinfo}}{{item.address}}</view>
					<view class="gray3 margin-top-20">
						<u-tag v-if="item.is_default == 1" text="默认" mode="light" type="warning" size="mini" style="margin-right: 10rpx;"/>
						{{item.real_name}} {{item.phone}}
					</view>
				</view>
				<view class="margin-30"> <u-icon @tap="handleAddress(1,item)" name="edit-pen" size="36" color="#c6c6c6"></u-icon></view>
			</view>
		</view>
		<view v-else class="empty_box">
			<u-empty text="暂无地址信息" mode="list"></u-empty>
		</view>
		
		
		<view style="padding: 20rpx 50rpx 50rpx; position: fixed; bottom: 0; left: 0; width: 100%;">
			<view @tap="handleAddress(0)" class="padding-20 text-center" style="border-radius: 50rpx; border: 1rpx solid #80D0C7; color: #80D0C7; background-color: #FFFFFF;">
				<u-icon name="plus" color="#80D0C7" size="28"></u-icon> 添加地址
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {goBack} from '@/tools/utils.js';
	export default {
		data() {
			return {
				type:0,
				list:[]
			} 
		},
		onLoad(option) {
			// 判断是从哪里进入该页面
			this.type = option.type
			console.log(option)
		},
		onShow() {
			uni.startPullDownRefresh()
		},
		onPullDownRefresh() {
			this.getAdressList(()=>{
				uni.stopPullDownRefresh();
			})
			
		},
		methods: {
			getAdressList(callback=()=>{}) {
				let _this = this;
				this.$store.dispatch('address/addresslist').then((res) => {
					if(res.code == 0 ) {
						_this.list = res.message
					}
					callback()
				});
			},
			handleAddress(type,item){
				if(type == 0) {
					uni.navigateTo({
					    url: '/pages/store/add_address?title=添加地址'
					});
				} else {
					uni.navigateTo({
					    url: '/pages/store/add_address?title=编辑地址&item='+JSON.stringify(item)
					});
				}
				
			},
			chooseAddress(item){
				if(this.type == 1) {
					goBack('chooseAddress',item)
				}
				
			}
		}
	}
</script>

<style>
page{
	background-color: #f7f7f7;
}
.empty_box {
	width: 100%;
	padding-top: 20vh;
}
</style>
