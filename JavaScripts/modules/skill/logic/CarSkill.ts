// /*
//  * @Author: 代纯 chun.dai@appshahe.com
//  * @Date: 2023-07-19 20:50:11
//  * @LastEditors: 代纯 chun.dai@appshahe.com
//  * @LastEditTime: 2023-07-19 20:54:02
//  * @FilePath: \mollywoodschool\JavaScripts\modules\skill\logic\CarSkill.ts
//  * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
//  */
// /**
//  * @Author       : xianjie.xia
//  * @LastEditors  : 田可成
//  * @Date         : 2023-07-05 18:42
//  * @LastEditTime : 2023-07-19 16:47:50
//  * @description  :
//  */
// /**
//  * @Author       : 田可成
//  * @Date         : 2023-04-25 17:13:15
//  * @LastEditors  : 田可成
//  * @LastEditTime : 2023-06-12 19:12:32
//  * @FilePath     : \mollywoodschool\JavaScripts\modules\skill\logic\CarSkill.ts
//  * @Description  :
//  */
// import { EventsName, SkillState } from "../../../const/GameEnum";
// import { GlobalData } from "../../../const/GlobalData";
// import VehicleMC from "../../vehicle/VehicleMC";
// import SkillBase, { registerSkill } from "./SkillBase";

// @registerSkill(3121)
// export class CarSkill extends SkillBase {



//     private _curPet: number = 0
//     protected onStart(...params: any[]): boolean {
//         if (this.Charge == 0 || GlobalData.skillCD > 0 || this.State < 0) return false;
//         const carID = Number(this.skillLevelConfig.Param1)
//         if (this.State == SkillState.Enable) {
//             ModuleService.getModule(VehicleMC).reqCreatCar(carID).then(res => {
//                 if (res) {
//                     this.State = SkillState.Using
//                     this._curPet = carID;
//                 }
//                 else
//                     this.State = SkillState.Enable

//             })
//         } else {
//             this.reCallPet(carID)
//         }
//         Event.dispatchToLocal(EventsName.UseSkill, this.itemID, this.skillID)
//         GlobalData.skillCD = GlobalData.defaultCD
//         return true;
//     }

//     private async reCallPet(carID: number) {
//         await ModuleService.getModule(VehicleMC).reqDestroyCar()
//         if (this._curPet != carID) {
//             ModuleService.getModule(VehicleMC).reqCreatCar(carID).then(res => {
//                 if (res) {
//                     this.State = SkillState.Using
//                     this._curPet = carID;
//                 }
//                 else
//                     this.State = SkillState.Enable

//             })
//         } else {
//             this.onOver()
//         }
//     }

//     public onRemove(): void {

//     }

// }