

import { AssetsConfig } from "../../config/Assets";
import { GameConfig } from "../../config/GameConfig";
import { Attribute } from "../../modules/fight/attibute/Attribute";
import FightMgr from "../../modules/fight/FightMgr";
import { LogMgr } from "../com/LogMgr";
import { addScript } from "../com/Tool";
import Assist from "./Assist";
import { AssistCfg, AssistDefine } from "./AssistDefine";

export class AssistData {
    public assistMap: Map<string, Assist> = new Map();
    constructor() {
        Event.addLocalListener(AssistDefine.Event_Assist_Start, this.onBorn)
    }

    private onBorn = (obj: Assist) => {
        // console.log("注册协同", obj.mid, GameConfig.Assist.getAllElement().length, this.assistMap.size)
        if (!obj)
            return;
        if (this.assistMap.has(obj.mid)) {
            // LogMgr.Inst.warn('重复注册协同：' + obj.gameObject.name + obj.mid)
            return
        }
        this.assistMap.set(obj.mid, obj);
        if (this.assistMap.size == GameConfig.Assist.getAllElement().length)
            AssistDefine.inited = true

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
        this.assistMap.forEach((k, v) => {
            console.log("KLjkljkljkl", v, k.gameObject.name)
        })
    }
    getAtt(guid: string, type: Attribute.EAttType) {
        let tsp = this.getAssist(guid);
        let val: number = 0
        if (tsp) {
            val = tsp.getAtt(type)
        }
        return val
    }

    public getAssist(guid: string) {
        return this.assistMap.get(guid)
    }


    public getAll() {
        // this.print()
        return this.assistMap.values();
    }

    public getNear(pos, range: number): Assist {
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
    public getAreaLiveAssistNum(): Assist[] {
        let all = this.getAll()
        let num = 0
        let list = [];
        for (let m of all) {
            const elem = GameConfig.Monster.findElement("Guid", m.mid)
            if (m.isDead()) {
            }
            else {
                list.push(m);
            }
        }
        return list
    }

    /**
    * 获取范围內的玩家
    * @param range 范围
    * @param pos 中心点，默认主角位置
    * @param uid 排查的玩家
    */
    public getRangeAssist(pos: mw.Vector, range: number): Assist[] {
        let all = this.getAll();
        let max = range * range
        let list = [];
        for (let m of all) {
            if (m.isDead() || m.isHiden())
                continue
            let dp = m.pos;
            // if (Math.abs(pos.z - dp.z) <= 1000) {
            dp.set(dp.x, dp.y, pos.z)
            // }
            if (Vector.squaredDistance(dp, pos) <= max) {
                list.push(m);
            }
        }
        return list;
    }

    public async register(obj: mw.GameObject, info: AssistCfg) {
        let sc = await addScript<Assist>(AssistDefine.scriptGuid, obj, SystemUtil.isServer())
        if (sc) {
            sc.init(info)
        }
        else
            LogMgr.Inst.warn('assit脚本注册失败：' + AssistDefine.scriptGuid)
        return sc;
    }
    public setState(sta: number, guid: string) {
        if (guid) {
            let obj = this.getAssist(guid);
            if (obj)
                obj.setAssistState(sta);
        }
        else {
            this.assistMap.forEach((v) => {
                v.setAssistState(sta);
            })
        }
    }

    setAtt(userId: string, type: Attribute.EAttType, val: number) {
        let tsp = this.getAssist(userId);
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

    public onDamage(mid: string, num: number, isCrit: boolean, pid: number): Assist {
        let obj = this.getAssist(mid);
        if (obj) {
            const defense = this.getAtt(mid, Attribute.EAttType.defense)
            const hp = this.getAtt(mid, Attribute.EAttType.hp)
            let final = 0
            if (num > 0) {
                final = num - defense >= 0 ? num - defense : 0
            } else {
                final = num - defense
            }
            if (final != 0) {
                obj.onDamage(num, isCrit);
                if (hp - final <= 0) {
                    // if (SystemUtil.isServer())
                    //     Event.dispatchToLocal("LastDamage", mid, pid)
                }
            }
        }
        return obj;
    }
}
