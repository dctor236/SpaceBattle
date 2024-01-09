import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
import { LogMgr } from "../com/LogMgr";
import HeadUI from "./PlayerHeadUI";
import { PlayerDefine, GamePlayerState } from "./PlayerDefine";
import { PlayerMgr } from "./PlayerMgr";
import { Attribute } from "../../modules/fight/attibute/Attribute";
import { EnumDamageType } from "../../modules/fight/FightDefine";
// import { DamageDigit } from "../../modules/fight/ui/DamageDigit";
import { EventsName } from "../../const/GameEnum";
import { GameConfig } from "../../config/GameConfig";
import { EffectManager } from "../../ExtensionType";
import ActionMC from "../../modules/action/ActionMC";
import MonsterSkillMC from "../../modules/fight/monsterSkill/MonsterSkillMC";
import { MonsterMgr } from "../monster/MonsterMgr";
import { BagModuleC } from "../../modules/bag/BagModuleC";
import { GlobalData } from "../../const/GlobalData";
import { HitMgr } from '../../modules/fight/ui/HitMgr';
/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-02 14:18
 * @LastEditTime : 2023-06-11 13:17
 * @description  : 玩家脚本
 */
@Component
export default class TsPlayer extends mw.Script {
    public userId: string;
    /***玩家信息 */
    @mw.Property({ replicated: true })
    public openId: string;
    @mw.Property({ replicated: true })
    public nickName: string;
    @mw.Property({ replicated: true })
    public title: string = '';
    @mw.Property({ replicated: true, onChanged: 'onTitleChanged' })
    public titleType: number = 0;
    // @mw.Property({ replicated: true })
    // public avatar: string;
    public readonly onHpChangeCb: Action1<number> = new Action1();//RMB变化
    /***属性信息 */
    @mw.Property({ replicated: true, onChanged: 'onHpChanged' })
    public hpMax: number = 1;
    /***属性信息 */
    @mw.Property({ replicated: true, onChanged: 'onHpChanged' })
    public hp: number = 1;
    @mw.Property({ replicated: true, onChanged: '' })
    public critRate: number = 100;
    @mw.Property({ replicated: true, onChanged: '' })
    public critDamgeRate: number = 100;
    @mw.Property({ replicated: true, onChanged: '' })
    public defense: number = 100;
    @mw.Property({ replicated: true, onChanged: '' })
    public atk: number = 100;
    public lastHp: number = 0
    /***状态信息,暂不同步 */
    @mw.Property({ replicated: true, onChanged: 'onStateChange' })
    public state: GamePlayerState = GamePlayerState.None;

    /***对象信息 */
    public mwPlayer: mw.Player;
    public character: mw.Character;
    public headUI: HeadUI;

    //播放胜利特效
    public vicotrEffTimer = null
    public isContineue: boolean = false
    public effid: number = -1

    public get pos() {
        // if (this.behavior)
        //     return this.behavior.pos;
        if (this.character)
            return this.character.worldTransform.position.add(new Vector(0, 0, this.character.getBoundingBoxExtent().z / 2));
        else
            return mw.Vector.zero
    }

    public playVictorEff() {
        if (this.effid != -1) return
        this.isContineue = true
        const effElm = GameConfig.Effect.getElement(69)
        this.effid = GeneralManager.rpcPlayEffectOnPlayer(effElm.EffectID, this.mwPlayer, effElm.EffectPoint, 0,
            new Vector(effElm.EffectLocation), new Rotation(effElm.EffectRotate), new Vector(effElm.EffectLarge))
    }

    public stopPlayVictorEff(time: number = 0) {
        if (time == 0) {
            this.isContineue = false
            if (this.vicotrEffTimer) {
                clearTimeout(this.vicotrEffTimer)
                this.vicotrEffTimer = null
            }
            if (this.effid != -1) {
                EffectService.stop(this.effid)
                this.effid = -1
            }
        } else {
            this.vicotrEffTimer = setTimeout(() => {
                if (this.vicotrEffTimer) {
                    clearTimeout(this.vicotrEffTimer)
                    this.vicotrEffTimer = null
                }
                if (this.effid != -1) {
                    EffectService.stop(this.effid)
                    this.effid = -1
                }
                this.isContineue = false
            }, time * 1000);
        }
    }

    setPlayerState(state: GamePlayerState) {
        if (state == this.state)
            return
        this.state = state
        if (this.state == GamePlayerState.OutofBattle) {
            this.stopPlayVictorEff(5)
        }
    }

    private inited = false;
    onStart() {
        if (!this.gameObject)
            return;
        if (PlayerManagerExtesion.isCharacter(this.gameObject) &&
            this.gameObject.player) {
            this.gameObject.player.character.tag = 'Player'
        }
        if (SystemUtil.isClient()) {
            this.onInit()
        }
    }

    async onInit() {
        await this.gameObject.asyncReady()
        await TimeUtil.delaySecond(2)
        this.useUpdate = true;
        let char = this.gameObject as mw.Character;
        if (char && char.player)
            await this.initPlayer(char.player);
        else {
            let ps = Player.getAllPlayers();
            for (let p of ps) {
                if (p.character && p.character.gameObjectId == this.gameObject.gameObjectId) {
                    await this.initPlayer(p);
                }
                // const humanV = p.character.getAppearance() as mw.HumanoidV2;
                // humanV.enablePostProcess(true, mw.LinearColor.green, 1)
                // humanV['enableOutline'] = true
            }
        }
        if (PlayerDefine.headBit > 0 && PlayerMgr.Inst.mainGuid != this.gameObject.gameObjectId) {
            this.setHeadUI(PlayerDefine.otherHeadRes, PlayerDefine.HeadUI);
            this.showHead(PlayerDefine.headBit);
        }
        Event.addLocalListener(EventsName.PlayerAtk, () => {
            this.phyAtk()
        })
    }
    atkDelay: number = 0

    protected onUpdate(dt: number): void {
        if (!this.inited) {
            Event.dispatchToLocal(PlayerDefine.Event_Player_Start, this);
            this.inited = true;
        }
        if (!this.inited)
            return;
        if (this.headUI)
            this.headUI.update(dt);
        if (SystemUtil.isClient()) {
            if (this.hp <= 0)
                return

            if (!GlobalData.autoBattle || StringUtil.isEmpty(GlobalData.RedAnimMid))
                return

            if (this.atkDelay > 0)
                this.atkDelay -= dt
            else {
                //判断到达一定距离开火
                let nearM
                nearM = MonsterMgr.Inst.getMonster(GlobalData.RedAnimMid)// MonsterMgr.Inst.getNearMonster(1500, this.character.worldTransform.position)
                if (!nearM)
                    nearM = PlayerMgr.Inst.getPlayer(GlobalData.RedAnimMid)
                const curSel = Number(ModuleService.getModule(BagModuleC).curEquip)

                if (nearM) {
                    if (!(Math.floor(curSel / 10) >= 30 && Math.floor(curSel / 10) < 40))
                        return
                    const elem = GameConfig.Item.getElement(curSel)
                    if (elem && elem.Skills && elem.Skills.length >= 2) {
                        const skillElem = GameConfig.SkillLevel.getElement(elem.Skills[1])
                        if (skillElem) {
                            this.atkDelay = 2
                            Event.dispatchToLocal(EventsName.OutStartSkill, elem.Skills[1])
                            // ModuleService.getModule(SkillModule_Client).getSkillUI(elem.Skills, Number(curSel), true)
                        }
                    }
                } else {

                }
            }

        }
    }
    /**
     * 初始化玩家
     * @param player 玩家
     * @returns 
     */
    public async initPlayer(player: mw.Player) {
        if (!player) {
            LogMgr.Inst.error('player is null')
            return;
        }
        this.character = player.character;
        this.mwPlayer = player;
        this.userId = player.userId;
        await player.character.asyncReady()
        // const humanV = player.character.getAppearance() as mw.HumanoidV2;
        // humanV.enablePostProcess(true, mw.LinearColor.green, 1)
        // humanV['enableOutline'] = true
    }

    public getGuid() {
        if (this.character) {
            return this.character.gameObjectId
        }
        return ''
    }

    public setInfo(oid, name) {
        this.openId = oid;
        this.nickName = name;
    }
    public setTitle(type: number, title: string) {
        this.titleType = type;
        this.title = title;
    }
    /**
     * 是否已退出
     */
    public isOut() {
        return !this.mwPlayer || !this.mwPlayer.userId;
    }

    public setAtt(type: Attribute.EAttType, val: number) {
        switch (type) {
            case Attribute.EAttType.atk:
                this.setAtk(val)
                break
            case Attribute.EAttType.defense:
                this.setDefence(val)
                break
            case Attribute.EAttType.crit:
                this.setCritRate(val)
                break
            case Attribute.EAttType.critDamage:
                this.setCriteDamageRate(val)
                break
            case Attribute.EAttType.hp:
                this.setHp(val)
                break
            case Attribute.EAttType.maxHp:
                this.setHpMax(val)
                break
        }
    }

    public getAtt(type: Attribute.EAttType) {
        let val: number = 0
        switch (type) {
            case Attribute.EAttType.atk:
                val = this.atk
                break
            case Attribute.EAttType.defense:
                val = this.defense
                break
            case Attribute.EAttType.crit:
                val = this.critRate
                break
            case Attribute.EAttType.critDamage:
                val = this.critDamgeRate
                break
            case Attribute.EAttType.hp:
                val = this.hp
                break
            case Attribute.EAttType.maxHp:
                val = this.hpMax
                break
        }
        return val
    }

    /*****属性操作 */
    public setHp(num: number, damageType: number = -1, isCrit: boolean = false) {
        if (num == undefined)
            return;
        this.hp = num;
        if (this.hp <= 0) {
            this.hp = 0;
            this.onDead();
        } else if (this.hp > this.hpMax)
            this.hp = this.hpMax;
        if (this) {
            const damage = this.lastHp - this.hp
            this.lastHp = this.hp
            this.showHp(damage, damageType, isCrit);
        }
    }
    public setHpMax(num: number) {
        if (num == undefined)
            return;
        this.hpMax = num;
        this.showHp();
    }
    public setCritRate(num: number) {
        if (num == undefined)
            return;
        this.critRate = num;
    }

    public setCriteDamageRate(num: number) {
        if (num == undefined)
            return;
        this.critDamgeRate = num;
    }
    public setDefence(num: number) {
        if (num == undefined)
            return;
        this.defense = num;
    }

    public setAtk(num: number) {
        if (num == undefined)
            return;
        this.atk = num;
    }

    public isDead() {
        return this.hp <= 0
    }

    /**
     * 设置头顶UI
     */
    public setHeadUI(resId: string, view) {
        if (SystemUtil.isServer())
            return;
        let widget = this.character.overheadUI;
        widget.setUIbyID(resId);
        //widget.drawSize = pos;
        // widget.parent = null
        this.headUI = new view();
        this.headUI.init(widget);
        this.showName(this.nickName);
        let name = GameConfig.SquareLanguage.Danmu_Content_1106.Value
        this.showTitle(1, name);
        this.showHp();
        return widget;
    }

    /**
     * 头顶显示聊天信息
     * @param msg 信息
     */
    public showChat(msg: string) {
        if (this.headUI)
            this.headUI.showChat(msg);
    }
    public showTitle(type: number, title: string) {
        if (this.headUI)
            this.headUI.showTitle(type, title);
    }
    public showName(name: string) {
        if (this.headUI)
            this.headUI.showName(name);
    }
    public showHp(damage: number = 0, damageType: number = -1, isCrit: boolean = false) {
        // this.onHpChangeCb.call(this.hp)
        if (PlayerMgr.Inst.isMainPlayer(this)) {
            Event.dispatchToLocal(EventsName.OnPlayerHpChange, this.hp / this.hpMax * 100)
            if (damage > 0) {
                const hitElem = GameConfig.Effect.getElement(38)
                if (hitElem) {
                    GeneralManager.rpcPlayEffectOnPlayer(hitElem.EffectID, this.mwPlayer, hitElem.EffectPoint,
                        1, new Vector(hitElem.EffectLocation), new Rotation(hitElem.EffectRotate), new Vector(hitElem.EffectLarge))
                }
                this.onHit()

            }
        }
        if (this.headUI && PlayerMgr.Inst.getPlayer(this.userId)) {
            if (damage > 0) {
                if (PlayerMgr.Inst.isMainPlayer(this)) {
                    HitMgr.inst.show2DHurt(damage, false, this.pos)
                    // DamageDigit.showDamage(this.pos, this.mwPlayer.userId, `-${damage}`, EnumDamageType.playerInjure);
                } else {
                    if (damageType == 3) {
                        let type = EnumDamageType.normal
                        if (isCrit) {
                            type = EnumDamageType.crit
                        }
                        HitMgr.inst.show2DHurt(damage, isCrit, this.pos)
                        // DamageDigit.showDamage(this.pos, this.mwPlayer.userId, `-${damage}`, type);
                    } else {
                        HitMgr.inst.show2DHurt(damage, false, this.pos)
                        // DamageDigit.showDamage(this.pos, this.mwPlayer.userId, `-${damage}`, EnumDamageType.playerInjure);
                    }
                }
            }
            this.headUI.showHp(this.hp, this.hpMax);
        }
    }

    public showHead(bit: number) {
        if (SystemUtil.isServer())
            return;
        if (!this.headUI)
            this.setHeadUI(PlayerDefine.otherHeadRes, PlayerDefine.HeadUI);
        if (this.headUI)
            this.headUI.showHead(bit);
    }

    public onDamage(num: number, damageType: number, isCrit: boolean) {
        let hp = this.hp - num;
        this.setHp(hp, damageType, isCrit);
    }

    onTitleChanged() {
        this.showTitle(this.titleType, this.title);
    }

    /*****交互操作 */
    onInteract(enter: boolean) {

    }
    onHpChanged() {
        const damage = this.lastHp - this.hp
        this.lastHp = this.hp
        this.showHp(damage);
    }

    onHit() {
        this.character.movementEnabled = this.character.jumpEnabled = false
        setTimeout(() => {
            this.character.movementEnabled = this.character.jumpEnabled = true
        }, 500);
        ModuleService.getModule(ActionMC).playAction(304, this.character, () => {
            // this.character.movementEnabled = this.character.jumpEnabled = true
        })
    }

    playIndex: number = 0
    public phyAtk() {
        if (this.atkDelay > 0) return
        if (this.playIndex < AtkID.length - 1) {
            this.playIndex += 1
        } else {
            this.playIndex = 0
        }
        this.atkDelay = 1
        ModuleService.getModule(ActionMC).playAction(AtkID[this.playIndex])
        ModuleService.getModule(MonsterSkillMC).useSkill(1014, this.character.gameObjectId)
    }

    private onDead() {
        this.lastHp = 0
    }

    onDestroy() {
        super.onDestroy()
        this.headUI?.onDestroy()
        this.headUI = null
    }

    private onStateChange() {
        if (PlayerMgr.Inst.mainGuid == this.character.gameObjectId) {
            if (this.state == GamePlayerState.Battle) {
                GlobalData.playerInBattle = true
            } else {
                GlobalData.playerInBattle = false
            }
        }
    }
}

const AtkID: number[] = [
    311,
    312,
    313
]
