/** 
 * @Author       : 陆江帅
 * @Date         : 2023-03-06 10:44:59
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-04-28 16:00:59
 * @FilePath     : \mollywoodschool\JavaScripts\modules\Bag\ui\GoodsItem.ts
 * @Description  : 
 */
import { GameConfig } from "../../../config/GameConfig";
import { IItemElement } from "../../../config/Item";
import { GlobalData } from "../../../const/GlobalData";
import GoodsItem_Generate from "../../../ui-generate/bag/GoodsItem_generate";
import GameUtils from "../../../utils/GameUtils";
import { ItemInfo, ItemType } from "../BagDataHelper";

export class GoodsItem extends GoodsItem_Generate {
    public id: string;
    public count: number;
    public config: IItemElement;
    public info: ItemInfo;

    get clickBtn() {
        return this.mBtn;
    }

    get closeBtn() {
        return this.mClose;
    }

    protected onStart(): void {
        this.restore();
    }

    protected onShow(...params: any[]): void {

    }

    public setData(info: ItemInfo) {
        if (!info) {
            this.restore()
            return;
        }
        const config = GameConfig.Item.getElement(info.configID);
        this.id = info.id;
        this.count = info.count;
        this.config = config;
        this.info = info;
        if (config.haveicon == 1) {
            this.mIcon.imageGuid = config.Icon;
        } else {
            GameUtils.setIconByAsset(config.Icon, this.mIcon)
        }
        this.mInfoCon.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.mInfo.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.mBg.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.mBtn.visibility = mw.SlateVisibility.Visible;
        this.mClose.visibility = mw.SlateVisibility.Visible;
        this.mSelect.visibility = mw.SlateVisibility.Collapsed;
        if ([ItemType.Wand, ItemType.Ring].includes(config.ItemType)) {
            this.mInfoCon.visibility = mw.SlateVisibility.Collapsed;
            // this.mItemInfo.text = "LV." + config.Level
        } else if (config.ItemType === ItemType.Tool) {
            this.durProgress.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            this.durProgress.currentValue = info.curDurability / config.Durability
            this.mInfo.text = info.curDurability + "/" + config.Durability
        } else if ([ItemType.Consumable, ItemType.Material].includes(config.ItemType)) {
            this.mInfo.text = "x" + info.count
        } else if ([ItemType.LiYue, ItemType.Sundries].includes(config.ItemType)) {
            if (info.count > 1) {
                this.mInfo.text = "x" + info.count
            } else {
                this.mInfoCon.visibility = mw.SlateVisibility.Collapsed;
            }
        }
    }

    public restore() {
        this.mInfoCon.visibility = mw.SlateVisibility.Collapsed;
        this.durProgress.visibility = mw.SlateVisibility.Collapsed;
        this.mInfo.visibility = mw.SlateVisibility.Collapsed;
        this.mBg.visibility = mw.SlateVisibility.Collapsed;
        this.mSelect.visibility = mw.SlateVisibility.Collapsed;
        this.mBtn.visibility = mw.SlateVisibility.Collapsed;
        this.mClose.visibility = mw.SlateVisibility.Collapsed;
        this.mIcon.imageGuid = GlobalData.blankSlotBg;
        this.config = null;
        this.id = "";
        this.count = 0;
    }

}