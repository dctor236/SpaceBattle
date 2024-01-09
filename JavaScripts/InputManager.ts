export class InputManager {
    private static _instance: InputManager;
    public static get instance(): InputManager {
        if (InputManager._instance == null) {
            InputManager._instance = new InputManager();
        }
        return InputManager._instance;
    }
    constructor() { this.init(); }
    public destroy() {
        InputManager._instance = null;
        if (this._onTouch != null) {
            this._onTouch.clear();
            this._onTouch = null;
        }
        if (this.keyDownActionMap != null) {
            this.keyDownActionMap.forEach((action: Action) => {
                action.clear();
            });
            this.keyDownActionMap.clear();
        }
        if (this.touchInput != null) {
            this.touchInput.onTouchBegin.clear();
            this.touchInput = null;
        }
        if (this.keyDownEventListener != null) {
            this.keyDownEventListener.disconnect();
            this.keyDownEventListener = null;
        }
    }

    private _onTouch: mw.Action1<Array<mw.HitResult>>;
    private touchInput: mw.TouchInput;
    private keyDownActionMap: Map<mw.Keys, Action1<mw.Keys>>;
    private keyDownEventListener: mw.EventListener;

    private _ontouchEnd: mw.Action1<Array<mw.HitResult>>;
    private touchTime = 0;
    private lastTouch = 0;
    private linePos = new mw.Vector();
    private init() {
        if (mw.SystemUtil.isClient()) {
            this.keyDownActionMap = new Map();
        }
    }
    /**
     * 鼠标点击触发，返回点击的所有结果
     */
    public get onTouch(): Action1<Array<mw.HitResult>> {
        if (this._onTouch == null) {
            this._onTouch = new Action1();
            this.initTouch();
        }
        return this._onTouch;
    }

    // public get onTouchEnd(): Action1<Array<mw.HitResult>> {
    //     if (this._ontouchEnd == null) {
    //         this._ontouchEnd = new Action1();
    //         this.initTouch();
    //     }
    //     return this._ontouchEnd;
    // }

    /**
     * 按下键盘事件(增加了重复监听的判断，还可以移除监听方法)
     * @param key 按键类型
     * @returns 监听的Action方法
     */
    public onKeyDown(key: mw.Keys): Action1<mw.Keys> {
        if (mw.SystemUtil.isClient()) {
            if (this.keyDownActionMap == null) this.keyDownActionMap = new Map();
            if (!this.keyDownActionMap.has(key)) {
                this.keyDownActionMap.set(key, new Action1());
                this.keyDownEventListener = mw.InputUtil.onKeyDown(key, () => {
                    this.keyDownActionMap.get(key).call(key);
                });
            }
            let action: Action1<mw.Keys> = this.keyDownActionMap.get(key);
            if (action.count > 0) {
                return null;
            }
            return action;
        }
        return null;
    }

    private initTouch() {
        if (this.touchInput != null) return;
        this.touchInput = new mw.TouchInput();
        //这个逻辑需要currentPlayer
        Player.asyncGetLocalPlayer().then(() => {
            this.touchInput.onTouchBegin.add(this.touchHandler.bind(this));
            this.touchInput.onTouchEnd.add(this.touchEnd.bind(this));
        });
    }

    private touchEnd(index: number, location: mw.Vector2, touchType: mw.TouchInputType) {
        if (this.onTouch.count == 0)
            return;
        location = this.touchInput.getTouchVectorArray()[0];//手机上传进来的location是个{}所以先这么用
        if (!location)
            return;
        let nt = TimeUtil.elapsedTime();
        let arr: Array<mw.HitResult> = [];
        if (nt - this.touchTime < 0.6 && nt - this.lastTouch > 1) {
            this.lastTouch = nt;
            try {
                let pos = InputUtil.convertScreenLocationToWorldSpace(location.x, location.y)
                mw.Vector.multiply(pos.worldDirection.normalize(), 2000, this.linePos);
                mw.Vector.add(pos.worldPosition, this.linePos, this.linePos);
                arr = QueryUtil.lineTrace(pos.worldPosition, this.linePos, true, false);
                //arr = ScreenUtil.getGameObjectByScreenPosition(location.x, location.y, 2000, true, false);
            }
            catch (e) {
                console.info('getClickGameObjectByScene error');
            }
            //this.log(list);
            // for (let i = 0; list != null && i < list.length; i++) {
            //     if (arr.includes(list[i])) continue;
            //     arr.push(list[i]);
            // }
        }
        this.onTouch.call(arr);
    }

    private touchHandler(index: number, location: mw.Vector2, state): void {
        this.touchTime = TimeUtil.elapsedTime();
        // console.log("TouchHandler:  index=" + index + "  location_x=" + location.x + " location_y=" + location.y);
        // if (this.onTouch.count == 0) return;
        // location = this.touchInput.getTouchVectorArray()[0];//手机上传进来的location是个{}所以先这么用
        // let list: Array<mw.HitResult> = ScreenUtil.getGameObjectByScreenPosition(location.x, location.y, 50000, true, false);
        // //this.log(list);
        // let arr: Array<mw.HitResult> = [];
        // for (let i = 0; list != null && i < list.length; i++) {
        //     if (arr.includes(list[i])) continue;
        //     arr.push(list[i]);
        // }
        // if (list.length > 0) {
        //     this.onTouch.call(arr);
        // }
    }
    private log(list: Array<mw.HitResult>) {
        for (let i = 0; list != null && i < list.length; i++) {
        }
    }
    public getTouchPos(index: number): mw.Vector2 {
        let pos = this.touchInput.getTouchVectorArray()[index];
        return new mw.Vector2(pos.x, pos.y);
    }
}