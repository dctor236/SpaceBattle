 

 @UIBind('UI/uiTemplate/common/Tips.ui')
 export default class Tips_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/mCell1')
    public mCell1: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCell2')
    public mCell2: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCell3')
    public mCell3: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         //文本多语言
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mCell1/Content_txt") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mCell2/Content_txt") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mCell3/Content_txt") as mw.TextBlock);
	
 
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
 