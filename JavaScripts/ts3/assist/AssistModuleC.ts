


/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-02 14:04
 * @LastEditTime : 2023-06-08 19:09
 * @description  : 
 */

import { AssistData } from "./AssistData";
import { AssistModuleS } from "./AssistModuleS";

export interface IDamage {
    host: string
    val: number
    crit: boolean
}

export class AssistModuleC extends ModuleC<AssistModuleS, null> {

    public dataInfo: AssistData;
    private updateTime: number = 1;
    private needUp: boolean = false;
    private damageList: Map<string, IDamage[]> = new Map();
    public Init() {
        this.dataInfo = new AssistData();
    }
    protected onStart(): void {
        Event.addServerListener('ShowAssistName', (list: string[]) => {
            list.forEach(e => {
                this.getAssist(e)?.showName()
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
        if (this.updateTime < 0) {
            this.updateTime = 1;
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
    public getAllAssist() {
        return this.dataInfo.getAll()
    }

    public getAreaLiveAssistNum() {
        return this.dataInfo.getAreaLiveAssistNum()
    }

    public getAssist(guid: string) {
        return this.dataInfo.getAssist(guid)
    }

    public net_Chat(mid, msg: string) {
        let tsp = this.dataInfo.getAssist(mid);
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
