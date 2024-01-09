import { GeneralManager, } from './Modified027Editor/ModifiedStaticAPI';
import { SpawnManager, SpawnInfo, } from './Modified027Editor/ModifiedSpawn';
import { GameConfig } from "./config/GameConfig";
import { EffectManager, GoPool } from "./ExtensionType";
import GameUtils from "./utils/GameUtils";

//import { GoNode } from "./GoNode";
@Decorator.autoExecute("init")
export class ResManager {
    private static _instance: ResManager;
    public static get instance(): ResManager {
        if (ResManager._instance == null) {
            ResManager._instance = new ResManager();
        }
        return ResManager._instance;
    }
    private constructor() { }
    private static init() {
        this.instance.init();
    }
    public destroy() {
        //ResManager._instance = null;
    }

    private _isInit: boolean = false;
    /**
     * 初始化，不要私自调用
     */
    private init() {
        if (this._isInit) return;
        this._isInit = true;
    }
    /**
     * 根据guid查找场景中一个GameObject(异步，双端调用)
     * @param guid guid
     * @param waitTime 等待时间(单位：毫秒)
     * @returns GameObject
     */
    public async findGameObjectByGuid<T extends mw.GameObject>(guid: string, waitTime: number = 10000): Promise<T> {
        let go: mw.GameObject = GameObject.findGameObjectById(guid);
        if (go != null) return go as T;
        return new Promise<T>((resolve: (value: T) => void) => {
            let tickTime: number = 100;
            let id = setInterval(() => {
                go = GameObject.findGameObjectById(guid);
                waitTime -= tickTime;
                if (go != null || waitTime <= 0) {
                    clearInterval(id);
                    resolve(go as T);
                }
            }, tickTime);
        });
    }
    /**
     * 根据guid查找场景中一个脚本(异步，双端调用)
     * @param guid guid
     * @param waitTime 等待时间(毫秒)
     * @returns 脚本
     */
    public async findScriptByGuid<T extends mw.Script>(guid: string, waitTime: number = 10000): Promise<T> {
        let sp: mw.Script = mw.ScriptManager.findScript(guid);
        if (sp != null) return sp as T;
        return new Promise<T>((resolve: (value: T) => void) => {
            let tickTime: number = 100;
            let id = setInterval(() => {
                sp = mw.ScriptManager.findScript(guid);
                waitTime -= tickTime;
                if (sp != null || waitTime <= 0) {
                    clearInterval(id);
                    resolve(sp as T);
                }
            }, tickTime);
        });
    }

    /**
     * 从GameObject获取子对象的guid (异步，双端调用)
     * @param targetGo 目标gameObject
     * @param path 节点路径
     * @returns guid
     */
    private async getChildGuidFromGo(targetGo: string | mw.GameObject, path: string): Promise<string> {
        if (mw.StringUtil.isEmpty(path)) return null;
        let targetGuid: string = this.getGoGuid(targetGo);
        let arr = path.split('/');
        const maxFindTimes = 10;
        let findTimes: number = maxFindTimes;//找的次数
        let i: number = -1;//需要先找到GameObject，所以是-1
        let go: mw.GameObject = null;
        if (targetGo instanceof mw.GameObject) {
            go = targetGo;
            i = 0;
        }
        return new Promise<string>((resolve: (value: string) => void) => {
            let id = setInterval(() => {
                let findRes: mw.GameObject = null;
                if (i == -1) {
                    findRes = GameObject.findGameObjectById(targetGuid);
                } else if (arr[i] == '..') {
                    findRes = go.parent;
                } else {
                    findRes = go.getChildByName(arr[i]);
                }
                if (findRes != null) {
                    go = findRes;
                    i++;
                    findTimes = maxFindTimes;
                } else {
                    findTimes--;
                    //console.error("ResManager.getChildGameObjectGuid file!   path=" + path + "   times=" + (maxFindTimes - findTimes));
                }
                if (i >= arr.length || findTimes == 0) {
                    clearInterval(id);
                    resolve(findTimes == 0 ? null : go.gameObjectId);
                }
            }, 300);
        });
    }
    /** 从一个GameObject中获取脚本的guid */
    private async getScriptGuidFromGo(targetGo: string | mw.GameObject, path: string): Promise<string> {
        if (mw.StringUtil.isEmpty(path)) return null;
        let targetGuid: string = this.getGoGuid(targetGo);
        let arr = path.split('/');
        const maxFindTimes = 10;
        let findTimes: number = maxFindTimes;//找的次数
        let i: number = -1;//需要先找到GameObject，所以是-1
        let go: mw.GameObject = null;
        let sp: mw.Script = null;
        if (targetGo instanceof mw.GameObject) {
            go = targetGo;
            i = 0;
        }
        return new Promise<string>((resolve: (value: string) => void) => {
            let id = setInterval(() => {
                let findRes: mw.GameObject = null;
                if (i == arr.length - 1) {
                    if (arr[i].endsWith('.ts'))
                        sp = go.getScriptByName(arr[i]);
                    else
                        sp = go.getScriptByName(`${arr[i]}.ts`);
                } else if (i == -1) {
                    findRes = GameObject.findGameObjectById(targetGuid);
                } else if (arr[i] == '..') {
                    findRes = go.parent;
                } else {
                    findRes = go.getChildByName(arr[i]);
                }
                if (findRes != null) {
                    go = findRes;
                    i++;
                    findTimes = maxFindTimes;
                } else {
                    findTimes--;
                    //console.error("ResManager.getChildScriptGuid file!   path=" + path + "   times=" + (maxFindTimes - findTimes));
                }
                if (sp != null || findTimes == 0) {
                    clearInterval(id);
                    resolve(findTimes == 0 ? null : sp.guid);
                }
            }, 100);
        });
    }
    /**
     * 根据路径从GameObject中查找一个子GameObject (异步 双端)
     * @param targetGo 目标GameObject
     * @param path 路径
     * @returns 子GameObject
     */
    public async findChildFromGo<T extends mw.GameObject>(targetGo: string | mw.GameObject, path: string): Promise<T> {
        let targetGuid: string = this.getGoGuid(targetGo);
        let guid: string = await this.getChildGuidFromGo(targetGuid, path);
        if (guid == null) {
            //console.error("ResManager.findChild: findChild fail!   path=" + path);
            return null;
        }
        return this.findGameObjectByGuid<T>(guid);
    }
    /**
     * 根据路径从GameObject中查找一个脚本 (异步 双端)
     * @param targetGo 目标GameObject
     * @param path 路径
     * @returns 脚本对象
     */
    public async findScriptFromGo<T extends mw.Script>(targetGo: string | mw.GameObject, path: string): Promise<T> {
        let targetGuid: string = this.getGoGuid(targetGo);
        let guid: string = await this.getScriptGuidFromGo(targetGuid, path);
        if (guid == null) {
            //console.error("ResManager.findScript: findScript fail!   path=" + path);
            return null;
        }
        return this.findScriptByGuid<T>(guid);
    }
    /**
     * 从一个gameObject上根据路径找一个脚本（Server & Client）
     * @param go GameObject
     * @param path 脚本路径
     * @returns 脚本对象
     */
    public findScriptFromGo_sync<T extends mw.Script>(go: mw.GameObject, path: string): T {
        if (go == null || mw.StringUtil.isEmpty(path)) return null;
        let arr = path.split('/');
        let sp: any;
        for (let i = 0; i < arr.length; i++) {
            if (i == arr.length - 1) {
                sp = go.getScriptByName(`${arr[i]}.ts`);
                if (sp == null) sp = go.getScriptByName(arr[i]);
                if (sp == null) {
                    //console.error('FindSceneObjScriptError path=' + path + "   -tsFile:" + arr[i]);
                    return null;
                }
            } else {
                if (arr[i] == '..') {
                    go = go.parent;
                } else {
                    go = go.getChildByName(arr[i]);
                }
                if (go == null) {
                    //console.error('FindSceneObjScriptError path=' + path + "   -node:" + arr[i]);
                    return null;
                }
            }
        }
        return sp;
    }
    private getGoGuid(targetGo: string | mw.GameObject): string {
        if (targetGo instanceof mw.GameObject) {
            return targetGo.gameObjectId;
        }
        return targetGo;
    }
    /**
     * 创建一个资源，没有预加载则自动加载
     * @param guid 资源id
     * @returns 资源对象
     */
    public async spawnAsset<T extends mw.GameObject>(guid: string): Promise<T> {
        if (mw.AssetUtil.assetLoaded(guid)) return SpawnManager.wornSpawn(guid) as T;
        return new Promise<T>((resolve: (value: T) => void) => {
            mw.AssetUtil.asyncDownloadAsset(guid).then((success: boolean) => {
                if (success) {
                    SpawnManager.wornAsyncSpawn(guid).then((go: mw.GameObject) => {
                        resolve(go as T);
                    });
                } else {
                    //console.error("ResManager->spawnAsset: Download asset fail! guid=" + guid);
                    resolve(null);
                }
            });
        });
    }
    /**
     * 准备资源
     * @param guids 需要准备资源的guid列表
     * @returns 是否成功
     */
    public async getReadyAssets(...guids: string[]): Promise<boolean> {
        let needLoad: string[] = [];
        for (let i = 0; i < guids.length; i++) {
            if (!mw.AssetUtil.assetLoaded(guids[i])) {
                needLoad.push(guids[i]);
                mw.AssetUtil.asyncDownloadAsset(guids[i]);
            }
        }
        if (needLoad.length == 0) return true;
        return new Promise<boolean>(async (resolve: (value: boolean) => void) => {
            let id = setInterval(() => {
                for (let i = 0; i < needLoad.length;) {
                    if (mw.AssetUtil.assetLoaded(needLoad[i])) {
                        needLoad.splice(i, 1);
                    } else {
                        i++;
                    }
                }
                if (needLoad.length == 0) {
                    clearInterval(id);
                    resolve(true);
                }
            }, 100);
        });
    }

    public playEffectOnPlayer(player, effectID: number) {
        let effConfig = GameConfig.Effect.getElement(effectID);
        let effNum = null;//特效播放方式 ==> 循环/次数
        let effIsTime: boolean = false;//特效是否到时间停止

        if (effConfig.EffectTime < 0) {//时间
            effNum = 0;
            effIsTime = true;
        } else if (effConfig.EffectTime > 0) {//次数
            effNum = effConfig.EffectTime;
            effIsTime = false;
        } else if (effConfig.EffectTime == 0) {//循环
            effNum = 0;
            effIsTime = false;
        }

        if (effNum == null) {
            console.error("特效播放次数有问题 effTime = " + effConfig.EffectTime);
            return null;
        }
        let id = GeneralManager.rpcPlayEffectOnPlayer(
            effConfig.EffectID,
            player,
            effConfig.EffectPoint,
            effNum,
            effConfig.EffectLocation,
            effConfig.EffectRotate.toRotation(),
            effConfig.EffectLarge
        );
        if (effIsTime) {
            setTimeout(() => {
                EffectService.stop(effectID);
            }, effConfig.EffectTime);
            return null;
        }
        return id;
    }
    public async spawnObjOnCharacter(character: mw.Character, configID: number) {
        const modelConfig = GameConfig.Model.getElement(configID);
        await GameUtils.downAsset(modelConfig.ModelGuid);
        let modelObj = await GoPool.asyncSpawn(modelConfig.ModelGuid, modelConfig.SourceType);
        if (modelObj) {
            character.attachToSlot(modelObj, modelConfig.ModelPoint);
            modelObj.localTransform.position = (modelConfig.ModelLocation);
            modelObj.localTransform.rotation = (new mw.Rotation(modelConfig.ModelRotate));
            modelObj.localTransform.scale = (modelConfig.ModelLarge);
            modelObj.setCollision(mw.PropertyStatus.Off, true);
            modelObj.setVisibility(mw.PropertyStatus.On, true)
            return modelObj
        }
        return null
    }
    public destoryObj(obj: mw.GameObject) {
        obj.parent = null
        GoPool.despawn(obj)
    }
}