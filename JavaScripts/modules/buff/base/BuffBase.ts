import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
import { IBuffElement } from "../../../config/Buff";
import { IEffectElement } from "../../../config/Effect";
import { GameConfig } from "../../../config/GameConfig";
import { EventsName } from "../../../const/GameEnum";
import { MonsterMgr } from "../../../ts3/monster/MonsterMgr";
import { PlayerMgr } from "../../../ts3/player/PlayerMgr";
import ActionMS from "../../action/ActionMS";
import { EBuffBenefitType, EBuffHostType, EBuffLifecycleType, EBuffOverlayType } from "../comon/BuffCommon";

export abstract class BuffBase {
    /**
     * 动态唯一id
     */
    protected _id: number = 0;
    public get id(): number {
        return this._id;
    }

    protected eff: number = null

    protected _active: boolean = false;
    public get isActive(): boolean {
        return this._active;
    }

    protected _hostGuid: string = null;
    public get hostGuid(): string {
        return this._hostGuid;
    }
    protected _host: mw.GameObject = null;
    public get host(): mw.GameObject {
        return this._host;
    }

    protected _giver: mw.GameObject = null;
    public get giver(): mw.GameObject {
        return this._giver;
    }


    protected anim: mw.Animation = null

    //特效音效  在客戶端表現還是全部玩家都可以看见
    public isClient: boolean = true
    public benefitType: EBuffBenefitType = EBuffBenefitType.None
    constructor(configId: number, hostType: EBuffHostType, benefitType: EBuffBenefitType, isClient: boolean) {
        this.hostType = hostType
        this.isClient = isClient
        this._configId = configId
        this.benefitType = benefitType
        this._config = GameConfig.Buff.getElement(configId)
        this.onInit()
        if (this.config.actionGuid) {
            AssetUtil.asyncDownloadAsset(this.config.actionGuid)
        }
    }

    onInit() {

    }

    public hostType: EBuffHostType

    protected _configId: number = 0;
    public get configId(): number {
        return this._configId;
    }


    protected _config: IBuffElement;
    public get config(): IBuffElement {
        return this._config;
    }

    /**经过时间 */
    protected _elspseTime: number = 0;
    /**生命时间 */
    protected _duration: number = 0;
    public get duration(): number {
        return this._duration;
    }


    public onStart() {
        //消除buff
        if (this.config.removeBuff && this.hostGuid) {
            this.config.removeBuff.forEach(e => {
                Event.dispatchToLocal(EventsName.ClearBuff, this.hostGuid, e)
            })
        }

        if (this._elspseTime == 0) {
            this._active = true
        } else {
            //续上buff
            switch (this.config.overlayType) {
                case EBuffOverlayType.AddTime:
                    this._duration += this.config.duration
                    break
                case EBuffOverlayType.RefreshTime:
                    // this._duration = this.config.duration
                    this._elspseTime = 0
                    break
                default:
                    break
            }
        }
    }

    protected onExcete() {
    }
    isExcete: boolean = false

    public onUpdate(dt: number) {
        if (!this._active) return
        if (this.config.lifecycleType == EBuffLifecycleType.Forever) {
            if (!this.isExcete) {
                this.isExcete = true
                this.onExcete()
            }
            return
        }
        if (this.isClient && SystemUtil.isServer()) { return }
        if (!this.isClient && SystemUtil.isClient()) { return }
        this._elspseTime += dt
        // console.log("onUpdate", this._configId, this._id, this._elspseTime, this._duration)
        this.playAction()
        if (this._elspseTime >= this.config.effectDelayTime) {
            this.onExcete()
            if (!this.eff && Number(this.config.effect)) {
                const effElem = GameConfig.Effect.getElement(this.config.effect)
                switch (this.hostType) {
                    case EBuffHostType.None:
                        this.playEffectInPlace(effElem)
                        break
                    case EBuffHostType.Player:
                        this.playEffectInPlayer(effElem)
                        break
                    case EBuffHostType.GameObject:
                        this.playEffectInGameObject(effElem)
                        break
                }
            }
            if (this._elspseTime >= this.duration) {
                this.onDestroy()
            }
        }
    }

    public start(giverGuid: string, host: string) {
        this._hostGuid = host
        switch (this.hostType) {
            case EBuffHostType.None:
                this._host = null
                break;
            case EBuffHostType.GameObject:
                this._host = MonsterMgr.Inst.getMonster(this.hostGuid).gameObject
                break;
            case EBuffHostType.Player:
                this._host = PlayerMgr.Inst.getPlayer(this.hostGuid).mwPlayer.character
                // console.log("jkljkljklj", this.host)
                break;
        }

        const p = PlayerMgr.Inst.getPlayer(giverGuid)
        if (p) {
            this._giver = p.character
        }
        if (!this.giver) {
            const m = MonsterMgr.Inst.getMonster(giverGuid)
            if (m) {
                this._giver = m.gameObject
            }
        }
        this.onStart()
    }

    public playEffectInGameObject(effElem: IEffectElement) {
        this.eff = GeneralManager.rpcPlayEffectOnGameObject(effElem.EffectID, this.host, effElem.EffectTime, effElem.EffectLocation, new Rotation(effElem.EffectRotate), effElem.EffectLarge);
    }

    public playEffectInPlace(effElem: IEffectElement) {
        this.eff = GeneralManager.rpcPlayEffectAtLocation(effElem.EffectID, effElem.EffectLocation, effElem.EffectTime, new Rotation(effElem.EffectRotate), effElem.EffectLarge);
    }


    //播放特效音效
    public playEffectInPlayer(effElem: IEffectElement) {
        if (this.host instanceof mw.Player) {
            this.eff = GeneralManager.rpcPlayEffectOnPlayer(
                effElem.EffectID, this.host, effElem.EffectPoint, effElem.EffectTime, effElem.EffectLocation, new Rotation(effElem.EffectRotate), effElem.EffectLarge);
        }
    }
    protected _curStance: mw.SubStance
    protected isPlayAction: boolean = false
    protected playAction() {
        // if (this.anim || !Number(this.config.actionGuid)) return
        if (this.config.actionID && !this.isPlayAction) {
            if (SystemUtil.isServer()) {
                this.isPlayAction = true
                if (PlayerManagerExtesion.isCharacter(this.host)) {
                    ModuleService.getModule(ActionMS).playAction(this.config.actionID, this.host)
                } else if (this.host instanceof mw.Player) {
                    ModuleService.getModule(ActionMS).playAction(this.config.actionID, this.host.character)
                }
            }
        } else if (this.config.actionGuid) {
            if (this.anim || !Number(this.config.actionGuid)) return
            if (PlayerManagerExtesion.isCharacter(this.host)) {
                this._curStance = PlayerManagerExtesion.loadStanceExtesion(this.host, "4175");
                if (this._curStance) {
                    this._curStance.blendMode = mw.StanceBlendMode.WholeBody;
                    this._curStance.play()
                }
                this.anim = PlayerManagerExtesion.rpcPlayAnimation(this.host, this.config.actionGuid, this.config.loop, 0.5)
                this.anim = PlayerManagerExtesion.loadAnimationExtesion(this.host, this.config.actionGuid, true)
                this.anim.play()
                this.anim.loop = this.config.loop
            }
        }
        // this.anim = PlayerManagerExtesion.rpcPlayAnimation(this.host.character, this.config.actionGuid, this.config.loop, 1)
    }

    public onDestroy() {
        console.log("销毁buff")
        if (this.eff) {
            EffectService.stop(this.eff);
            this.eff = null
        }
        if (this._curStance) {
            this._curStance?.stop()
            this._curStance = null
        }
        if (this.anim) {
            this.anim.stop()
            this.anim = null
        }
        this.benefitType = EBuffBenefitType.None
        this._active = false
        this.isPlayAction = false
        this.isExcete = false
        this._host = null;
        this._giver = null;
        this._hostGuid = ''
        this._elspseTime = 0
        this._duration = this.config.duration
    }
}