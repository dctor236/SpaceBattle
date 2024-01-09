
import { getMyPlayerID } from "../../../../ExtensionType";
import { BehaviorType, ISkillEntity, ISkillItemParam, ISkillLine, ISkillTimer, SkillItemType } from "../../define/SkillDefine";
import { SkillBaseItem } from "./BaseItem";
/** 
 * @Author       : xianjie.xia
 * @LastEditors  : 田可成
 * @Date         : 2022-12-06 11:24
 * @LastEditTime : 2023-04-14 11:20:46
 * @description  : 暂不用
 */


export class BuffItem extends SkillBaseItem {

    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        let pid = getMyPlayerID()
        if (entity.clientId == pid) {
            // entity.obj.behavior(entity, BehaviorType.AddBuff, this.id, this.value);
        }
        return true;
    }

    protected onParse(data: ISkillItemParam) {
        if (data.t == this.type) {
            this.id = data.p1 ? data.p1 : 0;
        }
    }

    public get type(): SkillItemType {
        return SkillItemType.None;
    }

}