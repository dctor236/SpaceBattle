
import { GameConfig } from "../../config/GameConfig";
import { MyAction1, UIHide } from "../../ExtensionType";
import CameraAction_Generate from "../../ui-generate/uiTemplate/Camera/CameraAction_generate";
import { GridLayout } from "../commonUI/GridLayout";
import { ItemType } from "./CameraFilterUI";
import { SettingItemUI } from "./SettingItemUI";

export default class CameraActionUI extends CameraAction_Generate {
    public changeActionAC: MyAction1<number> = new MyAction1();
    public changeExpressionAC: MyAction1<number> = new MyAction1();
    private actionGridLayout: GridLayout<SettingItemUI>;
    private emojiGridLayout: GridLayout<SettingItemUI>;
    onStart() {
        this.actionGridLayout = new GridLayout(this.mScrollBox_1, true);
        let distance = GameConfig.GlobalConfig.getElement(1).ExpressionDistance;
        this.actionGridLayout.spacingX = distance;
        this.actionGridLayout.spacingY = distance;
        let actionConfigs = GameConfig.SquareActionConfig.getAllElement();
        for (let i = 0; i < actionConfigs.length; i++) {
            if (actionConfigs[i].type == 2) {
                continue;
            }
            this.actionGridLayout.addNode(SettingItemUI);
        }
        let actionNodes = this.actionGridLayout.nodes;
        actionNodes.forEach(element => {
            let btn = element.mButton_1;
            let index = actionNodes.indexOf(element);
            element.initId(ItemType.Action, actionConfigs[index].ID);
            btn.onClicked.add(() => {
                this.clickBtn(actionConfigs[index].ID, ItemType.Action)
            });
        })

        this.emojiGridLayout = new GridLayout(this.mScrollBox_2, true);
        this.emojiGridLayout.spacingX = distance;
        this.emojiGridLayout.spacingY = distance;
        let expressionConfigs = GameConfig.ChatExpression.getAllElement();
        for (let i = 0; i < expressionConfigs.length; i++) {
            this.emojiGridLayout.addNode(SettingItemUI);
        }
        let emojiNodes = this.emojiGridLayout.nodes;
        emojiNodes.forEach(element => {
            let btn = element.mButton_1;
            let index = emojiNodes.indexOf(element);
            element.initId(ItemType.Expression, actionConfigs[index].ID)
            btn.onClicked.add(() => {
                this.clickBtn(expressionConfigs[index].ID, ItemType.Expression)
            });
        })

        this.actionGridLayout.invalidate();
        this.emojiGridLayout.invalidate();
    }

    public clickBtn(configID: number, type: ItemType) {
        if (type == ItemType.Action) {
            this.changeActionAC.call(configID);
            this.actionGridLayout.nodes.forEach((element) => {
                element.refreshAction(configID);
            });
        } else if (type == ItemType.Expression) {
            this.changeExpressionAC.call(configID);
            this.emojiGridLayout.nodes.forEach((element) => {
                element.refreshAction(configID);
            });
        }
        UIHide(this);
    }
    public refreshActionUI() {
        if (!this.emojiGridLayout) {
            return;
        }
        this.emojiGridLayout.nodes.forEach((element) => {
            element.setDefaultUI();
        });
        this.actionGridLayout.nodes.forEach((element) => {
            element.setDefaultUI();
        });
    }
}