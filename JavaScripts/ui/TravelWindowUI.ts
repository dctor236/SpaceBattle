/** 
 * @Author       : 陆江帅
 * @Date         : 2023-03-16 14:06:38
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-04 13:22:38
 * @FilePath     : \mollywoodschool\JavaScripts\ui\TravelWindowUI.ts
 * @Description  : 
 */
import { GameConfig } from "../config/GameConfig";
import { IGameJumperElement } from "../config/GameJumper";
import { GlobalModule } from "../const/GlobalModule";
import { UIHide } from "../ExtensionType";
import { GameModuleC } from "../modules/gameModule/GameModuleC";
import { MGSMsgHome } from "../modules/mgsMsg/MgsmsgHome";
import UI_Travel_Window_Generate from "../ui-generate/uiTemplate/UI_Travel_Window_generate";
import GameUtils from "../utils/GameUtils";
import Tips from "./commonUI/Tips";

export class TravelWindowUI extends UI_Travel_Window_Generate {

    /** 当前配置 */
    private config: IGameJumperElement = null;

    protected onStart(): void {
        this.mBtnBack.onClicked.add(() => {
            MGSMsgHome.setBtnClick("transfer_close")
            UIHide(this);
        });
        this.mBTnJoin.onClicked.add(() => {
            if (!this.config) {
                return;
            }
            if (GlobalModule.MyPlayerC.Action.curId > 0) {
                Tips.show(GameConfig.SquareLanguage.Danmu_Content_1053.Value);
                return;
            }
            MGSMsgHome.setBtnClick("transfer")
            let isOverseas = GameUtils.systemLanguageIndex != 1;
            let gameId = isOverseas ? this.config.gameCode : this.config.gameId;

            ModuleService.getModule(GameModuleC).changeGame(gameId);
        });
    }

    protected onShow(isMainOpen: boolean): void {
        this.config = GameConfig.GameJumper.getElement(1);
        this.mImg.imageGuid = this.config.icon;
        let isOverseas = GameUtils.systemLanguageIndex != 1;
        console.log('isOverseas:' + isOverseas);
        this.mTitleImg.imageGuid = isOverseas ? this.config.title1 : this.config.title2;
        MGSMsgHome.setPageMGS("transfer", isMainOpen ? "main_ui" : "scene");
    }
}
