 

 @UIBind('UI/facadModule/WearItem.ui')
 export default class WearItem_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/mWearItem/mImgBG')
    public mImgBG: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mWearItem/mWearImg')
    public mWearImg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mWearItem/mPrice')
    public mPrice: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mWearItem/mGoldImg')
    public mGoldImg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mWearItem/mCloseBtn')
    public mCloseBtn: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mWearItem/mGetTip')
    public mGetTip: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mWearItem')
    public mWearItem: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
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
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         //文本多语言
         this.setLanguage(this.mPrice)
	
         this.setLanguage(this.mGetTip)
	
 
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
 