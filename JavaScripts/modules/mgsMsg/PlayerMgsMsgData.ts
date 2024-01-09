
export class PlayerMgsModuleData extends Subdata {
    @Decorator.persistence()
    public ScheduleEnterNumArr: Array<{ eventConfigID: number, num: number }>

    public get dataName(): string {
        return "PlayerMgsData"
    }

    protected initDefaultData(): void {
        this.createNewEventData();
    }

    protected get targetVersion(): number {
        return 4;
    }

    protected onDataInit(): void {
        while (this.currentVersion != this.targetVersion) {
            switch (this.currentVersion) {
                case 1:
                    this.currentVersion = 2;
                    console.log('修改PlayerMgsModuleData this.version：' + this.currentVersion);
                    break;
                case 2:
                    this.currentVersion = 3;
                    console.log('修改PlayerMgsModuleData this.version：' + this.currentVersion);
                    break;
                case 3:
                    this.currentVersion = 4;
                    this.createNewEventData();
                    break;

                default:
                    console.log('未处理的数据版本this.version:' + this.currentVersion);
            }
        }
    }

    private createNewEventData() {
        this.ScheduleEnterNumArr = [];
    }

    public getScheduleEnterTimes(eventConfigID: number) {
        for (let i = 0; i < this.ScheduleEnterNumArr.length; i++) {
            let data = this.ScheduleEnterNumArr[i];
            if (data.eventConfigID == eventConfigID) {
                return data.num;
            }
        }
        return 0;
    }

    public addScheduleEnterTimes(eventConfigID: number) {
        let data: { eventConfigID: number, num: number } = null;
        for (let i = 0; i < this.ScheduleEnterNumArr.length; i++) {
            if (this.ScheduleEnterNumArr[i].eventConfigID == eventConfigID) {
                data = this.ScheduleEnterNumArr[i];
                break;
            }
        }
        if (data == null) {
            data = { eventConfigID: eventConfigID, num: 0 }
            this.ScheduleEnterNumArr.push(data)
        }
        data.num++;
        this.save(true);
    }
}