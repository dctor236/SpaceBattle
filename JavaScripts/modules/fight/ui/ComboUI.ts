import { GameConfig } from "../../../config/GameConfig";
import { EventsName } from "../../../const/GameEnum";
import ComboUI_Generate from "../../../ui-generate/fighting/ComboUI_generate";
import { single } from "../../../utils/GameUtils";
import { TimeTool } from "../../../utils/TimeTool";

@single(() => mw.UIService.create(ComboUI))
export default class ComboUI extends ComboUI_Generate {
	public static readonly instance: ComboUI = null;

	private _tween: mw.Tween<{ size: number }>;
	private _guid: string;
	private _count: number = 0;
	private _hideDebounce: TimeTool.ReturnTimeObject<() => void>;
	private _config: { from: number; to: number; time: number; duration: number };
	protected onStart(): void {
		const value = GameConfig.Global.getElement(82).Value2;
		this._config = { from: value[1] || 46, to: value[2] || 64, time: value[3] || 500, duration: value[4] || 3000 };
		this._hideDebounce = TimeTool.Global.debounce(this, this.endCombo, this._config.duration);
	}
	/**
	 * UI展示连击combo
	 * @param count
	 * @param show
	 */
	public setCombo(guid: string, config?: { from: number; to: number; time: number }) {
		this.show();
		// if (guid === this._guid) {
		this._count++;
		// } else {
		// 	this._guid = guid;
		// 	this._count = 1;
		// }

		Event.dispatchToLocal(EventsName.ComboChange, guid, this._count);
		const { from, to, time } = config || this._config;
		this.comboCanvas.visibility = mw.SlateVisibility.Visible;
		this.comboCount.text = this._count.toString();
		this.comboCount.fontSize = from;
		if (this._tween) {
			this._tween.stop();
			this._tween = null;
		}
		//最小值，最大值，时长
		this._tween = new mw.Tween({ size: from })
			.to({ size: to }, time)
			.onUpdate(obj => {
				this.comboCount.fontSize = obj.size;
			})
			.onRepeat(obj => {
				this.comboCount.fontSize = obj.size;
			})
			.yoyo(true)
			.repeat(1)
			.start();
		this._hideDebounce.run();
	}

	private endCombo() {
		this._guid = "";
		this._count = 0;
		this.hide();
	}
}
