import { GlobalData } from "../../const/GlobalData";
import GameUtils from "../../utils/GameUtils";
import DropItem, { ERewardType } from "./DropItem";

export default class DropManager {
    private static _instance: DropManager = null;
    public static getInstance(): DropManager {
        if (this._instance == null) {
            this._instance = new DropManager();

        }
        return this._instance;
    }
    private _drops: DropItem[] = [];

    start() {
        //     TimeUtil.setInterval(() => {
        //         this.comparePlayerDis();
        //     }, 200)
        TimeUtil.setInterval(() => {
            if (this._drops.length > GlobalData.stackNum)
                this.compareDis(MathUtil.randomInt(0, this._drops.length));
        }, 3)
    }

    /**在当前坐标一圈为方向创建掉落 
     * @param pos 当前坐标
     * @param type 掉落类型
     * @param value 掉落总值
     * @param count 掉落数量
    */
    public createDrop(pos: mw.Vector, type: ERewardType, allValue: number, count: number): void {
        if (count <= 0 || allValue <= 0) return;
        let val = allValue / count;
        let needCount = GlobalData.frameNum
        let interval = TimeUtil.setInterval(() => {
            for (let i = 0; i < needCount; i++) {
                this._drops.push(new DropItem(pos, type, val));
                count--;
                if (count <= 0) {
                    TimeUtil.clearInterval(interval);
                }
            }
        }, 0.01)
    }


    /**轮询 */
    public onUpdate(dt: number): void {
        this._drops.forEach((drop: DropItem) => {
            if (drop.isDestroy) {
                this._drops.splice(this._drops.indexOf(drop), 1);
                return;
            }
            drop.update(dt);
        })
    }

    /**随机取出一个比较距离 */
    public compareDis(id: number) {
        let drop = this._drops[id];
        if (drop == null) return;
        for (let i = id + 1; i < this._drops.length; i++) {
            const element = this._drops[i];
            if (mw.Vector.squaredDistance(drop._model.worldTransform.position, element._model.worldTransform.position) < GlobalData.fetchjDistance * GlobalData.fetchjDistance) {
                {
                    drop.Gold += element.Gold;
                    drop.Diamond += element.Diamond;
                    element.destroy();
                }
            }
        }
    }

    /**比较与玩家的距离 */
    public comparePlayerDis(): void {
        let playerPos = Player.localPlayer.character.worldTransform.position;
        this._drops.forEach((element: DropItem) => {
            let dis
            if (element._model)
                dis = mw.Vector.squaredDistance(playerPos, element._model.worldTransform.position);
            if (!element._model || dis >= GlobalData.playerDistance * GlobalData.playerDistance) {
                element.destroy();
            }
        })
    }

}