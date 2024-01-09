/**
 * 输出Log
 * @param content 内容
 */
const log = console.log;
const warn = console.warn;
const error = console.error;
console.log = function (...content: any[]) {
	LogManager.instance.log(...content);
};
console.warn = function (...content: any[]) {
	LogManager.instance.logWarning(...content);
};
console.error = function (...content: any[]) {
	LogManager.instance.logError(...content);
};
global.oTrace = function oTrace(...content: any[]) {
	LogManager.instance.log(...content);
};
// export function oTrace(...content: any[]) {
// 	LogManager.instance.log(...content);
// };
/**
 * 输出Warning
 * @param content 内容
 */
global.oTraceWarning = function oTraceWarning(...content: any[]) {
	LogManager.instance.logWarning(...content);
};
/**
 * 输出Error
 * @param content 内容
 */
global.oTraceError = function oTraceError(...content: any[]) {
	LogManager.instance.logError(...content);
};
//#region Debug
export class LogManager {
	private static _instance: LogManager;
	/**net通信是否打印 */
	public showNet: boolean = true;
	/**数据同步是否打印 */
	public showSyncData: boolean = true;
	/**数据Action代理同步是否打印 */
	public showSyncDataAction: boolean = true;
	private logLevel: number = 3;
	private _firstWithEnable: boolean = true;
	private cs: string;

	public static get instance(): LogManager {
		if (this._instance == null) {
			this._instance = new LogManager();
		}
		return this._instance;
	}
	private constructor() {
		if (SystemUtil.isServer() && SystemUtil.isClient()) {
			this.cs = "";
		} else {
			this.cs = SystemUtil.isServer() ? "★S" : "☆C";
		}
	}

	/** 设置所有的打印是否带[ _____OdinLog_____ ]前缀*/
	public set firstWithEnable(value: boolean) {
		this._firstWithEnable = value;
	}
	/**
	 * 设置输出的等级
	 * @param value 等级值(0-不打印 1-Error 2-Error&Warning 3-Error&Warning&&Log)
	 */
	public setLogLevel(value: number) {
		this.logLevel = value;
	}
	//===============基础===============
	/**
	 * 输出Log
	 * @param content 内容
	 */
	public log(...content: any[]) {
		this.logWithTag(null, ...content);
	}
	/**
	 * 输出Warning
	 * @param content 内容
	 */
	public logWarning(...content: any[]) {
		this.logWarningWithTag(null, ...content);
	}
	/**
	 * 输出Error
	 * @param content 内容
	 */
	public logError(...content: any[]) {
		this.logErrorWithTag(null, ...content);
	}
	//=============WithTag==============
	/**
	 * 输出带tag的Log，便于搜索
	 * @param tag tag
	 * @param content 内容
	 */
	public logWithTag(tag: string, ...content: any[]) {
		if (this.logLevel < 3) return;
		log(`${this.getFirstWith(tag)}${content}`);
	}
	/**
	 * 输出带tag的Warning，便于搜索
	 * @param tag tag
	 * @param content 内容
	 */
	public logWarningWithTag(tag: string, ...content: any[]) {
		if (this.logLevel < 2) return;
		warn(`${this.getFirstWith(tag)}${content}`);
	}
	/**
	 * 输出带tag的Error，便于搜索
	 * @param tag tag
	 * @param content 内容
	 */
	public logErrorWithTag(tag: string, ...content: any[]) {
		if (this.logLevel < 1) return;
		error(`${this.getFirstWith(tag)}${content}`);
	}
	//===================================
	//获取前缀
	private getFirstWith(tag: string): string {
		if (this._firstWithEnable) {
			if (tag != null) {
				return `[ _____OdinLog${this.cs}][${tag}_____ ]       `;
			} else {
				return `[ _____OdinLog${this.cs}_____ ]       `;
			}
		} else {
			if (tag != null) {
				return `[${tag}]`;
			} else {
				return "";
			}
		}
	}
}
