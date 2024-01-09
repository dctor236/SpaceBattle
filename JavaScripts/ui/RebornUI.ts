import { UIHide } from "../ExtensionType";
import reborn_Generate from "../ui-generate/reborn_generate";
import GameUtils from "../utils/GameUtils";
export default class RebornUI extends reborn_Generate {
    protected second: number = 0
    protected onStart(): void {

    }

    onShow() {
        // this.canUpdate = true
        this.second = 3
        this.mSecond.text = StringUtil.format(GameUtils.getTxt("LeaderBord_Tex1"), this.second)
        const inteval = setInterval(() => {
            this.second -= 1
            if (this.second < 0) {
                clearInterval(inteval)
                UIHide(this)
            } else {
                this.mSecond.text = StringUtil.format(GameUtils.getTxt("LeaderBord_Tex1"), this.second)
            }
        }, 1000)
    }

    onUpdate(dt: number) {

    }

    onHide() {
        // this.canUpdate = false
    }
}