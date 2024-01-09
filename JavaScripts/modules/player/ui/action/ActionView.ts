@UIBind('UI/uiTemplate/RPNPMUI/ActionModule/ActionHUD.ui')
export class ActionHUD_Generate extends mw.UIScript {
    @UIWidgetBind('Canvas/textBtn')
    public textBtn: mw.TextBlock = undefined;
    @UIWidgetBind('Canvas/mAction_btn')
    public mAction_btn: mw.Button = undefined;

    protected onAwake() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerMiddle;
        this.initButtons();
    }
    protected initButtons() {
        //按钮添加点击

        //按钮添加点击

        this.mAction_btn.onClicked.add(() => {
            Event.dispatchToLocal("PlayButtonClick", "mAction_btn");
        })
        this.mAction_btn.touchMethod = (mw.ButtonTouchMethod.PreciseTap);

        //按钮多语言

        //文本多语言
        this.initLanguage(this.textBtn)
        //文本多语言
    }
    private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
}

@UIBind("UI/uiTemplate/RPNPMUI/ActionModule/ActionPanel.ui")
export class ActionPanel_Generate extends mw.UIScript {
    @UIWidgetBind("Canvas/mCon/mTypeBar1")
    public mTypeBar1: mw.StaleButton = undefined;
    @UIWidgetBind("Canvas/mCon/mTypeBar2")
    public mTypeBar2: mw.StaleButton = undefined;
    @UIWidgetBind("Canvas/mCon/mListCon/mScr/mContent")
    public mContent: mw.Canvas = undefined;
    @UIWidgetBind("Canvas/mCon/mListCon/mScr")
    public mScr: mw.ScrollBox = undefined;
    @UIWidgetBind("Canvas/mCon/mListCon")
    public mListCon: mw.Canvas = undefined;
    @UIWidgetBind("Canvas/mCon/mCloseBtn")
    public mCloseBtn: mw.StaleButton = undefined;
    @UIWidgetBind("Canvas/mCon")
    public mCon: mw.Canvas = undefined;

    protected onAwake() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerMiddle;
        this.initButtons();
    }
    protected initButtons() {
        //按钮添加点击

        this.mTypeBar1.onClicked.add(() => {
            Event.dispatchToLocal("PlayButtonClick", "mTypeBar1");
        });
        this.initLanguage(this.mTypeBar1);
        this.mTypeBar1.touchMethod = mw.ButtonTouchMethod.DownAndUp;

        this.mTypeBar2.onClicked.add(() => {
            Event.dispatchToLocal("PlayButtonClick", "mTypeBar2");
        });
        this.initLanguage(this.mTypeBar2);
        this.mTypeBar2.touchMethod = mw.ButtonTouchMethod.DownAndUp;

        this.mCloseBtn.onClicked.add(() => {
            Event.dispatchToLocal("PlayButtonClick", "mCloseBtn");
        });
        this.initLanguage(this.mCloseBtn);
        this.mCloseBtn.touchMethod = mw.ButtonTouchMethod.DownAndUp;

        //按钮添加点击

        //按钮多语言

        //文本多语言

        //文本多语言
    }
    private initLanguage(ui: mw.StaleButton | mw.TextBlock) {
        let call = mw.UIScript.getBehavior("lan");
        if (call && ui) {
            call(ui);
        }
    }
}

export class ActionPanel extends ActionPanel_Generate {
    /**
     * 构造UI文件成功后，在合适的时机最先初始化一次
     */
    protected onAwake() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerMiddle;
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

    /**
     * 每一帧调用
     * 通过canUpdate可以开启关闭调用
     * dt 两帧调用的时间差，毫秒
     */
    //protected onUpdate(dt :number) {
    //}

    /**
     * 设置显示时触发
     */
    //protected onShow(...params:any[]) {
    //}

    /**
     * 设置不显示时触发
     */
    //protected onHide() {
    //}
}
