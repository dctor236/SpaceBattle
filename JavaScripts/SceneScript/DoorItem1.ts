import GameUtils from "../utils/GameUtils";

enum CurDoorState {
    Open,
    Close
}

@Component
export default class DoorItem1 extends mw.Script {

    @mw.Property({ capture: true, displayName: "门1", group: "门的GUID" })
    public door1Guid: string = "";

    @mw.Property({ capture: true, displayName: "门2", group: "门的GUID" })
    public door2Guid: string = "";

    @mw.Property({ displayName: "自动关门时间(ms)" })
    public autoCloseDoorTime: number = 500;

    @mw.Property({ displayName: "玩家移动方向是否与门的前向量平行" })
    public isLeftRightOrSameDir: boolean = false;

    /**是否能打开 */
    public isLock: boolean = false;
    /**所属家园 */
    public homeIndex: number = 0;
    /**
     * 设置门的旋转
     * @param doorObj 门对象
     * @param toRot 需要旋转的角度
     */
    private _setDoorRot(doorObj: mw.GameObject, toRot: mw.Rotation, defaultRotaion?: Rotation, isClose?: boolean) {
        if (doorObj) {
            let curDoorRot = doorObj.worldTransform.rotation.clone();
            new mw.Tween(curDoorRot).to(toRot, 500).onUpdate((rot: Rotation) => {
                doorObj.worldTransform.rotation = rot;
            }).onComplete(() => {
                defaultRotaion ? doorObj.localTransform.rotation = defaultRotaion : doorObj.worldTransform.rotation = toRot;
                if (isClose) this.curDoorState = CurDoorState.Close;
                if (this.curDoorState != this.toState) {
                    this.curDoorState ? this.doorTrigger.onEnter.broadcast(Player.localPlayer.character)
                        : this.doorTrigger.onLeave.broadcast(Player.localPlayer.character);
                }
            }).start();
        }
    }

    /**检查vec1是否在vec2左边 */
    private _checkLeft(vec1: Vector, vec2: Vector) {
        vec1.z = 0;
        vec2.z = 0;
        let resVec = Vector.cross(vec1, vec2);
        return resVec.z > 0;
    }

    /**记录计时器 */
    private _tempTimeout: any;
    private _changeRot: Rotation = new Rotation(0, 0, 90);
    private door1ISSameDir: boolean = false;
    private door2ISSameDir: boolean = false;
    private defaultDoor1Rot: Rotation | null = null;
    private defaultDoor2Rot: Rotation | null = null;
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
            if (doorObj1) this.defaultDoor1Rot = doorObj1.localTransform.rotation.clone();
            if (doorObj2) this.defaultDoor2Rot = doorObj2.localTransform.rotation.clone();
            this.doorTrigger = this.gameObject as mw.Trigger;
            this.doorTrigger && this.doorTrigger.onEnter.add((obj: mw.GameObject) => {
                if (GameUtils.isPlayerCharacter(obj) && obj.player) {
                    if (this.isLock) {
                        return;
                    }
                    this.inAreaMap.set(obj.player.playerId, obj);
                    this.toState = CurDoorState.Open;
                    if (this.curDoorState === CurDoorState.Close) {
                        this._tempTimeout && clearTimeout(this._tempTimeout);
                        this.curDoorState = CurDoorState.Open;
                        if (doorObj1) {
                            let roRot: Rotation | null = null;
                            if (this.isLeftRightOrSameDir) {
                                // 判断正反
                                if (mw.Vector.dot(obj.worldTransform.getForwardVector(), doorObj1.worldTransform.getForwardVector()) > 0) {
                                    roRot = doorObj1.worldTransform.rotation.subtract(this._changeRot);
                                    this.door1ISSameDir = true;
                                } else {
                                    roRot = doorObj1.worldTransform.rotation.add(this._changeRot);
                                    this.door1ISSameDir = false;
                                }
                            } else {
                                // 判断左右
                                let dir1 = obj.worldTransform.position.subtract(doorObj1.worldTransform.position);
                                if (this._checkLeft(dir1, doorObj1.worldTransform.getForwardVector())) {
                                    roRot = doorObj1.worldTransform.rotation.add(this._changeRot);
                                    this.door1ISSameDir = false;
                                } else {
                                    roRot = doorObj1.worldTransform.rotation.subtract(this._changeRot);
                                    this.door1ISSameDir = true;
                                }
                            }
                            roRot && this._setDoorRot(doorObj1, roRot);
                        }

                        if (doorObj2) {
                            let roRot2: Rotation | null = null;
                            if (this.isLeftRightOrSameDir) {
                                // 判断正反
                                if (mw.Vector.dot(obj.worldTransform.getForwardVector(), doorObj2.worldTransform.getForwardVector()) > 0) {
                                    roRot2 = doorObj2.worldTransform.rotation.subtract(this._changeRot);
                                    this.door2ISSameDir = true;
                                } else {
                                    roRot2 = doorObj2.worldTransform.rotation.add(this._changeRot);
                                    this.door2ISSameDir = false;
                                }
                            } else {
                                // 判断左右
                                let dir2 = obj.worldTransform.position.subtract(doorObj2.worldTransform.position);
                                if (this._checkLeft(dir2, doorObj2.worldTransform.getForwardVector())) {

                                    roRot2 = doorObj2.worldTransform.rotation.add(this._changeRot);
                                    this.door2ISSameDir = false;
                                } else {
                                    roRot2 = doorObj2.worldTransform.rotation.subtract(this._changeRot);
                                    this.door2ISSameDir = true;
                                }
                            }
                            roRot2 && this._setDoorRot(doorObj2, roRot2);
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
                            if (doorObj1) {
                                let toRot1 = this.door1ISSameDir ? doorObj1.worldTransform.rotation.add(this._changeRot) : doorObj1.worldTransform.rotation.subtract(this._changeRot)
                                this._setDoorRot(doorObj1, toRot1, this.defaultDoor1Rot, true);
                            }
                            if (doorObj2) {
                                let toRot2 = this.door2ISSameDir ? doorObj2.worldTransform.rotation.add(this._changeRot) : doorObj2.worldTransform.rotation.subtract(this._changeRot)
                                this._setDoorRot(doorObj2, toRot2, this.defaultDoor2Rot);
                            }
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
