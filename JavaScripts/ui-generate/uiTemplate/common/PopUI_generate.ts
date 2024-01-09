 

 @UIBind('UI/uiTemplate/common/PopUI.ui')
 export default class PopUI_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/btnClose')
    public btnClose: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mContent')
    public mContent: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/btnLeft')
    public btnLeft: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/btnMid')
    public btnMid: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/btnRight')
    public btnRight: mw.StaleButton=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.btnLeft.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btnLeft");
         })
         this.btnLeft.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btnLeft");
         })
         this.btnLeft.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btnLeft");
         })
         this.btnLeft.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btnMid.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btnMid");
         })
         this.btnMid.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btnMid");
         })
         this.btnMid.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btnMid");
         })
         this.btnMid.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btnRight.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btnRight");
         })
         this.btnRight.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btnRight");
         })
         this.btnRight.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btnRight");
         })
         this.btnRight.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.btnClose.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btnClose");
         })
         this.btnClose.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btnClose");
         })
         this.btnClose.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btnClose");
         })
         this.btnClose.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.btnLeft);
	
         this.setLanguage(this.btnMid);
	
         this.setLanguage(this.btnRight);
	
         //文本多语言
         this.setLanguage(this.mContent)
	
 
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
 