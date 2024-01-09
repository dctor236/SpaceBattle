/** 
 * @Author       : 郝建琦
 * @Date         : 2023-03-20 17:01:32
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-16 13:19:28
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\ui\MakePropUI.ts
 * @Description  : 
 */
import { ICreateItemElement } from "../../../config/CreateItem";
import { GameConfig } from "../../../config/GameConfig";
import { UIManager } from "../../../ExtensionType";
import { InputManager } from "../../../InputManager";
import MakePropUI_Generate from "../../../ui-generate/skill/MakePropUI_generate";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
import { PropItem } from "./PropItem";

export default class MakePropUI extends MakePropUI_Generate {

    /**所有造物物品 */
    private _allCreation: ICreateItemElement[] = []
    /**物品对象池 */
    private _itemPool: PropItem[] = [];
    /**物品使用池 */
    private _usePool: PropItem[] = [];
    private _oriSize: mw.Vector2
    protected onStart(): void {
        this._oriSize = this.rootCanvas.size.clone()
        this._allCreation = GameConfig.CreateItem.getAllElement()
        this.guideButton.visibility = mw.SlateVisibility.Visible
    }

    protected onShow(pos: mw.Vector2, skillID: number, clickFun: (creationID: number) => {}): void {
        pos.subtract(this._oriSize)
        this.rootCanvas.position = pos;
        const Level = skillID % 100
        this.refreshMakeProp(Level, clickFun);
        setTimeout(() => {
            InputManager.instance.onTouch.add(() => {
                mw.UIService.hideUI(this)
            });
        }, 64);
    }

    protected onHide(): void {
        InputManager.instance.onTouch.clear();
        this.clearItemPool();
        if (this._itemPool.length >= 10) {
            const items = this._itemPool.splice(10);
            for (const item of items) {
                item.destroy();
            }
        }
    }

    public refreshMakeProp(level: number, clickFun: (creationID: number) => {}) {
        /**造物物品 */
        const items = this._allCreation.filter(v => v.Level <= level)
        this.mScroll.scrollToStart();
        this.clearItemPool();

        for (const info of items) {
            const config = GameConfig.Item.getElement(info.ItemID);
            let item: PropItem;
            if (this._itemPool.length > 0) {
                item = this._itemPool.shift();
            } else {
                item = UIManager.create(PropItem);
                item.clickBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
                this.mItemContent.addChild(item.uiObject);
                item.uiObject.size = item.rootCanvas.size;
            }
            this._usePool.push(item);
            item.uiObject.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            item.setData(config);
            item.clickBtn.onClicked.add(() => {
                /**埋点 */
                MGSMsgHome.createItem(item.itemID)
                clickFun(info.ID)
                this.hide()
            })
        }
    }

    /** 
    * 清空对象池
    * @return 
    */
    public clearItemPool() {
        if (this._usePool.length === 0) {
            return;
        }
        for (const item of this._usePool) {
            this._itemPool.push(item);
            item.clickBtn.onClicked.clear();
            item.uiObject.visibility = mw.SlateVisibility.Collapsed;
        }
        this._usePool.length = 0;
    }
}
