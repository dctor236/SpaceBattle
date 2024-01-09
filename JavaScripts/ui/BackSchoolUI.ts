import CG from "../modules/cg/CG";
import ShopModuleC from "../modules/shop/ShopModuleC";
import { UserMgr } from "../ts3/user/UserMgr";
import BackSchol_Generate from "../ui-generate/BackSchol_generate";
import GameUtils from "../utils/GameUtils";
export default class BackSchoolUI extends BackSchol_Generate {
    protected second: number = 0

    protected onStart(): void {

    }

    onShow(number: number) {
        this.mText_time.text = ''
        CG.instance.maskFadeIn(this.mMask, 2000, () => {
            // ModuleService.getModule(ShopModuleC).leaveMgs()
            this.canUpdate = true
            this.second = number
            this.mText_time.text = StringUtil.format(GameUtils.getTxt("Tips_1024"), Math.floor(this.second))
        })
    }

    onUpdate(dt: number) {
        if (this.second > dt) {
            this.second -= dt
            this.mText_time.text = StringUtil.format(GameUtils.getTxt("Tips_1024"), Math.floor(this.second))
        } else {
            this.second = 0
            this.mText_time.text = GameUtils.getTxt("Tips_1025")
            this.canUpdate = false
            UserMgr.Inst.jumpMainGame()
            // console.log("@@@@@@@跳回学校了！！")
        }
    }

    onHide() {
        this.canUpdate = false
    }
}