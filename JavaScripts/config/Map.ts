import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","imgGuid","imgSize","isTotalView","rotAngle","startPos","endPos","sceneGuid"],["","","","","","","",""],[1,"119576",new mw.Vector2(1024,1024),true,0,new mw.Vector2(1570,-350),new mw.Vector2(1570,0),"08D935B9","自由城地图一代"],[2,"120534",new mw.Vector2(1024,1024),true,0,new mw.Vector2(1570,-350),new mw.Vector2(1570,0),"08D935B9","自由城地图二代"],[3,"132494",new mw.Vector2(1024,1024),false,0,new mw.Vector2(1570,-350),new mw.Vector2(1570,0),"08D935B9","自由城地图五代"],[4,"121103",new mw.Vector2(1024,1024),false,0,new mw.Vector2(1570,-350),new mw.Vector2(1570,0),"08D935B9","战地2077"]];
export interface IMapElement extends IElementBase{
 	/**地图id*/
	id:number
	/**地图图片的guid*/
	imgGuid:string
	/**地图图片大小*/
	imgSize:mw.Vector2
	/**是否显示全部*/
	isTotalView:boolean
	/**默认是以世界轴向的X指针方向为正北方，所以如果场景的正朝向没变这个角度就是0，否则MapUI的rootCanvas也应该相对旋转一个角度*/
	rotAngle:number
	/**这个地图的开始点位置（注意是在rootCanvas旋转后的渲染区域MapCanvas的相对位置）*/
	startPos:mw.Vector2
	/**这个地图的结束点位置（注意是在rootCanvas旋转后的渲染区域MapCanvas的相对位置）*/
	endPos:mw.Vector2
	/**地图场景的guid，传送到不同场景，其地图和场景guid都会发生改变*/
	sceneGuid:string
 } 
export class MapConfig extends ConfigBase<IMapElement>{
	constructor(){
		super(EXCELDATA);
	}

}