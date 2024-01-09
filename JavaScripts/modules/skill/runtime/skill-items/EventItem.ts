

import { BehaviorType, ISkillEntity, ISkillItemParam, ISkillLine, ISkillTimer, SkillItemType } from "../../define/SkillDefine";
import { SkillBaseItem } from "./BaseItem";
/** 
 * @Author       : xianjie.xia
 * @LastEditors  : 田可成
 * @Date         : 2022-12-06 11:24
 * @LastEditTime : 2023-03-08 16:37:23
 * @description  : 
 */
export class EventItem extends SkillBaseItem {

    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        super.onLoaclBehavior(entity, BehaviorType.Event, this.id)
    }

    protected onParse(data: ISkillItemParam) {
        this.id = data.p1 ? data.p1 : 0;
    }

    public get type(): SkillItemType {
        return SkillItemType.Event;
    }

}