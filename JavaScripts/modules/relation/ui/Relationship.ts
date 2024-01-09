/** 
 * @Author       : 陆江帅
 * @Date         : 2023-05-09 10:28:58
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-05-12 15:07:26
 * @FilePath     : \mollywoodschool\JavaScripts\modules\relation\ui\Relationship.ts
 * @Description  : 
 */
import { CloseAllUI, ShowAllUI, UIManager } from "../../../ExtensionType";
import { GameConfig } from "../../../config/GameConfig";
import { GlobalData } from "../../../const/GlobalData";
import Relationship_Generate from "../../../ui-generate/relation/Relationship_generate";
import Tips from "../../../ui/commonUI/Tips";
import RelationModuleC from "../RelationModuleC";
import { RelationInteract } from "./RelationInteract";
import { RelationItem } from "./RelationItem";

export class Relationship extends Relationship_Generate {
    private _skillID: number;
    private _playerList: number[] = [];
    /**物品对象池 */
    private _itemPool: RelationItem[] = [];
    /**物品使用池 */
    private _usePool: RelationItem[] = [];


    protected onStart(): void {
        this.selfInput.hintString = GameConfig.SquareLanguage.Relation_13.Value;
        this.otherInput.hintString = GameConfig.SquareLanguage.Relation_13.Value;
        this.isSureDesignation(false);
    }

    protected initButtons(): void {
        super.initButtons();

        this.close.onClicked.add(() => {
            this.hide()
        })

        this.cancel.onClicked.add(() => {
            this.hide()
        })

        this.sure.onClicked.add(async () => {
            if (!this.selfInput.text || !this.otherInput.text) {
                Tips.show(GameConfig.SquareLanguage.Relation_05.Value);
                return;
            }
            const selfText = this.selfInput.text;
            let selfResult = await StringUtil.maskWordCheck(selfText);
            if (!selfResult.result) {
                Tips.show(GameConfig.SquareLanguage.Relation_06.Value);
                this.selfInput.text = ""
                return
            }
            const otherText = this.otherInput.text;
            let otherResult = await StringUtil.maskWordCheck(otherText);
            if (!otherResult.result) {
                Tips.show(GameConfig.SquareLanguage.Relation_07.Value);
                this.otherInput.text = ""
                return
            }
            this.isSureDesignation(true);
            this.selfText.text = this.selfInput.text;
            this.otherText.text = this.otherInput.text;
        });

        this.clear.onClicked.add(() => {
            this.isSureDesignation(false);
            this.selfInput.text = "";
            this.otherInput.text = "";
        })

        this.select.onClicked.add(() => {
            this.showSelectPlayerList()
        })
    }

    protected onShow(skillID: number): void {
        this._skillID = skillID
        this.setDesignation.visibility = mw.SlateVisibility.SelfHitTestInvisible
        this.selectPlayer.visibility = mw.SlateVisibility.Collapsed
    }

    public show(...params: unknown[]): void {
        CloseAllUI()
        UIManager.show(Relationship, ...params);
    }

    public hide(): void {
        ShowAllUI()
        UIManager.hide(Relationship);
    }

    private isSureDesignation(isSure: boolean) {
        const visibleInput = isSure ? mw.SlateVisibility.Collapsed : mw.SlateVisibility.Visible;
        const visibleText = isSure ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
        this.selfBg.visibility = visibleInput;
        this.otherBg.visibility = visibleInput;
        this.selfInput.visibility = visibleInput;
        this.otherInput.visibility = visibleInput;
        this.sure.visibility = visibleInput;
        this.selfText.visibility = visibleText;
        this.otherText.visibility = visibleText;
        this.clear.visibility = visibleText;
        this.select.visibility = visibleText;
    }

    private showSelectPlayerList() {
        const self = Player.localPlayer;
        const selfID = self.playerId
        this._playerList.length = 0
        this.clearItemPool();
        this.mScroll.scrollToStart();
        const maxDis = Math.pow(GlobalData.giveDis, 2)
        for (const player of Player.getAllPlayers()) {
            if (selfID === player.playerId || !self.character || !player.character) {
                continue;
            }
            const distance = mw.Vector.squaredDistance(self.character.worldTransform.position, player.character.worldTransform.position)
            if (distance <= maxDis) {
                this._playerList.push(player.playerId);
            }
        }
        if (this._playerList.length === 0) {
            Tips.show(GameConfig.SquareLanguage.Danmu_Content_1369.Value);
            return;
        }
        this.setDesignation.visibility = mw.SlateVisibility.Collapsed;
        this.selectPlayer.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        for (const playerId of this._playerList) {
            let item: RelationItem;
            if (this._itemPool.length > 0) {
                item = this._itemPool.shift();
            } else {
                item = UIManager.create(RelationItem);
                item.clickBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
                this.mContent.addChild(item.uiObject);
                item.uiObject.size = item.rootCanvas.size;
            }
            this._usePool.push(item);
            item.uiObject.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            item.setData(playerId);
            item.clickBtn.onClicked.add(() => {
                const self = this.selfInput.text;
                const other = this.otherInput.text;
                ModuleService.getModule(RelationModuleC).sendInvite(playerId, self, other, this._skillID)
                this.hide();
                UIManager.show(RelationInteract)
            })
        }
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