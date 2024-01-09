 

 @UIBind('UI/vehicle/CarDrive.ui')
 export default class CarDrive_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/mDrive')
    public mDrive: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mDrive/mBackBtn')
    public mBackBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mDrive/mFrontBtn')
    public mFrontBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mDrive/mCanvas_restart')
    public mCanvas_restart: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mDrive/mCanvas_restart/mBtn_restart')
    public mBtn_restart: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mDrive/mHornBtn')
    public mHornBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mLeftBtn')
    public mLeftBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mRightBtn')
    public mRightBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mBrakeBtn')
    public mBrakeBtn: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mAlarmBox')
    public mAlarmBox: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mAlarmBox/mAlarmBox1')
    public mAlarmBox1: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mAlarmBox/mAlarmBox1/mLamp1')
    public mLamp1: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mAlarmBox/mAlarmBox2')
    public mAlarmBox2: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mAlarmBox/mAlarmBox2/mLamp2')
    public mLamp2: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mAlarmBox/mAlarmBox3')
    public mAlarmBox3: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mAlarmBox/mAlarmBox3/mLamp3')
    public mLamp3: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mCraneSlider')
    public mCraneSlider: mw.ProgressBar=undefined;
    @UIWidgetBind('RootCanvas/mCraneBox')
    public mCraneBox: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mCraneBox/mCraneBtn')
    public mCraneBtn: mw.StaleButton=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mBackBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBackBtn");
         })
         this.mBackBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBackBtn");
         })
         this.mBackBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBackBtn");
         })
         this.mBackBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mFrontBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mFrontBtn");
         })
         this.mFrontBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mFrontBtn");
         })
         this.mFrontBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mFrontBtn");
         })
         this.mFrontBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mHornBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mHornBtn");
         })
         this.mHornBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mHornBtn");
         })
         this.mHornBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mHornBtn");
         })
         this.mHornBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mLeftBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mLeftBtn");
         })
         this.mLeftBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mLeftBtn");
         })
         this.mLeftBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mLeftBtn");
         })
         this.mLeftBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mRightBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mRightBtn");
         })
         this.mRightBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mRightBtn");
         })
         this.mRightBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mRightBtn");
         })
         this.mRightBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mCraneBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mCraneBtn");
         })
         this.mCraneBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mCraneBtn");
         })
         this.mCraneBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mCraneBtn");
         })
         this.mCraneBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.mBtn_restart.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_restart");
         })
         this.mBtn_restart.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_restart");
         })
         this.mBtn_restart.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_restart");
         })
         this.mBtn_restart.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBrakeBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBrakeBtn");
         })
         this.mBrakeBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBrakeBtn");
         })
         this.mBrakeBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBrakeBtn");
         })
         this.mBrakeBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mLamp1.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mLamp1");
         })
         this.mLamp1.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mLamp1");
         })
         this.mLamp1.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mLamp1");
         })
         this.mLamp1.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mLamp2.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mLamp2");
         })
         this.mLamp2.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mLamp2");
         })
         this.mLamp2.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mLamp2");
         })
         this.mLamp2.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mLamp3.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mLamp3");
         })
         this.mLamp3.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mLamp3");
         })
         this.mLamp3.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mLamp3");
         })
         this.mLamp3.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mBackBtn);
	
         this.setLanguage(this.mFrontBtn);
	
         this.setLanguage(this.mHornBtn);
	
         this.setLanguage(this.mLeftBtn);
	
         this.setLanguage(this.mRightBtn);
	
         this.setLanguage(this.mCraneBtn);
	
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
 