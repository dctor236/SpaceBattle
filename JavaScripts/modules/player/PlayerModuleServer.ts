/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-06-09 16:52
 * @LastEditTime : 2023-06-27 16:38
 * @description  : 
 */

import IPlayerModuleBase from "./base/IPlayerModuleBase";
import { ActionModuleS } from "./modules/ActionModule";
import { ClothModuleS } from "./modules/ClothModule";
import { HeadUIModuleS } from "./modules/HeadUIModule";
import { StateModuleS } from "./modules/StateModule";
import { PlayerData } from "./PlayerData";
import PlayerModuleClient from "./PlayerModuleClient";

/**
 * @Author       : 田可成
 * @Date         : 2023-05-08 16:50:26
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-06-05 14:01:39
 * @FilePath     : \mollywoodschool\JavaScripts\modules\player\PlayerModuleServer.ts
 * @Description  : 
 */
export default class PlayerModuleServer extends ModuleS<PlayerModuleClient, PlayerData> implements IPlayerModuleBase {
    public Cloth: ClothModuleS
    public HeadUI: HeadUIModuleS
    public State: StateModuleS
    public Action: ActionModuleS

    protected onStart(): void {
        this.Cloth = new ClothModuleS(this)
        this.HeadUI = new HeadUIModuleS(this)
        this.State = new StateModuleS(this)
        this.Action = new ActionModuleS(this)
        this.Cloth["onStart"]()
        this.HeadUI["onStart"]()
        this.State["onStart"]()
        this.Action["onStart"]()
    }

    getDataByPlayer(player: mw.Player | number) {
        return this.getPlayerData(player)
    }

    // protected onPlayerJoined(player: mw.Player): void {
    //     this.getPlayerData(player).isInit = true
    // }

    protected onPlayerEnterGame(player: mw.Player): void {
        this.init(player)
    }

    private async init(player: mw.Player) {
        await this.Cloth.onPlayerEnterGame(player)
        await this.HeadUI.onPlayerEnterGame(player)
        await this.State.onPlayerEnterGame(player)
        await this.Action.onPlayerEnterGame(player)
    }

    protected onPlayerLeft(player: mw.Player): void {
        this.Cloth.onPlayerLeft(player)
        this.HeadUI.onPlayerLeft(player)
        this.State.onPlayerLeft(player)
        this.Action.onPlayerLeft(player)
    }

    // protected onUpdate(dt: number): void {
    //     for (const player of Player.getAllPlayers()) {
    //         this.getPlayerData(player).update()
    //     }
    // }
}