/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-08-11 20:46:49
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-08-12 10:25:09
 * @FilePath: \mollywoodschool\JavaScripts\modules\gravity\GravityCtrlMS.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import GravityCtrlMC from "./GravityCtrlMC";
import GravityCtrlMgr from "./GravityCtrlMgr";

export default class GravityCtrlMS extends ModuleS<GravityCtrlMC, null> {


    ranJumperInteval = null
    protected onStart(): void {
        GravityCtrlMgr.instance.init()
        GravityCtrlMgr.instance.onStateCB.add(() => {
            this.asyncData()
        })
        // this.ranJumperInteval = setInterval(() => {
        //     this.randomJump()
        // }, 5 * 1000);

        setTimeout(() => {
            setInterval(() => {
                GravityCtrlMgr.instance.update()
            }, 100)
        }, 6 * 1000);
    }

    jumpInteval = null
    jumpCount: number = 0

    protected onPlayerEnterGame(player: mw.Player): void {

    }

    protected onUpdate(dt: number): void {
    }

    protected onDestroy(): void {

    }

    asyncData() {
        this.getAllClient().net_onAsyncData(GravityCtrlMgr.instance.getCubsGuids())
    }
}