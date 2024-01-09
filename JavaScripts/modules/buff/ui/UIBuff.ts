
/** 
 * AUTHOR: 一路向前
 * TIME: 2022.10.17-13.10.34
 */

import { GameConfig } from "../../../config/GameConfig";
import UIBuff_Generate from "../../../ui-generate/buff/UIBuff_generate";

export default class UIBuff extends UIBuff_Generate {

	public buffId: number = null;
	public onClickSpawnBuff: () => void = null;

	/** 
	* 构造UI文件成功后，在合适的时机最先初始化一次 
	*/
	protected onStart() {
		//设置能否每帧触发onUpdate
		this.canUpdate = false;
		this.layer = mw.UILayerBottom;
		//this.initButtons();
	}

	/**
	 * 设置显示时触发
	 */
	protected onShow(name: string) {

		// this.buffInputTip = this.findChildByPath(MWGameUI.MWUITextblock, "Canvas/tip");
		// this.buffBg = this.findChildByPath(MWGameUI.MWUIImage, "Canvas/dynamicBg");
		// this.buffTip = this.findChildByPath(MWGameUI.MWUITextblock, "Canvas/dynamicTip");
		// this.input_buffId = this.findChildByPath(MWGameUI.MWUIInputbox, "Canvas/inputBox");
		this.inputBox.onTextCommitted.add((text) => {
			this.buffId = Number(text);
			console.log("输入了buffId: ", this.buffId);
			if (!this.buffId) {
				this.buffId = null;
				this.inputBox.text = ("");
				console.error("请输入buff配置id !");
				return;
			}
			let checkCfg = GameConfig.Buff.getElement(this.buffId);
			if (!checkCfg) {
				this.buffId = null;
				this.inputBox.text = ("");
				console.error("请输入正确的buff配置id !");
			}
		})
		// this.buffInfo = this.findChildByPath(MWGameUI.MWUITextblock, "Canvas/dynamicInfo");
		// this.btnSpawn = this.findChildByPath(MWGameUI.MWUIButton, "Canvas/btn_Spawn");
		this.btn_Spawn.onClicked.add(this.onClickSpawnBuff);

		// this.btnOpen = this.findChildByPath(MWGameUI.MWUIButton, "Canvas/btn_open");
		this.btn_open.onClicked.add(() => {
			this.tip.visibility = (mw.SlateVisibility.Visible);
			this.inputBox.visibility = (mw.SlateVisibility.Visible);
			this.btn_Spawn.visibility = (mw.SlateVisibility.Visible);
			this.dynamicBg.visibility = (mw.SlateVisibility.Visible);
			this.dynamicTip.visibility = (mw.SlateVisibility.Visible);
			this.dynamicInfo.visibility = (mw.SlateVisibility.Visible);
			this.btn_close.visibility = (mw.SlateVisibility.Visible);
			this.btn_open.visibility = (mw.SlateVisibility.Collapsed);
		});

		// this.btnClose = this.findChildByPath(MWGameUI.MWUIButton, "Canvas/btn_close");
		this.btn_close.onClicked.add(() => {
			this.tip.visibility = (mw.SlateVisibility.Collapsed);
			this.inputBox.visibility = (mw.SlateVisibility.Collapsed);
			this.btn_Spawn.visibility = (mw.SlateVisibility.Collapsed);
			this.dynamicBg.visibility = (mw.SlateVisibility.Collapsed);
			this.dynamicTip.visibility = (mw.SlateVisibility.Collapsed);
			this.dynamicInfo.visibility = (mw.SlateVisibility.Collapsed);
			this.btn_open.visibility = (mw.SlateVisibility.Visible);
			this.btn_close.visibility = (mw.SlateVisibility.Collapsed);
		});
	}


	/**
	 * 设置不显示时触发
	 */
	//protected onHide() {
	//}


	public showBuffInfo(info: string) {
		this.dynamicInfo.text = (info);
	}
}
