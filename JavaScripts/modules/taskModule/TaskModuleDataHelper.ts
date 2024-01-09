/*
 * @Author: 王嵘 rong.wang@appshahe.com
 * @Date: 2022-12-12 14:11:52
 * @LastEditTime: 2023-05-21 18:02:06
 * @Description: Avatar Creator Development
 */
// import { ToolUtils } from "../../utils/ToolUtils";

import { EmTaskState, EmTaskType } from "../../const/GameEnum";

export class TaskData {
    /**任务Id */
    id: number
    /**任务configId */
    taskConfig: number;
    isStart: number
    /**下个阶段任务 */
    nextTask: number;
    /**当前完成次数 */
    curSolveTime: number;
    /**总完成次数 */
    totalSolveTime: number;
    /**任务状态 */
    taskState: EmTaskState;
    /**任务类型 */
    taskType: EmTaskType;
    /**接取NPC */
    acceptNpc: number;
    /**完成NPC */
    finishNpc: number;
    /**改变npc的按钮布局索引 */
}


export default class TaskModuleDataHelper extends Subdata {
    /**完成支线 */
    @Decorator.persistence()
    taskQueue: TaskData[];

    /**读取所有任务 */
    protected initDefaultData(): void {
        this.taskQueue = []
        // const length = 100;
        // for (let i = 1; i < length; i++) {
        //     let cfg = GameConfig.Task.getElement(i);
        //     if (cfg) {
        //         let task = new TaskData();
        //         task.taskID = cfg.id;
        //         task.curSolveTime = 0;
        //         task.totalSolveTime = cfg.taskSolvetime;
        //         task.taskType = cfg.taskType;
        //         //设定指定任务为 初始指引任务
        //         if (task.taskID === 1) {
        //             this.taskDoing.push(task);
        //             task.taskState = EmTaskState.Doing;
        //         } else {
        //             task.taskState = EmTaskState.NoAccept;
        //         }
        //         this.taskQueue.push(task);
        //     } else {
        //         break;
        //     }
        // }
    }

    protected onDataInit(): void {

    }

    // /**完成任务一次*/
    addTaskSolveTimeByID(id: number, count: number = 1): boolean {
        let idx = this.taskQueue.findIndex(i => i.taskConfig === id);
        if (idx !== -1) {
            if (this.taskQueue[idx].taskState !== EmTaskState.Finish) {
                this.taskQueue[idx].curSolveTime += count;
                if (this.taskQueue[idx].curSolveTime >= this.taskQueue[idx].totalSolveTime) {
                    this.taskQueue[idx].curSolveTime = this.taskQueue[idx].totalSolveTime;
                }
                return true;
            }
        }
        return false;
    }

    /**设置任务状态 */
    setTaskStateByID(id: number, state: EmTaskState) {
        let idx = this.taskQueue.findIndex(task => task.id === id);
        if (idx >= 0)
            this.taskQueue[idx].taskState = state;
        this.save(false)
    }

    /**获取任务数据 */
    getTaskDataById(id: number): TaskData {
        return this.taskQueue.find(i => i.taskConfig == id);
    }

    /**获取全部任务数据 */
    public getAllTaskData(): TaskData[] {
        return this.taskQueue;
    }


    /**判断任务是否完成 */
    public isTaskFinish(id: number): boolean {
        let task = this.taskQueue.find(i => { return (i.id === id) });
        if (task) {
            return task.taskState === EmTaskState.Finish;
        }
        return false;
    }


    /**根据触发隐藏任务NPCid获取尚未激活隐藏任务 */
    // public getSleepSecretTaskByNpcId(npcId: number): TaskData[] {
    // return this.taskQueue.filter(i => {
    //     if (i.isSecret && i.taskState === EmTaskState.Sleeping) {
    //         let e = GameConfig.Task.getElement(i.taskID);
    //         if (e) {
    //             return e.SecretTaskNPCID === npcId;
    //         }
    //     }
    //     return false;
    // });
    // }

    /**获取所有普通任务数据 */
    // public getNormalTaskData() {
    //     return this.taskQueue;
    // }

    /**获取当前向导全部任务数据 */
    // public getTaskGuideData(): TaskData[] {
    //     return this.taskDoing;
    // }

    /**获取正在进行且非向导任务数据 */
    // public getTaskDoingData(): TaskData[] {
    //     return this.taskQueue.filter((task) => { return task.taskState === EmTaskState.NoAccept })
    // }

    /**获取对应类型的已激活任务数据 */
    // public getTaskDoingDataByType(type: EmTaskType): TaskData[] {
    //     return this.taskQueue.filter((task) => { return (task.taskState === EmTaskState.Doing) && task.taskType === type })
    // }

    /**完成一个引导任务并随机添加一个新的 */
    // finishTaskAndRefresh(id: number) {
    //     let idx = this.taskDoing.findIndex(task => task.taskID === id);
    //     if (idx >= 0) {
    //         const taskID = this.taskDoing[idx].taskID;
    //         this.setTaskStateByID(taskID, EmTaskState.Finish);
    //         this.taskDoing.splice(idx, 1); //删除任务
    //         let randomNum = id + 1;
    //         this.setTaskStateByID(taskID + 1, EmTaskState.Doing);
    //         this.taskDoing.push(this.taskQueue[taskID]);
    //     }
    // }

    /**添加引导任务挤掉以前的 */
    // addTask(id: number) {
    //     let task = this.taskDoing.pop();
    //     this.setTaskStateByID(task.taskID, EmTaskState.NoAccept);
    //     this.setTaskStateByID(id, EmTaskState.Doing);
    //     this.taskDoing.unshift(this.getTaskDataById(id));
    // }

}