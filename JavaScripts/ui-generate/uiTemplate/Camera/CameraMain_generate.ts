 

 @UIBind('UI/uiTemplate/Camera/CameraMain.ui')
 export default class CameraMain_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/mTouchPad')
    public mTouchPad: mw.TouchPad=undefined;
    @UIWidgetBind('Canvas/mCanvas_Setting/mCanvas_Filter/mButton_Filter')
    public mButton_Filter: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvas_Setting/mCanvas_Filter')
    public mCanvas_Filter: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvas_Setting/mCanvas_Action/mButton_Action')
    public mButton_Action: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvas_Setting/mCanvas_Action')
    public mCanvas_Action: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvas_Setting')
    public mCanvas_Setting: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvas_LR/mProgressBar_LR')
    public mProgressBar_LR: mw.ProgressBar=undefined;
    @UIWidgetBind('Canvas/mCanvas_LR')
    public mCanvas_LR: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvas_Camera/mButton_Camera')
    public mButton_Camera: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvas_Camera')
    public mCanvas_Camera: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvas_Distance/mProgressBar_Distance')
    public mProgressBar_Distance: mw.ProgressBar=undefined;
    @UIWidgetBind('Canvas/mCanvas_Distance')
    public mCanvas_Distance: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvas_Switch/mButton_Switch')
    public mButton_Switch: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvas_Switch')
    public mCanvas_Switch: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvas_Move/mButton_Left')
    public mButton_Left: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvas_Move/mButton_Right')
    public mButton_Right: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvas_Move/mButton_UP')
    public mButton_UP: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvas_Move/mButton_Down')
    public mButton_Down: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvas_Move')
    public mCanvas_Move: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvas_Close/mButton_Close')
    public mButton_Close: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvas_Close')
    public mCanvas_Close: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         this.mButton_Filter.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mButton_Filter");
         })
         this.mButton_Filter.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mButton_Filter");
         })
         this.mButton_Filter.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mButton_Filter");
         })
         this.mButton_Filter.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mButton_Action.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mButton_Action");
         })
         this.mButton_Action.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mButton_Action");
         })
         this.mButton_Action.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mButton_Action");
         })
         this.mButton_Action.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mButton_Camera.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mButton_Camera");
         })
         this.mButton_Camera.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mButton_Camera");
         })
         this.mButton_Camera.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mButton_Camera");
         })
         this.mButton_Camera.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mButton_Switch.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mButton_Switch");
         })
         this.mButton_Switch.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mButton_Switch");
         })
         this.mButton_Switch.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mButton_Switch");
         })
         this.mButton_Switch.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mButton_Left.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mButton_Left");
         })
         this.mButton_Left.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mButton_Left");
         })
         this.mButton_Left.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mButton_Left");
         })
         this.mButton_Left.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mButton_Right.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mButton_Right");
         })
         this.mButton_Right.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mButton_Right");
         })
         this.mButton_Right.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mButton_Right");
         })
         this.mButton_Right.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mButton_UP.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mButton_UP");
         })
         this.mButton_UP.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mButton_UP");
         })
         this.mButton_UP.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mButton_UP");
         })
         this.mButton_UP.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mButton_Down.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mButton_Down");
         })
         this.mButton_Down.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mButton_Down");
         })
         this.mButton_Down.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mButton_Down");
         })
         this.mButton_Down.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mButton_Close.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mButton_Close");
         })
         this.mButton_Close.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mButton_Close");
         })
         this.mButton_Close.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mButton_Close");
         })
         this.mButton_Close.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
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
 