/*
 * @Author       : aolin.dai aolin.dai@appshahe.com
 * @Date         : 2022-12-13 18:57:23
 * @LastEditors  : aolin.dai aolin.dai@appshahe.com
 * @LastEditTime : 2023-02-27 13:33:36
 * @FilePath     : \CommonModule_Map\JavaScripts\modules\map\MapHelper.ts
 * @Description  : 
 */

import { GameConfig } from '../../../config/GameConfig';
import { MapSetting } from '../define/MapDefine';
import { MapModuleC } from '../logic/MapModuleC';

export default class MapHelper {
    private static _instance: MapHelper;

    private _mapModuleC: MapModuleC;

    public static get instance() {
        if (this._instance == null) {
            this._instance = new MapHelper();
        }
        return this._instance;
    }

    /** 
     * 注册MapHelper
     * 注意：须在注册mapModuleC之后的客户端中注册
     */
    public async register() {
        MapSetting.init(null, 1, true);
    }

    public get mapModuleC() {
        if (this._mapModuleC == null) {
            this._mapModuleC = ModuleService.getModule(MapModuleC);
        }
        return this._mapModuleC;
    }

    private constructor() {
        this.mapModuleC.mapCfg = GameConfig.Map;
        this.mapModuleC.mapIndexCfg = GameConfig.MapIndex;
    }

    /**
     * 切换地图，会一并加载地图上的指示物
     * @param mapId 地图配置表的地图id
     */
    public shiftMap(mapId: number) {
        this.mapModuleC.setMap(mapId);
    }

    /**
     * 显示隐藏地图
     * @param isShow true 显示， false 隐藏
     */
    public toggleMapView(isShow: boolean) {
        this.mapModuleC.toggleMapView(isShow);
    }

    /**
     * @param isUse 是否启用导航
     * @param toLoc 导航前往的目的地，在3维中
     */
    public toggleNavigation(isUse: boolean, toLoc?: mw.Vector) {
        if (isUse) {
            // 有目的地就开启一段新的导航，没有目的地就开启上一段导航
            if (toLoc == null) {
                this.mapModuleC.toggleNavigation(true);
            } else {
                this.mapModuleC.setNavLoc(toLoc);
            }
        } else {
            this.mapModuleC.toggleNavigation(false);
        }
    }

    /**
     * 动态添加一个指示物
     * @param imgGuid 指示物的图片guid
     * @param imgPos 指示物在地图的位置
     * @param canFollow 指示物是否能被跟随
     */
    public addIndex(imgGuid: string, imgPos: mw.Vector2, size: Vector2, canFollow: boolean = false): number {
        return this.mapModuleC.addStaticIndex(imgGuid, imgPos, size, canFollow);
    }

    /**
     * 移除一个指示物
     * @param id 指示物id
     */
    public removeIndex(id: number) {
        this.mapModuleC.removeIndex(id);
    }
}