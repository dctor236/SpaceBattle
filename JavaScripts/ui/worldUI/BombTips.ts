import Bomb_Generate from "../../ui-generate/uiTemplate/3Dui/Bomb_generate";

export class BombTips extends Bomb_Generate {

    counting(time: number) {
        this.countDown.text = time + ""
        if (time <= 0) {
            return
        }
        setTimeout(() => {
            this.counting(--time)
        }, 1000);
    }
}