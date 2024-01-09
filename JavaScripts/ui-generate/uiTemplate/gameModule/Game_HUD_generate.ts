 

 @UIBind('UI/uiTemplate/gameModule/Game_HUD.ui')
 export default class Game_HUD_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/JoyStick/mBtn_Trans')
    public mBtn_Trans: mw.Button=undefined;
    @UIWidgetBind('Canvas/mRightDownCon')
    public mRightDownCon: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mRightDownCon/mJump_btn')
    public mJump_btn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mRightDownCon/mItemAction_btn')
    public mItemAction_btn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mRightDownCon/mExitInteractive_btn')
    public mExitInteractive_btn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mRightDownCon/mAtkCanvas')
    public mAtkCanvas: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mRightDownCon/mAtkCanvas/mAtk')
    public mAtk: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mRightDownCon/mAutoShoot')
    public mAutoShoot: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mRightDownCon/mAutoShoot/mBtnAutoShoot')
    public mBtnAutoShoot: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mIdCard_btn')
    public mIdCard_btn: mw.Button=undefined;
    @UIWidgetBind('Canvas/mPulloff_btn')
    public mPulloff_btn: mw.Button=undefined;
    @UIWidgetBind('Canvas/canvas_emoji')
    public canvas_emoji: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/canvas_emoji/scrollBox_emoji')
    public scrollBox_emoji: mw.ScrollBox=undefined;
    @UIWidgetBind('Canvas/canvas_word')
    public canvas_word: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/canvas_word/scrollBox_word')
    public scrollBox_word: mw.ScrollBox=undefined;
    @UIWidgetBind('Canvas/canvas_Expression')
    public canvas_Expression: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/canvas_Expression/emojiBtn')
    public emojiBtn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/canvas_Expression/wordBtn')
    public wordBtn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mCanvas_choose')
    public mCanvas_choose: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvas_choose/mBtn_choose')
    public mBtn_choose: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvasCamera')
    public mCanvasCamera: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasCamera/mButton_1')
    public mButton_1: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvasAction')
    public mCanvasAction: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasAction/mAction_btn')
    public mAction_btn: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvasAction/mAction_btn/textBtn')
    public textBtn: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mBagBtn')
    public mBagBtn: mw.Button=undefined;
    @UIWidgetBind('Canvas/canvas_Task')
    public canvas_Task: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/canvas_Task/txt_task_Des')
    public txt_task_Des: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/canvas_Task/txt_task_Title')
    public txt_task_Title: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/canvas_Task/btn_Task')
    public btn_Task: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/canvas_Task/mBtnGuideTask')
    public mBtnGuideTask: mw.Button=undefined;
    @UIWidgetBind('Canvas/canvas_Task/mBtnGuideTask/mTexGuideTask')
    public mTexGuideTask: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/canvas_Task/mAward')
    public mAward: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/canvas_Task/mAward/img_Icon')
    public img_Icon: mw.Image=undefined;
    @UIWidgetBind('Canvas/canvas_Task/mAward/txt_num')
    public txt_num: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mCanvasSchool')
    public mCanvasSchool: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasSchool/mBckSchool')
    public mBckSchool: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvasSchool/schoolTime')
    public schoolTime: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mNpcInternect')
    public mNpcInternect: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mNpcInternect/mTexNpcInter')
    public mTexNpcInter: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mNpcInternect/mget_back')
    public mget_back: mw.Image=undefined;
    @UIWidgetBind('Canvas/mNpcInternect/mBtnNPCInter')
    public mBtnNPCInter: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mCanvasDress')
    public mCanvasDress: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasDress/mBtnChange')
    public mBtnChange: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mCanvasDress/mNewCloth')
    public mNewCloth: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mCanvasReturn')
    public mCanvasReturn: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasReturn/returnSchoolBtn')
    public returnSchoolBtn: mw.Button=undefined;
    @UIWidgetBind('Canvas/mCanvasClothReset')
    public mCanvasClothReset: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mCanvasClothReset/mBtnCloth')
    public mBtnCloth: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/img_low_hp')
    public img_low_hp: mw.Image=undefined;
    @UIWidgetBind('Canvas/mBossHPCanvas')
    public mBossHPCanvas: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mBossHPCanvas/bar_hp')
    public bar_hp: mw.ProgressBar=undefined;
    @UIWidgetBind('Canvas/mBossHPCanvas/m_kuang')
    public m_kuang: mw.Image=undefined;
    @UIWidgetBind('Canvas/mBossHPCanvas/txt_hp')
    public txt_hp: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mBossHPCanvas/bossName')
    public bossName: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mTaskBtnCanvas')
    public mTaskBtnCanvas: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mTaskBtnCanvas/mTaskBtn')
    public mTaskBtn: mw.Button=undefined;
    @UIWidgetBind('Canvas/mTaskBtnCanvas/mExclam')
    public mExclam: mw.Image=undefined;
    @UIWidgetBind('Canvas/mTaskBtnCanvas/mQuestion')
    public mQuestion: mw.Image=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mJump_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mJump_btn");
         })
         this.mJump_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mJump_btn");
         })
         this.mJump_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mJump_btn");
         })
         this.mJump_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mItemAction_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mItemAction_btn");
         })
         this.mItemAction_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mItemAction_btn");
         })
         this.mItemAction_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mItemAction_btn");
         })
         this.mItemAction_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mExitInteractive_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mExitInteractive_btn");
         })
         this.mExitInteractive_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mExitInteractive_btn");
         })
         this.mExitInteractive_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mExitInteractive_btn");
         })
         this.mExitInteractive_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
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
	
         this.mBtnAutoShoot.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnAutoShoot");
         })
         this.mBtnAutoShoot.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnAutoShoot");
         })
         this.mBtnAutoShoot.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnAutoShoot");
         })
         this.mBtnAutoShoot.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.emojiBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "emojiBtn");
         })
         this.emojiBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "emojiBtn");
         })
         this.emojiBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "emojiBtn");
         })
         this.emojiBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.wordBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "wordBtn");
         })
         this.wordBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "wordBtn");
         })
         this.wordBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "wordBtn");
         })
         this.wordBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btn_Task.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn_Task");
         })
         this.btn_Task.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn_Task");
         })
         this.btn_Task.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn_Task");
         })
         this.btn_Task.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnNPCInter.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnNPCInter");
         })
         this.mBtnNPCInter.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnNPCInter");
         })
         this.mBtnNPCInter.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnNPCInter");
         })
         this.mBtnNPCInter.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnChange.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnChange");
         })
         this.mBtnChange.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnChange");
         })
         this.mBtnChange.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnChange");
         })
         this.mBtnChange.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnCloth.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnCloth");
         })
         this.mBtnCloth.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnCloth");
         })
         this.mBtnCloth.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnCloth");
         })
         this.mBtnCloth.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.mBtn_Trans.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_Trans");
         })
         this.mBtn_Trans.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_Trans");
         })
         this.mBtn_Trans.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_Trans");
         })
         this.mBtn_Trans.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mIdCard_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mIdCard_btn");
         })
         this.mIdCard_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mIdCard_btn");
         })
         this.mIdCard_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mIdCard_btn");
         })
         this.mIdCard_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mPulloff_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mPulloff_btn");
         })
         this.mPulloff_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mPulloff_btn");
         })
         this.mPulloff_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mPulloff_btn");
         })
         this.mPulloff_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtn_choose.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtn_choose");
         })
         this.mBtn_choose.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtn_choose");
         })
         this.mBtn_choose.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtn_choose");
         })
         this.mBtn_choose.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mButton_1.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mButton_1");
         })
         this.mButton_1.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mButton_1");
         })
         this.mButton_1.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mButton_1");
         })
         this.mButton_1.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mAction_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mAction_btn");
         })
         this.mAction_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mAction_btn");
         })
         this.mAction_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mAction_btn");
         })
         this.mAction_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBagBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBagBtn");
         })
         this.mBagBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBagBtn");
         })
         this.mBagBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBagBtn");
         })
         this.mBagBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnGuideTask.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnGuideTask");
         })
         this.mBtnGuideTask.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnGuideTask");
         })
         this.mBtnGuideTask.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnGuideTask");
         })
         this.mBtnGuideTask.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBckSchool.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBckSchool");
         })
         this.mBckSchool.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBckSchool");
         })
         this.mBckSchool.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBckSchool");
         })
         this.mBckSchool.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.returnSchoolBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "returnSchoolBtn");
         })
         this.returnSchoolBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "returnSchoolBtn");
         })
         this.returnSchoolBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "returnSchoolBtn");
         })
         this.returnSchoolBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mTaskBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTaskBtn");
         })
         this.mTaskBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTaskBtn");
         })
         this.mTaskBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTaskBtn");
         })
         this.mTaskBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mJump_btn);
	
         this.setLanguage(this.mItemAction_btn);
	
         this.setLanguage(this.mExitInteractive_btn);
	
         this.setLanguage(this.mAtk);
	
         this.setLanguage(this.mBtnAutoShoot);
	
         this.setLanguage(this.emojiBtn);
	
         this.setLanguage(this.wordBtn);
	
         this.setLanguage(this.btn_Task);
	
         this.setLanguage(this.mBtnNPCInter);
	
         this.setLanguage(this.mBtnChange);
	
         this.setLanguage(this.mBtnCloth);
	
         //文本多语言
         this.setLanguage(this.textBtn)
	
         this.setLanguage(this.txt_task_Des)
	
         this.setLanguage(this.txt_task_Title)
	
         this.setLanguage(this.mTexGuideTask)
	
         this.setLanguage(this.txt_num)
	
         this.setLanguage(this.schoolTime)
	
         this.setLanguage(this.mTexNpcInter)
	
         this.setLanguage(this.mNewCloth)
	
         this.setLanguage(this.txt_hp)
	
         this.setLanguage(this.bossName)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mIdCard_btn/TextBlock_1") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mPulloff_btn/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mCanvasCamera/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mBagBtn/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/canvas_Task/Text_Task") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mCanvasSchool/TextBlock_2") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mCanvasDress/Text") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mCanvasReturn/TextBlock_1") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mCanvasClothReset/TextBlock") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mTaskBtnCanvas/TextBlock") as mw.TextBlock);
	
 
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
 