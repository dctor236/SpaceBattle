

import { INPCTalkElement } from "../../config/NPCTalk";
import { EventsName } from "../../const/GameEnum";
import SP_NPC, { NPCState } from "./NPC";
import { NPCDataHelper } from "./NPCData";
import NPCModule_S from "./NPCModule_S";


export default class NPCModule_C extends ModuleC<NPCModule_S, NPCDataHelper> {
    private _npcMap: Map<number, SP_NPC> = new Map();
    private _followNpc: number[] = []

    protected onStart(): void {
        Event.addLocalListener(EventsName.UnFollowNpc, () => {
            this._followNpc.forEach(e => {
                const npc = this.getNpc(e).npcClient
                npc.onNPCFollowOff()
            })
            this._followNpc.length = 0
        })
    }

    public registerNPC(npc: SP_NPC) {
        if (!this._npcMap.has(npc.id)) {
            this._npcMap.set(npc.id, npc)
        }
    }
    getNpc(id: number): SP_NPC {
        if (this._npcMap.has(id))
            return this._npcMap.get(id);
    }

    public registFollowNPC(npcID: number) {
        if (this._followNpc.indexOf(npcID) == -1) {
            this._followNpc.push(npcID)
        }
    }

    public getNearNpcToPlayer() {
        const playPos = this.localPlayer.character.worldTransform.position
        let distance: number = 4564564
        let tmpObj: mw.GameObject = null
        this._npcMap.forEach((e) => {
            const npcState = e.npcClient.npcState
            const npcPos = e.npcClient.npcObj.worldTransform.position
            const tmpDistance = Vector.squaredDistance(playPos, npcPos)
            if (npcState == NPCState.Talk
                && tmpDistance < distance) {
                tmpObj = e.npcClient.npcObj
                distance = tmpDistance
            }
        })
        return tmpObj
    }

    /**玩家完成了对话 给予道具 */
    public async getBagItem(npcid: number, eventConfig: INPCTalkElement, missionID: number) {
        if (this.data.getNpcEventReward(npcid, missionID)) return
        // for (let i = 0; i < eventConfig.rewarID.length; i++) {
        //     let rewardId = eventConfig.rewarID[i]
        //     const bagModuleC = ModuleService.getModule(BagModuleC)
        //     bagModuleC.addItem(rewardId)
        //     bagModuleC.addSquareItem(rewardId)
        //     MGSMsgHome.setNpcGetItem(rewardId);
        //     Tips.show(GameConfig.SquareLanguage.Danmu_Content_1370.Value + GameConfig.ItemTestConfig.getElement(rewardId).Name)
        //     await TimeUtil.delaySecond(1);   //避免连续拿出道具卡住
        // }
        this.server.net_setNpcReward(npcid, eventConfig.rewarID, missionID)
    }
}