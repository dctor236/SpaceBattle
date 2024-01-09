/** 道具基类UI */
export class PropBaseHUD extends mw.UIScript {
    /** 道具UI层级 */
    getLayer(): number {
        return mw.UILayerMiddle;
    }
}

@UIBind("UI/uiTemplate/RPNPMUI/PropBase/P_PropAction.ui")
export class P_PropAction_Generate extends PropBaseHUD {
    @UIWidgetBind("Canvas/mBtn")
    public mBtn: mw.StaleButton = undefined;
    protected onAwake() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerBottom;
        this.initButtons();
    }
    protected initButtons() {
        this.mBtn.onClicked.add(() => {
            Event.dispatchToLocal("PlayButtonClick", "mBtn");
        });
        this.initLanguage(this.mBtn);
        this.mBtn.touchMethod = mw.ButtonTouchMethod.DownAndUp;
    }
    private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
}

export class P_PropAction extends P_PropAction_Generate {
    /**
     * 构造UI文件成功后，在合适的时机最先初始化一次
     */
    protected onAwake() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerBottom;
        this.initButtons();
    }

    /**
     * 构造UI文件成功后，onStart之后
     * 对于UI的根节点的添加操作，进行调用
     * 注意：该事件可能会多次调用
     */
    protected onAdded() { }

    /**
     * 构造UI文件成功后，onAdded之后
     * 对于UI的根节点的移除操作，进行调用
     * 注意：该事件可能会多次调用
     */
    protected onRemoved() { }

    /**
     * 构造UI文件成功后，UI对象再被销毁时调用
     * 注意：这之后UI对象已经被销毁了，需要移除所有对该文件和UI相关对象以及子对象的引用
     */
    protected onDestroy() { }
}

@UIBind("UI/uiTemplate/RPNPMUI/PropBase/P_PropFly.ui")
export class P_PropFly_Generate extends PropBaseHUD {
    @UIWidgetBind('Canvas/forbidden')
    public forbidden: mw.Image = undefined;
    @UIWidgetBind("Canvas/mBtn")
    public mBtn: mw.StaleButton = undefined;
    @UIWidgetBind("Canvas/mBtn2")
    public mBtn2: mw.StaleButton = undefined;
    @UIWidgetBind("Canvas/mBtn3")
    public mBtn3: mw.StaleButton = undefined;

    protected onAwake() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerBottom;
        this.initButtons();
    }
    protected initButtons() {
        //按钮添加点击

        this.mBtn.onClicked.add(() => {
            Event.dispatchToLocal("PlayButtonClick", "mBtn");
        });
        this.initLanguage(this.mBtn);
        this.mBtn.touchMethod = mw.ButtonTouchMethod.DownAndUp;

        this.mBtn2.onClicked.add(() => {
            Event.dispatchToLocal("PlayButtonClick", "mBtn2");
        });
        this.initLanguage(this.mBtn2);
        this.mBtn2.touchMethod = mw.ButtonTouchMethod.DownAndUp;

        this.mBtn3.onClicked.add(() => {
            Event.dispatchToLocal("PlayButtonClick", "mBtn3");
        });
        this.initLanguage(this.mBtn3);
        this.mBtn3.touchMethod = mw.ButtonTouchMethod.DownAndUp;
    }
    private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
}

export class P_PropFly extends P_PropFly_Generate {
    /**
     * 构造UI文件成功后，在合适的时机最先初始化一次
     */
    protected onAwake() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerBottom;
        this.initButtons();
    }

    /**
     * 构造UI文件成功后，onStart之后
     * 对于UI的根节点的添加操作，进行调用
     * 注意：该事件可能会多次调用
     */
    protected onAdded() { }

    /**
     * 构造UI文件成功后，onAdded之后
     * 对于UI的根节点的移除操作，进行调用
     * 注意：该事件可能会多次调用
     */
    protected onRemoved() { }

    /**
     * 构造UI文件成功后，UI对象再被销毁时调用
     * 注意：这之后UI对象已经被销毁了，需要移除所有对该文件和UI相关对象以及子对象的引用
     */
    protected onDestroy() { }
}

@UIBind("UI/uiTemplate/RPNPMUI/PropBase/P_PropPlace.ui")
export class P_PropPlace_Generate extends PropBaseHUD {
    @UIWidgetBind("Canvas/mBtn")
    public mBtn: mw.StaleButton = undefined;
    @UIWidgetBind("Canvas/mImg")
    public mImg: mw.Image = undefined;
    @UIWidgetBind("Canvas/mText")
    public mText: mw.TextBlock = undefined;

    protected onAwake() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerBottom;
        this.initButtons();
    }
    protected initButtons() {
        //按钮添加点击

        this.mBtn.onClicked.add(() => {
            Event.dispatchToLocal("PlayButtonClick", "mBtn");
        });
        this.initLanguage(this.mBtn);
        this.mBtn.touchMethod = mw.ButtonTouchMethod.DownAndUp;

        this.initLanguage(this.mText);
    }
    private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
}

export class P_PropPlace extends P_PropPlace_Generate {
    /**
     * 构造UI文件成功后，在合适的时机最先初始化一次
     */
    protected onAwake() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerBottom;
        this.initButtons();
    }

    /**
     * 构造UI文件成功后，onStart之后
     * 对于UI的根节点的添加操作，进行调用
     * 注意：该事件可能会多次调用
     */
    protected onAdded() { }

    /**
     * 构造UI文件成功后，onAdded之后
     * 对于UI的根节点的移除操作，进行调用
     * 注意：该事件可能会多次调用
     */
    protected onRemoved() { }

    /**
     * 构造UI文件成功后，UI对象再被销毁时调用
     * 注意：这之后UI对象已经被销毁了，需要移除所有对该文件和UI相关对象以及子对象的引用
     */
    protected onDestroy() { }
}
