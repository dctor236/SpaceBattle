/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-05-31 23:54:21
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-01 01:26:24
 * @FilePath: \vine-valley\JavaScripts\modules\tour\TourModuleC.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { UIManager } from "../../ExtensionType";
import MountHead_Generate from "../../ui-generate/tour/MountHead_generate";
import TourModuleS, { MountName, MountType } from "./TourModuleS";
//坐骑观光系统
export default class TourModuleC extends ModuleC<TourModuleS, null>  {

    public mountMap: Map<MountType, mw.Character> = new Map()

    public net_InitMounName(index: MountType, objGuid: string) {
        GameObject.asyncFindGameObjectById(objGuid).then((o) => {
            let mount: mw.Character = o as mw.Character
            const nameWUI = mount.overheadUI
            const nameUI = UIManager.getUI(MountHead_Generate, true)
            nameWUI.setTargetUIWidget(nameUI.uiWidgetBase)
            nameWUI.selfOcclusion = false
            nameWUI.occlusionEnable = false
            // nameWUI.hideByDistanceEnable = false;
            nameWUI.scaledByDistanceEnable = true
            nameUI.mName.text = MountName[index - 1]
            mount.overheadUI.setVisibility(mw.PropertyStatus.On)
            nameWUI.drawSize.set(nameUI.rootCanvas.size)
            nameWUI.localTransform.position = new Vector(0, 0, 50)
            nameWUI.refresh()
            this.mountMap.set(index, mount)
        })
    }

    public getMount(type: MountType) {
        return this.mountMap.get(type)
    }
}