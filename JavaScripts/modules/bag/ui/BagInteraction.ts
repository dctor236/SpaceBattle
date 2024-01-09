/** 
 * @Author       : 陆江帅
 * @Date         : 2023-03-20 16:06:44
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-05-14 10:25:56
 * @FilePath     : \mollywoodschool\JavaScripts\modules\bag\ui\BagInteraction.ts
 * @Description  : 
 */
import { GameConfig } from "../../../config/GameConfig";
import { GlobalData } from "../../../const/GlobalData";
import { UIManager } from "../../../ExtensionType";
import BagInteraction_Generate from "../../../ui-generate/bag/BagInteraction_generate";
import { BagModuleC } from "../BagModuleC";
import { BagUtils } from "../BagUtils";
import { PlayerItem } from "./PlayerItem";

export class BagInteraction extends BagInteraction_Generate {

    /**可给予玩家列表 */
    private _playerList: number[] = [];
    private _time: number;
    private _timer
    /**赠送者 */
    public playerId: number = 0;
    /**赠送物品ID */
    public itemId: number = 0;
    /**物品对象池 */
    private _itemPool: PlayerItem[] = [];
    /**物品使用池 */
    private _usePool: PlayerItem[] = [];

    private get bagModuleC() {
        return ModuleService.getModule(BagModuleC)
    }

    protected onStart(): void {
        this.mNoneText.text = GameConfig.SquareLanguage.Danmu_Content_1369.Value;
    }

    protected initButtons(): void {
        super.initButtons()

        this.closeBtn.onClicked.add(() => {
            this.mConInvite.visibility = mw.SlateVisibility.Collapsed
        })

        this.mBtnInvite.onClicked.add(() => {
            this.openGive();
        })
        this.yesBtn.onClicked.add(() => {
            if (this._timer) {
                clearInterval(this._timer);
                this._timer = null
            }
            UIManager.hide(BagInteraction)
            this.bagModuleC.onAcceptItem(this.playerId, this.itemId)
            this.playerId = 0;
            this.itemId = 0;
        });
        this.noBtn.onClicked.add(() => {
            if (this._timer) {
                clearInterval(this._timer);
                this._timer = null
            }
            UIManager.hide(BagInteraction)
            this.bagModuleC.onAcceptItem(this.playerId, 0)
            this.playerId = 0;
            this.itemId = 0;
        });
    }

    protected onShow(playerId: number, itemId: number): void {
        this.mNoneText.visibility = mw.SlateVisibility.Collapsed
        this.mConInvite.visibility = mw.SlateVisibility.Collapsed
        if (playerId !== undefined || itemId !== undefined) {
            this.mBtnInvite.visibility = mw.SlateVisibility.Collapsed
            this.showGiftReq(playerId, itemId)
        } else {
            this.mBtnInvite.visibility = mw.SlateVisibility.Visible
            this.acceptCon.visibility = mw.SlateVisibility.Collapsed
        }
    }

    private openGive(): void {
        const self = Player.localPlayer;
        const selfID = self.playerId
        this._playerList.length = 0
        this.clearItemPool();
        const maxDis = Math.pow(GlobalData.giveDis, 2)
        for (let player of Player.getAllPlayers()) {
            if (selfID == player.playerId || !self.character || !player.character) {
                continue;
            }
            const distance = mw.Vector.squaredDistance(self.character.worldTransform.position, player.character.worldTransform.position)
            if (distance <= maxDis) {
                this._playerList.push(player.playerId);
            }
        }
        this.mConInvite.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        const vis = this._playerList.length <= 0 ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Hidden;
        this.mNoneText.visibility = vis;
        for (const playerId of this._playerList) {
            let item: PlayerItem;
            if (this._itemPool.length > 0) {
                item = this._itemPool.shift();
            } else {
                item = UIManager.create(PlayerItem);
                item.clickBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
                this.content.addChild(item.uiObject);
                item.uiObject.size = item.rootCanvas.size;
            }
            this._usePool.push(item);
            item.uiObject.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            item.setData(playerId);
            item.clickBtn.onClicked.add(() => {
                this.bagModuleC.onGive(playerId)
                this.mConInvite.visibility = mw.SlateVisibility.Collapsed;
            })
        }
    }

    private showGiftReq(playerId: number, itemId: number) {
        this.playerId = playerId;
        this.itemId = itemId;
        const config = GameConfig.Item.getElement(itemId)
        this.acceptCon.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        this.headImg.imageGuid = BagUtils.getGender(playerId) == "1" ? "13774" : "13791";
        this.nameText.text = BagUtils.getName(playerId);
        this.descText.text = GameConfig.SquareLanguage.Danmu_Content_1370.Value + config.Name;
        this._time = 5;
        this.noBtn.text = (`${GameConfig.SquareLanguage.Danmu_Content_1074.Value}(${this._time})S`);
        if (this._timer) {
            clearInterval(this._timer);
        }
        this._timer = setInterval(() => {
            this._time--;
            this.noBtn.text = (`${GameConfig.SquareLanguage.Danmu_Content_1074.Value}(${this._time})S`);
            if (this._time <= 0) {
                clearInterval(this._timer);
                this._timer = null
                this.bagModuleC.onAcceptItem(this.playerId, -1)
                UIManager.hide(BagInteraction)
            }
        }, 1000);
    }

    /** 
     * 清空对象池
     * @return 
     */
    private clearItemPool() {
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