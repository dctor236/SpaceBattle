 

 @UIBind('UI/uiTemplate/common/ItemInfoUI.ui')
 export default class ItemInfoUI_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/buttonExit')
    public buttonExit: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/imageBG')
    public imageBG: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/imageIcon')
    public imageIcon: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/textName')
    public textName: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/textDescription')
    public textDescription: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/txtClose')
    public txtClose: mw.TextBlock=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         this.buttonExit.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "buttonExit");
         })
         this.buttonExit.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "buttonExit");
         })
         this.buttonExit.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "buttonExit");
         })
         this.buttonExit.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         //文本多语言
         this.setLanguage(this.textName)
	
         this.setLanguage(this.textDescription)
	
         this.setLanguage(this.txtClose)
	
 
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
 