import { GameConfig } from "../config/GameConfig"
import { EventsName, PlayerStateType } from "../const/GameEnum"
import { GlobalData } from "../const/GlobalData"
import { GlobalModule } from "../const/GlobalModule"
import { BagModuleC } from "../modules/bag/BagModuleC"
import GravityCtrlMgr from "../modules/gravity/GravityCtrlMgr"
import Tips from "../ui/commonUI/Tips"
import GameUtils from "../utils/GameUtils"

@Component
export default class PlanetStand extends mw.Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        if (SystemUtil.isServer())
            return
        const tri = this.gameObject as mw.Trigger
        tri.onEnter.add((go) => {
            if (GameUtils.isPlayerCharacter(go)) {
                const curSel = Number(ModuleService.getModule(BagModuleC).curEquip)
                const ch = Player.localPlayer.character
                if (Math.floor(curSel / 10) >= 30 && Math.floor(curSel / 10) < 40) {
                    const item = GameConfig.Item.getElement(curSel)
                    Event.dispatchToLocal(EventsName.RemoveSkill, item.Skills[0], 0)
                }

                GlobalData.inPlanetSurface = true
                GravityCtrlMgr.instance.simulate(false)
                ch.switchToWalking()
            }
        })

        tri.onLeave.add((go) => {
            if (GameUtils.isPlayerCharacter(go)) {
                GlobalData.inPlanetSurface = false
                const curSel = Number(ModuleService.getModule(BagModuleC).curEquip)
                const ch = Player.localPlayer.character
                if (Math.floor(curSel / 10) != 30) {
                    GravityCtrlMgr.instance.simulate(true)
                }
            }
        })

    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}