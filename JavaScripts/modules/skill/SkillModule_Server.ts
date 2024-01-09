/*
 * @Author: jiezhong.zhang
 * @Date: 2023-04-06 09:45:11
 * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
 * @LastEditTime: 2023-04-19 10:32:04
 */
import { GameConfig } from "../../config/GameConfig";
import { PlayerStateType } from "../../const/GameEnum";
import SkillBase from "./logic/SkillBase";
import { SkillData } from "./SkillData";
import SkillMgr from "./SkillMgr";
import SkillModule_Client from "./SkillModule_Client";
import BesomMgr from "./skillObj/BesomMgr";

/**
 * @Author       : 田可成
 * @Date         : 2023-03-02 13:33:00
 * @LastEditors  : songxing
 * @LastEditTime : 2023-03-29 10:17:22
 * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\SkillModule_Server.ts
 * @Description  : 
 */
export default class SkillModule_Server extends ModuleS<SkillModule_Client, SkillData>{
    protected onStart(): void {

    }
    protected onPlayerJoined(player: mw.Player): void {
        BesomMgr.instance.onplayerJoin(player)
    }
}