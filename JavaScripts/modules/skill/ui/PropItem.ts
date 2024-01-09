import { IItemElement } from "../../../config/Item";
import PropItem_Generate from "../../../ui-generate/skill/PropItem_generate";

/**
 * @Author       : 田可成
 * @Date         : 2023-03-09 10:46:03
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-12 09:43:15
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\ui\PropItem.ts
 * @Description  : 
 */
export class PropItem extends PropItem_Generate {

    public itemID: number

    public config: IItemElement;

    get clickBtn() {
        return this.mBtn;
    }
    protected onStart(): void {
    }

    public setData(config: IItemElement) {
        this.config = config;
        this.itemID = config.ID;
        this.mIcon.imageGuid = config.Icon;
        this.mName.text = config.Name
    }
}