/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-10 11:54:57
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-26 21:15:53
 * @FilePath: \vine-valley\JavaScripts\modules\spirit\UI\SpiritBagUI.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { GlobalData } from "../../../const/GlobalData";
import SpiritBag_Generate from "../../../ui-generate/spirit/SpiritBag_generate";
import Tips from "../../../ui/commonUI/Tips";
import Spirit, { SpiritType, SpritGuid } from "../Spirit";
import SpiritModuleC from "../SpiritModuleC";

const SprritIcon = [
    '135135',
    '136626',
    '132546'
]

class SpiritBagItem {
    spiritId: number = -1
    type: SpiritType
    canvas: mw.Canvas
    icon: mw.Image
    mtimeTex: mw.TextBlock
    freeBtn: mw.Button
    constructor() {
        Event.addLocalListener("SpiritTimeChange", (sid: number, time: number) => {
            if (this.spiritId != sid) return
            if (time > 0) {
                this.mtimeTex.text = time + 's'
            } else {
                this.setVisable(false)
            }
        })
    }

    setVisable(state: boolean, id: number = -1, type: SpiritType = SpiritType.None) {
        if (state) {
            const spirit = ModuleService.getModule(SpiritModuleC).getSpiritById(id)
            this.mtimeTex.text = spirit.life + 's'
            this.icon.imageGuid = SprritIcon[type - 1]
            this.canvas.visibility = mw.SlateVisibility.SelfHitTestInvisible
        } else {
            this.canvas.visibility = mw.SlateVisibility.Collapsed
        }
        this.spiritId = id
        this.type = type
    }
    getVisable() {
        return this.canvas.visibility == mw.SlateVisibility.SelfHitTestInvisible
    }
}


export default class SpiritBagUI extends SpiritBag_Generate {
    protected itemList: SpiritBagItem[] = []
    protected showNum: number = 0
    onStart() {
        this.layer = mw.UILayerBottom;
        this.canUpdate = false
    }

    onShow() {
        if (this.itemList.length == 0) {
            for (let i = 1; i <= 3; i++) {
                const item = new SpiritBagItem()
                item.canvas = this.rootCanvas.findChildByPath('Canvas' + i) as mw.Canvas
                item.icon = item.canvas.findChildByPath('Icon') as mw.Image
                item.mtimeTex = item.canvas.findChildByPath('Timer') as mw.TextBlock
                item.freeBtn = item.canvas.findChildByPath('FreeButton') as mw.Button
                item.freeBtn.onClicked.add(() => {
                    if (item.spiritId < 0) { return }
                    const spirit = ModuleService.getModule(SpiritModuleC).getSpiritById(item.spiritId)
                    if (spirit) {
                        Tips.show('已经与精灵解除契约')
                        spirit.onDisconnect()
                        this.showNum -= 1
                        item.setVisable(false)
                        if (this.showNum == 1) {
                            const last = this.itemList.findIndex(e => e.getVisable() == true)
                            if (last != -1 && last != 2) {
                                const lastOne = this.itemList[last]
                                this.itemList[2].setVisable(true, lastOne.spiritId, lastOne.type)
                                lastOne.setVisable(false)
                            }
                        }
                    }
                })
                item.setVisable(false)
                this.itemList.push(item)
            }
        }
        const spiritList = ModuleService.getModule(SpiritModuleC).curFollowIdsTypes()
        this.showNum = spiritList.length
        if (this.showNum == 1) {
            const res = spiritList[0]
            this.itemList.forEach(e => {
                e.setVisable(false)
            })
            this.itemList[2].setVisable(true, res.id, res.type)
        } else {
            for (let i = 0; i < 3; i++) {
                if (spiritList[i]) {
                    this.itemList[i].setVisable(true, spiritList[i].id, spiritList[i].type)
                } else {
                    this.itemList[i].setVisable(false)
                }
            }
        }
    }
    onHide() {
    }

}