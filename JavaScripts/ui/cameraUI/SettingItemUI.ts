import { GameConfig } from "../../config/GameConfig";
import SettingItem_Generate from "../../ui-generate/uiTemplate/Camera/SettingItem_generate";
import { ItemType } from "./CameraFilterUI";

export class SettingItemUI extends SettingItem_Generate {
    private id: number;
    private chooseColor: string;
    private oldColor: mw.LinearColor;
    protected onStart(): void {
        this.chooseColor = GameConfig.Global.getElement(33).Value3;
        this.mPic_Choose.visibility = mw.SlateVisibility.Hidden
        this.oldColor = this.mButton_1.normalImageColor;
    }
    public initId(type: ItemType, id: number) {
        let config;
        this.id = id;
        if (type == ItemType.Filter) {
            config = GameConfig.Filter.getElement(id);
            if (config.notice == "默认") {
                this.mButton_1.normalImageColor = mw.LinearColor.colorHexToLinearColor(this.chooseColor);
            }
            this.mButton_1.normalImageGuid = config.Icon
        } else if (type == ItemType.Weather) {
            config = GameConfig.Weather.getElement(id);
            if (config.Effect == null) {
                this.mButton_1.normalImageColor = mw.LinearColor.colorHexToLinearColor(this.chooseColor);
            }
            this.mButton_1.normalImageGuid = config.Icon
        } else if (type == ItemType.Action) {
            config = GameConfig.SquareActionConfig.getElement(id);
            this.mButton_1.normalImageGuid = config.icon
        } else {
            config = GameConfig.ChatExpression.getElement(id);
            this.mButton_1.normalImageGuid = config.ExpressionIcon
        }
    }
    //刷新滤镜
    public refreshFilter(itemID: number) {
        if (itemID == this.id) {
            if (this.mPic_Choose.visibility == 0) {  //已经是当前的item
                return;
            }
            this.mButton_1.normalImageColor = mw.LinearColor.colorHexToLinearColor(this.chooseColor);
        } else {
            this.mButton_1.normalImageColor = this.oldColor
        }
    }
    //刷新动作表情
    public refreshAction(itemID: number) {
        if (itemID == this.id) {
            this.mPic_Choose.visibility = mw.SlateVisibility.Visible
        } else {
            this.mPic_Choose.visibility = mw.SlateVisibility.Hidden
        }
    }
    public setDefaultUI() {
        this.mPic_Choose.visibility = mw.SlateVisibility.Hidden
    }
}