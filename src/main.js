import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui';
import Axios from 'axios'
import router from './router'
import './theme/index.css'
import ModelObj from 'vue-3d-model'
// import qs from 'qs'



Vue.prototype.$axios = Axios
// // axios配置
// Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8' // 配置post请求头
// Axios.defaults.headers.get['Content-Type'] = 'application/json;charset=UTF-8' // 配置get请求头
// // POST传参序列化(添加请求拦截器)
// Axios.interceptors.request.use((config) => {
//   // 在发送请求之前做某件事
//   if (config.method === 'post') {
//     // 这里使用qs对数据进行处理，防止后台$_POST接收不到
//     config.data = qs.stringify(config.data)
//   }
//   return config
// }, (error) => {
//   console.log('错误的传参', 'fail')
//   return Promise.reject(error)
// })
Vue.config.productionTip = false
Vue.use(ModelObj)
Vue.use(Element, { size: 'small', zIndex: 3000 });

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
