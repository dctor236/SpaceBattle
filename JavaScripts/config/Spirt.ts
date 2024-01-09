import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","spiritType","att","spiritName","scale","pos","rot","covenantScale","skill"],["","","","","","","","",""],[1,1,2,"敏捷精灵",new mw.Vector(1,1,1),new mw.Vector(1166.220,1833.360,330),new mw.Vector(0,0,0),0.2,1013],[2,2,3,"力量精灵",new mw.Vector(1,1,1),new mw.Vector(1040.360,2747.680,330),new mw.Vector(0,0,0),0.2,1012],[3,2,3,"力量精灵",new mw.Vector(1,1,1),new mw.Vector(-1191.290,1799.230,1370.830),new mw.Vector(0,0,0),0.2,1012],[4,2,3,"力量精灵",new mw.Vector(1,1,1),new mw.Vector(1048.680,3729.240,2317.730),new mw.Vector(0,0,0),0.2,1012],[5,1,2,"敏捷精灵",new mw.Vector(1,1,1),new mw.Vector(-791.280,3419.200,4424.630),new mw.Vector(0,0,0),0.2,1013],[6,1,2,"敏捷精灵",new mw.Vector(1,1,1),new mw.Vector(3369.160,2718.200,10500.480),new mw.Vector(0,0,0),0.2,1013],[7,1,2,"敏捷精灵",new mw.Vector(1,1,1),new mw.Vector(-686.940,4414.880,11365.650),new mw.Vector(0,0,0),0.2,1013],[8,2,3,"力量精灵",new mw.Vector(1,1,1),new mw.Vector(3.050,5334.920,11501.790),new mw.Vector(0,0,0),0.2,1012],[9,2,3,"力量精灵",new mw.Vector(1,1,1),new mw.Vector(-2497.63,652.5,13800),new mw.Vector(0,0,0),0.2,1012],[10,1,2,"敏捷精灵",new mw.Vector(1,1,1),new mw.Vector(1983.86,6827.04,13800),new mw.Vector(0,0,0),0.2,1013]];
export interface ISpirtElement extends IElementBase{
 	/**id*/
	id:number
	/**精灵种类(1力量2 敏捷)*/
	spiritType:number
	/**属性表*/
	att:number
	/**宠物名字*/
	spiritName:string
	/**缩放*/
	scale:mw.Vector
	/**世界位置*/
	pos:mw.Vector
	/**世界旋转*/
	rot:mw.Vector
	/**契约缩小*/
	covenantScale:number
	/**精灵技能（monsterskill表）*/
	skill:number
 } 
export class SpirtConfig extends ConfigBase<ISpirtElement>{
	constructor(){
		super(EXCELDATA);
	}

}