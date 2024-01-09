
import { BagModuleC } from "../../../bag/BagModuleC";
import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

//交互物
@Component
export default class GetItem extends InteractObject {
    @mw.Property({ replicated: true, displayName: "道具ID", group: "属性" })
    public itemID: number = 0

    onStart() {
        this.init(GetItem_S, GetItem_C);
    }
}
//客户端
class GetItem_C extends InteractLogic_C<GetItem> {
    onStart(): void {
    }

    public onPlayerAction(playerId: number, active: boolean, param: any): void {
        if (active) {
            ModuleService.getModule(BagModuleC).addCreationItem(this.info.itemID);
        }
    }
}
//服务端
class GetItem_S extends InteractLogic_S<GetItem> {
    onStart(): void {

    }
    public onPlayerAction(playerId: number, active: boolean): void {

    }

}