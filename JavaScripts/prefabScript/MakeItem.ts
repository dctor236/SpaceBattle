/** 
 * @Author       : 陆江帅
 * @Date         : 2023-03-24 14:56:47
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-16 12:16:39
 * @FilePath     : \mollywoodschool\JavaScripts\prefabScript\MakeItem.ts
 * @Description  : 
 */

@Component
export default class MakeItem extends mw.Script {
    private _obj: mw.GameObject
    private _effect: mw.Effect

    public spawn() {
        if (!this._obj) this._obj = this.gameObject.getChildByName("物品")
        if (!this._effect) this._effect = this.gameObject.getChildByName("特效") as mw.Effect
        this._effect.play()
        this._obj.setVisibility(mw.PropertyStatus.Off);
        setTimeout(() => {
            this._obj.setVisibility(mw.PropertyStatus.On);
        }, (this._effect.timeLength * 0.5) * 1000);
    }

    public despawn() {
        this._effect.stop()
        this._obj.setVisibility(mw.PropertyStatus.Off);
    }
}