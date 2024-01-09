/**
 * @Author       : 田可成
 * @Date         : 2023-04-27 17:01:19
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-09 13:43:21
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\logic\StarSkill.ts
 * @Description  : 
 */
import { EventsName, PlayerStateType, SkillState } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { GlobalModule } from "../../../const/GlobalModule";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(2012)
export class StarSkill extends SkillBase {
    private _defaultSpeed: number = 0
    private _flyTime: number = 0

    public init(): void {
        super.init()
        this._defaultSpeed = this.character.maxFlySpeed
        this.disableState = PlayerStateType.Interaction
    }

    protected onStart(...params): boolean {
        if (this.Charge == 0 || GlobalData.skillCD > 0 || GlobalModule.MyPlayerC.State.getMyAction().includes(PlayerStateType.Interaction) || this.State < 0) return false;
        if (this.State == SkillState.Enable) {
            this.State = SkillState.Using
            this.character.switchToFlying()
            GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Fly, true)
            this._flyTime = TimeUtil.elapsedTime();
            this.character.maxFlySpeed = this._defaultSpeed - 400
        } else {
            this.onOver()
        }
        GlobalData.skillCD = GlobalData.defaultCD
        Event.dispatchToLocal(EventsName.UseSkill, this.itemID, this.skillID)
        return true;
    }

    public onOver(): void {
        GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Fly, false)
        if (this._flyTime) {
            super.onOver()
            this.character.switchToWalking()
            this.character.maxFlySpeed = this._defaultSpeed
            this._flyTime = 0
        }
    }

    public onRemove(): void {
        if (this.State == SkillState.Using) this.onOver()
        super.onRemove();
    }
}