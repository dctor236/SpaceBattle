import { CloseAllUI, UIHide, UIManager } from "../ExtensionType";
import { GameModuleC } from "../modules/gameModule/GameModuleC";
import JumpGameUI_Generate from "../ui-generate/tour/JumpGameUI_generate";
import BackSchoolUI from "./BackSchoolUI";
export default class BackSelectUI extends JumpGameUI_Generate {

    protected onStart(): void {
        this.buttonYes.onClicked.add(() => {
            ModuleService.getModule(GameModuleC).stopReturnTime()
            CloseAllUI()
            UIManager.show(BackSchoolUI, 4)
            UIHide(this)
        })
        this.buttonNo.onClicked.add(() => {
            UIHide(this)
        })
    }

    onShow() {

    }

    onUpdate(dt: number) {

    }
}