/**
 * @Author       : 田可成
 * @Date         : 2023-03-27 10:01:24
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-03-27 10:49:15
 * @FilePath     : \mollywoodschool\JavaScripts\modules\interactModule\Interactive\SP\SP_Motion_Rotate.ts
 * @Description  : 
 */
import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

@Component
export default class Rotate extends InteractObject {
    @mw.Property({ displayName: "启动", group: "属性" })
    public isRuning: boolean = true;
    @mw.Property({ displayName: "旋转速度", group: "属性" })
    public speed: mw.Vector = mw.Vector.zero;
    onStart() {
        this.init(Rotate_S, Rotate_C);
    }
}
//客户端
class Rotate_C extends InteractLogic_C<Rotate> {
    protected onStart(): void {

    }
    public onPlayerAction(playerId: number, active: boolean, param: any): void {

    }
}
//服务端
class Rotate_S extends InteractLogic_S<Rotate> {
    private rotation: mw.Rotation;
    onStart(): void {
        this.rotation = this.gameObject.localTransform.rotation;
        this.useUpdate = this.info.isRuning;
    }
    onPlayerAction(playerId: number, active: boolean) {
        this.useUpdate = active;
    }
    onUpdate(dt: number): void {
        this.rotation = this.rotation.add(new mw.Rotation(mw.Vector.multiply(this.info.speed, dt)));
        this.gameObject.localTransform.rotation = (this.rotation);
    }
}