/** 
 * @Author       : 陆江帅
 * @Date         : 2023-05-12 11:22:52
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-05-12 16:34:28
 * @FilePath     : \mollywoodschool\JavaScripts\modules\relation\RelationData.ts
 * @Description  : 
 */



/** 关系绑定时间（ms） */
const relationTime = 7 * 24 * 60 * 60 * 1000

export enum ContractType {
    /**无契约 */
    None = "None",
    /**魔法勇士 */
    Brave = "Brave",
    /**契约之戒 */
    Ring = "Ring",
}

export default class RelationData extends Subdata {

    @Decorator.persistence()
    public covenanter: { [key: string]: string };

    @Decorator.persistence()
    public connects: { [key: string]: string }

    @Decorator.persistence()
    public times: { [key: string]: number }

    @Decorator.persistence()
    public designations: { [key: string]: string }

    @Decorator.persistence()
    public lastContract: ContractType;

    protected get version() {
        return 1;
    }

    protected initDefaultData(): void {
        this.covenanter = {}
        this.connects = {};
        this.times = {};
        this.designations = {};
        this.lastContract = ContractType.None
        this.save(false);
    }

    protected onDataInit(): void {
        this.toTargetVersion();
    }

    protected toTargetVersion() {
        if (this.currentVersion === this.version) return;
        console.log(`update version: ${this.currentVersion} to version: ${this.version}`);
        switch (this.currentVersion) {
            case 1:
                break;
            case 2:
                break;
            default:
                break;
        }
        this.currentVersion = this.version;
        this.save(false);
    }

    public buildRelationship(type: ContractType, id: string, name: string, designation: string) {
        this.covenanter[type] = id;
        this.connects[type] = name;
        this.designations[type] = designation;
        this.times[type] = Date.now() + relationTime
        this.lastContract = type
        this.save(false)
    }

    public releaseRelationship(type: ContractType) {
        this.covenanter[type] = ""
        this.connects[type] = "";
        this.times[type] = 0;
        this.designations[type] = ""
        this.lastContract = ContractType.None
        this.save(false)
    }
}