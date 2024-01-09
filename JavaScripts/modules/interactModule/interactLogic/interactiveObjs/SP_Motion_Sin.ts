import InteractObject, { InteractLogic_C, InteractLogic_S } from "../InteractObject";

@Component
export default class SP_Sin extends InteractObject {
	@mw.Property({ displayName: "默认激活", group: "属性" })
	public isRuning: boolean = true;
	@mw.Property({ displayName: "初始角度", group: "属性" })
	public angleBegin: number = 0;
	@mw.Property({ displayName: "角速度", group: "属性" })
	public angleSpeed: number = 360;
	@mw.Property({ displayName: "位置变化", group: "属性" })
	public location: mw.Vector = mw.Vector.zero;
	@mw.Property({ displayName: "旋转变化", group: "属性" })
	public rotation: mw.Vector = mw.Vector.zero;
	@mw.Property({ displayName: "停止重置", group: "属性" })
	public stopReset: boolean = true;

	protected onStart(): void {
		this.init(Sin_S, Sin_C);
	}
}
//客户端
class Sin_C extends InteractLogic_C<SP_Sin> {
	protected onStart(): void {
		
	}
	public onPlayerAction(playerId: number, active: boolean, param: any): void {
		
	}
}
//服务端
class Sin_S extends InteractLogic_S<SP_Sin> {
	private isRuning: boolean = true;
	private angle: number;
	private originalLocation: mw.Vector;
	private originalRotation: mw.Rotation;
	onStart(): void {
		this.isRuning = this.info.isRuning;
		this.angle = this.info.angleBegin;
		this.originalLocation = this.gameObject.localTransform.position;
		this.originalRotation = this.gameObject.localTransform.rotation;
		this.refreshAngle();
		this.useUpdate = true;
	}
	onPlayerAction(playerId: number, isActive: boolean) {
		if (this.isRuning != isActive) {
			this.isRuning ? this.stop() : this.play();
		}
	}
	public play(): void {
		this.isRuning = true;
	}
	public stop(): void {
		this.isRuning = false;
		if (this.info.stopReset) {
			this.angle = this.info.angleBegin;
			this.refreshAngle();
		}
	}
	onUpdate(dt: number): void {
		if (!this.isRuning) return;
		this.angle += this.info.angleSpeed * dt;
		this.refreshAngle();
	}
	private refreshAngle() {
		let alpha = Math.sin(this.angle * Math.PI / 180);
		this.gameObject.localTransform.position = (mw.Vector.add(this.originalLocation, mw.Vector.multiply(this.info.location, alpha)));
		let rotation = mw.Rotation.zero;
		mw.Rotation.add(this.originalRotation, (new mw.Rotation(mw.Vector.multiply(this.info.rotation, alpha))), rotation);
		this.gameObject.localTransform.rotation = (rotation);
	}

}