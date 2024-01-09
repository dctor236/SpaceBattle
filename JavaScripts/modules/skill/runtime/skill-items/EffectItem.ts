
import { BehaviorType, ISkillEntity, ISkillItemParam, ISkillLine, ISkillTimer, SkillItemType } from "../../define/SkillDefine";
import { RuntimeConst } from "../Const";
import { RunTimePool } from "../RunTimePool";
import { RunTimeUtil } from "../RunTimeUtil";
import { SkillBaseItem } from "./BaseItem";

/** 
 * @Author       : xianjie.xia
 * @LastEditors  : 田可成
 * @Date         : 2022-11-16 09:23
 * @LastEditTime : 2023-03-17 11:00:32
 * @description  : 
 */
export class EffectItem extends SkillBaseItem {

    public effect: string;

    public loop: number;    //循环次数
    public solt: number;    //插槽
    public postion = new mw.Vector(0, 0, 0);
    public rotation = new mw.Rotation(0, 0, 0);
    public scale = new mw.Vector(0, 0, 0);
    private _color = new mw.LinearColor(1, 1, 1, 1);

    private _angel = 0;
    private _dis = 0;
    protected onParse(data: ISkillItemParam) {
        this.effect = data.p1;
        mw.AssetUtil.asyncDownloadAsset(this.effect);
        this.loop = !data.p2 ? 1 : data.p2;
        this.solt = data.p3 != undefined ? data.p3 : -1;

        this.postion.x = data.p4 ? data.p4[0] : 0;
        this.postion.y = data.p4 ? data.p4[1] : 0;
        this.postion.z = data.p4 ? data.p4[2] : 0;

        this.rotation.x = data.p5 ? data.p5[0] : 0;
        this.rotation.y = data.p5 ? data.p5[1] : 0;
        this.rotation.z = data.p5 ? data.p5[2] : 0;

        this.scale.x = data.p6 ? data.p6[0] : 1;
        this.scale.y = data.p6 ? data.p6[1] : 1;
        this.scale.z = data.p6 ? data.p6[2] : 1;

        if (data.p7) {
            this._color.r = data.p7[0];
            this._color.g = data.p7[1];
            this._color.b = data.p7[2];
            this._color.a = data.p7[3];
        }

        RuntimeConst.TempV2.x = this.postion.x;
        RuntimeConst.TempV2.y = this.postion.y;
        this._dis = RuntimeConst.TempV2.magnitude;
        RuntimeConst.TempV2 = RuntimeConst.TempV2.normalize();
        this._angel = mw.Vector2.signAngle(RuntimeConst.BaseDir, RuntimeConst.TempV2) / 57.296;
    }
    public get type(): SkillItemType {
        return SkillItemType.Effect;
    }
    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        const effect = RunTimePool.getPool<mw.Effect>(this.effect).spawn();
        if (!effect || !effect.obj)
            return true;
        let obj = effect.obj;
        let host = entity.host;
        if (this.solt >= 0) {
            const character = RunTimeUtil.getCharacterBase(host);
            if (character) {
                // character.attachGameObjectToCharacter(obj, this.solt);
                character.attachToSlot(obj, this.solt);
            } else {
                obj.parent = host;
            }
            obj.localTransform.position = (this.postion);
            obj.localTransform.rotation = (this.rotation);
            //obj.localTransform.scale = (this.scale);
        }
        else {
            obj.parent = null;
            let pos = host.worldTransform.position;
            let rot = host.worldTransform.rotation
            let dir = entity.host.worldTransform.getForwardVector();
            let param = entity.param;
            if (this.way == 1) {
                if (param.pos)
                    pos = param.pos;
                if (param.rot)
                    rot = param.rot;
                if (param.dir)
                    dir = param.dir;
            }
            let forward = dir.clone();
            mw.Vector.rotateZ(forward, mw.Vector.zero, this._angel, forward);
            let temp = obj.worldTransform.position;
            temp.x = pos.x + forward.x * this._dis;
            temp.y = pos.y + forward.y * this._dis;
            temp.z = pos.z + this.postion.z;

            let tr = obj.worldTransform.rotation;
            tr.x = rot.x + this.rotation.x;
            tr.y = rot.y + this.rotation.y;
            tr.z = rot.z + this.rotation.z;
            obj.worldTransform.position = temp;
            obj.worldTransform.rotation = tr;
        }
        let ws = obj.worldTransform.scale;
        ws.x = this.scale.x;
        ws.y = this.scale.y;
        ws.z = this.scale.z;
        obj.worldTransform.scale = ws;
        obj.setColor("Color", this._color)
        // obj.maskcolor = this._color;
        obj.loop = this.loop > 1;
        obj.loopCount = this.loop;
        obj.play();
        timer.params[0] = effect;

        if (this.life <= 0) {
            this.life = obj.timeLength * this.loop + 0.1;
        }
        effect.despawn(this.life);
        super.onLoaclBehavior(entity, BehaviorType.ItemStart, this.type, obj, this.life);
    }
}