
import { EffectManager } from "../../../ExtensionType";
import { MonsterCfg, EMonsterBehaviorState, EMonserState } from "../../../ts3/monster/MonsterDefine";
import { MonsterBase } from "../../../ts3/monster/behavior/MonsterBase";
import { ERewardType } from "../../drop/DropItem";
import { DropModuleS } from "../../drop/DropModule";
import ActionMS from "../../action/ActionMS";
import { GameConfig } from "../../../config/GameConfig";
import { GlobalData } from "../../../const/GlobalData";
import Tips from "../../../ui/commonUI/Tips";
import GuideMS from "../../guide/GuideMS";
import GameUtils from "../../../utils/GameUtils";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
export default class OfficeBoss extends MonsterBase {
    declare host: mw.Character
    officeDesk: mw.GameObject = null
    // private _deskInterObj: mw.Interactor;
    protected isInit: boolean = false
    public async init(obj: mw.GameObject, cfg: number, monsterStateCb: Action1<EMonserState>): Promise<void> {
        await super.init(obj, cfg, monsterStateCb)
        this.initTrigger()
        this.hpCallBack.add(this.onHpChange.bind(this))
        this.host = obj as mw.Character
        this.fsm.register(EMonsterBehaviorState.Escape, { enter: this.onEscape.bind(this), update: this.escapeUpdate.bind(this), exit: this.escapeExit.bind(this) })
        this.host.collisionWithOtherCharacterEnabled = true
        this.host.maxWalkSpeed *= 3
        this.battleEnterTex = [3005, 3006]
        this.isInit = true
        setTimeout(() => {
            this.changeState(EMonsterBehaviorState.Show)
        }, 5000);
    }

    async initAsset() {
        super.initAsset()
        // this.officeDesk = GameObject.findGameObjectById('30CABDCA')
        // this.officeDesk.setCollision(mw.CollisionStatus.On)
        // this._deskInterObj = this.officeDesk.getChildByName('交互物') as mw.Interactor
        // this._deskInterObj.parent = this.officeDesk
        // if (!AssetUtil.assetLoaded('29717')) {
        //     await AssetUtil.asyncDownloadAsset('29717');
        // }
        // setTimeout(() => {

        // }, 1500);
    }


    public update(dt: number): void {
        super.update(dt)
        // console.log("boss的状态", this.host.worldTransform.position)
    }

    protected onShow(...data: any) {
        super.onShow(data)
        if (this.config.Position && this.config.Position.length > 0)
            this.host.worldTransform.position = this.config.Position[0]
        this.host.switchToWalking();
        if (this.isInit) {
            this.changeState(EMonsterBehaviorState.Idle)
        }
        //复活宝库
        Event.dispatchToLocal('ReliveBox')
        this.host.movementEnabled = this.host.jumpEnabled = true
        this.extincts = { behaviorIndex: 1, initCount: 4, count: 0 }
    }

    protected showUpdate(dt: number, eslapsed: number) {
        super.showUpdate(dt, eslapsed)
    }

    protected showExit() {
        super.showExit()
    }
    protected onIdle(...data: any): void {
        super.onIdle(data)
        ModuleService.getModule(ActionMS).playAction(326, this.host)
        // if (this._deskInterObj && this.officeDesk) {
        //     let res = this._deskInterObj.enter(this.host, mw.HumanoidSlotType.Buttocks)
        //     if (res) {
        //         ModuleService.getModule(ActionMS).playAction(7, this.host.guid)
        //         this.host.movementEnabled = this.host.jumpEnabled = false
        //     }
        // }
    }

    protected idleUpdate(dt: number, eslapsed: number): void {
        super.idleUpdate(dt, eslapsed)
    }

    protected idleExit(): void {
        super.idleExit()
        ModuleService.getModule(ActionMS).stopAction(this.host.gameObjectId)
        // let res = this._deskInterObj.leave(this.officeDesk.worldTransform.position.add(new Vector(0, 0, 300)));
        // if (res) {
        //     this.host.parent = null
        //     ModuleService.getModule(ActionMS).stopAction([7], this.host.guid)
        //     this.host.switchToWalking();
        //     this.host.movementEnabled = this.host.jumpEnabled = true
        // }
    }

    protected onPartrol(...data: any) {
        super.onPartrol(data)
        //回到座位
        this.changeState(EMonsterBehaviorState.Idle)
    }

    protected partrolUpdate(dt: number, eslapsed: number) {
        super.partrolUpdate(dt, eslapsed)
    }
    protected partrolExit() {
        Navigation.stopNavigateTo(this.host)
    }

    protected onEscape(...data: any) {
        this.moveTo()
    }
    protected escapeUpdate(dt: number, eslapsed: number) {
        this.lifeUpdate(dt)
        this.hitElasped += dt
        if (this.hitElasped >= 20) {
            this.changeState(EMonsterBehaviorState.Partrol)
        }
    }
    protected escapeExit() {
        if (this.moveTimer) {
            clearTimeout(this.moveTimer)
            this.moveTimer = null
        }
        Navigation.stopNavigateTo(this.host)
        this.hitElasped = 0
    }

    protected onHit(...data: any): void {
        super.onHit(data)
        // GameUtils.playSoundOrBgm(89, this.host)
        // ModuleService.getModule(ActionMS).playAction(310, this.host.guid)
    }

    protected hitUpdate(dt: number, eslapsed: number): void {
        super.hitUpdate(dt, eslapsed)
        if (this.hitElasped > 1.5) {
            this.changeState(EMonsterBehaviorState.Escape)
        }
    }

    protected hitExit(): void {
        super.hitExit()
    }

    protected onDead(...data: any): void {
        super.onDead(data)
        MGSMsgHome.uploadMGS('ts_game_result', 'Boss掉落' + (this.extincts.count + 1) + '次金币时', { record: 'Boss_fourth_gold' }, Player.getAllPlayers()[0])
        ModuleService.getModule(ActionMS).playAction(304, this.host)
        Event.dispatchToLocal('MonsterSay', this.host.gameObjectId, 3010)
        Player.getAllPlayers().forEach(p => {
            const elem = GameConfig.SquareLanguage.getElement(3010)
            if (elem) {
                Tips.showToClient(p, elem.Value)
            }
        })

        ModuleService.getModule(DropModuleS).creatDropAll(this.host.worldTransform.position.clone(), this.config.DeathGold[0], 25, 5)
        ModuleService.getModule(ActionMS).playAction(309, this.host)
        ModuleService.getModule(GuideMS).startGuide(60)

        // this.enterPlayerID.forEach(e => {
        //     const p = Player.getPlayer(e)
        //     if (p && p.character) {
        //         this.enterTrigger.onLeave.broadcast(p.character)
        //         this.deletePlayer(e);
        //     }
        // })
        // this.enterTrigger.enabled = (false)
    }

    protected deadUpdate(dt: number, eslapsed: number): void {
        super.deadUpdate(dt, eslapsed)
        if (eslapsed > 5) {
            this.changeState(EMonsterBehaviorState.Sleep)
        }
    }
    protected deadExit(): void {
        super.deadExit()
        Event.dispatchToLocal('UnlockBox')
    }

    protected pathIndex = -1
    protected moveFlag = true;
    protected moveTimer = null

    /**是否被中断寻路 */
    isInDestiny: boolean = true

    moveTo() {
        if (!this.config.Position || this.config.Position.length < 2)
            if (this.moveTimer || this.getCurState() != EMonsterBehaviorState.Escape) return
        if (this.isInDestiny) {
            if (this.moveFlag) {
                if (this.pathIndex < this.config.Position.length - 1) {
                    this.pathIndex += 1
                } else {
                    this.moveFlag = false
                    this.pathIndex = this.config.Position.length - 2
                }
            } else {
                if (this.pathIndex >= 1) {
                    this.pathIndex -= 1
                } else {
                    this.moveFlag = true
                    this.pathIndex = 1
                }
            }
        }
        this.isInDestiny = false
        Navigation.stopNavigateTo(this.host)
        if (this.config.Position && this.config.Position.length > 0)
            this.host.lookAt(this.config.Position[this.pathIndex])
        ModuleService.getModule(ActionMS).playAction(323, this.host)
        GameUtils.playSoundOrBgm(96, this.host)
        Navigation.navigateTo(this.host, this.config.Position[this.pathIndex], this.config.PathRadius, () => {
            this.isInDestiny = true
            this.moveTimer = setTimeout(() => {
                this.moveTimer = null
                this.moveTo()
            }, 1200);
            ModuleService.getModule(ActionMS).stopAction(this.host.gameObjectId)
        }, () => {
            ModuleService.getModule(ActionMS).stopAction(this.host.gameObjectId)
            this.host.worldTransform.position = this.config.Position[this.pathIndex]
            this.isInDestiny = true
            this.moveTimer = setTimeout(() => {
                this.moveTimer = null
                this.moveTo()
            }, 1200);
        })
    }
    protected extincts: { behaviorIndex: number, initCount: number, count: number } = { behaviorIndex: 1, initCount: 4, count: 0 }
    protected onHpChange(hp: number, isForce: boolean): void {
        if (hp < this.curHp) {
            if (hp > 0) {
                if (!this.isForce && !this.isFirstBlood) {
                    this.isFirstBlood = true
                    ModuleService.getModule(ActionMS).playAction(324, this.host)
                    GameUtils.playSoundOrBgm(89, this.host)
                    MGSMsgHome.uploadMGS('ts_game_result', 'Boss第一次受到伤害时', { record: 'Boss_firstblood' }, Player.getAllPlayers()[0])
                } else {
                    let specialAction: boolean = false
                    const delta = (this.curHp / this.maxHp) * 100
                    if (delta == 0) {
                    } else {
                        const ranges: number[] = [20, 40, 60, 80]
                        for (let j = ranges.length - 1; j >= 0; j--) {
                            const tmpVal = ranges[j]
                            if (j > ranges.length - 1 - this.extincts.count) continue
                            if (delta > tmpVal - 20 && delta <= tmpVal) {
                                specialAction = true
                                break
                            }
                        }
                    }
                    if (!specialAction) {
                        ModuleService.getModule(ActionMS).playAction(310, this.host)
                        GameUtils.playSoundOrBgm(86, this.host)
                    } else {
                        const mgs = ['Boss_first_gold', 'Boss_second_gold', 'Boss_third_gold']
                        //撒金币
                        let vec = [3007, 3008, 3009]
                        const ran = MathUtil.randomInt(0, vec.length)
                        Player.getAllPlayers().forEach(p => {
                            const elem = GameConfig.SquareLanguage.getElement(vec[ran])
                            if (elem) {
                                Tips.showToClient(p, elem.Value)
                            }
                        })
                        Event.dispatchToLocal('MonsterSay', this.host.gameObjectId, vec[ran])
                        MGSMsgHome.uploadMGS('ts_game_result', 'Boss掉落' + (this.extincts.count + 1) + '次金币时', { record: mgs[this.extincts.count] }, Player.getAllPlayers()[0])
                        ModuleService.getModule(ActionMS).playAction(324, this.host)
                        GameUtils.playSoundOrBgm(89, this.host)
                        ModuleService.getModule(DropModuleS).creatDropAll(this.host.worldTransform.position.clone(), this.config.DeathGold[0], 25, 5)
                        this.extincts.count = this.extincts.count + 1
                    }
                }
            }
            else {
                GameUtils.playSoundOrBgm(90, this.host)
            }
        }
        super.onHpChange(hp, isForce)


    }

}