
import { GlobalData } from "../../const/GlobalData";
import { UserData } from "./UserData";
import { CoinType, ItemInfo, JumpGameData, JumpItemData, JumpItemType, UserDefine } from "./UserDefine";
import { UserModuleS } from "./UserModuleS";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-25 11:21
 * @LastEditTime : 2023-06-27 17:35
 * @description  : 用户模块
 */
export class UserModuleC extends ModuleC<UserModuleS, UserData>{

    private hasData: boolean = false;
    private checkTime = 0;
    protected onEnterScene(sceneType: number): void {
        this.initData();
        //进入到场景就算初始化完成，主游戏数据不一定初始化
        UserDefine.inited = true;
        // this.testAvatar();
    }

    protected onUpdate(dt: number): void {
        if (UserDefine.inited && !this.hasData) {
            this.checkTime += dt;
            if (this.checkTime > 6) {
                this.checkTime = 0;
                this.hasData = true;
                UserDefine.log('no jumpdata go back');
                if (GlobalData.forceToMain)
                    RouteService.enterNewGame(UserDefine.MainGameMwId, null);
            }
        }
    }

    public testAvatar() {
        let list: JumpItemData[] = [];
        let v1: JumpItemData = {
            type: JumpItemType.Gold,
            data: 123,
        }
        list.push(v1);

        let v3: JumpItemData = {
            type: JumpItemType.Item,
            data: [{ id: 11101, count: 1 }]
        }
        list.push(v3);

        let v4: JumpItemData = {
            type: JumpItemType.Avatar,
            data: [null, 12],
        }
        list.push(v4);

        let v5: JumpItemData = {
            type: JumpItemType.Avatars,
            data: [12, 11],
        }
        list.push(v5);

        let data: JumpGameData = {
            type: 3,
            home: '',
            way: 1,
            data: list
        }
        let jumpData = JSON.stringify(data);
        UserDefine.log('testAvatar', jumpData);
        this.server.net_getUserData(jumpData);
        this.data.initMainData(data);
        UserDefine.dataReady = true;
        this.hasData = true;
    }

    public async init() {
        return new Promise((resolve) => {
            let idx = 0;
            const intervalId = setInterval(() => {
                if (UserDefine.inited) {
                    clearInterval(intervalId);
                    resolve(true);
                }
                idx++;
                if (idx > 20) {
                    UserDefine.log('User init timeout');
                    UserDefine.inited = true;
                }
            }, 100);
        });
    }
    /**
     * 当前货币
     */
    public get curGold(): number {
        return this.data.getGold();
    }
    /**
     * 当前宝石
     */
    public get curGem(): number {
        return this.data.getGem();
    }
    public get curMoon(): number {
        return this.data.getMoon();
    }

    public addCoin(type: CoinType, num: number) {
        this.data.addCoin(type, num);
        this.server.net_addCoin(type, num);
        //货币变化，增加
        Event.dispatchToLocal(UserDefine.Event_Coin_Change, true);
    }
    /**
     * 消耗
     * @param type 类型
     * @param num 数量
     * @returns 成功
     */
    public costCoin(type: CoinType, num: number): boolean {
        let suc = this.data.costCoin(type, num);
        this.server.net_costCoin(type, num);
        //货币变化，减少
        Event.dispatchToLocal(UserDefine.Event_Coin_Change, false);
        return suc;
    }

    /**
     * 足够否
     * @param type 类型
     * @param num 数量
     * @returns 足够
     */
    public enough(type: CoinType, num: number): boolean {
        return this.data.enough(type, num);
    }

    //道具相关
    public addItem(id: number, count = 1) {
        this.data.addItem(id, count);
        this.server.net_addItem(id, count);
    }
    public costItem(id: number, count = 1): boolean {
        let cost = this.data.costItem(id, count);
        if (cost)
            this.server.net_costItem(id, count);
        return cost;
    }
    public getItemCount(id: number): number {
        return this.data.getItemCount(id);
    }
    public getItems(): ItemInfo[] {
        return this.data.getItems();
    }

    //装扮相关
    public addAvatar(id: number) {
        this.data.addAvatar(id);
        this.server.net_addAvatar(id);
    }
    public hasAvatar(id: number): boolean {
        return this.data.hasAvatar(id);
    }
    public getAllAvatars() {
        return this.data.avatars;
    }
    public getCurAvatar() {
        return this.data.avatar;
    }
    // public setCurAvatar(str: string | string[], put: boolean) {
    //     if (Array.isArray(str))
    //         this.data.avatar = str;
    //     else if (typeof str == 'string') {
    //         let idx = this.data.avatar.indexOf(str);
    //         if (put && idx < 0)
    //             this.data.avatar.push(str);
    //         if (!put && idx >= 0)
    //             this.data.avatar.splice(idx, 1);
    //     }
    // }
    /************************子游戏数据相关***********************/
    /**
     * 初始化子游戏数据
     * 1:跳转传数据
     * 2:去主游戏获取
     */
    async initData() {
        UserDefine.log('initData jumpdata')
        RouteService.getGameCarryingData().then((data) => {
            UserDefine.log('jump data', data)
            if (data) {
                this.server.net_getUserData(data);
                this.data.initMainData(JSON.parse(data));
                UserDefine.dataReady = true;
                this.hasData = true;
            }
        })
    }


    public async getJumpData() {
        if (this.data.isNewUser)
            return null;
        await this.server.net_onJumpGame();
        return this.data.getJumpData(1);
    }
    public net_onLeft(key: string) {
        UserDefine.log('net_onLeft', key);
    }
}