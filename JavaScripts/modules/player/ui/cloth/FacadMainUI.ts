/**
 * @Author       : 田可成
 * @Date         : 2023-05-25 15:35:17
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-06-02 18:37:32
 * @FilePath     : \mollywoodschool\JavaScripts\modules\player\ui\cloth\FacadMainUI.ts
 * @Description  : 
 */

import { GameConfig } from "../../../../config/GameConfig";
import { IRoleAvatarElement } from "../../../../config/RoleAvatar";
import { GlobalModule } from "../../../../const/GlobalModule";
import { UIManager } from "../../../../ExtensionType";
import FacadMain_Generate from "../../../../ui-generate/facadModule/FacadMain_generate";
import Tips from "../../../../ui/commonUI/Tips";
import P_GameHUD from "../../../gameModule/P_GameHUD";
import { MGSMsgHome } from "../../../mgsMsg/MgsmsgHome";
import ShopData, { CoinType } from "../../../shop/ShopData";
import { UIMultiScroller } from "../../../taskModule/UIMultiScroller";
import FacadCartUI from "./FacadCartUI";
import FacadItemUI, { FacadSelectEvent } from "./FacadItemUI";
import FacadTipUI from "./FacadTipUI";
import { Enums, TouchScript } from "./TouchScript";

export default class FacadMainUI extends FacadMain_Generate {
    private get module() {
        return GlobalModule.MyPlayerC.Cloth
    }
    private _curConfigIds: IRoleAvatarElement[];
    private _scroll: UIMultiScroller;
    private _curType: number = -1;
    private _tabMap: Map<number, mw.StaleButton> = new Map()
    private _curSelect: number = -1;
    private _isCheck: boolean = false

    public set curSelect(configID: number) {
        this._curSelect = configID
        if (this._curSelect == -1) {
            this.mBtnBuy.visibility = mw.SlateVisibility.Collapsed
            this.mBtnView.visibility = mw.SlateVisibility.Collapsed
        } else {
            const config = GameConfig.RoleAvatar.getElement(this._curSelect)
            if (config.priceType == 1 || config.priceType == 3) {
                this.mBtnBuy.visibility = mw.SlateVisibility.Visible
                this.mBtnView.visibility = mw.SlateVisibility.Collapsed
            } else if (config.priceType == 2 || config.priceType == 4) {
                this.mBtnBuy.visibility = mw.SlateVisibility.Collapsed
                this.mBtnView.visibility = mw.SlateVisibility.Visible
            }
        }
    }

    protected onStart(): void {
        this.layer = mw.UILayerDialog;
        const data = DataCenterC.getData(ShopData)
        this.mGold.text = data.getCoin(CoinType.Bill).toString();
        data.onPeaCoinChange.add((num: number) => {
            this.mGold.text = num.toString();
        });
        let num_row = Math.floor(this.mContent.size.x / (270 + 30))
        let num_col = Math.ceil(this.mContent.size.y / (260 + 20)) + 1
        this._scroll = new UIMultiScroller(this.mScrollBox, this.mContent, FacadItemUI, num_row, 30, 0, 270, 260, num_col, 30, 20);
        this._scroll.ItemCallback.add(this.onRefeshItem);

        for (let i = 0; i <= 7; i++) {
            this["btn" + i].onClicked.add(() => {
                switch (i) {
                    case 1:
                        MGSMsgHome.cloth("all_talent", "coat");
                        break;
                    case 2:
                        MGSMsgHome.cloth("all_talent", "pants");
                        break;
                    case 3:
                        MGSMsgHome.cloth("all_talent", "skirt");
                        break;
                    case 4:
                        MGSMsgHome.cloth("all_talent", "hair");
                        break;
                    case 5:
                        MGSMsgHome.cloth("all_talent", "tail");
                        break;
                    case 6:
                        MGSMsgHome.cloth("all_talent", "wings");
                        break;
                    default:
                        break;
                }
                this.showItemsbyType(i)
            })
            this._tabMap.set(i, this["btn" + i])
        }

        this.btnLeft.onClicked.add(() => {
            this.module.addRoatation(-1);
        })

        this.btnRight.onClicked.add(() => {
            this.module.addRoatation(1);
        })

        this.btnReset.onClicked.add(async () => {
            MGSMsgHome.setBtnClick("resetdress_btn")
            await this.module.resetPlayerCloth();
            Event.dispatchToLocal(FacadSelectEvent, this._curSelect)
        })

        this.mBtnClose.onClicked.add(() => {
            MGSMsgHome.setBtnClick("exit_btn")
            const notBuy = this.module.buySelectCart()
            if (!notBuy.result) {
                this.module.saveAvatarData()
                this.module.hideClothUI()
            } else {
                // if (notBuy.notBuyArr && notBuy.notBuyArr.length > 0)
                UIManager.show(FacadTipUI, 4, notBuy.notBuyArr)
                // else {
                //     Tips.show("梦幻魔法学院购买")
                // }
            }
        })

        this.mBtnSave.onClicked.add(() => {
            MGSMsgHome.setBtnClick("save_btn")
            const notBuy = this.module.buySelectCart()
            if (!notBuy.result) {
                this.module.saveAvatarData()
                this.module.hideClothUI()
            } else {
                if (notBuy.notBuyArr && notBuy.notBuyArr.length > 0)
                    UIManager.show(FacadCartUI, notBuy.notBuyArr)
                else {
                    if (notBuy.notBuyArr.indexOf(1008)) {
                        Tips.show("该服装无法购买")
                    } else {
                        Tips.show("梦幻魔法学院购买")
                    }
                }
            }
        })

        this.mBtnBuy.onClicked.add(() => {
            MGSMsgHome.setBtnClick("buy_btn")
            const config = GameConfig.RoleAvatar.getElement(this._curSelect)
            const shopData = DataCenterC.getData(ShopData)
            if (config.price > shopData.getCoin(CoinType.PeaCoin)) {
                Tips.show("钻石不足")
            } else {
                UIManager.show(FacadTipUI, 1, this._curSelect)
            }
        })

        this.mBtnView.onClicked.add(() => {
            UIManager.show(FacadTipUI, 3, this._curSelect)
        })

        this.mCheckBox.onClicked.add(() => {
            MGSMsgHome.setBtnClick("have_btn")
            this._isCheck = !this._isCheck
            this.mCheckBoxImg.visibility = this._isCheck ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Collapsed
            this.onlyShowIsHave(this._isCheck)
        })

        this._moveVec = [];
        mw.TimeUtil.delayExecute(() => {
            this._movePos = this.mTouch.position.multiply(1);
        }, 3)
    }

    private onRefeshItem = (index: number, renderItem: FacadItemUI) => {
        let cfg = this._curConfigIds[index];
        renderItem.setData(cfg);
    }

    public refreshScroll() {
        this._scroll.setData(this._curConfigIds);
    }

    protected onShow(...params: any[]): void {
        UIManager.getUI(P_GameHUD).mNewCloth.visibility = mw.SlateVisibility.Collapsed
        this.showItemsbyType(1)
        TouchScript.instance.addScreenListener(this.mTouch, this.onMoveTouchEvent, false);
        this.canUpdate = true
    }

    private showItemsbyType(i: number) {
        if (this._curType == i) {
            return
        }
        this.curSelect = -1;
        if (this._tabMap.has(this._curType)) this._tabMap.get(this._curType).setNormalImageColorByHex("#ffffffff")
        this._curType = i;
        if (this._tabMap.has(this._curType)) this._tabMap.get(this._curType).setNormalImageColorByHex("#ffff05ff")
        this._curConfigIds = GameConfig.RoleAvatar.getAllElement().filter(config => config.type == this._curType)
        this.onlyShowIsHave(this._isCheck)
    }

    private onlyShowIsHave(bool: boolean) {
        if (bool) {
            this._curConfigIds = this._curConfigIds.filter(config => {
                return this.module.hasSuit(config.ID)
            })
        } else {
            this._curConfigIds = GameConfig.RoleAvatar.getAllElement().filter(config => config.type == this._curType)
        }
        this.refreshScroll()
    }

    private _moveId: number = -1;
    private _moveVec: number[];
    private _dir: number = 0;
    private _movePos: mw.Vector2;
    private onMoveTouchEvent = (widget: mw.Widget, event: Enums.TouchEvent, x: number, y: number, inPointerEvent: mw.PointerEvent) => {
        if (this._movePos) {
            if (event == Enums.TouchEvent.DOWN) {
                if (this._moveId < 0) {
                    this._moveId = inPointerEvent.pointerIndex;
                    this._moveVec[0] = x;
                    this._moveVec[1] = y;

                }
            } else if (event == Enums.TouchEvent.MOVE) {
                if (this._moveId >= 0) {
                    let xoffset = x - this._moveVec[0];
                    let yoffset = y - this._moveVec[1];
                    this._dir = 0;
                    if (Math.abs(xoffset) > Math.abs(yoffset)) {
                        this._dir = Math.floor(xoffset);
                    }
                    this._moveVec[0] = x;
                    this._moveVec[1] = y;
                }
            } else if (event == Enums.TouchEvent.UP) {
                if (this._moveId >= 0) {
                    this._moveId = -1;
                    this._dir = 0;
                }
            }
        }
    }

    protected onHide(): void {
        if (this._tabMap.has(this._curType)) this._tabMap.get(this._curType).setNormalImageColorByHex("#ffffffff")
        this._curType = -1;
        TouchScript.instance.removeScreenListener(this.mTouch);
        this.canUpdate = false
    }

    onTouchStarted(inGemory: mw.Geometry, inPointerEvent: mw.PointerEvent): mw.EventReply {
        return TouchScript.instance.onTouchStarted(inGemory, inPointerEvent);
    }

    onTouchMoved(inGemory: mw.Geometry, inPointerEvent: mw.PointerEvent): mw.EventReply {
        return TouchScript.instance.onTouchMoved(inGemory, inPointerEvent);
    }

    onTouchEnded(inGemory: mw.Geometry, inPointerEvent: mw.PointerEvent): mw.EventReply {
        return TouchScript.instance.onTouchEnded(inGemory, inPointerEvent);
    }

    protected onUpdate(dt: number): void {
        if (this._dir != 0) {
            this.module.addRoatation(this._dir * dt);
            this._dir = 0;
        }
    }

}