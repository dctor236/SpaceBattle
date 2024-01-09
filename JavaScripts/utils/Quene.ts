/*
 * @Autor: Dejia
 * @Date: 2022-07-05 16:38:07
 * @LastEditors: Dejia
 * @LastEditTime: 2022-07-05 16:38:07
 */
/*
 * @Author: yfl
 * @Date: 2022-03-10 11:35:59
 * @LastEditTime: 2022-03-10 13:43:36
 * @FilePath: \JavaScripts\common\Queue.ts
 */

export class Queue<T>{

    private elemrnts: Array<T>;
    private _size: number | undefined;

    public constructor(capacity?: number) {
        this.elemrnts = new Array<T>();
        this._size = capacity;
    }

    public push(o: T): boolean {
        if (o == null) {
            return false;
        }
        if (this._size != undefined && !isNaN(this._size)) {
            if (this.elemrnts.length == this._size) {
                this.pop();
            }
        }
        this.elemrnts.unshift(o);
        return true;
    }

    public pop(): T {
        return this.elemrnts.pop();
    }

    public size(): number {
        return this.elemrnts.length;
    }

    public isempty(): boolean {
        return this.size() == 0;
    }

    public clear() {
        delete this.elemrnts;
        this.elemrnts = new Array<T>();
    }

    public show(num: number): T {
        if (num >= 0 && num < this.size()) {
            return this.elemrnts[this.size() - 1 - num];
        }
        else {

            return;
        }
    }

    public showsize(): number | undefined {

        return this._size;
    }

    getAll() {
        return this.elemrnts;
    }

}
