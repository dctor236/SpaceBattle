/**
 * 额外注意修改项：
 * 1.lockTargetOffset属性已经改为接口参数了，需要这样加上Camera.currentCamera.lock({offset: })
 */
export class ModifiedCameraSystem {

    private static followEnable;
    private static followRotationValue;
    private static isBind = false;
    public static followTargetEnable = true;
    public static followTargetInterpSpeed = 15;

    /**
     * @description 获取摄像机位置模式
     */
    static get cameraLocationMode(): CameraPositionMode {
        if (!SystemUtil.isClient()) {
            return;
        }
        return Camera.currentCamera.positionMode;
    }
    /**
     * @description 设置摄像机位置模式
     */
    static set cameraLocationMode(newCameraLocationMode: CameraPositionMode) {
        if (!SystemUtil.isClient()) {
            return;
        }
        let tempTransform = Camera.currentCamera.springArm.localTransform;
        Camera.currentCamera.positionMode = newCameraLocationMode;
        if (newCameraLocationMode == CameraPositionMode.PositionFollow) {
            Camera.currentCamera.parent = Player.localPlayer.character;
            Camera.currentCamera.springArm.localTransform = tempTransform;
        }
    }

    public static setCameraFollowTarget(target: GameObject): void {
        if (!SystemUtil.isClient()) return;
        Camera.currentCamera.parent = target;
        Camera.currentCamera.springArm.localTransform = Transform.identity;
    }

    public static cancelCameraFollowTarget(): void {
        if (!SystemUtil.isClient()) return;
        Camera.currentCamera.parent = Player.localPlayer.character;
        Camera.currentCamera.springArm.localTransform = Transform.identity;
    }

    public static setOverrideCameraRotation(newOverrideRotation: Rotation): void {
        if (!SystemUtil.isClient()) return;
        ModifiedCameraSystem.followEnable = true;
        ModifiedCameraSystem.followRotationValue = newOverrideRotation;
        Player.setControllerRotation(ModifiedCameraSystem.followRotationValue);
        if (!ModifiedCameraSystem.isBind) {
            TimeUtil.onEnterFrame.add(() => {
                if (ModifiedCameraSystem.followEnable) {
                    Player.setControllerRotation(ModifiedCameraSystem.followRotationValue);
                }
            }, this);
            ModifiedCameraSystem.isBind = true;
        }
    }

    public static resetOverrideCameraRotation(): void {
        if (!SystemUtil.isClient()) return;
        ModifiedCameraSystem.followEnable = false;
    }

    public static getCurrentSettings(): CameraSystemData {
        if (!SystemUtil.isClient()) return;
        cameraSystemConfig.cameraRelativeTransform = Camera.currentCamera.localTransform;
        cameraSystemConfig.cameraWorldTransform = Camera.currentCamera.worldTransform;
        cameraSystemConfig.targetArmLength = Camera.currentCamera.springArm.length;
        cameraSystemConfig.enableCameraLocationLag = Camera.currentCamera.positionLagEnabled;
        cameraSystemConfig.cameraLocationLagSpeed = Camera.currentCamera.positionLagSpeed;
        cameraSystemConfig.enableCameraRotationLag = Camera.currentCamera.rotationLagEnabled;
        cameraSystemConfig.cameraRotationLagSpeed = Camera.currentCamera.rotationLagSpeed;
        cameraSystemConfig.cameraFOV = Camera.currentCamera.fov;
        cameraSystemConfig.cameraLocationMode = Camera.currentCamera.positionMode;
        cameraSystemConfig.cameraRotationMode = Camera.currentCamera.rotationMode;
        cameraSystemConfig.enableCameraCollision = Camera.currentCamera.springArm.collisionEnabled;
        cameraSystemConfig.cameraUpLimitAngle = Camera.currentCamera.upAngleLimit;
        cameraSystemConfig.cameraDownLimitAngle = Camera.currentCamera.downAngleLimit;
        return cameraSystemConfig;
    }

    public static applySettings(CameraSetting: CameraSystemData): void {
        if (!SystemUtil.isClient()) return;
        Camera.currentCamera.localTransform = CameraSetting.cameraRelativeTransform;
        Camera.currentCamera.springArm.length = CameraSetting.targetArmLength;
        Camera.currentCamera.positionLagEnabled = CameraSetting.enableCameraLocationLag;
        Camera.currentCamera.positionLagSpeed = CameraSetting.cameraLocationLagSpeed;
        Camera.currentCamera.rotationLagEnabled = CameraSetting.enableCameraRotationLag;
        Camera.currentCamera.rotationLagSpeed = CameraSetting.cameraRotationLagSpeed;
        Camera.currentCamera.fov = CameraSetting.cameraFOV;
        ModifiedCameraSystem.cameraLocationMode = CameraSetting.cameraLocationMode;
        Camera.currentCamera.rotationMode = CameraSetting.cameraRotationMode;
        Camera.currentCamera.springArm.collisionEnabled = CameraSetting.enableCameraCollision;
        Camera.currentCamera.upAngleLimit = CameraSetting.cameraUpLimitAngle;
        Camera.currentCamera.downAngleLimit = CameraSetting.cameraDownLimitAngle;
    }

    public static cameraFocusing(targetArmLength: number, targetOffset: Vector, timeInterval = 20): void {
        if (!SystemUtil.isClient()) return;
        let timer = TimeUtil.onEnterFrame.add(() => {
            let interpolationValue = Camera.currentCamera.springArm.length + (targetArmLength - Camera.currentCamera.springArm.length) / timeInterval;
            Camera.currentCamera.springArm.length = interpolationValue;
            if (Math.abs(Camera.currentCamera.springArm.length - targetArmLength) <= 0.5) {
                TimeUtil.onEnterFrame.remove(timer);
            }
        })

    }

    public static startCameraShake(shakeData: CameraModifid.CameraShakeData): void {
        if (!SystemUtil.isClient()) return;
        let info: mw.CameraShakeInfo = {
            rotationYAmplitude: shakeData.rotYawOscillation.amplitude,
            rotationYFrequency: shakeData.rotYawOscillation.frequency,

            rotationZAmplitude: shakeData.rotRollOscillation.amplitude,
            rotationZFrequency: shakeData.rotRollOscillation.frequency,

            rotationXAmplitude: shakeData.rotPitchOscillation.amplitude,
            rotationXFrequency: shakeData.rotPitchOscillation.frequency,

            positionXAmplitude: shakeData.locXOscillation.amplitude,
            positionXFrequency: shakeData.locXOscillation.frequency,

            positionYAmplitude: shakeData.locYOscillation.amplitude,
            positionYFrequency: shakeData.locYOscillation.frequency,

            positionZAmplitude: shakeData.locZOscillation.amplitude,
            positionZFrequency: shakeData.locZOscillation.frequency,
        }
        Camera.shake(info);
    }

    public static stopCameraShake(): void {
        if (!SystemUtil.isClient()) return;
        Camera.stopShake();
    }

    public static getDefaultCameraShakeData(): CameraModifid.CameraShakeData {
        const defaultOscillator: CameraModifid.Oscillator = {
            amplitude: 0,
            frequency: 0,
            waveform: CameraModifid.EOscillatorWaveform.SineWave,
        };
        const defaultCameraShakeData: CameraModifid.CameraShakeData = {
            rotPitchOscillation: { ...defaultOscillator },
            rotYawOscillation: { ...defaultOscillator },
            rotRollOscillation: { ...defaultOscillator },
            locXOscillation: { ...defaultOscillator },
            locYOscillation: { ...defaultOscillator },
            locZOscillation: { ...defaultOscillator },
            fovOscillation: { ...defaultOscillator },
        };
        return defaultCameraShakeData;
    }
}

export namespace CameraModifid {

    export type CameraShakeData = {
        /** 混入的持续时间，其中振荡从 0 缩放到 1 */
        /** 融合的持续时间，其中振荡从 1 缩放到 0 */
        /** 旋转Pitch轴振荡 */
        rotPitchOscillation?: Oscillator;
        /** 旋转Yaw轴振荡 */
        rotYawOscillation?: Oscillator;
        /** 旋转Roll轴振荡 */
        rotRollOscillation?: Oscillator;
        /** 位置X轴振荡 */
        locXOscillation?: Oscillator;
        /** 位置Y轴振荡 */
        locYOscillation?: Oscillator;
        /** 位置Z轴振荡 */
        locZOscillation?: Oscillator;
        /** FOV振荡 */
        fovOscillation?: Oscillator;
    };

    export type Oscillator = {
        /** 正弦振荡的幅度 */
        amplitude?: number;
        /** 正弦振荡的频率 */
        frequency?: number;
        /** 如何开始(从零开始，或者从随机值开始) */
        /** 用于振荡的波形类型 */
        waveform?: EOscillatorWaveform;
    };

    /**
     * @author yunhao.liao
     * @description 振荡器波形
     * @groups AVATAR
     */
    export enum EOscillatorWaveform {
        /** 正弦波 */
        SineWave = 0,
        /** Perlin噪声 */
        PerlinNoise = 1
    }
}

type CameraSystemData = {

    /** @description 摄像机相对Transform */
    cameraRelativeTransform?: Transform,

    /** @description 摄像机世界Transform */
    cameraWorldTransform?: Transform,

    /** @description 投影模式 */
    cameraProjectionMode?: CameraProjectionMode,

    /** @description 距离调整 */
    targetArmLength?: number,

    /** @description 开启摄像机位置延迟 */
    enableCameraLocationLag?: boolean,

    /** @description 摄像机位置延迟速度 */
    cameraLocationLagSpeed?: number,

    /** @description 开启摄像机旋转延迟 */
    enableCameraRotationLag?: boolean,

    /** @description 摄像机旋转延迟速度 */
    cameraRotationLagSpeed?: number,

    /** @description 视场 */
    cameraFOV?: number,

    /** @description 摄像机位置模式 */
    cameraLocationMode?: CameraPositionMode,

    /** @description 摄像机朝向模式 */
    cameraRotationMode?: CameraRotationMode,

    /** @description 是否有摄像机碰撞 */
    enableCameraCollision?: boolean,

    /** @description 向上限制角度 */
    cameraUpLimitAngle?: number,

    /** @description 向下限制角度 */
    cameraDownLimitAngle?: number,

}

const cameraSystemConfig: CameraSystemData = {
    cameraRelativeTransform: Transform.identity,
    cameraWorldTransform: Transform.identity,
    targetArmLength: 400,
    enableCameraLocationLag: false,
    cameraLocationLagSpeed: 10,
    enableCameraRotationLag: false,
    cameraRotationLagSpeed: 10,
    cameraFOV: 90,
    cameraLocationMode: CameraPositionMode.PositionFollow,
    cameraRotationMode: CameraRotationMode.RotationControl,
    enableCameraCollision: true,
    cameraUpLimitAngle: 40,
    cameraDownLimitAngle: -40,
};