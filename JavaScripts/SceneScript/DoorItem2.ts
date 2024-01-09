import GameUtils from "../utils/GameUtils";

enum CurDoorState {
    Open,
    Close
}

@Component
export default class DoorItem2 extends mw.Script {

    @mw.Property({ capture: true, displayName: "门1", group: "门的GUID" })
    public door1Guid: string = "";

    @mw.Property({ capture: true, displayName: "门2", group: "门的GUID" })
    public door2Guid: string = "";

    @mw.Property({ displayName: "自动关门时间(ms)" })
    public autoCloseDoorTime: number = 500;

    @mw.Property({ displayName: "门移动方向是否与前向量平行" })
    public forwardVector: boolean = true;

    @mw.Property({ displayName: "门移动方向是否与右向量平行" })
    public rightVector: boolean = false;

    /**是否能打开 */
    public isLock: boolean = false;
    /**所属家园 */
    public homeIndex: number = 0;
    /**
     * 设置门的平移
     * @param doorObj 门对象
     * @param toLoc 移动位置
     */
    private _setDoorMove(doorObj: mw.GameObject, toLoc: mw.Vector, isClose?: boolean) {
        if (doorObj) {
            let curDoorLoc = doorObj.localTransform.position.clone();
            new mw.Tween(curDoorLoc).to(toLoc, 500).onUpdate((loc: Vector) => {
                doorObj.localTransform.position = loc;
            }).onComplete(() => {
                doorObj.localTransform.position = toLoc;
                if (isClose) this.curDoorState = CurDoorState.Close;
                if (this.curDoorState != this.toState) {
                    this.curDoorState ? this.doorTrigger.onEnter.broadcast(Player.localPlayer.character)
                        : this.doorTrigger.onLeave.broadcast(Player.localPlayer.character);
                }
            }).start();
        }
    }

    /**记录计时器 */
    private _tempTimeout: any;

    private defaultDoor1Loc: Vector | null = null;
    private defaultDoor2Loc: Vector | null = null;
    private curDoorState: CurDoorState = CurDoorState.Close;
    private toState: CurDoorState = CurDoorState.Close;
    public doorTrigger: mw.Trigger;
    /**在触发器区域的玩家 */
    public inAreaMap: Map<number, mw.Character> = new Map();
    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected async onStart(): Promise<void> {
        if (mw.SystemUtil.isClient()) {
            Player.onPlayerLeave.add((player: mw.Player) => {
                if (this.doorTrigger.checkInArea(player.character)) {
                    this.doorTrigger.onLeave.broadcast(player.character);
                }
            })
            let doorObj1 = this.door1Guid ? await GameObject.asyncFindGameObjectById(this.door1Guid) : null;
            let doorObj2 = this.door2Guid ? await GameObject.asyncFindGameObjectById(this.door2Guid) : null;

            this.doorTrigger = this.gameObject as mw.Trigger;
            this.doorTrigger && this.doorTrigger.onEnter.add((obj: mw.GameObject) => {
                if (GameUtils.isPlayerCharacter(obj) && obj.player) {
                    // if (this.isLock && obj != Player.getPlayer(ModuleService.getModule(HomeModuleC).getPlayerByHome(this.homeIndex))?.character) {
                    //     return;
                    // }
                    this.inAreaMap.set(obj.player.playerId, obj);
                    this.toState = CurDoorState.Open;
                    if (this.curDoorState === CurDoorState.Close) {
                        this._tempTimeout && clearTimeout(this._tempTimeout);
                        this.curDoorState = CurDoorState.Open;
                        if (doorObj1) {
                            if (!this.defaultDoor1Loc) this.defaultDoor1Loc = doorObj1.localTransform.position.clone();
                            let leftDir: Vector;
                            if (doorObj1.worldTransform.getForwardVector()) {
                                leftDir = doorObj1.worldTransform.getForwardVector().clone().multiply(Math.cos(this.gameObject.worldTransform.rotation.z * Math.PI / 180) <= 0 ? 1 : -1);
                            }
                            if (doorObj1.worldTransform.getRightVector()) {
                                leftDir = doorObj1.worldTransform.getRightVector().clone().multiply(Math.cos(this.gameObject.worldTransform.rotation.z * Math.PI / 180) <= 0 ? 1 : -1);
                            }
                            let toLoc1 = leftDir && doorObj1.localTransform.position.add(leftDir.multiply(150));
                            toLoc1 && this._setDoorMove(doorObj1, toLoc1);
                        }

                        if (doorObj2) {
                            if (!this.defaultDoor2Loc) this.defaultDoor2Loc = doorObj2.localTransform.position.clone();
                            let rightDir: Vector;
                            if (doorObj2.worldTransform.getForwardVector()) {
                                rightDir = doorObj2.worldTransform.getForwardVector().clone().multiply(Math.cos(this.gameObject.worldTransform.rotation.z * Math.PI / 180) <= 0 ? 1 : -1);
                            }
                            if (doorObj2.worldTransform.getRightVector()) {
                                rightDir = doorObj2.worldTransform.getRightVector().clone().multiply(Math.cos(this.gameObject.worldTransform.rotation.z * Math.PI / 180) <= 0 ? 1 : -1);
                            }
                            let toLoc2 = rightDir && doorObj2.localTransform.position.add(rightDir.multiply(150));
                            toLoc2 && this._setDoorMove(doorObj2, toLoc2);
                        }
                    }
                }
            });

            this.doorTrigger && this.doorTrigger.onLeave.add((obj: mw.GameObject) => {
                if (GameUtils.isPlayerCharacter(obj) && obj.player) {
                    this.inAreaMap.delete(obj.player.playerId);
                    if (this.inAreaMap.size != 0) {
                        return;
                    }
                    this.toState = CurDoorState.Close;
                    this._tempTimeout && clearTimeout(this._tempTimeout);
                    (this._tempTimeout = setTimeout(() => {
                        if (this.curDoorState === CurDoorState.Open) {
                            doorObj1 && this._setDoorMove(doorObj1, this.defaultDoor1Loc, true);
                            doorObj2 && this._setDoorMove(doorObj2, this.defaultDoor2Loc);
                        }
                    }, this.autoCloseDoorTime));
                }
            });
            Event.addLocalListener("evs_closeDoorCollision", () => {
                if (this.isLock) {
                    doorObj1?.setCollision(mw.PropertyStatus.On);
                    doorObj2?.setCollision(mw.PropertyStatus.On);
                } else {
                    doorObj1?.setCollision(mw.PropertyStatus.Off);
                    doorObj2?.setCollision(mw.PropertyStatus.Off);
                }
            })
        }
    }
}
