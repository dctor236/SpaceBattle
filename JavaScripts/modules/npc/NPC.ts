/**
 * @Author       : songxing
 * @Date         : 2023-01-13 18:39:03
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-09 10:44:33
 * @FilePath     : \mollywoodschool\JavaScripts\modules\npc\NPC.ts
 * @Description  : 
 */



import { GameConfig } from "../../config/GameConfig";
import GameUtils from "../../utils/GameUtils";
import { NPCClient } from "./NPCClient";
import NPCModule_C from "./NPCModule_C";
import NPCModule_S from "./NPCModule_S";
import { NPCServer } from "./NPCServer";

export namespace NPC_Events {
	export const NPC_OnClickItem = "NPC_OnClickItem";
	export const NPC_AsyncState = 'NPC_AsyncState'
	export const NPC_AsyncPlayeAnim = 'NPC_AsyncPlayeAnim'
}

export enum NPCState {
	None,
	Talk,
	/**交互状态 */
	InterRact,
	Follow,
	Back,
	/**被绑架 */
	Kidnap,
	/**被救了 */
	Rescue
}
@Component
export default class SP_NPC extends mw.Script {

	@mw.Property({ displayName: "NPC ID" })
	public id = 0;
	@mw.Property({ displayName: "触发器" })
	public triggerGuid: string = "";
	@mw.Property({ displayName: "是否为多足对象" })
	public FourFootStandard: boolean = false;
	@mw.Property({ hideInEditor: true, replicated: true, onChanged: 'onStateChange' })
	private npcState = NPCState.None;
	private npcServer: NPCServer = null;
	public npcClient: NPCClient = null;
	private _npc: mw.Character
	public get npc(): mw.Character {
		return this._npc
	}
	/**是否为双端NPC */
	private _isServerNpc: boolean = false;

	public get isServerNpc(): boolean {
		return this._isServerNpc;
	}

	public playerLeave: mw.Action = new mw.Action();
	/** 当脚本被实例后，会在第一帧更新前调用此函数 */
	protected onStart() {
		this.init();
	}
	public onPlayerEnter(p: mw.Player) {
		this.npcServer?.onPlayerEnter(p)
	}
	init() {
		if (!GameUtils.isAICharacter(this.gameObject)) return
		if (this.id === 0) {
			console.error('npc config 出错 this.gameObject.guid:' + this.gameObject.gameObjectId)
			return;
		}

		if (SystemUtil.isClient()) {
			let id = setInterval(() => {
				if (ModuleService.getModule(NPCModule_C) && this.gameObject instanceof Character && this.gameObject.isDescriptionReady && this.gameObject.isReady) {
					this._npc = this.gameObject
					this.npcClient = new NPCClient(this);
					ModuleService.getModule(NPCModule_C).registerNPC(this);
					clearInterval(id);
				}
			}, 1000)
		} else {
			this._isServerNpc = true;
			setTimeout(() => {
				// console.log("jkljkljkljkljkljko")
				if (ModuleService.getModule(NPCModule_S) && this.gameObject instanceof Character && this.gameObject.isDescriptionReady && this.gameObject.isReady) {
					this._npc = this.gameObject
					this.npcServer = new NPCServer(this);
					ModuleService.getModule(NPCModule_S).registerNPC(this);
				}
			}, 2000);
		}
		this.useUpdate = true;
	}

	public changeNpcState(state: NPCState) {
		if (this.npcState == state) return
		this.npcState = state
		this.npcServer?.changeNpcState(state)
		this.npcClient?.changeNpcState(state)
	}

	onStateChange() {
		this.npcClient?.changeNpcState(this.npcState)
	}

	protected onUpdate(dt: number): void {
		this.npcServer?.onUpdate(dt)
		// this.npcClient?.onUpdate(dt)
	}
}