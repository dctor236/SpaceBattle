/*
 * @Author       : aolin.dai aolin.dai@appshahe.com
 * @Date         : 2022-12-11 16:54:21
 * @LastEditors: yudong.wu yudong.wu@appshahe.com
 * @LastEditTime: 2023-02-20 09:49:26
 * @FilePath: \trappsavestheworld\JavaScripts\modules\mapbase\MapModuleC.ts
 * @Description  : 
 */

import { GameConfig } from '../../../config/GameConfig';
import { Ratio, MapSetting } from '../define/MapDefine';
import { MapModuleS } from './MapModuleS';
import { MapUI } from './MapUI';



export class MapModuleC extends ModuleC<MapModuleS, null> {

    /** 地图 / 场景 比 */
    private _ratio: Ratio;

    /** 角色 x 方向偏移量 */
    private _xOffset: number;

    /** 角色 y 方向偏移量 */
    private _yOffset: number;

    /** 玩家的出生点坐标 */
    private _playerBirthLoc: Vector;

    /** 记录上一次角色的向前方向 */
    private _lastForwardVec: Vector;

    /** 是否启用小地图导航 */
    private _enableNav: boolean;

    /** 小地图上导航前往地点 */
    private _toLoc: Vector;

    /** 地图UI */
    protected mapUI: MapUI;

    /** 地图的配置 */
    public mapCfg: any;

    /** 地图指示物配置 */
    public mapIndexCfg: any;

    /** 如果地图不显示，将关闭onUpdate*/
    private _isShow: boolean;

    /**创建调用*/
    onAwake() {
        this._isShow = false;
        this._ratio = new Ratio();
        this.mapUI = mw.UIService.create(MapUI);
        this.setMap(MapSetting.INIT_MAP_ID, false);
    }

    /**开始调用*/
    onStart() {
        this._lastForwardVec = MapSetting.BIRTH_FORWARD;
        this._enableNav = false;
    }

    /**进入场景调用*/
    onEnterScene(sceneType: number) {
        Player.getAllPlayers().forEach(e => {
            const icon = e.playerId == this.localPlayerId ? 11 : 10
            this.addDynamicIndex(icon, e.playerId, e.character, e.playerId != this.localPlayerId)
        })
        this.toggleMapView(MapSetting.IS_SHOW_MAP_VIEW);
    }

    /**刷新调用*/
    onUpdate(dt: number) {
        // if (this.currentPlayer.character.worldTransform.position.equals(this.curLoc)) { return; }
        this.updateMap();
    }

    /**销毁调用*/
    onDestroy() {
    }

    public get Ratio() {
        return this._ratio;
    }

    public get playerBirthLoc() {
        return this._playerBirthLoc;
    }

    /** 当前地图的旋转角度 */
    private _rotAngle: number = 0;

    /**
     * 传送到不同地方设置不同地图
     * @param mapCfgId 地图的配置表
     * @param isReset 是否重置地图
     */
    public setMap(mapCfgId: number, isReset: boolean = true) {
        // 如果需要重置地图，并且地图是显示状态，播放切换地图动画
        if (isReset && this._isShow) {
            this.mapUI.toggleMapView(false, () => {
                this.setMap(mapCfgId, false);
                this.mapUI.toggleMapView(true, () => { this.updateMap(); });
            });
            return;
        }
        const mapCfg = this.mapCfg.getElement(mapCfgId);
        if (mapCfg == null) {
            console.error(`[Map] 配置 ${mapCfgId} 不存在`);
            return;
        }
        this._rotAngle = mapCfg.rotAngle;
        // 去找场景中的这个guid的模型
        GameObject.asyncFindGameObjectById(mapCfg.sceneGuid).then(sceneObj => {
            // 场景模型的面积
            let sceneSize = sceneObj.getBoundingBoxExtent();
            // 地图初始化地图图片UI
            let mapSize = this.mapUI.initMap(mapCfg.imgGuid, mapCfgId, mapCfg.imgSize, mapCfg.rotAngle, mapCfg.startPos, mapCfg.endPos, mapCfg.isTotalView);
            // 地图初始化地图图片UI
            // let mapUISize = this.mapUI.initMap(mapCfg.imgGuid, mapCfgId, mapCfg.imgSize, mapCfg.rotAngle, mapCfg.startPos, mapCfg.endPos);
            // 假设玩家的初始点在地图场景模型的左上角
            this._playerBirthLoc = new Vector(sceneObj.worldTransform.position.x + sceneSize.x / 2, sceneObj.worldTransform.position.y - sceneSize.y / 2, 0);
            // 设置场景的x,y与地图的比例
            this._ratio.setRatio(mapSize.x, mapSize.y, sceneSize.x, sceneSize.y);
            // 设置场景的x,y与地图的比例
            this.mapUI.targetImgOffset = new Vector2(this.mapUI.targetLocBtn.size.y / this.Ratio.x / 2, this.mapUI.targetLocBtn.size.x / this.Ratio.y / 2);
            console.log("[Map] 小地图设置成功，地基guid = " + sceneObj.gameObjectId);
        });
    }

    /** 玩家当前位置 */
    protected curLoc: Vector = Vector.zero;

    /** 
     * 更新小地图 
     */
    private updateMap() {
        if (!this._ratio || !this._isShow) { return; }
        // this.curLoc = this.currentPlayer.character.worldTransform.position;
        // this._xOffset = (this.curLoc.x - this._playerBirthLoc.x) * this._ratio.x;
        // this._yOffset = (this.curLoc.y - this._playerBirthLoc.y) * this._ratio.y;
        // this.mapUI.syncMap(this._xOffset, this._yOffset, this.getSignedAngle(this._lastForwardVec, this.currentPlayer.character.getForwardVector()));
        // // 更新上一帧的向前向量
        // this._lastForwardVec = this.currentPlayer.character.getForwardVector();
        if (this._enableNav) { this.updateTargetLoc(this.curLoc); }
    }

    /**
     * 更新任务在小地图上的标点
     * @param curLoc 角色当前的坐标
     */
    private updateTargetLoc(curLoc: Vector) {
        const tarXOff = (curLoc.x - this._toLoc.x) * this._ratio.x;
        const tarYOff = (curLoc.y - this._toLoc.y) * this._ratio.y;
        this.mapUI.updateTargetLocImg(tarXOff, tarYOff);
    }

    /**
     * 计算三维映射到二维的有符号角度（只限于俯视所看的平面）
     * @param loc1 三维矢量1
     * @param loc2 三维矢量2
     * @returns 返回loc1和loc2在x,y上的正交投影有符号角度
     */
    private getSignedAngle(loc1: Vector, loc2: Vector) {
        // 计算无符号角度
        const offsetAngle = Vector.angle(loc1, loc2);
        // 同一个平面中，三维向量叉积的z轴正负代表转的方向
        return Vector.cross(loc1, loc2).z > 0 ? offsetAngle : -offsetAngle;
    }

    /**
     * 添加一个静态指示物
     * @param imgGuid 指示物的图片guid
     * @param imgPos 指示物在地图的位置
     * @param canFollow 指示物是否能被跟随
     * @return 返回指示物的id
     */
    public addStaticIndex(imgGuid: string, imgPos: Vector2, size: Vector2, canFollow: boolean): number {
        return this.mapUI.addStaticIndex(imgGuid, imgPos, size, canFollow);
    }

    /**
    * 添加一个动态指示物
    * @param imgGuid 指示物的图片guid
    * @param imgPos 指示物在地图的位置
    * @param targetID 玩家playerID或者怪物guid
    * @return 返回指示物的id
    */
    public addDynamicIndex(configID: number, targetID: number, target: mw.GameObject, canFollow: boolean): number {
        const elem = GameConfig.MapIndex.getElement(configID)
        return this.mapUI.addDynamaticIndex(elem.imgGuid, elem.size, canFollow, targetID, target);
    }

    /**
     * 移除一个指示物
     * @param id 指示物的id
     */
    public removeIndex(id: number) {
        this.mapUI.removeIndex(id);
    }

    /**
     * 设置导航目的地
     * @param toLoc 导航去的目的地
     * @param navImg 导航点图片
     */
    public setNavLoc(toLoc: Vector, navImg?: string) {
        this._toLoc = toLoc;
        this.toggleNavigation(true, navImg);
    }

    /**
     * 开关导航
     * @param isTurnOn true 开 false 关
     * @param navImg 导航地图
     */
    public toggleNavigation(isTurnOn: boolean, navImg?: string) {
        if (isTurnOn && this._toLoc == null) {
            console.error("[Map] 跟随指示物失败，原因可能是目的地toLoc为空");
            return;
        }
        this._enableNav = isTurnOn;
        this.mapUI.toggleNav(isTurnOn, navImg);
        this.updateMap();
    }

    /**
     * 打开或者关闭地图
     * @param isShow true 打开地图 false 关闭地图
     */
    public toggleMapView(isShow: boolean) {
        if (this.mapUI == null || isShow === this._isShow) {
            console.error("[Map] 开关地图失败，不能重复打开或者关闭");
            return;
        }
        if (isShow) { this.updateMap(); }
        this._isShow = isShow;
        this.mapUI.toggleMapView(isShow);
    }
}