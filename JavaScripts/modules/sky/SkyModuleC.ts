import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';

import { GameConfig } from "../../config/GameConfig";
import { GlobalData } from "../../const/GlobalData";
import { GameModuleC } from "../gameModule/GameModuleC";
import SkyModuleS from "./SkyModuleS";

const color = mw.LinearColor.black;

export default class SkyModuleC extends ModuleC<SkyModuleS, null>{
    public curSkyType: number;
    private saveCurWeatherEff: number[] = []; //存储已经播放的特效ID
    private saveAllTimeOut: any[] = []; //存储所有timeout

    protected onStart(): void {

    }
    protected async onEnterScene(sceneType: number): Promise<void> {
        Skybox.preset = mw.SkyPreset.Dusk2D;
        Skybox.moonVisible = false;
        Skybox.sunVisible = true;
        // this.changeSky(1);
    }

    net_changeSky(id: number, hasDragon: boolean) {
        this.changeSky(id)
        // GlobalData.isDragon = hasDragon
    }

    changeSky(id: number) {
        if (this.curSkyType === id) return
        this.curSkyType = id;
        const data = GameConfig.SkyChange.getElement(id)
        if (!data) {
            return;
        }
        switch (data.skyType) {
            case 1:
                Skybox.sunVisible = true
                Skybox.moonVisible = false
                Skybox.starVisible = false
                break;
            case 2:
                Skybox.sunVisible = false
                Skybox.moonVisible = true
                Skybox.starVisible = true
                break;
            default:
                break;
        }
        Skybox.skyDomeIntensity = data.num1;
        Skybox.skyDomeBaseColor = mw.LinearColor.colorHexToLinearColor(data.num2, color)
        Skybox.skyDomeTopColor = mw.LinearColor.colorHexToLinearColor(data.num3, color)
        Skybox.skyDomeMiddleColor = mw.LinearColor.colorHexToLinearColor(data.num4, color)
        Skybox.skyDomeBottomColor = mw.LinearColor.colorHexToLinearColor(data.num5, color)
        Skybox.skyDomeHorizontalFallOff = data.num6;
        Skybox.cloudColor = mw.LinearColor.colorHexToLinearColor(data.num7, color)
        Skybox.sunSize = data.num15;
        Skybox.sunIntensity = data.num16;
        Skybox.sunColor = mw.LinearColor.colorHexToLinearColor(data.num17, color);
        Skybox.moonSize = data.num18
        Skybox.moonIntensity = data.num19
        Skybox.moonColor = mw.LinearColor.colorHexToLinearColor(data.num20, color);
        Skybox.cloudOpacity = data.num21
        Skybox.cloudDensity = data.num22
        Skybox.cloudSpeed = data.num23
        Skybox.starIntensity = data.num24
        Skybox.starDensity = data.num25

        // Lighting.brightness = data.num8
        Lighting.lightColor = mw.LinearColor.colorHexToLinearColor(data.num9, color)

        Lighting.yawAngle = data.num10
        Lighting.pitchAngle = data.num11
        Lighting.brightness = data.num12
        Lighting.lightColor = mw.LinearColor.colorHexToLinearColor(data.num13, color)
        Lighting.temperature = data.num14

        this.stopAllEffect();
        this.playEffect(data.weatherEffect)

        // ModuleService.getModule(GameModuleC).playBGM(data.music);
    }

    public playEffect(effects: number[]) {
        if (!effects || effects.length === 0) {
            return;
        }
        for (const id of effects) {
            const config = GameConfig.Effect.getElement(id);
            if (!config) {
                continue;
            }
            let effTime: number = null;
            let playTime: number = null;
            if (config.EffectTime >= 0) {
                //播放次数
                effTime = config.EffectTime;
            } else if (config.EffectTime < 0) {
                //播放时间
                effTime = 0;
                playTime = Math.abs(config.EffectTime);
            }
            const effectId = GeneralManager.rpcPlayEffectOnPlayer(
                config.EffectID,
                this.localPlayer,
                config.EffectPoint,
                effTime,
                config.EffectLocation,
                config.EffectRotate.toRotation(),
                config.EffectLarge
            );
            this.saveCurWeatherEff.push(effectId);
            //需要播放时间进入
            if (playTime) {
                const timeId = setTimeout(() => {
                    EffectService.stop(effectId);
                }, playTime * 1000);
                this.saveAllTimeOut.push(timeId);
            }
        }
    }

    /**停止所有特效、timeout */
    public stopAllEffect() {
        if (this.saveCurWeatherEff.length != 0) {
            this.saveCurWeatherEff.forEach(id => {
                EffectService.stop(id);
            });
            this.saveCurWeatherEff.length = 0;
        }
        if (this.saveAllTimeOut.length != 0) {
            this.saveAllTimeOut.forEach(time => {
                clearTimeout(time);
            });
            this.saveAllTimeOut.length = 0;
        }
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {

    }

}
