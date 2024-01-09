import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
﻿/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-12 21:27:22
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-13 23:52:19
 * @FilePath: \vine-valley\JavaScripts\modules\buff\buffitems\ExampleBuffS.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { BuffC } from "../base/BuffC";
import { BuffS } from "../base/BuffS";

//无法控制
export class BeatFlyBuffS extends BuffS {
    //默认冲量
    protected _impulse: number = 2
    protected onExcete(): void {
        super.onExcete()
        if (this._host && PlayerManagerExtesion.isCharacter(this._host) && this._giver) {
            if (this._host.worldTransform.position) {
                // this._host.movementEnabled = this._host.jumpEnabled = false
                this._host.collisionWithOtherCharacterEnabled = false
                let vec = new Vector(this._host.worldTransform.position.x, this._host.worldTransform.position.y, this._host.worldTransform.position.z + 800).subtract(this.giver.worldTransform.position)
                this.addImpulse(vec)
            } else {
                this.onDestroy()
            }
        }
    }

    public onDestroy() {
        if (this._host && PlayerManagerExtesion.isCharacter(this._host)) {
            // this._host.movementEnabled = this._host.jumpEnabled = true
            this._host.collisionWithOtherCharacterEnabled = true
            this._host.switchToWalking()
        }
        super.onDestroy();
    }


    public addImpulse(impulseVec: Vector) {
        if (PlayerManagerExtesion.isCharacter(this.host)) {
            let dir = impulseVec//.normalized
            dir.set(dir.x * this._impulse, dir.y * this._impulse, Vector.up.z * this._impulse * 400)
            this.host.addImpulse(dir, true)
        }
    }
}

//无法控制
export class BeatFlyBuffC extends BuffC {
    protected onExcete(): void {
        super.onExcete()
    }

    public onDestroy() {
        super.onDestroy();
    }
}