import FindModuleC, { MaxGet } from "./FindModuleC";


/**回复时间 */
const RescumeTime = 12 * 60 * 60 * 1000
export class FindData extends Subdata {

    get dataName() {
        return '_FindData'
    }
    /**吃到的金币 */
    @Decorator.persistence()
    getCoins: number = 0
    /**下次回复的时间 */
    @Decorator.persistence()
    nextResume: number = 0
    /**读取所有任务 */
    protected initDefaultData(): void {
        this.getCoins = 0
    }
    protected onDataInit(): void {

    }
    addCoin(num: number) {
        this.getCoins += num
        if (this.getCoins >= MaxGet) {
            this.nextResume = Date.now() + RescumeTime
        }
        this.save(false)
    }

    revertCoin() {
        this.getCoins = 0
        this.save(false)
    }
}

export default class FindModuleS extends ModuleS<FindModuleC, FindData> {
    protected onStart(): void {

    }

    public net_addCoin(num: number) {
        this.currentData.addCoin(num)
    }

    public net_revertCoin() {
        this.currentData.revertCoin()
    }

    protected onUpdate(dt: number): void {

    }


    protected onDestroy(): void {

    }
}