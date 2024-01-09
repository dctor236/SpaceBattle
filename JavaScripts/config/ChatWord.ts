import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","WordID"],["",""],[1,100095],[2,100096],[3,100097],[4,100098],[5,100099],[6,100100]];
export interface IChatWordElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**语句ID*/
	WordID:number
 } 
export class ChatWordConfig extends ConfigBase<IChatWordElement>{
	constructor(){
		super(EXCELDATA);
	}

}