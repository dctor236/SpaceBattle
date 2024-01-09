import { IClothPartElement } from "../../config/ClothPart";
import { GameConfig } from "../../config/GameConfig";
import { GlobalModule } from "../../const/GlobalModule";
import { UIManager } from "../../ExtensionType";
import { InputManager } from "../../InputManager";
import ClothRaceS from "./ClothRaceS";

export default class ClothRaceC extends ModuleC<ClothRaceS, null> {

    private clothPartMap: Map<number, IClothPartElement[]> = new Map()
    protected onStart(): void {
        const allClothPartElems = GameConfig.ClothPart.getAllElement()
        allClothPartElems.forEach(e => {
            if (!this.clothPartMap.has(e.ClothPart)) {
                this.clothPartMap.set(e.ClothPart, [])
            }
            let vec = this.clothPartMap.get(e.ClothPart)
            vec.push(e)
            this.clothPartMap.set(e.ClothPart, vec)

        })
    }

    protected onEnterScene(sceneType: number): void {


    }

    public getClothPartByType(type: number) {
        if (this.clothPartMap.has(type)) {
            return this.clothPartMap.get(type)
        }
    }

}