import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import { GameConfig } from "../../config/GameConfig";
import { EventsName } from "../../const/GameEnum";
import { CameraType } from "../../ui/cameraUI/CameraMainUI";
import GameUtils from "../../utils/GameUtils";
import { PropBaseData_Action, PropBaseData_Fly, PropBaseData_Placement } from "../squareBase/PropBase/PropBaseData";
import { PropBaseModuleS } from "../squareBase/PropBase/PropBaseModule";
import { Prefab } from "./Prefab";
import { PropModuleC } from "./PropModuleC";

export class PropModuleS extends PropBaseModuleS<PropModuleC, null>{
    private _effectMap: Map<number, number> = new Map();
    private _soundMap: Map<number, number> = new Map();
    private _prefabPoolMap: Map<string, Prefab[]> = new Map()
    private _callClientArr: any[] = []

    onStart(): void {
        super.onStart();

        Event.addClientListener(EventsName.LoadProp, (player: mw.Player, prop: number) => {
            if (!prop) {
                return
            }
            const playerId = player.playerId;
            setTimeout(() => {
                this.equipProp(prop, playerId);
            }, 50);
        })

        Event.addClientListener(EventsName.UnloadProp, (player: mw.Player, prop: number) => {
            if (!prop) {
                return
            }
            const playerId = player.playerId;
            this.unLoadProp(prop, playerId);
        })
    }

    protected onPlayerLeft(player: mw.Player): void {
        this.unLoadProp(10001, player.playerId)
    }

    addModuleFun(playerId: any, otherId: any) {
        // throw new Error("Method not implemented.");
    }

    getActionPropData(configID: number): PropBaseData_Action {
        if (!configID) {
            return
        }
        let data = new PropBaseData_Action();
        data.analysis(GameConfig.PropAction.getElement(configID));
        return data;
    }
    getFlyPropData(ConfigID: number): PropBaseData_Fly {
        let data = new PropBaseData_Fly();
        data.analysis(GameConfig.PropFly.getElement(ConfigID));
        return data;
    }
    getPlacementData(ConfigID: number): PropBaseData_Placement {
        let data = new PropBaseData_Placement();
        data.analysis(GameConfig.PropPlacement.getElement(ConfigID));
        return data;
    }

    equipOtherProp(propID: number, playerId: number): Object {
        // 开启相机
        if (propID == GameConfig.Global.getElement(31).Value) {
            this.getClient(playerId).net_UseCamera(CameraType.Camera_FP);
        } else if (propID == GameConfig.Global.getElement(32).Value) {
            this.getClient(playerId).net_UseCamera(CameraType.Camera_Tripod);
        }
        return;
    }

    unLoadOtherProp(otherProp: any, playerId: number): void {

    }

    /** 
     * 生成物体对象
     * @param  guid
     * @param  player
     * @return 
     */
    public async net_SpawnPrefab(guid: string, time: number, loc: mw.Vector, isClient: boolean, player?: mw.Player) {
        if (!player) return;
        if (isClient) {
            const playerArr: mw.Player[] = Player.getAllPlayers();
            for (let i = 0; i < playerArr.length; i++) {
                const element = playerArr[i];
                if (element.playerId == player.playerId) continue;
                if (GameUtils.inDistance(loc, element.character.worldTransform.position, 3000)) {
                    this._callClientArr.push(() => { this.getClient(element).net_SpawnPrefab(guid, time, loc) })
                }
            }
        } else {
            let objPool: Prefab[]
            if (!this._prefabPoolMap.has(guid)) {
                objPool = []
                this._prefabPoolMap.set(guid, objPool)
            } else {
                objPool = this._prefabPoolMap.get(guid);
            }
            let prefab: Prefab;
            let isNew: boolean = true
            for (let i = 0; i < objPool.length; i++) {
                const element = objPool[i]
                if (!element.isActive) {
                    prefab = element;
                    isNew = false;
                    break;
                }
                if (i == 30) {
                    prefab = objPool.shift()
                    objPool.push(prefab)
                    isNew = false;
                }
            }
            if (isNew) {
                prefab = new Prefab(guid);
                objPool.push(prefab)
            }
            await prefab.spawn(time, false, player.character.worldTransform.getForwardVector().multiply(-1).toRotation());
            prefab.obj.worldTransform.position = loc
            if (objPool.length >= 30) {
                console.log(guid + "造物超过了" + objPool.length)
            }
        }
    }

    /** 
     * 播放特效
     * @param  source
     * @param  slotType
     * @param  loop
     * @param  offset
     * @param  rotation
     * @param  scale
     * @param  player
     * @return 
     */
    net_PlayEffect(source: string, slotType: mw.HumanoidSlotType, loop?: number, offset?: mw.Vector, rotation?: mw.Rotation, scale?: mw.Vector, player?: mw.Player) {
        const playerId = player.playerId
        if (this._effectMap.has(playerId)) {
            const effect = this._effectMap.get(playerId)
            EffectService.stop(effect)
        }
        const effect = GeneralManager.rpcPlayEffectOnPlayer(source, player, slotType, loop, offset, rotation, scale)
        this._effectMap.set(playerId, effect);
    }

    /** 
     * 停止特效
     * @param  player
     * @return 
     */
    net_StopEffect(player?: mw.Player) {
        const playerId = player.playerId
        if (this._effectMap.has(playerId)) {
            const effect = this._effectMap.get(playerId)
            EffectService.stop(effect)
            this._effectMap.delete(playerId)
        }
    }

    /** 
     * 播放音效
     * @param  resId
     * @param  target
     * @param  loopNum
     * @param  volume
     * @param  playParam
     * @param  player
     * @return 
     */
    net_PlaySound(resId: string, target: string | mw.GameObject | mw.Vector, loopNum?: number, volume?: number, playParam?: any, player?: mw.Player) {
        const playerId = player.playerId
        if (this._soundMap.has(playerId)) {
            const sound = this._soundMap.get(playerId)
            SoundService.stop3DSound(sound)
        }
        const sound = SoundService.play3DSound(resId, target, loopNum, volume, playParam)
        this._soundMap.set(playerId, sound);
    }

    /** 
     * 停止音效
     * @param  player
     * @return 
     */
    net_StopSound(player?: mw.Player) {
        const playerId = player.playerId
        if (this._soundMap.has(playerId)) {
            const sound = this._soundMap.get(playerId)
            SoundService.stop3DSound(sound)
            this._soundMap.delete(playerId)
        }
    }

    protected onUpdate(dt: number): void {
        if (this._callClientArr.length > 0) {
            this._callClientArr.pop()();
        }
        for (const [guid, prefabPool] of this._prefabPoolMap) {
            for (let i = 0; i < prefabPool.length; i++) {
                const element = prefabPool[i];
                if (element.isActive) {
                    element.life -= dt;
                    if (element.life <= 0) {
                        element.despawn()
                    }
                }
            }
        }
    }

    protected onDestroy(): void {
        for (const [guid, prefabPool] of this._prefabPoolMap) {
            for (let i = 0; i < prefabPool.length; i++) {
                const element = prefabPool[i];
                element.destory()
            }
        }
    }
}