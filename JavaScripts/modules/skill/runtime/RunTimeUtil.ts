/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2022-12-08 17:16
 * @LastEditTime : 2023-03-05 10:11
 * @description  : 
 */

export namespace RunTimeUtil {
    export function getRangeObjs(list: any[], pos, range, dz = -1) {
        let objs = [];
        let pz = pos.z;
        for (let i = 0; i < list.length; i++) {
            let obj = list[i] as mw.GameObject;
            let dest = obj.worldTransform.position.clone();
            if (!dest) {
                console.error('错误的输入对象')
                continue;
            }
            //高度差
            if (dz >= 0 && Math.abs(pz - dest.z) > dz)
                continue;
            pos.z = dest.z = 0;
            let dis = mw.Vector.squaredDistance(pos, dest);
            if (dis <= range)
                objs.push(obj);
        }
        return objs;
    }
    export function getCharacterBase(gameObject: mw.GameObject) {
        let obj = gameObject as mw.Character;
        if (obj.movementEnabled == undefined)
            return null;
        return obj;
    }
}

