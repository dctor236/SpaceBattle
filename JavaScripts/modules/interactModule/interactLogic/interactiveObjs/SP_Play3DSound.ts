/**
 * @Author       : 田可成
 * @Date         : 2023-03-29 13:43:40
 * @LastEditors  : 田可成
 * @LastEditTime : 2023-03-29 13:43:48
 * @FilePath     : \mollywoodschool\JavaScripts\modules\GameLogic\RPInteractiveObjs\RP_Sound.ts
 * @Description  : 
 */
import { GameConfig } from "../../../../config/GameConfig";
import { SoundManager } from "../../../../ExtensionType";
import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

@Component
export default class Play3DSound extends InteractObject {
	@mw.Property({ replicated: true, displayName: "资源ID列表", group: "属性" })//如果写了就播放固定id 如果没写就播放上个节点传下来的声音
	public resGuidList: string = "";
	@mw.Property({ replicated: true, displayName: "循环次数", group: "属性" })
	public loopNum: number = 1;

	@mw.Property({ replicated: true, displayName: "声音位置", group: "属性" })
	public worldPos: mw.Vector = mw.Vector.zero;

	@mw.Property({ replicated: true, displayName: "声音大小,0~1", group: "属性" })
	public volume: number = 1;

	@mw.Property({ replicated: true, displayName: "内部半径", group: "属性" })
	public innerRadius: number = 200;

	@mw.Property({ replicated: true, displayName: "衰减距离:maxDistance", group: "属性" })
	public maxDistance: number = 600;
	@mw.Property({ replicated: true, displayName: "是否停止当前BGM", group: "属性" })
	public isStopBgm: boolean = false

	onStart() {
		this.init(Play3DSound_S, Play3DSound_C);
	}
}
//客户端
class Play3DSound_C extends InteractLogic_C<Play3DSound> {
	onStart(): void {

	}

	onPlayerAction(playerId: number, active: boolean, param: any): void {
		if (this.info.isStopBgm) {
			if (active) {
				SoundManager.stopBGM()
			}
		}
	}

}
//服务端
class Play3DSound_S extends InteractLogic_S<Play3DSound> {
	private playId: number = 0;
	private curMusicIndex: number = 0;
	private musicList: Array<string>;

	onStart(): void {
		this.curMusicIndex = -1;
		this.musicList = [];
		let musicStrList = this.info.resGuidList.split(',');
		for (let i = 0; i < musicStrList.length; i++) {
			this.musicList.push(musicStrList[i]);
		}
	}

	onPlayerAction(playerId: number, active: boolean, param: any): void {
		if (active) {
			this.curMusicIndex = (this.curMusicIndex + 1) % this.musicList.length;
			let curMusicResStr = this.musicList[this.curMusicIndex];
			if (this.playId != 0) {
				SoundManager.stop3DSound(this.playId);
			}

			let pos = this.info.worldPos;
			if (this.info.worldPos.x == 0 && this.info.worldPos.y == 0 && this.info.worldPos.z == 0) {
				pos = this.gameObject.worldTransform.position.clone();
			}
			this.playId = SoundManager.play3DSound(curMusicResStr, pos, this.info.loopNum, this.info.volume, { radius: this.info.innerRadius, falloffDistance: this.info.maxDistance });
		} else {
			SoundManager.stop3DSound(this.playId);
			this.playId = 0;
		}
	}
}