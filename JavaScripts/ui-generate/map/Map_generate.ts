﻿ 

 @UIBind('UI/map/Map.ui')
 export default class Map_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/mapCanvas')
    public mapCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mapCanvas/backImg')
    public backImg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mapCanvas/imgCanvas')
    public imgCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mapCanvas/imgCanvas/mapImg')
    public mapImg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mapCanvas/targetLocBtn')
    public targetLocBtn: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mapCanvas/heroLocImg')
    public heroLocImg: mw.Image=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         this.targetLocBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "targetLocBtn");
         })
         this.targetLocBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "targetLocBtn");
         })
         this.targetLocBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "targetLocBtn");
         })
         this.targetLocBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
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
 