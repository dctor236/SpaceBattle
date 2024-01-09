import { ModifiedCameraSystem, CameraModifid, } from '../../Modified027Editor/ModifiedCamera';
/*
* @Author: 代纯 chun.dai@appshahe.com
* @Date: 2023-06-18 08:26:08
* @LastEditors: 代纯 chun.dai@appshahe.com
* @LastEditTime: 2023-07-25 22:49:52
* @FilePath: \vine-valley\JavaScripts\modules\guide\GuideMC.ts
* @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
*/
import { CameraCG } from "module_cameracg";
import { GameConfig } from "../../config/GameConfig";
import { EventsName } from "../../const/GameEnum";
import { P_NPCPanel } from "../npc/NPCPanel";
import GuideMS from "./GuideMS";
import Move from "../../SceneScript/Move";
import { SoundManager } from "../../ExtensionType";

export default class GuideMC extends ModuleC<GuideMS, null> {
    curGuid: number = 30

    protected onStart(): void {
        // InputManager.instance.onKeyDown(mw.Keys.LeftAlt).add(() => {
        //     this.onGuideEnter()
        // })
        Event.addLocalListener(EventsName.ClickGuidButton, (nextGuideId: number) => {
            const elem = GameConfig.Guide.getElement(this.curGuid)
            if (nextGuideId != -1) {
                const index = elem.playerTalk.indexOf(nextGuideId)
                if (index >= 0 && index < elem.nextGuideId.length) {
                    this.curGuid = elem.nextGuideId[index]
                }
            } else {
                if (elem && elem.nextGuideId && elem.nextGuideId.length > 0)
                    this.curGuid = elem.nextGuideId[0]
                else {
                    this.curGuid += 1
                }
            }
            this.onGuideEnter()
        })
    }

    protected onEnterScene(sceneType: number): void {

    }


    showNpcTalk(str: string, talker: string) {
        P_NPCPanel.instance.showNpcTalk(str, true);
        P_NPCPanel.instance.showNpcName(talker)
    }

    orginCamraRot: Rotation = null

    async onGuideEnter() {
        if (!this.orginCamraRot) {
            this.orginCamraRot = Camera.currentCamera.worldTransform.rotation.clone()
        }
        CameraCG.instance.stop();
        let guidCfg = GameConfig.Guide.getElement(this.curGuid)
        if (!guidCfg) {
            console.error("没有这步引导", this.curGuid)
            await CameraCG.instance.exitFreeCamera()
            const cs = Camera.currentCamera
            ModifiedCameraSystem.setOverrideCameraRotation(this.orginCamraRot)
            setTimeout(() => {
                ModifiedCameraSystem.resetOverrideCameraRotation()
            }, 32);
            this.orginCamraRot = null
            P_NPCPanel.instance.hideEvents()
            return
        }
        let scriptList: Move[] = []
        let moverVec: mw.GameObject[] = []
        if (guidCfg.mover && guidCfg.mover.length > 0) {
            guidCfg.mover.forEach(move => {
                const o = GameObject.findGameObjectById(move)
                // await o.asyncReady()
                o.setVisibility(mw.PropertyStatus.On, true)
                o.setCollision(mw.PropertyStatus.Off, true)
                moverVec.push(o)
                let script = o.getScriptByName('Move') as Move
                console.error("guidCfg", o.name, script.name)
                script.tween.start()
                scriptList.push(script)
            })
        }
        if (guidCfg.cameraShake == 1) {
            this.cameraShake(true)
            setTimeout(() => {
                this.cameraShake(false)
            }, 2000);
        }

        if (Number(guidCfg.npcTalk)) {
            P_NPCPanel.instance.showNpcTalk(guidCfg.npcTalk, true);
            P_NPCPanel.instance.setGoodWill(guidCfg.npcID)
        }

        if (Number(guidCfg.bgm)) {
            SoundManager.playSound(guidCfg.bgm, 1, 8)
        }

        if (guidCfg.playerTalk && guidCfg.playerTalk.length > 0) {
            P_NPCPanel.instance.showPlayerTalks(guidCfg.playerTalk);
        }


        if (!StringUtil.isEmpty(guidCfg.cg)) {
            CameraCG.instance.play(guidCfg.cg, () => {

                moverVec.forEach(e => {
                    e.setVisibility(mw.PropertyStatus.Off, true)
                })

                scriptList.forEach(e => {
                    e.tween.stop()
                })

                if (guidCfg.cameraShake == 1)
                    this.cameraShake(false)

            }, false)
        }
    }

    cameraShake(bool: boolean) {
        const camera = Camera.currentCamera
        // FightUtil.shakeObj_2(camera., 3000, 400, 5, 4, 10)
        // camera.screenShock(60, 0.0001, 3000)
        // todo 镜头抖动
        if (bool) {
            let data: CameraModifid.CameraShakeData = {
                fovOscillation: {
                    amplitude: 1,
                    frequency: 30,
                    waveform: CameraModifid.EOscillatorWaveform.PerlinNoise
                }
                ,
                rotPitchOscillation: {//上下晃动
                    amplitude: 1,
                    frequency: 50,
                    waveform: CameraModifid.EOscillatorWaveform.PerlinNoise
                }
                ,
                rotYawOscillation: {//左右晃动
                    amplitude: 1,
                    frequency: 30,
                    waveform: CameraModifid.EOscillatorWaveform.PerlinNoise
                }
                ,
                rotRollOscillation: {
                    amplitude: 1,
                    frequency: 30,
                    waveform: CameraModifid.EOscillatorWaveform.PerlinNoise
                }
                ,
                locXOscillation: {
                    amplitude: 1,
                    frequency: 30,
                    waveform: CameraModifid.EOscillatorWaveform.PerlinNoise
                }
                ,
                locYOscillation: {
                    amplitude: 1,
                    frequency: 30,
                    waveform: CameraModifid.EOscillatorWaveform.PerlinNoise
                }
                ,
                locZOscillation: {
                    amplitude: 1,//0-1
                    frequency: 30,//1-50
                    waveform: CameraModifid.EOscillatorWaveform.PerlinNoise
                }
            }
            ModifiedCameraSystem.startCameraShake(data)
        } else {
            Camera.stopShake()
        }
    }

    //从第几步开始引导
    startGuide(id: number) {
        this.curGuid = id
        this.onGuideEnter()
    }

    isFirstIn: boolean = false
    net_onStartGuide(id: number) {
        if ((id == 50 && !this.isFirstIn) || id != 50) {
            this.startGuide(id)
        }
        if (!this.isFirstIn) {
            this.isFirstIn = true
        }
    }

    //跳过引导
    exitGuide() {

    }

    //跳过CG
    exitCG() {

    }

    protected onUpdate(dt: number): void {

    }

    protected onDestroy(): void {

    }
}