import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
import { GameConfig } from "../../../config/GameConfig";
import { MonsterBase } from "../../../ts3/monster/behavior/MonsterBase";
import { EMonserState, EMonsterBehaviorState } from "../../../ts3/monster/MonsterDefine";
import Tips from "../../../ui/commonUI/Tips";
import GameUtils from "../../../utils/GameUtils";
import { Attribute } from "../attibute/Attribute";
import FightMgr from "../FightMgr";
import { ESkillEffectType } from "../monsterSkill/MonsterSkillBase";
import MonsterSkillMS from "../monsterSkill/MonsterSkillMS";

//外星战斗机
export default class SpaceFlight extends MonsterBase {
    atkFrq: number = 0;
    flashPos: mw.Vector = Vector.zero;
    public async init(obj: mw.GameObject, cfg: number, monsterStateCb: Action1<EMonserState>): Promise<void> {
        await super.init(obj, cfg, monsterStateCb)
        this.initTrigger()
        Player.onPlayerJoin.add((p) => {
            const player = p
            setTimeout(() => {
                if (this.getCurState() == EMonsterBehaviorState.Idle) {
                } else if (this.getCurState() == EMonsterBehaviorState.Show) {
                }
            }, 2000);
        })

        const trr = FightMgr.instance.getMAttibuteList(this.config.Guid)
        this.atkFrq = trr.getValue(Attribute.EAttType.atkFreq)
        this.changeState(EMonsterBehaviorState.Show)

        if (this.config.Behavior.length > 0 && SystemUtil.isServer()) {
            this.curBehav = 0
            this.curBehavElem = this.behavior[this.curBehav]
            this.curSkillElem = GameConfig.MonsterSkill.getElement(this.curBehavElem.skill)
        }
    }
    protected onShow(...data: any) {
        super.onShow(data)
        //封印状态
        this.host.worldTransform.position = this.bornPos
        setTimeout(() => {
            if (this.getCurState() == EMonsterBehaviorState.Show)
                this.changeState(EMonsterBehaviorState.Partrol)
        }, 3000);
    }



    protected onIdle(...data: any): void {
        //亮血条状态
        super.onIdle(data)
        this.monsterStateCb.call(EMonserState.Visable)
    }

    protected idleUpdate(dt: number, eslapsed: number): void {
        super.idleUpdate(dt, eslapsed)
        this.baseUpdate(dt, eslapsed)
    }

    protected idleExit(): void {
        super.idleExit()
    }


    protected onPartrol(...data: any) {
        super.onPartrol(data)
        this.host.worldTransform.rotation = Rotation.zero
        // this.host.worldTransform.position = this.config.Position[0]
        if (this.config.zombiemove)
            this.playAction(this.config.zombiemove)
        this.moveTo()
    }



    protected pathIndex = -1
    protected moveFlag = true;
    moveTo() {
        if (!this.config.Position) return
        if (this.getCurState() != EMonsterBehaviorState.Partrol) return
        if (this.moveFlag) {
            if (this.pathIndex < this.config.Position.length - 1 && this.config.Position.length >= 1) {
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
        this.targetPos = this.config.Position[this.pathIndex]
        this.lookAt(this.targetPos)
        // this.host.lookAt(this.config.Position[this.pathIndex])
    }
    private tmpVec: Vector = Vector.zero

    protected partrolUpdate(dt: number, eslapsed: number): void {
        if (eslapsed <= 0.2) return
        super.partrolUpdate(dt, eslapsed)
        if (Vector.squaredDistance(this.host.worldTransform.position, this.targetPos) <= this.config.PathRadius * this.config.PathRadius) {
            this.moveTo()
        } else {
            if (!this.targetPos.equals(Vector.zero))
                this.host.worldTransform.position = Vector.lerp(this.host.worldTransform.position, this.targetPos, 0.5 * dt)
        }
    }

    protected partrolExit(): void {
        super.partrolExit()
    }

    protected onDead(...data: any) {
        super.onDead(data)
        this.host.setCollision(mw.CollisionStatus.Off)
        this.host.setVisibility(mw.PropertyStatus.Off, false)
    }
    protected deadUpdate(dt: number, eslapsed: number) {
        super.deadUpdate(dt, eslapsed)
        if (eslapsed > 1)
            this.changeState(EMonsterBehaviorState.Sleep)
    }
    protected deadExit() {
        super.deadExit()
    }

    public update(dt: number): void {
        super.update(dt)
        // if (this.host.guid == '299F76E6')
        //     console.log("ufo的状态", this.host?.name, this.getCurState())
    }

    private lookAt(targetPos: Vector) {
        // if (targetPos.z >= this.host.worldTransform.position.z)
        //     return
        this.host.worldTransform.rotation = targetPos.clone().subtract(this.host.worldTransform.position).normalized.toRotation()
        // this.host.localTransform.lookAt(targetPos)
    }

    changeTargetTimer = null

    protected onTarget(...data: any): void {
        super.onTarget(data)
        this.findTargetInTri()
        if (this.curTagetPid > 0 && this.curTagetPid != this.lastTargetPid) {
            this.lastTargetPid = this.curTagetPid
            if (!this.changeTargetTimer) {
                this.changeTargetTimer = setTimeout(() => {
                    this.lastTargetPid = -1
                    this.changeTargetTimer = null
                }, 8000);
            }
            if (Player.getPlayer(this.curTagetPid) && this.enterTrigger.checkInArea(this.target))
                Tips.showToClient(Player.getPlayer(this.curTagetPid), GameUtils.getTxt("Tips_1020"))
        }
    }

    protected targetUpdate(dt: number, eslapsed: number): void {
        this.baseUpdate(dt, eslapsed)
        if (!this.target) {
            this.curTagetPid = -1
            this.findTargetInTri()
            return
        }
        super.targetUpdate(dt, eslapsed)
        this.lookAt(this.target.worldTransform.position)
        this.targetPos.set(this.target.worldTransform.position)
        this.flyUpDown(dt)
        if (Vector.squaredDistance(this.host.worldTransform.position, this.targetPos) <= this.curSkillElem.scope * this.curSkillElem.scope) {
            this.onForcast()
        } else {
            if (eslapsed > 30) {
                //重新选择目标
                this.curTagetPid = -1
                this.findTargetInTri()
            } else {
                if ((!this.targetPos.equals(Vector.zero))) {
                    this.host.worldTransform.position = Vector.lerp(this.host.worldTransform.position, this.targetPos, 0.5 * dt)
                } else {
                    this.curTagetPid = -1
                    this.findTargetInTri()
                }
            }
        }
    }
    protected targetExit(): void {
        super.targetExit()

    }

    private _flag: boolean = true
    /**上下浮动 */
    private flyUpDown(dt: number) {
        if (!this.host.getVisibility()) { return }
        this.tmpVec.set(this.host.worldTransform.position)
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
        this.host.worldTransform.position = this.tmpVec
    }

    protected onForcast() {
        if (this.enterPlayerID.length <= 0 || !this.target) return
        this.changeState(EMonsterBehaviorState.Attack)
    }

    protected onAtk(...data: any): void {
        super.onAtk(data)
        if (this.config.atkStance)
            this.playAction(this.config.atkStance)
    }

    protected isDamage: boolean = false
    protected atkUpdate(dt: number, eslapsed: number): void {
        if (!this.curSkillElem || this.curBehav < 0 || this.curBehav >= this.behavior.length || !this.target)
            return

        const len = Vector.squaredDistance(this.host.worldTransform.position, this.tmpVec.set(this.target.worldTransform.position.x,
            this.target.worldTransform.position.y, this.host.worldTransform.position.z))
        if (len >= this.curSkillElem.scope * this.curSkillElem.scope && this.curHp > 0) {
            if (this.enterPlayerID.length > 0) {
                this.changeState(EMonsterBehaviorState.Target)
            } else {
                this.changeState(EMonsterBehaviorState.Partrol)
            }
            return
        } else if (this.curHp <= 0) {
            this.changeState(EMonsterBehaviorState.Sleep)
        }
        super.atkUpdate(dt, eslapsed)
        this.atkElaspe += dt
        if (this.curSkillElem && this.atkElaspe < this.curSkillElem.preTime) return
        if (this.atkElaspe >= this.atkFrq) {
            this.atkElaspe = 0
            this.curBehav = 0
            // console.log("重置战斗状态")
        }
        if (!this.isDamage) {
            this.isDamage = true
            this.useSkill()
            setTimeout(() => {
                if (this.curHp > 0) {
                    this.flashPos = GameUtils.randomCirclePos(this.tmpVec.set(this.host.worldTransform.position),
                        2500, true)
                    this.host.worldTransform.position = this.flashPos
                    this.resetAtkState()
                    if (this.enterPlayerID.length > 0) {
                        this.changeState(EMonsterBehaviorState.Target)
                    } else {
                        this.changeState(EMonsterBehaviorState.Partrol)
                    }
                }
                this.isDamage = false
            }, 3000);
        }
    }
    protected atkExit(): void {
        super.atkExit()

    }

    useSkill() {
        if (!this.target) return
        if (this.curBehav < 0 || this.curBehav >= this.behavior.length) return
        const b = this.behavior[this.curBehav]
        if (b) {
            if (b.skill) {
                let dir = this.host.worldTransform.getForwardVector().normalized
                let relsePos: Vector
                this.targetPos.set(this.target.worldTransform.position)
                if (this.curSkillElem.effectType == ESkillEffectType.Bullet) {
                    this.targetPos.set(this.targetPos.x, this.targetPos.y, this.targetPos.z - this.target.getBoundingBoxExtent().z / 2)
                    relsePos = this.targetPos.clone().subtract(dir.clone().multiply(this.curSkillElem.bulletFly * this.curSkillElem.bulletSpeed))
                } else {
                    relsePos = this.host.worldTransform.position
                }
                ModuleService.getModule(MonsterSkillMS).useSkill(b.skill, this.host.gameObjectId, dir, relsePos, this.enterPlayerID)
            }
            if (b.action) {
                this.playAction(b.action)
            }
            // console.log("ufo技能1", this.curBehav)
        }
    }

    protected baseUpdate(dt: number, eslapsed: number) {
        super.lifeUpdate(dt)
        if (this.getCurState() != EMonsterBehaviorState.Sleep
            && this.getCurState() != EMonsterBehaviorState.Attack) {
            if (Math.abs(this.traVec.x - this.host.worldTransform.position.x) <= 50 ||
                Math.abs(this.traVec.y - this.host.worldTransform.position.y) <= 50 ||
                Math.abs(this.traVec.z - this.host.worldTransform.position.z) <= 200) {
                this.trapTime += dt
            } else {
                this.traVec.set(this.host.worldTransform.position)
                this.trapTime = 0
            }

            if (this.getCurState() == EMonsterBehaviorState.Target &&
                this.trapTime >= 50) {
                this.resetAtkState()
                if (this.enterPlayerID.length > 0) {
                    this.findTargetInTri()
                } else {
                    this.changeState(EMonsterBehaviorState.Partrol)
                }
                this.trapTime = 0
            }

        }

        if (this.curTagetPid > 0 && PlayerManagerExtesion.isCharacter(this.target) && this.target.player == null) {
            this.deletePlayer(this.curTagetPid)
            this.resetAtkState()
            if (this.enterPlayerID.length > 0) {
                this.findTargetInTri()
            } else {
                this.changeState(EMonsterBehaviorState.Partrol)
            }
        }

        // if (this.host.worldTransform.position.z < -500) {
        //     this.resetPos(this.bornPos)
        // }
    }


    protected resetAtkState(): void {
        super.resetAtkState()
        this.isDamage = false
        // this.pathIndex = 0
    }
}