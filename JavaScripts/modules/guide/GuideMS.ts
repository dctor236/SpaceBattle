import Move from "../../SceneScript/Move";
import GuideMC from "./GuideMC";

export default class GuideMS extends ModuleS<GuideMC, null> {
    protected onStart(): void {

    }

    protected onUpdate(dt: number): void {

    }

    public startGuide(id: number, p: mw.Player = null) {
        if (!p)
            this.getAllClient().net_onStartGuide(id)
        else
            this.getClient(p).net_onStartGuide(id)
    }

    protected onDestroy(): void {

    }
}