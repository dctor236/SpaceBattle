import {ConfigBase, IElementBase} from "./ConfigBase";
import {ActionConfig} from "./Action";
import {AssetsConfig} from "./Assets";
import {AssistConfig} from "./Assist";
import {BaseAttributeConfig} from "./BaseAttribute";
import {BgmActionConfig} from "./BgmAction";
import {BuffConfig} from "./Buff";
import {CameraConfig} from "./Camera";
import {ChatExpressionConfig} from "./ChatExpression";
import {ChatWordConfig} from "./ChatWord";
import {ClothPartConfig} from "./ClothPart";
import {CreateItemConfig} from "./CreateItem";
import {EffectConfig} from "./Effect";
import {FilterConfig} from "./Filter";
import {GameJumperConfig} from "./GameJumper";
import {GlobalConfigConfig} from "./GlobalConfig";
import {GlobalConfig} from "./Global";
import {GuideConfig} from "./Guide";
import {InteractConfigConfig} from "./InteractConfig";
import {ItemConfig} from "./Item";
import {MapConfig} from "./Map";
import {MapIndexConfig} from "./MapIndex";
import {ModelConfig} from "./Model";
import {MonsterBehaviorConfig} from "./MonsterBehavior";
import {MonsterSkillConfig} from "./MonsterSkill";
import {MonsterConfig} from "./Monster";
import {MusicConfig} from "./Music";
import {NPCConfigConfig} from "./NPCConfig";
import {NPCTalkConfig} from "./NPCTalk";
import {PetListConfig} from "./PetList";
import {PetTextConfig} from "./PetText";
import {PropActionConfig} from "./PropAction";
import {PropFlyConfig} from "./PropFly";
import {PropPlacementConfig} from "./PropPlacement";
import {RoleAvatarConfig} from "./RoleAvatar";
import {ShopConfig} from "./Shop";
import {SkillLevelConfig} from "./SkillLevel";
import {SkillConfig} from "./Skill";
import {SkyChangeConfig} from "./SkyChange";
import {SpirtConfig} from "./Spirt";
import {SquareActionConfigConfig} from "./SquareActionConfig";
import {SquareLanguageConfig} from "./SquareLanguage";
import {TalkEventConfig} from "./TalkEvent";
import {TaskConfig} from "./Task";
import {TitleStyleConfig} from "./TitleStyle";
import {TreasureConfig} from "./Treasure";
import {VehicleDoorAnimConfig} from "./VehicleDoorAnim";
import {VehicleConfig} from "./Vehicle";
import {VInfoSeatConfig} from "./VInfoSeat";
import {WeatherConfig} from "./Weather";

export class GameConfig{
	private static configMap:Map<string, ConfigBase<IElementBase>> = new Map();
	/**
	* 多语言设置
	* @param languageIndex 语言索引(-1为系统默认语言)
	* @param getLanguageFun 根据key获取语言内容的方法
	*/
	public static initLanguage(languageIndex:number, getLanguageFun:(key:string|number)=>string){
		ConfigBase.initLanguage(languageIndex, getLanguageFun);
		this.configMap.clear();
	}
	public static getConfig<T extends ConfigBase<IElementBase>>(ConfigClass: { new(): T }): T {
		if (!this.configMap.has(ConfigClass.name)) {
			this.configMap.set(ConfigClass.name, new ConfigClass());
		}
		return this.configMap.get(ConfigClass.name) as T;
	}
	public static get Action():ActionConfig{ return this.getConfig(ActionConfig) };
	public static get Assets():AssetsConfig{ return this.getConfig(AssetsConfig) };
	public static get Assist():AssistConfig{ return this.getConfig(AssistConfig) };
	public static get BaseAttribute():BaseAttributeConfig{ return this.getConfig(BaseAttributeConfig) };
	public static get BgmAction():BgmActionConfig{ return this.getConfig(BgmActionConfig) };
	public static get Buff():BuffConfig{ return this.getConfig(BuffConfig) };
	public static get Camera():CameraConfig{ return this.getConfig(CameraConfig) };
	public static get ChatExpression():ChatExpressionConfig{ return this.getConfig(ChatExpressionConfig) };
	public static get ChatWord():ChatWordConfig{ return this.getConfig(ChatWordConfig) };
	public static get ClothPart():ClothPartConfig{ return this.getConfig(ClothPartConfig) };
	public static get CreateItem():CreateItemConfig{ return this.getConfig(CreateItemConfig) };
	public static get Effect():EffectConfig{ return this.getConfig(EffectConfig) };
	public static get Filter():FilterConfig{ return this.getConfig(FilterConfig) };
	public static get GameJumper():GameJumperConfig{ return this.getConfig(GameJumperConfig) };
	public static get GlobalConfig():GlobalConfigConfig{ return this.getConfig(GlobalConfigConfig) };
	public static get Global():GlobalConfig{ return this.getConfig(GlobalConfig) };
	public static get Guide():GuideConfig{ return this.getConfig(GuideConfig) };
	public static get InteractConfig():InteractConfigConfig{ return this.getConfig(InteractConfigConfig) };
	public static get Item():ItemConfig{ return this.getConfig(ItemConfig) };
	public static get Map():MapConfig{ return this.getConfig(MapConfig) };
	public static get MapIndex():MapIndexConfig{ return this.getConfig(MapIndexConfig) };
	public static get Model():ModelConfig{ return this.getConfig(ModelConfig) };
	public static get MonsterBehavior():MonsterBehaviorConfig{ return this.getConfig(MonsterBehaviorConfig) };
	public static get MonsterSkill():MonsterSkillConfig{ return this.getConfig(MonsterSkillConfig) };
	public static get Monster():MonsterConfig{ return this.getConfig(MonsterConfig) };
	public static get Music():MusicConfig{ return this.getConfig(MusicConfig) };
	public static get NPCConfig():NPCConfigConfig{ return this.getConfig(NPCConfigConfig) };
	public static get NPCTalk():NPCTalkConfig{ return this.getConfig(NPCTalkConfig) };
	public static get PetList():PetListConfig{ return this.getConfig(PetListConfig) };
	public static get PetText():PetTextConfig{ return this.getConfig(PetTextConfig) };
	public static get PropAction():PropActionConfig{ return this.getConfig(PropActionConfig) };
	public static get PropFly():PropFlyConfig{ return this.getConfig(PropFlyConfig) };
	public static get PropPlacement():PropPlacementConfig{ return this.getConfig(PropPlacementConfig) };
	public static get RoleAvatar():RoleAvatarConfig{ return this.getConfig(RoleAvatarConfig) };
	public static get Shop():ShopConfig{ return this.getConfig(ShopConfig) };
	public static get SkillLevel():SkillLevelConfig{ return this.getConfig(SkillLevelConfig) };
	public static get Skill():SkillConfig{ return this.getConfig(SkillConfig) };
	public static get SkyChange():SkyChangeConfig{ return this.getConfig(SkyChangeConfig) };
	public static get Spirt():SpirtConfig{ return this.getConfig(SpirtConfig) };
	public static get SquareActionConfig():SquareActionConfigConfig{ return this.getConfig(SquareActionConfigConfig) };
	public static get SquareLanguage():SquareLanguageConfig{ return this.getConfig(SquareLanguageConfig) };
	public static get TalkEvent():TalkEventConfig{ return this.getConfig(TalkEventConfig) };
	public static get Task():TaskConfig{ return this.getConfig(TaskConfig) };
	public static get TitleStyle():TitleStyleConfig{ return this.getConfig(TitleStyleConfig) };
	public static get Treasure():TreasureConfig{ return this.getConfig(TreasureConfig) };
	public static get VehicleDoorAnim():VehicleDoorAnimConfig{ return this.getConfig(VehicleDoorAnimConfig) };
	public static get Vehicle():VehicleConfig{ return this.getConfig(VehicleConfig) };
	public static get VInfoSeat():VInfoSeatConfig{ return this.getConfig(VInfoSeatConfig) };
	public static get Weather():WeatherConfig{ return this.getConfig(WeatherConfig) };
}