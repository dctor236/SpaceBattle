
import { AssistHeadUI } from "./AssistHeadUI";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-05-10 14:14
 * @LastEditTime : 2023-06-11 10:09
 * @description  : 
 */
export namespace AssistDefine {
    let index = 0;
    const farmeMax = 10;
    export let frameNum = 0;

    //交互物模块初始化完成
    export let inited = false;

    //交互物脚本资源的GUID
    export let scriptGuid = 'D7A3A4664E5722F1BFAD4DB0E0894725';
    export let headRes = '005FCCFF401A11FAD78C9686E4F916A4';
    export let HeadUI = AssistHeadUI;
    export function getIndex() {
        return ++index;
    }
    export function isMyFrame(idx) {
        let f = idx % farmeMax;
        return frameNum % farmeMax == f;
    }
    export let Event_Assist_Start = 'Event_Assist_Start';
}
export interface AssistCfg {
    config: number;
    name?: string;   // 怪物名
    type?: number;   // 自定义怪物类型，行为不同
}

//怪物行为状态
export enum EAssistBehaviorState {
    None,   //无行为，且隐藏
    Idle,
    Partrol,//巡逻
    AttackPrepare,//攻击等待
    Attack,//攻击
    TargetPrepare,//寻找目标前置动作
    Target,//寻找目标
    Dead,
    Show,//刚出现 
    ImpulseBack,//后撤步
    Impulse,//开始撞击
    Hit,//受伤
    Sleep,//沉睡
    Escape//逃跑
}

export enum EAssistState {
    None,
    Hide,
    Visable,
    Relive,//复活
    Dead
}