<template>
	<view>
		<view>
			<view class="padding-20">
				<view>
					<view class="gray3 margin-bottom-20">已选学校</view>
					<view class="d-row">
						<view class="flex-1 font-bold">{{ school }}</view>
						<view class="gray3" @tap="handlePage">重新选择</view>
					</view>
				</view>
			</view>
			<u-gap height="15" bg-color="#efefef"></u-gap>
			<view class="padding-20">
				<view class="gray3 padding-bottom-20">选择楼栋</view>
				<u-line color="#efefef" />
				<view>
					<view class="d-row padding-20">
						<view class="flex-1 font-bold">
							一号楼
						</view>
						
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				school:'',
				
				keyword:'',

				latitude: 0,
				longitude: 0,
				address: ''
			}
		},
		onLoad(option) {
			this.school = option.title
			
			
		},
		methods: {
			
			handlePage() {
				uni.navigateBack()
			}
		}
	}
</script>

<style>

</style>
