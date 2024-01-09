/**
 * @Author       : 田可成
 * @Date         : 2023-03-29 13:09:35
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-03-29 13:34:46
 * @FilePath     : \mollywoodschool\JavaScripts\modules\GameLogic\InteractiveObjs\SP_PlaySound.ts
 * @Description  : 
 */
import { SoundManager } from "../../../../ExtensionType";
import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

@Component
export default class PlaySound extends InteractObject {
    @mw.Property({ replicated: true, displayName: "资源ID", group: "属性" })//如果写了就播放固定id 如果没写就播放上个节点传下来的声音
    public resGuid: string = "";
    @mw.Property({ replicated: true, displayName: "循环次数", group: "属性" })
    public loopNum: number = 1;

    onStart() {
        this.init(PlaySound_S, PlaySound_C);
    }
}
//客户端
class PlaySound_C extends InteractLogic_C<PlaySound> {
    public onPlayerAction(playerId: number, active: boolean, param: any): void {
        const resGuid: string = param != null ? param : this.info.resGuid;
        if (StringUtil.isEmpty(resGuid)) return;
        if (active) {
            SoundManager.stopSound(resGuid);
            SoundManager.playSound(resGuid, this.info.loopNum);
        } else {
            SoundManager.stopSound(resGuid);
        }
    }
    onStart(): void {

    }
}
//服务端
class PlaySound_S extends InteractLogic_S<PlaySound> {
    onStart(): void {

    }
    onPlayerAction(playerId: number, active: boolean, param: any): void {

    }
}