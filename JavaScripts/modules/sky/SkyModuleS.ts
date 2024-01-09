

import { GlobalData } from "../../const/GlobalData";
import SkyModuleC from "./SkyModuleC";

export default class SkyModuleS extends ModuleS<SkyModuleC, null>{
    protected onStart(): void {
    }

    protected onUpdate(dt: number): void {

    }
    public changeAllSky(id: number) {
        let res = id == 2 ? true : false
        this.getAllClient().net_changeSky(id, res)
    }

    protected onPlayerEnterGame(player: mw.Player): void {
        // if (GlobalData.isDragon) {
        //     this.getClient(player).net_changeSky(2, GlobalData.isDragon)
        // } else {
        //     this.getClient(player).net_changeSky(5, GlobalData.isDragon)
        // }
    }

}
