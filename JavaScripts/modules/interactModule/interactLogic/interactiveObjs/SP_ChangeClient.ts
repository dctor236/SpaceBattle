import { PlayerManagerExtesion, } from '../../../../Modified027Editor/ModifiedPlayer';
import { GameConfig } from "../../../../config/GameConfig";
import { EventsName } from "../../../../const/GameEnum";
import { GlobalData } from "../../../../const/GlobalData";
import { GlobalModule } from "../../../../const/GlobalModule";
import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

/**性别枚举 */
export enum SexType {
    /**普通男 */
    Male = "Male_Medium",
    /**普通女 */
    Female = "Female_Medium",
    /**Lopoly男 */
    LopolyMale = "Lowpoly_Adult_Male",
    /**Lopoly女 */
    LopolyFemale = "Lowpoly_Adult_FeMale",
}


/**用法 Active_UI 不独享 */
@Component
export default class ChangeCloth extends InteractObject {
    @mw.Property({ displayName: "MaleID", group: "性别对应服装表ID" })
    public maleConfigID: number = 0;
    @mw.Property({ displayName: "FeMaleID", group: "性别对应服装表ID" })
    public feMaleConfigID: number = 0;

    onStart() {
        this.init(ChangeCloth_S, ChangeCloth_C);
    }
}
//客户端
class ChangeCloth_C extends InteractLogic_C<ChangeCloth> {
    public static startChange: boolean = false;
    public static curClothID: number = null;
    private guidList: Array<string> = new Array<string>();

    onStart(): void {
    }

    onPlayerAction(playerId: number, active: boolean, param: any): void {
        if (ChangeCloth_C.startChange) {
            return;
        }
        const player = Player.getPlayer(playerId)
        const char = player.character;
        const humanV2 = char;

        if (!(PlayerManagerExtesion.isNpc(humanV2))) {
            console.log("changeDress PlayerManagerExtesion.isNpc(v2Tool) false ", char);
            return;
        }

        const sexStr = humanV2.description.advance.base.characterSetting.somatotype;
        let curClothConfigID: number = null;
        //判断玩家性别，获取对应装扮ID
        if (sexStr == mw.SomatotypeV2.AnimeFemale || sexStr == mw.SomatotypeV2.LowpolyAdultFemale || sexStr == mw.SomatotypeV2.RealisticAdultFemale) {
            //女性
            curClothConfigID = this.info.feMaleConfigID;
        } else if (sexStr == mw.SomatotypeV2.LowpolyAdultMale || sexStr == mw.SomatotypeV2.AnimeMale || sexStr == mw.SomatotypeV2.RealisticAdultMale) {
            //男性
            curClothConfigID = this.info.maleConfigID;
        }
        if (!curClothConfigID || ChangeCloth_C.curClothID == curClothConfigID) {
            return;
        }

        // const clothConfig = GameConfig.Cloth.getElement(curClothConfigID);

        // const clothModule = GlobalModule.MyPlayerC.Cloth
        // //生成特效和静态模型
        // if (clothConfig.Effects) {
        //     clothModule.createEffect(clothConfig.Effects)
        // }
        // if (clothConfig.Slots) {
        //     clothModule.createStaticModel(clothConfig.Slots)
        // }

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

        // ChangeCloth_C.curClothID = curClothConfigID;

        // ChangeCloth_C.startChange = true;

        // GlobalData.clothConfigID = curClothConfigID;
        // //清除上个装扮的特效和静态模型
        // clothModule.resetPlayerCloth();
        // humanV2.setDescription(this.guidList, () => {
        //     humanV2.syncDescription();
        //     ChangeCloth_C.startChange = false;
        // });
    }
}
//服务端
class ChangeCloth_S extends InteractLogic_S<ChangeCloth> {

    onStart(): void {
    }
    onPlayerAction(playerId: number, active: boolean, param: any) {
    }
}
