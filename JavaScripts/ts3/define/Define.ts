/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-24 10:37
 * @LastEditTime : 2023-05-29 18:28
 * @description  : 全局定义
 */


/**
 * 交互物配置信息
 */
export interface InteractCfg {
    id: string;   // 交互对象guid,脚本挂载的对象
    host?: mw.GameObject;     // 交互物对象
    type?: number;    // 交互类型
    group?: string;  // 分组
    tipWay?: number;// 交互的提示方式
    enterWay?: number;// 进入交互的方式
    exitWay?: number;// 退出交互的方式
    pos?: mw.Vector; // 交互绑定相对位置
    rot?: mw.Vector; // 交互绑定相对旋转
}
export enum InteractEvent {
    Start = 'Event_Interract_Start',
    Enter = 'Event_Interract_Enter',
    Exit = 'Event_Interract_Exit'
}
/**
 * 交互类型
 */
export enum InteractType {
    None = 0,
    Sit = 1,
    Idle,
    Enter,
    Active,
}

export enum PlayerState {
    Idle = 0,   // 空闲
    Interact = 1, // 交互
    Action = 2, // 动作

}