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
 * @LastEditTime: 2023-07-26 00:58:13
 * @FilePath: \vine-valley\JavaScripts\modules\fight\monster\PigMonster.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { GoPool } from "../../../ExtensionType";
import { MonsterCfg, EMonsterBehaviorState, EMonserState } from "../../../ts3/monster/MonsterDefine";
import { CharMonsterBase } from "../../../ts3/monster/behavior/MonsterBase";
import { DropModuleS } from "../../drop/DropModule";
import { ERewardType } from "../../drop/DropItem";
import GameUtils from "../../../utils/GameUtils";
export default class Group extends CharMonsterBase {
    knife: mw.GameObject
    monkey: mw.GameObject;
    public async init(obj: mw.GameObject, cfg: number, monsterStateCb: Action1<EMonserState>): Promise<void> {
        await super.init(obj, cfg, monsterStateCb)
        this.battleEnterTex = [3003, 3004]
    }

    async initAsset() {
        super.initAsset()
        GoPool.asyncSpawn('31163').then(o => {
            this.knife = o
            this.knife.setVisibility(mw.PropertyStatus.Off)
            this.knife.setCollision(mw.CollisionStatus.Off)
        })
    }

    public changeState(state: EMonsterBehaviorState, ...data: any): void {
        super.changeState(state, data)

    }
    public update(dt: number): void {
        super.update(dt)
        // console.log("组长的状态", this.host?.displayName, this.getCurState())
    }


    protected onIdle(...data: any): void {
        super.onIdle(data)
    }

    protected idleUpdate(dt: number, eslapsed: number): void {
        super.idleUpdate(dt, eslapsed)
    }

    protected idleExit(): void {
        super.idleExit()
    }


    protected onAtk(...data: any): void {
        super.onAtk(data)
        if (this.knife) {
            this.knife.setVisibility(mw.PropertyStatus.On)
            this.host.attachToSlot(this.knife, mw.HumanoidSlotType.RightHand)
            this.knife.localTransform.position = Vector.zero
            this.knife.localTransform.rotation = Rotation.zero
        }
    }

    protected atkUpdate(dt: number, eslapsed: number): void {
        super.atkUpdate(dt, eslapsed)
    }
    protected atkExit(): void {
        super.atkExit()
        this.knife.parent = null
        this.knife?.setVisibility(mw.PropertyStatus.Off)
    }

    protected onDead(...data: any): void {
        super.onDead()
        // GameUtils.playSoundOrBgm(88, this.host)
        ModuleService.getModule(DropModuleS).creatDropAll(this.host.worldTransform.position.clone(), this.config.DeathGold[0], 3, 1)
    }
    protected onHit(...data: any): void {
        super.onHit(data)
        // GameUtils.playSoundOrBgm(87, this.host)
    }

    protected onHpChange(hp: number, isForce: boolean): void {
        if (hp < this.curHp) {
            if (hp > 0) {
                this.enterPlayerID.forEach(e => {
                    Event.dispatchToClient(Player.getPlayer(e), "PlayBattleMusic", 87, this.host.gameObjectId)
                })
            }
            else {
                this.enterPlayerID.forEach(e => {
                    Event.dispatchToClient(Player.getPlayer(e), "PlayBattleMusic", 88, this.host.gameObjectId)
                })
            }
        }
        super.onHpChange(hp, isForce)
    }

}