 

 @UIBind('UI/upGood/UpGoodUI.ui')
 export default class UpGoodUI_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/img1')
    public img1: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mUp1')
    public mUp1: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mOwner1')
    public mOwner1: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mOwner_1')
    public mOwner_1: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/ItemIcoBox/mBgIcon')
    public mBgIcon: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/mClose_btn')
    public mClose_btn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mOwner')
    public mOwner: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mUp')
    public mUp: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mTipsMsg_txt')
    public mTipsMsg_txt: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mTipsGoodsName_txt')
    public mTipsGoodsName_txt: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mTipsBuy_txt')
    public mTipsBuy_txt: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mTipsBuy_btn')
    public mTipsBuy_btn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/mask')
    public mask: mw.Image=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
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
	
         this.mUp.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mUp");
         })
         this.mUp.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mUp");
         })
         this.mUp.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mUp");
         })
         this.mUp.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
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
	
         //按钮添加点击
         this.mUp1.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mUp1");
         })
         this.mUp1.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mUp1");
         })
         this.mUp1.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mUp1");
         })
         this.mUp1.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.mClose_btn);
	
         this.setLanguage(this.mUp);
	
         this.setLanguage(this.mTipsBuy_btn);
	
         //文本多语言
         this.setLanguage(this.mOwner1)
	
         this.setLanguage(this.mOwner_1)
	
         this.setLanguage(this.mOwner)
	
         this.setLanguage(this.mTipsMsg_txt)
	
         this.setLanguage(this.mTipsGoodsName_txt)
	
         this.setLanguage(this.mTipsBuy_txt)
	
         this.setLanguage(this.uiWidgetBase.findChildByPath("RootCanvas/mUp1/TextBlock") as mw.TextBlock);
	
 
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
 