import { SpawnManager, SpawnInfo, } from '../../Modified027Editor/ModifiedSpawn';
import { GameConfig } from "../../config/GameConfig";
import { IPetListElement } from "../../config/PetList";
import PetModuleC from "./PetModuleC";

export default class PetModuleS extends ModuleS<PetModuleC, null> {
    private _petMap: Map<number, { npc: mw.Character, petID: number }> = new Map()
    private _npcPool: mw.Character[] = []
    private _elems: IPetListElement[] = []

    protected onPlayerLeft(player: mw.Player): void {
        let pid = player.playerId
        this.recallPet(pid)
    }

    protected onStart(): void {
        this._elems = GameConfig.PetList.getAllElement()
    }

    /**召唤宠物 */
    public async net_callPet(petid: number, isFly: boolean = false) {
        if (this._petMap.has(this.currentPlayerId))
            return
        console.log("________________net_callPet", this.currentPlayerId, petid)
        let pid = this.currentPlayerId
        let tra = this.currentPlayer.character.worldTransform.clone()
        let pet = await this.createPet(tra, petid)
        if (pet) {
            this._petMap.set(pid, { npc: pet, petID: petid })
            this.playerFly(pid, isFly)
            return pet.gameObjectId
        } else
            return null
    }

    /**召回宠物 */
    public net_recallPet() {
        this.recallPet(this.currentPlayerId)
    }

    /**重置宠物位置 */
    public net_reSetPet() {
        let player = Player.getPlayer(this.currentPlayerId)
        if (player && this._petMap.has(this.currentPlayerId))
            this._petMap.get(this.currentPlayerId).npc.worldTransform.position = player.character.worldTransform.position
    }

    /**玩家飞行 */
    public net_playerFly(fly: boolean) {
        this.playerFly(this.currentPlayerId, fly)
    }

    async playerFly(pid: number, fly: boolean) {
        if (!this._petMap.has(pid))
            return
        let pet = this._petMap.get(pid).npc
        const configID = this._petMap.get(pid).petID - 1
        pet.movementEnabled = !fly
        if (fly) {
            pet.switchToFlying()
            pet.setCollision(mw.CollisionStatus.Off)
            await TimeUtil.delaySecond(0.2)
            const ch = Player.getPlayer(pid).character
            if (!ch) { return }
            ch.attachToSlot(pet, mw.HumanoidSlotType.Hair)
            pet.localTransform.position = new Vector(0, 0, 50)
            pet.localTransform.rotation = new Rotation(0, 0, 90)
        } else {
            pet.worldTransform.scale = Vector.one.multiply(this._elems[configID].scale)
            pet.setCollision(mw.CollisionStatus.On)
            pet.parent = null
            pet.switchToWalking()
        }
    }

    /**
     * 创建宠物
     * @param id 
     * @param petid 
     * @param count 
     */
    private async createPet(tra: mw.Transform, petid: number) {
        let cfg = GameConfig.PetList.getElement(petid)
        if (!cfg)
            return null
        let pet = this._npcPool.pop()
        if (!pet) {
            pet = await SpawnManager.asyncSpawn({ guid: "NPC", replicates: true, transform: tra }) as mw.Character
            await pet.asyncReady()
            pet.collisionWithOtherCharacterEnabled = false;
            // pet.animationMode = mw.AnimationMode.Custom;
            // pet.characterType = mw.AppearanceType.FourFootStandard;
            pet.displayName = ""
            pet.walkableFloorAngle = 180;
            pet.rotateRate = -1;
        } else {
            pet.setVisibility(mw.PropertyStatus.On)
        }
        pet.movementEnabled = true
        let Tappearance = pet.description
        Tappearance.base.wholeBody = cfg.guid;
        pet.worldTransform.scale = new mw.Vector(cfg.scale, cfg.scale, cfg.scale)
        pet.worldTransform.position = new Vector(tra.position.x - 100, tra.position.y - 100, tra.position.z - 40)
        pet.worldTransform.rotation = tra.rotation
        return pet
    }

    /**召回宠物 */
    private recallPet(pid: number) {
        if (!this._petMap.has(pid))
            return
        let pet = this._petMap.get(pid).npc
        pet.movementEnabled = false
        pet.worldTransform.position = returnPos
        pet.setVisibility(mw.PropertyStatus.Off)
        this._npcPool.push(pet)
        this._petMap.delete(pid)
    }
}

const returnPos = new mw.Vector(-1676.430, -444.050, 2531.130)