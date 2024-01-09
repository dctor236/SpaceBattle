 

 @UIBind('UI/uiTemplate/GM/GMHUD.ui')
 export default class GMHUD_Generate extends mw.UIScript {
     @UIWidgetBind('MWCanvas_2147482460/argText')
    public argText: mw.InputBox=undefined;
    @UIWidgetBind('MWCanvas_2147482460/groupButton')
    public groupButton: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/cmdButton')
    public cmdButton: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/okButton')
    public okButton: mw.Button=undefined;
    @UIWidgetBind('MWCanvas_2147482460/dropList/cmdPanel')
    public cmdPanel: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas_2147482460/dropList')
    public dropList: mw.ScrollBox=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.groupButton.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "groupButton");
         })
         this.groupButton.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "groupButton");
         })
         this.groupButton.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "groupButton");
         })
         this.groupButton.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.cmdButton.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "cmdButton");
         })
         this.cmdButton.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "cmdButton");
         })
         this.cmdButton.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "cmdButton");
         })
         this.cmdButton.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.okButton.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "okButton");
         })
         this.okButton.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "okButton");
         })
         this.okButton.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "okButton");
         })
         this.okButton.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.groupButton);
	
         this.setLanguage(this.cmdButton);
	
         //文本多语言
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas_2147482460/okButton/TextBlock") as mw.TextBlock);
	
 
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
 