import { EventsName } from "../../const/GameEnum";
import { GlobalData } from "../../const/GlobalData";
import InteractObject, { InteractiveHelper } from "./interactLogic/InteractObject";
import InteractMgr from "./InteractMgr";
import { InteractModuleClient } from "./InteractModuleClient";

export class InteractModuleServer extends ModuleS<InteractModuleClient, null>  {

    private _waterInteractMap: Map<string, WaterInteract> = new Map();

    onStart(): void {
        Player.onPlayerLeave.add((player: mw.Player) => {
            try {
                this.unActiveInteract(player.playerId)
            }
            catch (e) {

            }
        });
        Event.addClientListener(EventsName.CancelActive, (player) => {
            this.unActiveInteract(player.playerId)
        })
        Event.addLocalListener(EventsName.CancelActive, (playerID: number) => {
            this.unActiveInteract(playerID)
        })

        // Event.addLocalListener(EventsName.INTERACTOR_INTERACT, this.waterInteractUse);
    }

    public net_EnterScene() {
        InteractMgr.instance.initInteract()
    }

    private unActiveInteract(playerID: number) {
        if (Player.getPlayer(playerID)) {
            this.getClient(playerID).net_UnActiveInteract()
            InteractiveHelper.onPlayInteract(playerID, false);
            let interacts = InteractMgr.instance.findInteract(playerID)
            if (interacts.length > 0) {
                for (const interact of interacts) {
                    interact.logic.onPlayerAction(playerID, false)
                    if (interact.own) {
                        interact.ownerPlayerIds[0] = 0
                    } else {
                        interact.ownerPlayerIds[interact.ownerPlayerIds.indexOf(playerID)] = 0
                    }
                }
            }
        }
    }

    public net_ActiveHandle(guid: string, flag: boolean, playerId: number) {
        const interact = InteractMgr.instance.getInteract(guid)
        if (!interact) return
        if (flag) {
            if (interact.own && interact.ownerPlayerIds[0] != 0) {
                return "有人了";
            }
            // if (InteractiveHelper.playInteractionEnable(player)) {
            //     return "不能同时交互两个交互物";
            // }
            // if (!StringUtil.isEmpty(interact.activeCondition) && !InteractiveHelper.activeConditions(interact.activeCondition)) {
            //     return "外部条件不满足";
            // }
            this.playerAction(interact, playerId, true)
        } else {
            // if (!interact.ownerPlayerIds.includes(playerId)) {
            //     return "未和此物交互";
            // }
            this.playerAction(interact, playerId, false)
        }
    }

    public playerAction(interact: InteractObject, playerId: number, active: boolean, param?: any) {
        if (!interact) return
        if (active) {
            if (interact.own) {
                InteractiveHelper.onPlayInteract(playerId, true);
                interact.ownerPlayerIds[0] = playerId
            } else {
                if (interact.ownerPlayerIds.includes(0)) {
                    interact.ownerPlayerIds[interact.ownerPlayerIds.indexOf(0)] = playerId
                } else {
                    interact.ownerPlayerIds.push(playerId)
                }
            }
        } else {
            if (interact.own) {
                InteractiveHelper.onPlayInteract(playerId, false);
                interact.ownerPlayerIds[0] = 0
            } else {
                interact.ownerPlayerIds[interact.ownerPlayerIds.indexOf(playerId)] = 0
            }
        }
        interact.logic.onPlayerAction(playerId, active, param)
        if (interact.nextInteractGuid != "" && !interact.blockInteractNext) {
            this.playerAction(InteractMgr.instance.getInteract(interact.nextInteractGuid), playerId, active, param)
        }
    }

    public waterInteractUse = (name: string, active: boolean, playerID: number) => {
        if (this._waterInteractMap.size <= 0) {
            this.initWater();
        }
        let waterInteract = this._waterInteractMap.get(name);
        if (!waterInteract) {
            return;
        }

        let player: mw.Player = Player.getPlayer(playerID);
        if (active) {
            this.waterInteractMove(waterInteract, true);
            player && (player.character.gravityScale = 0);
            waterInteract.moveInterval = setInterval(() => {
                this.waterInteractMove(waterInteract);
            }, 1000)
        } else {
            clearInterval(waterInteract.moveInterval);
            player && (player.character.gravityScale = 1);
            waterInteract.mover.enable = false;
        }
    }

    private initWater() {
        // let parent = GameObject.findGameObjectById(GlobalData.waterInteractorParent);

        // let childen = parent.getChildren();
        // for (let i = 0; i < childen.length; i++) {
        //     let go = childen[i];
        //     let mover = go.getChildByName("运动器");
        //     let waterInteract = new WaterInteract();
        //     waterInteract.go = go;
        //     waterInteract.mover = mover as mw.IntegratedMover;
        //     waterInteract.startVec = go.worldTransform.position.clone();
        //     this._waterInteractMap.set(go.name, waterInteract);
        // }
    }

    private waterInteractMove(waterInteract: WaterInteract, force: boolean = false) {
        let curLoc = waterInteract.go.worldTransform.position.clone();
        let vec: Vector = waterInteract.mover.linearSpeed;
        let vec2: Vector2 = Vector2.zero;
        let positive: boolean
        waterInteract.mover.enable = true;
        waterInteract.mover.linearRepeatTime = 10;

        if (Math.abs(curLoc.x - waterInteract.startVec.x) >= 100 && Math.abs(curLoc.y - waterInteract.startVec.y) >= 100) {
            // x,y方向同时超出限制
            vec2.x = Math.random() * 5 + 2
            vec2.y = Math.random() * 5 + 2
            vec.x = curLoc.x - waterInteract.startVec.x > 0 ? -vec2.x : vec2.x;
            vec.y = curLoc.y - waterInteract.startVec.y > 0 ? -vec2.y : vec2.y;
        } else if (Math.abs(curLoc.x - waterInteract.startVec.x) >= 100) {
            // x方向超出限制
            positive = curLoc.x - waterInteract.startVec.x > 0;
            vec2 = this.getRandomVec2(!positive);
            vec.x = vec2.x;
            vec.y = vec2.y;
        } else if (Math.abs(curLoc.y - waterInteract.startVec.y) >= 100) {
            // y方向超出限制
            positive = curLoc.y - waterInteract.startVec.y > 0;
            vec2 = this.getRandomVec2(!positive);
            vec.x = vec2.y;
            vec.y = vec2.x;
        } else if (force) {
            vec2.x = Math.random() * 10 + 5
            vec2.y = Math.random() * 10 + 5
            vec.x = Math.random() > 0.5 ? vec2.x : -vec2.x;
            vec.y = Math.random() > 0.5 ? vec2.y : -vec2.y;
        }

        if (curLoc.z - waterInteract.startVec.z >= 10) {
            vec.z = Math.random() * -5 - 2;
        } else if (curLoc.z - waterInteract.startVec.z <= -10) {
            vec.z = Math.random() * 5 + 2;
        } else if (force) {
            let z = Math.random() * 5 + 2
            vec.z = Math.random() > 0.5 ? z : -z;
        }

        waterInteract.mover.linearSpeed = vec;
    }

    private getRandomVec2(positive: boolean): Vector2 {
        let vec2: Vector2 = new Vector2(0, 0);
        let x = Math.random() * 10 + 5;
        let y = Math.random() * 10 + 5;
        vec2.x = positive ? x : -x;
        vec2.y = Math.random() > 0.5 ? y : -y;
        return vec2;
    }
}

class WaterInteract {
    go: mw.GameObject;
    startVec: Vector;
    mover: mw.IntegratedMover;
    moveInterval: number;
}