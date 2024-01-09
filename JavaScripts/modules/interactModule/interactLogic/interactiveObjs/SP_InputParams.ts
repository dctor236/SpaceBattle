import InteractMgr from "../../InteractMgr";
import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

/**触发模式 */
enum Mode {
	/**随机*/
	Random = "random",//随机
	/**循环*/
	Loop = "loop"//循环
}
/**
 * 交互物-输出参数
 * 作用：上个节点触发后，将本节点设置的参数队列按照一定规则传递给后续节点
 */
@Component
export default class SP_InputParams extends InteractObject {
	@mw.Property({ displayName: "参数列表", group: "属性" })//,分隔 ‘null’代表null
	public itemList: string = "";
	@mw.Property({ displayName: "模式", selectOptions: { "循环": Mode.Loop, "随机": Mode.Random }, group: "属性" })
	public mode: string = Mode.Loop;

	onStart() {
		this.init(InputParams_S, InputParams_C);
	}
}
//客户端
class InputParams_C extends InteractLogic_C<SP_InputParams> {
	onStart(): void {
		
	}
	public onPlayerAction(playerId: number, active: boolean, param: any): void {
	}
}
//服务端
class InputParams_S extends InteractLogic_S<SP_InputParams> {
	private itemArr: Array<string> = null;
	private currentIndex: number = -1;//当前索引
	onStart(): void {

	}
	onPlayerAction(playerId: number, active: boolean, param: any): void {
		if (!active) {
            InteractMgr.instance.activeNextHandle(this.info, active, param)
			return;
		}
		if (this.itemArr == null) {
			if (mw.StringUtil.isEmpty(this.info.itemList)) {
				this.itemArr = [];
			} else {
				this.itemArr = this.info.itemList.split(',');
				for (let i = 0; i < this.itemArr.length; i++) {
					if (this.itemArr[i] == 'null') {
						this.itemArr[i] = null;
					}
				}
			}
		}
		if (this.itemArr.length == 0) {
            InteractMgr.instance.activeNextHandle(this.info, active, null)
		} else {
			if (this.info.mode == Mode.Random) {
				this.currentIndex = mw.MathUtil.randomInt(0, this.itemArr.length);
			} else {
				this.currentIndex = (this.currentIndex + 1) % this.itemArr.length;
			}
            InteractMgr.instance.activeNextHandle(this.info, active, this.itemArr[this.currentIndex])
		}
	}
}