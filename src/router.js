
import descript  from "./components/Detail.vue"
import room  from "./components/Room.vue"
import detail  from "./components/DetailRoom.vue"
import list  from "./components/ListRoom.vue"




export  default  [
	{path:"/descript",component:descript},
	{path:"/roomDetail",component:detail,name:'roomDetail'},
	{path:"/room/:id",component:room,name:"room",
	 children:[
	 	{path:"list",component:list},
	 	{path:"detail",component:detail},
	 ]
	},
]