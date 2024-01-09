/**
 * @Author       : songxing
 * @Date         : 2023-03-31 13:58:35
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-14 11:48:28
 * @FilePath     : \mollywoodschool\JavaScripts\modules\mgsMsg\NightTriggerMsg.ts
 * @Description  : 夜晚的区域埋点时长
 */

import GameUtils from "../../utils/GameUtils";
import { MGSMsgHome } from "./MgsmsgHome";

@Component
export default class Night extends mw.Script {
    @mw.Property({ displayName: "夜晚区域埋点ID" })
    public msgId: number = 0;

     /**夜晚呆在某区域的时长 */
     private nightTime: number = 0;

     private isInNight: boolean

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {

        if (this.msgId === 0) return;
        if (SystemUtil.isClient()) {
            const id = setInterval(() => {
                if (this.gameObject) {
                    this.initTriggerMsg();
                    clearInterval(id)
                }
            }, 2000)

                Event.addLocalListener("NightStart", () => {
                    this.isInNight = true;
                    this.nightTime = mw.TimeUtil.elapsedTime()
                })

                Event.addLocalListener("NightEnd", () => {
                    this.isInNight = false;
                    let msgTime = mw.TimeUtil.elapsedTime() - this.nightTime
                    MGSMsgHome.leaveAreaTrigger(0,  Math.ceil(msgTime), this.msgId)
                })
        }

    }

    initTriggerMsg() {
        if (this.gameObject instanceof mw.Trigger) {
            this.gameObject.onEnter.add((go) => {
                if (GameUtils.isPlayerCharacter(go)) {
                    if ( this.isInNight) {
                        this.nightTime = mw.TimeUtil.elapsedTime()
                    }
                }
            })

            this.gameObject.onLeave.add((go) => {
                if (GameUtils.isPlayerCharacter(go)) {
                    if (this.isInNight) {
                        let msgTime = mw.TimeUtil.elapsedTime() - this.nightTime
                        MGSMsgHome.leaveAreaTrigger(0,  Math.ceil(msgTime), this.msgId)
                    }
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