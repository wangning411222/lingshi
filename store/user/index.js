import { post, get, wx_pay, showToast } from '../../tools/utils.js'
const state = {
	isAuthorized: false,
	userInfo: {
		uid:0,
		token:''
	}
}

const getters = {
	userInfo (state) {
		return state.userInfo
	},
	isAuthorized (state) {
		return state.isAuthorized
	}
}
const mutations = {
	setUserInfo (state,userInfo) {
		uni.setStorageSync('userInfo',userInfo)
		state.userInfo = userInfo
	},
	setAuthorized (state, isAuthorized) {
		state.isAuthorized = isAuthorized
	}
    
}
const actions = {
	getUserInfo ({commit}, data) {
		data = data || '';
		let userInfo = uni.getStorageSync('userInfo');

		if(data == '') {
			if(userInfo != null) {
				commit('setUserInfo',userInfo)
				if(userInfo.avatar_url_fmt == '') {
					commit('setAuthorized',false)
				} else {
					commit('setAuthorized',true)
				}
				return;
			}
		}
		return new Promise((resolve) => {
			console.log('start');
			post('user/info',data,false).then((res)=> {
				
				if(res.code==0) {
					
					commit('setUserInfo',res.data)
					
					if(res.data.avatar_url_fmt == '') {
						commit('setAuthorized',false)
					} else {
						commit('setAuthorized',true)
					}
					resolve(res)
                    
				}
			})
		})
	},
	setPhoneNum({commit}, data) {
		console.log('phone start.');
		return new Promise((resolve, reject) => {
			post('user/wxphone',data,false).then((res)=> {
				console.log(res);
				if(res.code==0) {
					//手机号
					resolve(res)
				} else {
					reject();
				}
			})
		})
	},
	
	getRead({state}, data) {
		return new Promise((resolve) => {
			post('user/read', data).then((res) => {
				resolve(res)
			})
		})
	},
	updateInfo({state}, data) {
		return new Promise((resolve) => {
			post('user/update', data).then((res) => {
				resolve(res)
			})
		})
	},
	// 申请开店
	applyCompany({state}, data) {
		return new Promise((resolve) => {
			post('user/apply_company', data).then((res) => {
				resolve(res)
			})
		})
	},
	// 附近学校列表
	schoolList({state}, data) {
		return new Promise((resolve) => {
			post('user/school_list', data).then((res) => {
				resolve(res)
			})
		})
	},
	// 意见反馈
	userSuggest({state}, data) {
		return new Promise((resolve) => {
			post('user/suggest', data).then((res) => {
				resolve(res)
			})
		})
	},
  postMylist({state}, data) {
		return new Promise((resolve) => {
			post('post/mylist', data).then((res) => {
				resolve(res)
			})
		})
	},
  postDelete({state}, data) {
		return new Promise((resolve) => {
			post('post/delete', data).then((res) => {
				resolve(res)
			})
		})
	},
}



export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
