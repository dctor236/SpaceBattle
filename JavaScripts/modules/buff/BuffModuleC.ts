/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-12 21:27:29
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-07-27 23:24:38
 * @FilePath: \vine-valley\JavaScripts\modules\buff\BuffModuleC.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** 
* @Author       : MengYao.Zhao
* @Date         : 2022/04/18 11:52:15
* @Description  :  buff示例模块 客户端
*/

import { GameConfig } from "../../config/GameConfig";
import { EventsName } from "../../const/GameEnum";
import { PlayerMgr } from "../../ts3/player/PlayerMgr";
import { updater } from "../fight/utils/Updater";
import { BuffC } from "./base/BuffC";
import { AttibuteBuffC } from "./buffitems/AttibuteBuffS";
import { BeatFlyBuffC } from "./buffitems/BeatFlyBuff";
import { RigidityBuffC } from "./buffitems/RigidityBuffS";
import { UnControlBuffC } from "./buffitems/UnControlBuffS";
import { BuffModuleS } from "./BuffModuleS";
import { EBuffBenefitType, EBuffHostType } from "./comon/BuffCommon";
import UIBuff from "./ui/UIBuff";



export class BuffModuleC extends ModuleC<BuffModuleS, null>{
    private buffPanel: UIBuff;
    protected buffPools: BuffC[] = []

    onStart() {
        // this.buffPanel = mw.UIService.show(UIBuff);
        Event.addLocalListener(EventsName.ClearBuff, (guid: string, configId: number) => {
            this.clearAllBuffByConfig(guid, configId)
        })
    }

    //进入场景
    onEnterScene(sceneType: number): void {
        // InputManager.instance.onKeyDown(mw.Keys.Q).add(() => {
        //     this.server.net_addAbuff(9)
        // })

    }

    public net_onAddABuff(giverGuid: string, hostGuid: string, configId: number, hostType: number) {
        let tmpBUff: BuffC = null
        const elem = GameConfig.Buff.getElement(configId)
        for (const it of this.buffPools) {
            if (it.configId == configId && it.hostType == hostType) {
                tmpBUff = it
                break
            }
        }
        if (!tmpBUff) {
            switch (elem.buffEffectType) {
                case EBuffBenefitType.None:
                    tmpBUff = new BuffC(configId, hostType, elem.buffEffectType, true)
                    break
                case EBuffBenefitType.PropertyChange:
                    tmpBUff = new AttibuteBuffC(configId, hostType, elem.buffEffectType, true)
                    break
                case EBuffBenefitType.UnControl:
                    tmpBUff = new UnControlBuffC(configId, hostType, elem.buffEffectType, true)
                    break
                case EBuffBenefitType.Stun:
                    tmpBUff = new RigidityBuffC(configId, hostType, elem.buffEffectType, true)
                    break
                case EBuffBenefitType.BeatFly:
                    tmpBUff = new BeatFlyBuffC(configId, hostType, elem.buffEffectType, true)
                    break
                default:
                    tmpBUff = new BuffC(configId, hostType, elem.buffEffectType, true)
                    break
            }
            this.buffPools.push(tmpBUff)
        }
        console.log("net_addABuff", hostGuid, configId)
        tmpBUff.start(giverGuid, hostGuid)
    }

    net_reduceBuffList(guid: string, config: number[]) {
        config.forEach(con => {
            this.buffPools.forEach(e => {
                if (e.hostGuid == guid && con == e.configId && e.isActive) {
                    e.onDestroy()
                }
            })
        })
    }

    public getAllBuffByGuid(guid: string) {
        return this.buffPools.filter(e => e.hostGuid == guid)
    }

    public clearAllBuffByConfig(guid: string, config: number) {
        const list = this.getBuffListByConfig(guid, config)
        if (list) {
            list.forEach(e => {
                e.onDestroy()
            })
        }
    }

    public reqAddSBuff(giverGuid: string, hostGuid: string, configId: number, hostType: EBuffHostType) {
        if (giverGuid == '')
            giverGuid = PlayerMgr.Inst.mainUserId
        this.server.net_addAbuff(giverGuid, hostGuid, configId, hostType)
    }


    public reqClearSBuff(hostGuid: string, configId: number, hostType: EBuffHostType) {
        this.server.net_clearABuff(hostGuid, configId, hostType)
    }

    public getBuffListByConfig(guid: string, config: number) {
        return this.buffPools.filter(e => e.isActive && e.hostGuid == guid && e.configId == config)
    }

    @updater.updateByFrameInterval(20)
    protected onUpdate(dt: number): void {
        this.buffPools.forEach(buff => {
            buff.onUpdate(dt)
        })
    }

}