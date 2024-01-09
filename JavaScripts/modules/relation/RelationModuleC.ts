/** 
 * @Author       : 陆江帅
 * @Date         : 2023-05-09 09:41:39
 * @LastEditors  : 陆江帅
 * @LastEditTime : 2023-05-14 13:45:16
 * @FilePath     : \mollywoodschool\JavaScripts\modules\relation\RelationModuleC.ts
 * @Description  : 
 */
import { UIManager } from "../../ExtensionType";
import { GameConfig } from "../../config/GameConfig";
import { GlobalData } from "../../const/GlobalData";
import { GlobalModule } from "../../const/GlobalModule";
import { PlayerMgr } from "../../ts3/player/PlayerMgr";
import Tips from "../../ui/commonUI/Tips";
import { ItemInfo } from "../bag/BagDataHelper";
import { BagModuleC } from "../bag/BagModuleC";
import { BagUtils } from "../bag/BagUtils";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";
import RelationData, { ContractType } from "./RelationData";
import RelationModuleS from "./RelationModuleS";
import { RelationInteract } from "./ui/RelationInteract";

export enum ResponseType {
    /**已有契约 */
    Completed = 1,
    /**拒绝契约 */
    Refuse,
    /**接受契约 */
    Accept
}


export default class RelationModuleC extends ModuleC<RelationModuleS, RelationData>{

    private _selfDesign: string = "";
    private _otherUserID: string = "";

    public get covenanter() {
        return this.data.covenanter
    }

    public get connects() {
        return this.data.connects
    }

    public get designations() {
        return this.data.designations
    }

    public get times() {
        return this.data.times
    }

    public get lastContract() {
        return this.data.lastContract;
    }

    protected onStart(): void {

    }

    public checkContract() {
        const timeLst = Object.keys(this.times)
        for (const type of timeLst) {
            const time = this.times[type]
            if (Date.now() >= time) {
                switch (type) {
                    case ContractType.Ring:
                        this.releaseRelationship(ContractType.Ring);
                        break;
                    default:
                        break;
                }
            }
        }
    }

    /**
     * 发送邀请契约
     * @param invitee 被邀请人
     * @param self    对自己的称号
     * @param other   对他人的称号
     */
    sendInvite(invitee: number, self: string, other: string, skillID: number) {
        this._selfDesign = self;
        const userID = AccountService.getUserId();
        switch (skillID) {
            case 208101:
                this.server.net_SendInvite(ContractType.Ring, invitee, userID, self, other)
                break;
            default:
                break;
        }
        /**埋点 */
        MGSMsgHome.contractEvent("ContractInitiation1")
    }

    /**
     * 收到邀请契约
     * @param inviter 邀请人
     * @param self    对自己的称号
     * @param other   对他人的称号
     */
    net_OnInvited(contractType: ContractType, inviter: number, userID: string, self: string, other: string) {
        /**埋点 */
        MGSMsgHome.contractEvent("ContractAcceptance1")
        if (this.connects[contractType]) {
            this.responseInvite(contractType, inviter, ResponseType.Completed)
            return;
        }
        this._selfDesign = self;
        this._otherUserID = userID;
        UIManager.show(RelationInteract, contractType, inviter, self, other)
    }

    /**
     * 被邀请者回应邀请契约
     * @param contractType 
     * @param inviter 
     * @param responseType 
     */
    responseInvite(contractType: ContractType, inviter: number, responseType: ResponseType) {
        if (responseType === ResponseType.Accept) {
            /**埋点 */
            MGSMsgHome.contractEvent("ContractAcceptance2")
            const name = BagUtils.getName(inviter)
            this.buildRelationship(contractType, this._otherUserID, name, this._selfDesign);
        }
        const openId = AccountService.getUserId()
        const userID = AccountService.getUserId();
        this.server.net_ResponseInvite(contractType, inviter, userID, openId, responseType)
    }

    /**
     * 邀请者收到回应
     * @param contractType 
     * @param invitee 
     * @param openId 
     * @param responseType 
     * @returns 
     */
    net_OnResponse(contractType: ContractType, invitee: number, userID: string, openId: string, responseType: ResponseType) {
        const name = BagUtils.getName(invitee)
        UIManager.hide(RelationInteract)
        if (responseType === ResponseType.Completed) {
            Tips.show(name + GameConfig.SquareLanguage.Relation_08.Value);
            return;
        }
        if (responseType === ResponseType.Refuse) {
            Tips.show(name + GameConfig.SquareLanguage.Danmu_Content_1074.Value);
            return;
        }
        /**埋点 */
        MGSMsgHome.contractEvent("ContractInitiation2")
        Tips.show(name + GameConfig.SquareLanguage.Danmu_Content_1073.Value);
        this.buildRelationship(contractType, userID, name, this._selfDesign)
        AccountService.addFriend(() => { }, openId, "")
    }

    /**
     * 建立契约
     * @param type 
     * @param name 
     * @param designation 
     */
    public buildRelationship(type: ContractType, id: string, name: string, designation: string) {
        this.contractItem(type)
        this.data.buildRelationship(type, id, name, designation)
        this.server.net_BuildRelationship(type, id, name, designation)
        // GlobalModule.MyPlayerC.HeadUI.resetTitle()
        PlayerMgr.Inst.resetTitle(1)
    }

    /**
     * 解除契约
     * @param type 
     */
    public releaseRelationship(type: ContractType) {
        this.clearItem(type)
        this.data.releaseRelationship(type)
        this.server.net_ReleaseRelationship(type)
    }

    private contractItem(type: ContractType) {
        const bagModuleC = ModuleService.getModule(BagModuleC);
        let item: ItemInfo;
        switch (type) {
            case ContractType.Ring:
                item = bagModuleC.getItem(GlobalData.ringFirst);
                break;
            default:
                break;
        }
        if (item) {
            bagModuleC.useConsumeItem(item.id);
        }
        bagModuleC.addItem(GlobalData.ringSecond)
    }

    private clearItem(type: ContractType) {
        const bagModuleC = ModuleService.getModule(BagModuleC);
        let item: ItemInfo;
        switch (type) {
            case ContractType.Ring:
                item = bagModuleC.getItem(GlobalData.ringSecond);
                break;
            default:
                break;
        }
        if (item) {
            bagModuleC.useConsumeItem(item.id);
            bagModuleC.notifyList.push(type);
        }
    }
}