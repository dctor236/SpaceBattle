import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","ClothPart","sex","guid","icon","haveicon","name"],["","","","","","",""],[1001,1,2,"134234","135037",0,"圣诞麋鹿上衣"],[1002,1,2,"131789","135036",0,"圣诞雪人上衣"],[1003,2,2,"111248","122317",0,"紧身裤"],[1004,3,2,"60081","168661",0,"手套"],[1005,4,2,"111252","122311",0,"长靴"],[1006,5,2,"92726","172000",0,"女巫前发"],[1007,6,2,"119744","119978",0,"女巫后发"],[1008,1,2,"120576","123375",1,"兔兔头套",null,null,"潮流泳衣"],[1009,1,2,"64546","131101",1,"光之巨人头套",null,null,"圣诞麋鹿上衣"],[1010,1,2,"125481","125481",0,"玩具熊头套",null,null,"祥瑞上衣"],[1011,1,2,"119113","123377",1,"小黑头套",null,null,"七分袖和服"],[1012,1,2,"125305","125305",0,"奶酪宝宝头套",null,null,"浅黄外套"],[1013,1,2,"129089","129089",0,"玩具兔头套",null,null,"运动T恤"],[1014,1,2,"63873","131155",1,"小黎头套",null,null,"蓝白交领上衣"],[1015,1,2,"142679","142679",0,"舞龙舞狮头套",null,null,"埃及风情"]];
export interface IClothPartElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**服装类型*/
	ClothPart:number
	/**男女*/
	sex:number
	/**模型guid*/
	guid:string
	/**图标*/
	icon:string
	/**是否有图标*/
	haveicon:number
	/**名字*/
	name:string
 } 
export class ClothPartConfig extends ConfigBase<IClothPartElement>{
	constructor(){
		super(EXCELDATA);
	}

}