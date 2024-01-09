import { GlobalModule } from "../../const/GlobalModule";
import { CoinType, ItemInfo, JumpItemType, JumpItemData, UserDefine, JumpGameData } from "./UserDefine";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-25 11:20
 * @LastEditTime : 2023-06-27 16:58
 * @description  : 
 */
export class UserData extends Subdata {

    /**
     * 子游戏需要保存的数据
     */
    // @Decorator.persistence()
    // //货币数量
    // public goldNum: number = 0;
    // @Decorator.persistence()
    // public gemNum: number = 0;
    get dataName() {
        return '_UserData'
    }
    /**获取主游戏的数据，不需要存储 */
    //主游戏货币1
    public subNum1: number = -1;
    //主游戏货币2
    public subNum2: number = -1;
    public subNum3: number = -1;
    //道具列表
    public items: Map<number, ItemInfo>;
    //已解锁的装扮列表
    public avatars: number[];
    //当前装扮
    public avatar: number[];

    private lastTime = 0;

    public saveData(s2c: boolean) {
        //10秒才保存一次
        let nt = TimeUtil.elapsedTime();
        if (nt - this.lastTime < 10)
            return;
        this.lastTime = nt;
        this.save(s2c);
    }
    protected onDataInit(): void {
        if (!this.items)
            this.items = new Map<number, ItemInfo>();
        if (!this.avatars)
            this.avatars = [];
        if (!this.avatar)
            this.avatar = [];
    }
    protected initDefaultData(): void {
        super.initDefaultData();
        this.onDataInit();
    }

    /**
     * 增加货币
     * @param type 货币类型
     * @param num 数量
     * @param s2c 是否同步到客户端
     */
    public addCoin(type: CoinType, num: number, s2c = false) {
        if (type == CoinType.Gold)
            this.subNum1 += num;
        else if (type == CoinType.Gem)
            this.subNum2 += num;
        else if (type == CoinType.Moon)
            this.subNum3 += num;
        this.saveData(s2c);
    }
    /**
     * 消耗货币
     * @param type 类型
     * @param num 数量
     * @param s2c 是否同步到客户端
     * @returns  是否成功
     */
    public costCoin(type: CoinType, num: number, s2c = false): boolean {
        if (!this.enough(type, num))
            return false;
        if (type == CoinType.Gold)
            this.subNum1 -= num;
        else if (type == CoinType.Gem)
            this.subNum2 -= num;
        else if (type == CoinType.Moon)
            this.subNum3 -= num;
        this.saveData(s2c);
        return false;
    }
    /**
     * 消耗货币
     * @param type 类型
     * @param num 数量
     * @returns  是否成功
     */
    public enough(type: CoinType, num: number) {
        if (type == CoinType.Gold)
            return this.subNum1 >= num;
        else if (type == CoinType.Gem)
            return this.subNum2 >= num;
        else if (type == CoinType.Moon)
            return this.subNum3 >= num;
        return false
    }
    /**
     * 获取当前货币
     */
    public getGold(): number {
        return this.subNum1;
    }
    /**
     * 获取当前货币
     */
    public getGem(): number {
        return this.subNum2;
    }
    public getMoon(): number {
        return this.subNum3;
    }

    public addItem(id, count = 1) {
        let item = this.getItem(id);
        if (item)
            item.count += count;
        else {
            item = {
                id: id,
                count: count,
            }
        }
        this.items.set(id, item);
    }
    public costItem(id, count = 1): boolean {
        let item = this.getItem(id);
        if (item && item.count >= count) {
            item.count -= count;
            this.items.set(id, item);
            return true;
        }
        return false;
    }
    public getItemCount(id: number): number {
        let item = this.getItem(id);
        return item ? item.count : 0;
    }
    public getItems(): ItemInfo[] {
        return Array.from(this.items.values());
    }
    public getItem(id: number) {
        return this.items.get(id);
    }
    public addAvatar(id: number) {
        if (!this.hasAvatar(id))
            this.avatars.push(id)
    }
    public hasAvatar(id: number): boolean {
        return this.avatars.indexOf(id) >= 0;
    }

    /************************子游戏相关*********************/
    public getAvatars(): number[] {
        //从装扮模块获取已经解锁的装扮
        this.avatars = GlobalModule.MyPlayerC?.getDataByPlayer(0).allSuit;
        return this.avatars;
    }

    public getAvatar(): any[] {
        //从装扮模块获取当前装扮了哪些资源ID
        this.avatar = GlobalModule.MyPlayerC?.getDataByPlayer(0).equipID;
        return this.avatar;
    }

    public isDataSaved = false;
    public isNewUser = true;
    /**
     * 将主游戏数据解析成子游戏的数据
     * @param data json格式的数据
     */
    public initMainData(data: JumpGameData, pid = 0) {
        if (!data)
            return;
        this.isNewUser = false;
        let info = data.data;
        UserDefine.MainGameMwId = data.home;
        //UserDefine.log('数据初始化', info, UserDefine.SubGameType);
        for (let k in info) {
            let v = info[k] as JumpItemData;
            //UserDefine.log('数据初始化', k, v);
            switch (v.type) {
                case JumpItemType.Gold:
                    this.subNum1 = v.data;
                    break;
                case JumpItemType.Gem:
                    this.subNum2 = v.data;
                    break;
                case JumpItemType.Moon:
                    this.subNum3 = v.data;
                    break;
                case JumpItemType.Item:
                    for (let d of v.data) {
                        this.addItem(d.id, d.count)
                        UserDefine.log('道具初始化', d.id, d.count);
                    }
                    break;
                case JumpItemType.Avatar:
                    if (v.data && v.data.length > 0) {
                        this.avatar = v.data;
                        if (SystemUtil.isClient()) {
                            //换装扮形象
                            GlobalModule.MyPlayerC?.getDataByPlayer(0)?.saveEquips(v.data);
                            //GlobalModule.MyPlayerC?.Cloth.configChangeCloth();
                        }
                    }
                    break;
                case JumpItemType.Avatars:
                    if (v.data)
                        this.avatars = v.data;
                    if (SystemUtil.isServer() && pid > 0 && this.avatars.length > 0) {
                        GlobalModule.MyPlayerS.getDataByPlayer(pid)?.saveSuits(this.avatars);
                    }
                    break;
                default:
                    UserDefine.log('未知的子游戏数据类型：' + v.type);
                    break;
            }
        }
        UserDefine.log('子游戏数据初始化完成', this.subNum1, this.items.size, this.avatars.length);
    }
    /**
     * 主游戏的数据变化后回传，客户端获取后，服务器不再保存
     * @param way 数据方式
     */
    public getJumpData(way: number): string {

        let list: JumpItemData[] = []
        if (this.subNum1 >= 0) {
            let v1: JumpItemData = {
                type: JumpItemType.Gold,
                data: this.subNum1,
            }
            list.push(v1);
        }

        if (this.subNum2 >= 0) {
            let v2: JumpItemData = {
                type: JumpItemType.Gem,
                data: this.subNum2,
            }
            list.push(v2);
        }

        if (this.subNum3 >= 0) {
            let v0: JumpItemData = {
                type: JumpItemType.Moon,
                data: this.subNum3,
            }
            list.push(v0);
        }

        if (this.items.size > 0) {
            let v3: JumpItemData = {
                type: JumpItemType.Item,
                data: this.getItems(),
            }
            list.push(v3);
        }

        this.getAvatar();
        this.getAvatars();
        if (this.avatar.length > 0) {
            let v4: JumpItemData = {
                type: JumpItemType.Avatar,
                data: this.avatar,
            }
            list.push(v4);
        }

        if (this.avatars.length > 0) {
            let v5: JumpItemData = {
                type: JumpItemType.Avatars,
                data: this.avatars,
            }
            list.push(v5);
        }
        //直接进入的标记为新用户，数据方式叠加
        let jumpdata: JumpGameData = {
            type: UserDefine.SubGameType,
            way: this.isNewUser ? way + 4 : way,
            home: '',
            data: list
        }
        return JSON.stringify(jumpdata);
    }
}

