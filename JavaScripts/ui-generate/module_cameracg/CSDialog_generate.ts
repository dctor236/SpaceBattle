 

 @UIBind('UI/module_cameracg/CSDialog.ui')
 export default class CSDialog_Generate extends mw.UIScript {
     @UIWidgetBind('MWCanvas_2147482460/mBtnClose')
    public mBtnClose: mw.Button=undefined;
    @UIWidgetBind('MWCanvas_2147482460/CanvasDialog/CanvasBtnYes/mBtnYes')
    public mBtnYes: mw.Button=undefined;
    @UIWidgetBind('MWCanvas_2147482460/CanvasDialog/CanvasBtnNo/mBtnNo')
    public mBtnNo: mw.Button=undefined;
    @UIWidgetBind('MWCanvas_2147482460/CanvasDialog/mTextContent')
    public mTextContent: mw.TextBlock=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         this.mBtnClose.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnClose");
         })
         this.mBtnClose.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnClose");
         })
         this.mBtnClose.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnClose");
         })
         this.mBtnClose.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnYes.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnYes");
         })
         this.mBtnYes.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnYes");
         })
         this.mBtnYes.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnYes");
         })
         this.mBtnYes.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnNo.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnNo");
         })
         this.mBtnNo.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnNo");
         })
         this.mBtnNo.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnNo");
         })
         this.mBtnNo.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         //文本多语言
         this.setLanguage(this.mTextContent)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas_2147482460/CanvasDialog/CanvasBtnYes/Text") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas_2147482460/CanvasDialog/CanvasBtnNo/Text") as mw.TextBlock);
	
 
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
 