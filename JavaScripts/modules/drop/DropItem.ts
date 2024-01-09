import { GlobalData } from "../../const/GlobalData";
import { GoPool, SoundManager, UIManager } from "../../ExtensionType";
import { PlayerMgr } from "../../ts3/player/PlayerMgr";
import { PlayerModuleC } from "../../ts3/player/PlayerModuleC";
import { BagModuleC } from "../bag/BagModuleC";
import { CoinType } from "../shop/ShopData";
import NightFind from "./ui/NightFind";
import { setPos, getPos, cubicBezier } from "./utils/MoveUtil";
/**掉落物奖励类型 */
export enum ERewardType {
    LittleBill = 1,
    MidBill = 2,
    BigBill = 3,
    RepairBox = 4
}

export default class DropItem {
    /**金币值 */
    private _gold: number = 0;
    /**钻石值 */
    private _diamond: number = 0;
    private _fetchItem: number = 0

    /**当前模型 */
    public _model: mw.GameObject = null;
    private get _maxDis(): number {
        return GlobalData.resourceToPlayer * 1;
    }
    private canUpdate: boolean = false;
    public isDestroy: boolean = false;

    /**模拟物理贝塞尔 */
    private _physicsBezier: number[] = GlobalData.physicsBezier;
    /**是否开始弹跳 */
    private _isStartJump: boolean = false;
    protected initPos: Vector = Vector.zero
    constructor(targetPos: mw.Vector, type: ERewardType, value: number) {
        this.isDestroy = false;
        this._isStartJump = false;
        if (type == ERewardType.LittleBill) {
            this._model = GoPool.spawn("CA1C4D914A87498BC1CB87B8645840D5");
            this._gold = value;
        } else if (type == ERewardType.MidBill) {
            this._model = GoPool.spawn("65DB9EE44710B8FC9A8658942F8640A5");
            this._gold = value; // this._diamond = value;
        } else if (type == ERewardType.BigBill) {
            this._model = GoPool.spawn("E1240BCE4385942142B811815FE0E8B7");
            this._gold = value;// this._diamond = value;
        } else if (type == ERewardType.RepairBox) {
            this._model = GoPool.spawn("E76AC9424515836F02CC07B880E26F8F");
            this._fetchItem = 140015
        }

        this.initPos = targetPos
        setPos(this._model, targetPos);
        if (this._model instanceof mw.Effect) {
            this._model.play();
            this._model.loop = true;
        }
        this._model.setCollision(mw.PropertyStatus.Off, true)
        this.init();
    }


    public get Gold(): number {
        return this._gold;
    }
    set Gold(val: number) {
        this._gold = val;
    }
    get Diamond(): number {
        return this._diamond;
    }
    set Diamond(val: number) {
        this._diamond = val;
    }

    // private isBox: boolean = false;
    private init(): void {
        // this.isBox = false;
        let radiusarr = GlobalData.randomRadius;
        let radius = MathUtil.randomFloat(radiusarr[0], radiusarr[1]);  //半径
        const angle = Math.random() * Math.PI * 2; // 随机生成一个角度
        const x = radius * Math.cos(angle); // 计算x坐标
        const y = radius * Math.sin(angle); // 计算y坐标
        let startLoc = getPos(this._model);
        let hights = GlobalData.heightRandoms;
        let hight = MathUtil.randomFloat(hights[0], hights[1]);
        let up: number;
        // if (isBox)
        //     up = GlobalData.DropAni.resourceYArr[1];
        // else
        up = this.initPos.z//GlobalData.resourceYArr[0];
        const endPoint = new mw.Vector(startLoc.x + x, startLoc.y + y, up); //地面高度
        let dir = mw.Vector.subtract(endPoint, startLoc).normalized;
        const controlPoint = new mw.Vector((endPoint.x - startLoc.x) * 1 / 4 + startLoc.x,
            (endPoint.y - startLoc.y) * 1 / 4 + startLoc.y, startLoc.z + hight); //飞行高度

        this._flyToTween = new mw.Tween(startLoc).to({
            x: [
                controlPoint.x,
                endPoint.x
            ],
            y: [
                controlPoint.y,
                endPoint.y
            ],
            z: [
                controlPoint.z,
                endPoint.z
            ]
        }, GlobalData.dropTime).interpolation(TweenUtil.Interpolation.Bezier)
            .onUpdate((value: mw.Vector) => {
                if (value.z >= hight) {
                    this.canUpdate = true;
                }
                setPos(this._model, value);
            }).onComplete(() => {
                this.canUpdate = true;
                this.rollToTarget(dir);
                Event.dispatchToServer("PlaySoundResourceDown", this._model.worldTransform.position)
            }).start().easing(cubicBezier(this._physicsBezier[0], this._physicsBezier[1], this._physicsBezier[2], this._physicsBezier[3]));

        this.startDestroyTime();
    }

    /**朝目标方向滚动 */
    private rollToTarget(dir: mw.Vector): void {
        // let isRoll = Math.random() < GlobalData.rollProbability;
        // if (!isRoll) {
        this.bonce();
        return;
        // }
        let disRandoms = GlobalData.rollDistanceRandoms;
        let dis = MathUtil.randomFloat(disRandoms[0], disRandoms[1]);
        let time = MathUtil.randomFloat(GlobalData.rollTime[0], GlobalData.rollTime[1]);
        let startLoc = getPos(this._model);
        let endLoc = mw.Vector.add(startLoc, mw.Vector.multiply(dir, dis));
        this._flyToTween.stop();
        this._flyToTween = new mw.Tween(startLoc).to({ x: endLoc.x, y: endLoc.y }, time)
            .onUpdate((value: mw.Vector) => {
                setPos(this._model, value);
            }).onComplete(() => {
                this.bonce();

            }).start();
    }
    private destroyInterval: any;
    private startDestroyTime(): void {
        this.destroyInterval = TimeUtil.setInterval(() => {
            this.destroy()
            TimeUtil.clearInterval(this.destroyInterval);
        }, GlobalData.destroyTime)
    }
    private clearDestroy(): void {
        if (this.destroyInterval) {
            TimeUtil.clearInterval(this.destroyInterval);
            this.destroyInterval = null;
        }
    }

    /**开始进入弹跳 */
    private bonce(): void {
        this._isStartJump = false;
        let idBonce = Math.random() < GlobalData.bonceProbability;
        if (!idBonce || !this._model) {
            this._isStartJump = true;
            return;
        }
        this._flyToTween?.end();
        let height = MathUtil.randomFloat(GlobalData.bonceHeight[0], GlobalData.bonceHeight[1]);
        let startPos = getPos(this._model).clone();
        // if (this.isBox)
        //     startPos.z = GlobalData.resourceYArr[1];
        // else
        startPos.z = this.initPos.z// GlobalData.resourceYArr[0];
        this._flyToTween = new mw.Tween(startPos).to({ z: startPos.z + height }, GlobalData.bonceUpTime)
            .onUpdate((value: mw.Vector) => {
                setPos(this._model, value);
            }).onComplete((obj) => {
                this._flyToTween = new mw.Tween(obj).to({ z: this.initPos.z }, GlobalData.bonceDownTime)
                    .onUpdate((value: mw.Vector) => {
                        setPos(this._model, value);
                    }).onComplete(() => {
                        this._isStartJump = true;
                    }).start().easing(TweenUtil.Easing.Bounce.Out);
            }).start().easing(TweenUtil.Easing.Quadratic.Out);
    }

    /**弹跳计时 */
    private _bonceTime: number = 0;

    /**弹跳轮询 */
    private bonceUpdate(dt: number): void {
        this._bonceTime += dt;
        if (this._bonceTime >= GlobalData.bonceTime) {
            this._bonceTime = 0;
            this._isStartJump = false;
            this.bonce();
        }
    }


    /**更新 */
    update(dt: number): void {
        if (!this.canUpdate) return;
        // if (this._isStartJump) {
        //     this.bonceUpdate(dt);
        // }
        let ownerPos = PlayerMgr.Inst.mainPos;
        let targetPos = getPos(this._model);
        let dis = mw.Vector.squaredDistance(ownerPos, targetPos);
        if (dis <= this._maxDis * this._maxDis) {
            this.flyToPlayer(dis, targetPos, ownerPos);
        }
    }

    /**飞往tween */
    private _flyToTween: mw.Tween<mw.Vector> = null;
    /**飞往tween贝塞尔 */
    private _flyToTweenBezier: number[] = GlobalData.flyToPlayerBezier;
    /**飞往玩家的时间 */
    private _flyToPlayerTime: number = GlobalData.flyToPlayerTime;

    /**飞向玩家 */
    public flyToPlayer(dis: number, targetPos: mw.Vector, ownerPos: mw.Vector): void {
        this.canUpdate = false;
        this._flyToTween.stop();
        this._flyToTween = new mw.Tween(targetPos).to(ownerPos, this._flyToPlayerTime)
            .onUpdate((value: mw.Vector) => {
                setPos(this._model, value);
            }).onComplete(() => {
                SoundManager.playSound("99733", 1, 10);
                this.destroy()
                if (this._gold > 0) {
                    //加钱
                    UIManager.getUI(NightFind).onGetCoin(CoinType.Bill, targetPos, this._gold);
                }
                if (this._diamond > 0) {
                    //钻石
                }

                if (this._fetchItem > 0) {
                    ModuleService.getModule(BagModuleC).addCreationItem(this._fetchItem, 1, false)
                }
                // SoundManager.instance.play3DSound(GlobalData.Music.resourceEnterPlayer, this._model.worldTransform.position)
            }).start().easing(cubicBezier(this._flyToTweenBezier[0], this._flyToTweenBezier[1], this._flyToTweenBezier[2], this._flyToTweenBezier[3]))
    }

    public destroy() {
        this.isDestroy = true;
        if (this._model instanceof mw.Effect)
            this._model.stop();
        this.clearDestroy();
        GoPool.despawn(this._model);
        this._flyToTween.stop()
    }

}
