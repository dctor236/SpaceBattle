/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-07-19 20:27:28
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-07-19 22:36:33
 * @FilePath: \mollywoodschool\JavaScripts\modules\npc\NPCModule_S.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import SP_NPC, { NPCState, NPC_Events } from "./NPC";
import { NPCDataHelper } from "./NPCData";
import NPCModule_C from "./NPCModule_C";


export default class NPCModule_S extends ModuleS<NPCModule_C, NPCDataHelper> {
    private _npcGUIDMap: Map<string, SP_NPC> = new Map();
    public async net_setNpcReward(npcid: number, rewardIds: number[], EvenID: number) {
        this.currentData.setNpcEventReward(npcid, EvenID)
        this.currentData.save(true);
    }

    protected onPlayerEnterGame(player: mw.Player): void {
        // let res: SP_NPC = null
        // for (const [k, v] of this._npcGUIDMap) {
        //     if (v.id == 40) {
        //         res = v
        //         break
        //     }
        // }
        // res?.onPlayerEnter(player)
    }

    public registerNPC(npc: SP_NPC) {
        let guid = npc.npc.gameObjectId
        if (!this._npcGUIDMap.has(guid)) {
            this._npcGUIDMap.set(guid, npc)
        }
    }

    protected onStart(): void {
        // setTimeout(() => {
        //     this.init()
        // }, 5000);
    }

    init() {
        let res: SP_NPC = null
        for (const [k, v] of this._npcGUIDMap) {
            if (v.id == 40) {
                res = v
                break
            }
        }
        res?.changeNpcState(NPCState.Kidnap)
    }

}