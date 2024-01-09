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
 * @LastEditTime: 2023-08-05 12:54:31
 * @FilePath: \vine-valley\JavaScripts\modules\fight\monster\PigMonster.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { EMonsterBehaviorState, EMonserState } from "../../../ts3/monster/MonsterDefine";
import { CharMonsterBase } from "../../../ts3/monster/behavior/MonsterBase";
import { ERewardType } from "../../drop/DropItem";
import { DropModuleS } from "../../drop/DropModule";
import { GoPool, SoundManager } from "../../../ExtensionType";
import { GameConfig } from "../../../config/GameConfig";
import { GlobalData } from "../../../const/GlobalData";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
export default class OfficeBoy extends CharMonsterBase {

    walkSound: mw.Sound = null
    public async init(obj: mw.GameObject, cfg: number, monsterStateCb: Action1<EMonserState>): Promise<void> {
        await super.init(obj, cfg, monsterStateCb)
        this.battleEnterTex = [3001, 3002]
        if (SystemUtil.isClient()) {
            this.playWalkSound()
        }
    }

    public changeState(state: EMonsterBehaviorState, ...data: any): void {
        super.changeState(state, data)
    }
    public update(dt: number): void {
        super.update(dt)
        // console.log("小弟的状态", this.host?.name, this.getCurState(), this.host?.worldTransform.position)
    }

    protected onShow(...data: any): void {
        super.onShow(data)
    }


    async playWalkSound() {
        if (this.walkSound)
            return
        const sound = GameConfig.Music.getElement(102);
        this.walkSound = await GoPool.asyncSpawn(sound.MusicGUID) as mw.Sound
        if (sound.MusicRange) {
            this.walkSound.isSpatialization = true;
            this.walkSound.attenuationShapeExtents = new Vector(sound.MusicRange[0], sound.MusicRange[1], 0)// = sound.MusicRange[0];
            this.walkSound.falloffDistance = sound.MusicRange[1];
        }
        this.walkSound.isLoop = false
        this.walkSound.volume = sound.Volume
        this.walkSound.parent = this.host
        this.walkSound.localTransform.position = Vector.zero
        this.walkSound.play()
        if (sound.loopNum > 0)
            setTimeout(() => {
                this.walkSound.stop()
                this.walkSound.parent = null
                GoPool.despawn(this.walkSound)
            }, (this.walkSound.timeLength + 0.5) * 1000);
        else {
            setInterval(() => {
                this.walkSound.play()
            }, MathUtil.randomFloat(1, 2) * 1000)
        }
        GlobalData.curZombieMoveSoundCout += 1
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
    protected onHit(...data: any): void {
        super.onHit(data)
        // GameUtils.playSoundOrBgm(85, this.host)
    }

    protected onDead(...data: any): void {
        super.onDead(data)
    }
    protected onHpChange(hp: number, isForce: boolean): void {
        if (hp < this.curHp && SystemUtil.isServer()) {
            if (hp > 0) {
                Player.getAllPlayers().forEach(e => {
                    Event.dispatchToClient(e, "PlayBattleMusic", this.config.hitSound, this.host.gameObjectId)
                })
            }
            else {
                Player.getAllPlayers().forEach(e => {
                    Event.dispatchToClient(e, "PlayBattleMusic", this.config.deadSound, this.host.gameObjectId)
                })
            }
        }
        super.onHpChange(hp, isForce)
    }

}