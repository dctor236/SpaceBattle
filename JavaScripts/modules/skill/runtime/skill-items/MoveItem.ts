import { ISkillEntity, ISkillItemParam, ISkillLine, ISkillTimer } from "../../define/SkillDefine";
import { SkillBaseItem } from "./BaseItem";

import { RuntimeConst } from "../Const";
import { ESkillEvent } from "../SkillRuntime";
import { BehaviorType, SkillItemType } from "../../define/SkillDefine";
import { RunTimeUtil } from "../RunTimeUtil";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2022-11-16 09:23
 * @LastEditTime : 2022-12-29 15:22
 * @description  : 
 */
export class MoveItem extends SkillBaseItem {

    private _distance: number;
    private _speed: number;
    private _crossNum: number;
    private _crossRole: boolean = false;
    private _crossTag: boolean = false;
    private _dir: mw.Vector = new mw.Vector(0, 0, 0);
    private _angel = 0;

    protected onUpdate(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): boolean {
        if (timer.params[0] > 0) {//&& 
            const host = entity.host;
            if (!host || !host.worldTransform.position)
                return true;
            const loc = host.worldTransform.position;
            let dir = timer.params[1];
            let len = this._speed * line.delta;
            if (len > this._distance)
                len = this._distance;
            loc.z = timer.params[2] ? timer.params[2] : loc.z;
            mw.Vector.multiply(dir, len, RuntimeConst.TEMP_VECTOR);
            mw.Vector.add(loc, RuntimeConst.TEMP_VECTOR, RuntimeConst.TEMP_VECTOR);
            //let dz = RuntimeConst.TEMP_VECTOR.z;
            // mw.Vector.multiply(forward, 20, RuntimeConst.VECTEMP1);
            // mw.Vector.add(loc, RuntimeConst.VECTEMP1, RuntimeConst.VECTEMP1);
            timer.params[2] = RuntimeConst.TEMP_VECTOR.z;
            RuntimeConst.VECTEMP1.x = loc.x;
            RuntimeConst.VECTEMP1.y = loc.y;
            RuntimeConst.VECTEMP1.z = RuntimeConst.VECTEMP2.z = loc.z / 3;
            let dis = len < 40 ? 40 : len;
            mw.Vector.multiply(dir, dis, RuntimeConst.VECTEMP2);
            mw.Vector.add(RuntimeConst.VECTEMP1, RuntimeConst.VECTEMP2, RuntimeConst.VECTEMP2);

            const result = QueryUtil.lineTrace(RuntimeConst.VECTEMP1, RuntimeConst.VECTEMP2, true, false);
            for (let i = 0; i < result.length; i++) {
                let res = result[i];
                let obj = res.gameObject;
                // if (obj instanceof mw.PlayerStart) {
                //     //console.log(obj.name)
                //     continue;
                // }
                if (obj.gameObjectId == entity.host.gameObjectId)
                    continue;
                if (this._crossRole && RunTimeUtil.getCharacterBase(obj)) {
                    continue;
                }
                if (this._crossTag) {
                    if (obj.tag) {
                        let tag = obj.tag.toLowerCase();
                        if (tag.indexOf('cross') >= 0)
                            continue;
                    }
                }
                timer.params[0] = 0;
                const pos = res.impactPoint;
                mw.Vector.multiply(dir, -25, RuntimeConst.TEMP_VECTOR);
                mw.Vector.add(pos, RuntimeConst.TEMP_VECTOR, RuntimeConst.TEMP_VECTOR);
            }
            RuntimeConst.TEMP_VECTOR.z = timer.params[2];
            //console.log(timer.params[2]);
            entity.host.worldTransform.position = RuntimeConst.TEMP_VECTOR;
        }
        timer.params[0] -= line.delta;
        return timer.params[0] <= 0;
    }

    protected onLife(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): void {
        if (this.isLocalPlayer(entity) && entity.host) {
            let host = entity.host;
            Event.dispatchToServer(ESkillEvent.SE_MOVED, host.gameObjectId, host.worldTransform.position, host.worldTransform.rotation);
        }
    }
    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        //if (this.isLocalPlayer(entity))
        timer.params[0] = this.life;
        let dir = entity.host.worldTransform.getForwardVector();
        if (this.way == 1 && entity.param.dir)
            dir = entity.param.dir.normalize();
        timer.params[1] = dir;
        if (this._dir.magnitude > 0) {
            let forward = dir.clone();
            if (this._angel > 0)
                mw.Vector.rotateZ(forward, mw.Vector.zero, this._angel, forward);
            // forward.x *= this._dir.x;
            // forward.y *= this._dir.y;
            // forward.normalize();
            if (this._dir.x == 0 && this._dir.y == 0)
                forward.x = forward.y = 0;
            forward.z = this._dir.z;
            timer.params[1] = forward;
        }
    }

    protected onParse(data: ISkillItemParam) {
        if (data.t == this.type) {
            this._distance = data.p1 ? parseFloat(data.p1) : 0;
            this._speed = this._distance / this.life;
            this._crossNum = data.p3 ? data.p3 : 0;
            this._crossRole = (this._crossNum & 1) == 1;
            this._crossTag = (this._crossNum & 2) == 2;
            //console.log(data.p2.toString())
            if (data.p2 && data.p2.length > 2) {
                this._dir.x = data.p2[0];
                this._dir.y = data.p2[1];
                this._dir.z = data.p2[2];
                RuntimeConst.TempV2.x = this._dir.x;
                RuntimeConst.TempV2.y = this._dir.y;
                if (RuntimeConst.TempV2.magnitude > 0) {
                    RuntimeConst.TempV2 = RuntimeConst.TempV2.normalize();
                    this._angel = mw.Vector2.angle(RuntimeConst.BaseDir, RuntimeConst.TempV2) / 57.296;
                }
            }

        }
    }

    public get type(): SkillItemType {
        return SkillItemType.Move;
    }

}