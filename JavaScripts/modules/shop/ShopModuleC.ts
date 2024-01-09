/*
 * @Author: jiezhong.zhang
 * @Date: 2023-06-15 17:33:56
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-06-25 10:40:37
 */
import { GameConfig } from "../../config/GameConfig";
import { IShopElement } from "../../config/Shop";
import { ShowItemType } from "../../const/GameEnum";
import { GlobalData } from "../../const/GlobalData";
import { UIManager } from "../../ExtensionType";
import { InputManager } from "../../InputManager";
import { TS3 } from "../../ts3/TS3";
import Tips from "../../ui/commonUI/Tips";
import RentGoodUI from "../../ui/RentGoodUI";
import GameUtils from "../../utils/GameUtils";
import { BagModuleC } from "../bag/BagModuleC";
import { GetItem } from "../bag/ui/GetItem";
import GuideMC from "../guide/GuideMC";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";
import ShopData, { CoinType } from "./ShopData";
import ShopModuleS from "./ShopModuleS";
import { ShopMain } from "./ui/ShopMain";
import { SpotShopUI } from "./ui/SpotShopUI";


export default class ShopModuleC extends ModuleC<ShopModuleS, ShopData>{

    protected onStart(): void {
    }

    protected onEnterScene(sceneType: number): void {
        this.init()
    }

    private init() {
        InputManager.instance.onKeyDown(mw.Keys.T).add(() => {
            this.showShopPanle()
        })
        GameObject.asyncFindGameObjectById('096CB6DF').then(o => {
            if (!o) return
            const allElem = GameConfig.Shop.getAllElement()

            for (let i = 0; i < allElem.length; i++) {
                const tri = o.getChildren()[i] as mw.Trigger
                const elem = allElem[i]
                const bagMc = ModuleService.getModule(BagModuleC)
                tri.onEnter.add(o => {
                    if (GameUtils.isPlayerCharacter(o)) {
                        if (bagMc.isShortCutFull()) {
                            Tips.show(GameUtils.getTxt("Danmu_Content_1367"))
                        } else {
                            if (bagMc.equipSlots.indexOf(elem.goodID.toString()) == -1)
                                UIManager.show(SpotShopUI, elem)
                            else
                                Tips.show(GameUtils.getTxt("Tips_1013"))
                        }
                    }
                })
                tri.onLeave.add(o => {
                    if (GameUtils.isPlayerCharacter(o)) {
                        UIManager.hide(SpotShopUI)
                    }
                })
            }
        })
        // setTimeout(() => {
        //     this.addWeapen(GameConfig.Shop.getElement(8))
        // }, 1000);
    }

    req_addCoin(type: CoinType, num: number, showUI: boolean = true) {
        this.net_onAddCoin(type, num, showUI)
        this.server.net_AddCoin(type, num);
    }

    net_onAddCoin(type: CoinType, num: number, showUI: boolean = true) {
        if (type == CoinType.Bill) {
            if (num < 0) {
                TS3.userMgr.costCoin(1, num)
            } else {
                TS3.userMgr.addCoin(1, num)
            }
        } else if (type == CoinType.PeaCoin) {
            if (num < 0) {
                ModuleService.getModule(BagModuleC).useItem(110009, num)
            } else {
                if (showUI) {
                    let gitfMap = new Map([[110009, num]]);
                    UIManager.hide(GetItem)
                    mw.UIService.show(GetItem, gitfMap, ShowItemType.Get);
                }
                TS3.userMgr.addItem(110009, num)
            }
        }
        this.data.addCoin(type, num);
        this.data.save(false);
    }

    req_setCoin(type: CoinType, num: number) {
        if (num < 0)
            return
        switch (type) {
            case CoinType.Bill:
                this.data.goldCoin = num
                break
            case CoinType.PeaCoin:
                this.data.peaCoin = num
                break
            default: break
        }
        this.data.save(false);
        this.server.net_SetCoin(type, num)
    }

    public showShopPanle() {
        // UIManager.setUIstate(HudGameUIState.HideAll)
        UIManager.show(ShopMain);
    }

    public buyGoods(info: IShopElement, count: number) {
        const cost = info.money * count;
        const money = this.data.getCoin(info.currency);
        if (money < cost) {
            Tips.show((GameConfig.SquareLanguage.Text_Text_552).Value)
            return false;
        }
        if (info.isCreatItem == 1) {
            this.addWeapen(info)
        } else {
            ModuleService.getModule(BagModuleC).addItem(info.goodID, count);
            this.data.subCount(info.id, count);
            this.server.net_bugGoods(info.id, count);
            Tips.show(GameConfig.SquareLanguage.Text_Text_551.Value)
            /**埋点 */
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功购买道具', { record: 'buy_successful' })
            MGSMsgHome.getShopItem(info.id)
        }
        this.req_addCoin(info.currency, -cost);
        return true

    }


    public addWeapen(info: IShopElement) {
        const bagMc = ModuleService.getModule(BagModuleC)
        if (bagMc.isShortCutFull()) {
            Tips.show(GameUtils.getTxt("Danmu_Content_1367"))
            return
        } else {
            if (bagMc.equipSlots.indexOf(info.goodID.toString()) == -1) {
                ModuleService.getModule(BagModuleC).addCreationItem(info.goodID, 9999999, false)
                setTimeout(() => {
                    ModuleService.getModule(GuideMC).showNpcTalk(StringUtil.format(GameUtils.getTxt("Tips_1027"), info.Name), GameUtils.getTxt("Tips_1028"))
                    ModuleService.getModule(BagModuleC).removeShortcutBarItem(info.goodID)
                    // Tips.show(info.Name + '已达租赁时间')
                }, 1000 * GlobalData.rentTime);
                UIManager.getUI(RentGoodUI).showIndex(bagMc.equipSlots.indexOf(info.goodID.toString()), info.Name)

                const elem = GameConfig.Item.getElement(info.goodID)
                Tips.show(StringUtil.format(GameUtils.getTxt("Tips_1014"), elem.Name))

            }
            else {
                Tips.show(GameUtils.getTxt("Tips_1013"))
                return
            }
        }
    }

    public getShopCount(ID: number) {
        return this.data.getItemCount(ID);
    }
}