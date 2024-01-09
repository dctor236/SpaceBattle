 

 @UIBind('UI/SettingUI.ui')
 export default class SettingUI_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/Canvas/mBtn_NameCard')
    public mBtn_NameCard: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas/mBtn_Graphics')
    public mBtn_Graphics: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/Canvas/mBtn_Sound')
    public mBtn_Sound: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mCanvasNameCard/mInput_Title')
    public mInput_Title: mw.InputBox=undefined;
    @UIWidgetBind('RootCanvas/mCanvasNameCard/mBtn_ResetTitle')
    public mBtn_ResetTitle: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mCanvasNameCard/mBtn_EnterTitle')
    public mBtn_EnterTitle: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mCanvasNameCard')
    public mCanvasNameCard: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mCanvasSound/mBar_Music')
    public mBar_Music: mw.ProgressBar=undefined;
    @UIWidgetBind('RootCanvas/mCanvasSound/mBar_Sound')
    public mBar_Sound: mw.ProgressBar=undefined;
    @UIWidgetBind('RootCanvas/mCanvasSound')
    public mCanvasSound: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBtn_Exit')
    public mBtn_Exit: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mCanvasGraphics/CanvasGraphics/mBar_GraphicsLev')
    public mBar_GraphicsLev: mw.ProgressBar=undefined;
    @UIWidgetBind('RootCanvas/mCanvasGraphics/CanvasGraphics/mBtn_GrapReset')
    public mBtn_GrapReset: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mCanvasGraphics/CanvasGraphics/mBtn_GrapCancel')
    public mBtn_GrapCancel: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mCanvasGraphics/CanvasGraphics/mBtn_GrapEnter')
    public mBtn_GrapEnter: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mCanvasGraphics/CanvasGraphics/mTxt_GrapLevNum')
    public mTxt_GrapLevNum: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mCanvasGraphics')
    public mCanvasGraphics: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mBtn_GrapReset.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_GrapReset");
         })
         this.mBtn_GrapReset.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_GrapReset");
         })
         this.mBtn_GrapReset.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_GrapReset");
         })
         this.mBtn_GrapReset.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn_GrapCancel.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_GrapCancel");
         })
         this.mBtn_GrapCancel.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_GrapCancel");
         })
         this.mBtn_GrapCancel.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_GrapCancel");
         })
         this.mBtn_GrapCancel.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn_GrapEnter.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_GrapEnter");
         })
         this.mBtn_GrapEnter.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_GrapEnter");
         })
         this.mBtn_GrapEnter.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_GrapEnter");
         })
         this.mBtn_GrapEnter.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.mBtn_NameCard.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_NameCard");
         })
         this.mBtn_NameCard.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_NameCard");
         })
         this.mBtn_NameCard.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_NameCard");
         })
         this.mBtn_NameCard.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn_Graphics.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_Graphics");
         })
         this.mBtn_Graphics.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_Graphics");
         })
         this.mBtn_Graphics.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_Graphics");
         })
         this.mBtn_Graphics.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn_Sound.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_Sound");
         })
         this.mBtn_Sound.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_Sound");
         })
         this.mBtn_Sound.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_Sound");
         })
         this.mBtn_Sound.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn_ResetTitle.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_ResetTitle");
         })
         this.mBtn_ResetTitle.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_ResetTitle");
         })
         this.mBtn_ResetTitle.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_ResetTitle");
         })
         this.mBtn_ResetTitle.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn_EnterTitle.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_EnterTitle");
         })
         this.mBtn_EnterTitle.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_EnterTitle");
         })
         this.mBtn_EnterTitle.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_EnterTitle");
         })
         this.mBtn_EnterTitle.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn_Exit.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_Exit");
         })
         this.mBtn_Exit.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_Exit");
         })
         this.mBtn_Exit.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_Exit");
         })
         this.mBtn_Exit.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mBtn_GrapReset);
	
         this.setLanguage(this.mBtn_GrapCancel);
	
         this.setLanguage(this.mBtn_GrapEnter);
	
         //文本多语言
         this.setLanguage(this.mTxt_GrapLevNum)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas/mBtn_NameCard/TextBlock_2") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas/mBtn_Graphics/TextBlock_3") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/Canvas/mBtn_Sound/TextBlock_4") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mCanvasNameCard/TextBlock_6") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mCanvasNameCard/mBtn_ResetTitle/TextBlock_5_1") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mCanvasNameCard/mBtn_EnterTitle/TextBlock_5") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mCanvasSound/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mCanvasSound/TextBlock_1") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mCanvasGraphics/CanvasGraphics/TextBlock_7") as mw.TextBlock);
	
 
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
 