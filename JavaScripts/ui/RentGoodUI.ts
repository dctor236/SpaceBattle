
import { GlobalData } from "../const/GlobalData"
import RentGoodTime_Generate from "../ui-generate/bag/RentGoodTime_generate"
import GameUtils from "../utils/GameUtils"
import Tips from "./commonUI/Tips"

class RentGoodItem {
    tex: mw.TextBlock = null
    inteval = null
    time: number = 0
    goodName: string = ''

    show(goodName: string) {
        clearInterval(this.inteval)
        this.inteval = null
        this.tex.visibility = mw.SlateVisibility.SelfHitTestInvisible
        this.time = GlobalData.rentTime
        this.goodName = goodName
        this.inteval = setInterval(() => {
            if (this.time > 1) {
                this.time -= 1
                if (this.time == 30) {
                    Tips.show(this.goodName + GameUtils.getTxt("Tips_1019"))
                }
                this.tex.text = this.time + 's'
            } else {
                this.destroy()
            }
        }, 1000)
    }

    destroy() {
        clearInterval(this.inteval)
        this.inteval = null
        this.tex.text = ''
        this.time = 0
        this.tex.visibility = mw.SlateVisibility.Hidden
    }
    hide(state: boolean) {
        if (state) {
            this.tex.visibility = mw.SlateVisibility.SelfHitTestInvisible
        } else {
            this.tex.visibility = mw.SlateVisibility.Hidden
        }
    }
}


export default class RentGoodUI extends RentGoodTime_Generate {
    texList: RentGoodItem[] = []
    protected onStart(): void {
        this.layer = mw.UILayerTop;
        for (let i = 0; i < 5; i++) {
            const item = this.rootCanvas.findChildByPath("Canvas/Tex" + (i + 1)) as mw.TextBlock
            let tmpGood = new RentGoodItem()
            tmpGood.tex = item
            this.texList.push(tmpGood)
        }
        this.texList.forEach(e => {
            e.destroy()
        })

        Event.addLocalListener('HideShorter', (state: boolean) => {
            this.texList.filter(e => e.time > 0).forEach(e => {
                e.hide(state)
            })
        })
    }

    onShow() {

    }

    hideIndex(index: number) {
        if (index < 0 || index >= this.texList.length)
            return
        this.texList[index].destroy()
    }

    showIndex(index: number, goodName: string) {
        if (index < 0 || index >= this.texList.length)
            return
        this.texList[index].show(goodName)
    }

}