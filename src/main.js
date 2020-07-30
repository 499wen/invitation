import Vue from 'vue'
import App from './App.vue'
// import index from './components/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store'

// 百度api -- start
import BaiduMap from 'vue-baidu-map'
 
Vue.use(BaiduMap, {
    ak: '1a7BycAMOFIBGkPCx85y77L99en1hsFe'
});
// 百度api -- end


import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';

Vue.use(Avue);
Vue.use(ElementUI)
Vue.config.productionTip = false

import './plugins/axios.js'
import html2canvas from 'html2canvas'
import Print from 'vue-print-nb'

Vue.use(Print)

Vue.prototype.$print=html2canvas

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
