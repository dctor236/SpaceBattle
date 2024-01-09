import { loadAssetEnd, loadAssets } from "./PropTool";
/** 道具基本数据体 */
export class PropBaseData {
    /** 配置ID */
    IDConfig: number;
    /** 索引ID */
    IDIndex: number;
    /** 道具模型Guid*/
    ModelGuid: string;

    public analysis(_data: any): void {
        try {
            this.IDConfig = _data["ID"];
            this.IDIndex = _data["IDIndex"];
            this.ModelGuid = _data["ModelGuid"];
        } catch (error) {
            console.error(`PROP BASE DATA CONFIG ERROR`);
        }
    }
    public async ready() {
        await loadAssetEnd(this.ModelGuid);
    }
}
/** 动作类道具数据体 */
export class PropBaseData_Action extends PropBaseData {

    /**道具下一个状态ID*/
    NextID: number;
    /**道具挂点 */
    ObjPoint: number;
    /**位置参数：位置,旋转,缩放（9）*/
    ObjParameter: Array<number>;

    /**动作Guid*/
    AnimGuid: string;
    /**动作混合模式： 0、上半身 1、下半身 2、全身 3 不混合 */
    BlendMode: number;
    /**动作参数: 时间,循环（3）*/
    AnimParameter: Array<number>;

    /**特效Guid*/
    EffGuid: string;
    /**特效参数：位置,旋转,缩放（9）*/
    EffParameter1: Array<number>;
    /**特效参数：循环（2）*/
    EffParameter2: number;

    /**音效资源Guid*/
    SoundGuid: string;
    /**音效配置：范围,音量,循环（3）*/
    SoundParameter: Array<number>;

    /**材质资源Guid */
    MaterialGuid: string;

    /**按钮iconGuid*/
    IconBtn: string;

    /**音效资源Guid*/
    BuffRange: number
    /**音效配置：范围*/
    BuffID: number

    public analysis(_data: any) {
        super.analysis(_data);
        try {
            this.NextID = _data["NextID"];

            this.ObjPoint = _data["ObjPoint"];
            this.ObjParameter = _data["ObjParameter"];

            this.AnimGuid = _data["AnimGuid"];
            this.BlendMode = _data["BlendMode"];
            this.AnimParameter = _data["AnimParameter"];

            this.EffGuid = _data["EffGuid"];
            this.EffParameter1 = _data["EffParameter1"];
            this.EffParameter2 = _data["EffParameter2"];

            this.SoundGuid = _data["SoundGuid"];
            this.SoundParameter = _data["SoundParameter"];

            this.MaterialGuid = _data["MaterialGuid"];

            this.IconBtn = _data["IconBtn"];

            this.BuffRange = _data["BuffRange"];
            this.BuffID = _data["BuffID"];

        } catch (error) {
            console.error(`PROP BASE DATA CONFIG ERROR`);
        }
    }
    public async ready(): Promise<void> {
        await super.ready();
        // await loadAssetEnd(this.AnimGuid);
        await loadAssetEnd(this.EffGuid);
        // await loadAssetEnd(this.SoundGuid);
        // await loadAssetEnd(this.MaterialGuid);
        // await loadAssetEnd(this.IconBtn);
        await loadAssets([this.AnimGuid, this.EffGuid, this.SoundGuid, this.MaterialGuid, this.IconBtn])
    }

}
/** 飞行类道具数据体 */
export class PropBaseData_Fly extends PropBaseData {

    /**道具挂点 */
    ObjPoint: number;
    /**位置参数：位置,旋转,缩放（9）*/
    ObjParameter: Array<number>;

    /** 道具特效 */
    effGuid: string;

    /**向上飞行姿态 */
    flyGoUpStance: string;
    /**向上飞行速度 */
    flyGoUpSpeed: number;

    /**加速时间 */
    flyAccelerateTime: number;
    /**加速动作Guid */
    flyAccelerateAnimGuid: string;
    /**加速后飞行速度 */
    flyAccelerateSpeed: number;
    /**加速后飞行制动 */
    flyAccelerateBraking: number;
    /**加速特效Guid */
    flyAccelerateEffGuid: string;
    /**加速特效参数：位置，旋转，缩放  */
    flyAccelerateEffParameter: Array<number>;
    /**加速拖尾Guid */
    flyAcceleratejetWkeFlameGuid: string;
    /**加速拖尾参数：位置，旋转，缩放 */
    flyAcceleratejetWkeFlameParameter: Array<number>;

    /** 飞行特效 */
    flyWakeFlameGuid: string;
    /** 飞行特效参数左：位置,旋转,缩放（9） */
    flyWakeFlameParameterLeft: Array<number>;
    /** 飞行特效参数右：位置,旋转,缩放（9） */
    flyWakeFlameParameterRight: Array<number>;

    /** 飞行拖尾 */
    jetWakeFlameGuid: string;
    /** 飞行拖尾参数左：位置,旋转,缩放（9） */
    jetWakeFlameParameterLeft: Array<number>;
    /** 飞行拖尾参数右：位置,旋转,缩放（9） */
    jetWakeFlameParameterRight: Array<number>;
    /** 飞行姿态 */
    activeAnimGuid: string;
    /** BuffID */
    buffId: number;

    public analysis(_data: any): void {
        super.analysis(_data);
        try {
            this.ObjPoint = _data["ObjPoint"];
            this.ObjParameter = _data["ObjParameter"];

            this.effGuid = _data["effGuid"];

            this.flyGoUpSpeed = _data["flyGoUpSpeed"];
            this.flyGoUpStance = _data["flyGoUpStance"];

            this.flyAccelerateTime = _data["flyAccelerateTime"];

            this.flyAccelerateAnimGuid = _data["flyAccelerateAnimGuid"];
            this.flyAccelerateSpeed = _data["flyAccelerateSpeed"];
            this.flyAccelerateBraking = _data["flyAccelerateBraking"];

            this.flyAccelerateEffGuid = _data["flyAccelerateEffGuid"];
            this.flyAccelerateEffParameter = _data["flyAccelerateEffParameter"];

            this.flyAcceleratejetWkeFlameGuid = _data["flyAcceleratejetWkeFlameGuid"];
            this.flyAcceleratejetWkeFlameParameter = _data["flyAcceleratejetWkeFlameParameter"];

            this.flyWakeFlameGuid = _data["flyWakeFlameGuid"];
            this.flyWakeFlameParameterLeft = _data["flyWakeFlameParameterLeft"];
            this.flyWakeFlameParameterRight = _data["flyWakeFlameParameterRight"];

            this.jetWakeFlameGuid = _data["jetWakeFlameGuid"];
            this.jetWakeFlameParameterLeft = _data["jetWakeFlameParameterLeft"];
            this.jetWakeFlameParameterRight = _data["jetWakeFlameParameterRight"];

            this.activeAnimGuid = _data[`activeAnim`];

            this.buffId = _data[`buffID`];


        } catch (error) {
            console.error(`PROP BASE DATA CONFIG ERROR`);
        }
    }
    public async ready(): Promise<void> {
        // await super.asyncReady();
        // await loadAssetEnd(this.effGuid);
        // await loadAssetEnd(this.flyGoUpStance);
        // await loadAssetEnd(this.flyAccelerateAnimGuid);
        // await loadAssetEnd(this.flyAccelerateEffGuid);
        // await loadAssetEnd(this.flyAcceleratejetWkeFlameGuid);
        // await loadAssetEnd(this.flyWakeFlameGuid);
        // await loadAssetEnd(this.jetWakeFlameGuid);
        // await loadAssetEnd(this.activeAnimGuid);

        await loadAssets([this.effGuid, this.flyGoUpStance, this.flyAccelerateAnimGuid, this.flyAccelerateEffGuid, this.flyAcceleratejetWkeFlameGuid, this.flyWakeFlameGuid, this.jetWakeFlameGuid, this.activeAnimGuid])
    }
}
/** 放置类道具数据体 */
export class PropBaseData_Placement extends PropBaseData {

    /**道具挂点 */
    ObjPoint: number;
    /**位置参数：位置,旋转,缩放（9）*/
    ObjParameter: Array<number>;
    /**使用道具挂点 */
    ObjUsePoint: number;
    /**使用位置参数：位置,旋转,缩放（9）*/
    ObjUseParameter: Array<number>;

    /**道具CD时间 */
    ObjPlaceCD: number;
    /**道具图标Guid */
    IconPropGuid: string;

    /** 道具特效Guid */
    ObjEffGuid: string;

    /** 装备动作Guid */
    AnimEquipGuid: string;
    /** 装备动作相关参数: 时间*/
    AnimEquipParameter: number;

    /** 使用动作Guid */
    AnimUseGuid: string;
    /** 使用动作相关参数: 时间*/
    AnimUseParameter: number;

    /** 道具放置向前偏移 */
    DelayOffsetFront: number;

    /** 延迟模型Guid */
    DelayModelGuid: string;
    /** 延迟模型偏移参数：位置，旋转，缩放 */
    DelayModelParameter: Array<number>;
    /** 延迟模型对应特效Guid */
    DelayModelEffGuid: string;
    /** 延迟模型对应特效偏移参数：位置，旋转，缩放 */
    DelayModelEffParameter: Array<number>;

    /** 延迟特效Guid */
    DelayEffGuid: string;
    /** 延迟特效相关参数：位置，旋转，缩放 */
    DelayEffParameter: Array<number>;

    /** 延迟声音Guid */
    DelaySoundGuid: string;
    /** 延迟声音相关参数：音量，范围*/
    DelaySoundParameter: Array<number>;

    /** 延迟生效时间 */
    DelayTime: number;
    /** 延迟效果次数 */
    DelayCount: number;
    /** 延迟效果次数间隔时间 */
    DelayCountTime: number;
    /** 延迟生效距离 */
    DelayRange: number;
    /** 道具Buff的ID */
    DelayBuff: Array<number>;

    public analysis(_data: any) {
        super.analysis(_data);
        try {
            this.ObjPoint = _data["ObjPoint"];
            this.ObjParameter = _data["ObjParameter"];

            this.ObjUsePoint = _data["ObjUsePoint"];
            this.ObjUseParameter = _data["ObjUseParameter"];

            this.ObjPlaceCD = _data["ObjPlaceCD"];
            this.IconPropGuid = _data["IconPropGuid"];

            this.ObjEffGuid = _data["ObjEffGuid"];

            this.AnimEquipGuid = _data["AnimEquipGuid"];
            this.AnimEquipParameter = _data["AnimEquipParameter"];

            this.AnimUseGuid = _data["AnimUseGuid"];
            this.AnimUseParameter = _data["AnimUseParameter"];

            this.DelayOffsetFront = _data["DelayOffsetFront"];

            this.DelayModelGuid = _data["DelayModelGuid"];
            this.DelayModelParameter = _data["DelayModelParameter"];
            this.DelayModelEffGuid = _data["DelayModelEffGuid"];
            this.DelayModelEffParameter = _data["DelayModelEffParameter"];


            this.DelayEffGuid = _data["DelayEffGuid"];
            this.DelayEffParameter = _data["DelayEffParameter"];

            this.DelaySoundGuid = _data["DelaySoundGuid"];
            this.DelaySoundParameter = _data["DelaySoundParameter"];

            this.DelayTime = _data["DelayTime"];
            this.DelayCount = _data["DelayCount"];
            this.DelayCountTime = _data["DelayCountTime"];
            this.DelayRange = _data["DelayRange"];
            this.DelayBuff = _data["DelayBuff"];

        } catch (error) {
            console.error(`PROP BASE DATA CONFIG ERROR`);
        }
    }
    public async ready(): Promise<void> {
        await super.ready();
        // await loadAssetEnd(this.IconPropGuid);
        // await loadAssetEnd(this.ObjEffGuid);
        // await loadAssetEnd(this.AnimEquipGuid);
        // await loadAssetEnd(this.AnimUseGuid);
        // await loadAssetEnd(this.DelayModelGuid);
        // await loadAssetEnd(this.DelayModelEffGuid);
        // await loadAssetEnd(this.DelayEffGuid);
        // await loadAssetEnd(this.DelaySoundGuid);
        await loadAssets([this.DelayModelGuid, this.IconPropGuid, this.ObjEffGuid, this.AnimEquipGuid, this.AnimUseGuid, this.DelayModelEffGuid, this.DelayEffGuid, this.DelaySoundGuid])
    }
}