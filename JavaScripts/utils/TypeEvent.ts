/**
 * @Author       : peiwen.chen
 * @Date         : 2023-03-24 15:32:51
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-03-24 15:32:57
 * @FilePath     : \mollywoodschool\JavaScripts\modules\fighting\script\base\mw.ts
 * @Description  : 修改描述
 */
type Fn<T extends any[]> = (...args: T) => any;
type FnArgs<T> = T extends Fn<infer A> ? A : any;
type FnReturn<T> = T extends (...args: any[]) => infer A ? A : never;
/**
 * 一个类中的键
 */
export type NameAlias<T> = keyof T;
/**
 * 一个类里面的值的类型
 * T：类
 * N：值
 */
export type InferValue<T, N extends NameAlias<T>> = T[N];
/**
 * 一个类里的方法参数的类型
 * T：类
 * N：方法名
 */
export type InferFnArgs<T extends object, N extends NameAlias<T>> = FnArgs<T[N]>;

/**
 * 类中函数的返回值类型
 * T：类
 * N：方法名
 */
export type InferFnReturn<T extends object, N extends NameAlias<T>> = FnReturn<T[N]>;
/**
 * 一个类里面的函数类型
 * T：类
 * N：方法名
 */
export type InferFun<T extends object, N extends NameAlias<T>> = (...args: FnArgs<T[N]>) => FnReturn<T[N]>;
type AnyFunction = (...args: any[]) => any;
class Handler<T extends AnyFunction> {
	/** 执行域(this)。*/
	caller: unknown | null;

	/** 处理方法。*/
	method: T;


	/** 表示是否只执行一次。如果为true，回调后执行recover()进行回收，回收后会被再利用，默认为false 。*/
	once = false;
	/**
	 * 根据指定的属性值，创建一个 <code>_THandler</code> 类的实例。
	 * @param	caller 执行域。
	 * @param	method 处理函数。
	 * @param	args 函数参数。
	 * @param	once 是否只执行一次。
	 */
	constructor(caller: unknown | null = null, method: T, once = false) {
		this.setTo(caller, method, once);
	}
	static create<T extends AnyFunction>(thisArg: unknown, callBack: T, once: boolean = false): Handler<T> {
		return new Handler(thisArg, callBack,  once);
	}
	/**
	 * 设置此对象的指定属性值。
	 * @param	caller 执行域(this)。
	 * @param	method 回调方法。
	 * @param	args 携带的参数。
	 * @param	once 是否只执行一次，如果为true，执行后执行recover()进行回收。
	 * @return  返回 handler 本身。
	 */
	setTo(caller: any, method: T, once = false): Handler<T> {
		this.caller = caller;
		this.method = method;
		this.once = once;
		return this;
	}
	/*
	 * 执行处理器。
	 */
	run(...args): any {
		if (this.method === null) return null;
		const result: any = this.method.call(this.caller, ...args);
		return result;
	}
  clear() {
		this.caller = null;
		this.method = null;
		return this;
  }
}

export class DelegateAgent<T extends AnyFunction> {
	private handlers: Handler<T>[] = [];

	/**
	 *
	 * @param thisArg
	 * @param callBack
	 * @param args 默认参数 会随着回调函数传递回去
	 */
	add(thisArg: unknown, callBack: T) {
		this.handlers.push(Handler.create(thisArg, callBack, false));
	}

	broadCast(...args: FnArgs<T>) {
		for (const handler of this.handlers) {
			handler.run(...args);
		}
	}

	clear() {
		for (const handler of this.handlers) {
			handler.clear();
		}
		this.handlers.length = 0;
	}

	remove(thisArg: unknown, call: T) {
		const index = this.handlers.findIndex(v => {
			if (v.method === call && v.caller === thisArg) {
				return true;
			}
			return false;
		});
		if (index === -1) {
			return;
		}
		const handler = this.handlers[index];
		handler.clear();
		this.handlers.splice(index, 1);
	}
}

// entrust, agent
export class ActAsAgent<T extends object, E extends NameAlias<T>> {
	private readonly _map: Map<E, Map<unknown, Set<InferFun<T, E>>>> = new Map();

	public addListen<N extends E>(name: N, cell: unknown, fun: InferFun<T, N>) {
		const map = this._map;
		if (!map.has(name)) {
			map.set(name, new Map());
		}
		const cellMap = map.get(name);
		if (!cellMap.has(cell)) {
			cellMap.set(cell, new Set());
		}
		cellMap.get(cell).add(fun);
	}

	public unListen<N extends E>(name: N, cell: unknown, fun: InferFun<T, N>) {
		const map = this._map;
		if (!map.has(name)) {
			return;
		}
		const cellMap = map.get(name);
		if (!cellMap.has(cell)) {
			return;
		}
		const funSet = cellMap.get(cell);
		if (!cellMap.has(cell)) {
			return;
		}
		funSet.delete(fun);
		if (funSet.size === 0) {
			cellMap.delete(cell);
		}
		if (cellMap.size === 0) {
			map.delete(name);
		}
	}

	public sendMessage<N extends E>(name: N, ...args: InferFnArgs<T, N>) {
		const map = this._map;
		if (!map.has(name)) {
			return;
		}
		const cellMap = map.get(name);
		for (const [cell, funSet] of cellMap) {
			for (const fun of funSet) {
				fun.call(cell, ...args);
			}
		}
	}

	public clearAgentOfCaller(caller: unknown) {
		const map = this._map;
		for (const [name, funMap] of map) {
			if (funMap.has(caller)) {
				funMap.get(caller).clear();
				funMap.delete(caller);
			}
		}
	}

	/**
	 * clear
	 */
	public clearAgent() {
		const map = this._map;
		for (const [name, funMap] of map) {
			for (const [cell, funSet] of funMap) {
				funSet.clear();
			}
			funMap.clear();
		}
		map.clear();
	}
}
// export interface object {
// 	// [key: string]: (...args: unknown[]) => any;
// }
/**
 * 事件代理
 */
export class EventAgent {
	private static readonly _map: Map<string, ActAsAgent<any, any>> = new Map();

	private constructor() {}

	/**
	 * 获取一个事件
	 * @param cls 约束事件的类
	 * @returns
	 */
	public static getEvent<T extends object>(cls: mw.TypeName<T>) {
		if (!this._map.has(cls.name)) {
			this._map.set(cls.name, new ActAsAgent<T, NameAlias<T>>());
		}
		return this._map.get(cls.name) as ActAsAgent<T, NameAlias<T>>;
	}

	public static removeEvent<T extends object>(cls: mw.TypeName<T>) {
		if (!this._map.has(cls.name)) {
			return;
		}
		const event = this._map.get(cls.name) as ActAsAgent<T, NameAlias<T>>;
		event.clearAgent();
		// this._map.delete(cls.name);
	}
}
export class EventAgentDispatcher {
	private readonly _agentMap: Map<string, ActAsAgent<any, any>> = new Map();

	/**
	 * 获取一个事件
	 * @param cls 约束事件的类
	 * @returns
	 */
	public getEvent<T extends object>(cls: mw.TypeName<T>) {
		if (!this._agentMap.has(cls.name)) {
			this._agentMap.set(cls.name, new ActAsAgent<T, NameAlias<T>>());
		}
		return this._agentMap.get(cls.name) as ActAsAgent<T, NameAlias<T>>;
	}

	public removeEvent<T extends object>(cls: mw.TypeName<T>) {
		if (!this._agentMap.has(cls.name)) {
			return;
		}
		const event = this._agentMap.get(cls.name) as ActAsAgent<T, NameAlias<T>>;
		event.clearAgent();
		this._agentMap.delete(cls.name);
	}
	public add<T extends object, N extends NameAlias<T>>(cls: mw.TypeName<T>, name: N, cell: T, fun: InferFun<T, N>) {
		const map = this.getEvent(cls);
		const cellMap = map.addListen(name, cell, fun);
	}

	public remove<T extends object, N extends NameAlias<T>>(cls: mw.TypeName<T>, name: N, cell: T, fun: InferFun<T, N>) {
		const map = this.getEvent(cls);
		map.unListen(name, cell, fun);
	}

	/**
	 * clear
	 */
	public clear() {
		const map = this._agentMap;
		for (const [name, agent] of map) {
			agent.clearAgent();
		}
		map.clear();
	}

	public execute<T extends object, N extends NameAlias<T>>(cls: mw.TypeName<T>, name: N, ...args: InferFnArgs<T, N>) {
		const map = this.getEvent(cls);
		map.sendMessage(name, ...args);
	}
}
