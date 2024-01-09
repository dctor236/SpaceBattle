 

 @UIBind('UI/relation/RelationInteract.ui')
 export default class RelationInteract_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/bg_1')
    public bg_1: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/bg')
    public bg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/textBg')
    public textBg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/desc')
    public desc: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/accept')
    public accept: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/refuse')
    public refuse: mw.StaleButton=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.accept.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "accept");
         })
         this.accept.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "accept");
         })
         this.accept.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "accept");
         })
         this.accept.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.refuse.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "refuse");
         })
         this.refuse.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "refuse");
         })
         this.refuse.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "refuse");
         })
         this.refuse.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.accept);
	
         this.setLanguage(this.refuse);
	
         //文本多语言
         this.setLanguage(this.desc)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/TextBlock") as mw.TextBlock);
	
 
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
 