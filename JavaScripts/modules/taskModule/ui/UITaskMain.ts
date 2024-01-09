/*
 * @Author: 王嵘 rong.wang@appshahe.com
 * @Date: 2022-12-12 11:37:34
 * @LastEditTime: 2023-05-21 01:09:50
 * @Description: Avatar Creator Development
 */
import { EmTaskState } from "../../../const/GameEnum";
import TaskMain_Generate from "../../../ui-generate/task/TaskMain_generate";
import { TaskModuleC } from "../TaskModuleC";
import { TaskData } from "../TaskModuleDataHelper";
import { UIMultiScroller } from "../UIMultiScroller";
import UITaskItem from "./UITaskItem";



export default class UITaskMain extends TaskMain_Generate {
    private _scrFinish: UIMultiScroller = null;
    private _scrUnAcc: UIMultiScroller = null;
    private _taskModu: TaskModuleC;
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this._scrUnAcc = new UIMultiScroller(	//初始化动作滑动框
            this.mScrollUnAccept,
            this.mContentUnAcc,
            UITaskItem,
            1, 0, 0, 900, 160, 4, 0, 60);

        this._scrFinish = new UIMultiScroller(	//初始化动作滑动框
            this.mScrollFinish,
            this.mContentFinish,
            UITaskItem,
            1, 0, 0, 900, 160, 4, 0, 60);

        this.btn_Close.onClicked.add(() => {
            mw.UIService.hideUI(this);
        })
        this._taskModu = ModuleService.getModule(TaskModuleC);
        Event.addLocalListener("REFRESH_TASK_LIST", () => this.refreshData());
    }

    taskSetData() {
        const taskList: TaskData[] = this._taskModu.getBranchTaskData();
        let unAccList: TaskData[] = []
        let finishList: TaskData[] = []
        for (const task of taskList) {
            if (task.taskState == EmTaskState.NoAccept || task.taskState == EmTaskState.Doing) {
                unAccList.push(task)
            } else if (task.taskState == EmTaskState.Finish) {
                finishList.push(task)
            }
        }
        if (finishList.length > 0) {
            this.mPanel2.visibility = mw.SlateVisibility.SelfHitTestInvisible
            this._scrFinish.setData(finishList);
        } else {
            this.mPanel2.visibility = mw.SlateVisibility.Hidden
        }
        this._scrUnAcc.setData(unAccList)
    }

    onShow() {
        this.taskSetData();
    }

    refreshData() {
        this._scrFinish.refreshData();
        this._scrUnAcc.refreshData()
    }

}