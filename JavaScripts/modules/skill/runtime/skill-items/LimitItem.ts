import { RuntimeConst } from "../Const";
import { ISkillEntity, ISkillItemParam, ISkillLine, ISkillTimer } from "../../define/SkillDefine";
import { SkillBaseItem } from "./BaseItem";
import { BehaviorType, SkillItemType } from "../../define/SkillDefine";
/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2022-11-16 09:23
 * @LastEditTime : 2022-12-12 16:21
 * @description  : 
 */
export class LimitItem extends SkillBaseItem {

    private _moveScale: number = 1;
    private _rotScale: number = 1;

    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        if (this.isLocalPlayer(entity)) {
            let playr = entity.host as mw.Character;
            if (!playr || playr.maxWalkSpeed == undefined)
                return;
            timer.params[0] = RuntimeConst.MAX_WALK_SPEED;
            timer.params[1] = RuntimeConst.MAX_ROT_SPEED;
            playr.maxWalkSpeed *= this._moveScale;
            playr.rotateRate *= this._rotScale;
        }
    }

    protected onParse(data: ISkillItemParam) {
        this._moveScale = data.p1 ? data.p1 : undefined;
        this._rotScale = data.p2 ? data.p2 : undefined;
    }
    protected onLife(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): void {
        if (this.isLocalPlayer(entity)) {
            let playr = entity.host as mw.Character;
            if (!playr || playr.maxWalkSpeed == undefined)
                return;
            playr.maxWalkSpeed = timer.params[0];
            playr.rotateRate = timer.params[1];
        }
    }
    public get type(): SkillItemType {
        return SkillItemType.Limit;
    }

}