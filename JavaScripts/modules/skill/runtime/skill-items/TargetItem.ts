
import { ISkillEntity, ISkillItemParam, ISkillLine, ISkillTimer } from "../../define/SkillDefine";
import { SkillBaseItem } from "./BaseItem";
import { BehaviorType, SkillItemType } from "../../define/SkillDefine";
import { RunTimeUtil } from "../RunTimeUtil";

/*
 * @Author: xianjie.xia
 * @LastEditors: xianjie.xia
 * @Date: 2022-10-13 17:15
 * @LastEditTime: 2022-11-23 15:19
 * @description: 
 */
export class TargetItem extends SkillBaseItem {

    public kind: number;   //方式
    public range: number;  //范围
    public width: number;
    public deltaZ: number;
    public max: number; //目最大标数

    private _auto = false;
    private _radius = 0;
    private tempDir: mw.Vector;
    private far: number;
    private angel: number;
    protected onParse(data: ISkillItemParam) {
        this.tempDir = new mw.Vector();
        // if (data.t == this.type) {
        this.kind = data.p1 ? data.p1 : 0;
        this._radius = data.p2 && data.p2.length > 0 ? data.p2[0] : 0;
        this.range = this._radius * this._radius;
        this.width = data.p2 && data.p2.length > 1 ? data.p2[1] : 0;
        this.deltaZ = data.p4 >= 0 ? data.p4 : -1;
        this.max = data.p3 ? data.p3 : 0;
        this.far = this.width * this.width;
        this.angel = data.p2 && data.p2.length > 2 ? data.p2[2] : 0;
        this._auto = data.p5 > 0;
        //}
    }
    public get type(): SkillItemType {
        return SkillItemType.Target;
    }

    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        if (this.isLocalPlayer(entity)) {
            let targets = [];
            let objs: mw.GameObject[] = [];
            let pos = entity.host.worldTransform.position.clone();
            let forward = entity.host.worldTransform.getForwardVector();
            if (this.way == 1) {
                if (entity.param.pos)
                    pos = entity.param.pos.clone();
                if (entity.param.dir)
                    forward = entity.param.dir;
            }
            if (this._auto) {
                targets = QueryUtil.sphereOverlap(pos, this._radius, mw.SystemUtil.isPIE);
            }
            else {
                entity.value = this.value;
                entity.itemId = this.id;
                targets = entity.obj.behavior(entity, BehaviorType.FindTarget) as mw.GameObject[];
                if (!targets || targets.length < 1) {
                    console.log('目标源为空')
                    return objs
                }
            }
            switch (this.kind) {
                case 1:
                    objs = RunTimeUtil.getRangeObjs(targets, pos, this.range, this.deltaZ);
                    break;
                case 2:
                    objs = this.getForwardObjs(targets, pos, forward, timer, this.deltaZ);
                    break;
                case 3:
                    objs = this.getFanObjs(targets, pos, forward, timer, this.deltaZ);
                    break;
            }
            //优先近的
            if (this.max > 0 && objs.length > this.max) {
                objs.sort((a, b) => { return mw.Vector.squaredDistance(a.worldTransform.position, pos) - mw.Vector.squaredDistance(b.worldTransform.position, pos) })
                objs = objs.slice(0, this.max);
            }
            super.onLoaclBehavior(entity, BehaviorType.Target, objs)
        }
    }

    public getForwardObjs(list: any[], pos: mw.Vector, forword: mw.Vector, timer, dz = -1) {

        let objs = [];
        let pz = pos.z;
        for (let i = 0; i < list.length; i++) {
            let obj = list[i] as mw.GameObject;
            let dest = obj.worldTransform.position.clone();
            if (!dest) {
                console.error('错误的输入对象')
                continue;
            }
            //高度差
            if (dz >= 0 && Math.abs(pz - dest.z) > dz)
                continue;
            pos.z = dest.z = 0;
            let dis = mw.Vector.squaredDistance(pos, dest);
            if (dis > this.range)
                continue;

            mw.Vector.subtract(dest, pos, this.tempDir);
            this.tempDir.normalize();

            let angle = mw.Vector.angle(this.tempDir, forword);
            //console.log('angle:',angle);
            if (Math.abs(angle) >= 90) {
                continue;
            }

            let sin = Math.sin(angle / 57.296);
            let dx = Math.abs(sin * Math.sqrt(dis));
            let mx = this.width * 0.5;     //前方宽度(人物半径)，待验证
            if (dx < mx) {
                //console.log('dx:',dx);
                objs.push(obj);
                // timer.params[0]--;
                // if (timer.params[0] < 1)
                //     break;
            }
        }
        return objs;
    }
    /**
     * 
     * @param list 源列表
     * @param pos 位置
     * @param forword 方向
     * @param timer 运行中信息
     * @param dz 高度差
     */
    public getFanObjs(list: any[], pos: mw.Vector, forword: mw.Vector, timer, dz = -1) {
        let objs = [];
        let pz = pos.z;
        for (let i = 0; i < list.length; i++) {
            let obj = list[i] as mw.GameObject;
            let dest = obj.worldTransform.position.clone();
            if (!dest) {
                console.error('错误的输入对象')
                continue;
            }
            //高度差
            if (dz >= 0 && Math.abs(pz - dest.z) > dz)
                continue;
            pos.z = dest.z = 0;
            let dis = mw.Vector.squaredDistance(pos, dest);
            if (dis > this.far || dis < this.range)
                continue;

            mw.Vector.subtract(dest, pos, this.tempDir);
            this.tempDir.normalize();

            let angle = mw.Vector.angle(this.tempDir, forword);
            //角度在扇形的一半
            if (Math.abs(angle) <= this.angel * 0.5) {
                objs.push(obj);
                // timer.params[0]--;
                // if (timer.params[0] < 1)
                //     break;
            }
        }
        return objs;
    }
}
