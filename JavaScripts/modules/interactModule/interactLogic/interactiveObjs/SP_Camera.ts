import { ModifiedCameraSystem, CameraModifid, } from '../../../../Modified027Editor/ModifiedCamera';
import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

/**
 * @Author       : 田可成
 * @Date         : 2023-03-29 16:46:36
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-06 10:38:22
 * @FilePath     : \mollywoodschool\JavaScripts\modules\GameLogic\InteractiveObjs\SP_Camera.ts
 * @Description  : 
 */
@Component
export default class SP_Camera extends InteractObject {
    onStart() {
        this.init(SP_Camera_S, SP_Camera_C);
    }
}

class SP_Camera_C extends InteractLogic_C<SP_Camera> {
    private _oldWorldRotation
    onStart(): void {

    }

    public onPlayerAction(playerId: number, active: boolean, param: any) {
        const character = Player.getPlayer(playerId).character
        const camera = Camera.currentCamera
        const location = character.worldTransform.position
        if (active) {
            this._oldWorldRotation = character.worldTransform.rotation
            camera.positionMode = mw.CameraPositionMode.PositionFixed
            ModifiedCameraSystem.followTargetEnable = false
            camera.springArm.collisionEnabled = false
            const transform = camera.worldTransform.clone()
            transform.position = location
            camera.springArm.localTransform = new mw.Transform(transform)
        } else {
            ModifiedCameraSystem.followTargetEnable = true
            camera.springArm.collisionEnabled = true
            camera.positionMode = mw.CameraPositionMode.PositionFollow
            const transform = camera.localTransform.clone()
            camera.springArm.localTransform = new mw.Transform(transform)
            ModifiedCameraSystem.setOverrideCameraRotation(this._oldWorldRotation);//将相机与玩家方向一致
            setTimeout(() => {
                ModifiedCameraSystem.resetOverrideCameraRotation();
            }, 10);
        }
    }
}
//服务端
class SP_Camera_S extends InteractLogic_S<SP_Camera> {
    onStart(): void {

    }
    onPlayerAction(playerId: number, active: boolean, param: any): void {

    }
}

