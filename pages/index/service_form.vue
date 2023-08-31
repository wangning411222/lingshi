<template>
	<view class="wrap">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType"  label-width="125">
			<u-form-item :label-position="labelPosition" label="姓名" prop="real_name">
				<u-input :border="border" placeholder="请输入姓名" v-model="model.real_name" type="text"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="入学年级" prop="xuenian">
				<u-input :border="border" type="select" :select-open="pickerShow" v-model="model.xuenian" placeholder="请选择入学年级" @click="pickerShow = true"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="学制 " prop="xuezhi_label">
				<u-input :border="border" type="select" :select-open="actionSheetShow" v-model="model.xuezhi_label" placeholder="请选择学制 " @click="actionSheetShow = true"></u-input>
			</u-form-item>
			
			<u-form-item :rightIconStyle="{color: '#888', fontSize: '32rpx'}" right-icon="kefu-ermai" :label-position="labelPosition" label="手机号码" prop="phone">
				<u-input :border="border" placeholder="请输入手机号" v-model="model.phone" type="number"></u-input>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="验证码" prop="code">
				<u-input :border="border" placeholder="请输入验证码" v-model="model.code" type="text"></u-input>
				<u-button slot="right" type="primary" size="mini" @click="getCode">{{codeTips}}</u-button>
			</u-form-item>
			<u-form-item :label-position="labelPosition" label="学校楼栋" prop="building">
				<u-input :border="border" type="select" v-model="model.building" @click="handleBuilding()" placeholder="请选择学校楼栋"></u-input>
			</u-form-item>
			<u-form-item label-position="top" label="申请说明" prop="remark">
				<u-input type="textarea" :border="border" placeholder="请填写申请原因/个人情况说明等,好的说明将有助于评估你的申请" v-model="model.remark" />
			</u-form-item>
		</u-form>
		<view class="gray4 margin-top-30">信息提交后，将会有校园经理与您联系。</view>
		
		<view class="margin-bottom-30 margin-top-60">
			<view class="text-center custom-style" @click="submit">
				<view>申请开店</view>
			</view>
		</view>
		
		<u-action-sheet :list="actionSheetList" v-model="actionSheetShow" @click="actionSheetCallback"></u-action-sheet>
		
		
		<u-picker mode="time" :start-year="startYear" :end-year="endYear" v-model="pickerShow" :params="params" @confirm="gradeConfirm"></u-picker>
		
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import { mapState,mapGetters } from 'vuex'
export default {
	data() {
		let that = this;
		return {
			model: {
				real_name: '',
				phone: '',
				code: '',
				schoolid:0,
				building_num:0,
				building:'',
				xuenian: '',
				xuezhi_label : '',
				xuezhi:99,
				remark: '',
				type: 1
				

			},
			rules: {
				real_name: [
					{
						required: true,
						message: '请输入姓名',
						trigger: 'blur' ,
					}
				],
				xuezhi_label : [
					{
						required: true,
						message: '请选择学制 ',
						trigger: 'change'
					},
				],
				remark: [
					{
						required: true,
						message: '请填写简介'
					},
					{
						min: 5,
						message: '简介不能少于5个字',
						trigger: 'change' ,
					}
				],


				xuenian: [
					{
						required: true,
						message: '请选择入学年级',
						trigger: 'change',
					}
				],
				building: [
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
				code: [
					{
						required: true,
						message: '请输入验证码',
						trigger: ['change','blur'],
					},
					{
						type: 'number',
						message: '验证码只能为数字',
						trigger: ['change','blur'],
					}
				],


			},
			border: false,
			check: false,
			selectStatus: 'close',

			actionSheetList: [],
			actionSheetShow: false,
			pickerShow: false,
			startYear:'',
			endYear:'',
			params: {
				year: true,
				month: false,
				day: false,
				hour: false,
				minute: false,
				second: false
			},
			selectShow: false,

			labelPosition: 'left',
			codeTips: '',
			errorType: ['message'],
		};
	},
	onLoad() {
		let new_arr = []
		this.xuezhi_arr.map((item)=>{
			new_arr.push({'text':item})
		})
		this.actionSheetList = new_arr
		// 初始化时间
		let d = new Date();
		this.startYear = d.getFullYear()-3;
		this.endYear = d.getFullYear();
		
	},
	computed: {
		...mapGetters('config',[
			'xuezhi_arr'
		]),
		borderCurrent() {
			return this.border ? 0 : 1;
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		submit() {
			let _this = this;

			this.$refs.uForm.validate(valid => {
				if (valid) {
					this.$store.dispatch('user/applyCompany',this.model).then((res) => {
						if(res.code == 0 ) {
							_this.$refs.uToast.show({
								title: '申请提交成功',
								duration: 500,
								callback(){
									uni.switchTab({
									    url: '/pages/index/index',
									});
								}
							})
						} else {
							_this.$refs.uToast.show({
								title: res.message
							})
						}
					});
					
				} else {
					
					
					console.log('验证失败');
				}
			});
		},
		// 点击actionSheet回调
		actionSheetCallback(index) {
			uni.hideKeyboard();
			this.model.xuezhi_label = this.actionSheetList[index].text;
			this.model.xuezhi = index;
		},


		// 选择入学年级回调
		gradeConfirm(e) {
			this.model.xuenian = e.year;
		},

		borderChange(index) {
			this.border = !index;
		},
		codeChange(text) {
			this.codeTips = text;
		},
		handleBuilding(){
			uni.navigateTo({
				url:'/pages/index/location?type=1'
			})
		},
		seTaddress(data){
			console.log(data)
			this.model.building = data.address
			this.model.schoolid = data.schoolid
			this.model.building_num = data.buid
		},
		// 获取验证码
		getCode() {
			if(this.$refs.uCode.canGetCode) {
				if(this.model.phone == '') {
					this.$u.toast('手机号为空');
					return false
				}
				// 模拟向后端请求验证码
				uni.showLoading({
					title: '正在获取验证码',
					mask: true
				})
				this.$store.dispatch('config/send_code',{'phone':this.model.phone}).then((res) => {
					if(res.code == 0 ) {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						this.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					} else {
						
					}
				});
				
			} else {
				this.$u.toast('倒计时结束后再发送');
			}
		},
		errorChange(index) {
			if(index == 0) this.errorType = ['message'];
			if(index == 1) this.errorType = ['toast'];
			if(index == 2) this.errorType = ['border-bottom'];
			if(index == 3) this.errorType = ['border'];
		}
	}
};
</script>

<style scoped lang="scss">
	.custom-style {margin: 0 auto; padding: 30rpx 0; border-radius: 200rpx; color: #efefef;width: 100%;background: linear-gradient(to right, #80D0C7, #0093E9);}
	.wrap {
		padding: 30rpx 50rpx;
	}


</style>
