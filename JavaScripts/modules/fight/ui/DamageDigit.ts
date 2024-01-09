// import { SpawnManager } from '../../../Modified027Editor/ModifiedSpawn';
// import { Tween } from "../../../ExtensionType"
// import { TS3 } from "../../../ts3/TS3"
// import { EnumDamageType } from "../FightDefine"
// import { WorldUIPool } from "../utils/UIPool"
// import { FightUtil } from "../utils/Utils"
// export class DamageDigit {
//     private static pool: WorldUIPool<DamageDigitView>

//     static showDamage(startPosition: mw.Vector, guid: string, context: string, damageType: EnumDamageType) {
//         this.checkPool()
//         let view = this.pool.get()
//         view.setInfo(startPosition, guid, context, damageType)
//     }

//     private static checkPool() {
//         if (DamageDigit.pool) return
//         this.pool = new WorldUIPool<DamageDigitView>(() => new DamageDigitView())
//     }

//     static scaleEaseFunc(x: number): number {
//         return Math.max(1, (-Math.pow(x, 3) + 1) * 1.5)
//     }

//     static opacityEaseFunc(x: number): number {
//         return Math.max(0, -Math.pow(x, 3) * 0.4 + 1)
//     }
// }

// class DamageDigitView {
//     uiWidget: mw.UIWidget
//     stage: boolean
//     private txt_context: mw.TextBlock
//     private txt_crit: mw.TextBlock
//     private startPosition: mw.Vector = Vector.zero
//     private readonly endPosition: mw.Vector
//     private readonly currentScale: mw.Vector2
//     private tween1: Tween<{ x: number }>
//     private tween2: Tween<{ x: number }>
//     private tween3: Tween<{ x: number }>

//     constructor() {
//         const uiWeight = SpawnManager.spawn({ guid: 'UIWidget', replicates: false }) as mw.UIWidget
//         uiWeight.setUIbyID('F1EA19E64019ADCD57ED3993ABF84791')
//         this.uiWidget = uiWeight
//         this.uiWidget.widgetSpace = mw.WidgetSpaceMode.OverheadUI
//         this.uiWidget.occlusionEnable = false
//         this.uiWidget.selfOcclusion = false
//         this.uiWidget.scaledByDistanceEnable = false
//         this.uiWidget.headUIMaxVisibleDistance = 99999
//         // this.uiWidget.drawSize = DamageDigitView.WeightSize
//         let uiRoot = this.uiWidget.getTargetUIWidget().rootContent;
//         this.txt_context = uiRoot.findChildByPath("txt_context") as mw.TextBlock
//         this.txt_crit = uiRoot.findChildByPath("txt_crit") as mw.TextBlock
//         this.endPosition = new mw.Vector()
//         this.currentScale = this.txt_context.renderScale.clone()
//         this.tween3 = new Tween({ x: 1 }).to({ x: 0 }, 300).onUpdate(obj => {
//             this.txt_context.renderOpacity = obj.x
//         }).onComplete(() => {
//             this.stage = false
//             this.uiWidget.setVisibility(mw.PropertyStatus.Off)
//         })
//         this.tween2 = new Tween({ x: 0 }).to({ x: 1 }, 500).onUpdate(obj => {
//             this.uiWidget.worldTransform.position = mw.Vector.lerp(this.startPosition, this.endPosition, obj.x)
//         }).chain(this.tween3)
//         this.tween1 = new Tween({ x: 0 }).to({ x: 1 }, 400).onUpdate(obj => {
//             let s = FightUtil.lerp(1, 0.5, FightUtil.pingPong(obj.x))
//             this.currentScale.x = s
//             this.currentScale.y = s
//             this.txt_context.renderScale = this.currentScale
//             this.txt_crit.renderScale = this.currentScale
//         }).chain(this.tween2)
//     }

//     setInfo(startPosition: mw.Vector, guid: string, context: string, damageType: EnumDamageType) {
//         this.txt_context.text = context
//         let ran1: number = 0
//         let ran2: number = 0
//         let ran3: number = 0
//         if (TS3.playerMgr.getPlayer(guid)) {
//             ran1 = MathUtil.randomInt(-5, 5) * 5
//             ran2 = MathUtil.randomInt(-5, -5) * 5
//             ran3 = MathUtil.randomInt(-5, 10) * 10
//         } else {
//             ran1 = MathUtil.randomInt(-5, -8) * 30
//             ran2 = MathUtil.randomInt(-5, -8) * 30
//             ran3 = MathUtil.randomInt(-5, -8) * 30
//         }


//         this.startPosition = new Vector(startPosition.x + ran1, startPosition.y + ran2, startPosition.z + ran3)
//         this.endPosition.x = this.startPosition.x
//         this.endPosition.y = this.startPosition.y
//         this.endPosition.z = this.startPosition.z + 110
//         this.uiWidget.worldTransform.position = this.startPosition
//         this.uiWidget.worldTransform.scale = new Vector(0.5, 0.5, 0.5)
//         this.uiWidget.refresh()

//         // // 玩家受伤还是怪物受伤
//         if ((damageType & EnumDamageType.playerInjure) == EnumDamageType.playerInjure) {
//             this.txt_context.setFontColorByHex("#FF6858")
//             this.txt_context.setShadowColorByHex("#C61B16")
//         }
//         else {
//             this.txt_context.setFontColorByHex("#FFFFFF")
//             this.txt_context.setShadowColorByHex("#633892")
//         }

//         // 是否暴击
//         if ((damageType & EnumDamageType.crit) == EnumDamageType.crit) {
//             this.txt_crit.visibility = mw.SlateVisibility.Visible
//         }
//         else {
//             this.txt_crit.visibility = mw.SlateVisibility.Hidden
//         }

//         this.txt_context.renderOpacity = 1
//         this.tween1.stop()
//         this.tween1.start()
//     }
// }