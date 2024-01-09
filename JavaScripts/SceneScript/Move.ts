import { Tween } from "../ExtensionType";
import { EasingFunction, Easing } from "./Tween";

export enum EasingType {
    /**线性 */
    Linear = "Linear",
    Quadratic = "Quadratic",
    Cubic = "Cubic",
    Quartic = "Quartic",
    Quintic = "Quintic",
    Sinusoidal = "Sinusoidal",
    Exponential = "Exponential",
    Circular = "Circular",
    Elastic = "Elastic",
    Back = "Back",
    Bounce = "Bounce"
}

export enum MoveTransType {
    In = "In",
    InOut = "InOut",
    Out = "Out"
}

@Component
export default class Move extends mw.Script {
    static MoveEventTitle = "___Move";
    @mw.Property({ displayName: "自动启用", group: "约束设置" })
    public isActive: boolean = false;
    @mw.Property({ displayName: "平移距离", group: "平移设置" })
    public translateDistance: mw.Vector = new mw.Vector(0, 0, 0);
    @mw.Property({ displayName: "重复执行", group: "平移设置" })
    public translateRepeat: boolean = false;
    @mw.Property({ displayName: "单程运动时间", group: "平移设置" })
    public translateTime: number = 0;
    @mw.Property({ displayName: "到达后停顿时间", group: "平移设置" })
    public translateDelay: number = 0;
    @mw.Property({ displayName: "是否有回程", group: "平移设置" })
    public hasBack: boolean = false;
    @mw.Property({ displayName: "运动类型选择", group: "平移设置", selectOptions: EasingType })
    public easingType: EasingType = EasingType.Linear;
    @mw.Property({ displayName: "运动过程选择", group: "平移设置", selectOptions: MoveTransType })
    public moveTransType: MoveTransType = MoveTransType.In;
    public tween

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.initTransLate();
    }

    startPos: Vector = Vector.zero
    endPos: Vector = Vector.zero
    isPlay: boolean = false
    enterPlayerIds: number[] = []
    initTransLate() {
        if (this.translateDistance.equals(mw.Vector.zero) || this.translateTime === 0) return;
        //一秒多少  最终终点是  
        this.startPos = this.gameObject.worldTransform.position.clone();
        this.endPos = this.gameObject.worldTransform.position.clone().add(this.translateDistance);

        if (this.translateRepeat) {
            this.tween = new Tween({ time: 0 }).to({ time: 1 }, this.translateTime * 1000).onUpdate((obj) => {
                this.gameObject.worldTransform.position = mw.Vector.lerp(this.startPos, this.endPos, obj.time);
            }).repeat(this.translateRepeat ? Infinity : 1).repeatDelay(this.translateDelay * 1000).easing(this.getEasing()).yoyo(this.hasBack)
            this.tween.delay(this.translateDelay * 1000)
        } else {
            this.tween = new Tween({ time: 0 }).to({ time: 1 }, this.translateTime * 1000).onUpdate((obj) => {
                this.gameObject.worldTransform.position = mw.Vector.lerp(this.startPos, this.endPos, obj.time);
            })
        }

        if (this.isActive) {
            this.tween.start()
        }
        Event.addLocalListener('OpenMover', (enter: number, isPlay: boolean) => {
            if (this.isPlay == isPlay) return
            let res = this.enterPlayerIds.indexOf(enter)
            if (isPlay) {
                if (res == -1) {
                    this.enterPlayerIds.push(enter)
                }
                this.tween = new Tween({ time: 0 }).to({ time: 1 }, this.translateTime * 1000).onUpdate((obj) => {
                    this.gameObject.worldTransform.position = mw.Vector.lerp(this.startPos, this.endPos, obj.time);
                })
                    .onStart(() => {
                        this.gameObject.setCollision(mw.CollisionStatus.Off)
                    })
                    .onComplete(() => {
                        this.gameObject.setCollision(mw.CollisionStatus.On)
                    })
            } else {
                if (res != -1) {
                    this.enterPlayerIds.splice(res, 1)
                }

                if (this.enterPlayerIds.length > 0) return
                this.tween = new Tween({ time: 0 }).to({ time: 1 }, this.translateTime * 1000).onUpdate((obj) => {
                    this.gameObject.worldTransform.position = mw.Vector.lerp(this.endPos, this.startPos, obj.time);
                })
                    .onStart(() => {
                        this.gameObject.setCollision(mw.CollisionStatus.Off)
                    })
                    .onComplete(() => {
                        this.gameObject.setCollision(mw.CollisionStatus.On)
                    })
            }
            this.tween.start();
            this.isPlay = isPlay
            // if (isPlay) {
            //     this.gameObject.setVisibility(mw.PropertyStatus.On, true)
            // } else {
            //     this.gameObject.setVisibility(mw.PropertyStatus.Off, true)
            // }
        })
    }
    private getEasing(): EasingFunction {
        return Easing[this.easingType][this.moveTransType];
    }
    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}