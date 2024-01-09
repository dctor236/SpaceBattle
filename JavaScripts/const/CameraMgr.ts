/*
 * @Author: 郝建琦
 * @Date: 2023-03-20 09:38:13
 * @LastEditTime: 2023-03-20 09:38:45
 */
import SkillUI from "../modules/skill/ui/SkillUI";

/**
 * @Author       : 田可成
 * @Date         : 2023-03-07 13:12:26
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-11 10:40:18
 * @FilePath     : \mollywoodschool\JavaScripts\const\CameraMgr.ts
 * @Description  : 
 */
export class CameraMgr {

    private static _instance: CameraMgr
    private _tween: mw.Tween<any>;

    public static get instance() {
        if (!CameraMgr._instance) {
            CameraMgr._instance = new CameraMgr()
        }
        return CameraMgr._instance;
    }

    public character: mw.Character;
    public camera: Camera

    private _tempTargetArmLenth: number = 0
    private _tempCameraFOV: number = 0
    private _tempcameraRelativeLocation: mw.Vector
    private _tempcameraSystemRelativeLocation: mw.Vector
    private _tempMoveFacingDirection: mw.MoveFacingDirection
    constructor() {
        this.character = Player.localPlayer.character
        this.camera = Camera.currentCamera;
        this._tempTargetArmLenth = this.camera.springArm.length
        this._tempCameraFOV = this.camera.fov
        this._tempcameraRelativeLocation = this.camera.localTransform.clone().position
        this._tempcameraSystemRelativeLocation = this.camera.springArm.localTransform.clone().position
        this._tempMoveFacingDirection = this.character.moveFacingDirection;
    }

    public startAim() {
        mw.UIService.getUI(SkillUI).mAim.visibility = mw.SlateVisibility.SelfHitTestInvisible
        this.character.moveFacingDirection = mw.MoveFacingDirection.ControllerDirection;
        this.startTween(250, 400, 60, new mw.Vector(175, 45, -3), new mw.Vector(0, 0, 60))
    }

    public stopAim() {
        const skillUI = mw.UIService.getUI(SkillUI)
        skillUI.mAim.visibility = mw.SlateVisibility.Collapsed
        this.character.moveFacingDirection = this._tempMoveFacingDirection
        this.startTween(250, this._tempTargetArmLenth, this._tempCameraFOV, this._tempcameraRelativeLocation, this._tempcameraSystemRelativeLocation)
    }

    private startTween(tweenTime: number, param1: number, param2: number, param3: mw.Vector, param4: mw.Vector) {
        if (this._tween) this._tween.stop()
        this._tween = new mw.Tween({ param1: this.camera.springArm.length, param2: this.camera.fov, param3: this.camera.localTransform.clone().position, param4: this.camera.springArm.localTransform.clone().position })
            .to({ param1: param1, param2: param2, param3: param3, param4: param4 }, tweenTime)
            .onUpdate((value) => {
                this.camera.springArm.length = value.param1
                this.camera.fov = value.param2
                this.camera.localTransform = new mw.Transform(value.param3, this.camera.localTransform.clone().rotation, this.camera.localTransform.clone().scale);
                this.camera.springArm.localTransform = new mw.Transform(value.param4, this.camera.localTransform.clone().rotation, this.camera.localTransform.clone().scale);
            }).start()
    }
}