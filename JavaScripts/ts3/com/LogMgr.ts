/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-24 14:39
 * @LastEditTime : 2023-06-11 11:24
 * @description  : 日志控制
 */

export class LogMgr {

    /**
     * 游戏功能內的日志
     * <0:关闭所有日志
     * 0:所有
     * 1:core的调试日志
     * 2:游戏日志
     * 4:线上调试日志info
     * 8:游戏警告
     * 16:游戏错误
     * 32:trace输出
     * 发版时应该是28=4+8+16
     */
    public debugLv = 0;
    private static _inst: LogMgr;
    public static get Inst() {
        if (!this._inst)
            this._inst = new LogMgr();
        return this._inst;
    }
    private bit(num) {
        if (this.debugLv < 0)
            return false;
        else if (this.debugLv == 0)
            return true;
        return (this.debugLv & num) == num;
    }
    public coreLog(...args) {
        if (this.bit(1))
            console.log('--TS3Core--', ...args);
    }
    public log(...args) {
        if (this.bit(2))
            console.log('--TS3Log--', ...args);
    }
    public info(...args) {
        if (this.bit(4))
            console.info('--TS3Log--', ...args);
    }
    public trace(...args) {
        // if (this.bit(32))
        //     console.trace('--TS3Trace--', ...args);
    }
    public warn(...args) {
        if (this.bit(8))
            console.warn('--TS3warn--', ...args);
    }
    public error(...args) {
        if (this.bit(16))
            console.error('--TS3Error--', ...args);
    }
}