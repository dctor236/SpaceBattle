import { getMyPlayerID } from "../../../ExtensionType";
import { BehaviorType, ISkillEntity, SkillItemType } from "../define/SkillDefine";


/** 
 * @Author       : xianjie.xia
 * @LastEditors  : 田可成
 * @Date         : 2023-03-06 13:29
 * @LastEditTime : 2023-04-14 11:20:20
 * @description  : 
 */
export let testBehivor = (entity: ISkillEntity, type: BehaviorType, ...params) => {
    switch (type) {
        case BehaviorType.CastStart:
            console.log('开始释放引导'); break;
        case BehaviorType.CastBreak:
            console.log('释放中断')
            break;
        case BehaviorType.CastEnd:
            console.log('释放引导完成')
            break;
        case BehaviorType.Event:   //编辑器中事件模块的返回
            //事件ID
            console.log(params[0])
            break;
        case BehaviorType.ItemStart: //模块执行
            //模块类型
            let it = params[0] as SkillItemType;
            console.log(it + '模块开始');
            break;
        case BehaviorType.ItemEnd: //模块执行完成
            //console.log(params[0])
            break;
        case BehaviorType.FindTarget: //编辑器索敌功能回调用此来获取有那些目标
            {
                if (entity.skillId == 100) {    //可根据技能ID来分别确定可选目标
                    //....
                }
                //其他所有玩家
                let objs = [];
                let players = Player.getAllPlayers();
                let curId = getMyPlayerID();
                for (let i = 0; i < players.length; i++) {
                    let p = players[i];
                    if (p.playerId != curId)
                        objs.push(p.character);
                }
                //return this.targets;
            }
        case BehaviorType.Target:    //索敌模块返回符合调价的目标
            let objs = params[0] ? params[0] : [];
            for (let i = 0; i < objs.length; i++) {
                let obj = objs[i] as mw.GameObject;
                console.log(obj.name + '被伤害');
            }
            if (objs.length < 1)
                console.log('没有目标');
            break;
        case BehaviorType.End:    //所有技能模块执行完返回
            // console.log('释放完成')
            break;
    }
}