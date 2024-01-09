import GameUtils from "../utils/GameUtils"

@Component
export default class WUIFollow extends mw.Script {
    @mw.Property({ displayName: "距离", group: "属性" })
    distance: number = 16000 * 100
    @mw.Property({ displayName: "多语言Key", group: "属性" })
    language: string = ''

    private _wuiLoc: Vector
    protected onStart(): void {
        if (SystemUtil.isServer())
            return
        this.useUpdate = true
        this._wuiLoc = this.gameObject.worldTransform.position
        setTimeout(() => {
            const widget: mw.UIWidget = this.gameObject as mw.UIWidget
            const tex = widget.getTargetUIWidget().findChildByPath("RootCanvas/Tex") as mw.TextBlock;
            tex.text = GameUtils.getTxt(this.language)
        }, 4000);
    }

    private _updateTime: number = 0
    protected onUpdate(dt: number): void {
        if (++this._updateTime % 2 != 0 && !this.gameObject.getVisibility()) return;
        let ch = Player.localPlayer.character
        let chLoc = ch.worldTransform.position
        if (Vector.squaredDistance(chLoc, this._wuiLoc) <= this.distance) {
            let chRot = ch.worldTransform.rotation
            let rot = chLoc.subtract(this._wuiLoc).toRotation()
            this.gameObject.worldTransform.rotation = new Rotation(this.gameObject.worldTransform.rotation.x, this.gameObject.worldTransform.rotation.y, rot.z)
        }
    }


    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {
    }
}