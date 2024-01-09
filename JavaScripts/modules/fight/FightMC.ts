/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-15 20:35:56
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-24 09:16:07
 * @FilePath: \vine-valley\JavaScripts\modules\fight\FightMC.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Tips from "../../ui/commonUI/Tips";
import FightMS from "./FightMS";

export default class FightMC extends ModuleC<FightMS, null> {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        Event.addServerListener("Event_ShowTips", (content: string) => {
            Tips.show(content);
        });
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}