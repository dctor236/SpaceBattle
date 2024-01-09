import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
/*
* @Author: 代纯 chun.dai@appshahe.com
* @Date: 2023-08-11 20:46:49
* @LastEditors: 代纯 chun.dai@appshahe.com
* @LastEditTime: 2023-08-11 21:04:53
* @FilePath: \mollywoodschool\JavaScripts\modules\skill\bullettrriger\BoxBullet2Trriger.ts
* @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
*/

/**
 * @Author       : 田可成
 * @Date         : 2023-03-16 19:01:29
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-05 11:43:22
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\bullettrriger\BoxBulletTrriger.ts
 * @Description  : 
 */
import { EffectManager, Tween } from "../../../ExtensionType";
import { TS3 } from "../../../ts3/TS3";
import { PlayerMgr } from "../../../ts3/player/PlayerMgr";
import SkillBase from "../logic/SkillBase";
import { BoxBulletTrriger } from "./BoxBulletTrriger";
import { registerBulletTrriger } from "./BulletTrrigerMgr";
import GameUtils from "../../../utils/GameUtils";
import { GameConfig } from "../../../config/GameConfig";
import { GlobalData } from "../../../const/GlobalData";
import { ISkillLevelElement } from "../../../config/SkillLevel";
/**
 * 游走停留aoe子弹
 */

@registerBulletTrriger()
export class StayBoxBulletTrriger extends BoxBulletTrriger {
    protected _movex: number = 0
    protected _movey: number = 0
    protected _movez: number = 0
    protected _x: number = 1
    protected _y: number = 1
    protected _z: number = 1
    protected inspectInteval: number = 0
    protected _end: mw.Vector = mw.Vector.zero
    public init(obj: mw.GameObject, bulletID: string, life: number, skill: SkillBase, levelElem: ISkillLevelElement, buffName: string, damage: number, damageRate: number, trrigerConfig?: string, trrigerConfig2?: string, isOwn?: boolean) {
        super.init(obj, bulletID, life, skill, levelElem, buffName, damage, damageRate, trrigerConfig, trrigerConfig2, isOwn)
    }
    private _updeteInteval: number = 0

    targetPos: Vector = Vector.zero
    targetRot: Rotation = Rotation.zero
    targetDir: Vector = Vector.zero

    /**间隔扣血 */
    public update(dt: number) {
        //不能移动子弹了
        if (this._isOwn && TS3.playerMgr.mainPlayer.isDead()) {
            this.deActive()
            return
        }
        if (this._damageTime <= 0) return
        if (this._updeteInteval <= 0) {
            this._updeteInteval = this._damageTime / 100
            if (this._isOwn && this.skillElem.IsSupport) {
                let m = TS3.monsterMgr.getMonster(GlobalData.RedAnimMid)// TS3.monsterMgr.getNearMonster(1500, this._character.worldTransform.position);
                if (m) {
                    this.targetPos.set(m.pos)
                    this.targetDir = this.targetPos.subtract(this._character.worldTransform.position).normalize()
                    this.targetRot = mw.Quaternion.rotationTo(
                        mw.Vector.forward,
                        this.targetDir
                    ).toRotation();

                    this._character.worldTransform.rotation = new Rotation(0, 0, this.targetRot.z)
                }

            }
            //间隔扣血
            const forward = PlayerMgr.Inst.mainCharacter.worldTransform.getForwardVector()
            const forward2 = PlayerMgr.Inst.mainCharacter.worldTransform.getForwardVector().normalized.multiply(this._movex)
            const right = PlayerMgr.Inst.mainCharacter.worldTransform.getRightVector().normalized.multiply(this._movey)
            this._start.set(PlayerMgr.Inst.mainCharacter.worldTransform.position.add(right).add(forward2))
            this._end.set(this._start.x + forward.x * this._speed * this._life / this.inspectInteval / 2,
                this._start.y + forward.y * this._x * this._speed * this._life / this.inspectInteval / 2,
                this._start.z + forward.z * this._x * this._speed * this._life / this.inspectInteval / 2)

            if (this._isOwn) {
                if (this.fireMusic != -1) {
                    GameUtils.playSoundOrBgm(this.fireMusic, this._character)
                }

                if (this.fireEff != -1) {
                    const eff = GameConfig.Effect.getElement(this.fireEff)
                    if (eff)
                        GeneralManager.rpcPlayEffectOnPlayer(eff.EffectID, Player.localPlayer, eff.EffectPoint, 1,
                            new Vector(eff.EffectLocation), new Rotation(eff.EffectRotate), new Vector(eff.EffectLarge))
                }
                const res = GeneralManager.modiftboxOverlap(this._start, this._end, this._y * this._movex, this._z * this._movex, false, this._hitObjGuid, false, this._character)
                this._hitObjGuid.length = 0
                this.hitAnything(res)
            }
        } else {
            this._updeteInteval -= dt
        }
    }

    public deActive(): void {
        super.deActive()
    }
}