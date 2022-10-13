import Vue from 'vue'
import Antd from 'ant-design-vue/es'
import App from './App'
import 'ant-design-vue/dist/antd.css'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
Vue.use(Antd)

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
