import { LogMgr } from "./com/LogMgr";
import { PlayerMgr } from "./player/PlayerMgr";
import { UserMgr } from "./user/UserMgr";
import { MonsterMgr } from "./monster/MonsterMgr";
import { AssistMgr } from "./assist/AssistMgr";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-02 13:34
 * @LastEditTime : 2023-06-27 17:52
 * @description  : 主入口
 */
export namespace TS3 {

    export let resMgr = mw.AssetUtil;
    export let soundMgr = SoundService;
    export let uiMgr = mw.UIService;
    // export let moduleMgr = ModuleService;
    export let accountMgr = AccountService;
    export let timeMgr = mw.TimeUtil;
    export let playerMgr = PlayerMgr.Inst;
    export let userMgr = UserMgr.Inst;
    export let monsterMgr = MonsterMgr.Inst;
    export let assistMgr = AssistMgr.Inst;
    /**
     * 日志工具
     */
    export let logMgr = LogMgr.Inst;
    export let log = (...args) => {
        logMgr.log(...args);
    }
    export let info = (...args) => {
        logMgr.info(...args);
    }
    export let trace = (...args) => {
        logMgr.trace(...args);
    }
    export let error = (...args) => {
        logMgr.error(...args);
    }

    export async function init() {
        logMgr.coreLog('TS3 init')
        await userMgr.init();
        await playerMgr.init();
        await assistMgr.init();
        await monsterMgr.init();
        logMgr.coreLog('TS3 inited')

        //开启mgr的update
        // setInterval(() => {
        //     let nt = timeMgr.elapsedTime();
        //     let dt = nt - lastUpdateTime;
        //     lastUpdateTime = nt;
        //     update(dt);
        // }, 1);
    }

    let lastUpdateTime = 0;
    function update(dt: number) {

    }
}