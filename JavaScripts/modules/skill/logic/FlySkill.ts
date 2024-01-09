import { GameConfig } from "../../../config/GameConfig";
import { EventsName, PlayerStateType, SkillState } from "../../../const/GameEnum";
import { GlobalData } from "../../../const/GlobalData";
import { GlobalModule } from "../../../const/GlobalModule";
import Tips from "../../../ui/commonUI/Tips";
import GameUtils from "../../../utils/GameUtils";
import ActionMC from "../../action/ActionMC";
import { BagModuleC } from "../../bag/BagModuleC";
import { updater } from "../../fight/utils/Updater";
import GravityCtrlMgr from "../../gravity/GravityCtrlMgr";
import SkillBase, { registerSkill } from "./SkillBase";

@registerSkill(2011)
export class FlySkill extends SkillBase {
    private _linsnter: mw.EventListener
    private _inGame: boolean = false
    private _flyTime: number = 0
    private _flyStance
    private _modelID: number = 0
    private _effectID: number = 0
    private _clothId: number = 0
    private _flyTimeout
    private _curselName: string = ''
    private timeVec: any[] = []

    public init(): void {
        // this.disableState.push(PlayerStateType.Interaction, PlayerStateType.DoublePeopleAction)
        // this.skillState = SkillState.Using
        super.init()
        this.disableState = PlayerStateType.Interaction
    }

    protected onStart(...params) {
        if (GlobalData.skillCD > 0 || GlobalModule.MyPlayerC.State.getMyAction().includes(PlayerStateType.Interaction) || this.State < 0) return false;
        if (this.State != SkillState.Enable) {
            this.onOver()
        } else {

        }
        this.timeVec.forEach(e => {
            clearTimeout(e)
        })
        this.timeVec.length = 0
        const widget = this.character.overheadUI
        widget.parent = null
        this.character.attachToSlot(widget, mw.HumanoidSlotType.Head)
        if (this.skillConfig.ID == 201122) {
            widget.localTransform.position = new Vector(0, 0, -180)
        } else {
            widget.localTransform.position = new Vector(0, 0, 80)
        }
        widget.scaledByDistanceEnable = false
        const tiemr = setTimeout(() => {
            const curSel = ModuleService.getModule(BagModuleC).curEquip
            const itemElem = GameConfig.Item.getElement(curSel)
            if (!itemElem) return
            this._curselName = itemElem.Name
            // const vec = ["140006", "140011", "140012", "140016"]
            Tips.show(GameUtils.getTxt("Tips_1017") + this._curselName)
            this.State = SkillState.Using
            GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Fly, true)
            const param = this.skillLevelConfig.Param1.split("|")
            this.attachPlayer(param[0], param[1], param[2], param[3], param[4])
            Event.dispatchToLocal(EventsName.UseSkill, this.itemID, this.skillID)
            GlobalData.skillCD = GlobalData.defaultCD
            GravityCtrlMgr.instance.simulate(false)
        }, 200);
        this.timeVec.push(tiemr)
        return true;
    }


    private _flag: boolean = true
    tmpVec: Vector = Vector.zero;
    startPos: Vector = Vector.zero;
    endPos: Vector = Vector.zero;
    private flyUpDown(dt: number) {
        if (!this.character.getVisibility()) return
        if (this.checkVehicleArea()) return
        if (this._flag) {
            if (Math.abs(this.character.worldTransform.position.z - this.endPos.z) <= 50) {
                this._flag = false
                this.startPos = this.character.worldTransform.position.clone();
                this.endPos = this.character.worldTransform.position.clone().add(new Vector(0, 0, 150));
            } else {
                this.character.worldTransform.position = mw.Vector.lerp(this.character.worldTransform.position, this.endPos.set(this.character.worldTransform.position.x,
                    this.character.worldTransform.position.y, this.endPos.z), dt);
            }
        } else {
            if (Math.abs(this.character.worldTransform.position.z - this.endPos.z) <= 50) {
                this._flag = true
                this.startPos = this.character.worldTransform.position.clone();
                this.endPos = this.character.worldTransform.position.clone().add(new Vector(0, 0, -150));
            } else {
                this.character.worldTransform.position = mw.Vector.lerp(this.character.worldTransform.position, this.endPos.set(this.character.worldTransform.position.x,
                    this.character.worldTransform.position.y, this.endPos.z), dt);
            }
        }
    }


    public checkVehicleArea(): boolean {
        let fourDir = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        let char = Player.localPlayer.character
        let startPos = char.worldTransform.position.clone();
        startPos.z -= char.getBoundingBoxExtent().z / 2;
        for (let index = 0; index < fourDir.length; index++) {
            const element = fourDir[index];
            let toPos = new Vector(startPos.x, startPos.y, startPos.z - 600);
            let hitResult = QueryUtil.lineTrace(toPos, startPos, true, false);
            for (let i = 0; i < hitResult.length; i++) {
                const hit = hitResult[i];
                // console.log("击中的目标", hit.gameObject.name)
                if (hit.gameObject) {
                    if (hit.gameObject.tag == "station")
                        return true;
                }
            }
        }
        return false;
    }

    private async attachPlayer(flyAni: string, standbyAni: string, modelID: string, effectID: string, clothId: string): Promise<boolean> {
        if (!flyAni || flyAni == "") return false
        const speed = this.skillLevelConfig.Damage ? this.skillLevelConfig.Damage : 1000;
        this.character.movementEnabled = false
        this._modelID = Number(modelID)
        this._effectID = Number(effectID)
        this._flyTime = TimeUtil.elapsedTime();
        this._clothId = Number(clothId)
        // const game = ModuleService.getModule(ScheduleModuleC).getGame(17) as Game_Fly
        // this._inGame = game.isEnterGame
        // this._linsnter = Event.addLocalListener(GuideEvent.EndEvent, (id: number) => {
        //     if (id === 17) {
        //         MGSMsgHome.flyTime(1, Math.ceil(TimeUtil.elapsedTime() - this._flyTime))
        //     }
        // })
        if (this._modelID != 0) {
            await GlobalModule.MyPlayerC.Cloth.createStaticModel([this._modelID])
        }
        if (this._effectID != 0) {
            await GlobalModule.MyPlayerC.Cloth.createEffect([this._effectID])
        }
        if (this._clothId != 0) {
            await GlobalModule.MyPlayerC.Cloth.changeRoleAvatar(this._clothId)
            GlobalModule.MyPlayerC.Cloth.saveAvatarData(false)
            this.character.worldTransform.scale = Vector.one.multiply(4)
            Camera.currentCamera.springArm.length = 900
        }
        // let standAnimLength = 0
        // if (standbyAni && standbyAni != "0") {
        //     const anim = PlayerManagerExtesion.loadAnimationExtesion(this.character, standbyAni, true)
        //     anim.loop = 1;
        //     anim.rate = 1
        //     anim.play()
        //     standAnimLength = anim.length
        // }
        // await GameUtils.downAsset(flyAni)
        // this._flyTimeout = setTimeout(() => {
        // this._flyStance = PlayerManagerExtesion.loadStanceExtesion(this.character, flyAni, true)
        // if (this._flyStance) {
        //     this._flyStance.blendMode = mw.StanceBlendMode.WholeBody
        // } else {
        //     this._flyStance = PlayerManagerExtesion.loadAnimationExtesion(this.character, flyAni, true)
        //     this._flyStance.loop = 0
        // }
        // this._flyStance.play()
        ModuleService.getModule(ActionMC).playAction(Number(flyAni))
        this.character.switchToFlying()
        this.character.maxFlySpeed = speed
        this.character.movementEnabled = true
        this._inGame = true
        // }, standAnimLength * 1000);
        return true
    }

    public onOver(): void {
        this.detachPlayer()
        super.onOver()
        const widget = this.character.overheadUI
        widget.parent = null
        this.character.attachToSlot(widget, mw.HumanoidSlotType.Head)
        widget.localTransform.position = new Vector(0, 0, 50)
        widget.scaledByDistanceEnable = true
        const curSel = ModuleService.getModule(BagModuleC).curEquip
        const itemElem = GameConfig.Item.getElement(curSel)
        if (itemElem && itemElem.Name == this._curselName)
            Tips.show(GameUtils.getTxt("Tips_1018") + this._curselName)
        GlobalModule.MyPlayerC.Cloth.resetPlayerCloth();
        this.character.worldTransform.scale = Vector.one;
        this.character.worldTransform.rotation = GlobalData.globalRot
        // Camera.currentCamera.springArm.length = 350
        // const tiemr = setTimeout(() => {
        if (!GlobalData.inSpaceStation && !GlobalData.inPlanetSurface) {
            GravityCtrlMgr.instance.simulate(true)
        }
        // }, 20);
        // this.timeVec.push(tiemr)
    }

    @updater.updateByFrameInterval(40)
    onUpdate(dt) {
        super.onUpdate(dt)
        if (this._inGame && !GlobalData.playerInBattle) {
            if (!GlobalData.isPlayerMove) {
                this.flyUpDown(dt)
            } else {
                this.startPos = this.character.worldTransform.position.clone();
                if (this._flag) {
                    this._flag = false
                    this.endPos = this.character.worldTransform.position.clone().add(new Vector(0, 0, 150));
                } else {
                    this._flag = true
                    this.endPos = this.character.worldTransform.position.clone().add(new Vector(0, 0, -150));
                }
            }
        }
    }

    private detachPlayer() {
        this._inGame = false
        GlobalModule.MyPlayerC.State.setMyState(PlayerStateType.Fly, false)
        if (this._flyTimeout) {
            clearTimeout(this._flyTimeout)
            this.character.movementEnabled = true
            this._flyTimeout = null
        }
        if (this._flyStance) {
            this._flyStance.stop()
            this._flyStance = null;
        }
        // console.log("Jklkjlklfasjklfjklas", this._modelID)
        if (this._modelID != 0) {
            GlobalModule.MyPlayerC.Cloth.clearModel(Number(this._modelID))
        }
        if (this._effectID != 0) {
            GlobalModule.MyPlayerC.Cloth.clearEffect([this._effectID])
        }
        // this.character.switchToWalking()
        this._flyTime = TimeUtil.elapsedTime() - this._flyTime;
        // MGSMsgHome.flyTime(this._inGame ? 1 : 2, Math.ceil(this._flyTime))

        if (this._linsnter) this._linsnter.disconnect();
    }
    public onRemove(): void {
        if (this.State == SkillState.Using) this.onOver()
        super.onRemove();
    }

}