 

 @UIBind('UI/task/GuidePoint.ui')
 export default class GuidePoint_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/canvas_move')
    public canvas_move: mw.Canvas=undefined;
    

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
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ItemCanvas1/Distance") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ItemCanvas2/Distance") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ItemCanvas3/Distance") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ItemCanvas4/Distance") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ItemCanvas5/Distance") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ItemCanvas6/Distance") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ItemCanvas7/Distance") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ItemCanvas8/Distance") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ItemCanvas9/Distance") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ItemCanvas10/Distance") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ItemCanvas11/Distance") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/ItemCanvas12/Distance") as mw.TextBlock);
	
 
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
 