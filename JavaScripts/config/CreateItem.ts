import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","ItemID","skillID","Level","CreationGuid","CreationTime","CreationIsClient","AnimGuid","SkillGuid","SkillTime","SkillIsClient","Appearance","ClothType","ClothTime","EffGuid","EffectPoint","TransformEffect","SoundGuid","SoundParameter","Time","Guid","Position","Scale"],["","","","","","","","","","","","","","","","","","","","","","",""],[1,50001,400101,1,"FAF7C83943DAE19F39050EB57C5F748F",2,true,"14736",null,0,null,null,0,0,null,0,null,null,null,10,"0C22E76C",new mw.Vector(0,0,0),new mw.Vector(1,1,1),"车轮滚滚"],[2,50002,400102,1,"306766444066C0380B5248AD788BF58F",2,true,null,"AC2AA29E4F4621F069DD9D9E22C202E8",20,false,null,0,0,null,0,null,null,null,0,"3132CDD9",new mw.Vector(0,0,-5),new mw.Vector(1.2,1.5,0.25),"变成台阶"],[3,50003,400103,1,"626808904DA965074E5F4CBD6B417F06",2,true,null,"BCCC3E214A415F0958183D8CBDF15615",6,true,null,0,0,null,0,null,null,null,0,"345BC033",new mw.Vector(0,0,-15),new mw.Vector(1,1,1),"炸弹！炸弹！"],[4,50004,400104,1,"50ADD1E84C42282E83D5A6887B64BE85",2,true,null,"319F2CD84F439A6BCEAC34923F7842EF",5,true,null,0,0,null,0,null,null,null,0,"034DEF14",new mw.Vector(0,0,-30),new mw.Vector(1,1,1),"爱你一万年"],[5,50005,400105,1,"CAEA34FF44591E6C012A73B968483809",2,true,null,null,0,null,"119668",1,60,null,0,null,null,null,0,"2833C032",new mw.Vector(0,0,0),new mw.Vector(1,1,1),"扮鬼头套"],[6,50006,400106,1,"EB980937496A9DDD15D656A9DCF91DCA",2,true,null,"24335443494F477359C6FB852EE858D4",30,true,null,0,0,null,0,null,null,null,0,"2FEB2DC3",new mw.Vector(0,0,0),new mw.Vector(1,1,1),"烟花"]];
export interface ICreateItemElement extends IElementBase{
 	/**ID*/
	ID:number
	/**道具表ID*/
	ItemID:number
	/**对应技能ID*/
	skillID:number
	/**所需技能等级*/
	Level:number
	/**造物时预制体*/
	CreationGuid:string
	/**造物预制体存活时间*/
	CreationTime:number
	/**造物预制体是否客户端*/
	CreationIsClient:boolean
	/**动作Guid（使用物品的动作）*/
	AnimGuid:string
	/**释放技能时放置预制体*/
	SkillGuid:string
	/**技能预制体存活时间*/
	SkillTime:number
	/**技能预制体是否客户端*/
	SkillIsClient:boolean
	/**角色换装资源*/
	Appearance:string
	/**1、头部*/
	ClothType:number
	/**换装时间*/
	ClothTime:number
	/**特效Guid*/
	EffGuid:string
	/**特效挂点*/
	EffectPoint:number
	/**特效参数：位置，旋转，缩放*/
	TransformEffect:Array<number>
	/**音效资源Guid*/
	SoundGuid:string
	/**音效配置：范围，音量，循环*/
	SoundParameter:Array<number>
	/**时间(秒)*/
	Time:number
	/**造物物品对应场景guid*/
	Guid:string
	/**挂载锚点相对位置*/
	Position:mw.Vector
	/**缩放*/
	Scale:mw.Vector
 } 
export class CreateItemConfig extends ConfigBase<ICreateItemElement>{
	constructor(){
		super(EXCELDATA);
	}

}