 

 @UIBind('UI/shop/ShopMain.ui')
 export default class ShopMain_Generate extends mw.UIScript {
     @UIWidgetBind('Canvas/MainView/mTabGroup')
    public mTabGroup: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/MainView/mTabGroup/mGoodsType1')
    public mGoodsType1: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/MainView/mTabGroup/mGoodsType2')
    public mGoodsType2: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/MainView/mTabGroup/mGoodsType3')
    public mGoodsType3: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/MainView/mTabGroup/mGoodsType4')
    public mGoodsType4: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/MainView/mScrollView')
    public mScrollView: mw.ScrollBox=undefined;
    @UIWidgetBind('Canvas/MainView/mScrollView/mContent')
    public mContent: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/MainView/mMoney')
    public mMoney: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/MainView/mMoney/moonIcon')
    public moonIcon: mw.Image=undefined;
    @UIWidgetBind('Canvas/MainView/mMoney/moonNum')
    public moonNum: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/MainView/mMoney/goldIcon')
    public goldIcon: mw.Image=undefined;
    @UIWidgetBind('Canvas/MainView/mMoney/goldNum')
    public goldNum: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/MainView/mMoney/silverIcon')
    public silverIcon: mw.Image=undefined;
    @UIWidgetBind('Canvas/MainView/mMoney/silverNum')
    public silverNum: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/MainView/mClose_btn')
    public mClose_btn: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mTips')
    public mTips: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsClose')
    public mTipsClose: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsItemName')
    public mTipsItemName: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsItemBg')
    public mTipsItemBg: mw.Image=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsItemIcon')
    public mTipsItemIcon: mw.Image=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsItemStar')
    public mTipsItemStar: mw.Canvas=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsItemState')
    public mTipsItemState: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsDescBG')
    public mTipsDescBG: mw.Image=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsDesc')
    public mTipsDesc: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsInput')
    public mTipsInput: mw.InputBox=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsAdd')
    public mTipsAdd: mw.Button=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsSub')
    public mTipsSub: mw.Button=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsBuy')
    public mTipsBuy: mw.StaleButton=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsMoneyIcon')
    public mTipsMoneyIcon: mw.Image=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsPrice')
    public mTipsPrice: mw.TextBlock=undefined;
    @UIWidgetBind('Canvas/mTips/mTipsBuyText')
    public mTipsBuyText: mw.TextBlock=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.mGoodsType1.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mGoodsType1");
         })
         this.mGoodsType1.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mGoodsType1");
         })
         this.mGoodsType1.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mGoodsType1");
         })
         this.mGoodsType1.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mGoodsType2.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mGoodsType2");
         })
         this.mGoodsType2.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mGoodsType2");
         })
         this.mGoodsType2.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mGoodsType2");
         })
         this.mGoodsType2.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mGoodsType3.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mGoodsType3");
         })
         this.mGoodsType3.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mGoodsType3");
         })
         this.mGoodsType3.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mGoodsType3");
         })
         this.mGoodsType3.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mGoodsType4.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mGoodsType4");
         })
         this.mGoodsType4.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mGoodsType4");
         })
         this.mGoodsType4.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mGoodsType4");
         })
         this.mGoodsType4.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
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
	
         this.mTipsClose.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTipsClose");
         })
         this.mTipsClose.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTipsClose");
         })
         this.mTipsClose.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTipsClose");
         })
         this.mTipsClose.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mTipsBuy.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTipsBuy");
         })
         this.mTipsBuy.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTipsBuy");
         })
         this.mTipsBuy.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTipsBuy");
         })
         this.mTipsBuy.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.mTipsAdd.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTipsAdd");
         })
         this.mTipsAdd.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTipsAdd");
         })
         this.mTipsAdd.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTipsAdd");
         })
         this.mTipsAdd.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.mTipsSub.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mTipsSub");
         })
         this.mTipsSub.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mTipsSub");
         })
         this.mTipsSub.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mTipsSub");
         })
         this.mTipsSub.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mGoodsType1);
	
         this.setLanguage(this.mGoodsType2);
	
         this.setLanguage(this.mGoodsType3);
	
         this.setLanguage(this.mGoodsType4);
	
         this.setLanguage(this.mClose_btn);
	
         this.setLanguage(this.mTipsClose);
	
         this.setLanguage(this.mTipsBuy);
	
         //文本多语言
         this.setLanguage(this.moonNum)
	
         this.setLanguage(this.goldNum)
	
         this.setLanguage(this.silverNum)
	
         this.setLanguage(this.mTipsItemName)
	
         this.setLanguage(this.mTipsItemState)
	
         this.setLanguage(this.mTipsDesc)
	
         this.setLanguage(this.mTipsPrice)
	
         this.setLanguage(this.mTipsBuyText)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("Canvas/mTips/TextBlock") as mw.TextBlock);
	
 
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
 