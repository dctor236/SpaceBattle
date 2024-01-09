import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","seatPath","seatLocation","desc"],["","","",""],[1,"Seat1",new mw.Vector(0,-110,50),"编辑器载具一个座位"],[2,"Seat1",new mw.Vector(0,-110,110),"AI载具座位"],[3,"VeModel/Seat1",new mw.Vector(64,-10,39),"摩托车一个座位、快艇"],[4,"Seat1",new mw.Vector(0,-200,0),"飞机"],[5,"Seat1",new mw.Vector(0,0,0),"坦克"],[6,"Seat1",new mw.Vector(0,0,200),"飞碟"],[7,"Seat1",new mw.Vector(0,150,150),"吊车"],[8,"Seat1",new mw.Vector(0,-150,150),"AI载具座位"],[9,"Seat1",new mw.Vector(-50,-130,80),"红车"],[10,"Seat1",new mw.Vector(-70,-130,80),"跑车座位，敞篷"],[11,"Seat1",new mw.Vector(-30,-130,20),"皮卡"],[12,"Seat1",new mw.Vector(-110,-130,80),"皮卡车"],[13,"Seat1",new mw.Vector(-50,-130,20),"肌肉车"],[14,"Seat1",new mw.Vector(-50,-130,20),"面包车"],[15,"Seat1",new mw.Vector(-20,-130,60),"吊车"],[16,"Seat1",new mw.Vector(-40,-160,-60),"斜坡，面包"],[17,"Seat1",new mw.Vector(-70,-130,80),"面包车"],[18,"Seat1",new mw.Vector(-60,-130,20),"警用，蓝色"],[19,"Seat1",new mw.Vector(-80,-130,0),"面包车"],[20,"Seat1",new mw.Vector(0,-130,40),"救护车"]];
export interface IVInfoSeatElement extends IElementBase{
 	/**id*/
	id:number
	/**座位交互物路径*/
	seatPath:string
	/**座位交互离开时相对坐标*/
	seatLocation:mw.Vector
	/**备注*/
	desc:string
 } 
export class VInfoSeatConfig extends ConfigBase<IVInfoSeatElement>{
	constructor(){
		super(EXCELDATA);
	}

}