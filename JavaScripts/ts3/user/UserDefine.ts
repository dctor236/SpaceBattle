/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-05-19 16:11
 * @LastEditTime : 2023-06-01 19:21
 * @description  : 
 */
//import { LogMgr } from "../../tools/LogMgr";

export enum CoinType {
    //无
    None = 0,
    //金币
    Gold = 1,
    //宝石
    Gem = 2,
    //月亮币
    Moon = 3,
}
export interface ItemInfo {
    id: number;
    count: number;
}
export interface JumpGameData {

    type: number;
    way: number;   //1:getGameCarryingData，2:asyncGetCustomData
    home: string;
    data: JumpItemData[];
}

/**
 * 主游戏数据变化格式
 */
export interface JumpItemData {
    type: JumpItemType,   //数据类型，各子游戏和主游戏对齐
    data: any,      //各类型的数据格式
}
/**
 * 主游戏数据变化类型，个子游戏统一
 */
export enum JumpItemType {
    None = 0,
    Gold = 1,  //金币
    Gem = 2,  //宝石
    Moon = 3,  //月亮
    Avatar = 10, //当前装扮资源列表
    Item = 11,  //道具
    Avatars = 12, //已解锁装扮资源配置列表

}


//各子游戏type
enum JumpGameType {
    None = 0,
    /**主游戏 */
    MainGame = 1,
    /**魔法庄园 */
    Manor = 2,
    /**蔓藤山谷 */
    Valley = 3,
    /**金木研的城堡 */
    Tower = 4,
    /**恋恋花园 */
    Garden = 5,
    /**躲猫猫 */
    HideSeek = 6,
    /**水上乐园 */
    WaterPark = 7,
    SecretBase = 8
}
/**
 * 用户数据常量 28063043
 */
export namespace UserDefine {
    //是否初始化完成
    export let inited = false;
    export let dataReady = false;
    //主游戏ID，需测试下，gameid  or mwGmaeId
    //export const MainGameId = '881108';
    //主游戏mwId
    export let MainGameMwId = 'P_ec4de48c36d1c60cdfa5749aa172e920dde1fdc0';
    /**
     * 本游戏的子type
     */
    export let SubGameType = JumpGameType.SecretBase;
    //主游戏数据key
    export const MainDataKey = 'mlwxy';
    //货币变化事件
    export const Event_Coin_Change = 'Event_Coin_Change';
    //user模块日志，分离没走logmgr
    export function log(...args) {
        console.info('--TS3Core--', ...args);
        //LogMgr.Inst.coreLog(...args)
    }
}

