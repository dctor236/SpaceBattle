import { TrrigerType } from "../../../const/GameEnum";
import { getMyPlayerID } from "../../../ExtensionType";

export class InteractiveHelper {
    /**添加“退出交互”回调(客户端) */
    public static addExitInteractiveListener: (type: number, callback: () => void) => void;
    /**移除“退出交互”回调(客户端) */
    public static removeExitInteractiveListener: () => void;

    /**显示选择UI(客户端) */
    public static showSelectUI: (icoList: string[], selectCallback: (index: number) => void) => void;
    /**关闭选择UI(客户端) */
    public static hideSelectUI: () => void;
    //自定义部分=========================================================================================================================
    /**显示QTE小游戏 回调的参数是成功失败 */
    public static showQTEGame: (gameName: string, callBack: (res: boolean) => void, ...param: any) => void
    /**隐藏QTE小游戏 */
    public static hideQTEGame: (gameName: string) => void;
    //外部激活条件判断(???)
    public static activeConditions: (param: string) => boolean;
    //外部行为(???)
    public static onPlayerAction: (playerId: number, active: boolean, param: string) => boolean;
    /**潘多拉埋点(客户端) */
    public static onPandoraAnalytics: (guid: string, tag: string, active: boolean, needExit: boolean) => void;
    /**设置一个玩家的交互状态(服务端) */
    public static onPlayInteract: (player: mw.Player | number, state: boolean) => void;
    /**判断玩家当前的状态是否可以交互(服务器&客户端) */
    public static playInteractionEnable: (player: mw.Player | number) => boolean;
    //提示
    public static showTips: (text: string) => void;

    public static cdIngTips = "";

    public static interactArr: InteractObject[] = []
    public static interactLocArr: { script: InteractObject, location: mw.Vector, activeDis: number }[] = []
}
export class InteractPlayerMsg {
    /**交互物中的人 */
    private static playerSet: Set<number> = new Set();
    //记录玩家加入交互物
    public static addPlayer(player: number | mw.Player): void {
        let playerId: number = this.getPlayerId(player);
        this.playerSet.add(playerId);
    }

    //记录玩家离开交互物
    public static removePlayer(player: number | mw.Player): void {
        let playerId: number = this.getPlayerId(player);
        this.playerSet.delete(playerId);
    }
    public static has(player: number | mw.Player): boolean {
        let playerId: number = this.getPlayerId(player);
        return this.playerSet.has(playerId);
    }
    private static getPlayerId(player: number | mw.Player): number {
        if (player instanceof mw.Player) return player.playerId;
        return player;
    }
}

class Interval {
    public updateInterval: number = 5;
}
//交互对象,上面挂行为能力的前后端逻辑
export default abstract class InteractObject extends mw.Script {
    @mw.Property({ replicated: true, displayName: "是否阻塞后续联动", group: "关联" })
    public blockInteractNext: boolean = false;
    @mw.Property({ replicated: true, displayName: "下一个脚本", group: "关联" })
    public nextInteractGuid: string = ""
    @mw.Property({ replicated: true, displayName: "是否独享", group: "属性" })
    public own: boolean = false;
    @mw.Property({ replicated: true, displayName: "是否是动态交互物", group: "属性" })
    public isDynamic: boolean = false
    @mw.Property({ replicated: true, hideInEditor: true, onChanged: "inPlayerIdChange" })
    public ownerPlayerIds: number[] = [0];//当前与之交互的玩家id
    @mw.Property({ replicated: true, hideInEditor: true })
    public isClient: number = 1;

    public interval: Interval = new Interval()
    public onTrriger: boolean = false
    //#region 区分前后端
    private objLogicS: InteractLogic_S<any>;
    private objLogicC: InteractLogic_C<any>;
    protected init(ServerClass: { new(objScript: InteractObject): InteractLogic_S<any> }, ClientClass: { new(objScript: InteractObject): InteractLogic_C<any> }) {
        if (SystemUtil.isClient()) {
            this.objLogicC = new ClientClass(this);
        }
        if (SystemUtil.isServer()) {
            this.objLogicS = new ServerClass(this);
            this.isClient = -1
        }
    }
    public get logic(): InteractLogic<any> {
        if (SystemUtil.isClient()) {
            return this.objLogicC;
        } else {
            return this.objLogicS;
        }
    }
    protected onUpdate(dt: number): void {
        this.objLogicS?.onUpdate(dt);
        this.objLogicC?.onUpdate(dt);
    }
    protected onDestroy(): void {
        if (this.objLogicS != null) {
            if (this.own && this.ownerPlayerIds[0] != 0) {
                InteractiveHelper.onPlayInteract(this.ownerPlayerIds[0], false);
            }
            this.objLogicS["destroy"]();
            this.objLogicS = null;
        }
        if (this.objLogicC != null) {
            if (this.ownerPlayerIds.includes(getMyPlayerID())) {
                this.objLogicC.onPlayerAction(getMyPlayerID(), false, null)
            }
            this.objLogicC["destroy"]();
            this.objLogicC = null;
        }
    }
    //#endregion

    public onEnterTrriger() {

    }
    public onLeaveTrriger() {

    }
    public onStateTrriger() {

    }
}
//交互对象的行为逻辑 在这个基础上分出: 能力逻辑_S 和 能力逻辑_C
abstract class InteractLogic<T extends InteractObject> {
    private objScript: T;
    constructor(objScript: T) {
        if (objScript) {
            this.objScript = objScript;
            setTimeout(() => {
                this.scriptInit();
            }, 1000);
        }
    }
    //初始化
    protected scriptInit() {
        try { this.onStart(); } catch (e) { }
        if (SystemUtil.isClient()) {
            setTimeout(() => {
                InteractiveHelper.interactArr.push(this.objScript)
                if (this.objScript["isTrriger"] && this.objScript["isTrriger"] as TrrigerType.Distance == TrrigerType.Distance) {
                    InteractiveHelper.interactLocArr.push({ script: this.objScript, location: this.gameObject.worldTransform.position, activeDis: this.objScript["activeDis"] })
                }
            }, 1000);
        } else {
            InteractiveHelper.interactArr.push(this.objScript)
        }
    }
    //游戏对象上挂载的原始脚本
    protected get info(): T {
        return this.objScript;
    }
    //游戏对象
    protected get gameObject(): mw.GameObject {
        return this.info.gameObject;
    }
    protected get guid(): string {
        return this.info.guid;
    }
    protected get name(): string {
        return this.info.name;
    }
    //是否开启Update
    protected set useUpdate(value: boolean) {
        this.info.useUpdate = value;
    }

    //启动调用
    protected abstract onStart(): void;
    /**激活或者反激活时调用 交互物事件的开始 */
    public onPlayerAction(playerId: number, active: boolean, param?: any): void { }
    //刷新时调用(需要请重写，需要开启:this.useUpdate=true)
    public onUpdate(dt: number): void { };
    protected destroy(): void {
        for (let i = 0; i < InteractiveHelper.interactArr.length; i++) {
            if (InteractiveHelper.interactArr[i].guid == this.objScript.guid) {
                InteractiveHelper.interactArr.splice(i, 1)
                break;
            }
        }
        for (let i = 0; i < InteractiveHelper.interactLocArr.length; i++) {
            if (InteractiveHelper.interactLocArr[i].script.guid == this.objScript.guid) {
                InteractiveHelper.interactLocArr.splice(i, 1)
                break;
            }
        }
        this.objScript.onLeaveTrriger()
        this.objScript = null;
    }
}
//==============================================================================================================
//交互行为-服务端
export abstract class InteractLogic_S<T extends InteractObject> extends InteractLogic<T> {
    /**激活或者反激活时调用 交互物事件的开始 */
    public abstract onPlayerAction(playerId: number, active: boolean, param: any): void
}
//交互行为-客户端
export abstract class InteractLogic_C<T extends InteractObject> extends InteractLogic<T> {
    public abstract onPlayerAction(playerId: number, active: boolean, param: any): void
}