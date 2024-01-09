import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';

import { GameConfig } from "../../../config/GameConfig";
import { ISkillElement } from "../../../config/Skill";
import { ISkillLevelElement } from "../../../config/SkillLevel";
import { TS3 } from "../../../ts3/TS3";
import SkillBase from "../logic/SkillBase";

/**
 * @Author       : 田可成
 * @Date         : 2023-03-15 18:30:31
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-05 13:21:52
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\bullettrriger\BulletTrrigerBase.ts
 * @Description  :
 */
export abstract class BulletTrrigerBase {
	protected _obj: mw.GameObject;
	protected _bulletID: string;
	protected _skill: SkillBase;
	protected _buffName: string;
	protected _damage: number;
	protected _damageRate: number;
	protected _trrigerConfig: string;
	protected _effect: number = 0;
	protected _music: number = 0;
	protected _isOwn: boolean = true;
	protected _type: number;
	/**1 一次只打第一个人 2 贯穿可以多次全部范围敌人 3 一次打全部范围敌人*/
	protected _hitObjGuid: string[] = [];
	protected _character: mw.Character;
	protected _start: mw.Vector = mw.Vector.zero
	private _timeout: number;
	public isActive: boolean = false;

	protected _movex: number = 0
	protected _movey: number = 0
	protected _movez: number = 0
	protected _x: number = 1
	protected _y: number = 1
	protected _z: number = 1
	/**检测间隔 */
	protected inspectInteval: number = 0
	protected tmpInspectInteval: number = 0

	protected _end: mw.Vector = mw.Vector.zero
	/**扣血间隔 */
	protected _damageTime: number = 0
	protected tmpDamageInteval: number = 0
	protected _speed: number = 1
	public skillLevelElem: ISkillLevelElement = null
	protected skillElem: ISkillElement = null
	protected fireMusic: number = -1
	protected fireEff: number = -1
	protected _life: number = 0
	public init(
		obj: mw.GameObject,
		bulletID: string,
		life: number,
		skill: SkillBase,
		levelElem: ISkillLevelElement,
		buffName: string,
		damage: number,
		damageRate: number,
		trrigerConfig?: string,
		trrigerConfig2?: string,
		isOwn?: boolean
	) {
		this._obj = obj;
		this._obj.setVisibility(mw.PropertyStatus.On);
		this._bulletID = bulletID;
		this._buffName = buffName;
		this._damage = damage;
		this._damageRate = damageRate
		this._trrigerConfig = trrigerConfig;
		this._isOwn = isOwn;
		this._hitObjGuid.length = 0
		this.isActive = true;
		this._character = Player.localPlayer.character;
		this._skill = skill
		this._life = life
		this.skillLevelElem = levelElem;
		this.skillElem = GameConfig.Skill.getElement(skill.skill);
		if (this._timeout) clearTimeout(this._timeout);
		this._timeout = setTimeout(() => {
			this.deActive();
		}, life * 1000);
	}

	public deActive() {
		this._hitObjGuid.length = 0
		this.isActive = false;
		this._obj.setVisibility(mw.PropertyStatus.Off);
		this._start.set(mw.Vector.zero)
		if (this._timeout) clearTimeout(this._timeout);
		this._timeout = null
	}

	protected hitAnything(res: mw.GameObject[]) {
		const list = TS3.monsterMgr.getAllMonser()
		if (list)
			for (const m of list) {
				if (m.isDead() && this._hitObjGuid.indexOf(m.mid) == -1) {
					this._hitObjGuid.push(m.mid)
				}
			}

		for (let index = 0; index < res.length; index++) {
			let element = res[index];
			let hit: string = ''
			//!(PlayerManagerExtesion.isCharacter(element)) || 
			if (element instanceof mw.Trigger || !element.getVisibility() || element.gameObjectId == this._character.gameObjectId) {
				continue;
			}

			if (PlayerManagerExtesion.isCharacter(element) && element.player) {

			} else if (element.tag != 'Monster') {
				if (!TS3.playerMgr.getPlayer(element.tag)) {
					continue
				} else {

				}
			}

			if (this._hitObjGuid.includes(element.gameObjectId))
				continue

			if (this._type == 1 || this._type == 3 || this._type == 4) {
				if (this._hitObjGuid.includes(element.gameObjectId))
					continue
				else {
					if (TS3.playerMgr.getPlayer(element.tag)) {
						this._hitObjGuid.push(element.tag)
					} else {
						this._hitObjGuid.push(element.gameObjectId)
					}
				}
			} else {
				this._skill.onHit(element.gameObjectId, this._buffName, this._damage, this._damageRate, this._effect, this._music,
					this._isOwn, this._obj.worldTransform.position);
			}
		}
		if (this._type != 2 && this._hitObjGuid.length > 0) {
			let res: boolean = false
			for (const element of this._hitObjGuid) {
				let tmpRes = this._skill.onHit(element, this._buffName, this._damage, this._damageRate, this._effect, this._music,
					this._isOwn, this._obj.worldTransform.position)
				if (tmpRes != 0) {
					if (this._type == 3) {
						res = true
					} else if (this._type == 1) {
						if (tmpRes == 1) {
							this.deActive();
							res = true
							break;
						}
					} else if (this._type == 4) {
						if (tmpRes == 1)
							break;
					}
				}
			}
			if (res) {
				this.deActive()
			}
		}
	}
	public abstract update(dt: number);
}
