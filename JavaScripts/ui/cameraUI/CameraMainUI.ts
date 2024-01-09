import { GameConfig } from "../../config/GameConfig";
import { MyAction, MyAction1, MyAction2 } from "../../ExtensionType";
import { MGSMsgHome } from "../../modules/mgsMsg/MgsmsgHome";
import CameraMain_Generate from "../../ui-generate/uiTemplate/Camera/CameraMain_generate";

export class CameraMainUI extends CameraMain_Generate {
    public cameraTypeChangeAC: MyAction1<number> = new MyAction1();
    public distanceChangeAC: MyAction1<number> = new MyAction1();
    public lrChangeAC: MyAction1<number> = new MyAction1();
    public clickFilterBtnAC: MyAction = new MyAction();
    public clickActionBtnAC: MyAction = new MyAction();
    public cameraSwithAC: MyAction = new MyAction();

    public cameraTripodAC_Up: MyAction2<number, string> = new MyAction2<number, string>();
    public cameraTripodAC_Left: MyAction2<number, string> = new MyAction2();
    public cameraTripodAC_Down: MyAction2<number, string> = new MyAction2();
    public cameraTripodAC_Right: MyAction2<number, string> = new MyAction2();
    public closeCameraAC: MyAction = new MyAction();
    public clickTakePhotosBtnAC: MyAction = new MyAction();

    private _cameraTripodChangeLocValue: number;
    private _mgsEnterModelTime: number = 0;// 记录在每一个页面停留的时长

    onStart() {
        this._cameraTripodChangeLocValue = GameConfig.Global.getElement(24).Value;
        this.mProgressBar_Distance.onSliderValueChanged.add(this.distanceSliderChange);
        this.mProgressBar_LR.onSliderValueChanged.add(this.lRSliderChange);
        this.mButton_Camera.onClicked.add(this.takePhotos);
        this.mButton_Switch.onClicked.add(this.changeCameraType);
        this.mButton_Close.onClicked.add(this.closeCamera);
        this.mButton_Filter.onClicked.add(this.clickFilter);
        this.mButton_Action.onClicked.add(this.clickAction);
        this.clickMoveBtn();
    }

    onShow(isOutCall: boolean = false) {
        MGSMsgHome.setPageMGS("camera");
        if (isOutCall) { return };
        this._mgsEnterModelTime = -1;
    }

    public takePhotos = () => {
        //TODO:等拍照。。。
        this.clickTakePhotosBtnAC.call();
    }

    public closeCamera = () => {
        // UIHide(this);
        this.closeCameraAC.call();
        this._mgsEnterModelTime = -1;
        this.mTouchPad.visibility = mw.SlateVisibility.SelfHitTestInvisible;
    }

    public clickMoveBtn() {
        this.mButton_UP.onClicked.add(this.clickUp.bind(this));
        this.mButton_Down.onClicked.add(this.clickDown.bind(this));
        this.mButton_Left.onClicked.add(this.clickLeft.bind(this));
        this.mButton_Right.onClicked.add(this.clickRight.bind(this));
    }

    public clickUp() {
        this.cameraTripodAC_Up.call(this._cameraTripodChangeLocValue, "z")
    }

    public clickDown() {
        this.cameraTripodAC_Down.call(-this._cameraTripodChangeLocValue, "z");
    }

    public clickLeft() {
        this.cameraTripodAC_Left.call(-this._cameraTripodChangeLocValue, "y")
    }

    public clickRight() {
        this.cameraTripodAC_Right.call(this._cameraTripodChangeLocValue, "y");
    }

    /**改变摄像机距离Length */
    public distanceSliderChange = (value: number) => {
        this.distanceChangeAC.call(value);
    }

    /**改变摄像机旋转 */
    public lRSliderChange = (value: number) => {
        this.lrChangeAC.call(value);
    }

    public changeCameraType = () => {
        this.cameraSwithAC.call();
    }

    /**获取距离滑块默认值、Slider对应默认值、最大值、最小值 */
    public getDisSliderDefault(cameraType: CameraType): { minValue: number, maxValue: number, medValue: number, defValue: number } {
        let valueID: number = null;
        let NumID: number = null;
        if (cameraType == CameraType.Camera_FP) {
            valueID = 16;
            NumID = 14;
        } else if (cameraType == CameraType.Camera_TP) {
            valueID = 27;
            NumID = 25;
        } else if (cameraType == CameraType.Camera_Tripod) {
            valueID = 23;
            NumID = 19;
        }
        let value = GameConfig.Global.getElement(valueID).Value;//默认值
        let min = GameConfig.Global.getElement(NumID).Value2[0];//最小值
        let max = GameConfig.Global.getElement(NumID).Value2[1];//最大值
        let def = (min - value) / (min - max)  //Slider对应的默认值
        let msg = { minValue: min, maxValue: max, medValue: value, defValue: def }
        return msg;
    }

    /**修改相机类型 */
    public changeCamera(cameraType: CameraType) {

        if (cameraType == CameraType.Camera_FP) {
            this.filterCanvasState(true);
            this.actionCanvasState(false);
            this.moveCameraState(false);
            this.distanceSliderBarState(true);
            this.lrSliderBarState(true);
            this.mTouchPad.visibility = mw.SlateVisibility.Visible;
        } else if (cameraType == CameraType.Camera_TP) {
            this.filterCanvasState(true);
            this.actionCanvasState(true);
            this.moveCameraState(false);
            this.lrSliderBarState(false);
            this.distanceSliderBarState(true);
            this.mTouchPad.visibility = mw.SlateVisibility.Visible;
        } else if (cameraType == CameraType.Camera_Tripod) {
            this.filterCanvasState(true);
            this.actionCanvasState(true);
            this.moveCameraState(true);
            this.lrSliderBarState(true);
            this.distanceSliderBarState(true);
            this.mTouchPad.visibility = mw.SlateVisibility.SelfHitTestInvisible;
        }
        if (this._mgsEnterModelTime != -1) {
            let totalTime = Math.round(TimeUtil.elapsedTime() - this._mgsEnterModelTime);
            if (totalTime > 1) {
                // 防止连续点击切换
                let oldType = cameraType - 1;
                if (oldType == CameraType.Null) {
                    oldType = CameraType.Camera_Tripod;
                }
                MGSMsgHome.setStayTime(oldType, totalTime);
            }
        }
        this._mgsEnterModelTime = TimeUtil.elapsedTime();

        this.cameraTypeChangeAC.call(cameraType);
        let msg = this.getDisSliderDefault(cameraType);
        this.mProgressBar_Distance.currentValue = (msg.defValue);//设置距离滑块默认值
        this.distanceSliderChange(msg.defValue)
        this.mProgressBar_LR.currentValue = (this.mProgressBar_LR.sliderMaxValue / 2);
        this.lRSliderChange(this.mProgressBar_LR.sliderMaxValue / 2);

    }

    /**修改滤镜Item状态 */
    public filterCanvasState(isShow: boolean) {
        this.mCanvas_Filter.visibility = isShow ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed
    }
    /**修改动作Item状态 */
    public actionCanvasState(isShow: boolean) {
        this.mCanvas_Action.visibility = isShow ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed
    }

    /**修改相机距离Canvas状态 */
    public distanceSliderBarState(isShow: boolean) {
        this.mCanvas_Distance.visibility = isShow ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed
    }

    /**修改相机旋转Canvas状态 */
    public lrSliderBarState(isShow: boolean) {
        this.mCanvas_LR.visibility = isShow ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed
    }

    /**修改三脚架移动相机Canvas状态 */
    public moveCameraState(isShow: boolean) {
        this.mCanvas_Move.visibility = isShow ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed
    }

    public switchState(isShow: boolean) {
        this.mCanvas_Switch.visibility = isShow ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed
    }

    /**点击显示滤镜Item */
    public clickFilter = () => {
        this.clickFilterBtnAC.call();
    }
    /**点击显示动作Item */
    public clickAction = () => {
        this.clickActionBtnAC.call();
    }
}

/**摄像机类型 */
export enum CameraType {
    Null = 0,
    /**第一人称摄像机 */
    Camera_FP = 1,
    /**第三人称摄像机 */
    Camera_TP = 2,
    /**三脚架摄像机 */
    Camera_Tripod = 3,
}