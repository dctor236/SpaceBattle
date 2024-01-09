/**
 * @Author       : 田可成
 * @Date         : 2023-03-27 10:01:24
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-03-27 10:55:11
 * @FilePath     : \mollywoodschool\JavaScripts\modules\interactModule\Interactive\SP\SP_ShowQTE.ts
 * @Description  : 
 */
import InteractObject, { InteractiveHelper, InteractLogic_C, InteractLogic_S } from "../InteractObject";

@Component
/**
 * 交互物-QTE
 * 作用：展示、隐藏配置标记的外部的QTE玩法
 */
export default class SP_ShowQTE extends InteractObject {
	@mw.Property({ displayName: "QTE名", group: "属性" })
	public QTEName: string = "";
	onStart() {
		this.init(ShowQTE_S, ShowQTE_C);
	}
}
//服务端
class ShowQTE_C extends InteractLogic_C<SP_ShowQTE> {
	onStart(): void {

	}
	onPlayerAction(playerId: number, active: boolean, param: any): void {
		if (active) {
			InteractiveHelper.showQTEGame(this.info.QTEName, (res: boolean) => {

			}, this.gameObject);
		} else {
			InteractiveHelper.hideQTEGame(this.info.QTEName);
		}
	}
}
//服务端
class ShowQTE_S extends InteractLogic_S<SP_ShowQTE> {
	onStart(): void {

	}
	onPlayerAction(playerId: number, active: boolean, param: any): void {
	}
}
