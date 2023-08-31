<template>
	<view class="padding-30">
		<u-form :model="form" ref="uForm" :rules="rules" label-width="150">
			<u-form-item label="商品图">
				<u-upload :action="upimgUrl"
				@on-change="handleupimg"
				 :file-list="fileList"
				 ref="uUploadLogo" width="160" height="160" multiple='false' upload-text="商品图" max-count="1"></u-upload>
			</u-form-item>
			<u-form-item label="商品名称" prop="goods_name">
				<u-input v-model="form.goods_name" />
			</u-form-item>
			
			<u-form-item label="类型" prop="cate">
				<u-input 
				type="select" 
				:select-open="actionSheetShow" 
				v-model="form.cate" 
				@click="actionSheetShow = true" placeholder="请选择类型"></u-input>
			</u-form-item>
			
			<u-form-item label="销售价格" prop="price">
				<u-input v-model="form.price" />
			</u-form-item>
			<u-form-item label="库存" prop="stock">
				<u-input type="number" v-model="form.stock" />
			</u-form-item>

			<u-form-item label="商品规格">
				<u-input v-model="form.goods_desc" />
			</u-form-item>
		</u-form>
		<view style="height: 80px;"></view>
		<view class="p_btn">
			<view class="flex flex-direction">
				<button v-if="goods_id == ''" @click="submit" class="colorWhite subbtn margin-tb-sm lg">提交</button>
				<button v-if="goods_id != ''" @click="submit_ed" class="colorWhite subbtn margin-tb-sm lg">保存</button>
				
			</view>
		</view>
		<u-select v-model="actionSheetShow" :list="catelist" @confirm="confirm"></u-select>
		
		<u-mask :show="loadingmask">
			<view class="warp text-center d-row d-ai-centen" style="height: 100%;">
				<view class="flex-1"><u-loading size="56" color="orange"></u-loading></view>
			</view>
		</u-mask>
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
				loadingmask: false,
				goods_id:'',
				fileList: [],
				actionSheetShow: false,
				form: {
					goods_id:'',
					goods_pic:'',
					goods_name:'',
					price:'',
					stock:0,
					
					goods_desc:'',
					
					cateid:0,
					cate:'',
				},
				rules: {
					goods_name: [
						{
							required: true,
							message: '请输入名称',
							trigger: 'blur'
						}
					],
					cate: [
						{
							required: true,
							message: '请选择类型',
							trigger: 'change'
						}
					],
					price : [
						{
							required: true,
							message: '请输入价格',
							trigger: 'blur'
						},
					],
					stock : [
						{
							required: true,
							message: '请输入库存',
							trigger: 'blur'
						},
					],
					goods_desc : [
						{
							required: true,
							message: '请输入商品规格/简介',
							trigger: 'blur'
						},
					]
				},
				catelist:[]
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
			
			if(option && option.goods_id) {
				this.goods_id = option.goods_id
				uni.setNavigationBarTitle({
				    title: "编辑商品"
				});
				this.loadingmask = true
				this.get_goodsread(option.goods_id,()=>{
					this.loadingmask = false
				})
			}
			this.get_groupList()
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			get_goodsread(goods_id,callback){
				let _this = this
				this.$store.dispatch('shops/goodsread',{'goods_id':goods_id}).then((res) => {
					if(res.code == 0 ) {
						let form = {
							goods_id: res.message.goods_id,
							goods_pic:res.message.goods_pic,
							goods_name:res.message.goods_name,
							price:res.message.price,
							stock:res.message.stock,
							
							goods_desc:res.message.goods_desc,
							
							cateid:res.message.cateid,
							cate:res.message.cate_title,
						}
						_this.fileList = [{url:res.message.goods_pic}]
						_this.form = form
						
						
					}
					callback()
				})
			},
			get_groupList(){
				let _this = this
				this.$store.dispatch('shops/catelist',{}).then((res) => {
					if(res.code == 0 ) {
						let cate_arr = []
						res.message.map((item)=>{
							cate_arr.push({
								value: item.cateid,
								label: item.title
							})
						})
						_this.catelist = cate_arr
					}
				})
			},
			handleupimg(e){
				let res = JSON.parse(e.data)
				if(res.code == 0){
					this.form.goods_pic = res.message.url
				}
			},
			confirm(e) {

				this.form.cate = e[0]['label']
				this.form.cateid = e[0]['value']
			},
			submit (){
				let _this = this;
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.$store.dispatch('shops/goodsadd',this.form).then((res) => {
							if(res.code == 0 ) {
								_this.$refs.uToast.show({
									title: '提交成功',
									duration:1000,
									callback(){
										uni.navigateBack()
									}
								})
							} else {
								_this.$refs.uToast.show({
									title: res.message,
									duration:1000
								})
							}
						});
					} else {
						console.log('验证失败');
					}
				});
			}, 
			submit_ed() {
				let _this = this;
				this.$refs.uForm.validate(valid => {
					if (valid) {
						this.$store.dispatch('shops/goodsedit',this.form).then((res) => {
							if(res.code == 0 ) {
								_this.$refs.uToast.show({
									title: '修改成功',
									duration:1000,
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
	.subbtn { background-color: #ff6634; }
</style>
