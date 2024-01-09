import { UIManager } from "../../../../ExtensionType";
import P_GameHUD, { UIType, gameHudRootCanvas } from "../../../gameModule/P_GameHUD";
import { ActionLuanguage } from "../../modules/ActionModule";


export class ActionBaseHud {
    //当前z值
    private zIndex = 0;
    //item列表
    private itemList: ActionBtn[] = [];
    //事件
    public onActive: mw.Action = new mw.Action();
    public onAccept: mw.Action1<number> = new mw.Action1<number>();

    private cons: Map<number, ActionBtn> = new Map();

    private _hudUI: mw.Canvas;
    public get actionUI() {
        if (!this._hudUI) {
            this._hudUI = UIManager.getUI(P_GameHUD, false)?.getUITypeCanvas(UIType.Action);
        }
        return this._hudUI;
    }

    private getButton() {
        let button: mw.Button = null;
        return new Promise<mw.Button>((resolve: (v: mw.Button) => void) => {
            let count = 10
            let time = setInterval(() => {
                count -= 1;
                if (count < 0 || this.actionUI) {
                    let c = this.actionUI.findChildByPath(`mAction_btn`);
                    if (c instanceof mw.Button) {
                        button = c;
                    }
                    clearInterval(time);
                    resolve(button);
                }
            }, 100);
        });
    }

    public async onStart() {
        let b = await this.getButton();
        if (!b) return;
        b.onClicked.add(() => {
            this.onActive.call();
        });
    }

    /**
     * 获取Item
     * @returns 
     */
    private getItem(): ActionBtn {
        if (this.itemList.length <= 0) {
            this.createItem();
        }
        let item = this.itemList.splice(0, 1)[0];
        return item;
    }

    /**
     * 建造item
     */
    private createItem(): void {
        let prefab = mw.createUIByName("uiTemplate/RPNPMUI/ActionModule/ActionBtn");
        let data = new ActionBtn();
        data.setRoot(prefab);
        data.onActive.add(this.onClick, this);
        data.onClose.add(this.removePlayer, this);
        // this.rootCanvas.addChild(prefab);
        gameHudRootCanvas[`addChild`](prefab);
        let size = prefab.size.multiply(0.5);
        let pos = mw.UIService.canvas.size.multiply(0.5);
        prefab.position = new mw.Vector2(pos.x - size.x, pos.y - size.y - 200);
        this.itemList.push(data);
    }

    /**
     * 添加玩家响应按钮
     * @param id 
     */
    public addPlayer(id: number, guid: number, name: string): void {
        if (this.cons.has(id)) {
            let data = this.cons.get(id);
            data.setData(id, guid, name);
            data.setZIndex(++this.zIndex);
            data.show();
            return;
        }

        let data = this.getItem();
        data.setData(id, guid, name);
        data.setZIndex(++this.zIndex);
        data.show();
        this.cons.set(id, data);
    }

    /**
     * 移除玩家响应按钮
     * @param id 
     */
    public removePlayer(id: number): void {
        let con = this.cons.get(id);
        if (!con) {
            return;
        }
        con.hide();
        this.itemList.push(con);
        this.cons.delete(id);
    }

    private onClick(id: number): void {
        this.onAccept.call(id);
    }

    public refreshBtnStr(name: string, guid: string): void {
        let btn = this.actionUI.findChildByPath(`mAction_btn`) as mw.Button;
        let text = this.actionUI.findChildByPath(`mAction_btn/textBtn`) as mw.TextBlock;
        if (!btn || !text) return;

        btn.normalImageGuid = guid;
        text.text = name;
    }

    public setVisible(visible: boolean): void {
        this.actionUI.visibility = visible ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
    }

    /**
     * 刷新按钮显示
     * @param bool 
     */
    public refreshBtn(bool: boolean): void {
        let vis = bool ? mw.SlateVisibility.Visible : mw.SlateVisibility.Hidden;
        let btn = this.actionUI.findChildByPath(`mAction_btn`) as mw.Button;
        if (!btn) return;
        btn.visibility = vis;
    }
}

export class ActionBtn {
    public onActive: mw.Action1<number> = new mw.Action1<number>();
    public onClose: mw.Action1<number> = new mw.Action1<number>();

    private root: mw.UserWidgetPrefab = null;
    private nameText: mw.TextBlock = null;
    private descText: mw.TextBlock = null;
    private yesBtn: mw.StaleButton = null;
    private noBtn: mw.StaleButton = null;
    private id = 0;
    private time = 0;
    private timer
    /**接受 */
    private text1 = "";
    /**拒绝 */
    private text2 = "";
    /**描述 */
    private desc = "";

    public setRoot(root: mw.UserWidgetPrefab): void {
        this.root = root;
        this.nameText = (this.root.findChildByPath("Canvas/nameText")) as mw.TextBlock;
        this.descText = (this.root.findChildByPath("Canvas/descText")) as mw.TextBlock;
        this.yesBtn = (this.root.findChildByPath("Canvas/yesBtn")) as mw.StaleButton;
        this.yesBtn.onClicked.add(this.onAccept.bind(this));
        this.noBtn = (this.root.findChildByPath("Canvas/noBtn")) as mw.StaleButton;
        this.noBtn.onClicked.add(this.onNo.bind(this));
        this.text1 = ActionLuanguage.acceptText;
        this.text2 = ActionLuanguage.refuseText;
        this.yesBtn.text = (this.text1);
        this.desc = ActionLuanguage.desc1 + ActionLuanguage.desc2;
        this.yesBtn.normalImageGuid = ActionLuanguage.isOverseas ? "95786" : "95788";
    }

    /**
     * 设置层级
     * @param zIndex 
     */
    public setZIndex(zIndex: number): void {
        this.root.zOrder = zIndex;
    }

    public setData(id: number, guid: number, name: string): void {
        this.time = 5;
        this.nameText.text = name;
        this.descText.text = this.desc;
        this.noBtn.text = (`${this.text2}(${this.time})S`);
        this.id = id;
        this.timer = setInterval(this.update.bind(this), 1000);
    }

    private update(): void {
        this.time--;
        this.noBtn.text = (`${this.text2}(${this.time})S`);
        if (this.time <= 0) {
            clearInterval(this.timer);
            this.onClose.call(this.id);
        }
    }

    private onAccept(): void {
        this.onActive.call(this.id);
        this.onClose.call(this.id);
    }

    private onNo(): void {
        this.onClose.call(this.id);
    }

    public show(): void {
        this.root.visibility = (mw.SlateVisibility.Visible);
    }

    public hide(): void {
        this.root.visibility = (mw.SlateVisibility.Hidden);
    }
}