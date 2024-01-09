import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","IDIndex","ModelGuid","ObjPoint","ObjParameter","effGuid","flyGoUpStance","flyGoUpSpeed","flyAccelerateTime","flyAccelerateAnimGuid","flyAccelerateBraking","flyAccelerateSpeed","flyAccelerateEffGuid","flyAccelerateEffParameter","flyAcceleratejetWkeFlameGuid","flyAcceleratejetWkeFlameParameter","flyWakeFlameGuid","flyWakeFlameParameterLeft","flyWakeFlameParameterRight","jetWakeFlameGuid","jetWakeFlameParameterLeft","jetWakeFlameParameterRight"],["","","","","","","","","","","","","","","","","","","","","",""],[20001,20001,"86749",12,[-10,0,-120,0,0,90,1,1,1],null,"20307",10,2,"53011",5000,"5000","197977",[0,-25,95,45,0,0,1,1,1],null,[0,-15,95,45,0,0,1,1,1],"197973",[33,-15,100,10,0,0,1,1,1],[-33,-15,100,10,0,0,1,1,1],"88445",[33,-15,100,0,0,0,1,1,1],[-33,-15,100,0,0,0,1,1,1]],[20002,20002,"86749",12,[0,0,10,0,0,90,1,1,1],"42829","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20003,20003,"86749",12,[0,0,10,0,0,90,1,1,1],"42831","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20004,20004,"86749",12,[0,0,10,0,0,90,1,1,1],"42823","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20005,20005,"86749",12,[0,0,10,0,0,90,1,1,1],"42825","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20006,20006,"86749",12,[0,0,0,0,0,90,1,1,1],"42828","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20007,20007,"86749",12,[0,0,0,0,0,90,1,1,1],"42821","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20008,20008,"86749",12,[0,0,0,0,0,90,1,1,1],"42818","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20009,20009,"86749",12,[0,0,0,0,0,90,1,1,1],"42804","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20010,20010,"86749",12,[0,0,-10,0,0,90,1,1,1],"42809","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20011,20011,"86749",12,[0,0,-10,0,0,90,1,1,1],"42812","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20012,20012,"86749",12,[0,0,-10,0,0,90,1,1,1],"42811","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20013,20013,"86749",12,[0,0,-10,0,0,90,1,1,1],"42830","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20014,20014,"86749",12,[5,0,0,0,0,90,1,1,1],"145909","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20015,20015,"86749",12,[0,0,0,0,0,90,1,1,1],"145913","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null],[20016,20016,"86749",12,[0,0,0,0,0,90,1,1,1],"145908","20307",10,2,"53011",5000,"5000",null,null,null,null,null,null,null,null,null,null]];
export interface IPropFlyElement extends IElementBase{
 	/**undefined*/
	ID:number
	/**索引ID*/
	IDIndex:number
	/**道具模型Guid*/
	ModelGuid:string
	/**道具挂点*/
	ObjPoint:number
	/**挂点参数：位置*/
	ObjParameter:Array<number>
	/**旋转*/
	effGuid:string
	/**缩放*/
	flyGoUpStance:string
	/**道具特效*/
	flyGoUpSpeed:number
	/**向上飞行姿态*/
	flyAccelerateTime:number
	/**向上飞行速度*/
	flyAccelerateAnimGuid:string
	/**加速时间(秒)*/
	flyAccelerateBraking:number
	/**加速动作Guid*/
	flyAccelerateSpeed:string
	/**加速后飞行制动*/
	flyAccelerateEffGuid:string
	/**加速后飞行速度*/
	flyAccelerateEffParameter:Array<number>
	/**加速特效Guid*/
	flyAcceleratejetWkeFlameGuid:string
	/**加速特效参数：位置，旋转，缩放*/
	flyAcceleratejetWkeFlameParameter:Array<number>
	/**加速拖尾Guid*/
	flyWakeFlameGuid:string
	/**加速拖尾参数：位置，旋转，缩放*/
	flyWakeFlameParameterLeft:Array<number>
	/**飞行时特效*/
	flyWakeFlameParameterRight:Array<number>
	/**飞行特效参数左：位置*/
	jetWakeFlameGuid:string
	/**旋转*/
	jetWakeFlameParameterLeft:Array<number>
	/**缩放（9）*/
	jetWakeFlameParameterRight:Array<number>
 } 
export class PropFlyConfig extends ConfigBase<IPropFlyElement>{
	constructor(){
		super(EXCELDATA);
	}

}