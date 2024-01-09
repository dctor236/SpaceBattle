/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-07-06 20:29:57
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-08-11 21:15:25
 * @FilePath: \mollywoodschool\JavaScripts\modules\skill\runtime\SkillRuntime.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ISkillEntity } from "../define/SkillDefine";
import { RuntimeConst } from "./Const";

export enum ESkillEvent {
    SE_CAST = 'SE_CAST',
    SE_MOVED = 'SE_MOVED',
    SE_BREAK = 'SE_BREAK',
    SE_STOP = 'SE_STOP',
}

export class SkillRuntime {
    constructor(private manager: {
        _onCast: (clientId: number, hostId: string, skillId: number, param: string) => void,
        _onStop: (casterId: string, skillId: number) => void,
        _onBreak: (casterId: string, skillId: number) => void,
        _onMoved: (casterId: string, dest: mw.Vector, rot: mw.Rotation) => void,
        entinys: ISkillEntity[]
    }) {
        this.listenOn();
        this.start();
    }

    // private movers: { guid: string, obj: mw.GameObject, time: number, speed: number, dest: mw.Vector }[] = [];
    private listenOn() {
        if (mw.SystemUtil.isServer()) {
            Event.addClientListener(ESkillEvent.SE_CAST, (player, clientId: number, hostId: string, skillId: number, param?: string) => {
                this.sendRangePlayer(player, ESkillEvent.SE_CAST, clientId, hostId, skillId, param);
            });
            Event.addClientListener(ESkillEvent.SE_STOP, (player, guid, skillId: number) => {
                //Event.dispatchToAllClient(ESkillEvent.SE_STOP, guid, skillId);
                this.sendRangePlayer(player, ESkillEvent.SE_STOP, guid, skillId);
            });
            Event.addClientListener(ESkillEvent.SE_BREAK, (player, guid, skillId: number) => {
                //Event.dispatchToAllClient(ESkillEvent.SE_BREAK, guid, skillId);
                this.sendRangePlayer(player, ESkillEvent.SE_BREAK, guid, skillId);
            });
            Event.addClientListener(ESkillEvent.SE_MOVED, (player, guid: string, dest, rot) => {
                //Event.dispatchToAllClient(ESkillEvent.SE_MOVED, guid, dest, rot);
                this.sendRangePlayer(player, ESkillEvent.SE_MOVED, guid, dest, rot);
            });
            // Event.addClientListener(ESkillEvent.SE_MOVE_END, (player, guid: string, dest: mw.Vector) => {
            //     this.stopMover(guid, dest);
            // });
        } else {
            Event.addServerListener(ESkillEvent.SE_CAST, (clientID: number, hostId: string, skillId: number, param?: string) => {
                this.manager._onCast(clientID, hostId, skillId, param);
            });
            Event.addServerListener(ESkillEvent.SE_STOP, (hostId: string, skillId: number) => {
                this.manager._onStop(hostId, skillId);
            });
            Event.addServerListener(ESkillEvent.SE_BREAK, (hostId: string, skillId: number) => {
                this.manager._onBreak(hostId, skillId);
            });
            Event.addServerListener(ESkillEvent.SE_MOVED, (hostId: string, dest: mw.Vector, rot: mw.Rotation) => {
                this.manager._onMoved(hostId, dest, rot);
            });
        }
        return this;
    }
    public sendRangePlayer(player, type, ...args) {
        const all: mw.Player[] = Player.getAllPlayers();
        const pos = player.character ? player.character.worldTransform.position : null;
        if (!pos)
            return;
        for (const p of all) {
            const dest = p.character ? p.character.worldTransform.position : null
            if (!dest || p.playerId == player.playerId)
                continue;
            if (pos) {
                const dis = mw.Vector.squaredDistance(dest, pos);
                if (dis <= RuntimeConst.SEND_RANGE)
                    Event.dispatchToClient(p, type, ...args);
            }
        }
    }
    private start() {
        let time = Date.now();
        setInterval(() => {
            const now = Date.now();
            const pass = (now - time) * 0.001;
            time = now;
            this.runEntitys(pass);
        }, 1);
        return this;
    }
    private runEntitys(dt: number) {
        for (let i = 0; i < this.manager.entinys.length; i++) {
            if (this.manager.entinys[i].onUpdate(dt)) {
                this.manager.entinys.splice(i, 1);
                i--;
            }
        }
    }

}