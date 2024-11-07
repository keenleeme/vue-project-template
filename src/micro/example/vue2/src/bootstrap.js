import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './router'
// import './loadComponents'

Vue.config.productionTip = false

const router = new VueRouter({
  // vue-router在hash模式下不支持base，可以用一个根页面进行包裹
  // base: window.__MICRO_APP_BASE_ROUTE__ || '/',
  // mode: 'history',
  routes,
})


// console.log(2222)
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
