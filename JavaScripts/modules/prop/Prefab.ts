import { SpawnManager, SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
/**
 * @Author       : 田可成
 * @Date         : 2023-04-26 09:57:31
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-27 16:16:58
 * @FilePath     : \mollywoodschool\JavaScripts\modules\Prop\prefabObj.ts
 * @Description  : 
 */
export class Prefab {
    public obj: mw.GameObject
    public script: mw.Script
    public life: number
    public isActive: boolean = false
    public guid: string;

    constructor(guid: string) {
        this.guid = guid;
    }

    public async spawn(life: number, isClient: boolean, ...param) {
        if (!this.obj) {
            this.obj = await SpawnManager.asyncSpawn({ guid: this.guid, replicates: !isClient })
            this.script = this.obj.getScripts()[0]
        }
        this.obj.setCollision(mw.PropertyStatus.On)
        this.obj.setVisibility(mw.PropertyStatus.On)
        if (this.script) this.script["spawn"](...param);
        this.life = life;
        this.isActive = true
    }

    public despawn() {
        this.obj.setCollision(mw.PropertyStatus.Off)
        this.obj.setVisibility(mw.PropertyStatus.Off)

        TimeUtil.delayExecute(() => {
            this.obj.worldTransform.position = despawnLocation;
        }, 3)
        if (this.script) this.script["despawn"]();
        this.isActive = false;
    }

    public destory() {
        this.isActive = false;
        this.obj.destroy()
        this.obj = null;
        if (this.script) {
            this.script["despawn"]();
            this.script.destroy()
            this.script = null;
        }
    }
}
const despawnLocation = new mw.Vector(9999, 9999, 9999)