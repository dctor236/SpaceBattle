 

 @UIBind('UI/uiTemplate/NPC/NPCItem.ui')
 export default class NPCItem_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/btn')
    public btn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/icon')
    public icon: mw.Image=undefined;
    @UIWidgetBind('Canvas/select')
    public select: mw.Image=undefined;
    @UIWidgetBind('Canvas/des')
    public des: mw.TextBlock=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn");
         })
         this.btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn");
         })
         this.btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn");
         })
         this.btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.btn);
	
         //文本多语言
         this.setLanguage(this.des)
	
 
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
 