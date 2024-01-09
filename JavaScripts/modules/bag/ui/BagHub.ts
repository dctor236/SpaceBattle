import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
/**
 * @Author       : 陆江帅
 * @Date         : 2023-03-06 10:44:59
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-06-06 11:26:24
 * @FilePath     : \mollywoodschool\JavaScripts\modules\bag\ui\BagHub.ts
 * @Description  :
 */
import { GameConfig } from "../../../config/GameConfig";
import { EventsName } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { Tween, UIManager } from "../../../ExtensionType";
import BagHub_Generate from "../../../ui-generate/bag/BagHub_generate";
import Tips from "../../../ui/commonUI/Tips";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
import SkillModule_Client from "../../skill/SkillModule_Client";
import { ItemInfo } from "../BagDataHelper";
import { BagModuleC } from "../BagModuleC";
import { BagInteraction } from "./BagInteraction";
import { GoodsItem } from "./GoodsItem";
import GameUtils from '../../../utils/GameUtils';

const creationViewPos = mw.Vector2.zero;

const outPixelPos = mw.Vector2.zero;

const outViewPos = mw.Vector2.zero;

export class BagHub extends BagHub_Generate {
    /**快捷栏物品 */
    private _equipItems: ItemInfo[];
    /**选中物品 */
    private _selectEquip: GoodsItem;
    /**UI激活状态 */
    private _active: boolean;
    /**插槽 */
    private _allSlot: GoodsItem[] = [];
    /**快捷栏状态 */
    private _isShow: boolean = true;
    /**选中物品时长埋点 */
    private _selectTime: number;

    private get bagModuleC() {
        return ModuleService.getModule(BagModuleC);
    }

    protected onStart(): void {
        this.initEvents();
        /**初始化快捷栏 */
        for (let index = 1; index <= GlobalData.maxShortcutBar; index++) {
            const item = mw.UIService.create(GoodsItem);
            item.clickBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
            this.mShortcutBar.addChild(item.uiObject);
            item.uiObject.size = item.rootCanvas.size;
            item.restore();
            item.clickBtn.onClicked.add(() => {
                /** 埋点 */
                MGSMsgHome.bagClickEvent("backpack_click6");
                if (GlobalData.skillCD > 0) {
                    Tips.show(GameUtils.getTxt("Tips_1001"))
                    return;
                }
                this.selectItem(item);
            });
            item.closeBtn.onClicked.add(() => {
                if (GlobalData.skillCD > 0 || !GlobalData.isChangeBar) {
                    return;
                }

                if (this._selectEquip && this._selectEquip.id === item.id) {
                    this.unloadItem(item);
                }
                this.bagModuleC.removeShortcutBarItem(item.id);
            });
            this._allSlot.push(item);
        }
        this.guideBtn.visibility = mw.SlateVisibility.Hidden;
        this.mGuideBtn.visibility = mw.SlateVisibility.Hidden;
    }

    protected initButtons(): void {
        super.initButtons();

        this.mClearBar.onClicked.add(() => {
            if (GlobalData.skillCD > 0 || !GlobalData.isChangeBar) {
                return;
            }
            /** 埋点 */
            MGSMsgHome.bagClickEvent("backpack_click5");
            this.bagModuleC.clearShortCutBar();
        });

        this.mHideBar.onClicked.add(() => {
            /** 埋点 */
            MGSMsgHome.bagClickEvent("backpack_click4");
            const angle = this._isShow ? 180 : 0;
            const visibility = this._isShow ? mw.SlateVisibility.Collapsed : mw.SlateVisibility.SelfHitTestInvisible;
            this.mBarCon.visibility = visibility;
            this.mHideBar.renderTransformAngle = angle;
            this._isShow = !this._isShow;
            Event.dispatchToLocal('HideShorter', this._isShow)
        });
    }

    private initEvents() {
        /**刷新快捷栏 */
        this.bagModuleC.onRefreshBar.add(this.refreshShortcutBar, this);

        Event.addLocalListener(EventsName.CreationSkills, (itemID: number, loc: mw.Vector) => {
            this.creationFly(itemID, loc);
        });

        Event.addLocalListener('UnselectItem', (indx: number) => {
            if (this._allSlot[indx])
                this.selectItem(this._allSlot[indx], true)
        });
    }

    protected onShow(...params: any[]): void {
        this.canUpdate = true;
        this._active = true;
        this.refreshShortcutBar();
        Event.dispatchToLocal('HideShorter', true)
    }

    protected onHide(): void {
        this.canUpdate = false;
        this._active = false;
        Event.dispatchToLocal('HideShorter', false)
    }

    /**
     * 刷新快捷栏
     * @return
     */
    private refreshShortcutBar() {
        if (!this._active) {
            return;
        }
        let visible = mw.SlateVisibility.Collapsed;
        const curEquip = this.bagModuleC.curEquip;
        this._equipItems = this.bagModuleC.getEquipItems(false);
        if (!curEquip && this._selectEquip && this._selectEquip.id) {
            this.unloadItem(this._selectEquip);
        }

        for (let index = 0; index < this._equipItems.length; index++) {
            const info = this._equipItems[index];
            const item = this._allSlot[index];
            item.setData(info);
            if (curEquip && curEquip === item.id) {
                item.mSelect.visibility = mw.SlateVisibility.SelfHitTestInvisible;
                if (!this._selectEquip) {
                    this.selectItem(item);
                }
            }
            if (item.id && visible === mw.SlateVisibility.Collapsed) {
                visible = mw.SlateVisibility.SelfHitTestInvisible;
            }
        }
        this.mContent.visibility = visible;
        if (!this._isShow) {
            this.mHideBar.onClicked.broadcast();
        }
    }

    /**
     * 选中物品
     * @param  item
     * @return
     */
    private selectItem(item: GoodsItem, isForse: boolean = false) {
        if (!item || !item.id) {
            return;
        }
        const itemConfig = item.config.ID
        if (!isForse && GlobalData.inSpaceStation && Math.floor(itemConfig / 10) >= 30 && Math.floor(itemConfig / 10) < 40) {
            Tips.show(GameUtils.getTxt("Tips_1012"))
            return
        }
        if (this._selectEquip && this._selectEquip.id) {
            this._selectEquip.mSelect.visibility = mw.SlateVisibility.Collapsed;
            this.unloadItem(this._selectEquip, false);
            if (this._selectEquip.id === item.id) {
                UIManager.hide(BagInteraction);
                this._selectEquip = null;
                this.bagModuleC.changEquipItem("");
                return;
            }
        }

        if (itemConfig == 140011)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具“激光炮”时', { record: 'get_laser_gun' })
        else if (itemConfig == 140006)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具“喷火器”时', { record: 'get_fire_gun' })
        else if (itemConfig == 140012)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具火箭筒', { record: 'get_rocket' })
        else if (itemConfig == 140009)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具棒棒糖', { record: 'get_lollipop' })
        else if (itemConfig == 140007)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具扇子', { record: 'get_fan' })
        else if (itemConfig == 140008)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具电刀', { record: 'get_sword' })
        else if (itemConfig == 140010)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具球棒', { record: 'get_baseballbat' })
        else if (itemConfig == 140013)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具火翅膀', { record: 'get_wing_1' })
        else if (itemConfig == 140014)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具紫翅膀', { record: 'get_wing_2' })
        else if (itemConfig == 302)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具滑板', { record: 'get_skate' })
        else if (itemConfig == 140016)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具机关枪', { record: 'get_machinegun' })
        else if (itemConfig == 307)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功坐上免费飞机', { record: 'get_free_aircraft' })
        else if (itemConfig == 308)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功坐上X-零式', { record: 'get_pay1_aircraft' })
        else if (itemConfig == 305)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功坐上摇摇乐', { record: 'get_pay2_aircraft' })
        else if (itemConfig == 310)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功坐上粉红糖果', { record: 'get_pay3_aircraft' })
        else if (itemConfig == 306)
            MGSMsgHome.uploadMGS('ts_game_result', '玩家成功坐上战斗机甲', { record: 'get_pay4_aircraft' })
        this.bagModuleC.changEquipItem(item.id);
        /**埋点 */
        this._selectTime = Date.now();
        MGSMsgHome.clickBagHub(item.config.ID);
        // if (item.config.ID !== 11101) {
        //     CreditEventsC.timekeeper(CreditEvent.RP.Item, 1);
        // }
        this._selectEquip = item;
        this._selectEquip.mSelect.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        Event.dispatchToServer(EventsName.LoadProp, item.config.Resource);
        Event.dispatchToLocal(EventsName.EquipProp, item.config.ID);

        // const allElem = [140006, 140007, 140008, 140009, 140010, 140011, 140012, 140013, 140014, 140016]
        // if (allElem.indexOf(item.config.ID) == -1)
        if (!(Math.floor(item.config.ID / 10) >= 30 && Math.floor(item.config.ID / 10) < 40)) {
            ModuleService.getModule(SkillModule_Client).getSkill(item.config.ID);
        }

        const itemElem = GameConfig.Item.getElement(item.config.ID)
        let isTelescope = false
        if (itemElem.Skills) {
            for (const it of itemElem.Skills) {
                const skillElem = GameConfig.SkillLevel.getElement(it)
                if (skillElem && skillElem.isTelescope >= 1) {
                    isTelescope = true
                    break
                }
            }
        }
        Event.dispatchToLocal(EventsName.SelectGood, item.config.ID + '', isTelescope)

        if (item.config.isCanGive) {
            UIManager.show(BagInteraction);
        } else {
            UIManager.hide(BagInteraction);
        }
    }

    public unloadItem(item: GoodsItem, isNull: boolean = true) {
        let prop = 0;
        const config = item?.config;
        if (config) {
            prop = config.Resource;
            if (config.isCanGive) {
                UIManager.hide(BagInteraction);
            }
            /**埋点 */
            const time = Date.now() - this._selectTime;
            if (time >= 5000) {
                this._selectTime && MGSMsgHome.selectItemTime(config.ID, time);
                this._selectTime = 0;
            }
            // CreditEventsC.endTimekeeper(CreditEvent.RP.Item, 1);
        }
        ModuleService.getModule(SkillModule_Client).getSkill(0);
        // Event.dispatchToLocal(EventsName.EquipProp, 0);
        prop && Event.dispatchToServer(EventsName.UnloadProp, prop);
        if (isNull) {
            this._selectEquip = null;
        }
    }

    private creationFly(itemID: number, loc: mw.Vector) {
        GeneralManager.modifyProjectWorldLocationToWidgetPosition(Player.localPlayer, loc, creationViewPos, true);
        creationViewPos.x -= this.mFlyCon.size.x / 2;
        creationViewPos.y -= this.mFlyCon.size.y / 2;
        for (const item of this._allSlot) {
            if (item.config?.ID === itemID) {
                mw.localToViewport(item.rootCanvas.cachedGeometry, mw.Vector2.zero, outPixelPos, outViewPos);
                this.mFlyCon.visibility = mw.SlateVisibility.SelfHitTestInvisible;
                this.mFlyHalo.visibility = mw.SlateVisibility.Collapsed;
                this.mFly.imageGuid = item.config.Icon;
                this.mFlyCon.position = creationViewPos;
                const tempPos = creationViewPos;
                new Tween({ x: creationViewPos.x, y: creationViewPos.y })
                    .to({ x: outViewPos.x, y: outViewPos.y }, 500)
                    .onUpdate(obj => {
                        tempPos.x = obj.x;
                        tempPos.y = obj.y;
                        this.mFlyCon.position = tempPos;
                    })
                    .start()
                    .onComplete(obj => {
                        this.mFlyHalo.visibility = mw.SlateVisibility.SelfHitTestInvisible;
                        const scale = this.mFlyHalo.renderScale.clone();
                        new Tween({ scale: 0, angle: -180 })
                            .to({ scale: 1, angle: 180 }, 1000)
                            .yoyo(true)
                            .repeat(1)
                            .onUpdate(obj => {
                                scale.x = obj.scale;
                                scale.y = obj.scale;
                                this.mFlyHalo.renderScale = scale;
                                this.mFlyHalo.renderTransformAngle = obj.angle;
                            })
                            .easing(TweenUtil.Easing.Circular.Out)
                            .start()
                            .onComplete(obj => {
                                this.mFlyCon.visibility = mw.SlateVisibility.Collapsed;
                            });
                    });
                break;
            }
        }
    }
}
