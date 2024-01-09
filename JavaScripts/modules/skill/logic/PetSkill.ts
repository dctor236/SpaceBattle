/**
 * @Author       : 田可成
 * @Date         : 2023-04-25 17:13:15
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-28 16:03:59
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\logic\PetSkill.ts
 * @Description  : 
 */
import { EventsName, SkillState } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import PetModuleC from "../../pets/PetModuleC";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(2041)
export class PetSkill extends SkillBase {
    private _curPet: number = 0
    protected onStart(...params: any[]): boolean {
        if (this.Charge == 0 || GlobalData.skillCD > 0 || this.State < 0) return false;
        const petID = Number(this.skillLevelConfig.Param1)
        if (this.State == SkillState.Enable) {
            ModuleService.getModule(PetModuleC).callPet(petID)
            this.State = SkillState.Using
            this._curPet = petID;
        } else {
            this.reCallPet(petID)
        }
        Event.dispatchToLocal(EventsName.UseSkill, this.itemID, this.skillID)
        GlobalData.skillCD = GlobalData.defaultCD
        return true;
    }

    private async reCallPet(petID: number) {
        await ModuleService.getModule(PetModuleC).recallPet()
        if (this._curPet != petID) {
            ModuleService.getModule(PetModuleC).callPet(petID)
            this._curPet = petID;
        } else {
            this.onOver()
        }
    }

    public onRemove(): void {

    }
}