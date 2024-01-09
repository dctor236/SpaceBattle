 

 @UIBind('UI/task/TaskItem.ui')
 export default class TaskItem_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/Canvas/img_Icon')
    public img_Icon: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/Canvas/txt_num')
    public txt_num: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/txt_Name')
    public txt_Name: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/Canvas_1/txt_Des')
    public txt_Des: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mGuidState/btn_Guide')
    public btn_Guide: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mGuidState/guideCanvas/btn_To')
    public btn_To: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mGuidState/guideCanvas/mGuideTex')
    public mGuideTex: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mGuidState/guideCanvas')
    public guideCanvas: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mGuidState/mStateText')
    public mStateText: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mGuidState/mMask')
    public mMask: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mGuidState/mFinish')
    public mFinish: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mGuidState')
    public mGuidState: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.btn_Guide.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn_Guide");
         })
         this.btn_Guide.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn_Guide");
         })
         this.btn_Guide.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn_Guide");
         })
         this.btn_Guide.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btn_To.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn_To");
         })
         this.btn_To.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn_To");
         })
         this.btn_To.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn_To");
         })
         this.btn_To.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.btn_Guide);
	
         this.setLanguage(this.btn_To);
	
         //文本多语言
         this.setLanguage(this.txt_num)
	
         this.setLanguage(this.txt_Name)
	
         this.setLanguage(this.txt_Des)
	
         this.setLanguage(this.mGuideTex)
	
         this.setLanguage(this.mStateText)
	
 
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
 