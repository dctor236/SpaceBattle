export interface SpawnInfo {
    guid?: string;
    gameObjectId?: string;
    /** @description 是否同步 */
    replicates?: boolean;
    /** @description transform */
    transform?: mw.Transform;
}

export class SpawnManager {
    private static replicateDic: Map<string, string> = new Map([
        ["104", "Sound"],
        ["109", "SpawnLocation"],
        ["113", "Trigger"],
        ["116", "Interactor"],
        ["117", "BlockingVolume"],
        ["4301", "PointLight"],
        ["4306", "Effect"],
        ["20191", "PhysicsThruster"],
        ["20193", "NavigationVolume"],
        ["21151", "PostProcess"],
        ["108547", "ObjectLauncher"],
        ["119918", "IntegratedMover"],
        ["12683", "SwimmingVolume"],
        ["16037", "UIWidget"],
        ["16038", "WheeledVehicle4W"],
        ["20504", "PhysicsFulcrum"],
        ["20194", "NavModifierVolume"],
        ["20638", "HotWeapon"],
        ["25782", "Anchor"],
        ["67455", "PhysicsImpulse"],
        ["NPC", "Character"],
        ["31969", "Character"],
        ["124744", "Character"],
        ["28449", "Character"],

        ["BlockingArea", "BlockingVolume"],
        ["RelativeEffect", "Effect"],
        ["Thruster", "PhysicsThruster"],
        ["NavMeshVolume", "NavigationVolume"],
        ["PostProcessAdvance", "PostProcess"],
        ["ProjectileLauncher", "ObjectLauncher"],
        ["PhysicsSports", "IntegratedMover"],
    ])
    private static deleteDic: Map<string, boolean> = new Map([
        ["110", true],
        ["8444", true],
        ["14090", true],
        ["14971", true],
        ["2695", true],
        ["30829", true],
        ["31479", true],
        ["14197", true],
    ])
    private static replicateGuid(guid: string) {
        let res = guid;
        if (this.replicateDic.has(guid)) {
            res = this.replicateDic.get(guid);
        } else if (this.deleteDic.has(guid)) {
            console.error("使用已经删除的id", guid);
        }
        return res;
    }

    public static modifyPoolSpawn<T extends GameObject>(guid: string, type?: GameObjPoolSourceType): T {
        let assetId = this.replicateGuid(guid);
        if (type == undefined) {
            return GameObjPool.spawn(assetId);
        }
        return GameObjPool.spawn(assetId, type);
    }

    public static modifyPoolAsyncSpawn<T extends GameObject>(guid: string, type?: GameObjPoolSourceType): Promise<T> {
        let assetId = this.replicateGuid(guid);
        if (type == undefined) {
            return GameObjPool.asyncSpawn(assetId);
        }
        return GameObjPool.asyncSpawn(assetId, type);
    }

    public static wornSpawn<T extends GameObject>(assetId: string, inReplicates?: boolean, transform?: mw.Transform): T {
        let info: SpawnInfo = {
            guid: assetId,
            replicates: inReplicates,
            transform: transform
        }
        return this.spawn(info);
    }

    public static wornAsyncSpawn<T extends GameObject>(assetId: string, inReplicates?: boolean, transform?: mw.Transform): Promise<T> {
        let info: SpawnInfo = {
            guid: assetId,
            replicates: inReplicates,
            transform: transform
        }
        return this.asyncSpawn(info);
    }

    public static spawn<T extends GameObject>(info: SpawnInfo): T {
        let assetId = info.gameObjectId ? info.gameObjectId : info.guid;
        let guid = this.replicateGuid(assetId);
        let obj = mw.GameObject.spawn<T>(guid, { replicates: info.replicates, transform: info.transform });
        return obj;
    }

    public static asyncSpawn<T extends GameObject>(info: SpawnInfo): Promise<T> {
        let assetId = info.gameObjectId ? info.gameObjectId : info.guid;
        let guid = this.replicateGuid(assetId);
        let obj = mw.GameObject.asyncSpawn<T>(guid, { replicates: info.replicates, transform: info.transform });
        return obj;
    }
}