import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
import { GameConfig } from "../../../config/GameConfig";
import { InputManager } from "../../../InputManager";
import GameUtils from "../../../utils/GameUtils";
import { MGSMsgHome } from "../../mgsMsg/MgsmsgHome";
import { ContractType } from "../../relation/RelationData";
import RelationModuleC from "../../relation/RelationModuleC";
import { ModuleBaseC, ModuleBaseS } from "../base/ModuleBase";
import HeadUI from "../ui/head/HeadUI";
enum HeadUIEvent {
    net_AddPeople = "net_AddPeople",
    net_Chat = "net_Chat",
    net_ChangeTitle = "net_ChangeTitle",
}
export class HeadUIModuleC extends ModuleBaseC {
    private uis: Map<number, HeadUI> = new Map<number, HeadUI>();
    private selfName = "";

    /**查看名片cd */
    private isLook = true;

    /**是否在小游戏中 */
    public isGameing: boolean = false;

    protected onStart(): void {
        Event.addServerListener(HeadUIEvent.net_AddPeople, (nameIds: number[], names: string[], titleName: string[], type: ContractType[]) => {
            this.net_AddPeople(nameIds, names, titleName, type)
        })

        Event.addServerListener(HeadUIEvent.net_Chat, (playerId: number, desc: string) => {
            this.net_Chat(playerId, desc)
        })

        Event.addServerListener(HeadUIEvent.net_ChangeTitle, (playerId: number, title: string, type: ContractType) => {
            this.net_ChangeTitle(playerId, title, type)
        })
    }

    //进入场景
    public async onEnterScene(sceneType: number): Promise<void> {
        this.selfName = AccountService.getNickName() || "233Name";
        // RoomService.registerMGSChatMessageEvent(this.chatBack);
        // InputManager.instance.onTouch.add(this.onTouchThis, this);
        // this.initSelf(this.selfName);
    }

    /**
     * 初始化
     */
    public initSelf(name: string): void {
        const relation = ModuleService.getModule(RelationModuleC)
        relation.checkContract();
        const lastContract = relation.lastContract;
        let title = GameConfig.SquareLanguage.Danmu_Content_1106.Value
        switch (lastContract) {
            case ContractType.Ring:
                const connect = relation.connects[lastContract];
                const designation = relation.designations[lastContract];
                title = StringUtil.format(GameConfig.SquareLanguage.Relation_09.Value, connect, designation);
                break;
            default:
                break;
        }
        Event.dispatchToServer(HeadUIEvent.net_AddPeople, name, title, lastContract)
        this.isGameing = false;
    }

    /**
     * 聊天
     * @param content
     */
    public chatBack = (content: string): void => {
        MGSMsgHome.playerCommunication();
        Event.dispatchToServer(HeadUIEvent.net_Chat, content)
    }

    /**
     * 加人
     * @param id
     * @returns
     */
    public net_AddPeople(nameIds: number[], names: string[], titleName: string[], type: ContractType[]): void {
        for (let i = 0; i < nameIds.length; i++) {
            const id = nameIds[i];
            if (this.uis.has(id)) {
                continue;
            }
            let title = titleName[i]
            const player = Player.getPlayer(id)
            let widget = player.character.overheadUI;
            widget.setUIbyID("7EE386804E380932BF41959F2B514BC7"); //头顶ui UI/Chat/HeadUI
            widget.drawSize = new mw.Vector2(351, 123);
            let ui = new HeadUI(widget);
            ui.setName(names[i]);
            ui.setTitle(title, type[i]);
            this.uis.set(id, ui);
        }
    }

    /**
     * 删人
     * @param player
     */
    private removePeople(player: mw.Player): void {
        let id = player.playerId;
        if (this.uis.has(id)) {
            this.uis.delete(id);
        }
    }

    /**
     * 聊天
     * @param id
     * @param desc
     */
    public net_Chat(id: number, desc: string): void {
        if (!this.uis.has(id)) {
            return;
        }
        let ui = this.uis.get(id);
        ui.showChat(desc);
    }

    /**
     * 获取自己名字
     * @returns
     */
    public getSelfName(): string {
        return this.selfName;
    }

    /**
     * 重置称号
     */
    public resetTitle() {
        const relationModuleC = ModuleService.getModule(RelationModuleC)
        const lastContract = relationModuleC.lastContract;
        let name = GameConfig.SquareLanguage.Danmu_Content_1106.Value
        switch (lastContract) {
            case ContractType.Ring:
                const connect = relationModuleC.connects[lastContract];
                const designation = relationModuleC.designations[lastContract];
                name = StringUtil.format(GameConfig.SquareLanguage.Relation_09.Value, connect, designation);
                break;
            default:
                break;
        }
        // this.changeTitle(name, lastContract);
    }

    /**
     * 修改称号接口
     * @param str 称号名
     */
    public changeTitle(str: string, type: ContractType = ContractType.None): void {
        Event.dispatchToServer(HeadUIEvent.net_ChangeTitle, str, type)
    }

    /**
     * 同步玩家称号
     * @param playerId 玩家ID
     * @param title 称号
     */
    public net_ChangeTitle(playerId: number, title: string, type: ContractType): void {
        let ui = this.uis.get(playerId);
        if (!ui) return;
        ui.setTitle(title, type);
    }

    /**
     * 点击角色显示233名片
     * @param hitResArr
     */
    private onTouchThis(hitResArr: Array<mw.HitResult>) {
        if (this.isGameing) return;
        for (let hit of hitResArr) {
            if (!this.isLook) {
                return;
            }
            if (!(PlayerManagerExtesion.isCharacter(hit.gameObject))) {
                continue;
            }
            let character = hit.gameObject as mw.Character;
            if (GameUtils.isPlayerCharacter(hit.gameObject)) {
                continue;
            }
            if (!character?.player) {
                return;
            }
            let openId = character.player.userId;
            console.error("233playerID===   openId  " + openId + "    =====<");
            mw.RoomService.showUserProfile(null, openId);
            this.isLook = false;
            setTimeout(() => {
                this.isLook = true;
            }, 1000);
            return;
        }
    }
}

export class HeadUIModuleS extends ModuleBaseS {
    private _uiData: UIData[] = [];

    protected onStart(): void {
        Event.addClientListener(HeadUIEvent.net_AddPeople, (player: mw.Player, name: string, title: string, type: ContractType) => {
            this.net_AddPeople(player, name, title, type)
        })
        Event.addClientListener(HeadUIEvent.net_Chat, (player: mw.Player, desc: string) => {
            this.net_Chat(player, desc)
        })
        Event.addClientListener(HeadUIEvent.net_ChangeTitle, (player: mw.Player, str: string, type: ContractType) => {
            this.net_ChangeTitle(player.playerId, str, type)
        })
        //坑
        //Player.onPlayerLeave.add(this.removePeople);
    }

    public onPlayerLeft(player: mw.Player): void {
        this.removePeople(player)
    }


    /**加人 */
    public net_AddPeople(player: mw.Player, name: string, title: string = "", type: ContractType): void {
        this._uiData.push({ id: player.playerId, nickName: name, title: title, type: type });
        let data = uiDataEncode(this._uiData);
        player.character.displayName = name;
        //坑
        //Event.dispatchToAllClient(HeadUIEvent.net_AddPeople, data[0], data[1], data[2], data[3])
        const all: mw.Player[] = Player.getAllPlayers();
        for (const p of all) {
            Event.dispatchToClient(p, HeadUIEvent.net_AddPeople, data[0], data[1], data[2], data[3]);
        }
    }
    /**
     * 同步角色称号
     * @param str
     */
    net_ChangeTitle(pid: number, str: string, type: ContractType): void {
        let data = this._uiData.find(i => i.id == pid);
        if (!data) return;
        data.title = str;
        Event.dispatchToAllClient(HeadUIEvent.net_ChangeTitle, pid, str, type)
        // this.getAllClient().net_ChangeTitle(pid, str, color);
    }

    /**
     * 聊天
     * @param desc
     */
    public net_Chat(player: mw.Player, desc: string): void {
        Event.dispatchToAllClient(HeadUIEvent.net_Chat, player.playerId, desc)
        // this.getAllClient().net_Chat(player.playerId, desc);
    }

    private removePeople = (player: mw.Player): void => {
        let index = this._uiData.findIndex(i => i.id === player.playerId);
        if (index === -1) return;
        this._uiData.splice(index, 1);
    }
}

type UIData = {
    id: number;
    nickName: string;
    title: string;
    type: ContractType
};

function uiDataEncode(map: UIData[]) {
    let re: [number[], string[], string[], ContractType[]] = [[], [], [], []];
    for (let data of map) {
        re[0].push(data.id);
        re[1].push(data.nickName);
        re[2].push(data.title);
        re[3].push(data.type);
    }
    return re;
}
