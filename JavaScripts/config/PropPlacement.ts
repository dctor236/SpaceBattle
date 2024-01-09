import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","IDIndex","ModelGuid","ObjPoint","ObjParameter","ObjUsePoint","ObjUseParameter","ObjPlaceCD","ObjEffGuid","IconPropGuid","AnimEquipGuid","AnimEquipParameter","AnimUseGuid","AnimUseParameter","DelayOffsetFront","DelayModelGuid","DelayModelParameter","DelayModelEffGuid","DelayModelEffParameter","DelayEffGuid","DelayEffParameter","DelaySoundGuid","DelaySoundParameter","DelayTime","DelayCount","DelayCountTime","DelayRange","DelayBuff"],["","","","","","","","","","","","","","","","","","","","","","","","","","","",""],[30001,30001,"96556",15,[5,3,-5,0,0,0,3,3,3],15,[5,3,-5,0,0,0,3,3,3],5,null,"96593",null,0,"52981",1,40,"96556",[0,0,60,0,0,0,4,4,4],null,null,"4374",[0,0,0,0,0,0,1,1,1],"97372",[1,1000],3,5,1,0,null],[30002,30002,"7669",15,[0,0,0,0,0,0,0.5,0.5,0.5],15,[0,0,0,0,0,0,0.5,0.5,0.5],5,"86375","96613",null,0,"52981",1,40,"7669",[0,0,60,0,0,0,0.01,0.01,0.01],"86375",[0,0,0,0,0,0,2,2,2],"85151",[0,0,0,0,0,0,1,1,1],"97385",[1,1000],3,1,1,0,null]];
export interface IPropPlacementElement extends IElementBase{
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
	ObjUsePoint:number
	/**缩放*/
	ObjUseParameter:Array<number>
	/**使用道具挂点*/
	ObjPlaceCD:number
	/**使用位置参数：位置*/
	ObjEffGuid:string
	/**旋转*/
	IconPropGuid:string
	/**缩放*/
	AnimEquipGuid:string
	/**道具CD时间*/
	AnimEquipParameter:number
	/**道具特效Guid*/
	AnimUseGuid:string
	/**道具使用图标Guid*/
	AnimUseParameter:number
	/**装备动作Guid*/
	DelayOffsetFront:number
	/**装备动作相关参数: 时间*/
	DelayModelGuid:string
	/**使用动作Guid*/
	DelayModelParameter:Array<number>
	/**使用动作相关参数: 时间*/
	DelayModelEffGuid:string
	/**道具放置向前偏移*/
	DelayModelEffParameter:Array<number>
	/**延迟模型Guid*/
	DelayEffGuid:string
	/**延迟模型偏移参数：位置，旋转，缩放*/
	DelayEffParameter:Array<number>
	/**延迟模型对应特效Guid*/
	DelaySoundGuid:string
	/**延迟模型对应特效偏移参数：位置，旋转，缩放*/
	DelaySoundParameter:Array<number>
	/**延迟特效Guid*/
	DelayTime:number
	/**延迟特效相关参数：位置，旋转，缩放*/
	DelayCount:number
	/**延迟声音Guid*/
	DelayCountTime:number
	/**延迟声音相关参数：音量，范围*/
	DelayRange:number
	/**延迟生效时间(秒)*/
	DelayBuff:Array<number>
 } 
export class PropPlacementConfig extends ConfigBase<IPropPlacementElement>{
	constructor(){
		super(EXCELDATA);
	}

}