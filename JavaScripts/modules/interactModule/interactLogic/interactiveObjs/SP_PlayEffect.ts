import { GeneralManager, } from '../../../../Modified027Editor/ModifiedStaticAPI';
﻿/**
 * @Author       : 田可成
 * @Date         : 2023-03-27 10:01:24
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-03-29 13:46:04
 * @FilePath     : \mollywoodschool\JavaScripts\modules\GameLogic\InteractiveObjs\SP_PlayEffect.ts
 * @Description  : 
 */
import { EffectManager } from "../../../../ExtensionType";
import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

@Component
export default class PlayEffect extends InteractObject {
    @mw.Property({ replicated: true, displayName: "资源ID", group: "属性" })
    public resGuid: string = "";
    @mw.Property({ replicated: true, displayName: "循环次数", group: "属性" })
    public loopNum: number = 0;
    @mw.Property({ replicated: true, displayName: "坐标偏移", group: "属性" })
    public offset: mw.Vector = mw.Vector.zero;
    @mw.Property({ replicated: true, displayName: "旋转", group: "属性" })
    public rotation: mw.Rotation = mw.Rotation.zero;
    @mw.Property({ replicated: true, displayName: "缩放", group: "属性" })
    public scale: mw.Vector = mw.Vector.one;

    onStart() {
        this.init(PlayEffect_S, PlayEffect_C);
    }
}
//客户端
class PlayEffect_C extends InteractLogic_C<PlayEffect> {
    onStart(): void {

    }
    public onPlayerAction(playerId: number, active: boolean, param: any): void {

    }
}
//服务端
class PlayEffect_S extends InteractLogic_S<PlayEffect> {
    private playId: number = 0;
    onStart(): void {

    }
    onPlayerAction(playerId: number, active: boolean, param: any): void {
        const resGuid: string = param != null ? param : this.info.resGuid;
        if (mw.StringUtil.isEmpty(resGuid)) return;
        if (active) {
            if (this.info.loopNum == 0 && this.playId != 0) return;
            this.playId = GeneralManager.rpcPlayEffectOnGameObject(resGuid, this.gameObject, this.info.loopNum, this.info.offset, this.info.rotation, this.info.scale);
        } else {
            EffectService.stop(this.playId);
            this.playId = 0;
        }
    }
}