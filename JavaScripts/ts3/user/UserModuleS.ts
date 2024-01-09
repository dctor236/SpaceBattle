
import { UserData } from "./UserData";
import { CoinType, JumpGameData, UserDefine } from "./UserDefine";
import { UserModuleC } from "./UserModuleC";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-25 11:21
 * @LastEditTime : 2023-06-01 18:39
 * @description  : 用户模块
 */

export class UserModuleS extends ModuleS<UserModuleC, UserData>{

    protected override onStart(): void {
        super.onStart();
    }
    protected onPlayerEnterGame(player: mw.Player): void {
        super.onPlayerEnterGame(player);
        //this.loadMainData(player);
    }
    protected onPlayerLeft(player: mw.Player): void {
        this.saveMainData(player);
        super.onPlayerLeft(player);
    }

    /**
     * 消耗
     * @param type 类型
     * @param num 数量
     */

    public net_costCoin(type: CoinType, num: number): boolean {
        return this.currentData.costCoin(type, num, false);
    }
    public costCoin(player: mw.Player, type: CoinType, num: number) {
        let data = this.getPlayerData(player);
        return data.costCoin(type, num, true);
    }
    /**增加 */
    public net_addCoin(type: CoinType, num: number) {
        this.currentData.addCoin(type, num, false);
    }
    public addCoin(player: mw.Player, type: CoinType, num: number) {
        let data = this.getPlayerData(player);
        data.addCoin(type, num, true);
    }
    /**
     * 消耗
     * @param type 类型
     * @param num 数量
     * @returns 足够
     */
    public enough(player: mw.Player, type: CoinType, num: number): boolean {
        let data = this.getPlayerData(player);
        return data.enough(type, num);
    }
    public getGold(player: mw.Player): number {
        let data = this.getPlayerData(player);
        return data.getGold();
    }
    public getGem(player: mw.Player): number {
        let data = this.getPlayerData(player);
        return data.getGem();
    }
    public getMoon(player: mw.Player): number {
        let data = this.getPlayerData(player);
        return data.getMoon();
    }
    //道具相关
    public net_addItem(id, count, player?) {
        if (player) {
            let data = this.getPlayerData(player);
            data.addItem(id, count);
        }
        else if (this.currentData)
            this.currentData.addItem(id, count);
    }
    public net_costItem(id, count, player?): boolean {
        if (player) {
            let data = this.getPlayerData(player);
            return data.costItem(id, count);
        }
        else if (this.currentData)
            return this.currentData.costItem(id, count);
        return false;
    }
    public net_getItemCount(id, player?): number {
        if (player) {
            let data = this.getPlayerData(player);
            return data.getItemCount(id);
        }
        else if (this.currentData)
            return this.currentData.getItemCount(id);
        return 0;
    }
    public getItems(player?) {
        let data = this.getPlayerData(player);
        return data.getItems();
    }

    //装扮相关
    public net_addAvatar(id, player?) {
        if (player) {
            let data = this.getPlayerData(player);
            data.addAvatar(id);
        }
        else if (this.currentData)
            this.currentData.addAvatar(id);
    }
    public net_hasAvatar(id, player?): boolean {
        if (player) {
            let data = this.getPlayerData(player);
            return data.hasAvatar(id);
        }
        else if (this.currentData)
            this.currentData.hasAvatar(id);
    }

    /**********************跳游戏相关数据 **************/
    // async loadMainData(player: mw.Player) {
    //     let key = player?.userId;
    //     if (SystemUtil.isPIE)
    //         return;
    //     let data = await DataStorage.asyncGetOtherGameData(UserDefine.MainGameMwId, key)
    //     this.getClient(player).net_onLeft(JSON.stringify(data));
    // }
    net_onJumpGame() {
        this.currentData.isDataSaved = true;
        return true;
    }
    /**
     * 服务器获得玩家数据
     * @param data 跳游戏得到的
     */
    net_getUserData(data: string) {
        if (!data)
            return;
        let json = JSON.parse(data) as JumpGameData
        this.currentData.initMainData(json, this.currentPlayerId);
    }
    /**
     * 将变化数据存到主游戏
     */
    async saveMainData(player: mw.Player) {
        let pd = this.getPlayerData(player)
        if (!pd) {
            UserDefine.log('退出的用户无数据')
            return;
        }
        if (pd.isDataSaved || pd.isNewUser)
            return;
        let data = pd.getJumpData(2);
        let key = UserDefine.MainDataKey + player.userId;
        DataStorage.asyncSetOtherGameData(UserDefine.MainGameMwId, key, data);
    }
}


