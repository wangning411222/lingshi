import { post, get, wx_pay, showToast,reBuildUrl } from '../../tools/utils.js'
const state = {
	config: {},
	swiperList: [],
	xuezhi_arr:[],
	upimgUrl:'user/upimg',
}

const getters = {
	upimgUrl(state) {
		return reBuildUrl(state.upimgUrl);
	},
	config(state) {
		return state.config
	},
	swiperList(state) {
		return state.swiperList
	},

	xuezhi_arr(state) {
		return state.xuezhi_arr
	}
	
	
}

const actions = {
	upimgUrl({state}) {
		state.upimgUrl = reBuildUrl('/user-upimg.htm');
	},
	//获取全局配置
	getConfig({
		commit,
		state,
		dispatch
	}) {
		return new Promise((resolve, reject) => {
			get('index/config', false, false)
				.then((res) => {
					if (res.code == 0) {
						state.swiperList = res.message.banner_list;
						state.config = res.message;
						
						state.xuezhi_arr = res.message.xuezhi_arr;
						
						// state.toppay = res.message.pay_type_info.top;
						// state.charge_rate = res.message.charge_rate;
						// state.charge_text = res.message.charge_text;
						// state.noticeid = [res.message.invite_getrmbs_template_id,res.message.job_hunter_template_id,res.message.publisher_notice_template_id];
						
						resolve();
					} else {
						reject();
					}
				});
		});
	},

	// 发送手机验证码接口
	send_code({state}, data){
		return new Promise((resolve,reject)=>{
			post('index/send_code',data).then((res)=>{
				resolve(res)
			})
		})
	},
	// 手机查订单信息接口
	signin_by_phone({state}, data){
		return new Promise((resolve,reject)=>{
			post('miniproapi/signin_by_phone',data).then((res)=>{
				resolve(res)
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
