import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

/**触发模式 */
enum Mode {
	/**自变化*/
	Alone = "alone",//自变化,每次激活都取反,退出重置默认状态
	/**依赖变化*/
	Depend = "depend"//依赖变化,上级激活ping 上级不激活pong
}
//PingPong运动，实现从初始状态到初始状态+偏移的往复运动，是两种状态的切换，不能做往返运动，如果想做往返运动请使用sp_sin
@Component
export default class PingPong extends InteractObject {
	@mw.Property({ displayName: "变化模式", selectOptions: { "自变化": Mode.Alone, "依赖变化": Mode.Depend }, group: "属性" })
	public mode: Mode = Mode.Depend;
	@mw.Property({ displayName: "默认alpha(0-1)", group: "属性" })
	public defauleAlpha: number = 0;
	@mw.Property({ displayName: "alpha速度", group: "属性" })//一个ping或者一个pong所需要的时间(秒)
	public speed: number = 1;//速度
	@mw.Property({ displayName: "ping坐标偏移", group: "属性" })
	public locationOff_ping: mw.Vector = mw.Vector.zero;
	@mw.Property({ displayName: "ping角度偏移", group: "属性" })
	public rotationOff_ping: mw.Vector = mw.Vector.zero;

	@mw.Property({ displayName: "pong坐标偏移", group: "属性" })
	public locationOff_pong: mw.Vector = mw.Vector.zero;
	@mw.Property({ displayName: "pong角度偏移", group: "属性" })
	public rotationOff_pong: mw.Vector = mw.Vector.zero;
	onStart() {
		this.init(PingPong_S, PingPong_C);
	}
}
class PingPong_C extends InteractLogic_C<PingPong> {
	protected onStart(): void {
		
	}
	public onPlayerAction(playerId: number, active: boolean, param: any): void {
	}
}
//服务端
class PingPong_S extends InteractLogic_S<PingPong> {
	private SPEED: number = 1;//速度
	private locationOff_ping: mw.Vector;//坐标偏移
	private rotationOff_ping: mw.Vector;//角度偏移
	private locationOff_pong: mw.Vector;//坐标偏移
	private rotationOff_pong: mw.Vector;//角度偏移

	private originalLocation: mw.Vector;//初始坐标
	private originalRotation: mw.Vector;//初始角度

	private targetAlpha: number = -1;//目标aloha(0到1) -1:不动
	private alpha: number = 0;
	private handleTimes: number = 0;
	onStart(): void {
		this.SPEED = this.info.speed;
		this.locationOff_ping = this.info.locationOff_ping;
		this.rotationOff_ping = this.info.rotationOff_ping;
		this.locationOff_pong = this.info.locationOff_pong;
		this.rotationOff_pong = this.info.rotationOff_pong;
		this.originalLocation = this.gameObject.localTransform.position;
		let ro = this.gameObject.localTransform.rotation
		this.originalRotation = new mw.Vector(ro.x, ro.y, ro.z)
		this.setAlpha(this.info.defauleAlpha);
	}
	//激活执行ping 不激活执行pong
	onPlayerAction(playerId: number, active: boolean) {
		if (this.info.mode == Mode.Depend) {
			active ? this.ping() : this.pong();
		} else {
			if (active) {
				++this.handleTimes % 2 == 1 ? this.ping() : this.pong();
			} else {
				this.setAlpha(this.info.defauleAlpha);
			}
		}
	}
	private setAlpha(value: number) {
		if (value < 0 || value > 1) return;
		this.targetAlpha = value;
		this.useUpdate = true;
	}
	private ping() {
		this.targetAlpha = 1;
		this.useUpdate = true;
	}
	private pong() {
		this.targetAlpha = 0;
		this.useUpdate = true;
	}
	onUpdate(dt: number) {
		if (this.alpha < this.targetAlpha) {
			this.alpha += dt * this.SPEED;
			if (this.alpha >= this.targetAlpha) {
				this.alpha = this.targetAlpha;
				this.useUpdate = false;
			}
		} else {
			this.alpha -= dt * this.SPEED;
			if (this.alpha <= this.targetAlpha) {
				this.alpha = this.targetAlpha;
				this.useUpdate = false;
			}
		}
		let pos = mw.Vector.add(this.originalLocation, mw.Vector.lerp(this.locationOff_pong, this.locationOff_ping, this.alpha))
		let rot = mw.Vector.add(this.originalRotation, mw.Vector.lerp(this.rotationOff_pong, this.rotationOff_ping, this.alpha));
		this.gameObject.localTransform.position = (pos);
		this.gameObject.localTransform.rotation = (new mw.Rotation(rot));
	}
}

