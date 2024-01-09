/**
 * @Author       : 田可成
 * @Date         : 2023-04-10 13:08:37
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-14 11:49:27
 * @FilePath     : \mollywoodschool\JavaScripts\modules\mgsMsg\TriggerMsg.ts
 * @Description  : 
 */
import GameUtils from "../../utils/GameUtils";
import { MGSMsgHome } from "./MgsmsgHome";

@Component
export default class TriggerMsg extends mw.Script {
    private time: number = 0;
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        if (SystemUtil.isClient()) {
            const id = setInterval(() => {
                if (this.gameObject) {
                    this.initTriggerMsg();
                    clearInterval(id)
                }
            }, 2000)
        }
    }

    initTriggerMsg() {
        if(this.gameObject.tag==="0") return
        if (this.gameObject instanceof mw.Trigger) {
            this.gameObject.onEnter.add((go) => {
                if (GameUtils.isPlayerCharacter(go)) {
                    MGSMsgHome.enterAreaTrigger(Number(this.gameObject.tag))
                    this.time = mw.TimeUtil.elapsedTime()
                }
            })

            this.gameObject.onLeave.add((go) => {
                if (GameUtils.isPlayerCharacter(go)) {
                    let msgTime = (mw.TimeUtil.elapsedTime() - this.time)
                    MGSMsgHome.leaveAreaTrigger(Number(this.gameObject.tag),  Math.ceil(msgTime), 0)
                }
            })
        }
    }
}