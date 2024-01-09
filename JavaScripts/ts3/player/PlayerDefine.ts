/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-05-24 11:06
 * @LastEditTime : 2023-06-27 17:40
 * @description  : 
 */

import PlayerHeadUI from "./PlayerHeadUI";

/**
 * 用户数据常量
 */
export namespace PlayerDefine {
    //是否初始化完成
    export let inited = false;
    export let playerScriptGuid = 'CEAF12A04C6114FD4C6461BC771C2E4C';
    /**
     * 头顶数据配置
     */
    export let headBit = 0;
    export let mainHeadRes = 'B1E50E58474D8C7487636CAB9CE63475';
    export let otherHeadRes = '89F2E6F74EFA418B2C01ABB569559C13';
    export let HeadUI = PlayerHeadUI;
    export let Event_Player_Start = 'Event_Player_Start';
}

export enum GamePlayerState {
    None,   //无行为，且隐藏
    Idle,
    Dead,
    Battle,
    OutofBattle,
    Control//被控制
}