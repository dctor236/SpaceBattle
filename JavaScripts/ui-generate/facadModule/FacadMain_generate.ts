 

 @UIBind('UI/facadModule/FacadMain.ui')
 export default class FacadMain_Generate extends mw.UIScript {
     @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/basepicture')
    public basepicture: mw.Image=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/MWCanvas_1/btn0')
    public btn0: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/MWCanvas_1/btn1')
    public btn1: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/MWCanvas_1/btn2')
    public btn2: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/MWCanvas_1/btn3')
    public btn3: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/MWCanvas_1/btn4')
    public btn4: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/MWCanvas_1/btn5')
    public btn5: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/MWCanvas_1/btn6')
    public btn6: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/MWCanvas_1/btn7')
    public btn7: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/dividingline_up')
    public dividingline_up: mw.Image=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/mCheckBoxImg')
    public mCheckBoxImg: mw.Image=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/mCheckBox')
    public mCheckBox: mw.Button=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/mScrollBox/mContent')
    public mContent: mw.Canvas=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/mScrollBox')
    public mScrollBox: mw.ScrollBox=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/dividingline_down')
    public dividingline_down: mw.Image=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2147482460/mBtnSave')
    public mBtnSave: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_4/MWCanvas_2147482460/mBtnClose')
    public mBtnClose: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_5/mTouch')
    public mTouch: mw.Image=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_5/MWCanvas_3/btnLeft')
    public btnLeft: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_5/MWCanvas_3/btnRight')
    public btnRight: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_5/MWCanvas_3/btnReset')
    public btnReset: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_5/MWCanvas_3/mBtnBuy')
    public mBtnBuy: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_5/MWCanvas_3/mBtnView')
    public mBtnView: mw.StaleButton=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_5/MWCanvas_3/mPos')
    public mPos: mw.Image=undefined;
    @UIWidgetBind('MWCanvas_2147482460/MWCanvas_5/mGold')
    public mGold: mw.TextBlock=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.btn0.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn0");
         })
         this.btn0.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn0");
         })
         this.btn0.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn0");
         })
         this.btn0.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btn1.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn1");
         })
         this.btn1.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn1");
         })
         this.btn1.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn1");
         })
         this.btn1.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btn2.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn2");
         })
         this.btn2.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn2");
         })
         this.btn2.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn2");
         })
         this.btn2.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btn3.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn3");
         })
         this.btn3.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn3");
         })
         this.btn3.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn3");
         })
         this.btn3.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btn4.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn4");
         })
         this.btn4.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn4");
         })
         this.btn4.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn4");
         })
         this.btn4.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btn5.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn5");
         })
         this.btn5.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn5");
         })
         this.btn5.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn5");
         })
         this.btn5.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btn6.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn6");
         })
         this.btn6.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn6");
         })
         this.btn6.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn6");
         })
         this.btn6.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btn7.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btn7");
         })
         this.btn7.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btn7");
         })
         this.btn7.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btn7");
         })
         this.btn7.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
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
	
         this.mBtnClose.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnClose");
         })
         this.mBtnClose.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnClose");
         })
         this.mBtnClose.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnClose");
         })
         this.mBtnClose.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btnLeft.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btnLeft");
         })
         this.btnLeft.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btnLeft");
         })
         this.btnLeft.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btnLeft");
         })
         this.btnLeft.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btnRight.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btnRight");
         })
         this.btnRight.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btnRight");
         })
         this.btnRight.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btnRight");
         })
         this.btnRight.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.btnReset.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "btnReset");
         })
         this.btnReset.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "btnReset");
         })
         this.btnReset.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "btnReset");
         })
         this.btnReset.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnBuy.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnBuy");
         })
         this.mBtnBuy.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnBuy");
         })
         this.mBtnBuy.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnBuy");
         })
         this.mBtnBuy.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mBtnView.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnView");
         })
         this.mBtnView.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnView");
         })
         this.mBtnView.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnView");
         })
         this.mBtnView.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.mCheckBox.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mCheckBox");
         })
         this.mCheckBox.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mCheckBox");
         })
         this.mCheckBox.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mCheckBox");
         })
         this.mCheckBox.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.btn0);
	
         this.setLanguage(this.btn1);
	
         this.setLanguage(this.btn2);
	
         this.setLanguage(this.btn3);
	
         this.setLanguage(this.btn4);
	
         this.setLanguage(this.btn5);
	
         this.setLanguage(this.btn6);
	
         this.setLanguage(this.btn7);
	
         this.setLanguage(this.mBtnSave);
	
         this.setLanguage(this.mBtnClose);
	
         this.setLanguage(this.btnLeft);
	
         this.setLanguage(this.btnRight);
	
         this.setLanguage(this.btnReset);
	
         this.setLanguage(this.mBtnBuy);
	
         this.setLanguage(this.mBtnView);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas_2147482460/MWButton_1") as mw.StaleButton);
	
         //文本多语言
         this.setLanguage(this.mGold)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("MWCanvas_2147482460/MWCanvas_4/MWCanvas_2/TextBlock") as mw.TextBlock);
	
 
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
 