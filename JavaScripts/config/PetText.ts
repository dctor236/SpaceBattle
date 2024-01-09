import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","text"],["",""],[1,["Pet_Talk_01","Pet_Talk_02"],"跑步动作"],[2,["Pet_Talk_03","Pet_Talk_04","Pet_Talk_05","Pet_Talk_06"],"待机动作"],[3,["Pet_Talk_07","Pet_Talk_08"],"跑步动作"],[4,["Pet_Talk_09","Pet_Talk_10","Pet_Talk_11","Pet_Talk_12"],"待机动作"],[5,["Pet_Talk_13","Pet_Talk_14"],"跑步动作"],[6,["Pet_Talk_15","Pet_Talk_16","Pet_Talk_17","Pet_Talk_18"],"待机动作"]];
export interface IPetTextElement extends IElementBase{
 	/**文案id*/
	id:number
	/**文案内容*/
	text:Array<string>
 } 
export class PetTextConfig extends ConfigBase<IPetTextElement>{
	constructor(){
		super(EXCELDATA);
	}

}