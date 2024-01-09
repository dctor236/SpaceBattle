/** 
 * @Author       : 陆江帅
 * @Date         : 2023-06-11 13:32:14
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-06-19 13:54:39
 * @FilePath     : \mollywoodschool\JavaScripts\modules\shop\ui\ShopMain.ts
 * @Description  : 
 */

import { GameConfig } from "../../../config/GameConfig";
import { IShopElement } from "../../../config/Shop";
import { GlobalData } from "../../../const/GlobalData";
import ShopMain_Generate from "../../../ui-generate/shop/ShopMain_generate";
import Tips from "../../../ui/commonUI/Tips";
import { BagModuleC } from "../../bag/BagModuleC";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
import ShopData, { CoinType } from "../ShopData";
import ShopModuleC from "../ShopModuleC";
import { ShopItem, moneyIcon } from "./ShopItem";

export enum ShopType {
    Gold = 1,
    Silver,
    Moon,
}

const orgTagColor = mw.LinearColor.colorHexToLinearColor("89835AFF");
const selectTagColor = mw.LinearColor.colorHexToLinearColor("FFFFFFFF");

export class ShopMain extends ShopMain_Generate {

    private _allConfig: Map<number, IShopElement> = new Map();
    /**商店当前类型 */
    private _curType: ShopType;
    /**选中标签 */
    private _selectTag: mw.StaleButton;
    /**选中商品 */
    private _curGoods: ShopItem;
    /**物品对象池 */
    private _itemPool: ShopItem[] = [];
    /**物品使用池 */
    private _usePool: ShopItem[] = [];
    /**下标 */
    private _index: number = 0;
    /**分帧执行数组 */
    private _delayLst: number[] = [];

    protected onAwake(): void {
        super.onAwake();
        this.layer = mw.UILayerOwn;
    }

    protected onStart(): void {
        for (const goods of GameConfig.Shop.getAllElement()) {
            this._allConfig.set(goods.id, goods);
        }

        const nightData = DataCenterC.getData(ShopData)
        nightData.onBillChange.add((num: number) => {
            this.refreshMoney(CoinType.Bill, num)
        });
        nightData.onPeaCoinChange.add((num: number) => {
            this.refreshMoney(CoinType.PeaCoin, num)
        });
    }

    protected initButtons(): void {
        super.initButtons();
        this.mClose_btn.onClicked.add(() => {
            this.hide();
        })

        this.mTipsClose.onClicked.add(() => {
            this._curGoods = null;
            this.mTips.visibility = mw.SlateVisibility.Collapsed;
        })


        this.mTipsBuy.onClicked.add(() => {
            const num = parseInt(this.mTipsInput.text)
            this.onBuyGoods(num);
            this._curGoods = null;
            this.mTips.visibility = mw.SlateVisibility.Collapsed;
        })

        this.mTipsAdd.onClicked.add(() => {
            let num = parseInt(this.mTipsInput.text)
            num++;
            this.mTipsInput.text = num.toString();
        })

        this.mTipsSub.onClicked.add(() => {
            let num = parseInt(this.mTipsInput.text);
            num--;
            this.mTipsInput.text = num.toString();
        })

        this.mTipsInput.onTextChanged.add(() => {
            if (!this._curGoods) {
                return
            }
            let num = parseInt(this.mTipsInput.text);
            const info = this._curGoods.info
            if (num < 1) {
                Tips.show("最少购买一个");
                num = 1;
            } else if (num > 1) {
                if (info.limitCount == 1) {
                    Tips.show(GameConfig.SquareLanguage.Text_Shop5.Value)
                    num = 1;
                } else if (info.limitCount > 1) {
                    let count = ModuleService.getModule(ShopModuleC).getShopCount(info.id);
                    if (num >= count) {
                        Tips.show("没有更多了");
                        num = count;
                    }
                }
            }
            this.mTipsInput.text = num.toString();
            this.mTipsPrice.text = (info.money * num).toString()
        })

        for (let i = 1; i <= 4; i++) {
            this["mGoodsType" + i].normalImageColor = orgTagColor
            this["mGoodsType" + i].onClicked.add(() => {
                if (this._selectTag) {
                    // if (this._selectTag === this.mGoodsType4) {
                    //     ModuleService.getModule(GiftModuleC).hideGiftUI();
                    // }
                    this._selectTag.normalImageColor = orgTagColor;
                }
                this._selectTag = this["mGoodsType" + i];
                this._selectTag.normalImageColor = selectTagColor;
                this.refreshShopType(i);
                // if (i === 4) {
                //     ModuleService.getModule(GiftModuleC).showGiftUI(GiftType.Star);
                // }
            })
        }
    }

    protected onShow(type: ShopType = ShopType.Gold, ...params: any[]): void {
        MGSMsgHome.setPageMGS("shop");
        this["mGoodsType" + type].onClicked.broadcast();
        this.showTagButton();
        const nightData = DataCenterC.getData(ShopData)
        this.moonNum.text = nightData.peaCoin.toString()
        this.goldNum.text = nightData.goldCoin.toString()
        this.silverNum.text = 999 + ''
    }

    protected onHide(): void {
        // UIManager.setUIstate(HudGameUIState.Show)
        this.clearItemPool();
        this._curType = null;
        // if (this._selectTag === this.mGoodsType4) {
        //     ModuleService.getModule(GiftModuleC).hideGiftUI();
        // }
        this._selectTag = null;
        // let luckyModuleC = ModuleService.getModule(LuckyModuleC);
        // if (luckyModuleC.needShowLuckyUI) {
        //     luckyModuleC.showLuckyUI();
        // }
    }

    private showTagButton() {
        // let startID = ModuleService.getModule(GiftModuleC).getNearGiftID(GiftType.Star);
        // this.mGoodsType4.visibility = startID > 0 ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
    }

    private refreshShopType(type: ShopType) {
        if (this._curType === type) {
            return;
        }
        this._curType = type;
        this.clearDelay();
        this.clearItemPool();
        this.mScrollView.scrollToStart();
        const bagModuleC = ModuleService.getModule(BagModuleC)
        const goodsLst: IShopElement[] = [];
        const hasShop: number[] = [];
        for (const shopCfg of this._allConfig.values()) {
            if (shopCfg.currency === type) {
                goodsLst.push(shopCfg);
                if (shopCfg.limitCount === 1) {
                    bagModuleC.getItem(shopCfg.goodID) && hasShop.push(shopCfg.id);
                } else if (shopCfg.limitCount > 1) {
                    const count = ModuleService.getModule(ShopModuleC).getShopCount(shopCfg.id);
                    if (count <= 0) {
                        hasShop.push(shopCfg.id);
                    }
                }
            }
        }
        if (goodsLst.length === 0) {
            return;
        }
        goodsLst.sort((a, b) => {
            if (hasShop.includes(a.id) && !hasShop.includes(b.id)) {
                return 1;
            } else if (!hasShop.includes(a.id) && hasShop.includes(b.id)) {
                return -1;
            }
            return a.sort - b.sort;
        })

        for (let index = 0; index < goodsLst.length; index++) {
            const delayID = TimeUtil.delayExecute(() => {
                const info = goodsLst[index]
                let item: ShopItem;
                if (this._itemPool.length > 0) {
                    item = this._itemPool.shift();
                } else {
                    item = mw.UIService.create(ShopItem);
                    item.clickBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
                    this.mContent.addChild(item.uiObject);
                    item.uiObject.size = item.rootCanvas.size;
                    item.index = this._index++;
                }
                this._usePool.push(item);
                item.uiObject.visibility = mw.SlateVisibility.SelfHitTestInvisible;
                item.setData(info);
                item.clickBtn.onClicked.add(() => {
                    this.showBuyTips(item)
                })
            }, index)
            this._delayLst.push(delayID);
        }
    }

    private showBuyTips(item: ShopItem) {
        this._curGoods = item;
        this.mTipsInput.text = "1";
        this.mTips.visibility = mw.SlateVisibility.SelfHitTestInvisible;

        const info = item.info;
        const config = GameConfig.Item.getElement(info.goodID);
        this.mTipsItemName.text = config.Name;
        this.mTipsItemIcon.imageGuid = config.Icon;
        this.mTipsDesc.text = config.description;
        this.mTipsPrice.text = info.money.toString();
        this.mTipsMoneyIcon.imageGuid = moneyIcon[info.currency];
        this.mTipsItemBg.imageColor = mw.LinearColor.colorHexToLinearColor(GlobalData.levelColor[config.Level]);
        this.mTipsItemState.fontColor = mw.LinearColor.colorHexToLinearColor(GlobalData.levelColor[config.Level]);
        for (let i = 0; i < 5; i++) {
            let star = this.mTipsItemStar.getChildAt(i) as mw.Image;
            star.visibility = config.Level > i ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Collapsed;
        }
    }

    private onBuyGoods(count: number) {
        if (!this._curGoods) {
            return;
        }
        const info = this._curGoods.info;
        ModuleService.getModule(ShopModuleC).buyGoods(info, count);
        this._curGoods.refreshState();
        this._curGoods = null;
    }

    public refreshMoney(type: CoinType, num: number) {
        switch (type) {
            case CoinType.Bill:
                this.goldNum.text = num.toString()
                break;
            case CoinType.PeaCoin:
                this.silverNum.text = num.toString()
                break;
            // case CoinType.MoonCoin:
            //     this.moonNum.text = num.toString()
            //     break;
            default:
                break;
        }
    }

    /**
     * 清除分帧数组
     * @returns 
     */
    private clearDelay() {
        if (this._delayLst.length === 0) {
            return
        }
        for (const id of this._delayLst) {
            TimeUtil.clearDelayExecute(id)
        }
        this._delayLst.length = 0;
    }

    /** 
     * 清空对象池
     * @return 
     */
    private clearItemPool() {
        if (this._usePool.length === 0) {
            return;
        }
        for (const item of this._usePool) {
            this._itemPool.push(item);
            item.clickBtn.onClicked.clear();
            item.uiObject.visibility = mw.SlateVisibility.Collapsed;
        }
        this._itemPool.sort((a, b) => {
            return a.index - b.index;
        })
        this._usePool.length = 0;
    }
}