 

 @UIBind('UI/coin/NigthFind.ui')
 export default class NigthFind_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/goldCoinTxt')
    public goldCoinTxt: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/tipCanvas')
    public tipCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/tipCanvas/Canvas_1/count')
    public count: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/killCanvas')
    public killCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/killCanvas/Canvas/Canvas_1/killTips')
    public killTips: mw.TextBlock=undefined;
    

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
         this.setLanguage(this.goldCoinTxt)
	
         this.setLanguage(this.count)
	
         this.setLanguage(this.killTips)
	
 
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
 