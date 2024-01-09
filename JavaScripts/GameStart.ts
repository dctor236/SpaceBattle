import { GameConfig } from "./config/GameConfig";
import { GlobalData } from "./const/GlobalData";
import { setMyCharacterGuid, setMyPlayerID } from "./ExtensionType";
import { LogManager } from "./LogManager";
import { BagModuleDataHelper } from "./modules/bag/BagDataHelper";
import { BagModuleC } from "./modules/bag/BagModuleC";
import { BagModuleS } from "./modules/bag/BagModuleS";
import { CameraModuleC, CameraModuleS } from "./modules/camera/CameraModule";
import { Chat_Client, Chat_Server } from "./modules/chat/Chat";
import { GameModuleData } from "./modules/gameModule/GameData";
import { GameModuleC } from "./modules/gameModule/GameModuleC";
import { GameModuleS } from "./modules/gameModule/GameModuleS";
import { InteractModuleClient } from "./modules/interactModule/InteractModuleClient";
import { InteractModuleServer } from "./modules/interactModule/InteractModuleServer";
import { PlayerMgsModuleData } from "./modules/mgsMsg/PlayerMgsMsgData";
import { NPCDataHelper } from "./modules/npc/NPCData";
import NPCModule_C from "./modules/npc/NPCModule_C";
import NPCModule_S from "./modules/npc/NPCModule_S";
import PetModuleC from "./modules/pets/PetModuleC";
import PetModuleS from "./modules/pets/PetModuleS";
import PlayerModuleClient from "./modules/player/PlayerModuleClient";
import PlayerModuleServer from "./modules/player/PlayerModuleServer";
import { PropModuleC } from "./modules/prop/PropModuleC";
import { PropModuleS } from "./modules/prop/PropModuleS";
import SkillModule_Client from "./modules/skill/SkillModule_Client";
import SkillModule_Server from "./modules/skill/SkillModule_Server";
import GameUtils from "./utils/GameUtils";
import RelationModuleC from "./modules/relation/RelationModuleC";
import RelationModuleS from "./modules/relation/RelationModuleS";
import RelationData from "./modules/relation/RelationData";
import { TaskModuleS } from "./modules/taskModule/TaskModuleS";
import { TaskModuleC } from "./modules/taskModule/TaskModuleC";
import ShopModuleS from "./modules/shop/ShopModuleS";
import ShopModuleC from "./modules/shop/ShopModuleC";
import { PlayerData } from "./modules/player/PlayerData";
import { MgsMsgModuleS, MgsMsgModuleC } from "./modules/mgsMsg/MgsMsgModule";
import FindModuleS, { FindData } from "./modules/find/FindModuleS";
import FindModuleC from "./modules/find/FindModuleC";
import { TS3 } from "./ts3/TS3";
import MonsterSkillMS from "./modules/fight/monsterSkill/MonsterSkillMS";
import MonsterSkillMC from "./modules/fight/monsterSkill/MonsterSkillMC";
import { BuffModuleS } from "./modules/buff/BuffModuleS";
import { BuffModuleC } from "./modules/buff/BuffModuleC";
import FightMS from "./modules/fight/FightMS";
import FightMC from "./modules/fight/FightMC";
import GuideMS from "./modules/guide/GuideMS";
import GuideMC from "./modules/guide/GuideMC";
import ActionMS from "./modules/action/ActionMS";
import ActionMC from "./modules/action/ActionMC";
import { DropModuleC, DropModuleS } from "./modules/drop/DropModule";
import ShopData from "./modules/shop/ShopData";
import GravityCtrlMS from "./modules/gravity/GravityCtrlMS";
import GravityCtrlMC from "./modules/gravity/GravityCtrlMC";
import { MapModuleS } from "./modules/littleMap/logic/MapModuleS";
import { MapModuleC } from "./modules/littleMap/logic/MapModuleC";
import MapHelper from "./modules/littleMap/helper/MapHelper";

@Component
class GameStart extends mw.Script {
	@mw.Property()
	private isOnline: boolean = false;
	@mw.Property({ displayName: "是否本地背包" })
	private isLocalBag = false;
	@mw.Property({ displayName: "是否打开GM" })
	private isOpenGM = false;
	@mw.Property({ displayName: "是否打开日志" })
	private isOpenLog = false;
	// @mw.Property({ displayName: "是否开启cg" })
	// private openCG = false;
	@mw.Property({ displayName: "是否开启强制跳转主游戏" })
	private foreceToMain = false;

	@mw.Property({ displayName: "多语言", selectOptions: { default: "-1", en: "0", zh: "1" } })
	private language: string = "-1";

	private isPlatFormChar = true;



	onStart() {
		super.onStart();
		// GameInitializer["getService"]("NetManager").logVisible = true;
		// GameInitializer["getService"]("NetManager").debug = true;
		this.isOpenLog &&
			mwext['GameInitializer']["openLog"](
				(type: number, content: string) => {
					switch (type) {
						case 1:
							console.log(content);
							break;
						case 2:
							console.warn(content);
							break;
						case 3:
							console.error(content);
							break;
						default:
							break;
					}
				},
				true,
				true
			);
		this.isOnline && LogManager.instance.setLogLevel(2);
		DataStorage.setTemporaryStorage(!this.isOnline);
		GameUtils.systemLanguageIndex = Number(this.language);
		if (GameUtils.systemLanguageIndex == -1) {
			GameUtils.systemLanguageIndex = this.getSystemLanguageIndex();
		}
		if (SystemUtil.isClient()) {
			//初始化表格语言
			GameConfig.initLanguage(GameUtils.systemLanguageIndex, key => {
				let ele = GameConfig.SquareLanguage.getElement(key);
				if (ele == null) return "unknow_" + key;
				return ele.Value;
			});

			mw.UIScript.addBehavior("lan", (ui: mw.StaleButton | mw.TextBlock) => {
				let key: string = ui.text;
				if (key) {
					let data = GameUtils.getLanguage(key);
					if (data) {
						ui.text = data.info;
						if (data.size > 0) {
							ui.fontSize = data.size;
						}
					}
				}
			});
			this.setPlayerInfo()
		}
		GlobalData.isLocalBag = this.isLocalBag;
		GlobalData.isPlatFormChar = this.isPlatFormChar;
		GlobalData.isOpenGM = this.isOpenGM;
		GlobalData.openCG = false;
		GlobalData.globalPos = this.gameObject.worldTransform.position;
		GlobalData.forceToMain = this.foreceToMain;
		this.useUpdate = true;
		this.onRegisterModule();
	}

	public async setPlayerInfo() {
		const player = await Player.asyncGetLocalPlayer();
		setMyPlayerID(player.playerId);
		setMyCharacterGuid(player.character.gameObjectId);
	}

	onUpdate(dt: number): void {
		super.onUpdate(dt);
		TweenUtil.TWEEN.update();
	}


	//获取系统语言索引
	private getSystemLanguageIndex(): number {
		let language = mw.LocaleUtil.getDefaultLocale().toString().toLowerCase();
		if (!!language.match("en")) {
			return 0;
		}
		if (!!language.match("zh")) {
			return 1;
		}
		if (!!language.match("ja")) {
			return 2;
		}
		if (!!language.match("de")) {
			return 3;
		}
		return 0;
	}

	//当注册模块
	onRegisterModule(): void {
		TS3.init()
		// //注册模块
		ModuleService.registerModule(PlayerModuleServer, PlayerModuleClient, PlayerData); //整体角色管理
		ModuleService.registerModule(GameModuleS, GameModuleC, GameModuleData); //负责大厅的一些UI点击
		ModuleService.registerModule(BagModuleS, BagModuleC, BagModuleDataHelper); //背包 和广场那边一样
		ModuleService.registerModule(Chat_Server, Chat_Client, null); //开放广场中的emjio 和快捷聊天
		ModuleService.registerModule(CameraModuleS, CameraModuleC, null); //拍照 相机视角切换
		ModuleService.registerModule(PropModuleS, PropModuleC, null); //背包中那些道具的使用
		ModuleService.registerModule(NPCModule_S, NPCModule_C, NPCDataHelper);//npc
		ModuleService.registerModule(InteractModuleServer, InteractModuleClient, null);//人&&物交互
		ModuleService.registerModule(SkillModule_Server, SkillModule_Client, null);//技能
		ModuleService.registerModule(PetModuleS, PetModuleC, null);//宠物
		ModuleService.registerModule(RelationModuleS, RelationModuleC, RelationData);//关系系统
		ModuleService.registerModule(TaskModuleS, TaskModuleC, null);//任务
		ModuleService.registerModule(ShopModuleS, ShopModuleC, ShopData);//服装
		// ModuleService.registerModule(ClothRaceS, ClothRaceC, null);//选美大赛
		// ModuleService.registerModule(DressModuleS, DressModuleC, null);
		// ModuleService.registerModule(MapModuleS, MapModuleC, null)
		// if (SystemUtil.isClient()) {
		// 	MapHelper.instance.register()
		// }

		// ModuleService.registerModule(TourModuleS, TourModuleC, null);//向导
		ModuleService.registerModule(MgsMsgModuleS, MgsMsgModuleC, PlayerMgsModuleData); //埋点
		ModuleService.registerModule(FindModuleS, FindModuleC, FindData);//find物品
		// ModuleService.registerModule(SpiritModuleS, SpiritModuleC, null);//精灵
		ModuleService.registerModule(MonsterSkillMS, MonsterSkillMC, null)
		ModuleService.registerModule(BuffModuleS, BuffModuleC, null)
		ModuleService.registerModule(FightMS, FightMC, null)
		ModuleService.registerModule(GuideMS, GuideMC, null)
		// ModuleService.registerModule(SkyModuleS, SkyModuleC, null)
		ModuleService.registerModule(ActionMS, ActionMC, null)
		// ModuleService.registerModule(VehicleMS, VehicleMC, null)
		ModuleService.registerModule(DropModuleS, DropModuleC, null)
		ModuleService.registerModule(GravityCtrlMS, GravityCtrlMC, null)

	}
}
export default GameStart;
