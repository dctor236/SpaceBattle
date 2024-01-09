import { ISkillEntity, ISkillItemParam, ISkillLine, ISkillTimer } from "../../define/SkillDefine";
import { SkillBaseItem } from "./BaseItem";
import { BehaviorType, SkillItemType } from "../../define/SkillDefine";
/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2022-12-06 11:24
 * @LastEditTime : 2022-12-12 14:13
 * @description  : 
 */
export class TransfromItem extends SkillBaseItem {
    private _delta = new mw.Vector(0, 0, 0);
    private _temp = new mw.Rotation(0, 0, 0);
    private _rate = 1;
    private _endSet = false;

    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        let rot = entity.host.worldTransform.rotation;
        timer.params[0] = rot.x;
        timer.params[1] = rot.y;
        timer.params[2] = rot.z;
        if (this.life == 0)
            this.setRot(entity.host);
        //相对于60帧的计算
        this._rate = Math.floor(line.delta / 0.00167) * 0.1;
        if (this._rate < 0.6)
            this._rate = 0.6;
        else if (this._rate > 2)
            this._rate = 2;
        this._delta.x *= this._rate;
        this._delta.y *= this._rate;
        this._delta.z *= this._rate;
        //console.log('rate', this._rate);
    }
    protected onUpdate(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): boolean {
        if (!entity.host || !entity.host.worldTransform.rotation)
            return true;
        timer.params[0] -= line.delta;
        let rot = entity.host.worldTransform.rotation;
        this._temp.x = rot.x + this._delta.x;
        this._temp.y = rot.y + this._delta.y;
        this._temp.z = rot.z + this._delta.z;
        this.setRot(entity.host);
        return super.onUpdate(entity, line, timer);
    }

    protected onParse(data: ISkillItemParam) {
        if (data.p1) {
            this._delta.x = data.p1[0];
            this._delta.y = data.p1[1];
            this._delta.z = data.p1[2];
        }
        this._endSet = data.p2 ? true : false;
    }
    private setRot(obj: mw.GameObject) {
        obj.worldTransform.rotation = this._temp;
    }
    protected onLife(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): void {
        if (this._endSet) {
            this._temp.x = timer.params[0];
            this._temp.y = timer.params[1];
            this._temp.z = timer.params[2];
            this.setRot(entity.host);
        }
    }
    public get type(): SkillItemType {
        return SkillItemType.Transfrom;
    }

}