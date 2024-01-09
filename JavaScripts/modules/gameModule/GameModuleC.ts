import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
import { ModifiedCameraSystem, CameraModifid, } from '../../Modified027Editor/ModifiedCamera';
import { AddGMCommand } from "module_gm";
import { GameConfig } from "../../config/GameConfig";
import { EventsName } from "../../const/GameEnum";
import { GlobalData } from "../../const/GlobalData";
import { GlobalModule } from "../../const/GlobalModule";
import { CloseAllUI, ShowAllUI, UIHide, UIHideClass, UIManager } from "../../ExtensionType";
import { InputManager } from "../../InputManager";
import { ResManager } from "../../ResManager";
import { PlayerMgr } from "../../ts3/player/PlayerMgr";
import BackSchoolUI from "../../ui/BackSchoolUI";
import BackSelectUI from "../../ui/BackSelectUI";
import { CameraType } from "../../ui/cameraUI/CameraMainUI";
import Tips from "../../ui/commonUI/Tips";
import { SettingUI } from "../../ui/SettingUI";
import GameUtils from "../../utils/GameUtils";
import { BagModuleC } from "../bag/BagModuleC";
import { CameraModuleC } from "../camera/CameraModule";
import CG from "../cg/CG";
import GMBasePanelUI from "../gm/GMBasePanelUI";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";
import { P_NPCPanel } from "../npc/NPCPanel";
import { PropModuleC } from "../prop/PropModuleC";
import ShopModuleC from "../shop/ShopModuleC";
import SkillUI from "../skill/ui/SkillUI";
import { TaskModuleC } from "../taskModule/TaskModuleC";
import { GameModuleData } from "./GameData";
import { IGameModuleS } from "./GameModuleS";
import P_GameHUD, { UIType } from "./P_GameHUD";
import { CameraCG } from "module_cameracg";
import RainBowRaceMgr from "../../SceneScript/RainBowRace";
import GuideMC from "../guide/GuideMC";
import RentGoodUI from "../../ui/RentGoodUI";
import GravityCtrlMgr from "../gravity/GravityCtrlMgr";
import ActionMC from "../action/ActionMC";
import { TS3 } from "../../ts3/TS3";
import { BuffModuleC } from "../buff/BuffModuleC";
import { EBuffHostType } from "../buff/comon/BuffCommon";
const MGSEnvirguid = [
	'0AF4D2A2',//进大门
	'12B70ED3',//山脚下
	'1E5FA546'//山顶
]

const MgsEnvir = [
	'enter_hall',
	'enter_meetingroom',
	'enter_lounge1',
	'enter_lounge2',
	'enter_tunnel',
	'enter_tunnel',
	'enter_-2platform',
	'enter_obby',
	'enter_boss_gate',
	'enter_boss_room',
	'enter_gold_room',
	'enter_parking'
]
const MgsInfo = [
	'玩家进入大厅',
	'玩家进入会议室',
	'玩家进入休息室1',
	'玩家进入休息室2',
	'玩家进入长廊',
	'玩家进入长廊',
	'玩家进入-2层备战区',
	'玩家进入obby',
	'玩家到达boss门前',
	'玩家进入boss房间',
	'玩家进入隐藏金库',
	'玩家进入停车场'
]
const MgsIndex = [
	1,
	2,
	3,
	4,
	5,
	5,
	6,
	7,
	8,
	9,
	10,
	11
]

const MgsRoot = '350CCDC5'


class MgsTri {
	tri: mw.Trigger
	timer: number = 0
}
export interface IGameModuleC {
	net_playBattleBGM(): void;
	net_playHallBGM(): void;
}
//客户端
export class GameModuleC extends ModuleC<IGameModuleS, GameModuleData> implements IGameModuleC {
	public hudPanel: P_GameHUD;
	public isInteractive: boolean;
	public curBgmID: number = 13;

	private btnExitInteractiveCallback: () => void;
	private moveExitInteractiveCallback: () => void;
	private jumpExitInteractiveCallback: () => void;
	private _returnSchoolTime: number = 0;

	private _reLiveRoot: mw.GameObject = null
	onStart() {
		// this.gameJumpUI = UICreate(TravelWindowUI);
		this.hudPanel = mw.UIService.create(P_GameHUD);
		//this.dancePanel = mw.UIService.create(P_DanceUI);
		// this.cameraEnterPanel = mw.UIService.create(P_CameraEnter);
		// this.resetClothPanel = mw.UIService.create(P_ChangeCloth);/
		this.hudPanel.clickResetClothBtnAC.add(() => {
			MGSMsgHome.setBtnClick("cloth_btn");
			GlobalModule.MyPlayerC.Cloth.resetPlayerCloth();
		});
		this.hudPanel.onJump.add(() => {
			if (!this.localPlayer.character.isJumping) {
				Event.dispatchToLocal(EventsName.PLAYER_JUMP);
			}
			this.localPlayer.character.jump();
			GlobalModule.MyPlayerC.Action.cleanStance();

			const curSel = Number(ModuleService.getModule(BagModuleC).curEquip)
			if (!(Math.floor(curSel / 10) >= 30 && Math.floor(curSel / 10) < 40))
				return
			const elem = GameConfig.Item.getElement(curSel)
			if (elem && elem.Skills && elem.Skills.length >= 2) {
				const skillElem = GameConfig.SkillLevel.getElement(elem.Skills[1])
				if (skillElem && skillElem.Param1) {
					const param = skillElem.Param1.split("|")
					ModuleService.getModule(ActionMC).playAction(Number(param[0]))
				}
			}
		}, this);
		//身份牌
		this.hudPanel.mIdCard_btn.onClicked.add(() => {
			UIManager.show(SettingUI);
		});

		/**点击退出交互物按钮 */
		this.hudPanel.onExitInteractive.add(() => {
			if (this.btnExitInteractiveCallback != null) {
				this.btnExitInteractiveCallback();
				this.btnExitInteractiveCallback = null;
			}
		}, this);
		/**摇杆移动事件 */
		this.hudPanel.onJoyStickInput.add((v: mw.Vector2) => {
			if (this.moveExitInteractiveCallback != null) {
				this.moveExitInteractiveCallback();
				this.moveExitInteractiveCallback = null;
			}
		});
		this.hudPanel.onJump.add(() => {
			if (this.jumpExitInteractiveCallback != null) {
				this.jumpExitInteractiveCallback();
				this.jumpExitInteractiveCallback = null;
			}
		});


		let flag2: boolean = false

		InputManager.instance.onKeyDown(mw.Keys.F2).add(() => {
			UIManager.setAllMiddleAndBottomPanelVisible(flag2);
			flag2 = !flag2
		})
		Event.addLocalListener("PlayButtonClick", () => {
			SoundService.stopSound("136199");
			SoundService.playSound("136199");
		});

		// Event.addLocalListener(EventsName.PlayerBattle, (bool: boolean) => {
		// 	if (bool) {
		// 		this.net_playBattleBGM()
		// 	} else {
		// 		this.net_playHallBGM()
		// 	}
		// });

	}

	//进入场景
	onEnterScene(sceneType: number): void {
		const char = Player.localPlayer.character

		CG.instance.trainDeparture(() => {
			this._returnSchoolTime = GlobalData.returnSchoolTime;
			// console.log("jkljkljkljkl", char.maxWalkSpeed, char.maxAcceleration, char.maxFlySpeed)
			GlobalData.globalRot = char.worldTransform.rotation.clone()
			char.displayName = ''
			char.setVisibility(PropertyStatus.On)
			let selfName: string = Player.localPlayer.character.displayName;
			UIManager.showUI(this.hudPanel, mw.UILayerBottom, selfName);
			this.hudPanel.clickEnterCameraAC.add(this.showCameraPanel.bind(this));
			if (GlobalData.isOpenGM) {
				this.addGM();
				new GMBasePanelUI().show();
			}
			this.hudPanel.mPulloff_btn.onClicked.add(() => {
				MGSMsgHome.uploadMGS('ts_action_click', '玩家点击【卡住点我】按钮', { button: 'return_btn' })
				this.resetPos();
			});

			//3Dui多语言
			this.uiLanguage();
			let npc = mw.UIService.create(P_NPCPanel);
			UIManager.showUI(npc, mw.UILayerTop);
			this.loginChoose();
			this.net_playHallBGM();
			// setTimeout(() => {
			// 	ModuleService.getModule(TaskModuleC).req_refreshATask()
			// }, 2000)
			ModuleService.getModule(CameraModuleC).resetCameraAttach()
			Player.asyncGetLocalPlayer().then(p => {
				// await CameraCG.instance.init()
				this.resetPos();
				// this.resetPos()
				// if (GlobalData.isDragon)
				// setTimeout(() => {
				// 	ModuleService.getModule(GuideMC).onGuideEnter()
				// }, 5000);
				// else
				// 	ModuleService.getModule(TaskModuleC).req_refreshATask()
			})
		})

		// GameObject.asyncFindGameObjectById(MgsRoot).then(o => {
		// 	if (!o) return
		// 	const chilld = o.getChildren()
		// 	for (let i = 0; i < chilld.length; i++) {
		// 		let tmpTri = new MgsTri()
		// 		const tri = chilld[i] as mw.Trigger
		// 		const log = MgsEnvir[i]
		// 		const info = MgsInfo[i]
		// 		const index = MgsIndex[i]
		// 		tmpTri.tri = tri
		// 		tri.onEnter.add((p) => {
		// 			if (GameUtils.isPlayerCharacter(p)) {
		// 				tmpTri.timer = TimeUtil.time()
		// 				MGSMsgHome.uploadMGS('ts_game_result', info, { record: log })
		// 			}
		// 		})

		// 		tri.onLeave.add((p) => {
		// 			if (GameUtils.isPlayerCharacter(p)) {
		// 				MGSMsgHome.uploadMGS('ts_area_leave', "停留时长", { area_id: index, time: (TimeUtil.time() - tmpTri.timer) })
		// 			}
		// 		})
		// 	}

		// RainBowRaceMgr.instance.init()
		UIManager.show(RentGoodUI)
	}

	private uiLanguage() {
		let allUI = GameConfig.Global.getElement(59).Value4; //所有3dui
		allUI.forEach(async item => {
			let top = (await ResManager.instance.findGameObjectByGuid(item)) as mw.UIWidget;
			if (!top) {
				console.log("guan log uiLanguage top:" + top + ",item:" + item);
				return;
			}
			let uiRoot = top.getTargetUIWidget().rootContent;
			for (let i = 0; i < uiRoot.getChildrenCount(); i++) {
				let item = uiRoot.getChildAt(i);
				if (!(item instanceof mw.TextBlock)) {
					continue;
				}
				let ui = item as mw.TextBlock;
				let key: string = ui.text;
				if (key) {
					let data = GameUtils.getLanguage(key);
					if (data) {
						ui.text = data.info;
						if (data.size > 0) {
							ui.fontSize = data.size;
						}
					}
				}
			}
		});
	}

	firstIn: boolean = false

	public resetPos() {
		if (this.btnExitInteractiveCallback != null) {
			this.btnExitInteractiveCallback();
			this.btnExitInteractiveCallback = null;
		}
		GlobalModule.MyPlayerC.Action.off();
		// setTimeout(() => {
		let pos: Vector = GlobalData.globalPos
		let rot: Rotation = GlobalData.globalRot
		let distance = Vector.squaredDistance(PlayerMgr.Inst.mainPos, pos)

		this._reLiveRoot?.getChildren().forEach(e => {
			const tmpDistance = Vector.squaredDistance(PlayerMgr.Inst.mainPos, e.worldTransform.position)
			if (distance > tmpDistance) {
				distance = tmpDistance
				pos = e.worldTransform.position.clone()
			}
		})
		if (!this.firstIn) {
			this.firstIn = true
			setTimeout(() => {
				ModuleService.getModule(BuffModuleC).reqAddSBuff('', TS3.playerMgr.mainUserId, 9, EBuffHostType.Player)
			}, 10000);
		} else {
			setTimeout(() => {
				ModuleService.getModule(BuffModuleC).reqAddSBuff('', TS3.playerMgr.mainUserId, 9, EBuffHostType.Player)
			}, 3000);
		}
		GlobalData.inSpaceStation = true
		GravityCtrlMgr.instance.simulate(false)
		Event.dispatchToLocal('ReturnBtn')
		this.server.net_ResetPos(pos, rot);
		// }, 500);
	}

	public async changeGame(targetGameId: string) {
		await this.server.net_ResetPos(GlobalData.globalPos, GlobalData.globalRot);
		await mw.TimeUtil.delaySecond(1);
		mw.RouteService
			.requestGameId(targetGameId)
			.then((mwGameId: string) => {
				console.error("eason===  entergameId  " + mwGameId);
				mw.RouteService.enterNewGame(mwGameId);
			});
	}

	public stopReturnTime() {
		this._returnSchoolTime = 0
		this.hudPanel.schoolTime.visibility = mw.SlateVisibility.Hidden
	}

	protected onUpdate(dt: number): void {
		// if (this._returnSchoolTime > 0) {
		// 	if (Math.floor(this._returnSchoolTime) == 3) {
		// 		this.stopReturnTime()
		// 		CloseAllUI()
		// 		UIManager.show(BackSchoolUI, 4)
		// 	} else {
		// 		this._returnSchoolTime -= dt;
		// 		this._returnSchoolTime = Math.max(0, this._returnSchoolTime)
		// 		this.hudPanel.setSchoolTime(this._returnSchoolTime)
		// 	}
		// }
	}

	/**设置玩家传送，玩家旋转，相机角度 */
	public playertrasnformRotSysRot(pos: mw.Vector, rot: mw.Rotation, sysRot: mw.Rotation) {
		const character = this.localPlayer.character;
		if (pos) {
			character.worldTransform.position = pos.clone();
		}
		if (rot) {
			character.worldTransform.rotation = rot.clone();
		}
		if (sysRot) {
			ModifiedCameraSystem.setOverrideCameraRotation(sysRot);
			setTimeout(() => {
				ModifiedCameraSystem.resetOverrideCameraRotation();
			}, 32);
		}
	}

	private addGM() {
		let cgActive = false;
		AddGMCommand("开启CG编辑器", (player: mw.Player, value: string) => {
			cgActive = !cgActive
			if (cgActive) {
				CloseAllUI()
				CameraCG.instance.openEditor()
			} else {
				ShowAllUI()
				CameraCG.instance.closeEditor()
			}
		});

		AddGMCommand("一键关闭所有怪物行动", (player: mw.Player, value: string) => {
			Event.dispatchToServer("CloshAllMonset")
		});

		let isActive = true;
		AddGMCommand("传送到目的地(输入坐标|||)", (player: mw.Player, value: string) => {
			const v = value.split("|").map(v => Number(v));
			const x = v[0] ? v[0] : 4600.500;
			const y = v[1] ? v[1] : 1093.990;
			const z = v[2] ? v[2] : 13343.300;
			const character = Player.localPlayer.character;
			character.worldTransform.position = new Vector(x, y, z);
		});
		AddGMCommand("一键关闭所有HUDUI", (player: mw.Player, value: string) => {
			isActive = !isActive
			this.hudPanel.setAllUIVisible(isActive)
		});
		AddGMCommand("加钱1豌豆2金币", (player: mw.Player, value: string) => {
			const v = value.split(",").map(v => Number(v));
			const id = v[0];
			const count = v[1] ? v[1] : 1;
			id && ModuleService.getModule(ShopModuleC).req_addCoin(id, count, false)
		});
		AddGMCommand("添加造物物品", (player: mw.Player, value: string) => {
			const v = value.split(",").map(v => Number(v));
			const id = v[0];
			const count = v[1] ? v[1] : 1;
			id && ModuleService.getModule(BagModuleC).addCreationItem(id, count);
		});
		AddGMCommand("添加指定物品", (player: mw.Player, value: string) => {
			ModuleService.getModule(BagModuleC).addItem(Number(value));
		});
		AddGMCommand("添加所有物品", (player: mw.Player, value: string) => {
			const allItemLst = GameConfig.Item.getAllElement();
			for (const item of allItemLst) {
				if ([1, 5, 6].includes(item.ItemType)) ModuleService.getModule(BagModuleC).addItem(item.ID, 1, false);
			}
		});

	}

	/**
	 * 监听退出交互物的操作
	 * @param type 类型 1-按钮退出 2-行走和跳跃退出 3-跳跃退出
	 * @param Callback 退出的回调
	 */
	public addExitInteractiveListener(type: number, Callback: () => void) {
		if (type == 1) {
			this.hudPanel.showExitInteractiveBtn(true);
			this.btnExitInteractiveCallback = Callback;
			this.moveExitInteractiveCallback = null;
			this.jumpExitInteractiveCallback = null;
		} else if (type == 2) {
			this.hudPanel.showExitInteractiveBtn(false);
			this.moveExitInteractiveCallback = Callback;
			this.jumpExitInteractiveCallback = Callback;
			this.btnExitInteractiveCallback = null;
		} else if (type == 3) {
			this.hudPanel.showExitInteractiveBtn(false);
			this.jumpExitInteractiveCallback = Callback;
			this.moveExitInteractiveCallback = null;
			this.btnExitInteractiveCallback = null;
		}
	}
	public removeExitInteractiveListener() {
		this.btnExitInteractiveCallback = null;
		this.moveExitInteractiveCallback = null;
		this.jumpExitInteractiveCallback = null;
		this.hudPanel.showExitInteractiveBtn(false);
	}
	public quitInterval() {
		if (this.btnExitInteractiveCallback != null) {
			this.btnExitInteractiveCallback();
			this.btnExitInteractiveCallback = null;
		}
	}
	/**
	 * 设置相机滑动区域可用性
	 * @param bool
	 */
	public setTouchPadEnabled(bool: boolean): void {
		this.hudPanel.setTouchPadEnabled(bool);
	}

	public setUIstate(bool: boolean) {
		if (bool) {
			GlobalModule.MyPlayerC.Action.changePanelState(true);
			ModuleService.getModule(PropModuleC).setUIShow();
			ModuleService.getModule(BagModuleC).setHubVis(true);
			UIManager.show(SkillUI);
			this.hudPanel.setUIVisable(true, UIType.Bag, UIType.Pulloff,
				UIType.Return, UIType.Camera, UIType.ClothReset, UIType.BossHp, UIType.Card, UIType.Expression);
			if (!this.hudPanel.visible) UIManager.showUI(this.hudPanel);
		} else {
			GlobalModule.MyPlayerC.Action.changePanelState(false);
			ModuleService.getModule(PropModuleC).setUIHide();
			ModuleService.getModule(BagModuleC).setHubVis(false);
			UIManager.hide(SkillUI);
			this.hudPanel.setUIVisable(false, UIType.Bag, UIType.Pulloff,
				UIType.Return, UIType.Camera, UIType.ClothReset, UIType.BossHp, UIType.Card, UIType.Expression);
		}
	}

	/**相机功能--修改主页UI显隐状态 */
	public changeHUDState(cameraType: CameraType) {
		if (cameraType == CameraType.Camera_FP) {
			this.hudPanel.camera_FP(false);
			ModuleService.getModule(BagModuleC).setHubVis(false);
			GlobalModule.MyPlayerC.Action.changePanelState(false);
			ModuleService.getModule(PropModuleC).setUIHide();
			ModuleService.getModule(TaskModuleC).setGuidVisable(false)
			UIManager.hide(SkillUI);
			this.hudPanel.setUIVisable(false, UIType.Bag, UIType.Return, UIType.ClothReset, UIType.ClothReset, UIType.Task);
		} else if (cameraType == CameraType.Null) {
			this.hudPanel.camera_FP(true);
			UIManager.show(SkillUI);
			ModuleService.getModule(TaskModuleC).setGuidVisable(true)
			ModuleService.getModule(BagModuleC).setHubVis(true);
			GlobalModule.MyPlayerC.Action.changePanelState(true);
			ModuleService.getModule(PropModuleC).setUIShow();
			this.hudPanel.setUIVisable(true, UIType.Camera, UIType.Bag, UIType.Return, UIType.ClothReset);
		} else {
			this.hudPanel.camera_FP(true);
			this.hudPanel.camera_Other(false);
			ModuleService.getModule(TaskModuleC).setGuidVisable(false)
			ModuleService.getModule(BagModuleC).setHubVis(false);
			GlobalModule.MyPlayerC.Action.changePanelState(false);
			ModuleService.getModule(PropModuleC).setUIHide();
			UIManager.hide(SkillUI);
			this.hudPanel.setUIVisable(false, UIType.Bag, UIType.Return, UIType.ClothReset);
		}
	}

	public showCameraPanel(isOutCall: boolean = false) {
		ModuleService.getModule(BagModuleC).setHubVis(false);
		ModuleService.getModule(CameraModuleC).showCamera(isOutCall);
		// UIHide(this.cameraEnterPanel)
		this.hudPanel.setUIVisable(false, UIType.Camera);
		MGSMsgHome.setBtnClick("open");
		MGSMsgHome.setBtnClick("camera_btn");
	}

	/**ui游戏时隐藏 */
	public showCameraEnterBag(isVis: boolean) {
		ModuleService.getModule(BagModuleC).setHubVis(isVis);
		// isVis ? UIManager.showUI(this.cameraEnterPanel) : UIHide(this.cameraEnterPanel);
		this.hudPanel.setUIVisable(isVis, UIType.Camera);
		this.changeJoyStickState(isVis);
	}

	public IsTakePhotos(is: boolean) {
		this.hudPanel.changeRightDownCanvasState(is);
	}

	public changeJoyStickState(is: boolean) {
		this.hudPanel.changeJoyStickState(is);
	}

	public propShowCameraPanel(cameraType: CameraType) {
		this.showCameraPanel(true);
		// UIHide(this.cameraEnterPanel)
		this.hudPanel.setUIVisable(false, UIType.Camera);
		ModuleService.getModule(CameraModuleC).switchCamera(cameraType);
	}
	public getCameraUI() {
		return this.hudPanel.getCameraUI();
	}

	/**
	 * 登录设置身份牌
	 * @param occupation
	 * @returns
	 */
	private loginChoose() {
		let nickName = mw.AccountService.getNickName();
		this.server.net_PlayerLogin(!nickName ? this.localPlayer.character.displayName : nickName);
	}

	/**播放大厅音乐 */
	public net_playHallBGM() {
		if (this.curBgmID == 101) return
		let ID = 101;
		GameUtils.playSoundOrBgm(ID);
		this.curBgmID = ID;
		const cs = Camera.currentCamera
		// cs.preset = (mw.CameraPreset.Default, false)
		// ModuleService.getModule(CameraModuleC).facadPlayerRotation(false)
		// cs.fov = 120
	}
	public net_playBattleBGM() {
		if (this.curBgmID == 92) return
		let ID = 92;
		GameUtils.playSoundOrBgm(ID);
		this.curBgmID = ID;
		const cs = Camera.currentCamera
		// cs.preset = (mw.CameraPreset.TPSOverShoulderAngle, false)

		// cs.localTransform.position = new Vector(80, 80, 50)
		// cs.fov = 120//30
		// const bagModulec = ModuleService.getModule(BagModuleC);
		// if (bagModulec.getItem(11101)) {
		// 	bagModulec.addShortcutBarItem("11101", true)
		// }
	}

}


