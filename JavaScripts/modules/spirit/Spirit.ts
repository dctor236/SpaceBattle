import { SpawnManager, SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
import { GameConfig } from "../../config/GameConfig";
import { GlobalData } from "../../const/GlobalData";
import { getMyPlayerID, UIManager } from "../../ExtensionType";
import { MonsterMgr } from "../../ts3/monster/MonsterMgr";
import { GamePlayerState } from "../../ts3/player/PlayerDefine";
import { PlayerMgr } from "../../ts3/player/PlayerMgr";
import Tips from "../../ui/commonUI/Tips";
import GameUtils from "../../utils/GameUtils";
import { StateMachine } from "../../utils/StateMachine";
import { Attribute } from "../fight/attibute/Attribute";
import MonsterSkillMC from "../fight/monsterSkill/MonsterSkillMC";
import { NPCHead } from "../npc/NPCHead";
import SpiritHeadMgr from "./SpiritHeadMgr";
import SpiritManager from "./SpiritManager";
import SpiritBubble from "./UI/SpiritBubble";

export default class Spirit {
    private _walkInteval = null
    public type: SpiritType
    public obj: mw.GameObject = null;
    private _headUI: NPCHead = null;
    private _fsm: StateMachine<ESpiritState> = new StateMachine();
    //主人
    private _host: number = 0
    private _orginPos: Vector = Vector.zero
    private _orginRot: Rotation = Rotation.zero
    private _orginScale: Vector = Vector.zero
    public id: number = -1
    /**换装资源 */
    public asset: string = ''
    public skill: number = 1001
    public att: Attribute.AttributeValueObject = new Attribute.AttributeValueObject()
    public life: number
    private _lifeInteval = null
    constructor() {
        this._fsm.register(ESpiritState.Idle, { enter: this.state_idle.bind(this), update: this.state_idleUpdate.bind(this) })
        this._fsm.register(ESpiritState.Follow, { enter: this.state_follow.bind(this), update: this.state_followUpdate.bind(this), exit: this.state_followExit.bind(this) })
        this._fsm.register(ESpiritState.Attack, { enter: this.state_attack.bind(this), update: this.state_attackUpdate.bind(this), exit: this.state_attackExit.bind(this) })
        this._fsm.register(ESpiritState.Unable, { enter: this.state_unable.bind(this), update: this.state_unableUpdate.bind(this) })
        this._fsm.register(ESpiritState.Destroy, { enter: this.state_destroy.bind(this), update: this.state_destroyUpdate.bind(this) })
    }


    async initSpirit(id: number, host: number, type: SpiritType, birthPos: Vector, birthRot: Rotation) {
        this.asset = SpritGuid[type - 1]
        this.type = type
        this.id = id
        this._host = host
        this.obj = await SpiritManager.instance.spawn(this.asset, birthPos, birthRot)
        this._orginPos = this.obj.worldTransform.position.clone()
        this._orginRot = this.obj.worldTransform.rotation.clone()
        this._orginScale = this.obj.worldTransform.scale.clone()
        this.changeState(ESpiritState.Unable)
        if (host == getMyPlayerID()) {
            const tri: mw.Trigger = await SpawnManager.asyncSpawn({ guid: 'Trigger', replicates: false })
            if ((this.obj instanceof Character) && this.obj.player == null) {
                this.obj.attachToSlot(tri, mw.HumanoidSlotType.Head)
            }
            else {
                tri.parent = this.obj
            }
            tri.worldTransform.scale = new Vector(4, 4, 4)
            tri.enabled = (true)
            tri.worldTransform.position = this._orginPos
            if (tri) {
                tri.onEnter.add(this.onTriggerIn)
                tri.onLeave.add(this.onTriggerOut)
            }
            await this.initHeadUI()
        }
        const elem = GameConfig.Spirt.getElement(this.id)
        const attElem = GameConfig.BaseAttribute.getElement(elem.att)
        if (attElem) {
            for (let i = 0; i < attElem.AttrType.length; i++) {
                const attType = attElem.AttrType[i]
                const ran = attElem.AttrValueFactor[i]
                const val = MathUtil.randomInt(ran[0], ran[1])
                this.att.addValue(attType, val);
            }
        }
        this.skill = elem.skill
    }

    public changeAppear(type: SpiritType) {
        this.asset = SpritGuid[type - 1]
        this.type = type
        const pos = this.obj.worldTransform.position
        const rot = this.obj.worldTransform.rotation
        SpiritManager.instance.unSpawn(this.obj)
        SpiritManager.instance.spawn(this.asset, pos, rot)
        // const humanV1 = this.obj.getAppearance() as mw.HumanoidV1;
        // humanV1.description.base.wholeBody = (type, false)
    }

    private onTriggerIn = (obj: mw.GameObject) => {
        if (GameUtils.isPlayerCharacter(obj)) {
            let state: boolean
            if (this.curState() == ESpiritState.Unable) {
                state = false
                UIManager.show(SpiritBubble, this, state)
            } else {
                state = true
            }
        }
    }

    private onTriggerOut = (obj: mw.GameObject) => {
        if (GameUtils.isPlayerCharacter(obj)) {
            UIManager.hide(SpiritBubble)
        }
    }

    async initHeadUI() {
        let widget: mw.UIWidget = null
        if ((this.obj instanceof Character) && this.obj.player == null) {
            widget = this.obj.overheadUI;
        } else {
            widget = await SpiritHeadMgr.instance.spawn()
        }
        this._headUI = UIManager.create(NPCHead);
        widget.setTargetUIWidget(this._headUI.uiWidgetBase)
        widget.drawSize = new mw.Vector2(500, 200);
        widget.headUIMaxVisibleDistance = 2500;
        widget.parent = this.obj
        widget.localTransform.position = (new mw.Vector(0, 0, 50))
        const name = GameConfig.Spirt.getElement(this.id).spiritName
        this._headUI.setName(name);
    }



    private _changeVec: Vector = null
    protected isRevert: boolean = false
    protected endPos: Vector = Vector.zero


    baseUpdata(dt: number, eslapsed: number) {
        if (this.endPos.x == 0 && this.endPos.y == 0 && this.endPos.z == 0) {
            if (this.isRevert) {
                this.endPos.set(this.obj.worldTransform.position.add(new Vector(0, 0, 100)))
            } else {
                this.endPos.set(this.obj.worldTransform.position.subtract(new Vector(0, 0, 100)))
            }
            this.isRevert = !this.isRevert
        } else {
            if (Math.abs(this.obj.worldTransform.position.z - this.endPos.z) >= 5) {
                if (this.endPos.x != this.obj.worldTransform.position.x
                    || this.endPos.y != this.obj.worldTransform.position.y
                ) {
                    this.endPos.set(this.obj.worldTransform.position.x, this.obj.worldTransform.position.y, this.endPos.z)
                }
                this.obj.worldTransform.position = mw.Vector.lerp(this.obj.worldTransform.position, this.endPos, dt * 1);
            } else {
                this.endPos = Vector.zero
            }
        }

    }

    protected state_unable(...data: any) {
        this._headUI?.setVisible(true)
        this.obj.worldTransform.scale = this._orginScale
        this.obj.worldTransform.position = this._orginPos
        if (this.obj.getChildren()[0]) {
            this.obj.getChildren()[0].worldTransform.position = this._orginPos
        }

        this.obj.worldTransform.rotation = this._orginRot
        if (!this._changeVec)
            this._changeVec = new Vector(this._orginPos.x, this._orginPos.y, this._orginPos.z - 180)
        this.npcPos.set(this._orginPos)
        this.endPos.set(this.npcPos)
    }
    protected state_unableUpdate(dt: number, eslapsed: number) {
        this.baseUpdata(dt, eslapsed)
    }

    protected state_idle(...data: any) {

    }

    private state_idleUpdate(dt: number, eslapsed: number) {
        this.baseUpdata(dt, eslapsed)
    }

    protected state_follow(...data: any) {
        if (this._host <= 0) return
        this._headUI?.setVisible(false)
        const elem = GameConfig.Spirt.getElement(this.id)
        if (elem)
            this.obj.worldTransform.scale = Vector.one.multiply(elem.covenantScale)
        this._walkInteval = setInterval(() => {
            if (this.curState() == ESpiritState.Follow || this.curState() == ESpiritState.Attack) {
                this.playerPos.set(Player.getPlayer(this._host).character.worldTransform.position);
                this.playerPos.set(this.playerPos.x + MathUtil.randomInt(-300, 300), this.playerPos.y + MathUtil.randomInt(-300, 300), this.playerPos.z + 50)
            }
            //     const playerPos = Player.getPlayer(this._host).character.worldTransform.position;
            //     const npcPos = this.obj.worldTransform.position;
            //     if (Vector.squaredDistance(playerPos, npcPos) > 400 * 400) {
            //         if (Vector.squaredDistance(playerPos, npcPos) > 1000 * 1000) {
            //             this.obj.worldTransform.position = new Vector(playerPos.x + MathUtil.randomInt(-120, 120), playerPos.y + MathUtil.randomInt(-120, 120), playerPos.z + MathUtil.randomInt(0, 50))
            //             let dir = playerPos.subtract(this.obj.worldTransform.position.clone()).normalized
            //             this.obj.worldTransform.rotation = new Rotation(this.obj.worldTransform.rotation.x, this.obj.worldTransform.rotation.y, dir.z)
            //         } else {
            //             let dir = playerPos.subtract(npcPos).normalized
            //             this.obj.addMovement(dir.multiply(5))
            //         }
            //     }
        }, this.att.getValue(Attribute.EAttType.atkFreq) * 1000)

        if (this._atkInteval) {
            clearInterval(this._atkInteval)
            this._atkInteval = null
        }
        this._atkInteval = setInterval(() => {
            const nearMonster = MonsterMgr.Inst.getNearMonster(3000, this.obj.worldTransform.position)
            if (nearMonster) {
                const dir = nearMonster.pos.subtract(this.obj.worldTransform.position).normalized
                let tmpDit = this.obj.worldTransform.transformDirection(dir)
                ModuleService.getModule(MonsterSkillMC).useSkill(this.skill, this.obj.gameObjectId, tmpDit, this.obj.worldTransform.position, false)
            }
        }, this.att.getValue(Attribute.EAttType.atkFreq) * 1000)
    }

    private playerPos: Vector = Vector.zero
    private npcPos: Vector = Vector.zero
    private distance: number
    public target: Vector = Vector.zero

    protected state_followUpdate(dt: number, eslapsed: number) {
        if (this._host <= 0) return
        this.npcPos = this.obj.worldTransform.position
        this.distance = Vector.squaredDistance(this.playerPos, this.npcPos)
        if (this.distance > 200 * 200) {
            if (this.distance > 1000 * 1000) {
                this.obj.worldTransform.position = this.npcPos.set(this.playerPos.x + MathUtil.randomInt(-50, 50), this.playerPos.y + MathUtil.randomInt(-50, 50),
                    this.playerPos.z + MathUtil.randomInt(-50, 50))
            } else {
                this.target.set(this.playerPos)
                this.obj.worldTransform.position = Vector.lerp(this.npcPos, this.target, 2 * dt)
            }
            this.endPos.set(this.npcPos)
        } else {

        }
        this.baseUpdata(dt, eslapsed)
    }

    protected state_followExit() {
        if (this._atkInteval) {
            clearInterval(this._atkInteval)
            this._atkInteval = null
        }

    }

    private _atkInteval = null
    protected state_attack(...data: any) {

    }

    protected state_attackUpdate(dt: number, eslapsed: number) {
        this.state_followUpdate(dt, eslapsed)
    }

    protected state_attackExit() {

    }

    protected state_destroy(...data: any) {
        if (this._walkInteval) {
            clearInterval(this._walkInteval)
            this._walkInteval = null
        }
        SpiritManager.instance.unSpawn(this.obj)
    }


    protected state_destroyUpdate(dt: number, eslapsed: number) {

    }

    protected changeState(state: ESpiritState, ...data: any) {
        this._fsm.switch(state, ...data)
    }

    public curState() {
        return this._fsm.getStateInfo().state
    }


    public update(dt: number) {
        this._fsm.update(dt)
    }

    /**契约
     * 
     */
    onCovenant() {

        this.changeState(ESpiritState.Follow)
        this.life = GlobalData.spiritTime
        this._lifeInteval = setInterval(() => {
            this.life -= 1
            if (this.life > 0) {
            } else {
                Tips.show('与精灵跟随3分钟,自动解除契约')
                this.onDisconnect()
                clearInterval(this._lifeInteval)
                this._lifeInteval = null
            }
            Event.dispatchToLocal("SpiritTimeChange", this.id, this.life)
        }, 1000);
    }

    onFollow() {
        this.changeState(ESpiritState.Follow)
    }
    onDestroy() {
        this.changeState(ESpiritState.Destroy)
    }


    onIdle() {
        this.changeState(ESpiritState.Idle)
    }

    onAttack() {
        this.changeState(ESpiritState.Attack)
    }

    /**
     * 解除契约
     */
    onDisconnect() {
        if (this._lifeInteval) {
            clearInterval(this._lifeInteval)
            this._lifeInteval = null
        }
        this.changeState(ESpiritState.Unable)
    }
}

export const enum SpiritType {
    None,
    //力量
    Force,
    //敏捷
    Agile
}

export const SpritGuid = [
    '7309B8F342AED8A4027FFC840627AE3A',
    '2C4B913549C078434D8B32863D0068CA',
    '0BCBAB514E061B2FDCD9559A31334F58'
]

export const enum ESpiritState {
    Idle,
    Attack,
    Follow,
    //还没契约
    Unable,
    Destroy
}