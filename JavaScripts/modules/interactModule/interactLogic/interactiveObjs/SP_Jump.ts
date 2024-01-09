import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

//跳跃
@Component
export default class Jump extends InteractObject {
    @mw.Property({ replicated: true, displayName: "冲量", group: "属性" })
    public impulse: mw.Vector = new mw.Vector(0, 0, 100);
    onStart() {
        this.init(Jump_S, Jump_C);
    }
}
//客户端
class Jump_C extends InteractLogic_C<Jump> {
    onStart(): void {

    }
    public onPlayerAction(playerId: number, active: boolean, param: any): void {
    }
}
//服务端
class Jump_S extends InteractLogic_S<Jump> {
    private playerArr: Array<mw.Player> = [];

    onStart(): void {

    }
    onPlayerAction(playerId: number, active: boolean) {
        let player: mw.Player = Player.getPlayer(playerId);
        if (active) {
            this.playerArr.push(player);
        } else {
            let index = this.playerArr.indexOf(player);
            if (index >= 0) {
                this.playerArr.splice(index, 1);
            }
        }
        this.useUpdate = this.playerArr.length > 0;
    }
    onUpdate(dt: number): void {
        for (let i = 0; i < this.playerArr.length; i++) {
            if (!this.playerArr[i].character.isJumping) {
                this.playerArr[i].character.addImpulse(this.info.impulse, true);
                this.playerArr.splice(i, 1);
            }
        }
    }
}

