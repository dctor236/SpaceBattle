
import { GameConfig } from "../../config/GameConfig";
import FightMgr from "../../modules/fight/FightMgr";
import GameUtils from "../../utils/GameUtils";
import { AssistData } from "./AssistData";
import { AssistCfg, AssistDefine } from "./AssistDefine";
import { AssistModuleC, IDamage } from "./AssistModuleC";
/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-25 14:34
 * @LastEditTime : 2023-06-07 15:48
 * @description  : 
 */
export class AssistModuleS extends ModuleS<AssistModuleC, null> {
    public dataInfo: AssistData;

    public init() {
        this.dataInfo = new AssistData();
    }

    protected defaultRadius: number = 100
    protected inpectPos: Vector = Vector.zero

    protected override onStart(): void {
        super.onStart()
        // Event.addLocalListener("GiveAActionPoint", (mid: string, inpectPos: Vector, boxX: number) => {
        //     if (this.inpectPos != inpectPos) {
        //         this.defaultRadius = 100
        //     }
        //     let res = this.calculPointToPosCircle(inpectPos, this.defaultRadius, boxX)
        //     if (res.x == 0 && res.y == 0 && res.z == 0) {
        //         this.defaultRadius += 100
        //     }
        //     Event.dispatchToLocal('OnReplyPoint', mid, res)
        // })

        Event.addLocalListener("AssistSay", (mid: string, txt: string) => {
            this.setChat(txt, mid)
        })
    }

    protected onPlayerEnterGame(player: mw.Player): void {
        const p = player
        let vec: string[] = []
        for (const item of this.getAllAssist()) {
            if (!item.isDead() && !item.isHiden())
                vec.push(item.mid)
        }

        setTimeout(() => {
            Event.dispatchToClient(p, 'ShowAssistName', vec)
        }, 3000);

    }

    protected onUpdate(dt: number): void {
        AssistDefine.frameNum++;
        if (AssistDefine.frameNum > 10000)
            AssistDefine.frameNum = 0;
    }

    public async register(obj: mw.GameObject, info: AssistCfg) {
        return await this.dataInfo.register(obj, info);
    }

    public getAssist(guid: string) {
        return this.dataInfo.getAssist(guid)
    }
    public getAreaLiveAssistNum() {
        return this.dataInfo.getAreaLiveAssistNum()
    }

    public getAllAssist() {
        return this.dataInfo.getAll()
    }

    curCapacity: number = 0
    //判断目标一圈范围能不能找到一个点容纳一个怪物
    public calculPointToPosCircle(inpectPos: Vector, radius: number, boxX: number): Vector {
        const L = 2 * Math.PI * radius
        const maxCapacity = Math.floor(L / 140) + 1
        for (let i = this.curCapacity; i < maxCapacity; i++) {
            const res = Math.round(i * 360 / maxCapacity)
            const vec = inpectPos.add(GameUtils.suan(radius, res))
            for (const m of this.getAllAssist()) {
                const pos = m.pos
                if (Math.abs(pos.x - vec.x) <= 85
                    && Math.abs(pos.y - vec.y) <= 85) {
                    this.curCapacity += 1
                    break
                }
            }
        }
        // console.log("klkllkklk", this.curCapacity + 1, maxCapacity)
        if (this.curCapacity + 1 < maxCapacity) {
            this.curCapacity += 1
            const res = Math.round(this.curCapacity * 360 / maxCapacity)
            const vec = inpectPos.add(GameUtils.suan(radius, res))
            return vec
        } else {
            this.curCapacity = 0
            return Vector.zero
        }

    }


    public setState(num: number, guid?: string) {
        this.dataInfo.setState(num, guid);
    }

    setChat(msg: string, mid: string) {
        this.getAllClient().net_Chat(mid, msg)
    }

    public onDamage(guid: string, num: number, isCrit: boolean) {
        this.dataInfo.onDamage(guid, num, isCrit, this.currentPlayerId);
    }

    public net_damage(str1: string) {
        let infos: IDamage[] = JSON.parse(str1)
        let ids: string[] = []
        infos.forEach(e => {
            if (ids.indexOf(e.host) == -1) {
                ids.push(e.host)
            }
            // FightMgr.instance.creatMonsterInfo(e.host)
        })

        for (let i = 0; i < ids.length; i++) {
            const list = infos.filter(e => e.host == ids[i])
            let mDamage: number = 0
            list.forEach(e => {
                let dag = e.val
                let crit = e.crit
                this.onDamage(e.host, dag, crit);
                mDamage += dag
            })
            // FightMgr.instance.loadPlayerDamage(ids[i], this.currentPlayerId, mDamage)
        }
    }
}



