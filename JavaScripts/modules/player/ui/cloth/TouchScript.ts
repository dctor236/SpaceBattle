export namespace Enums {
    export enum TouchEvent {
        DOWN,
        MOVE,
        UP
    }
}
type ScreenListener = { widget: mw.Widget, callback: (widget: mw.Widget, type: Enums.TouchEvent, x: number, y: number, inPointerEvent: mw.PointerEvent) => void, adjuestCenter: boolean };

export class TouchScript {

    constructor() {
        this.captureMap = new Map();
        this.screenListeners = [];

    }
    onStart(): void {

    }
    private static _ins: TouchScript;
    public static get instance(): TouchScript {
        if (this._ins == null) {
            this._ins = new TouchScript();
        }
        return this._ins;
    }
    ///========================================================
    /**屏幕事件 */
    private screenListeners: ScreenListener[];


    private captureMap: Map<number, ScreenListener>;

    addScreenListener(widget: mw.Widget, callback: (widget: mw.Widget, type: Enums.TouchEvent, x: number, y: number, inPointerEvent: mw.PointerEvent) => void, adjuestCenter: boolean) {
        this.screenListeners.push({ widget: widget, callback: callback, adjuestCenter: adjuestCenter });
    }

    removeScreenListener(widget: mw.Widget) {
        for (let i = 0; i < this.screenListeners.length; i++) {
            if (this.screenListeners[i].widget == widget) {
                this.screenListeners.splice(i, 1);
                i--;
            }
        }
    }

    onTouchStarted(inGemory: mw.Geometry, inPointerEvent: mw.PointerEvent): mw.EventReply {
        for (let i = 0; i < this.screenListeners.length; i++) {

            const position = inPointerEvent.screenSpacePosition;
            const localPosition = mw.absoluteToLocal(inGemory, position);
            const pos = new mw.Vector2(this.screenListeners[i].widget.position.x, this.screenListeners[i].widget.position.y);
            const size = this.screenListeners[i].widget.size;
            if (localPosition.x > pos.x && localPosition.y > pos.y && localPosition.x < (pos.x + size.x) && localPosition.y < (pos.y + size.y)) {
                this.captureMap.set(inPointerEvent.pointerIndex, this.screenListeners[i]);
                this.screenListeners[i].callback(this.screenListeners[i].widget, Enums.TouchEvent.DOWN, localPosition.x, localPosition.y, inPointerEvent);
                return mw.EventReply.handled;
            }
        }
        return mw.EventReply.handled;
    }

    onTouchMoved(inGemory: mw.Geometry, inPointerEvent: mw.PointerEvent): mw.EventReply {
        if (this.captureMap.has(inPointerEvent.pointerIndex)) {
            const position = inPointerEvent.screenSpacePosition;
            const localPosition = mw.absoluteToLocal(inGemory, position);


            let capture = this.captureMap.get(inPointerEvent.pointerIndex);
            const pos = new mw.Vector2(capture.widget.position.x, capture.widget.position.y);
            const size = capture.widget.size;
            if (localPosition.x > pos.x && localPosition.y > pos.y && localPosition.x < (pos.x + size.x) && localPosition.y < (pos.y + size.y)) {
                capture.callback(capture.widget, Enums.TouchEvent.MOVE, localPosition.x, localPosition.y, inPointerEvent);
            }

        }
        return mw.EventReply.handled;
    }

    onTouchEnded(inGemory: mw.Geometry, inPointerEvent: mw.PointerEvent): mw.EventReply {
        if (this.captureMap.has(inPointerEvent.pointerIndex)) {
            const position = inPointerEvent.screenSpacePosition;
            const localPosition = mw.absoluteToLocal(inGemory, position);
            let capture = this.captureMap.get(inPointerEvent.pointerIndex)
            capture.callback(capture.widget, Enums.TouchEvent.UP, localPosition.x, localPosition.y, inPointerEvent);
            this.captureMap.delete(inPointerEvent.pointerIndex);
        }
        return mw.EventReply.handled;
    }
}