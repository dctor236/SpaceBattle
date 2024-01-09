 

 @UIBind('UI/task/TaskMain.ui')
 export default class TaskMain_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/Canvas/mPanel2/mScrollFinish/mContentFinish')
    public mContentFinish: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/Canvas/mPanel2/mScrollFinish')
    public mScrollFinish: mw.ScrollBox=undefined;
    @UIWidgetBind('RootCanvas/Canvas/mPanel2')
    public mPanel2: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/Canvas/mPanel1/mScrollUnAccept/mContentUnAcc')
    public mContentUnAcc: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/Canvas/mPanel1/mScrollUnAccept')
    public mScrollUnAccept: mw.ScrollBox=undefined;
    @UIWidgetBind('RootCanvas/Canvas/mPanel1')
    public mPanel1: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/Canvas/btn_Close')
    public btn_Close: mw.Button=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         this.btn_Close.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn_Close");
         })
         this.btn_Close.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn_Close");
         })
         this.btn_Close.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn_Close");
         })
         this.btn_Close.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         //文本多语言
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas/mPanel2/TextBlock_2") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas/mPanel1/TextBlock_2") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas/TextBlock") as mw.TextBlock);
	
 
     }
     
     private setLanguage(ui: mw.StaleButton | mw.TextBlock) {
         let call = mw.UIScript.getBehavior("lan");
         if (call && ui) {
             call(ui);
         }
     }
     
     /**
       * 设置显示时触发
       */
     public show(...params: unknown[]) {
         mw.UIService.showUI(this, this.layer, ...params)
     }
 
     /**
      * 设置不显示时触发
      */
     public hide() {
         mw.UIService.hideUI(this)
     }
 
     protected onStart(): void{};
     protected onShow(...params: any[]): void {};
     protected onHide():void{};
 
     protected onUpdate(dt: number): void {
 
     }
     /**
      * 设置ui的父节点
      * @param parent 父节点
      */
     setParent(parent: mw.Canvas){
         parent.addChild(this.uiObject)
         this.uiObject.size = this.uiObject.size.set(this.rootCanvas.size)
     }
 }
 