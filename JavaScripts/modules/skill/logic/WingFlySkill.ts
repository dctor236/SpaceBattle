import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
﻿import { GameConfig } from "../../../config/GameConfig";
import { EventsName, PlayerStateType, SkillState } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { GlobalModule } from "../../../const/GlobalModule";
import { EffectManager } from "../../../ExtensionType";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
import { BesomEvent } from "../skillObj/BesomMgr";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(2051)
export class WingFlySkill extends SkillBase {
    private _linsnter: mw.EventListener
    private _inGame: boolean
    private _flyTime: number = 0
    private _anitimer
    private _stance: mw.SubStance;
    effID: number = -1
    public init(): void {
        super.init()
        this.disableState = PlayerStateType.Interaction
    }

    protected onStart(...params): boolean {
        if (this.Charge == 0 || GlobalData.skillCD > 0 || GlobalModule.MyPlayerC.State.getMyAction().includes(PlayerStateType.Interaction) || this.State < 0) return false;
        if (this.State == SkillState.Enable) {
            this.State = SkillState.Using
            this.character.switchToFlying()
            this.character.maxFlySpeed = 800 * 2;
            GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Fly, true)
            this._flyTime = TimeUtil.elapsedTime();
            const effElem = GameConfig.Effect.getElement(this.skillLevelConfig.Param1)
            if (effElem) {
                this.effID = GeneralManager.rpcPlayEffectOnPlayer(effElem.EffectID, this.character.player, effElem.EffectPoint, 0,
                    new Vector(effElem.EffectLocation), new Rotation(effElem.EffectRotate), new Vector(effElem.EffectLarge))
            }
        } else {
            this.onOver()
        }
        Event.dispatchToLocal(EventsName.UseSkill, this.itemID, this.skillID)
        GlobalData.skillCD = GlobalData.defaultCD
        return true;
    }

    public onOver(): void {
        GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Fly, false)
        if (this._flyTime != 0) {
            super.onOver()
            // if (this._stance) this._stance.stop()
            this.character.switchToWalking()
            this._flyTime = TimeUtil.elapsedTime() - this._flyTime;
            MGSMsgHome.flyTime(this._inGame ? 1 : 2, Math.ceil(this._flyTime))
            this._flyTime = 0
            this.character.maxFlySpeed = 800
            // PlayerManagerExtesion.rpcPlayAnimation(this.character, GlobalData.flyOverAnim)
        }
        EffectService.stop(this.effID)
        if (this._linsnter) this._linsnter.disconnect();
        if (this._anitimer) clearTimeout(this._anitimer)
    }

    public onRemove(): void {
        // if (this.State == SkillState.Using) this.onOver()
        // super.onRemove();
    }
}