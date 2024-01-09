import { ModifiedCameraSystem, CameraModifid, } from '../../Modified027Editor/ModifiedCamera';
/*
* @Author: jiezhong.zhang
* @Date: 2023-05-24 14:04:57
* @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
* @LastEditTime: 2023-05-25 13:12:07
*/

import { GlobalData } from "../../const/GlobalData";
import { EffectManager, SoundManager, UIManager } from "../../ExtensionType";
import BlackMask_Generate from "../../ui-generate/BlackMask_generate";
import { GameModuleC } from "../gameModule/GameModuleC";
// import LetterUI from "./LetterUI";

const TRAIN_GUID = "1DB2B656";

export default class CG {
    private static _instance: CG;
    public static get instance(): CG {
        if (CG._instance == null) {
            CG._instance = new CG();
        }
        return CG._instance;
    }

    /** 火车 */
    private _train: mw.GameObject;
    private _transformDoor: mw.Effect
    private _dustEff: mw.Effect
    //摄像机锚点1
    private _anchor: mw.GameObject[] = []
    //相机变换
    private _initTransForm: Transform
    private _initWorldTr: Transform
    private _initArm: number = 0
    private _camera: Camera
    private _callBack: () => void

    private _maskUI: BlackMask_Generate

    public trainDeparture(cb: () => void) {
        this._callBack = cb
        if (!GlobalData.openCG) {
            this._callBack && this._callBack()
            return
        }

        if (!this._train) {
            const root = GameObject.findGameObjectById(TRAIN_GUID);
            this._train = root.getChildByName('童话列车')
            this._transformDoor = root.getChildByName('传送门') as mw.Effect
            this._dustEff = root.getChildByName('爆点') as mw.Effect
            this._anchor.push(this._train.getChildByName('相机锚点2'))
            this._anchor.push(this._train.getChildByName('相机锚点3'))
            let player = Player.localPlayer;
            this._camera = Camera.currentCamera;
            player.character.setVisibility(PropertyStatus.Off)
            this._initTransForm = this._camera.localTransform.clone().clone()
            this._initWorldTr = this._camera.worldTransform.clone().clone()
            this._initArm = this._camera.springArm.length
            this._anchor.forEach(e => {
                e.setVisibility(PropertyStatus.Off)
                e.setCollision(CollisionStatus.Off)
            })
            this._train.setVisibility(PropertyStatus.Off)
            this._maskUI = UIManager.getUI(BlackMask_Generate, true)

        }

        // UIManager.setAllMiddleAndBottomPanelVisible(false);

        this._transformDoor.worldTransform.scale = Vector.zero
        this._train.worldTransform.position = new Vector(11934.990, -24929.990, 4946.570)
        UIManager.showUI(this._maskUI)
        this.setCameraRot(0, this._train.worldTransform.position)

        this.maskFadeOut(this._maskUI.mask, 1800, () => {
            this.setTransfomDoor([0, 30], 2000, () => {
                // this._camera.rotationLagEnabled = true;
                // this._camera.rotationLagSpeed = 1.2;
                setTimeout(() => {
                    SoundManager.playSound('175324', 1, 1)
                    setTimeout(() => {
                        this.setCameraRot(1, this._train.worldTransform.position)
                    }, 1800);
                    // let tmpRot: Rotation = curCameraRot.clone()
                    // let inteval = setInterval(() => {
                    //     if (tmpRot.z - curCameraRot.z <= 90) {
                    //         tmpRot = tmpRot.set(tmpRot.x, tmpRot.y, tmpRot.z + 10)
                    //         ModifiedCameraSystem.setOverrideCameraRotation(tmpRot)
                    //     } else {
                    //         clearInterval(inteval)
                    //         inteval = null
                    //     }
                    // }, 100)
                }, 600)
                this.startTrain()
                // this.setTransfomDoor([5, 0], 1000, () => {
                // this._transformDoor.setVisibility(mw.PropertyStatus.Off)
                // })
                this._train.setVisibility(PropertyStatus.On)
            })

        })
    }

    /**黑幕渐渐消失 */
    public maskFadeOut(ui: mw.Widget, duration: number, complete?: () => void, easingEff = mw.TweenUtil.Easing.Quadratic.In) {
        let opacity = 1
        return new mw.Tween({ value: opacity }).to({ value: 0 }, duration)
            .onUpdate((ref) => {
                ui.renderOpacity = ref.value
            })
            .start().onComplete(() => {
                complete && complete()
            }).easing(easingEff)
    }

    public maskFadeIn(ui: mw.Widget, duration: number, complete?: () => void, easingEff = mw.TweenUtil.Easing.Quadratic.In) {
        let opacity = 0
        return new mw.Tween({ value: opacity }).to({ value: 1 }, duration)
            .onUpdate((ref) => {
                ui.renderOpacity = ref.value
            })
            .start().onComplete(() => {
                complete && complete()
            }).easing(easingEff)
    }


    public setTransfomDoor(tmpScale: number[], time: number = 2000, cb: () => void = null) {
        let tween = new mw.Tween({ scale: tmpScale[0] })
            .to({ scale: tmpScale[1] }, time)
            .onUpdate((obj) => {
                this._transformDoor.worldTransform.scale = new Vector(obj.scale, obj.scale, obj.scale);
            })
            .onComplete(() => {
                cb && cb()
            })
            .start();
    }


    setCameraRot(index: number, objLoc: Vector) {
        this._camera.parent = this._anchor[index];
        let tarLocation = this._anchor[index].worldTransform.position;
        let rotation = null
        if (objLoc) {
            rotation = objLoc.subtract(tarLocation).toRotation();
        } else {
            rotation = this._anchor[index].worldTransform.getForwardVector().toRotation()
        }
        ModifiedCameraSystem.setOverrideCameraRotation(rotation)
        return rotation.clone()
    }

    public startTrain() {
        let tween = new mw.Tween({ position: new Vector(11934.990, -24929.990, 4946.570) })
            .to({ position: new Vector(3039.990, -24929.990, 4946.570) }, 6000)
            .onUpdate((obj) => {
                this._train.worldTransform.position = obj.position;
            })
            .onComplete(() => {
                this._camera.positionLagEnabled = true;
                this._camera.positionLagSpeed = 2;
                this._dustEff.play()
                setTimeout(() => {
                    setTimeout(() => {
                        // setTimeout(() => {

                        // }, 1500);
                        ModifiedCameraSystem.setOverrideCameraRotation(Player.localPlayer.character.worldTransform.rotation);
                        setTimeout(() => {
                            this._camera.positionLagEnabled = false;
                            this._camera.rotationLagEnabled = false;
                            ModifiedCameraSystem.resetOverrideCameraRotation();
                            this._callBack()
                        }, 32);
                    }, 1500)
                }, 200);
            })
            .start();
    }


    public hideTrain() {
        let tween = new mw.Tween({ position: new Vector(-12500, 870, 880) })
            .to({ position: new Vector(-12500, 12000.000, 880) }, 300)
            .onUpdate((obj) => {
                this._train.worldTransform.position = obj.position;
            })
            .onComplete(() => {
                this._train.setVisibility(PropertyStatus.Off, true);
            })
            .start();
    }

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {

    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}