import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
import { GameConfig } from "../../../config/GameConfig";
import { IMonsterSkillElement } from "../../../config/MonsterSkill";
import { EffectManager, SoundManager } from "../../../ExtensionType";
import Move from "../../../SceneScript/Move";
import Assist from "../../../ts3/assist/Assist";
import Monster from "../../../ts3/monster/Monster";
import TsPlayer from "../../../ts3/player/TsPlayer";
import { TS3 } from "../../../ts3/TS3";
import { BuffModuleS } from "../../buff/BuffModuleS";
import { EBuffBenefitType, EBuffHostType } from "../../buff/comon/BuffCommon";
import { RunTimePool } from "../../skill/runtime/RunTimePool";
import FightMgr from "../FightMgr";
import MonsterSkillMC from "./MonsterSkillMC";
import MonsterSkillMS from "./MonsterSkillMS";

export enum ESkillEffectType {
    None,
    Aoe,//范围技能
    Bullet,//子弹
    Envir,//场景
    Move,//位移技能
}

export enum ESkillAoeShape {
    Box,
    Sphere,
    Fan
}

export enum ETranslocationTarget {
    None,
    Enemy,
    Self
}

export const ErrorCircleRange: mw.Vector2 = new mw.Vector2(400, 400)
export const CircleRotation = new mw.Rotation(0, 90, 0)
export const CircleDuation = 1.5

export class MonsterSkillBase {
    /**动态唯一id */
    protected _configId: number;
    public get configId() { return this._configId }
    public _config: IMonsterSkillElement
    /**施法者 */
    protected _host: mw.GameObject

    /**定时器列表 */
    protected _timerList: number[] = []
    /**开始激活起作用 */
    public active: boolean = false;
    /**是否已经开始 */
    public isStart: boolean = false
    /**进CD */
    public isInCd: boolean = false
    //音效列表
    protected audioList: number[] = []
    //特效列表
    protected effList: number[] = []

    /**已经过去的时间*/
    protected _elspeTime: number = 0;
    public get ElspeTime() {
        return this._elspeTime
    }

    /**宿主是谁，技能谁在使用 */
    protected _hostID: string;
    public get HostID() {
        return this._hostID;
    }
    protected isMonster: boolean = true
    /**攻击方向 */
    protected _atkVec: mw.Vector = null

    protected boxSize: Vector = Vector.zero

    constructor(skillId: number) {
        this._config = GameConfig.MonsterSkill.getElement(skillId)
        this._configId = skillId
    }

    protected noDamage: boolean = false
    protected cubeList: mw.GameObject[] = []
    protected releaseEffPos: Vector
    protected actors: any[] = []
    /**
     * 
     * @param host 
     * @param atkVec 
     * @param noDamage 服务器计算伤害 客户端检测表现 双端怪物特效音效默认客户端全服同步 技能检测只能客户端
     * 
     */
    public start(host: mw.GameObject, atkVec: Vector, releaseEffPos: Vector, noDamage: boolean = false) {
        if (!this.active) {
            this.active = true
            this._host = host
            this._hostID = host.gameObjectId
            if (atkVec.x == 0 && atkVec.y == 0 && atkVec.z == 0) {
                this._atkVec = this._host.worldTransform.getForwardVector().normalized.clone()
            } else {
                this._atkVec = atkVec.normalized
            }
            this.releaseEffPos = releaseEffPos
            this.noDamage = noDamage
            if (this._config.effectType != ESkillEffectType.Envir) {
                if (this.releaseEffPos.x != 0 && this.releaseEffPos.y != 0 && this.releaseEffPos.z != 0) {
                    this.inspecterPos = this.releaseEffPos
                } else {
                    this.inspecterPos = this._host.worldTransform.position.clone()
                }
            } else {
                this.inspecterPos = new Vector(this._config.envirRelesePos)
            }

            if (SystemUtil.isClient()) {
                this.boxSize = Player.localPlayer.character.getBoundingBoxExtent()
                this.cubeList = ModuleService.getModule(MonsterSkillMC).getCubes()
            } else {
                if (Player.getAllPlayers().length <= 0) {
                    this.onDestroy()
                    return
                }
                this.boxSize = Player.getAllPlayers()[0].character.getBoundingBoxExtent()
                this.cubeList = ModuleService.getModule(MonsterSkillMS).getCubes()
            }
        }
    }


    /**不能放技能 */
    public onEnable() {
        if (!this._host) {
            return false
        }
        return true
    }

    public onDestroy() {
        this.revertState()
    }


    public revertState() {
        //停止计时器
        if (this._timerList && this._timerList.length > 0) {
            this._timerList.forEach((timer, index) => {
                clearInterval(timer)
                timer = null
            })
        }
        this._timerList.length = 0

        //停止特效
        if (this.effList && this.effList.length > 0) {
            this.effList.forEach((eff, index) => {
                EffectService.stop(eff)
                eff = null
            })
        }
        this.effList.length = 0

        //停止3d音效
        if (this.audioList && this.audioList.length > 0) {
            this.audioList.forEach((audio, index) => {
                SoundManager.stop3DSound(audio)
                audio = null
            })
        }
        this.audioList.length = 0

        // //停止2d音效
        // if (Number(this._config.release_sound)) {
        //     SoundManager.stopSound(this._config.release_sound)
        // }
        // if (Number(this._config.hitSoundGuid)) {
        //     SoundManager.stopSound(this._config.hitSoundGuid)
        // }
        this.isInCd = false
        this.isStart = false
        this.active = false;
        this.noDamage = false
        this._atkVec = Vector.zero
        this._elspeTime = 0;
        this._host = null
        this._hostID = "-1"
    }
    public onInit() {
    }

    public onInvoke(): void {
        this.onDestroy()
    }

    public playReleaseEffSound() {
        if (this.noDamage) { return }
        if (this._config.release_sound && this._config.release_sound != null) {
            let pos
            if (this._config.effectType != ESkillEffectType.Envir) {
                pos = this._host.worldTransform.position
            } else {
                pos = new Vector(this._config.envirRelesePos)
            }
            const audioId = mw.SoundService.play3DSound(this._config.release_sound, pos,
                this._config.releaseSoundCount, this._config.releaseSoundVolume,
                { radius: 0, falloffDistance: 500 });
            this.audioList.push(audioId)
        }
        if (this._config.release_effect) {

            let tmoVec: Vector
            if (this.releaseEffPos.x == 0 && this.releaseEffPos.y == 0 && this.releaseEffPos.z == 0) {
                tmoVec = new Vector(this.inspecterPos.x, this.inspecterPos.y
                    , this.inspecterPos.z)
            } else {
                tmoVec = new Vector(this.releaseEffPos.x, this.releaseEffPos.y
                    , this.releaseEffPos.z)
            }
            let rot: Rotation = Rotation.zero
            if (this.isMonster) {
                rot = this._host.worldTransform.rotation// new Rotation(this._atkVec.x, this._atkVec.y, this._atkVec.z)
            } else {
                rot = this._host.worldTransform.transformDirection(this._atkVec).toRotation()
            }

            const effElem = GameConfig.Effect.getElement(this._config.release_effect)

            const effId = GeneralManager.rpcPlayEffectAtLocation(effElem.EffectID,
                tmoVec, 1,
                rot,
                new Vector(effElem.EffectLarge))
            this.effList.push(effId)
        }

    }

    public onStart() {
        if (!this.onEnable()) {
            return false
        }
        const res = TS3.monsterMgr.getMonster(this._hostID)
        if (res) {
            this.isMonster = true
        } else {
            this.isMonster = false
        }
        return true
    }


    /**生命周期更新 */
    public update(dt: number) {
        if (this.active) {
            this._elspeTime += dt
            //技能开始了
            if (!this.onStart()) {
                this.onDestroy()
            }
            else {
                if (!this.isInCd) {
                    if (this._elspeTime >= this._config.duration - this._config.preTime) {
                        //进入cd
                        this._elspeTime = 0;
                        this.isInCd = true
                        // console.log("进入cd", this._elspeTime, this._configId)
                    } else if (!this.isStart) {
                        this.playHitEffAudion()
                        this.playReleaseEffSound()
                        this.onDamage()
                        this.isStart = true
                    }
                } else {
                    if (this._elspeTime >= this._config.cd) {
                        //技能好了
                        this.onDestroy()
                        // console.log("技能好了", this._elspeTime, this._configId)
                    }
                }
            }
        }
    }

    /**                        AOE                  */
    /**aoe技能检测中心点 */
    protected inspecterPos: Vector = Vector.zero
    public playHitEffAudion() {
        if (!this.noDamage && this._config.hitEffectGuid) {
            const effElem = GameConfig.Effect.getElement(this._config.hitEffectGuid)
            const effId = GeneralManager.rpcPlayEffectAtLocation(effElem.EffectID,
                new Vector(this.inspecterPos.x + effElem.EffectLocation.x, this.inspecterPos.y + effElem.EffectLocation.y,
                    this.inspecterPos.z + effElem.EffectLocation.z + this.boxSize.z / 2), effElem.EffectTime,
                new Rotation(effElem.EffectRotate),
                new Vector(effElem.EffectLarge))
            this.effList.push(effId)
        }

        if ((!this.noDamage || this._config.effectType == ESkillEffectType.Envir) && this._config.hitSoundGuid && this._config.hitSoundVolume) {
            const audioId = mw.SoundService.play3DSound(this._config.hitSoundGuid,
                this.inspecterPos, 1, this._config.hitSoundVolume,
                { radius: 0, falloffDistance: 500 });
            this.audioList.push(audioId)
        }

        if (this.cubeList && this.cubeList.length > 0) {
            this.cubeList[4].worldTransform.position = new Vector(this.inspecterPos.x, this.inspecterPos.y
                , this.inspecterPos.z)
        }
    }

    onDamage() {
        let hurtActors = this.getAreaActor([this._config.radius, this._config.hurt_angle, this._config.hurtOffset, this._config.rectangleValue])
        if (hurtActors.length > 0) {
            hurtActors?.forEach(e => {
                let damage: number = 0
                if (e instanceof Monster) {
                    if (SystemUtil.isClient()) {
                        if (this._config.damage && this._config.damage.length == 2) {
                            //计算怪物伤害
                            damage = MathUtil.randomInt(this._config.damage[0], this._config.damage[1])
                        }
                        // let damageData = FightMgr.instance.calculateSDamage(this._hostID, damage)
                        // if (damageData)//精灵伤害
                        // {
                        //     damage = damageData.data
                        //     TS3.monsterMgr.onDamage(e.mid, damage, damageData.crit)
                        // }
                        // else {
                        //玩家伤害
                        let damageData = FightMgr.instance.calculatePDamage()
                        TS3.monsterMgr.onDamage(e.mid, damageData.data, damageData.crit)
                        // }
                    } else {

                    }

                } else if (e instanceof TsPlayer) {
                    if (SystemUtil.isClient()) {
                        if (this._config.damage && this._config.damage.length == 2) {
                            //计算怪物伤害
                            damage = FightMgr.instance.calculateMDamage(this._hostID)
                            // damage = MathUtil.randomInt(this._config.damage[0], this._config.damage[1])
                            TS3.playerMgr.onDamage(damage, 2, false, e.userId)
                            // console.log("计算怪物伤害")
                        }
                    } else {
                        if (this._config.buff && this._config.buff.length > 0) {
                            for (const buffId of this._config.buff) {
                                const buffElem = GameConfig.Buff.getElement(buffId)
                                let canRelease: boolean = true
                                if (buffElem.buffEffectType == EBuffBenefitType.Stun) {
                                    const uncontrolList = ModuleService.getModule(BuffModuleS).getBuffListByConfig(e.userId, 10)
                                    canRelease = !(uncontrolList && uncontrolList.length > 0)
                                }
                                if (canRelease)
                                    ModuleService.getModule(BuffModuleS).addABuff(this._host.gameObjectId, e.userId, buffId, EBuffHostType.Player, true)
                            }
                        }
                        if (this._config.displacement || this._config.displacementStarget) {
                            oTrace("加冲量", this._config.displacementStarget)
                            if (this._config.displacementStarget == ETranslocationTarget.Enemy) {
                                setTimeout(() => {
                                    this.addImpulse(e.character)
                                }, 100);
                            }
                        }

                        if (this._config.damage && this._config.damage.length == 2) {
                            //计算怪物伤害
                            damage = FightMgr.instance.calculateMDamage(this._hostID)
                            // damage = MathUtil.randomInt(this._config.damage[0], this._config.damage[1])
                            TS3.playerMgr.onDamage(damage, 2, false, e.userId)
                        }
                    }
                } else if (e instanceof Assist) {
                    if (SystemUtil.isClient()) {
                    } else {
                        if (this._config.damage && this._config.damage.length == 2) {
                            //计算怪物伤害
                            damage = FightMgr.instance.calculateMDamage(this._hostID)
                            // damage = MathUtil.randomInt(this._config.damage[0], this._config.damage[1])
                            TS3.assistMgr.onDamage(e.mid, damage, false)
                        }
                    }
                }
            })
        }
    }

    /**
       * 获取一个技能对象范围内的技能对象
       * @param pid ID
       * @param filterId 过滤掉的ID
       * @param r 范围半径
       * @returns 
       */
    public getAreaActor(shapeParams: any) {
        let ret = null
        switch (this._config.shape) {
            case ESkillAoeShape.Fan:
                ret = this.cylinderFilter(shapeParams).fanFilter(shapeParams).actors
                break
            case ESkillAoeShape.Sphere:
                ret = this.cylinderFilter(shapeParams).actors
                break
            case ESkillAoeShape.Box:
                ret = this.boxFiter(shapeParams).actors
                break
        }
        return ret
    }

    //圆柱检测
    public cylinderFilter(shapeParams: any) {
        let allActors = []
        if (this.isMonster) {
            allActors = TS3.playerMgr.getRangePlayer(shapeParams[0], "0", this.inspecterPos)
            allActors = allActors.concat(TS3.assistMgr.getRangeAssists(shapeParams[0], this.inspecterPos))
        } else {
            allActors = TS3.monsterMgr.getRangeMonster(shapeParams[0], this.inspecterPos)
        }

        let res = QueryUtil.capsuleOverlap(this.inspecterPos, shapeParams[0], shapeParams[3][1], false)
        let vec = []
        for (const it of res) {
            for (const actor of allActors) {
                let test
                if (!actor) continue
                if (this.isMonster) {
                    if (actor instanceof Assist) {
                        test = actor.gameObject
                    } else if (actor instanceof TsPlayer) {
                        test = actor.character
                    }
                } else {
                    test = actor.gameObject
                }
                if (test.gameObjectId == this._host.gameObjectId) {
                    continue;
                }
                if (test.gameObjectId == it.gameObjectId || test.gameObjectId == it.tag) {
                    vec.push(actor)
                } else if (test.getChildren().length > 0) {
                    let res = test.getChildren().find(e => e.gameObjectId == it.gameObjectId || test.gameObjectId == it.tag)
                    if (res) {
                        vec.push(actor)
                    }
                }
            }

        }
        this.actors = vec
        return this
    }

    //扇形过滤
    public fanFilter(shapeParams: any) {
        oTrace("扇形过滤", JSON.stringify((this._atkVec)))

        let tmpInspect = this.inspecterPos.clone().add(this._atkVec.clone().multiply(shapeParams[2]))
        this.actors = this.actors.filter(
            actor => {
                if (!actor) return false
                let actorPos
                if (this.isMonster) {
                    actorPos = actor.character.worldTransform.position
                } else {
                    actorPos = actor.pos
                }
                const cos = Math.cos(shapeParams[1] * (Math.PI / 180));
                const targetVec = actorPos.subtract(tmpInspect).normalized;
                const cosTarget = mw.Vector.dot(this._atkVec, targetVec);

                //站在旁边的敌人也要打中
                let distance = mw.Vector.distance(this.inspecterPos, tmpInspect)
                let tan = Math.tan(cosTarget)
                let res = tan / distance
                let offet = mw.Vector.distance(actorPos, this.inspecterPos)
                if (cosTarget >= cos) {
                    return true
                }
                else if (offet <= res) {
                    return true
                }
            }
        );

        return this
    }

    //this._config.radius, this._config.hurt_angle, this._config.hurtOffset, this._config.RectangleValue
    //矩形过滤 半径 角度 中心偏移 长宽 
    public boxFiter(shapeParams: any) {
        //矩形长，矩形宽度/2
        let allActors = []
        if (this.isMonster) {
            allActors = TS3.playerMgr.getRangePlayer(shapeParams[0], "0", this.inspecterPos)
            allActors = allActors.concat(TS3.assistMgr.getRangeAssists(shapeParams[0], this.inspecterPos))
        } else {
            allActors = TS3.monsterMgr.getRangeMonster(shapeParams[0], this.inspecterPos)
        }


        let res = GeneralManager.modiftboxOverlap(this.inspecterPos,
            this.inspecterPos.clone().add(this._atkVec.clone().multiply(shapeParams[0])),
            shapeParams[3][0], shapeParams[3][1], true)

        let vec = []

        for (const it of res) {
            for (const actor of allActors) {
                if (!actor) continue
                let test
                if (this.isMonster) {
                    if (actor instanceof Assist) {
                        test = actor.gameObject
                    } else if (actor instanceof TsPlayer) {
                        test = actor.character
                    }
                } else {
                    test = actor.gameObject
                }

                if (test.gameObjectId == this._host.gameObjectId) {
                    continue;
                }

                if (test.gameObjectId == it.gameObjectId || test.gameObjectId == it.tag) {
                    vec.push(actor)
                } else if (test.getChildren().length > 0) {
                    let res = test.getChildren().find(e => e.gameObjectId == it.gameObjectId || test.gameObjectId == it.tag)
                    if (res) {
                        vec.push(actor)
                    }
                }
            }

        }
        this.actors = vec

        return this;
    }

    //默认冲量
    private _impulse: number = 150
    //下落速率乘值
    private _mulVal: number = 250
    public addImpulse(man: mw.GameObject) {
        if (SystemUtil.isClient()) return
        if (PlayerManagerExtesion.isCharacter(man)) {
            let dir = this._atkVec.normalized
            // let vec = Quaternion.rotateX(Quaternion.fromRotation(delta.toRotation()), this._config.displacement[1]).toRotation()
            //bullet_RotateVector(delta, mw.Vector.right, this._config.displacement[1])
            if (this._config.displacement[0] == 2) {
                //击飞
                dir.set(dir.x, dir.y, dir.z + 22)//22
            } else {
                //击退
                dir.set(dir.x, dir.y, dir.z + 2)
            }
            // man.maxFallingSpeed = defaultVel * this._mulVal
            man.addImpulse(dir.multiply(this._impulse), true)
        }
    }
}

export class AoeMonsterSkill extends MonsterSkillBase {
}


/**
 * 子弹怪物技能 
 */
export class BulletMonsterSkill extends MonsterSkillBase {

    /**模拟计算子弹飞行位移,算出子弹特效释放最终位置 */
    public onInit() {
        super.onInit()
        const elem = GameConfig.Effect.getElement(this._config.release_effect)
    }

    isPlayReleaseeFF: boolean = false

    public update(dt: number) {
        //激活技能
        if (this.active) {
            this._elspeTime += dt
            //技能开始了
            if (!this.onStart()) {
                this.onDestroy()
            } else {
                if (this.isStart) {
                    if (!this.isInCd) {
                        if (this._elspeTime >= this._config.duration) {
                            //进入cd
                            this._elspeTime = 0;
                            this.isInCd = true
                        }
                    } else {
                        if (this._elspeTime >= this._config.cd) {
                            //技能好了
                            this.onDestroy()
                        }
                    }
                } else {
                    if (this._elspeTime >= this._config.bulletFly && !this.isPlayReleaseeFF) {
                        this.isPlayReleaseeFF = true
                        this.playReleaseEffSound()
                    }
                    if (this._elspeTime >= this._config.onHitDelay) {
                        //技能前摇
                        this.playHitEffAudion()
                        this.onDamage()
                        this.isStart = true
                    }
                }
            }
        }
    }

    public revertState(): void {
        super.revertState()
        this.isPlayReleaseeFF = false
    }
}

export class EnvironMentSkill extends MonsterSkillBase {

    protected mover: Move = null
    protected releaseEffITem: mw.Effect = null
    protected moverInitPos: Vector
    public onInit() {
        super.onInit()
        if (SystemUtil.isServer() || !this._config.envirEffItem || !this._config.envirEffItem) {
            return
        }
        this.releaseEffITem = ModuleService.getModule(MonsterSkillMC).getEnvirSkill(this._config.envirEffItem)
        this.moverInitPos = this.releaseEffITem.worldTransform.position.clone()
        this.mover = this.releaseEffITem.getScriptByName('Move') as Move
    }

    public playReleaseEffSound(): void {
        if (SystemUtil.isServer())
            return
        if (this._config.release_sound && this._config.release_sound != null) {
            const audioId = mw.SoundService.play3DSound(this._config.release_sound, this._host.worldTransform.position, 1, 1,
                { radius: 0, falloffDistance: 500 });
            this.audioList.push(audioId)
        }
        if (this.releaseEffITem) {
            this.mover.tween.start()
            this.releaseEffITem.setVisibility(mw.PropertyStatus.On, true)
        }
    }

    public onDestroy(): void {
        super.onDestroy()
        if (SystemUtil.isClient()) {
            this.mover.tween.stop()
            this.releaseEffITem.setVisibility(mw.PropertyStatus.Off, true)
        }
    }

    public update(dt: number) {
        //激活技能
        if (this.active) {
            this._elspeTime += dt

            if (!this.onStart()) {
                this.onDestroy()
            } else {
                if (!this.isInCd) {
                    if (this._elspeTime >= this._config.duration - this._config.preTime) {
                        //进入cd
                        this._elspeTime = 0;
                        this.isInCd = true
                        if (SystemUtil.isClient()) {
                            this.mover.tween.stop()
                            this.releaseEffITem.setVisibility(mw.PropertyStatus.Off, true)
                        }
                    } else if (!this.isStart && this._elspeTime >= this._config.onHitDelay) {
                        this.playReleaseEffSound()
                        this.playHitEffAudion()
                        this.onDamage()
                        this.isStart = true
                    }

                } else {
                    if (this._elspeTime >= this._config.cd) {
                        this.onDestroy()
                    }
                }
            }
        }
    }
}

