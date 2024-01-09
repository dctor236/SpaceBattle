/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-12 21:25:56
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-14 08:17:33
 * @FilePath: \vine-valley\JavaScripts\modules\buff\base\BuffS.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** 
* @Author       : MengYao.Zhao
* @Date         : 2022/04/13 10:55:21
* @Description  :  服务端 Buff数据 主要包含有时限类buff和触发次数类buff的生命周期和逻辑，如果有自己特殊的buff行为，可以进行继承，生成时指定需要的buff类和参数
*/

import { GlobalData } from "../../../const/GlobalData";
import { EBuffBenefitType, EBuffHostType, EBuffOverlayType } from "../comon/BuffCommon";
import { BuffBase } from "./BuffBase";

export class BuffS extends BuffBase {

    constructor(configId: number, hostType: EBuffHostType, benefitType: EBuffBenefitType, isClient: boolean) {
        super(configId, hostType, benefitType, isClient);
        this._id = GlobalData.curBuffID++
    }



    public onUpdate(dt: number): void {
        super.onUpdate(dt)
    }

    public onDestroy(): void {
        super.onDestroy()

    }

}

