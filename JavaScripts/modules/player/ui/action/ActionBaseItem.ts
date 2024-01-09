import ActionItem_Generate from "../../../../ui-generate/uiTemplate/RPNPMUI/ActionModule/ActionItem_generate";
import { ActionBaseCfg, ActionLuanguage } from "../../modules/ActionModule";


export class ActionBaseItem extends ActionItem_Generate {
    public active: mw.Action1<ActionBaseCfg> = new mw.Action1<ActionBaseCfg>();

    private root: mw.UserWidgetPrefab = null;
    private iconImg: mw.Image = null;
    // private nameText: mw.TextBlock = null;
    private btn: mw.StaleButton = null;
    private info: ActionBaseCfg = null;
    private mBgImg: mw.Image = null;


    onStart() {

    }
    public setRoot(root: mw.UserWidgetPrefab): void {
        this.root = root
        this.iconImg = this.root.findChildByPath("Canvas/IconImg") as mw.Image;
        this.mBgImg = this.root.findChildByPath("Canvas/mBg") as mw.Image;
        this.name = this.root.findChildByPath("Canvas/name") as mw.TextBlock;
        // this.nameText = (this.root.findChildByPath("Canvas/NameText")) as mw.TextBlock;
        // this.nameText.visibility = (mw.SlateVisibility.Hidden);
        this.btn = this.root.findChildByPath("Canvas/btn") as mw.StaleButton;
        this.btn.touchMethod = mw.ButtonTouchMethod.PreciseTap;
        this.btn.onClicked.add(this.onClicked.bind(this));
    }

    public show(bool: boolean) {
        let visibility = bool ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
        this.root.visibility = visibility;
    }

    public setData(info: ActionBaseCfg): void {
        this.info = info;
        this.name.text = info.name
        this.iconImg.imageGuid = info.icon;
        this.mBgImg.imageGuid = ActionLuanguage.isOverseas ? "86714" : "86723";
        this.show(true);
    }

    private onClicked(): void {
        this.active.call(this.info);
    }

    /**
     * 设置坐标
     * @param v
     */
    public setPostion(v: mw.Vector2): void {
        this.root.position = v;
    }
}
