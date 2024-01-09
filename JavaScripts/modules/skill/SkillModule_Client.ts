import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
/**
* @Author       : 田可成
* @Date         : 2023-04-17 14:36:24
* @LastEditors  : 田可成
* @LastEditTime : 2023-06-08 09:28:04
* @FilePath     : \mollywoodschool\JavaScripts\modules\skill\SkillModule_Client.ts
* @Description  :
*/
import { GameConfig } from "../../config/GameConfig";
import { EventsName, PlayerStateType, SkillState } from "../../const/GameEnum";
import { GlobalData } from "../../const/GlobalData";
import { GlobalModule } from "../../const/GlobalModule";
import { SoundManager, Tween, UIManager } from "../../ExtensionType";
import { TS3 } from "../../ts3/TS3";
import Tips from "../../ui/commonUI/Tips";
import GameUtils from "../../utils/GameUtils";
import { BagModuleC } from "../bag/BagModuleC";
import { BuffModuleC } from "../buff/BuffModuleC";
import { CameraModuleC } from "../camera/CameraModule";
import FightMgr from "../fight/FightMgr";
import ComboUI from "../fight/ui/ComboUI";
import { updater } from "../fight/utils/Updater";
import P_GameHUD from "../gameModule/P_GameHUD";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";
import BulletTrrigerMgr from "./bullettrriger/BulletTrrigerMgr";
import SkillBase from "./logic/SkillBase";
import { SkillData } from "./SkillData";
import SkillMgr from "./SkillMgr";
import SkillModule_Server from "./SkillModule_Server";
import BesomMgr from "./skillObj/BesomMgr";
import SkillUI from "./ui/SkillUI";

export default class SkillModule_Client extends ModuleC<SkillModule_Server, SkillData> {
	private _skillMap: Map<PlayerStateType, SkillBase[]> = new Map()
	private _callArr: any[] = []
	private _skillUI: SkillUI;
	private _curSkill: SkillBase[] = [null, null, null, null];

	firstUseSkill: boolean = false
	protected onStart(): void {
		this._skillUI = UIManager.show(SkillUI);
		playerScale.x = playerScale.y = playerScale.z = this.localPlayer.character.worldTransform.scale.x;
		Event.addLocalListener(EventsName.UseSkill, (itemID: number, skillID: number, isTelescope: number) => {
			// MGSMsgHome.useSkill(skillID);
		});

		Event.addLocalListener(EventsName.OutStartSkill, (skillID: number) => {
			const ID = Number((skillID / 100).toFixed(0));
			let skill: SkillBase = this.findSkill(ID);
			if (skill) {
				skill.outStart()
			}
		});

		Event.addLocalListener(EventsName.RemoveSkill, (skillID: number, index: number) => {
			this.removeSkill(skillID, index)
		})

		Event.addLocalListener(EventsName.SelectGood, (itemID: string, isTelescope: boolean) => {
			const allElem = ["140006", '140007', '140008', '140009', '140010', '140011', '140012', '140013', '140014', '140016']
			if (!StringUtil.isEmpty(itemID) && !this.firstUseSkill && allElem.indexOf(itemID) != -1) {
				this.firstUseSkill = true
				Tips.show(GameUtils.getTxt("Tips_1015"))
			}
			if (Math.floor(Number(itemID) / 10) >= 30 && Math.floor(Number(itemID) / 10) < 40 && !GlobalData.inSpaceStation) {
				this.getSkill(Number(itemID), true)
			}
			const cs = Camera.currentCamera
			if (isTelescope && !GlobalData.inSpaceStation) {
				if (itemID != '306') {
					cs.localTransform.position = new Vector(0, 0, 150)
					cs.springArm.length = 450
					cs.fov = 100
				} else {
					cs.localTransform.position = new Vector(0, 0, 120)
					cs.springArm.length = 300
					cs.fov = 90
				}
				this._skillUI.mAim.visibility = mw.SlateVisibility.SelfHitTestInvisible
				this.onInspect()
			} else {
				cs.springArm.length = 350
				ModuleService.getModule(CameraModuleC).facadPlayerRotation(false)
				this._skillUI.mAim.visibility = mw.SlateVisibility.Collapsed
				if (this.inspectTimer) {
					clearInterval(this.inspectTimer)
					this.inspectTimer = null
				}
				this._skillUI.mAim.renderScale = Vector2.one
				this.tween?.stop()
			}
			if (itemID == '') {
				if (this.inspectTimer) {
					clearInterval(this.inspectTimer)
					this.inspectTimer = null
				}
			}
		})



		const guid = this.localPlayer.character.gameObjectId;
		this.registerSkill();
		for (const element of SkillMgr.Inst.skillClassMap) {
			setTimeout(() => {
				this._callArr.push(() => {
					let skill = new element[1](element[0], guid)
					skill.init()
					if (!this._skillMap.has(skill.disableState)) {
						this._skillMap.set(skill.disableState, []);
					}
					let arr = this._skillMap.get(skill.disableState);
					arr.push(skill)
				})
			}, 2000);
		}
		Event.addLocalListener(EventsName.PLAYER_STATE, (stateType: number, active: boolean) => {
			this.setState(stateType, active)
		})
	}


	tween: Tween<{ x: number; }> = null
	inspectTimer = null
	onInspect() {
		if (this.inspectTimer)
			return
		const tmpSize = this._skillUI.mAim.renderScale
		this.tween = new Tween({ x: 1, size: tmpSize.x }).to({ x: 0.4, size: tmpSize.x * 1.4 }, 1150).onUpdate((obj) => {
			this._skillUI.mAim.renderScale = new Vector2(obj.size, obj.size)
		})
			.yoyo(true).
			repeat(Infinity)
			.start()
			.easing(mw.TweenUtil.Easing.Sinusoidal.InOut)
			.onComplete(() => {
				this._skillUI.mAim.renderScale = tmpSize
			})
		this.inspectTimer = setInterval(() => {
			const skillUI = mw.UIService.getUI(SkillUI)
			const win = mw.getViewportSize();
			const viewPort = mw.WindowUtil.getViewportSize();
			const viewPos = mw.Vector2.zero
			mw.localToViewport(skillUI.point.tickSpaceGeometry, mw.Vector2.zero, mw.Vector2.zero, viewPos)
			viewPos.x *= win.x / viewPort.x;
			viewPos.y *= win.y / viewPort.y;
			const result = InputUtil.convertScreenLocationToWorldSpace(viewPos.x, viewPos.y)
			const pos = result.worldPosition.clone().add(result.worldDirection.multiply(5000))
			let arr = QueryUtil.lineTrace(result.worldPosition, pos, true, false, [], false, false, Player.localPlayer.character);

			for (const e of arr) {
				if (!e.gameObject) continue
				let m = null
				m = TS3.monsterMgr.getMonster(e.gameObject.gameObjectId)
				if (!m) {
					m = TS3.playerMgr.getPlayer(e.gameObject.tag)
					if (m) {
						if (e.gameObject.tag == TS3.playerMgr.mainUserId) {
							continue
						}
						else {
							GlobalData.RedAnimMid = e.gameObject.tag
						}
					}
					if (!m && PlayerManagerExtesion.isCharacter(e.gameObject) && e.gameObject.player) {
						if (e.gameObject.gameObjectId == TS3.playerMgr.mainGuid) {
							continue
						}
						m = TS3.playerMgr.getPlayer(e.gameObject.gameObjectId)
						if (m) {
							GlobalData.RedAnimMid = e.gameObject.gameObjectId
						}
					}
				} else {
					GlobalData.RedAnimMid = e.gameObject.gameObjectId
				}

				if (m) {
					this._skillUI.mAimImage.imageColor = mw.LinearColor.red
					this._skillUI.point.imageColor = mw.LinearColor.red
					GlobalData.RedAnimPos = e.impactPoint
					return
				} else {

				}
			}
			// const allElem = ["140006", '140007', '140008', '140009', '140010', '140011', '140012', '140013', '140014', '140016']
			// const curSel = ModuleService.getModule(BagModuleC).curEquip
			// const elem = GameConfig.Item.getElement(curSel)
			// if (elem && elem.Skills && elem.Skills.length >= 2 && GlobalData.autoBattle) {
			// 	const skillElem = GameConfig.SkillLevel.getElement(elem.Skills[1])
			// 	if (skillElem) {
			// 		this.findSkill(elem.Skills[1])?.onRemove()
			// 	}
			// }
			GlobalData.RedAnimMid = ''
			GlobalData.RedAnimPos = pos
			this._skillUI.mAimImage.imageColor = mw.LinearColor.white
			this._skillUI.point.imageColor = mw.LinearColor.white
		}, 800)
	}

	private registerSkill() {
		for (const config of GameConfig.Skill.getAllElement()) {
			if (!SkillMgr.Inst.skillClassMap.has(config.ID)) {
				SkillMgr.Inst.skillClassMap.set(config.ID, SkillBase);
			}
		}
	}

	protected onDetach(): void {
		this._callArr.length = 0;
		this._skillMap = new Map()
	}

	public findSkill(skillID: number): SkillBase {
		let skillbase: SkillBase = null
		this._skillMap.forEach(arr => {
			for (const skill of arr) {
				if (skill.skill == skillID) {
					skillbase = skill
					return;
				}
			}
		});
		return skillbase;
	}

	public setState(state: PlayerStateType, isActive: boolean) {
		if (this._skillMap.has(state)) {
			const arr = this._skillMap.get(state)
			for (const skill of arr) {
				if (skill.skill == 2051) {
					if (isActive) skill.State = SkillState.Disable
					else if (skill.State == SkillState.Disable) skill.State = SkillState.Enable
				}
			}
		}
	}

	lastAudio: number = 0
	//dmage 技能伤害
	public onHit(
		hitObj: string,
		buffName: string,
		damage: number,
		damageRate: number,
		effectId: number,
		music: number,
		skillID: number,
		isOwn: boolean,
		hitLocation?: mw.Vector
	) {
		//XXJ 击中
		// TS3.log('onHit', hitObj, buffName, damage, effectId, music, skillID, hitLocation)
		const sound = GameConfig.Music.getElement(music);
		// if (this.lastAudio)
		// 	SoundManager.stop3DSound(this.lastAudio)
		if (sound) {
			const musicRange = sound.MusicRange;
			const range = musicRange
				? {
					innerRadius: musicRange[0],
					falloffDistance: musicRange[1],
				}
				: undefined;
			let soundID = GameUtils.playSoundOrBgm(music, hitLocation)
			this.lastAudio = soundID as number
		}
		//特效
		const effect = GameConfig.Effect.getElement(effectId);
		effect &&
			GeneralManager.rpcPlayEffectAtLocation(
				effect.EffectID,
				hitLocation,
				effect.EffectTime,
				effect.EffectRotate.toRotation(),
				effect.EffectLarge
			);

		if (!isOwn)
			return 1

		let m = null
		m = TS3.monsterMgr.getMonster(hitObj);
		let attDamage = FightMgr.instance.calculatePDamage()
		let skillDamage = (damageRate / 100) * attDamage.data
		if (m && !m.isDead() && !m.isHiden()) {
			TS3.monsterMgr.onDamage(hitObj, Math.round(skillDamage), attDamage.crit);
			//  音效
			ComboUI.instance.setCombo(hitObj);
			if (Number(buffName)) {
				// ModuleService.getModule(BuffModuleC).reqAddSBuff('', hitObj, Number(buffName))
			}
			return 1;
		} else {
			m = TS3.playerMgr.getPlayer(hitObj)
			if (m && !m.isDead()) {
				// Event.dispatchToServer('OnDamageCS', Math.round(skillDamage), false, m.userId)
				TS3.playerMgr.onDamage(Math.floor(skillDamage), 3, attDamage.crit, m.userId);
				//  音效
				ComboUI.instance.setCombo(hitObj);
				// if (Number(buffName)) {
				// 	ModuleService.getModule(BuffModuleC).reqAddSBuff('', hitObj, Number(buffName))
				// }
				return 1;
			}
			return -1
		}
	}

	public getSkill(itemID: number, isStart: boolean = false) {
		if (itemID == 0) this.getSkillUI([]);
		else this.getSkillUI(GameConfig.Item.getElement(itemID).Skills, itemID, isStart);
	}

	public removeSkill(skillID: number, index: number) {
		const skillItemArr = this._skillUI.skillItemArr;
		if (this._curSkill[index] && this._curSkill[index].skillID == skillID) {
			this._curSkill[index].onRemove();
			this._curSkill[index].onOver();
			this._curSkill[index] = null;
			skillItemArr[index].hide()
		}
	}

	public getSkillUI(skills: number[], itemID: number = 0, isStart: boolean = false) {
		if (!skills) {
			skills = [];
		}
		const skillItemArr = this._skillUI.skillItemArr;
		for (const iterator of skillItemArr) {
			iterator.hide();
		}
		for (let i = 0; i < this._curSkill.length; i++) {
			if (this._curSkill[i]) {
				this._curSkill[i].onRemove();
				this._curSkill[i] = null;
			}
		}
		let showBullet: boolean = false
		const vec = [700301, 700401, 700501, 700801]
		let fireSkill: SkillBase
		for (let i = 0; i < skills.length; i++) {
			let showSkill = skills[i]
			const ID = Number((showSkill / 100).toFixed(0));
			const flyItem = [140013, 140014]
			let skill: SkillBase = this.findSkill(ID);
			// if (ID == 2051) {
			// 	const res = this._curSkill.find(e => e && e.skill == 2051)
			// 	if (flyItem.indexOf(itemID) == -1 && !res)
			// 		continue
			// 	if (flyItem.indexOf(itemID) == -1 && res) {
			// 		showSkill = res.skillID
			// 		skill = res
			// 	}
			// }
			if (skill) {
				if (vec.indexOf(showSkill) != -1) {
					showBullet = true
					fireSkill = skill
				} else {
					if (ID != 2011) {
						skillItemArr[i].show(skill);
					}
				}
				console.log("技能UI显示 + ", skills[i], ID, skill.skill, skill.skillID)
				skill.show(showSkill, itemID);
				this._curSkill[i] = skill;
				if (isStart && ID == 2011) {
					skill.outStart()
				}
			}
		}
		if (showBullet && fireSkill) {
			skillItemArr[skillItemArr.length - 2].show(fireSkill);
			skillItemArr[skillItemArr.length - 1].show(fireSkill);
		}
	}

	protected onUpdate(dt: number): void {
		BulletTrrigerMgr.instance.update(dt);
		BesomMgr.instance.onUpdate(dt);
		if (GlobalData.skillCD >= 0) {
			GlobalData.skillCD -= dt;
		}
		if (this._callArr.length > 0) {
			this._callArr.pop()();
		}
		this._skillMap.forEach(arr => {
			for (const skill of arr) {
				skill.onUpdate(dt)
			}
		});
	}

}
export const playerScale: mw.Vector = new mw.Vector();
