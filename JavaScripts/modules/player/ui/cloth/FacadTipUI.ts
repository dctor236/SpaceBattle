/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-10 10:54:51
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-10 19:51:41
 * @FilePath: \vine-valley\JavaScripts\modules\player\ui\cloth\FacadTipUI.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @Author       : 田可成
 * @Date         : 2023-05-29 09:37:47
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-31 18:16:22
 * @FilePath     : \mollywoodschool\JavaScripts\modules\player\ui\cloth\FacadTipUI.ts
 * @Description  : 
 */

import { GameConfig } from "../../../../config/GameConfig";
import { GlobalModule } from "../../../../const/GlobalModule";
import { MyAction, UIManager } from "../../../../ExtensionType";
import FacadTip_Generate from "../../../../ui-generate/facadModule/FacadTip_generate";
import GameUtils from "../../../../utils/GameUtils";
import { MGSMsgHome } from "../../../mgsMsg/MgsmsgHome";
import FacadMainUI from "./FacadMainUI";

export default class FacadTipUI extends FacadTip_Generate {
    private _curSelect: number = -1;
    private _notBuyArr: number[] = [];
    public onBtnClick: MyAction = new MyAction()
    protected onStart(): void {
        this.layer = mw.UILayerDialog;
        this.mConfirmYes.onClicked.add(() => {
            MGSMsgHome.setBtnClick("buyon_btn")
            if (GlobalModule.MyPlayerC.Cloth.buyCurSelect(this._curSelect)) {
                UIManager.getUI(FacadMainUI).refreshScroll()
            }
        })
        this.mConfirmNo.onClicked.add(() => {
            this.visible = false
        })

        this.mExitYes.onClicked.add(() => {
            // for (let i = 0; i < this._notBuyArr.length; i++) {
            //     GlobalModule.MyPlayerC.Cloth.changeRoleAvatar(this._notBuyArr[i])
            // }
            GlobalModule.MyPlayerC.Cloth.hideClothUI()
            this.visible = false
        })

        this.mExitNo.onClicked.add(() => {
            this.visible = false
        })

        this.mBuyBtn.onClicked.add(() => {
            this.visible = false
            this.onBtnClick.call()
        })

        this.mGetBtn.onClicked.add(() => {
            this.visible = false
        })
    }

    protected onShow(type: number, ...params: any[]): void {
        this.mConfirmTip.visibility = mw.SlateVisibility.Collapsed
        this.mBuyTip.visibility = mw.SlateVisibility.Collapsed
        this.mGetTip.visibility = mw.SlateVisibility.Collapsed
        this.mExitTip.visibility = mw.SlateVisibility.Collapsed
        this._curSelect = params[0]
        const elem = GameConfig.RoleAvatar.getElement(this._curSelect)
        switch (type) {
            case 1:
                this.mConfirmTip.visibility = mw.SlateVisibility.SelfHitTestInvisible
                break;
            case 2:
                this.mBuyTip.visibility = mw.SlateVisibility.SelfHitTestInvisible
                if (elem.icon) {
                    this.mBuyImage.imageGuid = GameConfig.RoleAvatar.getElement(this._curSelect).icon
                } else {
                    GameUtils.setIconByAsset(elem.iconByAsset, this.mBuyImage)
                }

                break;
            case 3:
                if (elem.priceType != 4) {
                    this.mGetTxt.text = GameUtils.stringFormat(GameConfig.SquareLanguage.Change_24.Value, elem.getTip)
                }
                else {
                    this.mGetTxt.text = "暂无途径获取"
                }
                this.mGetTip.visibility = mw.SlateVisibility.SelfHitTestInvisible
                this.mGetImage.imageGuid = GameConfig.RoleAvatar.getElement(this._curSelect).icon
                break;
            case 4:
                this.mExitTip.visibility = mw.SlateVisibility.SelfHitTestInvisible
                this._notBuyArr = params[0]
                break;
            default:
                break;
        }
    }
}