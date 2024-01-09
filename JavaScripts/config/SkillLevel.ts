import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","MpUse","SkillCD","MaxCharge","Damage","DamageRate","isTelescope","SkillType","BuffName","RunTime","TrrigerConfig","TrrigerConfig2","Param1"],["","","","","","","","","","","","",""],[101101,0,2,1,2,[20],0,2,null,null,"BoxBulletTrriger:movex=100,movey=0,movez=0,x=2.5,y=2.5,z=2.5,type=1,interval=0,effect=43,music=54","size=1,speed=100,damageTime=0,fireMusic=0,fireEff=0",null,"1级风系技能1"],[101201,0,5,1,3,[50,60],0,1,null,null,"BoxBulletTrriger:movex=100,movey=0,movez=0,x=4,y=6,z=6,type=2,interval=0.1,effect=38,music=57","size=1,speed=100,damageTime=0,fireMusic=0,fireEff=0",null,"1级风系技能2"],[101301,0,3,1,1.5,[22],0,2,null,null,"BoxBulletTrriger:movex=100,movey=0,movez=0,x=2.5,y=2.5,z=2.5,type=1,interval=0,effect=37,music=54","size=1,speed=100,damageTime=0,fireMusic=0,fireEff=0","500101","1级风系技能3"],[101401,0,12,1,0.2,[23],0,1,null,null,"BoxBulletTrriger:movex=0,movey=0,movez=0,x=2.2,y=15,z=4,type=3,interval=0,effect=37,music=54",null,null,"1级风系技能4"],[201101,0,3,1,0,[24],0,0,null,[9999],null,null,"157056|157058|29|0|0","1级魔法扫帚"],[201121,0,3,1,0,null,0,0,null,[9999],null,null,"410|0|32|0|0","单人飞机"],[201122,0,3,1,0,null,0,0,null,null,null,null,"411|0|0|405|180","机甲女"],[201123,0,3,1,0,null,0,0,null,null,null,null,"412|0|46|0|0","纸飞机"],[201124,0,3,1,0,null,0,0,null,null,null,null,"410|0|47|0|0","战斗机"],[201125,0,3,1,0,null,0,0,null,null,null,null,"410|0|48|0|0","摇摇乐"],[201126,0,3,1,0,null,0,0,null,null,null,null,"410|0|49|0|0","糖果机"],[201201,0,1,1,0,[25],0,0,null,[9999],null,null,null,"星之力"],[202101,0,2,1,3,[60,80],0,1,null,null,"BoxBulletTrriger:movex=100,movey=0,movez=0,x=4,y=6,z=6,type=2,interval=0.1,effect=38,music=57","size=0,speed=100,damageTime=0.05,fireMusic=0,fireEff=0",null,"雪球魔杖"],[203101,0,1,1,0,[27],0,0,null,[9999],null,null,null,"滑板"],[204101,0,5,1,0,[28],0,0,null,[9999],null,null,"1","宠物召唤1"],[204102,0,5,1,0,[29],0,0,null,[9999],null,null,"2","宠物召唤2"],[204103,0,5,1,0,[30],0,0,null,[9999],null,null,"3","宠物召唤3"],[205101,0,3,1,0,[24],0,0,null,[9999],null,null,"309","翅膀技能1"],[205102,0,3,1,0,[24],0,0,null,[9999],null,null,"310","翅膀技能1"],[206101,0,0,1,0,[31],0,0,null,[9999],null,null,null,"1级滑翔术"],[207101,0,0,1,0,[32],0,0,null,null,null,null,null],[207201,0,0,2,0,[33],0,0,null,null,null,null,null],[208101,0,0,1,0,[34],0,0,null,null,null,null,null,"契约之戒签约"],[208201,0,0,1,0,[35],0,0,null,null,null,null,null,"契约之戒展示"],[301101,0,5,1,0,[36],0,0,null,null,null,null,null,"1级造物魔杖"],[302101,0,10,1,0,[37],0,0,null,null,null,null,"13|12","换装1"],[302102,0,10,1,0,[38],0,0,null,null,null,null,"19|20","换装2"],[302103,0,10,1,0,[39],0,0,null,null,null,null,"21|18","换装3"],[302104,0,10,1,0,[40],0,0,null,null,null,null,"11|10","换装4"],[302105,0,10,1,0,[41],0,0,null,null,null,null,"7|6","换装5"],[312101,0,5,1,0,null,0,9999,null,null,null,null,"3001","召唤车辆1"],[312102,0,5,1,0,null,0,9999,null,null,null,null,"3012","召唤车辆2"],[312103,0,5,1,0,null,0,9999,null,null,null,null,"3003","召唤车辆3"],[312104,0,5,1,0,null,0,9999,null,null,null,null,"3010","召唤车辆4"],[312105,0,5,1,0,null,0,9999,null,null,null,null,"3013","召唤车辆5"],[400101,0,5,1,0,[42],0,0,null,null,null,null,"1","车轮滚滚"],[400102,0,2,1,0,[43],0,0,null,null,null,null,"2","台阶"],[400103,0,5,1,0,[44],0,0,null,null,null,null,"3","炸弹"],[400104,0,5,1,0,[45],0,0,null,null,null,null,"4","爱心特效"],[400105,0,5,1,0,[46],0,0,null,null,null,null,"5","扮鬼头套"],[400106,0,15,1,0,[47],0,0,null,null,null,null,"6","烟花"],[500101,0,0,0,1,[48],0,1,null,null,"CircularBulletTrriger:movex=0,movey=0,movez=0,r=3,type=1,interval=0.05,effect=37,music=58","size=1,speed=100,damageTime=0,fireMusic=0,fireEff=0",null,"风a3命中后"],[500201,0,0,0,1,[49],0,1,null,null,"CircularBulletTrriger:movex=0,movey=0,movez=0,r=0.6,type=2,interval=0,effect=37,music=54",null,null,"暗a4命中后"],[600101,0,0,1,1,[50],0,1,null,null,"BoxBulletTrriger:movex=0,movey=0,movez=0,x=1,y=1,z=1,type=2,interval=0,effect=40,music=59",null,null,"鲨鱼技能1"],[600201,0,0,1,1,[51],0,1,null,null,"BoxBulletTrriger:movex=0,movey=0,movez=-25,x=1.4,y=1.4,z=0.5,type=2,interval=0,effect=41,music=61",null,null,"鲨鱼技能2"],[600301,0,0,1,1,[52],0,1,null,null,"BoxBulletTrriger:movex=0,movey=0,movez=-50,x=1,y=1,z=1,type=2,interval=0,effect=42,music=60",null,null,"鲨鱼技能3"],[700101,0,0,1,10,[53],0,1,null,null,null,null,null,"龙火球单体技能"],[700201,0,0,1,1,[54],0,2,null,null,"CircularBulletTrriger:movex=0,movey=0,movez=0,r=3,type=1,interval=0.2,effect=37,music=58",null,null,"龙之吐息aoe技能"],[700301,0,1,1,3,[140,155],2,1,null,null,"BoxBulletTrriger:movex=50,movey=0,movez=50,x=8,y=2,z=1,type=2,interval=0.1,effect=308,music=57","size=0,speed=300,damageTime=100,fireMusic=0,fireEff=0",null,"激光枪"],[700401,0,5,1,3,[100,130],2,1,null,null,"StayBoxBulletTrriger:movex=100,movey=0,movez=50,x=2.5,y=10,z=4,type=2,interval=0.1,effect=0,music=57","size=0,speed=30,damageTime=80,fireMusic=0,fireEff=0",null,"喷火器"],[700501,0,1,1,3,[180,210],1,1,["12"],null,"BoxBulletTrriger:movex=50,movey=0,movez=50,x=4,y=3,z=2,type=3,interval=0.2,effect=307,music=82","size=1,speed=150,damageTime=0.1,fireMusic=0,fireEff=0",null,"火箭弹"],[700601,0,1,1,1,[21],0,1,null,null,"BoxBulletTrriger:movex=100,movey=0,movez=0,x=2.5,y=2.5,z=2.5,type=2,interval=99999,effect=43,music=54","size=0,speed=100,damageTime=100,fireMusic=0,fireEff=0",null,"持刀攻击"],[700602,0,1,1,1,[140,155],0,1,["12"],null,"BoxBulletTrriger:movex=100,movey=0,movez=50,x=2.5,y=2.5,z=1,type=2,interval=99999,effect=43,music=95","size=0,speed=500,damageTime=100,fireMusic=0,fireEff=0",null,"棒棒糖"],[700603,0,1,1,1,[60,80],0,1,null,null,"BoxBulletTrriger:movex=100,movey=0,movez=0,x=2,y=3,z=2.5,type=2,interval=99999,effect=43,music=54","size=0,speed=200,damageTime=0.01,fireMusic=0,fireEff=0",null,"持刀攻击"],[700701,0,0,1,1,[60,80],0,1,null,null,"BoxBulletTrriger:movex=100,movey=0,movez=0,x=2,y=3,z=2.5,type=2,interval=99999,effect=43,music=54","size=0,speed=200,damageTime=0.01,fireMusic=0,fireEff=0",null,"扇子"],[700702,0,0,1,1,[40,100],0,1,null,null,"BoxBulletTrriger:movex=100,movey=0,movez=0,x=2,y=3,z=2.5,type=2,interval=99999,effect=43,music=54","size=0,speed=200,damageTime=0.01,fireMusic=0,fireEff=0",null,"扇子"],[700801,0,0,1,3,[100,130],2,1,null,null,"StayBoxBulletTrriger:movex=100,movey=0,movez=50,x=2.5,y=10,z=4,type=4,interval=0.1,effect=0,music=57","size=0,speed=30,damageTime=80,fireMusic=111,fireEff=403",null,"机关枪"],[700901,0,1,1,3,[300,500],2,1,null,null,"BoxBulletTrriger:movex=50,movey=0,movez=50,x=32,y=2,z=1,type=2,interval=0.1,effect=308,music=57","size=0,speed=300,damageTime=100,fireMusic=0,fireEff=0",null,"高达"],[701001,0,1,1,3,[150,200],2,1,null,null,"BoxBulletTrriger:movex=50,movey=0,movez=50,x=32,y=2,z=1,type=2,interval=0.1,effect=308,music=57","size=0,speed=300,damageTime=100,fireMusic=0,fireEff=0",null,"X-零式"],[701101,0,1,1,3,[200,250],2,1,null,null,"BoxBulletTrriger:movex=50,movey=0,movez=50,x=32,y=2,z=1,type=2,interval=0.1,effect=308,music=57","size=0,speed=300,damageTime=100,fireMusic=0,fireEff=0",null,"摇摇乐"],[701201,0,1,1,3,[250,300],2,1,null,null,"BoxBulletTrriger:movex=50,movey=0,movez=50,x=32,y=2,z=1,type=2,interval=0.1,effect=308,music=57","size=0,speed=300,damageTime=100,fireMusic=0,fireEff=0",null,"粉红糖果"],[701301,0,1,1,3,[100,150],2,1,null,null,"BoxBulletTrriger:movex=50,movey=0,movez=50,x=32,y=2,z=1,type=2,interval=0.1,effect=308,music=57","size=0,speed=300,damageTime=100,fireMusic=0,fireEff=0",null,"纸飞机"]];
export interface ISkillLevelElement extends IElementBase{
 	/**技能ID*/
	ID:number
	/**法力消耗*/
	MpUse:number
	/**技能CD*/
	SkillCD:number
	/**技能充能*/
	MaxCharge:number
	/**技能伤害*/
	Damage:number
	/**技能伤害倍率(百分)*/
	DamageRate:Array<number>
	/**是否需要瞄准镜*/
	isTelescope:number
	/**技能类型（1：子弹型，2：直接命中）*/
	SkillType:number
	/**技能对应buff*/
	BuffName:Array<string>
	/**持续性技能持续时间*/
	RunTime:Array<number>
	/**触发参数*/
	TrrigerConfig:string
	/**触发参数*/
	TrrigerConfig2:string
	/**自定义参数1(effect)*/
	Param1:string
 } 
export class SkillLevelConfig extends ConfigBase<ISkillLevelElement>{
	constructor(){
		super(EXCELDATA);
	}

}