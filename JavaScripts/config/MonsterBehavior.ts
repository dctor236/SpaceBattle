import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","behavior","skill","action","option","value"],["","","","","",""],[1,0,1001,0,0,null,"火球"],[2,0,1011,0,1,[20,40,60,80],"吐息"],[3,1,1009,0,0,null,"冲撞"],[4,2,1010,0,1,[50],"龙卷风"],[5,0,1014,301,0,null,"小弟挥拳1"],[6,0,1014,302,0,null,"小弟挥拳2"],[7,0,1014,303,0,null,"小弟挥拳3"],[8,0,1015,306,0,null],[9,0,1015,307,0,null],[10,0,1015,308,0,null],[11,0,2002,401,0,null,"低级僵尸攻击"],[12,0,2003,402,0,null,"女僵尸攻击"],[13,0,2004,403,0,null,"跳跳僵尸攻击"],[14,0,2005,404,0,null,"秃头僵尸攻击"],[15,0,2006,405,0,null,"屠夫攻击"],[16,0,1012,0,0,null,"ufo激光"]];
export interface IMonsterBehaviorElement extends IElementBase{
 	/**唯一id*/
	ID:number
	/**行为  0 无；1后撤—撞击；2 旋转*/
	behavior:number
	/**具体技能（monsterskill表ID）*/
	skill:number
	/**动作*/
	action:number
	/**触发条件属性（1血量）*/
	option:number
	/**值 百分比*/
	value:Array<number>
 } 
export class MonsterBehaviorConfig extends ConfigBase<IMonsterBehaviorElement>{
	constructor(){
		super(EXCELDATA);
	}

}