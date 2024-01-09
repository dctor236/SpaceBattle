import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","guid","petName","scale","color","idle","run","wait","effectid","audioid","talkid"],["","","Language","","","","","","","",""],[1,"159610","Pet_Name_01",1.5,"#FFBB2C","150779","150782",["150780","150784","160132","160136","159956"],[53,54,55,56,0],[70,70,70,70,70],[1,2]],[2,"160250","Pet_Name_02",1.5,"#F88CFF","150779","150782",["150784","159869","160134","150788","159866"],[57,58,59,60,0],[70,70,70,70,70],[3,4]],[3,"159749","Pet_Name_03",1.5,"#0C0700","150779","150782",["150788","150785","159866","150787","150784"],[61,62,63,64,0],[70,70,70,70,70],[5,6]]];
export interface IPetListElement extends IElementBase{
 	/**宠物id*/
	id:number
	/**模型guid*/
	guid:string
	/**宠物名字*/
	petName:string
	/**缩放*/
	scale:number
	/**文本颜色*/
	color:string
	/**待机动作*/
	idle:string
	/**走路*/
	run:string
	/**闲置动作guid*/
	wait:Array<string>
	/**闲置特效*/
	effectid:Array<number>
	/**闲置音效*/
	audioid:Array<number>
	/**状态文案id*/
	talkid:Array<number>
 } 
export class PetListConfig extends ConfigBase<IPetListElement>{
	constructor(){
		super(EXCELDATA);
	}

}