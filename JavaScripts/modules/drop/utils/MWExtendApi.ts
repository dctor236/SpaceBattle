declare namespace UI {
    export interface TextBlock {
        /**临时文本 */
        temptext: string;
        /**临时颜色 */
        tempfontColor: mw.LinearColor;
        /**临时字体大小 */
        tempfontSize: number;
    }
    export interface StaleButton {
        /**临时文本 */
        temptext: string;
        /**临时普通颜色 */
        tempnormalImageColor: mw.LinearColor;
        /**临时普通图片id */
        tempnormalImageGuid: string;
    }
    export interface Button {
        /**临时普通颜色 */
        tempnormalImageColor: mw.LinearColor;
        /**临时普通图片id */
        tempnormalImageGuid: string;
    }
}

declare namespace mw {
    export interface GameObject {
        /**临时transform */
        tempTransform: Transform;
        /**临时坐标 */
        tempLocation: mw.Vector;
        /**临时旋转 */
        tempRotation: mw.Rotation;
        /**临时缩放 */
        tempScale: mw.Vector;
    }
}
