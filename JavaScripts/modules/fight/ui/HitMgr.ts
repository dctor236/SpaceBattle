import { UIManager } from "../../../ExtensionType";
import { GeneralManager } from "../../../Modified027Editor/ModifiedStaticAPI";
import Tips from "../../../ui/commonUI/Tips";
import GameUtils from "../../../utils/GameUtils";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : 田可成
 * @Date         : 2023-06-15 16:56
 * @LastEditTime : 2023-09-05 17:57:26
 * @description  : 头顶伤害显示组件
 */
class HurtTxt {
    public isDone = true;

    private is2DView = false;
    private hurtColor2 = new mw.LinearColor(1, 1, 1);
    private hurtColor1 = new mw.LinearColor(255 / 255, 244 / 255, 206 / 255);
    private basePos = new mw.Vector2(100, 50);
    private startPos = new mw.Vector2(100, 50);
    private endPos = new mw.Vector2(100, -100);
    private tween = null;

    public txtObj: mw.TextBlock;
    public rootId: string = '';
    private baseSize = 40;
    constructor(root: mw.Canvas, str: string) {
        if (!root) {
            root = UIManager.canvas;
            this.is2DView = true;
        }
        this.txtObj = mw.TextBlock.newObject(root, str);
        this.txtObj.isRichText = true
        this.txtObj.size = new mw.Vector2(500, 120);
        this.txtObj.textHorizontalLayout = UITextHorizontalLayout.NoClipping;
        this.txtObj.textVerticalJustification = mw.TextVerticalJustify.Center;
        this.txtObj.textJustification = mw.TextJustify.Center;
        this.txtObj.outlineColor = new mw.LinearColor(126 / 255, 14 / 255, 14 / 255, 0.5);
        this.txtObj.outlineSize = 4;
        this.txtObj.glyph = mw.UIFontGlyph.BoldItalics;
        this.tween = new mw.Tween({ pos: this.startPos, scale: 1 });
        this.tween.onUpdate((value) => {
            if (this.txtObj) {
                this.txtObj.position = value.pos;
                this.txtObj.fontSize = this.baseSize * value.scale;
            }
            else
                this.tween.stop();
        })
        this.tween.onComplete(() => {
            if (this.txtObj) {
                this.txtObj.visibility = mw.SlateVisibility.Collapsed;
                this.startPos.x = this.basePos.x;
                this.startPos.y = this.basePos.y;
                this.txtObj.position = this.startPos;
            }
            this.isDone = true;
        });
    }
    /**
     *  设置初始位置，受创建时父节点影响
     * @param v2 位置
     */
    public setPos(v2: mw.Vector2) {
        this.basePos.x = v2.x;
        this.basePos.y = v2.y;

    }
    public set2DView(v3: mw.Vector) {
        this.baseSize = 25;
        let player = Player.localPlayer;
        if (player && player.character && v3) {
            if (!this.is2DView)
                UIManager.canvas.addChild(this.txtObj);
            this.is2DView = true;
            GeneralManager.modifyProjectWorldLocationToWidgetPosition(player, v3, this.basePos, true);
            this.basePos.x -= 10;
        }
    }
    public set3DView(root: mw.Canvas) {
        //this.baseSize = 40;
        if (root && this.txtObj) {
            if (this.rootId != root.guid) {
                root.addChild(this.txtObj);
                this.rootId = root.guid;
                this.txtObj.position = this.basePos;
            }
            this.is2DView = false;
        }
    }
    /**
     * 显示 伤害
     * @param damage  伤害
     * @param crit 是否 暴击
     * @param root 伤害UI父 节点
     */
    public showHurt(damage: number, crit: boolean, root?: mw.Canvas) {
        this.isDone = false;
        this.txtObj.fontColor = this.hurtColor1;
        this.tween.stop();
        this.startPos.x = this.basePos.x;
        this.startPos.y = this.basePos.y;
        this.txtObj.visibility = mw.SlateVisibility.Visible;
        this.txtObj.position = this.startPos;
        this.txtObj.fontSize = this.baseSize;
        let sc = crit ? 1.8 : 1.5;
        if (crit) {
            this.txtObj.text = StringUtil.format("<color=#yellow>{0}</color>", GameUtils.getTxt("Tips_1021")) + "\n" +
                Math.ceil(damage).toString();
        } else {
            this.txtObj.text = Math.ceil(damage).toString();
        }
        this.endPos.x = this.startPos.x + MathUtil.randomFloat(-60, 60);
        this.endPos.y = this.startPos.y - 150;
        this.tween.to({ pos: this.endPos, scale: sc }, 555);
        this.tween.start();
    }
    public destroy() {
        this.txtObj?.destroyObject();
        this.tween?.stop();
        this.txtObj = null;
        this.tween = null;
        this.hurtColor1 = null;
        this.hurtColor2 = null;
        this.startPos = null;
        this.endPos = null;
    }
    public isLive() {
        if (!this.txtObj)
            return false;
        return true;
    }
}

/**
 * 命中效果显示
 */
export class HitMgr {
    private static _inst: HitMgr;
    public static get inst() {
        if (!this._inst)
            this._inst = new HitMgr();
        return this._inst;
    }
    /**
     * 当前combo数
     */
    public curCombo = 0;

    private comboRoot: mw.Canvas = null;
    private txtCombo: mw.TextBlock = null;
    private comboTween: mw.Tween<any> = null;

    private txt3DHurts: HurtTxt[] = [];
    private txt2DHurts: HurtTxt[] = [];

    private hurtIdx = -1;

    private killTipRoot: mw.Canvas = null;
    private killTipsTween: mw.Tween<{ o: number }>;
    private txtKillInfo: mw.TextBlock = null;
    /**
     * 销毁所以伤害显示对象
     */
    public destroy() {
        this.txt3DHurts.forEach((txt) => {
            txt.destroy();
        });
        this.txt2DHurts.forEach((txt) => {
            txt.destroy();
        });
        this.txt2DHurts = null;
        this.txt3DHurts = null;
        this.comboTween = null;
        this.killTipsTween = null;
        this.comboRoot?.destroyObject();
        this.killTipRoot?.destroyObject();
        this.comboRoot = null;
        this.killTipRoot = null;
    }
    /**
     * 显示2D伤害，暴击显示有区别
     * @param damage 伤害
     * @param crit 是否暴击
     * @param root 3D挂载节点，一般是头顶的3DUI
     */
    public show3DHurt(damage: number, crit: boolean, root: mw.Canvas) {
        if (!root || SystemUtil.isServer())
            return;
        let txt = this.getTxt(root);
        // txt?.set3DView(root);
        txt?.showHurt(damage, crit);
    }
    public recovery3DHurt(root: mw.Canvas) {
        if (!root || SystemUtil.isServer())
            return;
        let rid = root?.guid;
        for (let i = 0; i < this.txt3DHurts.length; i++) {
            let txt = this.txt3DHurts[i];
            if (txt && txt.rootId == rid) {
                txt.destroy();
                this.txt3DHurts.splice(i, 1);
                i--;
            }
        }
    }
    /**
     * 显示2D伤害，暴击显示有区别
     * @param damage 伤害
     * @param crit 是否暴击
     * @param v3 显示伤害的目标位置
     */
    public show2DHurt(damage: number, crit: boolean, v3: mw.Vector) {
        if (!v3 || SystemUtil.isServer())
            return;
        let txt = this.getTxt();
        txt?.set2DView(v3);
        txt?.showHurt(damage, crit);
    }
    /**
     * 获取一个伤害显示对象
     * @param root 挂载的节点
     * @returns 
     */
    private getTxt(root?: mw.Canvas): HurtTxt {
        let list = root ? this.txt3DHurts : this.txt2DHurts;
        for (let i = 0; i < list.length; i++) {
            let txt = list[i];
            if (!txt.isLive()) {
                list.splice(i, 1);
                i--;
                continue;
            }
            if (txt.isDone) {
                if (root)
                    txt.set3DView(root);
                return txt;
            }
        }
        this.hurtIdx++;
        if (this.hurtIdx > 20)
            this.hurtIdx = 0;
        if (this.hurtIdx >= list.length) {
            let txt = new HurtTxt(root, "txtHurt" + this.hurtIdx);
            list.push(txt);
            return txt;
        }
        return list[this.hurtIdx];
    }

    public showCombo() {
        if (SystemUtil.isServer())
            return;
        this.initCombo();
        if (!this.comboRoot)
            return;
        this.curCombo++;
        // this.updateKey = TimeUtil.setInterval(this.update, 1000);
        this.comboRoot.renderOpacity = 1;
        this.txtCombo.fontSize = 45;
        this.txtCombo.text = StringUtil.format(GameUtils.getTxt("Tips_25"), this.curCombo);
        this.comboRoot.visibility = mw.SlateVisibility.Visible;
        this.comboTween.stop();
        this.comboTween.to({ alpha: 0, scale: 2 }, 2000);
        this.comboTween.start();
    }

    private initCombo() {
        if (this.comboRoot)
            return;
        let root = UIManager.canvas;
        if (!root)
            return;
        this.comboRoot = mw.Canvas.newObject(root, 'ComboUI');
        this.comboRoot.size = new mw.Vector2(400, 100);
        this.comboRoot.position = new mw.Vector2(root.size.x - 400, 500);
        this.comboRoot.zOrder = 110000;

        let img = mw.Image.newObject(this.comboRoot, 'Bg');
        img.imageDrawType = mw.SlateBrushDrawType.Box;
        img.margin = new mw.Margin(0.6);
        img.size = new mw.Vector2(330, 90);
        img.imageGuid = '99137';

        this.txtCombo = mw.TextBlock.newObject(this.comboRoot, 'txtCombo');
        this.txtCombo.fontSize = 45;
        this.txtCombo.size = new mw.Vector2(330, 80);
        this.txtCombo.textVerticalJustification = mw.TextVerticalJustify.Center;
        this.txtCombo.textJustification = mw.TextJustify.Center;
        this.txtCombo.outlineColor = new mw.LinearColor(0, 0, 0);
        this.txtCombo.fontColor = new mw.LinearColor(1, 0.14, 1);
        this.txtCombo.outlineSize = 3;
        this.txtCombo.glyph = mw.UIFontGlyph.BoldItalics;

        this.comboTween = new mw.Tween({ alpha: 2, scale: 1 });

        this.comboTween.onUpdate((value) => {
            if (!this.comboRoot) {
                this.comboTween.stop();
                return;
            }
            if (value.scale < 1.2)
                this.txtCombo.fontSize = 45 * value.scale * value.scale;
            else if (this.txtCombo.fontSize > 45)
                this.txtCombo.fontSize -= 0.1 * value.scale;
            this.comboRoot.renderOpacity = value.alpha;
        })
        this.comboTween.onComplete(() => {
            this.comboRoot.visibility = mw.SlateVisibility.Collapsed;
            this.curCombo = 0;
        });
    }
    /**
     * 屏幕中提示击杀信息
     * @param txt 信息
     * @returns 
     */
    public showKillTip(txt: string) {
        Tips.show(txt);
        // this.initKillTip();
        // if (!this.killTipRoot)
        //     return;
        // this.txtKillInfo.text = txt;
        // this.killTipsTween.stop();
        // this.killTipsTween.to({ o: 1 }, 500);
        // this.killTipsTween.start();
    }
    private initKillTip() {
        if (this.killTipRoot)
            return;
        let root = UIManager.canvas;
        if (!root)
            return;
        this.killTipRoot = mw.Canvas.newObject(root, 'KillInfoUI');
        this.killTipRoot.size = new mw.Vector2(400, 100);
        this.killTipRoot.position = new mw.Vector2(root.size.x * 0.5 - 300, 300);
        this.killTipRoot.zOrder = 110000;

        let img = mw.Image.newObject(this.killTipRoot, 'Bg');
        img.imageDrawType = mw.SlateBrushDrawType.Box;
        img.margin = new mw.Margin(0.6);
        img.size = new mw.Vector2(600, 90);
        img.imageGuid = '99137';

        this.txtKillInfo = mw.TextBlock.newObject(this.killTipRoot, 'txtKillInfo');
        this.txtKillInfo.fontSize = 22;
        this.txtKillInfo.position = new mw.Vector2(0, 10);
        this.txtKillInfo.size = new mw.Vector2(500, 60);
        this.txtKillInfo.textVerticalJustification = mw.TextVerticalJustify.Center;
        this.txtKillInfo.textJustification = mw.TextJustify.Center;
        this.txtKillInfo.outlineColor = new mw.LinearColor(0, 0, 0);
        this.txtKillInfo.fontColor = new mw.LinearColor(1, 0.14, 1);
        this.txtKillInfo.outlineSize = 2;
        this.txtKillInfo.glyph = mw.UIFontGlyph.Normal;

        this.killTipsTween = new mw.Tween({ o: 0 })
            .to({ o: 1 }, 500)
            .onStart(obj => {
                this.killTipRoot.visibility = mw.SlateVisibility.Visible;
                this.killTipRoot.renderOpacity = obj.o;
            })
            .onUpdate(obj => {
                this.killTipRoot.renderOpacity = obj.o;
            })
            .onComplete(() => {
                this.killTipRoot.visibility = mw.SlateVisibility.Collapsed;
            })
            .onStop(() => {
                this.killTipRoot.visibility = mw.SlateVisibility.Collapsed;
            })
            .yoyo(true)
            .repeat(1)
            .repeatDelay(1000)
    }
}