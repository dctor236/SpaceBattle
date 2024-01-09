
/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-07-08 11:05:49
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-08-17 20:56:41
 * @FilePath: \mollywoodschool\JavaScripts\modules\action\ActionMC.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**aits-ignore */
import { TS3 } from "../../ts3/TS3";
import ActionMgr from "./ActionMgr";
import ActionMS from "./ActionMS";

/**动作模块客户端,用于管理客户端玩家动作,姿态的播放 */
export default class ActionMC extends ModuleC<ActionMS, null> {

    protected onStart(): void {

    }

    onEnterScene(sceneType: number): void {
        this.init();
        this.registerEvent();
    }
    private init() {
        // this.actionUI = UIService.getUI(P_Game_Action);
        // this.hudUI = UIService.getUI(P_Game_HUD);
    }

    /**
     * 注册事件
     */
    private registerEvent() {
        // this.actionUI.onPlayAction.add(this.playAction, this);
        // this.actionUI.onStopAction.add(this.stopCurrentAction, this);
        // this.hudUI.currentFuctionBtn.onValueChanged.add(this.openAnimation, this);
    }

    /**
     * 客户端指定一个角色进行动作的播放,可以添加播放完成的回调,适用于有限次播放动作
     * @param ele 动作的配置表id
     * @param char 角色对象
     * @param cb 播放完成的回调
     */
    public playAction(ele: number, char: mw.Character = Player.localPlayer.character, cb: () => void = null) {
        ActionMgr.playAction(ele, char, cb);
    }

    /**
     * 服务器端调用的网络方法,用来指定一个角色进行动作的播放
     * @param id 动作的配置id
     * @param gid 角色的guid
     */
    public net_playAction(id: number, gid: string) {
        let player = TS3.playerMgr.mainGuid === gid
        if (player) {
            ActionMgr.playAction(id);
        } else {
            GameObject.asyncFindGameObjectById(gid).then(o => {
                const ch = o as mw.Character
                ActionMgr.playAction(id, ch);
            })
        }
    }

    /**
     * 停止某个对象的动作/姿态
     * @param gid 角色的guid
     */
    public stopAction(gid: string = TS3.playerMgr.mainGuid) {
        ActionMgr.stopAction(gid, true);
        // this.server.net_stopAction(gid)
    }

    /**
     * 停止某个对象的动作/姿态(服务器调用的网络方法)
     * @param gid 角色的guid
     */
    public net_stopAction(gid: string) {
        ActionMgr.stopAction(gid, true);
    }

    // public net_stopPlayAnimationUe(gid: string) {
    //     let player = TS3.playerMgr.mainGuid === gid
    //     if (player) {
    //         TS3.playerMgr.mainCharacter["ueCharacter"]["StopAnimMontage"]();
    //     } else {
    //         GameObject.asyncFindGameObjectById(gid).then(o => {
    //             const ch = o as mw.Character
    //             ch["ueCharacter"]["StopAnimMontage"]()
    //         })
    //     }
    // }
    // public stopAnimationClient(gid: string) {
    //     this.server.net_stopPlayAnimationUe(gid);
    // }

    protected onUpdate(dt: number): void {

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}