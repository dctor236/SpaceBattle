import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import { GameConfig } from "../../config/GameConfig";
import { ITreasureElement } from "../../config/Treasure";
import { GlobalData } from "../../const/GlobalData";
import { GoPool, SoundManager, UIManager } from "../../ExtensionType";
import Tips from "../../ui/commonUI/Tips";
import RentGoodUI from "../../ui/RentGoodUI";
import GameUtils from "../../utils/GameUtils";
import { BagModuleC } from "../bag/BagModuleC";
import NightFind from "../drop/ui/NightFind";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";
// import { VehicleEvent, RideData } from "../vehicle/VehicleDefine";
import FindModuleS, { FindData } from "./FindModuleS";

export enum EGoodsTag {
    Suitcase = '行李箱',
    Moutiain = '山顶',
    Bill = '1',
    Item = 'Item'
}

class FindObj {
    /**拾取后是否需要刷新 */
    protected _isRefresh: boolean;
    public get isRefresh(): boolean {
        return this._isRefresh;
    }
    public findType: EGoodsTag;
    public obj: mw.GameObject;
    public posIndex: number;
    public elem: ITreasureElement = null

    constructor(posIndex: number, type: EGoodsTag, elem: ITreasureElement, refresh: boolean) {
        this.elem = elem
        this.obj = GoPool.spawn(this.elem.Guid);
        // if (this.elem.itemEffect) {
        //     const elem = GameConfig.Effect.getElement(this.elem.itemEffect)
        //     GeneralManager.rpcPlayEffectOnGameObject(elem.EffectID, this.obj, 0, new Vector(elem.EffectLocation), new Rotation(elem.EffectRotate), new Vector(elem.EffectLarge));
        // } else {
        //     GeneralManager.rpcPlayEffectOnGameObject("14322", this.obj, 0);
        // }
        this.findType = type;
        this.posIndex = posIndex;
        let pos = refresh
            ? this.elem.RefreshPosArr[posIndex].clone()
            : this.elem.unRefreshPosArr[posIndex].clone();
        this.obj.worldTransform.position = pos;
        this.obj.worldTransform.rotation = new mw.Rotation(0, 0, MathUtil.randomInt(0, 180));
        this._isRefresh = refresh;
    }

    onFindGameOver() {
        this.setVisiblity(false);
    }

    setVisiblity(bool: boolean) {
        this.obj.setVisibility(bool ? mw.PropertyStatus.On : mw.PropertyStatus.Off);
        this.obj.setCollision(bool ? mw.CollisionStatus.QueryOnly : mw.CollisionStatus.Off, true);
    }

    getItem() {
        // this.posIndex = index;
    }
}

class FindCoin extends FindObj {
    constructor(posIndex: number, type: EGoodsTag, elem: ITreasureElement, refresh: boolean) {
        super(posIndex, type, elem, refresh)
        this.obj.tag = "coin";
        this.obj.getChildren().forEach(e => {
            e.tag = 'coin'
        })
    }

    /**金币被拾取 */
    getItem(): void {
        super.getItem()
        SoundManager.playSound("99733", 1, 10);
        if (this._isRefresh) {
            this.setVisiblity(false);
            const second = this.elem.second > 0 ? this.elem.second : 20
            setTimeout(() => {
                this.obj.worldTransform.position = this.elem.RefreshPosArr[this.posIndex].clone(); //直接换个位置生成新的
                this.setVisiblity(true);
            }, second * 1000);
        } else {
            this.setVisiblity(false);
        }
    }
}

class FindItem extends FindObj {
    constructor(posIndex: number, type: EGoodsTag, elem: ITreasureElement, refresh: boolean) {
        super(posIndex, type, elem, refresh)
        this.obj.tag = "item";
        this.obj.getChildren().forEach(e => {
            e.tag = 'item'
        })
        this.setVisiblity(true);
        this.itemID = this.elem.itemID
    }
    protected itemID: number = -1
    getItem(): void {
        super.getItem()
        if (this.itemID != -1) {
            if (this._isRefresh) {
                this.setVisiblity(false);
                const second = this.elem.second > 0 ? this.elem.second : 20
                setTimeout(() => {
                    this.obj.worldTransform.position = this.elem.RefreshPosArr[this.posIndex].clone(); //直接换个位置生成新的
                    this.setVisiblity(true);
                }, second * 1000);
            } else {
                // this.setVisiblity(false);
            }
            const bagC = ModuleService.getModule(BagModuleC)
            SoundManager.playSound("136206", 1, 10);
            if (bagC.equipSlots.indexOf(this.itemID.toString()) == -1 && bagC.isShortCutFull()) {
                Tips.show(GameUtils.getTxt("Danmu_Content_1367"))
            } else {
                let addNum = 9999999
                if (this.itemID == 140015) {
                    addNum = 1
                }
                bagC.addCreationItem(this.itemID, addNum, false)
                const elem = GameConfig.Item.getElement(this.itemID)
                Tips.show('佩戴了道具:' + elem.Name)
                if (this.itemID == 140011)
                    MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具“激光炮”时', { record: 'get_laser_gun' })
                else if (this.itemID == 140006)
                    MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具“喷火器”时', { record: 'get_fire_gun' })
                else if (this.itemID == 140012)
                    MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具火箭筒', { record: 'get_rocket' })
                else if (this.itemID == 140009)
                    MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具棒棒糖', { record: 'get_lollipop' })
                else if (this.itemID == 140007)
                    MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具扇子', { record: 'get_fan' })
                else if (this.itemID == 140008)
                    MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具电刀', { record: 'get_sword' })
                else if (this.itemID == 140010)
                    MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具球棒', { record: 'get_baseballbat' })
                else if (this.itemID == 140013)
                    MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具火翅膀', { record: 'get_wing_1' })
                else if (this.itemID == 140014)
                    MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具紫翅膀', { record: 'get_wing_2' })
                else if (this.itemID == 302)
                    MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具滑板', { record: 'get_skate' })
                else if (this.itemID == 140016)
                    MGSMsgHome.uploadMGS('ts_game_result', '玩家成功佩戴道具机关枪', { record: 'get_machinegun' })
            }
        }
    }
}

// const MaxGoldCoinNum = 10;
export const MaxGet = 99999;

export default class FindModuleC extends ModuleC<FindModuleS, FindData> {
    private findArr: FindObj[] = [];
    /**是否在游戏中 */
    private _inGame: boolean;
    public get InGame(): boolean {
        return this._inGame;
    }

    private trigger: mw.Trigger;
    private posArrIndex: Map<number, Set<number>> = new Map()
    protected allGoods: Map<string, { ranIndex: number, triGroup: mw.Trigger[] }> = new Map()

    protected onStart(): void {
        // GameObject.asyncFindGameObjectById(FindRoot).then(o => {
        //     Object.values(EGoodsTag).forEach((e) => {
        //         const group = o.getChildByName(e)
        //         if (group) {
        //             let vec = {
        //                 ranIndex: 0,
        //                 triGroup: []
        //             }
        //             const children = group.getChildren()
        //             children.forEach(child => {
        //                 const tri = child as mw.Trigger
        //                 if (tri) {
        //                     tri.onEnter.add((obj) => {
        //                         if (GameUtils.isPlayerCharacter(obj)) {
        //                             let config: number = 0
        //                             if (e == EGoodsTag.Moutiain) {
        //                                 config = 1000
        //                             } else if (e == EGoodsTag.Suitcase) {
        //                                 config = 1004
        //                             }
        //                             Event.dispatchToLocal(EventsName.DoneTask, config, 1)
        //                             tri.enabled = (false)
        //                         }
        //                     })
        //                     vec.triGroup.push(child)
        //                 }
        //             })
        //             this.allGoods.set(e, vec)
        //             this.setVisableAndCollsion(e, false)
        //         }
        //     })
        // })
    }
    protected onEnterScene(sceneType: number): void {
        this.startFindGame()
        const allElem = ["140006", '140007', '140008', '140009', '140010', '140011', '140012', '140013', '140014', '140016']
        Event.addLocalListener('DisposeItem', (id: string, index: number) => {
            if (Math.floor(Number(id) / 10) >= 30 && Math.floor(Number(id) / 10) < 40) {
                const elem = GameConfig.Item.getElement(id)
                // ModuleService.getModule(CameraModuleC).facadPlayerRotation(false)
                UIManager.getUI(RentGoodUI).hideIndex(index)
                Tips.show(StringUtil.format(GameUtils.getTxt("Tips_1029"), elem.Name))
            }
        })
    }

    checkDate() {
        if (this.data.nextResume != 0 && Date.now() >= this.data.nextResume) {
            this.data.revertCoin()
        }
    }

    async onInit() {
        this.checkDate()
        if (!this.trigger) {
            Player.asyncGetLocalPlayer().then(async o => {
                await o.character.asyncReady()
                this.trigger = await GoPool.asyncSpawn("Trigger") as mw.Trigger;
                await this.trigger.asyncReady();
                this.trigger.onEnter.add((go: mw.GameObject) => {
                    if (!go) return
                    let obj: FindObj;
                    for (const item of this.findArr) {
                        if (item.obj.gameObjectId == go.gameObjectId || (go.parent && item.obj.gameObjectId == go.parent.gameObjectId)) {
                            obj = item;
                            break
                        }
                    }
                    if (obj) {
                        if (go.tag == "coin" || (go.parent && go.parent.tag == 'coin')) {
                            if (this.data.getCoins >= MaxGet) {
                                let delta = this.data.nextResume - Date.now()
                                if (delta > 0) {
                                    const hour = Math.floor(delta / (60 * 60 * 1000))
                                    delta -= hour * (60 * 60 * 1000)
                                    const min = Math.floor(delta / (60 * 1000))
                                    Tips.show('还剩下: ' + hour + '小时 ' + min + '分钟可以再次拾取钞票')
                                    return
                                } else {
                                    this.checkDate()
                                }
                            }
                            let addNum = obj.elem.moneyvalue
                            if (this.data.getCoins + addNum < MaxGet) {

                            } else if (this.data.getCoins + addNum > MaxGet) {
                                addNum = MaxGet - this.data.getCoins
                            } else {
                            }
                            this.reqAddCoin(addNum)
                            UIManager.getUI(NightFind).onGetCoin(Number(obj.findType), obj.obj.worldTransform.position, addNum);
                            if (obj.isRefresh) {
                                // let index: number = this.getaRandomPos(obj.elem.id, obj.posIndex);
                                // //更换这个银币的索引在没有用到的索引以及位置
                                obj.getItem();
                            } else {
                                obj.getItem();
                            }

                        } else if (go.tag == "item" || (go.parent && go.parent.tag == 'item')) {
                            obj.getItem();
                        }
                    }
                });

                this.trigger.enabled = (true);
                this.trigger.parent = Player.localPlayer.character;
                this.trigger.localTransform.position = (mw.Vector.zero);
                this.trigger.worldTransform.scale = new mw.Vector(2, 1, 3);
            })

        }

        if (this.findArr.length == 0) {
            const allElem = GameConfig.Treasure.getAllElement()
            for (const elem of allElem) {
                await GameUtils.downAsset(elem.Guid);
                if (Number(elem.itemID)) {
                    if (elem.RefreshPosArr)
                        for (let index = 0; index < elem.RefreshPosArr.length; index++) {
                            this.findArr.push(new FindItem(index, EGoodsTag.Item, elem, true));
                        }
                    if (elem.unRefreshPosArr)
                        for (let index = 0; index < elem.unRefreshPosArr.length; index++) {
                            this.findArr.push(new FindItem(index, EGoodsTag.Item, elem, false));
                        }
                } else {
                    if (elem.RefreshPosArr) {
                        let vec: Set<number> = new Set()
                        for (let index = 0; index < elem.RefreshPosArr.length; index++) {
                            vec.add(index);
                            this.findArr.push(new FindCoin(index, EGoodsTag.Bill, elem, true));
                        }
                        this.posArrIndex.set(elem.id, vec)
                    }
                    if (elem.unRefreshPosArr)
                        for (let index = 0; index < elem.unRefreshPosArr.length; index++) {
                            this.findArr.push(new FindCoin(index, EGoodsTag.Bill, elem, false));
                        }
                }
            }
        }

        this.findArr.forEach(coin => {
            coin.setVisiblity(true);
        });
    }

    protected onUpdate(dt: number): void {

    }

    public reqAddCoin(num: number = 1) {
        this.server.net_addCoin(num)
        this.data.addCoin(num)
    }


    private getaRandomPos(itemId: number, originIndex: number): number {
        let index: number = -1;
        let set: Set<number> = new Set();
        set = this.posArrIndex.get(itemId);
        //随机一个没有用到的索引
        while (index == -1) {
            let randomIndx = MathUtil.randomInt(0, GameConfig.Treasure.getElement(itemId).RefreshPosArr.length);
            if (!set.has(randomIndx) && index != originIndex) {
                index = randomIndx;
                break
            }
        }
        //删掉金币原来的索引
        set.delete(originIndex);
        set.add(index);
        this.posArrIndex.set(itemId, set)
        return index;
    }

    async startFindGame() {
        await this.onInit();
        UIManager.show(NightFind);
        this._inGame = true;
    }

    /**
     * find游戏结束时调用
     */
    endFindGame() {
        this.trigger.enabled = (false);
        this.findArr.forEach(coin => {
            coin.onFindGameOver();
        });
        this._inGame = false;
    }

    hidefindUI() {
        UIManager.hide(NightFind)
    }

    public findGroupByTag(tag: EGoodsTag) {
        if (this.allGoods.has(tag)) {
            return this.allGoods.get(tag).triGroup
        }
        return null
    }

    public setVisableAndCollsion(tag: EGoodsTag, state: boolean) {
        if (this.allGoods.has(tag)) {
            const goods = this.allGoods.get(tag)
            goods.triGroup.forEach(e => {
                state ? e.setVisibility(mw.PropertyStatus.On, true) :
                    e.setVisibility(mw.PropertyStatus.Off, true);
                e.enabled = (state)
            })
        }
    }

    public setTagIndex(tag: EGoodsTag) {
        let res: number = 0
        if (this.allGoods.has(tag)) {
            res = MathUtil.randomInt(0, this.allGoods.get(tag).triGroup.length)
            this.allGoods.get(tag).ranIndex = res
        }
        return res
    }

    public getTagIndex(tag: EGoodsTag) {
        if (this.allGoods.has(tag)) {
            return this.allGoods.get(tag).ranIndex
        }
    }

    protected onDestroy(): void {

    }
}