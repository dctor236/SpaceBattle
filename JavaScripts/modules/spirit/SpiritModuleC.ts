import { InputManager } from "../../InputManager";
import { GameConfig } from "../../config/GameConfig";
import Spirit, { ESpiritState, SpiritType } from "./Spirit";
import SpiritModuleS from "./SpiritModuleS";
import { updater } from "../fight/utils/Updater";
import { EventsName } from "../../const/GameEnum";

export default class SpiritModuleC extends ModuleC<SpiritModuleS, null>{

    private spiritMap: Map<number, Spirit[]> = new Map()
    private _curFollowList: number[] = []
    private _asyncTime = null

    protected onStart(): void {
        // InputManager.instance.onKeyDown(mw.Keys.H).add(() => {
        //     this.curFollows().forEach(e => {
        //         e.onAttack()
        //     })
        // })
        // InputManager.instance.onKeyDown(mw.Keys.J).add(() => {
        //     this.curFollows().forEach(e => {
        //         e.onFollow()
        //     })
        // })
    }

    public net_setBattle(state: boolean) {
        this.curFollows().forEach(e => {
            if (state) {
                e.onAttack()
            } else {
                e.onFollow()
            }
        })
    }

    public getCurFollowNum() {
        let vec = this.curFollows()
        return vec ? vec.length : 0
    }

    public getSpiritById(tmpID: number) {
        return this.spiritMap.get(this.localPlayerId).find(e => e.id == tmpID)
    }

    public getSpiritByGuid(tmpID: string) {
        return this.spiritMap.get(this.localPlayerId).find(e => e.obj.gameObjectId === tmpID)
    }


    private curFollows() {
        return this.spiritMap.get(this.localPlayerId).filter(e => e.curState() == ESpiritState.Follow || e.curState() == ESpiritState.Attack)
    }

    public curFollowIdsTypes() {
        const list = this.curFollows()
        let vec: { id: number, type: SpiritType }[] = []
        list.forEach(e => {
            vec.push({ id: e.id, type: e.type })
        })
        return vec
    }

    protected onEnterScene(sceneType: number): void {
        let vec = []
        const elems = GameConfig.Spirt.getAllElement()
        for (let i = 0; i < elems.length; i++) {
            const e = elems[i]
            const spirit = new Spirit()
            spirit.initSpirit(i + 1, this.localPlayerId, e.spiritType, e.pos, new Rotation(e.rot))
            vec.push(spirit)
        }

        this.spiritMap.set(this.localPlayerId, vec)

        this._asyncTime = setInterval(() => {
            this.req_asyncFollowList()
        }, 5000)
    }

    public req_asyncFollowList() {
        let vec = this.spiritMap.get(this.localPlayerId)
        const lastList = this._curFollowList
        let tmpList: number[] = []
        vec.forEach(e => {
            if (e.curState() == ESpiritState.Follow) {
                tmpList.push(e.id)
            }
        })

        if (lastList.length != tmpList.length) {
            this._curFollowList = tmpList
            let dataList: string[] = []
            vec.forEach(spirit => {
                if (spirit.curState() == ESpiritState.Follow ||
                    spirit.curState() == ESpiritState.Attack) {
                    const data = spirit.type + '/' + spirit.obj.worldTransform.position.x + '/' + spirit.obj.worldTransform.position.y + '/' + spirit.obj.worldTransform.position.z
                        + '/' + spirit.obj.worldTransform.rotation.x + '/' + spirit.obj.worldTransform.rotation.y + '/' + spirit.obj.worldTransform.rotation.z
                    dataList.push(data)
                }
            })
            this.server.net_asynFollow(JSON.stringify(dataList))
        }
    }

    public async net_onAsyncFollow(str: string, hostId: number) {
        const list: string[] = JSON.parse(str)
        if (!this.spiritMap.has(hostId)) {
            this.spiritMap.set(hostId, [])
        }
        let vec = this.spiritMap.get(hostId)
        const len: number = vec.length > list.length ? vec.length : list.length
        for (let i = len - 1; i >= 0; i--) {
            const data = list[i]
            let spirit = vec[i]
            if (data) {
                const tmpStr = data.split('/')
                const loc = new Vector(Number(tmpStr[1]), Number(tmpStr[2]), Number(tmpStr[3]))
                const rot = new Rotation(Number(tmpStr[4]), Number(tmpStr[5]), Number(tmpStr[6]))
                if (!spirit) {
                    const id = (i + 1)
                    const tmpSp = new Spirit()
                    await tmpSp.initSpirit(id, hostId, Number(tmpStr[0]), loc, rot)
                    vec[i] = tmpSp
                    tmpSp.onFollow()
                } else {
                    spirit.obj.worldTransform.position = loc
                    spirit.obj.worldTransform.rotation = rot
                    spirit.changeAppear(Number(tmpStr[0]))
                }
            } else {
                spirit.onDestroy()
                spirit = null
                vec.splice(i, 1)
            }
        }
        this.spiritMap.set(hostId, vec)
    }

    @updater.updateByFrameInterval(20)
    protected onUpdate(dt: number): void {
        this.spiritMap.forEach(list => {
            list.forEach(e => {
                e.update(dt)
            })
        })
    }

    protected onDestroy(): void {
        clearInterval(this._asyncTime)
        this._asyncTime = null
        this.spiritMap.forEach(list => {
            list.forEach(e => {
                e.onDestroy()
            })
        })
    }
}