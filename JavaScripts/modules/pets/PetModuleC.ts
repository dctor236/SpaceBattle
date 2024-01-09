import { SpawnManager, SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
import { InputManager } from "../../InputManager";
import { EventsName } from "../../const/GameEnum";
import GameUtils from "../../utils/GameUtils";
import PetModuleS from "./PetModuleS";
import { IPetListElement } from "../../config/PetList";
import { GameConfig } from "../../config/GameConfig";
import { GoPool, UIManager } from "../../ExtensionType";
import petschat_Generate from "../../ui-generate/Pets/petschat_generate";
import petsname_Generate from "../../ui-generate/Pets/petsname_generate";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";


export default class PetModuleC extends ModuleC<PetModuleS, null> {
	private _petid: number
	private _pet: mw.Character
	private _cha: mw.Character
	private _elems: IPetListElement[] = []
	private _curState: PetAnim = PetAnim.idle

	private _nameUI: petsname_Generate = null
	private _talkUI: petschat_Generate = null
	private _talkWUI: mw.UIWidget = null
	private _uitime = null

	/**对话UI显示间隔 */
	public comomCd = 15
	/**对话UI显示cd */
	public showCd = 3
	private _lastShow: number = 0


	private get cha() {
		if (!this._cha)
			this._cha = Player.localPlayer.character
		return this._cha
	}
	public get hasPet() {
		return this._pet != null
	}

	protected onStart(): void {
		super.onStart()
		this._elems = GameConfig.PetList.getAllElement()
		setTimeout(() => {
			this.downloadAssets()
			// this.callPet(1)
		}, 2000);

		this.initUI()
		// InputManager.instance.onKeyDown(mw.Keys.H).add(() => this.callPet(1))
		// InputManager.instance.onKeyDown(mw.Keys.J).add(() => this.recallPet())
		Event.addLocalListener(EventsName.PLAYER_FLY, (fly: boolean) => this.onPlayerFly(fly))
	}

	private initUI() {
		SpawnManager.asyncSpawn({ guid: "UIWidget" }).then(obj => {
			this._talkWUI = obj as mw.UIWidget
			this._talkUI = UIManager.getUI(petschat_Generate);
			this.setUIPamas(this._talkWUI, this._talkUI, new Vector(0, 0, 50))
		})
		this._nameUI = UIManager.getUI(petsname_Generate);
	}

	private setUIPamas(uiWidget: mw.UIWidget, userWidget: mw.UIScript, relLoc: Vector) {
		uiWidget.setTargetUIWidget(userWidget.uiWidgetBase)
		uiWidget.widgetSpace = mw.WidgetSpaceMode.OverheadUI
		uiWidget.drawSize.set(userWidget.rootCanvas.size)
		uiWidget.headUIMaxVisibleDistance = 2500;
		uiWidget.scaledByDistanceEnable = false
		uiWidget.pivot = new mw.Vector2(0.5, 0.5);
		uiWidget.selfOcclusion = false
		uiWidget.occlusionEnable = false
		uiWidget.localTransform.position = relLoc
		uiWidget.setVisibility(PropertyStatus.Off)
	}

	/**召唤宠物 */
	public async callPet(petid: number) {
		if (this._pet)
			return
		MGSMsgHome.uploadMGS('ts_game_result', '', { record: "pet_in" })
		console.log("_______________PetModuleC.callPet", petid)
		this._petid = petid
		let guid = await this.server.net_callPet(this._petid, this._fly)
		if (guid) {
			await this.onCreatePet(guid)
			this.playEffAudio([65], [71, 73])
			this._nameUI.mName.text = this._elems[this._petid - 1].petName
			this._nameUI.mName.setFontColorByHex(this._elems[this._petid - 1].color)
		}
		else
			console.error("_______________我猫呢 petid:", petid)
	}

	/**召回宠物 */
	public async recallPet() {
		if (!this._pet)
			return
		MGSMsgHome.uploadMGS('ts_game_result', '', { record: "pet_out" })
		console.log("_______________PetModuleC.recallPet")
		this.playEffAudio([66], [72])
		await TimeUtil.delaySecond(0.5)
		this.server.net_recallPet()
		this._waitID && clearInterval(this._waitID)
		this._tid && clearInterval(this._tid)
		this._pet.parent = null
		this._pet.getChildren().forEach(e => {
			e.parent = null
			e.setVisibility(PropertyStatus.Off)
		})

		this.petMoveTo(false)
		this._pet = null
	}

	private _fly = false
	private onPlayerFly(fly: boolean) {
		this._fly = fly
		setTimeout(() => {
			if (this._pet) {
				this.server.net_playerFly(fly)
				this.petMoveTo(!fly)
				if (fly) {
					this.playAnim(this._elems[this._petid - 1].idle, 1)
				}
			}
		}, 200)
	}

	private downloadAssets() {
		if (this["downAssetss"]) return
		this["downAssetss"] = true
		let arr = []
		this._elems.forEach(e => {
			arr = arr.concat(e.idle, e.run, e.wait)
		})
		return GameUtils.downAsset(arr.join(","))
	}

	private _tid
	private _reset = false
	public async onCreatePet(guid: string) {
		console.log("_______________net_CreatePet", guid)
		this._pet = await GameObject.asyncFindGameObjectById(guid) as mw.Character
		await this._pet.asyncReady()
		this._move = false
		this._pet.attachToSlot(this._talkWUI, mw.HumanoidSlotType.Root)
		const nameWUI = this._pet.overheadUI
		nameWUI.setTargetUIWidget(this._nameUI.uiWidgetBase)
		nameWUI.localTransform.position = new Vector(0, 10, 50)
		this._tid = setInterval(() => {
			if (this._fly)
				return
			let target = this.cha.worldTransform.position
			let self = this._pet.worldTransform.position
			let dis = mw.Vector.squaredDistance(target, self)
			if (dis > 3000000) {
				if (!this._reset) {
					this.server.net_reSetPet()
					this._reset = true
					setTimeout(() => this._reset = false, 5000);
				}
			} else if (dis > 30000) {
				this.petMoveTo(true)
				this.petAni(true)
			}
			else {
				this.petMoveTo(false)
				this.petAni(false)
			}
		}, 1000)
	}

	private petMoveTo(move: boolean) {
		if (move)
			Navigation.navigateTo(this._pet, this.cha.worldTransform.position, 180)
		else {
			Navigation.stopNavigateTo(this._pet)
		}
	}

	private _waitID
	private _move = false
	private petAni(move: boolean) {
		if (this._move == move || !this._pet)
			return
		console.log("_______________petAni", move)
		this._move = move
		if (move) {
			this.playAnim(this._elems[this._petid - 1].run, 0, PetAnim.run)
			this._waitID && clearInterval(this._waitID)
		} else {
			this.playAnim(this._elems[this._petid - 1].idle, 1)
			this._waitID = setInterval(() => {
				if (this._fly) return
				const wait = this._elems[this._petid - 1].wait
				const ranIndx = MathUtil.randomInt(0, wait.length)
				let waitAni = wait[ranIndx]
				const effctID = this._elems[this._petid - 1].effectid[ranIndx]
				const audioID = this._elems[this._petid - 1].audioid[ranIndx]
				this.playEffAudio([effctID], [audioID])
				this.playAnim(waitAni, 1, PetAnim.wait)
			}, MathUtil.randomInt(9000, 12001))
		}
	}
	private playAnim(anim: string, loop: number, state: PetAnim = PetAnim.idle) {
		this._curState = state
		MGSMsgHome.uploadMGS('ts_game_result', '', { record: "pet_act" })
		PlayerManagerExtesion.rpcPlayAnimation(this._pet, anim, loop)
		if (this._curState != PetAnim.idle)
			this.show3DUI()
	}

	public playEffAudio(effctsID: number[], audiosID: number[]) {
		effctsID.forEach(effectID => {
			if (effectID > 0) {
				const eff = GameConfig.Effect.getElement(effectID)
				GoPool.asyncSpawn(eff.EffectID).then(obj => {
					let effObj = obj as mw.Effect
					this._pet.attachToSlot(effObj, mw.HumanoidSlotType.Head)
					effObj.localTransform.position = eff.EffectLocation
					effObj.localTransform.rotation = eff.EffectRotate.toRotation()
					effObj.worldTransform.scale = eff.EffectLarge
					effObj.loop = false
					effObj.play()
					setTimeout(() => {
						GoPool.despawn(effObj)
					}, effObj.timeLength * 1000);
				})
			}
		})

		audiosID.forEach(audioID => {
			const sound = GameConfig.Music.getElement(audioID);
			GoPool.asyncSpawn(sound.MusicGUID).then(obj => {
				let audioObj = obj as mw.Sound
				if (sound.MusicRange) {
					audioObj.isSpatialization = true;
					audioObj.attenuationShapeExtents = new Vector(sound.MusicRange[0], sound.MusicRange[1], 0)
					audioObj.falloffDistance = sound.MusicRange[1];
				}
				audioObj.isLoop = false
				audioObj.volume = sound.Volume * 5
				audioObj.worldTransform.position = this._pet.worldTransform.position
				audioObj.play()
				setTimeout(() => {
					GoPool.despawn(audioObj)
				}, audioObj.timeLength * 1000);
			})
		})
	}

	private show3DUI() {
		if (TimeUtil.time() >= this._lastShow) {
			this._lastShow = TimeUtil.time() + this.comomCd
			if (this._uitime) {
				clearTimeout(this._uitime)
				this._uitime = null
			}
			this._uitime = setTimeout(() => {
				this._talkWUI.setVisibility(mw.PropertyStatus.Off)
				clearTimeout(this._uitime)
				this._uitime = null
			}, this.showCd * 1000)

			this._talkWUI.setVisibility(mw.PropertyStatus.On)
			const talkid = this._elems[this._petid - 1].talkid[this._curState - 1]
			const textList = GameConfig.PetText.getElement(talkid).text
			const random = textList[MathUtil.randomInt(0, textList.length)]
			this._talkUI.mTex.text = GameUtils.getTxt(random);
		}

	}
}

const enum PetAnim {
	idle,
	run,
	wait
}


