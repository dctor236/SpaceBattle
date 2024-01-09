import PlayerItem_Generate from "../../../ui-generate/bag/PlayerItem_generate";
import { BagUtils } from "../BagUtils";



export class PlayerItem extends PlayerItem_Generate {

    public playerId: number

    get clickBtn() {
        return this.mBtn
    }

    setData(playerId: number) {
        this.playerId = playerId;
        this.mName.text = BagUtils.getName(playerId);
        this.mPlayerIcon.imageGuid = BagUtils.getGender(playerId) == "1" ? "13774" : "13791";
    }
}