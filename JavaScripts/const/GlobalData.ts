
/** 
 * @Author       : 陆江帅
 * @Date         : 2023-04-03 14:24:28
 * @LastEditors  : songxing
 * @LastEditTime : 2023-05-19 15:25:21
 * @FilePath     : \mollywoodschool\JavaScripts\const\GlobalData.ts
 * @Description  : 
 */
export type Class<T> = { new(...args): T; };
declare global {
    var UE: any;
}
export function MyBoolean(bool: any): boolean {
    if (typeof bool === "boolean") {
        return bool
    }
    if (typeof bool === "string") {
        if (["1", "true", "True"].includes(bool.toString())) {
            return true
        } else {
            return false
        }
    }
    if (typeof bool === "number") {
        if (bool == 0) return false
        else return true
    }
    return false
}
export class GlobalData {
    /**出生点位置 */
    public static globalPos: mw.Vector = null;
    /**出生点位置 */
    public static globalRot: mw.Rotation = null;
    public static globalCameraRot: mw.Rotation = null;
    /**是否本地背包 */
    public static isLocalBag: boolean = false;
    /**是否打开GM */
    public static isOpenGM: boolean = false;
    /**现实1s，游戏内多少秒 */
    public static timeScale: number = 0;
    /**开始显示时间，小时 */
    public static dayBeginShow: number = 0;

    /**当前衣服id */
    public static clothConfigID: number = -1;
    /**是否可操作快捷栏 */
    public static isChangeBar: boolean = true;
    /** 快捷栏最大数量 */
    public static maxShortcutBar = 5;
    /**空插槽图片 */
    public static blankSlotBg = "115575";

    /**道具给予距离 */
    public static giveDis = 500;
    /**交互物父节点 */
    public static interactorParent: string = "341CC899";

    /**技能内置CD */
    public static skillCD: number = 0
    /**默认内置CD */
    public static defaultCD: number = 0.5

    /**造物时动作 */
    public static creationAnim: string = "156436"
    /**飞行准备动作 */
    public static flyStandbyAnim: string = "157058"
    /**飞行动作 */
    public static flyAnim: string = "157056"

    /**飞行结束动作 */
    public static flyOverAnim: string = "157057"

    /** 使用技能时的下落速度 */
    public static glideFallingSpeed: number = 500;
    /** 下落控制 0 - 1 */
    public static glideAirControl: number = 1;

    /** 滑翔伞特效 */
    public static glideEffectGuid: string = "155683";
    /** 下落控制提升速率阈值 */
    public static glideAirControlBoostVelocityThreshold: number = 40000;

    /**契约之戒一阶段id */
    public static ringFirst: number = 70007;
    /**契约之戒二阶段id */
    public static ringSecond: number = 70008;
    /** 新玩家ID(用于夜晚怪物) */
    public static NEW_PLAYERID: number[] = [];
    /**正在对话的nPC */
    public static CurTalkNpc: number = -1
    /**正在交互的nPC */
    public static CurInteractNpc: number = -1
    /**是否使用233形象 */
    public static isPlatFormChar: boolean = false
    /**坐骑对象 */
    public static MountRoot: string = '298DAA83'
    /**玩家返回主游戏的时间 s */
    public static returnSchoolTime: number = 600
    /**最大小精灵跟随数量 */
    public static maxFollowSpirit: number = 2
    /**关闭cg */
    public static openCG: boolean = true
    /**小精灵契约时间 */
    public static spiritTime: number = 180
    public static curBuffID: number = 1
    /**龙是否还在 */
    public static isBoss: boolean = true

    /**存在的建筑数量 */
    public static LiveWall: number = 0

    /**当前上传材料的建筑 */
    public static upBuild: string = ''

    /**自动攻击 */
    public static autoBattle = true
    public static isInFlane = false

    /** 等级颜色，用于改变文字、图片颜色 */
    // public static levelColor = ["FFFFFF", "#C1C5FF", "FFDEDB", "77FFAB", "FFA0EC", "FFF44D"]
    public static levelColor = ["#FFFFFF", "#FFDEDB", "#77FFAB", "#C1C5FF", "#FFA0EC", "#FFF44D"]

    public static forceToMain: boolean = false

    //****        掉落金币
    //拾取范围
    public static resourceToPlayer: number = 200;
    /**物理贝塞尔 */
    public static physicsBezier: number[] = [.3, .05, .71, .97];
    /**掉落物随机生成半径 */
    public static randomRadius: number[] = [100, 300];
    /**高度随机范围 */
    public static heightRandoms: number[] = [100, 300];
    /**资源纵坐标 */
    public static resourceYArr: number[] = [3366, 3366];
    /**掉落到地面的耗时 */
    public static dropTime: number = 500;
    /**朝目标方向滚动的概率 */
    public static rollProbability: number = 0.5;
    /**滚动距离范围 */
    public static rollDistanceRandoms: number[] = [100, 200];
    /**滚动耗时范围 不建议用速度转换时间 距离太短情况下基本没效果 */
    public static rollTime: number[] = [500, 800];
    /**销毁时间 */
    public static destroyTime: number = 60;
    /**弹跳的概率 */
    public static bonceProbability: number = 0.5;
    /**弹跳的间隔 秒 */
    public static bonceTime: number = 2;
    /**弹跳高度范围 */
    public static bonceHeight: number[] = [30, 70];
    /**往上跳时间 */
    public static bonceUpTime: number = 300;
    /**往上跳贝塞尔 （直接用缓动停止函数了 该贝塞尔没用 觉得效果不好可换） */
    public static bonceUpBezier: number[] = [0.33, 1, 0.68, 1];
    /**弹跳下落时间 (下落直接用了弹跳函数)*/
    public static bonceDownTime: number = 300;
    /**飞到人身上的贝塞尔 */
    public static flyToPlayerBezier: number[] = [.38, .02, .87, -0.05];
    /**飞到人身上的时间 不建议用速度转换时间 距离太短情况下基本没效果 */
    public static flyToPlayerTime: number = 200;
    /**一帧喷多少个 */
    public static frameNum: number = 2;
    /**相对人物 X 距离开始销毁 */
    public static playerDistance: number = 5000;
    /**拾取距离 */
    public static fetchjDistance: number = 300;
    /**个数达到X 开始判断距离，进行叠 */
    public static stackNum: number = 100;
    /**下车时相对坐标 */
    public static vehicle_unDriverRelativeLoc: mw.Vector = new mw.Vector(-50, -120, 50);
    /**下车时相对旋转 */
    public static vehicle_unDriverRelativeRot: mw.Rotation = new mw.Rotation(0, 0, 90);
    /**车辆自动销毁距离 */
    public static readonly VechicleDestoryDis: number = 9000 * 9000;
    public static BulletWeapon: number[] = [140006, 140011, 140012, 140016]
    public static curZombieMoveSoundCout = 0
    /**租赁时间 */
    public static rentTime = 5 * 60;
    public static LoseDistance = 2500
    /**红星瞄准 */
    public static RedAnimMid: string = ''
    /**红星瞄准 */
    public static RedAnimPos: Vector = Vector.zero
    /**是否在太空站内 */
    public static inSpaceStation: boolean = false
    /**是否在小行星上面 */
    public static inPlanetSurface: boolean = false
    public static playerInBattle: boolean = false
    public static isPlayerMove: boolean = false
}