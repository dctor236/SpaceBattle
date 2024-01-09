/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-12 21:27:22
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-13 23:52:19
 * @FilePath: \vine-valley\JavaScripts\modules\buff\buffitems\ExampleBuffS.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { BuffC } from "../base/BuffC";
import { BuffS } from "../base/BuffS";

//无法控制
export class UnControlBuffS extends BuffS {

    protected onExcete(): void {
        super.onExcete()
    }

    public onDestroy() {
        super.onDestroy();
    }

}

//无法控制
export class UnControlBuffC extends BuffC {
    protected onExcete(): void {
        super.onExcete()
    }

    public onDestroy() {
        super.onDestroy();
    }

}