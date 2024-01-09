/**aits-ignore */
import ActionMC from "./ActionMC";
import ActionMgr from "./ActionMgr";

/**动作模块服务器端,用于管理服务器端玩家动作,姿态的播放 */
export default class ActionMS extends ModuleS<ActionMC, null> {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        // Event.addLocalListener("ActionStop", (gid: string) => {
        //     this.net_stopPlayAnimationUe(gid);
        // })
    }

    // net_stopPlayAnimationUe(gid: string) {
    //     let player = TS3.playerMgr.getPlayer(gid)
    //     if (player) {
    //         player.character["ueCharacter"]["StopAnimMontage"]();
    //     } else {
    //         GameObject.asyncFindGameObjectById(gid).then(o => {
    //             const ch = o as mw.Character
    //             ch["ueCharacter"]["StopAnimMontage"]()
    //         })
    //     }
    // }

    /**
     *服务器端停止角色动作 
     * @param gid 角色的guid
     */
    public stopAction(gid: string) {
        // this.getAllClient().net_stopAction(ids, gid)
        ActionMgr.stopAction(gid, true)
    }


    public net_stopAction(gid: string) {
        // this.getAllClient().net_stopAction(ids, gid)
        this.stopAction(gid)
    }


    /**
    *服务器端播放角色动作 
    * @param gid 角色的guid
    */
    public playAction(id: number, host: mw.Character) {
        // this.getAllClient().net_playAction(id, gid)
        ActionMgr.playAction(id, host);
    }

}