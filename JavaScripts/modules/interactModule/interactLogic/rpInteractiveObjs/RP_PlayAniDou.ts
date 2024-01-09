import { PlayerManagerExtesion, } from '../../../../Modified027Editor/ModifiedPlayer';
/** 
* @Author       : 郝建琦
* @Date         : 2023-05-04 16:23:09
* @LastEditors  : 郝建琦
* @LastEditTime : 2023-05-06 10:59:42
* @FilePath     : \mollywoodschool\JavaScripts\modules\interactModule\interactLogic\rpInteractiveObjs\RP_PlayAniDou.ts
* @Description  : 
*/
import { GameConfig } from "../../../../config/GameConfig";
import Tips from "../../../../ui/commonUI/Tips";
import GameUtils from "../../../../utils/GameUtils";
import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";


//交互物
@Component
export default class RP_PlayAniDouble extends InteractObject {
    @mw.Property({ displayName: "动作ID", group: "属性" })
    public animation: string = "";
    @mw.Property({ displayName: "动作速度，默认1", group: "属性" })
    public time: number = 1;
    @mw.Property({ displayName: "循环次数", group: "属性" })
    public loopNum: number = 0;
    @mw.Property({ displayName: "世界旋转", group: "属性" })
    public lookAtOff: mw.Vector = mw.Vector.zero;
    @mw.Property({ displayName: "可移动跳跃", group: "属性" })
    public moveJumpEnable: boolean = false;

    onStart() {
        this.init(PlayAniDouble_S, PlayAniDouble_C);
    }
}
//客户端
class PlayAniDouble_C extends InteractLogic_C<RP_PlayAniDouble> {
    public onPlayerAction(playerId: number, active: boolean, param: any): void {
        // const location = this.gameObject.worldTransform.position
        // const movLocation = new mw.Vector(location.x, location.y, Player.localPlayer.character.worldTransform.position.z)
        // Player.localPlayer.character.worldTransform.position = movLocation
    }
    onStart(): void {
        GameUtils.downAsset(this.info.animation)
    }
}
//服务端
class PlayAniDouble_S extends InteractLogic_S<RP_PlayAniDouble> {
    private playerList: Map<number, mw.Rotation> = new Map<number, mw.Rotation>();
    private playerArr: mw.Player[] = []
    private lookAtRot: mw.Rotation;
    private animation: string[] = []
    private num: number = 0

    onStart(): void {
        this.lookAtRot = new mw.Rotation(this.info.lookAtOff);
        this.animation = this.info.animation.split(',')

        Player.onPlayerLeave.add((player: mw.Player) => {
            this.removePlayer(player);
        });
        this.num = 0
    }
    onPlayerAction(playerId: number, active: boolean): void {
        if (mw.StringUtil.isEmpty(this.info.animation)) return;
        let player = Player.getPlayer(playerId);
        if (active) {
            this.addPlayer(player)
        }
        else {
            this.removePlayer(player)
        }
    }

    private addPlayer(player: mw.Player) {
        if (!this.playerList.has(player.playerId)) {
            this.playerArr.push(player)
            this.playerList.set(player.playerId, player.character.worldTransform.rotation.clone());
            let char = player.character;
            char.worldTransform.rotation = this.lookAtRot.clone();
            let index = 0
            this.num++
            player.character.movementEnabled = player.character.jumpEnabled = false;
            if (this.num === 2) {
                this.playerArr.forEach((player: mw.Player) => {
                    const anim = PlayerManagerExtesion.loadAnimationExtesion(player.character, this.animation[index], true);
                    anim.loop = this.info.loopNum
                    anim.speed = this.info.time
                    anim.play()
                    index++
                })
            }
            // else {
            //     console.log('--------------------@@@@@@@@@@@@@@');

            //     Tips.show(GameConfig.SquareLanguage.Text_Text_675.Value, player)
            // }
        }
    }
    private removePlayer(player: mw.Player) {
        if (this.playerList.has(player.playerId)) {
            player.character.movementEnabled = player.character.jumpEnabled = true
            this.playerArr.forEach((player: mw.Player) => {
                let index = this.playerArr.indexOf(player)
                PlayerManagerExtesion.loadAnimationExtesion(player.character, this.animation[index]).stop();
            })
            this.playerArr.splice(this.playerArr.indexOf(player), 1)
            this.num--
            this.playerList.delete(player.playerId);
        }
    }
}