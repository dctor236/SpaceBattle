/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2023-04-25 15:45
 * @LastEditTime : 2023-05-24 14:25
 * @description  : 
 */

import { LogMgr } from "./LogMgr";

/**
 * 获取坐标是否在范围內，忽略Z范围
 */
export function isRangeReferZ(pos1: mw.Vector, pos2: mw.Vector, range: number, rz: number = 80) {
    if (Math.abs(pos1.z - pos2.z) > rz)
        return false
    return mw.Vector.squaredDistance(pos1, pos2) <= range * range;
}
/**
 * 异步给一个对象添加脚本
 * @param guid 脚本资源GUID
 * @param root 挂载对象
 * @param replicate 同步
 * @returns 添加好的脚本
 */
export async function addScript<T extends mw.Script>(guid: string, root: mw.GameObject, replicate: boolean = true) {
    if (!root) {
        LogMgr.Inst.error('脚本[' + guid + ']宿主对象不存在')
        return;
    }
    const sc = await mw.Script.spawnScript(guid, replicate, root);
    return sc as T;
}

// export function waitForTrue(condition: () => boolean): Promise<void> {
//     return new Promise((resolve) => {
//         const intervalId = setInterval(() => {
//             if (condition()) {
//                 clearInterval(intervalId)
//                 resolve()
//             }
//         }, 100); 
//     });
// }

/**
 * 角度sin值
 * @param angel 角度
 * @returns 
 */
export function sin(angel: number) {
    return Math.sign(angel / 57.296);
}
/**
 * 最多保留len位小数，负数略小
 * @param pos 
 * @param len 
 */
export function formatPos(pos, len: number = 2) {
    let v = Math.pow(10, len);
    pos.x = Math.floor(pos.x * v) / v;
    pos.y = Math.floor(pos.y * v) / v;
    if (pos.z)
        pos.z = Math.floor(pos.z * v) / v;
    return pos;
}
/**
 * 旋转值-180~180
 * @param rot 
 */
export function formatRot(rot: mw.Rotation) {
    rot.x = formatV(rot.x);
    rot.y = formatV(rot.y);
    rot.z = formatV(rot.z);
    return rot;
}
function formatV(v) {
    v = v % 360;
    if (v > 180)
        v -= 360;
    else if (v < -180)
        v += 360;
    return v
}
/**
 * 将坐标归整
 * @param pos 
 */
export function setPosInt(pos: mw.Vector): mw.Vector {
    pos.x = pos.x > 0 ? Math.ceil(pos.x) : Math.floor(pos.x);
    pos.y = pos.y > 0 ? Math.ceil(pos.y) : Math.floor(pos.y);
    pos.z = pos.z > 0 ? Math.ceil(pos.z) : Math.floor(pos.z);
    return pos;
}
/**
 * 
 * @param min 最小值
 * @param max 最大值
 */
export function random(min: number, max: number): number {
    var rang = max - min;
    var rand = Math.random() * rang;
    return Math.floor(rand) + min;
}
/**
 * 获取文本长度，中文算1.7个字符
 * @param str 文本
 * @returns 
 */
export function getStrLen(str: string): number {
    let num = 0;
    for (let i = 0; i < str.length; i++) {
        let txt = str[i];
        if (/[\u4e00-\u9fa5]/.test(txt)) {
            num += 1.7; //汉字
        } else {
            num++; //其他字符
        }
    }
    return num;
}