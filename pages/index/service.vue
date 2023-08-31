<template>
	<view>
		<view v-show="!loadingmask">
			<view class="d-row padding-20 bg-color-white" style="position: sticky; top: 0; z-index: 10;">
				<view class="flex-1" style="align-self: center;">
					<navigator class="width100" url="location?type=0">
						<view>
							<u-icon name="map-fill" color="#90D4DD" size="38" style="vertical-align: middle;"></u-icon>
							<text class="school_title">{{ address }}</text>
							<u-icon name="arrow-right" color="#aaaaaa" size="28" style="vertical-align: middle;">
							</u-icon>
						</view>
					</navigator>
				</view>

			</view>
			<view class="padding-20" style="background-color: #f3f3f3;">
				<!-- 轮播图 -->
				<view class="banner-image">
					<u-swiper :list="swiperList" height="220" mode="dot" border-radius="20" @click="swiperUrl"></u-swiper>
				</view>

				<!-- 跑腿 -->

				<!-- <view class="text-center margin-top-60">
					<view class="font-bold font38" style="letter-spacing: 8rpx;">速送服务</view>
					<view>
						<text class="font22 se_title">
							<text class="se_title_bg">极速送达的校园跑腿员</text>
						</text>
					</view>
				</view> -->
				<u-image width="100%" height="150rpx" src="../../../static/title2.png"></u-image>
				<view v-if="service_list.length == 0"
					class="text-center width100 boxshadow bg-color-white padding-top-60 padding-bottom-60"
					style="position: relative; min-height: 200rpx;">
					<view class="gray3 margin-bottom-50">本楼暂无校园团购</view>
					<view>
						<navigator url="service_form" style="display: inline-block;">
							<view class="custom-style">
								<view>申请校园团购</view>
								<view class="font22">每楼限量经营 先到先得</view>
							</view>
						</navigator>
					</view>
				</view>
				<view class="width100 boxshadow d-row bg-color-white padding-20"
					style="position: relative; margin-top: 15rpx; min-height: 200rpx;" v-for="(item, index) in service_list"
					:key="index" @tap="intoDetails(item)">
					<view class="status" :class="[item.business_status == 0 ? 'status1' : 'status0']">
						<text v-if="item.business_status == 0">营业中</text>
						<text v-if="item.business_status == 1">已打烊</text>
					</view>
					<view class="s-head ">
						<u-image :src="item.logo" width="140rpx" height="140rpx" mode="aspectFill" border-radius="10"
							:lazy-load="true"></u-image>
					</view>
					<view class="s-detail padding-left-20">
						<view class="font-bold font32">{{ item.name }}</view>
						<view class="font22 gray3 margin-top-10">{{ item.address }}</view>
						<view class="font22 gray3 margin-top-10">
							<text class="margin-right-20">{{ item.total_dishes }}种商品</text>
							<text>已售{{ item.sales }}</text>
						</view>
						<view class="d-row d-jc-between font22 gray3 margin-top-10">
							<view>起送 ¥{{ item.start_delivery_rmbs }} | 配送 ¥{{ item.delivery_rmbs }}</view>
							<!-- <view>{{item.sj}}分钟 {{item.jl}}m</view> -->
						</view>
						<view class="margin-top-20 d-row" @tap.stop="handelNotice(index, 1)">
							<view style="align-self: center;">
								<image src="../../static/notice.png" mode="widthFix" style="width: 25rpx;"></image>
							</view>
							<view class="font26 gray3 flex-1 padding-left-10" style="align-self: center;">
								<view class="ellipsis" :class="[!item.nt_status ? 'active' : '']">{{ item.notice }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-toast ref="uToast" />
		<u-mask :show="loadingmask" :custom-style="{ background: 'rgba(255, 255, 255, 1)' }">
			<view class="warp text-center d-row d-ai-centen" style="height: 100%;">
				<view class="flex-1">
					<!-- <u-loading size="56" color="#80D0C7"></u-loading> -->
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
import {
	mapGetters
} from 'vuex'
import {
	getLocalStorage
} from '@/tools/utils.js';

import shopData from '@/common/shop.data.js';
export default {
	computed: {
		...mapGetters('config', [
			'swiperList'
		])
	},
	data() {
		return {
			loadingmask: true,
			address_arr: {},
			address: '定位',


			shop_list: [],
			service_list: [],
		}
	},
	onLoad() {
		let _this = this;
		this.$store.dispatch('login/checkLogin').then((res) => {
			if (res && res.code != 0) {
				_this.$refs.uToast.show({
					title: "登录失败",
				})
			} else {


			}
		});


	},
	onShow() {
		// 获取本地存储地址
		this.address_arr = getLocalStorage('address')
		this.address = this.address_arr['address']
		console.log(this.address_arr);

		if (this.address_arr && this.address_arr.schoolid) {

			this.getCompanyList(this.address_arr.schoolid, this.address_arr.buid)
		} else {
			this.loadingmask = false
		}
	},
	methods: {
		swiperUrl(index) {

			if (this.swiperList[index]['url']) {
				uni.navigateTo({
					url: this.swiperList[index]['url']
				})
			}
		},
		getCompanyList(schoolid, building_num) {
			let _this = this
			this.loadingmask = true
			this.$store.dispatch('shops/companyList', {
				'schoolid': schoolid,
				'building_num': building_num
			}).then((res) => {
				if (res.code == 0) {
					res.message.shop_list.map((item) => {
						item['nt_status'] = false
					})
					_this.shop_list = res.message.shop_list

					res.message.service_list.map((item) => {
						item['nt_status'] = false

					})
					_this.service_list = res.message.service_list
				}
				setTimeout(() => {
					this.loadingmask = false
				}, 300)
			});
		},
		seTaddress(data) {
			this.address_arr = data
			this.address = data.address

			this.getCompanyList(this.address_arr.schoolid, this.address_arr.buid)
		},
		intoDetails(item) {
			console.log(item, 'item``````````````````')
			uni.navigateTo({
				url: '../store/index?item=' + JSON.stringify(item),
				animationType: 'pop-in',
				animationDuration: 2000
			})
		},

		handelNotice(index, type) {
			if (type == 0) {
				this.shop_list[index]['nt_status'] = !this.shop_list[index]['nt_status']
			} else {
				this.service_list[index]['nt_status'] = !this.service_list[index]['nt_status']
			}
		},

	}
}
</script>

<style>
image {
	will-change: transform;
	width: auto;
	height: auto;
}

page {
	background-color: #f3f3f3;
}

.custom-style {
	margin: 0 auto;
	padding: 15rpx 0;
	border-radius: 200rpx;
	color: #efefef;
	width: 400rpx;
	background: linear-gradient(to right, #80D0C7, #0093E9);
}

.status {
	position: absolute;
	right: 0;
	z-index: 2;
	border-radius: 20rpx 0 0 20rpx;
	padding: 6rpx 20rpx;
	display: inline-block;
	font-size: 19rpx;
	color: #FFFFFF;
}

.status1 {
	background: linear-gradient(to right, #80D0C7, #0093E9);
}

.status0 {
	background: linear-gradient(to right, #cccccc, #ada9a9);
}

.school_title {
	vertical-align: middle;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	display: inline-block;
}

.title {
	font-size: 30rpx;
	font-weight: bold;
	margin-top: 10rpx;
}

.banner-image {

	margin-bottom: 20rpx;
	width: 100%;
	border-radius: 0 0 50rpx 50rpx;
}

.se_title {
	display: inline-block;
	position: relative;
	height: 15rpx;
	vertical-align: bottom;
	background-image: linear-gradient(to right, #80D0C7, #0093E9);
}

.se_title_bg {
	position: relative;
	top: -13rpx;
}

.s-head {
	width: 140rpx;
	padding-top: 8rpx;
}

.s-head-img {
	width: 140rpx;
	height: 140rpx;
	/* border: 1rpx solid #efefef; */
}

.s-detail {
	flex: 1;
}

.ellipsis {
	line-height: 1.3rem;
}

.ellipsis.active {
	width: 450rpx;

	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
