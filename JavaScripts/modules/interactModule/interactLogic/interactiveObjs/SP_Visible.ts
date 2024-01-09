import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

/**触发模式 */
enum Mode {
    /**自变化*/
    Alone = "alone",//自变化,每次激活（只有激活）取反
    /**依赖变化*/
    Depend = "depend"//依赖变化,随上级控制器激或活关闭而切换状态
}
//开关形式的交互物
/**
 * 交互物-显示、隐藏
 * 作用：显示或隐藏挂载的GameObject
 */
@Component
export default class SP_Visible extends InteractObject {
    @mw.Property({ displayName: "默认显示", group: "属性" })
    public defaultValue: boolean = true;
    @mw.Property({ displayName: "变化模式", selectOptions: { "自变化": Mode.Alone, "依赖变化": Mode.Depend }, group: "属性" })
    public mode: Mode = Mode.Alone;
    onStart() {
        this.init(Visible_S, Visible_C);
    }
}
//客户端
class Visible_C extends InteractLogic_C<SP_Visible> {
    onStart(): void {

    }
    public onPlayerAction(playerId: number, active: boolean, param: any): void {

    }
}
//服务端
class Visible_S extends InteractLogic_S<SP_Visible> {
    private value: boolean;
    private collision: mw.PropertyStatus | mw.CollisionStatus;
    onStart(): void {
        this.value = this.info.defaultValue;
        this.collision = this.gameObject.getCollision();
        this.setState(!this.value);
    }

    onPlayerAction(playerId: number, active: boolean) {
        this.setState(active);
    }

    private setState(value: boolean) {
        this.gameObject.setVisibility(value ? mw.PropertyStatus.Off : mw.PropertyStatus.On);
        this.gameObject.setCollision(value ? mw.PropertyStatus.Off : this.collision);
    }
}

