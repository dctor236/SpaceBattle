import { UIManager } from "../../ExtensionType";


export class GridLayout<T extends mw.UIScript> {

	/**生长参数 */
	private _growSize: number;
	private _growDir: mw.Orientation;

	/**子节点 */
	public nodes: T[] = [];

	/**偏移 */
	public left: number = 0;
	public top: number = 0;

	/** X间隔 */
	public spacingX: number = 0;
	/** Y间隔 */
	public spacingY: number = 0;

	/**初始化GridLayout */
	constructor(private _root: mw.ScrollBox, private _isAutoWrap: boolean = true) {
		const size = this._root.size;
		this._growDir = this._root.orientation;
		if (_isAutoWrap) {
			this._growDir = 1 - this._growDir;
		}

		this._growSize = this._growDir == mw.Orientation.OrientHorizontal ? size.x : size.y;
	}

	/**
	 * 添加节点
	 * @param node 节点
	 */
	public addNode(uiClass, ...params): T {
		let length = this.nodes.length;
		for (var i = 0; i < length; i++) {
			if (!this.nodes[i].visible) {
				// this.nodes[i].show(...params);
				this.nodes[i].visible = true;
				//return this.nodes[i];
			}
		}

		// 这里出现了问题，node原本是T类型的，在修改018API后，node变成了UIBehavior类型
		// let node = uiClass.creat();
		let node = UIManager.create(uiClass) as T;
		// node.show(...params);
		this._root.addChild(node.uiObject);
		node.uiObject.autoSizeEnable = true;
		this.nodes.push(node);
		node.visible = true;
		return node;
	}

	/**
	 * 移除单个节点
	 */
	public removeNode(node: T) {
		const index = this.nodes.indexOf(node);
		if (index >= 0) {
			node.visible = false;
			this.nodes.push(...this.nodes.splice(index, 1));
		}
		this.invalidate();
	}

	/**
	 * 移除所有节点
	 */
	public removeAllNode() {
		let length = this.nodes.length;
		for (var i = 0; i < length; i++) {
			this.nodes[i].visible = false;
			UIManager.hideUI(this.nodes[i]);
		}
	}

	/**
	 * 更新布局
	 */
	public invalidate() {
		let startX = this.left;
		let startY = this.top;
		this.nodes.forEach(
			element => {
				// if (!element.visible) {
				// 	element.uiObject.position = mw.Vector2.zero;
				// 	return;
				// }
				let slot = element.uiObject;
				let slotSize = element.rootCanvas.size;
				if (this._growDir == mw.Orientation.OrientHorizontal) {
					if (this._isAutoWrap && startX + slotSize.x > this._growSize) {
						startY += this.spacingY + slotSize.y;
						startX = this.left;
					}
					slot.position = (new mw.Vector2(
						startX,
						startY
					));
					startX += slotSize.x + this.spacingX;
				} else {
					if (this._isAutoWrap && startY + slotSize.y >= this._growSize) {
						startX += this.spacingX + slotSize.x;
						startY = this.top;
					}
					slot.position = (new mw.Vector2(
						startX,
						startY
					));
					startY += slotSize.y + this.spacingY;
				}
			}
		)
	}

}