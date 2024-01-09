import { GlobalData } from "../../const/GlobalData";
import ActionMC from "../action/ActionMC";
import ActionMgr from "../action/ActionMgr";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";

class GravityItem {
    obj: mw.GameObject
    pid: number = -1
    energy: mw.PhysicsThruster
    mover: mw.IntegratedMover
    inteval = null

    init(obj: mw.GameObject) {
        this.obj = obj
        this.energy = this.obj.getChildByName('推进器') as mw.PhysicsThruster
        this.mover = this.obj.getChildByName('运动器') as mw.IntegratedMover
        // setTimeout(() => {
        //     this.mover.enable = true
        // }, 1200);
        // setTimeout(() => {
        //     this.energy.enable = true
        // }, 800);

    }
    destroy() {
        this.energy.enable = false
        this.mover.enable = false
        this.obj.destroy()
        clearInterval(this.inteval)
    }
}


/**失重管理 */
export default class GravityCtrlMgr {
    private static _instance: GravityCtrlMgr;
    cubeList: GravityItem[] = []
    // moverMan: mw.Character = null
    manInitPos: Vector = Vector.zero

    /**正在模拟 */
    isSimpuly: boolean = false

    public static get instance(): GravityCtrlMgr {
        if (GravityCtrlMgr._instance == null) {
            GravityCtrlMgr._instance = new GravityCtrlMgr();
        }
        return GravityCtrlMgr._instance;
    }

    init() {
        GameObject.asyncFindGameObjectById('0FE3D91C').then(o => {
            if (!o) return
            const root = o.getChildByName('方块')
            root.getChildren().forEach(cube => {
                if (this.manInitPos.equals(Vector.zero)) {
                    this.manInitPos = cube.worldTransform.position.clone()
                }
                const item = new GravityItem()
                item.init(cube)
                this.cubeList.push(item)
            })
        })
    }

    stayTime: number = 0

    /**分配一个立方体给玩家模拟 */
    simulate(bool: boolean, pid: number = Player.localPlayer.playerId) {
        // if (this.isSimpuly == bool) return
        const p = Player.getPlayer(pid)
        let res = this.cubeList.find(e => e.pid == pid)
        if (bool) {
            this.stayTime = TimeUtil.time()
            MGSMsgHome.uploadMGS('ts_game_result', '玩家进入漂浮状态时', { record: 'player_float' })
            ModuleService.getModule(ActionMC).playAction(409)
            let item
            if (res) {
                item = res
            } else {
                item = this.cubeList[MathUtil.randomInt(0, this.cubeList.length)]
            }
            p.character.switchToFlying()
            item.pid = pid
            if (!item.inteval) {
                item.inteval = setInterval(() => {
                    if (!GravityCtrlMgr.instance.isSimpuly || item.pid != pid) return
                    if (p && p.character) {
                        if (Vector.squaredDistance(new Vector(item.obj.worldTransform.position.x, item.obj.worldTransform.position.y,
                            GravityCtrlMgr.instance.manInitPos.z), GravityCtrlMgr.instance.manInitPos) >= GlobalData.LoseDistance * GlobalData.LoseDistance) {
                            if (item.inteval) {
                                clearInterval(item.inteval)
                            }
                            item.pid = -1
                            this.simulate(true, pid)
                        } else {
                            p.character.worldTransform.rotation = item.obj.worldTransform.rotation
                        }
                    } else {
                        if (item.inteval) {
                            clearInterval(item.inteval)
                        }
                        item.pid = -1
                    }
                }, 10)
            }
        } else {
            MGSMsgHome.uploadMGS('ts_area_leave', "漂浮时长", { area_id: 1, time: (TimeUtil.time() - this.stayTime) })
            Player.localPlayer.character.worldTransform.rotation = GlobalData.globalRot
            if (res) {
                res.pid = -1
            }
            p.character.switchToWalking()
            ModuleService.getModule(ActionMC).stopAction()
        }
        GravityCtrlMgr.instance.isSimpuly = bool
    }

    getCubesLoc() {
        let list: Vector[] = []
        for (let i = this.cubeList.length - 1; i >= 0; i--) {
            const e = this.cubeList[i]
            list.push(e.obj.worldTransform.position.clone())
        }
        return list
    }

    asyncCubes(guid: string[]) {
        for (let i = this.cubeList.length - 1; i >= 0; i--) {
            let e = this.cubeList[i]
            if (e.obj.gameObjectId != guid[i]) {
                GameObject.asyncFindGameObjectById(guid[i]).then(o => {
                    if (!o) return
                    const item = new GravityItem()
                    item.init(o)
                    this.cubeList[i] = item
                })
            }
        }

    }

    getCubsGuids() {
        let list: string[] = []
        for (let i = this.cubeList.length - 1; i >= 0; i--) {
            const e = this.cubeList[i]
            list.push(e.obj.gameObjectId)
        }
        return list
    }
    onStateCB: Action = new Action()
    update() {
        for (let i = this.cubeList.length - 1; i >= 0; i--) {
            let e = this.cubeList[i]
            if (Vector.squaredDistance(new Vector(e.obj.worldTransform.position.x, e.obj.worldTransform.position.y, GravityCtrlMgr.instance.manInitPos.z),
                GravityCtrlMgr.instance.manInitPos) >= GlobalData.LoseDistance * GlobalData.LoseDistance) {
                e.destroy()
                const item = this.cubeList.find(e => e && e.obj && e.obj.worldTransform.position)
                if (item) {
                    let tmp = new GravityItem()
                    tmp.init(item.obj.clone())
                    tmp.obj.worldTransform.position = item.obj.worldTransform.position.clone()
                    this.cubeList[i] = tmp
                    this.onStateCB.call()
                    break
                }
            } else {
            }
        }
    }
}