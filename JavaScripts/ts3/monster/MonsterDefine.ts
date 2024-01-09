/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-15 20:35:56
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-07-08 12:33:40
 * @FilePath: \vine-valley\JavaScripts\ts3\monster\MonsterDefine.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { MonsterHeadUI } from "./MonsterHeadUI";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-05-10 14:14
 * @LastEditTime : 2023-06-11 10:09
 * @description  : 
 */
export namespace MonsterDefine {
    let index = 0;
    const farmeMax = 10;
    export let frameNum = 0;

    //交互物模块初始化完成
    export let inited = false;

    //交互物脚本资源的GUID
    export let scriptGuid = '16F908DF466BCE2D73D9D4931D0C2E96';
    export let headRes = 'C46B8313447EFA3919B7EFB9EA88C37E';
    export let HeadUI = MonsterHeadUI;
    export function getIndex() {
        return ++index;
    }
    export function isMyFrame(idx) {
        let f = idx % farmeMax;
        return frameNum % farmeMax == f;
    }
    export let Event_Monster_Start = 'Event_Monster_Start';
}
export interface MonsterCfg {
    config: number;
    name?: string;   // 怪物名
    type?: number;   // 自定义怪物类型，行为不同
}

//怪物行为状态
export enum EMonsterBehaviorState {
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

export enum EMonserState {
    None,
    Hide,
    Visable,
    Relive,//复活
    Dead
}