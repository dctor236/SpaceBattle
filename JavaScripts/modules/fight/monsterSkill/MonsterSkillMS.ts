import { SpawnManager, SpawnInfo, } from '../../../Modified027Editor/ModifiedSpawn';


import { GameConfig } from "../../../config/GameConfig"
import { EventsName } from "../../../const/GameEnum"
import { MonsterMgr } from "../../../ts3/monster/MonsterMgr"
import { updater } from "../utils/Updater"
import { MonsterSkillBase, ESkillEffectType, BulletMonsterSkill, EnvironMentSkill, AoeMonsterSkill } from "./MonsterSkillBase"
import MonsterSkillMC from "./MonsterSkillMC"


export default class MonsterSkillMS extends ModuleS<MonsterSkillMC, null> {
    private _skillPool: Map<number, MonsterSkillBase[]> = new Map()
    private initNum: number = 1
    cube: mw.GameObject[] = []
    //随机一个技能释放，不能释放 返回一个最远攻击范围的技能id
    onAwake() {
        super.onAwake()
        this.onInit()
    }

    async onInit() {
        const elems = GameConfig.MonsterSkill.getAllElement()
        for (let i = 0; i < elems.length; i++) {
            const e = elems[i]
            let vec = []
            for (let j = 0; j < this.initNum; j++) {
                await TimeUtil.delaySecond(0.2)
                vec.push(this.createSkill(e.ID))
            }
            this._skillPool.set(e.ID, vec)
        }
        // this.findCube()
    }

    public async findCube() {
        for (let i = 0; i < 7; i++) {
            let obj1 = await SpawnManager.asyncSpawn({ guid: "7669", replicates: true })
            if (obj1.asyncReady()) {
                obj1.worldTransform.scale = new Vector(0.7, 0.7, 0.7)
                obj1.setCollision(mw.CollisionStatus.Off, true)
                this.cube.push(obj1)
                oTrace("cube find", this.cube.length)
            }
        }

    }

    protected onPlayerEnterGame(player: mw.Player): void {
        // const pid = player.playerId
        // setTimeout(() => {
        //     let vec: string[] = []
        //     this.cube.forEach(e => {
        //         vec.push(e.guid)
        //     })
        //     this.getClient(pid).net_findCube(vec)
        // }, 10000)
    }

    public getCubes() {
        return this.cube
    }


    /**
     * 创建技能
     * @param skillId 技能ID 
     * @param monster 英雄Id
     * @returns 
     */
    public createSkill(skillId: number) {
        const skillCfg = GameConfig.MonsterSkill.getElement(skillId)
        let skill: MonsterSkillBase
        switch (skillCfg.effectType) {
            //近战技能
            case ESkillEffectType.Aoe:
                skill = new AoeMonsterSkill(skillId)
                break;
            //远程技能
            case ESkillEffectType.Bullet:
                skill = new BulletMonsterSkill(skillId)
                break;
            case ESkillEffectType.Envir:
                skill = new EnvironMentSkill(skillId)
                break;
            default:
                skill = new AoeMonsterSkill(skillId)
                break
        }
        skill.onInit()
        return skill
    }

    /**
     * 
     * @param skillId 
     * @param hostID 
     * @param atkVec 攻击方向
     * @param releaseEffPos  释放特效位置
     * @param playerVec 同步表现的玩家列表
     * @returns 
     */
    public useSkill(skillId: number, hostID: string, atkVec: Vector = Vector.zero, releaseEffPos: Vector = Vector.zero, playerVec: number[]) {
        const monster = MonsterMgr.Inst.getMonster(hostID)
        if (monster) {
            let skill = this.getASkill(skillId)
            if (!skill) { return false }
            skill && skill.start(monster.gameObject, atkVec, releaseEffPos, false)
            if (skill._config.isPredict == 1) {
                //使用预判
                const data = atkVec.x + '/' + atkVec.y + '/' + atkVec.z +
                    '/' + releaseEffPos.x + '/' + releaseEffPos.y + '/' + releaseEffPos.z
                playerVec.forEach(e => {
                    this.getClient(e).net_useSkill(skillId, hostID, data, true)
                })
            }
            return true
        }
        return false
    }

    /**
     * 获取某个技能
     * @param id 
     * @param skillId 
     * @returns 
     */
    public getASkill(skillId: number) {
        let retSkill: MonsterSkillBase = null
        let group = this._skillPool.get(skillId)
        for (const skill of group) {
            if (!skill.active && skillId == skill.configId) {
                retSkill = skill
                break
            }
        }
        if (!retSkill) {
            retSkill = this.createSkill(skillId)
            group.push(retSkill)
            this._skillPool.set(skillId, group)
        }
        return retSkill
    }

    public PredictASkill(skillId: number, duration: number, atkVec: Vector = Vector.zero, releaseEffPos: Vector = Vector.zero, playerVec: number[]) {
        const data = atkVec.x + '/' + atkVec.y + '/' + atkVec.z +
            '/' + releaseEffPos.x + '/' + releaseEffPos.y + '/' + releaseEffPos.z
        playerVec.forEach(e => {
            this.getClient(e).net_PredictASkill(skillId, duration, data)
        })
    }

    //中断一个怪物所有技能
    public InvokeSkill(hostID: string, skillVec: number[]) {
        skillVec.forEach(e => {
            const skillList = this._skillPool.get(e)
            if (skillList && skillList.length > 0) {
                skillList.forEach(skill => {
                    if (skill.active && skill.HostID == hostID) {
                        skill.onInvoke()
                    }
                })
            }
        })
        this.getAllClient().net_InvokeSkill(hostID, skillVec)
    }

    @updater.updateByFrameInterval(20)
    onUpdate(dt: number): void {
        super.onUpdate(dt)
        for (const [heroID, group] of this._skillPool) {
            group.forEach((skill) => {
                skill.update(dt)
            })
        }
    }

}