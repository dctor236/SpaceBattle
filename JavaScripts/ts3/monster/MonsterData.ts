/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-25 17:25
 * @LastEditTime : 2023-06-11 11:03
 * @description  : 
 */

import { GameConfig } from "../../config/GameConfig";
import { Attribute } from "../../modules/fight/attibute/Attribute";
import { EMonsterType } from "../../modules/fight/FightDefine";
import FightMgr from "../../modules/fight/FightMgr";
import { LogMgr } from "../com/LogMgr";
import { addScript } from "../com/Tool";
import Monster from "./Monster";
import { MonsterCfg, MonsterDefine } from "./MonsterDefine";

export class MonsterData {
    public monsterMap: Map<string, Monster> = new Map();
    public triMap: Map<string, number> = new Map()
    constructor() {
        Event.addLocalListener(MonsterDefine.Event_Monster_Start, this.onBorn)
    }

    private onBorn = (obj: Monster) => {
        // console.log("注册怪物", obj.mid)
        if (!obj)
            return;
        if (this.monsterMap.has(obj.mid)) {
            // LogMgr.Inst.warn('重复注册怪物：' + obj.gameObject.name + obj.mid)
            return
        }
        this.monsterMap.set(obj.mid, obj);
        if (this.monsterMap.size == GameConfig.Monster.getAllElement().length)
            MonsterDefine.inited = true

        //初始化怪物属性
        let att: Attribute.AttributeValueObject
        if (SystemUtil.isServer()) {
            if (obj.hp > 0 && obj.hpMax > 0) { return }
            att = FightMgr.instance.getMAttibuteList(obj.mid)
            this.setAtt(obj.mid, Attribute.EAttType.maxHp, att.getValue(Attribute.EAttType.maxHp))
            this.setAtt(obj.mid, Attribute.EAttType.hp, att.getValue(Attribute.EAttType.hp))
            this.setAtt(obj.mid, Attribute.EAttType.atk, att.getValue(Attribute.EAttType.atk))
            this.setAtt(obj.mid, Attribute.EAttType.defense, att.getValue(Attribute.EAttType.defense))
            this.setAtt(obj.mid, Attribute.EAttType.speed, att.getValue(Attribute.EAttType.speed))
            this.setAtt(obj.mid, Attribute.EAttType.atkFreq, att.getValue(Attribute.EAttType.atkFreq))
        } else {

        }
    }


    print() {
        this.monsterMap.forEach((k, v) => {
            console.log("KLjkljkljkl", v, k.gameObject.name)
        })
    }
    getAtt(guid: string, type: Attribute.EAttType) {
        let tsp = this.getMonster(guid);
        let val: number = 0
        if (tsp) {
            val = tsp.getAtt(type)
        }
        return val
    }

    public getMonster(guid: string) {
        return this.monsterMap.get(guid)
    }

    public getBossMonster() {
        for (const [k, m] of this.monsterMap) {
            if (m.type == EMonsterType.Boss) {
                return m
            }
        }
        return null
    }


    public getAll() {
        // this.print()
        return this.monsterMap.values();
    }

    public getNear(pos, range: number): Monster {
        let all = this.getAll();
        let max = range * range
        let monster = null;
        // console.log("getNearC", SystemUtil.isClient())
        for (let m of all) {
            // console.log("fasfasfas3", m.name, m.isDead(), m.isHiden())
            if (m.isDead() || m.isHiden())
                continue
            let dp = m.pos;
            if (Math.abs(pos.z - dp.z) <= 1800) {
                dp.set(dp.x, dp.y, pos.z)
            }
            let dis = Vector.squaredDistance(dp, pos)
            if (dis < max) {
                max = dis;
                monster = m;
            }
        }
        return monster;
    }
    public getAreaLiveMonsterNum(TriggerId: string) {
        let all = this.getAll()
        let num = 0
        for (let m of all) {
            const elem = GameConfig.Monster.findElement("Guid", m.mid)
            if (elem && elem.Trigger == TriggerId) {
                if (m.isDead()) {
                }
                else
                    num += 1
            }
        }
        return num
    }

    /**
    * 获取范围內的玩家
    * @param range 范围
    * @param pos 中心点，默认主角位置
    * @param uid 排查的玩家
    */
    public getRangeMonster(pos: mw.Vector, range: number): Monster[] {
        let all = this.getAll();
        let max = range * range
        let list = [];
        for (let m of all) {
            if (m.isDead() || m.isHiden())
                continue
            let dp = m.pos;
            if (Math.abs(pos.z - dp.z) <= 1000) {
                dp.set(dp.x, dp.y, pos.z)
            }
            if (Vector.squaredDistance(dp, pos) <= max)
                list.push(m);
        }
        return list;
    }

    public async register(obj: mw.GameObject, info: MonsterCfg) {
        let sc = await addScript<Monster>(MonsterDefine.scriptGuid, obj, SystemUtil.isServer())
        if (sc) {
            sc.init(info)
        }
        else
            LogMgr.Inst.warn('怪物脚本注册失败：' + MonsterDefine.scriptGuid)
        return sc;
    }
    public setState(sta: number, guid: string) {
        if (guid) {
            let obj = this.getMonster(guid);
            if (obj)
                obj.setMonsterState(sta);
        }
        else {
            this.monsterMap.forEach((v) => {
                v.setMonsterState(sta);
            })
        }
    }

    setAtt(userId: string, type: Attribute.EAttType, val: number) {
        let tsp = this.getMonster(userId);
        if (tsp)
            switch (type) {
                case Attribute.EAttType.atk:
                    tsp.setAtk(val)
                    break
                case Attribute.EAttType.defense:
                    tsp.setDefence(val)
                    break
                case Attribute.EAttType.atkFreq:
                    tsp.setAtkFreq(val)
                    break
                case Attribute.EAttType.speed:
                    tsp.setSpeed(val)
                    break
                case Attribute.EAttType.hp:
                    tsp.setHp(val)
                    break
                case Attribute.EAttType.maxHp:
                    tsp.setHpMax(val)
                    break
            }
    }

    public onDamage(mid: string, num: number, isCrit: boolean, pid: number): Monster {
        let obj = this.getMonster(mid);
        if (obj) {
            const hp = this.getAtt(mid, Attribute.EAttType.hp)
            const final = num
            if (final > 0) {
                obj.onDamage(num, isCrit);
                if (hp - final <= 0) {
                    if (SystemUtil.isServer()) {
                        Event.dispatchToLocal("LastDamage", mid, pid)
                    }
                }
            }
        }
        return obj;
    }
}
