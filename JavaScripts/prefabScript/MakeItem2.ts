/**
 * @Author       : 田可成
 * @Date         : 2023-04-16 13:02:33
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-16 13:02:49
 * @FilePath     : \mollywoodschool\JavaScripts\prefabScript\MakeItem2.ts
 * @Description  : 
 */

@Component
export default class MakeItem2 extends mw.Script {
    private _sound: any;

    public spawn() {
        if (!this._sound) this._sound = this.gameObject.getChildByName("音效") as mw.Sound
        this._sound.enable = true
    }

    public despawn() {
        this._sound.enable = false
    }
}