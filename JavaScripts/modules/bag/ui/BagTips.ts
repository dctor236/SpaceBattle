/** 
 * @Author       : 陆江帅
 * @Date         : 2023-03-20 09:42:53
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-03-20 11:07:57
 * @FilePath     : \mollywoodschool\JavaScripts\modules\Bag\ui\BagTips.ts
 * @Description  : 
 */
import BagTips_Generate from "../../../ui-generate/bag/BagTips_generate";

export class BagTips extends BagTips_Generate {

    protected onStart(): void {
        this.initButtons()
    }

    protected initButtons(): void {
        super.initButtons();
        this.close.onClicked.add(() => {
            this.hide()
        })

        this.closeBtn.onClicked.add(() => {
            this.hide()
        })

    }
}