import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Describe","Value","Value2","Value3","Value4","Judge","Value5","Text"],["","","","","","","","","Language"],[7,"活动界面刷新次数",3,null,null,null,null,null,null],[8,"活动提示界面开启/关闭一次需要的时间",1,null,null,null,null,null,null],[9,"背景全局bgm",0.8,null,"13937",null,null,null,null],[10,"没有音乐交互物时的舞蹈",0,null,null,["29717","14993"],null,null,null],[11,"控制台X和y间距",30,null,null,null,null,null,null],[12,"第一人称偏移",0,null,null,null,null,new mw.Vector(100,0,100),null],[13,"第一人称玩家移动速度",100,null,null,null,null,null,null],[14,"第一人称远近范围",0,[-20,-200],null,null,null,null,null],[15,"第一人称左右倾斜角度范围",0,[-5,5],null,null,null,null,null],[16,"第一人称默认远近位置",-80,null,null,null,null,null,null],[17,"第一人称默认相机偏移",0,null,null,null,null,null,null],[18,"三脚架默认相机偏移",0,null,null,null,null,null,null],[19,"三脚架远近范围",0,[200,400],null,null,null,null,null],[20,"三脚架左右倾斜角度范围",0,[-60,60],null,null,null,null,null],[21,"三脚架上下范围",0,[-200,200],null,null,null,null,null],[22,"三脚架左右范围",0,[-200,200],null,null,null,null,null],[23,"三脚架默认远近位置",300,null,null,null,null,null,null],[24,"三脚架上下左右移动速度",20,null,null,null,null,null,null],[25,"第三人称远近范围",0,[200,600],null,null,null,null,null],[26,"第三人称默认相机偏移",0,null,null,null,null,null,null],[27,"第三人称默认远近位置",300,null,null,null,null,null,null],[28,"日程切换一次显隐的时间间隔",0.25,null,null,null,null,null,null],[29,"篮球弹簧臂长",400,null,null,null,null,null,null],[30,"篮球摄像机挂点偏移",0,null,null,null,null,new mw.Vector(0,0,80),null],[31,"道具第一人称视角摄像机",1,null,null,null,null,null,null],[32,"道具三脚架视角摄像机",2,null,null,null,null,null,null],[33,"相机滤镜和天气按钮选中态切换的颜色",0,null,"00FDCDFF",null,null,null,null],[34,null,0,null,null,null,null,null,null],[35,null,0,null,null,null,null,null,null],[36,null,0,null,null,null,null,null,null],[37,null,0,null,null,null,null,null,null],[38,null,0,null,null,null,null,null,null],[39,null,0,null,null,null,null,null,null],[56,"返回开放广场触发器",0,null,"5A1F866F",null,null,null,null],[57,"广场线上guid国内",0,null,"549948",null,null,null,null],[58,"广场线上gameid海外",0,null,"A6su2HY5tpXzUuWJhhlR",null,null,null,null],[59,"所有3dui的对象id",0,null,null,["BD7ABD06","1E1EB382","0BAE93BC","110B8897","EEB7E129","8E9611F3","633F7A27","DC6ADBD2","41EA2085","B38A30EC","036AFBCD","4B95E7AE","49EF6074","C3734519","0F75190E","2ED86DD5","33A15F29","2DD198A0","19CFD6E2","3B2AE1BB","25805BFA","07ADFFB8","22A15FF6","14A1B361"],null,null,null],[60,"游戏一昼夜的时间",1260,null,null,null,null,null,null],[61,"日程开始时间（显示）",10,null,null,null,null,null,null],[62,"日程结束时间（显示）",22,null,null,null,null,null,null],[63,"黑屏出现的时间",1255,null,null,null,null,null,null],[64,"全天成绩单出的现时间",620,null,null,null,null,null,null],[65,"课程结束以后，休息多少秒以后提示下一节课",5,null,null,null,null,null,null],[66,"UI小游戏说明界面持续时间",4,null,null,null,null,null,null],[67,"UI小游戏说明界面出现时间",5,null,null,null,null,null,null],[68,"UI小游戏结束以后成绩单出现时间",3,null,null,null,null,null,null],[69,"传送提示存在时间",5,null,null,null,null,null,null],[70,"签到-完成文本",223,null,null,null,null,null,null],[71,"签到-缺课文本",224,null,null,null,null,null,null],[72,"签到-完成成绩图片",128740,null,null,null,null,null,null],[73,"签到-缺课成绩图片",128700,null,null,null,null,null,null],[74,"签到-分数列表表头文本",225,null,null,null,null,null,null],[75,"课程预告存在时间",3,null,null,null,null,null,null],[76,"课程预告渐隐次数",6,null,null,null,null,null,null],[77,"打卡了的图片",128740,null,null,null,null,null,null],[78,"没打卡的图片",128700,null,null,null,null,null,null],[79,"镜头下的特效id",33,null,null,null,null,null,null],[80,"课程预告提前时间",7,null,null,null,null,null,null],[81,"avatar身高统一",1,null,null,null,null,null,null],[82,"夜间开始的时间",860,[150,46,64,500,3000,5000],null,null,null,null,null],[83,"夜间结束的时间",1250,[50,150,30,60],null,null,null,null,null],[84,"夜晚Find事件开始时间",860,[200,200],null,null,null,null,null],[85,"夜晚Find事件结束时间",1250,[500,3000],null,null,null,null,null],[86,"下午自由活动开启的时间",563,null,null,null,null,null,null]];
export interface IGlobalElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**描述*/
	Describe:string
	/**数值*/
	Value:number
	/**数值*/
	Value2:Array<number>
	/**数值*/
	Value3:string
	/**数值*/
	Value4:Array<string>
	/**判断*/
	Judge:boolean
	/**向量*/
	Value5:mw.Vector
	/**多语言*/
	Text:string
 } 
export class GlobalConfig extends ConfigBase<IGlobalElement>{
	constructor(){
		super(EXCELDATA);
	}

}