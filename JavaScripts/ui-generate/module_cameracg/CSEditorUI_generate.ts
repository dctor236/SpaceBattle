 

 @UIBind('UI/module_cameracg/CSEditorUI.ui')
 export default class CSEditorUI_Generate extends mw.UIScript {
     @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasBtns/CanvasBtnPlay/mBtnPlay')
    public mBtnPlay: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasBtns/CanvasBtnRecord/mBtnRecord')
    public mBtnRecord: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasBtns/CanvasBtnClear/mBtnClear')
    public mBtnClear: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasBtns/CanvasBtnSetting/mBtnSetting')
    public mBtnSetting: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasBtns')
    public mCanvasBtns: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasSetting/CanvasResetFOV/mBtnResetFOV')
    public mBtnResetFOV: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasSetting/CanvasCameraSync/mBtnCameraSync')
    public mBtnCameraSync: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasSetting/CanvasCameraSync/mTextBtnCameraSync')
    public mTextBtnCameraSync: mw.TextBlock=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasSetting/CanvasBtnLoad/mBtnLoad')
    public mBtnLoad: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasSetting/CanvasSave/mBtnSave')
    public mBtnSave: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasSetting')
    public mCanvasSetting: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasTimeLine/mCanvasTimePoint')
    public mCanvasTimePoint: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasTimeLine/mBtnBar')
    public mBtnBar: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasTimeLine/mBtnCurrentTime')
    public mBtnCurrentTime: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasTimeLine/mCanvasKeyFrame')
    public mCanvasKeyFrame: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasTimeLine/CanvasBtnAddTime/mBtnAddTime')
    public mBtnAddTime: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasTimeLine/CanvasBtnSubTime/mBtnSubTime')
    public mBtnSubTime: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasTimeLine')
    public mCanvasTimeLine: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditLoc/mInputLocX')
    public mInputLocX: mw.InputBox=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditLoc/mInputLocY')
    public mInputLocY: mw.InputBox=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditLoc/mInputLocZ')
    public mInputLocZ: mw.InputBox=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditRot/mInputRotP')
    public mInputRotP: mw.InputBox=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditRot/mInputRotY')
    public mInputRotY: mw.InputBox=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditRot/mInputRotR')
    public mInputRotR: mw.InputBox=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditOther/mInputFOV')
    public mInputFOV: mw.InputBox=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditOther/CanvasBtnDelKeyFrame/mBtnDelKeyFrame')
    public mBtnDelKeyFrame: mw.Button=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar/mCanvasFramesEdit')
    public mCanvasFramesEdit: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas/mCanvasActionBar')
    public mCanvasActionBar: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         //按钮添加点击
         this.mBtnPlay.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnPlay");
         })
         this.mBtnPlay.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnPlay");
         })
         this.mBtnPlay.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnPlay");
         })
         this.mBtnPlay.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnRecord.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnRecord");
         })
         this.mBtnRecord.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnRecord");
         })
         this.mBtnRecord.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnRecord");
         })
         this.mBtnRecord.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnClear.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnClear");
         })
         this.mBtnClear.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnClear");
         })
         this.mBtnClear.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnClear");
         })
         this.mBtnClear.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnSetting.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnSetting");
         })
         this.mBtnSetting.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnSetting");
         })
         this.mBtnSetting.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnSetting");
         })
         this.mBtnSetting.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnResetFOV.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnResetFOV");
         })
         this.mBtnResetFOV.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnResetFOV");
         })
         this.mBtnResetFOV.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnResetFOV");
         })
         this.mBtnResetFOV.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnCameraSync.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnCameraSync");
         })
         this.mBtnCameraSync.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnCameraSync");
         })
         this.mBtnCameraSync.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnCameraSync");
         })
         this.mBtnCameraSync.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnLoad.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnLoad");
         })
         this.mBtnLoad.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnLoad");
         })
         this.mBtnLoad.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnLoad");
         })
         this.mBtnLoad.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnSave.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnSave");
         })
         this.mBtnSave.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnSave");
         })
         this.mBtnSave.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnSave");
         })
         this.mBtnSave.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnBar.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnBar");
         })
         this.mBtnBar.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnBar");
         })
         this.mBtnBar.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnBar");
         })
         this.mBtnBar.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnCurrentTime.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnCurrentTime");
         })
         this.mBtnCurrentTime.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnCurrentTime");
         })
         this.mBtnCurrentTime.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnCurrentTime");
         })
         this.mBtnCurrentTime.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnAddTime.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnAddTime");
         })
         this.mBtnAddTime.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnAddTime");
         })
         this.mBtnAddTime.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnAddTime");
         })
         this.mBtnAddTime.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnSubTime.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnSubTime");
         })
         this.mBtnSubTime.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnSubTime");
         })
         this.mBtnSubTime.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnSubTime");
         })
         this.mBtnSubTime.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnDelKeyFrame.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnDelKeyFrame");
         })
         this.mBtnDelKeyFrame.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnDelKeyFrame");
         })
         this.mBtnDelKeyFrame.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnDelKeyFrame");
         })
         this.mBtnDelKeyFrame.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         //文本多语言
         this.setLanguage(this.mTextBtnCameraSync)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasBtns/CanvasBtnSetting/Text") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasSetting/CanvasResetFOV/Text") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasSetting/CanvasCameraSync/Text") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasSetting/CanvasBtnLoad/Text") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasSetting/CanvasSave/Text") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasTimeLine/CanvasBtnAddTime/Text") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasTimeLine/CanvasBtnSubTime/Text") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditLoc/TextLoc") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditLoc/TextX") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditLoc/TextY") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditLoc/TextZ") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditRot/TextRot") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditRot/TextP") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditRot/TextY") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditRot/TextR") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditOther/TextFOV") as mw.TextBlock);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas/mCanvasActionBar/mCanvasFramesEdit/CanvasEditOther/CanvasBtnDelKeyFrame/Text") as mw.TextBlock);
	
 
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
 