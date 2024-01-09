import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Type","StyleBg","BgColor","StyleLeft","LeftOffset","StyleCenter","CenterOffset","StyleRight","RightOffset","FontColor","OutlineColor","OutlineSize","ShadowOffset"],["","","","","","","","","","","","","",""],[1,"None","112149",null,null,null,null,null,null,null,"6AFFD3FF","000000FF",5,null],[2,"Brave","112149",null,null,null,null,null,null,null,"#FFFFFF","#000000",2,[0,2]],[3,"Ring","137607","FFFFFF7F","148835",[-150,-84.882],"148839",[351,-121.39],"163748",[252,-157.075],"FA41A4FF","FFF2BFFF",5,null],[4,"Shark","137621","F99DFF7F","167103",[-190.606,-139.299],null,null,"167088",[404.269,-120.064],"FF6F63FF","FFF7D6FF",3,null]];
export interface ITitleStyleElement extends IElementBase{
 	/**ID*/
	ID:number
	/**类型*/
	Type:string
	/**背景样式*/
	StyleBg:string
	/**背景颜色*/
	BgColor:string
	/**左翼样式*/
	StyleLeft:string
	/**左翼偏移(x|y*/
	LeftOffset:Array<number>
	/**中间样式*/
	StyleCenter:string
	/**中间偏移(x|y*/
	CenterOffset:Array<number>
	/**右翼样式*/
	StyleRight:string
	/**右翼偏移(x|y*/
	RightOffset:Array<number>
	/**文本颜色*/
	FontColor:string
	/**文本描边颜色*/
	OutlineColor:string
	/**文本描边宽度*/
	OutlineSize:number
	/**阴影偏移(x|y)*/
	ShadowOffset:Array<number>
 } 
export class TitleStyleConfig extends ConfigBase<ITitleStyleElement>{
	constructor(){
		super(EXCELDATA);
	}

}