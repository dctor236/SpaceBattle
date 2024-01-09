 

 @UIBind('UI/uiTemplate/RPNPMUI/ActionModule/ActionPanel.ui')
 export default class ActionPanel_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/mCon/mTypeBar1')
    public mTypeBar1: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mCon/mTypeBar2')
    public mTypeBar2: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mCon/mListCon/mScr/mContent')
    public mContent: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCon/mListCon/mScr')
    public mScr: mw.ScrollBox=undefined;
    @UIWidgetBind('Canvas/mCon/mListCon')
    public mListCon: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCon/mCloseBtn')
    public mCloseBtn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mCon')
    public mCon: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mTypeBar1.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTypeBar1");
         })
         this.mTypeBar1.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTypeBar1");
         })
         this.mTypeBar1.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTypeBar1");
         })
         this.mTypeBar1.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mTypeBar2.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTypeBar2");
         })
         this.mTypeBar2.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTypeBar2");
         })
         this.mTypeBar2.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTypeBar2");
         })
         this.mTypeBar2.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mCloseBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mCloseBtn");
         })
         this.mCloseBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mCloseBtn");
         })
         this.mCloseBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mCloseBtn");
         })
         this.mCloseBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mTypeBar1);
	
         this.setLanguage(this.mTypeBar2);
	
         this.setLanguage(this.mCloseBtn);
	
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
 