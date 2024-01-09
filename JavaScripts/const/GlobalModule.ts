/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-06-09 11:18
 * @LastEditTime : 2023-06-11 09:50
 * @description  : 
 */
import PlayerModuleClient from "../modules/player/PlayerModuleClient"
import PlayerModuleServer from "../modules/player/PlayerModuleServer"

export class GlobalModule {
    private static _playerModuleC: PlayerModuleClient
    private static _playerModuleS: PlayerModuleServer
    static get MyPlayerC() {
        if (!this._playerModuleC) {
            this._playerModuleC = ModuleService.getModule(PlayerModuleClient)
        }
        if (!this._playerModuleC) {
            return null;
        }
        return this._playerModuleC
    }

    static get MyPlayerS() {
        if (!this._playerModuleS) {
            this._playerModuleS = ModuleService.getModule(PlayerModuleServer)
        }
        if (!this._playerModuleS) {
            return null;
        }
        return this._playerModuleS
    }

}