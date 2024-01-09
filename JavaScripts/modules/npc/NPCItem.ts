import { GameConfig } from "../../config/GameConfig";
import { ITalkEventElement } from "../../config/TalkEvent";
import NPCItem_Generate from "../../ui-generate/uiTemplate/NPC/NPCItem_generate";

export default class NPCItem extends NPCItem_Generate {
    public clicked: Action1<number> = new Action1<number>();

    private data: ITalkEventElement = null;


    onStart() {
        this.select.visibility = mw.SlateVisibility.Hidden;
        this.btn.onClicked.add(this.onClicked.bind(this));
    }

    public show(bool: boolean) {
        let visibility = bool ? mw.SlateVisibility.Visible : mw.SlateVisibility.Hidden;
        this.uiObject.visibility = visibility;
    }


    public setData(data: ITalkEventElement): void {
        this.data = data;
        this.icon.imageGuid = (data.ICON);
        this.select.imageGuid = (data.ICON2);
        if (data.accTaskId || data.finishTaskId) {
            this.des.fontColor = mw.LinearColor.yellow
        } else {
            this.des.fontColor = mw.LinearColor.white
        }
        this.des.text = (GameConfig.SquareLanguage.getElement(data.Name).Value);
        this.uiObject.size = new mw.Vector2(data.canvasSize[0], data.canvasSize[1])
        this.btn.size = new mw.Vector2(data.canvasSize[0], data.canvasSize[1])
    }

    public refreshSelect(selects: number[]): void {
        // this.select.visibility = (selects.includes(this.data.ID) ? mw.SlateVisibility.Visible : mw.SlateVisibility.Hidden);
    }

    private onClicked(): void {
        this.clicked.call(this.data.ID);
    }
}
