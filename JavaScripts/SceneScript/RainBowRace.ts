import { GeneralManager, } from '../Modified027Editor/ModifiedStaticAPI';
﻿/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-07-19 19:53:41
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-07-19 20:18:47
 * @FilePath: \mollywoodschool\JavaScripts\SceneScript\RainBowRace.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { EventsName } from "../const/GameEnum";
import { UIManager } from "../ExtensionType";
import { MGSMsgHome } from "../modules/mgsMsg/MgsmsgHome";
import { FlyEffect } from "../ui/fly/FlyEffect";
import GameUtils from "../utils/GameUtils";

const Root: string = '2E570DA1'

const SkillID: number = 203101

export default class RainBowRaceMgr {
    private static _instance: RainBowRaceMgr;

    public static get instance(): RainBowRaceMgr {
        if (RainBowRaceMgr._instance == null) {
            RainBowRaceMgr._instance = new RainBowRaceMgr();
        }
        return RainBowRaceMgr._instance;
    }
    private _isInEnvir: boolean = false
    init() {
        let screenEffID
        Event.addLocalListener(EventsName.ShowScreenEff, (bool: boolean) => {
            const char = Player.localPlayer.character
            if (!this._isInEnvir)
                return
            if (bool) {
                char.maxWalkSpeed = 700 * 8;
                char.maxAcceleration = 2048 * 2
                char.maxFlySpeed = 800 * 2
                // const camera = Camera.currentCamera
                // screenEffID = GeneralManager.rpcPlayEffectOnPlayer('146322', Player.localPlayer,
                //     mw.HumanoidSlotType.Head, 0,
                //     new Vector(0, 0, 0), new Rotation(0, 0, 0), new Vector(4, 4, 4))
                UIManager.show(FlyEffect)
            } else {
                UIManager.hide(FlyEffect)
                char.maxWalkSpeed = 700;
                char.maxAcceleration = 2048
                char.maxFlySpeed = 800
                // EffectService.stop(screenEffID)
            }
        })

        GameObject.asyncFindGameObjectById(Root).then(root => {
            const envirTri = root as mw.Trigger
            if (!root) return
            envirTri.onEnter.add(o => {
                if (GameUtils.isPlayerCharacter(o)) {
                    this._isInEnvir = true
                    Event.dispatchToLocal(EventsName.ShowScreenEff, true)
                }
            })

            envirTri.onLeave.add(o => {
                if (GameUtils.isPlayerCharacter(o)) {
                    Event.dispatchToLocal(EventsName.ShowScreenEff, false)
                    this._isInEnvir = false
                    //解除滑板
                    // ModuleService.getModule(BagModuleC).clearShortCutBar()
                    // ModuleService.getModule(SkillModule_Client).getSkillUI([])
                }
            })

            const childTris = root.getChildren()
            for (let i = 0; i < childTris.length; i++) {
                const tri = childTris[i] as mw.Trigger
                tri.onEnter.add(o => {
                    if (GameUtils.isPlayerCharacter(o)) {
                        if (!this._isInEnvir) return
                        MGSMsgHome.uploadMGS('ts_action_click', '每次游戏玩家使用滑板的次数', { button: 'scooter' })
                        // ModuleService.getModule(BagModuleC).clearShortCutBar()
                        // ModuleService.getModule(SkillModule_Client).getSkillUI([SkillID], 302, true)
                    }
                })
            }
        })
    }

    onEnvirTrigerOut() {

    }
    onEnvirTrigerIn() {

    }
}