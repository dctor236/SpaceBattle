/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-07-25 20:21:53
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-08-09 22:16:15
 * @FilePath: \mollywoodschool\JavaScripts\modules\gameModule\GameModuleS.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { EventsName } from "../../const/GameEnum";
import { GlobalData } from "../../const/GlobalData";
import { MonsterMgr } from "../../ts3/monster/MonsterMgr";
import { GameModuleData } from "./GameData";
import { IGameModuleC } from "./GameModuleC";

export interface IGameModuleS {
    net_ResetPos(pos: mw.Vector, rot: Rotation): void;
    net_PlayerLogin(nickName: string): void;
}
//服务端
export class GameModuleS extends ModuleS<IGameModuleC, GameModuleData> implements IGameModuleS {
    private jumpNum: number = 0;
    private playerNickNameMap: Map<number, string>;

    onStart() {
        this.playerNickNameMap = new Map<number, string>();
        // Event.addLocalListener(EventsName.PlayerBattle, (pid: number, sate: boolean, Trigger: string, isForse: boolean) => {
        //     if (!Player.getPlayer(pid)) return
        //     const num = MonsterMgr.Inst.getAreaLiveMonsterNum(Trigger)
        //     if (isForse) {
        //         if (sate) {
        //             this.getClient(pid)?.net_playBattleBGM()
        //         } else {
        //             this.getClient(pid)?.net_playHallBGM()
        //         }
        //     } else {
        //         if (num > 0) {
        //             this.getClient(pid)?.net_playBattleBGM()
        //         } else {
        //             this.getClient(pid)?.net_playHallBGM()
        //         }
        //     }
        // })
    }

    onUpdate(dt: number) {

    }
    onPlayerLeft(player: mw.Player): void {
        if (this.playerNickNameMap.has(player.playerId)) {
            this.playerNickNameMap.delete(player.playerId);
        }
    }

    protected onPlayerEnterGame(player: mw.Player): void {

    }
    /**
     * 重置位置
     */
    public net_ResetPos(pos: mw.Vector, rot: Rotation): void {
        this.currentPlayer.character.worldTransform.position = pos;
        this.currentPlayer.character.worldTransform.rotation = rot;
    }

    public net_PlayerLogin(nickName: string) {
        if (this.playerNickNameMap.has(this.currentPlayerId)) {
            return
        }
        this.playerNickNameMap.set(this.currentPlayerId, nickName)
    }

    public getAllPlayerNickName() {
        return this.playerNickNameMap;
    }
}