 

 @UIBind('UI/facadModule/FacadCart.ui')
 export default class FacadCart_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/mGetTxt')
    public mGetTxt: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mPriceView/mGoldIcon')
    public mGoldIcon: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mPriceView/mTotalPrice')
    public mTotalPrice: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mPriceView')
    public mPriceView: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mScroll/mWearCanvas')
    public mWearCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mScroll')
    public mScroll: mw.ScrollBox=undefined;
    @UIWidgetBind('RootCanvas/mBuyBtn')
    public mBuyBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mCloseBtn')
    public mCloseBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/dividingline_up')
    public dividingline_up: mw.Image=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
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
         this.setLanguage(this.mBuyBtn);
	
         this.setLanguage(this.mCloseBtn);
	
         //文本多语言
         this.setLanguage(this.mGetTxt)
	
         this.setLanguage(this.mTotalPrice)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mPriceView/TextBlock_2") as mw.TextBlock);
	
 
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
 