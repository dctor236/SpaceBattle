 

 @UIBind('UI/relation/Designation.ui')
 export default class Designation_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/close')
    public close: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/relationInfo/designation')
    public designation: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/relationInfo/remainTime')
    public remainTime: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/relationInfo/transmit')
    public transmit: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/relationInfo/cancel')
    public cancel: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/relationInfo')
    public relationInfo: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.transmit.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "transmit");
         })
         this.transmit.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "transmit");
         })
         this.transmit.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "transmit");
         })
         this.transmit.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.cancel.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "cancel");
         })
         this.cancel.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "cancel");
         })
         this.cancel.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "cancel");
         })
         this.cancel.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.close.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "close");
         })
         this.close.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "close");
         })
         this.close.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "close");
         })
         this.close.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.transmit);
	
         this.setLanguage(this.cancel);
	
         //文本多语言
         this.setLanguage(this.designation)
	
         this.setLanguage(this.remainTime)
	
 
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
 