import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","SkillName","Icon","Des","IsSupport","CanMove","SkillType","SkillConfig1"],["","","","","","","",""],[1011,"风系A技能1","153915",null,true,true,1,"[[{t:2,v:[1],p1:156393,p2:2.5},{t:7,p1:24940,p2:0.9,p4:[]}]]"],[1012,"风系A技能2","153926",null,true,true,1,"[[{t:2,l:0.7,p1:21615,p2:2},{t:3,p1:27420,p2:1,p6:[0.5,0.5,0.5]}],[{t:11,d:0.45,w:1,p1:'09291EB34E2E2F88F9DE76AF3341D8CF',p2:3200,p3:4000,p4:80},{t:7,d:0.5,p1:75372,p2:1,p4:[]}]]"],[1013,"风系A技能3","153840",null,true,true,1,"[[{t:2,l:1,v:[0.2],p1:85940,p2:1.5}],[{t:3,d:0.5,p1:92832,p4:[100,0,0],p5:[0,180,0],p7:[0.72,0.93,0.08,1]}],[{t:7,d:0.5,p1:75371,p2:0.3,p4:[]}]]"],[1014,"风系A技能4","153904",null,true,true,1,"[[{t:2,p1:156436,p2:1.5},{t:3,l:0.7,p1:163348,p6:[0.9,0.9,0.9],p7:[0.77,0.95,0,1]}],[{t:3,d:0.8,v:[1],p1:126923,p2:1,p4:[150,0,-50],p5:[0,0,-90],p6:[2,4,2]},{t:7,d:0.6,p1:12334,p2:1,p4:[]}]]"],[1021,"暗系A技能1","150558",null,true,true,0,"[[{t:1}],[{t:2,l:0.8,p1:156393}],[{t:11,d:0.4,p1:'7802',p2:1000,p3:1000,p4:20}],[{t:2,d:0.4,v:[1],p1:20259}]]"],[1022,"暗系A技能2","150559",null,false,true,0,"[[{t:1,p1:0.2}],[{t:2,p1:20258},{t:3,d:0.55,l:0.3,p1:106661,p2:1,p4:[90,10,20],p6:[0.4,0.4,0.4]}],[{t:3,d:0.7,l:3,v:[1],p1:152561,p2:2,p4:[600,0,-80]}],[{t:2,d:0.35,v:[1],p1:20259}]]"],[1023,"暗系A技能3","150560",null,false,true,0,"[[{t:1}],[{t:2,d:0.3,l:1.5,p1:85941},{t:3,d:0.4,p1:144090,p2:1,p4:[0,0,-80],p7:[0.2,0,0.74,1]}],[{t:7,d:0.3,p1:27216,p2:1,p4:[]}]]"],[1024,"暗系A技能4","150561",null,true,true,0,"[[{t:1}],[{t:2,l:1,p1:85949,p2:1.2},{t:3,d:0.7,p1:137835,p4:[80,0,0],p5:[0,0,-90],p7:[0.27,0.04,0.89,1]}],[{t:11,d:0.8,p1:'137228',p2:1500,p3:1500,p4:90},{t:7,d:0.8,p1:14251,p4:[]}]]"],[1031,"光系A技能1","150562",null,false,true,0,"[[{t:1}],[{t:2,l:1,p1:156394,p2:1.1},{t:7,d:0.4,p1:24940,p2:0.6,p4:[]}],[{t:11,d:0.4,p1:'90A1DD9E43D87FA2E8E56C849228DCF1',p2:2000,p3:800,p4:150},{t:3,d:0.2,l:0.85,p1:156433,p4:[150,20,10],p6:[0.8,0.8,0.8]}],[{t:2,d:0.4,v:[1],p1:20259}]]"],[1032,"光系A技能2","150563",null,false,true,0,"[[{t:1}],[{t:2,p1:29771}],[{t:3,d:0.7,p1:156403,p2:1,p4:[0,0,-80]}]]"],[1033,"光系A技能3","150564",null,false,true,0,"[[{t:1}],[{t:2,d:0.3,l:1.2,p1:85941},{t:3,d:0.4,p1:89097,p2:1,p4:[0,0,-80],p6:[0.8,0.8,0.8]}],[{t:7,d:0.2,p1:27216,p2:0.8,p4:[]}]]"],[1034,"光系A技能4","150565",null,false,true,0,"[[{t:1,p1:0.2}],[{t:2,l:0.7,p1:20258},{t:3,d:0.55,l:0.7,p1:106661,p2:1,p4:[90,10,20],p6:[0.4,0.4,0.4]}],[{t:3,d:0.7,p1:92828,p2:4,p4:[0,0,-80]}],[{t:2,d:0.35,v:[1],p1:20259}]]"],[1041,"水系A技能1","150566",null,true,true,0,"[[{t:2,p1:20258},{t:1},{t:7,p1:24940,p2:0.15,p4:[]}],[{t:11,d:0.3,p1:'156494',p2:1000,p3:1200,p4:75}]]"],[1042,"水系A技能2","150567",null,false,true,0,null],[1043,"水系A技能3","150568",null,false,true,0,null],[1044,"水系A技能4","150569",null,false,true,0,"[[{t:2,l:1.5,p1:29736,p2:0.8},{t:3,d:0.1,l:0.5,p1:153611,p2:1,p4:[230,0,0],p5:[0,90,180],p6:[0.9,0.9,0.9]},{t:4,l:0.4,p1:350}],[{t:7,p1:120845,p2:0.8}]]"],[1051,"光系B技能1","150570",null,true,true,1,"[[{t:2,d:0.2,p1:20275,p2:2.3},{t:1},{t:7,d:1,p1:20322,p2:0.6},{t:3,p1:89075,p2:1,p6:[0.6,0.6,0.6]}],[{t:11,d:1,w:1,p1:'31115',p2:1200,p3:1000,p4:80}]]"],[1052,"光系B技能2","150571",null,true,true,1,"[[{t:1,p1:0.1},{t:2,d:0.1,p1:21615},{t:3,l:0.5,p1:89075,p4:[0,0,40],p6:[0.1,0.1,0.1],p7:[0.97,0.63,0.63,1]}],[{t:3,p1:7815,p2:1,p4:[80,0,0],p5:[0,-90,0],p6:[0.1,0.1,0.1],p7:[0.87,0.01,0.01,1]}],[{t:11,d:0.5,w:1,p1:'B27504D441C3B735E114BC95934F0767',p2:1000,p3:1000}]]"],[1053,"光系B技能3","150572",null,true,true,1,"[[{t:1},{t:2,p1:20258}],[{t:2,d:0.5,p1:20259}],[{t:11,d:0.5,w:1,p1:'FB1A5C61457798CB10F6DBB0A655CAC5',p2:1300,p3:800}],[{t:11,d:0.6,w:1,p1:'818036BE4F5F8B0B5E71B581AD24D476',p2:1200,p3:800}],[{t:11,d:0.65,w:1,p1:'23CF07A245821DF19D666C8B7E3C6F1D',p2:1300,p3:800}],[{t:11,d:0.7,w:1,p1:'92630F624D0CC93D9DDD5D89BD7D1DB2',p2:1500,p3:800}]]"],[1054,"光系B技能4","150573",null,true,true,1,"[[{t:1},{t:2,p1:21615},{t:3,p1:27420,p2:1,p6:[0.4,0.4,0.4]}],[{t:11,d:0.5,p1:'84933',p2:2500,p3:1000,p4:8},{t:7,d:0.5,p1:75372}]]"],[2011,"魔法扫帚","96593",null,false,true,0,null],[2012,"星之力","96608",null,false,true,0,null],[2021,"雪球魔杖","96593",null,false,true,0,"[[{t:11,d:0.45,w:1,p1:'163350',p2:800,p3:800,p4:80},{t:7,d:0.5,p1:75372,p2:1,p4:[]}]]"],[2031,"滑板","96635",null,false,true,0,null],[2041,"宠物召唤","159461",null,false,true,0,null],[2051,"魔法翅膀","175749",null,false,true,0,null],[2061,"滑翔","162668",null,false,true,0,null],[2071,"占卜自己","76798","Prop_135",false,true,0,null],[2072,"占卜他人","76799","Prop_136",false,true,0,null],[2081,"契约之戒一阶段","80431","Prop_140",false,true,0,null],[2082,"契约之戒二阶段","80446","Prop_141",false,true,0,null],[3011,"造物","106325",null,false,true,0,null],[3021,"换装技能","164194",null,false,true,0,null],[3031,"变形术（自己）","96595",null,false,true,0,null],[3032,"变形术（他人）","96595",null,true,true,1,"[[{t:2,l:0.5,p1:156393},{t:1},{t:7,p1:24940,p2:0.15,p4:[]}],[{t:11,d:0.35,w:1,p1:'A6B6050A4FFB055C08677EBC9EE567E7',p2:1500,p3:1200,p4:70}]]"],[3121,"车辆召唤","121623",null,false,true,0,null],[4001,"造物物品技能","96595",null,false,true,0,null],[5001,"风系A命中后技能",null,null,null,true,0,"[[{t:3,w:1,v:[1],p1:13606,p2:1,p4:[0,0,-80],p6:[2.5,2.5,2.5]}]]"],[5002,"暗系A4命中后技能",null,null,null,true,0,"[[{t:3,w:1,v:[1],p1:31122,p4:[0,0,-80]}],[{t:7,p1:75366,p2:0.3,p3:1,p4:[]}]]"],[6001,"鲨鱼战斗技能1",null,null,false,true,0,"[[{t:3,p1:158089,p6:[1.6,1.6,1.6]},{t:7,p1:131831,p2:1,p4:[]}],[{t:11,w:1,p1:'C6B9B33340B35214F5ED4384F57982FA',p2:5000,p3:16000,p5:1},{t:7,d:1,p1:162448,p4:[0,500]}]]"],[6002,"鲨鱼战斗技能1",null,null,false,true,0,"[[{t:3,p1:158089,p6:[1.6,1.6,1.6]},{t:7,p1:131831,p2:1,p4:[]}],[{t:11,w:1,p1:'DC29D84940B2CCBF4AC033AE6E6B1498',p2:4000,p3:16000,p5:1},{t:7,d:1,p1:162445,p4:[0,500]}]]"],[6003,"鲨鱼战斗技能1",null,null,false,true,0,"[[{t:3,p1:158089,p6:[1.6,1.6,1.6]},{t:7,p1:131831,p2:1,p4:[]}],[{t:11,w:1,p1:'F238E9B1498FF3B2C578779B245557D8',p2:3000,p3:16000,p5:1},{t:7,d:1,p1:162446,p4:[0,500]}]]"],[7001,"龙火球单体技能","153840",null,false,true,0,"[[{t:3,d:1,p1:152218,p4:[600,0,0],p5:[0,90,0],p6:[0.5,0.5,0.5]}]]"],[7002,"龙之吐息aoe技能","153840",null,false,true,0,"[[{t:6,p1:3,p2:[0,1000,180],p4:100}],[{t:3,d:5,p1:118361,p4:[100,0,0],p5:[-90,0,90],p6:[5,7,3]}]]"],[7003,"激光枪技能","37686",null,false,true,0,"[[{t:3,d:0.2,w:1,p1:163350,p3:16,p4:[80,0,0],p5:[0,0,5],p6:[1.2,0.8,0.8]}],[{t:11,p1:'43358',p2:5000,p3:500,p4:25},{t:7,p1:113936,p2:10,p4:[]}]]","0.1s"],[7004,"火焰枪技能","37686",null,false,true,0,"[[{t:3,d:0.2,l:5,w:1,p1:118361,p2:5,p3:16,p4:[80,0,0],p5:[-90,0,90],p6:[20,10,5]}],[{t:11,w:1,l:5,p1:'43358',p2:100,p3:500,p4:25},{t:7,p1:192378,p2:10,p4:[]}]]","5s"],[7005,"火箭弹","37686",null,false,true,0,"[[{t:3,d:0.2,w:1,p1:174248,p4:[50,0,20],p6:[1,1,1]}],[{t:11,w:1,p1:'83D96AA740CB7C0C84CC42BE6F30D29C',p2:700,p3:1400,p4:25},{t:7,p1:186450,p2:1,p4:[]}]]","2s"],[7006,"大型武器攻击","98203",null,false,true,0,"[[{t:2,v:[0],p1:29723,p2:1.5},{t:7,p1:134422,p2:0.9,p4:[]}],[{t:11,w:1,p1:'43358',p2:5000,p3:500}]]"],[7007,"扇子|刀","98203",null,false,true,0,"[[{t:2,v:[0],p1:29744,p2:1.5},{t:7,p1:134422,p2:0.9,p4:[]}],[{t:11,w:1,p1:'43358',p2:3000,p3:600}]]"],[7008,"机关枪","37686",null,false,true,0,"[[{t:3,l:10,p1:4388,p4:[80,0,0],p6:[0.5,0.5,0.5]},{t:7,v:[10],p1:98339,p2:1,p4:[0,5000]}],[{t:11,p1:'43358',p2:100,p3:100,p4:25}]]","5s"],[7009,"高达激光","37686",null,true,true,0,"[[{t:3,d:0.2,w:1,p1:163350,p3:7,p4:[0,0,0],p5:[0,40,0],p6:[5,1.2,1.2]},{t:2,l:1,p1:121419,p4:7}],[{t:11,p1:'43358',p2:5000,p3:500,p4:25},{t:7,p1:113936,p2:10,p4:[]}]]"],[7010,"X-零式激光","37686",null,true,true,0,"[[{t:3,d:0.2,w:1,p1:160764,p3:1,p4:[0,120,-50],p5:[0,5,90],p6:[5,0.8,0.8]}],[{t:11,p1:'43358',p2:5000,p3:500,p4:25},{t:7,p1:113936,p2:10,p4:[]}]]"],[7011,"摇摇乐激光","37686",null,true,true,0,"[[{t:3,d:0.2,w:1,p1:160746,p3:1,p4:[0,120,-50],p5:[0,5,90],p6:[5,0.8,0.8]}],[{t:11,p1:'43358',p2:5000,p3:500,p4:25},{t:7,p1:113936,p2:10,p4:[]}]]"],[7012,"粉红糖果激光","37686",null,true,true,0,"[[{t:3,d:0.2,w:1,p1:160760,p3:1,p4:[0,120,-50],p5:[0,5,90],p6:[5,0.8,0.8]}],[{t:11,p1:'43358',p2:5000,p3:500,p4:25},{t:7,p1:113936,p2:10,p4:[]}]]"],[7013,"纸飞机激光","37686",null,true,true,0,"[[{t:3,d:0.2,w:1,p1:160760,p3:1,p4:[0,120,-50],p5:[0,15,90],p6:[5,0.8,0.8]}],[{t:11,p1:'43358',p2:5000,p3:500,p4:25},{t:7,p1:113936,p2:10,p4:[]}]]"]];
export interface ISkillElement extends IElementBase{
 	/**技能ID*/
	ID:number
	/**技能名字*/
	SkillName:string
	/**技能图标*/
	Icon:string
	/**技能描述*/
	Des:string
	/**是否辅助瞄准*/
	IsSupport:boolean
	/**释放技能过程中是否可移动*/
	CanMove:boolean
	/**技能类型（0：只要点击就放，1：可以长短按）*/
	SkillType:number
	/**技能参数1*/
	SkillConfig1:string
 } 
export class SkillConfig extends ConfigBase<ISkillElement>{
	constructor(){
		super(EXCELDATA);
	}

}