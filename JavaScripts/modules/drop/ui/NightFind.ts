import { GameConfig } from "../../../config/GameConfig";
import { Tween, UIManager } from "../../../ExtensionType";
import CoinItem_Generate from "../../../ui-generate/coin/CoinItem_generate";
import NigthFind_Generate from "../../../ui-generate/coin/NigthFind_generate";
import GameUtils from "../../../utils/GameUtils";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
import ShopData, { CoinType } from "../../shop/ShopData";
import ShopModuleC from "../../shop/ShopModuleC";

export default class NightFind extends NigthFind_Generate {
	private coinItem: CoinItem_Generate;
	private _silverPos: mw.Vector2;
	private _goldPos: mw.Vector2;

	private _silverTipPos: mw.Vector2;
	private _goldTipPos: mw.Vector2;
	private _endPos: mw.Vector2 = mw.Vector2.zero;

	private _showTipCfg = { to: 200, repeat: 200 };
	private _showKillTipCfg = { to: 500, repeat: 1000 };
	private _killTipsTween: Tween<{ o: number }>;

	/** 当脚本被实例后，会在第一帧更新前调用此函数 */
	protected onStart(): void {
		const shopData = DataCenterC.getData(ShopData);
		const cfg = GameConfig.Global.getElement(84).Value2;
		if (cfg) {
			this._showTipCfg.to = cfg[0];
			this._showTipCfg.repeat = cfg[1];
		}
		const killCfg = GameConfig.Global.getElement(85).Value2;
		if (killCfg) {
			this._showKillTipCfg.to = killCfg[0];
			this._showKillTipCfg.repeat = killCfg[1];
		}

		this.count.autoSizeEnable = true;
		this.killTips.autoSizeEnable = true;

		this.killCanvas.visibility = mw.SlateVisibility.Collapsed;

		this.tipCanvas.visibility = mw.SlateVisibility.Collapsed;
		this._goldPos = GameUtils.getUIPostion(this.goldCoinTxt);

		this._goldTipPos = new mw.Vector2(this._goldPos.x, this._goldPos.y + this.goldCoinTxt.size.y);

		this.goldCoinTxt.text = "" + shopData.getCoin(CoinType.Bill);

		shopData.onBillChange.add((num: number) => {
			this.goldCoinTxt.text = "" + num;
		});
	}

	addNum: number = 0

	moveTween = null

	onGetCoin(coinType: number, pos: mw.Vector, num: number = 1) {
		if (!this.coinItem) {
			this.coinItem = UIManager.create(CoinItem_Generate);
		}
		this.addNum += num
		if (this.moveTween)
			return
		UIManager.showUI(this.coinItem, mw.UILayerTop)
		let startPos = mw.InputUtil.projectWorldPositionToWidgetPosition(pos, true);
		if (this.coinItem.uiObject)
			this.coinItem.uiObject.position = startPos.screenPosition;
		const endPos: mw.Vector2 = this._endPos;
		const tipPos: mw.Vector2 = mw.Vector2.zero;
		switch (coinType) {
			case CoinType.PeaCoin:
				endPos.set(this._silverPos);
				tipPos.set(this._silverTipPos);
				this.coinItem.coin.imageGuid = "120763";
				break;
			case CoinType.Bill:
				endPos.set(this._goldPos);
				tipPos.set(this._goldTipPos);
				this.coinItem.coin.imageGuid = "137786";
				break;
			default:
				return;
		}

		this.moveTween = new Tween({ pos: startPos.screenPosition })
			.to({ pos: endPos }, 1 * 300)
			.start()
			.onUpdate(r => {
				if (this.coinItem.uiObject)
					this.coinItem.uiObject.position = r.pos;
			})
			.onComplete(() => {
				if (this.addNum > 0) {
					this.tipCanvas.position = tipPos;
					this.count.text = `+${this.addNum}`;
					const { to, repeat } = this._showTipCfg;
					new Tween({ o: 0 })
						.to({ o: 1 }, to)
						.onUpdate(obj => {
							this.tipCanvas.renderOpacity = obj.o;
						})
						.yoyo(true)
						.repeat(1)
						.repeatDelay(repeat)
						.start()
						.onComplete(() => {
							this.tipCanvas.visibility = mw.SlateVisibility.Collapsed;
							this.moveTween = null
						});
				}
				this.tipCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
				UIManager.hideUI(this.coinItem)
				MGSMsgHome.uploadMGS('ts_game_over', '玩家每获得钞票时，上报一次，累加', { player_score: this.addNum })
				ModuleService.getModule(ShopModuleC).req_addCoin(CoinType.Bill, this.addNum)
				this.addNum = 0
			});
	}
	public onKillTips(killName: string, monsterName: string) {
		if (this._killTipsTween) {
			this._killTipsTween.stop();
		}
		const { to, repeat } = this._showKillTipCfg;
		this._killTipsTween = new Tween({ o: 0 })
			.to({ o: 1 }, to)
			.onStart(obj => {
				this.killCanvas.renderOpacity = obj.o;
				this.killCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible;
				const str = GameConfig.SquareLanguage.Text_Kill.Value
				this.killTips.text = GameUtils.stringFormat(str, killName, monsterName);
			})
			.onUpdate(obj => {
				this.killCanvas.renderOpacity = obj.o;
			})
			.onComplete(() => {
				this.killCanvas.visibility = mw.SlateVisibility.Collapsed;
				this._killTipsTween = null;
			})
			.onStop(() => {
				this.killCanvas.visibility = mw.SlateVisibility.Collapsed;
				this._killTipsTween = null;
			})
			.yoyo(true)
			.repeat(1)
			.repeatDelay(repeat)
			.start();
	}
}
