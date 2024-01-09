import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
/**
 * @Author       : 田可成
 * @Date         : 2023-04-06 09:24:12
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-04-28 09:45:49
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\logic\MakeItemSkill.ts
 * @Description  : 
 */
import { GameConfig } from "../../../config/GameConfig";
import { EventsName, SkillState } from "../../../const/GameEnum";
import { GlobalConfig } from "../../../const/GlobalConfig";
import { GlobalData } from "../../../const/GlobalData";
import { UIManager } from "../../../ExtensionType";
import GameUtils from "../../../utils/GameUtils";
import { BagModuleC } from "../../bag/BagModuleC";
import { PropModuleC } from "../../prop/PropModuleC";
import MakePropUI from "../ui/MakePropUI";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(3011)
export class MakeItemSkill extends SkillBase {
    protected onStart(...params: any[]): boolean {
        if (this.Charge == 0 || GlobalData.skillCD > 0) return false;
        this.setState(SkillState.Creation, this.skillID, this.makeItem)
        return true;
    }

    public makeItem = async (creationID: number) => {
        this.onOver()
        await GameUtils.downAsset(GlobalData.creationAnim)
        await GameUtils.downAsset(GlobalConfig.Make.sound)
        SoundService.playSound(GlobalConfig.Make.sound)
        const anim = PlayerManagerExtesion.rpcPlayAnimation(this.character, GlobalData.creationAnim, 1, 1)
        this.character.movementEnabled = false
        const config = GameConfig.CreateItem.getElement(creationID)
        const prefabLoc = await ModuleService.getModule(PropModuleC).spawnPrefab(config.CreationGuid, 0, config.CreationTime, config.CreationIsClient)
        setTimeout(() => {
            this.character.movementEnabled = true
            ModuleService.getModule(BagModuleC).addCreationItem(config.ItemID, 1, false);
            Event.dispatchToLocal(EventsName.CreationSkills, config.ItemID, prefabLoc)
        }, anim.length * 1000);
    }

    public onRemove(): void {
        UIManager.hide(MakePropUI)
        super.onRemove()
    }
}