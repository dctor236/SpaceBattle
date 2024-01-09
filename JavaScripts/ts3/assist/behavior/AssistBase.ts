import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';



import { IAssistElement } from "../../../config/Assist";
import { GameConfig } from "../../../config/GameConfig";
import { IMonsterBehaviorElement } from "../../../config/MonsterBehavior";
import { IMonsterSkillElement } from "../../../config/MonsterSkill";
import { EffectManager, GoPool } from "../../../ExtensionType";
import ActionMS from "../../../modules/action/ActionMS";
import FightMgr from "../../../modules/fight/FightMgr";
import MonsterSkillMS from "../../../modules/fight/monsterSkill/MonsterSkillMS";
import { updater } from "../../../modules/fight/utils/Updater";
import GuideMS from "../../../modules/guide/GuideMS";
import { MGSMsgHome } from "../../../modules/mgsMsg/MgsmsgHome";
import GameUtils from "../../../utils/GameUtils";
import { StateMachine } from "../../../utils/StateMachine";
import { AssistCfg, EAssistBehaviorState, EAssistState } from "../AssistDefine";

//非人型怪物基础行为
export class AssistBase {
    protected host: mw.GameObject;
    protected info: AssistCfg = null
    public pos: mw.Vector;
    protected config: IAssistElement
    protected fsm: StateMachine<EAssistBehaviorState> = new StateMachine();
    /**存活时间 */
    protected lifeTime: number = 11
    /**当前的目标 */
    protected target: mw.GameObject = null
    protected targetPos: Vector = Vector.zero
    /**用到的计时器 */
    protected timerList = []
    public hpCallBack: Action2<number, boolean> = new Action2()
    protected curHp: number = 0
    protected maxHp: number = 0
    //所有技能id
    protected ownSkills: number[] = []
    /**是否是强制死亡 */
    isForce: boolean = false

    /**进入战斗触发器玩家 */
    protected enterPlayerID: number[] = [];
    protected enterTrigger: mw.Trigger
    /**当前目标玩家id */
    protected _curTagetPid: number = -1
    /**攻击所持续时间 */
    protected atkElaspe: number = 0
    /**当前使用的技能 */
    protected curSkillElem: IMonsterSkillElement = null
    protected curBehav: number = -1
    protected curBehavElem: IMonsterBehaviorElement = null
    protected monsterStateCb: Action1<EAssistState>

    public async init(obj: mw.GameObject, cfg: AssistCfg, monsterStateCb: Action1<EAssistState>) {
        await obj.asyncReady()
        // if (obj instanceof mw.Character) {
        //     await obj.appearanceReady()
        // }
        await TimeUtil.delaySecond(0.5)
        if (!obj)
            return
        this.host = obj;
        this.info = cfg;
        this.config = GameConfig.Assist.getElement(cfg.config)
        this.lifeTime = 0
        this.monsterStateCb = monsterStateCb
        this.initEvents()
        this.initState()
        this.hpCallBack.add(this.onHpChange.bind(this))
        await this.initAsset()
    }

    initEvents() {
        // Event.addLocalListener(EventsName.PlayerDead, (pid: number) => {
        //     this.deletePlayer(pid)
        // })

        Event.addClientListener('CutDownCd', (player: mw.Player, mid: string, num: number = 5) => {
            if (this.config.Guid == mid && this.getCurState() == EAssistBehaviorState.Sleep) {
                this.lifeTime = this.lifeTime + num >= this.config.AppearTime ? this.config.AppearTime : this.lifeTime + num
            }
        })


        // Event.addLocalListener('LastDamage', (mid: string, pid: number) => {
        //     if (this.host.guid != mid) return
        //     let p = Player.getPlayer(pid)
        //     if (p && p.character) {
        //         if (this.config.assistType == EAssistType.Boss) {
        //             MGSMsgHome.uploadMGS('ts_game_result', 'Boss死亡时', { record: 'Boss_die' }, p)
        //         } else if (this.config.assistType == EMonsterType.OfficeBoy) {
        //             MGSMsgHome.uploadMGS('ts_game_result', '玩家每次击杀小弟时', { record: 'kill_enemy_1' }, p)
        //         } else if (this.config.assistType == EMonsterType.Group) {
        //             MGSMsgHome.uploadMGS('ts_game_result', '玩家每次击杀组长时', { record: 'kill_enemy_2' }, p)
        //         }
        //         this.giverPos = p.character.worldTransform.position.clone()
        //         this.impulseVec = new Vector(this.host.worldTransform.position.x, this.host.worldTransform.position.y, this.host.worldTransform.position.z + 5000).subtract(p.character.worldTransform.position)
        //     }
        // })
    }

    initTrigger() {
        if (this.config.Trigger)
            GameObject.asyncFindGameObjectById(this.config.Trigger).then(o => {
                if (!o) return
                this.enterTrigger = o as mw.Trigger
                this.enterTrigger.enabled = (true)
                this.enterTrigger.onEnter.add(this.onBattleEnter)
                this.enterTrigger.onLeave.add(this.onBattleLeave)
            })
    }

    protected initState() {
        this.fsm.register(EAssistBehaviorState.Idle, { enter: this.onIdle.bind(this), update: this.idleUpdate.bind(this), exit: this.idleExit.bind(this) })
        this.fsm.register(EAssistBehaviorState.Partrol, { enter: this.onPartrol.bind(this), update: this.partrolUpdate.bind(this), exit: this.partrolExit.bind(this) })
        this.fsm.register(EAssistBehaviorState.AttackPrepare, { enter: this.onAtkPrepare.bind(this), update: this.atkPrepareUpdate.bind(this), exit: this.atkPrepareExit.bind(this) })
        this.fsm.register(EAssistBehaviorState.Attack, { enter: this.onAtk.bind(this), update: this.atkUpdate.bind(this), exit: this.atkExit.bind(this) })
        this.fsm.register(EAssistBehaviorState.TargetPrepare, { enter: this.onTargetPrepare.bind(this), update: this.targetPrepareUpdate.bind(this), exit: this.targetPrepareExit.bind(this) })
        this.fsm.register(EAssistBehaviorState.Target, { enter: this.onTarget.bind(this), update: this.targetUpdate.bind(this), exit: this.targetExit.bind(this) })
        this.fsm.register(EAssistBehaviorState.Dead, { enter: this.onDead.bind(this), update: this.deadUpdate.bind(this), exit: this.deadExit.bind(this) })
        this.fsm.register(EAssistBehaviorState.Show, { enter: this.onShow.bind(this), update: this.showUpdate.bind(this), exit: this.showExit.bind(this) })
        this.fsm.register(EAssistBehaviorState.Sleep, { enter: this.onSleep.bind(this), update: this.sleeptUpdate.bind(this), exit: this.sleepExit.bind(this) })
        this.fsm.register(EAssistBehaviorState.Hit, { enter: this.onHit.bind(this), update: this.hitUpdate.bind(this), exit: this.hitExit.bind(this) })
    }



    protected isBegin = true
    protected isPush = false
    /**正在刷新时间 */
    protected isRefresh = false
    protected lifeUpdate(dt: number) {
        if (!this.host || this.config.AppearTime <= 0) {
            return
        }
        this.lifeTime += dt
        if (this.host instanceof mw.Character &&
            this.getCurState() != EAssistBehaviorState.Sleep
            && this.getCurState() != EAssistBehaviorState.Attack
            && this.getCurState() != EAssistBehaviorState.Partrol) {
            if (Math.abs(this.traVec.x - this.host.worldTransform.position.x) <= 150 ||
                Math.abs(this.traVec.y - this.host.worldTransform.position.y) <= 150 ||
                Math.abs(this.traVec.z - this.host.worldTransform.position.z) <= 150) {
                this.trapTime += dt
            } else {
                this.traVec.set(this.host.worldTransform.position)
                this.trapTime = 0
            }

            if (this.trapTime >= 90 && (this.getCurState() == EAssistBehaviorState.Target ||
                this.getCurState() == EAssistBehaviorState.Escape
            )) {
                this.resetPos(this.config.Position[0])
                this.trapTime = 0
            }
        }


        if (!this.isRefresh) {
            if (!this.isBegin && this.lifeTime >= 0) {
                this.isBegin = true
                // if (this.config.assistType == EMonsterType.Boss)
                //     Event.dispatchToAllClient('SetCarGoldOutTri', true)
                this.changeState(EAssistBehaviorState.Show)
            } else if (!this.isPush && this.lifeTime >= this.config.PushNoticeTime) {
                this.isPush = true
            } else if (this.lifeTime >= 10 + this.config.ActiveTime) {
                this.isForce = true
                // this.changeState(EAssistBehaviorState.Dead)
            }
        } else {
            if (this.lifeTime >= this.config.AppearTime) {
                this.isRefresh = false
                this.lifeTime = 0
            }
        }
    }

    trapTime: number = 0
    traVec: Vector = Vector.zero

    resetPos(pos: Vector) {
        this.host.worldTransform.position = pos
    }

    /**一血 */
    protected isFirstBlood: boolean = false
    protected onHpChange(hp: number, isForce: boolean) {
        this.isForce = isForce
        if (hp < this.curHp) {
            if (hp > 0) {
                this.hitElasped = 0
                this.changeState(EAssistBehaviorState.Hit)
            }
            else
                this.changeState(EAssistBehaviorState.Dead)
        }
        this.curHp = hp;
        if (this.maxHp == 0) {
            this.maxHp = hp;
        }
    }

    protected onIdle(...data: any) {
    }
    protected idleUpdate(dt: number, eslapsed: number) {
        this.lifeUpdate(dt)
    }
    protected idleExit() {
        //10s延迟以防龙的位置歪了
        this.lifeTime = 10
    }

    protected onAtk(...data: any) {
    }

    @updater.updateByFrameInterval(20)
    protected atkUpdate(dt: number, eslapsed: number) {
    }
    protected atkExit() {
    }

    protected onAtkPrepare(...data: any) {
    }
    protected atkPrepareUpdate(dt: number, eslapsed: number) {
    }
    protected atkPrepareExit() {
    }

    protected onPartrol(...data: any) {
    }
    protected partrolUpdate(dt: number, eslapsed: number) {
        this.lifeUpdate(dt)
    }
    protected partrolExit() {
    }

    protected onTargetPrepare(...data: any) {
    }
    protected targetPrepareUpdate(dt: number, eslapsed: number) {
        this.lifeUpdate(dt)
    }
    protected targetPrepareExit() {
    }

    protected onTarget(...data: any) {

    }

    @updater.updateByFrameInterval(20)
    protected targetUpdate(dt: number, eslapsed: number) {
        this.lifeUpdate(dt)
    }
    protected targetExit() {
    }

    protected onDead(...data: any) {
        this.monsterStateCb.call(EAssistState.Dead)
        this.timerList.forEach(e => {
            clearInterval(e)
            clearTimeout(e)
            e = null
        })
        this.timerList.length = 0
        // this.clearAllSkills()
        this.ownSkills.length = 0
        // if (this.config.assistType == EMonsterType.Boss) {
        //     Event.dispatchToAllClient('SetCarGoldOutTri', false)
        // }
        if (this.host instanceof mw.Character) {
            this.host.ragdollEnabled = true
            this.playDeadEff(true)

        }
        this.enterPlayerID.forEach(playerId => {
        })
    }
    protected deadUpdate(dt: number, eslapsed: number) {
    }
    protected deadExit() {
        // this.host.setVisibility(mw.PropertyStatus.Off, true)
        if (this.host instanceof mw.Character) {
            this.host.movementEnabled = this.host.jumpEnabled = false
        } else {
            // this.host.setCollision(mw.CollisionStatus.Off)
            // this.host.setVisibility(mw.PropertyStatus.Off)
        }
        this.isFirstBlood = false
        this.isBegin = false
        this.isPush = false
        this.isRefresh = true
        this.lifeTime = 0
        this.isForce = false
    }
    _deadEff: number
    playDeadEff(state: boolean) {
        if (state) {
            let effid = this.host.worldTransform.scale == Vector.one ? 201 : 311
            const effElem = GameConfig.Effect.getElement(effid)
            this._deadEff = GeneralManager.rpcPlayEffectOnPlayer(effElem.EffectID, (this.host as unknown as mw.Character), effElem.EffectPoint,
                0, effElem.EffectLocation, new Rotation(effElem.EffectRotate), effElem.EffectLarge)
        } else {
            if (this._deadEff > 0) {
                EffectService.stop(this._deadEff)
                this._deadEff = -1
            }
        }
    }

    protected onShow(...data: any) {
        this.monsterStateCb.call(EAssistState.Visable)
        this.impulseVec = this.host.worldTransform.getForwardVector().multiply(-1).clone()
        this.giverPos = this.host.worldTransform.position.clone()
        if (this.enterTrigger)
            this.enterTrigger.enabled = (true)
        // this.host.setCollision(mw.CollisionStatus.On)
        // this.host.setVisibility(mw.PropertyStatus.On)
        if (this.host instanceof mw.Character) {
            this.host.ragdollEnabled = false
            this.host.movementEnabled = this.host.jumpEnabled = true
            this.playDeadEff(false)
        }
        if (this.enterTrigger) {
            // this.enterPlayerID.forEach(e => {
            //     const p = Player.getPlayer(e)
            //     if (p && p.character && this.enterTrigger.checkInArea(p.character)) {
            //         Event.dispatchToLocal(EventsName.PlayerBattle, e, true, this.config.Trigger, false)
            //         this.enterTrigger.onEnter.broadcast(p.character)
            //     } else {
            //         this.deletePlayer(e)
            //     }
            // })
        }
    }
    protected showUpdate(dt: number, eslapsed: number) {
        this.lifeUpdate(dt)
    }
    protected showExit() {
    }

    protected onSleep(...data: any) {
    }

    protected sleeptUpdate(dt: number, eslapsed: number) {
        this.lifeUpdate(dt)
    }
    protected sleepExit() {
    }
    protected hitElasped: number = 0
    protected onHit(...data: any) {
    }
    protected hitUpdate(dt: number, eslapsed: number) {
        this.hitElasped += dt
        this.lifeUpdate(dt)
    }
    protected hitExit() {
    }

    protected lastState: EAssistBehaviorState = EAssistBehaviorState.None
    public changeState(state: EAssistBehaviorState, ...data: any) {
        if (this.getCurState() && this.getCurState() != EAssistBehaviorState.Hit) {
            this.lastState = this.getCurState()
        }
        this.fsm.switch(state, ...data)
    }

    // @updater.updateByFrameInterval(20)
    public update(dt: number) {
        if (this.host)
            this.fsm.update(dt)
    }

    public getCurState() {
        return this.fsm.getStateInfo().state
    }

    public clearAllSkills() {
        if (this.ownSkills && this.ownSkills.length > 0) {
            ModuleService.getModule(MonsterSkillMS).InvokeSkill(this.host.gameObjectId, this.ownSkills)
        }
    }
    battleEnterTex: number[] = []

    protected onBattleEnter = (go: mw.GameObject) => {
        if (PlayerManagerExtesion.isCharacter(go) && go.player) {
            let playerId = go.player.playerId;
            this.addPlayer(playerId)
            // if (this.battleEnterTex && this.battleEnterTex.length > 0 && (this.getCurState() != EAssistBehaviorState.Dead
            //     || this.getCurState() != EAssistBehaviorState.Sleep)) {
            //     const ran = MathUtil.randomInt(0, this.battleEnterTex.length)
            //     Event.dispatchToLocal('MonsterSay', this.host.guid, this.battleEnterTex[ran])
            // }
            // if (this.host instanceof mw.Character) {
            // if (this.config.assistType == EMonsterType.Boss) {
            //     ModuleService.getModule(GuideMS).startGuide(50, go.player)
            //     Event.dispatchToClient(go.player, 'BossHpShow', true)
            // } else {
            //     if (this.config.atkStance) {
            //         ModuleService.getModule(ActionMS).playAction(this.config.atkStance, this.host)
            //     }
            // }
            // }
        }
    };
    protected onBattleLeave = (go: mw.GameObject) => {
        if (PlayerManagerExtesion.isCharacter(go) && go.player) {
            let playerId = go.player.playerId;
            this.deletePlayer(playerId);
            // if (this.config.assistType == EMonsterType.Boss) {
            //     Event.dispatchToClient(go.player, 'BossHpShow', false)
            // }
        }
    };

    protected deletePlayer(playerId: number) {
        let index = this.enterPlayerID.indexOf(playerId);
        if (index >= 0) {
            const char = Player.getPlayer(playerId)?.character
            if (playerId == this._curTagetPid || char && this.target && this.target.gameObjectId == char.gameObjectId) {
                this.resetAtkState()
                if (this.curHp > 0 && this.getCurState() != EAssistBehaviorState.Dead
                    && this.getCurState() != EAssistBehaviorState.Sleep)
                    this.changeState(EAssistBehaviorState.Target)
            }
            this.enterPlayerID.splice(index, 1);
        }
    }

    protected addPlayer(playerId: number) {
        let index = this.enterPlayerID.indexOf(playerId);
        if (index < 0) {
            this.enterPlayerID.push(playerId);
            const p = Player.getPlayer(playerId)
        }
    }

    /**重置怪物战斗状态 */
    protected resetAtkState() {
        this._curTagetPid = 0
        this.target = null
        this.targetPos = Vector.zero
        this.atkElaspe = 0
        this.curSkillElem = null
    }

    //默认冲量
    protected _impulse: number = 50//6000瞬时
    protected impulseVec: Vector = Vector.zero
    protected giverPos: Vector = Vector.zero
    public addImpulse(elsape: number) {
        if (SystemUtil.isClient()) return
        if (this.host instanceof mw.Character) {
            if (this.host.isJumping) return
            let dir = this.impulseVec.clone()
            // let vec = Quaternion.rotateX(Quaternion.fromRotation(delta.toRotation()), this._config.displacement[1]).toRotation()
            //bullet_RotateVector(delta, mw.Vector.right, this._config.displacement[1])
            // //击飞
            //击退
            dir.set(dir.x * this._impulse, dir.y * this._impulse, Vector.up.z * this._impulse * 50)
            this.host.addImpulse(dir, true)
        }
    }

    protected async initAsset() {
        if (this.config.Appearance && this.config.Appearance.length > 0) {

            for (const e of this.config.Appearance) {
                const elem = GameConfig.Model.getElement(e)
                if (elem) {
                    const o = await GoPool.asyncSpawn(elem.ModelGuid)
                    await o.asyncReady()
                    if (!o) return
                    if (this.host instanceof mw.Character) {
                        o.setCollision(mw.CollisionStatus.Off)
                        this.host.attachToSlot(o, elem.ModelPoint)
                        o.localTransform.position = new Vector(elem.ModelLocation)
                        o.localTransform.rotation = new Rotation(elem.ModelRotate)
                        o.localTransform.scale = new Vector(elem.ModelLarge)
                    }

                }
            }
        }

    }
}

//人型
export class CharAssistBase extends AssistBase {
    declare host: mw.Character
    protected behavior: IMonsterBehaviorElement[]
    protected isDamage: boolean = false

    public async init(obj: mw.GameObject, cfg: AssistCfg, monsterStateCb: Action1<EAssistState>): Promise<void> {
        await super.init(obj, cfg, monsterStateCb)
        // this.initTrigger()
        this.host = obj as mw.Character
        this.behavior = []
        if (this.config.Behavior && this.config.Behavior.length > 0) {
            this.config.Behavior.forEach(e => {
                const elem = GameConfig.MonsterBehavior.getElement(e)
                this.behavior.push(elem)
                if (Number(elem.skill))
                    this.ownSkills.push(elem.skill)
            })
        }

        // this.host.worldTransform.position = this.config.Position[0]
        // console.log("thfasfas", this.host.worldTransform.position)
        this.host.maxWalkSpeed = 500
        this.host.maxAcceleration = 1024
        this.changeState(EAssistBehaviorState.Show)
    }

    initEvents(): void {
        super.initEvents()
        Event.addLocalListener("OnReplyPoint", (mid: string, res: Vector) => {
            if (this.host.gameObjectId == mid) {
                this.tmpTargetPos = res
            }
        })
    }



    public update(dt: number): void {
        super.update(dt)
    }


    protected baseUpdate(dt: number, eslapsed: number) {
        this.lifeUpdate(dt)
        if (this.enterPlayerID.length > 0) {
            if (this.getCurState() == EAssistBehaviorState.Partrol) {
                this.changeState(EAssistBehaviorState.Target)
            }
        } else if (this.enterPlayerID.length <= 0) {
            if (this.getCurState() != EAssistBehaviorState.Partrol)
                this.changeState(EAssistBehaviorState.Partrol)
        }
        if (!this.targetPos || !this.target || this.curBehav == -1
            || !this.curSkillElem) {
            if (this.curHp > 0)
                this.changeState(EAssistBehaviorState.Partrol)
            else
                this.changeState(EAssistBehaviorState.Sleep)
        }

    }



    protected findTarget() {
        for (const p of Player.getAllPlayers()) {
            if (p && p.character && this.enterTrigger.checkInArea(p.character)) {
                this.addPlayer(p.playerId)
            } else {
                this.deletePlayer(p.playerId)
            }
        }

        if (this.enterPlayerID.length == 0) {
            this.resetAtkState()
            this.changeState(EAssistBehaviorState.Partrol)
            return
        }
        let ranVec = this.enterPlayerID.filter(e => {
            const tmpP = Player.getPlayer(e)
            const char = tmpP?.character
            if (tmpP && char) {
                return true
            } else {
                return false
            }
        })
        let tmpP = null
        //筛选玩家
        const ranPlayer = ranVec[MathUtil.randomInt(0, ranVec.length)]
        tmpP = Player.getPlayer(ranPlayer)
        if (!tmpP) {
            this.changeState(EAssistBehaviorState.Partrol)
            return
        } else {
            this._curTagetPid = ranPlayer
        }
        this.target = tmpP.character
        this.targetPos = tmpP.character.worldTransform.position
    }

    protected resetAtkState(): void {
        super.resetAtkState()
        if (this.curBehavElem) {
            ModuleService.getModule(ActionMS).stopAction(this.host.gameObjectId)
            this.curBehavElem = null
        }
        this.isDamage = false
        this.curBehav = -1
        this.pathIndex = -1
    }

    protected onShow(...data: any) {
        super.onShow(data)
        if (this.config.Position && this.config.Position.length > 0)
            this.host.worldTransform.position = this.config.Position[0]
        setTimeout(() => {
            this.host.collisionWithOtherCharacterEnabled = true
            this.host.switchToWalking()
            if (this.host)
                this.changeState(EAssistBehaviorState.Partrol)
        }, 2000);
    }

    protected showUpdate(dt: number, eslapsed: number) {
        super.showUpdate(dt, eslapsed)
    }

    protected showExit() {
        super.showExit()
    }


    protected onIdle(...data: any): void {
        super.onIdle(data)
    }

    protected idleUpdate(dt: number, eslapsed: number): void {
        // this.baseUpdate(dt, eslapsed)
        super.idleUpdate(dt, eslapsed)
    }

    protected idleExit(): void {
        super.idleExit()
    }

    protected pathIndex = -1
    protected moveFlag = true;
    protected moveTimer = null

    protected onPartrol(...data: any) {
        super.onPartrol(data)
        this.resetAtkState()
        if (this.config.Behavior.length > 0) {
            this.curBehav = 0
            this.curBehavElem = this.behavior[this.curBehav]
        }
        setTimeout(() => {
            this.moveTo()
        }, 5000);
    }
    moveTo() {
        if (!this.config.Position) return
        if (this.moveTimer || this.getCurState() != EAssistBehaviorState.Partrol) return
        if (this.moveFlag) {
            if (this.pathIndex < this.config.Position.length - 1 && this.config.Position.length - 1 >= 0) {
                this.pathIndex += 1
            } else if (this.config.Position.length - 2 >= 0) {
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
        Navigation.stopNavigateTo(this.host)
        this.host.lookAt(this.config.Position[this.pathIndex])
        Navigation.navigateTo(this.host, this.config.Position[this.pathIndex], this.config.PathRadius, () => {
            this.moveTimer = setTimeout(() => {
                this.moveTimer = null
                this.moveTo()
            }, 5000);
        }, () => {
            this.host.worldTransform.position = this.config.Position[this.pathIndex]
            this.moveTimer = setTimeout(() => {
                this.moveTimer = null
                this.moveTo()
            }, 5000);
        })
    }

    protected partrolUpdate(dt: number, eslapsed: number) {
        // this.baseUpdate(dt, eslapsed)
        super.partrolUpdate(dt, eslapsed)
    }
    protected partrolExit() {
        super.partrolExit()
        if (this.moveTimer) {
            clearTimeout(this.moveTimer)
            this.moveTimer = null
        }
        Navigation.stopNavigateTo(this.host)
    }

    protected targetIntaval = null
    protected tmpTargetPos: Vector = Vector.zero
    protected targetTimer = null
    targetFindCount: number = 0

    protected onTarget(...data: any) {
        super.onTarget(data)
        //移动到攻击范围进行切攻击姿态攻击
        if (!this.target) {
            this.findTarget()
        }
        if (this.curBehav != -1)
            this.curSkillElem = GameConfig.MonsterSkill.getElement(this.curBehavElem.skill)
        this.targetIntaval = setInterval(() => {
            this.findPathToTargett()
        }, MathUtil.randomFloat(1, 5) * 1000)
    }

    protected targetUpdate(dt: number, eslapsed: number) {
        // this.baseUpdate(dt, eslapsed)
        if (!this.target) return
        super.targetUpdate(dt, eslapsed)
        this.host.lookAt(this.target.worldTransform.position)
        if (Vector.squaredDistance(this.host.worldTransform.position, this.target.worldTransform.position) <= 250 * 250) {
            this.changeState(EAssistBehaviorState.Attack)
        }
    }

    protected targetExit() {
        super.targetExit()
        this.clearTargetIntaval()
        this.targetFindCount = 0
        this.tmpTargetPos = Vector.zero
        this.host.collisionWithOtherCharacterEnabled = true
        if (this.targetTimer) {
            clearTimeout(this.targetTimer)
            this.targetTimer = null
        }
    }


    helghtDelt = 500
    tmpVec: Vector = Vector.zero
    findPathToTargett() {
        if (!this.target) {
            this.findTarget()
        }
        if (this.target instanceof mw.Character && Math.abs(this.target.worldTransform.position.z - this.host.worldTransform.position.z) >= this.helghtDelt) {
            this.target = null
            return
        }
        if (mw.Vector.squaredDistance(this.host.worldTransform.position, this.target.worldTransform.position) >= 100 * 100) {
            ModuleService.getModule(ActionMS).playAction(124, this.host)
            this.tmpVec = GameUtils.randomCirclePos(this.tmpVec.set(this.target.worldTransform.position.x, this.target.worldTransform.position.y, this.target.worldTransform.position.z),
                100, true)
            Navigation.navigateTo(this.host, this.tmpVec, this.config.PathRadius, () => {
            })
        } else {
            if (this.tmpTargetPos.x == 0 && this.tmpTargetPos.y == 0 && this.tmpTargetPos.z == 0) {
                if (this.targetTimer)
                    return
                this.targetTimer = setTimeout(() => {
                    Event.dispatchToLocal('GiveAActionPoint', this.host.gameObjectId, this.target.worldTransform.position, this.host.getBoundingBoxExtent().x)
                    this.targetTimer = null
                }, MathUtil.randomFloat(0.1, 2.5) * 1000);
                return
            }
            this.host.collisionWithOtherCharacterEnabled = false
            this.targetFindCount += 1
            if (this.targetFindCount >= 5) {
                if (this.target instanceof mw.Character && Math.abs(this.target.worldTransform.position.z - this.host.worldTransform.position.z) >= this.helghtDelt) {
                    this.target = null
                    return
                } else {
                    this.host.worldTransform.position = this.tmpTargetPos//this.config.Position[0]
                    this.changeState(EAssistBehaviorState.Attack)
                }
                if (this.targetTimer) {
                    clearTimeout(this.targetTimer)
                    this.targetTimer = null
                }
                this.tmpTargetPos = Vector.zero
                this.targetFindCount = 0
            } else {
                if (this.config.atkStance)
                    ModuleService.getModule(ActionMS).stopAction(this.host.gameObjectId)
                Navigation.navigateTo(this.host, this.tmpTargetPos, 60, () => {
                    this.changeState(EAssistBehaviorState.Attack)
                }, () => {
                    //失败
                    if (this.targetTimer) {
                        clearTimeout(this.targetTimer)
                        this.targetTimer = null
                    }
                    this.tmpTargetPos = Vector.zero
                    if (this.target instanceof mw.Character && Math.abs(this.target.worldTransform.position.z - this.host.worldTransform.position.z) >= this.helghtDelt) {
                        this.target = null
                        return
                    } else {
                        this.host.worldTransform.position = this.tmpTargetPos//this.config.Position[0]
                        this.changeState(EAssistBehaviorState.Attack)
                    }
                })
            }
        }

    }

    clearTargetIntaval() {
        if (this.targetIntaval) {
            clearInterval(this.targetIntaval)
            this.targetIntaval = null
        }
    }

    protected onAtk(...data: any): void {
        super.onAtk(data)
        if (this.config.atkStance)
            ModuleService.getModule(ActionMS).playAction(this.config.atkStance, this.host)
    }

    protected atkUpdate(dt: number, eslapsed: number): void {
        // this.baseUpdate(dt, eslapsed)
        if (!this.curSkillElem || this.curBehav < 0 || this.curBehav >= this.behavior.length)
            return
        if (Vector.squaredDistance(this.host.worldTransform.position, this.target.worldTransform.position) >= 250 * 250) {
            this.changeState(EAssistBehaviorState.Target)
            return
        }
        super.atkUpdate(dt, eslapsed)
        this.atkElaspe += dt
        if (this.curSkillElem && this.atkElaspe < this.curSkillElem.preTime) return
        if (!this.isDamage) {
            this.isDamage = true
            this.useSkill()
        }
        if (this.atkElaspe >= this.curSkillElem.duration) {
            this.atkElaspe = 0
            if (this.curBehav < this.behavior.length - 1) {
                this.curBehav += 1
            } else {
                this.curBehav = 0
            }
            this.isDamage = false
            // this.resetAtkState()
            // console.log("重置战斗状态")
        }
    }
    protected atkExit(): void {
        super.atkExit()
        this.resetAtkState()
    }

    useSkill() {
        if (this.enterPlayerID.length <= 0 || !this.target) return
        if (this.curBehav < 0 || this.curBehav >= this.behavior.length) return
        const b = this.behavior[this.curBehav]
        if (b) {
            if (b.skill) {
                this.host.lookAt(this.target.worldTransform.position)
                let dir = this.host.worldTransform.getForwardVector().normalized
                let relsePos: Vector
                relsePos = this.host.worldTransform.position
                ModuleService.getModule(MonsterSkillMS).useSkill(b.skill, this.host.gameObjectId, dir, relsePos, this.enterPlayerID)
            }
            if (b.action) {
                ModuleService.getModule(ActionMS).playAction(b.action, this.host)
            }
            // console.log("小弟释放技能1", this.curBehav)
        }

    }

    protected onHit(...data: any): void {
        super.onHit(data)
        // ModuleService.getModule(ActionMS).playAction(304, this.host.guid)
    }

    protected onHpChange(hp: number, isForce: boolean): void {
        if (hp < this.curHp) {
            if (hp > 0) {
                ModuleService.getModule(ActionMS).playAction(304, this.host)
            }
            else {

            }
        }
        super.onHpChange(hp, isForce)
    }

    protected hitUpdate(dt: number, eslapsed: number): void {
        super.hitUpdate(dt, eslapsed)
        if (this.hitElasped >= 1.5) {
            if (this.curHp <= 0) {
                this.changeState(EAssistBehaviorState.Dead)
            } else
                this.changeState(this.lastState)
        }
    }

    protected hitExit(): void {
        super.hitExit()
    }

    protected onDead(...data: any) {
        super.onDead(data)
        // this.enterPlayerID.forEach(e => {
        //     const p = Player.getPlayer(e)
        //     if (p && p.character) {
        //         this.enterTrigger.onLeave.broadcast(p.character)
        //         this.deletePlayer(e);
        //     }
        // })
        // this.enterTrigger.enabled = (false)
        // this.host.setCollision(mw.CollisionStatus.Off)
        //布娃娃状态不能加冲量

    }
    protected deadUpdate(dt: number, eslapsed: number) {
        super.deadUpdate(dt, eslapsed)
        // if (eslapsed >= 0 && eslapsed <= 0.5) {
        //     this.addImpulse(eslapsed)
        // } else if (eslapsed > 0.5) {
        // }
        if (eslapsed > 5) {
            this.changeState(EAssistBehaviorState.Sleep)
        }
    }

    protected deadExit() {
        this.host.switchToWalking()
        super.deadExit()
        FightMgr.instance.clearMonsterDamageInfo(this.config.Guid)
    }

}