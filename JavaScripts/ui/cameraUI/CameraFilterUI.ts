
import { GameConfig } from "../../config/GameConfig";
import { MyAction1, UIManager } from "../../ExtensionType";
import { MGSMsgHome } from "../../modules/mgsMsg/MgsmsgHome";
import CameraFilter_Generate from "../../ui-generate/uiTemplate/Camera/CameraFilter_generate";
import { GridLayout } from "../commonUI/GridLayout";
import { CameraMainUI } from "./CameraMainUI";
import { SettingItemUI } from "./SettingItemUI";

export default class CameraFilterUI extends CameraFilter_Generate {
    public changeFilterAC: MyAction1<number> = new MyAction1();
    public changeWeatherAC: MyAction1<number> = new MyAction1();
    private filterGridLayout: GridLayout<SettingItemUI>;
    private weatherGridLayout: GridLayout<SettingItemUI>;
    private firstClickFlag: boolean = true;
    private cameraUI: CameraMainUI;

    onStart() {
        this.initMain();
    }
    /**初始化UI */
    initMain() {
        this.cameraUI = UIManager.getUI(CameraMainUI);

        // 如果玩家是第一次点击按钮，就初始化按钮以及滚动框
        this.cameraUI.clickFilterBtnAC.add(() => {
            if (this.firstClickFlag) {// 标准的初始化流程，勿改函数顺序
                this.initScrollBox();
                this.addLayoutNodes();
                this.filterGridLayout.invalidate();
                this.weatherGridLayout.invalidate();
                this.firstClickFlag = false;
            }
        });
    }
    /**初始化滚动条 */
    initScrollBox() {
        this.filterGridLayout = new GridLayout(this.mScrollBox_1, true);
        let distance = GameConfig.GlobalConfig.getElement(1).ExpressionDistance;
        this.filterGridLayout.spacingX = distance;
        this.filterGridLayout.spacingY = distance;
        this.weatherGridLayout = new GridLayout(this.mScrollBox_2, true);
        this.weatherGridLayout.spacingX = distance;
        this.weatherGridLayout.spacingY = distance;
    }
    /**向滚动条中添加结点 */
    addLayoutNodes() {
        let filterConfigs = GameConfig.Filter.getAllElement();
        for (let i = 0; i < filterConfigs.length; i++) {
            this.filterGridLayout.addNode(SettingItemUI);
            this.filterGridLayout.nodes[i].initId(ItemType.Filter, filterConfigs[i].ID);
        }
        let eNodes = this.filterGridLayout.nodes;
        eNodes.forEach(element => {
            let btn = element.mButton_1;
            let index = eNodes.indexOf(element);
            btn.onClicked.add(() => {
                this.clickBtn(filterConfigs[index].ID, ItemType.Filter)
            });
        })


        let weatherConfigs = GameConfig.Weather.getAllElement();
        for (let i = 0; i < weatherConfigs.length; i++) {
            this.weatherGridLayout.addNode(SettingItemUI);
            this.weatherGridLayout.nodes[i].initId(ItemType.Weather, weatherConfigs[i].ID);
        }
        let weatherNode = this.weatherGridLayout.nodes;
        weatherNode.forEach(element => {
            let btn = element.mButton_1;
            let index = weatherNode.indexOf(element);
            btn.normalImageGuid = (weatherConfigs[index].Icon);
            btn.onClicked.add(() => {
                this.clickBtn(weatherConfigs[index].ID, ItemType.Weather)
            });
        })
    }

    public clickBtn(configID: number, type: ItemType) {
        if (type == ItemType.Filter) {
            this.changeFilterAC.call(configID);
            // MGSMsgHome.setBtnClick("滤镜a" + configID);
            this.filterGridLayout.nodes.forEach((element) => {
                element.refreshFilter(configID);
            });
        } else if (type == ItemType.Weather) {
            this.changeWeatherAC.call(configID);
            // MGSMsgHome.setBtnClick("天气b" + configID);
            this.weatherGridLayout.nodes.forEach((element) => {
                element.refreshFilter(configID);
            });
        }
    }
    public refreshFilterUI() {
        if (!this.filterGridLayout) {
            return;
        }
        let filterConfigs = GameConfig.Filter.getAllElement();
        for (let i = 0; i < filterConfigs.length; i++) {
            this.filterGridLayout.nodes[i].refreshFilter(filterConfigs[0].ID)
        }
        let weatherConfigs = GameConfig.Weather.getAllElement();
        for (let i = 0; i < weatherConfigs.length; i++) {
            this.weatherGridLayout.nodes[i].refreshFilter(weatherConfigs[0].ID);
        }
    }
}
export enum ItemType {
    /**滤镜 */
    Filter = 1,
    /**天气 */
    Weather = 2,
    /**动作 */
    Action = 3,
    /**表情 */
    Expression = 4,
}


