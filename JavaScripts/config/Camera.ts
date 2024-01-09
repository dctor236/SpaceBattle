import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","CharID","VectorType","Max","CameraID","lockRotation","camLen","Face"],["","","","","","","",""],[1,"B4DD6200",[2,200],[200,5],"69BE41EF",new mw.Vector(100,10,20),300,new mw.Vector(0,0,0),"舞蹈"],[2,"9DEDBC48",[1,200],[200,5],"47604133",new mw.Vector(100,10,20),300,new mw.Vector(0,0,0),"音乐"]];
export interface ICameraElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**第一个人物锚点ID*/
	CharID:string
	/**增加的坐标种类|加多少*/
	VectorType:Array<number>
	/**排与排之间的距离|满多少人自动换下一排*/
	Max:Array<number>
	/**摄像机锚点id*/
	CameraID:string
	/**摄像机相对位置坐标*/
	lockRotation:mw.Vector
	/**相机弹簧臂长度*/
	camLen:number
	/**人物旋转角度*/
	Face:mw.Vector
 } 
export class CameraConfig extends ConfigBase<ICameraElement>{
	constructor(){
		super(EXCELDATA);
	}

}