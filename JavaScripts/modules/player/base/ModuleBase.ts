/**
 * @Author       : 田可成
 * @Date         : 2023-05-29 09:37:47
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-06-05 11:49:57
 * @FilePath     : \mollywoodschool\JavaScripts\modules\player\base\ModuleBase.ts
 * @Description  : 
 */

import { PlayerData } from "../PlayerData"
import IPlayerModuleBase from "./IPlayerModuleBase"

export class ModuleBaseC {
    protected get currentPlayer(): mw.Player {
        return this.moduleC["currentPlayer"]
    }
    protected get currentPlayerId(): number {
        return this.moduleC["currentPlayerId"]
    }
    protected get data(): PlayerData {
        return this.moduleC.getDataByPlayer(this.currentPlayerId)
    }
    constructor(protected moduleC: IPlayerModuleBase) {
    }
    protected onStart() {

    }


    protected onUpdate(dt: number): void {

    }
    public onEnterScene(sceneType: number) {

    }


}

export class ModuleBaseS {

    constructor(protected moduleS: IPlayerModuleBase) {
    }

    protected getPlayerData(player: mw.Player | number): PlayerData {
        return this.moduleS.getDataByPlayer(player)
    }

    protected onStart() {

    }

    public onPlayerEnterGame(player: mw.Player) {

    }

    public onPlayerLeft(player: mw.Player): void {

    }
}