/**
 * @Author       : 田可成
 * @Date         : 2023-05-30 11:13:56
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-06-02 16:22:44
 * @FilePath     : \mollywoodschool\JavaScripts\modules\player\ui\cloth\WearItemUI.ts
 * @Description  : 
 */

import { GameConfig } from "../../../../config/GameConfig";
import { IRoleAvatarElement } from "../../../../config/RoleAvatar";
import { GlobalModule } from "../../../../const/GlobalModule";
import { UIManager } from "../../../../ExtensionType";
import WearItem_Generate from "../../../../ui-generate/facadModule/WearItem_generate";
import GameUtils from "../../../../utils/GameUtils";
import { MGSMsgHome } from "../../../mgsMsg/MgsmsgHome";
import FacadCartUI from "./FacadCartUI";
import { FacadSelectEvent } from "./FacadItemUI";

export default class WearItemUI extends WearItem_Generate {
    private get mainUI() {
        return UIManager.getUI(FacadCartUI)
    }
    public config: IRoleAvatarElement = null
    protected onStart(): void {
        this.layer = mw.UILayerDialog;
        this.mCloseBtn.onClicked.add(() => {
            MGSMsgHome.setBtnClick("closedress_btn")
            GlobalModule.MyPlayerC.Cloth.changeRoleAvatar(this.config.ID)
            Event.dispatchToLocal(FacadSelectEvent, this.config.ID)
            this.mainUI.unSpawn(this)
            this.mainUI.refreshPrice()
        })
    }

    public setData(configID: number) {
        this.mPrice.visibility = mw.SlateVisibility.SelfHitTestInvisible
        this.mGoldImg.visibility = mw.SlateVisibility.SelfHitTestInvisible
        this.mGetTip.visibility = mw.SlateVisibility.Collapsed
        this.config = GameConfig.RoleAvatar.getElement(configID)
        if (this.config.icon) {
            this.mWearImg.imageGuid = this.config.icon;
        } else {
            GameUtils.setIconByAsset(this.config.iconByAsset, this.mWearImg)
        }

        this.mGoldImg.imageGuid = this.config.priceIcon
        this.mGoldImg.imageSize = new mw.Vector2(40, 40)
        this.mPrice.text = this.config.price.toString()
        if (this.config.priceType == 2) {
            this.mPrice.visibility = mw.SlateVisibility.Collapsed
            this.mGoldImg.visibility = mw.SlateVisibility.Collapsed
            this.mGetTip.visibility = mw.SlateVisibility.SelfHitTestInvisible
        } else if (this.config.priceType == 4) {
            this.mGoldImg.visibility = mw.SlateVisibility.Collapsed
            this.mPrice.visibility = mw.SlateVisibility.SelfHitTestInvisible
            this.mPrice.text = '暂无途径获取'
        }
    }
}