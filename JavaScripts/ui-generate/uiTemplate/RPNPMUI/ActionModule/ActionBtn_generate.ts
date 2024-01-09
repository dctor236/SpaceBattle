 

 @UIBind('UI/uiTemplate/RPNPMUI/ActionModule/ActionBtn.ui')
 export default class ActionBtn_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/nameText')
    public nameText: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/descText')
    public descText: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/yesBtn')
    public yesBtn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/noBtn')
    public noBtn: mw.StaleButton=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.yesBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "yesBtn");
         })
         this.yesBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "yesBtn");
         })
         this.yesBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "yesBtn");
         })
         this.yesBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.noBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "noBtn");
         })
         this.noBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "noBtn");
         })
         this.noBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "noBtn");
         })
         this.noBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.yesBtn);
	
         this.setLanguage(this.noBtn);
	
         //文本多语言
         this.setLanguage(this.nameText)
	
         this.setLanguage(this.descText)
	
 
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
 