 

 @UIBind('UI/uiTemplate/NPC/NPCPanel.ui')
 export default class NPCPanel_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/talkCanvas')
    public talkCanvas: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/talkCanvas/click')
    public click: mw.Button=undefined;
    @UIWidgetBind('Canvas/talkCanvas/talkTxt')
    public talkTxt: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/talkCanvas/mGoodWillTxt')
    public mGoodWillTxt: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/guideBtn')
    public guideBtn: mw.Button=undefined;
    @UIWidgetBind('Canvas/scroll')
    public scroll: mw.ScrollBox=undefined;
    @UIWidgetBind('Canvas/scroll/mBtnCon')
    public mBtnCon: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         this.click.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "click");
         })
         this.click.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "click");
         })
         this.click.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "click");
         })
         this.click.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.guideBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "guideBtn");
         })
         this.guideBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "guideBtn");
         })
         this.guideBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "guideBtn");
         })
         this.guideBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         //文本多语言
         this.setLanguage(this.talkTxt)
	
         this.setLanguage(this.mGoodWillTxt)
	
 
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
 