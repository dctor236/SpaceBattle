

import FightMC from "./FightMC";

export default class FightMS extends ModuleS<FightMC, null>{
    protected onStart(): void {
        // const allElm = GameConfig.Monster.getAllElement()
        // for (const elem of allElm) {
        //     if (elem.isService)
        //         this.monsterMap.set(elem.Guid,
        //             {
        //                 curTime: 0, begin: elem.AppearTime, isBegin: false, isPush: false,
        //                 push: elem.PushNoticeTime, life: elem.ActiveTime
        //             })
        // }
    }

    // protected onUpdate(dt: number): void {
    //     this.monsterMap.forEach((e, key) => {
    //         e.curTime += dt
    //         const monster = MonsterMgr.Inst.getMonster(key)
    //         if (monster) {
    //             if (!e.isBegin && e.curTime >= e.begin) {
    //                 e.isBegin = true
    //                 monster.setMonsterState(EMonserState.Visable)
    //                 monster.setBehaviorState(EMonsterBehaviorState.Show)
    //             } else if (!e.isPush && e.curTime >= e.begin + e.push) {
    //                 e.isPush = true
    //                 // monster.setState(MonsterState.Dead)
    //             } else if (e.curTime >= e.begin + e.life) {
    //                 monster.setBehaviorState(EMonsterBehaviorState.Dead)
    //                 e.isBegin = false
    //                 e.isPush = false
    //                 e.curTime = 0
    //             }
    //         }
    //     })

    // }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}