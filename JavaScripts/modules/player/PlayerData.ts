import { ClothEvent } from "./modules/ClothModule"

export class PlayerData extends Subdata {
    @Decorator.persistence()
    private equipIds: number[] = []
    @Decorator.persistence()
    //所有拥有的
    private allSuits: number[] = []

    protected initDefaultData(): void {
        this.equipIds = []
        this.allSuits = []
    }

    protected onDataInit(): void {
        super.onDataInit();
    }

    public get dataName(): string {
        return "_MyBaseData";
    }

    // ------------------------------------------------------------------------------
    private _newArr: number[] = []
    public get equipID(): number[] {
        this._newArr = []
        this._newArr.push(...this.equipIds)
        return this._newArr
    }

    public get allSuit(): number[] {
        this._newArr = []
        this._newArr.push(...this.allSuits)
        return this._newArr
    }

    public saveSuits(list) {
        if (SystemUtil.isClient()) return;
        for (const id of list) {
            if (!this.allSuits.includes(id)) {
                this.allSuits.push(id)
            }
        }
        this.save(true)
    }

    public saveEquips(equipIds: number[]) {
        if (SystemUtil.isClient()) {
            this.equipIds = equipIds
            Event.dispatchToServer(ClothEvent.net_SaveFacadIDs, equipIds)
        } else {
            this.equipIds = equipIds
            this.save(true)
        }
    }

    public buySuit(suitId: number) {
        if (this.allSuits.includes(suitId)) return false
        if (SystemUtil.isClient()) {
            this.allSuits.push(suitId)
        } else {
            this.allSuits.push(suitId)
            this.save(true)
        }
        return true
    }
}