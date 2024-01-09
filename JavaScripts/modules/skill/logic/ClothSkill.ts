import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-05-20 19:14:12
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-05-24 00:20:20
 * @FilePath: \vine-valley\JavaScripts\modules\skill\logic\ClothSkill.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @Author       : 田可成
 * @Date         : 2023-04-24 10:45:00
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-05-14 11:33:13
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\logic\ClothSkill.ts
 * @Description  : 
 */
import { GameConfig } from "../../../config/GameConfig";
import { EventsName } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { GlobalModule } from "../../../const/GlobalModule";
import { EffectManager, SoundManager } from "../../../ExtensionType";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(3021)
export class ClothSkill extends SkillBase {
    private _curClothID: number = 0
    private _guidList: string[] = []
    private _startChange: boolean = false

    constructor(skill: number, host: string) {
        super(skill, host)
    }

    protected onStart(...params: any[]): boolean {
        if (super.onStart()) {
            if (!(PlayerManagerExtesion.isCharacter(this.character))) {
                return;
            }
            const humanV2 = this.character;
            const sexStr = humanV2.description.advance.base.characterSetting.somatotype;
            let curClothConfigID: number = null;
            const clothIDs = this.skillLevelConfig.Param1.split("|")
            const clothModule = GlobalModule.MyPlayerC.Cloth

            //判断玩家性别，获取对应装扮ID
            if (sexStr == mw.SomatotypeV2.AnimeFemale || sexStr == mw.SomatotypeV2.LowpolyAdultFemale || sexStr == mw.SomatotypeV2.RealisticAdultFemale) {
                //女性
                curClothConfigID = Number(clothIDs[1])
            } else if (sexStr == mw.SomatotypeV2.LowpolyAdultMale || sexStr == mw.SomatotypeV2.AnimeMale || sexStr == mw.SomatotypeV2.RealisticAdultMale) {
                //男性
                curClothConfigID = Number(clothIDs[0])
            }
            if (!curClothConfigID || this._curClothID == curClothConfigID) {
                return;
            }
            // const clothConfig = GameConfig.Cloth.getElement(curClothConfigID)
            // //生成特效和静态模型
            // if (clothConfig.Effects) {
            //     clothModule.createEffect(clothConfig.Effects)
            // }
            // if (clothConfig.Slots) {
            //     clothModule.createStaticModel(clothConfig.Slots)
            // }

            // this._guidList.length = 0;
            // GlobalData.clothConfigID = curClothConfigID;
            // //清除上个装扮的特效和静态模型
            // clothModule.resetPlayerCloth();
            // const character = Player.localPlayer.character

            // if (clothConfig.Head) {
            //     humanV2.description.advance.headFeatures.head.style = clothConfig.Head, true
            // }
            // if (clothConfig.Jacket) {
            //     humanV2.description.advance.clothing.upperCloth.style = clothConfig.Jacket, true
            // }
            // if (clothConfig.Underwear) {
            //     humanV2.description.advance.clothing.lowerCloth.style = clothConfig.Underwear, true
            // }
            // if (clothConfig.Gloves) {
            //     humanV2.description.advance.clothing.gloves.style = clothConfig.Gloves, true;
            // }
            // if (clothConfig.Shoe) {
            //     humanV2.description.advance.clothing.shoes.style = clothConfig.Shoe, true;
            // }
            // if (clothConfig.fontHair) {
            //     humanV2.description.advance.hair.frontHair.style = clothConfig.fontHair, true;
            // }

            // if (clothConfig.backHair) {
            //     humanV2.description.advance.hair.backHair.style = clothConfig.backHair, true;
            // }

            // const anim = PlayerManagerExtesion.loadAnimationExtesion(character, "29772")
            // anim.loop = 1;
            // anim.play();

            // GeneralManager.rpcPlayEffectOnPlayer("158079", Player.localPlayer, mw.HumanoidSlotType.LeftFoot)
            // SoundManager.playSound("124713")
        }
        return true;
    }
}