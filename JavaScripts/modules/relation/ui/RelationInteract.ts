import { UIManager } from "../../../ExtensionType";
import { GameConfig } from "../../../config/GameConfig";
import RelationInteract_Generate from "../../../ui-generate/relation/RelationInteract_generate";
import { BagUtils } from "../../bag/BagUtils";
import { ContractType } from "../RelationData";
import RelationModuleC, { ResponseType } from "../RelationModuleC";
import { Relationship } from "./Relationship";


export class RelationInteract extends RelationInteract_Generate {
    private _inviter: number;
    private _contractType: ContractType;
    private _timer: number;

    get relationModuleC() {
        return ModuleService.getModule(RelationModuleC)
    }

    protected onStart(): void {

    }

    protected initButtons(): void {
        super.initButtons();
        this.accept.onClicked.add(() => {
            this.relationModuleC.responseInvite(this._contractType, this._inviter, ResponseType.Accept);
            if (this._timer) {
                clearInterval(this._timer);
                this._timer = null
            }
            this.hide();
        })

        this.refuse.onClicked.add(() => {
            this.relationModuleC.responseInvite(this._contractType, this._inviter, ResponseType.Refuse);
            if (this._timer) {
                clearInterval(this._timer);
                this._timer = null
            }
            this.hide();
        })
    }

    protected onShow(contractType: ContractType, inviter: number, self: string, other: string): void {
        const visible = inviter ? mw.SlateVisibility.Visible : mw.SlateVisibility.Collapsed;
        const isInvited = inviter ? true : false
        this.bg.visibility = visible;
        this.accept.visibility = visible;
        this.refuse.visibility = visible;
        this.countDown(isInvited)
        if (inviter) {
            this._inviter = inviter
            this._contractType = contractType
            const name = this.getPlayerName(inviter);
            this.desc.text = name + GameConfig.SquareLanguage.Relation_03.Value + self;

            const relation = UIManager.getUI(Relationship);
            if (relation.visible) {
                relation.hide();
            }
        }
    }

    protected onHide(): void {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null
        }
    }

    private countDown(isInvited: boolean) {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null
        }
        let count = 10;
        const text = GameConfig.SquareLanguage.Relation_04.Value;
        !isInvited && (this.desc.text = text + count)
        this._timer = setInterval(() => {
            count--;
            !isInvited && (this.desc.text = text + count)
            if (count <= 0) {
                isInvited && this.relationModuleC.responseInvite(this._contractType, this._inviter, ResponseType.Refuse);
                clearInterval(this._timer);
                this._timer = null
                this.hide();
            }
        }, 1000)
    }

    /**
     * 获取玩家姓名
     * @param playerID 
     * @returns 
     */
    private getPlayerName(playerID: number) {
        let str = BagUtils.getName(playerID);
        if (str.length > 5) {
            str = StringUtil.format("{0},{1}", str.substring(0, 5), "...");
        }
        return str;
    }
}