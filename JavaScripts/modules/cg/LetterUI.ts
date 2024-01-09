// /*
//  * @Author: jiezhong.zhang
//  * @Date: 2023-05-24 11:40:35
//  * @LastEditors: jiezhong.zhang jiezhong.zhang@appshahe.com
//  * @LastEditTime: 2023-05-25 13:06:14
//  */
// import { Tween, UIManager } from "../../ExtensionType"
// import LetterUI_Generate from "../../ui-generate/cg/LetterUI_generate"

// export default class LetterUI extends LetterUI_Generate {
//     private _routes: mw.Vector2[] = []

//     private cb?: () => void

//     protected onAwake(): void {
//         this.layer = mw.UILayerOwn;

//         this._routes.push(this.route1.position)
//         this._routes.push(this.route2.position)
//         this._routes.push(this.route3.position)
//         this._routes.push(this.route4.position)

//     }


//     /**
//      * 展示信件动画
//      */
//     public showLetter(content: string, cb?: () => void) {
//         if (!content || content.length <= 0) {
//             this.textLetterContent.text = "content"
//         }
//         else {
//             this.textLetterContent.text = content;
//         }
//         cb ? this.cb = cb : this.cb = null;
//         this.panelLetterContent.position = new mw.Vector2(-100, 1700)
//         this.panelLetter.visibility = mw.SlateVisibility.SelfHitTestInvisible
//         this.canvas_yes.visibility = mw.SlateVisibility.Hidden
//         this.btnYes.onClicked.clear()
//         this.btnYes.onClicked.add(() => {
//             UIManager.hide(LetterUI);
//         })
//         let startPoint = this._routes[0].clone()
//         this.panelLetterContent.renderTransformAngle = 0
//         let tween = new Tween({ x: startPoint.x, y: startPoint.y, angle: this.panelLetterContent.renderTransformAngle })
//             .to({
//                 x: [this._routes[1].x, this._routes[1].x, this._routes[3].x],
//                 y: [this._routes[1].y, this._routes[1].y, this._routes[3].y],
//                 angle: 1080
//             }, 500)
//             .onStart(() => {
//             })
//             .onUpdate((obj) => {
//                 this.panelLetterContent.position = new mw.Vector2(obj.x, obj.y)
//                 this.panelLetterContent.renderTransformAngle = obj.angle
//             })
//             .onComplete(async () => {
//                 // ActionMgr.instance().fadeIn(this.canvas_yes, 5000, this).delay(1000)

//             })
//             .start()
//     }

//     protected onHide(): void {
//         this.cb && this.cb();
//     }

//     public showYes() {
//         this.canvas_yes.visibility = mw.SlateVisibility.SelfHitTestInvisible
//         this.canvas_yes.renderOpacity = 0
//         let tween = new Tween({ opacity: 0 })
//             .to({ opacity: 1 }, 5000)
//             .onUpdate((obj) => {
//                 this.canvas_yes.renderOpacity = obj.opacity
//             })
//             .start()
//     }

// }