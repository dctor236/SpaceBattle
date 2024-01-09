
import { GameConfig } from "../../config/GameConfig";
import { MGSMsgHome } from "./MgsmsgHome";
import { PlayerMgsModuleData } from "./PlayerMgsMsgData";

export class MgsMsgModuleC extends ModuleC<MgsMsgModuleS, PlayerMgsModuleData> {

    private enterAreaTriggerTime: number = 0;
    private curEventConfigID: number;               // 记录当前进入的区域
    private mgsMap: Map<string, { tag: string, time: number }> = new Map<string, { tag: string, time: number }>();

    private curMsgStartGameEventID: number = -1;        // 当前游戏的eventid
    private curMsgStartGameTime: number = -1;           // 当前游戏的time

    onEnterScene(sceneType: number): void {
        this.enterAreaTriggerTime = 0;
        this.curEventConfigID = 0;
    }
    public getEnterTime(eventConfigID: number) {
        return this.data.getScheduleEnterTimes(eventConfigID)
    }

    /**
     * 进入场景触发器埋点
     * @param eventConfigID 事件表id
     */
    public enterAreaTrigger(eventConfigID: number) {
        this.curEventConfigID = eventConfigID;
        this.enterAreaTriggerTime = mw.TimeUtil.elapsedTime();
        // 先取数据，再通知服务器进入次数+1
        this.data.getScheduleEnterTimes(eventConfigID);
        // MGSMsgHome.lunchStart(eventConfigID, enterNum);

        this.server.net_addScheduleEnterTimes(eventConfigID);
    }

    /**
     * 离开场景触发器埋点
     * @param eventConfigID 事件表id
     */
    public leaveAreaTrigger(eventConfigID: number) {
        this.curEventConfigID = 0;

        let totalTime = Math.round(mw.TimeUtil.elapsedTime() - this.enterAreaTriggerTime);
        let enterNum = this.data.getScheduleEnterTimes(eventConfigID);

        // MGSMsgHome.lunchEnd(eventConfigID, totalTime, enterNum);
    }

    /**离开交互状态 */
    public setOverMGS(guid: string): void {
        if (this.mgsMap.has(guid)) {
            let data = this.mgsMap.get(guid);
            let time = mw.TimeUtil.time() - data.time;
            MGSMsgHome.interactionLeave(Number(data.tag), time * 1000);
            this.mgsMap.delete(guid);
            // Event.dispatchToLocal("ClickInteractiveEvent");
        }
    }

    /**进入交互状态 */
    public addMGSInteraction(guid: string, tag: string, needExit: boolean): void {
        MGSMsgHome.interactionMSG(Number(tag), this.curEventConfigID);
        if (!needExit) {
            return;
        }
        let time = mw.TimeUtil.time();
        this.mgsMap.set(guid, { tag, time });
    }

    /**获取场景id */
    public getCurEventID() {
        return this.curEventConfigID;
    }

    setPropClickMGS(propId: number): void {
        MGSMsgHome.setItemMSG(propId, this.curEventConfigID);
    }

    setItemEquip(itemId: number) {
        MGSMsgHome.setItemEquip(itemId, this.curEventConfigID);
    }
    setItemUnMSG(itemId: number, time: number): void {
        MGSMsgHome.setItemUnEquip(itemId, time);
    }

    setActionMSG(id: number): void {
        MGSMsgHome.setActionMSG(id, this.curEventConfigID);
    }

    public startGame(eventConfigID: number) {
        this.curMsgStartGameEventID = eventConfigID;
        this.curMsgStartGameTime = mw.TimeUtil.time();
        MGSMsgHome.playerPlayGame(this.curMsgStartGameEventID.toString());
    }

    public endGame(eventConfigID: number, score: number) {
        if (this.curMsgStartGameEventID != eventConfigID) {
            console.warn("结算埋点，应该是没有进游戏 this.curMsgStartGameEventID：" + this.curMsgStartGameEventID + ",eventConfigID:" + eventConfigID)

            this.curMsgStartGameEventID = -1;
            return;
        }
        let time = mw.TimeUtil.time() - this.curMsgStartGameTime;

        MGSMsgHome.playerLeaveGame(this.curMsgStartGameEventID.toString(), time * 1000, score);

        this.curMsgStartGameEventID = -1;
        this.curMsgStartGameTime = 0;
    }
}
export class MgsMsgModuleS extends ModuleS<MgsMsgModuleC, PlayerMgsModuleData>{

    /**
     * 修改进入次数
     * @param eventConfigID 
     */
    public net_addScheduleEnterTimes(eventConfigID: number) {
        this.currentData.addScheduleEnterTimes(eventConfigID);
    }
}