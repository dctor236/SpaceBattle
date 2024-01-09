import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';

import TsPlayer from "./TsPlayer";
import { LogMgr } from "../com/LogMgr";
import { PlayerModuleS } from "./PlayerModuleS";
import { PlayerModuleC } from "./PlayerModuleC";
import { InteractCfg, InteractEvent, InteractType } from "../define/Define";
import PlayerHeadUI from "./PlayerHeadUI";
import { PlayerDefine } from "./PlayerDefine";
import { GameConfig } from "../../config/GameConfig";
import { ContractType } from "../../modules/relation/RelationData";
import RelationModuleC from "../../modules/relation/RelationModuleC";
import FightMgr from "../../modules/fight/FightMgr";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-24 11:38
 * @LastEditTime : 2023-06-19 15:14
 * @description  : 玩家管理器
 */

export class PlayerMgr {
    public mainUserId: string = '';
    public mainGuid: string = '';
    private static _inst: PlayerMgr;
    public static get Inst() {
        if (!this._inst)
            this._inst = new PlayerMgr();
        return this._inst;
    }
    private moduleC: PlayerModuleC;
    private moduleS: PlayerModuleS;
    private tsPlayer: TsPlayer;
    private tsChar: mw.Character;
    private inited = 0;
    private posTime = -1;
    private curPos: mw.Vector;

    private curStance: mw.SubStance;

    public async init() {
        if (this.inited > 0)
            return;
        this.inited = 1;
        ModuleService.registerModule(PlayerModuleS, PlayerModuleC, null);
        FightMgr.instance.init()
        if (SystemUtil.isClient()) {
            this.moduleC = ModuleService.getModule(PlayerModuleC);
            await this.moduleC.init();
            this.tsPlayer = this.moduleC.mPlayer;
            if (!this.tsPlayer) {
                LogMgr.Inst.coreLog('玩家模块初始化失败')
                return;
            }
            this.tsPlayer = this.moduleC.mPlayer;
            this.tsChar = this.tsPlayer.character;
            this.mainGuid = this.tsChar.gameObjectId;
            this.mainUserId = this.tsPlayer.userId;
            this.loadRes();
            this.inited = 2;

            //开启头顶UI
            this.setOtherHeadUI()
            this.setMyHeadUI()
            this.showHeadView(1 + 4);
        }
        else {
            this.inited = 2;
            this.moduleS = ModuleService.getModule(PlayerModuleS);
        }

        LogMgr.Inst.coreLog('玩家模块初始化完成')
    }
    /**
     * 主玩家，客户端使用
     */
    public get mainPlayer(): TsPlayer {
        if (this.isVoid)
            return null;
        return this.tsPlayer;
    }
    /**
     * 主玩家角色，客户端使用
     */
    public get mainCharacter(): mw.Character {
        if (this.isVoid)
            return null;
        this.tsChar
        return this.tsChar;
    }
    /**
     * 主玩家的位置，若获取到位置要进行修改，请clone()
     */
    public get mainPos(): mw.Vector {
        if (this.isVoid)
            return mw.Vector.zero;
        else {
            let nt = TimeUtil.elapsedTime()
            if (nt - this.posTime > 0.1) //100毫秒內不会更新位置
            {
                this.curPos = this.tsChar.worldTransform.position;
                this.posTime = nt;
            }
        }
        return this.curPos;
    }

    /**
     * 是否为主玩家
     * @param uid 用户ID
     * @Effect 双端调用 
     * @returns 
     */
    public getPlayer(uid: string): TsPlayer {
        if (this.isVoid)
            return null;
        if (SystemUtil.isClient()) {
            return this.moduleC.dataInfo.getPlayer(uid);
        }
        else
            return this.moduleS.dataInfo.getPlayer(uid);
    }
    /**
     * 获取所有玩家
     * @param uid 排除的uid,默认不排除
     * @returns 
     */
    public getPlayers(uid?: string): TsPlayer[] {
        if (this.isVoid)
            return [];
        if (SystemUtil.isClient())
            return this.moduleC.dataInfo.getAll(uid);
        else
            return this.moduleS.dataInfo.getAll(uid);
    }
    /**
     * 获取范围內的玩家
     * @param range 范围
     * @param pos 中心点，默认主角位置
     * @param uid 排除的uid,默认不排除
     */
    public getRangePlayer(range: number, uid?: string, pos?: mw.Vector): TsPlayer[] {
        if (this.isVoid)
            return [];
        range = range ? range : 10000;
        if (SystemUtil.isClient()) {
            pos = pos ? pos : this.mainCharacter.worldTransform.position;
            return this.moduleC.dataInfo.getRangePlayer(pos, range, uid);
        }
        else if (pos) {
            return this.moduleS.dataInfo.getRangePlayer(pos, range, uid);
        }
        else {
            LogMgr.Inst.error('服务器获取最近玩家需要传入位置');
            return null;
        }
    }
    /**
     * 获取最近的玩家（可设范围）
     * @param range 范围
     * @param uid 排除的uid,默认不排除
     * @param pos 中心点，默认主角位置，服务器需要传入
     */
    public getNearPlayer(range?: number, uid?: string, pos?: mw.Vector): TsPlayer {
        if (this.isVoid)
            return null
        range = range ? range : 10000;
        if (SystemUtil.isClient()) {
            pos = pos ? pos : this.mainCharacter.worldTransform.position;
            return this.moduleC.dataInfo.getNearPlayer(pos, range, uid);
        }
        else if (pos) {
            return this.moduleS.dataInfo.getNearPlayer(pos, range, uid);
        }
        else {
            LogMgr.Inst.error('服务器获取最近玩家需要传入位置');
            return null;
        }
    }
    /**
     * 是否为主玩家
     * @param obj GameObject、Player、Character、TsPlayer
     * @Effect 客户端调用 
     * @returns 
     */
    public isMainPlayer(obj: mw.GameObject | TsPlayer) {
        if (this.isVoid || !obj)
            return false;
        if (obj instanceof mw.Player) {
            let player = obj as mw.Player;
            return player.userId == this.mainUserId;
        }
        if (obj instanceof TsPlayer) {
            let player = obj as TsPlayer;
            return player.userId == this.mainUserId;
        }
        else if (!obj.gameObjectId)
            return false;
        return obj.gameObjectId == this.mainGuid;
    }

    private get isVoid() {
        // if (this.inited < 2)
        //     LogMgr.Inst.error('玩家还未初始化好');
        return this.inited < 2;
    }

    /********************HeadUI *************************/
    /**
     * 设置主玩家 头顶UI
     * @param resId  头顶资源ID
     * @param ui UI类
     * @param pos 相等偏移位置
     * @returns 
     */
    public setMyHeadUI(resId?: string, ui?: new () => PlayerHeadUI) {
        if (this.isVoid || SystemUtil.isServer())
            return;
        if (resId)
            PlayerDefine.mainHeadRes = resId;
        if (!ui)
            ui = PlayerHeadUI;
        this.tsPlayer.setHeadUI(PlayerDefine.mainHeadRes, ui);
        this.tsPlayer.showHp()
    }
    /**
     * 设置其他玩家 头顶UI
     * @param resId 头顶资源ID
     * @param ui UI类
     * @param pos 相等偏移位置                 
     * @returns 
     */
    public setOtherHeadUI(resId?: string, ui?: new () => PlayerHeadUI) {
        if (this.isVoid || SystemUtil.isServer())
            return;
        if (resId)
            PlayerDefine.otherHeadRes = resId;
        if (ui)
            PlayerDefine.HeadUI = ui;
        this.getPlayers(this.mainUserId).forEach((p) => {
            p.setHeadUI(PlayerDefine.otherHeadRes, PlayerDefine.HeadUI);
        })
    }

    /**
     * 设置称号
     * @param type 自定义类别
     * @param title 称号
     * @returns 
     */
    public setTitle(type: number, title: string) {
        if (this.isVoid)
            return;
        if (SystemUtil.isClient())
            this.moduleC.setTitle(type, title);
        else
            this.moduleS.net_setTitle(type, title);
    }

    public resetTitle(type: number) {
        if (this.isVoid)
            return;
        const relationModuleC = ModuleService.getModule(RelationModuleC)
        const lastContract = relationModuleC.lastContract;
        let name = GameConfig.SquareLanguage.Danmu_Content_1106.Value
        switch (lastContract) {
            case ContractType.Ring:
                const connect = relationModuleC.connects[lastContract];
                const designation = relationModuleC.designations[lastContract];
                name = StringUtil.format(GameConfig.SquareLanguage.Relation_09.Value, connect, designation);
                break;
            default:
                break;
        }
        if (SystemUtil.isClient())
            this.moduleC.setTitle(type, name);
        else
            this.moduleS.net_setTitle(type, name);
    }

    /**
     * 发送一个聊天
     * @param chat  聊天内容
     * @param uid  发送者，默认主玩家
     * @returns 
     */
    public sendChat(chat: string, uid?: string) {
        if (this.isVoid)
            return;
        if (SystemUtil.isClient())
            this.moduleC.sendChat(chat);
        else if (uid)
            this.moduleS.net_setChat(chat, uid);
    }
    /**
     * 玩家头顶HP信息显示
     * @param uid 哪个玩家,不传就是所有玩家
     * @param bit 显示位
     * 1:名字
     * 2:称号
     * 4:血条
     */
    public showHeadView(bit: number, uid?: string) {
        if (this.isVoid || SystemUtil.isServer())
            return;
        PlayerDefine.headBit = bit;
        this.moduleC.showHead(bit, uid);
    }
    /**
     * 玩家受到伤害
     * @param uid 哪个玩家,不传就是主玩家，服务器必须有
     * @param damage 伤害值
     * @param isMonster 1系统伤害 2怪物 3玩家PVP
     * 1:名字
     * 2:称号
     * 4:血条
     */
    public onDamage(damage: number, isMonster: number = 2, isCrit: boolean = false, uid?: string) {
        if (this.isVoid)
            return;
        if (SystemUtil.isClient())
            this.moduleC.onDamage(damage, isMonster, isCrit, uid);
        else if (uid)
            this.moduleS.onDamage(damage, isMonster, isCrit, uid);
    }
    /********************状态相关 *************************/
    public sit() {
        if (this.isVoid)
            return;
        //this.mChar.animationMode = mw.AnimationMode.Custom;
        this.curStance = PlayerManagerExtesion.loadStanceExtesion(this.tsChar, StanceType.Sit, true);
        //this.mChar.movementEnabled = false;
        if (this.curStance)
            this.curStance.play();
    }
    public idle() {

    }
    public jump() {
        if (this.tsChar)
            this.tsChar.jump();
        this.checkInterat(2);
    }


    /********************交互相关 *************************/
    //当前交互信息
    private curInteract: InteractCfg;
    //最后交互的时间
    private interactTime: number = 0;
    //最后交互的对象Guid
    private interactGuid: string = '';
    private loadRes() {
        for (let k in StanceType) {
            let v = StanceType[k];
            if (v && v.length > 1)
                AssetUtil.asyncDownloadAsset(v);
        }
    }

    private checkInterat(ew: number) {
        if (!this.curInteract)
            return;
        if (this.curInteract.exitWay = ew)
            this.onInteractExit();
    }


    public canIntract() {
        if (SystemUtil.isClient()) {
            if (this.curInteract)
                return false;
            return true;
        }
        return false;
    }
    /**
     * 交互在CD內?，相同自动交互物3秒CD
     * @param guid  交互对象的guid 
     * @returns CD中
     */
    public interactCD(guid): boolean {
        if (!this.curInteract)
            return false;
        if (this.interactGuid != guid)
            return false;
        if (TimeUtil.elapsedTime() - this.interactTime > 3)
            return false;
        return true;
    }
    public onInteractEnter(cfg: InteractCfg) {
        if (!cfg.host) {
            LogMgr.Inst.coreLog('空的交互对象')
            return;
        }
        this.curInteract = cfg;
        this.interactGuid = cfg.id;
        switch (cfg.type) {
            case InteractType.Sit:
                this.tsChar.worldTransform.position = cfg.pos;
                // this.tsChar.collisionEnable = false;
                this.tsChar.setCollision(CollisionStatus.Off)
                this.tsChar.switchToFlying();
                this.sit();
                break;
        }
    }
    public onInteractExit() {
        this.interactTime = TimeUtil.elapsedTime();
        Event.dispatchToLocal(InteractEvent.Exit, this.curInteract.id);
        this.curInteract = null;
        // this.tsChar.collisionEnable = true;
        this.tsChar.setCollision(CollisionStatus.On)
        console.log('onInteractExit')
        if (this.curStance)
            this.curStance.stop();
        this.curStance = PlayerManagerExtesion.loadStanceExtesion(this.tsChar, StanceType.Idle, true);

        //this.mChar.movementEnabled = false;
        if (this.curStance)
            this.curStance.play();
    }
}



enum StanceType {
    Idle = '',
    Sit = '4175',
}