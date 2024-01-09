
/** 
 * @Author       : peiwen.chen
 * @Date         : 2022-11-17 14:56:07
 * @LastEditors  : peiwen.chen
 * @LastEditTime : 2023-01-04 13:47:22
 * @FilePath     : \huntroyale\JavaScripts\utils\SnowflakeIdGenerate.ts
 * @Description  : 修改描述
 */
const base = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ben = base.length;

function toBase(num: string | number) {
    let arr = [];
    if (typeof num === 'string') {
        num = Number(num)
    }
    while (num > 0) {
        arr.push(base[num % ben]);
        num = Math.floor(num / ben);
    }
    //数组反转，因为个位在索引0的位置，应反过来显示
    return arr.reverse().join('');

}
const minusOne = -1;
export class SnowflakeIdGenerate {

    static instance: SnowflakeIdGenerate = new SnowflakeIdGenerate();

    private readonly radix = 36

    private readonly START_STAMP = 0;

    private readonly SEQUENCE_BIT = 12;

    private readonly MACHINE_BIT = 4;

    private readonly DATA_CENTER_BIT = 4;

    private readonly MAX_DATA_CENTER_NUM = minusOne ^ (minusOne << this.DATA_CENTER_BIT);

    private readonly MAX_MACHINE_NUM = minusOne ^ (minusOne << this.MACHINE_BIT);

    private readonly MAX_SEQUENCE = minusOne ^ (minusOne << this.SEQUENCE_BIT);

    private readonly MACHINE_LEFT = this.SEQUENCE_BIT;

    private readonly DATA_CENTER_LEFT = this.SEQUENCE_BIT + this.MACHINE_BIT;

    private readonly TIMESTAMP_LEFT = this.DATA_CENTER_LEFT + this.DATA_CENTER_BIT;

    private _dataCenterId; //数据中心

    private _machineId; //机器标识

    private _sequence = 0; //序列号

    private _lastStamp = minusOne; //上一次时间戳

    private constructor(machineId = 1, dataCenterId = 1) {
        if (this._machineId > this.MAX_MACHINE_NUM || this._machineId < 0) {
            throw new Error(
                'config.worker_id 必须大于 0 且小于 maxWorkerId-[' +
                this.MAX_MACHINE_NUM +
                ']'
            );
        }
        if (this._dataCenterId > this.MAX_DATA_CENTER_NUM || this._dataCenterId < 0) {
            throw new Error(
                'config.data_center_id 必须大于 0 且小于 maxDataCenterId-[' +
                this.MAX_DATA_CENTER_NUM +
                ']'
            );
        }
        this._machineId = machineId;
        this._dataCenterId = dataCenterId;
    }

    private getNewStamp(): number {
        return Date.now();
    };

    private getNextMill(): number {
        let timestamp = this.getNewStamp();
        while (timestamp <= this._lastStamp) {
            timestamp = this.getNewStamp();
        }
        return timestamp;
    };

    nextId(): string {
        let timestamp: number = this.getNewStamp();
        if (timestamp < this._lastStamp) {
            throw new Error(
                '时钟向后移动. 拒绝为生成 id ' +
                (this._lastStamp - timestamp)
            );
        }
        if (this._lastStamp === timestamp) {
            this._sequence = (this._sequence + 1) & this.MAX_SEQUENCE;
            if (this._sequence === 0) {
                timestamp = this.getNextMill();
            }
        } else {
            this._sequence = 0;
        }
        this._lastStamp = timestamp;

        const timestampPos =
            BigInt(timestamp - this.START_STAMP) *
            BigInt(2) ** BigInt(this.TIMESTAMP_LEFT);
        const dataCenterPos = BigInt(this._dataCenterId << this.DATA_CENTER_LEFT);
        const workerPos = BigInt(this._machineId << this.MACHINE_LEFT);
        const num = (
            timestampPos |
            dataCenterPos |
            workerPos |
            BigInt(this._sequence)
        ).toString(this.radix)
        return num;
    };
}
