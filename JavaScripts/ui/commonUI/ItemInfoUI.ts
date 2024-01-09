/*
 * @Author: jiezhong.zhang
 * @Date: 2023-04-26 09:24:17
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-04-26 09:28:57
 */
import { UIManager } from "../../ExtensionType";
import { GameConfig } from "../../config/GameConfig";
import { IItemElement } from "../../config/Item";
import ItemInfoUI_Generate from "../../ui-generate/uiTemplate/common/ItemInfoUI_generate";

export default class ItemInfoUI extends ItemInfoUI_Generate {

    private _itemCfg: IItemElement;

    protected onStart(): void {
        this.layer = mw.UILayerTop;
        this.buttonExit.onClicked.add(() => {
            UIManager.hide(ItemInfoUI);
        })
    }

    protected onShow(...params: any[]): void {
        let ID = params[0];

        this._itemCfg = GameConfig.Item.getElement(ID);

        this.textName.text = this._itemCfg.Name;
        this.textDescription.text = this._itemCfg.description;
        this.imageIcon.imageGuid = this._itemCfg.Icon;
    }
}