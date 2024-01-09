import { SpawnManager,SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
﻿
@Component
export default class BoatMove extends mw.Script {
    protected mover: mw.IntegratedMover = null
    protected moveIndex: number = 0
    count: number = 0
    protected async onStart(): Promise<void> {
        if (SystemUtil.isClient())
            return
        await this.initMover()
        setTimeout(() => {
            this.mover.linearSpeed = this.Posvector[this.moveIndex]
            this.active()
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

    Posvector: Vector[] = [new Vector(400, 0, 0), new Vector(0, 0, -500)
        , new Vector(0, 0, 500), new Vector(-400, 0, 0)]

    flag: number[] = [1, 25, 25, 1]

    async active() {

        if ((this.moveIndex == 0 && this.count == 0) ||
            (this.moveIndex == 1 && this.count == this.flag[this.moveIndex])) {
            await TimeUtil.delaySecond(8)
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
            this.mover.linearSpeed = this.Posvector[this.moveIndex]
        }

        this.mover.enable = true
        setTimeout(() => {
            this.mover.enable = false
            this.active()
        }, 1000)
        return true
    }

    protected onUpdate(dt: number): void {

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}