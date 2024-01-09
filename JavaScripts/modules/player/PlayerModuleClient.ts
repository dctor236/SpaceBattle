import { setMyCharacterGuid, setMyPlayerID } from "../../ExtensionType";
import IPlayerModuleBase from "./base/IPlayerModuleBase";
import { ActionModuleC } from "./modules/ActionModule";
import { ClothModuleC } from "./modules/ClothModule";
import { HeadUIModuleC } from "./modules/HeadUIModule";
import { StateModuleC } from "./modules/StateModule";
import { PlayerData } from "./PlayerData";
import PlayerModuleServer from "./PlayerModuleServer";

/**
 * @Author       : 田可成
 * @Date         : 2023-05-08 16:50:15
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-06-08 09:44:12
 * @LastEditTime : 2023-05-09 11:15:17
 * @FilePath     : \mollywoodschool\JavaScripts\modules\player\PlayerModuleClient.ts
 * @Description  : 
 */
export default class PlayerModuleClient extends ModuleC<PlayerModuleServer, PlayerData> implements IPlayerModuleBase {
    public Cloth: ClothModuleC
    public HeadUI: HeadUIModuleC
    public State: StateModuleC
    public Action: ActionModuleC

    protected onStart(): void {
        setMyPlayerID(this.localPlayerId);
        setMyCharacterGuid(this.localPlayer.character.gameObjectId);
        this.Cloth = new ClothModuleC(this)
        this.HeadUI = new HeadUIModuleC(this)
        this.State = new StateModuleC(this)
        this.Action = new ActionModuleC(this)
        this.Cloth["onStart"]()
        this.HeadUI["onStart"]()
        this.State["onStart"]()
        this.Action["onStart"]()
    }

    getDataByPlayer(playerID: number) {
        return this.data
    }
    protected onEnterScene(sceneType: number): void {
        this.init(sceneType)
    }

    protected onUpdate(dt: number): void {
        this.Cloth["onUpdate"](dt)
    }

    public async init(sceneType: number) {
        await Player.asyncGetLocalPlayer();
        if (!this.localPlayer) {
            console.error("玩家初始化可能失败了")
            return;
        }
        await this.Cloth.onEnterScene(sceneType)
        await this.HeadUI.onEnterScene(sceneType)
        await this.State.onEnterScene(sceneType)
        await this.Action.onEnterScene(sceneType)
    }
}
