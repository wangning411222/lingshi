<template>
	<view class="padding-30">
		<u-form :model="form" ref="uForm" :rules="rules" label-width="150">
			<u-form-item label="店铺Logo">
				<u-upload :action="upimgUrl"
				@on-change="handleupimg"
				:file-list="fileList"
				 ref="uUploadLogo" width="160" height="160" multiple='false' upload-text="商家LOGO" max-count="1"></u-upload>
			</u-form-item>
			<u-form-item label="店铺名称" prop="name">
				<u-input v-model="form.name" />
			</u-form-item>

			
			<u-form-item label="配送费(元)" prop="delivery_rmbs">
				<u-input v-model="form.delivery_rmbs" />
			</u-form-item>
			<u-form-item label="起步价(元)" prop="start_delivery_rmbs">
				<u-input v-model="form.start_delivery_rmbs" />
			</u-form-item>
			<u-form-item label-width="200" label="满减配送价(元)" prop="enough_free_dyrmbs">
				<u-input v-model="form.enough_free_dyrmbs" />
			</u-form-item>
			<u-form-item label="营业时间">
				<view class="d-row">
					<view>
						<picker mode="time" :value="form.starthours" start="00:00" end="24:00" @change="bindTimeChange">
							<view class="uni-input">{{form.starthours}}</view>
						</picker>
					</view>
					<view class="padding-left-50 padding-right-50">-</view>
					<view>
						<picker mode="time" :value="form.endhours" start="00:00" end="24:00" @change="bindTimeChange2">
							<view class="uni-input">{{form.endhours}}</view>
						</picker>
					</view>
				</view>
				
			</u-form-item>
			<u-form-item label="公告">
				<u-input v-model="form.notice" />
			</u-form-item>
			
			<u-form-item label="打烊">
				<u-switch v-model="form.checked" @change="change" active-value="1" inactive-value="0" style="vertical-align: middle;"></u-switch>
			</u-form-item>
			
		</u-form>
		<view style="height: 80px;"></view>
		<view class="p_btn">
			<view class=" flex flex-direction">
				<button@click="submit" class="colorWhite bg-red margin-tb-sm lg">提交</button>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {mapGetters } from 'vuex'
	import uniIcon from "@/components/uni/uni-icon/uni-icon.vue"
	import wPicker from "@/components/w-picker/w-picker.vue";
	export default {
		data() {
			return {
				fileList: [],
				form: {
					logo:'',
					name:'',
					delivery_rmbs:'',
					start_delivery_rmbs:'',
					enough_free_dyrmbs:'',
					notice:'',
					business_time:'',
					starthours:'00:00',
					endhours:'24:00',
					business_status: 0,
					checked: false
				},
				rules: {
					
					name: [
						{
							required: true,
							message: '请输入名称',
							trigger: 'blur'
						}
					],
					delivery_rmbs : [
						{
							required: true,
							message: '请输入配送费',
							trigger: 'blur'
						},
					],
					start_delivery_rmbs : [
						{
							required: true,
							message: '请输入起步价',
							trigger: 'blur'
						},
					],
					enough_free_dyrmbs : [
						{
							required: true,
							message: '请输入满减配送价',
							trigger: 'blur'
						},
					]
				},
			};
		},
		components: {
			uniIcon,
			wPicker
		},
		computed: {
			...mapGetters('config',[
				'upimgUrl'
			])
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
			    title: option.title
			});
			this._load()

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			_load(callback = ()=>{}) {
				let _this = this;
				this.$store.dispatch('shops/companyread').then((res) => {
					if(res.code == 0 ) {
						let form = {
								logo:res.message.logo,
								name:res.message.name,
								delivery_rmbs:res.message.delivery_rmbs,
								start_delivery_rmbs:res.message.start_delivery_rmbs,
								enough_free_dyrmbs:res.message.enough_free_dyrmbs,
								notice:res.message.notice,
								business_time:res.message.business_time,
								starthours:res.message.starthours,
								endhours:res.message.endhours,
								business_status: res.message.business_status,
								checked: res.message.business_status == 0 ? false : true
							}
							_this.fileList = [{url:res.message.logo}]
						_this.form = form
						callback()
					}
				})
			},
			bindTimeChange: function(e) {
				this.form.starthours = e.target.value
			},
			bindTimeChange2: function(e) {
				this.form.endhours = e.target.value
			},
			bindTimeChange_close: function(e) {
				this.time_close = e.target.value
			},
			handleupimg(e){
				let res = JSON.parse(e.data)
				if(res.code == 0){
					this.form.logo = res.message.url
				}
			},
			change(status) {
				this.form.business_status = status
			},
			submit (){
				let _this = this;
				this.$refs.uForm.validate(valid => {
					if (valid) {
						_this.form.business_time = _this.form.starthours +'-'+_this.form.endhours
						this.$store.dispatch('shops/companyUpdate',this.form).then((res) => {
							if(res.code == 0 ) {
								_this.$refs.uToast.show({
									title: '提交成功',
									callback(){
										uni.navigateBack()
									}
								})
							} else {
								
							}
						});
						
					} else {
						
						console.log('验证失败');
					}
				});
				
				
			}


			
		}
	}
</script>

<style lang="less">
	
</style>
