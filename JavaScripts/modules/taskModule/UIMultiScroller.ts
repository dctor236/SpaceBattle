
/**
 * 无限滚动列表_vae
 */

import { Queue } from "../../utils/Quene";



export interface IItemRender {
    setData(data: any): void;
    get uiObject(): mw.Widget;
    get clickObj(): mw.StaleButton;
    setSelect(bool: boolean): void;
}


export class UIMultiScroller {
    _index = -1;
    _dataCount;
    _sBox;
    _scrollRoot;
    _movement;
    _itemArr = [];
    // 将未显示出来的Item存入未使用队列里面，等待需要使用的时候直接取出
    _unUsedQueue;
    _maxPerLine = 3;
    // 距离左侧和上册的起始距离
    _leftSpace = 30;
    _topSpace = 30;
    // Item的宽高
    _cellWidth = 500;
    _cellHeight = 100;
    // 行间距X
    _spacingX = 40;
    // 行间距Y
    _spacingY = 20;
    //默认加载行数，一般比可显示行数大2~3行
    _viewLine = 6;
    _itemPrefab;
    _dataArray;
    /**
    * 循环列表构造函数
    * @param sbox       ScrollBox对象ui的引用
    * @param sr         ScrollBox下的节点的引用
    * @param prefab     ScrollBoxItem预制体
    * @param maxPerLine 每列显示的数量
    * @param leftSpace  左边界间距
    * @param topSpace   上边界间距
    * @param cellWidth  ScrollBox下子节点的宽
    * @param cellHeight ScrollBox下子节点的高
    * @param viewCount  ScrollBox的默认加载行数
    * @param spacingX   ScrollBox的行间距X
    * @param spacingY   ScrollBox的行间距Y
    */
    constructor(sbox: mw.ScrollBox, sr: mw.Canvas, preafab: TypeName<IItemRender>, maxPerLine: number, leftSpace: number = 30, topSpace: number = 30, cellWidth: number = 150, cellHeight: number = 150, viewCount: number = 5, spacingX: number = 40, spacingY: number = 20) {
        this._sBox = sbox;
        this._scrollRoot = sr;
        this._itemPrefab = preafab;
        this._leftSpace = leftSpace;
        this._topSpace = topSpace;
        this._movement = sbox.orientation;
        this._cellWidth = cellWidth;
        this._cellHeight = cellHeight;
        this._viewLine = viewCount;
        this._spacingX = spacingX;
        this._spacingY = spacingY;
        this._maxPerLine = maxPerLine;
        this._unUsedQueue = new Queue();
        this._sBox.onUserScrolled.add((curOffset) => {
            this.onValueChange();
        });
        this._sBox.onScrollEnd.add(() => {
            this.onValueChange();
        });
    }
    private mInitCallback: mw.Action2<number, IItemRender> = new mw.Action2();
    /**调用InitData第一次初始化时的回调 */
    public get InitCallback(): mw.Action2<number, IItemRender> {
        return this.mInitCallback;
    }
    private mItemCallback: mw.Action2<number, IItemRender> = new mw.Action2();
    /**每个Item刷新时的回调 */
    public get ItemCallback(): mw.Action2<number, IItemRender> {
        return this.mItemCallback;
    }

    mItemHideCallback = new mw.Action2();
    /**每个item隐藏时的回调 */
    get ItemHideCallback() {
        return this.mItemHideCallback;
    }
    setData(val: any[]) {
        this._dataCount = val.length;
        this._dataArray = val;
        this.updateTotalWidth();
        this._index = -1;
        this.resetSBoxPos();
        if (this._itemArr != null) {
            for (let i = this._itemArr.length; i > 0; i--) {
                let item = this._itemArr[i - 1];
                this._itemArr.splice(i - 1, 1);
                this._unUsedQueue.push(item);
                item.uiObject.visibility = mw.SlateVisibility.Collapsed;
            }
            this.onValueChange();
        }
    }

    getData(index: number) {
        return this._itemArr[index]
    }

    onValueChange() {
        if (this._itemArr == null || this._dataCount == 0)
            return;
        let index = this.getPosIndex();
        if (index < 0 && this._index > 0) {
            index = 0;
        }
        if (this._index != index && index > -1) {
            this._index = index;
            for (let i = this._itemArr.length; i > 0; i--) {
                let item = this._itemArr[i - 1];
                if (item["scorllIndex"] < index * this._maxPerLine || (item["scorllIndex"] >= (index + this._viewLine) * this._maxPerLine)) {
                    this._itemArr.splice(i - 1, 1);
                    this._unUsedQueue.push(item);
                    item.uiObject.visibility = mw.SlateVisibility.Collapsed;
                    this.mItemHideCallback.call(i, item);
                }
            }
            for (let i = this._index * this._maxPerLine; i < (this._index + this._viewLine) * this._maxPerLine; i++) {
                if (i < 0)
                    continue;
                if (i > this._dataCount - 1)
                    continue;
                let isOk = false;
                for (let item of this._itemArr) {
                    if (item["scorllIndex"] == i)
                        isOk = true;
                }
                if (isOk)
                    continue;
                this.createItem(i);
            }
        }
    }
    /**刷新当前数据 */
    refreshData() {
        for (let i = this._itemArr.length; i > 0; i--) {
            let item = this._itemArr[i - 1];
            if (item["scorllIndex"] < this._index * this._maxPerLine || (item["scorllIndex"] >= (this._index + this._viewLine) * this._maxPerLine)) {
                this._itemArr.splice(i - 1, 1);
                this._unUsedQueue.push(item);
                item.uiObject.visibility = mw.SlateVisibility.Collapsed;
                this.mItemHideCallback.call(i, item);
            }

        }
        for (let i = this._index * this._maxPerLine; i < (this._index + this._viewLine) * this._maxPerLine; i++) {
            if (i < 0)
                continue;
            if (i > this._dataCount - 1)
                continue;
            let isOk = false;
            for (let item of this._itemArr) {
                if (item["scorllIndex"] == i) {
                    isOk = true;
                    this._dataArray && item.setData(this._dataArray[item["scorllIndex"]]);
                    this.mItemCallback.call(i, item);
                }
            }
            if (isOk)
                continue;
            this.createItem(i);
        }
    }
    /**
    * 根据索引号 获取当前item的位置
    * @param i   索引
    * @return 返回Pos
    */
    getPosition(i) {
        let xpos = (i % this._maxPerLine);
        let ypos = Math.floor(i / this._maxPerLine);
        switch (this._movement) {
            case mw.Orientation.OrientHorizontal:
                return new mw.Vector2((this._cellWidth + this._spacingX) * ypos + this._leftSpace, ((this._cellHeight + this._spacingY) * xpos) + this._topSpace);
            case mw.Orientation.OrientVertical:
                // return new mw.Vector2(this._cellWidth * xpos + (xpos != 0 ? this._spacingX * xpos : 0) + this._leftSpace, ((this._cellHeight + this._spacingY) * ypos) + this._topSpace);
                return new mw.Vector2((this._cellWidth + this._spacingX) * xpos + this._leftSpace, ((this._cellHeight + this._spacingY) * ypos) + this._topSpace);
        }
        return mw.Vector2.zero;
    }
    onDestroy() {
        this._itemArr = null;
        this._unUsedQueue = null;
    }
    getItemCount() {
        return this._maxPerLine * this._viewLine;
    }
    setItemIndex(item, index) {
        item["scorllIndex"] = index;
        item.uiObject.slot.position = this.getPosition(index);
    }
    createItem(i) {
        let itemBase;
        if (this._unUsedQueue.size() > 0) {
            itemBase = this._unUsedQueue.pop();
            itemBase.uiObject.visibility = mw.SlateVisibility.Visible;
        }
        else {
            if (this._itemPrefab.Gain != null) {
                itemBase = this._itemPrefab.Gain();
            }
            else {
                itemBase = mw.UIService.create(this._itemPrefab);
            }
            (this._scrollRoot.addChild(itemBase.uiObject));
            itemBase.uiObject.slot.size = (new mw.Vector2(this._cellWidth, this._cellHeight));
            this.mInitCallback.call(i, itemBase);
        }
        this.setItemIndex(itemBase, i);
        if (this._dataArray && itemBase["scorllIndex"] < this._dataArray.length) {
            itemBase.setData(this._dataArray[itemBase["scorllIndex"]]);
            this.mItemCallback.call(i, itemBase);
        }
        this._itemArr.push(itemBase);
        return;
    }
    /**
    * 获取最上位置的索引
     * @return 返回Pos
    */
    getPosIndex() {
        let pos = this._scrollRoot.slot.position;
        switch (this._movement) {
            case mw.Orientation.OrientHorizontal:
                {
                    return Math.floor(pos.x / -(this._cellWidth + this._spacingX));
                }
            case mw.Orientation.OrientVertical:
                {
                    let ret = pos.y / -(this._cellHeight + this._spacingY);
                    return Math.floor(ret);
                }
        }
        return 0;
    }
    // 这个方法的目的 就是根据总数量 行列 来计算content的真正宽度或者高度
    updateTotalWidth() {
        switch (this._movement) {
            case mw.Orientation.OrientHorizontal:
                let width = this._cellWidth * this._dataCount + this._spacingX * (this._dataCount - 1);
                let height = this._scrollRoot.slot.size.y;
                this._scrollRoot.slot.size = (new mw.Vector2(width, height));
                break;
            case mw.Orientation.OrientVertical:
                let lineCount = Math.ceil(this._dataCount / this._maxPerLine);
                this._scrollRoot.slot.size = (new mw.Vector2(this._scrollRoot.slot.size.x, this._cellHeight * lineCount + this._spacingY * (lineCount - 1) + this._topSpace));
                break;
        }
    }
    resetSBoxPos() {
        // 两句配合才能达到重置到顶部的效果
        this._scrollRoot.slot.position = (new mw.Vector2(0, 0));
        this._sBox.scrollToStart();
        // this._sBox.ScrollToStart();
    }
    reset2BoxTop() {
        // 两句配合才能达到重置到顶部的效果
        this._scrollRoot.slot.position = (new mw.Vector2(0, 0));
        this._sBox.scrollToStart();
    }
}