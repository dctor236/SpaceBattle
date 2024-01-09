/**
 * @Author       : 田可成
 * @Date         : 2023-02-16 17:33:34
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-03-03 18:32:57
 * @FilePath     : \fantasymagicschool\JavaScripts\modules\skill\SkillData.ts
 * @Description  : 
 */
export class SkillData extends Subdata {

    /**
     * 初始化默认数据
     */
    protected override initDefaultData() {
        this.save(true);
    }

    protected override onDataInit(): void {
        this.toTargetVersion();
    }

    /**
     * 目标版本,升级版本请重写
     */
    protected get cversion(): number {
        return 1;
    }

    /**
     * 将老版本升级到新版本
     */
    protected toTargetVersion() {
        if (this.currentVersion === this.cversion) return;
        console.log(`update version: ${this.cversion} to targetVersion: ${this.cversion}`);
        switch (this.cversion) {
            case 1:
                break;
            default:
                break;
        }
        this.currentVersion = this.cversion;
        this.save(true);
    }
}