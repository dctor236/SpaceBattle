/**
 * @Author       : songxing
 * @Date         : 2023-04-17 10:15:18
 * @LastEditors  : songxing
 * @LastEditTime : 2023-04-20 13:56:40
 * @FilePath     : \mollywoodschool\JavaScripts\prefabScript\Water.ts
 * @Description  : 
 */

import { EffectManager, Tween } from "../ExtensionType";
import Tips from "../ui/commonUI/Tips";

@Component
export default class Water extends mw.Script {

    private _waterEffect: mw.Effect;

    private _anchor: mw.GameObject;

    private panle1: mw.GameObject;

    private panle2: mw.GameObject;

    private mover: mw.IntegratedMover
    @mw.Property({ replicated: true, onChanged: "playWatterEffect" })
    private _isMove: boolean = false;



    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        const id = TimeUtil.setInterval(() => {
            if (this.gameObject) {
                TimeUtil.clearInterval(id);
                this.init();
            }
        }, 1)
    }

    private init() {
        if (SystemUtil.isClient()) {
            this._waterEffect = this.gameObject.getChildByName("瀑布") as mw.Effect
            this.playWatterEffect();//同步一下特效
        } else {
            this._anchor = this.gameObject.getChildByName("空锚点")
            this.panle1 = this._anchor.getChildByName("panle1")
            this.panle2 = this._anchor.getChildByName("panle2")
            this.mover = this._anchor.getChildByName("运动器") as mw.IntegratedMover
            this._anchor.setVisibility(mw.PropertyStatus.Off);
            this._anchor.setCollision(mw.PropertyStatus.Off);
        }
    }

    private _tween: Tween<any>;
    sharkCome() {
        this._isMove = true;
        this.gameObject.worldTransform.position = startPos.clone();
        if (!this._tween) {
            this._tween = new Tween({ pos: startPos.clone() })
                .to({ pos: toPos.clone() }, 3500)
                .onUpdate(v => {
                    this.gameObject.worldTransform.position = v.pos;
                })
                .start()
                .onComplete(() => {
                    this.panleMove();
                    this._anchor.setCollision(mw.PropertyStatus.On);
                })
        } else {
            this._tween.start();
        }

    }

    panleMove() {
        this.useUpdate = true;
        this.mover.enable = true;
        this.gameObject.worldTransform.position = toPos.clone()
    }

    sharkEnd() {
        this._isMove = false;
        this.useUpdate = false;
        this.mover.enable = false;
        this.gameObject.worldTransform.position = startPos.clone();
        this._anchor.worldTransform.position = anchororginPos.clone();
        this.panle1.worldTransform.position = panle1orginPos.clone();
        this.panle2.worldTransform.position = panle2orginPos.clone();
        this._anchor.setCollision(mw.PropertyStatus.Off);
    }




    playWatterEffect() {
        this._isMove ? this._waterEffect?.play() : this._waterEffect?.forceStop()
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {
        if (this.panle1.worldTransform.position.y <= -21481) {
            this.panle1.worldTransform.position = new mw.Vector(7131.560, 19352.770, -169)
        } else if (this.panle2.worldTransform.position.y <= -21481) {
            this.panle2.worldTransform.position = new mw.Vector(7131.560, 19352.770, -169)
        }
    }
}
const startPos = new mw.Vector(6818.560, 49038.770, -173.890)
const toPos = new mw.Vector(6818.560, 29455.770, -173)
const anchororginPos = new mw.Vector(6818.560, 29455, -173);
const panle1orginPos = new mw.Vector(7131, -624, -169)
const panle2orginPos = new mw.Vector(7131, 19352, -169)