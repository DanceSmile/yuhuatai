<template>
	<div id="list">
		<div class="items"  :style="{height:clientHeight-10+'px'}"  v-show="showOrHide">
			<div class="container">
				<div class="head">
					<div>
						<img src="/src/assets/ticketroom.png" alt="">
						<span>游客服务</span>
					</div>
					<div>
						<img  @click="car" src="/src/assets/park.png" alt="">
						<span>停车厂</span>
					</div>
					<div>
						<img @click="wc" src="/src/assets/restroom.png" alt="">
						<span>卫生间</span>
					</div>
				</div>
				<div :style="{height:itemsHeight+'px'}" class="overflow">
					<div class="item" v-for = "x in select" @click="dispatch(x.attraction.id)">
						<img :src="x.attraction.picUrl" alt="">
						<span>{{x.attraction.name}}</span>
					</div>
				</div>
				
			</div>
		</div>
		<div class="search"> 
			<input type="text" v-model="keywords" v-on:focus = "tabShow"   :placeholder="message" >
			<button @click='tab()'></button>
		</div>
		
	</div>
</template>


<script>
	// import   scenic  from "../data/scenic.js" 
	import  bus  from  '../bus.js'
	export default {
		data(){
			return {
				message:"请输入你要前往的景点",
				showOrHide:false,
				clientHeight:'',
				itemsHeight:110,
				scenic:scenic,
				keywords:"",
				select:[]
			}	
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
				bus.$emit("trigger","id"+id)
			},
			wc:function(){
				bus.$emit("wc");
				this.tab();
			},
			car:function(){
				bus.$emit("car");
				this.tab();
			}
		},
		computed:{
			
		},
		watch:{
			keywords:function(val,old){
				this.tabShow();
				this.select = [];
				var reg = new RegExp(val);
				for (var x in  this.scenic.body.attractions ) {
					if(reg.test(this.scenic.body.attractions[x].attraction.name)){
						this.select.push(this.scenic.body.attractions[x])
					}
				}
			}

		},
		mounted(){
			var searchHeight = parseFloat(getComputedStyle(document.querySelector(".search")).height)
			var headHeight = parseFloat(getComputedStyle(document.querySelector(".head")).height)
			this.clientHeight = parseFloat(document.documentElement.clientHeight) - searchHeight - 15;
			this.itemsHeight = parseFloat(this.clientHeight) - parseFloat(headHeight);
			this.select =  this.scenic.body.attractions;


		}
	}
</script>
<style scoped lang="less">
	.flex{
		display: flex;
		display: -webkit-flex;
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
						background: red;
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