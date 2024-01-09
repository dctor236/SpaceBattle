import { EventsName, TrrigerType } from "../../../../const/GameEnum";
import { getMyPlayerID } from "../../../../ExtensionType";
import { MGSMsgHome } from "../../../mgsMsg/MgsmsgHome";
import { ClickUIPools } from "../../ClickUI";
import InteractMgr from "../../InteractMgr";
import { InterHelperBuild } from "../../InterHelperBuilder";
import InteractObject, { InteractiveHelper, InteractLogic_C, InteractLogic_S } from "../InteractObject";

/**触发模式 */
enum ExitMode {
    None = "0",//无需退出(非独享)
    ExitBtn = "1",//UI退出按钮(独享)
    MoveJump = "2"//移动或跳跃(独享)
}

//触发交互-UI操作
@Component
export default class Active_UI extends InteractObject {
    @mw.Property({ replicated: true, displayName: "交互方式", group: "属性", selectOptions: { "不交互": TrrigerType.None, "距离判断": TrrigerType.Distance, "盒状触发器": TrrigerType.BoxTrigger, "球状触发器": TrrigerType.SphereTrigger } })
    public isTrriger: string = TrrigerType.Distance
    @mw.Property({ replicated: true, displayName: "交互距离", group: "属性" })
    public activeDis: number = 150;//可交互的距离
    @mw.Property({ replicated: true, displayName: "UI图标", group: "属性" })
    public icon: string = "110111";//默认是个小手
    @mw.Property({ replicated: true, displayName: "CDUI图标", group: "属性" })
    public cdIcon: string = "34423";//默认是个小手
    @mw.Property({ replicated: true, displayName: "UI图标偏移", group: "属性" })
    public offset: mw.Vector = new mw.Vector(0, 0, 0);
    @mw.Property({ replicated: true, displayName: "退出方式(独享用)", selectOptions: { "无": ExitMode.None, "退出按钮": ExitMode.ExitBtn, "移动跳跃": ExitMode.MoveJump }, group: "属性" })
    public exitMode: string = ExitMode.ExitBtn;
    @mw.Property({ replicated: true, displayName: "冷却(秒)", group: "属性" })
    public cdTime: number = 0;
    @mw.Property({ replicated: true, displayName: "外部参数", group: "属性" })
    public params: string = "";
    @mw.Property({ displayName: "是否需要更新位置", group: "属性" })
    public isRefresh: boolean = false;

    @mw.Property({ replicated: true, hideInEditor: true, onChanged: "inCDChange" })
    public isInCD: boolean = false;//是否处于CD中


    onStart() {
        this.init(ActiveUI_S, ActiveUI_C);
    }

    override onEnterTrriger() {
        this.showClickIcon(true)
    }

    override onLeaveTrriger() {
        this.showClickIcon(false)
    }

    override onStateTrriger() {
        this.showClickIcon(true)
    }

    public showClickIcon(value: boolean): void {
        let isShow: boolean = this.ownerPlayerIds[0] == 0 && !InteractiveHelper.playInteractionEnable(getMyPlayerID());
        if (value && isShow && this.gameObject.getVisibility()) {
            ClickUIPools.instance.show(this.gameObject, this.offset, (this.logic as ActiveUI_C).clickBtn);
            ClickUIPools.instance.changeIcon(this.isInCD ? this.cdIcon : this.icon, this.gameObject.gameObjectId);
        } else {
            ClickUIPools.instance.hide(this.gameObject.gameObjectId);
        }
    }
}
//客户端
class ActiveUI_C extends InteractLogic_C<Active_UI> {
    onStart(): void {

    }

    stayTime: number = 0

    public clickBtn = () => {
        if (this.info.isInCD) {
            InteractiveHelper.showTips(InteractiveHelper.cdIngTips);
            return;
        }
        this.stayTime = TimeUtil.time()
        if (this.gameObject.tag == '7788') {
            MGSMsgHome.uploadMGS('ts_action_click', '骑乘向导胖达的次数', { button: 'pangda_ride' })
            Event.dispatchToLocal(EventsName.DoneTask, 1002, 1)
        } else if (this.gameObject.tag == 'dance') {
            MGSMsgHome.uploadMGS('ts_action_click', '玩家每次点击跳舞成功开始跳舞时', { button: 'dance' })
        } else if (this.gameObject.tag == 'sitdown') {
            MGSMsgHome.uploadMGS('ts_action_click', '玩家每次点击坐下成功坐下时', { button: 'sitdown' })
        }
        InteractMgr.instance.activeHandle(this.info, true)
    }

    public onPlayerAction(playerId: number, active: boolean, param: any) {
        if (!StringUtil.isEmpty(this.info.params)) {
            InteractiveHelper.onPlayerAction(playerId, active, this.info.params)
        }
        if (active) {
            InteractiveHelper.addExitInteractiveListener(this.info.exitMode == ExitMode.ExitBtn ? 1 : 2, () => {
                this.exit()
            });
        } else {
            InteractiveHelper.removeExitInteractiveListener();
        }
    }

    private exit = () => {
        InteractiveHelper.removeExitInteractiveListener();
        InteractMgr.instance.activeHandle(this.info, false)
        if (this.gameObject.tag == 'dance') {
            MGSMsgHome.uploadMGS('ts_area_leave', "中央舞池跳舞时长", { area_id: 4, time: (TimeUtil.time() - this.stayTime) })
        } else if (this.gameObject.tag == 'sitdown') {
            MGSMsgHome.uploadMGS('ts_area_leave', "沙发坐下时长", { area_id: 5, time: (TimeUtil.time() - this.stayTime) })
        }
    }
}
//服务端
class ActiveUI_S extends InteractLogic_S<Active_UI> {
    onStart(): void {

    }
    onPlayerAction(playerId: number, active: boolean, param: any): void {
        if (!StringUtil.isEmpty(this.info.params)) {
            InteractiveHelper.onPlayerAction(playerId, active, this.info.params)
        }
    }
}

