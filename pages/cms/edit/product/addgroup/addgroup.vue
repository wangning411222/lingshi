<template>
	<view class="product">
		<view class="padding-20">
			<view class="d-row d-jc-between" style="border-radius: 5px;border: 1px solid #EAEAEA;background-color: #fff;">
				<view class="biao_01_1">
					<input placeholder="请输入要添加的分组名" v-model="name"/>
				</view>
			
				<view class="biao_02" @click="add_group">
					<view class="biao_01_1" >添加
					</view>
				</view>
			
			</view>
		</view>
		
		<view class="biao">
			<view class="biao_02 padding-30 font30" v-for="(item,index) of groupList" :key="index">
				<view  class="d-row" >
					<view class="flex-1">
						<view class="d-row">
							分类：
							<text v-show="!item.editStatus">{{item.title}}</text>
							<u-input v-show="item.editStatus" v-model="item.title" height="50" type="number" border placeholder="排序"/>
						</view>
						<!-- <view class="d-row padding-top-20" v-show="item.editStatus">
							排序：<u-input v-model="item.rank" height="50" type="number" border placeholder="排序"/>
							<text @tap="saveRank(item)" class="margin-left-20" style="height: 50rpx;line-height: 50rpx; color: #2979ff;">保存</text>
						</view> -->
					</view>
					
					<view>
						<u-icon @click="del(item.cateid,index)" name="trash" color="#ff1d00" style="margin-right: 35rpx;" size="34" ></u-icon>
						<u-icon @click="edit(item)" name="edit-pen" color="#2979ff" size="34" ></u-icon>
						
					</view>
				</view>
				<view class="d-row padding-top-20" v-show="item.editStatus">
					排序：<u-input v-model="item.rank" height="50" type="number" border placeholder="排序"/>
					<text @tap="saveRank(item)" class="margin-left-20" style="height: 50rpx;line-height: 50rpx; color: #2979ff;">保存</text>
				</view>
			</view>
		
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import uniIcon from "@/components/uni/uni-icon/uni-icon.vue"
	import uniPopup from "@/components/uni/uni-popup/uni-popup.vue"

	export default {
		data() {
			return {
				groupList: [
					// {
					// 	id:1,
					// 	name:'123',
					// 	rank:1,
					// 	editStatus:false
						
					// }
				],
				name: '',
			};
		},
		components: {
			uniIcon,
			uniPopup
		},
		onLoad() {
			this.get_groupList()
		},
		onShow() {},
		methods: {
			get_groupList(){
				let _this = this
				this.$store.dispatch('shops/catelist',{}).then((res) => {
					if(res.code == 0 ) {
						res.message.map((item)=>{
							item['editStatus'] = false
						})
						_this.groupList = res.message
					}
				})
			},
			add_group(){
				console.log(this.name)
				if(this.name.trim() == '') {
					this.$refs.uToast.show({
						title: "分类名为空"
					})
					return false
				}
				this.$store.dispatch('shops/cateadd',{'title':this.name}).then((res) => {
					if(res.code == 0 ) {
						this.name = ''
						this.get_groupList()
						this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			edit(item){
				
				item.editStatus = !item.editStatus
			},
			saveRank(item){
				console.log(item)
				// setTimeout(()=>{
				// 	item.editStatus = false
				// },1000)
				this.$store.dispatch('shops/cateedit',{
					'cateid':item.cateid,
					'rank':item.rank,
					'title':item.title}).then((res) => {
					if(res.code == 0 ) {
						item.editStatus = false
						this.$refs.uToast.show({
							title: res.message
						})
					}
				})
			},
			del(id,index) {
				let _this = this
				uni.showModal({
				    title: '提示',
				    content: '确定删除该分类？',
				    success: function (res) {
				        if (res.confirm) {
				            _this.$store.dispatch('shops/catedelete',{'cateid':id,}).then((res) => {
				            	if(res.code == 0 ) {
									_this.groupList.splice(index,1)
				            		_this.$refs.uToast.show({
				            			title: res.message
				            		})
				            	}
				            })
							
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			}
		},
		onPullDownRefresh() {
			this.get_groupList()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 2000);
		}
	}
</script>

<style lang="less">
	page{background-color: #F7F6FB;font-size: 14px;min-height: 100vh;}
	.pic {
		padding: 20upx 10upx;
	}

	.input-view {
		font-size: 28upx;
	}

	.leixin {
		height: 300px;
		width: 50vw;
		overflow: hidden;
		overflow-x: hidden;
		overflow-y: scroll;
	}

	.xuan {
		padding-bottom: 10px;
	}

	.close-view {
		text-align: center;
		line-height: 14px;
		height: 16px;
		width: 16px;
		border-radius: 50%;
		background: #FF5053;
		color: #FFFFFF;
		position: absolute;
		top: -6px;
		right: -4px;
		font-size: 12px;
	}

	.product {
		background-color: #F7F6FB;
		height: 100%;

		.head {
			position: relative;
			padding: 0 5px;
		}

		.head img {
			width: 100%;
			height: 150px;
		}

// 		.btn {
// 			position: absolute;
// 			top: 10px;
// 			right: 5px;
// 		}
// 
// 		.btn button {
// 			font-size: 10px;
// 			color: red;
// 			border: none;
// 			border-radius: 20px;
// 			background-color: #CBCBCB;
// 			padding: 5px;
// 		}
// 
		.top {
			box-shadow: 0 0 8px 5px #EDEDED;
			height: 1px;
			background-color: #EDEDED;
		}

		.pro_tit {
			padding: 15px 10px 10px;
			border-bottom: 1px solid #EDEDED;
		}

		.BH {
			height: 5px;
			background-color: #F2F2F2;
		}

		.biao {
			background-color: #fff;
			margin: 0 10px 10px;
			border-radius: 5px;
			border: 1px solid #EAEAEA;
		}

// 		.biao span {
// 			color: red;
// 			padding-right: 5px;
// 		}
// 
		.biao textarea {
			width: 100%;
			border-bottom: 1px solid #EDEDED;
			padding: 10px;
			height: 100px;
		}

		.biao_01 {
			padding: 10px 10px 10px;
			border-bottom: 1px solid #EDEDED;
			display: flex;
		}

		.biao_01_l {
			padding-top: 7px;
			flex-shrink: 0;
		}

		.biao_01_1 {
			padding: 10px;
		}

		.biao_01_r {
			flex-grow: 1;
		}

		.biao_01_r text {
			padding-right: 10px;
		}

		.biao_02_r select {
			padding: 0 10px;
			line-height: 25px;
			min-width: 80px;
			text-align: center;
		}

		.biao_01_m {
			border-right: 1px solid #EDEDED;
		}

		.biao_02 {
			
			border-bottom: 1px solid #EDEDED;
			// display: flex;
			// justify-content: space-between;
		}

		.biao_03 {
			padding: 13px 10px 10px;
			border-bottom: 1px solid #EDEDED;
			display: flex;
		}

		.biao_04 {
			display: flex;
			padding: 10px 10px 10px;
			border-bottom: 1px solid #EDEDED;
		}

		.biao_04_l {
			display: flex;
			width: 50%;
			line-height: 30px;
			padding-right: 10px;
		}

		.biao_04_l_i {
			flex-shrink: 1;
		}

		.biao_04_l_1 {
			flex-shrink: 0;
		}

		.biao_05 {
			padding: 10px 10px 0;
		}

		.jgkc {
			padding: 15px 10px;
			border-bottom: 1px solid #EDEDED;
		}

		.p_btn {
			background: #F7F6FB;
			padding: 0 10px 0px;
			position: fixed;
			bottom: 0;
			width: 100%;
			z-index: 9999;
		}

		.pro_btn {
			background-color: #E5E5E5;
			padding: 10px;
			text-align: center;
			border-radius: 20px;
			background-color: #DF421D;
			color: #fff;
			width: 94%;
		}

		.guige {
			border: 1px solid #EDEDED;
			margin: 10px 20px 5px 10px;
			position: relative;
		}

		.stop {
			position: absolute;
			right: -15px;
			top: 60px;
		}

		.stop img {
			width: 30px;
			height: 30px;
		}

		.uni-input-input,
		.uni-input {
			height: 30px;
			line-height: 30px;
		}
	}
</style>
