
import { TimerState, ISkillEntity, ISkillBaseItem, ISkillTimer, ISkillLine as ISkillTimeLine } from "../define/SkillDefine";
/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2022-12-06 11:24
 * @LastEditTime : 2023-03-08 14:07
 * @description  : 
 */
class SkillTimer implements ISkillTimer {
    public state: TimerState;
    public time: number;
    public params: number[];
    /**
     * @param host 技能宿主
     * @param skill 技能配置，所有宿主共用，不可更改
     */
    constructor(public host: mw.GameObject, private skill: ISkillBaseItem) {
        this.reset();
    }
    /**
     * 重置参数
     */
    public reset() {
        this.time = 0;
        this.state = TimerState.None;
        this.params = [0, 0, 0];
    }
    /**
     * 执行逻辑
     * @param dt 
     */
    public excute(entity: ISkillEntity, line: ISkillTimeLine) {
        if (this.skill.excute(entity, line, this))
            this.state = TimerState.End;
    }
    //停止
    public stop(entity: ISkillEntity, line: ISkillTimeLine) {
        this.skill.stop(entity, line, this);
    }
    //结束
    public end(entity: ISkillEntity, line: ISkillTimeLine) {
        this.skill.end(entity, line, this);
    }
}


export class SkillTimeline implements ISkillTimeLine {
    //组执行时长
    public time: number;
    //是否完成
    public done: boolean;
    //帧间隔
    public delta: number;
    //运行组参数
    public params: any[];

    public delay: number = 0;
    public loopGap: number = 0;
    public loopMax: number = 1;
    public loopNum: number = 0;
    private _list: SkillTimer[];
    constructor() {
        this._list = [];
        this.done = false;
        this.time = 0;
    }

    public excute(entity: ISkillEntity, dt: number) {
        //组执行间隔
        if (this.delay > 0) {
            this.delay -= dt;
            return;
        }
        let d = true;
        this.time += dt;
        this.delta = dt;
        for (let i = 0; i < this._list.length; i++) {
            let timer = this._list[i];
            if (timer.state == TimerState.End)  //完成模块
                continue;
            timer.excute(entity, this);
            if (timer.state < TimerState.End)
                d = false;
            if (this.delay > 0)  //组延迟
                return;
            if (entity.casting)  //引导中
                return;
        }

        this.done = d;
        if (this.done) {
            this.loopNum++;
            if (this.loopNum < this.loopMax) {
                this.reset();
            }
        }
    }

    public add(host: mw.GameObject, skill: ISkillBaseItem) {
        this._list.push(new SkillTimer(host, skill));
    }
    /**
     * 重置组数据
     */
    public reset() {
        this.done = false;
        this.time = 0;
        this.delay = this.loopGap;
        this._list.forEach(item => {
            item.reset();
        })
    }
    /**
     * 停止模块
     */
    public stop(entity: ISkillEntity) {
        this._list.forEach(item => {
            item.stop(entity, this);
        })
        this.done = true;
    }
    public end(entity: ISkillEntity) {
        this._list.forEach(item => {
            item.end(entity, this);
        })
    }
}