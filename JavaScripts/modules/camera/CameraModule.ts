import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import { SpawnManager, SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
import { ModifiedCameraSystem, CameraModifid, } from '../../Modified027Editor/ModifiedCamera';
import { GameConfig } from "../../config/GameConfig";
import { GlobalData } from "../../const/GlobalData";
import { GlobalModule } from "../../const/GlobalModule";
import { Tween, UICreate, UIHide, UIIsShow, UIManager, UIShowClass, UITopShow } from "../../ExtensionType";
import CameraTips_Generate from "../../ui-generate/uiTemplate/Camera/CameraTips_generate";
import CameraActionUI from "../../ui/cameraUI/CameraActionUI";
import CameraFilterUI from "../../ui/cameraUI/CameraFilterUI";
import { CameraMainUI, CameraType } from "../../ui/cameraUI/CameraMainUI";
import { BagModuleC } from "../bag/BagModuleC";
import { Chat_Server } from "../chat/Chat";
import { GameModuleC } from "../gameModule/GameModuleC";
import P_GameHUD, { UIType } from "../gameModule/P_GameHUD";
import { InteractPlayerMsg } from "../interactModule/interactLogic/InteractObject";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";

export class CameraModuleC extends ModuleC<CameraModuleS, null> {

	public cameraUI: CameraMainUI;

	//摄像机
	private camera: Camera;
	private curCameraType: CameraType;
	private cameraBornLength: number;
	private cameraRot: mw.Rotation = Rotation.zero;
	private relTransform: mw.Transform;
	private cameraType: CameraType;
	private rotationLag;
	private tween: Tween<any>;
	private oldCameraLocLag: number;
	private oldCameraRotaLag: number;
	private rotationTime;
	//拍照
	// private isInTakePhotos: boolean;

	//滤镜\表情
	private cameraFilterWeather: CameraFilterUI;
	private cameraActionExpression: CameraActionUI;
	private postProcess: mw.PostProcess;

	//天气特效
	private saveCurWeatherEff: number[] = []; //存储已经播放的特效ID
	private saveAllTimeOut: any[] = []; //存储所有timeout

	//玩家
	private playerWalkSpeed: number;
	private playerHeight: number;
	private tempObj: mw.GameObject;

	private myCmaeraTip: CameraTips_Generate;
	public guideAC: Action = new Action();
	public gameModuleC: GameModuleC;
	private _defaultSlot: mw.Vector;

	onStart(): void {
		//玩家
		// setTimeout(() => {
		// 	let v2 = this.localPlayer.character.getAppearance();
		// 	if (v2)
		// 		v2.setOutline(true);
		// }, 5000);
		this.playerHeight = this.localPlayer.character.crouchedHeight;
		this.playerWalkSpeed = this.localPlayer.character.maxWalkSpeed;
		//摄像机
		this.camera = Camera.currentCamera;
		this.camera.springArm.collisionEnabled = true
		// this.camera.occlusionDetectionEnable = true
		GlobalData.globalCameraRot = this.camera.worldTransform.clone().rotation.clone()
		this.cameraBornLength = this.camera.springArm.length;
		this._defaultSlot = this.camera.localTransform.position;
		this.relTransform = this.camera.localTransform.clone();
		this.oldCameraLocLag = this.camera.positionLagSpeed;
		this.oldCameraRotaLag = this.camera.rotationLagSpeed;
		this.initProcess();
		SpawnManager.asyncSpawn({ guid: "Anchor" }).then(obj => {
			this.tempObj = obj;
		});

		this.gameModuleC = ModuleService.getModule(GameModuleC);
		this.cameraType = CameraType.Null;
	}
	private initCamera() {
		this.myCmaeraTip = UICreate(CameraTips_Generate);
		this.myCmaeraTip.mStaleButton_1.onClicked.add(() => {
			this.overTakePhotos();
		});
		this.cameraUI.cameraSwithAC.add(this.cameraTypeChange);
		this.cameraUI.cameraTypeChangeAC.add(this.cameraChange);
		this.cameraUI.cameraTripodAC_Up.add(this.changeCameraLoc_Tripod);
		this.cameraUI.cameraTripodAC_Down.add(this.changeCameraLoc_Tripod);
		this.cameraUI.cameraTripodAC_Left.add(this.changeCameraLoc_Tripod);
		this.cameraUI.cameraTripodAC_Right.add(this.changeCameraLoc_Tripod);
		this.cameraUI.distanceChangeAC.add(this.changeCameraLength);
		this.cameraUI.lrChangeAC.add(this.changeCameraRot_FP);
		this.cameraUI.closeCameraAC.add(this.closeCamera);
		this.cameraUI.clickTakePhotosBtnAC.add(this.startTakePhotos);
		this.cameraUI.clickFilterBtnAC.add(this.changeFilterWeatherItemState);
		this.cameraUI.clickActionBtnAC.add(this.changeActionExpressionState);
		this.initFilterWeatherItem();
		//滤镜\天气
		this.initActionExpressionItem();
	}

	/**拍照功能 */
	public startTakePhotos = () => {
		// this.isInTakePhotos = true;
		UIHide(this.cameraUI);
		this.gameModuleC.changeJoyStickState(false); //隐藏摇杆
		if (this.curCameraType == CameraType.Camera_TP || this.curCameraType == CameraType.Camera_Tripod) {
			this.gameModuleC.IsTakePhotos(false);
		}
		UITopShow(this.myCmaeraTip);
		//TODO：接拍照接口
	};

	/**结束拍照 */
	public overTakePhotos() {
		// //通过点击屏幕结束拍照---目前不是点击全部屏幕都会触发。。。
		// if (!this.isInTakePhotos) { return }
		// this.isInTakePhotos = false;
		UIManager.showUI(this.cameraUI, mw.UILayerBottom, true);
		this.gameModuleC.changeJoyStickState(true); //显示摇杆
		if (this.curCameraType == CameraType.Camera_TP || this.curCameraType == CameraType.Camera_Tripod) {
			this.gameModuleC.IsTakePhotos(true);
		}
		UIHide(this.myCmaeraTip);

		this.guideAC?.call();
	}

	/**显示相机 */
	public showCamera(isOutCall: boolean = false) {
		if (!this.cameraUI) {
			//UI
			this.cameraUI = UIManager.getUI(CameraMainUI);
			this.initCamera();
		}
		InteractPlayerMsg.addPlayer(this.localPlayer); // 隐藏交互物按钮
		UIManager.showUI(this.cameraUI);
		// UIManager.getUI(P_GameHUD).hide();
		if (isOutCall) {
			return;
		}
		this.cameraType = CameraType.Null;
		this.cameraTypeChange();
	}
	private cameraTypeChange = () => {
		this.cameraType++;
		if (this.cameraType > CameraType.Camera_Tripod) {
			this.cameraType = CameraType.Camera_FP;
		}
		this.cameraUI.changeCamera(this.cameraType);
	};
	/**修改相机类型 顺序-->第一人称、第三人称、三脚架 */
	public cameraChange = (cameraType: CameraType) => {
		this.hideAllItem();
		if (cameraType == CameraType.Camera_FP) {
			this.resetCamera_Tripod();
			setTimeout(() => {
				//延迟等待相机跟随上
				this.setCamera_FP();
				this.cameraPlayerRotation();
			}, 10);
		} else if (cameraType == CameraType.Camera_TP) {
			this.resetCamera_FP();
			this.setCamera_TP();
			this.cameraPlayerRotation();
		} else if (cameraType == CameraType.Camera_Tripod) {
			this.resetCamera_TP();
			this.setCamera_Tripod();
		}
		this.gameModuleC.changeHUDState(cameraType); //隐藏主页UI
	};
	/**注册后处理--滤镜功能 */
	public async initProcess() {
		let obj = await SpawnManager.wornAsyncSpawn("PostProcessAdvance");
		if (!obj) {
			this.initProcess();
		}
		this.postProcess = obj as mw.PostProcess;
		// this.postProcess.outlineNotCoveredEdgeAlpha = 0
		// this.postProcess.outlineCoveredAlpha = 1
		// this.postProcess.outlineWidth = 1
		// this.postProcess.occlusionBlend = 0.5
	}
	/**切换摄像机类型 外部调用 */
	public switchCamera(type: CameraType) {
		this.resetAllCamera();
		this.cameraType = type;
		this.cameraUI.changeCamera(this.cameraType);
	}
	/**第一人称 */
	private setCamera_FP() {
		ModifiedCameraSystem.followTargetEnable = true;
		this.curCameraType = CameraType.Camera_FP;
		this.cameraMoveTween(
			new mw.Vector(-200, 0, this.playerHeight),
			new mw.Vector(0, 0, this.playerHeight),
			1.5,
			this.cameraPlayerReset.bind(this)
		);
		// this.camera.springArm.collisionEnabled = false;
		// ModifiedCameraSystem.setOverrideCameraRotation(this.localPlayer.character.worldTransform.rotation); //将相机与玩家方向一致
		// setTimeout(() => {
		// 	ModifiedCameraSystem.resetOverrideCameraRotation();
		// }, 10);
		this.rotationTime = setTimeout(() => {
			this.cameraRot = this.camera.worldTransform.clone().rotation; //需延时记录相机旋转信息，不然会出现记录相机旋转前的值
			this.rotationTime = null;
		}, 1500); //等待摄像机延迟结束，再记录
		this.localPlayer.character.maxWalkSpeed = GameConfig.Global.getElement(13).Value;
	}
	/**重置第一人称摄像机 */
	public resetCamera_FP() {
		if (this.tween != null) {
			this.tween.stop();
		}
		if (this.rotationTime != null) {
			clearTimeout(this.rotationTime);
			this.rotationTime = null;
		}
		this.cameraPlayerReset();
		this.camera.springArm.collisionEnabled = true;
		this.cameraMoveTween(this.camera.localTransform.clone().position, this.relTransform.position, 1.5, this.cameraPlayerReset.bind(this));
		// ModifiedCameraSystem.setOverrideCameraRotation(this.localPlayer.character.worldTransform.rotation);
		setTimeout(() => {
			//延时取消旋转覆盖，否则上面旋转会失效
			// ModifiedCameraSystem.resetOverrideCameraRotation();
			this.camera.localTransform = this.relTransform;
		}, 10);
		this.camera.springArm.length = this.cameraBornLength;
		this.localPlayer.character.maxWalkSpeed = this.playerWalkSpeed;
		this.cameraRot = null;
		this.curCameraType = CameraType.Null;
	}
	/**第三人称 */
	public setCamera_TP() {
		this.curCameraType = CameraType.Camera_TP;
	}

	public resetCamera_TP() {
		//重置第三人称相关UI
		if (this.tween != null) {
			this.tween.stop();
		}
		this.cameraPlayerReset();
		this.curCameraType = CameraType.Null;
	}
	/**摄像机玩家特写 */
	public cameraPlayerRotation() {
		//延迟结束旋转
		this.rotationLag = setTimeout(() => {
			this.cameraPlayerReset();
			this.rotationLag = null;
		}, 1500);
		this.camera.rotationLagEnabled = true;
		this.camera.positionLagEnabled = true;
		this.camera.rotationLagSpeed = 2;
		this.camera.positionLagSpeed = 2;
	}

	/**
		 * @description: 装扮模块玩家特写
		 * @param {*} isShow
		 * @param {*} offsetAngle 偏移角度
		 * @param {*} offsetZ 偏移量z
		 * @param {*} fov 广角
		 * @return {*}
		 */
	public facadPlayerRotation(isShow = true, lookHuman?: mw.GameObject, x = 200, y = 0, z = -40) {
		if (mw.SystemUtil.isServer()) return;
		if (isShow) {
			ModifiedCameraSystem.followTargetInterpSpeed = 0;
			ModifiedCameraSystem.setCameraFollowTarget(lookHuman)
			this.camera.fov = 60
			let ro = lookHuman.worldTransform.rotation
			ro.z -= 180;
			let forward = lookHuman.worldTransform.getForwardVector().multiply(200)
			this.camera.springArm.localTransform.position = new mw.Vector(x, y, z)
			ModifiedCameraSystem.setOverrideCameraRotation(ro);
		}
		else {
			this.camera.springArm.collisionEnabled = true;
			ModifiedCameraSystem.followTargetInterpSpeed = 0;
			ModifiedCameraSystem.cancelCameraFollowTarget()
			this.camera.fov = 90;
			this.camera.positionLagEnabled = false;
			this.camera.rotationLagEnabled = false;
			this.camera.springArm.localTransform.position = mw.Vector.zero
			this.camera.localTransform.position = this._defaultSlot;
			this.camera.springArm.length = this.cameraBornLength;
			ModifiedCameraSystem.resetOverrideCameraRotation();
		}
	}

	/**摄像机关特写旋转 */
	public cameraPlayerReset() {
		if (this.rotationLag != null) {
			clearTimeout(this.rotationLag);
			this.rotationLag = null;
		}
		this.camera.positionLagEnabled = false;
		this.camera.rotationLagEnabled = false;
		this.camera.rotationLagSpeed = this.oldCameraRotaLag;
		this.camera.positionLagSpeed = this.oldCameraLocLag;
	}
	/**
	 * 摄像机移动
	 * @param originLoc 起始位置
	 * @param toLoc 目标位置
	 * @param duration 持续时间
	 * @param fun 到达后的执行的方法
	 */
	public cameraMoveTween(originLoc: mw.Vector, toLoc: mw.Vector, duration: number, fun: Function) {
		this.camera.localTransform = new mw.Transform(
			originLoc,
			this.camera.localTransform.clone().rotation,
			this.camera.localTransform.clone().scale
		);
		let newPos = mw.Vector.zero;
		this.tween = new Tween(this.camera.localTransform.clone().position)
			.to({ x: toLoc.x, y: toLoc.y, z: toLoc.z }, duration * 1000)
			.start()
			.onUpdate(loc => {
				newPos.x = loc.x;
				newPos.y = loc.y;
				newPos.z = loc.z;
				this.camera.localTransform = new mw.Transform(
					newPos,
					this.camera.localTransform.clone().rotation,
					this.camera.localTransform.clone().scale
				);
			})
			.onComplete(() => {
				fun();
				this.tween = null;
			});
	}

	/**关闭相机 */
	public closeCamera = () => {
		UIHide(this.cameraUI);
		UIManager.getUI(P_GameHUD).show();
		this.resetAllCamera();
		ModifiedCameraSystem.setOverrideCameraRotation(GlobalData.globalCameraRot); //将相机与玩家方向一致
		setTimeout(() => {
			ModifiedCameraSystem.resetOverrideCameraRotation();
		}, 10);
		this.hideAllItem();
		this.stopAllEffect();
		let filterDefID = GameConfig.Filter.getAllElement()[0].ID; //获取默认滤镜
		this.setFilter(filterDefID); //初始化滤镜
		this.gameModuleC.changeHUDState(0);
		this.curCameraType = CameraType.Null;
		this.camera.positionLagEnabled = true;
		this.camera.rotationLagEnabled = true;
		ModuleService.getModule(BagModuleC).setHubVis(true);
		InteractPlayerMsg.removePlayer(this.localPlayer); // 开启交互物按钮
		this.cameraFilterWeather.refreshFilterUI(); //重置滤镜天气按钮状态
		this.cameraActionExpression.refreshActionUI(); //重置动画表情按钮状态
		MGSMsgHome.setBtnClick("close");
	};
	private cameraWorldTransForm: mw.Transform;
	private minValue_UD: number; //三脚架上下移动最小值
	private maxValue_UD: number; //三脚架上下移动最大值
	private minValue_LR: number; //三脚架左右移动最小值
	private maxValue_LR: number; //三脚架左右移动最大值
	/**三脚架 */
	private setCamera_Tripod() {
		this.curCameraType = CameraType.Camera_Tripod;
		ModifiedCameraSystem.setOverrideCameraRotation(this.camera.worldTransform.clone().rotation);
		setTimeout(() => {
			//加延时，等待上面修改旋转后再进行下面代码
			this.cameraWorldTransForm = this.camera.worldTransform.clone();
			// this.camera.springArm.collisionEnabled = false;
			this.camera.positionMode = mw.CameraPositionMode.PositionFixed;
			this.cameraRot = this.camera.worldTransform.clone().rotation;
			ModifiedCameraSystem.followTargetInterpSpeed = 0;
			this.tempObj.worldTransform.position = this.localPlayer.character.worldTransform.position;
			ModifiedCameraSystem.setCameraFollowTarget(this.tempObj);
			//注册三脚架移动相机功能上下左右最大值、最小值
			this.minValue_UD = this.cameraWorldTransForm.position.z + GameConfig.Global.getElement(21).Value2[0];
			this.maxValue_UD = this.cameraWorldTransForm.position.z + GameConfig.Global.getElement(21).Value2[1];
			this.minValue_LR = this.cameraWorldTransForm.position.y + GameConfig.Global.getElement(22).Value2[0];
			this.maxValue_LR = this.cameraWorldTransForm.position.y + GameConfig.Global.getElement(22).Value2[1];
		}, 10);
	}

	/**结束相机三脚架模式 */
	private resetCamera_Tripod() {
		this.cameraPlayerReset();
		this.camera.springArm.collisionEnabled = true;
		this.camera.positionMode = mw.CameraPositionMode.PositionFollow;
		ModifiedCameraSystem.resetOverrideCameraRotation();
		this.camera.springArm.length = this.cameraBornLength;
		this.camera.localTransform = this.relTransform;
		this.tempObj.worldTransform.position.add(this.tempObj.worldTransform.getForwardVector());
		ModifiedCameraSystem.cancelCameraFollowTarget();
		this.cameraRot = null;
		this.curCameraType = CameraType.Null;
	}

	/**三脚架修改相机位置 */
	public changeCameraLoc_Tripod = (value: number, axis: string) => {
		let curCameraTrans = this.camera.worldTransform.clone();
		if (axis == "y") {
			let newLoc = mw.Vector.add(curCameraTrans.position, curCameraTrans.getRightVector().normalize().multiply(value));
			if (newLoc.y < this.minValue_LR) {
				newLoc = new mw.Vector(newLoc.x, this.minValue_LR, newLoc.z);
				return;
			} else if (newLoc.y > this.maxValue_LR) {
				newLoc = new mw.Vector(newLoc.x, this.maxValue_LR, newLoc.z);
				return;
			}
			curCameraTrans.position = newLoc;
		} else if (axis == "z") {
			let newLoc = mw.Vector.add(curCameraTrans.position, new mw.Vector(0, 0, value));
			if (newLoc.z < this.minValue_UD) {
				newLoc = new mw.Vector(newLoc.x, newLoc.y, this.minValue_UD);
			} else if (newLoc.z > this.maxValue_UD) {
				newLoc = new mw.Vector(newLoc.x, newLoc.y, this.maxValue_UD);
			}
			curCameraTrans.position = newLoc;
		}
		this.camera.worldTransform = curCameraTrans;
	};

	/**修改相机距离 */
	public changeCameraLength = (value: number) => {
		const msg = this.cameraUI.getDisSliderDefault(this.cameraType);
		let newValue: number = null;
		// newValue = msg.minValue + value * (msg.maxValue - msg.minValue);
		if (value >= msg.defValue) {
			newValue = msg.medValue - (value - msg.defValue) * (msg.maxValue - msg.minValue);
		} else {
			newValue = msg.medValue + (msg.defValue - value) * (msg.maxValue - msg.minValue);
		}
		if (newValue == null) {
			console.error(" In changeCameraLength NewValue Is Error = " + newValue);
			return;
		}
		this.camera.springArm.length = newValue;
	};

	/**修改相机旋转 */
	public changeCameraRot_FP = (value: number) => {
		if (!this.cameraRot) {
			return;
		}
		let max: number = null;
		if (this.curCameraType == CameraType.Camera_FP) {
			max = GameConfig.Global.getElement(15).Value2[1];
		} else if (this.curCameraType == CameraType.Camera_Tripod) {
			max = GameConfig.Global.getElement(20).Value2[1];
		}
		const arg = max / 0.5;
		let newRot: number = null;
		if (value >= 0.5) {
			newRot = this.cameraRot.x + arg * (value - 0.5);
		} else {
			newRot = this.cameraRot.x - arg * (0.5 - value);
		}
		if (newRot == null || max == null) {
			console.error(" In changeCameraRot NewValue Is Error = " + newRot + " max = " + max);
			return;
		}
		this.camera.worldTransform = new mw.Transform(
			this.camera.worldTransform.clone().position,
			new mw.Rotation(newRot, this.cameraRot.y, this.cameraRot.z),
			this.camera.worldTransform.clone().scale
		);
	};
	/**重置所有相机 */
	public resetAllCamera() {
		if (this.tween != null) {
			this.tween.stop();
		}
		if (this.rotationTime != null) {
			clearTimeout(this.rotationTime);
			this.rotationTime = null;
		}
		this.cameraPlayerReset();
		this.camera.springArm.collisionEnabled = true;
		ModifiedCameraSystem.resetOverrideCameraRotation();
		this.camera.springArm.length = this.cameraBornLength;
		this.camera.localTransform = this.relTransform;
		this.localPlayer.character.maxWalkSpeed = this.playerWalkSpeed;
		this.camera.positionMode = mw.CameraPositionMode.PositionFollow;
		this.tempObj.worldTransform.position.add(this.tempObj.worldTransform.getForwardVector());
		ModifiedCameraSystem.cancelCameraFollowTarget();
		this.cameraRot = null;
		this.curCameraType = CameraType.Null;
	}

	/**修改天气（单端特效） */
	public changeWeather = (configID: number) => {
		this.stopAllEffect();
		let config = GameConfig.Weather.getElement(configID);
		if (config.Effect == null) {
			return;
		}

		config.Effect.forEach(id => {
			let effConfig = GameConfig.Effect.getElement(id);
			let effTime: number = null;
			let playTime: number = null;
			if (effConfig.EffectTime >= 0) {
				//播放次数
				effTime = effConfig.EffectTime;
			} else if (effConfig.EffectTime < 0) {
				//播放时间
				effTime = 0;
				playTime = Math.abs(effConfig.EffectTime);
			}
			let effId = GeneralManager.rpcPlayEffectOnPlayer(
				effConfig.EffectID,
				this.localPlayer,
				effConfig.EffectPoint,
				effTime,
				effConfig.EffectLocation,
				effConfig.EffectRotate.toRotation(),
				effConfig.EffectLarge
			);
			this.saveCurWeatherEff.push(effId);
			//需要播放时间进入
			if (playTime) {
				let timeOutID = setTimeout(() => {
					EffectService.stop(effId);
				}, playTime * 1000);
				this.saveAllTimeOut.push(timeOutID);
			}
		});
	};

	/**停止所有特效、timeout */
	public stopAllEffect() {
		if (this.saveCurWeatherEff.length != 0) {
			this.saveCurWeatherEff.forEach(id => {
				EffectService.stop(id);
			});
			this.saveCurWeatherEff.length = 0;
		}
		if (this.saveAllTimeOut.length != 0) {
			this.saveAllTimeOut.forEach(time => {
				clearTimeout(time);
			});
			this.saveAllTimeOut.length = 0;
		}
	}

	/**注册滤镜天气Item功能、事件 */
	public initFilterWeatherItem() {
		this.cameraFilterWeather = UIManager.getUI(CameraFilterUI);
		this.cameraFilterWeather.changeFilterAC.add(this.setFilter);
		this.cameraFilterWeather.changeWeatherAC.add(this.changeWeather);
	}

	/**修改滤镜天气Item显隐（点击打开/隐藏） */
	public changeFilterWeatherItemState = () => {
		if (UIIsShow(this.cameraFilterWeather)) {
			UIHide(this.cameraFilterWeather);
		} else {
			UIManager.showUI(this.cameraFilterWeather);
			UIHide(this.cameraActionExpression);
		}
	};

	/**修改滤镜（后处理） */
	public setFilter = (cfgID: number) => {
		const cfg = GameConfig.Filter.getElement(cfgID);

		let tmpCfg: PostProcessConfig = {
			bloomIntensity: cfg.Fg,
			globalSaturation: cfg.Bhd,
			globalContrast: cfg.Dbd,
			lutBlend: 0,
			lutTextureID: 0,
		}
		PostProcess.bloom = cfg.Gmz
		PostProcess.config = tmpCfg
		// // 色调映射
		// PostProcess.config.setToneCurveAmount = cfg.Sdys;删除
		// // 泛光
		// this.postProcess.bloomIntensity = cfg.Fg;
		// // 全局对比度
		// this.postProcess.globalContrast = cfg.Dbd;
		// // 全局饱和度
		// this.postProcess.globalSaturation = cfg.Bhd;
		// // 全局伽马值
		// this.postProcess.globalGamma = cfg.Gmz;
	};

	/**注册动作表情Item功能、事件 */
	public initActionExpressionItem() {
		this.cameraActionExpression = UIManager.create(CameraActionUI);
		this.cameraActionExpression.changeActionAC.add(this.playAction);
		this.cameraActionExpression.changeExpressionAC.add(this.playExpression);
	}

	/**修改动作表情Item显隐（点击显示/隐藏） */
	public changeActionExpressionState = () => {
		if (UIIsShow(this.cameraActionExpression)) {
			UIHide(this.cameraActionExpression);
		} else {
			UIManager.showUI(this.cameraActionExpression);
			UIHide(this.cameraFilterWeather);
		}
	};

	/**播放动作 */
	public playAction = (configID: number) => {
		GlobalModule.MyPlayerC.Action.luanchActionOut(configID);
		//MGSMsgHome.setBtnClick("动作c" + configID);
	};

	/**播放表情 */
	public playExpression = (configID: number) => {
		const expressionConfig = GameConfig.ChatExpression.getElement(configID);
		if (!expressionConfig.ExpressionVfx) {
			console.error(" In CameraModuleC playExpression ExpressionVfx is Error = " + expressionConfig.ExpressionVfx);
			return;
		}
		//MGSMsgHome.setBtnClick("表情d" + configID);

		this.server.net_playExpression(this.localPlayer, expressionConfig.ExpressionVfx);
	};

	/**隐藏滤镜，动作item */
	public hideAllItem() {
		UIHide(this.cameraActionExpression);
		UIHide(this.cameraFilterWeather);
	}
	/**获取摄像机ui显示状态 */
	public getCameraShowState(): boolean {
		return UIIsShow(this.cameraUI);
	}

	public resetCameraAttach() {
		let player = Player.localPlayer;
		this.camera.parent = player.character;
		this.camera.localTransform = this.relTransform;
	}

	public moveCameraToBody(scene: CamearScene = CamearScene.Dress): void {
		if (scene == CamearScene.Dress) {
			this.changeCamera(new mw.Vector(260, -70, 0), 0)
		}
	}

	/**
	 * 将摄像机移动到头部画面
	 */
	public moveCameraToHead(scene: CamearScene = CamearScene.Dress): void {
		if (scene == CamearScene.Dress) {
			this.changeCamera(new mw.Vector(100, -15, 50), 0)
		}
	}

	private changeCamera(slotOffset: Vector, targerLen: number) {
		const camera = Camera.currentCamera;
		camera.springArm.collisionEnabled = false;
		camera.springArm.localTransform.position = slotOffset;
		// ModifiedCameraSystem.setOverrideCameraRotation(new mw.Rotation(0, -5, 270));
		camera.springArm.length = targerLen;
	}

	public changeToVehecle(len: number, offset: mw.Vector): void {
		// this.restoreCameraBeforeDress();
		// let character = Player.localPlayer.character;
		this.camera.localTransform.position = Vector.zero;
		let relativeTrans = this.camera.localTransform.clone();
		relativeTrans.position.set(offset);
		this.camera.localTransform = relativeTrans;
		this.camera.springArm.length = len;
		this.camera.springArm.collisionEnabled = false;
	}

}

export class CameraModuleS extends ModuleS<CameraModuleC, null> {
	public net_playExpression(player: mw.Player, guid: string) {
		ModuleService.getModule(Chat_Server).playEmoji(player, guid);
	}
}



export enum CamearScene {
	Dress,
	NpcTalk
}