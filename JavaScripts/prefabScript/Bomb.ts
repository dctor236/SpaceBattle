/**
 * @Author       : 田可成
 * @Date         : 2023-04-04 19:11:28
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-18 12:14:39
 * @FilePath     : \mollywoodschool\JavaScripts\prefabScript\Bomb.ts
 * @Description  : 
 */
import { UIManager } from "../ExtensionType"
import { BombTips } from "../ui/worldUI/BombTips"

@Component
export default class Bomb extends mw.Script {

    @mw.Property({ displayName: "爆炸事件(秒)", group: "属性" })
    public time: number = 3
    @mw.Property({ displayName: "爆炸时材质", group: "属性" })
    public material: string = ""
    private _obj: mw.Model
    private _effect: mw.Effect
    private _sound: mw.Sound
    private _impulse: mw.Impulse
    private _widget: mw.UIWidget
    private _bombTips: BombTips

    public spawn() {
        if (!this._obj) this._obj = this.gameObject.getChildByName("物品") as mw.Model
        if (!this._effect) this._effect = this.gameObject.getChildByName("特效") as mw.Effect
        if (!this._sound) this._sound = this.gameObject.getChildByName("音效") as mw.Sound
        if (!this._impulse) this._impulse = this.gameObject.getChildByName("impulse") as mw.Impulse
        if (!this._widget) this._widget = this.gameObject.getChildByName("widget") as mw.UIWidget
        if (!this._bombTips) this._bombTips = UIManager.create(BombTips)
        this._widget.setTargetUIWidget(this._bombTips.uiWidgetBase)
        this._widget.refresh()
        this._bombTips.counting(this.time)
        this._impulse.enable = false
        this._obj.setVisibility(mw.PropertyStatus.On);
        setTimeout(async () => {
            this._impulse.enable = true
            this._effect.loopCount = 1
            this._effect.play();
            this._sound.isLoop = false
            this._sound.play();
            // if (this.material) {
            //     await mw.AssetUtil.asyncDownloadAsset(this.material);
            //     this._obj.setMaterial(this.material);
            // }
        }, this.time * 1000);
    }

    public despawn() {
        this._impulse.enable = false;
        this._effect.stop()
        this._sound.stop()
        this._obj.setVisibility(mw.PropertyStatus.Off);
    }
}