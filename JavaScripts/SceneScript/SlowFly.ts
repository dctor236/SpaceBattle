/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-07-19 20:04:32
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-07-19 20:12:03
 * @FilePath: \mollywoodschool\JavaScripts\SceneScript\SlowFly.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { EventsName } from "../const/GameEnum"
import { PlayerMgr } from "../ts3/player/PlayerMgr"
import Tips from "../ui/commonUI/Tips"
import GameUtils from "../utils/GameUtils"

@Component
export default class SlowFly extends mw.Script {
    isInArea: boolean = false
    defaultFlySpeed: number = 800
    defaultFlyBreak: number = 2048

    cut: number = 3
    protected onStart(): void {
        if (SystemUtil.isServer()) return
        const tri = this.gameObject as mw.Trigger
        tri.onEnter.add((go) => {
            if (GameUtils.isPlayerCharacter(go)) {
                this.isInArea = true
                const ch = Player.localPlayer.character
                ch.maxFlySpeed = ch.maxFlySpeed / this.cut
                ch.brakingDecelerationFlying = ch.brakingDecelerationFlying / this.cut
                Tips.show('你已经进入限飞区域，你的飞行速度将会下降！')
            }
        })

        tri.onLeave.add((go) => {
            if (GameUtils.isPlayerCharacter(go)) {
                this.isInArea = false
                const ch = Player.localPlayer.character
                ch.maxFlySpeed = this.defaultFlySpeed
                ch.brakingDecelerationFlying = this.defaultFlyBreak
                Tips.show('你已经脱离限飞区域，你的飞行速度恢复！')
            }
        })

        Event.addLocalListener(EventsName.PLAYER_FLY, (fly: boolean) => {
            if (this.isInArea && fly) {
                const ch = Player.localPlayer.character
                ch.maxFlySpeed = ch.maxFlySpeed / this.cut
                ch.brakingDecelerationFlying = ch.brakingDecelerationFlying / this.cut
            }
        })
    }


    protected onUpdate(dt: number): void {

    }

    protected onDestroy(): void {

    }
}