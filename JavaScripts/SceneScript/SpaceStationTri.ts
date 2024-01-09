import { GameConfig } from "../config/GameConfig"
import { EventsName, PlayerStateType, SkillState } from "../const/GameEnum"
import { GlobalData } from "../const/GlobalData"
import { GlobalModule } from "../const/GlobalModule"
import { BagModuleC } from "../modules/bag/BagModuleC"
import { BuffModuleC } from "../modules/buff/BuffModuleC"
import { EBuffHostType } from "../modules/buff/comon/BuffCommon"
import GravityCtrlMgr from "../modules/gravity/GravityCtrlMgr"
import { MGSMsgHome } from "../modules/mgsMsg/MgsmsgHome"
import SkillMgr from "../modules/skill/SkillMgr"
import SkillModule_Client from "../modules/skill/SkillModule_Client"
import { TS3 } from "../ts3/TS3"
import Tips from "../ui/commonUI/Tips"
import GameUtils from "../utils/GameUtils"

@Component
export default class SpaceStationTri extends mw.Script {
    stayTime: number = 0
    protected onStart(): void {
        if (SystemUtil.isServer())
            return
        const tri = this.gameObject as mw.Trigger

        tri.onEnter.add((go) => {
            if (GameUtils.isPlayerCharacter(go)) {

            }
        })
        tri.onLeave.add((go) => {
            if (GameUtils.isPlayerCharacter(go)) {
                const ch = Player.localPlayer.character
                if (ch.worldTransform.position.z <= -115) {
                    if (GlobalData.inSpaceStation) return
                    if (this.stayTime != 0) {
                        MGSMsgHome.uploadMGS('ts_area_leave', "宇宙停留时长", { area_id: 3, time: (TimeUtil.time() - this.stayTime) })
                        this.stayTime = 0
                    }
                    this.stayTime = TimeUtil.time()
                    GlobalData.inSpaceStation = true
                    GravityCtrlMgr.instance.simulate(false)
                    ModuleService.getModule(SkillModule_Client).findSkill(2011).State = SkillState.Disable
                    Tips.show(GameUtils.getTxt("Tips_1009"))
                    ModuleService.getModule(BuffModuleC).reqAddSBuff('', TS3.playerMgr.mainUserId, 9, EBuffHostType.Player)
                    const curSel1 = ModuleService.getModule(BagModuleC).curEquip
                    const curSel2 = Number(curSel1)
                    if (Math.floor(curSel2 / 10) >= 30 && Math.floor(curSel2 / 10) < 40) {
                        const item = GameConfig.Item.getElement(curSel2)
                        Event.dispatchToLocal('UnselectItem', ModuleService.getModule(BagModuleC).equipSlots.indexOf(curSel1))
                    }
                } else {
                    if (!GlobalData.inSpaceStation) return
                    if (this.stayTime != 0) {
                        MGSMsgHome.uploadMGS('ts_area_leave', "豪宅停留时长", { area_id: 2, time: (TimeUtil.time() - this.stayTime) })
                        this.stayTime = 0
                    }
                    this.stayTime = TimeUtil.time()
                    GlobalData.inSpaceStation = false
                    ModuleService.getModule(BuffModuleC).reqClearSBuff(TS3.playerMgr.mainUserId, 9, EBuffHostType.Player)
                    GravityCtrlMgr.instance.simulate(true)
                    Tips.show(GameUtils.getTxt("Tips_1010"))
                    Event.dispatchToServer(EventsName.CancelActive);
                    Event.dispatchToLocal(EventsName.CancelActive);
                    ModuleService.getModule(SkillModule_Client).findSkill(2011).State = SkillState.Enable
                    MGSMsgHome.uploadMGS('ts_game_result', '玩家进入宇宙区域', { record: 'enter_room' })
                }
            }
        })

        Event.addLocalListener("ReturnBtn", () => {
            if (this.stayTime == 0) {
                this.stayTime = TimeUtil.time()
            }
            const curSel1 = ModuleService.getModule(BagModuleC).curEquip
            const curSel2 = Number(curSel1)
            if (Math.floor(curSel2 / 10) >= 30 && Math.floor(curSel2 / 10) < 40) {
                const item = GameConfig.Item.getElement(curSel2)
                Event.dispatchToLocal('UnselectItem', ModuleService.getModule(BagModuleC).equipSlots.indexOf(curSel1))
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