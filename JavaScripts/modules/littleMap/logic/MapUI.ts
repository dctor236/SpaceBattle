/*
 * @Author       : aolin.dai aolin.dai@appshahe.com
 * @Date         : 2022-12-11 18:26:19
 * @LastEditors  : aolin.dai aolin.dai@appshahe.com
 * @LastEditTime : 2023-04-02 14:50:52
 * @FilePath     : \CommonModule_Map\JavaScripts\modules\mapbase\MapUI.ts
 * @Description  : 
 */

import { MapSetting } from "../define/MapDefine";
import MapHelper from "../helper/MapHelper";

@UIBind('UI/map/IndexItem.ui')
export class IndexItem_Generate extends mw.UIScript {
    @UIWidgetBind('RootCanvas/indexItemBtn')
    public indexItemBtn: mw.Button = undefined;

    protected onAwake() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerBottom;
    }
}

export class IndexItem extends IndexItem_Generate {
    /** 随机id */
    public id: number;
    /** 当前图片的guid */
    public curImgGuid: string;
    /** 图片的位置 */
    public imgPos: Vector2;
    /**映射的玩家id */
    public pid: number = -1
    public target: mw.GameObject = null
    public tagetInitPos: Vector = Vector.zero
    /**上一帧前进方向 */
    lastForwad: Vector = Vector.zero
}

@UIBind('UI/map/Map.ui')
export class Map_Generate extends mw.UIScript {
    @UIWidgetBind('RootCanvas/mapCanvas/backImg')
    public backImg: mw.Image = undefined;
    @UIWidgetBind('RootCanvas/mapCanvas/heroLocImg')
    public heroLocImg: mw.Image = undefined;
    @UIWidgetBind('RootCanvas/mapCanvas/targetLocBtn')
    public targetLocBtn: mw.Button = undefined;
    @UIWidgetBind('RootCanvas/mapCanvas/imgCanvas/mapImg')
    public mapImg: mw.Image = undefined;
    @UIWidgetBind('RootCanvas/mapCanvas/imgCanvas')
    public imgCanvas: mw.Canvas = undefined;
    @UIWidgetBind('RootCanvas/mapCanvas')
    public mapCanvas: mw.Canvas = undefined;

    protected onAwake() {
        //设置能否每帧触发onUpdate
        this.canUpdate = false;
        this.layer = mw.UILayerBottom;
    }
}

export class MapUI extends Map_Generate {

    /** 地图的初始pos */
    private _mapBirthPos: Vector2;

    /** imgCanvas能移动的最大距离 */
    private _mapMaxMovePos: Vector2;

    /** 英雄图标初始位置 */
    private _heroImgInitPos: Vector2;

    /** 设置跟随指示物时的偏移量 */
    private _targetImgOffset: Vector2;

    /** 目标地点在小地图上的最多可以存在的位置 */
    private _maxPosInMap: Vector2;

    /** 目标地点的初始位置 */
    private _targetImgBirthPos: Vector2;

    /** 目标点图片的初始大小 */
    private _tarInitScale: Vector2;

    /** 目标点动画 */
    protected targetImgTween: mw.Tween<{ trans: Vector2 }>;

    /** 指示物池 */
    private _indexsPool: mwext.ObjPool<IndexItem>;

    /** 指示物map - 用于clear回收map中的indexItem */
    private _indexsMap: Map<number, IndexItem> = new Map();

    /** 被跟随的指示物的id */
    private _followId: number;

    /** 目标图片x方向锁 */
    private _targetImgXLock: boolean = false;

    /** 目标图片y方向锁 */
    private _targetImgYLock: boolean = false;

    /** 初始的目标图片guid */
    private _initTargetImgGuid: string;

    /** 地图在UI上的起始点（这个点是被隐藏起来的点） */
    private _startPos: Vector2 = Vector2.zero;

    /** 地图在UI上的终点（这个点是mapCanvas被完全显示出来的点） */
    private _endPos: Vector2 = Vector2.zero;

    override onAwake() {
        this._initTargetImgGuid = this.targetLocBtn.normalImageGuid;
        this._mapBirthPos = new Vector2(this.mapCanvas.size.x / 2, this.mapCanvas.size.y / 2);
        this._targetImgBirthPos = this.targetLocBtn.position.clone();
        this._tarInitScale = this.targetLocBtn.renderScale.clone();

        /** 初始化英雄指针的位置 */
        this._heroImgInitPos = new Vector2(this.mapCanvas.size.x / 2 - this.heroLocImg.size.x / 2, this.mapCanvas.size.y / 2 - this.heroLocImg.size.y / 2);
        // this.heroLocImg.position = this._heroImgInitPos;

        let maxX = this.mapCanvas.size.x - this.targetLocBtn.size.x;
        let maxY = this.mapCanvas.size.y - this.targetLocBtn.size.y;

        this._maxPosInMap = new Vector2(maxX, maxY);
        this._indexsPool = new ObjPool<IndexItem>(() => { return mw.UIService.create(IndexItem); }, null, null);
        this.targetLocBtn.onClicked.add(this.toggleNav.bind(this, false));

    }

    private get mapModuleC() {
        return MapHelper.instance.mapModuleC;
    }

    public set targetImgOffset(targetImgOffset: Vector2) {
        this._targetImgOffset = targetImgOffset;
    }

    /** 是否完整的显示地图 */
    protected isTotalView: boolean = false;

    /**
     * 初始化图片并返回渲染后的图片大小
     * @param imgGuid: 图片的guid
     * @param mapCfgId: 地图的配置表id
     * @param imgSize 地图的vec2
     * @param isTotal 是否全部显示
     * @returns 返回渲染后的图片大小
     */
    public initMap(imgGuid: string, mapCfgId: number, imgSize: Vector2, rotAngle: number, startPos: Vector2, endPos: Vector2, isTotal: boolean = false): Vector2 {
        this.isTotalView = isTotal;

        // 地图的开始结束点位置
        this._endPos = endPos;
        this._startPos = startPos;

        // 小地图的图片以及动态添加的指示物的canvas
        this.imgCanvas.position = mw.Vector2.zero;
        this.imgCanvas.renderTransformAngle = -rotAngle;

        // 小地图图片
        if (isTotal) {
            this.mapImg.size = this.mapCanvas.size;
            this.imgCanvas.size = this.mapCanvas.size;
        } else {
            this.mapImg.size = imgSize;
            this.imgCanvas.size = imgSize;
        }
        this.mapImg.imageGuid = imgGuid;
        this.mapImg.position = mw.Vector2.zero;

        // 根节点canvas的相对旋转
        this.rootCanvas.renderTransformAngle = rotAngle;

        // 小地图最多可移动到的位置
        this._mapMaxMovePos = new mw.Vector2(this.mapCanvas.size.x - this.imgCanvas.size.x, this.mapCanvas.size.y - this.imgCanvas.size.y);

        // 静态添加一些指示物
        this.addIndexs(mapCfgId);

        return this.mapImg.size;
    }

    /**
     * 移除并回收一个指示物
     * @param id 指示物的id
     */
    public removeIndex(id: number) {
        if (!this._indexsMap.has(id)) {
            console.error("[Map] 没有这个指示物");
            return;
        }
        if (this._followId === id) {
            this._followId = null;
            this.mapModuleC.toggleNavigation(false);
        }
        let indexItem = this._indexsMap.get(id);
        indexItem.indexItemBtn.visibility = mw.SlateVisibility.Collapsed;
        this._indexsPool.despawn(indexItem);
        this._indexsMap.delete(id);
    }

    /** 清空地图上的指示物 */
    private clearIndex() {
        this._indexsMap.forEach((indexItem: IndexItem) => {
            indexItem.indexItemBtn.visibility = mw.SlateVisibility.Collapsed;
            this._indexsPool.despawn(indexItem);
        });
        this._indexsMap.clear();
    }

    /**
     * 批量添加指示物，一般在初始化地图的时候会调用一次，初始化这张地图中的指示物，相当于静态初始化指示物
     * @param mapId 地图id
     */
    private addIndexs(mapId: number) {
        if (this.mapModuleC.mapIndexCfg == null) {
            console.error("[Map] mapIndex配置表信息错误");
            return;
        }
        this.mapModuleC.toggleNavigation(false);
        this.clearIndex();
        this.mapModuleC.mapIndexCfg.findElements().forEach((indexCfg) => {
            if (indexCfg.mapId === mapId) {
                this.addStaticIndex(indexCfg.imgGuid, indexCfg.pos, indexCfg.size, indexCfg.canFollow, indexCfg.id);
            }
        })
    }

    /**
     * 获取一个随机的id
     * @returns 一个随机id
     */
    private getRandomId(): number {
        return Date.now() + mw.MathUtil.randomInt(0, 10000);
    }

    /**
     * 添加一个静态指示物
     * @param imgGuid 指示物图片的guid
     * @param imgPos 指示物在地图上的位置
     * @param canFollow 指示物能否被跟随
     * @param id 在动态添加指示物时不用传
     * @return 返回指示物的id
     */
    public addStaticIndex(imgGuid: string, imgPos: Vector2, size: Vector2, canFollow: boolean, id?: number): number {
        const indexItem = this._indexsPool.spawn();
        this.imgCanvas.addChild(indexItem.uiObject);
        indexItem.id = id == null ? this.getRandomId() : id;
        indexItem.curImgGuid = imgGuid;
        indexItem.imgPos = imgPos;
        indexItem.uiObject.size = size;
        indexItem.indexItemBtn.normalImageGuid = imgGuid;
        indexItem.indexItemBtn.position = imgPos;
        indexItem.indexItemBtn.visibility = mw.SlateVisibility.Visible;
        indexItem.indexItemBtn.onClicked.clear();
        this._indexsMap.set(indexItem.id, indexItem);
        /** 可以跟随且地图不是完全显示才绑定可点击按钮 */
        if (canFollow && !this.isTotalView) {
            // this.startIndexAni(indexItem.indexItemBtn);
            indexItem.indexItemBtn.onClicked.add(this.followIndex.bind(this, indexItem.id));
        }
        return indexItem.id;
    }



    /**
      * 添加一个动态指示物
     * @param imgGuid 指示物图片的guid
     * @param imgPos 指示物在地图上的位置
     * @param canFollow 指示物能否被跟随
     * @param id 在动态添加指示物时不用传
     * @return 返回指示物的id
     */
    public addDynamaticIndex(imgGuid: string, size: Vector2, canFollow: boolean, id: number, target: mw.GameObject): number {
        const indexItem = this._indexsPool.spawn();
        this.imgCanvas.addChild(indexItem.uiObject);
        indexItem.id = id == null ? this.getRandomId() : id;
        indexItem.curImgGuid = imgGuid;
        indexItem.imgPos = Vector2.zero;
        indexItem.target = target
        indexItem.tagetInitPos = indexItem.target.worldTransform.position.clone()
        indexItem.lastForwad = indexItem.target.worldTransform.getForwardVector().clone()
        indexItem.uiObject.size = size;
        indexItem.indexItemBtn.normalImageGuid = imgGuid;
        indexItem.indexItemBtn.position = Vector2.zero;
        indexItem.indexItemBtn.visibility = mw.SlateVisibility.Visible;
        indexItem.indexItemBtn.onClicked.clear();
        this._indexsMap.set(indexItem.id, indexItem);
        /** 可以跟随且地图不是完全显示才绑定可点击按钮 */
        if (canFollow && !this.isTotalView) {
            // this.startIndexAni(indexItem.indexItemBtn);
            indexItem.indexItemBtn.onClicked.add(this.followIndex.bind(this, indexItem.id));
        }
        return indexItem.id;
    }


    /**
     * 跟随指示物
     * @param followId 跟随的指示物id
     */
    public followIndex(followId: number) {
        if (!this._indexsMap.has(followId)) {
            console.error("[Map] 指示物Map中没有该指示物");
            return;
        }
        if (this._followId != null) {
            this._indexsMap.get(this._followId).indexItemBtn.visibility = mw.SlateVisibility.Visible;
        }
        this._followId = followId;
        const indexItem = this._indexsMap.get(followId);
        indexItem.indexItemBtn.visibility = mw.SlateVisibility.Collapsed;
        this.targetLocBtn.position = indexItem.imgPos;
        this.mapModuleC.setNavLoc(this.mappingVec3(indexItem.indexItemBtn.position), indexItem.curImgGuid);
    }

    /**
     * 二维坐标的位置映射到场景中的位置
     * @param indexPos 指示物在场景中的位置
     */
    private mappingVec3(indexPos: Vector2): Vector {
        const realX = this.mapModuleC.playerBirthLoc.x - indexPos.y / this.mapModuleC.Ratio.x - this._targetImgOffset.y / 2;
        const realY = this.mapModuleC.playerBirthLoc.y + indexPos.x / this.mapModuleC.Ratio.y + this._targetImgOffset.x / 2;
        return new Vector(realX, realY, 0);
    }

    /**
     * 开启指示物动画
     * @param imgUI 需要开启缩放动画的图片UI
     */
    private startIndexAni(imgUI: mw.Widget) {
        if (imgUI == null) {
            console.error("[Map] img为空");
            return;
        }
        let tween = new Tween({ trans: this._tarInitScale.clone() })
            .to({ trans: MapSetting.SCALE_RATIO.clone() })
            .repeat(Infinity)
            .yoyo(true)
            .onUpdate((t) => {
                if (imgUI == null) tween.stop();
                imgUI.renderScale = t.trans;
            })
            .start();
    }

    /**
     * 根据x - y 方向的偏移量等比例同步计算地图的pos，并且更新地图的渲染锚点
     * @params xOffset 矫正过的x的偏移量
     * @params yOffset 矫正过的y的偏移量
     * @params offsetAngle 矫正过的偏移角度
     */
    public syncMap(xOffset: number, yOffset: number, offsetAngle: number, targetID: number) {
        const res = this._indexsMap.get(targetID)
        if (!res) return
        res.rootCanvas.renderTransformAngle += offsetAngle;
        let posX = this._mapBirthPos.x - yOffset;
        this._targetImgXLock = true;
        if (posX > 0) {
            res.rootCanvas.position = new Vector2(this._heroImgInitPos.x - posX, res.rootCanvas.position.y);
            posX = 0;
        }
        if (posX < this._mapMaxMovePos.x) {
            this._targetImgXLock = true;
            res.rootCanvas.position = new Vector2(this._heroImgInitPos.x - posX + this._mapMaxMovePos.x, res.rootCanvas.position.y);
            posX = this._mapMaxMovePos.x;
        }
        if (posX < 0 && posX > this._mapMaxMovePos.x) {
            this._targetImgXLock = false;
        }
        let posY = this._mapBirthPos.y + xOffset;
        if (posY > 0) {
            this._targetImgYLock = true;
            res.rootCanvas.position = new Vector2(res.rootCanvas.position.x, this._heroImgInitPos.y - posY);
            posY = 0;
        }
        if (posY < this._mapMaxMovePos.y) {
            this._targetImgYLock = true;
            res.rootCanvas.position = new Vector2(res.rootCanvas.position.x, this._heroImgInitPos.y - posY + this._mapMaxMovePos.y);
            posY = this._mapMaxMovePos.y;
        }
        if (posY < 0 && posY > this._mapMaxMovePos.y) {
            this._targetImgYLock = false;
        }
        this.imgCanvas.position = new Vector2(posX, posY);
    }

    /**
     * 更新目标点位置图片
     * @param xOffset x方向的相对偏移量
     * @param yOffset y方向的相对偏移量
     */
    public updateTargetLocImg(xOffset: number, yOffset: number) {
        const res = this._indexsMap.get(Player.localPlayer.playerId)
        if (!res) return
        let posX = this._targetImgBirthPos.x - yOffset;
        // X方向的锁
        if (this._targetImgXLock) {
            posX -= this._heroImgInitPos.x - res.rootCanvas.position.x;
        }

        // X边界判断
        if (posX < 0) { posX = 0; }
        if (posX > this._maxPosInMap.x) { posX = this._maxPosInMap.x; }

        let posY = this._targetImgBirthPos.y + xOffset;
        // Y方向的锁
        if (this._targetImgYLock) {
            posY -= this._heroImgInitPos.y - res.rootCanvas.position.y;
        }

        // Y边界判断
        if (posY < 0) { posY = 0; }
        if (posY > this._maxPosInMap.y) { posY = this._maxPosInMap.y; }

        // 更新位置
        this.targetLocBtn.position = new Vector2(posX, posY);
    }


    /**
     * 开启或者关闭导航
     * @param isTurnOn true开启，false关闭
     * @param navImg 导航图片
     */
    public toggleNav(isTurnOn: boolean, navImg?: string) {
        if (isTurnOn) {
            this.startIndexAni(this.targetLocBtn);
            if (navImg == null) {
                this.targetLocBtn.normalImageGuid = this._initTargetImgGuid;
            } else {
                this.targetLocBtn.normalImageGuid = this._indexsMap.get(this._followId).curImgGuid;
            }

            this.targetLocBtn.visibility = mw.SlateVisibility.Visible;
        } else {
            this.targetImgTween?.stop();
            this.targetLocBtn.visibility = mw.SlateVisibility.Collapsed;
            if (this._followId != null) {
                this._indexsMap.get(this._followId).indexItemBtn.visibility = mw.SlateVisibility.Visible;
                this._followId = null;
            }
        }
    }

    /**
     * 显示/隐藏 地图
     * @param isShow true 显示 false 隐藏
     * @param doComplete 动画完成时执行的方法
     */
    public toggleMapView(isShow: boolean, doComplete?: Function) {
        if (isShow) {
            console.log("[Map] 显示地图");
            // 每次打开地图矫正一下角色在地图上的位置
            const res = this._indexsMap.get(Player.localPlayer.playerId)
            if (!res) return
            res.rootCanvas.position = this._heroImgInitPos;
            new Tween({ trans: this._startPos.clone() })
                .to({ trans: this._endPos.clone() })
                .onUpdate((t) => { this.mapCanvas.position = t.trans; })
                .onStart((t) => { mw.UIService.showUI(this); this.mapCanvas.position = t.trans; })
                .onComplete(() => { if (doComplete != null) doComplete(); })
                .start();
        } else {
            console.log("[Map] 隐藏地图");
            new Tween({ trans: this._endPos.clone() })
                .to({ trans: this._startPos.clone() })
                .onUpdate((t) => { this.mapCanvas.position = t.trans; })
                .onComplete(() => {
                    mw.UIService.hideUI(this);
                    if (doComplete != null) doComplete();
                })
                .start();
        }
    }

    private getSignedAngle(loc1: Vector, loc2: Vector) {
        // 计算无符号角度
        const offsetAngle = Vector.angle(loc1, loc2);
        // 同一个平面中，三维向量叉积的z轴正负代表转的方向
        return Vector.cross(loc1, loc2).z > 0 ? offsetAngle : -offsetAngle;
    }

    onShow() {
        this.canUpdate = true
    }
    onHide() {
        this.canUpdate = false
    }

    onUpdate(dt: number) {
        this._indexsMap.forEach(e => {
            if (e.target) {
                console.log("jkjkljkljk")
                const curLoc = e.target.worldTransform.position
                const xOffset = (curLoc.x - e.tagetInitPos.x) * MapHelper.instance.mapModuleC.Ratio.x;
                const yOffset = (curLoc.y - e.tagetInitPos.y) * MapHelper.instance.mapModuleC.Ratio.y;
                this.syncMap(xOffset, yOffset, this.getSignedAngle(e.lastForwad, e.target.worldTransform.getForwardVector()), e.id);
                e.lastForwad.set(e.target.worldTransform.getForwardVector())
            }
        })
    }
}
