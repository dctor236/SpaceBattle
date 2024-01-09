import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","monsterType","isService","isChar","Guid","MonsterName","MonsterName_C","headsize","Behavior","headPos","Attr","PushNoticeTime","AppearTime","ActiveTime","Trigger","atkStance","PathRadius","Position","DeathGold","DeathItem","Appearance","zombiemove","hitSound","deadSound"],["","","","","","MainLanguage","ChildLanguage","","","","","","","","","","","","","","","","",""],[2,1,1,0,"051330C4","UFO-1","外星飞碟-1号",0,[16],new mw.Vector(0,0,0),7,0,60,0,"03D7A664",0,800,[new mw.Vector(3977.95,-6577.00,733),new mw.Vector(5742.95,-14799,733),new mw.Vector(10244.95,-11095.00,733)],[3,10],0,null,0,0,0],[3,1,1,0,"0E2FFE40","UFO-2","外星飞碟-2号",0,[16],new mw.Vector(0,0,0),7,0,60,0,"0F4942D6",0,800,[new mw.Vector(-17472.05,10578.00,1603.80),new mw.Vector(-22257.05,12000.00,1603.80),new mw.Vector(-21032.05,16568.00,1603.80)],[3,10],0,null,0,0,0]];
export interface IMonsterElement extends IElementBase{
 	/**唯一id*/
	ID:number
	/**怪物类型*/
	monsterType:number
	/**是否为双端*/
	isService:number
	/**是否是人型*/
	isChar:number
	/**资源GUID*/
	Guid:string
	/**怪物名字*/
	MonsterName:string
	/**字体大小*/
	headsize:number
	/**怪物行为(monsterbehavior表ID)（动作）*/
	Behavior:Array<number>
	/**头顶UI相对位置*/
	headPos:mw.Vector
	/**属性（BaseAttribute表ID）*/
	Attr:number
	/**推送时间(s)*/
	PushNoticeTime:number
	/**刷新时间(s)*/
	AppearTime:number
	/**存活时间(s)*/
	ActiveTime:number
	/**追击触发器*/
	Trigger:string
	/**攻击姿态（action）*/
	atkStance:number
	/**寻路检测半径*/
	PathRadius:number
	/**待机位置（初始位置）*/
	Position:mw.Vector[]
	/**死后爆钞票（ID|num）*/
	DeathGold:Array<number>
	/**死后爆道具*/
	DeathItem:number
	/**装扮*/
	Appearance:Array<number>
	/**action表*/
	zombiemove:number
	/**受击音效(Music表)*/
	hitSound:number
	/**死亡音效(Music表)*/
	deadSound:number
 } 
export class MonsterConfig extends ConfigBase<IMonsterElement>{
	constructor(){
		super(EXCELDATA);
	}

}