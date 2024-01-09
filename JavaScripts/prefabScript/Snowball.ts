/**
 * @Author       : 田可成
 * @Date         : 2023-04-27 17:01:19
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-27 18:21:37
 * @FilePath     : \mollywoodschool\JavaScripts\prefabScript\Snowball.ts
 * @Description  : 
 */
@Component
export default class Snowball extends mw.Script {
    private _obj: mw.GameObject
    private _impulse: mw.Impulse
    private _sysThruster: mw.PhysicsThruster;

    public spawn(rotation: mw.Rotation) {
        if (!this._obj) this._obj = this.gameObject.getChildByName("雪球")
        if (!this._impulse) this._impulse = this._obj.getChildByName("impulse") as mw.Impulse
        if (!this._sysThruster) this._sysThruster = this._obj.getChildByName("thruster") as mw.PhysicsThruster
        this._obj.worldTransform.rotation = rotation;
        this._impulse.enable = true;
        this._sysThruster.enable = true;
        setTimeout(() => {
            this._sysThruster.enable = false;
        }, 1000);
        (this._obj as mw.Model).physicsEnabled = true;
        (this._obj as mw.Model).massEnabled = true;
        setTimeout(() => {
            this._impulse.enable = false
        }, 2000);
    }

    public despawn() {
        (this._obj as mw.Model).physicsEnabled = false;
        (this._obj as mw.Model).massEnabled = false;
        this._obj.localTransform.position = mw.Vector.zero
    }
}