/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-07-27 22:42:24
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-07-27 23:54:10
 * @FilePath: \mollywoodschool\JavaScripts\SceneScript\DeadTrigger.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { GlobalData } from "../const/GlobalData"
import { UIManager } from "../ExtensionType"
import { Attribute } from "../modules/fight/attibute/Attribute"
import { MGSMsgHome } from "../modules/mgsMsg/MgsmsgHome"
import { PlayerMgr } from "../ts3/player/PlayerMgr"
import UpGoodUI from "../ui/UpGoodUI"
import GameUtils from "../utils/GameUtils"

@Component
export default class UpGood extends mw.Script {
    @mw.Property({ displayName: "建筑guid", group: "属性" })
    building: string = ''

    protected onStart(): void {
        if (SystemUtil.isServer()) return
        const tri = this.gameObject as mw.Trigger
        tri.onEnter.add((go) => {
            if (GameUtils.isPlayerCharacter(go)) {
                GlobalData.upBuild = this.building
                UIManager.show(UpGoodUI)
            }
        })

        tri.onLeave.add((go) => {
            if (GameUtils.isPlayerCharacter(go)) {
                UIManager.hide(UpGoodUI)
            }
        })
    }

    protected onUpdate(dt: number): void {

    }

    protected onDestroy(): void {

    }
}