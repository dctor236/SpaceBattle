import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","NpcName","NameColour","NamePos","FUNS","state","coordinate","stopTime","stopAni","text","distance","attitude","action","time","aniRoundTime","cd"],["","","","","","","","","","","","","","","",""],[1,61,[0.1,1,0.8],new mw.Vector(0,0,100),[[1]],1,null,null,null,[143],300,null,["8352"],1,[5,10],15,"魔莱坞校长"],[2,62,[0.1,1,0.8],new mw.Vector(0,0,100),[[13]],1,null,null,null,[144],300,null,["14587"],1.5,[0,0],15,"奇怪的同学"],[3,63,[0.1,1,0.8],new mw.Vector(0,0,100),[[7]],1,null,null,null,[145],300,null,["14623"],1,[5,10],15,"保安"],[4,64,[0.1,1,0.8],new mw.Vector(0,0,100),[[20]],1,null,null,null,[146],300,null,["29734"],1.2,[0,0],15,"坐着看书"],[5,65,[0.1,1,0.8],new mw.Vector(0,0,100),[[23]],1,null,null,null,[147],300,null,["98748"],1.5,[5,10],15,"厨师"],[6,58,[0.1,1,0.8],new mw.Vector(0,0,100),[[31]],1,null,null,null,[150],300,null,["147535"],1.5,[5,10],15,"校霸"],[7,60,[0.1,1,0.8],new mw.Vector(0,0,100),[[77,76,75]],1,null,null,null,[124],300,null,["29755"],1,[5,10],15,"魔法师"],[8,521,[0.1,1,0.8],new mw.Vector(0,0,100),[[81]],1,null,null,null,[125],300,null,["123721"],1,[5,10],15,"派对咖"],[9,522,[0.1,1,0.8],new mw.Vector(0,0,100),[[37]],1,null,null,null,[129],300,null,null,1,[5,10],15,"运动少年"],[10,523,[0.1,1,0.8],new mw.Vector(0,0,100),[[40]],1,null,null,null,[133],300,null,null,1,[5,10],15,"体育老师"],[11,524,[0.1,1,0.8],new mw.Vector(0,0,100),[[43]],1,null,null,null,[137],300,null,["147535"],1,[5,10],15,"嘻哈少年"],[12,525,[0.1,1,0.8],new mw.Vector(0,0,100),[[51]],1,null,null,null,[139],300,null,["14646"],1,[5,10],15,"学霸"],[13,250,[0.1,1,0.8],new mw.Vector(0,0,100),[[61]],1,null,null,null,[142],300,null,null,1,[5,10],15,"男教师"],[14,527,[0.1,1,0.8],new mw.Vector(0,0,100),[[64]],1,null,null,null,[184],300,null,null,1,[5,10],15,"教学楼附近的学生"],[15,528,[0.1,1,0.8],new mw.Vector(0,0,100),[[67]],1,null,null,null,[193],300,null,null,1,[5,10],15,"树屋营地的学生"],[16,529,[0.1,1,0.8],new mw.Vector(0,0,100),[[87]],1,null,null,null,[195],300,null,["123720"],1,[5,10],15,"啦啦队员"],[17,530,[0.1,1,0.8],new mw.Vector(0,0,100),[[88]],1,null,null,null,[195],300,null,["123713"],1,[5,10],15,"树屋营地的啦啦队员"],[18,531,[0.1,1,0.8],new mw.Vector(0,0,100),[[69]],1,null,null,null,[204],300,null,null,1,[5,10],15,"游泳教练"],[19,532,[0.1,1,0.8],new mw.Vector(0,0,100),[[89]],1,null,null,null,[205],300,null,null,1,[5,10],15,"宿管阿姨"],[20,206,[0.1,1,0.8],new mw.Vector(0,0,100),[[93]],1,null,null,null,[207],300,null,["123721"],1,[5,10],15,"上帝"],[21,260,[0.1,1,0.8],new mw.Vector(0,0,100),[[61]],1,null,null,null,[142],300,null,null,1,[5,10],15,"女教师"],[22,72,[0.1,1,0.8],new mw.Vector(0,0,100),[[100],[100,111]],1,null,null,null,[130],400,null,null,1,[5,10],15,"战斗牧师"],[23,604,[0.1,1,0.8],new mw.Vector(0,0,100),[[93],[100,93,110]],1,null,null,null,[124],300,null,["29755"],1,[5,10],15,"白天的狸月"],[24,68,[0.1,1,0.8],new mw.Vector(0,0,25),[[103]],1,null,null,null,[669],400,null,["150784","150786"],1,[5,10],10,"狸正"],[30,2000,[0.1,1,0.8],new mw.Vector(0,0,100),[[205,201,110],[111],[201]],1,null,null,null,[2033],800,null,["8352"],1,[5,10],10,"旅行商人"],[31,2026,[0.1,1,0.8],new mw.Vector(0,0,100),[[110],[111],[201]],1,null,null,null,[2034],800,null,["8352"],1,[5,10],10,"迎宾大叔"],[32,2027,[0.1,1,0.8],new mw.Vector(0,0,100),[[110],[111],[201]],1,null,null,null,[2035],800,null,["8352"],1,[5,10],10,"门卫"],[33,2028,[0.1,1,0.8],new mw.Vector(0,0,100),[[110],[111],[201]],1,null,null,null,[2036],800,null,["8352"],1,[5,10],10,"小梨"],[34,2029,[0.1,1,0.8],new mw.Vector(0,0,100),[[110],[111],[201]],1,null,null,null,[2037],800,null,["14716"],1,[5,10],10,"热心好市民"],[35,2030,[0.1,1,0.8],new mw.Vector(0,0,100),[[110],[111],[201]],1,null,null,null,[2038],800,null,["14716"],1,[5,10],10,"宠物饲养员"],[36,2031,[0.1,1,0.8],new mw.Vector(0,0,100),[[110],[111],[201]],1,null,null,null,[2039],800,null,["8355"],1,[5,10],10,"可疑的市民"],[37,2032,[0.1,1,0.8],new mw.Vector(0,0,100),[[110],[111],[201]],1,null,null,null,null,0,null,null,0,null,0,"冠军雕像"],[38,2042,[0.1,1,0.8],new mw.Vector(0,0,100),[[110],[111],[201]],1,null,null,null,[2040],800,null,["14766"],1,[5,10],10,"男巨人"],[39,2043,[0.1,1,0.8],new mw.Vector(0,0,100),null,1,null,null,null,[2041],800,null,["29719"],1,[5,10],10,"女巨人"],[40,2085,[0.1,1,0.8],new mw.Vector(0,0,100),null,1,null,null,null,null,800,null,null,0,null,10,"被绑架的npc"],[41,2085,[0.1,1,0.8],new mw.Vector(0,0,100),[[98]],1,null,null,null,null,400,null,["29755"],1,[5,10],10,"被绑架的npc"],[51,3019,[0.1,1,0.8],new mw.Vector(0,0,100),null,1,null,null,null,null,400,null,["29717"],1,[0,0],10,"cgboss"],[61,4017,[0.1,1,0.8],new mw.Vector(0,0,100),null,1,null,null,null,[4009],1600,null,["14534"],1,[1,3],2,"图书馆"],[62,4017,[0.1,1,0.8],new mw.Vector(0,0,100),null,1,null,null,null,[4010],1600,null,["14534"],1,[1,3],2,"教学楼"],[63,4017,[0.1,1,0.8],new mw.Vector(0,0,100),null,1,null,null,null,[4011],1600,null,["14534"],1,[1,3],2,"音乐教室"],[64,4017,[0.1,1,0.8],new mw.Vector(0,0,100),null,1,null,null,null,[4012],1600,null,["14534"],1,[1,3],2,"活动大楼"],[65,4017,[0.1,1,0.8],new mw.Vector(0,0,100),null,1,null,null,null,[4013],1600,null,["14534"],1,[1,3],2,"广播站"],[66,4017,[0.1,1,0.8],new mw.Vector(0,0,100),null,1,null,null,null,[4014],1600,null,["14534"],1,[1,3],2,"食堂"],[67,4017,[0.1,1,0.8],new mw.Vector(0,0,100),null,1,null,null,null,[4015],1600,null,["14534"],1,[1,3],2,"自习室"],[68,4017,[0.1,1,0.8],new mw.Vector(0,0,100),null,1,null,null,null,[4016],1600,null,["14534"],1,[1,3],2,"后勤大楼"],[71,5001,[0.1,1,0.8],new mw.Vector(0,0,100),null,2,null,null,null,[5002],1600,null,["195754"],1,[0,0],2,"狸月"],[72,5003,[0.1,1,0.8],new mw.Vector(0,0,100),null,2,null,null,null,[5004],1600,null,["195754"],1,[0,0],2,"狸月"]];
export interface INPCConfigElement extends IElementBase{
 	/**id*/
	ID:number
	/**npc名称*/
	NpcName:number
	/**名称颜色*/
	NameColour:Array<number>
	/**名称相对位置*/
	NamePos:mw.Vector
	/**对应功能（索引EVENTConfig表的ID）
talkevent*/
	FUNS:Array<Array<number>>
	/**npc状态（动态，静态）*/
	state:number
	/**移动坐标*/
	coordinate:Array<Array<number>>
	/**到达路径点后停留的时间*/
	stopTime:Array<number>
	/**到达路径点后做的动作*/
	stopAni:Array<number>
	/**随机触发对话文本文本
language*/
	text:Array<number>
	/**触发距离（半径）*/
	distance:number
	/**姿态*/
	attitude:string
	/**动作*/
	action:Array<string>
	/**动画速率*/
	time:number
	/**动画播放间隔时间（区间随机）*/
	aniRoundTime:Array<number>
	/**冷却时间*/
	cd:number
 } 
export class NPCConfigConfig extends ConfigBase<INPCConfigElement>{
	constructor(){
		super(EXCELDATA);
	}

}