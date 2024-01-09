/**
 * @Author       : songxing
 * @Date         : 2023-01-13 18:39:03
 * @LastEditors  : songxing
 * @LastEditTime : 2023-01-30 10:42:12
 * @FilePath     : \mollywoodschool\JavaScripts\modules\NPC\NPCHead.ts
 * @Description  : 
 */

import NPCHead_Generate from "../../ui-generate/uiTemplate/NPC/NPCHead_generate";



export class NPCHead extends NPCHead_Generate {


	private time = 0;

	onStart() {
		this.chat.visibility = (mw.SlateVisibility.Hidden)
	}



	public setName(name: string): void {
		this.nameTxt.text = (name);
	}
	/**头顶上显示文字 */
	public showText(text: string): void {
		this.text.text = text;
		this.chat.visibility = (mw.SlateVisibility.Visible);
		setTimeout(() => {
			this.chat.visibility = (mw.SlateVisibility.Hidden);
		}, 2000);
	}

	public onUpdate(dt: number): void {

	}
}