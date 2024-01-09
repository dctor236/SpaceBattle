import { MGSMsgHome } from "../../modules/mgsMsg/MgsmsgHome";
import { UserData } from "./UserData";
import { CoinType, ItemInfo, UserDefine } from "./UserDefine";
import { UserModuleC } from "./UserModuleC";
import { UserModuleS } from "./UserModuleS";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-25 11:20
 * @LastEditTime : 2023-06-27 17:14
 * @description  :  用户模块管理器
 */
export class UserMgr {
    private static _inst: UserMgr;
    public static get Inst() {
        if (!this._inst)
            this._inst = new UserMgr();
        return this._inst;
    }
    private moduleC: UserModuleC;
    private moduleS: UserModuleS;

    private inited = 0;
    public async init() {
        if (this.inited > 0)
            return;
        this.inited = 1;
        ModuleService.registerModule(UserModuleS, UserModuleC, UserData);
        if (SystemUtil.isClient()) {
            this.moduleC = ModuleService.getModule(UserModuleC);
            await this.moduleC.init();
            // let player = await Player.asyncGetLocalPlayer();
            // await player.asyncReady();
            // // UserDefine.log('用户信息', player.playerId, player.userId);
            // Player.onPlayerReconnect.add(() => {
            //     this.jumpMainGame();
            // })
        }
        else {
            this.moduleS = ModuleService.getModule(UserModuleS);
        }
        this.inited = 2;
        UserDefine.log('用户模块初始化完成')
    }
    public async dataReady() {
        if (this.inited < 1)
            this.init();
        return new Promise((resolve) => {
            let num = 0;
            const intervalId = setInterval(() => {
                num++;
                if ((this.inited > 1 && UserDefine.dataReady) || num > 30) {
                    clearInterval(intervalId);
                    resolve(true);
                }
            }, 100);
        });
    }
    /**
     * 当前金币量
     */
    public getGlod(player?: mw.Player): number {
        if (this.isVoid)
            return 0;
        if (SystemUtil.isClient())
            return this.moduleC.curGold;
        else
            return this.moduleS.getGold(player);
    }
    /**
     * 当前宝石量量
     */
    public getGem(player?: mw.Player): number {
        if (this.isVoid)
            return 0;
        if (SystemUtil.isClient())
            return this.moduleC.curGem;
        else
            return this.moduleS.getGem(player);
    }
    /**
     * 当前月亮币
     */
    public getMoon(player?: mw.Player): number {
        if (this.isVoid)
            return 0;
        if (SystemUtil.isClient())
            return this.moduleC.curMoon;
        else
            return this.moduleS.getMoon(player);
    }
    /**
     * 添加货币
     * @param type 类型
     * @param num  数量
     * @param player 服务端需要
     */
    public addCoin(type: CoinType, num: number, player?: mw.Player) {
        if (this.isVoid)
            return;
        if (SystemUtil.isClient())
            this.moduleC.addCoin(type, num);
        else
            this.moduleS.addCoin(player, type, num);
    }
    /**
     * 消耗货币，C端验证同步到S
     * @param type 类型 
     * @param num 数量
     * @param player 服务端需要
     * @returns 
     */
    public costCoin(type: CoinType, num: number, player?: mw.Player): boolean {
        if (this.isVoid)
            return false;
        if (SystemUtil.isClient())
            return this.moduleC.costCoin(type, num);
        else
            return this.moduleS.costCoin(player, type, num);
    }
    /**
     * 判断货币是否足够
     * @param type 类型
     * @param num  数量
     * @param player 服务端需要
     * @returns 
     */
    public enough(type: CoinType, num: number, player?: mw.Player): boolean {
        if (this.isVoid)
            return false;
        if (SystemUtil.isClient())
            return this.moduleC.enough(type, num);
        else
            return this.moduleS.enough(player, type, num);
    }

    /**
     * 添加道具
     * @param id 道具id
     * @param count 数量
     * @param player 服务端需要
     */
    public addItem(id: number, count = 1, player?: mw.Player) {
        if (this.isVoid)
            return;
        if (SystemUtil.isClient())
            this.moduleC.addItem(id, count);
        else if (player)
            this.moduleS.net_addItem(id, count, player);
    }

    /**
     * 
     * @param id  道具id
     * @param count  数量
     * @param player  服务端需要
     * @returns 
     */
    public costItem(id: number, count = 1, player?: mw.Player): boolean {
        if (this.isVoid)
            return false;
        if (SystemUtil.isClient())
            return this.moduleC.costItem(id, count);
        else if (player)
            return this.moduleS.net_costItem(id, count, player);
    }
    /**
     * 获取道具数量
     * @param id 道具id
     * @param player    服务端需要
     * @returns 
     */
    public getItemCount(id: number, player?: mw.Player): number {
        if (this.isVoid)
            return 0;
        if (SystemUtil.isClient())
            return this.moduleC.getItemCount(id);
        else if (player)
            return this.moduleS.net_getItemCount(id, player);
    }
    /**
     * 
     * @returns 获取所有道具
     */
    public getItems(player?: mw.Player): ItemInfo[] {
        if (this.isVoid)
            return [];
        if (SystemUtil.isClient())
            return this.moduleC.getItems();
        else if (player)
            return this.moduleS.getItems(player);
    }

    /**
     * 添加装扮
     * @param id 装扮配置ID
     */
    // public addAvatar(id: number, player?: mw.Player) {
    //     if (this.isVoid)
    //         return;
    //     if (SystemUtil.isClient())
    //         this.moduleC.addAvatar(id);
    //     else if (player)
    //         this.moduleS.net_addAvatar(id, player);
    // }

    /**
     * 是否拥有此装扮
     * @param id 装扮ID
     * @param player  服务端需要
     * @returns 
     */
    public hasAvatar(id: number, player?: mw.Player): boolean {
        if (this.isVoid)
            return false;
        if (SystemUtil.isClient())
            return this.moduleC.hasAvatar(id);
        else if (player)
            return this.moduleS.net_hasAvatar(id, player);
    }

    /**获取带过来的衣服数据 */
    public getAvatars(): number[] {
        if (this.isVoid || !SystemUtil.isClient())
            return [];
        return this.moduleC.getAllAvatars();
    }
    /**
     * 获取当前自定义装扮列表
     * @returns 
     */
    public getCurAvatar(): number[] {
        if (this.isVoid || !SystemUtil.isClient())
            return [];
        return this.moduleC.getCurAvatar();
    }
    /**
     * 设置当前自定义装扮
     * @param str 一个装扮资源，或者重置一个列表
     * @param put 装上or取下
     */
    // public setCurAvatar(str: string | string[], put: boolean) {
    //     if (this.isVoid || !SystemUtil.isClient())
    //         return;
    //     this.moduleC.setCurAvatar(str, put);
    // }


    public get isVoid() {
        if (this.inited < 2) {
            UserDefine.log('用户模块未初始化')
            return true;
        }
        return false;
    }

    /*****************跳游戏相关 */
    /**
     * 跳回主游戏
     * @returns 
     */
    public async jumpMainGame() {
        if (SystemUtil.isServer()) {
            UserDefine.log('服务器无法单独跳转游戏')
            return;
        }
        let data = await this.moduleC.getJumpData();
        UserDefine.log('jumpMainGame', UserDefine.MainGameMwId, data);
        this.sendEvent()
        RouteService.enterNewGame(UserDefine.MainGameMwId, data);
    }
    // public async saveData(type) {
    //     this.moduleC.saveData(type);
    // }
    public sendEvent() {
        const msg = MGSMsgHome.get("ts_game_over");
        msg.data = { scene_id: UserDefine.SubGameType };
        msg.send("跳游戏");
    }
}
