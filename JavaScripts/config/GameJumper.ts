import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","gameId","gameCode","icon","title1","title2","introduce","itemIcon","isHot"],["","","","","","","","",""],[1,"549948","A6su2HY5tpXzUuWJhhlR","121389","122921","122848","233广场","128849",true]];
export interface IGameJumperElement extends IElementBase{
 	/**undefined*/
	ID:number
	/**游戏id（国内）*/
	gameId:string
	/**游戏Id（海外）*/
	gameCode:string
	/**partygame游戏图*/
	icon:string
	/**（海外）游戏图标题*/
	title1:string
	/**（国内）游戏图标题*/
	title2:string
	/**游戏介绍*/
	introduce:string
	/**界面入口图标*/
	itemIcon:string
	/**是否热门*/
	isHot:boolean
 } 
export class GameJumperConfig extends ConfigBase<IGameJumperElement>{
	constructor(){
		super(EXCELDATA);
	}

}