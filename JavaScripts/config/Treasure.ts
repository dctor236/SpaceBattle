import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","Guid","RefreshPosArr","second","unRefreshPosArr","itemID","itemEffect","moneyvalue"],["","","","","","","",""],[4,"E1240BCE4385942142B811815FE0E8B7",[new mw.Vector(414.35,1515.48,-72.54),new mw.Vector(1254.35,895.48,-72.54),new mw.Vector(1544.35,-54.52,-72.54),new mw.Vector(1059.35,-1104.52,-72.54),new mw.Vector(99.35,-1594.52,-72.54),new mw.Vector(-1005.65,-1214.52,-72.54),new mw.Vector(-1640.65,-54.52,-72.54),new mw.Vector(-860.65,1280.48,-72.54),new mw.Vector(-860.65,6415.48,-72.54),new mw.Vector(-860.65,6475.48,-2822.54),new mw.Vector(1739.35,4290.48,-1262.54),new mw.Vector(3019.35,3290.48,-237.54),new mw.Vector(3999.35,1825.48,-552.54),new mw.Vector(3999.35,760.48,-262.54),new mw.Vector(3999.35,-589.52,-1002.54),new mw.Vector(3284.35,-2749.52,122.46),new mw.Vector(2009.35,-3719.52,-892.54),new mw.Vector(679.35,-3719.52,-1352.54),new mw.Vector(-485.65,-3719.52,182.46),new mw.Vector(-1520.65,-3719.52,-307.54),new mw.Vector(-2130.65,-3214.52,-1712.54),new mw.Vector(-2550.65,-1844.52,-1712.54),new mw.Vector(-2550.65,-129.52,-982.54),new mw.Vector(-2550.65,1960.48,-1732.54),new mw.Vector(-510.65,2455.48,-1732.54),new mw.Vector(25024.35,-7894.52,-3622.54),new mw.Vector(23429.35,-13824.52,-3622.54),new mw.Vector(18714.35,-18369.52,-3622.54),new mw.Vector(10894.35,-29074.52,-3622.54),new mw.Vector(-280.65,-27559.52,1537.46),new mw.Vector(-4200.65,-27559.52,597.46),new mw.Vector(-7865.65,-27559.52,-1157.54),new mw.Vector(-14035.65,-24669.52,2957.46),new mw.Vector(-20405.65,-18574.52,2957.46),new mw.Vector(-25375.65,-10819.52,6042.46),new mw.Vector(-26450.65,-8874.52,7812.46),new mw.Vector(-26450.65,-1939.52,7397.46),new mw.Vector(-27345.65,2385.48,6697.46),new mw.Vector(-25930.65,-25930.65,4277.46),new mw.Vector(-25930.65,12290.48,447.46),new mw.Vector(-22425.65,21630.48,7157.46),new mw.Vector(-20355.65,20825.48,6662.46),new mw.Vector(-15060.65,17900.48,5072.46),new mw.Vector(-11385.65,17900.48,5072.46),new mw.Vector(-6665.65,14580.48,7037.46),new mw.Vector(-1815.65,14080.48,5652.46),new mw.Vector(2504.35,12100.48,4077.46),new mw.Vector(11179.35,-2264.52,3017.46),new mw.Vector(16769.35,-4139.52,-8472.54),new mw.Vector(29084.35,-12119.52,-7617.54),new mw.Vector(10814.35,-12119.52,-6007.54),new mw.Vector(3244.35,-23579.52,-1267.54),new mw.Vector(429.35,-27919.52,-1267.54),new mw.Vector(-9865.65,-25729.52,-2497.54)],30,null,0,303,5,"大钞票"]];
export interface ITreasureElement extends IElementBase{
 	/**qid*/
	id:number
	/**资源guid（预制体id）*/
	Guid:string
	/**可刷新的点位集合*/
	RefreshPosArr:mw.Vector[]
	/**刷新cd*/
	second:number
	/**不可刷新的点位*/
	unRefreshPosArr:mw.Vector[]
	/**item表id*/
	itemID:number
	/**特效*/
	itemEffect:number
	/**钞票价值*/
	moneyvalue:number
 } 
export class TreasureConfig extends ConfigBase<ITreasureElement>{
	constructor(){
		super(EXCELDATA);
	}

}