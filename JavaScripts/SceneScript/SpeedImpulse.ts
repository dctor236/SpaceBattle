import { EventsName } from "../const/GameEnum"
import { PlayerMgr } from "../ts3/player/PlayerMgr"
import GameUtils from "../utils/GameUtils"

@Component
export default class SpeedImpulse extends mw.Script {
    inteval = null
    impulse: number = 1500
    protected onStart(): void {
        if (SystemUtil.isServer()) return
        // const tri = this.gameObject as mw.Trigger
        // tri.onEnter.add(go => {
        //     if (!this.inteval && GameUtils.isPlayerCharacter(go)) {
        //         // PlayerMgr.Inst.mainCharacter.movementDirection = mw.MovementDirection.AxisDirection
        //         this.inteval = setInterval(() => {
        //             if (PlayerMgr.Inst.mainPlayer.mwPlayer && tri.checkInArea(PlayerMgr.Inst.mainCharacter)) {
        //                 const ch = PlayerMgr.Inst.mainCharacter
        //                 const triForward = tri.getForwardVector()
        //                 const pForward = ch.getForwardVector()
        //                 if (Math.abs(pForward.toRotation().z - triForward.toRotation().z) <= 30) {
        //                     ch.addImpulse(triForward.multiply(this.impulse), true)
        //                     Event.dispatchToLocal(EventsName.ShowScreenEff, true)
        //                 } else {
        //                     Event.dispatchToLocal(EventsName.ShowScreenEff, false)
        //                 }
        //             } else {
        //                 // PlayerMgr.Inst.mainCharacter.movementDirection = mw.MovementDirection.ControllerDirection
        //                 clearInterval(this.inteval)
        //                 this.inteval = null
        //                 Event.dispatchToLocal(EventsName.ShowScreenEff, false)
        //             }
        //         }, 50)
        //     }
        // })
        // tri.onLeave.add(go => {
        //     if (GameUtils.isPlayerCharacter(go)) {
        //         clearInterval(this.inteval)
        //         this.inteval = null
        //     }
        // })
    }

    protected onUpdate(dt: number): void {

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}