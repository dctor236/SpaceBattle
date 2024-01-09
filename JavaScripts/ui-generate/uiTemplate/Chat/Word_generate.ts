 

 @UIBind('UI/uiTemplate/Chat/Word.ui')
 export default class Word_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/mBtn_word')
    public mBtn_word: mw.StaleButton=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mBtn_word.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_word");
         })
         this.mBtn_word.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_word");
         })
         this.mBtn_word.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_word");
         })
         this.mBtn_word.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mBtn_word);
	
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
 