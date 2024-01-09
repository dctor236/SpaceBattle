
import { ActionBaseCfg, ActionLuanguage } from "../../modules/ActionModule";
import { ActionBaseItem } from "./ActionBaseItem";
import { ActionPanel } from "./ActionView";

export class ActionBaseP extends ActionPanel {
    //事件
    public OnSet: mw.Action1<ActionBaseCfg> = new mw.Action1<ActionBaseCfg>();
    //控件
    private barList: mw.StaleButton[] = [];

    private canvas: mw.Canvas = null;
    //是否打开
    private isOpen = false;
    //是否关闭
    private isClose = false;
    //移动速度
    private moveSpeed = 1800;
    //舞台宽度
    private stageWide = 0;
    //目标位置
    private targetPos = 0;
    //选中类型
    private typeIndex = 0;
    //初始格子数
    private initNum = 15;
    //当前使用索引
    private useIndex: number = -1;
    //item列表
    private itemList: ActionBaseItem[] = [];
    //itemMap
    private itemMap: { [itemId: number]: ActionBaseItem } = {};
    //动作列表
    private actionList: { [key: number]: ActionBaseCfg[] } = {};
    //动作配置列表
    private map: Map<number, ActionBaseCfg> = new Map<number, ActionBaseCfg>();

    public onStart() {

        this.layer = mw.UILayerOwn;
        this.mCloseBtn.onClicked.add(() => {
            this.isClose = true;
        });
        this.canvas = this.mCon;
        this.stageWide = mw.UIService.canvas.size.x;
        this.targetPos = this.stageWide - this.canvas.size.x;
        this.barList.push(this.mTypeBar1, this.mTypeBar2);
        this.mTypeBar1.onClicked.add(this.onTouchBar1.bind(this));
        this.mTypeBar2.onClicked.add(this.onTouchBar2.bind(this));
        this.mTypeBar1.text = (ActionLuanguage.tab1);
        this.mTypeBar2.text = (ActionLuanguage.tab2);
        let oversea = ActionLuanguage.isOverseas ? "89649" : "86265";
        this.mTypeBar1.disableImageGuid = oversea;
        this.mTypeBar2.disableImageGuid = oversea;

        for (let i = 0; i < this.initNum; i++) {
            this.createItem();
        }
    }

    public setConfig(map: Map<number, ActionBaseCfg>): void {
        this.map = map;
    }

    public onShow(): void {

        this.mCloseBtn.visibility = mw.SlateVisibility.Hidden;
        this.canvas.position = new mw.Vector2(this.stageWide, 0);
        this.isOpen = true;
        this.canUpdate = true;
        this.refreshType();
    }

    /**刷新类型 */
    private refreshType(): void {
        for (let i = 0; i < this.barList.length; i++) {
            this.barList[i].enable = (i == this.typeIndex ? false : true);
        }
        this.setList();
    }

    /**设置列表 */
    private setList(): void {
        this.hideAll();
        this.mScr.scrollToStart();
        let list = this.getList();
        for (let itemInfo of list) {
            let item = this.itemMap[itemInfo.id];
            if (!item) {
                item = this.getItem();
                this.itemMap[itemInfo.id] = item;
            }
            item.setData(itemInfo);
        }
    }


    // /**获得新动作后更新页签列表 */
    // public addAction(config: ActionBaseCfg) {
    //     this.actionList[config.type-1].push(config);
    // }


    /**
     * 获取动作列表
     * @param index 
     * @returns 
     */
    private getList(): ActionBaseCfg[] {
        if (!this.actionList[this.typeIndex]) {
            this.actionList[this.typeIndex] = [];
            for (let [id, config] of this.map) {
                if (config.type != this.typeIndex + 1) {
                    continue;
                }
                this.actionList[this.typeIndex].push(config);
            }
        } else {
            for (let [id, config] of this.map) {
                if (config.type == this.typeIndex + 1 && !this.actionList[this.typeIndex].includes(config)) {
                    this.actionList[this.typeIndex].push(config);
                }
            }
        }
        return this.actionList[this.typeIndex];
    }
    /**
     * 获取Item
     * @returns 
     */
    private getItem(): ActionBaseItem {
        if (this.useIndex >= this.itemList.length - 1) {
            this.createItem();
        }
        let item = this.itemList[++this.useIndex];
        this.setItemPos(item, this.useIndex);
        return item;
    }

    /**
     * 设置item位置
     * @param item 
     * @param index 
     */
    private setItemPos(item: ActionBaseItem, index: number): void {
        let startX: number = 10;
        let startY: number = 0;
        let geX: number = 20 + 160;
        let geY: number = 160 + 20;
        let x = startX + Math.floor(index % 4) * geX;
        let y = startY + Math.floor(index / 4) * geY;
        item.setPostion(new mw.Vector2(x, y));
    }

    /**
     * 建造item
     */
    private createItem(): void {
        let item = new ActionBaseItem();
        let prefab = mw.createUIByName("uiTemplate/RPNPMUI/ActionModule/ActionItem");
        if (prefab) {
            item.active.add(this.setAction, this);
            item.setRoot(prefab);
            this.mContent.addChild(prefab);
            // item.show(true);
            this.itemList.push(item);
        }
    }

    /**
     * 发起动作
     * @param guid 
     */
    private setAction(info: ActionBaseCfg): void {
        this.OnSet.call(info);
        this.hide();
    }



    public onUpdate(dt: number): void {
        if (this.isOpen) {
            let x = this.canvas.position.x - (this.moveSpeed * dt);
            if (x <= this.targetPos) {
                this.canvas.position = new mw.Vector2(this.targetPos, 0);
                this.isOpen = false;
                this.mCloseBtn.visibility = (mw.SlateVisibility.Visible);
                return;
            }
            this.canvas.position = new mw.Vector2(x, 0);
        }

        if (this.isClose) {
            let x = this.canvas.position.x + (this.moveSpeed * dt);
            if (x >= this.stageWide) {
                this.canvas.position = new mw.Vector2(this.stageWide, 0);
                this.isClose = false;
                this.hide();
                return;
            }
            this.canvas.position = new mw.Vector2(x, 0);
        }
    }


    private onTouchBar1(): void {
        this.typeIndex = 0;
        this.refreshType();
    }
    private onTouchBar2(): void {
        this.typeIndex = 1;
        this.refreshType();
    }

    private hideAll() {
        this.itemList.forEach(item => {
            item.show(false);
        });
        this.useIndex = -1;
        this.itemMap = {};
    }

    public hide(): void {
        mw.UIService.hideUI(this);
    }
}