
import { GameConfig } from "../../config/GameConfig";
import { INPCConfigElement } from "../../config/NPCConfig";
import SP_NPC, { NPCState, NPC_Events } from "./NPC";


export class NPCServer {
    private npc: mw.Character = null;
    private config: INPCConfigElement = null;
    /**脚本 */
    private script: SP_NPC = null;
    private curIndex = 0;
    private poss: mw.Vector[] = [];
    private npcState = NPCState.None;
    /**触发器 */
    public trigger: mw.Trigger = null;

    public constructor(script: SP_NPC) {
        this.script = script;
        this.init()
    }
    public init(): void {
        this.npc = this.script.npc;
        this.config = GameConfig.NPCConfig.getElement(this.script.id)
        if (!this.config) {
            console.error("error:NPCServer config未找到", this.script.id)
            return
        }
        if (this.config.state != 2)
            return

        !StringUtil.isEmpty(this.script.triggerGuid) && GameObject.asyncFindGameObjectById(this.script.triggerGuid).then(async (obj: mw.GameObject) => {
            if (!obj) {
                obj = await GameObject.asyncFindGameObjectById(this.script.triggerGuid);
                console.error("error:NPCServer obj未找到", this.npc.gameObjectId)
                return;
            }
            this.trigger = obj as mw.Trigger;
            this.trigger.onEnter.add(this.onTriggerEnter.bind(this));
            //TOOD 动态触发器 会连续触发
            // this.trigger.onLeave.add(this.onTriggerExit.bind(this));
        });

        Event.addClientListener(NPC_Events.NPC_AsyncPlayeAnim + this.config.ID, (p: mw.Player, animGuid: string) => {
            Event.dispatchToAllClient(NPC_Events.NPC_AsyncPlayeAnim + this.config.ID, animGuid)
        })
        // console.log("jkjkljkljkljkl", this.config.ID)
    }


    public onPlayerEnter(p: mw.Player) {
        Event.dispatchToClient(p, NPC_Events.NPC_AsyncState + this.script.id, this.npcState)
    }
    /**
     * 进入触发器
     * @param obj 
     * @returns 
     */
    private onTriggerEnter(go: mw.GameObject): void {

    }

    /**切换Npc状态 */
    public changeNpcState(state: NPCState) {
        if (this.npcState == state) return
        this.npcState = state;
    }

    public onUpdate(dt: number): void {
        if (this.npcState == NPCState.None) {
            return;
        }
    }
}