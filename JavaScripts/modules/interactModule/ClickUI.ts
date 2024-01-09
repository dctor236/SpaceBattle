
import SP_InteractiveFlag_Generate from "../../ui-generate/uiTemplate/RPNPMUI/SP_InteractiveFlag_generate";
import SP_InteractiveUI_Generate from "../../ui-generate/uiTemplate/RPNPMUI/SP_InteractiveUI_generate";


/**
 * @Author       : 田可成
 * @Date         : 2023-01-13 12:00:28
 * @LastEditors  : songxing
 * @LastEditTime : 2023-04-19 09:52:12
 * @FilePath     : \mollywoodschool\JavaScripts\modules\interactModule\ClickUI.ts
 * @Description  : 
 */
export class ClickUI extends SP_InteractiveFlag_Generate {
    private _obj: mw.GameObject = null;
    private _offset: mw.Vector = null;
    private callBack: Function = null;

    onStart() {
        this.mBtn.onClicked.add(() => {
            this.callBack && this.callBack();
        });
        this.canUpdate = true
    }

    public show(obj: mw.GameObject, offset: mw.Vector, callBack: Function): void {
        this.callBack = callBack;
        this._obj = obj;
        this._offset = offset;
        let pos = InputUtil.projectWorldPositionToWidgetPosition(obj.worldTransform.position.add(this._offset), false).screenPosition;
        this.uiObject.position = pos.subtract(this.uiObject.size.multiply(0.5));
        this.uiObject.visibility = mw.SlateVisibility.SelfHitTestInvisible
    }

    public changeIcon(guid: string): void {
        this.mBtn.normalImageGuid = guid;
    }

    public onUpdate(dt: number): void {
        let pos: mw.Vector2 = InputUtil.projectWorldPositionToWidgetPosition(this._obj.worldTransform.position.add(this._offset), false).screenPosition;
        const position = pos.subtract(this.uiObject.size.multiply(0.5));
        if (position.x < 0) position.x = 0
        if (position.y < 0) position.y = 0
        if (position.x > 1920) position.x = 1920
        if (position.y > 1080) position.y = 1080
        this.uiObject.position = position
    }
}

//点击UI的对象池
export class ClickUIPools {
    private pool: ClickUI[] = [];

    private map: Map<string, ClickUI> = new Map<string, ClickUI>();

    private static _instance: ClickUIPools = null;
    public static get instance(): ClickUIPools {
        if (ClickUIPools._instance == null) {
            ClickUIPools._instance = new ClickUIPools();
        }
        return ClickUIPools._instance;
    }

    /**
     * 显示交互UI
     * @param iconGuid 图标guid
     * @param obj 对应物体
     * @param offset 偏移
     * @param callBack 点击方法
     * @returns 
     */
    public show(obj: mw.GameObject, offset: mw.Vector, callBack: Function): void {
        if (this.map.has(obj.gameObjectId)) {
            return;
        }
        let panel = mw.UIService.show(SP_InteractiveUI_Generate)
        let clickUI: ClickUI = null
        if (this.pool.length > 0) {
            clickUI = this.pool.shift();
        } else {
            clickUI = mw.UIService.create(ClickUI)
            panel.rootCanvas.addChild(clickUI.uiObject);
            clickUI.uiObject.size = clickUISize
        }
        clickUI.show(obj, offset, callBack);
        this.map.set(obj.gameObjectId, clickUI);
    }

    /**
     * 改变icon
     * @param iconGuid 
     * @param obj 
     * @returns 
     */
    public changeIcon(iconGuid: string, objGuid: string): void {
        if (!this.map.has(objGuid)) {
            return;
        }
        let ui = this.map.get(objGuid);
        ui.changeIcon(iconGuid);
    }

    /**
     * 隐藏
     * @param obj 
     */
    public hide(objGuid: string): void {
        let ui = this.map.get(objGuid);
        if (ui) {
            ui.uiObject.visibility = mw.SlateVisibility.Collapsed
            this.map.delete(objGuid);
            this.pool.push(ui);
        }
    }
}
const clickUISize: mw.Vector2 = new mw.Vector2(100, 100);