import RelationItem_Generate from "../../../ui-generate/relation/RelationItem_generate";
import { BagUtils } from "../../bag/BagUtils";


export class RelationItem extends RelationItem_Generate {
    public id: number;

    get clickBtn() {
        return this.sureBtn;
    }

    setData(id: number) {
        this.id = id;
        let str = BagUtils.getName(id);
        if (str.length > 5) {
            str = StringUtil.format("{0},{1}", str.substring(0, 5), "...");
        }
        this.name.text = str;
        this.icon.imageGuid = BagUtils.getGender(id) == "1" ? "13774" : "13791";
    }
}