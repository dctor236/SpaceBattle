import { GameConfig } from "../../../config/GameConfig";
import { IShopElement } from "../../../config/Shop";
import { UIHide, UIManager } from "../../../ExtensionType";
import SpotShop_Generate from "../../../ui-generate/shop/SpotShop_generate";
import GameUtils from "../../../utils/GameUtils";
import ShopData, { CoinType } from "../ShopData";
import ShopModuleC from "../ShopModuleC";

export class SpotShopUI extends SpotShop_Generate {
    protected onStart(): void {
        const nightData = DataCenterC.getData(ShopData)
        nightData.onBillChange.add((num: number) => {
            this.mMoneyTex1.text = num + ''
        });
    }

    protected curSel: number = -1

    protected initButtons(): void {
        super.initButtons();
        this.mTipsBuy_btn.onClicked.add(() => {
            if (this.curSel != -1) {
                const elem = GameConfig.Shop.getElement(this.curSel)
                let res = ModuleService.getModule(ShopModuleC).buyGoods(elem, 1)
                if (res) {
                    UIHide(this)
                }
            }
        })
        this.mClose_btn.onClicked.add(() => {
            UIManager.hideUI(this)
        })
    }

    protected onShow(elem: IShopElement): void {
        const nightData = DataCenterC.getData(ShopData)
        this.mMoneyTex1.text = nightData.goldCoin.toString()
        const itemElem = GameConfig.Item.getElement(elem.goodID)
        this.mTipsMsg_txt.text = elem.description
        this.mTipsGoodsName_txt.text = elem.Name
        this.mTipsBuy_txt.text = elem.money + ''
        if (itemElem.haveicon == 1) {
            this.mTipsIco_img.imageGuid = itemElem.Icon
        } else {
            GameUtils.setIconByAsset(itemElem.Icon, this.mTipsIco_img)
        }
        this.curSel = elem.id
        Event.dispatchToLocal('HideShorter', false)
    }

    protected onHide(): void {
        Event.dispatchToLocal('HideShorter', true)
    }

}