import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","goodID","Name","Name_C","currency","description","description_C","money","isCreatItem","sort","limitCount","isNew","refreshDay"],["","","MainLanguage","ChildLanguage","","MainLanguage","ChildLanguage","","","","","",""],[9,307,"Paper Airplane","纸飞机",1,"A vehicle that can fight in space for only 5 minutes!","可以在太空中战斗的载具，每次只能使用5分钟！",0,1,0,0,0,0],[10,308,"X-Zero","X-零式",1,"A vehicle that can fight in space for only 5 minutes!","可以在太空中战斗的载具，每次只能使用5分钟！",100,1,0,0,0,0],[11,305,"Shake","摇摇乐",1,"A vehicle that can fight in space for only 5 minutes!","可以在太空中战斗的载具，每次只能使用5分钟！",200,1,0,0,0,0],[12,310,"Pink Candy","粉红糖果",1,"A vehicle that can fight in space for only 5 minutes!","可以在太空中战斗的载具，每次只能使用5分钟！",300,1,0,0,0,0],[13,306,"Combat Mech","战斗机甲",1,"A vehicle that can fight in space for only 5 minutes!","可以在太空中战斗的载具，每次只能使用5分钟！",500,1,0,0,0,0]];
export interface IShopElement extends IElementBase{
 	/**qid*/
	id:number
	/**背包物品id*/
	goodID:number
	/**商品名称*/
	Name:string
	/**货币类型（1为金币，2为银币，3月亮币）*/
	currency:number
	/**描述*/
	description:string
	/**花费多少钱*/
	money:number
	/**是否造物道具*/
	isCreatItem:number
	/**排序参数，数字越小越靠前*/
	sort:number
	/**限购数量（0不限购，大于0为限购几个）*/
	limitCount:number
	/**是否标记新物品*/
	isNew:number
	/**过几天刷新（0为不刷新，大于0为刷新天数，目前只支持1天）*/
	refreshDay:number
 } 
export class ShopConfig extends ConfigBase<IShopElement>{
	constructor(){
		super(EXCELDATA);
	}

}