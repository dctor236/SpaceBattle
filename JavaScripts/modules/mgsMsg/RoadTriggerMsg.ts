/**
 * @Author       : songxing
 * @Date         : 2023-03-24 13:40:44
 * @LastEditors  : songxing
 * @LastEditTime : 2023-05-19 13:42:27
 * @FilePath     : \mollywoodschool\JavaScripts\modules\mgsMsg\RoadTriggerMsg.ts
 * @Description  : 
 */
import GameUtils from "../../utils/GameUtils";
import { MGSMsgHome } from "./MgsmsgHome";

@Component
export default class RoadTriggerMsg extends mw.Script {

    private static count: number = 5;

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

        if (this.gameObject instanceof mw.Trigger) {
            this.gameObject.onEnter.add((go) => {
                if (GameUtils.isPlayerCharacter(go)) {
                    this.time = TimeUtil.elapsedTime();
                    RoadTriggerMsg.count--;
                    if (RoadTriggerMsg.count >= 0) {
                        MGSMsgHome.playerCommunication(this.gameObject.name + "_" + (5 - RoadTriggerMsg.count))
                    }
                }
            })

            this.gameObject.onLeave.add((go) => {
                if (GameUtils.isPlayerCharacter(go)) {
                    this.time = TimeUtil.elapsedTime() - this.time;
                    if (RoadTriggerMsg.count > -2 && 4 - RoadTriggerMsg.count != 0) {

                        MGSMsgHome.roadTriggerMsg(Math.ceil(this.time), (4 - RoadTriggerMsg.count), Number(this.gameObject.tag))
                    }

                }
            })
        }
    }
}