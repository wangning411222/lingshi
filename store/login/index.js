import Vue from 'vue';
import {post,get,showToast} from '../../tools/utils.js'
const state = {}

const getters = {

}

const actions = {
	wxappLogin({commit,dispatch}) {
		return new Promise((resolve) => {
			uni.login({
				provider: 'weixin',
				success: function(res) {
					
					post('index/login', {
						code: res.code
					}, false).then((res) => {
						if (res.code == 0) {
							console.log(res.message);
							commit('user/setUserInfo', res.message, {
								root: true
							});
							if (res.message.avatar_url_fmt != '') {
								commit('user/setAuthorized', true, {
									root: true
								});
							}
							resolve(res);
						} else {
							resolve(res);
							console.log(res.message);
							//showToast(res.message); //弹出错误信息
						}
					});
				}
			});
		})
	},
	//检查登录token是否过期
	checkLogin({
		commit,
		dispatch
	}) {
		return new Promise((resolve) => {
			let userInfo = uni.getStorageSync('userInfo');
			if (userInfo != null && userInfo.token) {
				get('index/checklogin', { token: userInfo.token }, false).then((res) => {
						if (res.code != 0) {
							uni.removeStorageSync('userInfo')
							dispatch('wxappLogin').then((res) => {
								resolve(res);
							})
						} else {
							commit('user/setUserInfo', userInfo, {
								root: true
							});
							if (userInfo.avatar_url_fmt != '') {
								commit('user/setAuthorized', true, {
									root: true
								});
							}
							resolve(res);
						}
					});
			} else {
				dispatch('wxappLogin').then((res) => {
					resolve(res);
				})
			}
		})
	},
	//检查登录token是否过期
	onlyCheckLogin({ commit, dispatch }) {
		return new Promise((resolve) => {
			let userInfo = uni.getStorageSync('userInfo');
			if (userInfo != null && userInfo.token) {
				post('index/checklogin', { token: userInfo.token }, false).then((res) => {
						if (res.code != 0) {
							// 未登录
							uni.removeStorageSync('userInfo')
							resolve(res);
						} else {
							// 已登录
							resolve(res);
						}
					});
			} else {
				// 未登录
				resolve({code:-1,message:'未登录'});
			}
		})
	},
	updateUserInfo({commit, dispatch}, data) {
		return new Promise((resolve) => {
			uni.checkSession({
				success() {
					post('user/info', data)
						.then((res) => {
							if (res.code == 0) {
								console.log(res);
								commit('user/setUserInfo', res.message, {
									root: true
								});
								if (res.message.avatar_url_fmt != '') {
									commit('user/setAuthorized', true, {
										root: true
									});
								}

								resolve()
							}
						});
				},
				fail() {
					dispatch('wxappLogin').then(() => {
						post('user/info', data)
							.then((res) => {
								if (res.code == 0) {
									commit('user/setUserInfo', res.message, {
										root: true
									});

									resolve()
								}
							});
					})
				}
			})
		})
	},
	updateMobile({
		state,
		dispatch
	}, data) {
		return new Promise((resolve) => {
			uni.checkSession({
				success() {
					post('user/updateMobile', data).then((res) => {
						dispatch('user/getUserInfo', null, {
							root: true
						})
						resolve(res)
					})
				},
				fail() {
					dispatch('wxappLogin').then(() => {
						post('user/updateMobile', data).then((res) => {
							dispatch('user/getUserInfo', null, {
								root: true
							})
							resolve(res)
						})
					})
				}
			})
		})

	}
}

const mutations = {}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
