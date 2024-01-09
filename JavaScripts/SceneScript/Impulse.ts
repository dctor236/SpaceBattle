import { MGSMsgHome } from "../modules/mgsMsg/MgsmsgHome";
import { PlayerMgr } from "../ts3/player/PlayerMgr";
import GameUtils from "../utils/GameUtils";

@Component
export default class Impulse extends mw.Script {
    private _physicsImpulse: mw.Impulse
    @mw.Property({ displayName: "时间间隔" })
    private inteval: number = 0;
    private _freshTime = null
    private _state: boolean = true

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart() {
        this._physicsImpulse = this.gameObject.getChildByName("impulse") as mw.Impulse
        this._physicsImpulse.enable = false
        const effObj = this.gameObject.getChildByName("eff") as mw.Effect
        let tri = this.gameObject as mw.Trigger
        this._freshTime = setInterval(() => {
            this._state = !this._state
            this._physicsImpulse.enable = this._state
            if (this._state) {
                effObj.play()
                const ch = PlayerMgr.Inst.mainCharacter
                if (tri.checkInArea(ch)) {
                    tri.onEnter.broadcast(ch)
                }
            } else {
                effObj.forceStop()
            }

        }, this.inteval * 1000)


        tri.onEnter.add((actor) => {
            if (GameUtils.isPlayerCharacter(actor) && this._state) {
                MGSMsgHome.uploadMGS('ts_game_result', '玩家每次被obby飓风吹落打一个点', { record: 'wing_down' })
            }
        })
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}