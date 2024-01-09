

import Action1 = mw.Action1;
import Action2 = mw.Action2;
/** 
 * @Author       : lei.zhao
 * @Date         : 2022-11-07 09:40:55
 * @LastEditors  : weihao.xu
 * @LastEditTime : 2023-04-17 14:36:55
 * @FilePath     : \anchorsimulator\JavaScripts\const\Actions.ts
 * @Description  : 修改描述
 */

export namespace Actions {
    /**
     * 任务完成回调
     */
    export const onMainTaskChanged: Action1<number> = new Action1();
    /**
         * 时间变更服务端回调
         */
    export const onTimeChangedS: Action1<{ hour: number, minute: number }> = new Action1();
}