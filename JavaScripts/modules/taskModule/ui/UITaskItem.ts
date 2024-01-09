/*
 * @Author: 王嵘 rong.wang@appshahe.com
 * @Date: 2022-12-12 11:37:45
 * @LastEditTime: 2023-05-27 19:44:27
 * @Description: Avatar Creator Development
 */

import { GameConfig } from "../../../config/GameConfig";
import { EmTaskType, EmTaskState, EventsName } from "../../../const/GameEnum";
import TaskItem_Generate from "../../../ui-generate/task/TaskItem_generate";
import { TaskModuleC } from "../TaskModuleC";
import { TaskData } from "../TaskModuleDataHelper";
import { IItemRender } from "../UIMultiScroller";


export default class UITaskItem extends TaskItem_Generate implements IItemRender {

    get clickObj(): mw.StaleButton {
        return this.btn_Guide;
    }

    setSelect(bool: boolean): void {

    }
    private _taskData: TaskData;

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        this.btn_To.onClicked.add(() => {
            ModuleService.getModule(TaskModuleC).guideByTask(this._taskData);
        })

        Event.addLocalListener(EventsName.ShowGuide, (id: number, state: boolean) => {
            if (this._taskData && this._taskData.id == id) {
                if (state) {
                    this.mGuideTex.text = "取消引导"
                } else {
                    this.mGuideTex.text = '引导'
                }
            }
        })
    }

    setData(data: TaskData): void {
        if (data == null || data.taskConfig == null) return;
        this._taskData = data;
        let cfg = GameConfig.Task.getElement(data.taskConfig);
        this.txt_Name.text = cfg.taskName[data.taskState - 1];
        this.txt_Des.text = cfg.taskInfo[data.taskState - 1];
        if (cfg.rewardImgGuid) {
            this.img_Icon.imageGuid = cfg.rewardImgGuid;
        } else {
            this.img_Icon.imageGuid = "163381";
        }
        this.txt_num.text = `X ${cfg.taskRewardNum}`;
        this.guideCanvas.visibility = mw.SlateVisibility.Visible;
        this.setStateStyle(data.taskState);
        this.setGuidState()
    }

    setGuidState() {
        const taskC = ModuleService.getModule(TaskModuleC)
        const curData = taskC.getCurTaskData()
        const isGuide = taskC.isGuide
        if (curData && this._taskData && this._taskData.id == curData.id) {
            if (isGuide) {
                this.mGuideTex.text = "取消引导"
            } else {
                this.mGuideTex.text = '引导'
            }
        } else {
            this.mGuideTex.text = '引导'
        }
    }

    private setStateStyle(state: EmTaskState) {
        switch (state) {
            case EmTaskState.NoAccept:
                this.btn_Guide.visibility = mw.SlateVisibility.Visible;
                this.mStateText.text = `可接取`;
                this.btn_Guide.enable = true;
                this.mFinish.visibility = mw.SlateVisibility.Hidden;
                this.mMask.visibility = mw.SlateVisibility.Hidden;
                this.mGuidState.visibility = mw.SlateVisibility.SelfHitTestInvisible
                break;
            case EmTaskState.Doing:
                this.btn_Guide.visibility = mw.SlateVisibility.Visible;
                this.mStateText.text = `进行中`;
                this.btn_Guide.enable = false;
                this.mFinish.visibility = mw.SlateVisibility.Hidden;
                this.mMask.visibility = mw.SlateVisibility.Hidden;
                this.mGuidState.visibility = mw.SlateVisibility.SelfHitTestInvisible
                break;
            case EmTaskState.Finish:
                this.btn_Guide.visibility = mw.SlateVisibility.Hidden;
                this.mStateText.text = ``;
                this.mFinish.visibility = mw.SlateVisibility.Visible;
                this.mMask.visibility = mw.SlateVisibility.Visible;
                this.mGuidState.visibility = mw.SlateVisibility.Hidden
                break;
            default:
                console.log(`=======================不合法类型`);
                break;
        }
    }
    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}