 

 @UIBind('UI/bag/BagInteraction.ui')
 export default class BagInteraction_Generate extends mw.UIScript {
     @UIWidgetBind('RootCanvas/mBtnInvite')
    public mBtnInvite: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/acceptCon/headImg')
    public headImg: mw.Image=undefined;
    @UIWidgetBind('RootCanvas/acceptCon/nameText')
    public nameText: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/acceptCon/descText')
    public descText: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/acceptCon/yesBtn')
    public yesBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/acceptCon/noBtn')
    public noBtn: mw.StaleButton=undefined;
    @UIWidgetBind('RootCanvas/acceptCon')
    public acceptCon: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mConInvite/closeBtn')
    public closeBtn: mw.Button=undefined;
    @UIWidgetBind('RootCanvas/mConInvite/listCon/mScroll/content')
    public content: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mConInvite/listCon/mScroll')
    public mScroll: mw.ScrollBox=undefined;
    @UIWidgetBind('RootCanvas/mConInvite/listCon')
    public listCon: mw.Canvas=undefined;
    @UIWidgetBind('RootCanvas/mConInvite/mTitle')
    public mTitle: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mConInvite/mNoneText')
    public mNoneText: mw.TextBlock=undefined;
    @UIWidgetBind('RootCanvas/mConInvite')
    public mConInvite: mw.Canvas=undefined;
    

     protected onAwake() {
         this.canUpdate = false;
         this.layer = mw.UILayerMiddle;
         this.initButtons();
         //this.initLanguage()
     }
     
     protected initButtons() {
         //按钮添加点击
         this.yesBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "yesBtn");
         })
         this.yesBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "yesBtn");
         })
         this.yesBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "yesBtn");
         })
         this.yesBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.noBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "noBtn");
         })
         this.noBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "noBtn");
         })
         this.noBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "noBtn");
         })
         this.noBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         //按钮添加点击
         this.mBtnInvite.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "mBtnInvite");
         })
         this.mBtnInvite.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "mBtnInvite");
         })
         this.mBtnInvite.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "mBtnInvite");
         })
         this.mBtnInvite.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         this.closeBtn.onClicked.add(()=>{
             Event.dispatchToLocal("PlayButtonClick", "closeBtn");
         })
         this.closeBtn.onPressed.add(() => {
             Event.dispatchToLocal("PlayButtonPressed", "closeBtn");
         })
         this.closeBtn.onReleased.add(() => {
             Event.dispatchToLocal("PlayButtonReleased", "closeBtn");
         })
         this.closeBtn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
	
         // 初始化多语言
         this.initLanguage()
 
     }
     
     protected initLanguage(){
         //按钮多语言
         this.setLanguage(this.yesBtn);
	
         this.setLanguage(this.noBtn);
	
         //文本多语言
         this.setLanguage(this.nameText)
	
         this.setLanguage(this.descText)
	
         this.setLanguage(this.mTitle)
	
         this.setLanguage(this.mNoneText)
	
 
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
 