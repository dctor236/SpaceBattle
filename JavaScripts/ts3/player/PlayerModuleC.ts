import { GameConfig } from "../../config/GameConfig";
import { EventsName, SkillState } from "../../const/GameEnum";
import { UIManager } from "../../ExtensionType";
import { InputManager } from "../../InputManager";
import ActionMC from "../../modules/action/ActionMC";
import { BagModuleC } from "../../modules/bag/BagModuleC";
import { ERewardType } from "../../modules/drop/DropItem";
import { DropModuleC } from "../../modules/drop/DropModule";
import { GameModuleC } from "../../modules/gameModule/GameModuleC";
import { MGSMsgHome } from "../../modules/mgsMsg/MgsmsgHome";
import SkillModule_Client from "../../modules/skill/SkillModule_Client";
import RebornUI from "../../ui/RebornUI";
import GameUtils from "../../utils/GameUtils";
import { PlayerData } from "./PlayerData";
import { PlayerDefine } from "./PlayerDefine";
import { PlayerModuleS } from "./PlayerModuleS";
import TsPlayer from "./TsPlayer";


/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-02 14:04
 * @LastEditTime : 2023-06-19 15:12
 * @description  : 
 */

export class PlayerModuleC extends ModuleC<PlayerModuleS, null> {
    public mPlayer: TsPlayer = null;
    public dataInfo: PlayerData;
    private mUserId = '';
    private damageList: Map<string, { val: number, damageType: number, crit: boolean }> = new Map();//1系统伤害 2怪物 3玩家PVP
    private needUpDamage = false;
    private updateTime = 1;
    private _damageRecordList: string[] = []
    // 玩家是否死亡
    private playerDead: boolean = false;
    public async init() {
        this.dataInfo = new PlayerData();
        Event.addLocalListener(PlayerDefine.Event_Player_Start, this.onPlayerEnter)
        let player = await Player.asyncGetLocalPlayer();
        await player.character.asyncReady()
        player.character.collisionWithOtherCharacterEnabled = true
        this.mUserId = player.userId;
        // PlayerDefine.inited = true;
        this.upInfo();
        await this.onMainInited();
        InputUtil.onKeyDown(mw.Keys.J, () => {
            console.log(this.localPlayer.character.worldTransform.position)
        })
    }
    public onPlayerEnter = (player: TsPlayer) => {
        this.dataInfo.addPlayer(player)
        if (player.userId == this.mUserId) {
            this.mPlayer = player;
            this.mPlayer.setInfo(this.userOpenId(), this.userName());
            RoomService.registerMGSChatMessageEvent(this.sendChat.bind(this));
            InputManager.instance.onTouch.add(this.onTouchThis, this);
        }
    }
    protected onEnterScene(sceneType: number): void {
    }

    protected onUpdate(dt: number): void {
        this.updateTime -= dt;
        if (this.updateTime < 0) {
            this.updateTime = 1;
            this.upDamage();
        }
    }


    /**查看名片cd */
    private isLook = true;
    /**
   * 点击角色显示233名片
   * @param hitResArr
   */
    private onTouchThis(hitResArr: Array<mw.HitResult>) {
        for (let hit of hitResArr) {
            if (!this.isLook) {
                return;
            }

            if (GameUtils.isPlayerCharacter(hit.gameObject)) {
                continue;
            }
            let character = hit.gameObject as mw.Character;
            if (!character || !character.player) {
                continue;
            }
            let openId = character.player.userId;
            console.info("233playerID===   openId  " + openId + "    =====<");
            mw.RoomService.showUserProfile(null, openId);
            this.isLook = false;
            setTimeout(() => {
                this.isLook = true;
            }, 1000);
            return;
        }
    }

    public async onMainInited() {
        return new Promise((resolve) => {
            let idx = 0;
            const intervalId = setInterval(() => {
                if (this.mPlayer) {
                    clearInterval(intervalId);
                    resolve(true);
                }
                idx++;
                if (idx > 30) {
                    clearInterval(intervalId);
                    resolve(true);
                }
            }, 100);
        });
    }
    /**
     * 服务准备好，客户端上传账户数据
     * 也可延迟执行
     */
    public upInfo() {
        //需要客户端上报的数据都走这
        this.server.net_upInfo(this.userOpenId(), this.userName());
    }
    public showHead(bit: number, uid: string) {
        if (uid) {
            let p = this.dataInfo.getPlayer(uid);
            p && p.showHead(bit);
        }
        let list = this.dataInfo.getAll();
        list.forEach((p) => {
            p && p.showHead(bit);
        });
    }
    public setTitle(type: number, title: string) {
        this.mPlayer.showTitle(type, title);
        this.server.net_setTitle(type, title);
    }
    public sendChat = (msg: string): void => {
        if (this.mPlayer) {
            this.mPlayer.showChat(msg);
            this.server.net_setChat(msg, this.mPlayer.userId);
        }
    }
    public net_Chat(uid, msg: string) {
        let tsp = this.dataInfo.getPlayer(uid);
        if (tsp)
            tsp.showChat(msg);
    }

    async net_dead() {
        // 死亡动画
        this.playerDead = true
        this.showHead(0, this.mUserId);
        const ch = this.localPlayer.character
        const itme = ModuleService.getModule(BagModuleC).tempItem['140015']
        const curNum = itme ? itme.count : 0
        const pos = new Vector(ch.worldTransform.position.x, ch.worldTransform.position.y, 284)
        // if (curNum > 0) {
        // setTimeout(() => {
        //     ModuleService.getModule(DropModuleC).reqCrearDropAll(pos, ERewardType.RepairBox, 1, curNum)
        // }, 1000);
        // }
        ModuleService.getModule(ActionMC).playAction(413)
        // ModuleService.getModule(BagModuleC).removeShortcutBarItem(140015)
        // await TimeUtil.delaySecond(2.2)
        const curSel1 = ModuleService.getModule(BagModuleC).curEquip
        Event.dispatchToLocal('UnselectItem', ModuleService.getModule(BagModuleC).equipSlots.indexOf(curSel1))
        UIManager.show(RebornUI)
    }

    net_resurgence() {
        ModuleService.getModule(GameModuleC).resetPos()
        this.showHead(1 + 4, this.mUserId);
        UIManager.hide(RebornUI)
        this.playerDead = false
        // this.onPlayerResurgenceEvent.call()
    }


    public onDamage(damage: number, damageType: number, isCrit: boolean = false, uid?: string) {
        uid = uid ? uid : this.mUserId
        let obj = this.dataInfo.onDamage(uid, damage, damageType, isCrit);
        if (!obj)
            return;

        if (this._damageRecordList.indexOf(uid) == -1) {
            this._damageRecordList.push(uid)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家每次参与击杀其他玩家时', { record: 'kill_player' })
        }
        if (!this.damageList.has(uid)) {
            this.damageList.set(uid, { val: 0, damageType: 0, crit: false })
        }
        let dmg = this.damageList.get(uid);
        dmg.damageType = damageType
        dmg.crit = isCrit
        dmg.val = dmg.val + damage
        this.damageList.set(uid, dmg);
        this.needUpDamage = true;
    }

    private upDamage() {
        if (!this.needUpDamage)
            return;
        // let ids = Array.from(this.damageList.keys());
        // let dmgs = Array.from(this.damageList.values());
        let ids = [];
        let dmgs = [];
        let damageType = []
        let isCrit = []
        for (let [k, v] of this.damageList) {
            ids.push(k);
            dmgs.push(v.val);
            damageType.push(v.damageType)
            isCrit.push(v.crit)
        }
        this.damageList.clear();
        this.server.net_damage(ids, dmgs, damageType, isCrit);
        this.needUpDamage = false;
    }
    private userOpenId(): string {
        if (SystemUtil.isPIE)
            return "openid" + this.mUserId;
        return AccountService.getUserId();
    }
    private userName(): string {
        if (SystemUtil.isPIE)
            return "TS" + this.mUserId;
        return AccountService.getNickName();
    }

    // private getMwPlayer(uid): mw.Player {
    //     let aps = Player.getAllPlayers()
    //     for (let p of aps) {

    //     }
    //     return this.mPlayer;
    // }
}
