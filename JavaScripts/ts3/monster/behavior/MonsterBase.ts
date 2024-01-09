import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-08-03 20:36:50
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-08-17 21:07:50
 * @FilePath: \mollywoodschool\JavaScripts\ts3\monster\behavior\MonsterBase.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { GameConfig } from "../../../config/GameConfig";
import { IMonsterElement } from "../../../config/Monster";
import { IMonsterBehaviorElement } from "../../../config/MonsterBehavior";
import { IMonsterSkillElement } from "../../../config/MonsterSkill";
import { EventsName } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { EffectManager, GoPool } from "../../../ExtensionType";
import ActionMS from "../../../modules/action/ActionMS";
import { ERewardType } from "../../../modules/drop/DropItem";
import { DropModuleS } from "../../../modules/drop/DropModule";
import { Attribute } from "../../../modules/fight/attibute/Attribute";
import { EMonsterType } from "../../../modules/fight/FightDefine";
import FightMgr from "../../../modules/fight/FightMgr";
import MonsterSkillMS from "../../../modules/fight/monsterSkill/MonsterSkillMS";
import { updater } from "../../../modules/fight/utils/Updater";
import GuideMS from "../../../modules/guide/GuideMS";
import { MGSMsgHome } from "../../../modules/mgsMsg/MgsmsgHome";
import GameUtils from "../../../utils/GameUtils";
import { StateMachine } from "../../../utils/StateMachine";
import { AssistMgr } from "../../assist/AssistMgr";
import { PlayerMgr } from "../../player/PlayerMgr";
import { MonsterCfg, EMonsterBehaviorState, EMonserState } from "../MonsterDefine";

//非人型怪物基础行为
export class MonsterBase {
    protected host: mw.GameObject;

    /**出生位置 */
    protected bornPos: Vector = Vector.zero
    protected info: MonsterCfg = null
    public pos: mw.Vector;
    protected config: IMonsterElement
    protected fsm: StateMachine<EMonsterBehaviorState> = new StateMachine();
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
    protected curTagetPid: number = -1
    protected lastTargetPid: number = -1
    /**攻击所持续时间 */
    protected atkElaspe: number = 0
    /**当前使用的技能 */
    protected curSkillElem: IMonsterSkillElement = null
    protected curBehav: number = -1
    protected curBehavElem: IMonsterBehaviorElement = null
    protected monsterStateCb: Action1<EMonserState>
    protected behavior: IMonsterBehaviorElement[]

    public async init(obj: mw.GameObject, cfgID: number, monsterStateCb: Action1<EMonserState>) {
        await obj.asyncReady()
        this.host = obj;
        this.config = GameConfig.Monster.getElement(cfgID)
        this.lifeTime = 0
        if (this.config.Position && this.config.Position.length > 0)
            this.bornPos.set(this.config.Position[0])
        this.initState()
        if (SystemUtil.isServer()) {
            this.hpCallBack.add(this.onHpChange.bind(this))
            this.monsterStateCb = monsterStateCb
            this.initEvents()

            //添加行为
            this.behavior = []

            if (this.config.Behavior && this.config.Behavior.length > 0) {
                this.config.Behavior.forEach(e => {
                    const elem = GameConfig.MonsterBehavior.getElement(e)
                    this.behavior.push(elem)
                    if (Number(elem.skill))
                        this.ownSkills.push(elem.skill)
                })
            }

            await this.initAsset()
        }
    }

    initEvents() {
        Event.addLocalListener(EventsName.PlayerDead, (pid: number) => {
            this.deletePlayer(pid)
        })

        Player.onPlayerLeave.add((p) => {
            this.deletePlayer(p.playerId)
        })

        Event.addLocalListener('LastDamage', (mid: string, pid: number) => {
            if (this.host.gameObjectId != mid) return
            let p = Player.getPlayer(pid)
            if (p && p.character) {
                if (this.config.monsterType == EMonsterType.SpaceFlight) {
                    MGSMsgHome.uploadMGS('ts_game_result', '玩家每次击杀npc时', { record: 'kill_npc' }, p)
                    const moneyVal = [0, 1, 3, 5]
                    let awardVec = FightMgr.instance.getAwardPeople(mid)
                    awardVec.forEach(e => {
                        if (this.config.DeathGold) {
                            ModuleService.getModule(DropModuleS).creatDrop(new Vector(this.host.worldTransform.position.x, this.host.worldTransform.position.y, this.host.worldTransform.position.z),
                                this.config.DeathGold[0], moneyVal[this.config.DeathGold[0]] * this.config.DeathGold[1], this.config.DeathGold[1], e)
                        }
                    })
                    // if (this.config.DeathItem) {
                    //     ModuleService.getModule(DropModuleS).creatDropAll(new Vector(this.host.worldTransform.position.x, this.host.worldTransform.position.y, this.host.worldTransform.position.z),
                    //         ERewardType.RepairBox, 1, this.config.DeathItem)
                    // }
                }
                this.giverPos = p.character.worldTransform.position.clone()
                this.impulseVec = new Vector(this.host.worldTransform.position.x, this.host.worldTransform.position.y, this.host.worldTransform.position.z + 5000).subtract(p.character.worldTransform.position)
            }
        })
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
        this.fsm.register(EMonsterBehaviorState.Idle, { enter: this.onIdle.bind(this), update: this.idleUpdate.bind(this), exit: this.idleExit.bind(this) })
        this.fsm.register(EMonsterBehaviorState.Partrol, { enter: this.onPartrol.bind(this), update: this.partrolUpdate.bind(this), exit: this.partrolExit.bind(this) })
        this.fsm.register(EMonsterBehaviorState.AttackPrepare, { enter: this.onAtkPrepare.bind(this), update: this.atkPrepareUpdate.bind(this), exit: this.atkPrepareExit.bind(this) })
        this.fsm.register(EMonsterBehaviorState.Attack, { enter: this.onAtk.bind(this), update: this.atkUpdate.bind(this), exit: this.atkExit.bind(this) })
        this.fsm.register(EMonsterBehaviorState.TargetPrepare, { enter: this.onTargetPrepare.bind(this), update: this.targetPrepareUpdate.bind(this), exit: this.targetPrepareExit.bind(this) })
        this.fsm.register(EMonsterBehaviorState.Target, { enter: this.onTarget.bind(this), update: this.targetUpdate.bind(this), exit: this.targetExit.bind(this) })
        this.fsm.register(EMonsterBehaviorState.Dead, { enter: this.onDead.bind(this), update: this.deadUpdate.bind(this), exit: this.deadExit.bind(this) })
        this.fsm.register(EMonsterBehaviorState.Show, { enter: this.onShow.bind(this), update: this.showUpdate.bind(this), exit: this.showExit.bind(this) })
        this.fsm.register(EMonsterBehaviorState.Sleep, { enter: this.onSleep.bind(this), update: this.sleeptUpdate.bind(this), exit: this.sleepExit.bind(this) })
        this.fsm.register(EMonsterBehaviorState.Hit, { enter: this.onHit.bind(this), update: this.hitUpdate.bind(this), exit: this.hitExit.bind(this) })
    }



    protected isBegin = true
    protected isPush = false
    /**正在刷新时间 */
    protected isRefresh = false
    protected lifeUpdate(dt: number) {
        if (this.config.AppearTime < 0) {
            return
        }
        this.lifeTime += dt
        if (!this.isRefresh) {
            if (!this.isBegin && this.lifeTime >= 10) {
                this.isBegin = true
                if (this.config.monsterType == EMonsterType.Boss)
                    Event.dispatchToAllClient('SetCarGoldOutTri', true)
                this.changeState(EMonsterBehaviorState.Show)
            } else if (!this.isPush && this.lifeTime >= this.config.PushNoticeTime) {
                this.isPush = true
            } else if (this.lifeTime >= 10 + this.config.ActiveTime) {
                this.isForce = true
                // this.changeState(EMonsterBehaviorState.Dead)
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
                this.changeState(EMonsterBehaviorState.Hit)
            }
            else
                this.changeState(EMonsterBehaviorState.Dead)
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

    // @updater.updateByFrameInterval(20)
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

    // @updater.updateByFrameInterval(20)
    protected targetUpdate(dt: number, eslapsed: number) {
        this.lifeUpdate(dt)
    }
    protected targetExit() {
    }

    protected onDead(...data: any) {
        this.monsterStateCb?.call(EMonserState.Dead)
        this.timerList.forEach(e => {
            clearInterval(e)
            clearTimeout(e)
            e = null
        })
        this.timerList.length = 0
        // this.clearAllSkills()
        this.ownSkills.length = 0
        if (this.config.monsterType == EMonsterType.Boss) {
            Event.dispatchToAllClient('SetCarGoldOutTri', false)
        }
        if (PlayerManagerExtesion.isCharacter(this.host)) {
            this.host.ragdollEnabled = true
            this.playDeadEff(true)
        }
        this.resetAtkState()
    }
    protected deadUpdate(dt: number, eslapsed: number) {
    }
    protected deadExit() {
        if (PlayerManagerExtesion.isCharacter(this.host)) {
            this.host.movementEnabled = this.host.jumpEnabled = false
        } else {
            this.host.setCollision(mw.CollisionStatus.Off)
            this.host.setVisibility(mw.PropertyStatus.Off)
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
        this.monsterStateCb.call(EMonserState.Visable)
        this.impulseVec = this.host.worldTransform.getForwardVector().multiply(-1).clone()
        this.giverPos = this.host.worldTransform.position.clone()
        if (this.enterTrigger)
            this.enterTrigger.enabled = (true)
        this.host.setCollision(mw.CollisionStatus.On)
        this.host.setVisibility(mw.PropertyStatus.On)
        if (PlayerManagerExtesion.isCharacter(this.host)) {
            this.host.ragdollEnabled = false
            this.host.movementEnabled = this.host.jumpEnabled = true
            this.playDeadEff(false)
        }
        if (this.enterTrigger) {
            this.enterPlayerID.forEach(e => {
                const p = Player.getPlayer(e)
                if (p && p.character && this.enterTrigger.checkInArea(p.character)) {
                    Event.dispatchToLocal(EventsName.PlayerBattle, e, true, this.config.Trigger, false)
                    this.enterTrigger.onEnter.broadcast(p.character)
                } else {
                    this.deletePlayer(e)
                }
            })
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
        if (this.hitElasped >= 1.5) {
            if (this.curHp <= 0) {
                this.changeState(EMonsterBehaviorState.Dead)
            } else {
                if (this.getCurState() != EMonsterBehaviorState.Dead || this.getCurState() != EMonsterBehaviorState.Sleep)
                    this.changeState(this.lastState)
            }
        }
    }
    protected hitExit() {
    }

    protected lastState: EMonsterBehaviorState = EMonsterBehaviorState.None
    public changeState(state: EMonsterBehaviorState, ...data: any) {
        if (this.getCurState() && this.getCurState() != EMonsterBehaviorState.Hit) {
            this.lastState = this.getCurState()
        }
        this.fsm.switch(state, ...data)
    }

    @updater.updateByFrameInterval(30)
    public update(dt: number) {
        if (this.config && this.config.isService == 1 && SystemUtil.isServer())
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
            // if (this.battleEnterTex && this.battleEnterTex.length > 0 && (this.getCurState() != EMonsterBehaviorState.Dead
            //     || this.getCurState() != EMonsterBehaviorState.Sleep)) {
            //     const ran = MathUtil.randomInt(0, this.battleEnterTex.length)
            //     Event.dispatchToLocal('MonsterSay', this.host.guid, this.battleEnterTex[ran])
            // }
            // if (PlayerManagerExtesion.isCharacter(this.host)) {
            //     if (this.config.monsterType == EMonsterType.Boss) {
            //         ModuleService.getModule(GuideMS).startGuide(50, go.player)
            //         Event.dispatchToClient(go.player, 'BossHpShow', true)
            //     } else {
            //         if (this.config.atkStance) {
            //             this.playAction(this.config.atkStance)
            //         }
            //     }
            // }
            if (this.curHp <= 0) return
            if (this.enterPlayerID.length > 0) {
                if (this.getCurState() != EMonsterBehaviorState.Target)
                    this.changeState(EMonsterBehaviorState.Target)
            }
            else {
                if (this.getCurState() != EMonsterBehaviorState.Partrol)
                    this.changeState(EMonsterBehaviorState.Partrol)
            }
        }
    };
    protected onBattleLeave = (go: mw.GameObject) => {
        if (PlayerManagerExtesion.isCharacter(go) && go.player) {
            let playerId = go.player.playerId;
            this.deletePlayer(playerId);
            if (this.curHp <= 0) return
            if (this.config.monsterType == EMonsterType.Boss) {
                Event.dispatchToClient(go.player, 'BossHpShow', false)
            }
            if (this.enterPlayerID.length <= 0) {
                if (this.getCurState() != EMonsterBehaviorState.Partrol)
                    this.changeState(EMonsterBehaviorState.Partrol)
            }
        }
    };

    protected deletePlayer(playerId: number) {
        let index = this.enterPlayerID.indexOf(playerId);
        if (index >= 0) {
            const char = Player.getPlayer(playerId)?.character
            this.enterPlayerID.splice(index, 1);
            if (playerId == this.curTagetPid && char && this.target && this.target.gameObjectId == char.gameObjectId) {
                if (this.curHp > 0 && this.getCurState() != EMonsterBehaviorState.Dead
                    && this.getCurState() != EMonsterBehaviorState.Sleep) {
                    this.resetAtkState()
                    if (this.enterPlayerID.length > 0) {
                        this.changeState(EMonsterBehaviorState.Target)
                    } else {
                        this.changeState(EMonsterBehaviorState.Partrol)
                    }
                }
            }
            Event.dispatchToLocal(EventsName.PlayerBattle, playerId, false, this.config.Trigger, true)
        }
    }

    protected addPlayer(playerId: number) {
        let index = this.enterPlayerID.indexOf(playerId);
        if (index < 0) {
            this.enterPlayerID.push(playerId);
            const p = Player.getPlayer(playerId)
            Event.dispatchToLocal(EventsName.PlayerBattle, playerId, true, this.config.Trigger, true)
        }
    }

    playAction(actionID: number) {
        if (SystemUtil.isServer() && PlayerManagerExtesion.isCharacter(this.host))
            ModuleService.getModule(ActionMS).playAction(actionID, this.host)
    }

    /**重置怪物战斗状态 */
    protected resetAtkState() {
        this.curTagetPid = 0
        this.target = null
        // this.targetPos = Vector.zero
        this.atkElaspe = 0
        // this.curSkillElem = null
    }

    //默认冲量
    protected _impulse: number = 50//6000瞬时
    protected impulseVec: Vector = Vector.zero
    protected giverPos: Vector = Vector.zero
    public addImpulse(elsape: number) {
        if (SystemUtil.isClient()) return
        if (PlayerManagerExtesion.isCharacter(this.host)) {
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

    /**加载资源 */
    protected async initAsset() {
        if (this.config.Appearance && this.config.Appearance.length > 0) {

            for (const e of this.config.Appearance) {
                const elem = GameConfig.Model.getElement(e)
                if (elem) {
                    const o = await GoPool.asyncSpawn(elem.ModelGuid)
                    await o.asyncReady()
                    if (!o) return
                    if (PlayerManagerExtesion.isCharacter(this.host)) {
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
    /**巡逻 */

    /**寻找触发器敌人 */
    protected findTargetInTri() {
        if (this.curTagetPid > 0)
            return

        for (const p of Player.getAllPlayers()) {
            if (!p || !p.character
                || !this.enterTrigger.checkInArea(p.character)) {
                this.deletePlayer(p.playerId)
            }
            else if (p && p.character && this.enterTrigger.checkInArea(p.character)) {
                this.addPlayer(p.playerId)
            }
        }

        if (this.enterPlayerID.length == 0) {
            this.changeState(EMonsterBehaviorState.Partrol)
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
            this.changeState(EMonsterBehaviorState.Partrol)
            return
        } else {
            this.curTagetPid = ranPlayer
            this.target = tmpP.character
            this.targetPos = tmpP.character.worldTransform.position
            this.changeState(EMonsterBehaviorState.Target)
        }
    }

}

//人型
export class CharMonsterBase extends MonsterBase {
    declare host: mw.Character
    protected isDamage: boolean = false
    /**复活位置 */

    atkFrq: number = 0
    public async init(obj: mw.GameObject, cfg: number, monsterStateCb: Action1<EMonserState>): Promise<void> {
        await super.init(obj, cfg, monsterStateCb)
        // this.initTrigger()
        if (SystemUtil.isClient()) {
            // const humanV1 = this.host.setDescription(mw.HumanoidV1);
            // humanV1.enablePostProcess(true, mw.LinearColor.red, 1)
            // humanV1['enableOutline'] = true
            // // humanV1['postProcessObj'].occlusionBlend = 0.5
            // humanV1.enablePostProcess(true, mw.LinearColor.red, 1)
        } else {
            this.host = obj as mw.Character
            this.host.movementDirection = mw.MovementDirection.AxisDirection;
            this.behavior = []
            if (this.config.Behavior && this.config.Behavior.length > 0) {
                this.config.Behavior.forEach(e => {
                    const elem = GameConfig.MonsterBehavior.getElement(e)
                    this.behavior.push(elem)
                    if (Number(elem.skill))
                        this.ownSkills.push(elem.skill)
                })
            }


            const trr = FightMgr.instance.getMAttibuteList(this.config.Guid)
            this.host.maxWalkSpeed = trr.getValue(Attribute.EAttType.speed)
            this.atkFrq = trr.getValue(Attribute.EAttType.atkFreq)
            this.host.maxAcceleration = 1024
            this.host.maxFallingSpeed /= 3
            setTimeout(() => {
                this.changeState(EMonsterBehaviorState.Show)
            }, MathUtil.randomFloat(1, 5) * 1000);
        }

    }

    moveTo() {
        if (!this.config.Position) return
        if (this.moveTimer || this.getCurState() != EMonsterBehaviorState.Partrol) return
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

    initEvents(): void {
        super.initEvents()
        Event.addLocalListener("OnReplyPoint", (mid: string, res: Vector) => {
            if (this.host.gameObjectId == mid) {
                this.tmpTargetPos = res
            }
        })
        Event.addLocalListener("WallShow", (build: string, state: boolean) => {
            if (this.target) {
                if (!state && (this.target.gameObjectId == build || (this.target.parent && this.target.parent.gameObjectId == build))) {
                    this.isReachWaLL = false
                    this.resetAtkState()
                    this.changeState(EMonsterBehaviorState.Idle)
                } else {
                    if (state && this.curTagetPid <= 0 && (this.target.gameObjectId == build || (this.target.parent && this.target.parent.gameObjectId == build))) {
                        this.isReachWaLL = false
                        this.resetAtkState()
                        this.changeState(EMonsterBehaviorState.Idle)
                    }
                }
            } else {
                this.isReachWaLL = false
                this.resetAtkState()
                this.changeState(EMonsterBehaviorState.Idle)
            }
        })
    }

    public update(dt: number): void {
        super.update(dt)
    }

    protected baseUpdate(dt: number, eslapsed: number) {
        super.lifeUpdate(dt)
        if (PlayerManagerExtesion.isCharacter(this.host) &&
            this.getCurState() != EMonsterBehaviorState.Sleep
            && this.getCurState() != EMonsterBehaviorState.Attack) {
            if (Math.abs(this.traVec.x - this.host.worldTransform.position.x) <= 50 ||
                Math.abs(this.traVec.y - this.host.worldTransform.position.y) <= 50 ||
                Math.abs(this.traVec.z - this.host.worldTransform.position.z) <= 200) {
                this.trapTime += dt
            } else {
                this.traVec.set(this.host.worldTransform.position)
                this.trapTime = 0
            }

            if ((this.getCurState() == EMonsterBehaviorState.Target ||
                this.getCurState() == EMonsterBehaviorState.Escape) && this.trapTime >= 20) {
                this.resetAtkState()
                this.changeState(EMonsterBehaviorState.Idle)
                this.trapTime = 0
            } else if (GlobalData.LiveWall > 0 && this.getCurState() == EMonsterBehaviorState.Partrol && this.trapTime >= 200) {
                this.resetPos(this.bornPos)
                this.trapTime = 0
            }

        }

        if (this.curTagetPid > 0 && PlayerManagerExtesion.isCharacter(this.target) && this.target.player == null) {
            this.deletePlayer(this.curTagetPid)
            this.resetAtkState()
        }

        if (this.host.worldTransform.position.z < -500) {
            this.resetPos(this.bornPos)
        }
    }



    protected findTarget() {
        if (this.curTagetPid > 0)
            return

        let vec = PlayerMgr.Inst.getRangePlayer(500, "0", this.host.worldTransform.position)
        for (const p of vec) {
            if (p && p.character) {
                this.addPlayer(p.mwPlayer.playerId)
            } else {
                this.deletePlayer(p.mwPlayer.playerId)
            }
        }

        if (this.enterPlayerID.length == 0) {
            this.changeState(EMonsterBehaviorState.Partrol)
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
            this.changeState(EMonsterBehaviorState.Partrol)
            return
        } else {
            this.curTagetPid = ranPlayer
            this.target = tmpP.character
            this.targetPos = tmpP.character.worldTransform.position
            this.changeState(EMonsterBehaviorState.Target)
        }
    }

    protected resetAtkState(): void {
        super.resetAtkState()
        this.isDamage = false
        this.pathIndex = 0
    }

    findEnemyInteval = null

    protected onShow(...data: any) {
        super.onShow(data)
        if (!this.host) return
        this.host.worldTransform.position = this.bornPos
        this.host.collisionWithOtherCharacterEnabled = true
        this.host.switchToWalking()
        this.changeState(EMonsterBehaviorState.Partrol)

        if (!this.findEnemyInteval) {
            this.findEnemyInteval = setInterval(() => {
                if (!this.isReachWaLL) {
                    if (this.curTagetPid <= 0) {
                        this.findTarget()
                    }
                }
            }, MathUtil.randomFloat(1, 8) * 1000)
            this.timerList.push(this.findEnemyInteval)
        }
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
        // super.idleUpdate(dt, eslapsed)
        this.baseUpdate(dt, eslapsed)
    }

    protected idleExit(): void {
        super.idleExit()
    }

    protected pathIndex = -1
    protected moveFlag = true;
    protected moveTimer = null

    protected onPartrol(...data: any) {
        super.onPartrol(data)
        if (this.config.zombiemove)
            this.playAction(this.config.zombiemove)
        this.movetoTarget()
    }


    moveInteval = null
    //走到围墙
    movetoTarget() {
        if (!this.target) {
            if (GlobalData.LiveWall == 0)
                return
            const root = AssistMgr.Inst.getRangeAssists(6000, this.host.worldTransform.position)
            if (root && root.length > 0) {
                const target = root[MathUtil.randomInt(0, root.length)].gameObject
                const child = target.getChildren().filter(e => {
                    e.name != '检测方块'
                })
                if (child && child.length > 0) {
                    this.target = child[MathUtil.randomInt(0, child.length)]
                } else {
                    this.target = target
                }
            }
        }

        if (!this.target) {
            this.resetAtkState()
            this.isReachWaLL = false
            this.changeState(EMonsterBehaviorState.Idle)
            if (this.curBehavElem && SystemUtil.isServer()) {
                ModuleService.getModule(ActionMS).stopAction(this.host.gameObjectId)
            }
            return
        }

        this.targetPos = GameUtils.randomCirclePos(new Vector(this.target.worldTransform.position.x, this.target.worldTransform.position.y, this.host.worldTransform.position.z),
            150, true)
        if (this.getCurState() != EMonsterBehaviorState.Partrol && this.getCurState() != EMonsterBehaviorState.Target) return
        Navigation.stopNavigateTo(this.host)
        if (this.curTagetPid == 0) {
            this.delta = 600
        } else {
            this.delta = 200
        }
        if (this.moveInteval) {
            clearInterval(this.moveInteval)
            this.moveInteval = null
        }
        this.moveInteval = setInterval(() => {
            if (Vector.squaredDistance(this.host.worldTransform.position, this.targetPos) > this.config.PathRadius * this.config.PathRadius) {
                let dir = this.targetPos.clone().subtract(this.host.worldTransform.position)
                this.host.addMovement(dir.multiply(8))
            } else {
                this.changeState(EMonsterBehaviorState.Attack)
                this.host.collisionWithOtherCharacterEnabled = true
            }
        }, 10)
        this.host.collisionWithOtherCharacterEnabled = false

        // Navigation.navigateTo(this.host, this.targetPos, this.config.PathRadius, () => {
        //     this.changeState(EMonsterBehaviorState.Attack)
        //     this.host.collisionWithOtherCharacterEnabled = true
        // }, () => {
        //     this.resetAtkState()
        //     this.changeState(EMonsterBehaviorState.Idle)
        //     // this.resetPos(this.targetPos)
        //     // this.changeState(EMonsterBehaviorState.Attack)
        //     // this.host.collisionWithOtherCharacterEnabled = true
        // })
    }

    protected partrolUpdate(dt: number, eslapsed: number) {
        // super.partrolUpdate(dt, eslapsed)
        this.baseUpdate(dt, eslapsed)
        if (!this.target) return
        this.host.lookAt(this.target.worldTransform.position)
        if (Vector.squaredDistance(this.host.worldTransform.position, this.target.worldTransform.position) <= this.delta * this.delta) {
            this.changeState(EMonsterBehaviorState.Attack)
        }

    }
    protected partrolExit() {
        super.partrolExit()
        if (this.moveTimer) {
            clearTimeout(this.moveTimer)
            this.moveTimer = null
        }
        if (this.moveInteval) {
            clearInterval(this.moveInteval)
            this.moveInteval = null
        }
        // Navigation.stopNavigateTo(this.host)
    }

    protected targetIntaval = null
    protected tmpTargetPos: Vector = Vector.zero
    protected targetTimer = null
    targetFindCount: number = 0

    protected onTarget(...data: any) {
        super.onTarget(data)
        if (this.config.zombiemove)
            this.playAction(this.config.zombiemove)
        //移动到攻击范围进行切攻击姿态攻击
        if (this.curTagetPid <= 0 && !this.isReachWaLL) {
            this.findTarget()
        }
        this.movetoTarget()
        this.targetIntaval = setInterval(() => {
            this.movetoTarget()
            // this.findPathToTargett()
        }, MathUtil.randomFloat(0.5, 1) * 1000)
    }

    protected targetUpdate(dt: number, eslapsed: number) {
        this.baseUpdate(dt, eslapsed)
        if (eslapsed > 15) {
            this.deletePlayer(this.curTagetPid)
            this.changeState(EMonsterBehaviorState.Idle)
        }
        if (!this.target) return
        this.host.lookAt(this.target.worldTransform.position)
        if (Vector.squaredDistance(this.host.worldTransform.position, this.target.worldTransform.position) <= this.delta * this.delta) {
            this.changeState(EMonsterBehaviorState.Attack)
        }
    }

    protected targetExit() {
        super.targetExit()
        this.clearTargetIntaval()
        this.targetFindCount = 0
        this.host.collisionWithOtherCharacterEnabled = true
        if (this.targetTimer) {
            clearTimeout(this.targetTimer)
            this.targetTimer = null
        }
        if (this.moveInteval) {
            clearInterval(this.moveInteval)
            this.moveInteval = null
        }
        // Navigation.stopNavigateTo(this.host)
    }


    helghtDelt = 500
    tmpVec: Vector = Vector.zero

    clearTargetIntaval() {
        if (this.targetIntaval) {
            clearInterval(this.targetIntaval)
            this.targetIntaval = null
        }
    }

    protected onAtk(...data: any): void {
        super.onAtk(data)
        if (this.config.Behavior.length > 0 && SystemUtil.isServer()) {
            this.curBehav = 0
            this.curBehavElem = this.behavior[this.curBehav]
            this.curSkillElem = GameConfig.MonsterSkill.getElement(this.curBehavElem.skill)
        }
        if (this.config.atkStance)
            this.playAction(this.config.atkStance)

    }

    delta: number

    protected atkUpdate(dt: number, eslapsed: number): void {
        if (!this.curSkillElem || this.curBehav < 0 || this.curBehav >= this.behavior.length || !this.target)
            return
        const len = Vector.squaredDistance(this.host.worldTransform.position, this.tmpVec.set(this.target.worldTransform.position.x,
            this.target.worldTransform.position.y, this.host.worldTransform.position.z))
        if (len >= this.delta * this.delta) {
            if (this.curTagetPid == 0) {
                this.changeState(EMonsterBehaviorState.Partrol)
            } else {
                this.resetAtkState()
                this.changeState(EMonsterBehaviorState.Idle)
            }
            return
        }
        super.atkUpdate(dt, eslapsed)
        this.atkElaspe += dt
        if (this.curSkillElem && this.atkElaspe < this.curSkillElem.preTime) return
        if (!this.isDamage) {
            this.isDamage = true
            this.useSkill()
        }
        if (this.atkElaspe >= this.atkFrq) {
            this.atkElaspe = 0
            if (this.curBehav < this.behavior.length - 1) {
                this.curBehav += 1
            } else {
                this.curBehav = 0
            }
            this.isDamage = false
            // console.log("重置战斗状态")
        }
    }
    protected atkExit(): void {
        super.atkExit()
    }
    isReachWaLL: boolean = false
    useSkill() {
        if (!this.target) return
        if (this.curBehav < 0 || this.curBehav >= this.behavior.length) return
        const b = this.behavior[this.curBehav]
        if (b) {
            if (b.skill) {
                const root = AssistMgr.Inst.getAreaLiveAssist()
                const res = root.find(e => e.gameObject.gameObjectId == this.target.gameObjectId ||
                    (this.target.parent && e.gameObject.gameObjectId == this.target.parent.gameObjectId))
                if (res) {
                    this.isReachWaLL = true
                }

                this.host.lookAt(this.target.worldTransform.position)
                let dir = this.host.worldTransform.getForwardVector().normalized
                let relsePos: Vector
                relsePos = this.host.worldTransform.position
                ModuleService.getModule(MonsterSkillMS).useSkill(b.skill, this.host.gameObjectId, dir, relsePos, this.enterPlayerID)
            }
            if (b.action) {
                this.playAction(b.action)
            }
            // console.log("小弟释放技能1", this.curBehav)
        }

    }

    protected onHit(...data: any): void {
        super.onHit(data)
    }

    protected onHpChange(hp: number, isForce: boolean): void {
        if (hp < this.curHp) {
            if (hp > 0) {
                this.playAction(304)
            }
            else {

            }
        }
        super.onHpChange(hp, isForce)
    }

    protected hitUpdate(dt: number, eslapsed: number): void {
        super.hitUpdate(dt, eslapsed)
    }

    protected hitExit(): void {
        super.hitExit()
    }

    protected onDead(...data: any) {
        super.onDead(data)
        this.findEnemyInteval = null
        this.bornPos.set(this.host.worldTransform.position)
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
        if (eslapsed > 0.1) {
            this.changeState(EMonsterBehaviorState.Sleep)
        }
    }

    protected deadExit() {
        this.host.switchToWalking()
        super.deadExit()
        FightMgr.instance.clearMonsterDamageInfo(this.config.Guid)
    }

}