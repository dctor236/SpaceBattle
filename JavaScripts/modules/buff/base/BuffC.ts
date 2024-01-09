import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-12 21:25:56
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-14 07:27:00
 * @FilePath: \vine-valley\JavaScripts\modules\buff\base\BuffC.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { IEffectElement } from "../../../config/Effect";
import { GameConfig } from "../../../config/GameConfig";
import { EBuffHostType } from "../comon/BuffCommon";
import { BuffBase } from "./BuffBase";

/** 
* @Author       : MengYao.Zhao
* @Date         : 2022/04/13 10:55:21
* @Description  :  客户端 Buff数据 ，仅用于表现，展示特效等
*/
export class BuffC extends BuffBase {
    public onUpdate(dt: number): void {
        super.onUpdate(dt)
    }

    // public async playEffectInPlayer(effElem: IEffectElement) {
    //     if (this.host instanceof mw.Player) {
    //         console.log("playEffectInPlayer")
    //         this.eff = GeneralManager.rpcPlayEffectOnPlayer(
    //             effElem.EffectID, this.host, effElem.EffectPoint, this.config.loop, effElem.EffectLocation, new Rotation(effElem.EffectRotate), effElem.EffectLarge);
    //     }
    // }

    public onDestroy() {
        super.onDestroy();
    }

}