/**
 * @Author       : 田可成
 * @Date         : 2023-04-23 17:30:12
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-28 09:56:45
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\logic\ItemSkill.ts
 * @Description  : 
 */
import { EventsName } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { PropModuleC } from "../../prop/PropModuleC";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(4001)
export class ItemSkill extends SkillBase {
    protected onStart(...params: any[]): boolean {
        if (this.Charge == 0 || GlobalData.skillCD > 0) return false;
        GlobalData.skillCD = GlobalData.defaultCD
        const id = parseInt(this.skillLevelConfig.Param1)
        super.onOver()
        ModuleService.getModule(PropModuleC).doItemSkill(id, () => {
            Event.dispatchToLocal(EventsName.UseSkill, this.itemID, this.skillID)
        })
        return true
    }
}