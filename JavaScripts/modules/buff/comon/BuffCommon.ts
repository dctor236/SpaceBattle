/**
* @Author       : MengYao.Zhao
* @Date         : 2022/04/13 10:51:51
* @Description  :  buff用到的一些通用数据,枚举, 通用函数...
*/

/**
 * 生成buff到玩家身上的数据结构  宿主playerId, buff动态id,buff静态id, 角色插槽位置索引,相对位置，相对朝向，缩放 
 */
export type BuffSpawnInPlayerData = { playerId: string, id: number, configId: number, slotIndex: number, lPos: number[], lRot: number[], scale: number[] };

/**
 * 生成buff到物体身上的数据结构  宿主guid, buff动态id,buff静态id,  相对位置，相对朝向，缩放 
 */
export type BuffSpawnInObjData = { objGuid: string, id: number, configId: number, lPos: number[], lRot: number[], scale: number[] };

/**
 * 生成buff到世界位置上的数据结构    buff动态id,buff静态id,世界位置，世界朝向，缩放 
 */
export type BuffSpawnInPlaceData = { id: number, configId: number, wPos: number[], wRot: number[], scale: number[] };

/**
 * 定义buff类的类形状
 */
export type BuffClass<T> = { new(...arg): T };

/**
 * 转换数组到Vector
 * @param pos number[3] 
 * @param defaultValue  不存在时默认分量值
 * @returns 
 */
export function convertArrayToVector(pos: number[], defaultValue: number = 0): mw.Vector {
    return pos == null ? new mw.Vector(defaultValue) : new mw.Vector(pos[0] == null ? defaultValue : pos[0], pos[1] == null ? defaultValue : pos[1], pos[2] == null ? defaultValue : pos[2]);
}

/**
 * 转换数组到Rotation,不存在则默认到标准朝向
 * @param rot number[3]   
 * @returns 
 */
export function convertArrayToRotation(rot: number[]): mw.Rotation {
    return rot == null ? mw.Rotation.zero : new mw.Rotation(rot[0] == null ? 0 : rot[0], rot[1] == null ? 0 : rot[1], rot[2] == null ? 0 : rot[2]);
}





/**
 * Buff的生成规则
 */
export enum EBuffSpawnRule {
    /**
     * 后端做逻辑，通知前端做表现
     */
    Client = 0,
    /**
     * 后端做逻辑，后端做双端表现，前端不参与
     */
    Server = 1,
    /**
     * 仅有后端逻辑，无任何表现，前端不参与
     */
    OnlyLogic = 2,
}

/**
 * buff宿主类型
 */
export enum EBuffHostType {
    /**
     * 表示无宿主，放在世界位置的
     */
    None = 0,
    /**
     * 技能对象，也就是玩家
     */
    Player = 1,
    /**
     * 物体上
     */
    GameObject = 2
}

/**
 * buff效果类型
 */
export enum EBuffBenefitType {
    /**
     * 无效的
     */
    None = 0,
    /**
     * 属性变化
     */
    PropertyChange = 1,
    /**
     * 免控
     */

    UnControl = 2,
    /**
     * 晕眩
     */
    Stun = 3,
    BeatFly = 4
}

/**
 * buff的叠加方式
 */
export enum EBuffOverlayType {
    /**
     * 独占的，表示宿主身上只能有一个
     */
    Only = 0,
    /**
     * 可叠加的，允许多个同id的buff存在
     */
    Overlap = 1,
    /**
     * 没有该类型的buff就是新的，有就在旧buff上追加时间
     */
    AddTime = 2,
    /**
     * 没有该类型的buff就是全新的，有就是旧buff上刷新时间
     */
    RefreshTime = 3
}

/**
 * buff的生命周期类型
 */
export enum EBuffLifecycleType {
    /**
     * 永远存在的
     */
    Forever = 0,
    /**
     * 受时间限制
     */
    LimitByTime = 1,
    /**
     * 受触发次数限制
     */
    LimitByTriggerCount = 2
}

/**
 * buff参数的数值代表的类型
 */
export enum EBuffParamType {
    /**
     * 值类型
     */
    Value = 0,
    /**
     * 百分比类型
     */
    Percent = 1
}

/**
 * 子buff的生成时机
 */
export enum EBuffTriggerOpportunity {
    /**
     * 无效的
     */
    None = 0,
    /**
     * 在初始化完成后执行时
     */
    OnExecute = 1,
    /**
     * 在每次效果触发时触发
     */
    OnTrigger = 2
}
