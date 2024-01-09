/**
 * @Author       : 田可成
 * @Date         : 2023-05-08 17:14:37
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-06-05 10:31:06
 * @FilePath     : \mollywoodschool\JavaScripts\modules\player\base\IPlayerModuleBase.ts
 * @Description  : 
 */
export default interface IPlayerModuleBase {
     Cloth
     HeadUI
     State
     Action
     getDataByPlayer(player: mw.Player | number)
}