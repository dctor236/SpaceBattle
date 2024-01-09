import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","desc","doorPath","doorMaxAgnle","doorTime","doorAnchorPath"],["","","","","",""],[1,"编辑器载具门1","Door1",70,0.5,"DoorAnim1"],[2,"编辑器载具门2","Door2",-70,0.5,"DoorAnim2"],[3,"编辑器载具门3","Door3",70,0.5,"DoorAnim3"],[4,"编辑器载具门4","Door4",-70,0.5,"DoorAnim4"]];
export interface IVehicleDoorAnimElement extends IElementBase{
 	/**id*/
	id:number
	/**描述*/
	desc:string
	/**载具门路径*/
	doorPath:string
	/**载具开门最大角度*/
	doorMaxAgnle:number
	/**载具开门动画时间秒*/
	doorTime:number
	/**寻路到载具门的锚点路径*/
	doorAnchorPath:string
 } 
export class VehicleDoorAnimConfig extends ConfigBase<IVehicleDoorAnimElement>{
	constructor(){
		super(EXCELDATA);
	}

}