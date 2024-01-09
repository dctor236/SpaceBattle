import { Attribute } from "../../modules/fight/attibute/Attribute";
import FightMgr from "../../modules/fight/FightMgr";
import { LogMgr } from "../com/LogMgr";
import TsPlayer from "./TsPlayer";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-05-10 10:33
 * @LastEditTime : 2023-06-11 13:12
 * @description  : 角色数据，core外部不要使用
 */
export class PlayerData {
    private map: Map<string, TsPlayer> = new Map();
    public addPlayer(player: TsPlayer) {
        this.map.set(player.userId, player);
        if (SystemUtil.isServer()) {
            setTimeout(() => {
                const att = FightMgr.instance.getPAttibuteList(player.userId)
                this.setAtt(player.userId, Attribute.EAttType.maxHp, att.getValue(Attribute.EAttType.maxHp))
                this.setAtt(player.userId, Attribute.EAttType.hp, att.getValue(Attribute.EAttType.hp))
                this.setAtt(player.userId, Attribute.EAttType.defense, att.getValue(Attribute.EAttType.defense))//att.getValue(Attribute.EAttType.defense)
                this.setAtt(player.userId, Attribute.EAttType.crit, att.getValue(Attribute.EAttType.crit))
                this.setAtt(player.userId, Attribute.EAttType.critDamage, att.getValue(Attribute.EAttType.critDamage))
            }, 3000);
        }
    }

    setAtt(userId: string, type: Attribute.EAttType, val: number) {
        let tsp = this.map.get(userId);
        if (tsp)
            switch (type) {
                case Attribute.EAttType.atk:
                    tsp.setAtk(val)
                    break
                case Attribute.EAttType.defense:
                    tsp.setDefence(val)
                    break
                case Attribute.EAttType.crit:
                    tsp.setCritRate(val)
                    break
                case Attribute.EAttType.critDamage:
                    tsp.setCriteDamageRate(val)
                    break
                case Attribute.EAttType.hp:
                    tsp.setHp(val)
                    break
                case Attribute.EAttType.maxHp:
                    tsp.setHpMax(val)
                    break
            }
    }

    public delPlayer(uid: string) {
        if (!uid) {
            LogMgr.Inst.error('delPlayer id is null')
            return;
        }
        let tsp = this.map.get(uid)
        tsp.destroy()
        this.map.delete(uid);
    }
    public hasPlayer(uid: string): boolean {
        return this.map.has(uid);
    }
    // public setInfo(uid, oid: string, nick: string) {
    //     let tsp = this.getPlayer(uid);
    //     if (tsp) {
    //         tsp.setInfo(oid, nick);
    //         this.map.set(uid, tsp);
    //     }
    //     else
    //         LogMgr.Inst.error('找不到这个用户,请检查:' + uid)
    // }
    public getPlayer(uid: string): TsPlayer {
        let res: TsPlayer = null
        for (let [k, v] of this.map) {
            if (v.getGuid() === uid || k === uid) {
                res = v
                break
            }
        }
        return res
    }
    public getAll(uid?: string): TsPlayer[] {
        if (SystemUtil.isClient()) {
            let dels = []
            for (let [k, v] of this.map) {
                if (!v || v.isOut())
                    dels.push(k)
            }
            for (let id of dels) {
                this.delPlayer(id)
            }
        }
        let list = [];
        for (let [k, v] of this.map) {
            if (!uid || uid != k)
                list.push(v)
        }
        return list;
    }

    /**
     * 获取范围內的玩家
     * @param range 范围
     * @param pos 中心点，默认主角位置
     * @param uid 排查的玩家
     */
    public getRangePlayer(pos: mw.Vector, range: number, uid: string): TsPlayer[] {
        let all = this.getAll(uid);
        let max = range * range
        let list = [];
        for (let p of all) {
            if (p.isDead() || !p.character)
                continue
            let dp = p.character.worldTransform.position;
            if (Vector.squaredDistance(dp.set(dp.x, dp.y, pos.z), pos) <= max)
                list.push(p);
        }
        return list;
    }
    /**
     * 获取最近的玩家（可设范围）
     * @param range 范围
     * @param pos 中心点，默认主角位置
     * @param uid 排查的玩家
     */
    public getNearPlayer(pos, range: number, uid: string): TsPlayer {
        let all = this.getAll(uid);
        let max = range * range
        let player: TsPlayer = null;
        for (let p of all) {
            if (p.isDead() || !p.character)
                continue
            let dp = p.character.worldTransform.position;
            let dis = Vector.squaredDistance(dp.set(dp.x, dp.y, pos.z), pos)
            // console.log("jkjkljkljkl2", dis, max)
            if (dis < max) {
                max = dis;
                player = p;
            }
        }
        return player;
    }
    public getOpenId(uid: string): string {
        let tsp = this.map.get(uid);
        if (tsp)
            return tsp.openId;
        return null;
    }
    getAtt(userId: string, type: Attribute.EAttType) {
        let tsp = this.getPlayer(userId);
        let val: number = 0
        if (tsp) {
            val = tsp.getAtt(type)
        }
        return val
    }

    public onDamage(uid: string, num: number, damageType: number, isCrit: boolean): TsPlayer {
        let obj = this.getPlayer(uid);
        if (obj) {
            const defense = this.getAtt(uid, Attribute.EAttType.defense)
            const final = num - defense >= 0 ? num - defense : 0
            if (final > 0)
                obj.onDamage(final, damageType, isCrit);

        }
        return obj;
    }


}