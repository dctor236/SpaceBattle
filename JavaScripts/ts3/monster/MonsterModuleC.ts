import { MonsterModuleS } from "./MonsterModuleS";
import { MonsterData } from "./MonsterData";
/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-02 14:04
 * @LastEditTime : 2023-06-08 19:09
 * @description  : 
 */

export interface IDamage {
    host: string
    val: number
    crit: boolean
}

export class MonsterModuleC extends ModuleC<MonsterModuleS, null> {

    public dataInfo: MonsterData;
    private updateTime: number = 1;
    private needUp: boolean = false;
    private damageList: Map<string, IDamage[]> = new Map();
    public Init() {
        this.dataInfo = new MonsterData();
    }
    protected onStart(): void {
        Event.addServerListener('ShowMonsterName', (list: string[]) => {
            list.forEach(e => {
                this.getMonster(e)?.showName()
            })
        })
    }

    public async register(obj: mw.GameObject, info) {
        let m = await this.dataInfo.register(obj, info);
        m.isLocal = true;
        return m;
    }

    protected onUpdate(dt: number): void {
        this.updateTime -= dt;
        if (this.updateTime <= 0) {
            this.updateTime = 0.1;
            this.upDamage();
        }
    }

    public setState(sta: number, guid?: string) {
        this.dataInfo.setState(sta, guid);
    }

    public setHeadUI() {
        let all = this.dataInfo.getAll();
        for (let v of all) {
            v.setHeadUI();
        }
    }
    public getMonster(guid: string) {
        return this.dataInfo.getMonster(guid)
    }

    public getBossMonster() {
        return this.dataInfo.getBossMonster()
    }

    public getAllMonser() {
        return this.dataInfo.getAll()
    }

    public getAreaLiveMonsterNum(TriggerId: string) {
        return this.dataInfo.getAreaLiveMonsterNum(TriggerId)
    }

    public net_Chat(mid, msg: string) {
        let tsp = this.dataInfo.getMonster(mid);
        if (tsp)
            tsp.showChat(msg);
    }

    public onDamage(guid: string, num: number, isCrit: boolean) {
        let obj = this.dataInfo.onDamage(guid, num, isCrit, this.localPlayerId);
        if (!obj || obj.isLocal)
            return;
        let dmg = []
        if (!this.damageList.has(guid)) {
            this.damageList.set(guid, [])
        }
        dmg = this.damageList.get(guid);
        dmg.push({ host: guid, val: num, crit: isCrit })
        this.damageList.set(guid, dmg);
        this.needUp = true;
    }
    private upDamage() {
        if (!this.needUp)
            return;
        // let ids = Array.from(this.damageList.keys());
        // let dmgs = Array.from(this.damageList.values());
        let dmgs: IDamage[] = [];
        for (let [k, v] of this.damageList) {
            v.forEach(it => {
                dmgs.push(it);
            })
        }
        this.damageList.clear();
        this.server.net_damage(JSON.stringify(dmgs));
        this.needUp = false;
    }
}
