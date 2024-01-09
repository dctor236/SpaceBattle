 

 @UIBind('UI/shop/ShopItem.ui')
 export default class ShopItem_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/mName')
    public mName: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mBg')
    public mBg: mw.Image=undefined;
    @UIWidgetBind('Canvas/mIcon')
    public mIcon: mw.Image=undefined;
    @UIWidgetBind('Canvas/mNew')
    public mNew: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mHalo')
    public mHalo: mw.Image=undefined;
    @UIWidgetBind('Canvas/mClickBtn')
    public mClickBtn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mState')
    public mState: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mMoney')
    public mMoney: mw.Image=undefined;
    @UIWidgetBind('Canvas/mPrice')
    public mPrice: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mCount')
    public mCount: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mCanvasStar')
    public mCanvasStar: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mClickBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mClickBtn");
         })
         this.mClickBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mClickBtn");
         })
         this.mClickBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mClickBtn");
         })
         this.mClickBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mClickBtn);
	
         //文本多语言
         this.setLanguage(this.mName)
	
         this.setLanguage(this.mNew)
	
         this.setLanguage(this.mState)
	
         this.setLanguage(this.mPrice)
	
         this.setLanguage(this.mCount)
	
 
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
 