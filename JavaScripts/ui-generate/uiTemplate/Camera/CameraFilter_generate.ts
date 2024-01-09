 

 @UIBind('UI/uiTemplate/Camera/CameraFilter.ui')
 export default class CameraFilter_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/mCanvas/mCanvas_1/mScrollBox_1')
    public mScrollBox_1: mw.ScrollBox=undefined;
    @UIWidgetBind('Canvas/mCanvas/mCanvas_1/mText_1')
    public mText_1: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mCanvas/mCanvas_1')
    public mCanvas_1: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvas/mCanvas_2/mScrollBox_2')
    public mScrollBox_2: mw.ScrollBox=undefined;
    @UIWidgetBind('Canvas/mCanvas/mCanvas_2/mText_2')
    public mText_2: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mCanvas/mCanvas_2')
    public mCanvas_2: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvas')
    public mCanvas: mw.Canvas=undefined;
    

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
         this.setLanguage(this.mText_1)
	
         this.setLanguage(this.mText_2)
	
 
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
 