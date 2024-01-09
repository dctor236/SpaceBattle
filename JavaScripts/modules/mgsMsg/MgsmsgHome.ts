import { EventsName } from "../../const/GameEnum";

@Decorator.autoExecute("init")
export abstract class MGSMsgHome {
	private static msgMap: Map<string, MsgClass> = new Map();
	/** 初始化*/
	public static init() {
		if (SystemUtil.isClient()) {
			Event.addServerListener(EventsName.NetMsg_MGSMsg_Send, (eventName: string, eventDesc: string, jsonData: string) => {
				console.warn("统计", eventName, eventDesc, jsonData);
				mw.RoomService.reportLogInfo(eventName, eventDesc, jsonData);
			});
		}
	}

	public static get(eventName: string): MsgClass {
		if (this.msgMap == null) {
			this.msgMap = new Map();
		}
		if (!this.msgMap.has(eventName)) {
			this.msgMap.set(eventName, new MsgClass(eventName));
		}
		return this.msgMap.get(eventName);
	}

	/////////////////////////////////////下面写法比较方便，但每次都会传个新的data体////////////////////////////
	/**
	 * @description: 上传埋点数据
	 * @param {string} key: 事件名
	 * @param {string} des: 事件描述
	 * @param {any} data: 参数域（包含参数名及取值）
	 * @player 在服务端调用时，指定埋点的玩家，如果不写则全房间玩家一起埋
	 * @return {*}
	 */
	public static uploadMGS(key: string, des: string, data: any, player?: mw.Player) {
		const msg = MGSMsgHome.get(key);
		msg.data = data;
		msg.send(des, player);
	}

	/////////////////////////////////////下面写法能稍微省内存/////////////////////////////////////////////////
	/**新手引导埋点 */
	public static setGuideMGS(guide_step: number): void {
		let msg = MGSMsgHome.get("ts_tutorial_step");
		msg.data.guide_step = guide_step;
		msg.send("新手引导埋点");
	}

	/**玩法开始 */
	public static lunchStart(playType: number, area_frequency: number) {
		const msg = MGSMsgHome.get("ts_game_launch_start");
		msg.data.play_type = playType;
		msg.data.ugc_type = area_frequency;
		msg.send("进入场景");
	}

	/**玩法结束 */
	public static lunchEnd(area_id: number, time: number, area_frequency: number): void {
		const msg = MGSMsgHome.get("ts_game_launch_end");
		msg.data.play_type = area_id;
		msg.data.launch_time = time;
		msg.data.end_type = area_frequency;
		msg.send("离开场景");
	}

	// 进入场景
	public static enterAreaTrigger(area_id: number): void {
		const msg = MGSMsgHome.get("ts_area_enter");
		msg.data.area_id = area_id;
		msg.send("进入场景id(根据场景决定)");
	}

	// 离开场景
	public static leaveAreaTrigger(area_id: number, time: number, area_frequency: number): void {
		const msg = MGSMsgHome.get("ts_area_leave");
		msg.data.area_id = area_id;
		msg.data.time = time;
		msg.data.area_frequency = area_frequency;
		msg.send("离开场景id(根据场景决定)");
	}

	/**
	 * 玩家在界面中停留的时间
	 * @param item_id 第一人称1，第三人称2，三脚架3
	 * @param playtime 停留时间
	 */
	public static setStayTime(item_id: number, playtime: number): void {
		const msg = MGSMsgHome.get("ts_action_unlock");
		msg.data = { item_id: item_id, playtime: playtime };
		msg.send("玩家在界面中停留的时间");
	}

	/**玩家点击按钮 */
	public static setBtnClick(infoStr: string): void {
		const msg = MGSMsgHome.get("ts_action_click");
		msg.data.button = infoStr;
		msg.send("玩家点击按钮");
	}

	/**玩家进入小游戏 */
	public static playerPlayGame(player_num: string): void {
		const msg = MGSMsgHome.get("ts_game_start");
		msg.data.player_num = player_num;
		msg.send("玩家进入小游戏");
	}

	/**玩家离开小游戏 */
	public static playerLeaveGame(round_id: string, round_length: number, round_money: number): void {
		const msg = MGSMsgHome.get("ts_game_over");
		msg.data.round_id = round_id;
		msg.data.round_length = round_length;
		msg.data.round_money = round_money;
		msg.send("玩家离开小游戏");
	}

	/**进入界面埋点 */
	public static setPageMGS(name: string, pre_page_name: string = ""): void {
		const msg = MGSMsgHome.get("ts_page");
		msg.data.page_name = name;
		msg.data.pre_page_name = pre_page_name;
		msg.send("进入界面埋点");
	}

	// 点击npc交互
	public static setNpc(interaction_id: number, npc_id: number): void {
		const msg = MGSMsgHome.get("ts_interact_npc");
		msg.data.interaction_id = interaction_id;
		msg.data.npc_id = npc_id;
		msg.send("点击npc交互");
	}

	/**交互事件 */
	public static interactionMSG(name: number, areaId: number): void {
		const msg = MGSMsgHome.get("ts_interaction");
		msg.data.interaction_id = name;
		msg.data.area_id = areaId;
		msg.send("交互事件");
	}

	// 交互物脱离
	public static interactionLeave(interaction_id: number, interaction_time: number): void {
		const msg = MGSMsgHome.get("ts_interaction_leave");
		msg.data.interaction_id = interaction_id;
		msg.data.interaction_time = interaction_time;
		msg.send("交互物脱离");
	}

	/**
	 * 道具埋点
	 * @param propId 道具ID
	 * @param areaId 区域ID
	 */
	public static setItemMSG(propId: number, areaId: number): void {
		const msg = MGSMsgHome.get("ts_action_use_item");
		msg.data.item_id = propId;
		msg.data.area_id = areaId;
		msg.send("道具埋点");
	}

	/**道具装备 */
	public static setItemEquip(item_id: number, area_id: number): void {
		const msg = MGSMsgHome.get("ts_action_equip_item");
		msg.data = { item_id: item_id, area_id: area_id };
		msg.send("道具装备");
	}

	/**道具卸下 */
	public static setItemUnEquip(item_id: number, use_time: number): void {
		const msg = MGSMsgHome.get("ts_action_unload_item");
		msg.data.item_id = item_id;
		msg.data.use_time = use_time;
		msg.send("道具卸下");
	}

	/**动作事件 */
	public static setActionMSG(id: number, areaId: number): void {
		const msg = MGSMsgHome.get("ts_action_do");
		msg.data.movement_id = id;
		msg.data.area_id = areaId;
		msg.send("动作事件");
	}

	public static setNpcGetItem(itemId: number): void {
		const msg = MGSMsgHome.get("ts_itemslot_into");
		msg.data.source_type = itemId;
		msg.send("Npc获取道具");
	}

	/**拾取金币 */
	public static findCoin(type: number, coinNum: number) {
		const msg = MGSMsgHome.get("ts_action_find");
		msg.data.pos_id = coinNum;
		msg.data.item_id = type;
		msg.send("拾取金币,对应的金币数量");
	}

	/**购买商品 */
	public static getShopItem(id: number, player?: mw.Player) {
		const msg = MGSMsgHome.get("ts_action_unlock");
		msg.data = { atlas_id: id };
		msg.send("玩家购买道具id", player);
	}

	/**被怪物抓死 */
	public static monsterDead(id: number, player?: mw.Player) {
		const msg = MGSMsgHome.get("ts_action_dead");
		msg.data.dead = 1;
		msg.data.monster_id = id;
		msg.send("玩家被怪物抓住", player);
	}

	/**玩家聊天  预告*/
	public static playerCommunication(e = "communication") {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = { record: e };
		msg.send("玩家发一句话就打一次||路径查询");
	}

	/**背包物品 点击 */
	public static clickBagItem(id: string) {
		const msg = MGSMsgHome.get("ts_game_over");
		msg.data = { win_camp: id };
		msg.send("背包物品 点击");
	}

	/**快捷栏选中物品 时长 */
	public static selectItemTime(id: number, time: number) {
		const msg = MGSMsgHome.get("ts_action_unload_item");
		msg.data = { item_id: id, use_time: time };
		msg.send("快捷栏选中物品 时长");
	}

	/**背包点击事件 */
	public static bagClickEvent(name: string) {
		// const msg = MGSMsgHome.get("ts_game_result");
		// msg.data = { record: name };
		// msg.send("背包点击事件");
	}

	/**玩家宠物上报 */
	public static recordPet(pet: string) {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = { record: pet };
		msg.send("玩家宠物上报");
	}

	/**使用技能 */
	public static useSkill(id: number) {
		const msg = MGSMsgHome.get("ts_game_over");
		msg.data = { skill_use: id };
		msg.send("使用技能");
	}

	/**
	 * 触发器路径埋点
	 * @param round_length 时长
	 * @param round 轮次
	 * @param value triiger编号
	 */
	public static roadTriggerMsg(round_length: number, round: number, value: number) {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = { round_length: round_length, round: round, value: value };
		msg.send("路径埋点顺序时长编号查询");
	}

	/**
	 * 进入引导的时候在什么时间段
	 * @param id
	 */
	public static guidePeriodTime(id: number) {
		const msg = MGSMsgHome.get("ts_task");
		msg.data = { task_id: id };
		msg.send("新手引导进入时的时间");
	}

	/**
	 * 完成新手引导所需时间
	 * @param id
	 */
	public static guideTime(time: number) {
		const msg = MGSMsgHome.get("ts_achievement");
		msg.data.lifetime = time;
		msg.send("新手引导完成时的时间");
	}

	/**
	 *
	 * @param round_length 1.课程内，2.课程外
	 * @param time 时间
	 */
	public static flyTime(damage: number, time: number) {
		const msg = MGSMsgHome.get("ts_game_over");
		msg.data = { round_length: time, damage: damage };
		msg.send("飞行课状态持续时间");
	}
	/*
	 * 点击快捷栏物品时打点
	 * @param id
	 */
	public static clickBagHub(id: number) {
		const msg = MGSMsgHome.get("ts_action_equip_item");
		msg.data = { item_id: id };
		msg.send("点击快捷栏物品时打点");
	}

	/**
	 * 选择二级UI造物技能时打点
	 * @param id
	 */
	public static createItem(id: number) {
		const msg = MGSMsgHome.get("ts_action_build");
		msg.data.item_id = id;
		msg.send("用造物魔杖造出物品（造物技能的二级界面选择）");
	}

	/**获得物品事件 */
	public static getItem(id: number) {
		const msg = MGSMsgHome.get("ts_item_tips");
		msg.data.item_id = id;
		msg.send("获得物品打点");
	}

	/**鲨鱼入侵事件时长 */
	public static sharkTime(time: number) {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = { record: "sharkzone", round_length: time };
		msg.send("鲨鱼入侵事件时长");
	}

	/**鲨鱼入侵事件时长 */
	public static sharkLifeTime(time: number) {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = { record: "sharktime", round_length: time };
		msg.send("鲨鱼存活时长");
	}

	/**塔罗牌占卜事件 */
	public static tarotDivin(name: string) {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = { record: name };
		msg.send("塔罗牌占卜事件");
	} /**夜晚结束后输出当晚造成伤害 */
	public static nightDamage(damage: number) {
		const msg = MGSMsgHome.get("ts_action_compound");
		msg.data = { item_type: damage };
		msg.send("夜晚结束后输出当晚造成伤害");
	}
	/**夜晚结束后输出当晚获取金币 */
	public static nightCoin(count: number) {
		const msg = MGSMsgHome.get("ts_action_decompose");
		msg.data = { item_type: count };
		msg.send("夜晚结束后输出当晚获取金币");
	}
	/**战斗相关事件 */
	public static fightEvent(name: string) {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = { record: name };
		msg.send("战斗相关");
	}

	/** 收集星星 */
	public static getStar(ID: number) {
		const msg = MGSMsgHome.get("ts_game_result");
		let str = "star" + ID;
		msg.data = { record: str, value: 888 };
		msg.send("收集星星");
	}

	/** 完成星星收集里程碑 */
	public static starMilestone(stage: number, time: number) {
		let msg: MsgClass;
		switch (stage) {
			case 0:
				msg = MGSMsgHome.get("ts_task");
				msg.data = { lifetime: time };
				break;
			case 1:
				msg = MGSMsgHome.get("ts_game_over");
				msg.data = { survive_time: time };
				break;
			case 2:
				msg = MGSMsgHome.get("ts_action_dead");
				msg.data = { lifetime: time };
				break;
			case 3:
				msg = MGSMsgHome.get("ts_action_dead");
				msg.data = { play_time: time };
				break;
			default:
				break;
		}
		msg.send("完成星星收集里程碑" + stage);
	}


	static magicCreditRule(ruleId: number, credit: number) {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = { rite: credit, sos: ruleId };
		msg.send("计分规则埋点");
	}

	static magicCreditAll(name: string, credit: number) {
		const msg = MGSMsgHome.get("ts_action_dead");
		msg.data = { death_type: name, rebirth_num: credit };
		msg.send("事件总分变化埋点");
	}

	/**契约相关打点 */
	public static contractEvent(name: string) {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = { record: name };
		msg.send("契约相关打点");
	}

	/**
	 * 跑酷登顶花费时间
	 * @param time 时间
	 */
	public static obbyTime(time: number) {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = { round_length: time, record: "obbyend_time" };
		msg.send("跑酷登顶花费时间");
	}

	public static triggerEnter(name: string) {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = { record: name };
		msg.send("进入触发器");
	}

	public static triggerLeave(name: string, time: number) {
		const msg = MGSMsgHome.get("ts_game_result");
		msg.data = { record: name, round_length: time };
		msg.send("离开触发器");
	}

	public static studyHall(type: number, value: number | string) {
		let msg: MsgClass;
		switch (type) {
			case 0:
				msg = MGSMsgHome.get("ts_game_over");
				msg.data = { ghost_timeout: value };
				break;
			case 1:
				msg = MGSMsgHome.get("ts_game_result");
				msg.data = { record: value };
				break;
			case 2:
				msg = MGSMsgHome.get("ts_action_click");
				msg.data = { button: value };
				break;

			default:
				break;
		}
		msg.send("自习课相关");
	}


	public static jumpGame(id: number) {
		const msg = MGSMsgHome.get("ts_game_over");
		msg.data = { scene_id: id };
		msg.send("跳游戏");
	}
	public static backGame(id: number) {
		const msg = MGSMsgHome.get("ts_game_over");
		msg.data = { disaster_id: id };
		msg.send("跳游戏");
	}

	//#region 换装埋点
	public static cloth(key: string, value: any) {
		const msg = MGSMsgHome.get("ts_game_over");
		msg.data[key] = value
		msg.send("换装相关埋点");
	}
	//#endregion

}

class MsgClass {
	/**数据体 */
	public data: any;
	public key: string;
	constructor(key: string) {
		this.key = key;
		this.data = {};
	}
	public send(des: string, player?: mw.Player) {
		let jsonData: any = {};
		for (const key in this.data) {
			//潘多拉要求key都要是小写的，value不做要求
			jsonData[key.toLowerCase()] = this.data[key];
		}
		let jsonStr: string = JSON.stringify(jsonData);
		console.warn("统计", this.key, des, jsonStr);
		if (SystemUtil.isClient()) {
			mw.RoomService.reportLogInfo(this.key, des, jsonStr);
		} else {
			if (player == null) {
				Event.dispatchToAllClient(EventsName.NetMsg_MGSMsg_Send, this.key, des, jsonStr);
			} else {
				Event.dispatchToClient(player, EventsName.NetMsg_MGSMsg_Send, this.key, des, jsonStr);
			}
		}
	}
}
