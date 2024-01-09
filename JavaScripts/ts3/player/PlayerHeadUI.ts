import { Tween } from "../../ExtensionType";
import { getStrLen } from "../com/Tool";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-05-24 10:38
 * @LastEditTime : 2023-06-11 13:14
 * @description  : 头顶UI，包括名字、聊天、称号、血条
 * 可继承复写来扩展
 */
export default class PlayerHeadUI {
    private widget: mw.UIWidget = null;
    private root: mw.UserWidget = null;

    private chatText: mw.TextBlock = null;
    private chatNode: mw.Canvas = null;

    private nameNode: mw.Canvas = null;
    private nameText: mw.TextBlock = null;

    private titleText: mw.TextBlock = null;
    private titleNode: mw.Canvas = null;

    private txtHp: mw.TextBlock = null;
    private hpNode: mw.Canvas = null;
    private barHp: mw.ProgressBar = null;
    private thumbImage: mw.Image = null;

    private hpTween: Tween<{ x: number; }> = null;

    private chatTime = 0;
    private lastShowType = mw.SlateVisibility.Hidden;
    public init(widget: mw.UIWidget): void {
        this.widget = widget;
        this.widget.selfOcclusion = false
        this.widget.occlusionEnable = false
        this.widget.headUIMaxVisibleDistance = 1500
        this.widget.localTransform.position = new Vector(0, 0, 100)
        this.widget.scaledByDistanceEnable = true
        this.root = this.widget.getTargetUIWidget();
        this.chatNode = this.root.findChildByPath("Canvas/chatNode") as mw.Canvas;
        this.titleNode = this.root.findChildByPath("Canvas/titleNode") as mw.Canvas;
        this.nameNode = this.root.findChildByPath("Canvas/nameNode") as mw.Canvas;
        this.hpNode = this.root.findChildByPath("Canvas/hpNode") as mw.Canvas;

        this.chatText = this.root.findChildByPath("Canvas/chatNode/txtChat") as mw.TextBlock;
        this.nameText = this.root.findChildByPath("Canvas/nameNode/txtName") as mw.TextBlock;
        this.titleText = this.root.findChildByPath("Canvas/titleNode/txtTitle") as mw.TextBlock;
        this.txtHp = this.root.findChildByPath("Canvas/hpNode/txtHp") as mw.TextBlock;
        this.barHp = this.root.findChildByPath("Canvas/hpNode/barHp") as mw.ProgressBar;
        this.thumbImage = this.root.findChildByPath("Canvas/hpNode/thumbImage") as mw.Image;
        this.reset();
    }
    public reset() {
        this.showNode(this.titleNode, false);
        this.showNode(this.chatNode, false);
        this.showNode(this.nameNode, false);
        this.showNode(this.hpNode, false);
    }
    /**
     * 显示聊天
     * @param desc 
     */
    public showChat(desc: string): void {
        if (!this.chatNode)
            return;
        let length = getStrLen(desc);
        let num = Math.ceil(length / 18);
        this.chatNode.size = new mw.Vector2(300, 40 + num * 50);
        this.chatNode.visibility = mw.SlateVisibility.Visible;
        this.lastShowType = mw.SlateVisibility.SelfHitTestInvisible;
        this.nameNode.visibility = mw.SlateVisibility.Hidden;
        this.chatText.text = desc;
        this.refresh();
        this.chatTime = 5;
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
        this.showNode(this.titleNode, true);
        switch (type) {
            case 1:
                this.titleText.text = content;
                break;
            default:
                this.showNode(this.titleNode, false);
                break;
        }
    }
    public showName(name: string): void {
        if (this.nameText && name) {
            this.nameText.text = name
            this.showNode(this.nameNode, true);
        }
        else
            this.showNode(this.nameNode, false);
        this.refresh();
    }
    public showHp(hp: number, maxHp: number): void {
        this.showNode(this.hpNode, true);
        this.txtHp.text = `${hp}/${maxHp}`;
        const num = hp / maxHp
        let size = this.thumbImage.size;
        size.x = (this.barHp.percent - num) * this.barHp.size.x;
        this.thumbImage.size = size;
        let location = this.thumbImage.position;
        // location.x = (num) * this.barHp.size.x + 30;
        // this.thumbImage.position = location;
        this.thumbImage.position = location.set((num) * this.barHp.size.x + 30, location.y);
        this.barHp.percent = num;
        this.hpTween?.stop();
        this.hpTween = new Tween({ x: size.x, y: 20 }).to({ x: 0, y: 0 }, 500).easing(TweenUtil.Easing.Quadratic.In).onUpdate((obj) => {
            if (!this) {
                this.hpTween.stop()
                return
            }
            size.x = obj.x;
            this.thumbImage.size = size;
            this.barHp.thumbImageSize = new Vector2(obj.y, 400);
        }).start();

    }
    public showHead(bit: number): void {
        this.reset();
        let n = (bit & 1) == 1;
        let t = (bit & 2) == 2;
        let h = (bit & 4) == 4;
        this.showNode(this.titleNode, t);
        this.showNode(this.nameNode, n);
        this.showNode(this.hpNode, h);
    }
    public update(dt: number): void {
        if (this.chatTime > 0) {
            this.chatTime -= dt;
            if (this.chatTime <= 0) {
                this.hideChat();
            }
        }
    }
    onDestroy() {
        if (this.hpTween) {
            this.hpTween.stop();
            this.hpTween = null
            this.widget.destroy()
            this.widget = null
        }
    }
    private refresh() {
        // if (this.widget)
        //     this.widget.refresh();
    }

    private showNode(node, show) {
        if (node) {
            node.visibility = show ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Hidden;
            // this.refresh();
        }
    }
}
