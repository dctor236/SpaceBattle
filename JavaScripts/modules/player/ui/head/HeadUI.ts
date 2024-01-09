/**
 * @Author       : songxing
 * @Date         : 2023-04-19 18:04:56
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-08 18:16:41
 * @FilePath     : \mollywoodschool\JavaScripts\modules\player\ui\HeadUI.ts
 * @Description  : 
 */

import { GameConfig } from "../../../../config/GameConfig";
import { GlobalData } from "../../../../const/GlobalData";
import GameUtils from "../../../../utils/GameUtils";
import { ContractType } from "../../../relation/RelationData";

const tempPos = mw.Vector2.zero;

export default class HeadUI {

    private widget: mw.UIWidget = null;
    private root: mw.UserWidget = null;
    private chatText: mw.TextBlock = null;
    private chatCon: mw.Canvas = null;
    private nameText: mw.TextBlock = null;
    private titleText: mw.TextBlock = null;
    private styleCanvas: mw.Canvas = null;
    private styleLeft: mw.Image = null;
    private styleCenter: mw.Image = null;
    private styleRight: mw.Image = null;

    private bg: mw.Image = null;

    private time = 0;

    public constructor(widget: mw.UIWidget) {
        this.widget = widget;
        this.root = this.widget.getTargetUIWidget();
        // if (GlobalData.isOpenGM)
        //     this.root.visibility = (mw.SlateVisibility.Hidden);
        this.bg = this.root.findChildByPath("Canvas/MWImage_1") as mw.Image;
        this.chatCon = this.root.findChildByPath("Canvas/Chat") as mw.Canvas;
        this.chatText = (this.root.findChildByPath("Canvas/Chat/Text")) as mw.TextBlock;
        this.nameText = (this.root.findChildByPath("Canvas/Name")) as mw.TextBlock;
        this.titleText = (this.root.findChildByPath("Canvas/Title")) as mw.TextBlock;
        this.styleCanvas = (this.root.findChildByPath("Canvas/styleCanvas")) as mw.Canvas;
        this.styleLeft = (this.root.findChildByPath("Canvas/styleCanvas/styleLeft")) as mw.Image;
        this.styleCenter = (this.root.findChildByPath("Canvas/styleCanvas/styleCenter")) as mw.Image;
        this.styleRight = (this.root.findChildByPath("Canvas/styleCanvas/styleRight")) as mw.Image;
    }

    /**
     * 显示聊天
     * @param desc 
     */
    public showChat(desc: string): void {
        let length = GameUtils.getNameLen(desc);
        let num = Math.ceil(length / 15);
        this.chatCon.size = (new mw.Vector2(350, 40 + num * 50));
        this.chatCon.visibility = (mw.SlateVisibility.Visible);
        this.chatText.text = (desc);
        this.widget.refresh();
        this.time = 0;
        mw.TimeUtil.onEnterFrame.remove(this.update, this);
        mw.TimeUtil.onEnterFrame.add(this.update, this);
    }

    /**隐藏聊天 */
    public hideChat(): void {
        this.chatCon.visibility = (mw.SlateVisibility.Hidden);
        this.widget.refresh();
    }
    /**
     * 设置称号
     * @param content 称号名称 
     */
    public setTitle(content: string, type: ContractType): void {
        if (content == "" || content == null || content == undefined) {
            this.titleText.text = ''//(GameConfig.SquareLanguage.Danmu_Content_1106.Value);
        } else {
            this.titleText.text = (content);
        }
        //TS3.log('setTitle', content, type, this.titleText.text)
        this.styleLeft.visibility = mw.SlateVisibility.Collapsed
        this.styleCenter.visibility = mw.SlateVisibility.Collapsed
        this.styleRight.visibility = mw.SlateVisibility.Collapsed
        this.titleText.outlineSize = 0;
        this.titleText.shadowOffset = mw.Vector2.zero;
        const config = GameConfig.TitleStyle.findElement("Type", type);
        if (!config) {
            return;
        }
        if (config.StyleBg) {
            this.bg.imageGuid = config.StyleBg;
            if (config.BgColor) {
                this.bg.setImageColorByHex(config.BgColor)
            }
        }
        if (config.StyleLeft) {
            this.styleLeft.visibility = mw.SlateVisibility.SelfHitTestInvisible
            this.styleLeft.imageGuid = config.StyleLeft
            const offset = config.LeftOffset
            if (offset) {
                this.calcPos(this.styleLeft, tempPos.set(offset[0], offset[1]))
            }
        }
        if (config.StyleCenter) {
            this.styleCenter.visibility = mw.SlateVisibility.SelfHitTestInvisible
            this.styleCenter.imageGuid = config.StyleCenter;
            const offset = config.CenterOffset
            if (offset) {
                this.calcPos(this.styleCenter, tempPos.set(offset[0], offset[1]))
            }
        }
        if (config.StyleRight) {
            this.styleRight.visibility = mw.SlateVisibility.SelfHitTestInvisible
            this.styleRight.imageGuid = config.StyleRight;
            const offset = config.RightOffset
            if (offset) {
                this.calcPos(this.styleRight, tempPos.set(offset[0], offset[1]))
            }
        }
        if (config.FontColor) {
            this.titleText.setFontColorByHex(config.FontColor)
        }
        if (config.OutlineColor) {
            this.titleText.setOutlineColorByHex(config.OutlineColor)
            if (config.OutlineSize) {
                this.titleText.outlineSize = config.OutlineSize;
            }
            const offset = config.ShadowOffset
            if (offset) {
                this.titleText.shadowOffset = new mw.Vector2(offset[0], offset[1]);
            }
        }
    }

    public setName(name: string): void {
        this.nameText.text = name
        this.chatCon.visibility = (mw.SlateVisibility.Hidden);
        this.widget.refresh();
    }

    private calcPos(widget: mw.Widget, pos: mw.Vector2) {
        const size = this.styleCanvas.size.clone();
        const x = pos.x / 351 * size.x;
        const y = pos.y / 123 * size.y;
        tempPos.set(x, y);
        widget.position = tempPos;
    }

    private update(dt: number): void {
        this.time += dt;
        if (this.time > 5) {
            mw.TimeUtil.onEnterFrame.remove(this.update, this);
            this.hideChat();
        }
    }

}
