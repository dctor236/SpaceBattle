import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import { SpawnManager, SpawnInfo, } from '../../../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
import { GameConfig } from "../../../config/GameConfig";
import { EventsName } from "../../../const/GameEnum";
import ActionMS from "../../action/ActionMS";
import { PropBaseData, PropBaseData_Action, PropBaseData_Fly, PropBaseData_Placement } from "./PropBaseData";
import { mathTools_arryToVector, mathTools_firstPlaceNumber, mathTools_isEmpty } from "./PropTool";
/** 道具类型接口 */
export interface IPropBase {
    /** 初始化设置 */
    setData(data: PropBaseData);
    /** 装备道具 */
    equip(owner: mw.Player);
    /** 卸载道具 */
    unLoad(other?: any);
    /** 销毁道具 */
    destroy();
}
/** 道具类型基类 */
export class PropBase implements IPropBase {
    /** 道具ID */
    public _id: number;
    /** 类型ID */
    public _type: number;
    /** 道具模型 */
    public _object: mw.GameObject;
    /** 设置buff代理 */
    public _buffAction: mw.Action2<number, number> = null;
    objGuid: string

    /** 道具唯一ID */
    public get propId(): number {
        return this._onlyId;
    }
    private static onlyId: number = 0;
    private _onlyId: number = null;

    constructor(guid: string, propId: number) {

        PropBase.onlyId++;
        this._onlyId = PropBase.onlyId;

        this._buffAction = new mw.Action2();
        this._id = propId;
        this._type = mathTools_firstPlaceNumber(propId);
        this.objGuid = guid
    }
    async init() {
        this._object = await SpawnManager.asyncSpawn({ guid: this.objGuid, replicates: true });
        this._object.setCollision(mw.PropertyStatus.Off);
        this._object.setVisibility(mw.PropertyStatus.Off);
    }
    setData(data: PropBaseData) { };
    equip(owner: mw.Player) { };
    unLoad(other?: any) {
        this._buffAction.clear();
    }
    destroy() {
        this._id = null;
        this._type = null;
        if (this._object) {
            this._object.destroy();
        }
        this._buffAction.remove;
    }
}
/** 动作类道具 */
export class PropBase_Action extends PropBase implements IPropBase {
    private _effOrigin: number = null;

    private _eff: number = null;

    private _soundOrigin: number = null;

    private _sound: number = null;

    private _meshOrigin: string = null;

    private _mesh: string = null;

    private _curAnim: string = null;

    private _stance: mw.SubStance;
    //初始状态
    public _initState: number = -1;
    //下个状态
    public _nextState: number = -1;
    //射线循环检测
    private _loopLine

    //基础数据
    public _configBase: PropBaseData_Action = null;
    //下个数据
    public _config: PropBaseData_Action = null;

    private _owner: mw.Player;
    //基本数据
    setDataBase(data: PropBaseData_Action) {
        this._configBase = data;
    }
    //切换数据
    setData(data: PropBaseData_Action) {
        this._config = data;
    }

    equip(owner: mw.Player): void {
        this._initState = this._configBase.IDConfig;
        this._nextState = this._configBase.NextID;
        this._owner = owner;
        this.resetState();
        this.changeBaseState(true);
    }

    unLoad(): void {
        super.unLoad();
        this.changeBaseState(false);
        this.resetState();
        this._object.parent = null;
        this._owner = null;
        if (this._config) {
            this._initState = this._config.IDConfig;
            this._nextState = this._config.IDConfig;
        }
    }

    destroy() {
        super.destroy();
        this.resetState();
        this._initState = null;
        this._nextState = null;
        this._owner = null;
        this._config = null;
        this._configBase = null;
    }

    /**
     * 状态切换接口
     * @returns 
     */
    propSwitchoverState() {
        if (!this._owner) return;
        this.resetState();
        this._nextState = this._config.NextID;
        this.changeAllState(this._config);
    }
    private setBuff(): void {
        let startPos = this._object.worldTransform.position;
        if (mathTools_isEmpty(this._config.BuffRange)) {
            let endPos = this._object.worldTransform.position.add(this._owner.character.worldTransform.getForwardVector().multiply(this._config.BuffRange));
            let hitResult = QueryUtil.lineTrace(startPos, endPos, true, true);
            hitResult.forEach((result, index) => {
                if (PlayerManagerExtesion.isNpc(result.gameObject)) {
                    let npc = (result.gameObject as mw.Character);
                    if (mathTools_isEmpty(this._config.BuffID)) {
                        //TODO NPC buff
                    }
                } else {
                    if (PlayerManagerExtesion.isCharacter(result.gameObject)) {
                        let player = (result.gameObject as mw.Character).player;
                        if (player.playerId == this._owner.playerId) return;
                        if (this._buffAction) {
                            if (mathTools_isEmpty(this._config.BuffID)) {
                                this._buffAction.call(player.playerId, this._config.BuffID);
                            }
                        }
                    };
                }
            })
        }
    }
    /**
     * 基础状态
     * @param onOff 开关 
     */
    private changeBaseState(onOff: boolean) {
        if (onOff) {
            this._object.setVisibility(mw.PropertyStatus.On);
            if (mathTools_isEmpty(this._configBase.MaterialGuid)) {
                this._meshOrigin = this._configBase.MaterialGuid;
            };
            if (mathTools_isEmpty(this._configBase.ObjParameter)) {
                this.changePoint(this._configBase.ObjPoint, this._configBase.ObjParameter);
            }
            if (mathTools_isEmpty(this._configBase.AnimGuid)) {
                this.changeAnim(this._configBase.AnimGuid, this._configBase.AnimParameter[0], this._configBase.AnimParameter[1], this._configBase.BlendMode);
            }
            if (mathTools_isEmpty(this._configBase.SoundGuid)) {
                this._soundOrigin = mw.SoundService.play3DSound(this._configBase.SoundGuid, this._object, this._configBase.SoundParameter[2], this._configBase.SoundParameter[1], { radius: this._configBase.SoundParameter[0], falloffDistance: this._configBase.SoundParameter[0] * 1.2 });
            }
            if (mathTools_isEmpty(this._configBase.EffGuid)) {
                this._effOrigin = GeneralManager.rpcPlayEffectOnGameObject(this._configBase.EffGuid, this._object, this._configBase.EffParameter2, mathTools_arryToVector(this._configBase.EffParameter1).loc, mathTools_arryToVector(this._configBase.EffParameter1).Roc, mathTools_arryToVector(this._configBase.EffParameter1).Scale);
            }
        } else {
            this._object.setVisibility(mw.PropertyStatus.Off);
            if (this._effOrigin) {
                EffectService.stop(this._effOrigin);
                this._eff = null;
            }
            if (this._soundOrigin) {
                mw.SoundService.stop3DSound(this._soundOrigin);
                this._sound = null;
            }
        }
    }
    /**
     * 所有状态修改
     * @param data 数据
     */
    private changeAllState(data: PropBaseData_Action) {
        if (mathTools_isEmpty(data.ObjParameter, "pointParameter")) {
            this.changePoint(data.ObjPoint, data.ObjParameter);
        }
        if (mathTools_isEmpty(data.AnimGuid, "animGuid") && mathTools_isEmpty(data.AnimParameter[0], "animTime")) {
            this.changeAnim(data.AnimGuid, data.AnimParameter[0], data.AnimParameter[1], data.BlendMode);
            if (data.AnimParameter[1] == 0) {
                this._loopLine = setInterval(() => {
                    this.setBuff();
                }, 2000)
            }
        }
        if (mathTools_isEmpty(data.EffGuid, "EffGuid") && mathTools_isEmpty(data.EffParameter1, "EffParameter1")) {
            this.changeEff(data.EffGuid, data.EffParameter2, data.EffParameter1);
        }

        if (mathTools_isEmpty(data.SoundGuid, "soundGuid") && mathTools_isEmpty(data.SoundParameter[0], "soundRadius")) {
            this.changeSound(data.SoundGuid, data.SoundParameter[2], data.SoundParameter[1], data.SoundParameter[0]);
        }
        if (mathTools_isEmpty(data.MaterialGuid, "meshGuid")) {
            this.changeMesh(data.MaterialGuid);
        }
    }
    /**
     * 改变挂点
     * @param point 
     * @param parameter 
     */
    private changePoint(point: mw.HumanoidSlotType, parameter: Array<number>) {
        if (this._object && this._owner) {
            this._owner.character.attachToSlot(this._object, point);
            this._object.localTransform.position = (mathTools_arryToVector(parameter).loc);
            this._object.localTransform.rotation = (mathTools_arryToVector(parameter).Roc);
            this._object.localTransform.scale = ((mathTools_arryToVector(parameter).Scale));
            // this._object.worldTransform.scale = (mathTools_arryToVector(parameter).Scale);
        }
    }
    /**
     * 改变动作
     * @param animGuid 
     * @param animTime 
     * @param loop 
     */
    private changeAnim(animGuid: string, animTime: number, loop: number, blendMode: number) {
        if (this._owner) {
            if (SystemUtil.isServer()) {
                const elem = GameConfig.Action.getElement(animGuid)
                if (elem) {
                    ModuleService.getModule(ActionMS).playAction(Number(animGuid), this._owner.character)
                } else {
                    if (blendMode === 3) {
                        const anim = PlayerManagerExtesion.loadAnimationExtesion(this._owner.character, animGuid, true);
                        anim.loop = loop;
                        anim.speed = animTime;
                        anim.play();
                        this._curAnim = animGuid;
                    } else {
                        this._stance = PlayerManagerExtesion.loadStanceExtesion(this._owner.character, animGuid)
                        this._stance.blendMode = blendMode
                        this._stance.play()
                    }
                }
            }
        }
    }
    /**
     * 改变特效
     * @param guid 
     * @param loop 
     * @param parameter 
     * @returns 
     */
    private changeEff(guid: string, loop: number, parameter: Array<number>) {
        if (!this._object) return;
        this._eff = GeneralManager.rpcPlayEffectOnGameObject(guid, this._object, loop, mathTools_arryToVector(parameter).loc, mathTools_arryToVector(parameter).Roc, mathTools_arryToVector(parameter).Scale);
    }
    /**
     * 改变声音
     * @param guid 
     * @param loop 循环
     * @param vol 音量
     * @param radius 范围
     * @returns 
     */
    private changeSound(guid: string, loop: number, vol: number, radius: number) {
        if (!this._object) return;
        this._sound = mw.SoundService.play3DSound(guid, this._object, loop, vol, { radius: radius, falloffDistance: radius * 1.2 });
    }
    /**
     * 改变材质
     * @param guid 
     * @returns 
     */
    private changeMesh(guid: string) {

    }
    /**
     * 表现重置
     */
    private resetState() {
        if (this._configBase) {
            const elem = GameConfig.Action.getElement(this._configBase.AnimGuid)
            if (elem) {
                ModuleService.getModule(ActionMS).stopAction(this._owner.character.gameObjectId)
            }
        }
        if (this._curAnim && this._owner) {
            PlayerManagerExtesion.loadAnimationExtesion(this._owner.character, this._curAnim).stop();
            this._curAnim = null;
        }
        if (this._stance && this._owner) {
            this._stance.stop();
            this._stance = null;
        }
        if (this._eff) {
            EffectService.stop(this._eff);
            this._eff = null;
        }
        if (this._sound) {
            mw.SoundService.stop3DSound(this._sound);
            this._sound = null;
        }
        if (this._mesh) {
            //TODO  默认材质
            this.changeMesh(this._meshOrigin);
            this._mesh = null;
        }
        if (this._loopLine) {
            clearInterval(this._loopLine);
        }
    }
}
/** 飞行类道具 */
export class PropBase_Fly extends PropBase implements IPropBase {

    private _owner: mw.Player;

    private _eff: number = null;

    private eff_flyWakeFlameLeft: number = null;
    private eff_flyWakeFlameRight: number = null;
    private eff_jetWakeFlameLeft: number = null;
    private eff_jetWakeFlameRight: number = null;
    private eff_jetWakeFlame: number = null;
    private eff_traWakeFlame: number = null;

    private setTime_boost

    private bool_boost: boolean = false;

    public _config: PropBaseData_Fly = null;

    private _barkFly: number = null;

    private isWalk: boolean = false;

    /**是否飞行中 */
    private isFly = false;

    setData(data: PropBaseData_Fly) {
        this._config = data;
    }

    equip(owner: mw.Player): void {
        this._owner = owner;

        this._barkFly = this._owner.character.horizontalBrakingDecelerationFalling;

        if (mathTools_isEmpty(this._config.effGuid)) {
            let a = mathTools_arryToVector(this._config.ObjParameter).Scale
            this._eff = GeneralManager.rpcPlayEffectOnGameObject(this._config.effGuid, this._object, 0, mw.Vector.zero, mw.Rotation.zero, a.multiply(owner.character.worldTransform.scale));
        } else {
            this._object.setVisibility(mw.PropertyStatus.On);
        }
        if (mathTools_isEmpty(this._config.ObjPoint) && mathTools_isEmpty(this._config.ObjParameter)) {

            this._owner.character.attachToSlot(this._object, this._config.ObjPoint);
            this._object.localTransform.position = (mathTools_arryToVector(this._config.ObjParameter).loc);
            this._object.localTransform.rotation = (mathTools_arryToVector(this._config.ObjParameter).Roc);
            this._object.localTransform.scale = (mathTools_arryToVector(this._config.ObjParameter).Scale);
        }
    }

    unLoad(): void {
        super.unLoad();
        if (this._barkFly != null) {
            this._owner.character.horizontalBrakingDecelerationFalling = this._barkFly;
        }

        if (this._eff) {
            EffectService.stop(this._eff);
        };
        if (this.isFly) {
            this.flyActiveEff(false);
        }
        this._object.parent = null;
        this._object.setVisibility(mw.PropertyStatus.Off);
        this._owner = null;
        this.isWalk = true;
    }

    destroy() {
        this.unLoad();
        super.destroy();
        this._owner = null;
        this._config = null;
    }

    /**
     * 飞行背包激活
     * @param onOff 开关 
     */
    public flyActiveEff(onOff: boolean): void {
        switch (onOff) {
            case true:
                this.isFly = true;
                //左右特效
                if (mathTools_isEmpty(this._config.flyWakeFlameGuid)) {
                    this.eff_flyWakeFlameLeft = GeneralManager.rpcPlayEffectOnGameObject(this._config.flyWakeFlameGuid, this._object, 0, mathTools_arryToVector(this._config.flyWakeFlameParameterLeft).loc, mathTools_arryToVector(this._config.flyWakeFlameParameterLeft).Roc, mathTools_arryToVector(this._config.flyWakeFlameParameterLeft).Scale);
                    this.eff_flyWakeFlameRight = GeneralManager.rpcPlayEffectOnGameObject(this._config.flyWakeFlameGuid, this._object, 0, mathTools_arryToVector(this._config.flyWakeFlameParameterRight).loc, mathTools_arryToVector(this._config.flyWakeFlameParameterRight).Roc, mathTools_arryToVector(this._config.flyWakeFlameParameterRight).Scale);
                }
                //左右拖尾
                if (mathTools_isEmpty(this._config.jetWakeFlameGuid)) {
                    this.eff_jetWakeFlameLeft = GeneralManager.rpcPlayEffectOnGameObject(this._config.jetWakeFlameGuid, this._object, 0, mathTools_arryToVector(this._config.jetWakeFlameParameterLeft).loc, mathTools_arryToVector(this._config.jetWakeFlameParameterLeft).Roc, mathTools_arryToVector(this._config.jetWakeFlameParameterLeft).Scale);
                    this.eff_jetWakeFlameRight = GeneralManager.rpcPlayEffectOnGameObject(this._config.jetWakeFlameGuid, this._object, 0, mathTools_arryToVector(this._config.jetWakeFlameParameterRight).loc, mathTools_arryToVector(this._config.jetWakeFlameParameterRight).Roc, mathTools_arryToVector(this._config.jetWakeFlameParameterRight).Scale);
                }
                this._owner.character.switchToFlying();
                Event.dispatchToLocal(EventsName.PLAYER_FLY, true)
                if (mathTools_isEmpty(this._config.activeAnimGuid)) {
                    PlayerManagerExtesion.changeStanceExtesion(this._owner.character, this._config.activeAnimGuid);
                }

                break;
            case false:
                this.isFly = false;
                if (this.eff_jetWakeFlameLeft || this.eff_jetWakeFlameRight) {
                    EffectService.stop(this.eff_jetWakeFlameLeft);
                    EffectService.stop(this.eff_jetWakeFlameRight);
                }
                if (this.eff_flyWakeFlameLeft || this.eff_flyWakeFlameRight) {
                    EffectService.stop(this.eff_flyWakeFlameLeft);
                    EffectService.stop(this.eff_flyWakeFlameRight);
                }

                if (this.isWalk) {
                    this._owner.character.switchToWalking();
                    Event.dispatchToLocal(EventsName.PLAYER_FLY, false)
                    PlayerManagerExtesion.changeStanceExtesion(this._owner.character, ``);
                }

                this.flyUp(false);
                this.flyAccelerate(false);

                break;
        }

    }

    /**
     * 向上飞
     * @param onOff 开关
     */
    public flyUp(onOff: boolean): void {
        if (onOff) {
            PlayerManagerExtesion.changeStanceExtesion(this._owner.character, this._config.flyGoUpStance);
        } else {
            if (mathTools_isEmpty(this._config.activeAnimGuid)) {
                if (this.isWalk) {
                    PlayerManagerExtesion.changeStanceExtesion(this._owner.character, this._config.activeAnimGuid);
                }
            } else {
                if (this.isWalk) {
                    PlayerManagerExtesion.changeStanceExtesion(this._owner.character, ``);
                }
            }
        }
    }
    /**
     * 加速功能
     * @param onOff 加速开关
     * @returns 
     */
    public flyAccelerate(onOff?: boolean): void {
        if (onOff) {
            if (!this.bool_boost) {
                this.bool_boost = true;
                let oldFiySpeed = this._owner.character.maxFlySpeed
                PlayerManagerExtesion.rpcPlayAnimation(this._owner.character, this._config.flyAccelerateAnimGuid, 0, 1);
                this._owner.character.maxFlySpeed = Number(this._config.flyAccelerateSpeed);
                this._owner.character.horizontalBrakingDecelerationFalling = this._config.flyAccelerateBraking;

                if (mathTools_isEmpty(this._config.flyAccelerateEffGuid)) {
                    this.eff_traWakeFlame = GeneralManager.rpcPlayEffectOnGameObject(this._config.flyAccelerateEffGuid, this._object, 0, mathTools_arryToVector(this._config.flyAccelerateEffParameter).loc, mathTools_arryToVector(this._config.flyAccelerateEffParameter).Roc, mathTools_arryToVector(this._config.flyAccelerateEffParameter).Scale);
                }
                if (mathTools_isEmpty(this._config.flyAcceleratejetWkeFlameGuid)) {
                    this.eff_jetWakeFlame = GeneralManager.rpcPlayEffectOnGameObject(this._config.flyAcceleratejetWkeFlameGuid, this._object, 0, mathTools_arryToVector(this._config.flyAcceleratejetWkeFlameParameter).loc, mathTools_arryToVector(this._config.flyAcceleratejetWkeFlameParameter).Roc, mathTools_arryToVector(this._config.flyAcceleratejetWkeFlameParameter).Scale);
                }
                this.setTime_boost = setTimeout(() => {
                    if (this.bool_boost) {
                        PlayerManagerExtesion.loadAnimationExtesion(this._owner.character, this._config.flyAccelerateAnimGuid).stop();
                        this._owner.character.maxFlySpeed = oldFiySpeed;
                        this._owner.character.brakingDecelerationFlying = 300;
                        if (this._barkFly != null) {
                            this._owner.character.horizontalBrakingDecelerationFalling = this._barkFly;
                        }

                        if (mathTools_isEmpty(this._config.activeAnimGuid)) {
                            PlayerManagerExtesion.changeStanceExtesion(this._owner.character, this._config.activeAnimGuid);
                        } else {
                            PlayerManagerExtesion.changeStanceExtesion(this._owner.character, ``);
                        }

                        if (this.eff_jetWakeFlame) {
                            EffectService.stop(this.eff_jetWakeFlame);
                        }
                        if (this.eff_traWakeFlame) {
                            EffectService.stop(this.eff_traWakeFlame);
                        }
                        this.bool_boost = false;
                        this.setTime_boost = null;
                    }
                }, this._config.flyAccelerateTime * 1000);
                // this._buffAction.call(this._owner.playerId, this._config.buffId);
            } else {
                return;
            }
        } else {
            if (this.setTime_boost) {
                if (this.bool_boost) {
                    PlayerManagerExtesion.loadAnimationExtesion(this._owner.character, this._config.flyAccelerateAnimGuid).stop();
                    this._owner.character.maxFlySpeed = 300;
                    this._owner.character.brakingDecelerationFlying = 300;
                    if (this._barkFly != null) {
                        this._owner.character.horizontalBrakingDecelerationFalling = this._barkFly;
                    }

                    if (mathTools_isEmpty(this._config.activeAnimGuid)) {
                        if (this.isWalk) {
                            PlayerManagerExtesion.changeStanceExtesion(this._owner.character, this._config.activeAnimGuid);
                        }
                    } else {
                        if (this.isWalk) {
                            PlayerManagerExtesion.changeStanceExtesion(this._owner.character, ``);
                        }
                    }
                    if (this.eff_jetWakeFlame) {
                        EffectService.stop(this.eff_jetWakeFlame);
                    }
                    if (this.eff_traWakeFlame) {
                        EffectService.stop(this.eff_traWakeFlame);
                    }
                    this.bool_boost = false;
                    this.setTime_boost = null;
                }
            }
        }

    }

    public changeWalk(bo: boolean): void {
        this.isWalk = !bo;
    }
}
/** 放置类道具 */
export class PropBase_Placement extends PropBase implements IPropBase {

    private _owner: mw.Player;
    public _config: PropBaseData_Placement = null;

    private _eff: number = null;

    private setTime_anim = null;

    setData(data: PropBaseData_Placement) {
        this._config = data;
    }

    equip(owner: mw.Player): void {
        this._owner = owner;
        if (mathTools_isEmpty(this._config.ObjEffGuid)) {
            this._eff = GeneralManager.rpcPlayEffectOnGameObject(this._config.ObjEffGuid, this._object, 0, mw.Vector.zero, mw.Rotation.zero, mathTools_arryToVector(this._config.ObjParameter).Scale);
        } else {
            this._object.setVisibility(mw.PropertyStatus.On);
            // this._object.worldTransform.scale = (mathTools_arryToVector(this._config.ObjParameter).Scale);
        }
        this.switchAnim(true);
    }

    unLoad(): void {
        super.unLoad();
        if (this._eff) {
            EffectService.stop(this._eff);
        };
        if (this.setTime_anim) {
            clearTimeout(this.setTime_anim);
            this.setTime_anim = null;
        }
        PlayerManagerExtesion.loadAnimationExtesion(this._owner.character, this._config.AnimUseGuid).stop();
        PlayerManagerExtesion.loadAnimationExtesion(this._owner.character, this._config.AnimEquipGuid).stop();
        this._object.parent = null;
        this._object.setVisibility(mw.PropertyStatus.Off);
        this._owner = null;
    }

    destroy() {
        this.unLoad();
        super.destroy();
        this._owner = null;
    }
    /**
     * 使用放置类
     */
    usePlacementProp(): void {
        this.switchAnim(false);
        if (mathTools_isEmpty(this._config.AnimEquipGuid)) {
            this.setTime_anim = setTimeout(() => {
                this.switchAnim(true);
            }, this._config.AnimUseParameter * 1000);
        }
        this.setDelay(this._owner.character.worldTransform.position.add(this._owner.character.worldTransform.getForwardVector().multiply(this._config.DelayOffsetFront)));
    }

    /**
     * 改变挂点
     * @param point 
     * @param parameter 
     */
    private changePoint(point: mw.HumanoidSlotType, parameter: Array<number>) {
        if (this._object && this._owner) {
            this._owner.character.attachToSlot(this._object, point);
            this._object.localTransform.position = (mathTools_arryToVector(parameter).loc);
            this._object.localTransform.rotation = (mathTools_arryToVector(parameter).Roc);
            if (!mathTools_isEmpty(this._config.ObjEffGuid)) {
                // this._object.worldTransform.scale = (mathTools_arryToVector(parameter).Scale);
                this._object.localTransform.scale = ((mathTools_arryToVector(parameter).Scale));
            }
        }
    }

    /**
     * 动作切换
     * @param playType true 装备， false 使用 
     */
    private switchAnim(playType: boolean) {
        switch (playType) {
            case true:
                PlayerManagerExtesion.loadAnimationExtesion(this._owner.character, this._config.AnimUseGuid).stop();
                if (mathTools_isEmpty(this._config.ObjPoint, "ObjPoint")) {
                    this.changePoint(this._config.ObjPoint, this._config.ObjParameter);
                }
                if (mathTools_isEmpty(this._config.AnimEquipGuid)) {
                    PlayerManagerExtesion.rpcPlayAnimation(this._owner.character, this._config.AnimEquipGuid, 0, this._config.AnimEquipParameter);
                }
                break;
            case false:
                PlayerManagerExtesion.loadAnimationExtesion(this._owner.character, this._config.AnimEquipGuid).stop();
                if (mathTools_isEmpty(this._config.ObjUsePoint, "ObjUsePoint")) {
                    this.changePoint(this._config.ObjUsePoint, this._config.ObjUseParameter);
                }
                if (mathTools_isEmpty(this._config.AnimUseGuid)) {
                    PlayerManagerExtesion.rpcPlayAnimation(this._owner.character, this._config.AnimUseGuid, 1, this._config.AnimUseParameter);
                }
                break;
        }
    }
    /**
     * 设置延时效果
     * @param ve 效果位置
     */
    private setDelay(ve: mw.Vector): void {

        let cur_count = this._config.DelayCount;
        let cur_model = SpawnManager.spawn({ guid: this._config.DelayModelGuid, replicates: true });

        cur_model.worldTransform.position = ve.subtract(mathTools_arryToVector(this._config.DelayModelParameter).loc);
        cur_model.worldTransform.rotation = mathTools_arryToVector(this._config.DelayModelParameter).Roc;
        cur_model.worldTransform.scale = mathTools_arryToVector(this._config.DelayModelParameter).Scale;
        cur_model.setCollision(mw.PropertyStatus.Off);

        let endLoc = cur_model.worldTransform.position;

        let cur_modelEff: number = null;
        if (mathTools_isEmpty(this._config.DelayModelEffGuid)) {
            cur_modelEff = GeneralManager.rpcPlayEffectOnGameObject(this._config.DelayModelEffGuid, cur_model, 0, mathTools_arryToVector(this._config.DelayModelEffParameter).loc, mathTools_arryToVector(this._config.DelayModelEffParameter).Roc, mathTools_arryToVector(this._config.DelayModelEffParameter).Scale);
        };
        setTimeout(() => {
            let interval_loop = setInterval(() => {

                if (cur_count > 0) {
                    cur_count--;
                } else {
                    if (mathTools_isEmpty(this._config.DelayRange)) {
                        this.setBuffRange(endLoc, this._config.DelayRange, this._config.DelayBuff);
                    }
                    if (cur_modelEff) {
                        EffectService.stop(cur_modelEff);
                    }
                    cur_model.destroy();
                    cur_model = null;
                    clearInterval(interval_loop);
                    return;
                }
                if (this._config.DelayCount <= 1) {
                    EffectService.stop(cur_modelEff);
                    cur_modelEff = 0;
                }


                mw.SoundService.play3DSound(this._config.DelaySoundGuid, cur_model, 1, this._config.DelaySoundParameter[0], {
                    radius: this._config.DelaySoundParameter[1], falloffDistance: this._config.DelaySoundParameter[1] * 1.2
                });
                GeneralManager.rpcPlayEffectOnGameObject(this._config.DelayEffGuid, cur_model, 1, mathTools_arryToVector(this._config.DelayEffParameter).loc, mathTools_arryToVector(this._config.DelayEffParameter).Roc, mathTools_arryToVector(this._config.DelayEffParameter).Scale);
            }, 1000 * this._config.DelayCountTime);

        }, 1000 * this._config.DelayTime);
    }
    /**
     * 放置效果buff
     * @param pos 位置
     * @param range 范围
     * @param buffArr buff数组
     */
    private setBuffRange(pos: mw.Vector, range: number, buffArr: number[]): void {
        QueryUtil.sphereOverlap(pos, range, false).forEach((obj, index) => {
            if (((obj) instanceof mw.Character)) {
                let player = (obj as mw.Character).player;
                buffArr.forEach((value, index) => {
                    if (this._buffAction) {
                        this._buffAction.call(player.playerId, value);
                    }
                })
            } else {
                // console.error(`index --- ${index} objName --- ${obj.name} `)
            }
        })
    }
}