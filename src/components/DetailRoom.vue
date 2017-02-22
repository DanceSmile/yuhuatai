<template>
	
	<div id="detail">
		<div style="width: 10rem;height: 5.32813rem;">
		  	 <img  :src="pic" style="width: 10rem;height: 5.32813rem;float: left;">
		</div>
		<div style="box-sizing: border-box;padding: 0px 0.39062rem;background: #fff;border-top:1px solid #dcdcdc;border-bottom: 1px solid  #dcdcdc; ">
			  <div style="padding:0.3125rem;border-bottom: 1px solid #dcdcdc;">
			  	<div style="line-height: 0.725rem;font-weight: bold;font-size: 16px;">{{room.title}}</div>
			  	<!-- <div style="line-height: 0.625rem;margin-top: 0.15625rem;">成人票：<span style="color: #ff6900;font-size: 20px;">$38</span></div> -->
			  </div>
			  <div  style="padding:0.3125rem;"
			  >
			  	<div style="line-height: 0.625rem">更新时间: {{room.updated_at}}</div>
			  </div>
		</div>
		<div style="margin-top: 20px;box-sizing: border-box;padding: 0px 0.39062rem;background: #fff;border-top:1px solid #dcdcdc;border-bottom: 1px solid  #dcdcdc; padding-bottom: 1.35937rem;">
		  	  <div style="font-weight: bold;margin-top: 0.3125rem;">景点简介</div>
			  <p class="MsoNormal" style="line-height: 0.625rem;text-indent:21.0000pt;margin-top: 0.3125rem;margin-bottom: 0.3125rem;">
				<span v-html='room.content'></span>
			  </p>
		</div>
	</div>
</template>

<script>
	export default {
		name:"detail",
		data(){
			return {
				room:"",
				name:this.$route.query.id,
				url:'http://yuhuatai.loveseem.com/upload/',
				pic:""
			}
		},
		methods:{

		},
		watch:{
			$route:function(to,from){
				console.log(to,from)
			}
		},
		beforeRouteEnter:function(to, from, next){
			next(function(vm){
				console.log(JSON.parse(localStorage.getItem("room")))
				vm.room = JSON.parse(localStorage.getItem("room"))
				vm.pic = vm.url + vm.room.resource[0].resource_name
			})
		},
		mounted:function(){

		}

	}


</script>



<style scoped   lang = "less">
	#detail{
		width: 100vw;
		background: #eeeeee;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin:auto;
		z-index:99999;
		padding-bottom: 100px;
	}
</style>