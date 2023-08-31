import {post,get} from '../../tools/utils.js'
const state = {
	config: {},
	swiperList: [],
	cate_list:[]
}

const getters = {
	config(state) {
		return state.config
	},
	swiperList(state) {
		return state.swiperList
	},
	cate_list(state) {
		return state.cate_list
	}
	
	
}

const actions = {
	// 商家回复
	postReplay({state}, data) {
		return new Promise((resolve) => {
			post('post/replay',data).then((res) => {
				resolve(res);
			})
		})
	},
	// 评论列表
	postList({state}, data) {
		return new Promise((resolve) => {
			post('post/list',data).then((res) => {
				resolve(res);
			})
		})
	},
	// 删除评论
	postDelete({state}, data) {
		return new Promise((resolve) => {
			post('post/delete',data).then((res) => {
				resolve(res);
			})
		})
	},
	// 评论
	postCreate({state}, data) {
		return new Promise((resolve) => {
			post('post/create',data).then((res) => {
				resolve(res);
			})
		})
	},
	// 门店编辑
	companyUpdate({state}, data) {
		return new Promise((resolve) => {
			post('company/update',data).then((res) => {
				resolve(res);
			})
		})
	},
	// 门店信息
	companyread({state}) {
		return new Promise((resolve) => {
			get('company/read').then((res) => {
				resolve(res);
			})
		})
	},
	
	// 商品分类列表
	catelist({state}, data){
		return new Promise((resolve,reject)=>{
			post('cate/list',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 商品分类添加
	cateadd({state}, data){
		return new Promise((resolve,reject)=>{
			post('cate/add',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 商品分类删除
	catedelete({state}, data){
		return new Promise((resolve,reject)=>{
			post('cate/delete',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 商品分类编辑
	cateedit({state}, data){
		return new Promise((resolve,reject)=>{
			post('cate/edit',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 商品列表
	goodsmylist({state}, data){
		return new Promise((resolve,reject)=>{
			post('goods/mylist',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 商品详情
	goodsread({state}, data){
		return new Promise((resolve,reject)=>{
			post('goods/read',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 商品添加
	goodsadd({state}, data){
		return new Promise((resolve,reject)=>{
			post('goods/add',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 商品编辑
	goodsedit({state}, data){
		return new Promise((resolve,reject)=>{
			post('goods/edit',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 商品删除
	goodsdelete({state}, data){
		return new Promise((resolve,reject)=>{
			post('goods/delete',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 商品上架下架
	goodsischeck({state}, data){
		return new Promise((resolve,reject)=>{
			post('goods/ischeck',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 优惠券添加
	couponadd({state}, data){
		return new Promise((resolve,reject)=>{
			post('coupon/add',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 优惠券列表
	couponlist({state}){
		return new Promise((resolve,reject)=>{
			get('coupon/list').then((res)=>{
				resolve(res)
			})
		})
	},
	// 优惠券详情
	couponread({state}, data){
		return new Promise((resolve,reject)=>{
			post('coupon/read',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 优惠券功能开关
	couponisclose({state}, data){
		return new Promise((resolve,reject)=>{
			post('coupon/isclose',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 优惠券编辑
	couponedit({state}, data){
		return new Promise((resolve,reject)=>{
			post('coupon/edit',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 领券中心
	couponCenter({state}, data){
		return new Promise((resolve,reject)=>{
			post('user/coupon_center',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 领取优惠券
	couponGet({state}, data){
		return new Promise((resolve,reject)=>{
			post('user/coupon_get',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 我的优惠券
	mycoupon({state}, data){
		return new Promise((resolve,reject)=>{
			get('user/mycoupon',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 首页店铺列表
	companyList({state}, data){
		return new Promise((resolve,reject)=>{
			post('user/company_list',data,false).then((res)=>{
				resolve(res)
			})
		})
	},
	// 店铺主页
	companyRead({state}, data){
		return new Promise((resolve,reject)=>{
			post('user/company_read',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 商品搜索
	companySearch({state}, data){
		return new Promise((resolve,reject)=>{
			post('user/search',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 店铺交易数据
	companyStatistics({state}, data){
		return new Promise((resolve,reject)=>{
			post('company/statistics',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 订单列表
	companyorderlist({state}, data){
		return new Promise((resolve,reject)=>{
			post('company/orderlist',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 确认收货
	companyorderupdate({state}, data){
		return new Promise((resolve,reject)=>{
			post('company/orderupdate',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 平台货物列表
	companyplatform_goodslist({state}, data){
		return new Promise((resolve,reject)=>{
			post('company/platform_goodslist',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 进货下单
	companyorderadd({state}, data){
		return new Promise((resolve,reject)=>{
			post('company/orderadd',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 进货订单支付
	companyorderpay({state}, data){
		return new Promise((resolve,reject)=>{
			post('company/orderpay',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 进货订单列表
	companyorder_list({state}, data){
		return new Promise((resolve,reject)=>{
			post('company/order_list',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 进货订单详情
	companyorderread({state}, data){
		return new Promise((resolve,reject)=>{
			post('company/orderread',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 提现列表
	moneyWithdrawList({state}, data){
		return new Promise((resolve,reject)=>{
			post('money/withdraw_list',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 收入记录
	moneyMoneyLog({state}, data){
		return new Promise((resolve,reject)=>{
			post('money/money_log',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 提现申请
	moneywithdraw({state}, data){
		return new Promise((resolve,reject)=>{
			post('money/withdraw',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 创建订单
	addorder({state}, data){
		return new Promise((resolve,reject)=>{
			post('order/add',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 默认地址
	addressdefault({state}, data){
		return new Promise((resolve,reject)=>{
			post('address/default',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 支付接口
	pay({state}, data){
		return new Promise((resolve,reject)=>{
			post('order/pay',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 订单列表
	orderlist({state}, data){
		return new Promise((resolve,reject)=>{
			post('order/list',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 订单详情
	orderread({state}, data){
		return new Promise((resolve,reject)=>{
			post('order/read',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 订单操作【取消+确认收货】
	orderupdate({state}, data){
		return new Promise((resolve,reject)=>{
			post('order/update',data).then((res)=>{
				resolve(res)
			})
		})
	},
	
}

const mutations = {
	closeNotice(state) {
		uni.setStorageSync('noticemd5', state.config.noticemd5)
		state.isNotice = false
	},
	addConfig(state, data) {
		state.config = { ...state.config,
			...data
		}
	},
	setUrl(state, url) {
		state.url = url
	},
	setSys(state, data) {
		state.sys = Object.assign(state.sys, data)
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
