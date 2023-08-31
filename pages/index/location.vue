<template>
	<view>
		<view class="padding-20">
			<u-search placeholder="搜索学校" v-model="keyword" 
			:clearabled="true" 
			@custom="tosearch" 
			@blur="changeSearchShow(1)"
			@focus="changeSearchShow(2)" 
			@clear="changeSearchShow(3)"></u-search>
		</view>
		<view v-if="!search_show">
			<view class="padding-20">
				<view>
					<view class="gray3 margin-bottom-20">当前定位</view>
					<view class="d-row">
						<u-icon name="map" color="#df691a" size="32"></u-icon>
						<view class="flex-1 font-bold">{{address || '未知地点'}}</view>
						<view class="gray3" @tap="relocation">重新定位</view>
					</view>
				</view>
			</view>
			<u-gap height="15" bg-color="#efefef"></u-gap>
			<view class="padding-20">
				<view class="gray3 padding-bottom-20">附近学校</view>
				<u-line color="#efefef" />
				<view>
					<!-- <navigator v-for="(item,index) in schoolList" :key="index" :url="'/pages/index/floor?title='+item.title">
						
					</navigator> -->
					<view v-for="(item,index) in schoolList" :key="index" @tap="handlebuilding(index)" class="d-row padding-top-20 padding-bottom-20">
						<view class="flex-1 font-bold">
							{{item.name}}
						</view>
						<view class="gray3">{{item.distance}}</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="search_show">
			<view v-for="(item,index) in searchList" :key="index" @tap="handlebuilding(index)" class="d-row padding-20">
				<view class="flex-1 font-bold">
					{{item.name}}
				</view>
				<view class="gray3">{{item.distance}}</view>
			</view>
		</view>
		
		<u-select v-model="activeSchoolShow" :list="activeSchool" @confirm="confirm"></u-select>
	</view>
</template>

<script>
	import {goBack,setLocalStorage} from '@/tools/utils.js';
	export default {
		data() {
			return {
				keyword:'',
				search_show:false,
				
				latitude: 0,
				longitude: 0,
				
				address: '',
				schoolList:[],
				
				activeSchoolShow:false,
				activeSchool:[],
				activeSchoolIndex:0,
				
				searchList:[],
				
				type:1
			}
		},
		onLoad(option) {
			this.type = option.type
			this.getLocation();
		},
		methods: {
			getLocation() {
				let _this = this;
        console.log('222222222222')
				uni.getLocation({
					type: 'gcj02',
					geocode: true,
					success: function(res) {
						console.log('当前位置的经度：' + res.longitude);
						console.log('当前位置的纬度：' + res.latitude);
						_this.latitude = res.latitude;
						_this.longitude = res.longitude;
						
						_this.getSchool({'latitude':res.latitude,'longitude':res.longitude},0)
						
						uni.request({
							header: {
								"Content-Type": "application/text"
							},
							//注意:这里的key值需要高德地图的 web服务生成的key  只有web服务才有逆地理编码  IUPBZ-2YKKF-H6UJW-NDQUP-SG33J-WNF63
							// url:'https://restapi.amap.com/v3/geocode/regeo?output=JSON&location='+res.longitude+','+res.latitude+'&key=280802ed0116fef931dbcf5e7e9278d7&radius=1000&extensions=all',
							url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + _this.latitude +
								',' + _this.longitude + '&key=2W4BZ-CZNWO-GQUWR-SK4LN-W3CJV-7WF6O',
							success(res) {

								if (res.statusCode === 200) {
									_this.address = res.data.result.address
									
								} else {
									console.log("获取信息失败，请重试！")
								}
							}
						});
					},
          fail:function(err){
            console.log(err,'rrrrrrrrrrrrrrrrrrrrrrrrrr')
          }
				});
			},
			getSchool(data,type,callback=()=>{}){
				let _this = this;
				_this.$store.dispatch('user/schoolList',data).then((res) => {
					if(res && res.code == 0 ) {
						if(type == 0) {
							_this.schoolList = res.message
						} else if(type == 1) {
							_this.searchList = res.message
						}

					} else {
				
						
					}
				});
			},
			relocation() {
				this.getLocation()
			},
			changeSearchShow(type){
				if(type == 1) {
					if(this.keyword == '') {
						this.search_show = false
						this.searchList = []
					} else {
						this.search_show = true
					}
				} else if(type == 2) {
					this.search_show = true
				} else if(type == 3) {
					this.search_show = false
					this.searchList = []
				}
				
			},
			tosearch() {
				this.getSchool({'keyword': this.keyword},1)
			},
			handlebuilding(index){
				let list = [];
				this.schoolList[index]['building'].map((item,index)=>{
					list.push({value: index,label:item})  
				})
				this.activeSchool = list
				this.activeSchoolIndex = index
				setTimeout(()=>{
					this.activeSchoolShow = true
				},10)
			},
			confirm(e) {
				
				let floor = e[0]['label']
				let {name,schoolid} = this.schoolList[this.activeSchoolIndex]
				let address = floor+' '+name
				
				// 调用上一个页面的 uplist 方法 
				goBack('seTaddress',{'schoolname': name,'floor': floor,'address': address,'schoolid':schoolid,'buid':e[0]['value']})
				
				if(this.type == 0) {
					setLocalStorage('address', {'address': address,'schoolid':schoolid,'buid':e[0]['value']})
				}
			}
		}
	}
</script>

<style>

</style>
