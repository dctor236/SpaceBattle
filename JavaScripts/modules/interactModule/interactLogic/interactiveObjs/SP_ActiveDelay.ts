/**
 * @Author       : 田可成
 * @Date         : 2023-03-21 13:19:53
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-03-27 11:24:27
 * @FilePath     : \mollywoodschool\JavaScripts\modules\GameLogic\InteractiveObjs\SP_ActiveDelay.ts
 * @Description  : 
 */
import InteractMgr from "../../InteractMgr";
import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

//时间延迟
@Component
export default class ActiveDelay extends InteractObject {
    @mw.Property({ displayName: "延迟(秒)", group: "属性" })
    public delay: number = 1;
    onStart() {
        this.init(ActiveDelay_S, ActiveDelay_C);
    }
}
//客户端
class ActiveDelay_C extends InteractLogic_C<ActiveDelay> {
    private startTime: number = 0;
    private param: any;
    onStart(): void {

    }
    public onPlayerAction(playerId: number, active: boolean, param: any): void {
        if (active) {
            this.startTime = mw.TimeUtil.elapsedTime();
            this.param = param;
            this.useUpdate = true;
        } else {
            this.useUpdate = false;//中途停止
            InteractMgr.instance.activeNextHandle(this.info, false, this.param)
        }
    }

    onUpdate(dt: number): void {
        if (mw.TimeUtil.elapsedTime() - this.startTime >= this.info.delay) {
            this.useUpdate = false;
            InteractMgr.instance.activeNextHandle(this.info, true, this.param)
        }
    }
}
//服务端
class ActiveDelay_S extends InteractLogic_S<ActiveDelay> {

    onStart(): void {
    }
    onPlayerAction(playerId: number, active: boolean, param: any): void {

    }
}

