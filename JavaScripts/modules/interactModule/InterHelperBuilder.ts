import { PlayerStateType } from "../../const/GameEnum";
import { GlobalModule } from "../../const/GlobalModule";
import { EventsName } from "../../const/GameEnum";
import MessageBox from "../../ui/commonUI/P_MessageBox";

import { BagModuleC } from "../bag/BagModuleC";
import { BagModuleS } from "../bag/BagModuleS";
import { GameModuleC } from "../gameModule/GameModuleC";

import { InteractiveHelper } from "./interactLogic/InteractObject";



@Decorator.autoExecute("init")
export class InterHelperBuild {
	static init() {
		InteractiveHelper.addExitInteractiveListener = this.addExitInteractiveListener;
		InteractiveHelper.removeExitInteractiveListener = this.removeExitInteractiveListener;
		InteractiveHelper.showSelectUI = this.showSelectUI;
		InteractiveHelper.hideSelectUI = this.hideSelectUI;
		InteractiveHelper.showQTEGame = this.showQTEGame;
		InteractiveHelper.hideQTEGame = this.hideQTEGame;
		InteractiveHelper.activeConditions = this.activeConditions;
		InteractiveHelper.onPlayerAction = this.onPlayerAction;
		InteractiveHelper.onPlayInteract = this.onPlayInteract;
		InteractiveHelper.playInteractionEnable = this.playInteractionEnable;
		InteractiveHelper.onPandoraAnalytics = this.onPandoraAnalytics;
	}
	/**
	 * 退出交互监听
	 * @param type 类型 1-按钮退出 2-行走和跳跃退出
	 * @param callback 
	 */
	public static addExitInteractiveListener(type: number, callback: () => void) {
		ModuleService.getModule(GameModuleC).addExitInteractiveListener(type, callback);
	}
	//取消退出交互监听
	public static removeExitInteractiveListener() {
		ModuleService.getModule(GameModuleC).removeExitInteractiveListener();
	}

	//显示选择UI(Client)
	public static showSelectUI(icoList: string[], selectCallback: (index: number) => void) {
		MessageBox.showTwoBtnMessage("提示", `选择UI，点Yes选择第0个,点No关闭~`, (res: boolean) => {
			selectCallback(res ? 0 : -1);
		});
	}
	//关闭选择UI(Client)
	public static hideSelectUI() {
		//关闭
	}
	/**
	 * 显示QTE小游戏(Client)
	 * @param gameName 游戏名
	 * @param callBack 返回成功失败的回调
	 */
	public static showQTEGame(gameName: string, callBack: (res: boolean) => void): void {
		MessageBox.showTwoBtnMessage("提示", `此处显示QTE游戏(${gameName})，是否假装成功？`, (res: boolean) => {
			callBack.call(res);
		});
	}
	public static hideQTEGame(gameName: string): void {

	}
	/**
	 * 外部激活条件判断(Server)
	 * @param param 自定义激活条件参数(就是SP_Active_Trigger喝SP_Active_UI中的“外部条件”)
	 * @returns 是否激活
	 */
	public static activeConditions(param: string): boolean {
		return true;
	}
	/**
	 * 外部联动调用(Server)
	 * @param playerId 玩家id
	 * @param active 是否激活
	 * @param activeParam 上个节点传递的参数
	 * @param param 自定义参数(外部关联参数)
	 */
	public static onPlayerAction(playerId: number, active: boolean, param: string): boolean {
		console.log(`外部关联 playerId=${playerId} active=${active}  param=${param} `);

		let arr = param.split(':');
		let type: string = arr[0];
		let value = arr[1];
		if (SystemUtil.isClient()) {
			switch (type) {
				case "studyHall": {
					Event.dispatchToLocal(EventsName.StudyHallSit, active)
				}
			}
		}

		return true
	}
	//设置一个玩家的交互状态(服务端)
	public static onPlayInteract(player: mw.Player | number, state: boolean) {
		if (state) {
			GlobalModule.MyPlayerS.State.setPlayerState(player, PlayerStateType.Interaction, true);
		} else {
			GlobalModule.MyPlayerS.State.setPlayerState(player, PlayerStateType.Interaction, false);
		}
	}
	//判断玩家当前的状态是否可以交互(服务器&客户端)
	public static playInteractionEnable(player: mw.Player | number): boolean {
		let id = null;
		if (typeof player === "number") {
			id = player;
		} else if (player) {
			id = player["getPlayerID"]();
		}
		if (id === null) return false;

		if (SystemUtil.isServer()) {
			return GlobalModule.MyPlayerS.State.playerIsBusy(player) || GlobalModule.MyPlayerS.Action.isInDoubleAction(id);
		} else {
			return GlobalModule.MyPlayerC.State.playerIsBusy() || GlobalModule.MyPlayerC.Action.isInDoubleAction(id);
		}
	}
	/**
	 * 潘多拉埋点(Client)
	 * @param guid gameObject的guid
	 * @param tag gameObject的tag
	 * @param active 开始结束交互(true-开始 false-结束)
	 * @param needExit 是否需要结束(如果为false，说明这个交互物没有退出)
	 */
	public static onPandoraAnalytics(guid: string, tag: string, active: boolean, needExit: boolean) {

	}
}