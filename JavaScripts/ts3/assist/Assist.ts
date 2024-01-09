import { SpawnManager, SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';



import { AssistCfg, AssistDefine, EAssistBehaviorState, EAssistState } from "./AssistDefine";
import { GameConfig } from "../../config/GameConfig";
import { Attribute } from "../../modules/fight/attibute/Attribute";
import FightMgr from "../../modules/fight/FightMgr";
import { AssistHeadUI } from "./AssistHeadUI";
import { AssistBase } from "./behavior/AssistBase";
import WallAssist from "./behavior/WallAssist";
import { EAssistType, EnumDamageType } from "../../modules/fight/FightDefine";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-02 14:18
 * @LastEditTime : 2023-06-11 11:08
 * @description  : 怪物脚本
 */
@Component
export default class Assist extends mw.Script {
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
    public state: EAssistState = EAssistState.Visable;
    @mw.Property({ replicated: true })
    public atk: number = 10;
    @mw.Property({ replicated: true })
    public atkFreq: number = 10;
    @mw.Property({ replicated: true })
    public speed: number = 10;
    @mw.Property({ replicated: true })
    public type: EAssistType = EAssistType.None;
    /**
     * 头顶信息,server没有
     */
    public headUI: AssistHeadUI;
    public isLocal: boolean = false;
    private character: mw.Character;
    private uiWidget: mw.UIWidget;
    private inited = false;
    private behavior: AssistBase;
    private headRelLoc: Vector
    //上一次更新的血量，只是为了防止本地已比同步少还刷新显示
    private lastHp: number = 0;
    /**怪物阵营 */

    public rebornTime = 0
    protected onStart() {
        if (this.gameObject) {
            //  this.gameObject.asyncReady()
            this.mid = this.gameObject.gameObjectId;
            this.index = AssistDefine.getIndex();
            this.inited = false;
            this.useUpdate = true
            if (SystemUtil.isServer()) {
                return;
            }
            if (this.gameObject instanceof mw.Character && !this.gameObject.player) {
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
    // @updater.updateByFrameInterval(5)
    protected onUpdate(dt: number): void {
        if (AssistDefine.inited) {
            this.update(dt)
        } else {
            // this.inited = true
            Event.dispatchToLocal(AssistDefine.Event_Assist_Start, this);
        }
    }

    initAssistAtt(attID: number) {
        let attrVo: Attribute.AttributeValueObject
        attrVo = new Attribute.AttributeValueObject();
        // 初始属性
        const elem = GameConfig.BaseAttribute.getElement(attID)
        for (let i = 0; i < elem.AttrType.length; i++) {
            const attType = elem.AttrType[i]
            const val = elem.AttrValueFactor[i][MathUtil.randomInt(0, 1)]
            attrVo.addValue(attType, val);
            this.setAtt(attType, val)
        }
        FightMgr.instance.registAttibuteMonser(this.mid, attrVo)
        return attrVo
    }

    info: AssistCfg = null

    public init(info: AssistCfg) {
        if (!info)
            return;
        const elem = GameConfig.Assist.getElement(info.config)
        this.mid = this.gameObject.gameObjectId
        this.info = info
        let type = info.type ? info.type : 0;
        this.nick = elem.assistName;
        this.headRelLoc = new Vector(elem.headPos)
        if (SystemUtil.isClient()) return
        this.initAssistAtt(elem.Attr)
        this.setBehavior(type, info)
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
    public setBehavior(type: number, info: AssistCfg) {
        this.type = type ? type : 0;
        this.behavior = null;
        let call: Action1<EAssistState> = new Action1();
        call.add((state: EAssistState) => {
            this.state = state
            if (state == EAssistState.Relive) {
                this.setHp(this.hpMax)
            } else if (state == EAssistState.Visable) {
                this.setHp(this.hpMax)
            } else if (state = EAssistState.Hide) {
            } else if (state = EAssistState.Dead) {
                this.setHp(0)
            }
            this.lastHp = this.hp
        })

        switch (type) {
            case EAssistType.Wall:
                this.behavior = new WallAssist();
                break;
        }
        this.behavior.init(this.gameObject, info, call)

    }
    //行为更新
    update(dt) {
        if (this.state < 1)
            return;
        if (SystemUtil.isClient()) {
            this.headUI?.update(dt);
        }
        this.behavior?.update(dt);
    }

    public isDead() {
        return this.hp <= 0 || this.behavior?.getCurState() == EAssistBehaviorState.Dead || this.behavior?.getCurState() == EAssistBehaviorState.Sleep
    }
    public isHiden() {
        return this.state == EAssistState.Dead || this.state == EAssistState.Hide
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
            this.state = EAssistState.Dead
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
    public setAssistState(num: EAssistState) {
        this.state = num;
        // let vis = num > 0 ? mw.PropertyStatus.On : mw.PropertyStatus.Off;
        // this.gameObject.setVisibility(vis, true);
    }

    setBehaviorState(num: EAssistBehaviorState) {
        if (num == EAssistBehaviorState.Dead) {
            this.setHp(0, true)
        } else if (num == EAssistBehaviorState.Show) {
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
        this.uiWidget.setUIbyID(AssistDefine.headRes);
        //widget.drawSize = pos;
        this.headUI = new AssistDefine.HeadUI();
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
            // if (this.type == EMonsterType.Boss) {
            //     Event.dispatchToLocal('OnBossHpChange')
            // }
            if (this.hp > 0) {
                this.headUI.showHp(this.hp, this.hpMax);
            }
            else {
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
            // let type = EnumDamageType.normal
            // if (isCrit) {
            //     type = EnumDamageType.crit
            // }
            // DamageDigit.showDamage(this.gameObject.worldTransform.position, `-${damage}`, EnumDamageType.playerInjure);
        }
        this.setHp(hp);
    }

    onHpChanged() {
        // if (this.lastHp <= this.hp)
        //     return
        const damage = this.lastHp - this.hp
        // if (damage > 0)
        // DamageDigit.showDamage(this.gameObject.worldTransform.position, `-${damage}`, EnumDamageType.playerInjure);
        this.showHp();
    }

    onDestroy() {
        super.onDestroy()
        this.headUI?.onDestroy()
        this.headUI = null
    }

    onStateChanged() {
        if (this.state == EAssistState.Hide || this.state == EAssistState.Dead) {
            if (this.state == EAssistState.Dead) {
                this.headUI?.onDestroy()
                this.setHp(0)
                this.rebornTime = 180
                const inteval = setInterval(() => {
                    if (this.rebornTime > 1) {
                        this.rebornTime -= 1
                    } else {
                        this.rebornTime = 0
                        clearInterval(inteval)
                    }
                }, 1000)
            }
            // this.headUI?.reset()
            this.headUI?.setHpVisable(false)
        } else if (this.state == EAssistState.Visable || this.state == EAssistState.Relive) {
            this.setHp(this.hpMax)
            this.headUI?.setHpVisable(true)
            this.headUI?.setNameVisable(true)
        }
    }

    onNameChanged() {
        this.showName();
    }
    private onDead() {
        // this.headUI?.reset()
    }
}

