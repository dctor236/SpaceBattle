import { Class } from "./const/GlobalData";
import P_GameHUD from "./modules/gameModule/P_GameHUD";
import { BulletTrrigerBase } from "./modules/skill/bullettrriger/BulletTrrigerBase";

export class MyAction extends mw.Action { };
export class MyAction1<T> extends mw.Action1<T>{ };
export class MyAction2<T, U> extends mw.Action2<T, U>{ };
export class MyAction3<T, U, V> extends mw.Action3<T, U, V>{ };
export class Tween<T> extends mw.Tween<T>{ };

export const EffectManager = EffectService;
export const SoundManager = mw.SoundService;
export const UIManager = mw.UIService;
export const TimeUtil = mw.TimeUtil;
export const GoPool = mwext.GameObjPool;
export const AdsService = mw.AdsService;

let myPlayerID: number = null;
export function getMyPlayerID() {
    const player = Player.localPlayer;
    if (player) {
        const playerID = Player.localPlayer.playerId;
        if (playerID) return playerID
    }
    return myPlayerID;
}
export function setMyPlayerID(playerID: number) {
    myPlayerID = playerID
}

let myCharacterGuid: string = null;
export function getMyCharacterGuid() {
    const player = Player.localPlayer;
    if (player) {
        const characterGuid = player.character.gameObjectId
        if (characterGuid) return characterGuid
    }
    return myCharacterGuid;
}
export function setMyCharacterGuid(guid: string) {
    myCharacterGuid = guid;
}

let _uis: mw.UIScript[] = []
let _uizOrders: number[] = []

export function UIMiddleShow(UIObj: mw.UIScript, ...params: any[]) {
    console.log("打开UI到中层:" + UIObj.constructor.name)
    return UIManager.showUI(UIObj, mw.UILayerMiddle, ...params);
}
export function UITopShow(UIObj: mw.UIScript, ...params: any[]) {
    console.log("打开UI到顶层:" + UIObj.constructor.name)
    return UIManager.showUI(UIObj, mw.UILayerTop, ...params);
}
export function UIShowClass<T extends mw.UIScript>(PanelClass: { new(): T; }, ...params: any[]) {
    UIManager.show(PanelClass, ...params);
}

export function ShowAllUI() {
    for (let i = 0; i < _uis.length; i++) {
        _uis[i].rootCanvas.visibility = mw.SlateVisibility.SelfHitTestInvisible
        _uis[i].uiObject.zOrder = _uizOrders[i]
    }
    _uis.length = 0
    _uizOrders.length = 0
    Player.localPlayer.character.movementEnabled = true
    UIManager.getUI(P_GameHUD).resetJoyStick()
}

export function CloseAllUI() {
    Player.localPlayer.character.movementEnabled = false
    UIManager.getUI(P_GameHUD).resetJoyStick()
    mw.UIService.instance["createPanelMap"].forEach((ui) => {
        for (let i = 0; i < ui.length; i++) {
            if (ui[i].visible && ui[i].uiObject.parent && ui[i].uiObject.parent.equal(UIManager["canvas"])) {
                _uizOrders.push(ui[i].uiObject.zOrder)
                _uis.push(ui[i])
                ui[i].rootCanvas.visibility = mw.SlateVisibility.Collapsed
            }
        }
    })
}

export function UICreate<T extends mw.UIScript>(PanelClass: { new(): T; }, parent?: mw.Canvas): T {
    let ui: T = UIManager.create(PanelClass);
    if (parent) {
        parent.addChild(ui.uiObject);
    }
    return ui;
}
export function UIIsShow(UIObj: mw.UIScript) {
    return UIObj.visible;
}
export function UIHide(UIObj: mw.UIScript) {
    UIManager.hideUI(UIObj);
}
export function UIHideClass<T extends mw.UIScript>(PanelClass: { new(): T; }) {
    UIManager.hide(PanelClass);
}

//选项卡组
export class TabGroup<T extends { onClicked: mw.MulticastDelegate<() => void> }> {
    private tabArr: Array<T>;
    private selectCallBack: (index: number) => void;
    private selectChecker: (index: number) => boolean;//检测是否可以切换
    private tabStyleHandle: (btn: T, isSelect: boolean) => void;//设置标签的样式方法
    private _currentIndex: number = -1;
    /**
     * 构造
     * @param tabArr 标签的按钮数组
     */
    constructor(tabArr: Array<T>) {
        this.tabArr = tabArr;
    }
    /**
     * 初始化
     * @param tabStyleHandle 设置标签的样式方法（方法参数：按钮）
     * @param selectCallBack 选择标签的回调方法
     * @param thisArg 域
     * @param defaultIndex 默认选择的标签索引
     */
    public init(tabStyleHandle: (btn: T, isSelect: boolean) => void, selectCallBack: (index: number) => void, thisArg: any, defaultIndex: number = 0) {
        this.tabStyleHandle = tabStyleHandle.bind(thisArg);
        this.selectCallBack = selectCallBack.bind(thisArg);
        for (let i = 0; i < this.tabArr.length; i++) {
            this.tabArr[i].onClicked.add(() => {
                this.select(i);
            });
        }
        this.select(defaultIndex);
    }
    /**
     * 设置标签是否可选择的判断方法
     * @param selectChecker 判断方法
     * @param thisArg 域
     */
    public setSelectableChecker(selectChecker: (index: number) => boolean, thisArg: any) {
        this.selectChecker = selectChecker.bind(thisArg);
    }
    /**
     * 设置当前的标签
     * @param index 标签索引
     * @param ignoreSame 是否忽略相同索引
     * @returns 是否成功
     */
    public select(index: number, ignoreSame: boolean = true): boolean {
        if (ignoreSame && this._currentIndex == index) return;
        if (this.selectChecker != null && !this.selectChecker(index)) {
            return false;
        }
        this._currentIndex = index;
        this.refreshTabs();
        this.selectCallBack(index);
        return true;
    }
    /**当前选择的标签索引 */
    public get currentIndex(): number {
        return this._currentIndex;
    }
    //刷新所有便签的显示样式
    private refreshTabs() {
        for (let i = 0; i < this.tabArr.length; i++) {
            this.tabStyleHandle(this.tabArr[i], i == this.currentIndex);
        }
    }
}

/**
* 根据类型和路径查找子对象
* @param ChildType 子对象的类型
* @param path 节点路径
* @returns 子节点对象
*/
export function findChildByPath<T extends mw.Widget>(canvas: mw.Canvas, ChildType: { new(...param: any[]): T }, path: string): T {
    let child = canvas.findChildByPath(path);
    if (child == null) {
        console.error('CanvasController: The child was not found!  path=' + path);
        return null;
    }
    let widget: unknown = child as T;//ChildType.get(child);
    if (ChildType.name == mw.Button.name || ChildType.name == mw.Button.name) {
        (widget as any).setFocusable(false);//设置了这个 按钮就不会按下后自动抛出抬起事件了
        (widget as any).setTouchMethod(mw.ButtonTouchMethod.PreciseTap);//设置了这个后 滑动列表里的按钮不用再单独设置了
    }
    return widget as T;
}

/**
 * 根据类型，获取画布下的所有此类型的对象
 * @param canvas 画布
 * @param ObjClass 类型类型
 * @returns 对象数组
 */
export function getCanvasChildren<T extends mw.Widget>(canvas: mw.Canvas, ObjClass: { new(): T }): Array<T> {
    let arr = [];
    if (canvas == null) return arr;
    let childNum: number = canvas.getChildrenCount();
    for (let i = 0; i < childNum; i++) {
        let child: mw.Widget = canvas.getChildAt(i);
        let obj: T = widgetToUIElement(ObjClass, child);
        if (obj != null) {
            arr.push(obj);
        }
    }
    return arr;
}



/**
* 将UI节点转换为实际的UI元素对象
* @param EleClass UI元素的类
* @param widget 节点对象
* @returns UI元素对象
*/
export function widgetToUIElement<T extends mw.Widget>(EleClass: { new(): T }, widget: mw.Widget): T {
    if (!(widget instanceof EleClass)) {
        return null;
    }
    let element: T = (widget) as T;
    if (element == null || !(widget instanceof EleClass)) return null;
    if (element instanceof mw.Button) {
        let btn = element;
        btn.focusable = (false);//设置了这个 按钮就不会按下后自动抛出抬起事件了
        btn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);//不设置这个，滑动列表里的按钮会阻止滑动
        if (btn.visibility == mw.SlateVisibility.HitTestInvisible || btn.visibility == mw.SlateVisibility.SelfHitTestInvisible) {
            btn.visibility = (mw.SlateVisibility.Visible);//不设置Visible，按钮就无法点击
        }
    }
    return element as T;
}

//UI的层级
export enum UILayer {
    /**场景 */
    Scene = 0,
    /**底层 */
    Bottom = 1,
    /**中层 */
    Middle = 2,
    /**独享层(调用此层会自动隐藏Bottom和Middle层) */
    Own = 3,
    /**顶层 */
    Top = 4,
    /**对话 */
    Dialog = 5,
    /**系统 */
    System = 6,
    /**错误 */
    Error = 7
}
export let bulletClass: Map<string, Class<BulletTrrigerBase>> = new Map()