 

 @UIBind('UI/buff/UIBuff.ui')
 export default class UIBuff_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/dynamicBg')
    public dynamicBg: mw.Image=undefined;
    @UIWidgetBind('Canvas/dynamicTip')
    public dynamicTip: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/dynamicInfo')
    public dynamicInfo: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/tip')
    public tip: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/inputBox')
    public inputBox: mw.InputBox=undefined;
    @UIWidgetBind('Canvas/btn_Spawn')
    public btn_Spawn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/btn_close')
    public btn_close: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/btn_open')
    public btn_open: mw.StaleButton=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.btn_Spawn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn_Spawn");
         })
         this.btn_Spawn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn_Spawn");
         })
         this.btn_Spawn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn_Spawn");
         })
         this.btn_Spawn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btn_close.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn_close");
         })
         this.btn_close.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn_close");
         })
         this.btn_close.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn_close");
         })
         this.btn_close.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btn_open.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn_open");
         })
         this.btn_open.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn_open");
         })
         this.btn_open.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn_open");
         })
         this.btn_open.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.btn_Spawn);
	
         this.setLanguage(this.btn_close);
	
         this.setLanguage(this.btn_open);
	
         //文本多语言
         this.setLanguage(this.dynamicTip)
	
         this.setLanguage(this.dynamicInfo)
	
         this.setLanguage(this.tip)
	
 
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
 