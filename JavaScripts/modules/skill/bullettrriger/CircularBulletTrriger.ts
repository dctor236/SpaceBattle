/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-07-27 22:42:24
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-08-11 20:59:13
 * @FilePath: \mollywoodschool\JavaScripts\modules\skill\bullettrriger\CircularBulletTrriger.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ISkillLevelElement } from "../../../config/SkillLevel";
import SkillBase from "../logic/SkillBase";
import { BulletTrrigerBase } from "./BulletTrrigerBase";
import { registerBulletTrriger } from "./BulletTrrigerMgr";

/**
 * @Author       : 田可成
 * @Date         : 2023-03-16 18:23:18
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-04 18:28:30
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\bullettrriger\CircularBulletTrriger.ts
 * @Description  : 
 */
@registerBulletTrriger()
export class CircularBulletTrriger extends BulletTrrigerBase {
    private _r: number = 1
    public init(obj: mw.GameObject, bulletID: string, life: number, skill: SkillBase, levelElem: ISkillLevelElement, buffName: string, damage: number, damageRate: number, trrigerConfig?: string, trrigerConfig2?: string, isOwn?: boolean) {
        super.init(obj, bulletID, life, skill, levelElem, buffName, damage, damageRate, trrigerConfig, trrigerConfig2, isOwn)
        trrigerConfig = trrigerConfig.split("movex=")[1]
        this._movex = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("movey=")[1]
        this._movey = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("movez=")[1]
        this._movez = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
        trrigerConfig = trrigerConfig.split("r=")[1]
        this._r = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")))
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
    }

    public update(dt: number) {
        this._start = this._obj.worldTransform.position.clone()
        this._start.x += this._movex; this._start.y += this._movey; this._start.z += this._movez
        const res = QueryUtil.sphereOverlap(this._start, this._r * this._speed, false, this._hitObjGuid, false, this._character)
        this.hitAnything(res)
    }
}