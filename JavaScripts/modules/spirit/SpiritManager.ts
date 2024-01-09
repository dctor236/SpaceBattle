import { SpawnManager, SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
export default class SpiritManager {
    private static _instance: SpiritManager;
    public srcPool: mw.GameObject[] = []
    public static get instance() {
        if (!this._instance) {
            this._instance = new SpiritManager();

        }
        return this._instance
    }

    constructor() {
    }

    public async spawn(asset: string, location: mw.Vector, rotation: mw.Rotation) {
        let obj = this.srcPool.pop()
        if (!obj) {
            obj = await SpawnManager.asyncSpawn({
                guid: asset,
                replicates: false,
            })
            if ((obj instanceof Character) && obj.player == null) {
                obj.worldTransform.scale = new Vector(0.5, 0.5, 0.5)
                // obj.characterType = mw.AppearanceType.HumanoidV1
                const humanV1 = obj;
                humanV1.description.base.wholeBody = asset
                obj.maxWalkSpeed = 360;
                obj.collisionWithOtherCharacterEnabled = true
                obj.movementDirection = mw.MovementDirection.AxisDirection
                obj.displayName = ""
                obj.walkableFloorAngle = 180;
                obj.rotateRate = -1;
                obj.switchToFlying()
            }
        }

        if ((obj instanceof Character) && obj.player == null) {
            obj.movementEnabled = obj.jumpEnabled = true
        } else {

        }

        obj.worldTransform.position = location
        obj.worldTransform.rotation = rotation;
        obj.setVisibility(mw.PropertyStatus.On)
        obj.setCollision(mw.CollisionStatus.On)
        return obj
    }

    public unSpawn(obj: mw.GameObject): void {
        obj.worldTransform.position = Vector.one.multiply(-5000)
        if ((obj instanceof Character) && obj.player == null) {
            obj.movementEnabled = obj.jumpEnabled = false
            obj.getChildren().forEach(e => {
                if (e instanceof mw.Trigger) {
                    e.parent = null
                    e.destroy()
                }
            })
            this.srcPool.push(obj);
        }
    }
}