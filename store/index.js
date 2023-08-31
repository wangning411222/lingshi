import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import login from './login'
import user from './user'
import config from './config'
import shops from './shops'
import address from './address'


export default new Vuex.Store({
	state: {
		
		
	},
	mutations: {
	
	},
	modules: {
		user,
		login,
		config,
		shops,
		address
	},
	
});
