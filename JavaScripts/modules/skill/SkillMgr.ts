/** 
 * @Author       : xianjie.xia
 * @LastEditors  : 田可成
 * @Date         : 2023-03-05 11:13
 * @LastEditTime : 2023-04-07 14:20:20
 * @description  : 
 */

import { Class } from "../../const/GlobalData";
import { ICastParam } from "./define/SkillDefine";
import SkillBase from "./logic/SkillBase";


export default class SkillMgr {

    private static _inst: SkillMgr;

    public static get Inst() {
        if (!this._inst)
            this._inst = new SkillMgr();
        return this._inst;
    }

    public skillClassMap: Map<number, Class<SkillBase>> = new Map()
    public skillArr: SkillBase[] = []

    /**
     * 使用技能
     * @param host 技能主
     * @param id 技能ID
     * @param param 释放参数
     * @returns 
     */
    public useSkill(host: mw.Character, id: number, param?: ICastParam) {
        // SkillPool.getPool(id).spawn().active(host, param)
    }
} 