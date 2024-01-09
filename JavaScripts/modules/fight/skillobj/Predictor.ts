import { GoPool, Tween } from "../../../ExtensionType"
import { GamePlayerState } from "../../../ts3/player/PlayerDefine"
import { PlayerMgr } from "../../../ts3/player/PlayerMgr"
import { ESkillEffectType } from "../monsterSkill/MonsterSkillBase"
import { FightUtil } from "../utils/Utils"
import PredictorMgr from "./PredictorMgr"

/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-14 21:01:32
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-18 17:55:38
 * @FilePath: \vine-valley\JavaScripts\modules\fight\skillobj\Predictor.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const ErrorCircleRange: mw.Vector2 = new mw.Vector2(400, 400)
const CircleMaxRange = 4
const CircleRotation = new mw.Rotation(0, 90, 0)
const CircleDuation = 1.5

export default class Predictor {
    public atkVec: mw.Vector = new mw.Vector(3, 4, 5);
    public inspecterPos: mw.Vector = new mw.Vector(6, 6, 7);
    public effectType: number = -1;
    public state: number = 11;//0代表强行停止 1代表启动

    private centerView: mw.UIWidget
    private viewBG: mw.UIWidget
    private currentScale: mw.Vector = mw.Vector.zero
    private boxSize: Vector
    protected tween: Tween<{ val: number }>

    public init() {
        if (SystemUtil.isServer()) return
        this.centerView = GoPool.spawn('UIWidget') as mw.UIWidget
        this.centerView.widgetSpace = mw.WidgetSpaceMode.World
        this.centerView.drawSize = ErrorCircleRange
        this.centerView.worldTransform.rotation = CircleRotation
        this.centerView.setUIbyID('0D6BB7EE40F1DB07EA5B8E87E4D26391')
        this.centerView.setCollision(mw.PropertyStatus.Off, true)
        this.centerView.setVisibility(mw.PropertyStatus.Off, true)

        this.viewBG = GoPool.spawn('UIWidget') as mw.UIWidget
        this.viewBG.setUIbyID('662A52A549764DDA9B22D69C0CC29BDD')
        this.viewBG.widgetSpace = mw.WidgetSpaceMode.World
        this.viewBG.drawSize = ErrorCircleRange
        this.viewBG.worldTransform.rotation = CircleRotation
        this.viewBG.setCollision(mw.PropertyStatus.Off, true)
        this.viewBG.setVisibility(mw.PropertyStatus.Off, true)
        this.tween = new Tween<{ val: number }>({ val: 0 })
            .to({ val: CircleMaxRange }, 1500)//(CircleEndFrame - CircleStartFrame) * 1
            .onUpdate(obj => {
                this.setCenterViewLocation(obj.val)
            })
            .onComplete(() => {
                this.viewBG.setVisibility(mw.PropertyStatus.Off)
                this.centerView.setVisibility(mw.PropertyStatus.Off)
            })
            .onStop(() => {
                this.setCenterViewLocation(0)
                this.viewBG.setVisibility(mw.PropertyStatus.Off)
                this.centerView.setVisibility(mw.PropertyStatus.Off)
                GoPool.despawn(this.centerView)
                GoPool.despawn(this.viewBG)
                PredictorMgr.instance.unSpawn(this)
            })
    }

    onStart() {
        const player = Player.localPlayer
        // if (!player || player.state != GamePlayerState.Battle) return
        this.boxSize = player.character.getBoundingBoxExtent()
        this.viewBG.setVisibility(mw.PropertyStatus.On, true)
        this.centerView.setVisibility(mw.PropertyStatus.On, true)
        this.viewBG.worldTransform.scale = new mw.Vector(CircleMaxRange, CircleMaxRange, CircleMaxRange)
        let circlePos = this.atkVec
        let pos: Vector
        if (this.effectType != ESkillEffectType.Envir) {
            pos = new Vector(this.inspecterPos.x, this.inspecterPos.y,
                13464)
        } else {
            pos = this.inspecterPos
        }
        let forward = this.atkVec
        const qot = Quaternion.rotateZ(Quaternion.fromRotation(forward.clone().toRotation()), 90).toRotation()
        let right = new Vector(qot.x, qot.y, qot.z).normalized
        let finalPos = FightUtil.vector2World(circlePos, pos, forward, right)
        this.viewBG.worldTransform.position = finalPos
        this.centerView.worldTransform.position = finalPos
        this.tween.end()
        this.tween.start()
    }


    public start(effType: number, dir: Vector, inspecterPos: Vector) {
        this.effectType = effType
        this.atkVec = dir
        this.inspecterPos = inspecterPos
        this.onStart()
    }

    private setCenterViewLocation(val: number) {
        this.currentScale.x = val
        this.currentScale.y = val
        this.currentScale.z = val
        this.centerView.worldTransform.scale = this.currentScale
    }

}