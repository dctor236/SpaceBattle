 

 @UIBind('UI/module_cameracg/CSDialogLoad.ui')
 export default class CSDialogLoad_Generate extends mw.UIScript {
     @UIWidgetBind('MWCanvas_2147482460/mBtnClose')
    public mBtnClose: mw.Button=undefined;
    @UIWidgetBind('MWCanvas_2147482460/CanvasDialog/CanvasBtn5/mBtnLoad')
    public mBtnLoad: mw.Button=undefined;
    @UIWidgetBind('MWCanvas_2147482460/CanvasDialog/mInput')
    public mInput: mw.InputBox=undefined;
    

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
	
         this.mBtnLoad.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnLoad");
         })
         this.mBtnLoad.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnLoad");
         })
         this.mBtnLoad.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnLoad");
         })
         this.mBtnLoad.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
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
 