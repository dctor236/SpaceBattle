import { GlobalData } from "../../const/GlobalData";
import FlyEffect_Generate from "../../ui-generate/fly/FlyEffect_generate";

export class FlyEffect extends FlyEffect_Generate {

    // 模式 变大 -- 0 or 变小 -- 1
    private mode: number = 0;

    onStart(): void {
        TimeUtil.setInterval(() => {
            if (!this.canUpdate) return;
            if (this.mode == 0) {
                this.mPic_BG.visibility = mw.SlateVisibility.SelfHitTestInvisible;
                this.mPic_BG_1.visibility = mw.SlateVisibility.Collapsed;
                this.mode = 1;
            } else {
                this.mPic_BG.visibility = mw.SlateVisibility.Collapsed;
                this.mPic_BG_1.visibility = mw.SlateVisibility.SelfHitTestInvisible;
                this.mode = 0;
            }
        }, 0.1);
    }

    protected onShow(...params: any[]): void {
        this.canUpdate = true;
    }

    onHide() {
        this.canUpdate = false;
        // this.mPic_BG.renderScale = new mw.Vector2(1.3, 1.3);
    }

    onUpdate(dt: number) {

    }
}