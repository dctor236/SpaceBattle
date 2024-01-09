import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","actionDistance","actionTime","WordDistance","ExpressionDistance","ExpressionScale","ExpressionHeight","ExpressionTime","CameraScalingProportion","CameraScalingRange"],["","","","","","","","","",""],[1,150,5,10,20,new mw.Vector(2,2,2),200,5,100,[300,2000]]];
export interface IGlobalConfigElement extends IElementBase{
 	/**undefined*/
	ID:number
	/**动作响应距离*/
	actionDistance:number
	/**动作响应时间*/
	actionTime:number
	/**聊天文本间距*/
	WordDistance:number
	/**聊天表情间距*/
	ExpressionDistance:number
	/**聊天表情大小*/
	ExpressionScale:mw.Vector
	/**聊天表情高度*/
	ExpressionHeight:number
	/**表情特效持续时间*/
	ExpressionTime:number
	/**摄像机距离变化比例*/
	CameraScalingProportion:number
	/**摄像机距离变化范围*/
	CameraScalingRange:Array<number>
 } 
export class GlobalConfigConfig extends ConfigBase<IGlobalConfigElement>{
	constructor(){
		super(EXCELDATA);
	}

}