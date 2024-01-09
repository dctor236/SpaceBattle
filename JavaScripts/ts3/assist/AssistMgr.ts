/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-07-08 11:05:49
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-07-08 21:28:40
 * @FilePath: \mollywoodschool\JavaScripts\ts3\monster\MonsterMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { GameConfig } from "../../config/GameConfig";
import { LogMgr } from "../com/LogMgr";
import Assist from "./Assist";
import { AssistCfg, AssistDefine, EAssistBehaviorState } from "./AssistDefine";
import { AssistHeadUI } from "./AssistHeadUI";
import { AssistModuleC } from "./AssistModuleC";
import { AssistModuleS } from "./AssistModuleS";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-02 13:55
 * @LastEditTime : 2023-06-27 18:24
 * @description  :  协同物管理器
 */
export class AssistMgr {

    private static _inst: AssistMgr;
    public static get Inst() {
        if (!this._inst)
            this._inst = new AssistMgr();
        return this._inst;
    }

    private moduleC: AssistModuleC;
    private moduleS: AssistModuleS;


    private inited = 0;
    public async init() {
        if (this.inited > 0)
            return;
        this.inited = 2;
        ModuleService.registerModule(AssistModuleS, AssistModuleC, null);
        if (SystemUtil.isClient()) {
            this.moduleC = ModuleService.getModule(AssistModuleC);
            this.moduleC.Init();
            // let obj = await GameObject.asyncFindGameObjectById('1DB2A630') as mw.GameObject;
            // await this.register(obj, { mid: '', type: 1, hp: 200, hpMax: 200 });
        }
        else {
            this.moduleS = ModuleService.getModule(AssistModuleS);
            this.moduleS.init();
            this.createAssistObj()
        }
        LogMgr.Inst.coreLog('协同模块初始化完成')
    }


    public async createAssistObj() {
        const elems = GameConfig.Assist.getAllElement()
        for (const elem of elems) {
            let host = elem.Guid
            let monster = await this.register(host, {
                config: elem.ID, type: elem.assistType, name: elem.assistName
            });
            await TimeUtil.delaySecond(0.5)
        }
    }

    /**
     * 注册协同
     * @param target 目标obj或是目标的GUID
     * @param maxHp 目前只有1个血量,待扩展
     * @effect 客户端注册的无属性同步等，需要请使用服务端注册
     * @returns 协同对象
     */
    public async register(target: string | mw.GameObject, cfg: AssistCfg): Promise<Assist> {
        if (this.isVoid)
            return null;
        let iObj = null;
        if (typeof (target) == 'string') {
            iObj = await GameObject.asyncFindGameObjectById(target);
        }
        else if (target)
            iObj = target;
        if (!iObj) {
            LogMgr.Inst.error('错误的的协同对象');
            return null;
        }
        await iObj?.asyncReady();
        if (SystemUtil.isClient())
            return this.moduleC.register(iObj, cfg);
        return this.moduleS.register(iObj, cfg);
    }
    public setHeadUI(resId?: string, ui?: new () => AssistHeadUI) {
        if (this.isVoid || SystemUtil.isServer())
            return;
        if (resId)
            AssistDefine.headRes = resId;
        if (!ui)
            ui = AssistHeadUI;
        this.moduleC.setHeadUI();
    }
    /**
     * 控制协同状态，双端调用
     * @param sta 状态
     * @param guid 哪个交互物的ID
     */
    public setState(sta: EAssistBehaviorState, guid?: string) {
        if (SystemUtil.isClient())
            return this.moduleC.setState(sta, guid)
        else
            return this.moduleS.setState(sta, guid)
    }

    /**
     * 获取指定协同
     * @param mid 注册的guid
     * @effect 双端调用
     * @returns Monster
     */
    public getAssist(mid: string): Assist {
        if (this.isVoid)
            return null;
        if (SystemUtil.isClient())
            return this.moduleC.getAssist(mid)
        else
            return this.moduleS.getAssist(mid)
    }

    /**获取触发器的敌人数量 */
    public getAreaLiveAssist() {
        if (this.isVoid)
            return null;
        if (SystemUtil.isClient())
            return this.moduleC.getAreaLiveAssistNum()
        else
            return this.moduleS.getAreaLiveAssistNum()
    }

    public getAllAssist() {
        if (this.isVoid)
            return null;
        if (SystemUtil.isClient())
            return this.moduleC.getAllAssist()
        else
            return this.moduleS.getAllAssist()
    }

    /**
     * 找最近的协同
     * @param range 
     * @param pos 
     * @returns 
     */
    public getNearAssist(range: number, pos): Assist {
        if (this.isVoid)
            return null;
        if (SystemUtil.isClient())
            return this.moduleC.dataInfo.getNear(pos, range);
        return this.moduleS.dataInfo.getNear(pos, range);
    }

    /**
    * 获取范围內的协同
    * @param range 范围
    * @param pos 中心点，默认主角位置
    */
    public getRangeAssists(range: number, pos?: mw.Vector): Assist[] {
        if (this.isVoid)
            return [];
        range = range ? range : 10000;
        if (SystemUtil.isClient()) {
            return this.moduleC.dataInfo.getRangeAssist(pos, range);
        }
        else if (pos) {
            return this.moduleS.dataInfo.getRangeAssist(pos, range);
        }
        else {
            LogMgr.Inst.error('服务器获取范围协同需要位置');
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
            LogMgr.Inst.error('协同物模块未初始化');
        return this.inited < 2;
    }


    /**
     * 发送一个聊天
     * @param chat  聊天内容
     * @param mid  协同
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