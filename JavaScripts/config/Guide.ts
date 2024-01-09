import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","npcTalk","playerTalk","nextGuideId","npcID","cameraShake","mover","cg","bgm"],["","","","","","","","",""],[1,216,null,[2],2081,1,null,null,"179625"],[2,217,[214,215],[3,9],2000,0,null,null,null],[3,218,null,[4],2000,0,null,"{\"_frameInfos\":[{\"_time\":0,\"_location\":{\"x\":3047.55,\"y\":2040.92,\"z\":13483.61},\"_rotation\":{\"x\":0,\"y\":15.76,\"z\":143.87},\"_fov\":90},{\"_time\":29.88,\"_location\":{\"x\":3149.6,\"y\":2465.3,\"z\":13483.61},\"_rotation\":{\"x\":0,\"y\":11.18,\"z\":158.61},\"_fov\":90}]}",null],[4,229,[216,217],[5,6],2000,0,null,null,null],[5,219,[219,220],[100,3],2000,0,null,"{\"_frameInfos\":[{\"_time\":0,\"_location\":{\"x\":2764.31,\"y\":-10575.01,\"z\":395.45},\"_rotation\":{\"x\":0,\"y\":5.59,\"z\":27.49},\"_fov\":90},{\"_time\":10.02,\"_location\":{\"x\":2764.31,\"y\":-10575.01,\"z\":395.45},\"_rotation\":{\"x\":0,\"y\":5.59,\"z\":27.49},\"_fov\":90}]}",null],[6,220,null,[7],2000,0,null,null,null],[7,221,null,[8],2000,0,null,"{\"_frameInfos\":[{\"_time\":0,\"_location\":{\"x\":881.46,\"y\":2502.45,\"z\":351.91},\"_rotation\":{\"x\":0,\"y\":-6.1,\"z\":57.94},\"_fov\":90},{\"_time\":10.07,\"_location\":{\"x\":881.46,\"y\":2502.45,\"z\":351.91},\"_rotation\":{\"x\":0,\"y\":-6.1,\"z\":57.94},\"_fov\":90}]}",null],[8,222,[219,220],[100,3],2000,0,null,"{\"_frameInfos\":[{\"_time\":0,\"_location\":{\"x\":1513.83,\"y\":1779.05,\"z\":263.58},\"_rotation\":{\"x\":0,\"y\":1.52,\"z\":171.78},\"_fov\":90},{\"_time\":10.02,\"_location\":{\"x\":1513.83,\"y\":1779.05,\"z\":263.58},\"_rotation\":{\"x\":0,\"y\":-4.07,\"z\":173.82},\"_fov\":90}]}",null],[9,223,[218],[10],2000,0,null,null,null],[10,224,[222],[100],2000,0,null,null,null],[21,230,null,[100],2000,0,null,null,null,"玩家死亡时触发"],[22,225,null,[23],2081,0,null,null,"179625","龙被击杀1s后"],[23,226,[222],[100],2000,0,null,null,null],[24,228,[222],[100],2000,0,null,null,null,"龙没有在规定时间被击杀，飞走后1s"],[30,232,null,[31],60,0,null,null,null],[31,233,null,[32],60,0,null,null,null],[32,234,null,[33],3019,1,null,"{\"_frameInfos\":[{\"_time\":0,\"_location\":{\"x\":61679.68,\"y\":-2100.81,\"z\":-57267.13},\"_rotation\":{\"x\":0,\"y\":-5.08,\"z\":3.79},\"_fov\":90},{\"_time\":20.02,\"_location\":{\"x\":61679.68,\"y\":-2100.81,\"z\":-57267.13},\"_rotation\":{\"x\":0,\"y\":-5.08,\"z\":3.79},\"_fov\":90}]}",null],[33,235,null,null,3019,0,null,null,null],[50,236,null,null,3019,0,null,null,null],[60,237,null,null,3019,0,null,null,null],[70,238,null,[71],3022,1,null,null,null],[71,239,null,null,3022,0,null,null,null]];
export interface IGuideElement extends IElementBase{
 	/**id*/
	id:number
	/**NPC对话*/
	npcTalk:number
	/**玩家对话*/
	playerTalk:Array<number>
	/**下一个引导id*/
	nextGuideId:Array<number>
	/**NPC名字language*/
	npcID:number
	/**镜头抖动是否开启*/
	cameraShake:number
	/**运动的对象*/
	mover:Array<string>
	/**是否有cg动画*/
	cg:string
	/**背景音效guid*/
	bgm:string
 } 
export class GuideConfig extends ConfigBase<IGuideElement>{
	constructor(){
		super(EXCELDATA);
	}

}