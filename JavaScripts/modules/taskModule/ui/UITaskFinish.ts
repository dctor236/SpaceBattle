/*
 * @Author: 王嵘 rong.wang@appshahe.com
 * @Date: 2022-12-13 10:41:12
 * @LastEditTime: 2023-05-21 01:07:52
 * @Description: Avatar Creator Development
 */

import { Tween } from "../../../ExtensionType";
import TaskFinish_Generate from "../../../ui-generate/task/TaskFinish_generate";

export default class UITaskFinish extends TaskFinish_Generate {

    private _iconAni: Tween<{ x }>;
    private _scaleAni: Tween<{ scale }>;
    private _textAni: Tween<{ x }>;
    private _vanishAni: Tween<{ opacity }>;
    private _tmpVec2: mw.Vector2;
    private _tmpScale: mw.Vector2;
    /**是否已更改图片 */
    private _hasChange: boolean;
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.layer = mw.UILayerTop;
        this.canUpdate = true;
        this._tmpVec2 = new mw.Vector2();
        this._tmpScale = new mw.Vector2();
        this._hasChange = false;

        this._iconAni = new Tween({ x: this.anchor.position.x + this.anchor.size.x })
            .to({ x: this.anchor.position.x - this.img_Icon.size.x / 2 }, 500);
        this._iconAni.onUpdate((val) => {
            this._tmpVec2.set(val.x, this.img_Icon.position.y);
            this.img_Icon.position = this._tmpVec2;
        })

        this._scaleAni = new Tween({ scale: -Math.PI })
            .to({ scale: Math.PI }, 500);
        this._scaleAni.onUpdate((val) => {
            this._tmpScale.set(Math.sin(val.scale) * 0.5 + 1, Math.sin(val.scale) * 0.5 + 1);
            this.img_Icon.renderScale = this._tmpScale;
            if (val.scale > 0 && !this._hasChange) {
                this.img_Icon.imageGuid = "163381";
                this._hasChange = true;
            }
        })

        this._textAni = new Tween({ x: -this.canvas_Task.size.x }).to({ x: 0 }, 800);
        this._textAni.onUpdate((val) => {
            this._tmpVec2.set(val.x, this.canvas_Task.position.y);
            this.canvas_Task.position = this._tmpVec2;
        })

        this._vanishAni = new Tween({ opacity: 1 }).to({ opacity: 0 }, 1000).delay(2500);
        this._vanishAni.onUpdate((val) => {
            this.rootCanvas.renderOpacity = val.opacity;
        })
        this._vanishAni.onComplete(() => {
            mw.UIService.hideUI(this);

        })

        this._iconAni.chain(this._scaleAni);
        this._scaleAni.chain(this._textAni);
        this._textAni.chain(this._vanishAni);
    }

    protected onShow(str: string) {
        this.initUI();
        this.txt_Task.text = str;
        this.rootCanvas.renderOpacity = 1;
        this._iconAni.start();
    }
    /**初始化 */
    initUI() {
        this._iconAni.stop();
        this._textAni.stop();
        this._vanishAni.stop();

        this._hasChange = false;
        this.img_Icon.imageGuid = "163381";
        this._tmpVec2.set(this.anchor.position.x + this.anchor.size.x, this.img_Icon.position.y);
        this.img_Icon.position = this._tmpVec2;

        this._tmpVec2.set(-this.canvas_Task.size.x, this.canvas_Task.position.y);
        this.canvas_Task.position = this._tmpVec2;


    }
    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}