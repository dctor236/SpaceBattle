 

 @UIBind('UI/facadModule/FacadTip.ui')
 export default class FacadTip_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/mExitTip/mExitYes')
    public mExitYes: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mExitTip/mExitNo')
    public mExitNo: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mExitTip')
    public mExitTip: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mConfirmTip/mConfirmYes')
    public mConfirmYes: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mConfirmTip/mConfirmNo')
    public mConfirmNo: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mConfirmTip')
    public mConfirmTip: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBuyTip/mBuyImage')
    public mBuyImage: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mBuyTip/mBuyBtn')
    public mBuyBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mBuyTip')
    public mBuyTip: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mGetTip/mGetImage')
    public mGetImage: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mGetTip/mGetBtn')
    public mGetBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mGetTip/mGetTxt')
    public mGetTxt: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mGetTip')
    public mGetTip: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mExitYes.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mExitYes");
         })
         this.mExitYes.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mExitYes");
         })
         this.mExitYes.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mExitYes");
         })
         this.mExitYes.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mExitNo.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mExitNo");
         })
         this.mExitNo.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mExitNo");
         })
         this.mExitNo.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mExitNo");
         })
         this.mExitNo.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mConfirmYes.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mConfirmYes");
         })
         this.mConfirmYes.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mConfirmYes");
         })
         this.mConfirmYes.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mConfirmYes");
         })
         this.mConfirmYes.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mConfirmNo.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mConfirmNo");
         })
         this.mConfirmNo.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mConfirmNo");
         })
         this.mConfirmNo.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mConfirmNo");
         })
         this.mConfirmNo.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBuyBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBuyBtn");
         })
         this.mBuyBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBuyBtn");
         })
         this.mBuyBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBuyBtn");
         })
         this.mBuyBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mGetBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mGetBtn");
         })
         this.mGetBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mGetBtn");
         })
         this.mGetBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mGetBtn");
         })
         this.mGetBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mExitYes);
	
         this.setLanguage(this.mExitNo);
	
         this.setLanguage(this.mConfirmYes);
	
         this.setLanguage(this.mConfirmNo);
	
         this.setLanguage(this.mBuyBtn);
	
         this.setLanguage(this.mGetBtn);
	
         //文本多语言
         this.setLanguage(this.mGetTxt)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mExitTip/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mConfirmTip/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mBuyTip/TextBlock_2") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mGetTip/TextBlock_1") as mw.TextBlock);
	
 
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
 