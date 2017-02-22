<template>
	<div id="panel">
		<div class="title">
			<h3  >{{scenicName}}</h3>
			<div>
				<img :src="listen" alt=""   v-on:click="pauseOrPlay">
			    <span>听讲解 </span>
			</div>
		</div>
		<div class="action">	
			<div>
				<img src="/src/assets/btn_go.png"  @click="walk" alt="">
				<span>去这里</span>
			</div>
			<div>
				<img  v-on:click="detail" src="/src/assets/btn_detail.png" alt="">
				<span >详情</span>
			</div>
			<div v-if="roomId">
				<img  v-on:click="room" src="/src/assets/btn_map.png" alt="">
				<span >室内地图</span>
			</div>
		</div>
	</div>
</template>

<script>
	import  bus  from "../bus.js" 

	export default {
		name:"Panel",
		data(){
			return {
				listen:this.state1,
				pause:"/src/assets/play.png",
				play:"/src/assets/pause.png",
				musicObj:'',
				roomId:0
			}
		},
		props:[
			'scenicName',
			'state1',
		],
		computed:{

		},
		watch:{
			state1:function(){
				// alert(1)
			}
		},
		methods:{
			walk:function(){
				bus.$emit("walk")
			},
			state: function(){
				this.$emit("state")
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
			detail:function(){
				this.$router.push({path:"/descript",query:{id:localStorage.getItem("id")}})
			},
			room:function(){
				this.musicObj.pause();
				this.listen = this.pause;
				this.$router.push({ name: 'room', params: { id: this.roomId }})
				bus.$emit("roomStart")
			}
		},
		mounted:function(){

			this.musicObj = document.getElementById("music");
			 var that = this;

			bus.$on("playOrpause",function(){
				that.listen = that.play;
			})
			bus.$on("room",function(id){
				that.roomId = id
			})


		}




	}

</script>
<style scoped lang="less">
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




	
</style>