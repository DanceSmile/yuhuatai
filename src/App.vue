<template>
  <div id="app">
    <mapview  ref="mapview" v-on:state="showPanel" v-on:scenicName="scenic" v-on:play="play"  v-on:hidePanel="hidePanel()"></mapview>

     <transition
         enter-active-class="animated bounceInRight"
         leave-active-class="animated bounceOutRight"
     >
         <Panel   v-show="panelShow"  :scenicName="scenicName"   :state1="listen" v-on:state="dispatch" ></Panel>
      </transition>
       <transition
         enter-active-class="animated bounceInRight"
         leave-active-class="animated bounceOutRight"
     >
         <scenic  v-show="!panelShow"   v-on:state="dispatch" ></scenic>
    </transition>

    <transition
         enter-active-class="animated bounceInRight"
         leave-active-class="animated bounceOutRight"
     >
     <router-view></router-view>
     </transition>


  </div>
</template>

<script>

import Vue from 'vue'

import VueRouter from  "vue-router" 


import  bus  from "./bus.js" 


Vue.use(VueRouter)




import mapview from "./components/mapview.vue"
import Panel from "./components/Panel.vue"
import List from "./components/List.vue"
export default  {
  name: 'app',
  data () {
    return {
       panelShow:false,
       scenicName:"",
       listen:"/src/assets/pause.png",
       roomId:0
    }
  },
  methods:{

    dispatch:function(){
        this.panelShow = !this.panelShow
    },
    showPanel:function(){
      this.panelShow = true
    },
    scenic:function(message){
       this.scenicName=message
    },
    play:function(message){
      this.listen = message
    },
    hidePanel:function(){
      this.panelShow = false;
    },
    beacons:function(){

      fetch('http://yuhuatai.loveseem.com/api/config')
         .then(function(response) {
             return response.text()
         }).then(function(body) {
            var config =  JSON.parse(body);
            wx.config(JSON.parse(config))
      })

      wx.ready(function(){
        wx.startSearchBeacons({
          ticket:"",  //摇周边的业务ticket, 系统自动添加在摇出来的页面链接后面
          complete:function(argv){
            //开启查找完成后的回调函数
          }
        });

        wx.onSearchBeacons({
        complete:function(argv){
             argv.beacons.sort(function(a,b){
              return  parseFloat(a.accuracy) - parseFloat(b.accuracy); 
             })
             bus.$emit("beacons",argv.beacons);
          }
        });

      })

      wx.error(function(res){

      })


    }
  },
  components:{
      mapview:mapview,
      Panel,
      scenic:List
  },
  mounted:function(){
    this.beacons();
    var that =  this;
    bus.$on("room",function(id){

        // that.roomId = id;
    })

    bus.$on("roomStart",function(){
       that.panelShow = false;
    })


    


   

  }
}
</script>

<style scoped>
#app {
  
}
</style>
