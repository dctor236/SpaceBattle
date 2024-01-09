
import { BehaviorType, TimerState, SkillItemType, ISkillLine, ISkillItemParam } from "../../define/SkillDefine";
import { RuntimeConst } from "../Const";
import { ISkillEntity, ISkillBaseItem as ISkillItem, ISkillTimer } from "../../define/SkillDefine";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2022-11-16 17:43
 * @LastEditTime : 2023-03-08 16:10
 * @description  : 
 */
// export type SkillParam = Partial<{ t: SkillItemType, d: number, l: number, w: number, v: any, p1: any, p2: any, p3: any, p4: any, p5: any, p6: any, p7: any, p8: any }>;

export abstract class SkillBaseItem implements ISkillItem {
    public id: string = "";
    public delay: number = 0;
    public value: any;
    public life: number = 0;
    public way: number = 0;
    private _loop: number = 0;
    excute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): boolean {
        if (line.time < this.delay) return false;
        timer.time += line.delta;
        if (timer.state < TimerState.Run) {
            timer.state = TimerState.Run;
            this.onExcute(entity, line, timer);
        }
        this._loop = line.loopNum;
        let done = this.onUpdate(entity, line, timer);
        if (done) {
            this.onLoaclBehavior(entity, BehaviorType.ItemEnd, this.type);
            if (this.life > 0)
                this.onLife(entity, line, timer);
        }
        return done;
    }
    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {

        this.onLoaclBehavior(entity, BehaviorType.ItemStart, this.type);
    }
    protected onUpdate(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): boolean {
        return true;
    }
    protected abstract onParse(data: ISkillItemParam);
    protected onLife(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {

    }
    protected onStop(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        this.onLife(entity, line, timer);
    }
    protected onLoaclBehavior(entity: ISkillEntity, type: BehaviorType, ...params) {
        if (!this.isLocalPlayer(entity))
            return;
        this.onBehavior(entity, type, ...params);

    }
    protected onBehavior(entity: ISkillEntity, type: BehaviorType, ...params) {
        entity.itemId = this.id;
        entity.value = this.value;
        entity.loop = this._loop;
        entity.obj.behavior(entity, type, ...params);
    }
    abstract get type(): SkillItemType;
    public parse(data: ISkillItemParam) {
        this.delay = data.d ? data.d : 0;
        this.value = data.v ? data.v : 0;
        this.life = data.l ? data.l : 0;
        this.way = data.w ? data.w : 0;
        // this.life += this.delay;
        this.onParse(data);
    }
    protected isLocalPlayer(entity: ISkillEntity) {
        return entity.clientId == RuntimeConst.ClientID;
    }
    public stop(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        this.onStop(entity, line, timer);
    }
    public end(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {

    }
}

