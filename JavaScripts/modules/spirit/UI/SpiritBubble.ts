import { GlobalData } from "../../../const/GlobalData";
import { UIManager } from "../../../ExtensionType";
import SpiritBubble_Generate from "../../../ui-generate/spirit/SpiritBubble_generate";
import Tips from "../../../ui/commonUI/Tips";
import Spirit from "../Spirit";
import SpiritModuleC from "../SpiritModuleC";
import SpiritBagUI from "./SpiritBagUI";

export default class SpiritBubble extends SpiritBubble_Generate {
    protected spirit: Spirit = null
    protected isAssociate: boolean = false
    onStart() {
        this.layer = mw.UILayerBottom;
        this.canUpdate = false
        this.mAcc.onClicked.add(() => {
            if (this.spirit) {
                const curFollow = ModuleService.getModule(SpiritModuleC).getCurFollowNum()
                if (!this.isAssociate) {
                    if (curFollow >= GlobalData.maxFollowSpirit) {
                        Tips.show('当前跟随的精灵已达上限')
                    } else {
                        Tips.show('与精灵签订契约,它会跟随你3分钟')
                        this.spirit.onCovenant()
                        UIManager.show(SpiritBagUI)
                    }
                } else {
                    Tips.show('已经与精灵解除契约')
                    this.spirit.onDisconnect()
                }
            }
            UIManager.hideUI(this)
        })
    }

    onShow(spirit: Spirit, isAssociate: boolean) {
        if (isAssociate) {
            this.mAccTex.text = '解约'
        } else {
            this.mAccTex.text = '契约'
        }
        this.isAssociate = isAssociate
        this.spirit = spirit
    }

    onHide() {
        this.spirit = null
    }

}