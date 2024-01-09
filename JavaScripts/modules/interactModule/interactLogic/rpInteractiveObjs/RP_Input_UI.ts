import { TrrigerType } from "../../../../const/GameEnum";
import { ClickUIPools } from "../../ClickUI";
import InteractMgr from "../../InteractMgr";
import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

@Component
export default class Input_UI extends InteractObject {
    @mw.Property({ replicated: true, displayName: "交互方式", group: "属性", selectOptions: { "不交互": TrrigerType.None, "距离判断": TrrigerType.Distance, "盒状触发器": TrrigerType.BoxTrigger, "球状触发器": TrrigerType.SphereTrigger } })
    public isTrriger: string = TrrigerType.Distance
    @mw.Property({ replicated: true, displayName: "交互距离", group: "属性" })
    public activeDis: number = 150;//可交互的距离
    @mw.Property({ replicated: true, displayName: "UI图标", group: "属性" })
    public icon: string = "110111";//默认是个小手
    @mw.Property({ replicated: true, displayName: "UI图标偏移", group: "属性" })
    public offset: mw.Vector = new mw.Vector(0, 0, 0);
    @mw.Property({ replicated: true, displayName: "冷却时间:单位秒", group: "属性" })
    public cdTime: number = 0;

    public inCD: boolean = false
    onStart() {
        this.init(InputUI_S, InputUI_C);
    }

    override onEnterTrriger() {
        this.showClickIcon(true)
    }

    override onLeaveTrriger() {
        this.showClickIcon(false)
    }

    override onStateTrriger() {
        this.showClickIcon(true)
    }

    public showClickIcon(value: boolean): void {
        if (value && !this.inCD && this.gameObject.getVisibility()) {
            ClickUIPools.instance.show(this.gameObject, this.offset, this.clickBtn);
            ClickUIPools.instance.changeIcon(this.icon, this.gameObject.gameObjectId);
        } else {
            ClickUIPools.instance.hide(this.gameObject.gameObjectId);
        }
    }

    clickBtn = () => {
        this.inCD = true
        this.showClickIcon(false);
        InteractMgr.instance.activeHandle(this, true)
    }
}
//客户端
class InputUI_C extends InteractLogic_C<Input_UI> {

    /**开始时间戳 */
    private mStartTime: number = 0;

    onStart(): void {

    }

    public onPlayerAction(playerId: number, active: boolean, param: any): void {
        if (active) {
            this.mStartTime = TimeUtil.elapsedTime();
            this.useUpdate = true
        }
    }

    public onUpdate(dt: number): void {
        if (TimeUtil.elapsedTime() - this.mStartTime >= this.info.cdTime) {
            this.useUpdate = false
            this.info.inCD = false
        }
    }
}

//客户端
class InputUI_S extends InteractLogic_S<Input_UI> {
    onStart(): void {

    }

    public onPlayerAction(playerId: number, active: boolean, param: any): void {

    }
}
