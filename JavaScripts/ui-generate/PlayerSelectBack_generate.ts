 

 @UIBind('UI/PlayerSelectBack.ui')
 export default class PlayerSelectBack_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/mYes')
    public mYes: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mNo')
    public mNo: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mContent')
    public mContent: mw.TextBlock=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         this.mYes.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mYes");
         })
         this.mYes.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mYes");
         })
         this.mYes.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mYes");
         })
         this.mYes.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mNo.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mNo");
         })
         this.mNo.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mNo");
         })
         this.mNo.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mNo");
         })
         this.mNo.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         //文本多语言
         this.setLanguage(this.mContent)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mYes/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mNo/TextBlock") as mw.TextBlock);
	
 
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
 