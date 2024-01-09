import { CameraType } from "../../../../ui/cameraUI/CameraMainUI";
import { GameModuleC } from "../../../gameModule/GameModuleC";
import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

/**摄像机类型 */
enum SceneCameraType {
    /**第一人称摄像机 */
    Camera_FP = "第一人称摄像机",
    /**第三人称摄像机 */
    Camera_TP = "第三人称摄像机",
    /**三脚架摄像机 */
    Camera_Tripod = "三脚架摄像机",
}

@Component
export default class SceneCamera extends InteractObject {
    @mw.Property({
        displayName: "工作模式", selectOptions: {
            "第一人称": SceneCameraType.Camera_FP,
            "第三人称": SceneCameraType.Camera_TP,
            "三脚架": SceneCameraType.Camera_Tripod
        }, group: "属性"
    })
    public mode: SceneCameraType = SceneCameraType.Camera_FP;

    public cameraType: CameraType;
    onStart() {
        switch (this.mode) {
            case SceneCameraType.Camera_FP:
                this.cameraType = CameraType.Camera_FP;
                break;
            case SceneCameraType.Camera_TP:
                this.cameraType = CameraType.Camera_TP;
                break;
            case SceneCameraType.Camera_Tripod:
                this.cameraType = CameraType.Camera_Tripod;
                break;
        }
        this.init(SceneCamera_S, SceneCamera_C);
    }
}
//客户端
class SceneCamera_C extends InteractLogic_C<SceneCamera> {
    onStart(): void {

    }
    onPlayerAction(playerId: number, active: boolean, param: any): void {
        ModuleService.getModule(GameModuleC).propShowCameraPanel(this.info.cameraType);
    }

}
//服务端
class SceneCamera_S extends InteractLogic_S<SceneCamera> {
    onStart(): void {

    }
    onPlayerAction(playerId: number, active: boolean, param: any) {

    }
}