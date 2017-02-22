import Vue from 'vue'
import  vuex from  "vuex"
import VueRouter from  "vue-router"	

// import 'mint-ui/lib/style.css'

Vue.use(VueRouter)

import App from './App.vue'
import  bus  from "./bus.js" 


import  routes from  "./router.js"


const router = new VueRouter({
	routes:routes,
	mode: 'history'
})






require("./css/base.css")


	//微信相关

	



 new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

