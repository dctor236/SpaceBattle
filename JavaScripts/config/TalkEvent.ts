import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Des1","Name","ICON","ICON2","TEXT","OverRewardText","refreshTask","accTaskId","finishTaskId","EffGuid","Pos","soundGuid","Scale","ActionGuid","Actiontime","stopTime","state","canvasSize","params"],["","","","","","","","","","","","","","","","","","","",""],[1,"跟校长对话",327,"106328","106332",[1],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[2,"平时上课要怎么去",329,"106328","106332",[2],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[3,"我能成为校长吗",331,"106328","106332",[3],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[4,"我是才来的新生，有什么礼物吗",333,"106328","106332",[4],7,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[5,"不用了 谢谢",337,"106328","106332",[6],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[6,"我还想问其他的",340,"106328","106332",[8],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[7,"跟校警对话",341,"106328","106332",[9],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[8,"最近有发生什么事情吗",343,"106328","106332",[10],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[9,"我听说校警大叔你有传奇故事",344,"106328","106332",[11],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[10,"好的，您先忙",346,"106328","106332",[12],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[11,"好的会注意的",352,"106328","106332",[15],0,0,0,0,null,null,null,0,"14748",1,2,1,[520,100],0],[12,"好的会加油的",353,"106328","106332",[15],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[13,"跟奇怪的人对话",354,"106328","106332",[16],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[14,"抱歉是我不知道",356,"106328","106332",[17],0,0,0,0,null,null,null,0,"14530",1,2,1,[520,100],0],[15,"哦对不起，不过你管不着我",357,"106328","106332",[18],0,0,0,0,null,null,null,0,"29773",1,2,1,[520,100],0],[16,"说说看",360,"106328","106332",[19],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[17,"对不起不感兴趣",361,"106328","106332",[24],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[18,"就打听这么多",366,"106328","106332",[24],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[19,"真有趣，等你下次跟我说",368,"106328","106332",[24],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[20,"跟看书的人对话",378,"106328","106332",[25],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[21,"你在做什么",79,"106328","106332",[26],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[22,"请告知我书名",80,"106328","106332",[27],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[23,"跟厨师对话",380,"106328","106332",[28],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[24,"请给我一份午餐",82,"106328","106332",[29],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[25,"我想要特别的食物",83,"106328","106332",[30],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[26,"（继续说）",382,"106328","106332",[13],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[27,"奇怪的知识增加了",383,"106328","106332",[20],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[28,"奇怪的知识又增加了",384,"106328","106332",[21],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[29,"奇怪的知识继续增加了",385,"106328","106332",[22],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[30,"奇怪的知识越来越多了",386,"106328","106332",[23],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[31,"跟校霸对话",390,"106328","106332",[31],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[32,"你好你好，很高兴认识你们",110,"106328","106332",[32],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[33,"作为同学你们都不欢迎我？",394,"106328","106332",[34],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[34,"(…)",396,"106328","106332",[35],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[35,"你说的不会是我？",399,"106328","106332",[37],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[36,"为什么？",401,"106328","106332",[38],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[37,"与运动少年对话",417,"106328","106332",[39],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[38,"其实，我也喜欢打爆坏人的头",419,"106328","106332",[40],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[39,"当然，打球吗？",420,"106328","106332",[41],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[40,"跟体育老师对话",424,"106328","106332",[43],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[41,"准时运动，嘿Sir",426,"106328","106332",[44],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[42,"我才吃饱了不适合运动",427,"106328","106332",[45],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[43,"跟嘻哈少年对话",431,"106328","106332",[46],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[44,"我想跟你一起玩嘻哈",433,"106328","106332",[47],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[45,"听说你从来不去参加派对",434,"106328","106332",[48],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[46,"没什么，我也是来练舞蹈的",435,"106328","106332",[51],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[47,"那我们舞会时候见",437,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[48,"为什么，你们有什么过节？",439,"106328","106332",[49],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[49,"你可以跟他合作",441,"106328","106332",[50],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[50,"那你加油！",443,"106328","106332",null,0,0,0,0,null,null,null,0,"88544",0,2,1,[520,100],0],[51,"跟书呆子学霸对话",445,"106328","106332",[52],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[52,"你喜欢看什么书？",447,"106328","106332",[53],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[53,"你成绩怎么样？",448,"106328","106332",[54],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[54,"外面很热闹，怎么不出去看看？",449,"106328","106332",[55],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[55,"好啊好啊，不过我最近在看《校园十大神秘事件》，这本书很好看",453,"106328","106332",[56],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[56,"不是很感兴趣",454,"106328","106332",[57],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[57,"太厉害了，你能帮助我学习吗？",456,"106328","106332",[57],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[58,"那你怎么不去参加？",458,"106328","106332",[58],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[59,"那好吧，谢谢，我先去找我的朋友了",460,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[60,"那我能成为你的朋友吗？",461,"106328","106332",[59],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[61,"跟教师对话",463,"106328","106332",[60],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[62,"好的",465,"106328","106332",[61],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[63,"我能在教室打架吗？",466,"106328","106332",[62],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[64,"跟教学楼附近的学生对话",470,"106328","106332",[63],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[65,"真的吗？那我快去看看",472,"106328","106332",[64],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[66,"表白墙在哪啊？",473,"106328","106332",[65],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[67,"跟树屋营地的学生对话",476,"106328","106332",[66],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[68,"（那我去试试看）",478,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[69,"跟游泳教练对话",496,"106328","106332",[67],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[70,"你好帅啊",497,"106328","106332",[68],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[71,"你能教我游泳吗？",498,"106328","106332",[69],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[72,"你怎么跟体育老师长得好像？",499,"106328","106332",[70],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[73,"游泳拉伤了怎么办？",500,"106328","106332",[71],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[74,"跟魔法师对话",505,"106328","106332",[72],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[75,"你从哪里来？",507,"106328","106332",[73],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[76,"需要帮助吗？",508,"106328","106332",[74],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[77,"我来兑换物品",514,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,1,[520,100],1],[78,"不，我很忙！",512,"106328","106332",[75],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[79,"当然可以！",511,"106328","106332",[74],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[80,"好的！",513,"106328","106332",[75],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[81,"跟派对咖对话",403,"106328","106332",[76],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[82,"那我能在旁边跳迪斯科吗？",405,"106328","106332",[77],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[83,"好的，期待你的表演",406,"106328","106332",[78],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[84,"听说你跟嘻哈少年关系不好？",407,"106328","106332",[79],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[85,"晚上有派对吗？",413,"106328","106332",[82],0,0,0,0,null,null,null,0,"88544",0,2,1,[520,100],2],[86,"我已经等不及了！",415,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[87,"跟啦啦队对话",479,"106328","106332",[83],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[88,"跟啦啦队对话",483,"106328","106332",[86],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[89,"跟宿管阿姨对话",486,"106328","106332",[88],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[90,"我可以离开宿舍吗？",488,"106328","106332",[89],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[91,"舍友不舒服怎么办？",489,"106328","106332",[91],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[92,"阿姨我睡不着",490,"106328","106332",[92],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[93,"跟上帝对话",535,"106328","106332",[93],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[94,"爬上来很容易，建议上帝你加点难度",537,"106328","106332",[94],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[95,"他们去摸鱼了",539,"106328","106332",[95],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[96,"我没看到他们",540,"106328","106332",[95],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[97,"你现在做什么",542,"106328","106332",[96],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[98,"我来兑换宝物",619,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,1,[520,100],1],[99,"我来兑换白天的特产的啦（废弃）",621,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[100,"与战斗牧师对话",623,"106328","106332",[98],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[101,"那你会什么魔法",627,"106328","106332",[99],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[102,"好的，上课时候再见！",628,"106328","106332",[101],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[103,"与狸正喵沟通",656,"106328","106332",[102],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[104,"好可爱的猫猫啊",658,"106328","106332",[103],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[105,"这只猫居然会说话！！",659,"106328","106332",[104],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[106,"你说的跟班是什么意思？",660,"106328","106332",[105],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[107,"那我以后有机会给你带小零食！",664,"106328","106332",[106],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[108,"那以后你要教我更强大魔法哦！",665,"106328","106332",[106],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[109,"好的，这是我们的秘密！",666,"106328","106332",[106],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[110,"跟随",1369,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,2,[520,100],1],[111,"取消跟随",1370,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,3,[520,100],1],[112,"接受任务",1369,"106328","106332",[110],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[113,"完成任务",1370,"106328","106332",[111],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[114,"接受任务",1369,"106328","106332",[112],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[115,"完成任务",1370,"106328","106332",[113],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[201,"与旅行商人对话",2001,"106328","106332",[201,216],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[202,"我是谁？我在哪？",2003,"106328","106332",[202],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[203,"你是谁？",2004,"106328","106332",[203],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[204,"你这里卖点什么？",2005,"106328","106332",[204],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[205,"查看任务",2006,"106328","106332",[211,212,213,214,215,231],0,0,0,0,null,null,null,0,"123296",1,2,1,[520,100],0],[206,"没事了",2007,"106328","106332",[205],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[207,"再问问其他的",2012,"106328","106332",[201],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[208,"你这价格也太离谱了！",2013,"106328","106332",[207],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[209,"我没钱，可以直接送我吗？",2014,"106328","106332",[208],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[210,"中间这件看着不错，怎么买不了？",2015,"106328","106332",[209],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[211,"这个我不喜欢，换一个",2016,"106328","106332",[211],0,1,0,0,null,null,null,0,null,0,2,1,[520,100],0],[212,"接受任务",2017,"106328","106332",[206],0,0,1,0,null,null,null,0,null,0,2,1,[520,100],0],[213,"这个神奇豌豆怎么获得？",2022,"106328","106332",[210],0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[214,"好吧，火龙王在哪里",2050,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[215,"不了，我只是来参观的",2051,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[216,"大致了解了",2054,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[217,"精灵是什么？",2055,"106328","106332",null,0,0,1,0,null,null,null,0,null,0,2,1,[520,100],0],[218,"真的不考虑",2056,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[219,"好的我出发了",2062,"106328","106332",null,0,0,1005,0,null,null,null,0,null,0,2,1,[520,100],0],[220,"没听懂，重新说一遍",2063,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[221,"我马上来",2079,"106328","106332",null,0,0,0,0,null,null,null,0,null,0,2,1,[520,100],0],[222,"好的",2080,"106328","106332",null,0,1005,0,0,null,null,null,0,null,0,2,1,[520,100],0],[300,"救救我",0,null,null,null,0,0,0,0,null,null,null,0,null,0,0,0,null,0]];
export interface ITalkEventElement extends IElementBase{
 	/**qid*/
	ID:number
	/**中文文本描述（不读）*/
	Des1:string
	/**事件名称(索引SquareLanguage表)文本，玩家说的话*/
	Name:number
	/**事件itemicon*/
	ICON:string
	/**事件icon2*/
	ICON2:string
	/**点击对话过后底部显示的对话文本NPC说的话*/
	TEXT:Array<number>
	/**奖励获得过后NPC的说话文本*/
	OverRewardText:number
	/**刷新任务*/
	refreshTask:number
	/**接取任务ID*/
	accTaskId:number
	/**完成任务ID*/
	finishTaskId:number
	/**特效guid*/
	EffGuid:string
	/**特效偏移xyz*/
	Pos:mw.Vector
	/**音效guid*/
	soundGuid:string
	/**音效大小*/
	Scale:number
	/**动作guid*/
	ActionGuid:string
	/**动作时长*/
	Actiontime:number
	/**停留时间*/
	stopTime:number
	/**npc状态（动态，静态）填2的话会跟随玩家走*/
	state:number
	/**选择对话框的大小，有些长文字UI无法自适应，得手动调*/
	canvasSize:Array<number>
	/**额外参数*/
	params:number
 } 
export class TalkEventConfig extends ConfigBase<ITalkEventElement>{
	constructor(){
		super(EXCELDATA);
	}

}