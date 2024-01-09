import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","BgmGuid","ActionGuid","Effect"],["","","",""],[1,"13937",["14552","14554"],null,"搞怪舞蹈"],[2,"14031",["14771","14554","14771","14993"],null,"搞怪舞蹈"],[3,"19999",["14594","88449"],null,"优雅舞蹈"],[4,"20066",["88544"],null,"摇滚"],[5,"21352",["88541"],null,"活泼"],[6,"27943",["14700"],null,"木偶舞搞怪"],[7,null,null,null],[8,null,null,null],[9,null,null,null],[10,null,null,null],[11,null,null,null],[12,null,null,null],[13,null,null,null],[14,null,null,null],[15,null,null,null],[16,null,null,null]];
export interface IBgmActionElement extends IElementBase{
 	/**唯一id*/
	ID:number
	/**音效资源id*/
	BgmGuid:string
	/**舞蹈动作组*/
	ActionGuid:Array<string>
	/**特效*/
	Effect:Array<number>
 } 
export class BgmActionConfig extends ConfigBase<IBgmActionElement>{
	constructor(){
		super(EXCELDATA);
	}

}