

import { Tween } from "../../ExtensionType";
/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-05-24 10:38
 * @LastEditTime : 2023-06-07 17:04
 * @description  : 头顶UI，包括名字、聊天、血条
 * 可继承复写来扩展
 */
export class AssistHeadUI {
    private widget: mw.UIWidget = null;
    public root: mw.UserWidget = null;
    private chatText: mw.TextBlock = null;
    private chatNode: mw.Canvas = null;

    private nameNode: mw.Canvas = null;
    private nameText: mw.TextBlock = null;

    private txtHp: mw.TextBlock = null;
    private hpNode: mw.Canvas = null;
    private barHp: mw.ProgressBar = null;
    private thumbImage: mw.Image = null;
    private hpTween: Tween<{ x: number; }> = null;

    private chatTime = 0;
    private lastShowType = mw.SlateVisibility.Hidden;
    public init(widget: mw.UIWidget): void {
        this.widget = widget;
        // this.widget.headUIMaxVisibleDistance = 1500
        this.root = this.widget.getTargetUIWidget();
        this.chatNode = this.root.findChildByPath("Canvas/chatNode") as mw.Canvas;
        this.hpNode = this.root.findChildByPath("Canvas/hpNode") as mw.Canvas;
        this.nameNode = this.root.findChildByPath("Canvas/nameNode") as mw.Canvas;

        this.chatText = this.root.findChildByPath("Canvas/chatNode/txtChat") as mw.TextBlock;
        this.nameText = this.root.findChildByPath("Canvas/nameNode/txtName") as mw.TextBlock;
        this.txtHp = this.root.findChildByPath("Canvas/hpNode/txtHp") as mw.TextBlock;
        this.barHp = this.root.findChildByPath("Canvas/hpNode/barHp") as mw.ProgressBar;
        this.thumbImage = this.root.findChildByPath("Canvas/hpNode/thumbImage") as mw.Image;

        this.showNode(this.hpNode, false);
        this.showNode(this.chatNode, false);
        this.showNode(this.nameNode, false);
    }
    /**
     * 显示聊天
     * @param desc 
     */
    public showChat(desc: string): void {
        if (!this.chatNode)
            return;
        let length = this.getStrLen(desc);
        let num = Math.ceil(length / 18);
        this.chatNode.size = new mw.Vector2(300, 40 + num * 50);
        this.chatNode.visibility = mw.SlateVisibility.Visible;
        this.lastShowType = this.nameNode.visibility;
        // this.nameNode.visibility = mw.SlateVisibility.Hidden;
        this.chatText.text = desc;
        this.refresh();
        this.chatTime = 3;
    }

    /**隐藏聊天 */
    public hideChat(): void {
        this.chatNode.visibility = mw.SlateVisibility.Hidden;
        this.nameNode.visibility = this.lastShowType;
        this.refresh();
    }
    /**
     * 设置称号
     * @param content 称号名称 
     * @param type 称号类型，自定义显示方式
     */
    public showTitle(type: number, content: string,): void {
        this.showNode(this.hpNode, true);
        switch (type) {
            case 1:
                this.txtHp.text = content;
                break;
            default:
                this.showNode(this.hpNode, false);
                break;
        }
    }
    public showHp(hp: number, maxHp: number): void {
        this.showNode(this.hpNode, true);
        this.txtHp.text = `${hp}/${maxHp}`;
        const num = hp / maxHp

        let size = this.thumbImage.size;
        size.x = (this.barHp.percent - num) * this.barHp.size.x;
        this.thumbImage.size = size;

        let location = this.thumbImage.position;
        this.thumbImage.position = location.set((num) * this.barHp.size.x - 10, location.y);

        //播放tween动画
        if (this.hpTween) {
            this.hpTween.stop();
        } else {
        }
        this.hpTween = new Tween({ x: size.x, y: 20 }).to({ x: 0, y: 0 }, 500).easing(TweenUtil.Easing.Quadratic.In).onUpdate((obj) => {
            size.x = obj.x;
            this.thumbImage.size = size;
            this.barHp.thumbImageSize = new Vector2(obj.y, 400);
        }).start();
        this.barHp.percent = num;
    }
    public showName(name: string): void {
        // console.log("hjjlkjkljkl", this.nameText, name)
        if (this.nameText && name) {
            this.nameText.text = name
            this.showNode(this.nameNode, true);
        }
        else
            this.showNode(this.nameNode, false);
        this.refresh();
    }


    public update(dt: number): void {
        if (this.chatTime > 0) {
            this.chatTime -= dt;
            if (this.chatTime <= 0) {
                this.hideChat();
            }
        }
    }
    private refresh() {
        if (this.widget)
            this.widget.refresh();
    }

    private showNode(node, show) {
        if (node) {
            node.visibility = show ? mw.SlateVisibility.Visible : mw.SlateVisibility.Hidden;
            // this.refresh();
        }
    }

    private getStrLen(str: string): number {
        let num = 0;
        for (let i = 0; i < str.length; i++) {
            let txt = str[i];
            if (/[\u4e00-\u9fa5]/.test(txt)) {
                num += 1.7; //汉字
            } else {
                num++; //其他字符
            }
        }
        return num;
    }
    public destroy() {
        if (this.root)
            this.root.destroyObject();
        this.root = null;
    }

    public reset() {
        this.showNode(this.hpNode, false)
        this.showNode(this.chatNode, false)
        this.showNode(this.nameNode, false)
    }

    public setHpVisable(bool: boolean) {
        this.showNode(this.hpNode, bool)
    }
    public setNameVisable(bool: boolean) {
        this.showNode(this.nameNode, bool)
    }

    onDestroy() {
        if (this.hpTween) {
            this.hpTween.stop();
            this.hpTween = null
            // this.widget.destroy()
            // this.widget = null
        }
    }
}
