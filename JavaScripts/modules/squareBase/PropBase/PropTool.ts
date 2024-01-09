import { PropBase, PropBase_Action, PropBase_Fly, PropBase_Placement } from "./PropBase";

/**
 * 完成资源加载
 * @param guid 加载GUID 
 * @returns
 */
export function loadAssetEnd(guid: string): Promise<boolean> {
    if (guid === null || guid === undefined) return;
    return new Promise(async (res) => {
        let isSuccess: boolean = false
        if (!AssetUtil.assetLoaded(guid))
            isSuccess = await AssetUtil.asyncDownloadAsset(guid)
        return res(isSuccess)
    })
}
export function loadAssets(guids: string[]): Promise<{ 'successCount': number, 'failCount': number }> {
    return new Promise(async (res) => {
        const count = guids.length;
        let value = { 'successCount': 0, 'failCount': 0 }
        guids.forEach(async guid => {

            if (!AssetUtil.assetLoaded(guid)) {
                AssetUtil.asyncDownloadAsset(guid).then(success => {
                    if (success)
                        value.successCount++
                    else
                        value.failCount++;
                    if (value.successCount + value.failCount >= count)
                        return res(value)
                })
                return;
            }
            value.successCount++
            if (value.successCount + value.failCount >= count)
                return res(value)
        })
    })
}

/**
 * 返回第一位数字
 * @param num 
 * @returns 
 */
export function mathTools_firstPlaceNumber(num: number): number {
    return Math.floor(num / Math.pow(10, Math.floor(Math.log10(num))));
}
/**
 * 前两位数字
 * @param num 
 * @returns 
 */
export function mathTools_topTwoPlaceNumber(num: number): number {
    return Math.floor(num / Math.pow(10, Math.floor(Math.log10(num) - 1)));
}
/**
 * 数组转位置，旋转，缩放
 * @param arr 9位数组
 * @returns 转换后的结构
 */
export function mathTools_arryToVector(arr: Array<number>): { loc: mw.Vector, Roc: mw.Rotation, Scale: mw.Vector } {
    if (arr.length == 9) {
        let newArr: { loc: mw.Vector, Roc: mw.Rotation, Scale: mw.Vector } = { loc: new mw.Vector(arr[0], arr[1], arr[2]), Roc: new mw.Rotation(arr[3], arr[4], arr[5]), Scale: new mw.Vector(arr[6], arr[7], arr[8]) };
        return newArr;
    }
}
/**
 * 判空
 * @param value 输入值
 * @returns false空，true不为空
 */
export function mathTools_isEmpty(value: any, tip?: string): boolean {
    if (value != "" && value != null && value != undefined && value != 0) {
        // console.log(`mathTools_isEmpty :: ==== :: ${value} :: return true :: empty`);
        return true;
    } else {
        return false;
    }
}
/**
 * 实例一个道具
 * @param propId 道具ID
 * @param modelGuid 模型Guid
 * @returns 实例道具
 */
export async function propTool_IdToScript(propId: number, modelGuid: string): Promise<PropBase> {
    switch (mathTools_firstPlaceNumber(propId)) {
        case PropBaseType.Action:
            let action = new PropBase_Action(modelGuid, propId)
            await action.init()
            return action
        case PropBaseType.Fly:
            let fiy = new PropBase_Fly(modelGuid, propId);
            await fiy.init()
            return fiy
        case PropBaseType.Placement:
            let placement = new PropBase_Placement(modelGuid, propId);
            await placement.init()
            return placement
        default:
            //TODO
            return null;
    }
}
/**
 * 道具枚举
 */
export enum PropBaseType {
    /** 动作类 */
    Action = 1,
    /** 飞行类 */
    Fly = 2,
    /** 放置类 */
    Placement = 3
    //TODO 新加道具枚举
}
/**
 * 道具对象池
 */
export class PropBasePool {
    //道具对象池
    private static map_propPool: Map<number, Array<PropBase>> = new Map();
    /**
     * 给予一个道具
     * @param propIndex 道具ID
     * @param modelGuid 模型Guid
     * @returns 道具
     */
    public static async spanProp(propIndex: number, modelGuid: string): Promise<PropBase> {
        if (this.map_propPool.has(propIndex)) {
            if (this.map_propPool.get(propIndex).length > 0) {
                let typePool = this.map_propPool.get(propIndex);
                let curProp = typePool.pop();
                this.map_propPool.set(propIndex, typePool);
                return curProp;
            } else {
                let spanProp = await propTool_IdToScript(propIndex, modelGuid);
                return spanProp;
            }
        } else {
            let spanProp = await propTool_IdToScript(propIndex, modelGuid);
            return spanProp;
        }
    }
    public static unSpanProp(prop: PropBase) {
        if (this.map_propPool.has(prop._id)) {
            let arrProp = this.map_propPool.get(prop._id);
            arrProp.push(prop);
            this.map_propPool.set(prop._id, arrProp);
        } else {
            this.map_propPool.set(prop._id, [prop]);
        }
    }
}
