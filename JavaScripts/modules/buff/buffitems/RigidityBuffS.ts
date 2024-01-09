import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
﻿/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-13 22:12:55
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-16 23:50:13
 * @FilePath: \vine-valley\JavaScripts\modules\buff\buffitems\RigidityBuffS.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { CloseAllUI, ShowAllUI } from "../../../ExtensionType";
import { PlayerStateType } from "../../../const/GameEnum";
import { GlobalModule } from "../../../const/GlobalModule";
import { BuffC } from "../base/BuffC";
import { BuffS } from "../base/BuffS";

//眩晕buff
export class RigidityBuffS extends BuffS {

    protected onExcete(): void {
        super.onExcete()
        // if (this.host && this.host instanceof mw.Player) {
        //     this.host.character.movementEnabled = this.host.character.jumpEnabled = false
        // }
    }

    public onDestroy() {
        // if (this.host && this.host instanceof mw.Player) {
        //     this.host.character.movementEnabled = this.host.character.jumpEnabled = true
        // }
        super.onDestroy();
    }

}

export class RigidityBuffC extends BuffC {
    private _stance: mw.SubStance;
    protected onExcete(): void {
        super.onExcete()
        if (this.host && this.host instanceof mw.Player) {
            this._stance = PlayerManagerExtesion.loadStanceExtesion(this.host.character, '144180', true)
            if (this._stance) {
                this._stance.blendMode = mw.StanceBlendMode.WholeBody
                this._stance?.play()
            }
            this.host.character.movementEnabled = this.host.character.jumpEnabled = false
            // GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Interaction, true);
            CloseAllUI()
        }
    }

    public onDestroy() {
        if (this.host && this.host instanceof mw.Player) {
            this._stance?.stop()
            this.host.character.movementEnabled = this.host.character.jumpEnabled = true
            // GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Interaction, false);
            ShowAllUI()
        }
        super.onDestroy();
    }
}
