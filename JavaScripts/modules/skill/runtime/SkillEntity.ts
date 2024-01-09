import { SkillTimeline } from "./SkillTimeline";
import { BehaviorType, ICastParam, ISkillEntity, ISkillObject } from "../define/SkillDefine";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2022-12-06 11:24
 * @LastEditTime : 2023-03-08 16:17
 * @description  : 
 */
export class SkillEntity implements ISkillEntity {
    private runtimes: SkillTimeline[];
    public itemId: string;
    public value: any;
    public loop: number = 1;
    //引导中
    public casting: boolean = false;
    //施法时长
    public castTime: number = 0;

    public filish: boolean = false;
    constructor(public clientId: number, public host: mw.GameObject, public skillId: number, public obj: ISkillObject, public param: ICastParam) {
        this.runtimes = [];
        let pid = clientId.toString() + skillId.toString();
        for (let i = 0; i < obj.groups.length; i++) {
            const runtime = new SkillTimeline();
            const skills = obj.groups[i].skillList;
            let gid = pid + i;
            let j = 1;
            for (const skill of skills) {
                skill.id = gid + j;
                runtime.add(host, skill);
                j++;
            }
            this.runtimes.push(runtime);
        }
        this.itemId = '';
        this.obj.behavior(this, BehaviorType.Start);
    }
    /**
     * 是否该宿主的技能
     * @param guid 
     * @param skillId 指定的技能 
     */
    public isHostSkill(guid: string, skillId: number) {
        if (!this.host || this.host.gameObjectId == guid)
            return false;
        if (!skillId || skillId == this.skillId)
            return true;
        return false;
    }
    /**
     * 技能更新逻辑
     * @param dt 
     * @returns true-技能执行完毕，false-正在执行
     */
    public onUpdate(dt: number) {
        if (this.castTime > 0)
            this.castTime -= dt;
        if (this.filish)
            return true;
        let done = true;
        for (let i = 0; i < this.runtimes.length; i++) {
            let rt = this.runtimes[i];
            if (rt.done)  //完成的组不再执行
                continue;
            rt.excute(this, dt)
            if (!rt.done)
                done = false;
            if (this.casting)
                break;
        }
        if (done)
            this.stop(true);
        return this.filish;
    }
    //结束
    public stop(end = false) {
        this.runtimes.forEach(item => {
            if (end)
                item.end(this);
            else
                item.stop(this);
        });
        //this.runtimeIndex = this.runtimes.length;
        this.filish = true;
        //if (this.clientId == RuntimeConst.clientID)
        this.itemId = '';
        this.obj.behavior(this, BehaviorType.End);
    }
    public breakoff() {
        this.itemId = '';
        this.obj.behavior(this, BehaviorType.CastBreak);
        this.stop();
    }

    private reset() {
        //this.runtimeIndex = 0;
        this.casting = false;
        this.castTime = 0;
        this.runtimes.forEach(item => {
            item.reset();
        });
    }
}