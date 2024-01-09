 

 @UIBind('UI/uiTemplate/UI_Travel_Window.ui')
 export default class UI_Travel_Window_Generate extends mw.UIScript {
     @UIWidgetBind('MWCanvas_2147482460/mCanvasMain/mImg')
    public mImg: mw.Image=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mCanvasMain/mTitleImg')
    public mTitleImg: mw.Image=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mCanvasMain/mBtnBack')
    public mBtnBack: mw.Button=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mCanvasMain/mBTnJoin')
    public mBTnJoin: mw.Button=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mCanvasMain/mTextJoin')
    public mTextJoin: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas_2147482460/mCanvasMain')
    public mCanvasMain: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         this.mBtnBack.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnBack");
         })
         this.mBtnBack.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnBack");
         })
         this.mBtnBack.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnBack");
         })
         this.mBtnBack.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBTnJoin.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBTnJoin");
         })
         this.mBTnJoin.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBTnJoin");
         })
         this.mBTnJoin.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBTnJoin");
         })
         this.mBTnJoin.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         //文本多语言
         this.setLanguage(this.mTextJoin)
	
 
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
 