export class MapSetting {

    /** 角色默认的面朝方向，映射小地图指针的朝向 */
    public static readonly BIRTH_FORWARD = new Vector(1, 0, 0);

    /** 目标地点动画效果的缩放系数 */
    public static SCALE_RATIO = new Vector2(0.75, 0.75);

    /** 进入游戏中时初始化地图配置表的id */
    public static INIT_MAP_ID = 1;

    /** 初始化是否显示地图 */
    public static IS_SHOW_MAP_VIEW = false;

    /**
     * 初始化地图配置
     * @param scaleRatio 目标地点动画效果的缩放系数
     * @param initMapId 进入游戏中时初始化地图配置表的id
     * @param isShowMapView 初始化是否显示地图
     */
    public static init(scaleRatio?: Vector2, initMapId?: number, isShowMapView?: boolean): void {
        if (scaleRatio != null) this.SCALE_RATIO = scaleRatio;
        if (initMapId != null) this.INIT_MAP_ID = initMapId;
        if (isShowMapView != null) this.IS_SHOW_MAP_VIEW = isShowMapView;
    }
}

export class Ratio {
    constructor(public x: number = 0, public y: number = 0) { };

    /**
     * 设置一个二维坐标的比值（系数）
     * @param x1 
     * @param y1 
     * @param x2 
     * @param y2 
     */
    setRatio(x1: number, y1: number, x2: number, y2: number) {
        // 注意：场景的x对应地图UI的y，场景的y对应地图UI的x
        this.x = x1 / y2;
        this.y = y1 / x2;
    }
}
