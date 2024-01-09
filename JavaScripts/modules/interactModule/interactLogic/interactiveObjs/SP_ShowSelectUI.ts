import InteractMgr from "../../InteractMgr";
import InteractObject, { InteractiveHelper, InteractLogic_C, InteractLogic_S } from "../InteractObject";

@Component
export default class SP_ShowSelectUI extends InteractObject {
	@mw.Property({ displayName: "选项信息", group: "属性" })//id表示法：ico:id,ico:id,...    索引表示法：ico,ico...
	public itemList: string = "";
	onStart() {
		this.init(ShowSelectUI_S, ShowSelectUI_C);
	}
}
//服务端
class ShowSelectUI_C extends InteractLogic_C<SP_ShowSelectUI> {
	private itemId: Array<string | number> = [];
	private itemIndex: Array<string | number> = [];
	onStart(): void {

	}

	public onPlayerAction(playerId: number, active: boolean, param: any): void {
		if (active) {
			let icoList: string[] = [];
			let itemList: Array<string> = this.info.itemList.split(',');
			for (let i = 0; i < itemList.length; i++) {
				let item = itemList[i].split(':');
				icoList.push(item[0]);
				if (item.length == 2) {
					this.itemId.push(item[1]);
				} else {
					this.itemIndex.push(i);
				}
			}
			if (icoList.length == 0) {
				console.log("ShowSelectUI_C->net_showUI:缺少数据");
			} else if (this.itemId.length > 0 && this.itemIndex.length > 0) {
				console.log("ShowSelectUI_C->net_showUI:两种方法不能混用");
			} else {
				InteractiveHelper.showSelectUI(icoList, (select: number) => {
					let param = this.itemId.length > 0 ? this.itemId[select] : this.itemIndex[select];
					InteractMgr.instance.activeNextHandle(this.info, true)
				});
			}
		} else {
			InteractiveHelper.hideSelectUI();
		}
	}
}
//服务端
class ShowSelectUI_S extends InteractLogic_S<SP_ShowSelectUI> {
	onStart(): void {

	}
	onPlayerAction(playerId: number, active: boolean, param: any): void {

	}
}
