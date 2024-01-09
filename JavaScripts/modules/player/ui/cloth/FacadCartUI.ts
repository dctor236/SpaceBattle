import { GlobalModule } from "../../../../const/GlobalModule";
import { UIManager } from "../../../../ExtensionType";
import FacadCart_Generate from "../../../../ui-generate/facadModule/FacadCart_generate";
import { MGSMsgHome } from "../../../mgsMsg/MgsmsgHome";
import ShopData, { CoinType } from "../../../shop/ShopData";
import FacadMainUI from "./FacadMainUI";
import FacadTipUI from "./FacadTipUI";
import WearItemUI from "./WearItemUI";

export default class FacadCartUI extends FacadCart_Generate {
    private _itemPool: WearItemUI[] = []
    private _itemArr: WearItemUI[] = []
    private _buyIndex: number = 0
    protected onStart(): void {
        this.layer = mw.UILayerDialog;
        const facadTip = UIManager.getUI(FacadTipUI)
        const facadMainUI = UIManager.getUI(FacadMainUI)
        this.mBuyBtn.enable = false
        this.mCloseBtn.onClicked.add(() => {
            this.visible = false
        })
        this.mBuyBtn.onClicked.add(() => {
            MGSMsgHome.setBtnClick("buyall_btn")
            if (GlobalModule.MyPlayerC.Cloth.buyCurSelect(this._itemArr[this._buyIndex].config.ID)) {
                facadTip.onBtnClick.add(() => {
                    facadTip.onBtnClick.clear()
                    this._buyIndex++;
                    if (this._buyIndex == this._itemArr.length) {
                        this.visible = false
                        facadMainUI.mBtnSave.onClicked.broadcast()
                        this._buyIndex = 0;
                    } else {
                        this.mBuyBtn.onClicked.broadcast()
                    }
                })
            }
        })
    }

    protected onShow(buyArr: number[]): void {
        this.refreshData(buyArr)
        this.refreshPrice();
    }

    private refreshData(buyArr: number[]) {
        for (let i = 0; i < buyArr.length; i++) {
            let item = this.spawn()
            item.setData(buyArr[i])
            this._itemArr.push(item)
        }
        this.mScroll.scrollToStart()
        this.mWearCanvas.position = mw.Vector2.zero
        this.mWearCanvas.size = new mw.Vector2(230 * this._itemArr.length, 238)
    }

    public refreshPrice() {
        this._buyIndex = 0;
        let totol = 0;
        for (const item of this._itemArr) {
            if (item.config.priceType == 3) {
                totol += item.config.price
            }
        }
        this.mTotalPrice.text = totol.toString()
        this.mBuyBtn.enable = DataCenterC.getData(ShopData).getCoin(CoinType.PeaCoin) >= totol
    }

    private spawn(): WearItemUI {
        let item
        if (this._itemPool.length > 0) {
            item = this._itemPool.pop();
        } else {
            item = UIManager.create(WearItemUI);
            item.uiObject.size = new mw.Vector(200, 195)
            this.mWearCanvas.addChild(item.uiObject);
        }
        item.visible = true
        return item;
    }

    public unSpawn(item: WearItemUI) {
        for (let i = 0; i < this._itemArr.length; i++) {
            if (item.config.ID == this._itemArr[i].config.ID) {
                item.visible = false
                item.config = null
                this._itemArr.splice(i, 1)
                this._itemPool.push(item);
                break
            }
        }
        this.mScroll.scrollToStart()
        this.mWearCanvas.position = mw.Vector2.zero
        this.mWearCanvas.size = new mw.Vector2(230 * this._itemArr.length, 238)
        if (this._itemArr.length == 0) this.visible = false
    }

    protected onHide(): void {
        for (const item of this._itemArr) {
            item.visible = false
            item.config = null
            this._itemPool.push(item);
        }
        this._itemArr.length = 0
    }
}