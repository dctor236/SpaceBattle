import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","assistType","isService","isChar","Guid","assistName","assistName_c","headsize","Behavior","headPos","Attr","PushNoticeTime","AppearTime","ActiveTime","Trigger","atkStance","PathRadius","Position","DeathGold","Appearance"],["","","","","","MainLanguage","ChildLanguage","","","","","","","","","","","","",""]];
export interface IAssistElement extends IElementBase{
 	/**唯一id*/
	ID:number
	/**怪物类型*/
	assistType:number
	/**是否为双端*/
	isService:number
	/**是否是人型*/
	isChar:number
	/**资源GUID*/
	Guid:string
	/**怪物名字*/
	assistName:string
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
	/**死后爆钞票（ID|num）（treature表）*/
	DeathGold:Array<number>
	/**装扮*/
	Appearance:Array<number>
 } 
export class AssistConfig extends ConfigBase<IAssistElement>{
	constructor(){
		super(EXCELDATA);
	}

}