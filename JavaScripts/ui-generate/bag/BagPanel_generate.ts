 

 @UIBind('UI/bag/BagPanel.ui')
 export default class BagPanel_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/mClose')
    public mClose: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mBagCon/mTagCon/mTypeBtn1')
    public mTypeBtn1: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mBagCon/mTagCon/mTypeBtn2')
    public mTypeBtn2: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mBagCon/mTagCon/mTypeBtn3')
    public mTypeBtn3: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mBagCon/mTagCon/mTypeBtn4')
    public mTypeBtn4: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mBagCon/mTagCon')
    public mTagCon: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBagCon/mListCon/mScroll/mContent')
    public mContent: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBagCon/mListCon/mScroll')
    public mScroll: mw.ScrollBox=undefined;
    @UIWidgetBind('RootCanvas/mBagCon/mListCon')
    public mListCon: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBagCon/mCloseBtn')
    public mCloseBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mBagCon')
    public mBagCon: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBarCon/mShortcutBar')
    public mShortcutBar: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mBarCon/mClear')
    public mClear: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mBarCon/mHideBar')
    public mHideBar: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mBarCon')
    public mBarCon: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mDetail/detailBG')
    public detailBG: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mDetail/mDetailText')
    public mDetailText: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mDetail/mDetailIcon')
    public mDetailIcon: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mDetail/mDetailClose')
    public mDetailClose: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mDetail/mDetailName')
    public mDetailName: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mDetail')
    public mDetail: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mDescription/mDescName')
    public mDescName: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mDescription/mDescBtn')
    public mDescBtn: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mDescription')
    public mDescription: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mClose.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mClose");
         })
         this.mClose.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mClose");
         })
         this.mClose.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mClose");
         })
         this.mClose.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mCloseBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mCloseBtn");
         })
         this.mCloseBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mCloseBtn");
         })
         this.mCloseBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mCloseBtn");
         })
         this.mCloseBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.mTypeBtn1.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTypeBtn1");
         })
         this.mTypeBtn1.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTypeBtn1");
         })
         this.mTypeBtn1.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTypeBtn1");
         })
         this.mTypeBtn1.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mTypeBtn2.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTypeBtn2");
         })
         this.mTypeBtn2.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTypeBtn2");
         })
         this.mTypeBtn2.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTypeBtn2");
         })
         this.mTypeBtn2.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mTypeBtn3.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTypeBtn3");
         })
         this.mTypeBtn3.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTypeBtn3");
         })
         this.mTypeBtn3.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTypeBtn3");
         })
         this.mTypeBtn3.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mTypeBtn4.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTypeBtn4");
         })
         this.mTypeBtn4.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTypeBtn4");
         })
         this.mTypeBtn4.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTypeBtn4");
         })
         this.mTypeBtn4.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mClear.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mClear");
         })
         this.mClear.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mClear");
         })
         this.mClear.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mClear");
         })
         this.mClear.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mHideBar.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mHideBar");
         })
         this.mHideBar.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mHideBar");
         })
         this.mHideBar.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mHideBar");
         })
         this.mHideBar.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mDetailClose.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mDetailClose");
         })
         this.mDetailClose.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mDetailClose");
         })
         this.mDetailClose.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mDetailClose");
         })
         this.mDetailClose.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mDescBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mDescBtn");
         })
         this.mDescBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mDescBtn");
         })
         this.mDescBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mDescBtn");
         })
         this.mDescBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mClose);
	
         this.setLanguage(this.mCloseBtn);
	
         //文本多语言
         this.setLanguage(this.mDetailText)
	
         this.setLanguage(this.mDetailName)
	
         this.setLanguage(this.mDescName)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mBagCon/mTagCon/mTypeBtn1/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mBagCon/mTagCon/mTypeBtn2/TextBlock_1") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mBagCon/mTagCon/mTypeBtn3/TextBlock_3") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mBagCon/mTagCon/mTypeBtn4/TextBlock_2") as mw.TextBlock);
	
 
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
 