import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","type","name","icon","icon_Ch","icon_J","icon_D","actionId","singleType","doubleType","v","r","sendStance","accectStance","time","visual1","visual2","circulate"],["","","Language","MainLanguage","ChildLanguage","ChildLanguage","ChildLanguage","","","","","","","","","","",""],[1,1,"Action_01","86255","34419","86255","86255","14641",0,0,null,null,null,null,1,null,null,false],[2,1,"Action_02","86252","35629","86252","86252","15057",0,0,null,null,null,null,1,null,null,false],[3,1,"Action_03","86270","35628","86270","86270","14617",0,0,null,null,null,null,1,null,null,false],[4,1,"Action_04","86269","35630","86269","86269","14759",0,0,null,null,null,null,1,null,null,false],[5,1,"Action_05","86254","34431","86254","86254","14771",0,0,null,null,null,null,1,null,null,false],[6,1,"Action_06","86259","35632","86259","86259","14766",0,0,null,null,null,null,1,null,null,false],[7,1,"Action_07","86263","34426","86263","86263","15078",0,0,null,null,null,null,1,null,null,false],[8,1,"Action_08","86256","34417","86256","86256","14504",0,0,null,null,null,null,1,null,null,false],[9,1,"Action_09","86264","34430","86264","86264","14655",0,0,null,null,null,null,1,null,null,false],[10,1,"Action_10","86253","34421","86253","86253","14023",1,0,null,null,null,null,0,null,null,false],[11,1,"Action_11","86266","34428","86266","86266","4174",1,0,null,null,null,null,0,null,null,false],[12,1,"Action_12","86262","34427","86262","86262","14602",0,0,null,null,null,null,1,null,null,false],[13,1,"Action_13","86272","34423","86272","86272","14571",0,0,null,null,null,null,1,null,null,false],[14,1,"Action_14","86257","34424","86257","86257","14511",0,0,null,null,null,null,1,null,null,false],[15,1,"Action_15","86261","34425","86261","86261","14497",0,0,null,null,null,null,1,null,null,false],[16,2,"Action_16","98715","98699","98715","98715",null,0,3,new mw.Vector(-22,-2,110),new mw.Vector(0,0,0),"103085","4174",0,null,null,false],[17,2,"Action_17","98712","98700","98712","98712",null,0,3,new mw.Vector(-6,-2,-75),new mw.Vector(0,0,0),"101653","101652",0,null,null,false],[18,2,"Action_18","98675","98701","98675","98675",null,0,3,new mw.Vector(-148,-2,-86),new mw.Vector(0,23,0),"101651","101650",0,null,null,false],[19,2,"Action_19","86267","34420","86267","86267",null,0,1,new mw.Vector(30,0,0),new mw.Vector(0,0,180),"14703","14765",0,null,null,false],[20,2,"Action_20","86271","34435","86271","86271",null,0,2,new mw.Vector(-20,0,-50),new mw.Vector(0,0,0),"35464","38174",0,null,new mw.Vector(0,0,50),false],[21,2,"Action_21","98707","98708","98707","98707",null,0,2,new mw.Vector(-40,0,-35),new mw.Vector(0,0,0),"35463","38173",0,null,new mw.Vector(0,0,100),false],[22,1,"Action_22","98681","98674","98681","98681","88448",0,0,null,null,null,null,1,null,null,true],[23,1,"Action_23","98697","98714","98697","98697","88544",0,0,null,null,null,null,1,null,null,true],[24,1,"Action_24","98711","98673","98711","98711","88450",0,0,null,null,null,null,1,null,null,true],[25,1,"Action_25","98698","98682","98698","98698","88449",0,0,null,null,null,null,1,null,null,true],[26,1,"Action_26","98684","98672","98684","98684","88541",0,0,null,null,null,null,1,null,null,true],[27,1,"Action_27","98685","98713","98685","98685","88543",0,0,null,null,null,null,1,null,null,true],[28,1,"Action_28","108523","108519","108523","108523","108414",0,0,null,null,null,null,1,null,null,true]];
export interface ISquareActionConfigElement extends IElementBase{
 	/**undefined*/
	ID:number
	/**1.单人动作 2.双人动作 类型*/
	type:number
	/**名称*/
	name:string
	/**英文图标*/
	icon:string
	/**单人动作 动作id*/
	actionId:string
	/**0.动画 1.姿态 单人动作是否为姿态*/
	singleType:number
	/**1.普通 2.交互 3.强制动作 双人动作类型*/
	doubleType:number
	/**普通动作相对于发起者正前方的距离，取配置Z坐标。 交互动作相对于发起者的脸部的偏移。 接收者位置偏移*/
	v:mw.Vector
	/**接收者旋转偏移*/
	r:mw.Vector
	/**发起者姿态*/
	sendStance:string
	/**接收者姿态*/
	accectStance:string
	/**动作播放时间*/
	time:number
	/**发起者视角偏移*/
	visual1:mw.Vector
	/**接受者视角偏移*/
	visual2:mw.Vector
	/**是否循环*/
	circulate:boolean
 } 
export class SquareActionConfigConfig extends ConfigBase<ISquareActionConfigElement>{
	constructor(){
		super(EXCELDATA);
	}

}