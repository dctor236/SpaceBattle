import { BehaviorType, ISkillEntity, ISkillItemParam, ISkillLine, ISkillTimer, SkillItemType } from "../../define/SkillDefine";
import { RuntimeConst } from "../Const";
import { RunTimePool } from "../RunTimePool";
import { SkillBaseItem } from "./BaseItem";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2022-11-16 09:23
 * @LastEditTime : 2023-05-05 17:26
 * @description  : 
 */
export class PutItem extends SkillBaseItem {

    private _resId: string;
    private _distance: number;
    private _speed: number;

    private _range: number = 0;
    // private _auto: boolean = true;
    // private _fade: boolean = false;
    // private _rot: mw.Vector = new mw.Vector(0, 0, 0);
    // private _bRot = false;
    private _dTime = 0;
    private _moveTime = 0;

    // protected onUpdate(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): boolean {
    //     let pool = timer.params[0];
    //     if (!pool)
    //         return true;
    //     let obj = pool.obj;
    //     if (!obj)
    //         return true;
    //     // if (this._bRot) {  //旋
    //     //     let rot = obj.worldTransform.rotation;
    //     //     rot.x += this._rot.x * line.delta;
    //     //     rot.y += this._rot.y * line.delta;
    //     //     rot.z += this._rot.z * line.delta;
    //     //     obj.worldTransform.rotation = rot;
    //     // }
    //     // if (this._speed > 0 && timer.time < this._moveTime) { //移动
    //     //     let pos = obj.worldTransform.position;
    //     //     let len = this._speed * line.delta;
    //     //     let dir = timer.params[1];
    //     //     mw.Vector.multiply(dir, len, RuntimeConst.TEMP_VECTOR);
    //     //     mw.Vector.add(pos, RuntimeConst.TEMP_VECTOR, RuntimeConst.TEMP_VECTOR);
    //     //     obj.worldTransform.position = RuntimeConst.TEMP_VECTOR;
    //     // } [[{t:11,p1:'4336',p2:222,p3:888}]] 调整editor与runtiem目录，修改放置使用运动器控制
    //     // if (timer.time >= this._moveTime && timer.params[1])//停止运动器
    //     // {
    //     //     let mover = timer.params[1];
    //     //     // mover.parent = null;
    //     //     mover.enable = false;
    //     //     mover.constraintTarget1 = null;
    //     // }
    //     // timer.params[2] -= line.delta;
    //     // if (this._range > 0 && timer.params[2] <= 0 && this.isLocalPlayer(entity)) //索敌
    //     // {
    //     //     let targets = [];
    //     //     timer.params[2] = this._dTime;
    //     //     let pos = obj.worldTransform.position;
    //     //     if (this._auto) {
    //     //         let gs = QueryUtil.sphereOverlap(pos, this._range * 2, false);
    //     //         for (let t of gs) {
    //     //             if (t.guid == entity.host.guid)
    //     //                 continue;
    //     //             if (t.tag && t.tag.indexOf('cross') >= 0)
    //     //                 continue;
    //     //             targets.push(t);
    //     //         }
    //     //     }
    //     //     else {
    //     //         entity.value = this.value;
    //     //         targets = entity.obj.behavior(entity, BehaviorType.FindTarget) as mw.GameObject[];
    //     //     }
    //     //     let objs = RunTimeUtil.getRangeObjs(targets, pos.clone(), this._range * this._range);
    //     //     let list = [];
    //     //     for (let o of objs) {
    //     //         let guid = o.guid;
    //     //         if (timer.params[3].indexOf(guid) >= 0)
    //     //             continue;
    //     //         list.push(o);
    //     //         timer.params[3].push(guid);
    //     //     }
    //     //     if (list && list.length > 1)
    //     //         list.sort((a, b) => { return mw.Vector.squaredDistance(a.worldTransform.position, pos) - mw.Vector.squaredDistance(b.worldTransform.position, pos) })
    //     //     this.onBehavior(entity, BehaviorType.Target, list);
    //     //     if (list.length > 0 && this._fade) {
    //     //         return true;
    //     //     }
    //     // }
    //     //return super.onUpdate(entity, line, timer);
    // }

    // protected onLife(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): void {
    //     // let pool = timer.params[0]
    //     // if (pool)
    //     //     pool.despawn();
    //     // timer.params[0] = 0;
    // }
    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        if (this.life <= 0)
            return;
        let pool = RunTimePool.getPool<mw.GameObject>(this._resId).spawn(1);
        if (!pool || !pool.obj)
            return;
        let obj = pool.obj as any;
        obj.parent = null;
        if (obj.loop != undefined) {
            obj.loop = true;
            obj.play();
        }

        let host = entity.host;
        let pos = host.worldTransform.position;
        let rot = host.worldTransform.rotation
        let dir = host.worldTransform.getForwardVector();
        let param = entity.param;
        if (this.way == 1) {
            if (param.pos) {
                pos.x = param.pos.x;
                pos.y = param.pos.y;
                pos.z = param.pos.z;
            }
            if (param.rot) {
                rot.x = param.rot.x;
                rot.y = param.rot.y;
                rot.z = param.rot.z;
            }
            if (param.dir) {
                dir.x = param.dir.x;
                dir.y = param.dir.y;
                dir.z = param.dir.z;
            }
        }
        obj.worldTransform.rotation = rot;
        if (this._range != 0) {
            mw.Vector.multiply(obj.worldTransform.getForwardVector(), this._range, RuntimeConst.TEMP_VECTOR);
            mw.Vector.add(pos, RuntimeConst.TEMP_VECTOR, pos);
        }
        obj.worldTransform.position = pos;
        if (this._speed > 0) {
            dir.x = this._speed;
            dir.y = dir.z = 0;
            pool.physicsObj.asyncReady().then((mover: mw.IntegratedMover) => {
                mover.linearSpeed = dir;
                mover.linearDelayStartTime = this._dTime
                mover.enable = true;
            })
        }
        else if (this._distance > 0) //直接设置位置
        {
            mw.Vector.multiply(obj.worldTransform.getForwardVector(), this._distance, RuntimeConst.TEMP_VECTOR);
            mw.Vector.add(pos, RuntimeConst.TEMP_VECTOR, RuntimeConst.TEMP_VECTOR);
            obj.worldTransform.position = RuntimeConst.TEMP_VECTOR.clone();
        }
        pool.despawn(this.life, this._moveTime + this._dTime)
        super.onBehavior(entity, BehaviorType.ItemStart, this.type, obj, this.life);
    }

    protected onParse(data: ISkillItemParam) {
        if (data.t == this.type) {
            this._resId = data.p1 ? data.p1.toString() : '';
            this._speed = data.p2 ? parseFloat(data.p2) : 0;
            this._distance = data.p3 ? parseFloat(data.p3) : 0;
            if (Math.abs(this._speed) > 0)
                this._moveTime = this._distance / this._speed;
            if (this.life < this._moveTime)
                this.life = this._moveTime;
            this._range = data.p4 ? data.p4 : 0;
            this._dTime = data.p5 ? data.p5 : 0;
            this.life += this._dTime;
            // this._auto = (t & 1) == 1;  //自动索敌
            // this._fade = (t & 2) == 2;  //索敌消失
            // this._range = data.p6 ? data.p6 : 0;
            // if (data.p7 && data.p7.length > 2) {
            //     this._rot.x = data.p7[0];
            //     this._rot.y = data.p7[1];
            //     this._rot.z = data.p7[2];
            //     this._bRot = this._rot.magnitude > 0;
            // }
            AssetUtil.asyncDownloadAsset(this._resId);
        }
    }

    public get type(): SkillItemType {
        return SkillItemType.Put;
    }

}