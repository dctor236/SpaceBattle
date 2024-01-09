import { PlayerManagerExtesion, } from '../../Modified027Editor/ModifiedPlayer';
/*
* @Author: 代纯 chun.dai@appshahe.com
* @Date: 2023-05-27 14:41:20
* @LastEditors: 代纯 chun.dai@appshahe.com
* @LastEditTime: 2023-06-24 10:11:28
* @FilePath: \vine-valley\JavaScripts\modules\tour\TourModuleS.ts
* @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
*/
import { GlobalData } from "../../const/GlobalData";
import { MountPoint } from "./MountRoutine";
import TourModuleC from "./TourModuleC";

enum ETourState {
    Idle,
    Walk
}

//坐骑
export class TourMount {
    private _id: number
    private _name: string = ''
    private _obj: mw.Character
    private _routine: MountPoint[] = []
    private _inteval = null
    private _moveIndex: number = 0
    private _moveFlag: boolean = true
    private _walkInteval = null
    private _state: ETourState = ETourState.Idle

    constructor(id: number, name: string, obj: mw.Character) {
        this._id = id
        this._name = name
        this._obj = obj
        this.init()
    }

    getMount() {
        return this._obj
    }

    getMountName() {
        return this._name
    }

    init() {
        this._obj.displayName = ''
        this._obj.collisionWithOtherCharacterEnabled = false
        if (this._obj.characterType == mw.CharacterType.FourFootStandard) {
            // this._obj.animationMode = mw.AnimationMode.Custom;
            this._obj.collisionExtent.z = 0.1
            this._obj.collisionExtent.x = 0.1
            this._obj.capsuleCorrectionEnabled = true;
            this._obj.movementDirection = mw.MovementDirection.AxisDirection
            // this._obj.maxStepHeight = 10000
            // this._obj.maxFallingSpeed = 10000
            this._obj.switchToWalking();
            // this._obj.setCollisionShapeAndExtent(mw.CustomShapeType.HorizontalCapsule, new Vector(5, 5, 5))
        }
        this._obj.walkableFloorAngle = 180;
        this._obj.rotateRate = -1;
        PlayerManagerExtesion.rpcPlayAnimation(this._obj, '150779', 0)
        if (!this._inteval) {
            this._inteval = setInterval(() => {
                this.move()
            }, 8000)
        }
        if (!this._walkInteval) {
            this._walkInteval = setInterval(() => {
                if (this._state == ETourState.Idle) return
                const npcPos = this._obj.worldTransform.position;
                const targetPos = new Vector(this._routine[this._moveIndex].pos.x, this._routine[this._moveIndex].pos.y, npcPos.z);
                if (Vector.squaredDistance(targetPos, npcPos) > 150 * 150) {
                    let dir = targetPos.subtract(npcPos).normalized
                    this._obj.addMovement(dir.multiply(4))
                } else {
                    this._state = ETourState.Idle
                    this.setMoveIndex()
                }
            }, 10)
        }
    }

    initRoutine(routineObj: mw.GameObject) {
        const points = routineObj.getChildren()
        for (let i = 0; i < points.length; i++) {
            const point = points[i]
            // console.log("initRoutine",point.name,point.worldTransform.position)
            let mountPoint = new MountPoint(i, point.worldTransform.position)
            this._routine.push(mountPoint)
        }
    }

    move() {
        this._state = ETourState.Walk
        PlayerManagerExtesion.rpcPlayAnimation(this._obj, '150782', 0)
        // Navigation.navigateTo(this._obj, this._routine[this._moveIndex].pos, 50,
        //     () => {
        //         this.setMoveIndex()
        //     },
        //     null)
    }

    setMoveIndex() {
        if (this._moveFlag) {
            if (this._moveIndex < this._routine.length - 1) {
                this._moveIndex += 1
            } else {
                this._moveFlag = false
                this._moveIndex = this._routine.length - 2
            }
        } else {
            if (this._moveIndex >= 1) {
                this._moveIndex -= 1
            } else {
                this._moveFlag = true
                this._moveIndex = 1
            }
        }

        PlayerManagerExtesion.rpcPlayAnimation(this._obj, '150779', 0)
    }
    onDestroy() {
        if (this._walkInteval) {
            clearInterval(this._walkInteval)
            this._walkInteval = null
        }
    }
}


export const MountName = [
    '向导-胖达',
    'kljklj',
    'fasfas'
]

export default class TourModuleS extends ModuleS<TourModuleC, null>{
    private _petMap: Map<MountType, TourMount> = new Map()
    private isInit: boolean = false

    protected async onPlayerEnterGame(player: mw.Player): Promise<void> {
        if (!this.isInit) {
            this.isInit = true
            const root = await GameObject.asyncFindGameObjectById(GlobalData.MountRoot)
            const PetPart = root.getChildren()[0].getChildren()
            const RoutinePart = root.getChildren()[1].getChildren()
            for (let i = 0; i < PetPart.length; i++) {
                if (PetPart[i] instanceof mw.Character) {
                    const pet = PetPart[i] as mw.Character
                    await pet.asyncReady()
                    const routine = RoutinePart[i]
                    let tourMount = new TourMount(i + 1, MountName[i], pet)
                    tourMount.initRoutine(routine)
                    this._petMap.set(i + 1, tourMount)
                }
            }
        }
        this._petMap.forEach((e, key) => {
            this.getClient(player.playerId).net_InitMounName(key, e.getMount().gameObjectId)
        })
    }

    public getTour(type: MountType) {
        return this._petMap.get(type)
    }
}

export enum MountType {
    None,
    Panda
}