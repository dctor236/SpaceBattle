/** 
 * @Author       : 陆江帅
 * @Date         : 2023-05-10 10:35:40
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-05-10 10:42:59
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\logic\DesignationSkill.ts
 * @Description  : 
 */

import { UIManager } from "../../../ExtensionType";
import { SkillState } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { Designation } from "../../relation/ui/Designation";
import { Relationship } from "../../relation/ui/Relationship";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(2082)
export class DesignationSkill extends SkillBase {
    protected onStart(...params: any[]): boolean {
        if (this.Charge == 0 || GlobalData.skillCD > 0) return false;
        this.setState(SkillState.Designation, this.skillID)
        this.onOver()
        return true;
    }

    public onRemove(): void {
        UIManager.hide(Designation)
        super.onRemove()
    }
}