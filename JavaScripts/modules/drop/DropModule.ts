import { UIManager } from "../../ExtensionType";
import { BagModuleC } from "../bag/BagModuleC";
import { CoinType } from "../shop/ShopData";
import { ERewardType } from "./DropItem";
import DropManager from "./DropMgr";
import NightFind from "./ui/NightFind";


export class DropModuleC extends ModuleC<DropModuleS, null> {

    protected onStart(): void {
        DropManager.getInstance().start();
    }
    protected onEnterScene(sceneType: number): void {
    }
    protected onUpdate(dt: number): void {
        DropManager.getInstance().onUpdate(dt);
    }

    //当前区域创建一个爆金币
    /**
     * 
     * @param pos 位置
     * @param type 奖励类型
     * @param allValue 总奖励数量
     * @param count 出现几次
     */
    creatDrop(pos: mw.Vector, type: ERewardType, allValue: number, count: number) {
        DropManager.getInstance().createDrop(pos, type, allValue, count);
    }

    net_onCreatDrop(pos: mw.Vector, type: ERewardType, allValue: number, count: number) {
        this.creatDrop(pos, type, allValue, count)
        // if (type == ERewardType.RepairBox) {
        //     UIManager.getUI(NightFind).onGetCoin(CoinType.Bill, pos, allValue * count);
        // } else {
        //     ModuleService.getModule(BagModuleC).addCreationItem(140015, 1, false)
        // }
    }

    reqCrearDropAll(pos: mw.Vector, type: ERewardType, allValue: number, count: number) {
        this.server.net_creatDropAll(pos, type, allValue, count)
    }

}

export class DropModuleS extends ModuleS<DropModuleC, null> {
    creatDrop(pos: mw.Vector, type: ERewardType, allValue: number, count: number, player: mw.Player) {
        this.getClient(player).net_onCreatDrop(pos, type, allValue, count)
    }

    creatDropAll(pos: mw.Vector, type: ERewardType, allValue: number, count: number) {
        this.getAllClient().net_onCreatDrop(pos, type, allValue, count)
    }

    net_creatDropAll(pos: mw.Vector, type: ERewardType, allValue: number, count: number) {
        // this.creatDropAll(pos, type, allValue, count)
    }
}