import { SpawnManager, SpawnInfo, } from '../../../Modified027Editor/ModifiedSpawn';
/*
* @Author: zhaolei
* @Date: 2022-08-04 11:39:17
* @LastEditors: xianjie.xia
* @Description: file content
*/


/**
 * 根据GUID返回全局唯一POOL
 */
export namespace RunTimePool {
	const pools: Map<string, IPool<any>> = new Map();
	const movers: mw.IntegratedMover[] = [];
	export function getPool<T extends mw.GameObject>(guid: string): Pool<T> {
		let pool = pools.get(guid);
		if (!pool) {
			pool = new Pool(guid);
			pools.set(guid, pool);
		}
		return pool as Pool<T>;
	}
	export function getMover() {
		for (let m of movers) {
			if (!m.enable)
				return m;
		}
		let m = SpawnManager.spawn<mw.IntegratedMover>({ guid: 'PhysicsSports' }) as mw.IntegratedMover;
		m.enable = false;
		movers.push(m);
		return m;
	}
	// export function getCreaterPool<T>(name: string, creater: (...param) => T, spawn: (object: T) => void, despawn: (object: T) => void): IPool<T> {
	// 	let pool = pools.get(name);
	// 	if (!pool) {
	// 		pool = new CreaterPool(creater, spawn, despawn);
	// 		pools.set(name, pool);
	// 	}
	// 	return pool;
	// }
	// export function getClonePool<T extends mw.GameObject>(guid: string): ClonePool<T> {
	// 	let pool = pools.get(guid);
	// 	if (!pool) {
	// 		pool = new ClonePool(guid);
	// 		pools.set(guid, pool);
	// 	}
	// 	return pool as ClonePool<T>;
	// }
	export function clear() {
		for (let k in pools) {
			let v = pools.get(k);
			v.clear();
		}
		pools.clear();
	}
}
export interface IPool<T> {
	spawn(...param): IPoolObject<T>;
	despawn(obj: IPoolObject<T>);
	clear();
}

interface IMWPool<T extends mw.GameObject> extends IPool<T> {
	despawn(obj: PObject<T>);
	spawn(type?: number);
}
class Pool<T extends mw.GameObject> implements IMWPool<T> {
	/**
	 * 物品GUID
	 */
	private guid: string;

	private cache: PObject<T>[];

	constructor(guid: string) {
		this.guid = guid;
		this.cache = [];
	}
	/**
	 * 从对象池获取一个物体
	 * @returns 
	 */
	public spawn(type = 0): PObject<T> {
		if (this.cache.length > 0) {
			return this.cache.shift().show();
		}
		const obj = SpawnManager.spawn({ guid: this.guid }) as T;
		return new PObject(this, obj, type);
	}
	/**
	 * 归还一个物体到对象池
	 * @returns 
	 */
	public despawn(obj: PObject<T>) {
		this.cache.push(obj);
		//console.log(this.cache.length);
	}
	public clear() {
		for (let i = 0; i < this.cache.length; i++) {
			let obj = this.cache[i];
			if (obj)
				obj.clear();
		}
		this.cache = [];
	}
}
// class CreaterPool<T> implements IPool<T>  {

// 	private cache: PObject2<T>[];
// 	constructor(private _creater: (...param) => T, private _spawn: (object: T) => void, private _despawn: (object: T) => void) {
// 		this.cache = [];
// 	}
// 	/**
// 	 * 从对象池获取一个物体
// 	 * @returns 
// 	 */
// 	public spawn(...param): PObject2<T> {
// 		if (this.cache.length > 0) {
// 			const pObj = this.cache.shift();
// 			this._spawn(pObj.obj);
// 			return pObj["show"]();
// 		}
// 		const obj = this._creater(...param);
// 		return new PObject2(this, obj);
// 	}
// 	/**
// 	 * 归还一个物体到对象池
// 	 * @returns 
// 	 */
// 	public despawn(obj: PObject2<T>) {
// 		this._despawn(obj.obj);
// 		this.cache.push(obj);
// 	}
// 	public clear() {
// 		for (let i = 0; i < this.cache.length; i++) {
// 			let obj = this.cache[i].obj;
// 			if (obj)
// 				obj = null;
// 		}
// 		this.cache = [];
// 	}
// }
// class ClonePool<T extends mw.GameObject> implements IMWPool<T>  {
// 	/**
// 	 * 物品GUID
// 	 */
// 	private guid: string;

// 	private cache: PObject<T>[];
// 	constructor(guid: string) {
// 		this.guid = guid;
// 		this.cache = [];
// 	}
// 	/**
// 	 * 从对象池获取一个物体
// 	 * @returns 
// 	 */
// 	public spawn(): PObject<T> {
// 		if (this.cache.length > 0) {
// 			return this.cache.shift()["show"]();
// 		}
// 		const obj = GameObject.findGameObjectById(this.guid).clone() as T;
// 		return new PObject(this, obj);
// 	}
// 	/**
// 	 * 归还一个物体到对象池
// 	 * @returns 
// 	 */
// 	public despawn(obj: PObject<T>) {
// 		this.cache.push(obj);
// 	}
// 	public clear() {
// 		for (let i = 0; i < this.cache.length; i++) {
// 			let obj = this.cache[i].obj;
// 			if (obj)
// 				obj.destroy();
// 		}
// 		this.cache = [];
// 	}
// }
export interface IPoolObject<T> {
	obj: T;
	despawn(delay?);
	isCreated(): boolean;
	clear();
	show();
}

class PObject<T extends mw.GameObject> implements IPoolObject<T>  {
	private _isCreated: boolean;
	public physicsObj: any;
	/**
	 * 是否是创建的
	 */
	public isCreated() {
		return this._isCreated;
	}
	/**
	 * 回收，延迟
	 */
	despawn(hide = 0, stop = 0) {
		if (stop > 0 && hide > stop)
			setTimeout(() => {
				if (this.physicsObj) {
					this.physicsObj.linearDelayStartTime = 0
					this.physicsObj.enable = false;
					// this.physicsObj.moverReset()
					// this.physicsObj.parent = null
				}
			}, stop * 1000)
		if (hide > 0) {
			setTimeout(() => {
				if (!this._isCreated)
					return;
				this.hide();
				this.pool.despawn(this);
			}, hide * 1000);
		}
		else {
			this.hide();
			this.pool.despawn(this);
		}
	}
	clear() {
		this._isCreated = false;
		if (this.physicsObj)
			this.physicsObj.destroy();
		if (this.obj)
			this.obj.destroy();
		if (this.pool)
			this.pool = null;
	}
	/**
	 * 显示
	 * @returns 
	 */
	public show(): this {
		//this._isCreated = false;
		this.obj.setVisibility(mw.PropertyStatus.On, true);
		return this;
	}
	/**
	 * 隐藏
	 * @returns 
	 */
	protected hide(): this {
		if (this.physicsObj) {
			this.physicsObj.linearDelayStartTime = 0
			this.physicsObj.enable = false;
			this.physicsObj.moverReset()
		}
		if (this.obj instanceof mw.Effect) {
			let ef = this.obj as mw.Effect;
			ef?.stop();
		}
		this.obj.setVisibility(mw.PropertyStatus.Off, true);
		return this;
	}
	constructor(private pool: IMWPool<T>, public obj: T, type) {
		if (type == 1) {
			this.physicsObj = SpawnManager.spawn<mw.IntegratedMover>({ guid: 'PhysicsSports' }) as mw.IntegratedMover;
			this.physicsObj.enable = false;
			this.physicsObj.parent = obj
		}
		this._isCreated = true;
	}

}
