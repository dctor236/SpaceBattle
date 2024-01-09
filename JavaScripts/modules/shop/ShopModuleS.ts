/*
 * @Author: jiezhong.zhang
 * @Date: 2023-06-11 18:45:33
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-06-16 12:27:31
 */
import { GameConfig } from "../../config/GameConfig";
import ShopData, { CoinType } from "./ShopData";
import ShopModuleC from "./ShopModuleC";


export default class ShopModuleS extends ModuleS<ShopModuleC, ShopData>{

    protected onPlayerEnterGame(player: mw.Player): void {
        this.refreshData(player);
    }

    addCoin(type: CoinType, num: number, pid: number, callBack: boolean = false) {
        let player = Player.getPlayer(pid);
        if (!player) return;
        let data = this.getPlayerData(pid)
        data.addCoin(type, num);
        data.save(false);
        if (callBack) {
            this.getClient(pid).net_onAddCoin(type, num, true)
        }
    }

    net_AddCoin(type: CoinType, num: number) {
        this.addCoin(type, num, this.currentPlayerId)
    }

    net_SetCoin(type: CoinType, num: number) {
        switch (type) {
            case CoinType.Bill:
                this.currentData.goldCoin = num
                break
            case CoinType.PeaCoin:
                this.currentData.peaCoin = num
                break
            default: break
        }
        this.currentData.save(false);
    }

    public net_bugGoods(ID: number, count: number) {
        let data = this.currentData;
        data.subCount(ID, count);
    }

    /**
     * 刷新商店数据
     * @param player 玩家
     */
    public refreshData(player: mw.Player) {
        let data = this.getPlayerData(player);
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth()
        let year = date.getFullYear()
        this.checkShopData(player);
        if (data && day === data.refreshDate[0] && month === data.refreshDate[1] && year === data.refreshDate[2]) {
            return;
        }

        data.refreshDate = [day, month, year];
        let all = GameConfig.Shop.getAllElement();
        all = all.filter(cfg => {
            if (cfg.limitCount > 1 || cfg.refreshDay > 0) {
                return true;
            }
            return false;
        })

        all.forEach(cfg => {
            let curCount = data.getItemCount(cfg.id);
            if (cfg.refreshDay == 1 && curCount !== cfg.limitCount) {
                data.setItemCount(cfg.id, cfg.limitCount);
            }
        })
        data.save(true);
    }

    /**
     * 检查玩家商店数据
     * @param player 玩家
     */
    private checkShopData(player: mw.Player) {
        let data = this.getPlayerData(player);
        let all = GameConfig.Shop.getAllElement();
        all = all.filter(cfg => {
            if (cfg.limitCount > 1 || cfg.refreshDay > 0) {
                return true;
            }
            return false;
        })
        all.forEach((cfg) => {
            let curCount = data.getItemCount(cfg.id);
            if (curCount <= -99) {
                data.setItemCount(cfg.id, cfg.limitCount);
            }
        })
    }
}