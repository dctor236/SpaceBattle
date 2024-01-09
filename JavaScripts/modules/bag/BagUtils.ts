import { ModifiedCameraSystem,CameraModifid, } from '../../Modified027Editor/ModifiedCamera';

export class BagUtils {

    /**各玩家名字 */
    public static nameMap: Map<number, string[]> = new Map<number, string[]>();

    /**
     * 获取玩家姓名
     * @param playerId 
     * @returns 
     */
    public static getName(playerId: number): string {
        if (!this.nameMap.has(playerId)) {
            return "";
        }
        return this.nameMap.get(playerId)[0] || "";
    }

    /**
     * 获取玩家性别
     * @param playerId 
     * @returns 
     */
    public static getGender(playerId: number): string {
        if (!this.nameMap.has(playerId)) {
            return "1";
        }
        return this.nameMap.get(playerId)[1] || "1";
    }

    /**
     * 人物特写
     * @param isShow 
     * @param offsetAngle 偏移角度
     * @param offsetZ 偏移量z
     * @param fov 广角
     * @returns 
     */
    public static setPlayerCloseup(isShow: boolean = true, offsetAngle: number = 0, offsetZ: number = -60, fov: number = 30): void {

        if (mw.SystemUtil.isServer()) return;

        let char = Player.localPlayer.character;
        Camera.currentCamera.positionLagEnabled = true;
        Camera.currentCamera.positionLagSpeed = 5;
        Camera.currentCamera.rotationLagEnabled = true;
        Camera.currentCamera.rotationLagSpeed = 5;
        if (isShow) {
            Camera.currentCamera.fov = fov;
            let ro = char.worldTransform.clone().rotation;
            let z = ro.z - 180;
            ModifiedCameraSystem.setOverrideCameraRotation(new mw.Rotation(new mw.Vector(ro.x, ro.y, z)));
            let forward = char.worldTransform.clone().getForwardVector();
            let tarp = new mw.Vector(forward.x * 200, forward.y * 200, forward.z * 200);
            let x = tarp.x * Math.cos(offsetAngle) + tarp.y * Math.sin(offsetAngle);
            let y = -tarp.x * Math.sin(offsetAngle) + tarp.y * Math.cos(offsetAngle);
            BagUtils.cameraTargetOffset(char, new mw.Vector(x, y, offsetZ));
            char.jumpEnabled = false;
        }
        else {
            Camera.currentCamera.fov = 90;
            Camera.currentCamera.positionLagEnabled = false;
            Camera.currentCamera.rotationLagEnabled = false;
            BagUtils.cameraTargetOffset(char, new mw.Vector(0, 0, -60));
            ModifiedCameraSystem.setOverrideCameraRotation(new mw.Rotation(mw.Vector.zero));
            ModifiedCameraSystem.resetOverrideCameraRotation();
            char.jumpEnabled = true;
        }
    }

    public static cameraTargetOffset(char: mw.Character, offsetV: mw.Vector): void {
        if (mw.SystemUtil.isServer()) return;
        Camera.currentCamera.springArm.localTransform.position = offsetV;
    }
}
export class CoroutineLock {
    private static _instance: CoroutineLock = undefined
    public static get instance() {
        if (!CoroutineLock._instance)
            CoroutineLock._instance = new CoroutineLock();
        return CoroutineLock._instance;
    }

    private map: Map<number, boolean> = new Map;
    private timeMap: Map<any, any> = new Map();
    private static key = 0

    /** 检查是否已经有锁了
     * 
     * @param key 
     * @param lock true就锁上
     * @returns 
     */
    isLocked(key: number, lock: boolean = false, liveTime: number = 0) {
        let isLock = this.map.has(key)
        if (lock)
            this.lock(key);
        if (liveTime > 0) {
            this.timeMap.set(key, setTimeout(() => {
                this.unLock(key)
            }, liveTime * 1000))
        }
        return isLock
    }
    lock(key: number = undefined) {
        if (key === undefined)
            key = CoroutineLock.key - 1
        this.map.set(key, true)
        return key;
    }
    unLock(key: number) {
        this.map.delete(key)
        try {
            if (this.timeMap.has(key)) {
                clearTimeout(this.timeMap.get(key))
                this.timeMap.delete(key)
            }
        } catch (error) { }
    }
}