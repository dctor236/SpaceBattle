import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
/*
* @Author: 代纯 chun.dai@appshahe.com
* @Date: 2023-06-22 21:02:00
* @LastEditors: 代纯 chun.dai@appshahe.com
* @LastEditTime: 2023-07-08 15:10:45
* @FilePath: \vine-valley\JavaScripts\modules\fight\monster\DragonMonster.ts
* @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
*/
import { GameConfig } from "../../../config/GameConfig";
import { IMonsterBehaviorElement } from "../../../config/MonsterBehavior";
import { EventsName } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { SoundManager } from "../../../ExtensionType";
import { MonsterBase } from "../../../ts3/monster/behavior/MonsterBase";
import { MonsterCfg, EMonsterBehaviorState, EMonserState } from "../../../ts3/monster/MonsterDefine";
import { PlayerMgr } from "../../../ts3/player/PlayerMgr";
import Tips from "../../../ui/commonUI/Tips";
import GameUtils from "../../../utils/GameUtils";
import { BuffModuleS } from "../../buff/BuffModuleS";
import { EBuffHostType } from "../../buff/comon/BuffCommon";
import GuideMS from "../../guide/GuideMS";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
import { CoinType } from "../../shop/ShopData";
import ShopModuleS from "../../shop/ShopModuleS";
import SkyModuleS from "../../sky/SkyModuleS";
import { TaskModuleS } from "../../taskModule/TaskModuleS";
import { Attribute } from "../attibute/Attribute";
import FightMgr, { EDragonEffControl } from "../FightMgr";
import { ESkillEffectType } from "../monsterSkill/MonsterSkillBase";
import MonsterSkillMS from "../monsterSkill/MonsterSkillMS";


export enum DragonBehaviorEff {
    None,
    Impuse,
    Rotation
}

export default class DragonMonster extends MonsterBase {

    protected rebornTrigger: mw.Trigger

    /**龙头,发射点 */
    private _head: mw.GameObject
    /**龙围绕飞行物 */
    private _root: mw.GameObject
    private _dragonTransp: mw.GameObject

    /**单体技能 定点随机释放*/
    private firePoint: mw.GameObject
    protected singleSkills: number[] = [0, 2];
    protected aoeSkills: { behaviorIndex: number, initCount: number, count: number }[] = [
        { behaviorIndex: 1, initCount: 4, count: 0 },
        { behaviorIndex: 3, initCount: 1, count: 0 }
    ];

    /**限定技列表 */
    protected preReases: number[] = []
    protected behavior: IMonsterBehaviorElement[]
    protected initHeadLoc: Vector = new Vector(254.17, 2219, 14376)
    protected initHeadRot: Rotation = new Rotation(0, -30, 140)
    protected initDragonLoc: Vector = new Vector(1152, 2103, 13856)
    protected initDragonRot: Rotation = new Rotation(0, 40, 30)
    protected humanHeight: number = 0

    /**翅膀音效 */
    private _wingAudio: number = -1

    public async init(obj: mw.GameObject, cfg: number, monsterStateCb: Action1<EMonserState>): Promise<void> {
        await super.init(obj, cfg, monsterStateCb)
        this.fsm.register(EMonsterBehaviorState.ImpulseBack, { enter: this.onImpulseBack.bind(this), update: this.impulseBackUpdate.bind(this), exit: this.impulseBackExit.bind(this) })
        this.fsm.register(EMonsterBehaviorState.Impulse, { enter: this.onImpulse.bind(this), update: this.impulseUpdate.bind(this), exit: this.impulseExit.bind(this) })
        if (this.host.parent) {
            this._head = this.host.parent
            if (this._head.parent) {
                this._root = this._head.parent
                this._dragonTransp = this._head.getChildByName('恐龙T')
            }
        }
        this.firePoint = this.host.getChildByName('嘴部发射点')
        this.initEff()
        this.behavior = []
        if (this.config.Behavior && this.config.Behavior.length > 0) {
            this.config.Behavior.forEach(e => {
                const elem = GameConfig.MonsterBehavior.getElement(e)
                this.behavior.push(elem)
                if (Number(elem.skill))
                    this.ownSkills.push(elem.skill)
            })
        }
        this.changeState(EMonsterBehaviorState.Sleep)
    }

    deadEff: string[] = []
    flashEff: string[] = []
    bodyEff: string[] = []

    private initEff() {
        GameObject.asyncFindGameObjectById('3F3DE85E').then(o => {
            this.rebornTrigger = o as mw.Trigger
            this.rebornTrigger.enabled = (true)
            this.rebornTrigger.onEnter.add(this.onRebornEnter)
            this.rebornTrigger.onLeave.add(this.onRebornLeave)
        })
        this.deadEff = [this.host.getChildren()[2].gameObjectId]
        this.flashEff = [this.host.getChildren()[1].gameObjectId]

        for (let i = 3; i < this.host.getChildren().length; i++) {
            this.bodyEff.push(this.host.getChildren()[i].gameObjectId)
        }

        Player.onPlayerLeave.add((p) => {
            this.deletePlayer(p.playerId)
            if (this.target && p.character.gameObjectId == this.target.gameObjectId) {
                this.resetAtkState()
                this.changeState(EMonsterBehaviorState.TargetPrepare)
            }
        })

        Player.onPlayerJoin.add((p) => {
            const player = p
            setTimeout(() => {
                Event.dispatchToClient(player, 'InitDraggonEff', this.bodyEff, this.deadEff, this.flashEff)
                setTimeout(() => {
                    if (this.getCurState() == EMonsterBehaviorState.Sleep) {
                        Event.dispatchToClient(player, EventsName.ControlDragonEffList, this.flashEff.concat(this.deadEff).concat(this.bodyEff), false)
                    }
                }, 2000);
            }, 3000);
        })
    }

    protected baseUpdate(dt: number, eslapsed: number) {
        if (this.enterPlayerID.length > 0) {
            if (this.getCurState() == EMonsterBehaviorState.Idle) {
                this.changeState(EMonsterBehaviorState.TargetPrepare)
            }
        } else if (this.enterPlayerID.length <= 0) {
            if (this.getCurState() != EMonsterBehaviorState.Idle)
                this.changeState(EMonsterBehaviorState.Idle)
        }

        if (this.getCurState() != EMonsterBehaviorState.Idle && (
            !this.targetPos || !this.target || this.curBehav == -1 || !this.curSkillElem || !this.enterTrigger.checkInArea(this.target))) {
            this.changeState(EMonsterBehaviorState.TargetPrepare)
        }

        // if (eslapsed >= 3.5) {
        //     this.changeState(EMonsterBehaviorState.TargetPrepare)
        // }
    }

    protected onShow(...data: any) {
        super.onShow(data)
        this.enterTrigger.enabled = (true)
        this._dragonTransp?.setVisibility(mw.PropertyStatus.Off)
        this.host.setVisibility(mw.PropertyStatus.On)
        this.host.setCollision(mw.CollisionStatus.QueryOnly)
        ModuleService.getModule(SkyModuleS).changeAllSky(2)
        this.changeState(EMonsterBehaviorState.Idle)
    }

    protected showUpdate(dt: number, eslapsed: number) {
    }
    protected showExit() {
    }

    private _flag: boolean = true
    private tmpRot: Rotation = Rotation.zero
    private tmpVec: Vector = Vector.zero
    coinEffInteval = null

    protected onIdle(...data: any): void {
        super.onIdle(data)
        Event.dispatchToAllClient('InitDraggonEff', this.bodyEff, this.deadEff, this.flashEff)
        if (this._wingAudio == -1) {
            this._wingAudio = SoundManager.play3DSound('179629', this.host, 0, 10, { radius: 12000, falloffDistance: 3000 });
        }
        const all = Player.getAllPlayers()
        if (all && all.length > 0 && this.humanHeight == 0) {
            this.humanHeight = Player.getAllPlayers()[0].character.collisionExtent.z * 2
        }
        this.firstIn = false
        if (!this.host.getVisibility())
            this.host.setVisibility(mw.PropertyStatus.On, true)

        this.lookAt(this._root.worldTransform.position)
        this.revertRotLoc()
        // this.clearAllSkills()

        // if (!this.coinEffInteval) {
        //     this.coinEffInteval = setInterval(() => {
        //         ModuleService.getModule(DropModuleS).creatDropAll(new Vector(2241.05, -9358.89, 680.00), ERewardType.Gold, 500, 10)
        //     }, 5000)
        // }
    }

    private flyUpDown(dt: number) {
        if (!this.host.getVisibility()) { return }
        this.tmpVec.set(this._head.worldTransform.position)
        if (this._flag) {
            if (this.tmpVec.z <= 14500) {
                this.tmpVec.set(this.tmpVec.x, this.tmpVec.y, this.tmpVec.z + 400 * dt)
            } else {
                this._flag = false
            }
        } else {
            if (this.tmpVec.z >= 14000) {
                this.tmpVec.set(this.tmpVec.x, this.tmpVec.y, this.tmpVec.z - 400 * dt)
            } else {
                this._flag = true
            }
        }
        this._head.worldTransform.position = this.tmpVec
    }

    protected idleUpdate(dt: number, eslapsed: number): void {
        this.baseUpdate(dt, eslapsed)
        super.idleUpdate(dt, eslapsed)
        if (this._root) {
            this._root.worldTransform.rotation = this.tmpRot.set(this._root.worldTransform.rotation.x, this._root.worldTransform.rotation.y, this._root.worldTransform.rotation.z - 50 * dt)
        }
        this.flyUpDown(dt)
    }

    private revertRotLoc() {
        if (this.target) return
        this._head.localTransform.position = this._root.worldTransform.inverseTransformPosition(this.initHeadLoc)
        this._head.worldTransform.rotation = this.initHeadRot
        this.host.localTransform.position = this._head.worldTransform.inverseTransformPosition(this.initDragonLoc)
        // this.host.worldTransform.rotation = this.initDragonRot
    }

    private firstIn: boolean = false


    private lookAt(targetPos: Vector) {
        if (!this.target || !targetPos) {
            this.findTarget()
            return
        }
        if (targetPos.z >= this.initHeadLoc.z
            || Math.abs(targetPos.x - this._head.worldTransform.position.x) <= 100
            || Math.abs(targetPos.y - this._head.worldTransform.position.y) <= 100)
            return
        this._head.worldTransform.lookAt(this.tmpVec.set(targetPos.x, targetPos.y,
            targetPos.z))
    }

    protected onTarget(...data: any) {
        super.onTarget(data)
        Tips.showToClient(Player.getPlayer(this.curTagetPid), "火龙王似乎盯上你了!")
        if (this.curBehav != -1)
            this.curSkillElem = GameConfig.MonsterSkill.getElement(this.behavior[this.curBehav].skill)
    }

    protected targetUpdate(dt: number, eslapsed: number) {
        this.baseUpdate(dt, eslapsed)
        // if (eslapsed <= 1.2) return
        super.targetUpdate(dt, eslapsed)
        this.lookAt(this.target.worldTransform.position)
        this.targetPos.set(this.target.worldTransform.position.x, this.target.worldTransform.position.y,
            this.initHeadLoc.z)
        this.tmpVec.set(this._head.worldTransform.position)
        this.flyUpDown(dt)
        if (Vector.squaredDistance(this._head.worldTransform.position, this.targetPos) <= this.curSkillElem.scope * this.curSkillElem.scope) {
            this.onForcast()
        } else {
            if (eslapsed > 10) {
                //重新选择目标
                this.changeState(EMonsterBehaviorState.AttackPrepare)
            } else {
                this._head.worldTransform.position = Vector.lerp(this.tmpVec, this.targetPos, 0.5 * dt)
            }
        }
    }
    protected targetExit() {
        // this.curSkillElem.scope = -1
    }

    //闪现位置 避免一直在一个玩家上方
    protected flashPos: Vector = Vector.zero
    targetPrepareInteval = null
    protected onTargetPrepare(...data: any) {
        super.onTargetPrepare(data)
        if (!this.firstIn) {
            this.revertRotLoc()
            this.firstIn = true
        }

        this.clearTargetPrepareInteval()
        this.targetPrepareInteval = setInterval(() => {
            this.findTarget()
        }, 500);

        if (this.curBehav != -1) return
        if (this.preReases.length > 0) {
            this.curBehav = this.preReases[0]
            console.log("限定技能启动", this.curBehav)
        } else {
            let ran = this.singleSkills[MathUtil.randomInt(0, this.singleSkills.length)]
            this.curBehav = ran
        }
    }

    private clearTargetPrepareInteval() {
        if (this.targetPrepareInteval) {
            clearInterval(this.targetPrepareInteval)
            this.targetPrepareInteval = null
        }

    }


    private findTarget() {
        for (const p of Player.getAllPlayers()) {
            if (!p || !p.character
                || !this.enterTrigger.checkInArea(p.character) || this.rebornTrigger.checkInArea(p.character)) {//|| p.character.worldTransform.position.z >= this.host.worldTransform.position.z
                this.deletePlayer(p.playerId)
            }
            else if (p && p.character && this.enterTrigger.checkInArea(p.character)) {
                this.addPlayer(p.playerId)
            }
        }

        if (this.enterPlayerID.length == 0) {
            this.resetAtkState()
            this.changeState(EMonsterBehaviorState.Idle)
            return
        }
        let ranVec = this.enterPlayerID.filter(e => {
            const tmpP = Player.getPlayer(e)
            const char = tmpP?.character
            if (tmpP && char && char.worldTransform.position.z >= this.host.worldTransform.position.z) {
                return false
            } else {
                return true
            }
        })
        let tmpP = null
        //筛选玩家
        const ranPlayer = ranVec[MathUtil.randomInt(0, ranVec.length)]
        tmpP = Player.getPlayer(ranPlayer)
        if (!tmpP) {
            this.changeState(EMonsterBehaviorState.AttackPrepare)
            return
        } else {
            this.curTagetPid = ranPlayer
        }
        this.target = tmpP.character
        this.targetPos = tmpP.character.worldTransform.position
        //龙随机闪现到目标附近 避免一直在龙身体下方
        this.flashPos = GameUtils.randomCirclePos(this.tmpVec.set(this.targetPos.x, this.targetPos.y, this.initHeadLoc.z),
            2000, true)
        Event.dispatchToAllClient(EventsName.ControlDragonEffList, this.flashEff, true)
        if (this._wingAudio) {
            SoundManager.stop3DSound(this._wingAudio)
            this._wingAudio = -1
        }
        this.tmpVec = Vector.zero
        this.clearTargetPrepareInteval()
    }

    protected flashStart: boolean = false
    protected flashEnd: boolean = false

    protected targetPrepareUpdate(dt: number, eslapsed: number) {
        this.baseUpdate(dt, eslapsed)
        // if (eslapsed <= 1.5) return
        super.targetPrepareUpdate(dt, eslapsed)
        if (!this.target) {
            this.changeState(EMonsterBehaviorState.Idle)
            return
        }

        if (!this.flashStart) {
            if (eslapsed >= 1.5) {
                Event.dispatchToAllClient(EventsName.ControlDragonEffList, this.flashEff.concat(this.deadEff).concat(this.bodyEff), false)
                this.lookAt(this.target.worldTransform.position)
                this.host.setCollision(mw.CollisionStatus.Off)
                this.host.setVisibility(mw.PropertyStatus.Off)
                this.monsterStateCb.call(EMonserState.Hide)
                this.flashStart = true
            }
        } else {
            if (!this.flashEnd && eslapsed >= 3) {
                this.flashEnd = true
                this._head.worldTransform.position = this.flashPos
                this.lookAt(this.target.worldTransform.position)
                this._dragonTransp?.setVisibility(mw.PropertyStatus.On)
                Event.dispatchToAllClient(EventsName.ControlDragonEffList, this.flashEff, true)
            } else if (this.flashEnd && eslapsed >= 4.5) {
                Event.dispatchToAllClient(EventsName.ControlDragonEffList, this.bodyEff, true)
                SoundManager.play3DSound('179625', this.host.worldTransform.position, 1, 8,
                    { radius: 8000, falloffDistance: 3000 });
                this.monsterStateCb.call(EMonserState.Visable)
                this.host.setVisibility(mw.PropertyStatus.On)
                this.host.setCollision(mw.CollisionStatus.QueryOnly)
                this._dragonTransp?.setVisibility(mw.PropertyStatus.Off)
                this.changeState(EMonsterBehaviorState.Target)
            }
        }
        this.flyUpDown(dt)

    }
    protected targetPrepareExit() {
        super.targetPrepareExit()
        Event.dispatchToAllClient(EventsName.ControlDragonEffList, this.bodyEff, true)
        this.flashStart = this.flashEnd = false
        if (this._wingAudio == -1) {
            this._wingAudio = SoundManager.play3DSound('179629', this.host, 0, 10, { radius: 12000, falloffDistance: 3000 });
        }
        this.clearTargetPrepareInteval()
        this.host.setVisibility(mw.PropertyStatus.On)
        this.monsterStateCb.call(EMonserState.Visable)
    }

    protected onAtkPrepare(...data: any) {
        super.onAtkPrepare(data)
    }

    protected atkPrepareUpdate(dt: number, eslapsed: number) {
        this.baseUpdate(dt, eslapsed)
        if (eslapsed > 3) {
            this.changeState(EMonsterBehaviorState.TargetPrepare)
        }
        super.atkPrepareUpdate(dt, eslapsed)
        this.flyUpDown(dt)
    }

    protected atkPrepareExit() {
        super.atkPrepareExit()
    }
    impulseTarget: Vector = Vector.zero
    protected onImpulseBack(...data: any) {
        this.lookAt(this.targetPos)
        this.atkTmpVec = this._head.worldTransform.position.clone()
        this.atkDir.set(this.targetPos.clone().subtract(this._head.worldTransform.position)).normalized
        this.impulseTarget.set(this._head.worldTransform.position.add(this.atkDir.clone().multiply(-0.8)))
    }

    protected impulseBackUpdate(dt: number, eslapsed: number) {
        this.baseUpdate(dt, eslapsed)
        this.atkElaspe += dt
        const dis = Vector.squaredDistance(this._head.worldTransform.position, this.impulseTarget)
        if (dis > 150 * 150) {
            const learp = Vector.lerp(this.atkTmpVec, this.impulseTarget, 1 * eslapsed)
            this._head.worldTransform.position = learp
        } else {
            this.changeState(EMonsterBehaviorState.Attack)
        }
    }
    protected impulseBackExit() {
    }

    protected onImpulse(...data: any) {
        this.lookAt(this.targetPos)
        this.atkTmpVec = this._head.worldTransform.position.clone()
        this.atkDir.set(this.targetPos.clone().subtract(this._head.worldTransform.position)).normalized
        this.useSkill()
    }
    protected impulseUpdate(dt: number, eslapsed: number) {
        this.baseUpdate(dt, eslapsed)
        this.atkElaspe += dt
        const dis = Vector.squaredDistance(this._head.worldTransform.position, this.targetPos)
        if (dis > 800 * 800) {
            const learp = Vector.lerp(this.atkTmpVec, this.targetPos, 10 * eslapsed)
            this._head.worldTransform.position = learp
        } else {
            this.changeState(EMonsterBehaviorState.Attack)
        }
    }
    protected impulseExit() {
    }

    public changeState(state: EMonsterBehaviorState, ...data: any): void {
        super.changeState(state, data)
        // console.log("龙的状态", this.getCurState())
    }


    protected onAtk(...data: any): void {
        super.onAtk(data)
        this.lookAt(this.targetPos)
    }

    /**开始吟唱 */
    protected isPredict: boolean = false
    /**开始后撤步 */
    protected isWithdraw: boolean = false
    withDrawTarget: Vector = Vector.zero
    atkTmpVec: Vector = Vector.zero
    atkDir: Vector = Vector.zero
    /**准备撞击 */
    readyFight: boolean = false

    isCircle: boolean = false
    isDamage: boolean = false
    /**关闭伤害检测 */
    isCollision: boolean = false

    protected atkUpdate(dt: number, eslapsed: number): void {
        this.baseUpdate(dt, eslapsed)
        if (!this.curSkillElem || this.curBehav < 0 || this.curBehav >= this.behavior.length)
            return
        super.atkUpdate(dt, eslapsed)
        this.atkElaspe += dt
        const curBehivior = this.behavior[this.curBehav].behavior
        if (this.atkElaspe >= 1 && curBehivior == DragonBehaviorEff.Rotation) {
            // this.lookAt(this._root.worldTransform.position)
            this.onCircle()
            if (!this.isCollision) {
                this.isCollision = true
                this.revertRotLoc()
                this.host.setCollision(mw.CollisionStatus.Off)
            }
            this._root.worldTransform.rotation = this.tmpRot.set(this._root.worldTransform.rotation.x, this._root.worldTransform.rotation.y, this._root.worldTransform.rotation.z - 500 * dt)
        }

        if (this.curSkillElem && this.atkElaspe < this.curSkillElem.preTime) return

        switch (curBehivior) {
            case DragonBehaviorEff.None:
                // this.lookAt(this.target)
                this.onCircle()
                this.flyUpDown(dt)
                if (!this.isDamage) {
                    this.isDamage = true
                    this.useSkill()
                }
                break
            case DragonBehaviorEff.Impuse:
                {
                    this.onCircle()
                    if (!this.isWithdraw) {
                        this.isWithdraw = true
                        this.changeState(EMonsterBehaviorState.ImpulseBack)
                    } else {
                        if (!this.readyFight) {
                            this.readyFight = true
                            this.changeState(EMonsterBehaviorState.Impulse)
                        }
                    }
                }
                break
            case DragonBehaviorEff.Rotation:
                {
                    if (!this.isDamage) {
                        this.isDamage = true
                        this.useSkill()
                    }
                }
                break
            default:
                break
        }

        if (this.atkElaspe >= this.curSkillElem.duration) {
            this.lookAt(this.targetPos)
            this.resetAtkState(true)
            this.changeState(EMonsterBehaviorState.TargetPrepare)
            console.log("重置战斗状态")
        }
    }



    protected atkExit(): void {
        super.atkExit()
    }

    protected resetAtkState(normal: boolean = false) {
        super.resetAtkState()
        if (this.preReases.length <= 0 || this.curBehav != this.preReases[0]) {
            this.curBehav = -1
        } else {
            if (normal && this.curBehav == this.preReases[0]) {
                this.preReases.splice(0, 1)
                this.curBehav = -1
            }
            else {
                this.clearAllSkills()
            }
        }

        this.isWithdraw = false
        this.readyFight = false
        this.isCircle = false
        this.isDamage = false
        this.isPredict = false
        this.isCollision = false
        this.host.setCollision(mw.CollisionStatus.QueryOnly)
    }

    protected isMgs: boolean = false
    protected onDead(...data: any): void {
        super.onDead(data)
        this.firstIn = false
        this.resetAtkState()
        if (this._wingAudio) {
            SoundManager.stop3DSound(this._wingAudio)
            this._wingAudio = -1
        }

        Event.dispatchToAllClient(EventsName.ControlDragonEffList, this.deadEff, true)
        SoundManager.play3DSound('179625', this.host.worldTransform.position, 1, 8,
            { radius: 12000, falloffDistance: 3000 });
        //添加无敌buff
        // ModuleService.getModule(BuffModuleS).addABuff(this.host.guid, 9, EBuffHostType.GameObject, false)
        this.monsterStateCb.call(EMonserState.Hide)
        this.host.setCollision(mw.CollisionStatus.Off)
        this._dragonTransp?.setVisibility(mw.PropertyStatus.Off)
        this.enterPlayerID.forEach(e => {
            const p = Player.getPlayer(e)
            if (p && p.character) {
                this.enterTrigger.onLeave.broadcast(p.character)
                this.deletePlayer(e);
            }
        })
        this.enterTrigger.enabled = (false)

        //发奖励
        const taskMs = ModuleService.getModule(TaskModuleS)
        Player.getAllPlayers().forEach(player => {
            const pid = player.playerId
            const playerInfo = FightMgr.instance.getPlayerDamage(this.host.gameObjectId, pid)
            if (player && player.character && !this.isMgs) {
                this.isMgs = true
                if (this.isForce) {
                    if (this.curHp == this.maxHp) {
                        MGSMsgHome.uploadMGS('ts_game_result', '火龙飞走时若没有受到伤害打一个点', { record: 'nobodyhit_dragon' }, player)
                    }
                }
                else {
                    MGSMsgHome.uploadMGS('ts_game_result', '火龙被击杀打一个点', { record: 'kill_dragon' }, player)
                }
            }

            if (this.isForce) {
                Tips.showToClient(player, "火龙王似乎很无聊，缓缓飞走了...")
                if (playerInfo && playerInfo.damage >= 0) {
                    //摸鱼
                    ModuleService.getModule(ShopModuleS).addCoin(CoinType.PeaCoin, 5, pid, true)
                } else {
                    ModuleService.getModule(ShopModuleS).addCoin(CoinType.PeaCoin, 1, pid, true)
                    //安慰
                }

                if (taskMs.hasDragonTask(pid)) {
                    taskMs.net_refreshOnAPlayer(0, pid)
                    //接了任务未完成
                    MGSMsgHome.uploadMGS('ts_task', '玩家放弃对应任务，打一个点', { task_id: 'abandon_task6' }, player)
                }

            } else {
                Tips.showToClient(player, "众人齐心协力，击退了火龙王")
                if (playerInfo && playerInfo.damage >= 0) {
                    //前三
                    // if (playerInfo.leader >= 0 && playerInfo.leader <= 2) {
                    //     let num = 0
                    //     switch (playerInfo.leader) {
                    //         case 0:
                    //             num = 5
                    //             break;
                    //         case 1:
                    //             num = 3
                    //             break;
                    //         case 2:
                    //             num = 1
                    //             break;
                    //     }
                    //     ModuleService.getModule(BagModuleS).addItem(110010, num, false, false, player, true)
                    // } else {
                    ModuleService.getModule(ShopModuleS).addCoin(CoinType.PeaCoin, 30, pid, true)
                    // }
                }
                else {
                    //摸鱼
                    ModuleService.getModule(ShopModuleS).addCoin(CoinType.PeaCoin, 5, pid, true)
                }
                setTimeout(() => {
                    if (taskMs.hasDragonTask(pid)) {
                        taskMs.setBranchTaskStateFinish(1005, pid)
                    }
                }, 1000)
            }
        })
    }

    protected isDeadGuide: boolean = false
    num: number = 1
    protected deadUpdate(dt: number, eslapsed: number): void {
        super.deadUpdate(dt, eslapsed);
        if (eslapsed > 1) {
            if (!this.isDeadGuide) {
                this.isDeadGuide = true
                if (this.isForce) {
                    ModuleService.getModule(GuideMS).startGuide(24)
                } else {
                    ModuleService.getModule(GuideMS).startGuide(22)
                }
            }
            if (eslapsed > 5) {
                this.changeState(EMonsterBehaviorState.Sleep)
            }
        }
    }

    protected deadExit(): void {
        super.deadExit()
        this.isMgs = false
        this.isDeadGuide = false
        this.host.setVisibility(mw.PropertyStatus.Off)
        ModuleService.getModule(SkyModuleS).changeAllSky(5)
        Event.dispatchToAllClient(EventsName.ControlDragonEffList, this.flashEff.concat(this.deadEff).concat(this.bodyEff), false)

    }

    protected onForcast() {
        if (this.enterPlayerID.length <= 0 || !this.target) return
        if (this.curBehav < 0 || this.curBehav >= this.behavior.length) return
        if (!this.isPredict) {
            this.isPredict = true
            setTimeout(() => {
                SoundManager.play3DSound('179628', this.host.worldTransform.position, 1, 1,
                    { radius: 12000, falloffDistance: 3000 });
                this.enterPlayerID.forEach(e => {
                    const p = Player.getPlayer(e)
                    if (p && this.curSkillElem.predictDesc) {
                        Tips.showToClient(p, this.curSkillElem.predictDesc)
                    }
                })
                this.changeState(EMonsterBehaviorState.Attack)
            }, 1500);
        }
    }

    onCircle() {
        if (!this.isCircle) {
            this.isCircle = true
            const b = this.behavior[this.curBehav]
            if (b && b.skill) {
                let dir = this._head.worldTransform.getForwardVector().normalized
                let relsePos: Vector
                if (this.curSkillElem.effectType == ESkillEffectType.Bullet) {
                    this.targetPos.set(this.target.worldTransform.position.x, this.target.worldTransform.position.y, this.target.worldTransform.position.z - this.target.getBoundingBoxExtent().z / 2)
                    relsePos = this.targetPos.clone().subtract(dir.clone().multiply(this.curSkillElem.bulletFly * this.curSkillElem.bulletSpeed))
                } else {
                    relsePos = this._head.worldTransform.position
                }
                let duration = 1.5
                if (this.curSkillElem.effectType == ESkillEffectType.Envir) {
                    duration = 9
                }

                this.targetPos = relsePos
                ModuleService.getModule(MonsterSkillMS).PredictASkill(b.skill, duration, dir, relsePos, this.enterPlayerID)
                this.changeState(EMonsterBehaviorState.Attack)
                console.log("红圈判定", this.curBehav)
            } else {

            }
        }
    }

    protected onHpChange(hp: number, isForce: boolean) {
        super.onHpChange(hp, isForce)
        if (hp <= 0) {
            this.changeState(EMonsterBehaviorState.Dead)
        } else {
            this.useAoe()
        }
    }

    useSkill() {
        if (this.enterPlayerID.length <= 0 || !this.target) return
        if (this.curBehav < 0 || this.curBehav >= this.behavior.length) return
        const b = this.behavior[this.curBehav]
        if (b && b.skill) {
            this.lookAt(this.targetPos)
            this.firePoint.worldTransform.lookAt(this.targetPos)
            let dir = this._head.worldTransform.getForwardVector().normalized
            let relsePos: Vector
            if (this.curSkillElem.effectType == ESkillEffectType.Bullet) {
                this.targetPos.set(this.targetPos.x, this.targetPos.y, this.targetPos.z - this.target.getBoundingBoxExtent().z / 2)
                relsePos = this.targetPos.clone().subtract(dir.clone().multiply(this.curSkillElem.bulletFly * this.curSkillElem.bulletSpeed))
            } else {
                relsePos = this._head.worldTransform.position
            }
            ModuleService.getModule(MonsterSkillMS).useSkill(b.skill, this.host.gameObjectId, dir, relsePos, this.enterPlayerID)
            console.log("龙释放单体技能1", this.curBehav)
        } else {

        }
    }


    protected useAoe() {
        //无法中断当前技能
        const delta = (this.curHp / this.maxHp) * 100
        for (let i = this.aoeSkills.length - 1; i >= 0; i--) {
            let rel = this.aoeSkills[i].initCount - this.aoeSkills[i].count
            if (rel > 0) {
                const index = this.aoeSkills[i].behaviorIndex
                if (index == -1) continue
                const b = this.behavior[index]
                if (b.option && b.value && b.value.length > 0) {
                    for (let j = b.value.length - 1; j >= 0; j--) {
                        const tmpVal = b.value[j]
                        if (this.aoeSkills[i].behaviorIndex == 3 && delta <= tmpVal) {
                            this.aoeSkills[i].count = this.aoeSkills[i].count + 1
                            this.preReases.push(index)
                        } else if (this.aoeSkills[i].behaviorIndex == 1) {
                            if (j > b.value.length - 1 - this.aoeSkills[i].count) continue
                            if (delta >= tmpVal - 20 && delta <= tmpVal) {
                                this.aoeSkills[i].count = this.aoeSkills[i].count + 1
                                this.preReases.push(index)
                            }
                        }
                    }
                }
            }
        }
    }


    protected onRebornEnter = (go: mw.GameObject) => {
        if (PlayerManagerExtesion.isCharacter(go) && go.player) {
            let char = go.player.character;
            const playerId = go.player.playerId
            if (playerId == this.curTagetPid || char && this.target && this.target.gameObjectId == char.gameObjectId) {
                this.resetAtkState()
                this.changeState(EMonsterBehaviorState.TargetPrepare)
            }
            const uid = go.player.userId
            const p = PlayerMgr.Inst.getPlayer(uid)
            if (p) {
                p.setAtt(Attribute.EAttType.defense, 999999998888)
                // ModuleService.getModule(BuffModuleS).addABuff(uid, 11, EBuffHostType.Player, false)
            }
        }
    };

    protected onRebornLeave = (go: mw.GameObject) => {
        if (PlayerManagerExtesion.isCharacter(go) && go.player) {
            let playerId = go.player.playerId;
            const uid = go.player.userId
            const p = PlayerMgr.Inst.getPlayer(uid)
            if (p) {
                p.setAtt(Attribute.EAttType.defense, 0)
                ModuleService.getModule(BuffModuleS).reduceABuff(uid, 11, EBuffHostType.Player)
                if (this.enterTrigger.checkInArea(go.player.character)) {
                    this.addPlayer(playerId)
                }
            }
        };
    }

}