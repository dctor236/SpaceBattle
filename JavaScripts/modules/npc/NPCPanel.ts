/**
 * @Author       : songxing
 * @Date         : 2023-04-10 14:17:36
 * @LastEditors  : songxing
 * @LastEditTime : 2023-05-18 11:09:29
 * @FilePath     : \Projiecttest\JavaScripts\npc\NPCPanel.ts
 * @Description  : 
 */

import { GameConfig } from "../../config/GameConfig";
import { INPCConfigElement } from "../../config/NPCConfig";
import { INPCTalkElement } from "../../config/NPCTalk";
import { ITalkEventElement } from "../../config/TalkEvent";
import { EventsName } from "../../const/GameEnum";
import { UIManager } from "../../ExtensionType";
import NPCPanel_Generate from "../../ui-generate/uiTemplate/NPC/NPCPanel_generate";
import GameUtils from "../../utils/GameUtils";
import { TaskModuleC } from "../taskModule/TaskModuleC";
import { NPC_Events } from "./NPC";
import NPCItem from "./NPCItem";
import NPCModule_C from "./NPCModule_C";

export class P_NPCPanel extends NPCPanel_Generate {
	private static _Instance: P_NPCPanel = null;
	public static get instance() {
		if (P_NPCPanel._Instance == null) {
			P_NPCPanel._Instance.layer = mw.UILayerTop;
			P_NPCPanel._Instance = UIManager.getUI(P_NPCPanel, true);
		}
		return P_NPCPanel._Instance;
	}
	private data: INPCConfigElement = null;
	private eventConfig: ITalkEventElement = null;

	private itemList: NPCItem[] = [];
	/**选中状态 */
	private selects: number[] = [];
	private npcGuid = "";
	private times: Map<number, number> = new Map<number, number>();
	private npcid: number;
	private _state: number = 0
	private _nextState: number = 0
	private _isGuid: boolean = false


	onAwake() {
		super.onAwake()

	}

	public onStart(): void {
		P_NPCPanel._Instance = this;
		this.layer = mw.UILayerTop;
		this.click.clickMethod = mw.ButtonClickMethod.PreciseClick
		this.click.onClicked.add(() => {
			if (this.data) {
				this.showNpcTalk(this.npctalkData.nextTalk, this._isGuid);
			} else if (this.guideSelect == 0) {
				Event.dispatchToLocal(EventsName.ClickGuidButton, -1);
			} else if (this.guideSelect == -1) {
				P_NPCPanel.instance.hideEvents()
			}
		})

		this.guideBtn.visibility = mw.SlateVisibility.Collapsed;
		this.guideBtn.onClicked.add(() => {
			this.guideBtn.visibility = mw.SlateVisibility.Collapsed;
		})

		this.scroll.visibility = (mw.SlateVisibility.Hidden);
		this.talkCanvas.visibility = (mw.SlateVisibility.Collapsed);
		this.canUpdate = true;

		Event.addLocalListener(EventsName.SetTaskTalkState, (state: number) => {
			this._nextState = state
		})
	}

	/**
	 * 显示事件
	 * @param data 
	 * @param npcGuid 
	 */
	public showEvents(data: INPCConfigElement, npcGuid: string, id: number, state: number): void {
		UIManager.showUI(P_NPCPanel.instance, mw.UILayerTop)
		this.npcid = id;
		this.npcGuid = npcGuid;
		this.data = data;   //最原始的对话列
		this._state = state
		this.creatItemArr(this.data.FUNS[state])
	}

	/**新手引导玩家的选项 */
	protected guideSelect: number = -1
	public showPlayerTalks(talks: number[]) {
		this.creatItemArr(talks)
		this.guideSelect = talks.length
	}

	creatItemArr(list: number[]) {
		let yscale = 0;
		for (let i = 0; i < list.length; i++) {   //创建新的对话选项
			let id = list[i];
			let config = GameConfig.TalkEvent.getElement(id);
			if (!this.itemList[i]) {
				this.createItem(i);
			}
			this.itemList[i].setData(config);
			this.itemList[i].show(true);
			yscale += this.itemList[i].uiObject.size.y + 15;
		}

		this.scroll.scrollToStart()
		if (yscale <= this.scroll.size.y) {
			this.scroll.visibility = mw.SlateVisibility.SelfHitTestInvisible;
			this.scroll.scrollBarVisibility = mw.SlateVisibility.Collapsed
			this.scroll.alwaysShowScrollBar = false;
		} else {
			this.scroll.visibility = mw.SlateVisibility.Visible
			this.scroll.scrollBarVisibility = mw.SlateVisibility.Visible
		}
	}

	/**
	 * 创建item
	 * @param index 
	 */
	private createItem(index: number): void {
		let item = mw.UIService.create(NPCItem)
		item.clicked.add(this.onItemEvents, this);
		this.mBtnCon.addChild(item.uiObject);
		//item.uiObject.size = (new mw.Vector2(520, 100));
		this.itemList[index] = item;
	}

	/**隐藏事件 */
	public hideEvents(): void {
		this.showOrHideAllItem(false)
		this.scroll.visibility = (mw.SlateVisibility.Hidden);
		this.talkCanvas.visibility = (mw.SlateVisibility.Collapsed);
		this.data = null
		this.guideSelect = -1
	}

	private showOrHideAllItem(show: boolean) {
		this.selects = [];
		for (let item of this.itemList) {
			item.refreshSelect(this.selects);
			item.show(show);
		}
	}

	/**
	 * 点击NPC事件
	 * @param id 事件列表ID
	 */
	public onItemEvents(id: number): void {
		let config = GameConfig.TalkEvent.getElement(id);
		this.selects.push(id);
		this.times.set(id, config.stopTime);
		for (let item of this.itemList) {
			item.refreshSelect(this.selects);
		}

		if (config.accTaskId > 0) {
			ModuleService.getModule(TaskModuleC).acceptTask(config.accTaskId)
		}
		if (config.finishTaskId > 0) {
			Event.dispatchToLocal(EventsName.DoneTask, config.finishTaskId, 1)
		}

		if (config.refreshTask > 0) {
			Event.dispatchToLocal(EventsName.RefreshTask, config.refreshTask)
		}

		if (this.data) {
			//有联动npc的对话
			Event.dispatchToLocal(NPC_Events.NPC_OnClickItem + this.npcid, id);
		} else {
			this.guideSelect = 0
			Event.dispatchToLocal(EventsName.ClickGuidButton, id);
		}
	}

	private npctalkData: INPCTalkElement
	/**
	 * 
	 * @param npcTalkID 
	 * @param config 
	 * @returns 
	 */
	public showNpcTalk(npcTalkID: number | string, isGuide: boolean, config?: ITalkEventElement) {
		if (config) {
			this.eventConfig = config;   //保存事件config
		}
		if (isGuide) {
			this.showOrHideAllItem(false)//先隐藏掉之前的对话选项
		}
		this._isGuid = isGuide
		if (!npcTalkID) {
			this.talkCanvas.visibility = (mw.SlateVisibility.Collapsed);
			this.showOrHideAllItem(false);
			this.showEvents(this.data, this.npcGuid, this.npcid, this._state)  //对话完了  恢复到最初始的对话去
		} else {

			let talk: string = ''
			if (typeof npcTalkID === "number") {
				this.npctalkData = GameConfig.NPCTalk.getElement(npcTalkID)
				talk = GameUtils.getTxt(this.npctalkData.language)
			} else if (typeof npcTalkID === "string") {
				talk = npcTalkID
			}
			this.click.enable = true;
			this.scroll.visibility = (mw.SlateVisibility.Hidden);
			this.talkCanvas.visibility = (mw.SlateVisibility.Visible);
			this.talkTxt.fontColor = mw.LinearColor.white
			this.talkTxt.text = talk;
			if (!this.npctalkData) return
			this.onTalkComplete();
			if (this.npctalkData.hide) {
				this.showOrHideAllItem(false)//先隐藏掉之前的对话选项
			}

			if (this.npctalkData.jumpTalk) {
				this.showOrHideAllItem(false)//先隐藏掉之前的对话选项
				this.creatItemArr([this.npctalkData.jumpTalk]);
			}

			if (this.npctalkData.nextTalk)
				return;

			if (!this._isGuid && this.npctalkData.playerTalk) {
				let npcTalks = this.npctalkData.playerTalk[this._nextState]
				if (!npcTalks) { return }

				let changeFontColor = false
				for (const talk of npcTalks) {
					const elem = GameConfig.TalkEvent.getElement(talk)
					if (elem.accTaskId || elem.finishTaskId) {
						changeFontColor = true
						break
					}
				}

				if (changeFontColor) {
					this.talkTxt.fontColor = mw.LinearColor.yellow
				} else {
					this.talkTxt.fontColor = mw.LinearColor.white
				}
				this.click.enable = false;
				this.showOrHideAllItem(false)//先隐藏掉之前的对话选项
				this.creatItemArr(this.npctalkData.playerTalk[this._nextState]);
			}
		}
	}

	/**每个对话需要处理的事情 */

	async onTalkComplete() {
		if (this.npctalkData.rewarID) {   //假如这句话对完了有奖励，发送奖励
			await ModuleService.getModule(NPCModule_C).getBagItem(this.npcid, this.npctalkData, this.eventConfig.ID)
		}
	}

	//设置npc名字
	setGoodWill(nameID: number) {
		this.mGoodWillTxt.text = GameConfig.SquareLanguage.getElement(nameID).Value//GameConfig.SquareLanguage.getElement(this.data.NpcName).Value + "   好感度:  " + value.toString();
	}

	showNpcName(str: string) {
		this.mGoodWillTxt.text = str
	}

	public onUpdate(dt: number): void {
		for (let [id, time] of this.times) {
			time -= dt;
			this.times.set(id, time);
			if (time <= 0) {
				this.times.delete(id);
				this.selects.splice(this.selects.indexOf(id), 1);
				for (let item of this.itemList) {
					item.refreshSelect(this.selects);
				}
			}
		}
	}
}
