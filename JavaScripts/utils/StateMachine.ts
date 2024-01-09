

/**
 * 状态实例类
 */
class IStateFunc {
    enter?: (data?: any) => void
    update?: (dt: number, elapsedTime?: number) => void
    exit?: () => void
}

/**
 * 状态机
 */
export class StateMachine<T> {
    private _states: Map<T, IStateFunc>
    private _currentState: T
    private _elapsedTime: number = 0
    constructor() {
        this._states = new Map<T, IStateFunc>()
    }

    /**
     * 注册状态
     * @param state 状态
     * @param func 回调
     */
    public register(state: T, func: IStateFunc) {
        this._states.set(state, func)
    }

    /**
     * 注册状态enter
     * @param state 状态
     * @param func enter回调
     */
    public registerEnter(state: T, enter: (data?: any) => void) {
        let has = this._states.has(state)
        if (has) {
            let func = this._states.get(state)
            func.enter = enter
        } else {
            let func = new IStateFunc()
            func.enter = enter
            this._states.set(state, func)
        }
    }

    /**
    * 注册状态update
    * @param state 状态
    * @param func update回调
    */
    public registerUpdate(state: T, update: (dt: number) => void) {
        let has = this._states.has(state)
        if (has) {
            let func = this._states.get(state)
            func.update = update
        } else {
            let func = new IStateFunc()
            func.update = update
            this._states.set(state, func)
        }
    }

    /**
    * 注册状态exit
    * @param state 状态
    * @param func exit回调
    */
    public registerExit(state: T, exit: () => void) {
        let has = this._states.has(state)
        if (has) {
            let func = this._states.get(state)
            func.exit = exit
        } else {
            let func = new IStateFunc()
            func.exit = exit
            this._states.set(state, func)
        }
    }

    public update(dt): void {
        if (this._currentState != undefined) {
            this._elapsedTime += dt
            let func = this._states.get(this._currentState)
            func.update && func.update(dt, this._elapsedTime)
        }
    }

    /**
    * 切换状态
    * @param state 状态
    * @param data 参数
    */
    public switch(state: T, ...data: any): void {
        if (this._currentState == state) {
            return
        }

        if (!this._states.has(state)) {
            oTraceError("没有这个状态", state)
            return
        }

        if (this._currentState != undefined) {
            let func = this._states.get(this._currentState)
            func.exit && func.exit()
        }
        this._currentState = state

        this._elapsedTime = 0
        let func = this._states.get(state)
        func.enter && func.enter(...data)
    }

    /**
     * 清楚状态列表
     */
    public destroy(): void {
        this._states.clear()
    }

    /**
     * 获取当前状态
     * @returns 当前状态
     */
    public getStateInfo(): { state: T, elasped: number } {
        return { 'state': this._currentState, 'elasped': this._elapsedTime }
    }

    /**获取状态过去的时间 */
    public getElaspedTime() { return this._elapsedTime }

    /**
     * 清理状态
     */
    public reset() {
        this._currentState = undefined
    }
}