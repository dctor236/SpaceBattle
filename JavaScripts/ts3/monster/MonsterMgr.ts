import { SpawnManager,SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-07-08 11:05:49
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-07-08 21:28:40
 * @FilePath: \mollywoodschool\JavaScripts\ts3\monster\MonsterMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { LogMgr } from "../com/LogMgr";
import { MonsterModuleC } from "./MonsterModuleC";
import { MonsterModuleS } from "./MonsterModuleS";
import Monster from "./Monster";
import { MonsterHeadUI } from "./MonsterHeadUI";
import { MonsterCfg, MonsterDefine, EMonsterBehaviorState } from "./MonsterDefine";
import { GameConfig } from "../../config/GameConfig";
import { EMonsterType } from "../../modules/fight/FightDefine";
import GameUtils from "../../utils/GameUtils";
/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-02 13:55
 * @LastEditTime : 2023-06-27 18:24
 * @description  :  怪物物管理器
 */
export class MonsterMgr {
    private static _inst: MonsterMgr;
    public static get Inst() {
        if (!this._inst)
            this._inst = new MonsterMgr();
        return this._inst;
    }

    private moduleC: MonsterModuleC;
    private moduleS: MonsterModuleS;


    private inited = 0;
    public async init() {
        if (this.inited > 0)
            return;
        this.inited = 2;
        ModuleService.registerModule(MonsterModuleS, MonsterModuleC, null);
        if (SystemUtil.isClient()) {
            this.moduleC = ModuleService.getModule(MonsterModuleC);
            this.moduleC.Init();
            // let obj = await GameObject.asyncFindGameObjectById('1DB2A630') as mw.GameObject;
            // await this.register(obj, { mid: '', type: 1, hp: 200, hpMax: 200 });
        }
        else {
            this.moduleS = ModuleService.getModule(MonsterModuleS);
            this.moduleS.init();
            this.createMonstersObj()
        }
        LogMgr.Inst.coreLog('怪物模块初始化完成')
    }


    /**          创建服务器怪物                   */
    private async createMonsterByType(type: EMonsterType, guid: string) {
        let obj: mw.GameObject = null
        switch (type) {
            case EMonsterType.SpaceFlight:
                obj = await SpawnManager.modifyPoolAsyncSpawn(guid);
            case EMonsterType.OfficeBoy:
                break
            default:
                break
        }
        return obj
    }


    public async createMonstersObj() {
        const elems = GameConfig.Monster.getAllElement()
        for (const elem of elems) {
            let host = elem.Guid
            let monster = await this.register(host, {
                config: elem.ID, type: elem.monsterType, name: elem.MonsterName
            });
            await TimeUtil.delaySecond(0.2)
        }
    }

    /**
     * 注册怪物
     * @param target 目标obj或是目标的GUID
     * @param maxHp 目前只有1个血量,待扩展
     * @effect 客户端注册的无属性同步等，需要请使用服务端注册
     * @returns 怪物对象
     */
    public async register(target: string | mw.GameObject, cfg: MonsterCfg): Promise<Monster> {
        if (this.isVoid)
            return null;
        let iObj = null;
        if (typeof (target) == 'string') {
            iObj = await GameObject.asyncFindGameObjectById(target);
        }
        else if (target)
            iObj = target;
        if (!iObj) {
            LogMgr.Inst.error('错误的的怪物对象');
            return null;
        }
        await iObj?.asyncReady();
        if (SystemUtil.isClient())
            return this.moduleC.register(iObj, cfg);
        return this.moduleS.register(iObj, cfg);
    }
    public setHeadUI(resId?: string, ui?: new () => MonsterHeadUI) {
        if (this.isVoid || SystemUtil.isServer())
            return;
        if (resId)
            MonsterDefine.headRes = resId;
        if (!ui)
            ui = MonsterHeadUI;
        this.moduleC.setHeadUI();
    }
    /**
     * 控制怪物状态，双端调用
     * @param sta 状态
     * @param guid 哪个交互物的ID
     */
    public setState(sta: EMonsterBehaviorState, guid?: string) {
        if (SystemUtil.isClient())
            return this.moduleC.setState(sta, guid)
        else
            return this.moduleS.setState(sta, guid)
    }

    /**
     * 获取指定怪物
     * @param mid 注册的guid
     * @effect 双端调用
     * @returns Monster
     */
    public getMonster(mid: string): Monster {
        if (this.isVoid)
            return null;
        if (SystemUtil.isClient())
            return this.moduleC.getMonster(mid)
        else
            return this.moduleS.getMonster(mid)
    }

    public getBossMonster(): Monster {
        if (this.isVoid)
            return null;
        if (SystemUtil.isClient())
            return this.moduleC.getBossMonster()
        else
            return this.moduleS.getBossMonster()
    }

    /**获取触发器的敌人数量 */
    public getAreaLiveMonsterNum(triggerId: string) {
        if (this.isVoid)
            return null;
        if (SystemUtil.isClient())
            return this.moduleC.getAreaLiveMonsterNum(triggerId)
        else
            return this.moduleS.getAreaLiveMonsterNum(triggerId)
    }

    public getAllMonser() {
        if (this.isVoid)
            return null;
        if (SystemUtil.isClient())
            return this.moduleC.getAllMonser()
        else
            return this.moduleS.getAllMonser()
    }

    /**
     * 找最近的怪物
     * @param range 
     * @param pos 
     * @returns 
     */
    public getNearMonster(range: number, pos): Monster {
        if (this.isVoid)
            return null;
        if (SystemUtil.isClient())
            return this.moduleC.dataInfo.getNear(pos, range);
        return this.moduleS.dataInfo.getNear(pos, range);
    }

    /**
    * 获取范围內的怪物
    * @param range 范围
    * @param pos 中心点，默认主角位置
    */
    public getRangeMonster(range: number, pos?: mw.Vector): Monster[] {
        if (this.isVoid)
            return [];
        range = range ? range : 10000;
        if (SystemUtil.isClient()) {
            return this.moduleC.dataInfo.getRangeMonster(pos, range);
        }
        else if (pos) {
            return this.moduleS.dataInfo.getRangeMonster(pos, range);
        }
        else {
            LogMgr.Inst.error('服务器获取范围怪物需要位置');
            return null;
        }
    }

    /**
     * 受伤
     * @param mid 目标
     * @param damage 伤害值
     */
    public onDamage(mid: string, damage: number, isCrit: boolean) {
        if (SystemUtil.isClient())
            this.moduleC.onDamage(mid, damage, isCrit)
        else
            this.moduleS.onDamage(mid, damage, isCrit)
    }
    //索敌伤害TODO

    private get isVoid() {
        if (this.inited < 2)
            LogMgr.Inst.error('怪物模块未初始化');
        return this.inited < 2;
    }


    /**
     * 发送一个聊天
     * @param chat  聊天内容
     * @param mid  怪物
     * @returns 
     */
    public sendChat(chat: string, mid?: string) {
        if (this.isVoid)
            return;
        if (SystemUtil.isClient()) {
            // this.moduleC.sendChat(chat);
        }
        else if (mid)
            this.moduleS.setChat(chat, mid);
    }

}