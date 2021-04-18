import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui';
import axios from 'axios'
import router from './router'
import VueScrollLock from 'vue-scroll-lock'
import './theme/index.css'


Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.use(Element, { size: 'small', zIndex: 3000 });
Vue.use(VueScrollLock)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
