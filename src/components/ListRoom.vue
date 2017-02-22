<template>
	<div id="list">
		<div class="items"  :style="{height:clientHeight-10+'px'}"  >
			<div class="container">
				<div class="head">
					<div>
						雨花台微信导览展品列表
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
		
		
	</div>
</template>


<script>
	import   scenic  from "../data/scenic.js" 
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
				alert(id)
				bus.$emit("roomTrigger","id"+id)
			},
			
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
			this.clientHeight = parseFloat(document.documentElement.clientHeight)-10;
			this.itemsHeight = parseFloat(this.clientHeight);
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
		background: #fff;
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
				background: rgba(255, 255, 255,1);
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