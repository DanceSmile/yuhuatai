<template>
	<div id="room">
		<div id="mapRoom">
			
		</div>
		<div id="back" @click='back'>
			
		</div>

		<transition  enter-active-class="animated bounceInRight"  leave-active-class="animated bounceOutRight"  >

		<div id="panel" v-if="show">
			<div class="title">
				<h3 >{{scenicName}}</h3>
				<div>
					<img :src="listen" alt=""  v-on:click="pauseOrPlay">
				    <span>听讲解 </span>
				</div>
			</div>
			<div class="action">	
				<!-- <div>
					<img src="/src/assets/btn_go.png" alt="">
					<span>去这里</span>
				</div> -->
				<div>
					<img  v-on:click="detail" src="/src/assets/btn_detail.png" alt="">
					<span >详情</span>
				</div>
				<div>
					<img  v-on:click="scenicList" src="/src/assets/btn_map.png" alt="">
					<span >展品</span>
				</div>
			</div>
		</div>
		</transition>

		<transition  enter-active-class="animated bounceInRight"  leave-active-class="animated bounceOutRight"  >
			<div id="list" v-if="!show">
				<div class="items"  :style="{height:clientHeight-10+'px'}"  v-show="showOrHide">
					<div class="container">
						<div class="head">
							<div>
								<img src="/src/assets/ticketroom.png" alt="">
								<span>游客服务</span>
							</div>
							<div>
								<img  src="/src/assets/park.png" alt="">
								<span>停车厂</span>
							</div>
							<div>
								<img  src="/src/assets/restroom.png" alt="">
								<span>卫生间</span>
							</div>
						</div>
						<div :style="{height:itemsHeight+'px'}" class="overflow">
							<div class="item" v-for = "x in select" @click="dispatch('room'+x.id)">
								<img :src="url+'/upload/'+x.resource[0].resource_name" alt="">
								<span>{{x.title}}</span>
							</div>
						</div>
						
					</div>
				</div>
				<div class="search"> 
					<input type="text" v-model="keywords" v-on:focus = "tabShow"   :placeholder="message" >
					<button @click='tab()'></button>
				</div>
				
			</div>
		</transition>

		<!-- <transition  enter-active-class="animated bounceInRight"  leave-active-class="animated bounceOutRight" > -->
			<router-view></router-view>
		<!-- </transition> -->
	</div>
</template>


<script>

     import  bus  from "../bus.js"
	import detail  from "./DetailRoom.vue"

	 export default {
	 	name:"room",
	 	data(){
	 		return {
	 			scenicName:"",
	 			listen:"/src/assets/pause.png",
	 			pause:"/src/assets/play.png",
				play:"/src/assets/pause.png",
				url:'http://yuhuatai.loveseem.com',
				show:false,
				exhibit:[],
				message:"请输入你要前往的展品",
				showOrHide:false,
				clientHeight:'',
				itemsHeight:110,
				scenic:[],
				keywords:"",
				select:[],
				markers:{}

	 		}
	 	},
	 	components:{
	 		detail
	 	},
	 	methods:{
	 		tab:function(){
				this.showOrHide = !this.showOrHide
			},
			tabShow:function(){
				this.showOrHide = true;
			},
			dispatch:function(id){
				this.showOrHide = false;
				this.trigger(this.markers[id])
			},
	 		state:function(){
	 		},
	 		listen:function(){
	 			if(this.musicObj.paused){
					this.listen = this.play;
					this.musicObj.play();
				}else{
					this.musicObj.pause();
					this.listen = this.pause;
				}

	 		},
	 		detail:function(){
	 			alert(1)
	 			this.$router.push({path:"/room/"+this.$route.params.id+"/detail"})
	 			// this.$router.push({path:"/"})
	 		},
	 		scenicList:function(){
	 			this.show=false;
	 			this.showOrHide = true;
	 		},
	 		pauseOrPlay:function(){
	 			if(this.musicObj.paused){
					this.listen = this.play;
					this.musicObj.play();
				}else{
					this.musicObj.pause();
					this.listen = this.pause;
				}
	 		},
	 		back(){
	 			this.$router.go(-1)
	 		},
	 		trigger:function(obj,or){
				this.show=true;
				localStorage.setItem('room',JSON.stringify(JSON.parse(obj._icon.getAttribute("alt"))))
				var data = JSON.parse(obj._icon.alt)
				this.scenicName = data.title
				this.musicObj.src = this.url+"/upload/"+data.resource[1].resource_name
				this.musicObj.play();
				this.listen = this.play;
				this.current.setLatLng(JSON.parse(obj._icon.alt).resource.poi.split(","));
				layer.msg("你目前处于 "+JSON.parse(obj._icon.getAttribute("alt")).title+" 附近");
	 		},
	 		reload:function(){


	 		  	// bus.$on("beacons",function(argv){


	 		  	// alert(JSON.stringify(argv))

	 		  	// })

	 			this.roomId = this.$route.params.id;
	 		
	 			var that = this;

	 			bus.$on("beacons",function(beacons){

	 				outer:
	 				for ( var x in beacons ) {

	 					for( var y  in that.exhibit ){

 							if( that.exhibit[y].minor == beacons[x].minor ){
 								var  beaconId = "room" + that.exhibit[y].id;
 								that.trigger(that.markers[beaconId],1);
 								break outer;
 							}
 
	 					}	

	 				}

	 			})

		 	 	this.icon =  L.icon({
				    iconUrl: '/src/assets/point_default.png',
				    iconSize: [16, 25],
				    iconAnchor: [8, 25],
				});
		 	 	that.currentIcon =  L.icon({
				    iconUrl: '/src/assets/point_sel.png',
				    iconSize: [16, 25],
				    iconAnchor: [8, 25],
				});
	 			this.musicObj = document.getElementById("music");
		 		// initialize the map on the "map" div with a given center and zoom
				var map = L.map('mapRoom', {
				    center: [0, 0],
				    maxBounds : [[-565.5,-800], [565.5,800]],
				    crs : L.CRS.Simple,
				    zoom: -9,
	    			maxZoom:2,
	    			minZoom:-2,
				});

				
				

		        fetch(that.url+"/api/info",{
	                method: "POST",
	                body: 'project='+that.roomId,
	                headers: {
	                  "content-type": "application/x-www-form-urlencoded",
	                }
	            }).then(function(response) {
	                return response.json()
	            }).then(function(body){
	            	that.exhibit = body.exhibit
	            	that.select = body.exhibit;
	            	var image = new Image();
	            	image.src=that.url+"/upload/"+body.map
	            	image.onload = function(){
	            		var imgW = parseFloat(image.width)/2;
	            		var imgH = parseFloat(image.height)/2;
		            	console.log(that.url+"/upload/"+body.map)
		            	var imageUrl  =that.url+"/upload/"+body.map;
						var imageBounds = [[-imgH,-imgW], [imgH,imgW]];
						map.setMaxBounds(imageBounds)
						L.imageOverlay(imageUrl, imageBounds).addTo(map);
						var exhibit = body.exhibit;
						for(var x in  exhibit){
							var marker = L.marker(exhibit[x].resource.poi.split(","),{
								alt:JSON.stringify(exhibit[x]),
								icon:that.icon,
								title:"room"+JSON.parse(exhibit[x].id) 
							}).on("click",function(){
								that.trigger(this,0)
							})

							that.markers["room"+exhibit[x].id] = marker;
							marker.addTo(map);
						}
		 				that.current = L.marker([10000,0],{icon:that.currentIcon}).on('click',function(){
		 					that.show = true;
		 				}).addTo(map);
	 				}



	 				for (var i = 0; i <that.exhibit.length; i++) {
			  			console.log(that.exhibit[i].minor)
			  		}




	            })
	            map.on("click",function(e){
	            	that.show = false
	            })
	 		}


	 	},
	 	watch:{
	 		keywords:function(val,old){
				this.tabShow();
				this.select = [];
				var reg = new RegExp(val);
				for (var x in  this.exhibit ) {
					console.log(this.exhibit[x].title)
					if(reg.test(this.exhibit[x].title)){
						this.select.push(this.exhibit[x])
					}
				}
			}
	 	},
	 	beforeRouteEnter:function(to,from,next){
	 		next(function(vm){

	 		});
	 	},
	 	beforeRouteUpdate:function(to,from,next){


	 	},
	 	mounted:function(){
	 		this.reload()
			var searchHeight = parseFloat(getComputedStyle(document.querySelector(".search")).height)
			var headHeight = parseFloat(getComputedStyle(document.querySelector(".head")).height)
			this.clientHeight = parseFloat(document.documentElement.clientHeight) - searchHeight - 15;
			this.itemsHeight = parseFloat(this.clientHeight) - parseFloat(headHeight);
	 	}

	 } 
</script>

<style scoped  lang="less">
	#back{
		position: fixed;
		width: 30px;
		height: 30px;
		background: #fff;
		left: 15px;
		bottom:180px;
		background: url("/src/assets/back.jpg") no-repeat 0px 0px;
		background-size: 100% 100%;
		z-index: 999;
	}
	#room{
		position: fixed;
		top: 0;
		bottom:0;
		left: 0;
		right:0;
		margin:auto;
		width: 100vw;
		height: 100vh;
		z-index: 99999;
		background: #fff;
		#mapRoom{
			width: 100vw;
			height: 100vh;
		}
	}

	.flex{
 		display: flex;
		display: -webkit-flex;
 	}
	#panel{
	    position: fixed;
	    width: 96%;
	    height: 2.75rem;
	    background:rgba(255,255,255,0.9);
	    bottom:0.1875rem;
	    z-index: 99999;
	    left: 0;
	    right: 0;
	    margin: auto;
	    border:1px solid #b8b7b3;
	    box-sizing: border-box;
	    padding-left:0.3125rem;
	    padding-right:0.3125rem;
	    .title{
	    	.flex;
	    	justify-content: space-between;
	    	height: 1.25rem;
	    	border-bottom: 1px solid #b8b7b3;
	    	h3{
	    		line-height: 1.25rem;
	    	}
	    	div{
	    		display: flex;
	    		display: -webkit-flex;
	    		align-items:center;
	    		img{
	    			height: 1.09375rem;
	    			width: 1.09375rem;
	    			margin-left: 0.1875rem;
	    			margin-right: 0.1875rem;
	    		}
	    		span{
	    			font-size: 0.390625rem;   
	    			margin-left: 0.1875rem;
	    			margin-right: 0.1875rem;
	    		}
	    	}
	    }
	    .action{
	    	.flex;
	    	height: 1.484375rem;//95px;
			justify-content:space-around;
			div{
				height: 1.484375rem;
				.flex;
				align-items:center;
				img{
	    			height: 1.09375rem;
	    			width: 1.09375rem;
	    			margin-left: 0.1875rem;
	    			margin-right: 0.1875rem;
				}
				span{
					font-size: 0.390625rem;
				}
			}
	    }
	}
	#list{
		overflow: hidden;
		.items{
			position: fixed;
			z-index: 99999;
			top: 10px;
			width: 96%;
			height: 100vh;
			left: 0;
			right: 0;
			margin: auto;
			box-sizing: border-box;	
			overflow: hidden;
			border:1px solid #888886;
			.container{
				box-sizing: border-box;
				background: rgba(255, 255, 255, 0.8);
				width: 100%;
				overflow: hidden;
				.head{
					height: 2.4375rem;
					.flex;
					justify-content:space-around;
					align-items:center;
					font-size: 0.375rem;
					div{
						.flex;
						align-items:center;
						img{
							margin:0.15625rem;
							width: 0.9375rem;	
							height: 0.9375rem;
						}
					}
				}
				.overflow{
					overflow: scroll;
				}
				.item{
					width: 8.96875rem;
					height: 2.03125rem;
					border:1px solid #878787;
					margin:20px auto;
					.flex;
					align-items:center;
					img{
						width: 1.5625rem;
						height: 1.5625rem;	
						margin:0px 15px;
					}
					span{
						font-size: 0.390625rem;
					}
				}
			}
		}
	    .search{
	    	position: fixed;
			z-index: 99999;
			width: 96%;
			bottom:0.1875rem;
			left: 0;
			right: 0;
			margin: auto;
		    .flex;
		    border:1px solid #b8b7b3;
		    box-sizing: border-box;
		    padding-left:0.3125rem;
		    padding-right:0.3125rem;
		    padding-top:0.25rem;
		    padding-bottom:0.25rem;
		    align-items:center;
		    justify-content:space-between;
		    height: 1.40625rem;
		   	background:rgba(255,255,255,0.9);
	    }
	    input{
	    	height: 0.78125rem;
	    	width: 8.0rem;
	    	box-sizing: border-box;
	    	padding-left: 12px;
	    	font-size: 13.33px;
	    }
	    button{
	    	height: 0.78125rem;
	    	border:none;
	    	outline: none;
	    	background: url(/src/assets/point.png) 0px 0 no-repeat;
	    	width: 0.671875rem;
	    	background-size: 100% ;
	    }
	}
</style>

