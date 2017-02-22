<template>
	<div>
	   <div id="tour">
	   			<div class="now" @click="showTour"> {{currentTour}} </div>
	   			<div class="line" v-show="tourList" >
	   				<div v-for=" x in dataTour" @click="selectTour(x)" >{{x.name}}</div>
	   			</div>
	   </div>
  		<div id="map" >
		</div>
		<div  class="position" >
	     	 <div  @click="location">
	     	 </div>
  		 </div>
	</div>
</template>

<script>
       
	// import   scenic  from "../data/scenic.js" 
	import   wc  from "../data/wc.js" 
	import   car  from "../data/car.js" 
	import bus from "../bus.js"

	export  default {
		name:"mapview",
		data(){
			return {
				tourList:false,
				currentTour:"雨花台全景游",
				message:"",
				dataTour:{
				},
				map:"",
				icon:"",
				scenic:scenic,
				length:0,
				musicObj:'',
				wc:wc,
				car:car,
				markers:{},
				people:[0,0],
				polyline:0,
				imageBounds:[[39.91547718,116.3891909], [39.90680788,116.3991057]],
				lat:0,
				lon:0,
				lineTour:[],
				start:'',
				starticon:''
			}
		},
		methods:{
			linehistory:function(origin,destination){
				var that = this;
				var url = "http://restapi.amap.com/v3/direction/walking?key=a240bd117b5d618f67dcba6ee00a180f&origin="+origin+"&destination="+destination;
					fetch(url)
					.then(function(response) {
					    return response.text()
					}).then(function(body) {
						var steps =  JSON.parse(body).route.paths[0].steps
						var line = ''
					    for( var x in steps){
					    	line += steps[x].polyline
					    	line += ";"
					    }
					    var arrLine = line.split(";")
					    var newLine = [];
					    for (var i = 0; i < arrLine.length; i++) {
					    	newLine.push([arrLine[i].split(",")[1],arrLine[i].split(",")[0]])
					    }

					    newLine.pop();

					 	
						// if(that.lineTour) that.lineTour.remove()
					    that.lineTour.push(L.polyline(newLine, {
					    	color         :   '#774220' ,
					    	opacity       :    0.8   ,
					    	weight        :    5     ,
					    	dashArray     :    "10,10"
					    }).addTo(that.map))

					})

			},
			gaodeMap:function() {

				var  that = this;
		        var a = new AMap.Map("gaodeMap", {
		          resizeEnable: !0
		        });
		        a.plugin("AMap.Geolocation", function() {
		          function a(a) {
		          	 that.lon = a.position.getLng();
		          	 that.lat = a.position.getLat();
		          	 that.IocPos.setLatLng([a.position.getLat(),a.position.getLng()])
	          		for(var x in that.scenic.body.attractions){
	          			var lnglat = new AMap.LngLat(parseFloat(a.position.getLng()),parseFloat(a.position.getLat()));
	          			var distance = lnglat.distance([parseFloat(that.scenic.body.attractions[x].attraction.horn_longitude),parseFloat(that.scenic.body.attractions[x].attraction.horn_latitude)]);
	          			if(parseFloat(distance)<10){
	          				bus.$emit("trigger","id"+that.scenic.body.attractions[x].attraction.id)
	          				break;
	          			}
	          		}
		          }

		          function b(a) {
		          	console.log('无法获得位置信息')

		          	// for(var x in that.scenic.body.attractions){
	          		// 	var lnglat = new AMap.LngLat(parseFloat(a.position.getLng()),parseFloat(a.position.getLat()));
	          		// 	alert(lnglat.distance([parseFloat(that.scenic.body.attractions[x].attraction.horn_longitude),parseFloat(that.scenic.body.attractions[x].attraction.horn_latitude)]))
	          		// }

		             // that.map.panTo([0,0])
		             // L.marker([0,0]).addTo(that.map);
		          }
		          var c = new AMap.Geolocation({
		            enableHighAccuracy: !0,
		            timeout: 1e4,
		            buttonOffset: new AMap.Pixel(10, 20),
		            zoomToAccuracy: !0,
		            buttonPosition: "RB",
		            convert: !0
		          });
		          c.getCurrentPosition();
		          c.watchPosition(), AMap.event.addListener(c, "complete", a), AMap.event.addListener(c, "error", b)
		        })
	        },
	        showTour:function(){
	        	this.tourList = !this.tourList;
	        },
	        chunk:function(){
	        	for(var u in this.lineTour){
	        		this.lineTour[u].remove();
	        	}
	        	this.lineTour = [];
	        },
	        selectTour:function(x){

	        	this.chunk();
	        	this.currentTour = x.name;
	        	console.log(x)
	        	var obj = x.latlon;
	        	var line = [];
	        	
	        	this.start.setLatLng([39.90781870633986,116.39564037323])

        		for(var y in obj ){

        			console.log(obj[y]);
        			if(y==0){
        				var origin = "116.39564037323,39.90781870633986";
        			}else{
        				var origin = obj[y-1];
        			}
        			var destination = obj[y];
        			this.linehistory(origin,destination)
        		}
	        	this.tourList = false;
	        },
	        trigger:function(obj,or){

	        		bus.$emit("playOrpause")
					localStorage.setItem('scenic',JSON.stringify(JSON.parse(obj._icon.getAttribute("alt")).attraction))
					this.$emit('scenicName',JSON.parse(obj._icon.getAttribute("alt")).attraction.name)
					this.$emit('state');
					this.$emit('play','/src/assets/pause.png')
					bus.$emit('room',JSON.parse(obj._icon.getAttribute("alt")).attraction.room)
					this.musicObj.setAttribute("src",JSON.parse(obj._icon.getAttribute("alt")).attraction.voice)
					this.musicObj.play();
					this.current.setLatLng([JSON.parse(obj._icon.getAttribute("alt")).attraction.horn_latitude,JSON.parse(obj._icon.getAttribute("alt")).attraction.horn_longitude])
					layer.msg("你目前处于 "+JSON.parse(obj._icon.getAttribute("alt")).attraction.name+" 附近");
					
	        },
	        location:function(){
	        	var  latlng = this.IocPos.getLatLng();


	//  if(usrLocation.longitude > mapObj.luLongitude && usrLocation.longitude < mapObj.rdLongitude && usrLocation.latitude < mapObj.luLatitude && usrLocation.latitude > mapObj.rdLatitude) {
	// 	var a = [usrLocation.longitude - .002, usrLocation.latitude + .002, usrLocation.longitude + .002, usrLocation.latitude - .002];
	// 	map.getView().fit(a, map.getSize()), $("#iosMark").show(), userMark.setPosition([usrLocation.longitude, usrLocation.latitude]), Common.PromptShow("定位成功")
	// } else Common.PromptShow("当前不在景区")


	// 			if(imageBounds){

	// 			}

	        	this.map.panTo([latlng.lat,latlng.lng]);
	        },
		},
		mounted(){

			setInterval(function(){
				if($(".run").hasClass("runState")){
					$(".run").removeClass("runState");
				}else{	
					$(".run").addClass("runState");
				}
			},1000)

			var that  = this;
			L.control({position:'bottomright'})
			this.map = L.map("map",{
				renderer:L.canvas(),
				center: [39.910719,116.394353],
				// center:[31.997838,118.781845],
    			zoom: 17,
    			maxZoom:18,
    			minZoom:13,
    			attribution:"",
    			prefix:"",
    			// maxBounds:[[31.992115,118.774088], [32.005353,118.791576]]
			}); 	

			fetch("http://yuhuatai.loveseem.com/Apiscenic/line")
				.then(function(response) {
				    return response.json()
				})
				.then(function(body){
					console.log(body)
					that.dataTour = body.body;

				})


			

			// var drag = L.marker([31.997439,118.781111],{draggable:true}).addTo(this.map)
			// drag.on("dragend",function(e){
			// 	console.log(e.target._latlng)
			// })
			// for(var x in that.scenic.body.attractions){

	          		// var lnglat = new AMap.LngLat([parseFloat(116.3929239661),parseFloat(39.9106085687)]);
	          		// alert(parseFloat(that.scenic.body.attractions[x].attraction.horn_latitude))
	          		// lnglat.distance([parseFloat(that.scenic.body.attractions[x].attraction.horn_longitude),parseFloat(that.scenic.body.attractions[x].attraction.horn_latitude)])
	        // }


			this.icon =  L.icon({
			    iconUrl: '/src/assets/point_default.png',
			    iconSize: [16, 25],
			    iconAnchor: [8, 25],
			});

			this.starticon = L.icon({
			    iconUrl: '/src/assets/route_start.png',
			    iconSize: [30, 30],
			    iconAnchor: [15, 30],
			});

			this.currentIcon =  L.icon({
			    iconUrl: '/src/assets/point_sel.png',
			    iconSize: [16, 25],
			    iconAnchor: [8, 25],
			});

			this.Ioc = L.icon({
			    iconUrl: '/src/assets/loc.png',
			    iconSize: [28, 28],
			    iconAnchor: [14, 14],
			}); 

			this.run = L.divIcon({className:"run"})



			this.start = L.marker([0,0],{icon:that.starticon}).addTo(that.map)



			// tileLayer 瓦片地图
			L.tileLayer('http://webst02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}', {foo: 'bar'}).addTo(this.map);
			var imageUrl = '/src/assets/map.png',
			imageBounds = [[39.91547718,116.3891909], [39.90680788,116.3991057]];
			// imageBounds = [
			// 				[32.0049850382225,118.77443930316926],
			// 				[31.992108,118.791791126709]
			// 			  ];

			L.imageOverlay(imageUrl,imageBounds).addTo(this.map);
			// 标记点集合
			for(var x in this.scenic.body.attractions){
				var marker = L.marker(
					[this.scenic.body.attractions[x].attraction.horn_latitude,this.scenic.body.attractions[x].attraction.horn_longitude],
					{
						icon:that.icon,
						alt:JSON.stringify(this.scenic.body.attractions[x]),
						title:"id"+JSON.stringify(this.scenic.body.attractions[x].attraction.id),
						id: 'sdf'
					}
					)
				.on("click",function(){
					that.trigger(this,0)
					// localStorage.setItem('scenic',JSON.stringify(JSON.parse(this._icon.getAttribute("alt")).attraction))
					// that.$emit('scenicName',JSON.parse(this._icon.getAttribute("alt")).attraction.name)
					// that.$emit('state');
					// that.$emit('play','/src/assets/pause.png')
					// that.musicObj.setAttribute("src",JSON.parse(this._icon.getAttribute("alt")).attraction.voice)
					// that.musicObj.play();
					// current.setLatLng([JSON.parse(this._icon.getAttribute("alt")).attraction.horn_latitude,JSON.parse(this._icon.getAttribute("alt")).attraction.horn_longitude])
				})
				that.markers["id"+JSON.stringify(this.scenic.body.attractions[x].attraction.id)] = marker;
				marker.addTo(this.map)
			}

			L.marker([39.90680788,116.3991057]).addTo(that.map)

			L.marker([39.91547718,116.3891909]).addTo(that.map)

			that.runMarker = L.marker([-1000,10000],{icon:that.run}).addTo(that.map)
			that.current = L.marker([10000,0],{icon:that.currentIcon}).addTo(that.map);
			that.current.on('click',function(){
				that.$emit('state');
			})


			that.IocPos = L.marker([0,0],{icon:that.Ioc}).addTo(that.map);



			this.map.on('click', function(e) {
				$(".wc").remove()
				that.$emit("hidePanel");
				//http://restapi.amap.com/v3/place/polygon?key=a240bd117b5d618f67dcba6ee00a180f&polygon=116.3891909,39.91547718|116.3991057,39.90680788&keywords=%E5%8E%95%E6%89%80&extensions=base
				// [39.91547718,116.3891909], [39.90680788,116.3991057]
				// http://restapi.amap.com/v3/place/polygon?key=a240bd117b5d618f67dcba6ee00a180f&polygon=116.3891909,39.91547718|116.3991057,39.90680788&keywords=%E8%82%AF%E5%BE%B7%E5%9F%BA&types=050301&offset=20&page=1&extensions=base
				console.log(e.latlng)
			});

			this.gaodeMap()

			this.musicObj = document.getElementById("music");

			const divIcon = L.divIcon({
				html:`<div class='wc'>
				  		 <div class="ol-overlay-container" >
				  		 	<div id="facilit1">
					  		 	<div class="facType-all" onclick="Facilities.selectRoad(this,116.3943054,39.9099096)" data-lnglat="116.3943054,39.9099096">
						  		 	<div class="facType-top">
						  		 		<img src="http://mall.leyoobao.com/geotravelWeb/upload/pic/20160113141658.png">
						  		 		<p>厕所</p>
						  		 	</div>
						  		 	<div class="facType-bottom">
						  		 		<img src="/src/assets/daohan.png">
						  		 		<span>定位中..</span>
						  		 	</div>
					  		 	</div>
				  		 	</div>
				  		 </div>
					</div>`,
					className:'asme'
			})

		

			bus.$on("wc",function(){
					for (var j  in   that.wc.pois) {
						var  poi = that.wc.pois[j].location;
						var arr = poi.split(",");
						arr.unshift(arr.pop());
						L.marker(arr, {icon: divIcon}).addTo(that.map);
					}
			})

			bus.$on("car",function(){
					for (var j  in   that.car.pois) {
						var  poi = that.car.pois[j].location;
						var arr = poi.split(",");
						arr.unshift(arr.pop());
						L.marker(arr, {icon: divIcon}).addTo(that.map);
					}
			})
			bus.$on("trigger",function(obj){
				that.trigger(that.markers[obj])
			})

			bus.$on("walk",function(){

				var data = JSON.parse(localStorage.getItem("scenic"));
				var destination = data.horn_longitude + "," + data.horn_latitude

			
				var origin =  that.lon + "," + that.lat;



				console.log(that.lon);
				console.log(that.lat);
				// 116.39562964439394
				// 39.90785162573168
				if( 39.90680788  < parseFloat(that.lat)    &&  parseFloat(that.lat) < 39.91547718  && 116.3891909 < parseFloat(that.lon) && parseFloat(that.lon) < 116.3991057 ){

				}else{
					layer.msg("您当前不在景区")
					origin = "116.39562964439394,39.90785162573168"
				}

				var url = "http://restapi.amap.com/v3/direction/walking?key=a240bd117b5d618f67dcba6ee00a180f&origin="+origin+"&destination="+destination;
					fetch(url)
					.then(function(response) {
					    return response.text()
					}).then(function(body) {
						var steps =  JSON.parse(body).route.paths[0].steps
						var line = ''
					    for( var x in steps){
					    	line += steps[x].polyline
					    	line += ";"
					    }
					    var arrLine = line.split(";")
					    var newLine = [];
					    for (var i = 0; i < arrLine.length; i++) {
					    	newLine.push([arrLine[i].split(",")[1],arrLine[i].split(",")[0]])
					    }
					    newLine.pop()

						if(that.polyline) that.polyline.remove()
					    that.polyline = L.polyline(newLine, {
					    	color         :   '#4ca1e5' ,
					    	opacity       :    0.8   ,
					    	weight        :    5     ,
					    	dashArray     :    "10,10"
					    }).addTo(that.map)

					    that.runMarker.setLatLng(newLine.pop())

					})

			})
			
		}


	}
</script>

<style  lang="less" >
	 #map{
	 	width: 100vw;
	 	height: 100vh;
	 }
	 #tour{
	 	position: fixed;
	 	top:20px;
	 	left:0px;
	 	right:0px;
	 	margin:auto;
	 	z-index:10000;
	    width:80%;
	    .now{
	 		height:40px;
	 		background:rgba(255,255,255,0.9);
	    	line-height:40px;
	 		font-size:18px;
	 		border-radius: 5px;
	 		text-align:center;
	    }
	    .line{
	    	margin-top:5px;
			div{
				height:40px;
	 			background:rgba(255,255,255,0.9);
	    		line-height:40px;
	 			font-size:18px;
	 			border:1px solid #b8b7b3;
	 			text-align:center;

			}
	    }
	 }

	 .run{
	 	position: relative;
	 	margin-top:  -50% !important;
	 	margin-left: -50% !important;
	 	background: url("/src/assets/attraction-icon.png") no-repeat center center;
	 	background-size: 100% 100%;
	 	transition-property : width,height ;
	 	transition-duration : 1s ;

	 }
	 .runState{
	 	width: 70px !important;
	 	height: 70px !important;
	 }

	 .position{
	 	width: 44px;
	 	height: 245px;
	 	z-index: 1000;
		position: absolute;
    	z-index: 1000;
    	bottom: 0;
	 	div{
	 		 width:30px;
	 		 height: 30px;
	 		 background: red;
	 		 float: right;
	 		 margin-top: 30px;
	 		 background: url(/src/assets/map_location.png);
	 		 background-size: 100%;
	 		 position: relative;
	 		 z-index: 9999999;
	 	}
	 }

	 .ol-overlay-container {
	    will-change: left,right,top,bottom;
	}


	.facType-all {
		position: relative;
		top: -54px;
		left: -37px;

	    width: 66px;
	    height: 44px;
	    padding: 5px;
	    border-radius: 3px;
	    background-image: url(/src/assets/facType.png);
	    background-repeat: no-repeat;
	    background-size: 100% 100%;
	     // -webkit-transform: rotate(50deg); 
	}
	.asme{
		margin:0px !important;
		// display: none;
	}

	.facType-top {
	    border-bottom: 1px solid #888;
	    max-height: 18px; 
	    height: 18px;
	    overflow: hidden;
	}

	.facType-top img {
	    width: 15px;
	    height: 15px;
	}

	.facType-top p {
	    margin: 0px;
	    font-size: 10px;
	    position: relative;
	    left: 5px;
	    top: -2px;
	    display: inline;
	    height: 18px;
	    width: 51px;
	    overflow: hidden;
	    white-space: normal;
	    text-overflow: ellipsis;
	}

	.facType-bottom {
	    position: relative;
	}

	.facType-bottom img {
	    width: 13px;
	    height: 13px;
	    position: absolute;
	    top: 4px;
	    left: 0px;
	}

	.facType-bottom span {
	    font-size: 0.8em;
	    margin-left: 20px;
	}


</style>