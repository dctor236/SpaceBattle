import { GeneralManager, } from '../Modified027Editor/ModifiedStaticAPI';
import { ModifiedCameraSystem,CameraModifid, } from '../Modified027Editor/ModifiedCamera';
﻿import { EffectManager, SoundManager } from "../ExtensionType";
import GameUtils from "../utils/GameUtils";

@Component
export default class TransformTo extends mw.Script {

    @mw.Property({ displayName: "玩家传送到的位置" })
    private roleVec: mw.Vector = Vector.zero
    @mw.Property({ displayName: "玩家传送到的旋转" })
    private roleRot: mw.Rotation = Rotation.zero;
    @mw.Property({ displayName: "玩家传送到的镜头旋转" })
    private cameaRot: mw.Rotation = Rotation.zero;
    @mw.Property({ displayName: "玩家传送时音效" })
    private transformAudio: string = '7986';
    @mw.Property({ displayName: "玩家传送时特效" })
    private transformEff: string = '7986';
    @mw.Property({ displayName: "玩家传送时特效偏移" })
    private transformEffOffset: Vector = Vector.zero;

    @mw.Property({ displayName: "音效音量" })
    private volume: number = 1;

    @mw.Property({ displayName: "传送延迟" })
    private transformDelay: number = 1;


    /** 当脚本被实例后，会在第一帧更新前调用此函数 */
    protected onStart(): void {
        if (SystemUtil.isServer())
            return
        this.load()
        if (this.gameObject instanceof mw.Trigger) {
            this.gameObject.onEnter.add((go) => {
                if (GameUtils.isPlayerCharacter(go)) {
                    const player = Player.localPlayer;
                    player.character.movementEnabled = player.character.jumpEnabled = false

                    GeneralManager.rpcPlayEffectOnPlayer(this.transformEff,
                        player, mw.HumanoidSlotType.LeftFoot, 1, this.transformEffOffset, mw.Rotation.zero, new mw.Vector(2, 2, 2))
                    SoundManager.playSound(this.transformAudio, 1, this.volume)
                    setTimeout(() => {
                        player.character.movementEnabled = player.character.jumpEnabled = true
                        this.playertrasnformRotSysRot(this.roleVec, this.roleRot, this.cameaRot)
                    }, this.transformDelay * 1000)
                }
            })
        }
    }

    private async load() {
        const asset: string[] = [this.transformAudio]
        for (let index = 0; index < asset.length; index++) {
            const element = asset[index];
            await GameUtils.downAsset(element)
        }
    }

    /**设置玩家传送，玩家旋转，相机角度 */
    public playertrasnformRotSysRot(pos: mw.Vector, rot: mw.Rotation, sysRot: mw.Rotation) {
        const character = Player.localPlayer.character;
        if (pos) {
            character.worldTransform.position = pos.clone();
        }
        if (rot) {
            character.worldTransform.rotation = rot.clone();
        }
        if (sysRot) {
            ModifiedCameraSystem.setOverrideCameraRotation(sysRot);
            setTimeout(() => {
                ModifiedCameraSystem.resetOverrideCameraRotation();
            }, 32);
        }
    }

    /**
     * 周期函数 每帧执行
     * 此函数执行需要将this.useUpdate赋值为true
     * @param dt 当前帧与上一帧的延迟 / 秒
     */
    protected onUpdate(dt: number): void {

    }

    /** 脚本被销毁时最后一帧执行完调用此函数 */
    protected onDestroy(): void {

    }
}