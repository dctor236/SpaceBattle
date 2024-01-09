/** 
 * @Author       : pengwei.shi
 * @Date         : 2023-04-25 13:25:53
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-05-11 16:48:48
 * @FilePath     : \mollywoodschool\JavaScripts\ui\SettingUI.ts
 * @Description  : 
 */
import { GameConfig } from "../config/GameConfig";
import { GlobalModule } from "../const/GlobalModule";
import { SoundManager, UIManager } from "../ExtensionType";
import { HeadUIModuleC } from "../modules/player/modules/HeadUIModule";
import { PlayerMgr } from "../ts3/player/PlayerMgr";
import SettingUI_Generate from "../ui-generate/SettingUI_generate";
import GameUtils from "../utils/GameUtils";
import Tips from "./commonUI/Tips";

export class SettingUI extends SettingUI_Generate {
    private _curState: SettingState;
    private _headUIModule: HeadUIModuleC;
    private get titleModule() {
        if (this._headUIModule == null) {
            this._headUIModule = GlobalModule.MyPlayerC.HeadUI;
        }
        return this._headUIModule;
    }

    protected onStart(): void {
        this.mBtn_Exit.onClicked.add(() => {
            this.changeState(SettingState.None);
        });

        this.mBtn_NameCard.onClicked.add(() => {
            this.changeState(SettingState.NameCard);
        });

        this.mBtn_Graphics.onClicked.add(() => {
            this.changeState(SettingState.Graphics);
        });

        this.mBtn_Sound.onClicked.add(() => {
            this.changeState(SettingState.Sound);
        });

        this.nameCardLogic();
        this.graphicsLogic();
        this.soundLogic();
    }

    /**
     * 名片界面逻辑
     */
    private nameCardLogic() {
        this.mBtn_EnterTitle.onClicked.add(async () => {
            this.playSound(31);
            let text = this.mInput_Title.text;
            let result = await StringUtil.maskWordCheck(text);
            if (!result.result) {
                Tips.show(GameUtils.getTxt("SettingUI_tex_2"));
                return;
            }
            PlayerMgr.Inst.setTitle(1, text)
            // this.titleModule.changeTitle(text);
            this.changeState(SettingState.None);
        });

        this.mBtn_ResetTitle.onClicked.add(() => {
            // this.titleModule.resetTitle();
            PlayerMgr.Inst.resetTitle(1)
            this.playSound(31);
        });

    }

    /**
     * 画质设置界面
     */
    private graphicsLogic() {
        let curGraphicsLv = Math.floor(this.mBar_GraphicsLev.currentValue * 10);
        this.mTxt_GrapLevNum.text = curGraphicsLv.toString();
        this.mBar_GraphicsLev.onSliderValueChanged.add((val: number) => {
            if (curGraphicsLv == Math.floor(val * 10)) return;
            curGraphicsLv = Math.floor(val * 10);
            if (curGraphicsLv > 9) curGraphicsLv = 9;
            this.mTxt_GrapLevNum.text = curGraphicsLv.toString();
        });

        this.mBtn_GrapEnter.onClicked.add(() => {
            if (curGraphicsLv > 9) curGraphicsLv = 9;
            GraphicsSettings.setGraphicsCPULevel(curGraphicsLv);
            GraphicsSettings.setGraphicsGPULevel(curGraphicsLv);
            this.playSound(31);
            this.changeState(SettingState.None);
        });

        this.mBtn_GrapReset.onClicked.add(() => {
            this.resetGraphics(false);
            this.playSound(31);
        });

        this.mBtn_GrapCancel.onClicked.add(() => {
            this.changeState(SettingState.Graphics);
        });

        this.resetGraphics(true);
    }

    /**
     * 初始化画质
     * @param isResetUI 是否只刷新ui数值
     */
    private resetGraphics(isResetUI: boolean) {
        let defaultCpu = GraphicsSettings.getDefaultCPULevel();
        if (!isResetUI) {
            GraphicsSettings.setGraphicsCPULevel(defaultCpu);
            GraphicsSettings.setGraphicsGPULevel(defaultCpu);
        }
        this.mBar_GraphicsLev.currentValue = defaultCpu / 10;
        this.mTxt_GrapLevNum.text = defaultCpu.toString();
    }

    /**
     * 音效设置界面
     */
    private soundLogic() {
        this.mBar_Music.currentValue = SoundManager.BGMVolumeScale;
        this.mBar_Music.onSliderValueChanged.add((val: number) => {
            SoundManager.BGMVolumeScale = val;
        });

        this.mBar_Sound.currentValue = SoundManager.volumeScale;
        this.mBar_Sound.onSliderValueChanged.add((val: number) => {
            SoundManager.volumeScale = val;
        });
    }

    private changeState(newState: SettingState) {
        this._curState = newState;
        this.onStateEnter(this._curState);
    }

    private onStateEnter(_curState: SettingState) {
        switch (_curState) {
            case SettingState.NameCard:
                this.setUIVisible(this.mCanvasNameCard, true);
                this.setUIVisible(this.mCanvasGraphics, false);
                this.setUIVisible(this.mCanvasSound, false);
                this.mBtn_NameCard.normalImageColor = mw.LinearColor.white
                this.mBtn_Graphics.normalImageColor = mw.LinearColor.gray
                this.mBtn_Sound.normalImageColor = mw.LinearColor.gray
                break;

            case SettingState.Graphics:
                this.setUIVisible(this.mCanvasNameCard, false);
                this.setUIVisible(this.mCanvasGraphics, true);
                this.setUIVisible(this.mCanvasSound, false);
                this.mBtn_NameCard.normalImageColor = mw.LinearColor.gray
                this.mBtn_Graphics.normalImageColor = mw.LinearColor.white
                this.mBtn_Sound.normalImageColor = mw.LinearColor.gray
                break;
            case SettingState.Sound:
                this.setUIVisible(this.mCanvasNameCard, false);
                this.setUIVisible(this.mCanvasGraphics, false);
                this.setUIVisible(this.mCanvasSound, true);
                this.mBtn_NameCard.normalImageColor = mw.LinearColor.gray
                this.mBtn_Graphics.normalImageColor = mw.LinearColor.gray
                this.mBtn_Sound.normalImageColor = mw.LinearColor.white
                break;
            case SettingState.None:
                if (this.visible) {
                    UIManager.hideUI(this);
                }
                break;
            default:
                break;
        }
    }

    protected onShow(): void {
        this.changeState(SettingState.NameCard);
    }


    private setUIVisible(ui: mw.Canvas, visible: boolean) {
        let result = visible ? mw.SlateVisibility.SelfHitTestInvisible : mw.SlateVisibility.Hidden;
        if (ui.visibility != result) {
            ui.visibility = result;
        }
    }

    private async playSound(id: number) {
        let config = GameConfig.Music.getElement(id);
        if (!AssetUtil.assetLoaded(config.MusicGUID)) {
            await AssetUtil.asyncDownloadAsset(config.MusicGUID);
        }
        return GameUtils.playSoundOrBgm(id);
    }
}

enum SettingState {
    None,
    NameCard,
    Graphics,
    Sound,
}