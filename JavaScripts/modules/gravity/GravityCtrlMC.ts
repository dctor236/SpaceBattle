import { GlobalData } from "../../const/GlobalData";
import GameUtils from "../../utils/GameUtils";
import { BagModuleC } from "../bag/BagModuleC";
import GravityCtrlMgr from "./GravityCtrlMgr";
import GravityCtrlMS from "./GravityCtrlMS";

export default class GravityCtrlMC extends ModuleC<GravityCtrlMS, null> {

    protected onStart(): void {
        GravityCtrlMgr.instance.init()
    }


    protected onUpdate(dt: number): void {

    }

    protected onDestroy(): void {

    }

    protected onEnterScene(sceneType: number): void {
        // setTimeout(async () => {
        //     const curSel = Number(ModuleService.getModule(BagModuleC).curEquip)
        //     if (!GlobalData.inSpaceStation && !GlobalData.inPlanetSurface && Math.floor(curSel / 10) != 30)
        //         GravityCtrlMgr.instance.simulate(true, Player.localPlayer.playerId)
        // }, 6000);
    }

    net_onAsyncData(guid: string[]) {
        GravityCtrlMgr.instance.asyncCubes(guid)
    }
}