/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-02-06 09:06:48
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-02-08 14:24:15
 * @FilePath: \mollywoodschool\JavaScripts\utils\BtnTween.TS
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Tween } from "../ExtensionType";

const SCALE_TIME = 400

const tempScale = mw.Vector2.zero;
/**按钮缩放倍数 */
const BUTTON_SHRINK = new mw.Vector2(0.95, 0.95);
/**按钮正常倍数 */
const BUTTON_NORMAL = new mw.Vector2(1, 1);
export class BtnTween {
    static self(btn: mw.Button) {
        btn.onPressed.add(() => {
            btn.renderScale = btn.renderScale.set(BUTTON_SHRINK);
        })

        btn.onReleased.add(() => {
            new Tween({ x: BUTTON_SHRINK.x }).to({ x: BUTTON_NORMAL.x }, SCALE_TIME).onUpdate(obj => {
                tempScale.set(obj.x, obj.x)
                btn.renderScale = tempScale
            }).start().easing(mw.TweenUtil.Easing.Back.Out)
        })
    }

    static other(btn: mw.Button, other: mw.Widget) {
        btn.onPressed.add(() => {
            other.renderScale = other.renderScale.set(BUTTON_SHRINK);
        })

        btn.onReleased.add(() => {
            new Tween({ x: BUTTON_SHRINK.x }).to({ x: BUTTON_NORMAL.x }, SCALE_TIME).onUpdate(obj => {
                tempScale.set(obj.x, obj.x)
                other.renderScale = tempScale;
            }).start().easing(mw.TweenUtil.Easing.Back.Out)
        })
    }
}

export class TrueTween {
    static tween: Tween<{ x: number }> = null
    static time

    static playTrueTween(image: mw.Image) {
        if (this.tween !== null) {
            this.tween.stop()
        }
        clearTimeout(this.time)
        image.visibility = mw.SlateVisibility.SelfHitTestInvisible
        this.tween = new Tween({ x: 0.8 }).to({ x: 1.2 }, 300).yoyo(true).repeat(Infinity).onUpdate((obj) => {
            image.renderScale = image.renderScale.set(obj.x, obj.x);
        }).start()
        this.time = setTimeout(() => {
            this.tween.stop()
            this.tween = null
            image.visibility = mw.SlateVisibility.Collapsed
        }, 1000);
    }
}