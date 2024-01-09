import { SpawnManager,SpawnInfo, } from '../../../../Modified027Editor/ModifiedSpawn';
import GameUtils from "../../../../utils/GameUtils";
import InteractMgr from "../../InteractMgr";
import { InteractModuleClient } from "../../InteractModuleClient";
import { InteractModuleServer } from "../../InteractModuleServer";
import InteractObject, { InteractiveHelper, InteractLogic_C, InteractLogic_S } from "../InteractObject";

/**触发模式 */
enum TriggerMode {
	/**共有模式*/
	Public = "0",//共有模式，第一个人进入触发器激活，最后一个人离开触发器关闭
	/**独立模式*/
	Private = "1"//独立模式：每个人进出触发器，单独计算激活和关闭
}
//交互物触发器-碰触交互
@Component
export default class Active_Trigger extends InteractObject {
	@mw.Property({ replicated: true, displayName: "工作模式", selectOptions: { "公共": TriggerMode.Public, "独立": TriggerMode.Private }, group: "属性" })
	public mode: TriggerMode = TriggerMode.Private;
	@mw.Property({ replicated: true, displayName: "退出按钮", group: "属性" })
	public needExitBtn: boolean = false;

	onStart() {
		this.init(Trigger_S, Trigger_C);
	}
}
//客户端
class Trigger_C extends InteractLogic_C<Active_Trigger> {
	private _trigger: mw.Trigger
	onStart(): void {
		this.init()
	}

	private async init() {
		let player = Player.localPlayer
		if (this.gameObject instanceof mw.Trigger) {
			this._trigger = this.gameObject as mw.Trigger;
		} else {
			this._trigger = await SpawnManager.asyncSpawn<mw.Trigger>({ guid: "Trigger" })
		}
		this._trigger.onEnter.add((go: mw.GameObject) => {
			if (GameUtils.isPlayerCharacter(go)) {
				ModuleService.getModule(InteractModuleClient).playerAction(this.info, player.playerId, true)
			}
		});
		this._trigger.onLeave.add((go: mw.GameObject) => {
			if (GameUtils.isPlayerCharacter(go)) {
				ModuleService.getModule(InteractModuleClient).playerAction(this.info, player.playerId, false)
			}
		});
	}

	public onPlayerAction(playerId: number, active: boolean, param: any) {
		if (active) {
			InteractiveHelper.addExitInteractiveListener(this.info.needExitBtn ? 1 : 2, () => {
				this.exit()
			});
		} else {
			InteractiveHelper.removeExitInteractiveListener();
		}
	}

	private exit = () => {
		InteractiveHelper.removeExitInteractiveListener();
		InteractMgr.instance.activeHandle(this.info, false)
	}
}
//服务端
class Trigger_S extends InteractLogic_S<Active_Trigger> {

	onStart(): void {

	}

	onPlayerAction(playerId: number, active: boolean, param: any): void {

	}
}

