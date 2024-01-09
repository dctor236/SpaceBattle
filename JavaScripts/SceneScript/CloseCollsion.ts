@Component
export default class CloseCollsion extends mw.Script {

    /** 当脚本被实例后，会在第一帧更新前调用此函数 */

    protected onStart(): void {
        // this.gameObject["mwWheeledVehicle4W"].RootComponent.SetCollisionResponseToChannel(UE.ECollisionChannel.ECC_Pawn, UE.ECollisionResponse.ECR_Ignore);
        //关闭碰撞
        oTraceError("CloseCollsion.onStart");
        this.gameObject.setCollision(mw.PropertyStatus.On);
        this.gameObject["actor"].RootComponent.SetCollisionResponseToChannel(UE.ECollisionChannel.ECC_Pawn, UE.ECollisionResponse.ECR_Ignore);
    }
}