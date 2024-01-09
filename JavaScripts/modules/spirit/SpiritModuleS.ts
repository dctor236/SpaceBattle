/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-07 20:34:18
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-27 21:22:56
 * @FilePath: \vine-valley\JavaScripts\modules\spirit\SpiritModuleS.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { EventsName } from "../../const/GameEnum";
import SpiritModuleC from "./SpiritModuleC";

export default class SpiritModuleS extends ModuleS<SpiritModuleC, null> {
    private spiritMap: Map<number, number> = new Map()
    protected onStart(): void {
        // Event.addLocalListener(EventsName.SpiritBattle, (pid: number, sate: boolean) => {
        //     if (!Player.getPlayer(pid)) return
        //     this.getClient(pid)?.net_setBattle(sate)
        // })
    }

    protected onUpdate(dt: number): void {

    }

    protected onPlayerLeft(player: mw.Player): void {
        const pid = player.playerId
        if (this.spiritMap.has(pid)) {
            const spiritList = this.spiritMap.get(pid)
            if (spiritList > 0) {
                this.asynFollow(JSON.stringify([]), pid)
            }
        }
    }

    net_asynFollow(str: string) {
        this.asynFollow(str, this.currentPlayerId)
    }

    asynFollow(str: string, pid: number) {
        const list: string[] = JSON.parse(str)
        this.spiritMap.set(pid, list.length)
        Player.getAllPlayers().forEach(e => {
            if (e.playerId != pid) {
                this.getClient(e).net_onAsyncFollow(str, pid)
            }
        })
    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}