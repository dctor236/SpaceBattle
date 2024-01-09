import { GameConfig } from "../../../config/GameConfig";
import { IItemElement } from "../../../config/Item";
import { IRoleAvatarElement } from "../../../config/RoleAvatar";
import { EventsName, ShowItemType } from "../../../const/GameEnum";
import { UIManager } from "../../../ExtensionType";
import GiftItem_Generate from "../../../ui-generate/bag/GiftItem_generate";
import ItemInfoUI from "../../../ui/commonUI/ItemInfoUI";

/*
 * @Author: jiezhong.zhang
 * @Date: 2023-04-25 13:59:41
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-04-27 15:30:17
 */
export default class GiftItem extends GiftItem_Generate {
    private _itemCfg: IItemElement | IRoleAvatarElement;

    private _curType: ShowItemType;

    public clickAction: Action = new Action();

    public init(ID: number, num: number = 1, type: ShowItemType = ShowItemType.None) {
        this._curType = type;
        let cfg = null;
        if (type == ShowItemType.Gift || type == ShowItemType.Get) {
            cfg = GameConfig.Item.getElement(ID)
            this.imageIcon.imageGuid = cfg.Icon;
            this.textName.text = cfg.Name;
        } else {
            cfg = GameConfig.RoleAvatar.getElement(ID)
            this.imageIcon.imageGuid = cfg.icon;
            this.textName.text = cfg.name;
        }
        this._itemCfg = cfg;
        if (num && num !== 1) {
            this.textNum.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            this.textNum.text = "" + num;
        } else {
            this.textNum.visibility = mw.SlateVisibility.Hidden;
        }
    }

    protected onStart(): void {
        // this.button.onClicked.add(this.buttonClick);
    }

    private buttonClick = () => {
        switch (this._curType) {
            case ShowItemType.Gift:
            case ShowItemType.None:
                UIManager.show(ItemInfoUI, this._itemCfg.ID);
                break;
            case ShowItemType.Get:
                Event.dispatchToLocal(EventsName.REFRESH_GETITEM, this._itemCfg);
                break;
            default:
                break;
        }
    }
}