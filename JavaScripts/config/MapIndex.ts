import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","imgGuid","mapId","pos","size","level","canFollow"],["","","","","","",""],[1,"37645",1,new mw.Vector2(100,100),new mw.Vector2(64,64),1,true,"铁匠铺"],[2,"37646",1,new mw.Vector2(500,500),new mw.Vector2(64,64),1,true,"橄榄枝"],[3,"37649",1,new mw.Vector2(700,700),new mw.Vector2(64,64),1,true,"食材"],[4,"37666",2,new mw.Vector2(100,100),new mw.Vector2(32,32),1,true,"回血"],[5,"37668",2,new mw.Vector2(123,300),new mw.Vector2(32,32),1,true,"武器"],[6,"37672",3,new mw.Vector2(100,100),new mw.Vector2(64,64),1,true,"任务地"],[7,"37674",3,new mw.Vector2(700,700),new mw.Vector2(64,64),1,true,"险地"],[8,"37747",3,new mw.Vector2(500,500),new mw.Vector2(64,64),1,true,"药剂"],[9,"37759",3,new mw.Vector2(220,220),new mw.Vector2(64,64),1,true,"训练场"],[10,"178568",1,new mw.Vector2(0,0),new mw.Vector2(64,64),2,true,"敌方位置底图"],[11,"131052",1,new mw.Vector2(0,0),new mw.Vector2(64,64),1,false,"友方位置底图"],[12,"179903",1,new mw.Vector2(0,0),new mw.Vector2(64,64),1,true,"三角警示图标"],[13,"178534",1,new mw.Vector2(0,0),new mw.Vector2(64,64),1,false,"倒地叉叉"]];
export interface IMapIndexElement extends IElementBase{
 	/**地图id*/
	id:number
	/**某块地图上指示物的图片guid*/
	imgGuid:string
	/**在哪块地图上（关联地图的id）*/
	mapId:number
	/**相对于imgCanvas的二维坐标*/
	pos:mw.Vector2
	/**大小*/
	size:mw.Vector2
	/**层级*/
	level:number
	/**能否跟随*/
	canFollow:boolean
 } 
export class MapIndexConfig extends ConfigBase<IMapIndexElement>{
	constructor(){
		super(EXCELDATA);
	}

}