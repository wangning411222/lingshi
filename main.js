import Vue from 'vue'
import App from './App'
import store from './store'

Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);

const app = new Vue({
    store,
	...App
})
app.$mount()
