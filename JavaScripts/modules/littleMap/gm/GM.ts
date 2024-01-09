// /*
//  * @Author       : aolin.dai aolin.dai@appshahe.com
//  * @Date         : 2023-02-27 14:10:18
//  * @LastEditors  : aolin.dai aolin.dai@appshahe.com
//  * @LastEditTime : 2023-03-31 10:20:51
//  * @FilePath     : \CommonModule_Map\JavaScripts\modules\gm\GM.ts
//  * @Description  : 
//  */

// import { AddGMCommand, GMBasePanel } from "module_gm";
// // import GMHUD_Generate from "../../ui-generate/gmModule/GMHUD_generate";
// // import GMItem_Generate from "../../ui-generate/gmModule/GMItem_generate";
// import MapHelper from "../helper/MapHelper";


// export default class GM extends GMBasePanel<GMHUD_Generate, GMItem_Generate> {
//     constructor() {
//         super(GMHUD_Generate, GMItem_Generate);
//         GM.instance = this;
//     }

//     static instance: GM = null;

//     public show(): void {
//         this["_view"].layer = mw.UILayerSystem;
//         super.show();
//     }
// }

// export class GMConfigs {

//     /**初始化添加GM命令 */
//     static init() {

//         if (GMConfigs.GMConfig.length > 0) {
//             for (let cfg of GMConfigs.GMConfig) {
//                 cfg && AddGMCommand(cfg.label, cfg.clientCmd, cfg.serverCmd);
//             }
//         }
//     }

//     /**配置GM命令列表 */
//     static GMConfig = [
//         {
//             label: "开关地图",
//             clientCmd: (player: mw.Player, value: string) => {
//                 if (MapHelper.instance) {
//                     MapHelper.instance.toggleMapView(value != "");
//                 }
//             },
//             serverCmd: (player: mw.Player, value: string) => { }
//         },
//         {
//             label: "切换地图",
//             clientCmd: (player: mw.Player, value: string) => {
//                 if (MapHelper.instance) {
//                     MapHelper.instance.shiftMap(Number(value));
//                 }
//             },
//             serverCmd: (player: mw.Player, value: string) => { }
//         },
//     ]
// }