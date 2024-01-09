 

 @UIBind('UI/uiTemplate/RPNPMUI/PropBase/P_PropFly.ui')
 export default class P_PropFly_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/mBtn')
    public mBtn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mBtn2')
    public mBtn2: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mBtn3')
    public mBtn3: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/forbidden')
    public forbidden: mw.Image=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn");
         })
         this.mBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn");
         })
         this.mBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn");
         })
         this.mBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn2.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn2");
         })
         this.mBtn2.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn2");
         })
         this.mBtn2.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn2");
         })
         this.mBtn2.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn3.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn3");
         })
         this.mBtn3.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn3");
         })
         this.mBtn3.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn3");
         })
         this.mBtn3.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mBtn);
	
         this.setLanguage(this.mBtn2);
	
         this.setLanguage(this.mBtn3);
	
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
 