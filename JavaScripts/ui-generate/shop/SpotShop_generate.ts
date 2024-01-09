 

 @UIBind('UI/shop/SpotShop.ui')
 export default class SpotShop_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/mTips')
    public mTips: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mTips/mCloseTips_btn')
    public mCloseTips_btn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mTips/Info/bg')
    public bg: mw.Image=undefined;
    @UIWidgetBind('Canvas/mTips/Info/ItemIcoBox/mBgIcon')
    public mBgIcon: mw.Image=undefined;
    @UIWidgetBind('Canvas/mTips/Info/ItemIcoBox/mTipsIco_img')
    public mTipsIco_img: mw.Image=undefined;
    @UIWidgetBind('Canvas/mTips/Info/mTipsGoodsName_txt')
    public mTipsGoodsName_txt: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mTips/Info/mTipsHasNum_txt')
    public mTipsHasNum_txt: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mTips/Info/mTipsMsg_txt')
    public mTipsMsg_txt: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mTips/Info/mTipsBottom')
    public mTipsBottom: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mTips/Info/mTipsBottom/buyCanvas')
    public buyCanvas: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mTips/Info/mTipsBottom/buyCanvas/mTipsBuy_btn')
    public mTipsBuy_btn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mTips/Info/mTipsBottom/buyCanvas/mTipsBuy_txt')
    public mTipsBuy_txt: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mTips/Info/mTipsBottom/resetCanvas')
    public resetCanvas: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mTips/Info/mTipsBottom/resetCanvas/mReset')
    public mReset: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mTips/Info/mTipsBottom/tryCanvas')
    public tryCanvas: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mTips/Info/mTipsBottom/tryCanvas/mTipsBuy_txt_1')
    public mTipsBuy_txt_1: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mTips/Info/mTipsBottom/tryCanvas/mTry')
    public mTry: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mClose_btn')
    public mClose_btn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mMoneyState')
    public mMoneyState: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mMoneyState/Item1/mMoneyTex1')
    public mMoneyTex1: mw.TextBlock=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mCloseTips_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mCloseTips_btn");
         })
         this.mCloseTips_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mCloseTips_btn");
         })
         this.mCloseTips_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mCloseTips_btn");
         })
         this.mCloseTips_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mTipsBuy_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTipsBuy_btn");
         })
         this.mTipsBuy_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTipsBuy_btn");
         })
         this.mTipsBuy_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTipsBuy_btn");
         })
         this.mTipsBuy_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mReset.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mReset");
         })
         this.mReset.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mReset");
         })
         this.mReset.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mReset");
         })
         this.mReset.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mTry.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTry");
         })
         this.mTry.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTry");
         })
         this.mTry.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTry");
         })
         this.mTry.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mClose_btn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mClose_btn");
         })
         this.mClose_btn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mClose_btn");
         })
         this.mClose_btn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mClose_btn");
         })
         this.mClose_btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mCloseTips_btn);
	
         this.setLanguage(this.mTipsBuy_btn);
	
         this.setLanguage(this.mReset);
	
         this.setLanguage(this.mTry);
	
         this.setLanguage(this.mClose_btn);
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mMoneyState/Item1/Butn1") as mw.StaleButton);
	
         //文本多语言
         this.setLanguage(this.mTipsGoodsName_txt)
	
         this.setLanguage(this.mTipsHasNum_txt)
	
         this.setLanguage(this.mTipsMsg_txt)
	
         this.setLanguage(this.mTipsBuy_txt)
	
         this.setLanguage(this.mTipsBuy_txt_1)
	
         this.setLanguage(this.mMoneyTex1)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mTips/Info/mTipsBottom/resetCanvas/ReturnTex") as mw.TextBlock);
	
 
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
 