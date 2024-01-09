import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
/** 
* @Author       : xianjie.xia
* @LastEditors  : xianjie.xia
* @Date         : 2023-06-19 14:52
* @LastEditTime : 2023-06-19 15:06
* @description  : 
*/
/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-14 20:20:46
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-07-08 11:51:02
 * @FilePath: \vine-valley\JavaScripts\modules\fight\monster\PigMonster.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { MonsterBase } from "../../../ts3/monster/behavior/MonsterBase";
export default class PigMonster extends MonsterBase {
    ranSkill: number[] = [1001]
    atkInteval = null

    protected onIdle(...data: any): void {
        super.onIdle(data)
        if (this.atkInteval) {
            clearInterval(this.atkInteval)
            this.atkInteval = null
        }
        this.timerList.push(this.atkInteval)
        this.atkInteval = setInterval(() => {
            let target //= PlayerMgr.Inst.getNearPlayer(1000, "0", this.host.worldTransform.position)
            if (target) {
                if (PlayerManagerExtesion.isNpc(this.host)) {
                    this.host.worldTransform.lookAt(target.character.worldTransform.position)
                    // ModuleService.getModule(MonsterSkillMS).useSkill(
                    //     this.ranSkill[MathUtil.randomInt(0, this.ranSkill.length)], this.host.guid)
                }
            }
        }, 3000)
    }
    protected idleUpdate(dt: number, eslapsed: number): void {
        super.idleUpdate(dt, eslapsed)
        // if (PlayerManagerExtesion.isNpc(this.host)) {
        //     this.pos = this.host.worldTransform.position;
        //     let target = PlayerMgr.Inst.getNearPlayer(1000, "0", this.host.worldTransform.position)
        //     if (target) {
        //         this.host.lookAt(target.character.worldTransform.position)
        //     }
        // }
    }

    protected idleExit(): void {
        super.idleExit()
        clearInterval(this.atkInteval)
        this.atkInteval = null
    }


}