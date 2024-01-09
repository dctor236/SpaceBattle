import { SpawnManager, SpawnInfo, } from '../Modified027Editor/ModifiedSpawn';
import { PlayerManagerExtesion, } from '../Modified027Editor/ModifiedPlayer';
/** 
* @Author       : xianjie.xia
* @LastEditors  : xianjie.xia
* @Date         : 2023-06-27 16:34
* @LastEditTime : 2023-06-29 10:22
* @description  : 
*/
import { GameConfig } from "../config/GameConfig";
import { GlobalData } from "../const/GlobalData";
import { getMyCharacterGuid, getMyPlayerID, Tween } from "../ExtensionType";

export default class GameUtils {
	public static Gravity: number = 5000; //重力
	public static tween: Tween<any>;
	public static getRandomWeightIndex(weights: number[]): number {
		let totalWeight = 0;
		for (let w of weights) {
			totalWeight += w;
		}
		let ranNum = Math.random() * totalWeight;
		let sum = 0;
		let result = 0;
		for (let i = 0; i < weights.length; i++) {
			sum += weights[i];
			if (ranNum <= sum) {
				result = i;
				return i;
			}
		}
		return 0;
	}
	public static getRandomWerghtIndex2(weights: number[][]): number {
		let totalWeight = 0;
		for (let i = 0; i < weights.length; i++) {
			totalWeight += weights[i][1];
		}
		let ranNum = Math.random() * totalWeight;
		let sum = 0;
		let result = 0;
		for (let i = 0; i < weights.length; i++) {
			sum += weights[i][1];
			if (ranNum <= sum) {
				result = weights[i][0];
				return result;
			}
		}
		return null;
	}

	static getRandomObjects(inputArray: any[], count: number = 3): any[] {
		if (!inputArray || inputArray.length === 0) return [];
		if (inputArray.length <= count) return inputArray;
		const result = [];
		const randomIndexes = [];

		// Get 3 random indexes
		while (randomIndexes.length < count) {
			let randomIndex = Math.floor(Math.random() * inputArray.length);
			if (!randomIndexes.includes(randomIndex)) {
				randomIndexes.push(randomIndex);
			}
		}

		// Push elements from inputArray to result
		randomIndexes.forEach((index) => {
			result.push(inputArray[index]);
		});

		return result;
	}

	/**
	* 静态轮询
	* @param interval 间隔时间，毫秒
	* @param call 每帧检测函数
	* @param count 检测最大次数，-1 不限制次数
	* @returns 
	*/
	public static staticloop<T>(call: () => T, interval: number = 100, count: number = 2400): Promise<T> {
		return new Promise((resolve, reject) => {
			let handler = setInterval(() => {
				if (count > 0) {
					count--;
				}
				let rst = call();
				if (count == 0 || rst) {
					clearInterval(handler);
					resolve(rst);
				}
			}, interval);
		});
	}


	public static addTriggerEvent(onlySelf: boolean, trigger: mw.Trigger, callback: (player: mw.Player) => void, isEnter: boolean) {
		// oTraceError("addTriggerEvent");
		this.clearTriggerEvent(trigger, isEnter);
		let callbackFunc = (go: mw.Character) => {
			if (SystemUtil.isServer()) {
				onlySelf = false;
			}
			if (go && go.player) {
				if (onlySelf && go.player != Player.localPlayer) {
					return;
				}
				callback(go.player);
			}
		};
		if (isEnter) {
			trigger["onEnter_func"] = callbackFunc;
			trigger.onEnter.add(callbackFunc)
		}
		else {
			trigger["onLeave_func"] = callbackFunc;
			trigger.onLeave.add(callbackFunc);
		}

	}

	public static clearTriggerEvent(trigger: mw.Trigger, isEnter: boolean) {
		if (isEnter) {
			let callbackFunc = trigger["onEnter_func"];
			if (callbackFunc) {
				trigger.onEnter.remove(callbackFunc);
				trigger["onEnter_func"] = null;
			}
		}
		else {
			let callbackFunc = trigger["onLeave_func"];
			if (callbackFunc) {
				trigger.onLeave.remove(callbackFunc);
				trigger["onLeave_func"] = null;
			}
		}

	}


	//画圆找点
	public static suan(distance: number, angle: number): mw.Vector {
		let x = Math.cos((angle * Math.PI) / 180) * distance;
		let y = Math.sin((angle * Math.PI) / 180) * distance;
		return new mw.Vector(Math.floor(x), Math.floor(y), 0);
	}
	//随机
	public static getRandomNum(Min, Max): number {
		var Range = Max - Min;
		var Rand = Math.random();
		return Min + Math.round(Rand * Range);
	}
	//抛物线
	public static paowu(t: number, obj: mw.GameObject, _v: mw.Vector, dropMinZ: number) {
		let Gravity = -GameUtils.Gravity;
		let interval = setInterval((time = t) => {
			let x = 0;
			let y = 0;
			x += _v.x * time;
			y += _v.y * time;
			let z = _v.z * time + time * time * 0.5 * GameUtils.Gravity;
			_v.z += Gravity * time;
			obj.worldTransform.position = new mw.Vector(obj.worldTransform.position.x + x, obj.worldTransform.position.y + y, obj.worldTransform.position.z + z);

			if (obj.worldTransform.position.z >= dropMinZ) {
				return;
			}
			obj["CanPick"] = true;
			clearInterval(interval);
		}, t * this.getRandomNum(0.1, 5));
	}
	// 插值
	public static lerpVector(from: mw.Vector, to: mw.Vector, ratio: number): mw.Vector {
		return from.add(mw.Vector.multiply(to.subtract(from), ratio));
	}
	/**
	 * 用于秒数转换时 分 秒
	 * @param time
	 * @returns
	 */
	public static getTimeStringHMS(time: number): string {
		let hours = Math.floor(time / 3600);
		let minutes = Math.floor((time % 3600) / 60);
		let seconds = Math.floor((time % 3600) % 60);
		let hh: string = (hours < 10 ? "0" + hours : hours).toString();
		let mm: string = minutes < 10 ? "0" + minutes : minutes.toString();
		let ss: string = seconds < 10 ? "0" + seconds : seconds.toString();
		let num: string = (hh + ":" + mm + ":" + ss).split("").join(" ");
		return num;
	}
	/**
	 * 用于秒数转换分 秒
	 * @param time
	 * @returns
	 */
	public static getTimeStringMS(time: number): string {
		let minutes = Math.floor(time / 60);
		let seconds = Math.floor(time % 60);
		let mm: string = minutes < 10 ? "0" + minutes : minutes.toString();
		let ss: string = seconds < 10 ? "0" + seconds : seconds.toString();
		let num: string = (mm + ":" + ss).split("").join(" ");
		return num;
	}

	static spawnGameObject<T extends mw.GameObject>(assetId: string, replicate?: boolean): T {
		let go = SpawnManager.wornSpawn(assetId, replicate) as T;
		if (!go) {
			console.error(`找不到assetId=${assetId}对应的物体！！！`);
		}
		return go;
	}
	public static numberArrayToVector(arr: number[], defaultV: number = 0): mw.Vector {
		let vec = new mw.Vector(defaultV);
		if (arr) {
			if (arr.length > 0) vec.x = arr[0];
			if (arr.length > 1) vec.y = arr[1];
			if (arr.length > 2) vec.z = arr[2];
		}
		return vec;
	}

	public static numberArrayToRocation(arr: number[], defaultV: number = 0): mw.Rotation {
		let rot = new mw.Rotation();
		if (arr) {
			if (arr.length > 0) rot.x = arr[0];
			else rot.x = defaultV;
			if (arr.length > 1) rot.y = arr[1];
			else rot.y = defaultV;
			if (arr.length > 2) rot.z = arr[2];
			else rot.z = defaultV;
		}
		return rot;
	}

	public static clamp(min: number, max: number, value: number) {
		if (min > max) return GameUtils.clamp(max, min, value);
		return Math.min(max, Math.max(min, value));
	}

	/**数值插值运算 */
	public static numLerp(a: number, b: number, lerp: number): number {
		if (lerp < 0) lerp = 0;
		if (lerp > 1) lerp = 1;
		return a + (b - a) * lerp;
	}
	/**三维变量插值运算 */
	public static vectorLerp(v1: mw.Vector | mw.Vector2, v2: mw.Vector | mw.Vector2, lerp: number): mw.Vector | mw.Vector2 {
		let x = 0;
		let y = 0;
		let z = null;
		x = GameUtils.numLerp(v1.x, v2.x, lerp);
		y = GameUtils.numLerp(v1.y, v2.y, lerp);
		if (v1 instanceof mw.Vector) {
			z = GameUtils.numLerp((v1 as mw.Vector).z, (v2 as mw.Vector).z, lerp);
		}
		return z == null ? new mw.Vector2(x, y) : new mw.Vector(x, y, z);
	}
	/**
	 * 判断玩家是否在移动
	 */
	public static checkIsMove(): boolean {
		let character = Player.localPlayer.character;
		let isJump = character.isJumping;
		if (character.velocity.length != 0 && !isJump && character.movementMode != mw.MovementMode.Fly) {
			return true;
		}
		return false;
	}

	/**
	 * 获取随机的小数
	 * @param min 最小值
	 * @param max 最大值
	 * @returns 随机数
	 */
	public static randomNumber(min?: number, max?: number): number {
		switch (arguments.length) {
			case 1:
				return Math.random() * min + 1;
			case 2:
				return Math.random() * (max - min + 1) + min;
			default:
				return 0;
		}
	}

	/**
	 * 生成随机的整数
	 * @param number 最大值
	 * @returns 随机值(0, number]
	 */
	public static randInt(number: number): number {
		let today = new Date();
		let seed = today.getTime();
		let nseed = (seed * 9301 + 49297) % 233280;
		let rnd = nseed / 233280.0;
		return Math.ceil(rnd * number);
	}

	/**
	 * 随机获取指定范围内的整数
	 * @param Min 起始值
	 * @param Max 最大值
	 * @returns 随机整数[min, max]
	 */
	public static getRandomRangeNum(min: number, max: number): number {
		let Range = max - min;
		let Rand = Math.random();
		return min + Math.round(Rand * Range);
	}

	/**
	 * 随机小数
	 * @param min
	 * @param max
	 * @returns
	 */
	public static getRandomRangeFloat(min: number, max: number): number {
		let Range = max - min;
		let Rand = Math.random();
		return min + Rand * Range;
	}

	/**
	 * 获取当前坐标附近范围随机坐标
	 */
	public static randomLoc(loc: mw.Vector, dis?: number): mw.Vector {
		let x = loc.x;
		let y = loc.y;
		let z = loc.z;
		let newX = this.randomNumber(x, x + dis);
		let newY = this.randomNumber(y, y + dis);
		let newLoc = new mw.Vector(newX, newY, z);
		return newLoc;
	}
	/**字符串格式化  "StringFormat("{0}给了我{1}","小明","苹果") */
	public static stringFormat(...args) {
		if (args.length == 0) return null;
		var str = args[0];
		for (var i = 1; i < args.length; i++) {
			var re = new RegExp("\\{" + (i - 1) + "\\}", "gm");
			str = str.replace(re, args[i]);
		}
		return str;
	}

	/**概率数组 */
	public static randomProb(probs: number[]): number {
		let t_curValue = 0;
		let t_maxValue = 0;
		for (let i = 0; i < probs.length; i++) {
			t_maxValue += probs[i];
		}
		let t_random = mw.MathUtil.randomInt(0, t_maxValue);
		let t_index = -1;
		for (let index = 0; index < probs.length; index++) {
			const t_value = probs[index];
			let t_allValue = t_curValue + t_value;
			if (t_random >= t_curValue && t_random <= t_allValue) {
				t_index = index;
				break;
			}
			t_curValue = t_allValue;
		}
		return t_index;
	}
	// 单位向量转角度
	public static vector2Angle(direction: mw.Vector): number {
		let t_angle = mw.Vector.angle(direction, new mw.Vector(1, 0, 0));
		if (direction.y < 0) {
			t_angle = -t_angle;
		}
		return t_angle;
	}

	/**判断该物体是否是触发器等逻辑对象 */
	public static isTrigger(obj: mw.GameObject): boolean {
		return obj instanceof mw.Trigger || obj instanceof mw.Sound || obj instanceof mw.Effect;
	}

	// 计算两个向量所在平面的法线
	public static generateNormal(vec0: mw.Vector, vec1: mw.Vector) {
		return this.cross(vec0, vec1);
	}
	public static cross(vec0: mw.Vector, vec1: mw.Vector): mw.Vector {
		return mw.Vector.cross(vec0, vec1);
	}

	static rangeInt(min: number, max: number): number {
		return Math.floor(GameUtils.rangeFloat(min, max));
	}
	static rangeFloat(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}
	/**圆形区域选取随机点
	 * @param point 圆心
	 * @param radius 半径
	 * @param isPlane 是否仅在水平面随机
	 */
	public static randomCirclePos(point: mw.Vector, radius: number, isPlane: boolean): mw.Vector {
		//随机半径
		var r = radius;// Math.random() * radius
		//随机方向 -180~180
		//如果是平面，仅改变Z轴角度，如果非平面，要随机3个角度
		if (isPlane) {
			//随机一个角度（180~-180）
			var angle = Math.random() * 360 - 180;
			var x = Math.sin(angle);
			var y = Math.cos(angle);
			//选取一个合适的高度
			var pos = new mw.Vector(point.x + x * r, point.y + y * r, point.z);
			return pos;
		} else {
			return null;
		}
	}
	/**
	 * 返回一个在min和max之间的随机浮点数,线性同余随机数
	 */
	public static randomRange(min: number, max: number): number {
		let seed = new Date().getTime();
		max = max || 1;
		min = min || 0;
		seed = (seed * 9301 + 49297) % 233280;
		var rnd = seed / 233280.0;
		return min + Math.round(rnd * (max - min));
	}

	/**是否是玩家 */
	public static isPlayerCharacter(go: mw.GameObject | mw.Player): go is mw.Character {
		if (SystemUtil.isServer()) {
			return false;
		}
		if (PlayerManagerExtesion.isCharacter(go)) {
			return go.gameObjectId && go.gameObjectId == getMyCharacterGuid();
		} else if (go instanceof mw.Player) {
			return go.playerId && go.playerId == getMyPlayerID();
		}
		return false;
	}

	/**是否是AI */
	public static isAICharacter(go: mw.GameObject) {
		return PlayerManagerExtesion.isNpc(go);
	}
	/**获取名字长度 */
	public static getNameLen(name: string): number {
		let num = 0;
		for (let i = 0; i < name.length; i++) {
			let str = name[i];
			if (/[\u4e00-\u9fa5]/.test(str)) {
				num += 1.6; //汉字
			} else {
				num++; //其他字符
			}
		}
		return num;
	}

	//获取系统语言索引
	public static systemLanguageIndex: number = null;
	public static getLanguage(id: string | number): { info: string; size: number } {
		let textEle = GameConfig.SquareLanguage.getElement(id);
		if (!textEle) {
			// console.error("getLanguage 出错 id:" + id);
			return;
		}
		let lbSize = 0;
		// switch (GameUtils.systemLanguageIndex) {
		//     case 0:
		//         lbSize = textEle.EnglishSize;
		//         break;
		//     case 1:
		//         lbSize = textEle.ChinsesSize;
		//         break;
		//     case 2:
		//         lbSize = textEle.JanpanseSize;
		//         break;
		//     case 3:
		//         lbSize = textEle.GermanSize;
		//         break;
		// }
		return { info: textEle.Value, size: lbSize };
	}
	public static getTxt(key: string | number): string {
		if (!key)
			return 'None'
		let info = GameConfig.SquareLanguage.getElement(key);
		if (!info)
			info = GameConfig.SquareLanguage[key]
		if (info && info.Value != undefined)
			return info.Value
		return 'None_' + key;
	}
	/**
	 * ui移动动画
	 * @param ui ui组件
	 * @param toLoc 目的
	 * @param duration 移动时间/s
	 * @param toLoc 目的位置
	 * @param duration 移动持续时间
	 * @param func 移动结束的事件
	 * @param funcArg1 事件参数
	 */
	public static uiTween(ui: mw.Widget, toLoc: mw.Vector2, duration: number, func?: Action, funcArg1?: any);
	/**
	 * ui移动透明度动画
	 * @param ui ui组件
	 * @param startLoc 开始位置
	 * @param toLoc 目的位置
	 * @param startRender 开始的透明度
	 * @param toRender 目的的透明度
	 * @param duration 持续时间
	 * @param func 移动结束的事件
	 * @param funcArg1 事件参数
	 */
	public static uiTween(
		ui: mw.Widget,
		startLoc: mw.Vector2,
		toLoc: mw.Vector2,
		startRender: number,
		toRender: number,
		duration: number,
		func?: Action,
		funcArg1?: any
	);

	public static uiTween(
		ui: mw.Widget,
		toLoc: mw.Vector2,
		duration: any,
		startRender: any,
		toRender?: number,
		startLoc?: any,
		func?: Action,
		funcArg1?: any
	) {
		let newPos = mw.Vector2.zero;
		if (startRender) {
			ui.renderOpacity = startRender;
			ui.position = toLoc;
			new Tween({ x: toLoc.x, y: toLoc.y, render: startRender })
				.to({ x: duration.x, y: duration.y, render: toRender }, startLoc * 1000)
				.start()
				.onUpdate(loc => {
					newPos.x = loc.x;
					newPos.y = loc.y;
					ui.position = newPos;
					ui.renderOpacity = loc.render;
				})
				.onComplete(() => {
					if (funcArg1) {
						func.call(funcArg1);
						return;
					}
					func?.call();
					console.log("UITween Over");
				});
		} else {
			new Tween(ui.position)
				.to({ x: toLoc.x, y: toLoc.y }, duration * 1000)
				.start()
				.onUpdate(loc => {
					newPos.x = loc.x;
					newPos.y = loc.y;
					ui.position = newPos;
				})
				.onComplete(() => {
					if (funcArg1) {
						func.call(funcArg1);
						return;
					}
					func?.call();
					console.log("UITween Over");
				});
		}
	}

	public static getTimeStr(time: number): string {
		let totalSeconds = time * GlobalData.timeScale; //  1s = 46.4516
		let hours = Math.floor((totalSeconds % 86400) / 3600);
		let minutes = Math.floor(((totalSeconds % 86400) % 3600) / 60);
		// let seconds = Math.floor(((totalSeconds % 86400) % 3600) % 60);
		hours += GlobalData.dayBeginShow;
		let hh: string = (hours < 10 ? "0" + hours : hours).toString();
		let mm: string = minutes < 10 ? "0" + minutes : minutes.toString();
		// let ss: string = seconds < 10 ? "0" + seconds : seconds.toString();
		// let num: string = hh + ":" + mm + ":" + ss;
		return hh + ":" + mm;
	}

	public static getMMTimeStr(time: number): string {
		let totalSeconds = time * GlobalData.timeScale; //  1s = 46.4516
		let hours = Math.floor((totalSeconds % 86400) / 3600);
		let minutes = Math.floor(((totalSeconds % 86400) % 3600) / 60);
		// let seconds = Math.floor(((totalSeconds % 86400) % 3600) % 60);
		hours += GlobalData.dayBeginShow;
		let hh: string = (hours < 10 ? "0" + hours : hours).toString();
		let mm: string = minutes < 10 ? "0" + minutes : minutes.toString();
		// let ss: string = seconds < 10 ? "0" + seconds : seconds.toString();
		// let num: string = hh + ":" + mm + ":" + ss;
		let qid = hours <= 12 ? 553 : hours <= 18 ? 554 : 555;
		let mStr = GameConfig.SquareLanguage.getElement(qid).Value;
		return mStr + " " + hh + ":" + mm;
	}

	public static resetPlayerCamera() {
		if (mw.SystemUtil.isServer()) {
			return;
		}

		let cs = Camera.currentCamera;
		cs.preset = (mw.CameraPreset.ThirdPerson);
		cs.springArm.length = 300;
		// cs.springArm.collisionEnabled = false;
	}

	public static inDistance(a: mw.Vector, b: mw.Vector, distance: number): boolean {
		return mw.Vector.squaredDistance(a, b) <= Math.pow(distance, 2);
	}

	/**下载资源 */
	public static async downAsset(guid: string) {
		if (StringUtil.isEmpty(guid)) return
		let arr = guid.split(",");
		for (let key in arr) {
			if (!StringUtil.isEmpty(arr[key]) && !mw.AssetUtil.assetLoaded(arr[key])) await mw.AssetUtil.asyncDownloadAsset(arr[key]);
		}
	}

	/**
	 * 随机洗牌
	 * @param arr
	 * @param start 开始的位置
	 * @param end 结束的位置
	 */
	public static shuffleCards<T>(arr: T[], start: number = 0, end: number = -1) {
		if (end == -1) {
			end = arr.length - 1;
		}

		let temp: T = null;
		let randNum: number = null;
		for (let i = start; i < end; i++) {
			randNum = MathUtil.randomInt(i, arr.length);

			temp = arr[randNum];
			arr[randNum] = arr[i];
			arr[i] = temp;
		}
	}

	public static arrCopy<T>(arr: Array<T>) {
		let copyarr = [];
		for (let index = 0; index < arr.length; index++) {
			const element = arr[index];
			copyarr.push(element);
		}
		return copyarr;
	}

	public static getUIPostion(ui: mw.Widget) {
		let pos = new mw.Vector2(0, 0);
		pos.x = ui.position.x;
		pos.y = ui.position.y;
		let parent: mw.Widget = ui.parent;
		while (parent) {
			pos = pos.add(parent.position);
			parent = parent.parent;
		}
		return pos;
	}
	/**
	 * 异步使用资源
	 * @param assetId 资源id
	 * @param fun 加载好资源后调用
	 * @param thisArgs {@link fun}的this指向
	 * @param args {@link fun}的参数
	 * @returns
	 */
	public static asyncUseAsset<T extends (...args: unknown[]) => any>(assetId: string, fun: T, thisArgs: unknown, ...args: Parameters<T>) {
		return new Promise<ReturnType<T>>((resolve: (value: ReturnType<T>) => void) => {
			const a = AssetUtil.assetLoaded(assetId);
			if (a) {
				resolve(fun.call(thisArgs, ...args));
			} else {
				AssetUtil.asyncDownloadAsset(assetId).then((s: boolean) => {
					resolve(fun.call(thisArgs, ...args));
				});
			}
		});
	}


	public static async setIconByAsset(assetID: string, img: mw.Image) {
		if (StringUtil.isEmpty(assetID))
			return
		await mw.assetIDChangeIconUrlRequest([assetID]);
		const res = mw.getAssetIconDataByAssetID(assetID);
		img.setImageByAssetIconData(res);
	}
	public static stopSoundOrBgm(id: number, target: string | mw.Vector | mw.GameObject = null) {
		let info = GameConfig.Music.getElement(id);
		if (info) {
			if (info.IsBGM == 1) {
				mw.SoundService.stopBGM()
			} else {
				if (info.MusicRange && info.MusicRange.length == 2) {
				} else {
					// mw.SoundService.stop3DSound()
				}
			}
		}
	}

	/**播放音效bgm */
	public static playSoundOrBgm(id: number, target: string | mw.Vector | mw.GameObject = null) {
		let info = GameConfig.Music.getElement(id);
		if (info) {
			if (info.IsBGM == 1) {
				//是bgm
				return mw.SoundService
					.playBGM(info.MusicGUID, info.Volume);
			} else {
				mw.SoundService
					.stopSound(info.MusicGUID)
				if (info.MusicRange && info.MusicRange.length == 2) {
					//3d音效
					let param = {
						innerRadius: info.MusicRange[0],
						falloffDistance: info.MusicRange[1]
					}
					return mw.SoundService
						.play3DSound(info.MusicGUID,
							target, info.loopNum, info.Volume, param);
				} else {
					//2d音效
					return mw.SoundService
						.playSound(info.MusicGUID, info.loopNum, info.Volume);
				}
			}


		}
		return null;
	}
}






/**
 * 单例装饰器
 * @param newFun 创建的方法，如果没有则调用new
 * @param args {@link newFun}的参数或构造函数的参数
 * @returns
 */
export function single<T>(newFun?: (...args: any[]) => T, ...args: any[]) {
	return function (constructor: { new(...args: any[]): T; instance: T }) {
		Object.defineProperty(constructor, "instance", {
			get() {
				if (newFun) {
					constructor["_instance"] = newFun();
				} else {
					constructor["_instance"] = new constructor();
				}
				Object.defineProperty(constructor, "instance", {
					get() {
						return constructor["_instance"];
					},
				});
				return constructor["_instance"];
			},
		});
	};
}
