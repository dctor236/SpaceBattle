import { PlayerStateType } from "../../../const/GameEnum";
import { GlobalModule } from "../../../const/GlobalModule";
import { UIManager } from "../../../ExtensionType";
import { P_PropAction, P_PropFly, P_PropPlace } from "./PropView";

/** 动作类道具UI */
export class PropHUD_Action extends P_PropAction {
    public action: mw.Action = new mw.Action();

    protected onStart(): void {
        this.mBtn.onClicked.add(() => {
            this.action.call();
        });
    }
    getLayer(): number {
        return super.getLayer();
    }

    public show(): void {
        UIManager.showUI(this, mw.UILayerBottom);
    }

    public hide(): void {
        UIManager.hideUI(this);
    }
}
/** 飞行类道具UI */
export class PropHUD_Fly extends P_PropFly {
    public action: mw.Action = new mw.Action();

    public accelerateActionPressed: mw.Action = new mw.Action();
    public goUpActionPressed: mw.Action = new mw.Action();
    public goUpActionReleased: mw.Action = new mw.Action();

    private interval_up
    /** 激活开关 */
    public _isActive: boolean = false;
    /** 上升速度 */
    public _goUpSpeed: number = 0;

    protected onStart(): void {
        //激活飞行
        this.mBtn.onClicked.add(() => {
            this.action.call();
        });
        //加速飞行
        this.mBtn3.onPressed.add(() => {
            this.accelerateActionPressed.call();
        });
        //向上飞开始
        this.mBtn2.onPressed.add(() => {
            this.goUpActionPressed.call();
            if (Player.localPlayer.character.movementMode == mw.MovementMode.Fly) {
                this.interval_up = setInterval(() => {
                    Player.localPlayer.character.addMovement(new mw.Vector(0, 0, this._goUpSpeed));
                }, 1);
            }
        });
        //向上飞结束
        this.mBtn2.onReleased.add(() => {
            this.goUpActionReleased.call();
            if (this.interval_up) {
                clearInterval(this.interval_up);
            }
        });

    }

    /** 飞行按钮激活隐藏 */
    public flyActive(onOff: boolean): void {
        this._isActive = onOff;
        switch (onOff) {
            case true:
                this.mBtn.normalImageColor = mw.LinearColor.white;
                this.mBtn2.visibility = mw.SlateVisibility.Hidden;
                this.mBtn3.visibility = mw.SlateVisibility.Hidden;
                GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Fly, false)
                break;
            case false:
                this.mBtn.normalImageColor = mw.LinearColor.red;
                this.mBtn2.visibility = mw.SlateVisibility.Visible;
                this.mBtn3.visibility = mw.SlateVisibility.Visible;
                GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Fly, true && this.visible)
                break;
        }
    }

    public show(): void {
        UIManager.showUI(this, mw.UILayerBottom);
    }

    public hide(): void {
        UIManager.hideUI(this);
    }
}
/** 放置类道具UI */
export class PropHUD_Placement extends P_PropPlace {
    //道具激活
    public action: mw.Action = new mw.Action();

    public bool_active: boolean = false;

    private time_cd: number = null;
    private time_config: number = 3;

    protected onStart(): void {
        this.time_cd = this.time_config;
        this.showText(true);
        this.mBtn.onClicked.add(() => {
            this.bool_active = true;
            this.action.call();
        });
    }
    protected onUpdate(dt: number): void {
        if (this.bool_active) {
            if (this.time_cd > 0) {
                this.showText(false);
                this.time_cd -= dt;
                this.mText.text = Math.round(this.time_cd).toString();
            } else {
                this.showText(true);
                this.time_cd = this.time_config;
                this.bool_active = false;
            }
        }
    }
    protected showText(onOff: boolean): void {
        if (onOff) {
            this.mText.visibility = mw.SlateVisibility.Hidden;
            this.mImg.visibility = mw.SlateVisibility.Hidden;
        } else {
            this.mText.visibility = mw.SlateVisibility.Visible;
            this.mImg.visibility = mw.SlateVisibility.Visible;
        }
    }

    setBtnCD(time: number): void {
        this.time_config = time;
        this.time_cd = this.time_config;
    }

    public show(): void {
        UIManager.showUI(this, mw.UILayerBottom);
        this.canUpdate = true;
    }

    public hide(): void {
        this.canUpdate = false;
        this.showText(true);
        this.time_cd = this.time_config;
        this.bool_active = false;
        UIManager.hideUI(this);
    }
}
