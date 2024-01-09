import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
import { ModifiedCameraSystem, CameraModifid, } from '../../../Modified027Editor/ModifiedCamera';
/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-08-16 20:03:03
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-08-16 20:45:15
 * @FilePath: \mollywoodschool\JavaScripts\modules\skill\logic\SkillBase.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { GameConfig } from "../../../config/GameConfig";
import { ISkillElement } from "../../../config/Skill";
import { ISkillLevelElement } from "../../../config/SkillLevel";
import { EventsName, SkillState } from "../../../const/GameEnum";
import { Class, GlobalData } from "../../../const/GlobalData";
import { MyAction, MyAction as MyAction1 } from "../../../ExtensionType";
import { TS3 } from "../../../ts3/TS3";
import BulletTrrigerMgr from "../bullettrriger/BulletTrrigerMgr";
import { BehaviorType, ISkillEntity, SkillItemType } from "../define/SkillDefine";
import { SkillRun } from "../runtime/SkillRun";
import SkillMgr from "../SkillMgr";
import SkillModule_Client from "../SkillModule_Client";
import SkillUI from "../ui/SkillUI";

/**
 * @Author       : 田可成
 * @Date         : 2023-03-03 18:54:53
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-03-19 09:53:46
 * @FilePath     : \fantasymagicschool\JavaScripts\modules\skill\logic\SkillBase.ts
 * @Description  :
 */
export default class SkillBase {
    private _skill: number = 0;
    public set skill(value: number) {
        this._skill = value;
        this.skillConfig = GameConfig.Skill.getElement(this._skill);
        if (this.skillConfig) {
            for (let i = 1; i <= 3; i++) {
                if (this.skillConfig["SkillConfig" + i] != null)
                    SkillRun.register(this._skill * 10 + (i - 1), this.skillConfig["SkillConfig" + i], this.comBehivor);
            }
        }
    }
    public get skill() {
        return this._skill;
    }

    private _skillID: number = 0;
    public set skillID(value: number) {
        this._skillID = value;
        this.skillLevelConfig = GameConfig.SkillLevel.getElement(this._skillID);
        this.maxCharge = this.skillLevelConfig.MaxCharge;
        if (this.cd <= this.skillLevelConfig.SkillCD) this.cdTotol = this.skillLevelConfig.SkillCD;
        if (this.charge === -1) this.charge = this.maxCharge;
    }
    public get skillID() {
        return this._skillID;
    }

    constructor(skill: number, host: string) {
        this.host = host;
        this.skill = skill;
        const go = GameObject.findGameObjectById(host);
        if (this.host && PlayerManagerExtesion.isCharacter(go)) this.character = go;
    }

    public init() {
        // Event.addLocalListener('DisposeItem', (id: string) => {
        //     const elem = GameConfig.Item.getElement(id)
        //     if (elem.Skills && elem.Skills.includes(this._skillID)) {
        //         this.onStop()
        //         this.onOver()
        //     }
        // })
    }

    public show(skillID: number, itemID: number) {
        this.skillID = skillID;
        this.itemID = itemID;
        this.State = this._state;
    }

    public disableState: number = 0
    public itemID: number = 0;
    public cdTotol: number = 0;
    public cd: number = -1;
    public host: string;
    public maxCharge: number = 1;
    public onChargeChange: MyAction1 = new MyAction1();
    private charge: number = -1;
    public set Charge(charge: number) {
        this.charge = charge;
        this.onChargeChange.call(this.charge);
    }
    public get Charge() {
        return this.charge;
    }

    protected character: mw.Character;
    public onStateChange: MyAction = new MyAction();
    private _state: SkillState = 0;

    public set State(state: SkillState) {
        this.setState(state);
    }
    public get State() {
        return this._state;
    }
    public setState(state: SkillState, ...params: any[]) {
        if (state == SkillState.Disable) {
            this.onOver();
        }
        this._state = state;
        this.onStateChange.call(this._state, ...params);
    }

    protected runtime: number = 0;
    protected skillConfig: ISkillElement;
    protected skillLevelConfig: ISkillLevelElement;

    public active(...params: any[]) {
        this.cdTotol = this.skillLevelConfig.SkillCD;
        this.onStart(...params);
    }

    public outStart() {
        return this.onStart()
    }

    private _quaternion: mw.Quaternion = new mw.Quaternion()

    /**
     * @description: 技能真正的开始
     * @param {array} params
     * @return {*}
     */
    protected onStart(...params: any[]): boolean {
        if (this.Charge == 0 || GlobalData.skillCD > 0 || this.character.isJumping) return false;
        // if (!this.skillLevelConfig.CanMove) {
        //     this.character.movementEnabled = false;
        //     this.character.jumpEnabled = false;
        // }
        Event.dispatchToLocal(EventsName.UseSkill, this.itemID, this.skillID, this.skillLevelConfig.isTelescope);
        /**辅助瞄准 */
        let hitObj: string = "";
        let m = null
        let pos: Vector = Vector.zero
        m = GlobalData.autoBattle ? TS3.monsterMgr.getMonster(GlobalData.RedAnimMid) : TS3.monsterMgr.getNearMonster(15000, TS3.playerMgr.mainPos);//getNearMonster(1500, TS3.playerMgr.mainPos);
        if (!m) {
            m = GlobalData.autoBattle ? TS3.playerMgr.getPlayer(GlobalData.RedAnimMid) : TS3.playerMgr.getNearPlayer(15000, TS3.playerMgr.mainUserId);
        } else {
        }
        pos = GlobalData.RedAnimPos// m.pos

        if (!params[0]) params[0] = this.character.worldTransform.position;
        this.character.worldTransform.rotation = pos.subtract(this.character.worldTransform.position).normalize().toRotation()
        if (this.skillConfig.IsSupport) {
            if (m && m.gameObject) {
                //XXJ 索敌
                if (!params[1]) {
                    // TS3.log('辅助瞄准', m.guid, pos)
                    // mw.Quaternion.rotationTo(mw.Vector.forward, pos.subtract(this.character.worldTransform.position).normalize(), this._quaternion)
                    // this._quaternion.toRotation();
                    // new Tween({ x: this.character.worldTransform.rotation }).to({ x: params[1] }, 150).onUpdate(value => {
                    //     // value.x.x = value.x.y = 0;
                    //     this.character.worldTransform.rotation = value.x;
                    // }).start();
                    hitObj = m.gameObject.guid;
                    // this.character.worldTransform.rotation = pos.subtract(this.character.worldTransform.position).normalize().toRotation()
                    params[1] = this.character.worldTransform.rotation
                    this.character.movementEnabled = false
                    setTimeout(() => {
                        this.character.movementEnabled = true
                    }, 2000);
                    // const camera = Camera.currentCamera
                    // ModifiedCameraSystem.setOverrideCameraRotation(dir.toRotation(), true);//将相机与玩家方向一致
                    // setTimeout(() => {
                    //     ModifiedCameraSystem.resetOverrideCameraRotation();
                    //     // params[1] = this.fireToPoint()
                    // }, 10);
                }
            }
        } else if (this.skillLevelConfig.isTelescope >= 1) {
            const camera = Camera.currentCamera
            let res = camera.worldTransform.rotation//  this.fireToPoint()
            // if (Math.floor(this.character.getForwardVector().z - res.z) <= 45) {
            params[1] = res
            this.character.worldTransform.rotation = new Rotation(this.character.worldTransform.rotation.x, this.character.worldTransform.rotation.y, params[1].z);
            // } else {
            //     params[1] = this.character.getForwardVector().toRotation()
            // }
        }

        if (this.skillConfig["SkillConfig" + (this.State + 1)]) {
            SkillRun.cast(this.character, this.skill * 10 + this.State, { pos: params[0], rot: params[1], diy: [hitObj, this.skillID] });
        }
        /**当一个技能释放成功时需要将所有技能都进入内置cd */
        GlobalData.skillCD = GlobalData.defaultCD;
        if (this.skillLevelConfig.RunTime && this.skillLevelConfig.RunTime[this.State]) {
            this.runtime = this.skillLevelConfig.RunTime[this.State];
            this.State++;
        } else {
            this.onOver();
        }
        return true;
    }

    /**从瞄准点发射 */
    fireToPoint() {
        const skillUI = mw.UIService.getUI(SkillUI)
        const win = mw.getViewportSize();
        const viewPort = mw.WindowUtil.getViewportSize();
        const viewPos = mw.Vector2.zero
        mw.localToViewport(skillUI.point.tickSpaceGeometry, mw.Vector2.zero, mw.Vector2.zero, viewPos)
        viewPos.x *= win.x / viewPort.x;
        viewPos.y *= win.y / viewPort.y;
        const result = InputUtil.convertScreenLocationToWorldSpace(viewPos.x, viewPos.y)
        const pos = result.worldPosition.clone().add(result.worldDirection.multiply(1000))
        return mw.Quaternion.rotationTo(mw.Vector.forward, pos.subtract(this.character.worldTransform.position).normalize()).toRotation()
    }

    /**
     * @description: 代表一个技能放完并进入CD
     * @return {*}
     */
    public onOver() {
        if (this.Charge == this.maxCharge) this.cd = GameConfig.SkillLevel.getElement(this.skillID).SkillCD;
        this.Charge--;
        this.State = SkillState.Enable;
        this.runtime = 0;
    }

    /**
     * @description: 技能命中后的回调
     * @return {*}
     */
    public onHit(hitObj: string, buffName: string, damage: number, damageRate: number, effect: number, music: number, isOwn: boolean, hitLocation?: mw.Vector): number {
        if (this.host && hitObj != "") {
            if (!hitLocation) hitLocation = GameObject.findGameObjectById(hitObj).worldTransform.position
            // return ComponentSystem.getComponent(SkillComponent, this.host)?.onHit(hitObj, buffName, damage, effect, music, this._skillID, hitLocation);
            return ModuleService.getModule(SkillModule_Client).onHit(hitObj, buffName, damage, damageRate, effect, music, this.skillID, isOwn, hitLocation)
        }
        return 0;
    }

    /**
     * @description: 当技能被从技能组中移除时
     * @return {*}
     */
    public onRemove() {
        this.onStop()
        this.onStateChange.clear();
        this.onChargeChange.clear();
    }

    onStop() {
        if (this.skillLevelConfig && this.skillLevelConfig.SkillType == 1) {
            BulletTrrigerMgr.instance.stopBullet()
        }
    }

    public onUpdate(dt: number) {
        if (this.cd >= 0) {
            this.cd -= dt;
            if (this.cd <= 0) {
                this.Charge++;
                // if (this.Charge != this.maxCharge) this.cd = GameConfig.SkillLevel.getElement(this.skillID).SkillCD
            }
        }
        if (this.runtime > 0) {
            this.runtime -= dt;
            if (this.runtime <= 0) {
                this.onOver();
            }
        }
    }

    public comBehivor = (entity: ISkillEntity, type: BehaviorType, ...params) => {
        const character = Player.localPlayer.character;
        const levelConfig = GameConfig.SkillLevel.getElement(entity.param.diy[1]);
        const skillConfig = GameConfig.Skill.getElement(Number((entity.param.diy[1] / 100).toFixed(0)))
        switch (type) {
            case BehaviorType.CastStart:
                // console.log('开始释放引导');
                break;
            case BehaviorType.CastBreak:
                // console.log('释放中断')
                break;
            case BehaviorType.CastEnd:
                // console.log('释放引导完成')
                break;
            case BehaviorType.Event: //编辑器中事件模块的返回
                //事件ID
                break;
            case BehaviorType.ItemStart: //模块执行
                //模块类型
                if (params[0] == SkillItemType.Action && character && character.gameObjectId == entity.host.gameObjectId && !skillConfig.CanMove) {
                    character.movementEnabled = false;
                    character.jumpEnabled = false;
                }
                if (params[0] == SkillItemType.Action && entity.value != 1) {
                    GlobalData.skillCD = params[2];
                }
                if (params[0] == SkillItemType.Put || (params[0] == SkillItemType.Effect && entity.value == 1)) {
                    if (levelConfig.SkillType != 1) break;
                    if (character) {
                        //params[2] 子弹存在时间
                        //params[1] 子弹obj
                        let damageRate = 1
                        if (levelConfig.DamageRate.length >= 2) {
                            damageRate = MathUtil.randomInt(levelConfig.DamageRate[0], levelConfig.DamageRate[1])
                        } else {
                            damageRate = levelConfig.DamageRate[0]
                        }

                        BulletTrrigerMgr.instance.createBullet(
                            params[1],
                            entity.itemId,
                            params[2],
                            this,
                            levelConfig,
                            levelConfig.BuffName ? levelConfig.BuffName[0] : "",
                            levelConfig.Damage[0],
                            damageRate,
                            levelConfig.TrrigerConfig,
                            levelConfig.TrrigerConfig2,
                            character.gameObjectId == entity.host.gameObjectId
                        );
                    }

                }

                // console.log(params[0] as SkillItemType + '模块开始', entity.param.diy[1]);
                break;
            case BehaviorType.ItemEnd: //模块执行完成
                // console.log('模块执行完成')
                break;
            case BehaviorType.End: //所有技能模块执行完返回
                if (character && character.gameObjectId == entity.host.gameObjectId) {
                    character.movementEnabled = true;
                    character.jumpEnabled = true;
                }
                if (character && levelConfig.SkillType == 2 && entity.param.diy[0]) {
                    let trrigerConfig = levelConfig.TrrigerConfig;
                    trrigerConfig = trrigerConfig.split("effect=")[1];
                    const effect = Number(trrigerConfig.substring(0, trrigerConfig.indexOf(",")));
                    const music = Number(trrigerConfig.split("music=")[1]) || 50;
                    this.onHit(entity.param.diy[0], levelConfig.BuffName ? levelConfig.BuffName[0] : "", levelConfig.Damage[0], levelConfig.DamageRate[0], effect, music,
                        character.gameObjectId == entity.host.gameObjectId);
                }
                // console.log('释放完成')
                break;
        }
    };
}
export function registerSkill(skill: number) {
    return function <T extends SkillBase>(constructor: Class<T>) {
        if (SystemUtil.isClient()) {
            SkillMgr.Inst.skillClassMap.set(skill, constructor);
        }
    };
}
