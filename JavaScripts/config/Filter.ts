import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Icon","Name","Sdys","Fg","Bhd","Dbd","Gmz","notice"],["","","","","","","","",""],[1001,"45518",null,36,1.5,1,1.2,1,"默认"],[1002,"100720",null,3.846,6.692,1.481,0.831,1,"柔光滤镜"],[1003,"100718",null,36,0,1.288,1.123,1,"高对比度滤镜"],[1004,"100717",null,36,0,0,1.123,1,"黑白滤镜"],[1005,"100715",null,36,1.5,1.904,1.2,1,"高饱和度滤镜"],[1006,"100711",null,36,1.5,1,1.2,0.625,"冷色调滤镜"]];
export interface IFilterElement extends IElementBase{
 	/**ID*/
	ID:number
	/**图片GUID*/
	Icon:string
	/**名字*/
	Name:string
	/**色调映射*/
	Sdys:number
	/**泛光*/
	Fg:number
	/**全局饱和度*/
	Bhd:number
	/**全局对比度*/
	Dbd:number
	/**全局伽马值*/
	Gmz:number
	/**备注*/
	notice:string
 } 
export class FilterConfig extends ConfigBase<IFilterElement>{
	constructor(){
		super(EXCELDATA);
	}

}