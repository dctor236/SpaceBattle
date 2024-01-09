 

 @UIBind('UI/ts3/OtherPHead.ui')
 export default class OtherPHead_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/nameNode')
    public nameNode: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/nameNode/txtName')
    public txtName: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/titleNode')
    public titleNode: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/titleNode/txtTitle')
    public txtTitle: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/chatNode')
    public chatNode: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/chatNode/txtChat')
    public txtChat: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/hpNode')
    public hpNode: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/hpNode/barHp')
    public barHp: mw.ProgressBar=undefined;
    @UIWidgetBind('Canvas/hpNode/thumbImage')
    public thumbImage: mw.Image=undefined;
    @UIWidgetBind('Canvas/hpNode/txtHp')
    public txtHp: mw.TextBlock=undefined;
    

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
         this.setLanguage(this.txtName)
	
         this.setLanguage(this.txtTitle)
	
         this.setLanguage(this.txtChat)
	
         this.setLanguage(this.txtHp)
	
 
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
 