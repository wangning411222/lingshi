<template>
	<view class="width100 d-clo d-jc-centen padding-30">
		<view class="gray3 font26 margin-bottom-20">
			<u-input v-model="form.content" type="textarea" border="true" border-color="#eeeeee" height="250" auto-height="true" placeholder="期待你的宝贵想法"/>
		</view>
		<view class="gray3 font26 margin-bottom-20">
			<u-input v-model="form.contact" border="true" border-color="#eeeeee" placeholder="联系方式:电话/微信/QQ"/>
		</view>
		<view>
			<u-upload ref="uUpload" :action="upimgUrl" max-count="1"></u-upload>
		</view>
		
		<view class="margin-bottom-50 margin-top-20">
			<view class="text-center custom-style" @tap="submit">
				<view>提交</view>
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
					'content':'',
					'contact':'',
					'img':'',
				}
			}
		},
		computed: {
			...mapGetters('config',[
				'upimgUrl'
			])
		},
		methods: {
			submit(){
				let _this = this;
				let files = [];
				files = this.$refs.uUpload.lists.filter(val => {
					return val.progress == 100;
				})

				if(files.length > 0) {
					_this.form.img = files[0]['response']['message']['url'];
				}
								
								
				this.$store.dispatch('user/userSuggest',this.form).then((res) => {
					if(res.code == 0 ) {
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
		}
	}
</script>

<style scoped>
	.custom-style {margin: 0 auto; padding: 30rpx 0; border-radius: 200rpx; color: #efefef;background: linear-gradient(to right, #80D0C7, #0093E9);}
</style>
