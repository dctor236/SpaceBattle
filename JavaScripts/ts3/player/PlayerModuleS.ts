/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-07-08 20:50:01
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-08-20 21:40:37
 * @FilePath: \mollywoodschool\JavaScripts\ts3\player\PlayerModuleS.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-12 20:09:21
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-07-08 19:02:05
 * @FilePath: \vine-valley\JavaScripts\ts3\player\PlayerModuleS.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { EventsName } from "../../const/GameEnum";
import { BuffModuleS } from "../../modules/buff/BuffModuleS";
import { DropModuleS } from "../../modules/drop/DropModule";
import { Attribute } from "../../modules/fight/attibute/Attribute";
import FightMgr from "../../modules/fight/FightMgr";
import { updater } from "../../modules/fight/utils/Updater";
import { MGSMsgHome } from "../../modules/mgsMsg/MgsmsgHome";
import { addScript } from "../com/Tool";
import { MonsterMgr } from "../monster/MonsterMgr";
import { PlayerData } from "./PlayerData";
import { GamePlayerState, PlayerDefine } from "./PlayerDefine";
import { PlayerModuleC } from "./PlayerModuleC";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-02 14:04
 * @LastEditTime : 2023-05-24 16:51
 * @description  : 
 */

export class PlayerModuleS extends ModuleS<PlayerModuleC, null> {
    public dataInfo: PlayerData;
    private deadPlayer: Set<string> = new Set();
    private playerBeHitTimeStampRecode: Map<string, number> = new Map();
    protected override onStart(): void {
        super.onStart();
        this.dataInfo = new PlayerData();
        // Event.addLocalListener(EventsName.PlayerBattle, (pid: number, sate: boolean, Trigger: string, isForse: boolean) => {
        //     const player = Player.getPlayer(pid)
        //     if (!player) return
        //     const tmpp = this.dataInfo.getPlayer(player.userId)
        //     const num = MonsterMgr.Inst.getAreaLiveMonsterNum(Trigger)

        //     if (isForse) {
        //         if (!sate) {
        //             this.recodePlayerFightState(player.userId)
        //             tmpp?.setPlayerState(GamePlayerState.OutofBattle)
        //         } else {
        //             this.playerBeHitTimeStampRecode.delete(player.userId);
        //             tmpp?.setPlayerState(GamePlayerState.Battle)
        //         }
        //     } else {
        //         if (num > 0) {
        //             this.playerBeHitTimeStampRecode.delete(player.userId);
        //             tmpp?.setPlayerState(GamePlayerState.Battle)
        //         } else {
        //             this.recodePlayerFightState(player.userId)
        //             tmpp?.setPlayerState(GamePlayerState.OutofBattle)
        //         }
        //     }

        // })
    }
    protected onPlayerEnterGame(player: mw.Player): void {
        super.onPlayerEnterGame(player);
        FightMgr.instance.onPlayerEnterGame(player)
        // this.addPlayer(player);
    }

    protected onPlayerLeft(player: mw.Player): void {
        let uid = player.userId;
        const p = this.dataInfo.getPlayer(uid)
        p?.stopPlayVictorEff()
        FightMgr.instance.onPlayerLeft(player)
        this.dataInfo.delPlayer(uid)
        this.deadPlayer.delete(uid);
        this.playerBeHitTimeStampRecode.delete(uid);
    }

    // 记录玩家活跃状态(攻击/受击),做脱战回血逻辑
    recodePlayerFightState(uid: string) {
        this.playerBeHitTimeStampRecode.set(uid, Date.now());
    }

    // 玩家死亡
    private async setPlayerDeadState(playerID: string, isMonster: number) {
        let player = this.dataInfo.getPlayer(playerID);
        if (!player) return;
        Event.dispatchToLocal(EventsName.PlayerDead, player.mwPlayer.playerId)
        // 不可移动
        const cha = player.character;
        const pos = cha.worldTransform.position.clone()
        let awardVec = FightMgr.instance.getAwardPeople(player.userId)
        awardVec.forEach(p => {
            ModuleService.getModule(DropModuleS).creatDrop(pos,
                3, 20 * 5, 20, p)
        })
        FightMgr.instance.clearMonsterDamageInfo(player.userId)
        // cha.movementEnabled = cha.jumpEnabled = false;
        // cha.ragdollEnabled = true
        if (isMonster == 2) {
            //怪物击杀
            MGSMsgHome.uploadMGS('ts_game_result', '玩家被npc击杀时', { record: 'bekilled_bynpc' }, player.mwPlayer)
        } else if (isMonster == 1) {
            //系统死亡
            MGSMsgHome.uploadMGS('ts_game_result', '玩家进入毒气区域死亡时', { record: 'redarea_die' }, player.mwPlayer)
        } else {
            //pvp
            MGSMsgHome.uploadMGS('ts_game_result', '玩家被玩家击杀时', { record: 'bekilled_byplayer' }, player.mwPlayer)
        }
        this.getClient(player.mwPlayer).net_dead();
        setTimeout(() => {
            this.resurgence(playerID)
        }, 3000);
    }

    protected onUpdate(dt: number): void {
    }

    // 玩家请求复活
    resurgence(playerID: string) {
        const p = this.dataInfo.getPlayer(playerID)
        if (p.mwPlayer) {
            this.getClient(p.mwPlayer).net_resurgence();
            this.deadPlayer.delete(playerID);
            // ModuleService.getModule(BuffModuleS).clearAlllBuff(playerID)
            // ModuleService.getModule(BuffModuleS).addABuff(null, playerID, 9, EBuffHostType.Player, false)
            // ModuleService.getModule(BuffModuleS).addABuff(null, playerID, 10, EBuffHostType.Player, false)
            // p.character.movementEnabled = p.character.jumpEnabled = true;
            // p.character.ragdollEnabled = false
            p.setHp(p.getAtt(Attribute.EAttType.maxHp))
        }
    }


    // 玩家受击脱战后1秒恢复生命值1%的血量
    @updater.updateByFrameInterval(1 / 0.1, "onUpdate")
    private checkPlayerRestTick() {
        let now = Date.now();
        for (let player of Player.getAllPlayers()) {
            let playerID = player.userId;
            const p = this.dataInfo.getPlayer(playerID)
            // 未初始化
            if (!p) continue
            // 死亡
            if (this.deadPlayer.has(playerID)) continue
            let lastBeHitTime: number;
            lastBeHitTime = this.playerBeHitTimeStampRecode.get(playerID);
            if (now - lastBeHitTime >= 10000 && p.state == GamePlayerState.Battle) {

            } else {
                continue
            }


            let maxHp = p.getAtt(Attribute.EAttType.maxHp);
            let hp = p.getAtt(Attribute.EAttType.hp);
            if (hp >= maxHp) {
                p.setPlayerState(GamePlayerState.OutofBattle)
                continue;
            }
            p.setHp(hp + maxHp * 0.2)
        }
    }


    private async addPlayer(player: mw.Player, oid, nick) {
        await player.character.asyncReady()
        let uid = player.userId
        let tsp = this.dataInfo.getPlayer(uid);
        if (!tsp)
            tsp = await addScript(PlayerDefine.playerScriptGuid, player.character, true);
        tsp?.initPlayer(player);
        tsp?.setInfo(oid, nick);
        //初始化玩家属性
        this.dataInfo.addPlayer(tsp)
    }
    // protected onDestroy(): void {
    //     super.onDestroy();
    // }
    net_upInfo(oid: string, nick: string) {
        this.addPlayer(this.currentPlayer, oid, nick);
    }
    // net_getInfo(uid: string): string {
    //     let tsp = this.dataInfo.getPlayer(uid);
    //     let data = {
    //         uid: uid,
    //         oid: tsp.openId,
    //         nick: tsp.nickName
    //     }
    //     return JSON.stringify(data);
    // }
    net_setTitle(type: number, title: string) {
        let tsp = this.dataInfo.getPlayer(this.currentPlayer.userId);
        tsp.setTitle(type, title);
    }
    net_setChat(msg: string, uid: string) {
        // let uid = this.currentPlayer.userId;
        let ps = this.dataInfo.getRangePlayer(this.currentPlayer.character.worldTransform.position, 1000, uid);
        ps.forEach((tsp) => {
            this.getClient(tsp.mwPlayer).net_Chat(uid, msg);
        });
    }


    public onDamage(num: number, damageType: number, isCrit: boolean = false, uid: string) {
        if (this.dataInfo.getAtt(uid, Attribute.EAttType.hp) <= 0) {
            return
        }
        const tmpp = this.dataInfo.getPlayer(uid)
        tmpp?.setPlayerState(GamePlayerState.Battle)
        this.recodePlayerFightState(uid)
        const p = this.dataInfo.onDamage(uid, num, damageType, isCrit);
        if (p.isDead()) {
            this.setPlayerDeadState(uid, damageType)
        }
    }

    public net_damage(ids: string[], nums: number[], isMonster: number[], isCrit: boolean[]) {
        const uid = this.currentPlayer.userId
        for (let i = 0; i < ids.length; i++) {
            let dag = i < nums.length ? nums[i] : 0;
            if (isMonster[i] == 3)
                FightMgr.instance.loadPlayerDamage(ids[i], this.currentPlayerId, dag)
            this.onDamage(dag, isMonster[i], isCrit[i], ids[i]);
        }
    }
}
