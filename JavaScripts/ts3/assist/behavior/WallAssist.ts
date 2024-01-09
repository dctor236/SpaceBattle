/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-08-05 10:45:49
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-08-05 11:13:11
 * @FilePath: \mollywoodschool\JavaScripts\ts3\assist\behavior\WallAssist.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { GameConfig } from "../../../config/GameConfig";
import { GlobalData } from "../../../const/GlobalData";
import Tips from "../../../ui/commonUI/Tips";
import GameUtils from "../../../utils/GameUtils";
import { AssistCfg, EAssistBehaviorState, EAssistState } from "../AssistDefine";
import { AssistBase } from "./AssistBase";

export default class WallAssist extends AssistBase {
    public async init(obj: mw.GameObject, cfg: AssistCfg, monsterStateCb: Action1<EAssistState>): Promise<void> {
        await super.init(obj, cfg, monsterStateCb)
        // this.initTrigger()
        Player.onPlayerJoin.add((p) => {
            const player = p
            setTimeout(() => {
                const delta = (this.curHp / this.maxHp) * 100
                if (this.getCurState() == EAssistBehaviorState.Dead || this.getCurState() == EAssistBehaviorState.Sleep) {
                    Event.dispatchToClient(player, 'SetBuildingEff', 2, GameConfig.Assist.getAllElement().indexOf(this.config))
                } else if (delta <= 50) {
                    Event.dispatchToClient(player, 'SetBuildingEff', 1, GameConfig.Assist.getAllElement().indexOf(this.config))
                } else {
                    Event.dispatchToClient(player, 'SetBuildingEff', 3, GameConfig.Assist.getAllElement().indexOf(this.config))
                }
            }, 5000);
        })
        this.changeState(EAssistBehaviorState.Show)
    }
    protected onShow(...data: any) {
        super.onShow(data)
        this.isTrigger = false
        Event.dispatchToAllClient('SetBuildingEff', 3, GameConfig.Assist.getAllElement().indexOf(this.config))
        //封印状态
        this.host.setCollision(mw.CollisionStatus.On)
        this.host.setVisibility(mw.PropertyStatus.On)
        // this.monsterStateCb.call(EMonserState.Dead)
        GlobalData.LiveWall += 1
        Event.dispatchToAllClient('WallShow', GlobalData.LiveWall)
        Event.dispatchToLocal('WallShow', this.host.gameObjectId, true)
    }

    protected showUpdate(dt: number, eslapsed: number) {
        super.showUpdate(dt, eslapsed)
    }
    protected showExit() {
        super.showExit()
    }

    protected onIdle(...data: any): void {
        //亮血条状态
        super.onIdle(data)
        this.monsterStateCb.call(EAssistState.Visable)
    }

    protected idleUpdate(dt: number, eslapsed: number): void {
        super.idleUpdate(dt, eslapsed)
    }

    protected idleExit(): void {
        super.idleExit()
    }


    protected onDead(...data: any) {
        super.onDead(data)
        this.host.setCollision(mw.CollisionStatus.Off)
        this.host.setVisibility(mw.PropertyStatus.Off)
        GlobalData.LiveWall -= 1
        GameUtils.playSoundOrBgm(110, this.host)
        Player.getAllPlayers().forEach(p => {
            Tips.showToClient(p, this.config.assistName + '已被丧尸攻陷！收集维修材料，可以加速建筑复活！')
        })

        Event.dispatchToAllClient('WallShow', GlobalData.LiveWall)
        Event.dispatchToLocal('WallShow', this.host.gameObjectId, false)
        Event.dispatchToAllClient('SetBuildingEff', 2, GameConfig.Assist.getAllElement().indexOf(this.config))
    }
    protected deadUpdate(dt: number, eslapsed: number) {
        super.deadUpdate(dt, eslapsed)
        if (eslapsed > 1)
            this.changeState(EAssistBehaviorState.Sleep)
    }
    protected deadExit() {
        super.deadExit()
    }

    isTrigger: boolean = false
    protected onHpChange(hp: number, isForce: boolean): void {
        if (hp < this.curHp && SystemUtil.isServer()) {
            const delta = (this.curHp / this.maxHp) * 100
            if (hp > 0 && delta <= 50 && !this.isTrigger) {
                this.isTrigger = true
                Player.getAllPlayers().forEach(p => {
                    Tips.showToClient(p, this.config.assistName + '即将被攻破！快去赶走啃咬它的丧尸！')
                })
                Event.dispatchToAllClient('SetBuildingEff', 1, GameConfig.Assist.getAllElement().indexOf(this.config))
            }
            else {

            }
        }
        super.onHpChange(hp, isForce)
    }
    timer = null
    protected onSleep(...data: any): void {
        super.onSleep(data)
        if (!this.timer) {
            this.timer = setInterval(() => {
                const delta = this.config.AppearTime - this.lifeTime
                const min = Math.floor(delta / 60)
                const second = Math.floor(delta % 60)
                Event.dispatchToLocal('AssistSay', this.host.gameObjectId, StringUtil.format('复活{0}分{1}秒', min, second))
            }, 1000)
        }
    }

    protected sleepExit(): void {
        super.sleepExit()
        if (this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
    }

    public update(dt: number): void {
        super.update(dt)
        // console.log("boxx的状态", this.host?.name, this.getCurState())
    }
}