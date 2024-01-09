import { BehaviorType, ICastParam, ISkillEntity, ISkillObject } from "../define/SkillDefine";
import { RuntimeConst } from "./Const";
import { Parse } from "./Parse";
import { RunTimePool } from "./RunTimePool";
import { SkillEntity } from "./SkillEntity";
import { SkillObject } from "./SkillObject";
import { ESkillEvent, SkillRuntime } from "./SkillRuntime";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-05-05 10:15
 * @LastEditTime : 2023-05-18 14:28
 * @description  : 
 */
export namespace SkillRun {
    const skills: Map<number, SkillObject> = new Map();
    const entitys: SkillEntity[] = [];
    const objMap: Map<string, mw.GameObject> = new Map();
    /**
     * 注册技能
     * @param id 唯一技能ID
     * @param config 配置
     * @param behavior 技能需要实现的行为
     * @returns  技能配置对象 or null
     */
    export function register(id: number, config: string, behavior: (entity: ISkillEntity, type: BehaviorType, ...params) => any): ISkillObject {
        if (!config || config.length < 2)
            return null;
        if (skills.has(id))
            return skills.get(id);
        const obj = Parse.parse(config);
        obj.behavior = behavior;
        skills.set(id, obj);
        return obj;
    }

    /**
     * 清空技能运行中的对象池
     */
    export function clearPool() {
        RunTimePool.clear();
    }
    /**
     * 释放技能
     * @param host 技能宿主对象，目前使用自己
     * @param skillId 注册时的技能ID
     * @param castParam 释放参数
     */
    export function cast(host: mw.GameObject, skillId: number, castParam?: ICastParam, isreplicates: boolean = true) {
        if (!host.gameObjectId)
            return false;
        if (mw.SystemUtil.isClient()) {
            let str = JSON.stringify(castParam)
            _onCast(RuntimeConst.ClientID, host.gameObjectId, skillId, str)
            if (isreplicates) Event.dispatchToServer(ESkillEvent.SE_CAST, RuntimeConst.ClientID, host.gameObjectId, skillId, str);
        } else {
            let player = Player.getAllPlayers()[0];
            let cid = player ? player.playerId : 0;
            // RuntimeConst.RUNTIME.sendRangePlayer(host, ESkillEvent.SE_CAST, cid, host.guid, skillId, castParam)
            Event.dispatchToAllClient(ESkillEvent.SE_CAST, cid, host.gameObjectId, skillId, castParam);
        }
        return true;
    }

    // function canCast(guid: string): boolean {
    //     for (let i = 0; i < entitys.length; i++) {
    //         let entity = entitys[i];
    //         if (entity.castTime <= 0 && entity.host.guid == guid) {
    //             entity.breakoff();
    //         }
    //     }
    //     return true;
    // }
    /**
     * 打断技能，能被中断的技能才会结算
     * @param guid 释放者GUID
     * @param skillId 指定技能ID，没有则是当前在释放的技能
     */
    export function breakOff(guid: string, skillId?: number) {
        if (mw.SystemUtil.isClient()) {
            let sid = skillId ? skillId : getCurSkill(guid);
            Event.dispatchToServer(ESkillEvent.SE_BREAK, guid, sid);
        } else {
            // _onBreak(guid, skillId);
            Event.dispatchToAllClient(ESkillEvent.SE_BREAK, guid, skillId);
        }
    }
    /**
     * 结束技能，强制结束该技能
     * @param guid 释放者GUID
     * @param skillId 指定技能ID，没有则是施法者的所有技能
     */
    export function stop(guid: string, skillId?: number) {
        if (mw.SystemUtil.isClient()) {
            let sid = skillId ? skillId : getCurSkill(guid);
            Event.dispatchToServer(ESkillEvent.SE_STOP, guid, sid);
        } else {
            // _onStop(guid, skillId);
            Event.dispatchToAllClient(ESkillEvent.SE_STOP, guid, skillId);
        }
    }

    function _onCast(clientId: number, hostId: string, skillId: number, castParam?: string) {
        const obj = skills.get(skillId);
        // console.log('技能注册:' + skillId)
        if (obj) {
            let caster = objMap.get(hostId);
            let json = JSON.parse(castParam) as ICastParam;
            if (!caster) {
                GameObject.asyncFindGameObjectById(hostId).then(host => {
                    objMap.set(hostId, host);
                    const entity = new SkillEntity(clientId, host, skillId, obj, json);
                    entitys.push(entity);
                });
            }
            else if (caster.gameObjectId) {
                const entity = new SkillEntity(clientId, caster, skillId, obj, json);
                entitys.push(entity);
            }
            else
                objMap.delete(hostId);
        }
        else
            console.log('技能没有注册:', skillId, clientId, hostId)
    }

    function _onStop(guid: string, skillId?: number) {
        entitys.forEach(entity => {
            if (entity.isHostSkill(guid, skillId))
                entity.stop();
        });
    }
    function _onBreak(guid: string, skillId?: number) {
        entitys.forEach(entity => {
            if (entity.castTime > 0 && entity.isHostSkill(guid, skillId))
                entity.breakoff();
        });
    }
    function getCurSkill(guid: string): number {
        for (let i = 0; i < entitys.length; i++) {
            let entity = entitys[i];
            if (entity.host.gameObjectId == guid)
                return entity.skillId;
        }
    }
    function _onMoved(hostId: string, dest: mw.Vector, rot: mw.Rotation) {
        GameObject.asyncFindGameObjectById(hostId).then(host => {
            host.worldTransform.position = dest;
            host.worldTransform.rotation = rot;
        });
    }
    RuntimeConst.RUNTIME = new SkillRuntime({ _onCast: _onCast, _onStop: _onStop, _onBreak: _onBreak, _onMoved: _onMoved, entinys: entitys });
}
