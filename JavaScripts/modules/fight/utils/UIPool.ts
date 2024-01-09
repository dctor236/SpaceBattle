export class UIPool<T extends mw.UIScript>{
    private readonly pool: T[]
    private creator: () => T
    private resetItemFunction: (item: T) => void
    private poolGetFunction: (item: T) => void

    constructor(creator?: () => T) {
        this.pool = []
        this.creator = creator
    }

    get count(): number {
        return this.pool ? this.pool.length : 0
    }

    get firstActiveItem(): T | undefined {
        for (let t of this.pool) {
            if (t.uiObject.visibility == mw.SlateVisibility.Hidden) continue
            return t
        }
    }

    byIndex(index: number): T | undefined {
        return this.pool[index]
    }

    setCreator(func: () => T) {
        this.creator = func
    }

    // 重新激活处理
    setPoolGetFunction(func: (item: T) => void) {
        this.poolGetFunction = func
    }

    setResetItemFunction(resetItemFunction: (item: T) => void) {
        this.resetItemFunction = resetItemFunction
    }

    get(): T {
        for (let item of this.pool) {
            if (item.uiObject.visibility == mw.SlateVisibility.Hidden || item.uiObject.visibility == mw.SlateVisibility.Collapsed) {
                item.uiObject.visibility = mw.SlateVisibility.Visible
                if (this.poolGetFunction) this.poolGetFunction(item)
                return item
            }
        }

        let result = this.creator()
        this.pool.push(result)
        return result
    }

    giveBack(item: T) {
        item.uiObject.visibility = mw.SlateVisibility.Collapsed
        if (this.resetItemFunction) this.resetItemFunction(item)
    }

    resetAll() {
        for (let item of this.pool) {
            this.giveBack(item)
        }
    }

    eachVisibleItem(action: (item: T) => void) {
        for (let t of this.pool) {
            if (t.uiObject.visibility == mw.SlateVisibility.Collapsed) continue
            action(t)
        }
    }

    eachVisibleItemWithoutFocus(action: (item: T) => void, focus: T) {
        for (let t of this.pool) {
            if (t.uiObject.visibility == mw.SlateVisibility.Collapsed) continue
            if (t == focus) continue
            action(t)
        }
    }
}

export class UIElementPool<T extends mw.Widget>{
    private creator: () => T
    private resetItemFunction: (item: T) => void

    private readonly pool: T[]

    constructor(creator?: () => T) {
        this.pool = []
        this.creator = creator
    }

    get count(): number {
        return this.pool ? this.pool.length : 0
    }

    get firstActiveItem(): T {
        for (let t of this.pool) {
            if (t.visibility == mw.SlateVisibility.Hidden) continue
            return t
        }
    }

    setCreator(func: () => T) {
        this.creator = func
    }
    setResetItemFunction(resetItemFunction: (item: T) => void) {
        this.resetItemFunction = resetItemFunction
    }


    get(): T {
        for (let i of this.pool) {
            if (i.visibility == mw.SlateVisibility.Hidden) {
                i.visibility = mw.SlateVisibility.Visible
                return i
            }
        }

        let result = this.creator()
        this.pool.push(result)
        return result
    }

    giveBack(item: T) {
        item.visibility = (mw.SlateVisibility.Hidden)
        if (this.resetItemFunction) this.resetItemFunction(item)
    }

    resetAll() {
        for (let item of this.pool) {
            this.giveBack(item)
        }
    }

    eachVisibleItem(action: (item: T) => void) {
        for (let t of this.pool) {
            if (t.visibility == mw.SlateVisibility.Hidden) continue
            action(t)
        }
    }
}

export type WorldUIPoolItem = { uiWidget: mw.UIWidget, stage: boolean }
export class WorldUIPool<T extends WorldUIPoolItem>{
    private creator: () => T
    private readonly pool: T[]
    private resetItemFunction: (item: T) => void
    private poolGetFunction: (item: T) => void

    constructor(creatorFunc?: () => T) {
        this.pool = []
        if (creatorFunc) this.creator = creatorFunc
    }

    setCreator(func: () => T) {
        this.creator = func
    }

    setPoolGetFunction(func: (item: T) => void) {
        this.poolGetFunction = func
    }

    setResetItemFunction(resetItemFunction: (item: T) => void) {
        this.resetItemFunction = resetItemFunction
    }

    eachVisibleItem(action: (item: T) => void) {
        for (let t of this.pool) {
            if (!t.stage) continue
            action(t)
        }
    }

    get(): T {
        for (let item of this.pool) {
            if (item.stage) continue
            if (this.poolGetFunction) this.poolGetFunction(item)
            item.uiWidget.setVisibility(mw.PropertyStatus.On)
            // item.uiWidget.worldTransform.scale = new Vector(0.2, 0.2, 0.2)
            item.stage = true
            return item
        }
        let result = this.creator()
        result.stage = true
        this.pool.push(result)
        return result
    }

    giveBack(item: T) {
        if (this.resetItemFunction) this.resetItemFunction(item)
        item.stage = false
        item.uiWidget.setVisibility(mw.PropertyStatus.Off)
    }

    resetAll() {
        for (let item of this.pool) {
            this.giveBack(item)
        }
    }
}