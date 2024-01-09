import { UIManager } from "../../ExtensionType";
import MessageBox_Generate from "../../ui-generate/uiTemplate/common/MessageBox_generate";


/**二次确认框*/
export default class MessageBox extends MessageBox_Generate {
    private static _instance: MessageBox;
    private resListener: Function;//保存的结果回调方法

    private static get instance(): MessageBox {
        if (MessageBox._instance == null) {
            MessageBox._instance = mw.UIService.create(this);
        }
        return MessageBox._instance;
    }

    protected onAwake(): void {
        this.layer = mw.UILayerTop;
    }

    public show(): void {
        UIManager.showUI(this);
        this.canUpdate = true;
    }

    public hide(): void {
        UIManager.hideUI(this);
    }

    onStart() {
        this.mOK_btn.onClicked.add(() => {
            this.hide();
            if (this.resListener != null) {
                this.resListener();
            }
        });
        this.mYes_btn.onClicked.add(() => {
            this.hide();
            this.resListener(true);
        });
        this.mNo_btn.onClicked.add(() => {
            this.hide();
            this.resListener(false);
        });
    }
    /**
     * 显示单按钮消息框(Client Only)
     * @param title 标题
     * @param content 内容
     * @param resListener 确认回调
     */
    public static showOneBtnMessage(title: string, content: string, resListener?: () => void, okStr: string = "确定") {
        MessageBox.instance.show();
        MessageBox.instance.showMsg1(title, content, resListener, okStr);
    }

    /**
     * 显示双按钮消息框(Client Only)
     * @param title 标题
     * @param content 内容
     * @param resListener 结果回调事件
     */
    public static showTwoBtnMessage(title: string, content: string, resListener: (res: boolean) => void, yesStr: string = "是", noStr = "否") {
        MessageBox.instance.show();
        MessageBox.instance.showMsg2(title, content, resListener, yesStr, noStr);
    }

    private showMsg1(title: string, content: string, resListener: () => void, okStr: string) {
        this.mYes_btn.visibility = (mw.SlateVisibility.Collapsed);
        this.mNo_btn.visibility = (mw.SlateVisibility.Collapsed);
        this.mOK_btn.visibility = (mw.SlateVisibility.Visible);

        this.mTitle_txt.text = (title);
        this.mContent_txt.text = (content);
        this.mOK_btn.text = (okStr);
        this.resListener = resListener;

        this.animationState = 1;
        this.animationRun();
    }

    private showMsg2(title: string, content: string, resListener: (res: boolean) => void, yesStr: string, noStr: string) {
        this.mYes_btn.visibility = (mw.SlateVisibility.Visible);
        this.mNo_btn.visibility = (mw.SlateVisibility.Visible);
        this.mOK_btn.visibility = (mw.SlateVisibility.Collapsed);

        this.mTitle_txt.text = (title);
        this.mContent_txt.text = (content);
        this.resListener = resListener;
        this.mYes_btn.text = (yesStr);
        this.mNo_btn.text = (noStr);

        this.animationState = 1;
        this.animationRun();
    }

    onUpdate(dt: number) {
        this.animationRun(dt);
    }
    private animationState: number = 0;
    private animationParam: number = 0;
    private animationRun(dt?: number) {
        if (this.animationState == 0) return;
        if (this.animationState == 1) {
            this.animationParam = 0;
            this.mBodyCanvas.renderScale = (mw.Vector2.one.multiply(this.animationParam));
            this.animationState++;
        } else if (this.animationState == 2) {
            this.animationParam = Math.min(1.15, this.animationParam + dt * 10);
            this.mBodyCanvas.renderScale = (mw.Vector2.one.multiply(this.animationParam));
            if (this.animationParam >= 1.15) {
                this.animationState++;
            }
        } else {
            this.animationParam = Math.max(1, this.animationParam - dt * 1);
            this.mBodyCanvas.renderScale = (mw.Vector2.one.multiply(this.animationParam));
            if (this.animationParam <= 0) {
                this.animationParam = 0;
            }
        }
    }
}