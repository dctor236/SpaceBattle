import { SpawnManager, SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
import { MonsterHeadUI } from "./MonsterHeadUI";
import { MonsterCfg, MonsterDefine, EMonsterBehaviorState, EMonserState } from "./MonsterDefine";
import { MonsterBase } from "./behavior/MonsterBase";
import { EMonsterType, EnumDamageType } from "../../modules/fight/FightDefine";
import DragonMonster from "../../modules/fight/monster/DragonMonster";
import { GameConfig } from "../../config/GameConfig";
import { Attribute } from "../../modules/fight/attibute/Attribute";
// import { DamageDigit } from "../../modules/fight/ui/DamageDigit";
import FightMgr from "../../modules/fight/FightMgr";
import OfficeBoy from "../../modules/fight/monster/OfficeBoy";
import Group from "../../modules/fight/monster/Group";
import OfficeBoss from "../../modules/fight/monster/OfficeBoss";
import WallMonster from "../../modules/fight/monster/WallMonster";
import SpaceFlight from "../../modules/fight/monster/SpaceFlight";
import { GlobalData } from "../../const/GlobalData";
import { HitMgr } from '../../modules/fight/ui/HitMgr';

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-02 14:18
 * @LastEditTime : 2023-06-11 11:08
 * @description  : 怪物脚本
 */
@Component
export default class Monster extends mw.Script {
    public index: number;
    //怪物唯一ID
    public mid: string;
    @mw.Property({ replicated: true, onChanged: 'onNameChanged' })
    public nick: string = '';
    @mw.Property({ replicated: true, onChanged: 'onHpChanged' })
    public hpMax: number = -100;
    /***属性信息 */
    @mw.Property({ replicated: true, onChanged: 'onHpChanged' })
    public hp: number = -100;
    @mw.Property({ replicated: true })
    public defense: number = 100;
    @mw.Property({ replicated: true, onChanged: 'onStateChanged' })
    public state: EMonserState = EMonserState.Visable;
    @mw.Property({ replicated: true })
    public atk: number = 10;
    @mw.Property({ replicated: true })
    public atkFreq: number = 10;
    @mw.Property({ replicated: true })
    public speed: number = 10;

    @mw.Property({ replicated: true })
    public cfgID: number = 0;
    @mw.Property({ replicated: true, onChanged: 'onTypeChanged' })
    public type: EMonsterType = EMonsterType.None;
    /**
     * 头顶信息,server没有
     */
    public headUI: MonsterHeadUI;
    public isLocal: boolean = false;
    private character: mw.Character;
    private uiWidget: mw.UIWidget;
    private inited = false;
    private behavior: MonsterBase;
    private headRelLoc: Vector
    //上一次更新的血量，只是为了防止本地已比同步少还刷新显示
    private lastHp: number = 0;
    /**怪物阵营 */
    protected onStart() {
        if (this.gameObject) {
            //  this.gameObject.asyncReady()
            this.gameObject.tag = 'Monster'
            this.mid = this.gameObject.gameObjectId;
            this.index = MonsterDefine.getIndex();
            this.inited = false;
            this.useUpdate = true
            if (SystemUtil.isServer()) {
                return;
            }
            if (PlayerManagerExtesion.isNpc(this.gameObject)) {
                this.character = this.gameObject;
                this.uiWidget = this.character.overheadUI;
                // this.uiWidget.headUIMaxVisibleDistance = 15000;
                // this.uiWidget.scaledByDistanceEnable = false
                // this.uiWidget.pivot = new mw.Vector2(0.5, 0.5);
                this.uiWidget.selfOcclusion = false
                this.uiWidget.occlusionEnable = false
                this.setHeadUI();
                this.showHp();
            }
            else {
                SpawnManager.modifyPoolAsyncSpawn("UIWidget").then(ui => {
                    this.uiWidget = ui as mw.UIWidget
                    this.uiWidget.parent = this.gameObject
                    this.uiWidget.widgetSpace = mw.WidgetSpaceMode.OverheadUI;
                    this.uiWidget.headUIMaxVisibleDistance = 15000;
                    this.uiWidget.scaledByDistanceEnable = false
                    this.uiWidget.pivot = new mw.Vector2(0.5, 0.5);
                    this.uiWidget.selfOcclusion = false
                    this.uiWidget.occlusionEnable = false
                    //默认
                    this.uiWidget.localTransform.position = (new mw.Vector(this.headRelLoc))//this.re;
                    this.setHeadUI();
                    this.showHp();

                    this.uiWidget.drawSize.set(this.headUI.root.size)
                })

            }
        }
    }
    protected onUpdate(dt: number): void {
        if (MonsterDefine.inited) {
            this.update(dt)
        } else {
            Event.dispatchToLocal(MonsterDefine.Event_Monster_Start, this);
        }
    }

    initMonsterAtt(attID: number) {
        let attrVo: Attribute.AttributeValueObject
        attrVo = new Attribute.AttributeValueObject();
        // 初始属性
        const elem = GameConfig.BaseAttribute.getElement(attID)
        for (let i = 0; i < elem.AttrType.length; i++) {
            const attType = elem.AttrType[i]
            const val = MathUtil.randomInt(elem.AttrValueFactor[i][0], elem.AttrValueFactor[i][1])
            attrVo.addValue(attType, val);
            this.setAtt(attType, val)
        }
        FightMgr.instance.registAttibuteMonser(this.mid, attrVo)
        return attrVo
    }

    info: MonsterCfg = null


    public init(info: MonsterCfg) {
        if (!info)
            return;
        const elem = GameConfig.Monster.getElement(info.config)
        this.mid = this.gameObject.gameObjectId
        this.info = info
        let type = info.type ? info.type : 0;
        this.nick = elem.MonsterName;
        this.headRelLoc = new Vector(elem.headPos)
        if (SystemUtil.isClient()) {
        } else {
            this.initMonsterAtt(elem.Attr)
        }
        this.setBehavior(type, info.config)
    }
    public get pos() {
        // if (this.behavior)
        //     return this.behavior.pos;
        if (this.gameObject)
            return this.gameObject.worldTransform.position;
        else
            return mw.Vector.zero
    }
    /**
     * 各类型怪物的行为
     * @param type 类型
     */
    public setBehavior(type: number, info: number) {
        this.type = type ? type : 0;
        this.behavior = null;
        let call: Action1<EMonserState> = new Action1();
        this.cfgID = info
        call.add((state: EMonserState) => {
            this.state = state
            if (state == EMonserState.Relive) {
                this.setHp(this.hpMax)
            } else if (state == EMonserState.Visable) {
                this.setHp(this.hpMax)
            } else if (state = EMonserState.Hide) {
            } else if (state = EMonserState.Dead) {
                this.setHp(0)
            }
            this.lastHp = this.hp
        })

        switch (type) {
            case EMonsterType.SpaceFlight:
                this.behavior = new SpaceFlight();
                break;
            case EMonsterType.OfficeBoy:
                this.behavior = new OfficeBoy();
                break;
            case EMonsterType.Group:
                this.behavior = new Group();
                break;
            case EMonsterType.Boss:
                this.behavior = new OfficeBoss();
                break;
            case EMonsterType.Box:
                this.behavior = new WallMonster();
                break;
            default:
                this.behavior = new MonsterBase();
                break;
        }
        this.behavior.init(this.gameObject, this.cfgID, call)

    }
    //行为更新
    update(dt) {
        if (this.state < 1)
            return;
        if (SystemUtil.isClient()) {
            this.headUI?.update(dt);
        } else {
            this.behavior?.update(dt);
        }
    }

    public isDead() {
        return this.state == EMonserState.Dead || this.hp <= 0 || this.behavior?.getCurState() == EMonsterBehaviorState.Dead || this.behavior?.getCurState() == EMonsterBehaviorState.Sleep
    }
    public isHiden() {
        return this.state == EMonserState.Hide
    }

    getAtt(type: Attribute.EAttType) {
        let val: number = 0
        switch (type) {
            case Attribute.EAttType.atk:
                val = this.atk
                break
            case Attribute.EAttType.defense:
                val = this.defense
                break
            case Attribute.EAttType.hp:
                val = this.hp
                break
            case Attribute.EAttType.maxHp:
                val = this.hpMax
                break
            case Attribute.EAttType.speed:
                val = this.speed
                break
            case Attribute.EAttType.atkFreq:
                val = this.atkFreq
                break
        }
        return val
    }

    setAtt(type: Attribute.EAttType, val: number) {
        switch (type) {
            case Attribute.EAttType.atk:
                this.setAtk(val)
                break
            case Attribute.EAttType.defense:
                this.setDefence(val)
                break
            case Attribute.EAttType.atkFreq:
                this.setAtkFreq(val)
                break
            case Attribute.EAttType.speed:
                this.setSpeed(val)
                break
            case Attribute.EAttType.hp:
                this.setHp(val)
                break
            case Attribute.EAttType.maxHp:
                this.setHpMax(val)
                break
        }
    }

    public setHp(num: number, isForce: boolean = false) {
        if (num == undefined)
            return;
        this.hp = num;
        if (this.hp <= 0) {
            this.hp = 0;
            this.state = EMonserState.Dead
        }
        else if (this.hp > this.hpMax) {
            this.hp = this.hpMax;
        }
        this.behavior?.hpCallBack.call(this.hp, isForce)
        this.showHp();
    }
    public setDefence(num: number) {
        if (num == undefined)
            return;
        this.defense = num;
    }
    public setHpMax(num: number) {
        if (num == undefined)
            return;
        this.hpMax = num;
        this.showHp();
    }
    public setSpeed(num: number) {
        if (num == undefined)
            return;
        this.speed = num;
    }
    public setAtkFreq(num: number) {
        if (num == undefined)
            return;
        this.atkFreq = num;
    }

    public setAtk(num: number) {
        if (num == undefined)
            return;
        this.atk = num;
    }

    /**
     * 设置状态
     * @param num 
     */
    public setMonsterState(num: EMonserState) {
        this.state = num;
        // let vis = num > 0 ? mw.PropertyStatus.On : mw.PropertyStatus.Off;
        // this.gameObject.setVisibility(vis, true);
    }

    setBehaviorState(num: EMonsterBehaviorState) {
        if (num == EMonsterBehaviorState.Dead) {
            this.setHp(0, true)
        } else if (num == EMonsterBehaviorState.Show) {
            this.setHp(this.hpMax)
            this.showHp();
        }
        this.lastHp = this.hp
        this.behavior.changeState(num)
    }

    public getState() {
        return this.behavior.getCurState()
    }

    /**
     * 设置头顶UI
     */
    public setHeadUI() {
        if (SystemUtil.isServer())
            return;
        if (!this.uiWidget) {
            return;
        }
        if (this.headUI)
            this.headUI.destroy();
        this.uiWidget.setUIbyID(MonsterDefine.headRes);
        //widget.drawSize = pos;
        this.headUI = new MonsterDefine.HeadUI();
        this.headUI.init(this.uiWidget);
    }
    /**
     * 设置头顶UI位置
     * @param pos 
     */
    public setHeadUIPos(pos: mw.Vector) {
        if (this.uiWidget)
            this.uiWidget.localTransform.position = (pos);
    }
    /**
     * 头顶显示聊天信息
     * @param msg 信息
     */
    public showChat(msg: string) {
        if (this.headUI)
            this.headUI.showChat(msg);
    }
    public showHp() {
        if (this.headUI) {
            this.lastHp = this.hp;
            if (this.type == EMonsterType.Boss) {
                Event.dispatchToLocal('OnBossHpChange')
            }
            if (this.hp > 0) {
                this.headUI.showHp(this.hp, this.hpMax);
            }
            else {
                // this.headUI.setHpVisable(false)
                // this.headUI.setNameVisable(false)
                this.onDead()
            }
        }
    }

    public showName(name: string = '') {
        StringUtil.isEmpty(name) ? name = this.nick : name;
        this.headUI?.showName(name);
    }

    public onDamage(damage: number, isCrit: boolean) {
        let hp = this.hp - damage;
        if (SystemUtil.isClient() && damage > 0) {
            let type = EnumDamageType.normal
            if (isCrit) {
                type = EnumDamageType.crit
            }
            if (this.type == EMonsterType.Boss) {
                Event.dispatchToLocal('OnBossHpChange')
            }
            HitMgr.inst.show2DHurt(damage, isCrit, this.gameObject.worldTransform.position)
            // DamageDigit.showDamage(this.gameObject.worldTransform.position, this.mid, `-${damage}`, type);
        }
        this.setHp(hp);
    }

    onHpChanged() {
        if (this.lastHp < this.hp)
            return
        this.showHp();
    }

    onDestroy() {
        super.onDestroy()
        this.headUI?.onDestroy()
        this.headUI = null
    }

    onTypeChanged() {
        // this.setBehavior(this.type, this.cfgID)
    }

    onStateChanged() {
        if (this.state == EMonserState.Hide || this.state == EMonserState.Dead) {
            if (this.state == EMonserState.Dead) {
                this.headUI?.onDestroy()
                this.setHp(0)
            }
            this.headUI?.reset()
        } else if (this.state == EMonserState.Visable || this.state == EMonserState.Relive) {
            this.setHp(this.hpMax)
            this.headUI?.setHpVisable(true)
            this.headUI?.setNameVisable(true)
        }
    }

    onNameChanged() {
        this.showName();
    }
    private onDead() {
        this.headUI?.reset()
    }
}

