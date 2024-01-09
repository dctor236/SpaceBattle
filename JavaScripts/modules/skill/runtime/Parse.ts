/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2022-12-06 11:24
 * @LastEditTime : 2023-06-27 17:27
 * @description  : 
 */

import { ActionItem } from "./skill-items/ActionItem";
import { EffectItem } from "./skill-items/EffectItem";
import { EventItem } from "./skill-items/EventItem";
import { CastItem } from "./skill-items/CastItem";
import { MoveItem } from "./skill-items/MoveItem";
import { SoundItem } from "./skill-items/SoundItem";
import { TargetItem } from "./skill-items/TargetItem";
import { LimitItem } from "./skill-items/LimitItem";
import { GroupItem } from "./skill-items/GroupItem";
import { TransfromItem } from "./skill-items/TransfromItem";
import { ISkillBaseItem, SkillGroup } from "../define/SkillDefine";
import { SkillObject } from "./SkillObject";
import { SkillItemType } from "../define/SkillDefine";
import { PutItem } from "./skill-items/PutItem";

/*
* @Author: zhaolei
* @Date: 2022-10-08 11:29:48
 * @LastEditors: xianjie.xia
* @Description: $1
*/
export namespace Parse {

    const types: Map<SkillItemType, new () => ISkillBaseItem> = new Map();
    const evelFun = eval;
    export function parse(config: string) {
        const data = evelFun('(' + config + ')');
        let obj = new SkillObject();
        for (const config of data) {
            const group = parseGroup(config);
            obj.groups.push(group);
        }
        return obj;
    }
    function register(type: SkillItemType, itemCls: new () => ISkillBaseItem) {
        types.set(type, itemCls);
    }
    function parseGroup(config: { [key: string]: string | number }[]) {
        const group = new SkillGroup();
        for (const data of config) {
            const itemCls = types.get(data.t as SkillItemType);
            if (itemCls) {
                const item = new itemCls();
                item.parse(data);
                group.add(item);
            }
        }
        return group;
    }

    register(SkillItemType.Action, ActionItem);
    register(SkillItemType.Effect, EffectItem);
    register(SkillItemType.Event, EventItem);
    register(SkillItemType.Move, MoveItem);
    register(SkillItemType.Target, TargetItem);
    register(SkillItemType.Sound, SoundItem);
    register(SkillItemType.Cast, CastItem);
    register(SkillItemType.Limit, LimitItem);
    register(SkillItemType.Loop, GroupItem);
    register(SkillItemType.Transfrom, TransfromItem);
    register(SkillItemType.Put, PutItem);
}