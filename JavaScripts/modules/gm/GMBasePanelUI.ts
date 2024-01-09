import { GMBasePanel } from "module_gm";
import GMHUD_Generate from "../../ui-generate/uiTemplate/GM/GMHUD_generate";
import GMItem_Generate from "../../ui-generate/uiTemplate/GM/GMItem_generate";

export default class GMBasePanelUI extends GMBasePanel<GMHUD_Generate, GMItem_Generate> {

	constructor() {
		super(GMHUD_Generate, GMItem_Generate);
	}


}
