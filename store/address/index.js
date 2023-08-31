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
	// 添加/编辑地址
	addresssave({state}, data) {
		return new Promise((resolve) => {
			post('address/save',data).then((res) => {
				resolve(res);
			})
		})
	},
	// 地址列表
	addresslist({state}) {
		return new Promise((resolve) => {
			get('address/list').then((res) => {
				resolve(res);
			})
		})
	},
	// 地址删除
	addressdelete({state}, data) {
		return new Promise((resolve) => {
			post('address/delete',data).then((res) => {
				resolve(res);
			})
		})
	},
	// 地址详情
	addressdelete({state}, data) {
		return new Promise((resolve) => {
			post('address/delete',data).then((res) => {
				resolve(res);
			})
		})
	}
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
