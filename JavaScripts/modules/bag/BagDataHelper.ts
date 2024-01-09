/**
 * @Author       : 陆江帅
 * @Date         : 2023-03-05 11:03:27
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-04-28 13:21:55
 * @FilePath     : \mollywoodschool\JavaScripts\modules\Bag\BagDataHelper.ts
 * @Description  : 背包数据模块
 */

import { GameConfig } from "../../config/GameConfig";
import { IItemElement } from "../../config/Item";
import { GlobalData } from "../../const/GlobalData";
import { SnowflakeIdGenerate } from "../../utils/SnowflakeIdGenerate";

export enum MoneyType {
	/**金币 */
	Gold = 1,
	/**银币 */
	Silver = 2,
	/**月亮币 */
	Moon = 3,
}

export enum TagType {
	/**广场道具 */
	Normal = 1,
	/**魔法类 */
	Magic = 2,
	/**塔罗牌 */
	Tarot = 3,
	/**门票 */
	Ticket = 4,
	/**动作 */
	Action = 5
}

export enum ItemType {
	/**魔杖 */
	Wand = 1,
	/**工具 */
	Tool = 2,
	/**消耗品 */
	Consumable = 3,
	/**材料 */
	Material = 4,
	/**狸月 */
	LiYue = 5,
	/**杂物 */
	Sundries = 6,
	/**契约之戒 */
	Ring = 7,
	/** 货币 */
	Money = 99,
}

@Serializable
export class ItemInfo {
	/**唯一ID */
	@mw.Property()
	public id: string;
	/**配置ID */
	@mw.Property()
	public configID: number;
	/**道具数量 */
	@mw.Property()
	public count: number;
	/**当前经验值 */
	@mw.Property()
	public curExp?: number;
	/**当前耐久度 */
	@mw.Property()
	public curDurability?: number;
}

export class BagModuleDataHelper extends Subdata {
	/** 金币 */
	@Decorator.persistence()
	public gold: number;
	/** 金月 */
	@Decorator.persistence()
	public goldenMoon: number;
	/** 银月 */
	@Decorator.persistence()
	public silverMoon: number;
	/**物品 */
	@Decorator.persistence()
	public items: { [key: string]: ItemInfo };
	/**快捷栏插槽 */
	@Decorator.persistence()
	public equipSlots: string[];
	/**当前选择的快捷栏物品ID */
	@Decorator.persistence()
	public curEquip: string;

	public readonly onSilverCoinChange: mw.Action1<number> = new mw.Action1();

	public readonly onGoldCoinChange: mw.Action1<number> = new mw.Action1();

	protected get version() {
		return 1;
	}

	get dataName() {
		return '_BagModuleDataHelper'
	}

	protected initDefaultData(): void {
		this.gold = 0;
		this.goldenMoon = 0;
		this.silverMoon = 0;
		this.items = {};
		this.equipSlots = new Array(GlobalData.maxShortcutBar).fill("");
		this.curEquip = "";
		this.save(false);
	}

	protected onDataInit(): void {
		this.equipSlots = new Array(GlobalData.maxShortcutBar).fill("");
		this.curEquip = "";
		if (!this.items) {
			this.items = {};
		}
		const allItemLst = GameConfig.Item.getAllElement();
		for (const item of allItemLst) {
			if (item.DefaultCount && !this.items[item.ID]) {
				this.addItem(item, item.DefaultCount);
			}
		}
		this.toTargetVersion();
	}

	protected toTargetVersion() {
		if (this.currentVersion === this.version) return;
		console.log(`update version: ${this.currentVersion} to version: ${this.version}`);
		switch (this.currentVersion) {
			case 1:
				break;
			case 2:
				break;
			default:
				break;
		}
		this.currentVersion = this.version;
		this.save(false);
	}

	/**
	 * 添加货币
	 * @param count
	 * @returns
	 */
	public addMoney(count: number, type: MoneyType) {
		if (type === MoneyType.Gold) {
			this.gold = this.gold + count < 0 ? 0 : this.gold + count;
		} else if (type === MoneyType.Silver) {
			this.goldenMoon = this.goldenMoon + count < 0 ? 0 : this.goldenMoon + count;
		} else if (type === MoneyType.Moon) {
			this.silverMoon = this.silverMoon + count < 0 ? 0 : this.silverMoon + count;
		}
		this.save(false);
	}

	/**
	 * 增加道具经验
	 * @param  id
	 * @param  count
	 * @return 当前经验值
	 */
	public addItemExp(id: string, count: number) {
		const item = this.items[id];
		let curExp = 0;
		if (item) {
			curExp = item.curExp ? (item.count += count) : 0;
		} else {
			console.error("背包没有此道具:", id);
		}
		this.save(false);
		return curExp;
	}

	/**
	 * 添加物品
	 * @param  id
	 * @param  count
	 * @return
	 */
	public addItem(config: IItemElement, count: number) {
		let idList: string[] = []
		if (config.ItemType === ItemType.Tool) {
			for (let i = 0; i < count; i++) {
				const uid = SnowflakeIdGenerate.instance.nextId();
				const item = this.spawnItem(uid, config)
				item.count = 1;
				this.items[uid] = item;
				idList.push(uid);
			}
		} else {
			const uid = config.ID.toString();
			let orgNum = 0;
			if (this.items[uid]) {
				orgNum = this.items[uid].count;
			}
			let num = count + orgNum
			if (num > config.MaxCount) {
				num = config.MaxCount
			}
			const item = this.spawnItem(uid, config)
			item.count = num;
			this.items[uid] = item;
			idList.push(uid)
		}
		this.save(false);
		return idList;
	}

	private spawnItem(id: string, config: IItemElement) {
		const item: ItemInfo = new ItemInfo()
		item.id = "" + id
		item.configID = config.ID
		item.count = 0
		config.MaxExp && (item.curExp = 0);
		config.Durability && (item.curDurability = config.Durability);
		return item;
	}

	/**
	 * 删除道具
	 * @param  id
	 * @return
	 */
	public deleteItem(id: string) {
		this.removeShortcutBarItem(id);
		delete this.items[id];
		this.save(false);
		return this.items;
	}

	public refreshShortcutBar(equips: string[]) {
		this.equipSlots = equips;
		if (this.curEquip && !this.equipSlots.includes(this.curEquip)) {
			this.curEquip = "";
		}
		this.save(false);
	}

	/**
	 * 添加快捷栏物品
	 * @param id
	 * @param type
	 * @returns
	 */
	public addShortcutBarItem(id: string, index: number) {
		this.equipSlots[index] = id;
		this.save(false);
	}

	/**
	 * 减少快捷栏物品
	 * @param id
	 */
	public removeShortcutBarItem(id: string) {
		const index = this.equipSlots.findIndex(v => v === id);
		if (index !== -1) {
			this.equipSlots[index] = "";
		}
		if (this.curEquip === id) {
			this.curEquip = "";
		}
		this.save(false);
	}

	/**
	 * 清空快捷栏
	 * @returns
	 */
	public clearShortCutBar() {
		for (let index = 0; index < this.equipSlots.length; index++) {
			this.equipSlots[index] = "";
		}
		this.curEquip = "";
		this.save(false);
	}

	/**
	 * 使用道具
	 * @param  id
	 * @param  count
	 * @return
	 */
	public useItem(id: string, count: number) {
		const item = this.items[id];
		let num = 0;
		if (item) {
			num = item.count -= count;
			num <= 0 && this.deleteItem(id);
		} else {
			console.error("没有此道具物品:", id);
		}
		this.save(false);
		return num;
	}

	/**
	 * 使用耐久道具
	 * @param  id
	 * @return
	 */
	public useDurabilityItem(id: string, reduce: number) {
		const item = this.items[id];
		let curDurability = 0;
		if (item) {
			curDurability = item.curDurability ? (item.curDurability -= reduce) : 0;
			curDurability <= 0 && this.deleteItem(id);
		} else {
			console.error("没有此耐久物品:", id);
		}
		this.save(false);
		return curDurability;
	}

	/**
	 * 更换选中快捷栏物品
	 * @param  id
	 * @return
	 */
	public changEquipItem(id: string) {
		if (id && !this.equipSlots.includes(id)) {
			console.error("快捷栏没有此物品", id);
			return;
		}
		this.curEquip = id;
		console.log("更换选中快捷栏物品", this.curEquip);
		this.save(false);
	}

	/**
	 * 找到当前空着的快捷栏位置
	 */
	public getCurEmptyEquipIndex() {
		const res = this.equipSlots.findIndex(v => v === "");
		return res;
	}

}
