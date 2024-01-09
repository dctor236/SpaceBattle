 

 @UIBind('UI/skill/SkillUI.ui')
 export default class SkillUI_Generate extends mw.UIScript {
     @UIWidgetBind('MWCanvas/mSkill1')
    public mSkill1: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/mSkill1/mMaskButton1')
    public mMaskButton1: mw.MaskButton=undefined;
    @UIWidgetBind('MWCanvas/mSkill1/mBtn1')
    public mBtn1: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mSkill1/mFire1')
    public mFire1: mw.VirtualJoystickPanel=undefined;
    @UIWidgetBind('MWCanvas/mSkill1/mCount1')
    public mCount1: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill1/mDis1')
    public mDis1: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/mSkill1/mDes1')
    public mDes1: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill1/mCD1')
    public mCD1: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill2')
    public mSkill2: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/mSkill2/mMaskButton2')
    public mMaskButton2: mw.MaskButton=undefined;
    @UIWidgetBind('MWCanvas/mSkill2/mBtn2')
    public mBtn2: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mSkill2/mFire2')
    public mFire2: mw.VirtualJoystickPanel=undefined;
    @UIWidgetBind('MWCanvas/mSkill2/mCount2')
    public mCount2: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill2/mDis2')
    public mDis2: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/mSkill2/mDes2')
    public mDes2: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill2/mCD2')
    public mCD2: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill3')
    public mSkill3: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/mSkill3/mMaskButton3')
    public mMaskButton3: mw.MaskButton=undefined;
    @UIWidgetBind('MWCanvas/mSkill3/mBtn3')
    public mBtn3: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mSkill3/mFire3')
    public mFire3: mw.VirtualJoystickPanel=undefined;
    @UIWidgetBind('MWCanvas/mSkill3/mCount3')
    public mCount3: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill3/mDis3')
    public mDis3: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/mSkill3/mDes3')
    public mDes3: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill3/mCD3')
    public mCD3: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill4')
    public mSkill4: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/mSkill4/mMaskButton4')
    public mMaskButton4: mw.MaskButton=undefined;
    @UIWidgetBind('MWCanvas/mSkill4/mBtn4')
    public mBtn4: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mSkill4/mFire4')
    public mFire4: mw.VirtualJoystickPanel=undefined;
    @UIWidgetBind('MWCanvas/mSkill4/mCount4')
    public mCount4: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill4/mDis4')
    public mDis4: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/mSkill4/mDes4')
    public mDes4: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill4/mCD4')
    public mCD4: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mAim')
    public mAim: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/mAim/mAimImage')
    public mAimImage: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/mAim/point')
    public point: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/mAim/Canvas_3/Canvas/mAtk')
    public mAtk: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas/mSkill6')
    public mSkill6: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/mSkill6/mMaskButton6')
    public mMaskButton6: mw.MaskButton=undefined;
    @UIWidgetBind('MWCanvas/mSkill6/mBtn6')
    public mBtn6: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mSkill6/mFire6')
    public mFire6: mw.VirtualJoystickPanel=undefined;
    @UIWidgetBind('MWCanvas/mSkill6/mCount6')
    public mCount6: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill6/mDis6')
    public mDis6: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/mSkill6/mDes6')
    public mDes6: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill6/mCD6')
    public mCD6: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill5')
    public mSkill5: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/mSkill5/mMaskButton5')
    public mMaskButton5: mw.MaskButton=undefined;
    @UIWidgetBind('MWCanvas/mSkill5/mBtn5')
    public mBtn5: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mSkill5/mFire5')
    public mFire5: mw.VirtualJoystickPanel=undefined;
    @UIWidgetBind('MWCanvas/mSkill5/mCount5')
    public mCount5: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill5/mDis5')
    public mDis5: mw.Image=undefined;
    @UIWidgetBind('MWCanvas/mSkill5/mDes5')
    public mDes5: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mSkill5/mCD5')
    public mCD5: mw.TextBlock=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mAtk.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mAtk");
         })
         this.mAtk.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mAtk");
         })
         this.mAtk.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mAtk");
         })
         this.mAtk.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.mBtn1.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn1");
         })
         this.mBtn1.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn1");
         })
         this.mBtn1.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn1");
         })
         this.mBtn1.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn2.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn2");
         })
         this.mBtn2.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn2");
         })
         this.mBtn2.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn2");
         })
         this.mBtn2.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn3.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn3");
         })
         this.mBtn3.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn3");
         })
         this.mBtn3.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn3");
         })
         this.mBtn3.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn4.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn4");
         })
         this.mBtn4.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn4");
         })
         this.mBtn4.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn4");
         })
         this.mBtn4.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn6.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn6");
         })
         this.mBtn6.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn6");
         })
         this.mBtn6.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn6");
         })
         this.mBtn6.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn5.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn5");
         })
         this.mBtn5.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn5");
         })
         this.mBtn5.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn5");
         })
         this.mBtn5.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mAtk);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mAim/Canvas/Atk") as mw.StaleButton);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mAim/Canvas_1/Canvas/Atk") as mw.StaleButton);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mAim/Canvas_2/Canvas/Atk") as mw.StaleButton);
	
         //文本多语言
         this.setLanguage(this.mCount1)
	
         this.setLanguage(this.mDes1)
	
         this.setLanguage(this.mCD1)
	
         this.setLanguage(this.mCount2)
	
         this.setLanguage(this.mDes2)
	
         this.setLanguage(this.mCD2)
	
         this.setLanguage(this.mCount3)
	
         this.setLanguage(this.mDes3)
	
         this.setLanguage(this.mCD3)
	
         this.setLanguage(this.mCount4)
	
         this.setLanguage(this.mDes4)
	
         this.setLanguage(this.mCD4)
	
         this.setLanguage(this.mCount6)
	
         this.setLanguage(this.mDes6)
	
         this.setLanguage(this.mCD6)
	
         this.setLanguage(this.mCount5)
	
         this.setLanguage(this.mDes5)
	
         this.setLanguage(this.mCD5)
	
 
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
 