<template>
	<view class="padding-20">
		<view class="bg-color-white border-radius-10 padding-30">
			<u-form :model="form" ref="uForm" :rules="rules" label-position="top">
				<u-form-item label="类型">
					<u-radio-group v-model="form.type" @change="radioGroupChange">
						<u-radio name="0">无限券数</u-radio>
						<u-radio name="1">指定券数</u-radio>
					</u-radio-group>
				</u-form-item>
				
				<u-form-item v-if="form.type == 1" label="库存" prop="stock">
					<u-input v-model="form.stock" type="number" />
				</u-form-item>

				<u-form-item label="优惠金额(元)" prop="rmbs">
					<u-input v-model="form.rmbs"  placeholder="优惠金额"/>
				</u-form-item>

				<u-form-item label-width="200" label="使用条件金额(元)" prop="need_rmbs">
					<u-input v-model="form.need_rmbs" placeholder="满多少金额可优惠"/>
				</u-form-item>
				<u-form-item label="生效时间">
					<view class="d-row">
						<view>
							<picker mode="date" :value="form.coupon_start_time" @change="bindTimeChange">
								<view class="uni-input">{{form.coupon_start_time}}</view>
							</picker>
						</view>
						<view class="padding-left-50 padding-right-50">-</view>
						<view>
							<picker mode="date" :value="form.coupon_end_time" @change="bindTimeChange2">
								<view class="uni-input">{{form.coupon_end_time}}</view>
							</picker>
						</view>
					</view>
					
				</u-form-item>
				<u-form-item label="备注">
					<u-input v-model="form.remark" />
				</u-form-item>
				
				
			</u-form>
			<view style="height: 80px;"></view>
			<view class="p_btn">
				<view class=" flex flex-direction">
					<button @click="submit" class="colorWhite bg-red margin-tb-sm lg">提交</button>
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {mapGetters } from 'vuex'

	export default {
		data() {
			return {
				btn_state: 0,
				form: {
					type:0,
					stock:0,
					rmbs:'',
	
					need_rmbs:'',
					remark:'',

					
					coupon_start_time:'',
					coupon_end_time:'',

				},
				rules: {
					stock: [
						{
							required: true,
							message: '请输入库存数量',
							trigger: 'blur'
						}
					],
					rmbs : [
						{
							required: true,
							message: '请输入优惠金额',
							trigger: 'blur'
						},
					],

					need_rmbs : [
						{
							required: true,
							message: '请输入满多少金额可优惠',
							trigger: 'blur'
						},
					]
				},
			};
		},
		onLoad(option) {
			uni.setNavigationBarTitle({
			    title: option.title
			});
			if(option.item) {
				this.btn_state = 1
				let item = JSON.parse(option.item)
				this.form = {
					couponid: item.couponid,
					type: item.type,
					stock: item.stock,
					rmbs: item.rmbs,
					need_rmbs: item.need_rmbs,
					remark: item.remark,
					coupon_start_time: item.coupon_start_time,
					coupon_end_time: item.coupon_end_time
				}
			}
			
			
			let date = new Date()
			let y = date.getFullYear();
			let m = date.getMonth() + 1;
			let d = date.getDate();
			this.form.coupon_start_time = y+'-'+m+'-'+d
			this.form.coupon_end_time = y+'-'+m+'-'+d
			this._load()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			_load(callback = ()=>{}) {
				let _this = this;
				
			},
			radioGroupChange(e) {
				console.log(e);
			},
			bindTimeChange: function(e) {
				this.form.coupon_start_time = e.target.value
			},
			bindTimeChange2: function(e) {
				this.form.coupon_end_time = e.target.value
			},

			submit (){
				let _this = this;

				this.$refs.uForm.validate(valid => {
					if (valid) {
						if(this.btn_state == 0) {
							_this.$store.dispatch('shops/couponadd',this.form).then((res) => {
								if(res.code == 0 ) {
									_this.$refs.uToast.show({
										title: '提交成功',
										callback(){
											uni.navigateBack()
										}
									})
								}
							});
						} else {
							_this.$store.dispatch('shops/couponedit',this.form).then((res) => {
								if(res.code == 0 ) {
									_this.$refs.uToast.show({
										title: '提交成功',
										callback(){
											uni.navigateBack()
										}
									})
								}
							});
						}
						
						
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
