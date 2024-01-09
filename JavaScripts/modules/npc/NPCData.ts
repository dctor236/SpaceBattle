/**
 * @Author       : songxing
 * @Date         : 2023-02-05 17:11:37
 * @LastEditors  : songxing
 * @LastEditTime : 2023-04-24 10:54:09
 * @FilePath     : \mollywoodschool\JavaScripts\modules\NPC\NPCData.ts
 * @Description  : 
 */


type NPCInfo = { id: number, RewardEvenID: number[] }


export class NPCDataHelper extends Subdata {

    /**id,NPC好感度存储,从NPC获取道具事件存储(获得过道具了就不让他获取了),好感度事件存储  */
    @Decorator.persistence()
    public infoArray: NPCInfo[] = []

    public get dataName(): string {
        return "NPCDataInfo"
    }

    protected initDefaultData(): void {
        this.infoArray = [];
    }


    protected onDataInit(): void {
        while (this.version != this.currentVersion) {
            switch (this.currentVersion) {
                case 1:
                    this.currentVersion = 2;
                    break;
                case 2:
                    this.currentVersion = 3;

            }
        }
    }

    protected override get version() {
        return 3
    }
    //==================================================好感度===============================


    //===========================================道具奖励=========================

    public setNpcEventReward(npcid: number, EventsID: number) {
        let npc
        for (let index = 0; index < this.infoArray.length; index++) {
            const element = this.infoArray[index];
            if (element.id == npcid) {
                npc = element;
                break;
            }
        }
        if (!npc) {
            npc = { id: npcid, RewardEvenID: [] }
            this.infoArray.push(npc)
        }

        if (!npc.RewardEvenID.includes(EventsID)) {
            npc.RewardEvenID.push(EventsID);
        }
    }

    /**获取该NPC是否获得过该事件的奖励 */
    public getNpcEventReward(id: number, eventid: number): boolean {
        let npc = this.infoArray.find(i => i.id == id)
        return npc && npc.RewardEvenID.includes(eventid);
    }

   


}
