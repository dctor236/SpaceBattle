/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-27 20:36:56
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-27 21:23:19
 * @FilePath: \vine-valley\JavaScripts\const\GameEnum.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 轴类型
export enum Axis {
	X = 0,
	Y,
	Z,
}




export enum EventsName {
	/**减少道具 */
	ReduceItem = "ReduceItem",

	/**使用造物技能 */
	CreationSkills = "CreationSkills",
	/**造物课生成雕像 */
	CreateStatue = "CreateStatue",
	/**造物课正确 */
	CreateRight = "CreateRight",
	FightGameGetScore = "FightGameGetScore",
	/**战斗对象复活 */
	EntityRevival = "MonsterRevival",
	/**装备道具 */
	EquipProp = "EquipProp",
	/**加载道具 */
	LoadProp = "LoadProp",
	/**卸载道具 */
	UnloadProp = "UnloadProp",
	/**使用技能 */
	UseSkill = "UseSkill",
	/**使用技能 */
	RemoveSkill = "RemoveSkill",
	/**使用技能 */
	OutStartSkill = "OutStartSkill",
	/**选中物品 */
	SelectGood = "SelectGood",
	/**战斗区域改变 */
	FightAreaChange = "FightAreaChange",
	/**玩家对象初始化完成 */
	PlayerFightInit = "PlayerFightInit",
	/**属性变化 */
	HpChangeShowFly = "HpChangeShowFly",
	/**自己的属性变化 */
	AttributeChange = "AttributeChange",
	MyPlayerAttributeChange = "MyPlayerAttributeChange",
	/**添加buff */
	BuffApply = "BuffApply",
	/**战斗对象死亡 */
	FightEntityDeath = "FightEntityDeath",

	/**刷新房间ui */
	RefreshHouseInfo = "RefreshHouseInfo",
	/** 换装界面金币数量改变 */
	FACAD_GOLD_CHANGE = "FACAD_GOLD_CHANGE",
	/**战斗课程 */
	FightCourse = "FightCourse",
	/**战斗课程结束 */
	FightCourseEnd = "FightCourseEnd",
	/**宿舍认领木牌3dUI是否可以交互 */
	Dorm3DUIInterect = "Dorm3DUIInterect",
	/**开始舞会 */
	StartParty = "StartParty",
	/**取消玩家交互 */
	CancelActive = "CancelActive",
	/**埋点事件 */
	NetMsg_MGSMsg_Send = "NET_MSG_SEND_MGS",
	SkyNpcVisibility = "SkyNpcVisibility",
	/**打开背包 */
	OpenBagPanel = "OpenBagPanel",
	/** 刷新每秒增加跳跃高度 */
	REFRESH_PRE_SECOND_HEIGHT = "REFRESH_PRE_SECOND_HEIGHT",
	/** 刷新当前最大跳跃高度 */
	REFRESH_CURRENT_MAX_HEIGHT = "REFRESH_CURRENT_HEIGHT",
	/** 玩家跳跃 */
	PLAYER_JUMP = "PLAYER_JUMP",
	/** 事件开始 */
	EventsBegin = "EventsBegin",
	/** 事件结束 */
	EventsEnd = "EventsEnd",
	/** 跳跃里程碑重置 */
	REFRESH_MILESTONE = "REFRESH_MILESTONE",
	/**更新交互物位置 */
	FreshLocation = "FreshLocation",
	/** 刷新Star进度 */
	REFRESH_STAR_PRORESS = "REFRESH_STAR_PRORESS",
	/** 获得星星 */
	GET_STAR = "GET_STAR",
	/** 显示星星 */
	SHOW_STAR = "SHOW_STAR",
	/** 礼包节点按钮点击 */
	GIFTNODE_CLICK = "GIFTNODE_CLICK",
	/** 礼包物品按钮点击 */
	GIFTITEM_CLICK = "GIFTITEM_CLICK",
	/** 礼包领取 */
	GET_GIFT = "GET_GIFT",
	/**玩家进入推出飞行姿态 */
	PLAYER_FLY = "PLAYER_FLY",
	/**玩家设置状态 */
	PLAYER_STATE = "PLAYER_STATE",
	/** 刷新GetItem的描述 */
	REFRESH_GETITEM = "REFRESH_GETITEM",
	MonsterDead = "MonsterDead",
	RemoveEntity = "RemoveEntity",
	SilverCoinAtNight = "SilverCoinAtNight",
	ComboChange = "ComboChange",
	RemoveNightEntity = "RemoveNightEntity",
	FightCourseExit = "FightCourseExit",
	AddNightEntity = "AddNightEntity",
	AddCoin = "AddCoin",
	/**自习课坐到椅子上 */
	StudyHallSit = "StudyHallSit",
	/**自习课开始 */
	StudyHallStart = "StudyHallStart",
	/**自习课退出 */
	StudyHallExit = "StudyHallExit",
	/**自习课结束 */
	StudyHallEnd = "StudyHallExit",
	/**完成任务 */
	DoneTask = 'DoneTask',
	/**刷新任务 */
	RefreshTask = 'RefreshTask',
	/**改变任务对话状态 */
	RefreshNpcTalk = 'RefreshNpcTalk',
	/**改变任务对话状态 */
	SetTaskTalkState = 'SetTaskTalkState',
	/**出现npc举起按钮 */
	ShowNpcInterect = 'ShowNpcInterect',
	ChangeClothPart = 'ChangeCloth',
	/**是否显示引导 */
	ShowGuide = "ShowGuid",
	/**解除所有跟随npc */
	UnFollowNpc = 'UnFollowNpc',
	/**显示屏幕特效并且加速 */
	ShowScreenEff = 'ShowScreenEff',
	/**技能预判 */
	SkillPredict = 'SkillPredict',
	/**中断预判 */
	InvokePredict = 'InvokePredict',
	ClearBuff = 'ClearBuff',
	PlayerBattle = 'PlayerBattle',
	TransformToPanda = 'TransformToPanda',
	/**点击对话事件 */
	ClickGuidButton = 'ClickGuidButton',
	OnPlayerHpChange = 'OnPlayerHpChange',
	ControlDragonEffList = 'ControlDragonEffList',
	PlayerDead = 'PlayerDead',
	PlayerAtk = 'PlayerAtk'
}
/**
 * 角色状态
 */
export enum PlayerStateType {
	Interaction = 1,//和交互物交互
	DoublePeopleAction = 2,//双人动作
	Fly,//飞行
}


export enum TrrigerType {
	None = "0",
	Distance = "1",

	BoxTrigger = "2",

	SphereTrigger = "3",
}

/** 显示GiftItem 的类型 */
export enum ShowItemType {
	None = "None",
	/** 礼包界面 */
	Gift = "Gift",
	/** 获得物品界面 */
	Get = "Get",
	Cloth = 'Cloth'
}
export enum SkillState {
	Disable = -2,
	Hide = -1,
	Enable = 0,
	State1 = 1,
	State2 = 2,
	Creation = 15,
	Relation = 16,
	Designation = 17,
	Using = 20,
}


/**任务状态 */
export enum EmTaskState {
	/**未接取 */
	NoFetch,
	/**未激活 */
	NoAccept = 1,
	/**正在做 */
	Doing = 2,
	/**任务完成 */
	Finish = 3
}

/**任务类型 */
export enum EmTaskType {
	None,
	/**到达指定地点 */
	Pos,
	/**换装 */
	Dress,
	/**乘坐 */
	SitMount,
	/**与NPC玩耍*/
	PlayNPC,
	/**失物招领 */
	Lost,
	/**巨龙 */
	Dragon
}

/**任务奖励类型 */
export enum TaskRewardItemType {
	Gold
}

export enum EClothPart {
	Head,
	Jacket,
	Underwear,
	Gloves,
	Shoes,
	FrontHair,
	BackHair
}