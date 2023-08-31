<template>
	<view class="wrap">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType"  label-width="150">
			<u-form-item :label-position="labelPosition" label="收货人姓名" prop="real_name">
				<u-input :border="border" placeholder="请输入姓名" v-model="model.real_name" type="text"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="手机号码" prop="phone">
				<u-input :border="border" placeholder="请输入手机号" v-model="model.phone" type="number"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="学校楼栋" prop="schoolinfo">
				<u-input :border="border" type="select" v-model="model.schoolinfo" @click="handleBuilding()" placeholder="请选择学校楼栋"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="详细地址" prop="address">
				<u-input :border="border"  v-model="model.address"  placeholder="请填写寝室号等详细地址" />
			</u-form-item>
			
			<u-form-item :label-position="labelPosition">
				<u-checkbox-group @change="checkboxGroupChange">
					<u-checkbox v-model="model.checkbox" name="is_default" shape="circle" active-color="#ff6634">设为默认</u-checkbox>
					
				</u-checkbox-group>
			</u-form-item>
		</u-form>
		
		<view class="margin-bottom-30 margin-top-60">
			<view class="text-center custom-style" @click="submit">
				<view>保存地址</view>
			</view>
			
			<view v-if="model.addressid && model.addressid!=''" class="text-center custom1-style" @click="delAdress(model.addressid)">
				<view>删除地址</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
export default {
	data() {
		let that = this;
		return {
			model: {
				real_name: '',
				phone: '',

				schoolid: '',
				building_num: '',
				schoolinfo: '',
				
				address:'',
				is_default: 0,
				checkbox: false,
			},
			rules: {
				real_name: [
					{
						required: true,
						message: '请输入姓名',
						trigger: 'blur' ,
					}
				],
				address: [
					{
						required: true,
						message: '请填写地址'
					}
				],
				schoolinfo: [
					{
						required: true,
						message: '请选择学校楼栋',
						trigger: 'change',
					}
				],
				phone: [
					{
						required: true,
						message: '请输入手机号',
						trigger: ['change','blur'],
					},
					{
						validator: (rule, value, callback) => {
							// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
							return this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						// 触发器可以同时用blur和change，二者之间用英文逗号隔开
						trigger: ['change','blur'],
					}
				],
			},
			border: false,
			check: false,

			labelPosition: 'left',
	
			errorType: ['message'],
		};
	},
	onLoad(option) {
		uni.setNavigationBarTitle({
		    title: option.title
		});
		if(option.item) {
			let item = JSON.parse(option.item)
			this.model = {
				addressid:item.addressid,
				
				real_name: item.real_name,
				phone: item.phone,
				
				schoolid: item.schoolid,
				building_num: item.building_num,
				schoolinfo: item.schoolinfo,
				
				address:item.address,
				is_default: item.is_default,
				checkbox: item.is_default == 0 ?false:true,
			}
		}
	},
	computed: {
		borderCurrent() {
			return this.border ? 0 : 1;
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		checkboxGroupChange(e) {
			if(e.length > 0) {
				this.model.is_default = 1
			} else {
				this.model.is_default = 0
			}
			
		},
		submit() {
			let _this = this
			this.$refs.uForm.validate(valid => {
				if (valid) {
					this.$store.dispatch('address/addresssave',this.model).then((res) => {
						if(res.code == 0) {
							_this.$refs.uToast.show({
								title: res.message,
								duration:1000,
								callback(){
									uni.navigateBack()
								}
							})
						}
					});
				} else {
					console.log('验证失败');
				}
			});
		},
		delAdress(addressid){
			let _this = this
			uni.showModal({
				title: '提示',
				content: '确认删除地址？',
				success: function(res) {
					_this.$store.dispatch('address/addressdelete',{'addressid':addressid}).then((res) => {
						if(res.code == 0) {
							_this.$refs.uToast.show({
								title: res.message,
								duration:1000,
								callback(){
									uni.navigateBack()
								}
							})
						}
					});
				}
			})
			
		},
		handleBuilding(){
			uni.navigateTo({
				url:'/pages/index/location?type=1'
			})
		},
		seTaddress(data){
			console.log(data)
			this.model.schoolinfo = data.schoolname +' '+data.floor
			
			this.model.schoolid = data.schoolid
			this.model.building_num = data.buid
		},
	}
};
</script>

<style scoped lang="scss">
	.custom-style {margin: 0 auto; padding: 30rpx 0; border-radius: 200rpx; color: #efefef;width: 100%;background: linear-gradient(to right, #80D0C7, #0093E9);}
	.custom1-style{margin: 30rpx auto; padding: 30rpx 0; border-radius: 200rpx; color: #efefef;width: 100%;border: 1rpx solid #80D0C7;color: #80D0C7; }
	.wrap {
		padding: 30rpx 50rpx;
	}


</style>
