 

 @UIBind('UI/bag/BagItem.ui')
 export default class BagItem_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/mBg')
    public mBg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mBtn')
    public mBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mIcon')
    public mIcon: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mTips')
    public mTips: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mSelect')
    public mSelect: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mRemove')
    public mRemove: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mInfoCon/mBottom')
    public mBottom: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mInfoCon/durProgress')
    public durProgress: mw.ProgressBar=undefined;
    @UIWidgetBind('RootCanvas/mInfoCon/mItemInfo')
    public mItemInfo: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mInfoCon')
    public mInfoCon: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mName')
    public mName: mw.TextBlock=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn");
         })
         this.mBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn");
         })
         this.mBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn");
         })
         this.mBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.mTips.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTips");
         })
         this.mTips.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTips");
         })
         this.mTips.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTips");
         })
         this.mTips.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mRemove.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mRemove");
         })
         this.mRemove.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mRemove");
         })
         this.mRemove.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mRemove");
         })
         this.mRemove.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mBtn);
	
         //文本多语言
         this.setLanguage(this.mItemInfo)
	
         this.setLanguage(this.mName)
	
 
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
 