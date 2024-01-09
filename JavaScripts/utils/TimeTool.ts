export namespace TimeTool {
	export type TimeHandler = (...args: any[]) => void;
	export type FrameHandler = (dt: number, ...args: any[]) => void;
	export type TimeObject<T extends TimeHandler> = {
		id: number;
		/**
		 * 执行函数
		 * @param args 函数参数
		 * @returns
		 */
		run: (...args: Parameters<T>) => void;
		/**重置,下次调用是重新走冷却 */
		reset: () => void;
	};
	export type ReturnTimeObject<T extends TimeHandler> = Omit<TimeObject<T>, "id">;

	/**
	 * 节流: {@link waitTime} 秒内只运行一次 {@link fun} ，若在 {@link waitTime} 秒内重复触发，只有一次生效
	 * @param cell 执行域
	 * @param fun 节流函数
	 * @param waitTime 等待帧
	 * @returns 一个包含运行和重置的对象
	 */
	export function throttle<T extends TimeHandler>(cell: unknown, fun: T, waitTime: number): (...args: Parameters<T>) => void {
		let count = 0;
		return (...args: Parameters<T>) => {
			count++;
			if (count < waitTime) {
				return;
			}
			fun.call(cell, ...args);
			return;
		};
	}

	/**
	 * 基于settimeout
	 */
	export class Global {
		private constructor() {}

		/**
		 * 节流: {@link waitTime} 秒内只运行一次 {@link fun} ，若在 {@link waitTime} 秒内重复触发，只有一次生效
		 * @param cell 执行域
		 * @param fun 节流函数
		 * @param waitTime 等待时间,单位(毫秒)
		 * @param loadingBefore 是否在立即调用 {@link fun} ,为true时会立即调用
		 * @param params 函数 {@link fun} 的参数
		 * @returns 一个包含运行和重置的对象
		 */
		public static throttle<F extends TimeHandler>(cell: unknown, fun: F, waitTime: number, loadingBefore: boolean = true): ReturnTimeObject<F> {
			const timeObject: TimeObject<F> = {
				id: 0,
				run: (...params: Parameters<F>) => {
					if (timeObject.id) {
						return;
					}
					loadingBefore && fun.call(cell, ...params);
					timeObject.id = setTimeout(() => {
						!loadingBefore && fun.call(cell, ...params);
						timeObject.id = null;
					}, waitTime);
				},
				reset: () => {
					if (timeObject.id) {
						clearTimeout(timeObject.id);
						timeObject.id = null;
					}
				},
			};
			return timeObject;
		}

		/**
		 * 防抖：{@link waitTime} 毫秒后在执行该事件 {@link fun} ，若在 {@link waitTime} 毫秒内被重复触发，则重新计时
		 * @param cell 执行域
		 * @param fun 防抖函数
		 * @param waitTime 等待时间,单位(毫秒)
		 * @param params 函数 {@link fun} 的参数
		 * @returns 一个包含运行和重置的对象
		 */
		public static debounce<T extends TimeHandler>(cell: unknown, fun: T, waitTime: number): ReturnTimeObject<T> {
			const timeObject: TimeObject<T> = {
				id: 0,
				run: (...args: Parameters<T>) => {
					timeObject.reset();
					timeObject.id = setTimeout(() => {
						fun.call(cell, ...args);
						timeObject.id = null;
					}, waitTime);
				},
				reset: () => {
					if (timeObject.id) {
						clearTimeout(timeObject.id);
						timeObject.id = null;
					}
				},
			};
			return timeObject;
		}
	}
	/**
	 * 自定义的,在需要的地方实例化就行，并且每帧调用{@link update(dt)}
	 * ```
	 * //实例化
	 * const a = new TimeTool.Instantiable()
	 * ```
	 * ```
	 * //调用更新函数
	 * a.update(dt)
	 * ```
	 */
	export class Instantiable {
		/**毫秒 */
		private readonly MS = 1000;

		private readonly _timeout: Map<number, { handler: TimeHandler; thisArgs: unknown; time: number; args: any[] }> = new Map();

		private readonly _interval: Map<number, { handler: TimeHandler; thisArgs: unknown; dt: number; time: number; args: any[] }> = new Map();

		private readonly _delayFrame: Map<number, { handler: FrameHandler; thisArgs: unknown; count: number; args: any[] }> = new Map();

		private readonly _frame: Map<number, { handler: FrameHandler; thisArgs: unknown; count: number; frameNum: number; args: any[] }> = new Map();

		private _timeoutId: number = 0;

		private _intervalId: number = 0;

		private _delayFrameId: number = 0;

		private _frameId: number = 0;

		public update(dt: number) {
			for (const [key, value] of this._timeout) {
				value.time -= dt;
				if (value.time < 0) {
					value.handler.call(value.thisArgs, ...value.args);
					this._timeout.delete(key);
				}
			}
			for (const [key, value] of this._interval) {
				value.dt += dt;
				if (value.dt >= value.time) {
					value.dt = 0;
					value.handler.call(value.thisArgs, ...value.args);
				}
			}
			for (const [key, value] of this._frame) {
				value.count += 1;
				if (value.count > value.frameNum) {
					value.count = 0;
					value.handler.call(value.thisArgs, dt, ...value.args);
				}
			}
			for (const [key, value] of this._delayFrame) {
				value.count--;
				if (value.count <= 0) {
					value.handler.call(value.thisArgs, dt, ...value.args);
					this._delayFrame.delete(key);
				}
			}
		}

		public destroy() {
			this._delayFrame.clear();
			this._frame.clear();
			this._interval.clear();
			this._timeout.clear();
		}
		/**
		 * 节流: {@link waitTime} 毫秒内只运行一次 {@link fun} ，若在 {@link waitTime} 毫秒内重复触发，只有一次生效
		 * @param cellThis 执行域
		 * @param fun 节流函数
		 * @param waitTime 等待时间,单位(毫秒)
		 * @param loadingBefore 是否立即调用 {@link fun} ,为true时立即调用,默认为true
		 * @param params 函数 {@link fun} 的参数
		 * @returns 一个包含运行和重置的对象
		 */
		public throttle<T extends TimeHandler>(cellThis: unknown, fun: T, waitTime: number, loadingBefore: boolean = true): ReturnTimeObject<T> {
			const timeObject: TimeObject<T> = {
				id: 0,
				run: (...args: Parameters<T>) => {
					if (timeObject.id) {
						return;
					}
					loadingBefore && fun.call(cellThis, ...args);
					timeObject.id = this.setTimeout(
						this,
						() => {
							!loadingBefore && fun.call(cellThis, ...args);
							timeObject.id = null;
						},
						waitTime
					);
				},
				reset: () => {
					if (timeObject.id) {
						this.clearTimeout(timeObject.id);
						timeObject.id = null;
					}
				},
			};
			return timeObject;
		}

		/**
		 * 防抖：{@link waitTime} 毫秒后在执行该事件 {@link fun} ，若在 {@link waitTime} 毫秒内被重复触发，则重新计时
		 * @param cell 执行域
		 * @param fun 防抖函数
		 * @param waitTime 等待时间,单位(毫秒)
		 * @param params 函数 {@link fun} 的参数
		 * @returns 一个包含运行和重置的对象
		 */
		public debounce<T extends TimeHandler>(cellThis: unknown, fun: T, waitTime: number): ReturnTimeObject<T> {
			const timeObject: TimeObject<T> = {
				id: 0,
				run: (...args: Parameters<T>) => {
					timeObject.reset();
					timeObject.id = this.setTimeout(
						this,
						() => {
							fun.call(cellThis, ...args);
							timeObject.id = null;
						},
						waitTime
					);
				},
				reset: () => {
					if (timeObject.id) {
						this.clearTimeout(timeObject.id);
						timeObject.id = null;
					}
				},
			};
			return timeObject;
		}

		/**
		 * 节流: {@link frames} 帧内只运行一次 {@link fun} ，若在 {@link frames} 帧内重复触发，只有一次生效
		 * @param cellThis 执行域
		 * @param fun 节流函数
		 * @param frames 等待多久,单位帧
		 * @param loadingBefore 是否在冷却前调用 {@link fun} ,为true时在冷却前调用
		 * @param params 函数 {@link fun} 的参数
		 * @returns 一个包含运行和重置的对象
		 */
		public throttleByFrame<T extends TimeHandler>(cellThis: unknown, fun: T, frames: number, loadingBefore: boolean = true): ReturnTimeObject<T> {
			const timeObject: TimeObject<T> = {
				id: 0,
				run: (...args: Parameters<T>) => {
					if (timeObject.id) {
						return;
					}
					loadingBefore && fun.call(cellThis, ...args);
					timeObject.id = this.setDelayFrame(
						this,
						() => {
							!loadingBefore && fun.call(cellThis, ...args);
							timeObject.id = null;
						},
						frames
					);
				},
				reset: () => {
					if (timeObject.id) {
						this.clearDelayFrame(timeObject.id);
						timeObject.id = 0;
					}
				},
			};
			return timeObject;
		}

		/**
		 * 防抖：{@link frames} 帧后在执行该事件 {@link fun} ，若在 {@link frames} 帧内被重复触发，则重新计时
		 * @param cell 执行域
		 * @param fun 防抖函数
		 * @param frames 等待时间,单位帧
		 * @param params 函数 {@link fun} 的参数
		 * @returns 一个包含运行和重置的对象
		 */
		public debounceByFrame<T extends TimeHandler>(cell: unknown, fun: T, frames: number): ReturnTimeObject<T> {
			const timeObject: TimeObject<T> = {
				id: 0,
				run: (...args: Parameters<T>) => {
					timeObject.reset();
					timeObject.id = this.setDelayFrame(
						this,
						() => {
							fun.call(cell, ...args);
							timeObject.id = null;
						},
						frames
					);
				},
				reset: () => {
					if (timeObject.id) {
						this.clearDelayFrame(timeObject.id);
						timeObject.id = null;
					}
				},
			};
			return timeObject;
		}
		/**
		 * 延迟{@link interval}毫秒秒执行
		 * @param handler 延迟执行的函数
		 * @param timeout 延迟时间(毫秒)
		 * @param args 延迟执行的函数的参数
		 * @returns
		 */
		public setTimeout(thisArgs: unknown, handler: TimeHandler, timeout?: number, ...args: any[]) {
			const id = ++this._timeoutId;
			this._timeout.set(id, { handler: handler, thisArgs: thisArgs, time: timeout ? timeout / this.MS : 0, args: args });
			return id;
		}

		public clearTimeout(id: number) {
			if (this._timeout.has(id)) {
				this._timeout.delete(id);
			}
		}
		/**
		 * 间隔{@link interval}毫秒重复执行
		 * @param handler 间隔重复执行的函数
		 * @param interval 间隔时间(毫秒)
		 * @param args 间隔重复执行的函数的参数
		 * @returns
		 */
		public setInterval(thisArg: unknown, handler: TimeHandler, interval?: number, ...args: any[]) {
			const id = ++this._intervalId;
			this._interval.set(id, { handler: handler, thisArgs: thisArg, dt: 0, time: interval ? interval / this.MS : 0, args: args });
			return id;
		}

		public clearInterval(id: number) {
			if (this._interval.has(id)) {
				this._interval.delete(id);
			}
		}

		/**
		 * 设置每隔{@link frameNum}帧执行一次
		 * @param thisArg
		 * @param handler 要延迟执行的函数
		 * @param frameNum 帧数
		 * @param args 函数传入的参数
		 * @returns
		 */
		public setFrame(thisArg: unknown, handler: FrameHandler, frameNum: number, ...args: any[]) {
			const id = ++this._frameId;
			this._frame.set(id, { handler: handler, thisArgs: thisArg, count: 0, frameNum: frameNum, args: args });
			return id;
		}

		public clearFrame(id: number) {
			if (this._frame.has(id)) {
				this._frame.delete(id);
			}
		}

		/**
		 * 延迟{@link frameNum}帧执行
		 * @param thisArg
		 * @param handler 要延迟执行的函数
		 * @param frameNum 延迟的帧数
		 * @param args 函数传入的参数
		 * @returns
		 */
		public setDelayFrame(thisArg: unknown, handler: FrameHandler, frameNum: number, ...args: any[]) {
			const id = ++this._delayFrameId;
			this._delayFrame.set(id, { handler: handler, thisArgs: thisArg, count: frameNum, args: args });
			return id;
		}

		public clearDelayFrame(id: number) {
			if (this._delayFrame.has(id)) {
				this._delayFrame.delete(id);
			}
		}
	}

	/**
	 * 全局的,需要在gameStart每帧调用{@link instantiable.update(dt)}
	 * ```
	 * onUpdate(dt:number){
	 *  TimeTool.instantiable.update(dt)
	 * }
	 * ```
	 */
	export const instantiable = new Instantiable();
}
