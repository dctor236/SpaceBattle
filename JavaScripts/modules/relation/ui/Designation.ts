import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
/** 
 * @Author       : 陆江帅
 * @Date         : 2023-05-10 15:39:52
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-05-14 13:47:17
 * @FilePath     : \mollywoodschool\JavaScripts\modules\relation\ui\Designation.ts
 * @Description  : 
 */
import { GameConfig } from "../../../config/GameConfig";
import { EventsName } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import Designation_Generate from "../../../ui-generate/relation/Designation_generate";
import Tips from "../../../ui/commonUI/Tips";
import { ContractType } from "../RelationData";
import RelationModuleC from "../RelationModuleC";

export class Designation extends Designation_Generate {

    protected onStart(): void {

    }

    protected initButtons(): void {
        super.initButtons();
        this.close.onClicked.add(() => {
            this.hide()
        })
        this.cancel.onClicked.add(() => {
            this.hide()
        })

        this.transmit.onClicked.add(() => {
            this.transmitToCovenanter();
        })
    }

    protected onShow(skillID: number): void {
        switch (skillID) {
            case 208201:
                this.showContract(ContractType.Ring);
                break;
            default:
                break;
        }
    }

    private showContract(type: ContractType) {
        const relationModuleC = ModuleService.getModule(RelationModuleC)
        const connects = relationModuleC.connects[type];
        const designation = relationModuleC.designations[type];
        const time = relationModuleC.times[type];
        const day = Math.ceil((time - Date.now()) / (24 * 60 * 60 * 1000))
        this.designation.text = StringUtil.format(GameConfig.SquareLanguage.Relation_01.Value, connects, designation);
        this.remainTime.text = StringUtil.format(GameConfig.SquareLanguage.Relation_02.Value, day);
    }

    private transmitToCovenanter() {
        const relationModuleC = ModuleService.getModule(RelationModuleC)
        const covenanter = relationModuleC.covenanter[ContractType.Ring];
        if (!covenanter) {
            return
        }
        const playerLst = Player.getAllPlayers();
        let location: mw.Vector = null
        for (const player of playerLst) {
            const userID = player.userId;
            if (userID === covenanter) {
                location = player.character.worldTransform.position;
            }
        }
        if (!location) {
            Tips.show(GameConfig.SquareLanguage.Relation_23.Value)
            return;
        }
        this.hide()
        const player = Player.localPlayer;
        const character = player.character;
        character.movementEnabled = false;
        character.jumpEnabled = false;
        Event.dispatchToServer(EventsName.CancelActive);
        Event.dispatchToLocal(EventsName.CancelActive);
        GeneralManager.rpcPlayEffectOnPlayer("146327", player, mw.HumanoidSlotType.LeftFoot, 1, new mw.Vector(0, 15, 0))
        setTimeout(() => {
            character.movementEnabled = true;
            character.jumpEnabled = true;
            character.worldTransform.position = location;
        }, 2000);
    }
}