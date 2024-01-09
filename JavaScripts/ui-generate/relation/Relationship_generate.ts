 

 @UIBind('UI/relation/Relationship.ui')
 export default class Relationship_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/close')
    public close: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/setDesignation/selfBg')
    public selfBg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/setDesignation/selfInput')
    public selfInput: mw.InputBox=undefined;
    @UIWidgetBind('RootCanvas/setDesignation/selfText')
    public selfText: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/setDesignation/otherBg')
    public otherBg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/setDesignation/otherInput')
    public otherInput: mw.InputBox=undefined;
    @UIWidgetBind('RootCanvas/setDesignation/otherText')
    public otherText: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/setDesignation/sure')
    public sure: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/setDesignation/clear')
    public clear: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/setDesignation/select')
    public select: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/setDesignation/cancel')
    public cancel: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/setDesignation')
    public setDesignation: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/selectPlayer/mScroll/mContent')
    public mContent: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/selectPlayer/mScroll')
    public mScroll: mw.ScrollBox=undefined;
    @UIWidgetBind('RootCanvas/selectPlayer')
    public selectPlayer: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.sure.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "sure");
         })
         this.sure.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "sure");
         })
         this.sure.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "sure");
         })
         this.sure.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.clear.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "clear");
         })
         this.clear.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "clear");
         })
         this.clear.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "clear");
         })
         this.clear.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.select.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "select");
         })
         this.select.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "select");
         })
         this.select.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "select");
         })
         this.select.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
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
         this.setLanguage(this.sure);
	
         this.setLanguage(this.clear);
	
         this.setLanguage(this.select);
	
         this.setLanguage(this.cancel);
	
         //文本多语言
         this.setLanguage(this.selfText)
	
         this.setLanguage(this.otherText)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/setDesignation/Title") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/setDesignation/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/setDesignation/TextBlock_1") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/selectPlayer/TextBlock_2") as mw.TextBlock);
	
 
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
 