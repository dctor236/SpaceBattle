import { SpawnManager,SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
﻿
export abstract class MoveControl extends mw.Script {
    abstract enable: boolean
}

@Component
export default class DragonMove extends MoveControl {
    enable: boolean = true
    @mw.Property({ displayName: "运动向量数组", group: "属性" })
    Posvector: Vector[] = [new Vector(0, 0, 50)]
    @mw.Property({ displayName: "变化值数组", group: "属性" })
    flag: number[] = [50]
    @mw.Property({ displayName: "位移1旋转2大小3", group: "属性" })
    type: number = 1
    protected mover: mw.IntegratedMover = null
    protected moveIndex: number = 0
    count: number = 0
    protected async onStart(): Promise<void> {
        await this.initMover()
        setTimeout(() => {
            switch (this.type) {
                case 1: this.mover.linearSpeed = this.Posvector[this.moveIndex];
                    break
                case 2: this.mover.rotationSpeed = this.Posvector[this.moveIndex];
                    break
                case 3: this.mover.scaleSpeed = this.Posvector[this.moveIndex];
                    break
                default: break
            }

            setInterval(() => {
                // console.log("setmobvefasfas", this.enable)
                if (this.enable && this.mover) {
                    this.active()
                } else {
                    if (this.mover) {
                        this.mover.enable == false
                        this.mover.moverReset()
                    }

                }
            }, 1000)
        }, 5000);
    }

    async initMover() {
        this.mover = await SpawnManager.asyncSpawn({ guid: 'PhysicsSports' }) as mw.IntegratedMover
        this.mover.enable = false;
        this.mover.linearRepeat = false
        this.mover.rotationRepeat = false
        this.mover.scaleRepeat = false
        this.mover.localTransform.position = Vector.zero
        this.mover.localTransform.rotation = Rotation.zero
        this.mover.parent = this.gameObject
    }



    async active() {
        if (this.mover.enable) {
            this.mover.enable = false
        }
        if (this.count < this.flag[this.moveIndex]) {
            this.count++
        } else {
            if (this.moveIndex >= this.flag.length - 1) {
                this.moveIndex = 0
            } else {
                this.moveIndex++
            }
            this.count = 0
            switch (this.type) {
                case 1: this.mover.linearSpeed = this.Posvector[this.moveIndex];
                    break
                case 2: this.mover.rotationSpeed = this.Posvector[this.moveIndex];
                    break
                case 3: this.mover.scaleSpeed = this.Posvector[this.moveIndex];
                    break
                default: break
            }
        }

        this.mover.enable = true

        return true
    }

    protected onUpdate(dt: number): void {

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}