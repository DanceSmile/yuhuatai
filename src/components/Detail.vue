<template>
	
	<div id="detail">
		<div style="width: 10rem;height: 5.32813rem;">
		  	 <img  :src="scenic.picUrl" style="width: 10rem;height: 5.32813rem;float: left;">
		</div>
		<div style="box-sizing: border-box;padding: 0px 0.39062rem;background: #fff;border-top:1px solid #dcdcdc;border-bottom: 1px solid  #dcdcdc; ">
			  <div style="padding:0.3125rem;border-bottom: 1px solid #dcdcdc;">
			  	<div style="line-height: 0.725rem;font-weight: bold;font-size: 16px;">{{scenic.name}}</div>
			  	<!-- <div style="line-height: 0.625rem;margin-top: 0.15625rem;">成人票：<span style="color: #ff6900;font-size: 20px;">$38</span></div> -->
			  </div>
			  <div  style="padding:0.3125rem;">
			  	<div style="line-height: 0.625rem">地理坐标: {{scenic.horn_longitude}},{{scenic.horn_latitude}}</div>
			  </div>
		</div>
		<div style="margin-top: 20px;box-sizing: border-box;padding: 0px 0.39062rem;background: #fff;border-top:1px solid #dcdcdc;border-bottom: 1px solid  #dcdcdc; padding-bottom: 1.35937rem;">
		  	  <div style="font-weight: bold;margin-top: 0.3125rem;">景点简介</div>
			  <p class="MsoNormal" style="line-height: 0.625rem;text-indent:21.0000pt;margin-top: 0.3125rem;margin-bottom: 0.3125rem;">
				<div 	 v-html = "scenic.content" ></div>
			  </p>
		</div>
	</div>

</template>


<script>
	import scenic  from "../data/scenic.js" 
	export default {
		name:"detail",
		data(){
			return {
				scenic:"",
				name:this.$route.query.id
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
				// console.log(localStorage.getItem("scenic"))
				vm.scenic = JSON.parse(localStorage.getItem("scenic"))
			})
		},
		

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