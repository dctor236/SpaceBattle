/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-13 22:12:55
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-14 07:18:25
 * @FilePath: \vine-valley\JavaScripts\modules\buff\buffitems\InviceBuffS.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import Monster from "../../../ts3/monster/Monster";
import { MonsterMgr } from "../../../ts3/monster/MonsterMgr";
import { PlayerMgr } from "../../../ts3/player/PlayerMgr";
import TsPlayer from "../../../ts3/player/TsPlayer";
import FightMgr from "../../fight/FightMgr";
import { BuffC } from "../base/BuffC";
import { BuffS } from "../base/BuffS";
import { EBuffParamType } from "../comon/BuffCommon";

//属性增益
export class AttibuteBuffS extends BuffS {
    protected onExcete(): void {
        super.onExcete()
        if (this.hostGuid) {
            let target: any = MonsterMgr.Inst.getMonster(this.hostGuid)
            if (!target) {
                target = PlayerMgr.Inst.getPlayer(this.hostGuid)
            }
            let newAtt: number = 0
            if (this.config.param1_Model == EBuffParamType.Percent) {
                newAtt = target.getAtt(this.config.affectProperty) * (1 + this.config.param1)
            } else {
                newAtt = this.config.param1
            }
            target.setAtt(this.config.affectProperty, newAtt)
        }
    }

    /**
   * 销毁，清理
   */
    public onDestroy() {
        if (this.hostGuid) {
            let target: any = MonsterMgr.Inst.getMonster(this.hostGuid)
            if (!target) {
                target = PlayerMgr.Inst.getPlayer(this.hostGuid)
            }
            let lastAtt
            if (target instanceof Monster) {
                lastAtt = FightMgr.instance.getMAttibuteList(this.hostGuid).getValue(this.config.affectProperty)
            } else if (target instanceof TsPlayer) {
                lastAtt = FightMgr.instance.getPAttibuteList(this.hostGuid).getValue(this.config.affectProperty)
            }
            target.setAtt(this.config.affectProperty, lastAtt)
            super.onDestroy();
        }
    }

}

export class AttibuteBuffC extends BuffC {
    protected onExcete(): void {
        super.onExcete()
    }

    public onDestroy() {
        super.onDestroy();
    }
}
