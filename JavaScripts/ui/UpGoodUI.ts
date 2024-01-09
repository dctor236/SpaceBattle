import { GlobalData } from "../const/GlobalData"
import { UIHide } from "../ExtensionType"
import { BagModuleC } from "../modules/bag/BagModuleC"
import GuideMC from "../modules/guide/GuideMC"
import { MGSMsgHome } from "../modules/mgsMsg/MgsmsgHome"
import { CoinType } from "../modules/shop/ShopData"
import ShopModuleC from "../modules/shop/ShopModuleC"
import { TS3 } from "../ts3/TS3"
import UpGoodUI_Generate from "../ui-generate/upGood/UpGoodUI_generate"
import GameUtils from "../utils/GameUtils"
import Tips from "./commonUI/Tips"

export default class UpGoodUI extends UpGoodUI_Generate {

    protected onStart(): void {
        this.layer = mw.UILayerMiddle;
        this.mUp.onClicked.add(() => {
            const bagC = ModuleService.getModule(BagModuleC)
            const itme = bagC.tempItem['140015']
            let curNum = itme ? itme.count : 0
            if (curNum == 0) {
                Tips.show('道具不足')
                return
            } else {
                const building = TS3.assistMgr.getAssist(GlobalData.upBuild)
                if (!building) return

                if (!building.isDead()) {
                    const maxUP = (building.hpMax - building.hp) % 100 == 0 ?
                        (building.hpMax - building.hp) / 100 : (building.hpMax - building.hp) / 100 + 1
                    curNum = Math.floor(curNum > maxUP ? maxUP : curNum)
                    if (curNum > 0) {
                        let res = bagC.useTempItem('140015', curNum)
                        if (res != -1) {
                            TS3.assistMgr.onDamage(GlobalData.upBuild, -100 * curNum, false)
                            const talkStr = StringUtil.format('本次上交维修材料{0}个，回复建筑血量{1}，获得奖励钞票{2}',
                                curNum, curNum * 100, curNum * 100)
                            ModuleService.getModule(ShopModuleC).req_addCoin(CoinType.Bill, 100 * curNum)
                            ModuleService.getModule(GuideMC).showNpcTalk(talkStr, '神秘的声音')
                        }
                    } else {
                        Tips.show("当前建筑不需要修复!")
                    }
                } else if (building.rebornTime > 0) {
                    const maxUP = building.rebornTime % 5 == 0 ?
                        building.rebornTime / 5 : building.rebornTime / 5 + 1
                    curNum = Math.floor(curNum > maxUP ? maxUP : curNum)
                    if (curNum > 0) {
                        let res = bagC.useTempItem('140015', curNum)
                        if (res != -1) {
                            Tips.show('已使用维修材料，加速' + 5 * curNum + 's复原！')
                            Event.dispatchToServer('CutDownCd', GlobalData.upBuild, 5 * curNum)
                        }
                    } else {
                        Tips.show("当前建筑不需要修复!")
                    }
                }
                MGSMsgHome.uploadMGS('ts_game_result', '玩家每次上交材料', { record: 'hand_material' })
            }
        })

        this.mClose_btn.onClicked.add(() => {
            UIHide(this)
        })
        GameUtils.setIconByAsset('20689', this.img1)
        // GameUtils.setIconByAsset('20689', this.img2)
    }

    onShow() {
        const itme = ModuleService.getModule(BagModuleC).tempItem['140015']
        const count = itme ? itme.count : 0
        this.mOwner.text = count + ''
        Event.dispatchToLocal('HideShorter', false)
    }

    onHide() {
        Event.dispatchToLocal('HideShorter', true)
    }

}