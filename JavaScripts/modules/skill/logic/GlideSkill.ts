import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
/*
 * @Author: jiezhong.zhang
 * @Date: 2023-04-23 14:19:32
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-05-08 14:23:05
 */
import { EventsName, SkillState } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import SkillBase, { registerSkill } from "./SkillBase";


@registerSkill(2061)
export class GlideSkill extends SkillBase {
    /** 初始下落速度 */
    private _defaultFall: number;
    /** 初始下落控制 */
    private _defaultControl: number;
    private _effect: number;
    /** 默认下落控制提升速率阈值 */
    private _defaultAirControlBoostVelocity: number;

    private _effectVector: Vector = new Vector(400, 0, 65);
    private _effectRotation: Rotation = new Rotation(30, 0, 90);

    protected onStart(...params): boolean {
        if (this.character.isJumping) {
            if (this.Charge == 0 || GlobalData.skillCD > 0) return false;
            if (this.skillLevelConfig.RunTime && this.skillLevelConfig.RunTime[this.State]) {
                this.runtime = this.skillLevelConfig.RunTime[this.State]
                this.State = SkillState.Using
            } else {
                this.onOver()
            }
            Event.dispatchToLocal(EventsName.UseSkill, this.itemID, this.skillID)
            if (this.State == SkillState.Using) {
                if (!this._defaultFall) {
                    this._defaultFall = this.character.maxFallingSpeed;
                    this._defaultControl = this.character.driftControl;
                }
                //更改玩家属性
                Event.dispatchToLocal(EventsName.PLAYER_FLY, true)
                this.character.maxFallingSpeed = GlobalData.glideFallingSpeed;
                this.character.driftControl = GlobalData.glideAirControl;
                this._effect = GeneralManager.rpcPlayEffectOnPlayer(GlobalData.glideEffectGuid, this.character.player, mw.HumanoidSlotType.BackOrnamental, 0, this._effectVector, this._effectRotation);
                // Event.dispatchToServer(GlideEvent.spwanGlide, this.character.guid);
                return true;
            }
        }
    }

    public onOver(): void {
        super.onOver();
        //还原玩家属性
        this.character.maxFallingSpeed = this._defaultFall;
        this.character.driftControl = this._defaultControl;
        EffectService.stop(this._effect);
        Event.dispatchToLocal(EventsName.PLAYER_FLY, false)
    }

    public onRemove(): void {
        if (this.State == SkillState.Using) this.onOver()
        super.onRemove();
    }

    public onUpdate(dt: number): void {
        super.onUpdate(dt)
        if (this.State == SkillState.Using && !this.character.isJumping) {
            this.onOver()
        }
    }
}