import { SpawnManager,SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
﻿/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-05-20 20:06:03
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-18 17:23:40
 * @FilePath: \vine-valley\JavaScripts\modules\taskModule\TaskModuleC.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: shifu.huang
 * @Date: 2022-12-12 14:11:33
 * @LastEditTime: 2023-05-21 00:05:27
 * @Description: Avatar Creator Development
 */

import { UIManager } from "../../ExtensionType";
import { GameConfig } from "../../config/GameConfig";
import { EmTaskState, EmTaskType, EventsName, ShowItemType } from "../../const/GameEnum";
import P_GameHUD from "../gameModule/P_GameHUD";
import NPCModule_C from "../npc/NPCModule_C";
import { TaskData } from "./TaskModuleDataHelper";
import { TaskModuleS } from "./TaskModuleS";
import UITaskFinish from "./ui/UITaskFinish";
import UITaskMain from './ui/UITaskMain';
import { GlobalData } from "../../const/GlobalData";
import { ITaskElement } from "../../config/Task";
import GuidePoint from "./ui/GuidePoint";
import ShopModuleC from "../shop/ShopModuleC";
import { GetItem } from "../bag/ui/GetItem";
import { InputManager } from "../../InputManager";
import { NPC_Events } from "../npc/NPC";
import TourModuleC from "../tour/TourModuleC";
import FindModuleC, { EGoodsTag } from "../find/FindModuleC";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";
import { MountType } from "../tour/TourModuleS";

export class TaskModuleC extends ModuleC<TaskModuleS, null>{
    private _branchTasks: TaskData[] = [];
    // private _dir = Vector.zero;
    // private _guideEffect: mw.GameObject;
    // private _rot = Rotation.zero;
    private _curTaskId: number = 0;

    /**完成任务需要的时间 */
    protected lifeTime: number = 0

    protected onStart(): void {
        // this._guideEffect = SpawnManager.wornSpawn("16A0B0704DAE794A65FDCF9D3A0BF3FC") as mw.GameObject;
        Event.addLocalListener(EventsName.DoneTask, this.solveBranchTask.bind(this));
        Event.addLocalListener(EventsName.RefreshTask, (replace: number) => {
            this.req_refreshATask(replace)
        });

        InputManager.instance.onKeyDown(mw.Keys.F3).add(() => {
            console.log("接取任务")
            this.acceptTask()

        })
        InputManager.instance.onKeyDown(mw.Keys.F4).add(() => {
            const data = this.getCurTaskData()
            if (data) {
                console.log("完成任务")
                this.taskFinishAward(data.taskConfig)
            }
        })
    }

    //外部接口调用 引导任务
    public guideCurTask() {
        const task = this.getCurTaskData()
        if (task) {
            this.guideByTask(task)
        }
    }



    onEnterScene(): void {
        this.initTaskTargetTris()
    }

    //初始化到达任务触发器
    initTaskTargetTris() {
        let allTriTasks: ITaskElement[] = []
        GameConfig.Task.getAllElement().forEach(e => {
            if (e.taskType == EmTaskType.Pos) {
                allTriTasks.push(e)
            }
        })
    }

    onUpdate() {
    }



    public getCurTaskData() {
        return this._branchTasks.find(e => e.id === this._curTaskId)
    }

    private setExpressionVisable(npc: mw.Character, isDoing: boolean) {
        const quesionEff = npc.getChildByName("表情1") as mw.Effect
        const exaimEff = npc.getChildByName("表情2") as mw.Effect
        if (isDoing) {
            quesionEff?.setVisibility(mw.PropertyStatus.Off)
            exaimEff?.setVisibility(mw.PropertyStatus.On)
        } else {
            quesionEff?.setVisibility(mw.PropertyStatus.On)
            exaimEff?.setVisibility(mw.PropertyStatus.Off)
        }
    }

    /**
     * 
     * @param str 任务列表
     * @param isAcc 是否自动接取任务
     */
    public net_OnAssign(str: string, isAcc: boolean = false) {
        let taskList = JSON.parse(str) as TaskData[];
        this._branchTasks = taskList;
        //初始化npc对话状态

        this._curTaskId = this._branchTasks[0].id
        console.log("玩家分配到的任务", JSON.stringify(this._branchTasks), this._curTaskId)

        Event.dispatchToLocal(EventsName.SetTaskTalkState, 0)
        const ch = Player.localPlayer.character
        //同步所有接取npc状态
        taskList.forEach(e => {
            //真正接任务的npc
            const trueNpc = ModuleService.getModule(NPCModule_C).getNpc(e.acceptNpc)
            const elem = GameConfig.Task.getElement(e.taskConfig)
            if (trueNpc) {

            }
            elem.TaskNPCID.forEach(npcID => {
                const accNpc = ModuleService.getModule(NPCModule_C).getNpc(npcID)
                if (!accNpc) { return }
                if (elem.accTalkState >= 0) {
                    accNpc.npcClient.setTalkState(elem.accTalkState)
                }
                if (elem.clickTalkState) {
                    elem.clickTalkState.forEach(state => {
                        const id = state[0]
                        if (accNpc.npcClient.trigger.checkInArea(ch) && GlobalData.CurInteractNpc != accNpc.npcClient.npcID) {
                            Event.dispatchToLocal(NPC_Events.NPC_OnClickItem + npcID, id);
                        }
                    })
                }
                this.setExpressionVisable(accNpc.npcClient.npcObj, false)
            })
        })
        UIManager.getUI(P_GameHUD).mExclam.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        UIManager.getUI(P_GameHUD).mQuestion.visibility = mw.SlateVisibility.Collapsed;
        //默认引导委托池第一个任务
        this.guideByTask(this._branchTasks[0], true)
        UIManager.getUI(P_GameHUD).refreshBranchTask();

        if (isAcc) {
            this.acceptTask()
        }
    }

    //请求刷新一个不是当前任务类型的任务
    public req_refreshATask(replace: number = 0) {
        this.server.net_refreshOnAPlayer(replace, -1)
    }


    //请求分配一个固定ID的任务
    public req_assignATask(taskID: number) {
        this.server.net_AssignAPlayer(taskID)
    }


    /**
     * 接受任务
     * @param taskConfig npcid
     * @returns 是否接受成功
     */
    public acceptTask(taskID: number = 1) {
        let data: TaskData = null
        if (taskID != 1) {
            this.req_assignATask(taskID)
        }

        data = this.getCurTaskData()
        if (data && data.taskState != EmTaskState.Doing) {
            MGSMsgHome.uploadMGS('ts_task', '玩家接取对应任务，打一个点', { task_id: 'get_task_' + (data.taskConfig - 1000 + 1) })
            this.lifeTime = TimeUtil.time()
            data.taskState = EmTaskState.Doing;
            this.server.net_setBranchTaskState(data.id, EmTaskState.Doing)
            const elem = GameConfig.Task.getElement(data.taskConfig)
            if (elem.accNpcTalk > 0)
                Event.dispatchToLocal(EventsName.SetTaskTalkState, elem.accNpcTalk)
            switch (data.taskType) {
                case EmTaskType.Pos:
                    ModuleService.getModule(FindModuleC).setVisableAndCollsion(EGoodsTag.Moutiain, true)
                    break
                case EmTaskType.Dress:
                    break
                case EmTaskType.Lost:
                    const all = ModuleService.getModule(FindModuleC).findGroupByTag(EGoodsTag.Suitcase)
                    const index = ModuleService.getModule(FindModuleC).setTagIndex(EGoodsTag.Suitcase)
                    all[index].setVisibility(mw.PropertyStatus.On, true)
                    all[index].enabled = (true)
                    break
                default:
                    break
            }

            const accNpc = ModuleService.getModule(NPCModule_C).getNpc(data.acceptNpc)
            if (accNpc) {
                // accNpc.client.setState(0)
                this.setExpressionVisable(accNpc.npcClient.npcObj, true)
            }
            const finishNpc = ModuleService.getModule(NPCModule_C).getNpc(data.finishNpc)
            if (finishNpc) {
                // finishNpc.client.setState(task.finishTalkState)
            }
            if (this._curTaskId === data.id) this.guideByTask(data, true);
            UIManager.getUI(P_GameHUD).mExclam.visibility = mw.SlateVisibility.Hidden;
            UIManager.getUI(P_GameHUD).mQuestion.visibility = mw.SlateVisibility.SelfHitTestInvisible;
            UIManager.getUI(P_GameHUD).canvas_Task.visibility = mw.SlateVisibility.SelfHitTestInvisible
            UIManager.getUI(P_GameHUD).refreshBranchTask();
        }


    }

    /**
     * 任务完成后的奖励和提示
     * @param taskConfig 任务
     */
    taskFinishAward(taskConfig: number) {
        let taskElem = GameConfig.Task.getElement(taskConfig);
        let showTxt = taskElem.taskName[taskElem.taskName.length - 1]
        mw.UIService.show(UITaskFinish, showTxt + "已完成");
        if (taskElem.taskRewardItemType && taskElem.taskRewardNum) {
            ModuleService.getModule(ShopModuleC).req_addCoin(taskElem.taskRewardItemType, taskElem.taskRewardNum)
            if (taskElem.taskRewardItemType != 1 && taskElem.taskRewardItemID) {
                let gitfMap = new Map([[taskElem.taskRewardItemID, taskElem.taskRewardNum]]);
                UIManager.hide(GetItem)
                mw.UIService.show(GetItem, gitfMap, ShowItemType.Get);
            }
        }
    }

    /**
     * 完成支线任务
     * @param taskConfigID 任务comfigID
     * @param count 次数
     * 
     */
    private solveBranchTask(taskConfig: number, count: number = 1) {
        let task = this.getCurTaskData()
        if (task && task.taskConfig == taskConfig && task.taskState == EmTaskState.Doing) {
            task.curSolveTime += count;
            if (task.curSolveTime >= task.totalSolveTime) {
                this.finishBranchTask();
                const elem = GameConfig.Task.getElement(taskConfig)
                elem.TaskNPCID.forEach(npcID => {
                    if (elem.finishTalkState >= 0) {
                        const trueNpc = ModuleService.getModule(NPCModule_C).getNpc(task.finishNpc)
                        const finishNpc = ModuleService.getModule(NPCModule_C).getNpc(npcID)
                        if (finishNpc) {
                            finishNpc.npcClient.setTalkState(0)
                        }
                    }
                })
            }
            UIManager.getUI(UITaskMain).refreshData();
            UIManager.getUI(P_GameHUD).refreshBranchTask();
        }
    }

    /**实时刷新引导目标 */
    private _refreshTtimer = null
    private refreshGuide() {
        if (!this._refreshTtimer) {
            this._refreshTtimer = setInterval(() => {
                this.setGuidVisable(true)
            }, 2000)
        }
    }

    public setGuidVisable(visable: boolean) {
        const curData = this.getCurTaskData()
        if (!curData) return
        if (visable) {
            if (curData.taskState == EmTaskState.Doing) {
                const posList = this.getTaskLoc(curData);
                UIManager.show(GuidePoint, posList)
            } else if (curData.taskState == EmTaskState.NoAccept) {
                const npc = ModuleService.getModule(NPCModule_C).getNpc(curData.acceptNpc)
                UIManager.show(GuidePoint, [npc.npcClient.npcObj])
            }
        }
        else {
            if (!(curData.taskState == EmTaskState.NoAccept && curData.acceptNpc == GlobalData.CurTalkNpc))
                UIManager.hide(GuidePoint)
        }
    }


    public isGuide: boolean = false
    /**
     * 引导到某个任务
     * @param data 引导任务的数据
     */
    public guideByTask(data: TaskData, isAuto: boolean = false) {
        if (data) {
            if (data.taskState == EmTaskState.Finish) return;
            this._curTaskId = data.id
            if (!isAuto)
                this.isGuide = !this.isGuide
            else
                this.isGuide = isAuto
            if (this.isGuide) {
                if (data.taskState == EmTaskState.Doing) {
                    if (data.taskType == EmTaskType.PlayNPC) {
                        this.refreshGuide()
                    }
                    const guideList = this.getTaskLoc(data);
                    UIManager.show(GuidePoint, guideList)
                } else if (data.taskState == EmTaskState.NoAccept) {
                    const npc = ModuleService.getModule(NPCModule_C).getNpc(data.acceptNpc)
                    UIManager.show(GuidePoint, [npc.npcClient.npcObj])
                }
            } else {
                UIManager.hide(GuidePoint)
            }

            Event.dispatchToLocal(EventsName.ShowGuide, data.id, this.isGuide)
        }
    }


    private getTaskLoc(data: TaskData): Vector[] | mw.GameObject[] {
        let vecList = []
        switch (data.taskType) {
            case EmTaskType.Dress:
                // vecList = ModuleService.getModule(ShopModuleC).getAllClothPos()
                break
            case EmTaskType.Pos:
                {
                    const index = ModuleService.getModule(FindModuleC).getTagIndex(EGoodsTag.Moutiain)
                    const moutain = ModuleService.getModule(FindModuleC).findGroupByTag(EGoodsTag.Moutiain)
                    const ran = moutain[index]
                    vecList.push(ran.worldTransform.position)
                }
                break
            case EmTaskType.SitMount:
                vecList.push(ModuleService.getModule(TourModuleC).getMount(MountType.Panda))
                break
            case EmTaskType.PlayNPC:
                vecList.push(ModuleService.getModule(NPCModule_C).getNearNpcToPlayer())
                break
            case EmTaskType.Lost:
                {
                    const index = ModuleService.getModule(FindModuleC).getTagIndex(EGoodsTag.Suitcase)
                    const allSuitCase = ModuleService.getModule(FindModuleC).findGroupByTag(EGoodsTag.Suitcase)
                    const ran = allSuitCase[index]
                    vecList.push(ran)
                    break
                }
            case EmTaskType.Dragon:
                vecList.push(GameObject.findGameObjectById('2404C3DE'))
                break
        }
        if (vecList.length > 0)
            return vecList
        else
            return null;
    }

    /**
     * 完成支线任务
     * @param index 支线任务下标
     */
    private finishBranchTask() {
        const task = this.getCurTaskData()
        task.taskState = EmTaskState.Finish;
        this.taskFinishAward(task.taskConfig);
        const finishTime = TimeUtil.time() - this.lifeTime
        MGSMsgHome.uploadMGS('ts_task', '完成任务（1/2/3/4/5）的次数', { task_id: 'task_' + (task.taskConfig - 1000 + 1) })
        MGSMsgHome.uploadMGS('ts_task', '从接取任务（1/2/3/4/5）到完成的时间', { task_id: 'task_' + (task.taskConfig - 1000 + 1), lifeTime: finishTime })
        switch (task.taskType) {
            case EmTaskType.Pos:
                ModuleService.getModule(FindModuleC).setVisableAndCollsion(EGoodsTag.Moutiain, false)

                break
            case EmTaskType.PlayNPC:
                clearInterval(this._refreshTtimer)
                this._refreshTtimer = null
                UIManager.hide(GuidePoint)
                break
            case EmTaskType.Lost:
                const all = ModuleService.getModule(FindModuleC).findGroupByTag(EGoodsTag.Suitcase)
                const index = ModuleService.getModule(FindModuleC).getTagIndex(EGoodsTag.Suitcase)
                all[index].setVisibility(mw.PropertyStatus.Off, true)
                all[index].enabled = (false)
                break
            case EmTaskType.Dress:
                break
            default: break
        }

        this.server.net_setBranchTaskState(task.id, EmTaskState.Finish);
        UIManager.hide(GuidePoint)
        this.isGuide = false
        Event.dispatchToLocal(EventsName.ShowGuide, task.id, false)
    }

    public net_finishBranchTask() {
        this.finishBranchTask()
    }

    /**获取全部已激活任务数据 */
    public getBranchTaskData(): TaskData[] {
        return this._branchTasks;
    }

}