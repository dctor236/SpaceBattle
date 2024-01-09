import { PlayerManagerExtesion, } from './Modified027Editor/ModifiedPlayer';
﻿// @Component
// export default class Vehicle4WServer extends mw.Script {

// 	//预加载角色驾驶姿动画资源
// 	@mw.Property()
// 	preloadAssets = "14015";

// 	private vehicle: mw.WheeledVehicle4W;
// 	private interactiveObj: mw.Interactor;
// 	private trigger: mw.Trigger;
// 	private speedvalue: number;
// 	private gearvalue: number;
// 	private vehicleData: Array<number>;


// 	//声明双端同步变量
// 	@mw.Property({
// 		replicated: true,
// 		onChanged: "onChanged"
// 	})
// 	public _inOutState = true;

// 	onChanged(): void {
// 		console.log(`=======> _inOutState onChanged ${this._inOutState}`);
// 	}

// 	/** 当脚本被实例后，会在第一帧更新前调用此函数 */
// 	protected onStart(): void {

// 		this.vehicle = this.gameObject as mw.WheeledVehicle4W;
		
// 		//通过父子级关系获取载具的交互物和触发器
// 		if (mw.isServer()) {
// 			let get_VehicleChildren = this.vehicle.getChildren();

// 			for (let index = 0; index < get_VehicleChildren.length; index++) {
// 				if (get_VehicleChildren[index] instanceof mw.Interactor) {
// 					this.interactiveObj = get_VehicleChildren[index] as mw.Interactor;
// 				} else if (get_VehicleChildren[index] instanceof mw.Trigger) {
// 					this.trigger = get_VehicleChildren[index] as mw.Trigger;
// 				}
// 			}
// 		}

// 		//通过触发器，激活/隐藏上车按钮
// 		if (mw.isServer()) {
// 			this.trigger.onEnter.add((chara: mw.Character) => {
// 				if (PlayerManagerExtesion.isCharacter(chara) && this._inOutState == true) {
// 					Event.dispatchToClient(chara.player, "showOnCarButton", 0, this.vehicle.guid);
// 				}
// 			});

// 			this.trigger.onLeave.add((chara: mw.Character) => {
// 				if (PlayerManagerExtesion.isCharacter(chara)) {
// 					Event.dispatchToClient(chara.player, "showOnCarButton", 1, this.vehicle.guid);
// 				}
// 			});
// 		}

// 		//服务器接收上车事件
// 		Event.addClientListener("InVehicle_Server", (player: mw.Player, CarID: string) => {
// 			if (this._inOutState == true && CarID == this.vehicle.guid) {
// 				player.character.enableCollision = false;
// 				console.log(`角色碰撞关闭`);
				
// 				this.interactiveObj.enter(player.character);
// 				this._inOutState = false;
// 				this.InVehicleEvents(player, this.vehicle, this._inOutState);
// 			}
// 		});

// 		//服务器接收下车事件
// 		Event.addClientListener("OutVehicle_Server", (player: mw.Player, CarID: string) => {
// 			if (CarID == this.vehicle.guid) {
// 				player.character.enableCollision = true;
// 				this.interactiveObj.exitInteractiveState(new mw.Vector(this.trigger.worldTransform.position.x, this.trigger.worldTransform.position.y, this.trigger.worldTransform.position.z + 50));
// 				this._inOutState = true;
// 				this.InVehicleEvents(player, this.vehicle, this._inOutState);
// 			}
// 		});
// 	}

// 	/** 
// 	  * 客户端执行上下车逻辑
// 	  */
// 	@RemoteFunction(mw.Client)
// 	private InVehicleEvents(player: mw.Player, Vechicle: mw.WheeledVehicle4W, inOutState: boolean) {
// 		if (inOutState) {
// 			this.vehicle.switchCamera(false);
// 			Vechicle.setDriver(null);
// 			Event.dispatchToLocal("HideControlCanvas");
// 		} else {
// 			Camera.currentCamera.enableCameraCollison = false;
// 			this.vehicle.switchCamera(true);
// 			Vechicle.setDriver(player);
// 			Event.dispatchToLocal("showControlCanvas");
// 			this.VehicleUIEvents();
// 		}
// 	}

// 	/** 
// 	 * 通过UI按钮控制载具移动
// 	 * 需要在预制体-UI预制件中下载[四轮载具控制UI]配合使用；
// 	 */
// 	private VehicleUIEvents() {
// 		this.useUpdate = true;

// 		//接收客户端发来的摇杆事件，控制载具油门和方向
// 		Event.addLocalListener("moveVec", (val: mw.Vector2) => {
// 			this.vehicle.setThrottleInput(val.y);
// 			this.vehicle.setSteeringInput(val.x);
// 		});

// 		//接收客户端发来的按钮事件，控制载具刹车
// 		Event.addLocalListener("HandbrakeInput", (val: boolean) => {
// 			this.vehicle.setHandbrakeInput(val);
// 		});

// 	}

// 	/** 
// 	* 每帧被执行,与上一帧的延迟 dt 秒
// 	  * 此函数执行需要将this.bUseUpdate赋值为true
// 	  */
// 	protected onUpdate(dt: number): void {
// 		this.speedvalue = Math.abs(Math.round(this.vehicle.velocity * 3.6));  //获取当前载具时速
// 		this.gearvalue = this.vehicle.currentGearLevel;      //获取当前载具档位
// 		this.vehicleData = [this.speedvalue, this.gearvalue]
// 		Event.dispatchToLocal("showSpeed", this.vehicleData);

// 	}
// }
