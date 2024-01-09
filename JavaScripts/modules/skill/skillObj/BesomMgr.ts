import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import { SpawnManager,SpawnInfo, } from '../../../Modified027Editor/ModifiedSpawn';
﻿import { GlobalData } from "../../../const/GlobalData";
import GameUtils from "../../../utils/GameUtils";

/**
 * @Author       : songxing
 * @Date         : 2023-03-28 18:03:58
 * @LastEditors  : songxing
 * @LastEditTime : 2023-04-11 11:29:37
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\skillObj\BesomMgr.ts
 * @Description  : 魔法扫把管理池子
 */
export namespace BesomEvent {
    export const spwanBesom: string = "spwanBesom"
    export const unspwanBesom: string = "unspwanBesom"
    export const syncDataBesom: string = "syncDataBesom"
}

export default class BesomMgr {
    private _updateFlash: number = 0;

    private static _instance: BesomMgr;
    public static get instance() {
        if (!this._instance) {
            this._instance = new BesomMgr();

        }
        return this._instance
    }

    constructor() {
        this.init();
    }
    //client//
    private playerBesomMap: Map<string, mw.GameObject> = new Map();

    private _besomPool: mw.GameObject[] = [];

    //seriver;
    private flyplayers: string[] = [];

    public async init() {

        if (SystemUtil.isClient()) {
            Event.addServerListener(BesomEvent.spwanBesom, (characterguid: string) => {
                this.spwanaBesomOnPlayer(characterguid);
            })
            Event.addServerListener(BesomEvent.unspwanBesom, (characterguid: string) => {
                this.deletBesomOnPlayer(characterguid);
            })

            Event.addServerListener(BesomEvent.syncDataBesom, (characterguids: string[]) => {
                setTimeout(() => {
                    for (let index = 0; index < characterguids.length; index++) {
                        const element = characterguids[index];
                        this.spwanaBesomOnPlayer(element);
                    }
                }, 3000);
            })
            await this.load()
        } else {
            Event.addClientListener(BesomEvent.spwanBesom, (player, characterguid: string) => {
                if (!this.flyplayers.includes(characterguid)) {
                    this.flyplayers.push(characterguid)
                }
                Event.dispatchToAllClient(BesomEvent.spwanBesom, characterguid)
            })

            Event.addClientListener(BesomEvent.unspwanBesom, (player, characterguid: string) => {
                if (this.flyplayers.includes(characterguid)) {
                    this.flyplayers.splice(this.flyplayers.indexOf(characterguid), 1)
                }
                Event.dispatchToAllClient(BesomEvent.unspwanBesom, characterguid)
            })
        }
    }

    private async load() {
        const asset: string[] = ["157068", "128520", GlobalData.flyStandbyAnim, GlobalData.flyAnim, GlobalData.flyOverAnim]
        for (let index = 0; index < asset.length; index++) {
            const element = asset[index];
            await GameUtils.downAsset(element)

        }
    }

    /*玩家进游戏给他同步最近骑上扫帚的人 Seriver*/
    public onplayerJoin(player: mw.Player) {
        if (this.flyplayers.length > 0) {
            Event.dispatchToClient(player, BesomEvent.syncDataBesom, this.flyplayers)
        }
    }

    private spwan(): mw.GameObject {
        if (this._besomPool.length == 0) {
            let besom = SpawnManager.spawn({ guid: "157068" })
            GeneralManager.rpcPlayEffectOnGameObject("128520", besom, 0)
            this._besomPool.push(besom)
        }
        return this._besomPool.pop();
    }

    /**在某个玩家身上生成一个扫帚 Clinet*/
    public spwanaBesomOnPlayer(characterguid: string) {
        if (this.playerBesomMap.has(characterguid)) return;
        let besom = this.spwan();
        const character = GameObject.findGameObjectById(characterguid) as mw.Character
        besom.setVisibility(mw.PropertyStatus.On)
        character?.attachToSlot(besom, mw.HumanoidSlotType.LeftHand)
        besom.localTransform.position = (new mw.Vector(-38, 28, -115))
        besom.localTransform.rotation = (new mw.Rotation(-14, -18, 5))
        besom.worldTransform.scale = new mw.Vector(1.2, 1.2, 1.85)
        this.playerBesomMap.set(characterguid, besom);
    }


    /**在某个玩家身上删除一个扫帚 Clinet*/
    public deletBesomOnPlayer(characterguid: string) {
        if (!this.playerBesomMap.has(characterguid)) return;
        let besom = this.playerBesomMap.get(characterguid);
        besom.parent = null;
        besom.worldTransform.position = new mw.Vector(0,0,-200)
        besom.setVisibility(mw.PropertyStatus.Off)
        this.unspwan(besom);
        this.playerBesomMap.delete(characterguid);
    }
    private unspwan(obj: mw.GameObject) {
        obj && this._besomPool.push(obj)
    }


    public onUpdate(dt: number): void {
        if (this.playerBesomMap.size == 0) return;    //每隔一秒判断玩家是否退出游戏回收少把
        this._updateFlash++;
        if (this._updateFlash == 60) {
            this._updateFlash = 0;
            this.playerBesomMap.forEach((obj, characterguid) => {
                if (!GameObject.findGameObjectById(characterguid)) {
                    this.deletBesomOnPlayer(characterguid)
                }
            })
        }
    }
}

BesomMgr.instance