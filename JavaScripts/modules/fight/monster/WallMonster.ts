import { MonsterBase } from "../../../ts3/monster/behavior/MonsterBase";
import { EMonserState, EMonsterBehaviorState, MonsterCfg } from "../../../ts3/monster/MonsterDefine";

export default class WallMonster extends MonsterBase {
    public async init(obj: mw.GameObject, cfg: number, monsterStateCb: Action1<EMonserState>): Promise<void> {
        await super.init(obj, cfg, monsterStateCb)
        // this.initTrigger()
        Player.onPlayerJoin.add((p) => {
            const player = p
            setTimeout(() => {
                if (this.getCurState() == EMonsterBehaviorState.Idle) {

                } else if (this.getCurState() == EMonsterBehaviorState.Show) {

                }
            }, 2000);
        })
        this.changeState(EMonsterBehaviorState.Show)
    }
    protected onShow(...data: any) {
        //封印状态
        this.host.setCollision(mw.CollisionStatus.On)
        this.host.setVisibility(mw.PropertyStatus.On)
        // this.monsterStateCb.call(EMonserState.Dead)
    }

    protected showUpdate(dt: number, eslapsed: number) {
    }
    protected showExit() {
    }

    protected onIdle(...data: any): void {
        //亮血条状态
        super.onIdle(data)
        this.monsterStateCb.call(EMonserState.Visable)
    }

    protected idleUpdate(dt: number, eslapsed: number): void {
        super.idleUpdate(dt, eslapsed)
    }

    protected idleExit(): void {
        super.idleExit()
    }


    protected onDead(...data: any) {
        super.onDead(data)
        this.host.setCollision(mw.CollisionStatus.Off)
        this.host.setVisibility(mw.PropertyStatus.Off)
    }
    protected deadUpdate(dt: number, eslapsed: number) {
        super.deadUpdate(dt, eslapsed)
        if (eslapsed > 1)
            this.changeState(EMonsterBehaviorState.Sleep)
    }
    protected deadExit() {
        super.deadExit()
    }

    public update(dt: number): void {
        super.update(dt)
        // console.log("boxx的状态", this.host?.name, this.getCurState())
    }
}