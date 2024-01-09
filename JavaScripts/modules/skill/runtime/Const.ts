import { SkillRuntime } from "./SkillRuntime";
/** 
 * @Author       : xianjie.xia
 * @LastEditors  : 田可成
 * @Date         : 2022-12-06 11:24
 * @LastEditTime : 2023-04-26 18:38:14
 * @description  : 
 */


export namespace RuntimeConst {
    export let SEND_RANGE: number = 2000 * 2000// 4000000;
    export let MAX_WALK_SPEED: number = 600;
    export let MAX_ROT_SPEED: number = 100;
    export let PLAYER_ID: number = 0;
    export let PLAYER_GUID: string = '';
    export let CHARACTER: mw.Character = null;
    export const TEMP_VECTOR: mw.Vector = new mw.Vector();
    export const VECTEMP1: mw.Vector = new mw.Vector();
    export const VECTEMP2: mw.Vector = new mw.Vector();
    export let RUNTIME: SkillRuntime;
    export let ClientID: number = 0;
    export let TempV2 = new mw.Vector2(0, 0);
    export let BaseDir = new mw.Vector2(1, 0);


    if (mw.SystemUtil.isClient()) {
        Player.asyncGetLocalPlayer().then(player => {
            let character = player.character;
            MAX_WALK_SPEED = character.maxWalkSpeed;
            MAX_ROT_SPEED = character.rotateRate;
            PLAYER_ID = character.player.playerId;
            CHARACTER = character;
            ClientID = PLAYER_ID;
            PLAYER_GUID = character.gameObjectId;
        });
    }

    export function setTempVector(x: number, y: number, z: number) {
        TEMP_VECTOR.x = x;
        TEMP_VECTOR.y = y;
        TEMP_VECTOR.z = z;
        return TEMP_VECTOR;
    }
}