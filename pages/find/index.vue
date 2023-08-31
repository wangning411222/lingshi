<template>
	<view>
		<view class="margin-bottom-40 padding-left-30 padding-right-30">
			<view class="font-bold font34 margin-bottom-20">零食优惠券</view>
			<view @tap="couponCenter(0)" style="width:690rpx; height: 300rpx; overflow: hidden;border-radius: 30rpx;">
				<image src="../../static/ls.png" mode="widthFix" style="width:690rpx; height: 300rpx;"></image>
			</view>
		</view>
		<view class="margin-bottom-50 padding-left-30 padding-right-30">
			<view class="font-bold font34 margin-bottom-20">校园服务优惠券</view>
			<view @tap="couponCenter(1)" style="width:690rpx; height: 300rpx; overflow: hidden;border-radius: 30rpx;">
				<image src="../../static/pt.png" mode="widthFix" style="width:690rpx; height: 300rpx;"></image>
			</view>
		</view>
		<view class="padding-left-50 padding-right-50 margin-bottom-40">
			<view class="text-center margin-bottom-40">
				<image src="../../static/findTitle.png" mode="widthFix" style="width:300rpx;"></image>
			</view>
			<view class="font-bold font30 margin-bottom-10">
				说一说你希望零点Store 增加哪些功能或业务模块？原因是什么？
			</view>
			<view class="gray3 font26 margin-bottom-20">
				优质内容提议者将会入选零点种子用户，共同打造咱们的零点Store ,同时还有丰富的线上线下活动邀你参与哦
			</view>
			<view class="gray3 font26 margin-bottom-20">
				<u-input v-model="form.content" type="textarea" border="true" border-color="#eeeeee" height="250"
					auto-height="true" placeholder="期待你的宝贵想法" />
			</view>
			<view class="gray3 font26 margin-bottom-20">
				<u-input v-model="form.contact" border="true" border-color="#eeeeee" placeholder="联系方式:电话/微信/QQ" />
			</view>
			<view>
				<u-upload ref="uUpload" :action="upimgUrl" max-count="1"></u-upload>
			</view>

			<view class="margin-bottom-50 margin-top-20">
				<view class="text-center custom-style" @tap="submit">
					<view>提交</view>
				</view>
			</view>

		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	data() {
		return {
			form: {
				'content': '',
				'contact': '',
				'img': '',
			}
		}
	},
	computed: {
		...mapGetters('config', [
			'upimgUrl'
		])
	},
	methods: {
		couponCenter(type) {
			uni.navigateTo({
				url: '/pages/find/collectCoupons?type=' + type
			})
		},
		submit() {
			let _this = this;
			let files = [];
			files = this.$refs.uUpload.lists.filter(val => {
				return val.progress == 100;
			})

			if (files.length > 0) {
				_this.form.img = files[0]['response']['message']['url'];
			}


			this.$store.dispatch('user/userSuggest', this.form).then((res) => {
				if (res.code == 0) {
					_this.$refs.uToast.show({
						title: res.message,
					})
					Object.assign(this.$data.form, this.$options.data().form);
					_this.$refs.uUpload.clear();
				} else {
					_this.$refs.uToast.show({
						title: res.message,
					})
				}
			});
		}
	},
	onShareAppMessage(res) {
		return res
	},
}
</script>

<style>
image {
	will-change: transform;
	width: auto;
	height: auto;
}

.custom-style {
	margin: 0 auto;
	padding: 30rpx 0;
	border-radius: 200rpx;
	color: #efefef;
	background: linear-gradient(to right, #80D0C7, #0093E9);
}</style>
