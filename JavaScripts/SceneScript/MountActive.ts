/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-22 21:02:00
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-24 08:59:33
 * @FilePath: \vine-valley\JavaScripts\SceneScript\MountActive.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { EventsName } from "../const/GameEnum";
import { ClickUIPools } from "../modules/interactModule/ClickUI";
import { MGSMsgHome } from "../modules/mgsMsg/MgsmsgHome";
import { PlayerMgr } from "../ts3/player/PlayerMgr";

@Component
export default class MountActive extends mw.Script {
    @mw.Property({ replicated: true, displayName: "交互距离", group: "属性" })
    public activeDis: number = 150;//可交互的距离
    @mw.Property({ replicated: true, displayName: "UI图标", group: "属性" })
    public cdIcon: string = "34423";//默认是个小手
    @mw.Property({ replicated: true, displayName: "UI图标偏移", group: "属性" })
    public offset: mw.Vector = new mw.Vector(0, 0, 0);

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart() {
        if (SystemUtil.isServer()) return
        await Player.asyncGetLocalPlayer()
        this.useUpdate = true
    }
    public showClickIcon(value: boolean): void {
        if (value && this.gameObject.getVisibility()) {
            ClickUIPools.instance.show(this.gameObject, this.offset, () => {
                if (this.gameObject.tag = 'panda') {
                    //熊猫交互
                    MGSMsgHome.uploadMGS('ts_action_click', '骑乘向导胖达的次数', { button: 'pangda_ride' })
                    Event.dispatchToLocal(EventsName.DoneTask, 1002, 1)
                    this.setPos(new Vector(this.gameObject.worldTransform.position.x, this.gameObject.worldTransform.position.y, this.gameObject.worldTransform.position.z + 80))
                }
            });
        } else {
            this.resetTransform()
        }
    }

    private resetTransform() {
        Player.localPlayer.character.worldTransform = this._oriTransform;
    }
    private _oriTransform: mw.Transform
    private setPos(loc: Vector) {
        const ch = PlayerMgr.Inst.mainPlayer.character
        this._oriTransform = ch.worldTransform.clone()
        ch.worldTransform.position = loc
    }

    protected onUpdate(dt: number): void {
        if (SystemUtil.isServer()) return
        const p = PlayerMgr.Inst.mainPlayer
        if (!p) return
        const pos = PlayerMgr.Inst.mainPos
        if (Vector.squaredDistance(pos, this.gameObject.worldTransform.position)
            <= this.activeDis * this.activeDis) {
            this.showClickIcon(true)
        } else {
            ClickUIPools.instance.hide(this.gameObject.gameObjectId);
        }
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}