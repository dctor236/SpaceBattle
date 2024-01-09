import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
/** 
 * @Author       : 陆江帅
 * @Date         : 2023-03-05 11:03:27
 * @LastEditors  : xianjie.xia
 * @LastEditTime : 2023-06-11 09:46
 * @FilePath     : \magicmanor\JavaScripts\modules\bag\BagModuleC.ts
 * @Description  : 背包客户端模块
 */
import { GameConfig } from "../../config/GameConfig";
import { IItemElement } from "../../config/Item";
import { EventsName, ShowItemType } from "../../const/GameEnum";
import { GlobalData, MyBoolean } from "../../const/GlobalData";
import { CloseAllUI, UIManager } from "../../ExtensionType";
import Tips from "../../ui/commonUI/Tips";
import { BagUtils } from "./BagUtils";
import { BagModuleDataHelper, ItemInfo, ItemType, MoneyType, TagType } from "./BagDataHelper";
import { BagModuleS } from "./BagModuleS";
import { BagHub } from "./ui/BagHub";
import { BagInteraction } from "./ui/BagInteraction";
import { BagPanel } from "./ui/BagPanel";
import { TS3 } from "../../ts3/TS3";
import { GetItem } from "./ui/GetItem";
// import TaskModuleC from "../task/TaskModuleC";
// import { TaskType } from "../task/TaskData";


export class BagModuleC extends ModuleC<BagModuleS, BagModuleDataHelper>{

    private _allItemCfg: Map<number, IItemElement> = new Map();

    public tempItem: { [key: string]: ItemInfo } = {};

    public notifyList: string[] = [];

    /**刷新快捷栏 */
    public readonly onRefreshBar: mw.Action = new mw.Action();

    /**得到赠送回应 */
    public readonly onGiftRespond: mw.Action = new mw.Action();

    /**当前选择的快捷栏物品ID */
    public get curEquip() {
        return this.data.curEquip
    }

    /**
     * 获取金币数量
     */
    public get gold() {
        return this.data.gold;
    }

    /**
     * 获取金月数量
     */
    public get goldenMoon() {
        return this.data.goldenMoon;
    }

    /**
     * 获取银月数量
     */
    public get silverMoon() {
        return this.data.silverMoon;
    }

    /**
     * 获取所有道具
     */
    public get items() {
        return this.data.items
    }

    /**
     * 获取快捷栏插槽物品信息
     */
    public get equipSlots() {
        return this.data.equipSlots
    }

    public isShortCutFull() {
        return this.data.getCurEmptyEquipIndex() == -1
    }

    protected async onStart(): Promise<void> {
        const allItemLst = GameConfig.Item.getAllElement()
        for (const item of allItemLst) {
            this._allItemCfg.set(item.ID, item);
        }
        Event.addLocalListener(EventsName.UseSkill, (configID: number) => {
            if (configID == 0) return;
            this.useItem(configID)
        })
        Event.addLocalListener(EventsName.OpenBagPanel, () => {
            CloseAllUI();
            mw.UIService.show(BagPanel);
        })
    }

    protected onEnterScene(sceneType: number): void {
        mw.UIService.show(BagHub)
        let name = mw.AccountService.getNickName() || "LZZ";
        let gender = "1";
        let player = Player.localPlayer;
        let appearance = player.character;
        if (PlayerManagerExtesion.isNpc(appearance)) {
            let type = appearance.description.advance.base.characterSetting.somatotype;
            if ([mw.SomatotypeV2.AnimeFemale, mw.SomatotypeV2.LowpolyAdultFemale, mw.SomatotypeV2.RealisticAdultFemale].includes(type)) {
                gender = "2";
            }
        }
        this.server.net_Login(name, gender);
        this.getMainItem();
    }

    private async getMainItem() {
        await TS3.userMgr.dataReady()
        const items = TS3.userMgr.getItems()
        if (items) {
            for (const info of items) {
                const config = this._allItemCfg.get(info.id);
                if (!config || info.count < 1)
                    continue;
                this.data.addItem(config, info.count);
            }
        }
    }

    public net_setName(keys: number[], lens: number[], array: string[]): void {
        let key = 0;
        let target = [];
        for (let i = 0; i < keys.length; i++) {
            key = keys[i];
            target = [];
            for (let index = 0; index < lens[i]; index++) {
                target.push(array.shift());
            }
            BagUtils.nameMap.set(key, target);
        }
    }

    /**
     * 给予玩家道具
     * @param playerList 
     */
    public onGive(playerId: number): void {
        const item = this.getCurEquipItem();
        if (item) {
            this.server.net_OnGive(playerId, item.configID);
        }
    }

    /**
     * 被赠送者收到邀请
     * @param playerId 
     * @param itemId 
     */
    public net_OnInvite(playerId: number, itemId: number): void {
        UIManager.show(BagInteraction, playerId, itemId)
    }

    /**
     * 被赠送者回应邀请
     * @param playerId 
     * @param itemId 
     */
    public onAcceptItem(playerId: number, itemId: number) {
        if (!playerId) {
            return
        }
        this.addItem(itemId)
        this.server.net_Accept(playerId, itemId);
    }

    /**
     * 赠送发起者得到回应
     * @param playerId 
     * @param itemId 
     * @returns 
     */
    public net_OnAccept(playerId: number, itemId: number): void {
        if (itemId === 0) {
            Tips.show(BagUtils.getName(playerId) + GameConfig.SquareLanguage.Danmu_Content_1074.Value);
            return;
        } else if (itemId === -1) {
            Tips.show(BagUtils.getName(playerId) + GameConfig.SquareLanguage.Danmu_Content_1074.Value);
            return;
        }
        Tips.show(BagUtils.getName(playerId) + GameConfig.SquareLanguage.Danmu_Content_1073.Value);
        this.useItem(itemId)
        this.removeShortcutBarItem(itemId)
    }

    /**
     * 是否可以往快捷栏增删物品
     * @param is 
     */
    public isCanChangeShortBar() {
        return true
    }

    /**
     * 使用道具时，是否可做其他交互，无互斥返回ture
     * @param configId 
     * @returns 
     */
    public isCanDoElse(configId: number): boolean {
        return true;
    }

    /**设置底部快捷栏显隐 */
    public setHubVis(isVis: boolean) {
        isVis ? UIManager.show(BagHub) : UIManager.hide(BagHub)
    }

    /**
     * 获取当前物品
     * @returns 
     */
    getCurEquipItem(): ItemInfo {
        return this.tempItem[this.curEquip] || this.items[this.curEquip];
    }

    /** 
     * 获取快捷栏物品
     * @param  isDis 是否丢弃空插槽
     * @return 
     */
    public getEquipItems(isDis: boolean = true) {
        const items: ItemInfo[] = []
        for (const id of this.equipSlots) {
            const item = this.tempItem[id] || this.items[id];
            if (isDis && !item) {
                continue;
            }
            items.push(item);
        }
        return items;
    }

    /**
     * 根据标签获取物品
     * @param tag 
     * @returns 
     */
    public getItemsByTag(tag: TagType, isSort: boolean = false) {
        const items: ItemInfo[] = [];
        for (const item of Object.values(this.items)) {
            const config = this._allItemCfg.get(item.configID)
            if (config && config.TagType === tag) {
                items.push(item);
            }
        }
        if (isSort) {
            items.sort((a, b) => {
                const aCfg = this._allItemCfg.get(a.configID)
                const bCfg = this._allItemCfg.get(b.configID)
                return aCfg.Sort - bCfg.Sort
            })
        }
        return items;
    }

    /**
     * 根据类型获取物品
     * @param type 
     */
    public getItemsByType(type: ItemType) {
        const items: ItemInfo[] = [];
        for (const item of Object.values(this.items)) {
            const config = this._allItemCfg.get(item.configID)
            if (config && config.ItemType === type) {
                items.push(item);
            }
        }
        return items;
    }

    /**
     * 添加货币
     * @param count 
     * @returns 
     */
    public addMoney(count: number, type: MoneyType = MoneyType.Gold) {
        if (!count) {
            console.error("addMoney 非法数量：", count);
            return;
        }
        this.server.net_AddMoney(count, type);
        this.data.addMoney(count, type)
    }

    /** 
     * 增加道具经验
     * @param  id
     * @param  count
     * @return 当前经验值
     */
    public addItemExp(id: string, count: number) {
        this.server.net_AddItemExp(id, count);
        const curExp = this.data.addItemExp(id, count);
        return curExp
    }

    /**
     * 获取物品
     * @param id 
     * @returns 
     */
    public getItem(id: string | number) {
        return this.tempItem[id] || this.items[id];
    }

    /** 
     * 添加物品数量
     * @param  id
     * @param  count
     * @return 
     */
    public addItem(id: number, count: number = 1, isBar = true, isSelect: boolean = false) {
        const res = this.net_onAddItem(id, count, isBar, isSelect, false)
        if (res)
            this.server.net_AddItem(id, count, isBar, isSelect);
    }

    public net_onAddItem(id: number, count: number = 1, isBar = true, isSelect: boolean = false, showUI: boolean = false) {
        const config = GameConfig.Item.getElement(id);
        if (!config) {
            return false;
        }
        console.log("addItem: ", id, "数量: ", count);
        const idList = this.data.addItem(config, count);
        // ModuleService.getModule(TaskModuleC).changeTaskData(TaskType.CollectItem, id, count)
        if (showUI) {
            UIManager.hide(GetItem)
            let gitfMap = new Map([[id, count]]);
            mw.UIService.show(GetItem, gitfMap, ShowItemType.Get);
        }
        if (config.isMain) {
            TS3.userMgr.addItem(id, count);
            for (const itemId of idList) {
                if (isBar && config.isShowInBar) {
                    this.addShortcutBarItem(itemId, isSelect)
                }
            }
            return false;
        }
        return true
    }

    /** 
     * 删除道具
     * @param  id
     * @return 
     */
    public deleteItem(id: string) {
        this.server.net_DeleteItem(id);
        this.data.deleteItem(id);
    }

    /**
     * 更新快捷栏 
     * @param  equips
     * @return 
     */
    public refreshShortcutBar(equips: string[]) {
        this.server.net_RefreshShortcutBar(equips);
        this.data.refreshShortcutBar(equips);
    }

    /** 
     * 添加快捷栏物品
     * @param  configID 配置ID
     * @return 
     */
    public addShortcutBarItem(id: string, isSelect: boolean) {
        let index = this.equipSlots.indexOf(id)
        if (index === -1) {
            index = this.equipSlots.indexOf("")
        }
        if (index === -1) {
            Tips.show(GameConfig.SquareLanguage.Danmu_Content_1367.Value);
            return;
        }
        this.server.net_AddShortcutBarItem(id, index);
        this.data.addShortcutBarItem(id, index);
        if (isSelect) {
            this.changEquipItem(id);
        }
        this.onRefreshBar.call()
    }

    /** 
     * 添加造物道具
     * @param  configID
     * @param  count
     * @return 
     */
    public addCreationItem(configID: number, count: number = 1, isSelect = true) {
        const id = configID.toString()
        let index = this.equipSlots.indexOf(id)
        if (index === -1) {
            index = this.equipSlots.indexOf("")
        }
        if (index === -1) {
            Tips.show(GameConfig.SquareLanguage.Danmu_Content_1367.Value);
            return;
        }
        this.server.net_AddShortcutBarItem(id, index);
        this.data.addShortcutBarItem(id, index);
        /**添加造物道具，不存储数据 */
        const item = this.tempItem[id];
        const config = this._allItemCfg.get(configID)
        let orgNum = 0;
        if (item) {
            orgNum = item.count;
        }
        const num = count + orgNum > config.MaxCount ? config.MaxCount : count + orgNum;
        const tempItem: ItemInfo = new ItemInfo()
        tempItem.id = id
        tempItem.configID = configID
        tempItem.count = num
        this.tempItem[id] = tempItem;
        if (isSelect) {
            this.changEquipItem(id);
        }
        this.onRefreshBar.call();
        // ModuleService.getModule(TaskModuleC).changeTaskData(TaskType.CollectItem, configID, count)
    }

    public net_AddShortcutBarItem(id: string, isSelect: boolean) {
        this.addShortcutBarItem(id, isSelect)
    }

    /**
     * 移除快捷栏物品(造物道具)
     * @param id 
     */
    public removeShortcutBarItem(id: string | number) {
        if (typeof id === "number") {
            id = id.toString()
        }
        const item = this.tempItem[id];
        if (item) {
            const bagMc = ModuleService.getModule(BagModuleC)
            const index = bagMc.equipSlots.indexOf(item.id)
            if (Math.floor(item.configID / 10) >= 30 && Math.floor(item.configID / 10) < 40) {
                Event.dispatchToLocal('DisposeItem', item.id, index)
                if (this.curEquip == item.id)
                    Event.dispatchToLocal(EventsName.SelectGood, '0', false)
            }
        }
        this.server.net_RemoveShortcutBarItem(id);
        this.data.removeShortcutBarItem(id);
        /**删除造物道具 */
        if (item) {
            delete this.tempItem[id];
        }
        this.onRefreshBar.call()
    }

    /**
     * 清空快捷栏
     * @returns 
     */
    public clearShortCutBar() {
        Event.dispatchToLocal(EventsName.SelectGood, '0', false)
        for (const key in this.tempItem) {
            if (Object.prototype.hasOwnProperty.call(this.tempItem, key)) {
                const element = this.tempItem[key];
                const bagMc = ModuleService.getModule(BagModuleC)
                Event.dispatchToLocal('DisposeItem', key, bagMc.equipSlots.indexOf(key))
            }
        }
        this.server.net_ClearShortCutBar();
        this.data.clearShortCutBar();
        this.tempItem = {};
        this.onRefreshBar.call()
    }

    public useItem(configID: number, count: number = 1) {
        const config = this._allItemCfg.get(configID);
        const item = this.getItem(configID)
        if (!item) {
            console.error("背包没有此物品:" + configID);
            return;
        }
        if (config.isMain) {
            TS3.userMgr.costItem(configID, count);
        }
        if (config.ItemType !== ItemType.Wand && this.tempItem[item.id]) {
            this.useTempItem(item.id, count);
        } else if (config.ItemType === ItemType.Tool) {
            this.useDurabilityItem(item.id);
        } else if ([ItemType.Consumable, ItemType.Material].includes(config.ItemType)) {
            this.useConsumeItem(item.id, count);
        } else if ([ItemType.LiYue, ItemType.Sundries].includes(config.ItemType)) {
            this.useSquareItem(config.Resource, count)
        }
    }

    /** 
     * 使用消耗类道具
     * @param  id
     * @param  count
     * @return 
     */
    public useConsumeItem(id: string, count: number = 1) {
        this.server.net_UseItem(id, count);
        const num = this.data.useItem(id, count)
        this.onRefreshBar.call()
        return num
    }

    /** 
     * 使用耐久道具
     * @param  id
     * @return 
     */
    public useDurabilityItem(id: string) {
        const item = this.items[id]
        this.server.net_UseDurabilityItem(id, item.configID);
        let num = 0;
        const reduce = this._allItemCfg.get(item.configID).Reduce;
        num = this.data.useDurabilityItem(id, reduce);
        this.onRefreshBar.call()
        return num
    }

    /** 
     * 使用造物道具
     * @param  id
     * @param  count
     * @return 
     */
    public useTempItem(id: string, count: number = 0) {
        const item = this.tempItem[id];
        let num = -1;
        if (item) {
            if (count == 0)
                count = item.count
            num = item.count -= count;
            if (num <= 0) {
                this.removeShortcutBarItem(id)
            } else {
                this.onRefreshBar.call()
            }
        } else {
            console.error("快捷栏没有此造物道具:", id);
        }
        return num
    }

    /**
     * 使用广场道具
     * @param propId 
     */
    public useSquareItem(propId: number, count: number = 1) {
        const info = GameConfig.PropAction.getElement(propId)
        if (!info || !MyBoolean(info.isReduce)) {
            return
        }
        const id = info.ItemID.toString();
        if (this.tempItem[id]) {
            this.useTempItem(id, count);
            return
        }
        if (this.items[id]) {
            this.useConsumeItem(id, count);
            return
        }
    }

    /** 
     * 更换选中快捷栏物品
     * @param  id
     * @return 
     */
    public changEquipItem(id: string, isRefresh: boolean = false) {
        this.data.changEquipItem(id)
        this.server.net_ChangEquipItem(id);
        if (StringUtil.isEmpty(id)) {
            Event.dispatchToLocal(EventsName.SelectGood, '0', false)
        } else {

        }
        if (isRefresh) {
            this.onRefreshBar.call()
        }
    }

    // public addSquareItem(id: number) {
    //     this.server.net_AddSquareItem(id);
    //     this.data.addSquareItem(id);
    // }

    public getTagTypeName(type: TagType): string {
        let name: string = "";
        switch (type) {
            case TagType.Normal:
                name = "普通";
                break;
            case TagType.Magic:
                name = "魔法";
                break;
            case TagType.Tarot:
                name = "圣物";
                break;
            case TagType.Ticket:
                name = "票券";
                break;
            case TagType.Action:
                name = "动作";
                break;
            // case TagType.Chip:
            //     name = "碎片";
            //     break;
            default:
                break;
        }
        return name;
    }

    /**获取物品tag
     * @param id 物品id
     */
    public getItemTag(id: number): TagType {
        const config = this._allItemCfg.get(id)
        if (!config) {
            return;
        }
        return config.TagType

    }
}