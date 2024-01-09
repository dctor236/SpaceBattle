 

 @UIBind('UI/bag/BagHub.ui')
 export default class BagHub_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/mContent/mBarCon/mShortcutBar')
    public mShortcutBar: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mContent/mBarCon/mClearBar')
    public mClearBar: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mContent/mBarCon')
    public mBarCon: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mContent/mHideBar')
    public mHideBar: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mContent')
    public mContent: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mFlyCon/mFlyHalo')
    public mFlyHalo: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mFlyCon/mFly')
    public mFly: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mFlyCon')
    public mFlyCon: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mGuideBtn')
    public mGuideBtn: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/guideBtn')
    public guideBtn: mw.Button=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         this.mClearBar.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mClearBar");
         })
         this.mClearBar.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mClearBar");
         })
         this.mClearBar.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mClearBar");
         })
         this.mClearBar.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mHideBar.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mHideBar");
         })
         this.mHideBar.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mHideBar");
         })
         this.mHideBar.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mHideBar");
         })
         this.mHideBar.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mGuideBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mGuideBtn");
         })
         this.mGuideBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mGuideBtn");
         })
         this.mGuideBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mGuideBtn");
         })
         this.mGuideBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.guideBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "guideBtn");
         })
         this.guideBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "guideBtn");
         })
         this.guideBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "guideBtn");
         })
         this.guideBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         //文本多语言
 
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
 