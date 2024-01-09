/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-07-27 22:42:24
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-07-27 23:54:10
 * @FilePath: \mollywoodschool\JavaScripts\SceneScript\DeadTrigger.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Attribute } from "../modules/fight/attibute/Attribute"
import { MGSMsgHome } from "../modules/mgsMsg/MgsmsgHome"
import { PlayerMgr } from "../ts3/player/PlayerMgr"
import Tips from "../ui/commonUI/Tips"
import GameUtils from "../utils/GameUtils"

@Component
export default class DeadTrigger extends mw.Script {
    canTri: boolean = true
    protected onStart(): void {
        if (SystemUtil.isServer()) return
        const tri = this.gameObject as mw.Trigger
        setTimeout(() => {
            tri.onEnter.add((go) => {
                if (this.canTri && GameUtils.isPlayerCharacter(go) && PlayerMgr.Inst.mainPlayer) {
                    this.canTri = false
                    Tips.show('进入瘴气圈，毒素迅速蔓延至全身...')
                    setTimeout(() => {
                        this.canTri = true
                    }, 6.5 * 1000);
                    // MGSMsgHome.uploadMGS('ts_game_result', '玩家每次从obby区跌落时', { record: 'obby_fall_down' })
                    PlayerMgr.Inst.onDamage(PlayerMgr.Inst.mainPlayer.getAtt(Attribute.EAttType.hp), 1)
                }
            })
            if (tri.checkInArea(Player.localPlayer.character)) {
                tri.onEnter.broadcast(Player.localPlayer.character)
            }
        }, 3000)
    }


    protected onUpdate(dt: number): void {

    }

    protected onDestroy(): void {

    }
}