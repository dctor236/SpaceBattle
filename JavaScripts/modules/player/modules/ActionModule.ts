import { GeneralManager, } from '../../../Modified027Editor/ModifiedStaticAPI';
import { SpawnManager, SpawnInfo, } from '../../../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
/**
* @Author       : songxing
* @Date         : 2023-05-29 09:48:15
* @LastEditors  : songxing
* @LastEditTime : 2023-05-29 17:42:46
* @FilePath     : \mollywoodschool\JavaScripts\modules\player\modules\ActionModule.ts
* @Description  : 
*/
import { GameConfig } from "../../../config/GameConfig";
import { EventsName, PlayerStateType } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { UIManager } from "../../../ExtensionType";
import Tips from "../../../ui/commonUI/Tips";
import ActionMC from "../../action/ActionMC";
import { TagType } from "../../bag/BagDataHelper";
import { BagModuleC } from "../../bag/BagModuleC";
import { BagModuleS } from "../../bag/BagModuleS";
import GravityCtrlMgr from "../../gravity/GravityCtrlMgr";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
import { MgsMsgModuleC } from "../../mgsMsg/MgsMsgModule";
import { NPCClient } from "../../npc/NPCClient";
import NPCModule_C from "../../npc/NPCModule_C";
import { ModuleBaseC, ModuleBaseS } from "../base/ModuleBase";
import PlayerModuleServer from "../PlayerModuleServer";
import { ActionBaseHud } from "../ui/action/ActionBaseHud";
import { ActionBaseP } from "../ui/action/ActionBaseP";
import GameUtils from '../../../utils/GameUtils';
export default class ActionData {
    public static get(id: number): ActionBaseCfg {
        let cfg = GameConfig.SquareActionConfig.getElement(id)
        let data = new ActionBaseCfg();
        data.id = cfg.ID;
        data.name = cfg.name;
        data.type = cfg.type;
        data.icon = cfg.icon;
        data.actionId = cfg.actionId;
        data.singleType = cfg.singleType;
        data.doubleType = cfg.doubleType;
        data.v = cfg.v;
        data.r = cfg.r;
        data.sendStance = cfg.sendStance;
        data.accectStance = cfg.accectStance;
        data.time = cfg.time;
        data.visual1 = cfg.visual1;
        data.visual2 = cfg.visual2;
        data.circulate = cfg.circulate;
        return data;
    }
}

/**动作配置数据 */
export class ActionBaseCfg {

    /**配置id */
    id: number;
    /**动作类型 */
    type: ActionType;

    name: string;
    /**图标 */
    icon: string;
    /**动作id */
    actionId: string;
    /**单人动作是否为姿态 */
    singleType: number;
    /**双人动作类型 */
    doubleType: ActionDoubleType;
    /**接收者位置偏移 */
    v: mw.Vector;
    /**接收者旋转偏移 */
    r: mw.Vector;
    /**发起者姿态 */
    sendStance: string;
    /**接收者姿态 */
    accectStance: string;
    /**动作播放时间 */
    time: number;
    /**发起者视角偏移 */
    visual1: mw.Vector;
    /**接收者视角偏移 */
    visual2: mw.Vector;
    /**单人动作是否循环 */
    circulate: boolean;
}

/**动作类型 */
export enum ActionType {
    /**单人动作 */
    Single = 1,
    /**双人动作 */
    Double
}

/**双人动作类型 */
export enum ActionDoubleType {
    /**普通动作 */
    Ordinary = 1,
    /**交互动作 */
    Interactive,
    /**强制动作 */
    Force
}

export class ActionLuanguage {
    public static isOverseas = !mw.LocaleUtil.getDefaultLocale().toString().toLowerCase().match("zh");

    //多语言
    /**接受动作文本 */
    public static acceptText: string = "";
    /**拒绝动作文本 */
    public static refuseText: string = "";
    /**发起描述1 */
    public static desc1: string = "";
    /**发起描述2 */
    public static desc2: string = "";
    /**接受按钮图标 */
    // public static acceptGuid: string = "";
    /**动作Item背景图 */
    // public static itemBg: string = "";
    /**与交互物互斥提示 */
    public static interactiveTips: string = "";
    /**与道具互斥提示 */
    public static itemType: string = "";
    /**重复发起动作提示 */
    public static actionTips: string = "";
    /**动作发起成功提示 */
    public static succes: string = "";
    /**动作发起失败提示 */
    public static fail: string = "";
    /**脱离 */
    public static leave: string = "";
    /**动作按钮文字 */
    public static action: string = "";
    /**脱离按钮图标 */
    // public static leaveIcon: string = "";
    /**页签1 */
    public static tab1: string = "";
    /**页签2 */
    public static tab2: string = "";
    /**页签底图 */
    // public static tabBg: string = "";
    /**距离过远 */
    public static toolong: string = "";
    /**当前玩家处于双人动作中 */
    public static ing: string = "";
    /**请先离开当前玩家 */
    public static pleaseLeave: string = "";
}

enum ActionEvent {
    //client To Sever//========================================
    net_LeaveInteract = "net_LeaveInteract",
    net_login = "net_login",
    net_ForeceAction = "net_ForeceAction",
    net_LuanchAction = "net_LuanchAction",
    net_OnActionSuccess = "net_OnActionSuccess",
    //Sever && Client//========================================
    net_PlayAction = "net_PlayAction",
    //Server To Client//========================================
    net_GetPlayer = "net_GetPlayer",
    net_ShowTips = "net_ShowTips",
    net_SetActionMSG = "net_SetActionMSG",
    net_Interact = "net_Interact",
}

export class ActionModuleC extends ModuleBaseC {
    /**当前交互 */
    public curId = 0;
    /**是否为接收者 */
    public isAccepter = false;
    /**是否单人姿态 */
    public isSingleStance = false;
    /**默认相机位置 */
    public camerPos: mw.Vector = null;
    /**当前循环动作 */
    public curloop = "";

    public actionPanel: ActionBaseP = null;
    public actionHUD: ActionBaseHud = new ActionBaseHud();
    private self: mw.Player = null;
    public map: Map<number, ActionBaseCfg> = new Map<number, ActionBaseCfg>();

    public mayActionMap: Map<number, ActionBaseCfg> = new Map<number, ActionBaseCfg>();

    /**当前简单双人动作 */
    private singleA: mw.Animation = null;
    private curInterectNPCData: InteractPlayer = null

    initLanguage() {
        ActionLuanguage.acceptText = GameConfig.SquareLanguage.Danmu_Content_1073.Value;
        ActionLuanguage.refuseText = GameConfig.SquareLanguage.Danmu_Content_1074.Value;
        ActionLuanguage.desc1 = GameConfig.SquareLanguage.Danmu_Content_1075.Value;
        ActionLuanguage.desc2 = GameConfig.SquareLanguage.Danmu_Content_1076.Value;
        // ActionLuanguage.acceptGuid = GameConfig.SquareLanguage[95788].Value;
        // ActionLuanguage.itemBg = GameConfig.SquareLanguage.getElement(86723).Value;
        ActionLuanguage.interactiveTips = GameConfig.SquareLanguage.Danmu_Content_1065.Value;
        ActionLuanguage.itemType = GameConfig.SquareLanguage.Danmu_Content_1064.Value;
        ActionLuanguage.actionTips = GameConfig.SquareLanguage.Danmu_Content_1060.Value;
        ActionLuanguage.succes = GameConfig.SquareLanguage.Danmu_Content_1071.Value;
        ActionLuanguage.fail = GameConfig.SquareLanguage.Danmu_Content_1072.Value;
        ActionLuanguage.leave = GameConfig.SquareLanguage.Danmu_Content_1054.Value;
        ActionLuanguage.action = GameConfig.SquareLanguage.Text_Text_589.Value;
        // ActionLuanguage.leaveIcon = GameConfig.SquareLanguage[94427].Value;
        ActionLuanguage.tab1 = GameConfig.SquareLanguage.Danmu_Content_1001.Value;
        ActionLuanguage.tab2 = GameConfig.SquareLanguage.Danmu_Content_1002.Value;
        // ActionLuanguage.tabBg = GameConfig.SquareLanguage.getElement(86265).Value;
        ActionLuanguage.toolong = GameConfig.SquareLanguage.Danmu_Content_1069.Value;
        ActionLuanguage.ing = GameConfig.SquareLanguage.Danmu_Content_1070.Value;
        ActionLuanguage.pleaseLeave = GameConfig.SquareLanguage.Danmu_Content_1053.Value;
    }

    protected initConfig(): void {
        let configs = GameConfig.SquareActionConfig.getAllElement();
        for (let config of configs) {
            this.map.set(config.ID, ActionData.get(config.ID));
        }
    }

    public cleanStance(): void {
        if (this.isSingleStance) {
            PlayerManagerExtesion.changeStanceExtesion(this.self.character, "");
            this.isSingleStance = false;
            if (GravityCtrlMgr.instance.isSimpuly) {
                ModuleService.getModule(ActionMC).playAction(409)
                this.self.character.switchToFlying()
            } else {
                const curSel = Number(ModuleService.getModule(BagModuleC).curEquip)
                if (!(Math.floor(curSel / 10) >= 30 && Math.floor(curSel / 10) < 40))
                    return
                const elem = GameConfig.Item.getElement(curSel)
                if (elem && elem.Skills && elem.Skills.length >= 2) {
                    const skillElem = GameConfig.SkillLevel.getElement(elem.Skills[0])
                    if (skillElem) {
                        const param = skillElem.Param1.split("|")
                        ModuleService.getModule(ActionMC).playAction(Number(param[0]))
                    }
                }
            }
        }
        if (this.curloop) {
            PlayerManagerExtesion.rpcStopAnimation(this.self.character, this.curloop);
            this.curloop = "";
            if (GravityCtrlMgr.instance.isSimpuly) {
                ModuleService.getModule(ActionMC).playAction(409)
                this.self.character.switchToFlying()
            } else {
                const curSel = Number(ModuleService.getModule(BagModuleC).curEquip)
                if (!(Math.floor(curSel / 10) >= 30 && Math.floor(curSel / 10) < 40))
                    return
                const elem = GameConfig.Item.getElement(curSel)
                if (elem && elem.Skills && elem.Skills.length >= 2) {
                    const skillElem = GameConfig.SkillLevel.getElement(elem.Skills[0])
                    if (skillElem) {
                        const param = skillElem.Param1.split("|")
                        ModuleService.getModule(ActionMC).playAction(Number(param[0]))
                    }
                }
            }
        }

    }

    private initUI(): void {
        if (this.actionPanel == null) {
            this.actionPanel = mw.UIService.create(ActionBaseP);
            this.actionPanel.OnSet.add(this.luanchAction, this);
        }
    }

    protected onStart(): void {
        this.addLinster()
    }

    private addLinster() {
        Event.addServerListener(ActionEvent.net_GetPlayer, (id: number, guid: number, name: string) => {
            this.net_GetPlayer(id, guid, name);
        })

        Event.addServerListener(ActionEvent.net_ShowTips, (num: number) => {
            this.net_ShowTips(num);
        });

        Event.addServerListener(ActionEvent.net_SetActionMSG, (id: number) => {
            this.net_SetActionMSG(id)
        })

        Event.addServerListener(ActionEvent.net_PlayAction, (id: string) => {
            this.net_PlayAction(id)
        })

        Event.addServerListener(ActionEvent.net_Interact, (playerId: number, isAccepter: boolean, configId: number) => {
            this.net_Interact(playerId, isAccepter, configId)
        })

        Event.addServerListener(ActionEvent.net_OnActionSuccess, (succes: boolean) => {
            this.net_OnActionSucces(succes)
        })
    }

    public onEnterScene(sceneType: number): void {
        this.actionHUD.onAccept.add(this.aceeptAction, this);
        this.actionHUD.onActive.add(() => {
            this.initUI();
            if (this.curId <= 0) {
                this.showPanle()
                this.setPageMGS("action");
            } else {
                Event.dispatchToServer(ActionEvent.net_LeaveInteract, Number(this.curId))
            }
        }, this);
        this.initLanguage();
        this.initConfig();
        this.self = Player.localPlayer;
        this.camerPos = Camera.currentCamera.localTransform.position;
        Event.dispatchToServer(ActionEvent.net_login)
        Event.addLocalListener(EventsName.CancelActive, () => {
            this.off()
        })
        this.actionHUD.onStart();
    }


    /**打开动作列表 */
    public showPanle(): void {
        let itemInfos = ModuleService.getModule(BagModuleC).getItemsByTag(TagType.Action)
        for (const info of itemInfos) {
            const bagConfig = GameConfig.Item.getElement(info.configID)
            if (this.mayActionMap.has(bagConfig.Action)) {
                continue
            }
            const actionConfig = ActionData.get(bagConfig.Action)
            this.mayActionMap.set(bagConfig.Action, actionConfig)
        }
        this.initUI();
        this.actionPanel.setConfig(this.mayActionMap)
        UIManager.showUI(this.actionPanel);
    }

    /**离开交互 */
    public off(): void {
        if (this.curId > 0) {
            Event.dispatchToServer(ActionEvent.net_LeaveInteract, Number(this.curId))
        }
    }

    protected setPageMGS(str: string): void {
        MGSMsgHome.setPageMGS("action");
        MGSMsgHome.setBtnClick("action_btn")
    }

    protected bagAcceptSkip(): boolean {
        return true;
    }

    protected bagLuanchSkip(): boolean {
        return true;
    }

    protected interactiveSkip(): boolean {
        return true;
    }

    protected net_showTips(str: string): void {
        Tips.show(str);
    }

    private _SelfName = ""
    protected getSelfName(): string {
        if (StringUtil.isEmpty(this._SelfName))
            this._SelfName = mw.AccountService.getNickName() || "player"
        return this._SelfName
    }

    public changePanelState(isShow: boolean) {
        this.actionHUD.setVisible(isShow);
    }

    /**
     * 发起动作
     * @param config 
     * @returns 
     */
    private async luanchAction(config: ActionBaseCfg, playerId?: number): Promise<void> {
        this.cleanStance();
        //判断和交互物互斥
        if (!this.interactiveSkip()) {
            this.net_showTips(ActionLuanguage.interactiveTips);
            return;
        }
        //判断和道具互斥
        if (!this.bagLuanchSkip()) {
            this.net_showTips(ActionLuanguage.itemType);
            return;
        }
        //去除重复发起动作
        if (this.curId > 0) {
            this.net_showTips(ActionLuanguage.actionTips);
            return;
        }
        // CreditEventsC.trigger(CreditEvent.RP.Action, 0, 1)
        if (config.type == ActionType.Single) {//单人动作
            this.cleanStance();
            if (config.singleType) {
                PlayerManagerExtesion.changeStanceExtesion(this.self.character, config.actionId);
                // ModuleService.getModule(ActionMC).playAction(Number(config.actionId))
                this.isSingleStance = true;
            } else {
                if (config.circulate) {
                    this.curloop = config.actionId;
                }
                // ModuleService.getModule(ActionMC).playAction(Number(config.actionId))
                const anim = PlayerManagerExtesion.rpcPlayAnimation(this.self.character, config.actionId, config.circulate ? 0 : 1, config.time);
                anim.onFinish.add(() => {
                    const curSel = Number(ModuleService.getModule(BagModuleC).curEquip)
                    if (!(Math.floor(curSel / 10) >= 30 && Math.floor(curSel / 10) < 40))
                        return
                    const elem = GameConfig.Item.getElement(curSel)
                    if (elem && elem.Skills && elem.Skills.length >= 2) {
                        const skillElem = GameConfig.SkillLevel.getElement(elem.Skills[0])
                        if (skillElem) {
                            const param = skillElem.Param1.split("|")
                            ModuleService.getModule(ActionMC).playAction(Number(param[0]))
                        }
                    }
                })
            }
            this.setMGS(config.id);
        } else {//双人动作
            if (!GlobalData.inSpaceStation) {
                Tips.show(GameUtils.getTxt("Tips_1002"))
                return
            }
            if (config.doubleType == ActionDoubleType.Force) {//强制动作
                Event.dispatchToServer(ActionEvent.net_ForeceAction, config.id, playerId)
            } else {//交互动作
                let name = this.getSelfName();
                Event.dispatchToServer(ActionEvent.net_LuanchAction, config.id, name, playerId)
            }
        }
    }

    net_OnActionSucces(succes: boolean) {
        let str = succes ? ActionLuanguage.succes : ActionLuanguage.fail;
        this.net_showTips(str);
    }

    protected setMGS(id: number): void {
        ModuleService.getModule(MgsMsgModuleC).setActionMSG(id);
    }


    luanchActionOut(configId: number, playerId?: number): void {
        let config = this.map.get(configId);
        this.luanchAction(config, playerId);
    }

    public foreceActionWithNpc(configId: number, npcID: number): void {
        if (this.hasActionNpc()) {
            return
        }
        let config = this.map.get(configId);
        let npc = ModuleService.getModule(NPCModule_C).getNpc(npcID)

        if (!config || !npc) {
            return;
        }
        if (config.doubleType != ActionDoubleType.Ordinary) {
            //交互动作
            this.curInterectNPCData = new InteractPlayer();
            this.curInterectNPCData.start(this.currentPlayer, npc.npcClient, config);
            // this.curInterectNPCData.action.add(() => {
            //     this.net_Interact(this.currentPlayerId, false, configId);
            // });
        }
    }


    public exitActionWithNpc() {
        this.curInterectNPCData.leave()
        this.curInterectNPCData = null
    }

    public hasActionNpc() {
        return this.curInterectNPCData != null
    }



    public net_SetActionMSG(id: number) {
        this.setMGS(id);
    }

    /**
 * 收到发起动作的人
 * @param guid 
 */
    public net_GetPlayer(playerId: number, guid: number, name: string): void {
        this.actionHUD.addPlayer(playerId, guid, name);
    }


    /**
     * 接受动作
     * @param id 
     * @returns 
     */
    private aceeptAction(id: number): void {
        if (!this.interactiveSkip()) {
            this.net_showTips(ActionLuanguage.interactiveTips);
            return;
        }
        if (this.isSingleStance) {
            PlayerManagerExtesion.changeStanceExtesion(this.self.character, "");
            this.isSingleStance = false;
        }

        //道具互斥判断
        if (!this.bagAcceptSkip()) {
            this.net_showTips(ActionLuanguage.itemType);
            return;
        }
        Event.dispatchToServer(ActionEvent.net_PlayAction, id);
    }


    /**
 * 播放动作
 * @param actionId 
 */
    public net_PlayAction(actionId: string): void {
        this.self.character.collisionWithOtherCharacterEnabled = false;
        if (this.singleA) {
            this.singleA.stop();
        }
        this.singleA = PlayerManagerExtesion.rpcPlayAnimation(this.self.character, actionId);
        this.singleA.onFinish.add(() => {
            this.singleA = null;
            this.self.character.collisionWithOtherCharacterEnabled = true;
            const curSel = Number(ModuleService.getModule(BagModuleC).curEquip)
            if (!(Math.floor(curSel / 10) >= 30 && Math.floor(curSel / 10) < 40))
                return
            const elem = GameConfig.Item.getElement(curSel)
            if (elem && elem.Skills && elem.Skills.length >= 2) {
                const skillElem = GameConfig.SkillLevel.getElement(elem.Skills[0])
                if (skillElem) {
                    const param = skillElem.Param1.split("|")
                    ModuleService.getModule(ActionMC).playAction(Number(param[0]))
                }
            }
        });
    }


    /**
     * 同步交互状态
     * @param playerId 
     */
    public net_Interact(playerId: number, isAccepter: boolean, configId: number): void {
        this.curId = playerId;
        this.isAccepter = isAccepter;
        let guid = playerId > 0 ? "115571" : "115581";
        let name = playerId > 0 ? ActionLuanguage.leave : ActionLuanguage.action;
        this.actionHUD.refreshBtnStr(name, guid);
        if (playerId <= 0) {
            PlayerManagerExtesion.changeStanceExtesion(this.self.character, "");
            Camera.currentCamera.localTransform.position = this.camerPos;
            if (GravityCtrlMgr.instance.isSimpuly) {
                this.self.character.switchToFlying()
            }
        } else {
            let config = this.map.get(configId);
            if (!config) {
                return;
            }
            if (isAccepter && config.visual2) {
                Camera.currentCamera.localTransform.position = config.visual2;
            }
            if (!isAccepter && config.visual1) {
                Camera.currentCamera.localTransform.position = config.visual1;
            }
        }
    }

    /**
     * 显示提示
     * @param str 
     */
    public net_ShowTips(num: number): void {
        let str = "";
        switch (num) {
            case 0:
                str = ActionLuanguage.fail;
                break;
            case 1:
                str = ActionLuanguage.toolong;
                break;
            case 2:
                str = ActionLuanguage.ing;
                break;
            case 3:
                str = ActionLuanguage.pleaseLeave;
                break;
            default:
                return;
        }
        this.net_showTips(str);
    }

    /**
     * 刷新按钮显示
     * @param bool true显示 false不显示
     */
    public refreshBtn(bool: boolean): void {
        this.actionHUD.refreshBtn(bool);
    }



    /**
    * 是否在双人动作中
    * @param playerId 
    */
    public isInDoubleAction(playerId: number): boolean {
        return this.curId > 0;
    }


}


export class ActionModuleS extends ModuleBaseS {
    /**发起动作的人 */
    private actionPlayers: Map<number, number> = new Map<number, number>();
    /**交互的人*/
    public interactPlayers: Map<number, InteractPlayer> = new Map<number, InteractPlayer>();
    /**显示交互距离 */
    private showFlagDis = 400;
    public map: Map<number, ActionBaseCfg> = new Map<number, ActionBaseCfg>();

    protected onStart(): void {
        //监听玩家离开房间
        this.initConfig();
        this.addLinster()
    }

    public onPlayerLeft(player: mw.Player): void {
        this.peopleLeft(player)
    }

    private addLinster() {
        Event.addClientListener(ActionEvent.net_ForeceAction, (player: mw.Player, id: number, playerId: number) => {
            this.net_ForeceAction(player, id, playerId);
        })

        Event.addClientListener(ActionEvent.net_LuanchAction, (player: mw.Player, id: number, name: string, playerId?: number) => {
            this.net_LuanchAction(player, id, name, playerId);
        })


        Event.addClientListener(ActionEvent.net_LeaveInteract, (player: mw.Player, id: number) => {
            this.net_LeaveInteract(player, id);
        })


        Event.addClientListener(ActionEvent.net_login, (player: mw.Player) => {
            this.net_login(player);
        })

        Event.addClientListener(ActionEvent.net_PlayAction, (player: mw.Player, actionId: number) => {
            this.net_PlayAction(player, actionId);
        })

    }

    protected initConfig(): void {
        let configs = GameConfig.SquareActionConfig.getAllElement();
        for (let config of configs) {
            const id = config.ID
            this.map.set(id, ActionData.get(id));
        }
    }

    /**
     * 玩家离开
     * @param player 
     */
    private peopleLeft(player: mw.Player): void {
        for (let [id, interactData] of this.interactPlayers) {
            if (player.playerId == interactData.sendPlayerId || player.playerId == interactData.accectPlayerId) {
                let accectPlayer = Player.getPlayer(interactData.accectPlayerId);
                let sendPlayer = Player.getPlayer(interactData.sendPlayerId);
                if (accectPlayer) {
                    this.leaveCheck(sendPlayer);
                    accectPlayer.character.collisionWithOtherCharacterEnabled = true;
                }
                if (sendPlayer) {
                    this.leaveCheck(accectPlayer);
                }
                interactData.reLoginLeave();
                this.interactPlayers.delete(id);
            }
        }
    }

    /**
    * 发起动作
    * @param guid 
    */
    public net_LuanchAction(player: mw.Player, guid: number, name: string, playerId?: number) {
        let id = player.playerId;
        let succes = false;
        if (playerId) {
            if (this.isCanLuanch(player, playerId)) {
                this.actionPlayers.set(id, guid);
                Event.dispatchToClient(Player.getPlayer(playerId), ActionEvent.net_GetPlayer, id, guid, name);
                succes = true;
            }
        } else {
            for (let playeritem of Player.getAllPlayers()) {
                if (!this.isCanLuanch(player, playeritem.playerId)) {
                    continue;
                }
                this.actionPlayers.set(id, guid);
                Event.dispatchToClient(playeritem, ActionEvent.net_GetPlayer, id, guid, name);
                succes = true;
            }
        }
        Event.dispatchToClient(player, ActionEvent.net_OnActionSuccess, succes)
    }

    private isCanLuanch(luanchPlayer: mw.Player, playerId: number): boolean {
        let player = Player.getPlayer(playerId);
        if (!player) {
            return false;
        }
        if (playerId == luanchPlayer.playerId) {
            return false;
        }
        //距离判定
        if (mw.Vector.squaredDistance(player.character.worldTransform.position, luanchPlayer.character.worldTransform.position) > this.showFlagDis * this.showFlagDis) {
            return false;
        }
        //是否为接收者
        if (this.isAccepter(playerId)) {
            return false;
        }
        //是否可完成动作
        if (!this.isCanDo(playerId)) {
            return false;
        }
        return true;
    }

    /**
    * 检查是否为接收者
    * @param id 
    */
    private isAccepter(id: number): boolean {
        for (let [key, interactData] of this.interactPlayers) {
            if (id == interactData.accectPlayerId) {
                return true;
            }
        }
        return false;
    }

    /**
     * 发起强制动作
     * @param configId 
     * @returns 
     */
    public net_ForeceAction(player: mw.Player, configId: number, playerId?: number): void {
        if (playerId) {
            if (this.isCanForece(player, playerId)) {
                this.beginAction(configId, Player.getPlayer(playerId), player);
                return;
            }
        } else {
            for (let item of Player.getAllPlayers()) {
                if (!this.isCanForece(player, item.playerId)) {
                    continue;
                }
                this.beginAction(configId, item, player);
                return;
            }
        }
        Event.dispatchToClient(player, ActionEvent.net_ShowTips, 0);
    }


    /**
    * 是否在双人动作中
    * @param playerId 
    */
    public isInDoubleAction(playerId: number): boolean {
        for (let [id, data] of this.interactPlayers) {
            if (playerId == id) {
                return true;
            }
            if (data.accectPlayerId == playerId) {
                return true;
            }
        }
        return false;
    }

    protected bagSkip(playerId: number): boolean {
        return ModuleService.getModule(BagModuleS).isCanDoElse(3, playerId);
    }

    public isInInteract(playerId: number): boolean {
        return ModuleService.getModule(PlayerModuleServer).State.playerIsBusy(playerId);
    }

    protected setActionMSG(id: number, player: mw.Player): void {
        Event.dispatchToClient(player, ActionEvent.net_SetActionMSG, id);
    }

    /**
     * 是否可以强制动作
     * @param self 
     * @param playerId 
     */
    private isCanForece(sendPlayer: mw.Player, playerId: number): boolean {
        let player = Player.getPlayer(playerId);
        if (!player) {
            return false;
        }
        if (playerId == sendPlayer.playerId) {
            return false;
        }
        //距离判定
        if (mw.Vector.squaredDistance(player.character.worldTransform.position, sendPlayer.character.worldTransform.position) > this.showFlagDis * this.showFlagDis) {
            return false;
        }
        //角度判定
        let forwardV = sendPlayer.character.worldTransform.getForwardVector().normalized;
        let v = player.character.worldTransform.position.subtract(sendPlayer.character.worldTransform.position).normalized;
        let angle = Math.acos(forwardV.x * v.x + forwardV.y * v.y + forwardV.z * v.z);
        if (angle > Math.PI / 4) {
            return false;
        }
        //是否在交互中
        if (this.isInInteract(playerId)) {
            return false;
        }
        //是否与道具互斥
        if (!this.bagSkip(playerId)) {
            return false;
        }
        //是否为接收者
        if (this.isAccepter(playerId)) {
            return false;
        }
        //是否可完成动作
        if (!this.isCanDo(playerId)) {
            return false;
        }
        return true;
    }

    /**
     * 是否可完成动作
     * @param playerId 
     * @returns 
     */
    public isCanDo(playerId: number): boolean {
        return true;
    }

    /**
    * 开始动作
    * @param playerId 
    */
    public net_PlayAction(player: mw.Player, playerId: number): void {
        let accectPlayer = player
        //距离判断
        let sendPlayer = Player.getPlayer(playerId);
        if (mw.Vector.squaredDistance(sendPlayer.character.worldTransform.position, accectPlayer.character.worldTransform.position) > this.showFlagDis * this.showFlagDis) {
            Event.dispatchToClient(accectPlayer, ActionEvent.net_ShowTips, 1);
            return;
        }
        //判断是否已经响应
        if (!this.actionPlayers.has(playerId)) {
            Event.dispatchToClient(accectPlayer, ActionEvent.net_ShowTips, 2);
            return;
        }
        //是否为接收者
        if (this.isAccepter(accectPlayer.playerId)) {
            Event.dispatchToClient(accectPlayer, ActionEvent.net_ShowTips, 3);
            return;
        }

        let id = this.actionPlayers.get(playerId);
        //移除响应状态
        this.actionPlayers.delete(playerId);
        this.beginAction(id, accectPlayer, sendPlayer);
    }

    /**
     * 开始动作
     * @param id 配置id 
     * @param accectPlayer 接收者
     * @param luanchPlayer 发起者
     */
    private beginAction(id: number, accectPlayer: mw.Player, luanchPlayer: mw.Player): void {
        let config = this.map.get(id);
        if (!config) {
            return;
        }
        if (config.doubleType == ActionDoubleType.Ordinary) {
            //简单动作
            accectPlayer.character.collisionWithOtherCharacterEnabled = false;
            setTimeout(() => {
                accectPlayer.character.worldTransform.position = mw.Vector.add(luanchPlayer.character.worldTransform.position, luanchPlayer.character.worldTransform.getForwardVector().clone().multiply(config.v.length))
                let r = mw.Rotation.zero;
                mw.Rotation.add(luanchPlayer.character.worldTransform.rotation, new mw.Rotation(config.r), r);
                accectPlayer.character.worldTransform.rotation = r;
            }, 100);
            Event.dispatchToClient(luanchPlayer, ActionEvent.net_PlayAction, config.actionId);
            Event.dispatchToClient(accectPlayer, ActionEvent.net_PlayAction, config.actionId);
        } else {
            //交互动作
            let interactData = new InteractPlayer();
            this.interactPlayers.set(luanchPlayer.playerId, interactData);
            interactData.start(luanchPlayer, accectPlayer, config);
            interactData.action.add(() => {
                Event.dispatchToClient(luanchPlayer, ActionEvent.net_Interact, luanchPlayer.playerId, false, id);
                Event.dispatchToClient(accectPlayer, ActionEvent.net_Interact, luanchPlayer.playerId, true, id);
            });
        }
        this.setActionMSG(id, accectPlayer);
        this.setActionMSG(id, luanchPlayer);
    }

    /**
     * 离开交互
     * @param id 
     * @returns 
     */
    public net_LeaveInteract(player: mw.Player, id: number): void {
        let interactData = this.interactPlayers.get(id);
        if (!interactData) {
            Event.dispatchToClient(player, ActionEvent.net_Interact, 0, true, 0);
            return;
        }

        let sendPlayer = Player.getPlayer(interactData.sendPlayerId);
        let accectPlayer = Player.getPlayer(interactData.accectPlayerId);
        accectPlayer.character.collisionWithOtherCharacterEnabled = true;
        interactData.leave();
        this.interactPlayers.delete(id);
        this.leaveCheck(sendPlayer);
        this.leaveCheck(accectPlayer);
    }

    /**
     * 判断离开当前交互的发起者，是否仍为其他交互发起或接收者
     * @param player 
     * @returns 
     */
    private leaveCheck(player: mw.Player): void {
        for (let [id, interactData] of this.interactPlayers) {
            if (player.playerId == interactData.sendPlayerId) {

                Event.dispatchToClient(Player.getPlayer(interactData.sendPlayerId), ActionEvent.net_Interact, id, false, interactData.configId);
                //仍为发起者
                return;
            }
            if (player.playerId == interactData.accectPlayerId) {

                Event.dispatchToClient(Player.getPlayer(interactData.accectPlayerId), ActionEvent.net_Interact, id, true, interactData.configId);
                //仍为接收者
                return;
            }
        }
        //完全脱离任何交互动作
        Event.dispatchToClient(player, ActionEvent.net_Interact, 0, false, 0);
    }

    /**玩家登录 */
    public net_login(player: mw.Player): void {
        let playerId = player.playerId;
        for (let [id, data] of this.interactPlayers) {
            if (data.sendPlayerId == playerId || data.accectPlayerId == playerId) {
                let accectPlayer = Player.getPlayer(data.accectPlayerId);
                let sendPlayer = Player.getPlayer(data.sendPlayerId);
                accectPlayer.character.collisionWithOtherCharacterEnabled = true;
                data.reLoginLeave();
                this.interactPlayers.delete(id);
                this.leaveCheck(sendPlayer);
                this.leaveCheck(accectPlayer);
            }
        }
    }
}

export class InteractPlayer {
    public sendPlayerId: number = 0;
    public accectPlayerId: number = 0;
    public interactObj: mw.Interactor = null;
    public action: mw.Action = new mw.Action();
    public configId = 0;


    public start(player1: mw.Player, player2: mw.Player | NPCClient, config: ActionBaseCfg) {
        this.configId = config.id;
        if (!this.interactObj) {
            this.interactObj = SpawnManager.spawn({ guid: "Interactor", replicates: true }) as mw.Interactor;
        }
        this.sendPlayerId = player1.playerId;
        let char2: any = null
        player1.character.attachToSlot(this.interactObj, mw.HumanoidSlotType.FaceOrnamental);
        if (player2 instanceof mw.Player) {
            this.accectPlayerId = player2.playerId;
            char2 = player2.character
            char2.collisionWithOtherCharacterEnabled = false;
            GeneralManager.modiftEnterInteractiveState(this.interactObj, char2).then((suc: boolean) => {
                if (!suc) {
                    return;
                }
                this.action.call();
                if (config.sendStance && config.accectStance) {
                    PlayerManagerExtesion.changeStanceExtesion(player2.character, config.accectStance);
                    PlayerManagerExtesion.changeStanceExtesion(player1.character, config.sendStance);
                }
                // PlayerManagerExtesion.changeStanceExtesion(player1.character,config.sendStance);
                // char2.animationStance = config.accectStance;
                this.interactObj.localTransform.position = (config.v);
                this.interactObj.localTransform.rotation = (new mw.Rotation(config.r));
            })
        } else if (player2 instanceof NPCClient) {
            this.accectPlayerId = player2.npcID;
            char2 = player2.npcObj
            this.interactObj.enter(char2, mw.HumanoidSlotType.Buttocks)
            player2.onUse()
            PlayerManagerExtesion.changeStanceExtesion(player1.character, config.sendStance);
            GlobalData.CurInteractNpc = player2.npcID
            this.interactObj.localTransform.rotation = (new mw.Rotation(config.r));
        }
    }

    public leave(): void {
        let accectPlayer: mw.Player | mw.Character = Player.getPlayer(this.accectPlayerId);
        let char2: any = null
        let sendPlayer = Player.getPlayer(this.sendPlayerId);
        if (!accectPlayer) {
            let npcClinet = ModuleService.getModule(NPCModule_C).getNpc(this.accectPlayerId).npcClient
            accectPlayer = npcClinet.npcObj
            char2 = accectPlayer
            GlobalData.CurInteractNpc = -1
            this.interactObj.leave()
            if (npcClinet.trigger.checkInArea(sendPlayer.character))
                npcClinet.trigger.onEnter.broadcast(sendPlayer.character)
            npcClinet.onReturn()

        } else {
            const leaveLoc = accectPlayer.character.worldTransform.getForwardVector().multiply(100)
            leaveLoc.z += 100;
            char2 = accectPlayer.character
            GeneralManager.modifyExitInteractiveState(this.interactObj, char2.worldTransform.position.add(leaveLoc));
            this.interactObj.onLeave.add(() => {
                PlayerManagerExtesion.changeStanceExtesion(sendPlayer.character, "");
                char2.animationStance = "";
            });
        }
        char2.animationStance = "";
        if (sendPlayer) {
            PlayerManagerExtesion.changeStanceExtesion(sendPlayer.character, "");
        }
        // char2.parent = null
        // sendPlayer.character.parent = null
        this.interactObj = null;
    }

    public reLoginLeave(): void {
        let accectPlayer = Player.getPlayer(this.accectPlayerId);
        let sendPlayer = Player.getPlayer(this.sendPlayerId);
        if (accectPlayer) {
            const leaveLoc = accectPlayer.character.worldTransform.getForwardVector().multiply(100)
            leaveLoc.z += 100;
            GeneralManager.modifyExitInteractiveState(this.interactObj, accectPlayer.character.worldTransform.position.add(leaveLoc));
            PlayerManagerExtesion.changeStanceExtesion(accectPlayer.character, "");
        }
        if (sendPlayer) {
            PlayerManagerExtesion.changeStanceExtesion(sendPlayer.character, "");
        }
        // accectPlayer.character.parent = null
        // sendPlayer.character.parent = null
        // setTimeout(() => {
        this.interactObj = null
        // }, 5000);
    }
}