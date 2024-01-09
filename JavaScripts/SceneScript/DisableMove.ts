import Tips from "../ui/commonUI/Tips";
import GameUtils from "../utils/GameUtils";

@Component
export default class DisableMove extends mw.Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        if (SystemUtil.isServer()) return
        setTimeout(() => {
            const tri = this.gameObject as mw.Trigger
            tri.onEnter.add(go => {
                if (GameUtils.isPlayerCharacter(go)) {
                    Tips.show(GameUtils.getTxt("Tips_1011"))
                }
            })
            tri.onLeave.add(go => {
                // if (GameUtils.isPlayerCharacter(go)) {
                //     GlobalModule.MyPlayerC.init(1)
                //     GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Interaction, false)
                //     Tips.show('你已经脱离禁飞区域')
                // }
            })
            if (tri.checkInArea(Player.localPlayer.character)) {
                tri.onEnter.broadcast(Player.localPlayer.character)
            }
        }, 1500);
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