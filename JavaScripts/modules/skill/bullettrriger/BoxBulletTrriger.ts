import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';

/**
 * @Author       : 田可成
 * @Date         : 2023-03-16 19:01:29
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-05 11:43:22
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\bullettrriger\BoxBulletTrriger.ts
 * @Description  : 
 */
import { GameConfig } from "../../../config/GameConfig";
import { ISkillLevelElement } from "../../../config/SkillLevel";
import SkillBase from "../logic/SkillBase";
import SkillUI from "../ui/SkillUI";
import { BulletTrrigerBase } from "./BulletTrrigerBase";
import { registerBulletTrriger } from "./BulletTrrigerMgr";
/**
 * 飞行子弹沿路边检测边攻击
 */

@registerBulletTrriger()
export class BoxBulletTrriger extends BulletTrrigerBase {
    public init(obj: mw.GameObject, bulletID: string, life: number, skill: SkillBase, levelElem: ISkillLevelElement, buffName: string, damage: number, damageRate: number, trrigerConfig?: string, trrigerConfig2?: string, isOwn?: boolean) {
        super.init(obj, bulletID, life, skill, levelElem, buffName, damage, damageRate, trrigerConfig, trrigerConfig2, isOwn)
        trrigerConfig = trrigerConfig.split("movex=")[1]
        this._movex = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("movey=")[1]
        this._movey = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("movez=")[1]
        this._movez = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("x=")[1]
        this._x = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(","))) / 2
        trrigerConfig = trrigerConfig.split("y=")[1]
        this._y = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(","))) / 2
        trrigerConfig = trrigerConfig.split("z=")[1]
        this._z = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(","))) / 2
        trrigerConfig = trrigerConfig.split("type=")[1]
        this._type = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("interval=")[1]
        this.inspectInteval = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("effect=")[1]
        this._effect = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        this._music = Number(trrigerConfig.split("music=")[1]) || 50

        trrigerConfig2 = trrigerConfig2.split("size=")[1]
        const tmpSize = Number(trrigerConfig2.substring(0, trrigerConfig2.indexOf(",")))
        this._obj.worldTransform.scale = new Vector(tmpSize, tmpSize, tmpSize)
        this._obj.worldTransform.position = new Vector(this._obj.worldTransform.position.x, this._obj.worldTransform.position.y, this._obj.worldTransform.position.z + this._movez)
        trrigerConfig2 = trrigerConfig2.split("speed=")[1]
        this._speed = Number(trrigerConfig2.substring(0, trrigerConfig2.indexOf(",")))
        trrigerConfig2 = trrigerConfig2.split("damageTime=")[1]
        this._damageTime = Number(trrigerConfig2.substring(0, trrigerConfig2.indexOf(",")))
        trrigerConfig2 = trrigerConfig2.split("fireMusic=")[1]
        this.fireMusic = Number(trrigerConfig2.substring(0, trrigerConfig2.indexOf(",")))
        this.fireEff = Number(trrigerConfig2.split("fireEff=")[1])
        // 获取角色身上到准星位置的向量，最大距离5000(50格)

        if (!this.skillLevelElem) return
        const skillUI = mw.UIService.getUI(SkillUI)
        if (this.skillLevelElem.isTelescope == 0) {
            let cam = Camera.currentCamera;
            let dir = cam.worldTransform.getForwardVector();
            let start = cam.worldTransform.position.add(mw.Vector.multiply(dir, 30));
            this.shotDir = GeneralManager.modifyGetShootDir(this._character, start, this._x * this._speed)
            const result = InputUtil.convertScreenLocationToWorldSpace(skillUI.point.position.x, skillUI.point.position.y)
            this.initPos = result.worldPosition.add(mw.Vector.multiply(dir, 250))
        } else {
            this.shotDir = this._obj.worldTransform.getForwardVector()
            this.initPos = this._obj.worldTransform.position.add(new Vector(this.shotDir.x * this._x + this._movex, this.shotDir.y * this._y + this._movey,
                this.shotDir.z * this._z))
            const forward2 = this._obj.worldTransform.getForwardVector().normalized.multiply(this._movex)
            const right = this._obj.worldTransform.getRightVector().normalized.multiply(this._movey)
            this.initPos.set(this._obj.worldTransform.position.add(right).add(forward2))
        }
    }
    initPos: Vector = Vector.zero
    shotDir: Vector
    public update(dt: number) {
        // if (!this.skillLevelElem) return
        //不能移动子弹了
        if (this.tmpInspectInteval <= 0) {
            this.tmpInspectInteval = this.inspectInteval
            // 获取角色身上到准星位置的向量，最大距离5000(50格)
            if (this._start.x == 0 && this._start.y == 0 && this._start.z == 0) this._start.set(this.initPos)
            else {
                this._start.set(this._end)
            }
            if (this.skillLevelElem.isTelescope >= 1) {
                this._end.set(this._start.clone().add(this.shotDir.clone().multiply(this._x * this._speed)))
            } else {
                const forward = this._obj.worldTransform.getForwardVector()
                this._end.set(this._start.x + forward.x * this._x * this._speed,
                    this._start.y + forward.y * this._x * this._speed,
                    this._start.z + forward.z * this._x * this._speed)
            }
        } else {
            this.tmpInspectInteval -= dt
        }

        //间隔扣血
        if (this.tmpDamageInteval <= 0) {
            this.tmpDamageInteval = this._damageTime
            const res = GeneralManager.modiftboxOverlap(this._start, this._end, this._y * this._speed, this._z * this._speed, false, this._hitObjGuid, false, this._character)
            this.hitAnything(res)
        } else {
            this.tmpDamageInteval -= dt
        }
    }
}