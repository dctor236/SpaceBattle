/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-11 20:30:50
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-07-08 19:41:54
 * @FilePath: \vine-valley\JavaScripts\modules\fight\monsterSkill\MonsterSkillMC.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { GoPool, Tween } from "../../../ExtensionType"
import { GameConfig } from "../../../config/GameConfig"
import { IMonsterSkillElement } from "../../../config/MonsterSkill"
import { MonsterMgr } from "../../../ts3/monster/MonsterMgr"
import { PlayerMgr } from "../../../ts3/player/PlayerMgr"
import SpiritModuleC from "../../spirit/SpiritModuleC"
import { FightUtil } from "../utils/Utils"
import { MonsterSkillBase, ESkillEffectType, BulletMonsterSkill, EnvironMentSkill, AoeMonsterSkill, CircleDuation, CircleRotation, ErrorCircleRange } from "./MonsterSkillBase"
import MonsterSkillMS from "./MonsterSkillMS"
import { updater } from "../utils/Updater"


export default class MonsterSkillMC extends ModuleC<MonsterSkillMS, null> {
    private _skillPool: Map<number, MonsterSkillBase[]> = new Map()
    private initNum: number = 1
    cube: mw.GameObject[] = []
    //所有场景特效 
    private allEffRelease: mw.Effect[] = []
    //红圈缓存
    protected tween: Tween<{ val: number }>
    private centerView: mw.UIWidget
    private viewBG: mw.UIWidget
    private currentScale: mw.Vector = mw.Vector.zero

    onStart() {
        super.onStart()
        this.onInit()
    }

    async onInit() {
        const elems = GameConfig.MonsterSkill.getAllElement()
        await this.findEnvirSkill(elems)
        for (let i = 0; i < elems.length; i++) {
            const e = elems[i]
            let vec = []
            for (let j = 0; j < this.initNum; j++) {
                await TimeUtil.delaySecond(0.2)
                const skill = this.createSkill(e.ID)
                vec.push(skill)
            }
            this._skillPool.set(e.ID, vec)
        }

        this.centerView = GoPool.spawn('UIWidget') as mw.UIWidget
        this.centerView.widgetSpace = mw.WidgetSpaceMode.World
        this.centerView.drawSize = ErrorCircleRange
        this.centerView.worldTransform.rotation = CircleRotation
        this.centerView.setUIbyID('0D6BB7EE40F1DB07EA5B8E87E4D26391')
        this.centerView.setCollision(mw.PropertyStatus.Off, true)
        this.centerView.setVisibility(mw.PropertyStatus.Off, true)

        this.viewBG = GoPool.spawn('UIWidget') as mw.UIWidget
        this.viewBG.setUIbyID('662A52A549764DDA9B22D69C0CC29BDD')
        this.viewBG.widgetSpace = mw.WidgetSpaceMode.World
        this.viewBG.drawSize = ErrorCircleRange
        this.viewBG.worldTransform.rotation = CircleRotation
        this.viewBG.setCollision(mw.PropertyStatus.Off, true)
        this.viewBG.setVisibility(mw.PropertyStatus.Off, true)

    }

    private setCenterViewLocation(val: number) {
        this.currentScale.x = val
        this.currentScale.y = val
        this.currentScale.z = val
        this.centerView.worldTransform.scale = this.currentScale

    }
    public async net_findCube(strs: string[]) {
        // console.log("net_findCube1", JSON.stringify(strs))
        for (const str of strs) {
            const obj = await GameObject.asyncFindGameObjectById(str)
            this.cube.push(obj)
        }
    }

    public getCubes() {
        return this.cube
    }

    private async findEnvirSkill(elems: IMonsterSkillElement[]) {
        // for (let i = 0; i < elems.length; i++) {
        //     const e = elems[i]
        //     if (e.envirEffItem) {
        //         const eff = await GameObject.asyncFindGameObjectById(e.envirEffItem) as mw.Effect
        //         eff.loop = true
        //         eff.play()
        //         eff.setVisibility(mw.PropertyStatus.Off, false)
        //         this.allEffRelease.push(eff)
        //     }
        // }
    }

    public createSkill(skillId: number) {
        const skillCfg = GameConfig.MonsterSkill.getElement(skillId)
        let skill: MonsterSkillBase
        switch (skillCfg.effectType) {
            //近战技能
            case ESkillEffectType.Aoe:
                skill = new AoeMonsterSkill(skillId)
                break;
            //近战技能
            case ESkillEffectType.Bullet:
                skill = new BulletMonsterSkill(skillId)
                break;
            case ESkillEffectType.Envir:
                skill = new EnvironMentSkill(skillId)
                break;
            default:
                skill = new AoeMonsterSkill(skillId)
                break;
        }
        skill.onInit()
        return skill
    }

    public net_useSkill(skillId: number, hostID: string, data: string, noDamage: boolean) {
        const tmpStr = data.split('/')
        const atk = new Vector(Number(tmpStr[0]), Number(tmpStr[1]), Number(tmpStr[2]))
        const releaseLoc = new Vector(Number(tmpStr[3]), Number(tmpStr[4]), Number(tmpStr[5]))
        this.useSkill(skillId, hostID, atk, releaseLoc, noDamage)
    }


    /**
     * 使用技能
     * @param id 
     * @param skillId 
     * @returns 
     */
    public useSkill(skillId: number, hostID: string, atkVec: Vector = Vector.zero, releaseEffPos: Vector = Vector.zero, noDamage: boolean = false) {
        const monster = MonsterMgr.Inst.getMonster(hostID)
        const skill = this.getASkill(skillId)
        if (!skill) { return false }
        if (monster) {
            skill && skill.start(monster.gameObject, atkVec, releaseEffPos, noDamage)
            return true
        }
        // const spirit = ModuleService.getModule(SpiritModuleC).getSpiritByGuid(hostID)
        // if (spirit) {
        //     skill && skill.start(spirit.obj, atkVec, releaseEffPos, noDamage)
        //     return true
        // }
        const player = PlayerMgr.Inst.mainGuid == hostID
        if (player) {
            skill && skill.start(PlayerMgr.Inst.mainCharacter, atkVec, releaseEffPos, noDamage)
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

    public net_PredictASkill(skillId: number, duration: number, data: string) {
        const tmpStr = data.split('/')
        const atk = new Vector(Number(tmpStr[0]), Number(tmpStr[1]), Number(tmpStr[2]))
        const inspecterPos = new Vector(Number(tmpStr[3]), Number(tmpStr[4]), Number(tmpStr[5]))
        this.predictASkill(skillId, duration, atk, inspecterPos)
    }

    protected canPredict(elem: IMonsterSkillElement) {
        if (!elem.isPredict || elem.preTime < 0)
            return false
        return true
    }

    public predictASkill(skillId: number, duration: number = CircleDuation, atkVec: Vector, inspecterPos: Vector) {
        const skillElem = GameConfig.MonsterSkill.getElement(skillId)
        if (!this.canPredict(skillElem)) return

        let pos: Vector = inspecterPos
        if (skillElem.effectType != ESkillEffectType.Envir) {
            if (inspecterPos.x != 0 && inspecterPos.y != 0 && inspecterPos.z != 0) {
                pos = inspecterPos
            }
        } else {
            pos = new Vector(skillElem.envirRelesePos)
        }

        const _atkVec = atkVec.normalized
        const boxSize = PlayerMgr.Inst.mainCharacter.getBoundingBoxExtent()
        this.tween?.stop()
        this.viewBG.setVisibility(mw.PropertyStatus.On, true)
        this.centerView.setVisibility(mw.PropertyStatus.On, true)
        this.viewBG.worldTransform.scale = new mw.Vector(skillElem.radius / 200, skillElem.radius / 200, skillElem.radius / 200)

        let circlePos = _atkVec
        let forward = _atkVec
        const qot = Quaternion.rotateZ(Quaternion.fromRotation(forward.clone().toRotation()), 90).toRotation()
        let right = new Vector(qot.x, qot.y, qot.z).normalized
        let finalPos = FightUtil.vector2World(circlePos, pos, forward, right)
        finalPos.z += boxSize.z / 2
        this.viewBG.worldTransform.position = finalPos
        this.centerView.worldTransform.position = finalPos

        this.tween = new Tween<{ val: number }>({ val: 0 })
            .to({ val: skillElem.radius / 200 }, duration * 1000)
            .onUpdate(obj => {
                this.setCenterViewLocation(obj.val)
            })
            .onComplete(() => {
                this.viewBG.setVisibility(mw.PropertyStatus.Off)
                this.centerView.setVisibility(mw.PropertyStatus.Off)
            })
            .onStop(() => {
                this.setCenterViewLocation(0)
                this.viewBG.setVisibility(mw.PropertyStatus.Off)
                this.centerView.setVisibility(mw.PropertyStatus.Off)
                // GoPool.despawn(this.centerView)
                // GoPool.despawn(this.viewBG)
            }).start()
    }

    //中断一个怪物所有技能
    public net_InvokeSkill(hostID: string, skillVec: number[]) {
        this.tween?.stop()
        skillVec.forEach(e => {
            const skillList = this._skillPool.get(e)
            if (skillList && skillList.length > 0) {
                skillList.forEach(skill => {
                    if (skill.active && skill.HostID == hostID) {
                        skill.onInvoke()
                        this.setCenterViewLocation(0)
                        // GoPool.despawn(this.centerView)
                        // GoPool.despawn(this.viewBG)
                    }
                })
            }
        })
    }

    public getEnvirSkill(guid: string) {
        return this.allEffRelease.find(e => e.gameObjectId == guid)
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