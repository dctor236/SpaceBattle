/*
 * @Author: jiezhong.zhang
 * @Date: 2023-04-16 18:07:42
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-18 19:13:48
 */
import { GameConfig } from "../../../config/GameConfig";
import { IItemElement } from "../../../config/Item";
import { EventsName, ShowItemType } from "../../../const/GameEnum";
import { GlobalModule } from "../../../const/GlobalModule";
import { UIManager } from "../../../ExtensionType";
import GetItem_Generate from "../../../ui-generate/bag/GetItem_generate";
import Tips from "../../../ui/commonUI/Tips";
import { CoinType } from "../../shop/ShopData";
import { BagModuleC } from "../BagModuleC";
import GiftItem from "./GiftItem";

const ITEM_SIZE: Vector2 = new Vector2(150, 150);

export class GetItem extends GetItem_Generate {

    /** 礼包道具item数组 */
    private _itemArr: GiftItem[] = [];

    private _defaultSize: Vector2;
    isCoin: boolean;


    protected onStart(): void {
        super.onStart();
        this.layer = mw.UILayerTop;
        Event.addLocalListener(EventsName.REFRESH_GETITEM, this.refreshDes);
    }

    protected initButtons() {
        super.initButtons();
        this.mAccept.onClicked.add(() => {
            this.hideUI();
        })
    }

    private coinsMap: Map<number, CoinType> = new Map([[90001, CoinType.PeaCoin], [90002, CoinType.Bill]])

    //Map<itemID，数量 >
    onShow(itemMap: Map<number, number>, showType: ShowItemType, noAdd: boolean = true) {
        this._defaultSize = this.canvasItems.size.clone();
        const needLength = itemMap.size        //不够的先创建
        const length = this._itemArr.length
        if (length <= needLength) {
            for (let index = 0; index < needLength - length; index++) {
                this.createItem()
            }
        }

        let index = 0;
        for (const [id, num] of itemMap) {
            const item = this._itemArr[index]
            index++;
            //说明是服装
            item.init(id, num, showType)
            if (showType == ShowItemType.Cloth) {
                this.mDesc.text = GameConfig.RoleAvatar.getElement(id).desc
                // ModuleService.getModule(NightPlayModuleC).addCoin(this.coinsMap.get(id), num)
            } else {
                this.mDesc.text = GameConfig.Item.getElement(id).description
                if (!noAdd)
                    ModuleService.getModule(BagModuleC).addItem(id, num);
            }
            item.uiObject.visibility = mw.SlateVisibility.SelfHitTestInvisible
        }

        let newX = this._itemArr.length * (ITEM_SIZE.x + 10)
        if (newX > this._defaultSize.x) {
            this.canvasItems.size = new Vector2(newX, this._defaultSize.y);
        } else {
            this.canvasItems.size = this._defaultSize;
        }
        this.canvasItems.position = Vector2.zero;
        this.canvasItems.invalidateLayoutAndVolatility();
        this._itemArr[0].button.onClicked.broadcast();

        itemMap.clear()
        itemMap = null;

    }


    private refreshDes = (itemCfg: IItemElement) => {
        this.mDesc.text = itemCfg.description;
    }
    protected onHide(): void {
        for (const item of this._itemArr) {
            item.uiObject.visibility = mw.SlateVisibility.Collapsed
        }
    }








    /**
     * 创建礼物Item
     */
    private createItem(): GiftItem {
        let item = UIManager.create(GiftItem);
        this.canvasItems.addChild(item.uiObject);
        item.uiObject.size = ITEM_SIZE;
        this._itemArr.push(item);
        return item;
    }


    private hideUI() {
        UIManager.hide(GetItem);
    }
}