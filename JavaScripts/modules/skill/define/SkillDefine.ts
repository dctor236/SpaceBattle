/*
* @Author: zhaolei
* @Date: 2022-10-25 17:54:35
 * @LastEditors: xianjie.xia
* @Description: $1
*/
export enum BehaviorType {
    Start,  //技能开始
    ItemStart, //模块开始
    ItemEnd,   //模块结束
    CastStart, //引导开始
    CastBreak, //引导中断
    CastEnd,   //引导结束
    Event,     //事件 
    FindTarget,//获取目标
    Target,    //返回目标
    End,    //技能结束
}

/**
 * 运行状态
 */
export enum TimerState {
    None = 0,
    Run = 1,
    End = 2
}

export class SkillGroup {
    public skillList: ISkillBaseItem[] = [];
    constructor() {
    }

    public add(skill: ISkillBaseItem) {
        this.skillList.push(skill);
    }
}
export interface ISkillObject {
    behavior: (entity: ISkillEntity, type: BehaviorType, ...params) => any;
    groups: SkillGroup[];
}
export interface ISkillEntity {
    //主执行端
    clientId: number;
    //宿主
    host: mw.GameObject;
    //技能ID
    skillId: number;
    //当前执行模块ID
    itemId: string;
    //技能接口配置
    obj: ISkillObject;
    //当前实体模块的参数
    value: any;
    //当前模块循环次数
    loop: number;
    //技能释放参数
    param: ICastParam;
    //技能引导中，完成才执行后续模块
    casting: boolean;
    //释放时长，能被打断
    castTime: number;
    onUpdate(dt: number);
}

export interface ISkillTimer {
    //模块执行时长
    time: number;
    //状态
    state: TimerState;
    //运行模块参数
    params: any[];
}

export interface ISkillLine {
    //执行时间
    time: number;
    //是否完成
    done: boolean;
    //帧间隔
    delta: number;
    //组延迟
    delay: number;
    //组循环次数
    loopMax: number;
    //循环间隔
    loopGap: number;
    //当前循环次数
    loopNum: number;
    //运行组参数
    params: any[];
}

export interface ICastParam {
    /**
     * 技能释放位置
     */
    pos?: mw.Vector;
    /**
     * 释放旋转
     */
    rot?: mw.Rotation;
    /**
     * 技能释放方向
     */
    dir?: mw.Vector;
    /**
     * 自定义参数，技能执行返回
     */
    diy?: any[];
}
export interface ISkillItemParam {
    t: SkillItemType,
    d: number,
    l: number,
    w: number,
    v: any,
    p1?: any,
    p2?: any,
    p3?: any,
    p4?: any,
    p5?: any,
    p6?: any,
    p7?: any,
    p8?: any,
}
/**
 * 模块类别，不要换顺序
 */
export enum SkillItemType {
    None,
    Cast,
    Action,
    Effect,
    Move,
    Event,
    Target,
    Sound,
    Limit,
    Loop,
    Transfrom,
    Put,
}

export interface ISkillBaseItem {
    /**
     * 
     * @param entity 技能实体 
     * @param timer 技能单个实例
     */
    id: string;
    excute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): boolean;
    get type(): SkillItemType;
    parse(data);
    stop(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer);
    end(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer);
}
