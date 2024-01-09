
export class PlayerManagerExtesion {

    public static init(): void {
        ModuleService.registerModule(rpcExtesionS, rpcExtesionC, null);
    }

    public static isCharacterBase(obj: mw.GameObject): boolean {
        return obj instanceof mw.Character;
    }

    /**是否是npc */
    public static isNpc(obj: any): obj is Character {
        if ((obj instanceof Character) && obj.player == null) {
            return true;
        }
        return false;
    }

    /**是否是玩家 */
    public static isCharacter(obj: any): obj is Character {
        if ((obj instanceof Character) && obj.player != null) {
            return true;
        }
        return false;
    }

    private static isUseRpc(isSync: boolean): boolean {
        if (SystemUtil.isServer()) {
            return false;
        } else {
            return isSync;
        }
    }

    //#region Stance姿态相关
    /**
     * 停止姿态
     * @param char character
     * @param sync 是否同步
     */
    public static stopStanceExtesion(char: mw.Character, sync?: boolean): void {
        sync = sync === undefined ? true : sync;
        if (!this.isUseRpc(sync)) {
            char.currentSubStance?.stop();
            return;
        }
        let mtStance = new RpcStance("", char);
        let module = ModuleService.getModule(rpcExtesionC);
        module.stopStanceSync(char.gameObjectId, mtStance);
    }

    /**改变基础姿态 */
    public static changeBaseStanceExtesion(char: mw.Character, assetId: string): void {
        let basicStance = char.loadStance(assetId);
        basicStance.play();
    }

    /**
     * 改变姿态
     * @param char Character
     * @param assetId 姿态资源id
     */
    public static changeStanceExtesion(char: mw.Character, assetId: string): void {
        let sync = true;
        if (!this.isUseRpc(sync)) {
            char.loadSubStance(assetId).play();
            return;
        }
        let mtStance = new RpcStance(assetId, char);
        let module = ModuleService.getModule(rpcExtesionC);
        module.playStanceSync(char.gameObjectId, mtStance);
    }

    /**
     * 加载姿态
     * @param char Character
     * @param assetId 姿态资源id
     * @param sync 是否同步
     * @returns 返回姿态
     */
    public static loadStanceExtesion(char: mw.Character, assetId: string, sync?: boolean): mw.SubStance {
        sync = sync === undefined ? true : sync;
        if (!this.isUseRpc(sync)) {
            return char.loadSubStance(assetId);
        }
        sync = sync == undefined ? true : sync;
        const stance = new RpcStance(assetId, char);
        return stance;
    }
    //#endregion Stance姿态相关end

    //#region  Animation动画相关

    public static rpcPlayAnimation(owner: mw.Character, assetId: string, loop: number = 1, speed: number = 1): mw.Animation {
        let ani = this.loadAnimationExtesion(owner, assetId) as RpcAnimation;
        ani.loop = loop;
        ani.speed = speed;
        ani.play();
        return ani;
    }

    public static rpcStopAnimation(owner: mw.Character, assetId: string): void {
        if (!this.isUseRpc(true)) {
            if (owner.currentAnimation && owner.currentAnimation.assetId == assetId) owner.currentAnimation.stop();
            return;
        }
        let module = ModuleService.getModule(rpcExtesionC);
        module.stopAnimationSync(owner.gameObjectId, assetId);
    }

    /**
     * 播放动画
     * @param owner Character
     * @param assetId 动画资源id
     * @param speed 播放速率
     * @param loop 循环次数
     * @returns 返回动画
     */
    public static playAnimationLocally(owner: mw.Character, assetId: string, speed: number, loop: number) {
        if (owner === undefined || owner === null) return;
        let anim = owner.loadAnimation(assetId) as RpcAnimation;
        anim.loop = loop;
        anim.speed = speed;
        anim.play();
        return anim;
    }

    /**
     * 加载动画
     * @param char Character
     * @param assetid 动画资源id
     * @param sync 是否同步
     * @returns 返回动画
     */
    public static loadAnimationExtesion(char: mw.Character, assetid: string, sync?: boolean) {
        sync = sync === undefined ? true : sync;
        if (!this.isUseRpc(sync)) {
            return char.loadAnimation(assetid);
        }
        Character.nameVisible
        const anim = new RpcAnimation(char, assetid);
        return anim;
    }
    //#endregion Animation动画相关end

    //#region  GameObject相关

}

class rpcExtesionC extends ModuleC<rpcExtesionS, null>{

    //#region sync Animation

    public playAnimationSync(charGuid: string, myAnimation: RpcAnimation) {
        this.server.net_playAnimationSync(charGuid, myAnimation.assetId, myAnimation.speed, myAnimation.loop, myAnimation.slot);
    }

    public pauseAnimationSync(charGuid: string, myAnimation: RpcAnimation) {
        this.server.net_pauseAnimationSync(charGuid, myAnimation.assetId);
    }

    public resumeAnimationSync(charGuid: string, myAnimation: RpcAnimation) {
        this.server.net_resumeAnimationSync(charGuid, myAnimation.assetId);
    }

    public stopAnimationSync(charGuid: string, myAnimation: RpcAnimation | string) {
        let assetId = typeof myAnimation == "string" ? myAnimation : myAnimation.assetId;
        this.server.net_stopAnimationSync(charGuid, assetId);
    }

    //#endregion sync Animation

    //#region sync Stance

    public playStanceSync(charGuid: string, myStance: RpcStance) {
        this.server.net_playStanceSync(myStance.assetId, myStance.blendMode);
    }

    public stopStanceSync(charGuid: string, stance: RpcStance) {
        this.server.net_stopStanceSync(stance.assetId);
    }

    public net_playAnimation(charGuid: string, assetId: string, rate: number, loop: number, slot: mw.AnimSlot) {
        if (charGuid == this.localPlayer.character.gameObjectId) return;
        RpcAnimation.playAnimation(charGuid, assetId, rate, loop, slot);
    }

    public net_pauseAnimation(charGuid: string, assetId: string) {
        if (charGuid == this.localPlayer.character.gameObjectId) return;
        RpcAnimation.pauseAnimation(charGuid, assetId);
    }

    public net_resumeAnimation(charGuid: string, assetId: string) {
        if (charGuid == this.localPlayer.character.gameObjectId) return;
        RpcAnimation.resumeAnimation(charGuid, assetId);
    }

    public net_stopAnimation(charGuid: string, assetId: string) {
        if (charGuid == this.localPlayer.character.gameObjectId) return;
        RpcAnimation.stopAnimation(charGuid, assetId);
    }

}

class rpcExtesionS extends ModuleS<rpcExtesionC, null>{

    //#region sync Animation

    public net_playAnimationSync(charGuid: string, assetId: string, rate: number, loop: number, slot: mw.AnimSlot) {
        this.getAllClient().net_playAnimation(charGuid, assetId, rate, loop, slot);
    }

    public net_pauseAnimationSync(charGuid: string, assetId: string) {
        this.getAllClient().net_pauseAnimation(charGuid, assetId);
    }

    public net_resumeAnimationSync(charGuid: string, assetId: string) {
        this.getAllClient().net_resumeAnimation(charGuid, assetId);
    }

    public net_stopAnimationSync(charGuid: string, assetId: string) {
        this.getAllClient().net_stopAnimation(charGuid, assetId);
    }

    //#endregion sync Animation

    //#region sync Stance

    public playStanceSync(charGuid: string, mystance: RpcStance) {
        RpcStance.playStance(charGuid, mystance.assetId, mystance.blendMode)
    }

    public net_stopStanceSync(assetId: string) {
        RpcStance.stopStance(this.currentPlayer.character.gameObjectId, assetId);
    }

    public stopStanceSync(charGuid: string, stance: RpcStance) {
        RpcStance.stopStance(charGuid, stance.assetId);
    }

    public net_playStanceSync(assetid: string, blendMode: mw.StanceBlendMode) {
        RpcStance.playStance(this.currentPlayer.character.gameObjectId, assetid, blendMode);
    }

    //#endregion sync Stance

}

class RpcAnimation {

    private ani: mw.Animation = null;
    public assetId: string = null;
    public owner: Character = null;
    public loop: number = 1;
    public speed: number = 1;
    public slot: mw.AnimSlot = mw.AnimSlot.Default;

    constructor(char: Character, assetId: string) {
        this.owner = char;
        this.assetId = assetId;
        this.ani = char.loadAnimation(assetId);
    }

    get length(): number {
        return this.ani.length;
    }

    get isPlaying(): boolean {
        return this.ani.isPlaying;
    }

    get onFinish(): mw.MulticastDelegate<() => void> {
        return this.ani.onFinish;
    }

    public play(): boolean {
        this.ani?.play();
        let module = ModuleService.getModule(rpcExtesionC);
        module.playAnimationSync(this.owner.gameObjectId, this);
        return true;
    }

    public pause(): boolean {
        this.ani?.pause();
        let module = ModuleService.getModule(rpcExtesionC);
        module.pauseAnimationSync(this.owner.gameObjectId, this);
        return true;
    }

    public resume(): boolean {
        this.ani?.resume();
        let module = ModuleService.getModule(rpcExtesionC);
        module.resumeAnimationSync(this.owner.gameObjectId, this);
        return true;
    }

    public stop(): boolean {
        this.ani?.stop();
        let module = ModuleService.getModule(rpcExtesionC);
        module.stopAnimationSync(this.owner.gameObjectId, this);
        return true;
    }

    public static playAnimation(guid: string, assetid: string, speed: number, loop: number, slot: mw.AnimSlot): mw.Animation {
        let char = Character.findGameObjectById(guid) as Character;
        if (!char) return;
        let anim = char.loadAnimation(assetid);
        anim.loop = loop;
        anim.speed = speed;
        anim.slot = slot;
        anim.play();
        return anim;
    }

    public static pauseAnimation(guid: string, assetId: string): void {
        let char = Character.findGameObjectById(guid) as Character;
        if (!char) return;
        let anim = char.currentAnimation;
        if (!anim) return;
        anim.pause();
    }

    public static resumeAnimation(guid: string, assetId: string): void {
        let char = Character.findGameObjectById(guid) as Character;
        if (!char) return;
        let anim = char.currentAnimation;
        if (!anim) return;
        anim.resume();
    }

    public static stopAnimation(guid: string, assetId: string): void {
        let char = Character.findGameObjectById(guid) as Character;
        if (!char) return;
        let anim = char.currentAnimation;
        if (!anim) return;
        anim.stop();
    }

}

class RpcStance {

    public assetId: string = null;
    public owner: Character = null;
    public blendMode: mw.StanceBlendMode = null;

    constructor(assetId: string, owner: Character) {
        this.assetId = assetId;
        this.owner = owner;
    }

    public play(): boolean {
        let module = SystemUtil.isServer() ? ModuleService.getModule(rpcExtesionS) : ModuleService.getModule(rpcExtesionC);
        module.playStanceSync(this.owner.gameObjectId, this);
        return true;
    }

    public stop(): boolean {
        let module = SystemUtil.isServer() ? ModuleService.getModule(rpcExtesionS) : ModuleService.getModule(rpcExtesionC);
        module.playStanceSync(this.owner.gameObjectId, this);
        return true;
    }

    public static playStance(charGuid: string, assetId: string, blendMode: mw.StanceBlendMode) {
        let char = GameObject.findGameObjectById(charGuid) as mw.Character;
        if (!char) return;
        if (assetId == "") {
            char.currentSubStance?.stop();
            return;
        }
        let stance = char.loadSubStance(assetId);
        if (blendMode) stance.blendMode = blendMode;
        stance.play();
    }

    public static stopStance(charGuid: string, assetId: string) {
        let char = GameObject.findGameObjectById(charGuid) as mw.Character;
        if (!char) return;
        let currentStance = char.currentSubStance;
        if (currentStance && (currentStance.assetId == assetId || assetId == "")) {
            currentStance.stop();
        }
    }

}

PlayerManagerExtesion.init();