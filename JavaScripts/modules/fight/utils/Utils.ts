import { PlayerManagerExtesion, } from '../../../Modified027Editor/ModifiedPlayer';
import { Tween } from "../../../ExtensionType";


export enum TweenType {
    /**缩放 */
    Scale = 1,
    /**旋转 */
    Rotate,
    /**位移 */
    Offset,
    /**旋转且位移 */
    RotateAndOffset,
}

export namespace FightUtil {
    /**
 * 类装饰器-自动init，可以自动调用类的静态init方法
 * @param target 类目标
 */

    export type Vector3Like = { x: number, y: number, z: number }

    export function AutoInit(target) {
        if (target["init"] != null) {
            target["init"]();
        }
    }

    /**
 * 简单效果动画
 * @param obj 物品
 * @param type 动画种类
 * @param time 时间
 * @param param 参数
 * @returns 
 */
    export function simpleTween(obj: mw.GameObject, type: TweenType, time: number, param: any[]) {
        if (type === TweenType.Scale) {
            let scale = param[1] ? param[1] : mw.Vector.one;
            obj.worldTransform.scale = scale.clone().multiply(time * param[0]);
            return;
        }

        if (type === TweenType.Offset || type === TweenType.RotateAndOffset) {
            let loc = obj.localTransform.position;
            loc.z = param[0] * time;
            obj.localTransform.position = loc;
        }

        if (type === TweenType.Rotate || type === TweenType.RotateAndOffset) {
            let rot = obj.localTransform.rotation;
            rot.z = (type === TweenType.RotateAndOffset ? param[1] : param[0]) * time;
            obj.localTransform.rotation = rot;
        }
    }


    /**
   *
   * @param min 最小值
   * @param max 最大值
   * @param n 生成n个不重复的数字在[min,max]中
   * @returns Array<number>
   */
    export function GetSomeRandomNumber(min: number, max: number, n: number) {
        if (n > max - min + 1) {
            console.error(`something error`);
            return;
        }

        let outer_list: Array<number> = new Array();
        let res: Array<number> = new Array();
        for (let i = min; i <= max; i++) {
            res.push(i);
        }

        while (n > 0) {
            //随机获取到一个数字，然后我再从数组中去除这个数
            let outer_index = MathUtil.randomInt(0, res.length);
            let outer = res[outer_index];
            res[outer_index] = res[res.length - 1];
            res.pop();
            outer_list.push(outer)
            n--;
        }

        return outer_list;
    }

    /**
    * 在数组中随机选择num个数，
    * @param arr 数组
    * @param num 随机的数量
    * @returns
    */
    export function Random(arr: Array<any>, num: number): Array<any> {
        let randomArray = FightUtil.GetSomeRandomNumber(0, arr.length - 1, num);
        let index = 0;
        let resArr = new Array();
        if (arr.length >= num) {
            for (let i = 0; i < num; i++) {
                let member = arr[randomArray[index++]];
                resArr.push(member);
            }
            return resArr;
        } else {
            console.error("数组长度" + arr.length + "小于随机选择的数量" + num);
        }
    }


    /**
    * 从一个gameObject上根据路径找一个脚本（Server & Client）
    * @param go GameObject
    * @param path 脚本路径
    * @returns 脚本对象
    */
    export function findScriptFromGo_sync(go, path) {
        if (go == null || mw.StringUtil.isEmpty(path))
            return null;
        let arr = path.split('/');
        let sp;
        for (let i = 0; i < arr.length; i++) {
            if (i == arr.length - 1) {
                sp = go.getScriptByName(`${arr[i]}.ts`);
                if (sp == null)
                    sp = go.getScriptByName(arr[i]);
                if (sp == null) {
                    console.error('FindSceneObjScriptError path=' + path + "   -tsFile:" + arr[i]);
                    return null;
                }
            }
            else {
                if (arr[i] == '..') {
                    go = go.parent;
                }
                else {
                    go = go.getChildByName(arr[i]);
                }
                if (go == null) {
                    console.error('FindSceneObjScriptError path=' + path + "   -node:" + arr[i]);
                    return null;
                }
            }
        }
        return sp;
    }

    export interface Vector2Like {
        x: number
        y: number
    }

    export function distanceXY(a: Vector2Like, b: Vector2Like): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
    }

    export function distanceNumberXY(ax: number, ay: number, bx: number, by: number): number {
        return Math.abs(ax - bx) + Math.abs(ay - by)
    }

    // 数字插值
    export function lerp(from: number, to: number, time: number): number {
        return (to - from) * time + from
    }

    // 颜色插值
    let __tempColor = new mw.LinearColor(0, 0, 0)
    export function colorLerp(from: mw.LinearColor, to: mw.LinearColor, t: number): mw.LinearColor {
        __tempColor.r = lerp(from.r, to.r, t)
        __tempColor.g = lerp(from.g, to.g, t)
        __tempColor.b = lerp(from.b, to.b, t)
        __tempColor.a = lerp(from.a, to.a, t)
        return __tempColor
    }

    // [0-1]
    export function pingPong(t: number): number {
        return Math.abs(t % 1 - 0.5) * 2
    }

    //cycle为一个周期
    export function shake(t: number, cycle: number) {
        let floor = Math.floor(t / cycle) % 2
        let ping = Math.abs((t + 0.75) % 1 - 0.5) * 2;
        return Math.min(floor + ping, 1 - (floor * 0.5));
    }

    // 根据秒数转换成MM:SS
    export function toMM_SSText(second: number): string {
        let m = Math.floor(second / 60)
        let s = Math.floor(second % 60)
        return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
    }

    export function playSound(guid: string, loopNum: number = 1, volume: number = 1) {
        mw.SoundService.stopSound(guid);
        mw.SoundService.playSound(guid, loopNum, volume);
    }

    export function play3DSound(guid: string, pos: mw.Vector, loopNum: number = 1, volume: number = 1) {
        mw.SoundService.play3DSound(guid, pos, loopNum, volume);
    }
    /**
     * 根据鱼的前进方向改变鱼的旋转
     * @param vec 鱼的前进方向
     * @returns 鱼的旋转
     */
    export function myFishRotation(vec: mw.Vector2) {
        let rotation = new mw.Rotation(0, 0, (Math.atan(vec.y / vec.x) * 180) / 3.14);
        if (vec.x < 0) {
            rotation = rotation.add(new mw.Rotation(0, 0, 180));
        }
        return rotation;
    }
    /**
     * 本地播放动画
     * @param owner 播放者
     * @param animationGuid 动画guid
     * @param loop 是否循环
     * @param rate 动画速率
     */
    export function playAnimationLocally(owner: mw.Character | mw.Character | mw.Character, animationGuid: string, loop: number, rate: number) {
        if (owner === undefined || owner === null) return;
        let anim = PlayerManagerExtesion.loadAnimationExtesion(owner, animationGuid, false);
        anim.loop = loop;
        anim.speed = rate;
        anim.play();
        return anim;
    }

    /**
     * 数组转位置，旋转，缩放
     * @param arr 9位数组
     * @returns 转换后的结构
     */
    export function mathTools_arryToVector(arr: Array<number>): { loc: mw.Vector, Roc: mw.Rotation, Scale: mw.Vector } {
        if (arr.length == 9) {
            let newArr: { loc: mw.Vector, Roc: mw.Rotation, Scale: mw.Vector } = { loc: new mw.Vector(arr[0], arr[1], arr[2]), Roc: new mw.Rotation(arr[3], arr[4], arr[5]), Scale: new mw.Vector(arr[6], arr[7], arr[8]) };
            return newArr;
        } else {
            console.error(`mathTools_arryToVector :: ==== :: error `);
        }
    }


    export function vector2World(vector: Vector3Like, worldPosition: mw.Vector, forward: mw.Vector, right: mw.Vector): mw.Vector {
        return new mw.Vector(
            vector.x * forward.x + vector.y * right.x + worldPosition.x,
            vector.x * forward.y + vector.y * right.y + worldPosition.y,
            vector.x * forward.z + vector.y * right.z + vector.z + worldPosition.z,
        )
    }
    /**
     * 触发器判断  作用于客户端
     * @param obj 触发物
     * @returns 判断结果
     */
    export const isCharacter = (obj: mw.GameObject) => {
        if (!obj) return false;
        if (!(PlayerManagerExtesion.isCharacter(obj))) return false;
        let player = (obj as mw.Character).player;
        if (player != Player.localPlayer) return false;
        return true;
    }


    /**
 * 时间cd器
 */
    export class CdElement {
        private currentTime: number;
        constructor(
            private cdTime: number,
        ) {
            this.currentTime = Date.now();
        }
        /**cd 处理 */
        handle() {

            let now = Date.now();
            if (now - this.currentTime > this.cdTime * 1000) {
                this.currentTime = now;
                return true;
            }
            else { return false; }
        }
    }

    //缩略字符
    export function breviaryString(str: string, limit: number): string {
        if (str.length > limit) {
            return str.slice(0, limit) + "...";
        } else {
            return str;
        }
    }

    export let gmSwitch: boolean;
    /**多语言：-1默认本机语言，0：英文，1：中文 */
    export let selectedLanguageIndex: number;
    /**多语言map */
    export let languageMap: Map<string, string> = new Map();



    /**
* 震荡函数
* @param x
* @param speed 震荡衰减/增益的速度
* @param frequency 震荡的频率
* @param amplitude 震荡的幅度
* @returns
*/
    export function shakeFunc(x: number, speed: number, frequency: number, amplitude: number) {
        return (Math.pow(speed, -x) * Math.sin(2 * frequency * Math.PI * x)) / amplitude;
    }
    export function shakeObj_2(gameObj: mw.GameObject, allTime: number, speed: number, frequency: number, amplitude: number, coefficient: number) {
        new Tween({ time: 0 })
            .to({ time: 1 }, allTime)
            .onUpdate((obj) => {
                let y = shakeFunc(obj.time, speed, frequency, amplitude) * coefficient;
                let baseRot = gameObj.localTransform.rotation.clone();
                baseRot.y = y;
                gameObj.localTransform.rotation = (baseRot);
            })
            .start()
    }


    export function shakeObj(gameObj: mw.GameObject, allTime: number, speed: number, frequency: number, amplitude: number, coefficient: number) {
        new Tween({ time: 0 })
            .to({ time: 1 }, allTime)
            .onUpdate((obj) => {
                let y = shakeFunc(obj.time, speed, frequency, amplitude) * coefficient;
                let baseRot = gameObj.localTransform.rotation;
                let rot = new mw.Rotation(baseRot.x, y, baseRot.z);
                gameObj.localTransform.rotation = (rot);
                let baseScale = gameObj.localTransform.scale;
            })
            .start().onComplete()
    }
    /**大数处理 */
    export function getBigNum(num: number): string {
        let str = "";
        if (num <= 9999) {
            str = Math.round(num) + "";
        } else if (num > 9999 && num <= 999999) {
            str = Math.floor(num / 1000) + "K";
        } else {
            str = (num / 1000000).toFixed(0) + "M";
        }
        return str;
    }
    /**获取日期 */
    export function getCurrentDate(): [number, number, number] {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        return [year, month, day];
    }

    // /**
    // * 震动物体
    // */
    // export function ShakeObj(obj: mw.GameObject, axis: mw.Vector, duration: number = 100, amplitude: number, times: number = 0) {
    //     let originScale = obj.worldTransform.scale.clone()
    //     let newScale = new mw.Vector2(originScale.x * amplitude, originScale.y * amplitude)
    //     return new Tween(originScale.clone(), target)
    //         .to(newScale, duration)
    //         .onUpdate((scale) => {
    //             ui.renderScale = scale
    //         })
    //         .start()
    //         .yoyo(true)
    //         .repeat(times)
    //         .onComplete(() => {
    //             ui.renderScale = new mw.Vector2(originScale.x, originScale.y)
    //             completeCB && completeCB()
    //         })
    // }


    /**
     * 震动UI
     */
    export function ShakeUI(ui: mw.Widget, target: any, duration: number = 100, amplitude: number = 1.2, times: number = 5, completeCB?: () => void) {
        let originScale = ui.renderScale.clone()
        let newScale = new mw.Vector2(originScale.x * amplitude, originScale.y * amplitude)
        return this.runTween(originScale.clone(), target)
            .to(newScale, duration)
            .onUpdate((scale) => {
                ui.renderScale = scale
            })
            .start()
            .yoyo(true)
            .repeat(times)
            .onComplete(() => {
                ui.renderScale = new mw.Vector2(originScale.x, originScale.y)
                completeCB && completeCB()
            })
    }

}
