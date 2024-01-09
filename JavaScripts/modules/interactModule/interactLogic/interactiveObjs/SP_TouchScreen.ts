/**
 * @Author       : 田可成
 * @Date         : 2023-03-24 13:46:20
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-03-27 17:11:48
 * @FilePath     : \mollywoodschool\JavaScripts\modules\GameLogic\InteractiveObjs\SP_TouchScreen.ts
 * @Description  : 
 */
import { InputManager } from "../../../../InputManager";
import { InteractModuleClient } from "../../InteractModuleClient";
import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

//开关形式的交互物
@Component
export default class SP_TouchScreen extends InteractObject {
    onStart() {
        this.init(TouchScreen_S, TouchScreen_C);
    }
}
//客户端
class TouchScreen_C extends InteractLogic_C<SP_TouchScreen> {
    onStart(): void {

    }
    public onPlayerAction(playerId: number, active: boolean, param: any): void {
        if (active) {
            InputManager.instance.onTouch.add(this.touchHandle, this);
        } else {
            InputManager.instance.onTouch.remove(this.touchHandle, this);
        }
    }

    touchHandle() {
        ModuleService.getModule(InteractModuleClient).activeNextHandle(this.info, true)
    }

}
//服务端
class TouchScreen_S extends InteractLogic_S<SP_TouchScreen> {
    onStart(): void {

    }
    onPlayerAction(playerId: number, active: boolean) {

    }
}

