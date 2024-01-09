import { Tween } from "../../../ExtensionType";
import GuidePoint_Generate from "../../../ui-generate/task/GuidePoint_generate";


class PointCell {
    icon: mw.Image
    arrow: mw.Image
    distance: mw.TextBlock
    canvas: mw.Canvas
    constructor() {
    }

    init(canvas: mw.Canvas) {
        this.canvas = canvas
        this.icon = this.canvas.findChildByPath('Icon') as mw.Image
        this.arrow = this.canvas.findChildByPath('Arrow') as mw.Image
        this.distance = this.canvas.findChildByPath('Distance') as mw.TextBlock
    }

    setVisable(bool) {
        if (bool) {
            this.canvas.visibility = mw.SlateVisibility.SelfHitTestInvisible
        } else {
            this.canvas.visibility = mw.SlateVisibility.Collapsed
        }
    }

    setDistance(tex: string) {
        this.distance.text = tex
    }
}

export default class GuidePoint extends GuidePoint_Generate {

    private _cellList: PointCell[] = []
    private _target: mw.GameObject[] = [];
    /**目标点 */
    private _targetPos: mw.Vector[] = [];
    /**UI3D到2D位置缓存 */
    // private _iconUIPos: mw.Vector2 = mw.Vector2.zero;
    /**UI 只显示在屏幕内的缓存 */
    // private _iconInScreenPos: mw.Vector2 = mw.Vector2.zero;
    /**图标大小 */
    private _iconSize: mw.Vector2 = null;
    /**箭头大小 */
    private _arrowSize: mw.Vector2 = mw.Vector2.zero;
    /**箭头位置缓存 */
    // private _arrowPos: mw.Vector2 = mw.Vector2.zero;
    /**屏幕视口大小 */
    private _screenSize: mw.Vector2 = mw.Vector2.zero;
    /**箭头方向 */
    private _arrowDirction: mw.Vector2 = new mw.Vector2(0, -1);
    /**箭头位置偏移 */
    private _arrowPosOff: mw.Vector2 = mw.Vector2.zero;
    /**是否在屏幕内 */
    // private _isInScreen: boolean = true;

    /**
     * 构造UI文件成功后，在合适的时机最先初始化一次
     */
    protected onStart() {
        //设置能否每帧触发onUpdate

        this.layer = mw.UILayerBottom;

    }

    /**
     * 每一帧调用
     * 通过canUpdate可以开启关闭调用
     * dt 两帧调用的时间差，毫秒
     */
    protected onUpdate(dt: number) {
        for (let i = 0; i < this.posLen; i++) {
            if (this._target.length > 0)
                this._targetPos[i] = this._target[i].worldTransform.position
            this.setMoveUIPos(i);
        }

    }

    /**设置移动UI位置 */
    setMoveUIPos(index: number) {
        let iconUIPos = mw.InputUtil.projectWorldPositionToWidgetPosition(this._targetPos[index], false).screenPosition;
        iconUIPos.x -= this._iconSize.x / 2;
        iconUIPos.y -= this._iconSize.y / 2;
        let isInScreen = true;
        const cell = this._cellList[index]

        let iconInScreenPos = Vector2.zero
        let arrowPos = Vector2.zero
        iconInScreenPos.set(iconUIPos);
        if (iconUIPos.x > this._screenSize.x) {
            isInScreen = false;
            iconInScreenPos.x = this._screenSize.x - this._iconSize.x;
        } else if (iconUIPos.x < 0) {
            isInScreen = false;
            iconInScreenPos.x = this._iconSize.x;
        }

        if (iconUIPos.y > this._screenSize.y) {
            isInScreen = false;
            iconInScreenPos.y = this._screenSize.y - this._iconSize.y;
        } else if (iconUIPos.y < 0) {
            isInScreen = false;
            iconInScreenPos.y = this._iconSize.y;
        }
        cell.canvas.position = iconInScreenPos

        if (!isInScreen) {
            cell.arrow.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            arrowPos.set(iconUIPos);
            arrowPos.subtract(iconInScreenPos);
            arrowPos.normalize();
            let ro = mw.Vector2.signAngle(this._arrowDirction, arrowPos);
            arrowPos.multiply(this._iconSize.x / 2);
            arrowPos.add(this._arrowPosOff);
            cell.arrow.position = arrowPos;
            cell.arrow.renderTransformAngle = ro;

        } else {
            cell.arrow.visibility = mw.SlateVisibility.Collapsed;
        }

        let playerPos = Player.localPlayer.character.worldTransform.position;
        let dis = Math.abs(this._targetPos[index].x - playerPos.x) + Math.abs(this._targetPos[index].y - playerPos.y);
        dis = Math.floor(dis / 100);
        cell.setDistance(dis + "m");
    }

    // setPointShow(point?: Vector) {
    //     if (!point) {
    //         this._targetPos = null;
    //         this.canvas_move.visibility = mw.SlateVisibility.Hidden;
    //         return
    //     }
    //     this._targetPos = point;
    //     this.canvas_move.visibility = mw.SlateVisibility.SelfHitTestInvisible;
    // }

    protected timerTween: Tween<{ x: number; }>[] = [];
    /**有几个坐标传进来 */
    protected posLen: number = 0
    /**
     * 设置显示时触发
     */
    protected onShow(pos: Vector[] | mw.GameObject[]) {
        if (!pos) return
        if (this._cellList.length == 0) {
            for (let i = 1; i <= 12; i++) {
                let item = new PointCell()
                item.init(this.rootCanvas.findChildByPath('ItemCanvas' + i) as mw.Canvas)
                this._cellList.push(item)
                if (!this._iconSize) {
                    this._iconSize = item.icon.size;
                    this._arrowSize = item.arrow.size;
                    this._arrowPosOff = new mw.Vector2(this._iconSize.x / 2 - this._arrowSize.x / 2, this._iconSize.y / 2 - this._arrowSize.y / 2);
                    this._screenSize = mw.WindowUtil.getViewportSize();
                }
            }
        }
        this.canUpdate = true;
        this._targetPos.length = 0;
        this._target.length = 0;
        this.posLen = 0
        if (pos[0] instanceof mw.GameObject) {
            this._target = pos as mw.GameObject[]
            this.posLen = this._target.length
            // console.log("_target", this.posLen)
        } else {
            this._targetPos = pos as Vector[]
            this.posLen = this._targetPos.length
            // console.log("_targetPos", this.posLen)
        }
        this.changeIcon()
    }

    protected changeIcon() {
        for (let i = 0; i < this._cellList.length; i++) {
            let tween = this.timerTween[i]
            let cell = this._cellList[i]
            if (i < this.posLen) {
                cell.setVisable(true)
                if (!tween) {
                    const tmpSize = cell.icon.renderScale
                    tween = new Tween({ x: 1, size: tmpSize.x }).to({ x: 0.4, size: tmpSize.x / 1.2 }, 1150).onUpdate((obj) => {
                        cell.icon.renderOpacity = obj.x
                        cell.icon.renderScale = new Vector2(obj.size, obj.size)
                    })
                        .yoyo(true).
                        repeat(Infinity)
                        .start()
                        .easing(mw.TweenUtil.Easing.Sinusoidal.InOut)
                        .onComplete(() => {
                        })
                    this.timerTween.push(tween)
                }
                else {
                    tween.stop()
                    tween.start()
                }
            } else {
                cell.setVisable(false)
                if (!tween) {
                    const tmpSize = cell.icon.renderScale
                    tween = new Tween({ x: 1, size: tmpSize.x }).to({ x: 0.4, size: tmpSize.x / 1.2 }, 1150).onUpdate((obj) => {
                        cell.icon.renderOpacity = obj.x
                        cell.icon.renderScale = new Vector2(obj.size, obj.size)
                    })
                        .yoyo(true).
                        repeat(Infinity)
                        .start()
                        .easing(mw.TweenUtil.Easing.Sinusoidal.InOut)
                        .onComplete(() => {
                        })
                    this.timerTween.push(tween)
                }
                tween.stop()
            }
        }
    }

    /**
     * 设置不显示时触发
     */
    protected onHide() {
        this.canUpdate = false;
        this.timerTween.forEach(e => {
            e.stop()
        })
        this._targetPos.length = 0;
        this._target.length = 0;
    }
}
