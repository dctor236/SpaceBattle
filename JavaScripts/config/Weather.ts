import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Icon","Name","Effect"],["","","",""],[1,"45518",null,null],[2,"120358",null,[21],"天气-大雪"],[3,"120358",null,[22],"天气-小雪"],[4,"120364",null,[23],"天气-大雨"],[5,"120364",null,[24],"天气-小雨"],[6,"120360",null,[25],"天气-沙尘"],[7,"120363",null,[26],"天气-绿色极光"],[8,"120360",null,[27],"天气-粉色烟雾"],[9,"120340",null,[28],"天气-樱花"],[10,"120326",null,[29],"天气-雷电"],[11,"120363",null,[30,24],"彩虹"]];
export interface IWeatherElement extends IElementBase{
 	/**唯一ID*/
	ID:number
	/**图片*/
	Icon:string
	/**名字*/
	Name:string
	/**特效*/
	Effect:Array<number>
 } 
export class WeatherConfig extends ConfigBase<IWeatherElement>{
	constructor(){
		super(EXCELDATA);
	}

}