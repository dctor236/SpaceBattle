/**aits-ignore */
import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
import { GameConfig } from "../../config/GameConfig";
import { TS3 } from "../../ts3/TS3";
import { BagModuleC } from "../bag/BagModuleC";

/**角色动作类,用来控制玩家在某一个时刻的动作,姿态 */
export class CharAction {
    /**当前播放的姿态 */
    private stance: mw.SubStance;
    /**当前播放的动画*/
    private animation: mw.Animation;
    /**动作配置表ID */
    public cfgId: number;
    /**当前姿态/动作是否正在播放 */
    private _isPlaying: boolean = false;
    /**当前控制的角色 */
    public owner: mw.Character;

    constructor() {
    }

    /**
     * 初始化函数
     * @param char 角色对象 
     * @param cfgId 动作配置id
     */
    public async init(char: mw.Character, cfgId: number) {
        this.owner = char;
        this.cfgId = cfgId;
        let cfg = GameConfig.Action.getElement(cfgId);
        if (cfg) {
            if (cfg.stanceGuid) {
                if (!AssetUtil.assetLoaded(cfg.stanceGuid)) {
                    await AssetUtil.asyncDownloadAsset(cfg.stanceGuid);
                }
                this.stance = this.owner.loadSubStance(cfg.stanceGuid.toString())
                // PlayerManagerExtesion.changeStanceExtesion(this.owner, cfg.stanceGuid.toString())
                //配置的是1-3，实际是0-2
                // if (cfg.stanceSlot > 0) {
                this.stance.blendMode = mw.StanceBlendMode.WholeBody;
                // }
            }

            if (cfg.animationGuid) {
                if (!AssetUtil.assetLoaded(cfg.animationGuid)) {
                    await AssetUtil.asyncDownloadAsset(cfg.animationGuid);
                }
                this.animation = this.owner.loadAnimation(cfg.animationGuid)
                this.animation.loop = cfg.times;
                this.animation.slot = mw.AnimSlot.FullyBody;
                this.animation.speed = cfg.animationRate
            }
            // console.log("hjkljkljlkjklj", cfg.animationSlot, cfg.stanceSlot)
        }

        if (this._isPlaying) {
            this.play();
        }
    }
    /**
    *停止播放该角色动画
    */
    public stop() {
        // oTraceError("--------->停止播放动画", this.cfgId);
        ActionMgr.stopFlag = Date.now();
        const elem = GameConfig.Action.getElement(this.cfgId)
        if (this.stance) {
            this.stance.stop();
            oTraceError("--------->停止播放stance", this.cfgId);
            // PlayerManagerExtesion.stopStanceExtesion(this.owner, SystemUtil.isServer());
        }
        if (this.animation) {
            oTraceError("--------->停止播放anim", this.cfgId);
            this.animation.stop();
            // this.owner["ueCharacter"]["StopAnimMontage"]();
            // PlayerManagerExtesion.rpcStopAnimation(this.owner, elem.animationGuid.toString());
        }
        this._isPlaying = false;
    }

    /**
     * 播放该角色动画
     * @param cb 播放完成的回调,确保动作次数为有限次时调用
     */
    public play(cb: () => void = null) {
        ActionMgr.stopFlag = 0;
        // oTraceError("--------->播放动画", this.cfgId, this.owner.displayName);
        this._isPlaying = true;
        if (this.stance) {
            this.stance.play();
        }
        if (this.animation && this.animation.isPlaying == false) {
            this.animation.play();
            this.animation.onFinish.clear()
            let cfg = GameConfig.Action.getElement(this.cfgId);
            if (cfg.times > 0) {
                const times = this.animation.length// <= 0.6 ? this.animation.length : 0.6
                setTimeout(() => {
                    ActionMgr.stopAction();
                    cb && cb()
                }, times * 1000);
            }
            // this.animation.onFinish.add(() => {
            //     ActionMgr.stopAction();
            //     cb && cb()
            // })
        }
    }

    /**获取动作是否正在播放 */
    public get isPlaying() {
        if (this.stance) {
            return true;
        }
        if (this.animation) {
            return this.animation.isPlaying;
        }
        return false;
    }
}

/**角色动作管理器,
 * 用于管理对象身上配置的动作属性
 */
export default class ActionMgr {
    /**管理所有正在执行的角色动作类的字典对象,静态类型*/
    private static allActonMap: Map<string, { lastAction: number, curAction: number, inteval: any, actions: CharAction[] }> = new Map();

    /**
     * 播放角色动作
     * @param cfgId 动作配置id
     * @param char 角色对象
     * @param cb 播放完成回调,确保为有限次的动画播放才生效
     * @returns 角色动作类
     */
    public static playAction(cfgId: number, char: mw.Character = Player.localPlayer.character, cb: () => void = null) {
        const gid = char.gameObjectId
        if (!this.allActonMap.has(gid)) {
            this.allActonMap.set(gid, { lastAction: null, curAction: null, inteval: null, actions: [] })
        }
        const curAction = this.allActonMap.get(gid).curAction
        // if (curAction && curAction == cfgId) {
        //     return;
        // }
        let cfg = GameConfig.Action.getElement(cfgId);
        if (cfg == null) return;
        const list = [320, 321, 322, 407, 408, 410, 411, 412]
        if (list.indexOf(cfg.ID) != -1 && cfg.times == 0) {
            this.allActonMap.get(gid).lastAction = cfgId;
        }
        this.allActonMap.get(gid).curAction = cfgId;
        if (curAction) {
            // if (curAction.priority > cfg.priority) {
            //     return;
            // }
            // else {
            this.stopAction(char.gameObjectId)
            this.getAction(cfgId, char).play(() => {
                cb && cb()
                //上个是循环动作播完这个一次性动作切换到循环
                if (cfg.times > 0 && this.allActonMap.get(gid).lastAction) {
                    const lastEelm = GameConfig.Action.getElement(this.allActonMap.get(gid).lastAction);
                    if (lastEelm.times != 0) return
                    this.getAction(this.allActonMap.get(gid).lastAction, char).play();
                    this.allActonMap.get(gid).curAction = this.allActonMap.get(gid).lastAction
                }
            });
            // }
        }
        else {
            this.getAction(cfgId, char).play(() => {
                cb && cb()
                if (cfg.times > 0 && this.allActonMap.get(gid).lastAction) {
                    const lastEelm = GameConfig.Action.getElement(this.allActonMap.get(gid).lastAction);
                    if (lastEelm.times != 0) return
                    this.getAction(this.allActonMap.get(gid).lastAction, char).play();
                    this.allActonMap.get(gid).curAction = this.allActonMap.get(gid).lastAction
                }
            });
        }
    }

    /**
     * 获取对象某一个配置表id下的动作类
     * @param cfgId 动作配置id
     * @param char 角色对象
     * @returns 返回动作对象
     */
    private static getAction(cfgId: number, char: mw.Character = Player.localPlayer.character) {
        const gid = char.gameObjectId
        let info = this.allActonMap.get(gid)
        let vec = info.actions
        let action = vec.find(e => e.cfgId == cfgId);
        if (!action) {
            action = new CharAction();
            action.init(char, cfgId);
            vec.push(action)
            this.allActonMap.set(gid, info)
        }
        return action;
    }

    /**判断动作是否已经停止的标识变量 */
    public static stopFlag: number = 0;

    /**
     * 通过不同动作之间的权重值,合理地停止对象的当前动作
     * @param gid 对象guid
     * @param isForce 不顾所有规则,是否强制停止
     * @returns 无
     */
    public static stopAction(gid: string = TS3.playerMgr.mainGuid, isForce: boolean = false) {
        if (!this.allActonMap.has(gid))
            return
        console.log("stopAction1")
        let info = this.allActonMap.get(gid)
        const p = TS3.playerMgr.getPlayer(gid)
        if (info.curAction) {
            console.log("stopAction2")
            if (SystemUtil.isClient() && gid == TS3.playerMgr.mainGuid) {
                console.log("stopAction3")
                const curSel = Number(ModuleService.getModule(BagModuleC).curEquip)
                // const vec = ["140006", "140011", "140012", "140016"]
                if (!(Math.floor(curSel / 10) >= 30 && Math.floor(curSel / 10) < 40)) {
                    this.getAction(info.curAction, info.actions[0].owner).stop();
                    info.lastAction = null
                    info.curAction = null;
                }
            } else {
                this.getAction(info.curAction, info.actions[0].owner).stop();
                info.lastAction = null
                info.curAction = null;
            }
            if (isForce) {
                this.getAction(info.curAction, info.actions[0].owner).stop();
                info.lastAction = null
                info.curAction = null;
            }
        }
        if (info.inteval) return;
        info.inteval = setInterval(() => {
            if (this.stopFlag == 0) return;
            if (Date.now() - this.stopFlag > 800) {
                Event.dispatchToLocal("ActionStop", gid);
                this.stopFlag = 0;
            }
        }, 50)
    }
}