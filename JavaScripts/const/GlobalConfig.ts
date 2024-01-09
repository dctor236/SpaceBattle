/**
 * @Author       : 田可成
 * @Date         : 2023-04-16 09:54:27
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-16 10:02:30
 * @FilePath     : \mollywoodschool\JavaScripts\const\GlobalConfig.ts
 * @Description  : 
 */
export namespace GlobalItemType {
	export class Fight {
		/** 受击动作 */
		readonly hitAnimation: string = "46284";
		/** 受击特效 */
		readonly hitEffect: string = "107533";
		readonly deathAnimation: string = "8355";
		readonly deathEffects: string = "27422";

		readonly hitSound: string;
	}
	export class Make {
		readonly sound: string = "160547";
	}
	export class Fly {
		readonly haloEffct: string = "197460";
		readonly ribbonEffect: string = "73401"
		readonly guideEffect: string = "57199"
		readonly getPointSound: string = "131831"
	}
}
export namespace GlobalConfig {
	export const Fight = new GlobalItemType.Fight();
	export const Make = new GlobalItemType.Make();
	export const Fly = new GlobalItemType.Fly();
}
