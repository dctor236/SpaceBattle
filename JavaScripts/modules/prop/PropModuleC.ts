import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
import { GameConfig } from "../../config/GameConfig";
import { GlobalData } from "../../const/GlobalData";
import { UIHide, UIIsShow, UIManager } from "../../ExtensionType";
import { CameraType } from "../../ui/cameraUI/CameraMainUI";
import GameUtils from "../../utils/GameUtils";
import { ItemType } from "../bag/BagDataHelper";
import { BagModuleC } from "../bag/BagModuleC";
import { GameModuleC } from "../gameModule/GameModuleC";
import { PropBaseModuleC } from "../squareBase/PropBase/PropBaseModule";
import { mathTools_firstPlaceNumber, PropBaseType } from "../squareBase/PropBase/PropTool";
import { Prefab } from "./Prefab";
import { PropModuleS } from "./PropModuleS";

export enum ClothType {
	behindHair = "behindHair",
	frontHair = "frontHair",
}

export class PropModuleC extends PropBaseModuleC<PropModuleS, null> {
	private _clothMap: Map<string, string> = new Map();
	private _headTimer
	private _curShow: any;
	private _prefabPoolMap: Map<string, Prefab[]> = new Map()

	get clickAction() {
		return this.ui_action.action
	}

	get clickPlace() {
		return this.ui_Placement.action
	}

	public onStart(): void {
		super.onStart();
	}
	public net_UseCamera(cameraType: CameraType) {
		console.log('开始相机模式 cameraType：' + cameraType);
		ModuleService.getModule(GameModuleC).propShowCameraPanel(cameraType);
	}

	public net_controlPropState(propID: number, bo: boolean, param1?: any, param2?: any): void {
		let type = null
		const item = ModuleService.getModule(BagModuleC).getCurEquipItem()
		if (item) {
			type = GameConfig.Item.getElement(item.configID).ItemType
		}
		if (bo && ![ItemType.LiYue, ItemType.Sundries].includes(type)) {
			return
		}
		super.net_controlPropState(propID, bo, param1, param2)
	}

	public setUIHide() {
		if (UIIsShow(this["ui_action"])) {
			this._curShow = this["ui_action"]
			UIHide(this._curShow)
		}

		if (UIIsShow(this["ui_fly"])) {
			this._curShow = this["ui_fly"]
			UIHide(this._curShow)
		}

		if (UIIsShow(this["ui_Placement"])) {
			this._curShow = this["ui_Placement"]
			UIHide(this._curShow)
		}
	}
	public setUIShow() {
		UIManager.showUI(this._curShow)
		this._curShow = null;
	}

	public setFlyState(isFly: boolean) {
		if (isFly) {
			this.ui_fly.mBtn.enable = true;
			this.ui_fly.forbidden.visibility = mw.SlateVisibility.Collapsed;
		} else {
			this.ui_fly.mBtn.enable = false;
			if (!this.ui_fly._isActive) {
				this.ui_fly.mBtn.onClicked.broadcast();
			}
			this.ui_fly.forbidden.visibility = mw.SlateVisibility.SelfHitTestInvisible;
		}
	}

	public propClickEnd(propId: number): void {
		console.log("道具点击@@@@@@@@@@@@@@@@@@@@@", propId)
		if (mathTools_firstPlaceNumber(propId) == PropBaseType.Action) {
			setTimeout(() => {
				ModuleService.getModule(BagModuleC).useSquareItem(propId);
			}, GameConfig.PropAction.getElement(propId).ActionOldTime * 1000);
		} else if (mathTools_firstPlaceNumber(propId) == PropBaseType.Fly) {
			console.log("飞行点击@@@@@@@@@@@@@@@@@@@@@")
			return;
		} else {
			ModuleService.getModule(BagModuleC).useSquareItem(propId);
		}
	}

	/** 
	 * 释放造物技能
	 * @param  id       造物表ID
	 * @param  callBack 技能表现完成回调
	 * @return 
	 */
	public async doItemSkill(id: number, callBack?: () => void) {
		const character = Player.localPlayer.character;
		const skillCfg = GameConfig.CreateItem.getElement(id);
		let time = 0;
		let anim: mw.Animation;
		if (skillCfg.AnimGuid) {
			await GameUtils.downAsset(skillCfg.AnimGuid)
			anim = PlayerManagerExtesion.loadAnimationExtesion(character, skillCfg.AnimGuid, true)
			anim.loop = 0
			anim.speed = 1
			anim.play()
			time = anim.length
		}
		if (skillCfg.Appearance) {
			this.recoverCloth(skillCfg.Appearance, skillCfg.ClothType, skillCfg.ClothTime)
		}
		if (skillCfg.SoundGuid) {
			await GameUtils.downAsset(skillCfg.SoundGuid)
			const loc = character.worldTransform.position
			const param = skillCfg.SoundParameter;
			this.server.net_PlaySound(skillCfg.SoundGuid, loc, param[2], param[1], { innerRadius: param[0], maxDistance: param[0] * 1.2 });
		}
		if (skillCfg.EffGuid) {
			const transform = this.arrayToVector(skillCfg.TransformEffect)
			this.server.net_PlayEffect(skillCfg.EffGuid, skillCfg.EffectPoint, 0, transform.loc, transform.roc, transform.scale);
		}
		if (skillCfg.SkillGuid) {
			this.spawnPrefab(skillCfg.SkillGuid, 100, skillCfg.SkillTime, skillCfg.SkillIsClient)
		}
		if (skillCfg.Time) {
			time = skillCfg.Time
		}
		GlobalData.skillCD = time
		setTimeout(() => {
			anim && anim.stop();
			this.server.net_StopEffect();
			this.server.net_StopSound();
			if (callBack) {
				callBack();
			}
		}, time * 1000);
	}

	public arrayToVector(arr: Array<number>): { loc: mw.Vector, roc: mw.Rotation, scale: mw.Vector } {
		if (arr.length == 9) {
			const loc = new mw.Vector(arr[0], arr[1], arr[2])
			const roc = new mw.Rotation(arr[3], arr[4], arr[5])
			const scale = new mw.Vector(arr[6], arr[7], arr[8])
			const transform: { loc: mw.Vector, roc: mw.Rotation, scale: mw.Vector } = {
				loc: loc,
				roc: roc,
				scale: scale
			};
			return transform
		}
	}

	/** 
	 * 在角色前方创建object
	 * @param  guid	
	 * @param  zOffset 相对于角色高度z偏移量
	 * @return 
	 */
	public async spawnPrefab(guid: string, zOffset: number, time: number = 99999, isClient: boolean = true) {
		const character = Player.localPlayer.character
		const forward = character.worldTransform.getForwardVector().normalize()
		const loc = character.worldTransform.position.add(forward.multiply(200));
		loc.z -= zOffset
		if (isClient) this.net_SpawnPrefab(guid, time, loc)
		this.server.net_SpawnPrefab(guid, time, loc, isClient)
		return loc;
	}

	public async net_SpawnPrefab(guid: string, time: number, loc: mw.Vector) {
		let objPool: Prefab[]
		if (!this._prefabPoolMap.has(guid)) {
			objPool = []
			this._prefabPoolMap.set(guid, objPool)
		} else {
			objPool = this._prefabPoolMap.get(guid);
		}
		let prefab: Prefab;
		let isNew: boolean = true
		for (let i = 0; i < objPool.length; i++) {
			const element = objPool[i]
			if (!element.isActive) {
				prefab = element;
				isNew = false;
				break;
			}
			if (i == 30) {
				prefab = objPool.shift()
				objPool.push(prefab)
				isNew = false;
			}
		}
		if (isNew) {
			prefab = new Prefab(guid);
			objPool.push(prefab)
		}
		await prefab.spawn(time, true);
		prefab.obj.worldTransform.position = loc
	}

	/** 
	 * 角色换装
	 * @param  appearance
	 * @param  type
	 * @param  time
	 * @return 
	 */
	public recoverCloth(appearance: string, type: number, time: number) {
		switch (type) {
			case 1:
				this.headPartCloth(appearance, time)
				break;
			default:
				break;
		}
	}

	headPartCloth(appearance: string, time: number) {
		const v2 = Player.localPlayer.character.description.advance.hair;
		const { frontHair, backHair } = v2;
		if (this._headTimer) {
			const oldF = this._clothMap.get(ClothType.frontHair)
			const oldB = this._clothMap.get(ClothType.behindHair)
			backHair.style = oldB
			frontHair.style = oldF
			// frontHair.setMesh(oldF, false);
			clearTimeout(this._headTimer);
			this._headTimer = null;
		} else {
			this._clothMap.set(ClothType.frontHair, frontHair.style);
			this._clothMap.set(ClothType.behindHair, backHair.style);
		}
		backHair.style = appearance
		frontHair.style = ''
		// backHair.setMesh(appearance, false);
		// frontHair.setMesh("", false);
		Player.localPlayer.character.syncDescription();
		this._headTimer = setTimeout(() => {
			const oldF = this._clothMap.get(ClothType.frontHair)
			const oldB = this._clothMap.get(ClothType.behindHair)
			backHair.style = oldB
			frontHair.style = oldF
			// behindHair.setMesh(oldB, false);
			// frontHair.setMesh(oldF, false);
			Player.localPlayer.character.syncDescription();
			clearTimeout(this._headTimer);
			this._headTimer = null;
		}, time * 1000);
	}

	protected onUpdate(dt: number): void {
		for (const [guid, prefabPool] of this._prefabPoolMap) {
			for (let i = 0; i < prefabPool.length; i++) {
				const element = prefabPool[i];
				if (element.isActive) {
					element.life -= dt;
					if (element.life <= 0) {
						element.despawn()
					}
				}
			}
		}
	}

	protected onDestroy(): void {
		for (const [guid, prefabPool] of this._prefabPoolMap) {
			for (let i = 0; i < prefabPool.length; i++) {
				const element = prefabPool[i];
				element.destory()
			}
		}
	}
}