/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-08-05 10:45:49
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-08-11 21:25:28
 * @FilePath: \mollywoodschool\JavaScripts\modules\skill\bullettrriger\BulletTrrigerMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ISkillLevelElement } from "../../../config/SkillLevel";
import { Class } from "../../../const/GlobalData";
import { bulletClass } from "../../../ExtensionType";
import { updater } from "../../fight/utils/Updater";
import SkillBase from "../logic/SkillBase";
import { BulletTrrigerBase } from "./BulletTrrigerBase";

/**
 * @Author       : 田可成
 * @Date         : 2023-03-08 14:41:20
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-05 11:42:14
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\bullettrriger\BulletTrrigerMgr.ts
 * @Description  : 
 */
export default class BulletTrrigerMgr {
    private _myBulletMap: Map<string, BulletTrrigerBase> = new Map()
    private static _instance: BulletTrrigerMgr;

    public static get instance() {
        if (!this._instance) {
            this._instance = new BulletTrrigerMgr();
        }
        return this._instance;
    }

    public createBullet(obj: mw.GameObject, bulletID: string, life: number, skill: SkillBase, levelElem: ISkillLevelElement, buffName: string, damage: number, damageRate: number, trrigerConfig: string, trrigerConfig2: string, isOwn: boolean) {
        let newBulletTrriger: BulletTrrigerBase
        const config = trrigerConfig.split(":")
        // if (!this._myBulletMap.has(obj.gameObjectId)) {
        newBulletTrriger = new (bulletClass.get(config[0]))()
        this._myBulletMap.set(obj.gameObjectId, newBulletTrriger)
        // } else {
        //     newBulletTrriger = this._myBulletMap.get(obj.gameObjectId)
        // }
        newBulletTrriger.init(obj, bulletID, life, skill, levelElem, buffName, damage, damageRate, config[1], trrigerConfig2, isOwn)
    }

    public stopBullet() {
        for (const [k, bullet] of this._myBulletMap) {
            if (bullet.isActive) {
                bullet.deActive()
                break
            }
        }
    }

    @updater.updateByFrameInterval(20)
    public update(dt: number) {
        //TODO：如有性能问题就改为每5帧检测
        // if (++this._updateTime % 3 != 0) return;
        for (const key of this._myBulletMap) {
            if (key[1].isActive) key[1].update(dt)
        }
    }
}
export function registerBulletTrriger() {
    return function <T extends BulletTrrigerBase>(constructor: Class<T>) {
        bulletClass.set(constructor.name, constructor)
    };
}
BulletTrrigerMgr.instance