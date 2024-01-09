import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';


import { UIManager } from "../../ExtensionType";
import { GameConfig } from "../../config/GameConfig";
import { INPCConfigElement } from "../../config/NPCConfig";
import GameUtils from "../../utils/GameUtils";
import SP_NPC, { NPCState, NPC_Events } from "./NPC";
import { NPCHead } from "./NPCHead";
import { P_NPCPanel } from "./NPCPanel";
import { EmTaskState, EventsName } from "../../const/GameEnum";
import { TaskModuleC } from "../taskModule/TaskModuleC";
import NPCModule_C from "./NPCModule_C";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";
import ShopModuleC from "../shop/ShopModuleC";


export class NPCClient {
	public npcID: number
	/**npc对象 */
	public npcObj: mw.Character = null;
	/**npc配置 */
	private config: INPCConfigElement = null;
	/**npc专属guid */
	private npcGuid = "";
	/**npc名字 */
	public npcName: string = ''
	/**头顶UI */
	private head: NPCHead = null;
	/**触发器 */
	public trigger: mw.Trigger = null;
	/**默认对话cd */
	private cd = 0;
	/**自己 */
	private self: mw.Player = null;
	private scrpit: SP_NPC;
	/**这个NPC是否正在和玩家交互 */
	private isInteractive: boolean = false;

	/**npc最初始的位置 */
	private originPos: mw.Vector
	private originRot: mw.Rotation
	/**NPC白天的动画 */
	private dayAnimation: mw.Animation;
	/**夜晚动作 */
	private nightAnimation: mw.Animation;
	/**npc对话状态  0正常 1跟随*/
	private talkState: number = 0
	public npcState: NPCState = NPCState.Talk
	public lastState: NPCState = NPCState.None
	private _turnTimer = null
	/**寻路inteval */
	private _followFindInteval = null
	private _inteval = null
	/**停留时间太久之后自动回家 */
	private _blockTime: number = 0
	private _lastPos: Vector = Vector.zero

	public constructor(script: SP_NPC) {
		this.scrpit = script;
		this.init()
	}

	/**
	 * 初始化
	 * @param triggerGuid 
	 * @param npcGuid 
	 */
	public async init(): Promise<void> {
		this.npcObj = this.scrpit.npc;
		this.npcID = this.scrpit.id
		this.npcGuid = this.npcObj.gameObjectId;
		this.config = GameConfig.NPCConfig.getElement(this.npcID);
		this.originPos = this.npcObj.worldTransform.position.clone();
		this.originRot = this.npcObj.worldTransform.rotation.clone();
		this.npcObj.maxWalkSpeed = 360;
		this.npcObj.rotateRate = 300
		this.npcObj.movementDirection = mw.MovementDirection.AxisDirection;

		Event.addLocalListener(NPC_Events.NPC_OnClickItem + this.npcID, this.onNPCClick.bind(this));
		Event.addLocalListener(NPC_Events.NPC_AsyncPlayeAnim, this.req_asyncAnim.bind(this));
		Event.addServerListener(NPC_Events.NPC_AsyncState + this.npcID, this.changeNpcState.bind(this));
		Event.addServerListener(NPC_Events.NPC_AsyncPlayeAnim + this.npcID, this.on_asyncAnim.bind(this));
		let ui = this.npcObj.overheadUI;
		this.head = UIManager.create(NPCHead);
		ui.setTargetUIWidget(this.head.uiWidgetBase)
		ui.drawSize = new mw.Vector2(500, 200);
		ui.headUIMaxVisibleDistance = 2500;
		ui.pivot = new mw.Vector2(0.5, 0.5);
		ui.parent = null
		this.npcObj.attachToSlot(ui, mw.HumanoidSlotType.Head)
		ui.localTransform.position = (new Vector(0, 0, 50))
		this.npcName = GameUtils.getTxt(this.config.NpcName)
		this.head.setName(this.npcName);
		GameObject.asyncFindGameObjectById(this.scrpit.triggerGuid).then(async (obj: mw.GameObject) => {
			if (!obj) {
				obj = await GameObject.asyncFindGameObjectById(this.scrpit.triggerGuid);
				console.error("error:NpcClient obj未找到", this.npcID)
			} else {
				this.trigger = obj as mw.Trigger;
				this.trigger.onEnter.add(this.onTriggerEnter.bind(this));
				this.trigger.onLeave.add(this.onTriggerExit.bind(this));
			}
		});

		Player.asyncGetLocalPlayer().then((player: mw.Player) => {
			this.self = player;
			setInterval(this.updateDis.bind(this), 1000);
		});


		if (this.config.attitude) {
			PlayerManagerExtesion.changeStanceExtesion(this.npcObj, this.config.attitude);
		}

		if (this.config.action) {
			this.config.action.forEach(async action => {
				await GameUtils.downAsset(action)
			})
			await GameUtils.downAsset('169539')
			setTimeout(() => {//延迟 不然播不了
				this.setDayAni(true);
			}, 8 * 1000);
		}

		if (!this._followFindInteval) {
			this._followFindInteval = setInterval(() => {

				let isChange: boolean = false
				if (this.npcState == NPCState.Follow || this.npcState == NPCState.Back) {
					if (this.lastState != this.npcState) {
						this.lastState = this.npcState
						// this._runAnim = PlayerManagerExtesion.loadAnimationExtesion(this.npcObj, '52968', false)
						// if (this._runAnim) {
						// 	this._runAnim.loop = 0
						// 	this._runAnim.play()
						// }
						isChange = true
					}
				}

				if (this.npcState == NPCState.Follow) {
					if (isChange) {
						if (this._inteval) {
							clearInterval(this._inteval)
							this._inteval = null
						}
						this._inteval = setInterval(() => {
							const playerPos = Player.localPlayer.character.worldTransform.position;
							const npcPos = this.npcObj.worldTransform.position;
							if (Vector.squaredDistance(playerPos, npcPos) > 220 * 220) {
								if (Vector.squaredDistance(playerPos, npcPos) > 2500 * 2500) {
									this.npcObj.worldTransform.position = new Vector(playerPos.x + MathUtil.randomInt(-50, 50), playerPos.y + MathUtil.randomInt(-50, 50), playerPos.z + MathUtil.randomInt(0, 50))
									let dir = playerPos.subtract(this.npcObj.worldTransform.position.clone()).normalized
									this.npcObj.worldTransform.rotation = new Rotation(this.npcObj.worldTransform.rotation.x, this.npcObj.worldTransform.rotation.y, dir.z)
								} else {
									let dir = playerPos.subtract(npcPos).normalized
									this.npcObj.addMovement(dir.multiply(8))
								}
							}
						}, 10)
					}
					// Navigation.navigateTo(this.npcObj, pos, 120, null, () => {
					// 	console.error("npc寻路失败")
					// });
				} else if (this.npcState == NPCState.Back) {
					this.setTalkState(0)
					if (isChange) {
						if (this._inteval) {
							clearInterval(this._inteval)
							this._inteval = null
						}
						this._inteval = setInterval(() => {
							const npcPos = this.npcObj.worldTransform.position;
							if (Vector.squaredDistance(npcPos, this.originPos) > 120 * 120) {
								const dir = this.originPos.clone().subtract(npcPos).normalized
								this.npcObj.addMovement(dir.multiply(8))
							}
							else {
								if (this._inteval) {
									clearInterval(this._inteval)
									this._inteval = null
								}
								this.resetPosAndRot()
								this.setHeadTaskEff(true)
								this.setTalkState(0)
								this.setDayAni(true)
								this.changeNpcState(NPCState.Talk)
							}
						}, 10)
					}

					// Navigation.navigateTo(this.npcObj, this.originPos, 20, () => {
					// }, null)

					if (this._lastPos != Vector.zero && Vector.squaredDistance(this.npcObj.worldTransform.position, this._lastPos) <= 50) {
						this._blockTime += 1
						if (this._blockTime >= 3) {
							if (this._inteval) {
								clearInterval(this._inteval)
								this._inteval = null
							}

							this._blockTime = 0
							this._lastPos = Vector.zero
							this.resetPosAndRot()
							this.setHeadTaskEff(true)
							this.setTalkState(0)
							this.setDayAni(true)
							this.changeNpcState(NPCState.Talk)
						}
					}
					this._lastPos = this.npcObj.worldTransform.position.clone()
				}
			}, 1200)
		}
	}

	/**改变对话状态 */
	public setTalkState(state: number) {
		if (state == 0) {
			//0 代表回到最初对话
			const curTask = ModuleService.getModule(TaskModuleC).getCurTaskData()
			let state = 0
			if (curTask) {
				const elem = GameConfig.Task.getElement(curTask.taskConfig)
				if (curTask.taskState == EmTaskState.NoAccept || curTask.taskState == EmTaskState.Doing)
					state = elem.accTalkState
				else if (curTask.taskState == EmTaskState.Finish)
					state = elem.finishTalkState
			}
			this.talkState = state
		} else {
			this.talkState = state
		}
	}

	private setDayAni(bool: boolean) {
		if (!this.config.action) return
		if (bool) {
			if (this.config.aniRoundTime) {
				const actionId = this.config.action[MathUtil.randomInt(0, this.config.action.length)]
				this.playAni(this.config.aniRoundTime[0] == 0, actionId)
			}
		}
		else {
			if (this.dayAnimation) this.dayAnimation.stop()
			if (this.nightAnimation) this.nightAnimation.stop()
			clearTimeout(this.aniTimer)
			this.aniTimer = null
		}
	}

	private aniTimer
	private async playAni(loop: boolean, actionID: string) {
		if (this.npcState == NPCState.InterRact) return
		if (!AssetUtil.assetLoaded(actionID)) {
			await AssetUtil.asyncDownloadAsset(actionID);
		}
		// console.log("npc动画", actionID)
		this.dayAnimation = PlayerManagerExtesion.loadAnimationExtesion(this.npcObj, actionID, this.scrpit.isServerNpc);
		if (!loop) {
			let time = mw.MathUtil.randomFloat(this.config.aniRoundTime[0], this.config.aniRoundTime[1])
			this.aniTimer = setTimeout(() => {
				this.playAni(false, actionID)
			}, time * 1000);
		}
		this.dayAnimation.speed = this.config.time;
		this.dayAnimation.loop = loop ? 0 : 1
		this.dayAnimation.play();
	}

	private clicknumber: number = 0;
	public clickIndex: number = 0
	private firstClick: boolean = false
	/**
	 * 点击npc事件
	 * @param id 
	 */
	public onNPCClick(id: number): void {
		this.clicknumber = 0;
		this.clickIndex = 0;
		let config = GameConfig.TalkEvent.getElement(id);
		if (config.state == 2) {
			this.onNPCFollow()
			MGSMsgHome.uploadMGS('ts_action_click', 'NPC跟随的次数', { button: 'npc_follow' })
			P_NPCPanel.instance.hideEvents()
			// Event.dispatchToServer(NPC_Events.NPC_On + this.npcGuid);
			return;
		} else if (config.state == 3) {
			P_NPCPanel.instance.hideEvents()
			Event.dispatchToLocal(EventsName.UnFollowNpc, this.npcID)
			return
		}

		//MGSMsgHome.setNpc(id, this.config.ID);
		if (config.ActionGuid) {
			PlayerManagerExtesion.rpcPlayAnimation(this.npcObj, config.ActionGuid, 1, config.Actiontime);
			let ani = PlayerManagerExtesion.loadAnimationExtesion(this.npcObj, config.ActionGuid, this.scrpit.isServerNpc)
			ani.speed = config.Actiontime
			ani.play();
		}
		if (config.EffGuid) {
			GeneralManager.rpcPlayEffectAtLocation(config.EffGuid, this.npcObj.worldTransform.position.add(config.Pos));
		}
		if (config.soundGuid) {
			mw.SoundService.playSound(config.soundGuid, 1, config.Scale);
		}
		if (config.params) {
			this.extralParamsHelper(config.params)
		}
		if (config.TEXT) {
			const curTask = ModuleService.getModule(TaskModuleC).getCurTaskData()
			const taskElem = GameConfig.Task.getElement(curTask.taskConfig).clickTalkState
			if (taskElem) {
				taskElem.forEach(e => {
					if (id == e[0]) {
						this.clickIndex = e[1]
					}
				})
			}
			this.clicknumber = config.TEXT[this.clickIndex];
		}

		P_NPCPanel.instance.showNpcTalk(this.clicknumber, false, config);
		// const char = Player.localPlayer.character
		// ModuleService.getModule(DressModuleC).moveCameraToBody(char, CamearScene.NpcTalk)
		// const loc = char.worldTransform.position.clone().subtract(this.originPos)
		// const tmpVec = loc.multiply(5)
		if (!this.firstClick) {
			Event.dispatchToLocal(EventsName.ShowNpcInterect, -1);
			const character = Player.localPlayer.character;
			character.movementEnabled = character.jumpEnabled = true
			this.firstClick = true
		}
	}


	public req_asyncAnim(animGuid: string) {
		Event.dispatchToServer(NPC_Events.NPC_AsyncPlayeAnim + this.npcID, animGuid)
	}


	asyncAnim: mw.Animation
	public on_asyncAnim(animGuid: string) {
		this.dayAnimation?.stop()
		this.asyncAnim = PlayerManagerExtesion.loadAnimationExtesion(this.npcObj, animGuid, true);
		this.asyncAnim.speed = this.config.time;
		this.asyncAnim.loop = 0;
		this.asyncAnim.play();
	}

	/**
	 * npc跟随玩家
	 * @param player 
	 */
	private onNPCFollow(): void {
		ModuleService.getModule(NPCModule_C).registFollowNPC(this.npcID)
		this.setTalkState(1)
		this.setDayAni(false)
		this.changeNpcState(NPCState.Follow)
		this.setHeadTaskEff(false)
		this.head.setName("跟随中")
		Event.dispatchToLocal(EventsName.ShowNpcInterect, -1);

	}

	/**停止跟随玩家 */
	public onNPCFollowOff(): void {
		this.changeNpcState(NPCState.Back)
		this.head.setName(this.npcName)
	}



	trapInteval = null
	/**切换Npc状态 */
	public changeNpcState(state: NPCState) {
		if (this.npcState == state) return
		this.npcState = state;
		console.log("changeNpcStateC", this.npcState)
		if (state == NPCState.Kidnap) {
			this.playAni(true, "14534")
			if (!this.trapInteval) {
				this.trapInteval = setInterval(() => {
					this.showHeadMessage('请救救我')
				}, 5 * 1000)
			}
		} else if (state == NPCState.Rescue) {

		}
	}

	firstClieckShop: boolean = false
	extralParamsHelper(params: number) {
		switch (params) {
			case 1:
				if (!this.firstClieckShop) {
					this.firstClieckShop = true
					MGSMsgHome.uploadMGS('ts_action_click', '玩家点击“查看商店”按钮时', { button: 'check_shop' })
				}
				ModuleService.getModule(ShopModuleC).showShopPanle()  //参数1 打开夜晚商店UI
				break;
			case 2:
				break;
			case 3:
				break;
			default:
				break;
		}
	}


	//===================================被别的地方拿去使用或者归还============================================
	public interectAnim: mw.Animation
	onUse() {
		this.interectAnim = PlayerManagerExtesion.loadAnimationExtesion(this.npcObj, '169539', false)
		if (this.interectAnim) {
			this.interectAnim.loop = 0
			this.interectAnim.play()
		}
		this.changeNpcState(NPCState.InterRact)
		this.lastState = NPCState.InterRact
		this.npcObj.movementEnabled = this.npcObj.jumpEnabled = false
		this.npcObj.setCollision(mw.CollisionStatus.Off);
		this.setHeadTaskEff(false)
		ModuleService.getModule(TaskModuleC).setGuidVisable(false)
		P_NPCPanel.instance.hideEvents()
		this.npcObj.overheadUI.setVisibility(mw.PropertyStatus.Off)
		this.setDayAni(false)
	}

	onReturn() {
		if (this.npcState != NPCState.InterRact) return
		// this.resetPosAndRot()
		this.npcObj.setCollision(mw.CollisionStatus.On);
		this.npcObj.switchToFlying();
		this.npcObj.switchToWalking();
		this.npcObj.movementEnabled = this.npcObj.jumpEnabled = true
		setTimeout(() => {
			this.changeNpcState(NPCState.Back)
		}, 1000);
		// this.lastState = NPCStateC.Talk
		// this.setHeadTaskEff(true)
		this.interectAnim?.stop()
		ModuleService.getModule(TaskModuleC).setGuidVisable(true)
		this.npcObj.overheadUI.setVisibility(mw.PropertyStatus.On)
		// this.setDayAni(true)
		Event.dispatchToLocal(EventsName.ShowNpcInterect, -1);
	}

	resetPosAndRot() {
		this.npcObj.worldTransform.position = this.originPos.clone()
		this.npcObj.worldTransform.rotation = this.originRot.clone()
	}

	rotInteval = null

	/**
	 * npc做转向操作
	 * @param v3 
	 * @param callBack 
	 */
	onTurn(v3: mw.Vector, callBack?: Function) {
		if (this._turnTimer) { return }
		this.npcObj.maxWalkSpeed = 80;
		if (this.rotInteval) {
			clearInterval(this.rotInteval)
			this.rotInteval = null
		}
		this.rotInteval = setInterval(() => {
			this.npcObj.addMovement(v3);
		}, 10)

		this._turnTimer = setTimeout(() => {
			this.onTurnFun()
			if (callBack) {
				callBack();
			}
		}, 600)
	}

	private onTurnFun() {
		clearInterval(this.rotInteval);
		this.rotInteval = null
		this.npcObj.maxWalkSpeed = 360;
		clearTimeout(this._turnTimer)
		this._turnTimer = null
	}

	/**
	 * 刷新Npc转向操作
	 */
	outOfTurn() {
		if (this._turnTimer) {
			this.onTurnFun()
		}
		const bool = this.npcObj.worldTransform.position.z == this.originPos.z;
		this.npcObj.worldTransform.position = this.originPos.clone();
		if (!bool && this.npcObj.isJumping) {
			this.npcObj.switchToFlying();
			this.npcObj.switchToWalking();
		}

		// 表情的刷新为初始状态
		// (this.npcObj.getAppearance() as mw.HumanoidV2).head?.setExpression(mw.ExpressionType.Default)
		const loc = this.originRot.rotateVector(new mw.Vector(100, 0, 0))
		this.onTurn(loc, () => {
			this.isInteractive = false;
			this.scrpit.playerLeave?.call();
		});
	}
	//==========================================触发器监听=======================================

	/**
	 * 进入触发器
	 * @param obj 
	 * @returns 
	 */
	private onTriggerEnter(obj: mw.GameObject): void {
		if (this.npcState == NPCState.InterRact) return
		if (!GameUtils.isPlayerCharacter(obj)) return
		if (this.npcState == NPCState.Talk) {
			Event.dispatchToLocal(EventsName.ShowNpcInterect, this.npcID);
			const char = Player.localPlayer.character
			const loc = char.worldTransform.position.clone().subtract(this.npcObj.worldTransform.position.clone())
			const tmpVec = loc.multiply(5)
			this.onTurn(tmpVec, () => { })
		}
		if (!this.config.FUNS) return
		this.isInteractive = true;
		if (this.talkState < 0) { return }
		P_NPCPanel.instance.showEvents(this.config, this.npcGuid, this.scrpit.id, this.talkState);
		P_NPCPanel.instance.setGoodWill(this.config.NpcName)
		// ModuleService.getModule(GameModuleC).setUIstate(false)
	}

	/**
	 * 离开触发器
	 * @param obj 
	 * @returns 
	 */
	private onTriggerExit(obj: mw.GameObject): void {
		if (this.npcState == NPCState.InterRact) return
		if (!GameUtils.isPlayerCharacter(obj)) { return; }
		Event.dispatchToLocal(EventsName.ShowNpcInterect, -1);
		if (!this.config.FUNS) return
		P_NPCPanel.instance.hideEvents();
		if (this.npcState == NPCState.Talk) {
			this.outOfTurn()
		}
		if (this.firstClick) {
			const character = Player.localPlayer.character;
			character.movementEnabled = character.jumpEnabled = true
			// ModuleService.getModule(DressModuleC).resetCameraAndTransform(CamearScene.NpcTalk)
			this.firstClick = false
		}
		// ModuleService.getModule(GameModuleC).setUIstate(true)
	}

	//============================================================引导==============================================


	//==================================================头顶上显示的对话====================================
	private static myPos: mw.Vector
	private static updateTime: number
	private _pos: mw.Vector
	/**根据距离来更新头顶上的随机对话*/
	private updateDis(): void {
		if (this.isInteractive || this.npcState == NPCState.InterRact) return
		if (this.cd > 0) {
			this.cd--;
		}
		if (!NPCClient.myPos || TimeUtil.elapsedTime() > NPCClient.updateTime + 0.2) {
			NPCClient.myPos = this.self.character.worldTransform.position;
			NPCClient.updateTime = TimeUtil.elapsedTime()
		}
		if (!this._pos)
			this._pos = this.npcObj.worldTransform.position
		if (mw.Vector.squaredDistance(this._pos, NPCClient.myPos) <= this.config.distance * this.config.distance && this.cd <= 0) {
			this.showDefalutMessage();
		}
	}


	//头顶随机冒话
	private showDefalutMessage(): void {
		this.cd = this.config.cd;
		let str: string;
		if (this.config.text) {
			let index = mw.MathUtil.randomInt(0, this.config.text.length);//从对话表里面随机一句话
			str = (GameConfig.SquareLanguage.getElement(this.config.text[index]).Value);
			this.showHeadMessage(str)
		}
	}

	/**展示头顶对话 */
	showHeadMessage(str: string) {
		this.head.showText(str);
	}

	/**设置npc头上任务效果 */
	setHeadTaskEff(state: boolean) {
		const quesionEff = this.npcObj.getChildByName("表情1") as mw.Effect
		const exaimEff = this.npcObj.getChildByName("表情2") as mw.Effect
		if (!state) {
			quesionEff?.setVisibility(mw.PropertyStatus.Off)
			exaimEff?.setVisibility(mw.PropertyStatus.Off)
		} else {
			const task = ModuleService.getModule(TaskModuleC).getCurTaskData()
			if (task && task.acceptNpc == this.npcID) {
				if (task.taskState == EmTaskState.NoAccept) {
					quesionEff?.setVisibility(mw.PropertyStatus.On)
				} else if (task.taskState == EmTaskState.Doing) {
					exaimEff?.setVisibility(mw.PropertyStatus.On)
				}
			}
		}
	}
}



