/** 
 * @Author       : 陆江帅
 * @Date         : 2023-03-05 11:03:27
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-06-01 13:26:13
 * @FilePath     : \magicmanor\JavaScripts\modules\bag\BagModuleS.ts
 * @Description  : 背包服务端模块
 */
import { GameConfig } from "../../config/GameConfig";
import { IItemElement } from "../../config/Item";
import { BagUtils } from "./BagUtils";
import { BagModuleDataHelper, ItemInfo, ItemType, MoneyType } from "./BagDataHelper";
import { BagModuleC } from "./BagModuleC";

export class BagModuleS extends ModuleS<BagModuleC, BagModuleDataHelper>{

    private _allItemCfg: Map<number, IItemElement> = new Map();

    protected onStart(): void {
        GameConfig.Item.getAllElement().forEach(item => {
            this._allItemCfg.set(item.ID, item);
        })
    }

    public net_Login(name: string, gender: string) {
        let player = this.currentPlayer;
        BagUtils.nameMap.set(player.playerId, [name, gender]);
        let keys: number[] = [];
        let lens: number[] = [];
        let array: string[] = [];
        for (let [key, value] of BagUtils.nameMap) {
            keys.push(key);
            lens.push(value.length);
            array = array.concat(value);
        }
        this.getAllClient().net_setName(keys, lens, array);
    }


    public net_OnGive(playerId: number, itemId: number): void {
        this.getClient(playerId).net_OnInvite(this.currentPlayerId, itemId);
    }

    public net_Accept(playerId: number, itemId: number): void {
        this.getClient(playerId).net_OnAccept(this.currentPlayerId, itemId);
    }

    /**
     * 使用道具时，是否可做其他交互，无互斥返回true
     * @param configId 
     * @param playerId 
     * @returns 
     */
    public isCanDoElse(configId: number, playerId: number): boolean {
        return true;
    }

    /**
     * 添加货币
     * @param count 
     * @returns 
     */
    public net_AddMoney(count: number, type: MoneyType, player?: mw.Player) {
        this.getPlayerData(player).addMoney(count, type);
    }

    /** 
     * 增加道具经验
     * @param  id
     * @param  count
     * @param  player
     * @return 
     */
    public net_AddItemExp(id: string, count: number, player?: mw.Player) {
        if (!player) {
            player = this.currentPlayer
        }
        this.getPlayerData(player).addItemExp(id, count);
    }

    /** 
     * 添加物品数量
     * @param  id
     * @param  count
     * @param  player
     * @return 
     */
    public net_AddItem(id: number, count: number, isBar: boolean, isSelect: boolean, player?: mw.Player) {
        if (!player) {
            player = this.currentPlayer
        }
        this.addItem(id, count, isBar, isSelect, player);
    }

    /** 
     * 添加物品
     * @param  id      配置ID
     * @param  count   数量
     * @param  isBar   是否加入快捷栏，还需要配置表里isShowInBar为true值
     * @param  player  
     * @return 
     */
    public addItem(id: number, count: number, isBar: boolean, isSelect: boolean, player: mw.Player, callBack: boolean = false) {
        const config = this._allItemCfg.get(id);
        const data = this.getPlayerData(player)
        if (!config) {
            console.error("配置表中没有此物品", id);
            return;
        }
        const isList = data.addItem(config, count);
        for (const itemId of isList) {
            if (isBar && config.isShowInBar) {
                this.addShortcutBarItem(itemId, isSelect, player)
            }
        }
        if (callBack) {
            this.getClient(player).net_onAddItem(id, count, isBar, isSelect, true)
        }
    }

    /** 
     * 删除道具
     * @param  id
     * @param  player
     * @return 
     */
    public net_DeleteItem(id: string, player?: mw.Player) {
        if (!player) {
            player = this.currentPlayer
        }
        this.getPlayerData(player).deleteItem(id);
    }

    public net_RefreshShortcutBar(equips: string[], player?: mw.Player) {
        if (!player) {
            player = this.currentPlayer
        }
        this.getPlayerData(player).refreshShortcutBar(equips);
    }

    /**
     * 添加快捷栏物品
     * @param id 
     * @param type 
     * @param player 
     * @returns 
     */
    public net_AddShortcutBarItem(id: string, index: number, player?: mw.Player) {
        if (!player) {
            player = this.currentPlayer
        }
        this.getPlayerData(player).addShortcutBarItem(id, index);
    }

    /** 
     * 将物品放入快捷栏
     * @param  id
     * @param  player
     * @return 
     */
    public addShortcutBarItem(id: string, isSelect: boolean, player: mw.Player) {
        this.getClient(player).net_AddShortcutBarItem(id, isSelect)
    }

    /**
     * 减少快捷栏物品
     * @param id 
     * @param player 
     * @returns 
     */
    public net_RemoveShortcutBarItem(id: string, player?: mw.Player) {
        if (!player) {
            player = this.currentPlayer
        }
        this.getPlayerData(player).removeShortcutBarItem(id);
    }

    /**
     * 清空快捷栏
     * @param player 
     * @returns 
     */
    public net_ClearShortCutBar(player?: mw.Player) {
        if (!player) {
            player = this.currentPlayer
        }
        this.getPlayerData(player).clearShortCutBar()
        return true;
    }

    /** 
     * 使用道具
     * @param  id
     * @param  count
     * @return 
     */
    public net_UseItem(id: string, count: number, player?: mw.Player) {
        if (!player) {
            player = this.currentPlayer
        }
        this.getPlayerData(player).useItem(id, count)
    }

    /** 
     * 使用耐久道具
     * @param  id
     * @return 
     */
    public net_UseDurabilityItem(id: string, configID: number, player?: mw.Player) {
        if (!player) {
            player = this.currentPlayer
        }
        const reduce = this._allItemCfg.get(configID).Reduce;
        this.getPlayerData(player).useDurabilityItem(id, reduce);
        return true
    }

    /** 
     * 更换选中快捷栏物品
     * @param  id
     * @return 
     */
    public net_ChangEquipItem(id: string, player?: mw.Player) {
        if (!player) {
            player = this.currentPlayer
        }
        this.getPlayerData(player).changEquipItem(id);
        return true
    }

    public getPlayeCurEquip(pid: number) {
        this.getPlayerData(pid).curEquip
    }

    public getPlayeCurEquipList(pid: mw.Player) {
        return this.getPlayerData(pid)
    }
}