import { PropBase, PropBase_Action, PropBase_Fly, PropBase_Placement } from "./PropBase";
import { PropBaseData_Action, PropBaseData_Fly, PropBaseData_Placement } from "./PropBaseData";
import { PropHUD_Action, PropHUD_Fly, PropHUD_Placement } from "./PropBaseHUD";
import { mathTools_firstPlaceNumber, mathTools_isEmpty, PropBasePool, PropBaseType } from "./PropTool";

export abstract class PropBaseModuleC<T extends PropBaseModuleS<any, any>, S extends Subdata> extends ModuleC<T, S> {

    protected ui_Placement: PropHUD_Placement = null;
    protected ui_action: PropHUD_Action = null;
    protected ui_fly: PropHUD_Fly = null;
    //当前道具ID
    protected cur_propId: number = null;
    //是否交互物中
    public isIn = false;
    onStart() {
        super.onStart();
        this.controlAllTypeProp();
    }
    /**
     * 控制UI显隐
     * @param propID 道具ID 
     * @param bo 开关
     * @param param1 自定义参数 (动作，放置 --> 按钮图片GUID) (飞行 --> 上升速度)
     * @param param2 自定义参数 (放置 --> CD时间)
     */
    net_controlPropState(propID: number, bo: boolean, param1?: any, param2?: any): void {
        let curPropId = mathTools_firstPlaceNumber(propID);
        bo == true ? this.cur_propId = propID : this.cur_propId = null;
        switch (curPropId) {
            case PropBaseType.Action:
                bo == true ? this.ui_action.show() : this.ui_action.hide();
                if (mathTools_isEmpty(param1)) {
                    this.ui_action.mBtn.normalImageGuid = String(param1);
                };
                break;
            case PropBaseType.Fly:
                bo == true ? this.ui_fly.show() : this.ui_fly.hide();
                this.ui_fly.flyActive(bo);
                if (mathTools_isEmpty(param1)) {
                    this.ui_fly._goUpSpeed = Number(param1);
                };
                break;
            case PropBaseType.Placement:
                bo == true ? this.ui_Placement.show() : this.ui_Placement.hide();
                if (mathTools_isEmpty(param1)) {
                    this.ui_Placement.mBtn.normalImageGuid = String(param1);
                };
                if (mathTools_isEmpty(param2)) {
                    this.ui_Placement.setBtnCD(Number(param2));
                };
                break;
            default:
                //TODO 新加道具显隐
                break;
        }
    }
    /**
     * 道具总UI控制
     */
    private controlAllTypeProp(): void {
        this.controlActionUI();
        this.controlFlyUI();
        this.controlPlacement();
    }
    /**
     * 控制动作类UI
     */
    private controlActionUI(): void {
        this.ui_action = mw.UIService.getUI(PropHUD_Action);
        this.ui_action.action.add(() => {
            this.server.net_changePropState(this.cur_propId);
            if (this.cur_propId) {
                this.propClickEnd(this.cur_propId);;
            }
        });
    }
    /**
     * 控制飞行类UI
     */
    private controlFlyUI(): void {
        this.ui_fly = mw.UIService.getUI(PropHUD_Fly);
        this.ui_fly.action.add(() => {
            if (this.isIn) {
                this.showUnFlyTips();
                return;
            }
            let isActive = !this.ui_fly._isActive;
            this.ui_fly.flyActive(isActive);
            this.server.net_changePropState(this.cur_propId, 0, !isActive);
            if (this.cur_propId) {
                this.propClickEnd(this.cur_propId);
            }
        })
        this.ui_fly.accelerateActionPressed.add(() => {
            if (this.isIn) {
                this.showUnFlyTips();
                return;
            }
            this.server.net_changePropState(this.cur_propId, 1);
            if (this.cur_propId != 0) {
                // this.setPropClickMGS(this.cur_propId);
            }
        })
        this.ui_fly.goUpActionPressed.add(() => {
            if (this.isIn) {
                this.showUnFlyTips();
                return;
            }
            this.server.net_changePropState(this.cur_propId, 2, true);
            if (this.cur_propId != 0) {
                // this.setPropClickMGS(this.cur_propId);
            }
        })
        this.ui_fly.goUpActionReleased.add(() => {
            if (this.isIn) {
                this.showUnFlyTips();
                return;
            }
            this.server.net_changePropState(this.cur_propId, 2, false);
            if (this.cur_propId != 0) {
                // this.setPropClickMGS(this.cur_propId);
            }
        })
    }
    /**
     * 控制放置类UI
     */
    private controlPlacement(): void {
        this.ui_Placement = mw.UIService.getUI(PropHUD_Placement);
        this.ui_Placement.action.add(() => {
            if (this.ui_Placement.bool_active) {
                this.server.net_changePropState(this.cur_propId);
            }
            if (this.cur_propId) {
                this.propClickEnd(this.cur_propId);;
            }
        })
    }
    /**
     * 道具按钮显隐藏
     * @param bo 开关
     */
    public showBtn(bo: boolean) {
        if (!mathTools_isEmpty(bo)) return;
        let curPropId = mathTools_firstPlaceNumber(this.cur_propId);
        switch (curPropId) {
            case PropBaseType.Action:
                bo == true ? this.ui_action.show() : this.ui_action.hide();
                break;
            case PropBaseType.Fly:
                bo == true ? this.ui_fly.show() : this.ui_action.hide();
                break;
            case PropBaseType.Placement:
                bo == true ? this.ui_Placement.show() : this.ui_action.hide();
                break;
        }
    }

    /**
     * 交互物向你通知交互状态
     */
    public closeActiveFly(is: boolean): void {
        this.isIn = is;
        if (!this.cur_propId) {
            return;
        }
        let type = mathTools_firstPlaceNumber(this.cur_propId);
        if (type != PropBaseType.Fly) {
            return;
        }
        if (this.cur_propId)
            this.server.net_changePropState(this.cur_propId, 3, is);
        if (this.cur_propId && this.isIn) {
            this.ui_fly.flyActive(true);
            this.server.net_changePropState(this.cur_propId, 0, false);
        }
    }

    public net_getIsIn(): boolean {
        return false;
    }

    public showUnFlyTips(): void {

    }

    /**
     * 道具点击结果
     * @param propId 道具ID
     */
    abstract propClickEnd(propId: number): void;
}
export abstract class PropBaseModuleS<T extends PropBaseModuleC<any, any>, S extends Subdata> extends ModuleS<T, S>  {
    //广场道具Map
    private propMap: Map<number, PropBase[]> = new Map<number, PropBase[]>();
    //其他道具Map
    private otherPropMap: Map<number, any> = new Map<number, any>();

    onStart() {
        super.onStart();
    }
    /**
     * 装备道具
     * @param propId  道具ID
     * @param playerId 玩家ID
     */
    async equipProp(propId: number, playerId: number): Promise<boolean> {
        if (propId < 10000 || propId > 99999) {
            let otherProp = this.equipOtherProp(propId, playerId);
            this.otherPropMap.set(propId, otherProp);
            return true;
        } else {
            let promiseProp = await this.equipPropSwitch(propId, playerId);
            if (!promiseProp) {
                console.error("equipProp,配置表中没有此ID: ", propId);
                return false;
            }
            if (this.propMap.has(playerId)) {
                const curArr = this.propMap.get(playerId);
                curArr.push(promiseProp)
            } else {
                this.propMap.set(playerId, [promiseProp]);
            }
            return true;
        }
    }
    /**
     * 卸载道具
     * @param playerId 玩家ID
     */
    async unLoadProp(propId: number, playerId: number): Promise<boolean> {
        if (propId < 10000 || propId > 99999) {
            let otherProp = this.otherPropMap.get(playerId);
            this.unLoadOtherProp(playerId, otherProp);
            this.otherPropMap.delete(playerId);
            return true;
        } else {
            const curArr = this.propMap.get(playerId);
            if (!curArr) {
                return
            }
            for (const prop of curArr) {
                this.unLoadPropSwitch(prop, playerId);
                PropBasePool.unSpanProp(prop);
            }
            curArr.length = 0
            this.propMap.set(playerId, curArr);
            return true;
        }
    }

    /**
     * 客户端道具状态切换
     * @param propID  道具ID
     * @param param1  自定义参数 （飞行 --> 飞行状态）
     * @param param2  自定义参数 （飞行 --> 状态开关）
     * @param param3  自定义参数  (飞行 --)
     */
    async net_changePropState(propID: PropBaseType, param1?: number, param2?: boolean, param3?: any) {
        const curArr = this.propMap.get(this.currentPlayerId);
        if (!curArr || curArr.length === 0) {
            return;
        }
        const curProp = curArr[curArr.length - 1]
        const curType = mathTools_firstPlaceNumber(propID);
        switch (curType) {
            case PropBaseType.Action:
                let nextData = this.getActionPropData((curProp as PropBase_Action)._nextState);
                await nextData.ready();
                (curProp as PropBase_Action).setData(nextData);
                (curProp as PropBase_Action).propSwitchoverState();
                break;
            case PropBaseType.Fly:
                switch (param1) {
                    case 0:
                        (curProp as PropBase_Fly).flyActiveEff(param2);
                        break;
                    case 1:
                        (curProp as PropBase_Fly).flyAccelerate(true);
                        break;
                    case 2:
                        (curProp as PropBase_Fly).flyUp(param2);
                        break;
                    case 3:
                        (curProp as PropBase_Fly).changeWalk(param2);
                        break;
                }
                break;
            case PropBaseType.Placement:
                (curProp as PropBase_Placement).usePlacementProp();
                break;
            default:
                //TODO 新加道具状态切换方法
                break;
        }
    }
    /**
     * 是否使用道具中
     * @param playerId 玩家ID
     * @returns true 使用中， false 无道具使用
     */
    getIsEquip(playerId: number): boolean {
        if (this.propMap.has(playerId) || this.otherPropMap.has(playerId)) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 道具状态切换
     * @param propId 道具ID
     * @param playerId 玩家ID
     * @returns 当前道具
     */
    private async equipPropSwitch(propId: number, playerId: number): Promise<PropBase> {
        let curPlayer = Player.getPlayer(playerId);
        switch (mathTools_firstPlaceNumber(propId)) {
            case PropBaseType.Action:
                let actionData = this.getActionPropData(propId);
                await actionData.ready();
                let actionProp = await PropBasePool.spanProp(propId, actionData.ModelGuid);
                (actionProp as PropBase_Action).setDataBase(actionData);
                (actionProp as PropBase_Placement)._buffAction.add((playerId, buffId) => {
                    this.addModuleFun(playerId, buffId);
                });
                (actionProp as PropBase_Action).equip(curPlayer);
                this.getClient(curPlayer).net_controlPropState(propId, true, actionData.IconBtn);
                return actionProp;
            case PropBaseType.Fly:
                let flyData = this.getFlyPropData(propId);
                await flyData.ready();
                let flyProp = await PropBasePool.spanProp(propId, flyData.ModelGuid);
                (flyProp as PropBase_Fly).setData(flyData);
                (flyProp as PropBase_Fly).equip(curPlayer);
                //TODO 无效消息请求 
                // let is = await this.getClient(curPlayer).net_getIsIn(); 
                (flyProp as PropBase_Fly).changeWalk(false);
                this.getClient(curPlayer).net_controlPropState(propId, true, flyData.flyGoUpSpeed);
                return flyProp;
            case PropBaseType.Placement:
                let placementData = this.getPlacementData(propId);
                await placementData.ready();
                let placementProp = await PropBasePool.spanProp(propId, placementData.ModelGuid);
                (placementProp as PropBase_Placement).setData(placementData);
                (placementProp as PropBase_Placement)._buffAction.add((playerId, buffId) => {
                    this.addModuleFun(playerId, buffId);
                });
                (placementProp as PropBase_Placement).equip(curPlayer);
                this.getClient(curPlayer).net_controlPropState(propId, true, placementData.IconPropGuid, placementData.ObjPlaceCD);
                return placementProp;
            default:
                //TODO 新加道具装备方法
                break;
        };
    }
    /**
     * 道具卸载状态恢复
     * @param prop 道具类
     * @param playerId 玩家ID
     */
    private unLoadPropSwitch(prop: PropBase, playerId: number): void {
        let curPlayer = Player.getPlayer(playerId);
        switch (mathTools_firstPlaceNumber(prop._id)) {
            case PropBaseType.Action:
                (prop as PropBase_Action).unLoad();
                this.getClient(curPlayer).net_controlPropState(prop._id, false, "");
                break;
            case PropBaseType.Fly:
                (prop as PropBase_Fly).unLoad();
                this.getClient(curPlayer).net_controlPropState(prop._id, false, 0);
                break;
            case PropBaseType.Placement:
                (prop as PropBase_Placement).unLoad();
                this.getClient(curPlayer).net_controlPropState(prop._id, false);
                break;
            default:
                //TODO 新加道具卸载方法
                break;
        }
    }

    /**
     * 装备其他道具 (返回生成道具类)
     * @param propID 道具ID
     * @param playerId 玩家ID
     */
    abstract equipOtherProp(propID: number, playerId: number): Object;
    /**
     * 卸载道具
     * @param otherProp 道具类（需要强转）
     * @param playerId 玩家ID
     */
    abstract unLoadOtherProp(otherProp: any, playerId: number): void;
    /**
     * 获取动作道具配置数据
     * @param ConfigID 配置ID
     */
    abstract getActionPropData(ConfigID: number): PropBaseData_Action;
    /**
     * 获取飞行道具配置数据
     * @param ConfigID 配置ID
     */
    abstract getFlyPropData(ConfigID: number): PropBaseData_Fly;
    /**
     * 获取放置道具配置数据
     * @param ConfigID 配置ID
     */
    abstract getPlacementData(ConfigID: number): PropBaseData_Placement;
    /**
     * 添加模块方法
     * @param playerId 玩家ID 
     * @param otherId 相关ID
     */
    abstract addModuleFun(playerId, otherId);
}

