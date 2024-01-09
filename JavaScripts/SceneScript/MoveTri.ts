import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
﻿import { GlobalData } from "../const/GlobalData"
import Tips from "../ui/commonUI/Tips"

@Component
export default class MoveTri extends mw.Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        if (SystemUtil.isClient()) return
        if (SystemUtil.isServer()) {
            const tri = this.gameObject as mw.Trigger
            tri.onEnter.add(go => {
                if (PlayerManagerExtesion.isCharacter(go) && go.player) {
                    if (!GlobalData.isBoss)
                        Event.dispatchToLocal('OpenMover', go.player.playerId, true)
                    else {
                        Tips.showToClient(go.player, '需先将头目击败才可打开车库大门...')
                    }
                }
            })

            tri.onLeave.add(go => {
                if (PlayerManagerExtesion.isCharacter(go) && go.player && !GlobalData.isBoss) {
                    Event.dispatchToLocal('OpenMover', go.player.playerId, false)
                }
            })
        }
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