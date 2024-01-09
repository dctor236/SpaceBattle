
export enum CoinType {
    PeaCoin = 2,
    Bill = 1
}

export default class ShopData extends Subdata {
    /** 商品信息 */
    @Decorator.persistence()
    public shopData: { [shopID: number]: ShopInfo };
    /** 刷新日期 */
    @Decorator.persistence()
    public refreshDate: number[];
    @Decorator.persistence()
    public peaCoin: number = 0;//
    @Decorator.persistence()
    public goldCoin: number = 0;//
    public readonly onPeaCoinChange: Action1<number> = new Action1();//RMB变化
    public readonly onBillChange: Action1<number> = new Action1();//RMB变化
    get dataName() {
        return '_ShopData'
    }
    protected onDataInit(): void {
        if (this.peaCoin < 0) this.peaCoin = 0;
        if (this.goldCoin < 0) this.goldCoin = 0;
    }

    protected initDefaultData(): void {
        this.shopData = {};
        this.refreshDate = [0, 0, 0];
    }

    getCoin(coinType: CoinType): number {
        switch (coinType) {
            case CoinType.Bill:
                return this.goldCoin;
            case CoinType.PeaCoin:
                return this.peaCoin;
            default:
                return 0;
        }
    }

    addCoin(coinType: CoinType, num: number) {
        switch (coinType) {
            case CoinType.Bill:
                if (this.goldCoin + num < 0) return
                this.goldCoin += num;
                this.onBillChange.call(this.getCoin(coinType));
                break;
            case CoinType.PeaCoin:
                if (this.peaCoin + num < 0) return
                this.peaCoin += num;
                this.onPeaCoinChange.call(this.getCoin(coinType));
                break;
            default:
                break;
        }
    }

    /**
     * 获得商品可购买数量
     * @param ID 商品配置ID
     */
    public getItemCount(ID: number) {
        if (!this.shopData[ID]) {
            return -999;
        }
        return this.shopData[ID].count;
    }

    /**
     * 刷新商品可购买数量
     * @param ID 商品ID
     * @param count 数量
     */
    public setItemCount(ID: number, count: number) {
        let info = this.shopData[ID];
        if (!info) {
            info = new ShopInfo();
            info.configID = ID;
            this.shopData[ID] = info;
        }
        info.count = count;
    }

    public subCount(ID: number, count: number) {
        let info = this.shopData[ID];
        if (info) {
            info.count -= count;
            this.save(false);
        }
        console.log("subCount", ID, count, info, JSON.stringify(this.shopData));
    }
}

@Serializable
export class ShopInfo {
    /**配置ID */
    @mw.Property()
    public configID: number;
    /**可购买数量 */
    @mw.Property()
    public count: number;
}