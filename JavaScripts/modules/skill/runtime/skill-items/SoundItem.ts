import { ISkillEntity, ISkillItemParam, ISkillLine, ISkillTimer } from "../../define/SkillDefine";
import { SkillBaseItem } from "./BaseItem";
import { BehaviorType, SkillItemType } from "../../define/SkillDefine";
import { RuntimeConst } from "../Const";
import { RunTimePool } from "../RunTimePool";
/** 
 * @Author       : xianjie.xia
 * @LastEditors  : xianjie.xia
 * @Date         : 2022-12-06 11:24
 * @LastEditTime : 2022-12-30 14:13
 * @description  : 
 */
export class SoundItem extends SkillBaseItem {
    public soundId = '';

    private _radius = [];
    private _volume = 1;
    private _isLoacl = true;

    private _pos = new mw.Vector(0, 0, 0);
    private _angel = 0;
    private _dis = 0;
    protected onExcute(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer) {
        if (!this._isLoacl && RuntimeConst.PLAYER_GUID != entity.host.gameObjectId) {
            return;
        }
        let sound = timer.params[0] = RunTimePool.getPool<mw.Sound>(this.soundId).spawn();
        if (timer.params[0]) {
            let obj = timer.params[0].obj as mw.Sound;
            if (!obj)
                return;
            if (this.life > 0)
                obj.isLoop = true;
            else {
                obj.isLoop = false;
                //播放1次结束回收
                //this.life = obj.duration * 0.001;
            }
            //有衰减参数则为空间音效
            if (this._radius.length > 1) {
                obj.isSpatialization = true;
                obj.attenuationShapeExtents = new Vector(this._radius[0], this._radius[1], 0) //= this._radius[0];
                obj.falloffDistance = this._radius[1];

                let pos = entity.host.worldTransform.position;
                let dir = entity.host.worldTransform.getForwardVector();
                let param = entity.param;
                if (this.way == 1) {
                    if (param.pos)
                        pos = param.pos;
                    if (param.dir)
                        dir = param.dir;
                }
                let forward = dir.clone();
                mw.Vector.rotateZ(forward, mw.Vector.zero, this._angel, forward);
                let temp = obj.worldTransform.position;
                temp.x = pos.x + forward.x * this._dis;
                temp.y = pos.y + forward.y * this._dis;
                temp.z = pos.z + this._pos.z;
                obj.worldTransform.position = temp;
            }

            obj.volume = this._volume;
            obj.play();
            obj.onFinish.clear();
            obj.onFinish.add(() => {
                sound.despawn();
            })
            this.onLoaclBehavior(entity, BehaviorType.ItemStart, this.type, obj);
        }
    }

    protected onParse(data: ISkillItemParam) {
        this.soundId = data.p1 ? data.p1 : '';
        this._volume = data.p2 ? data.p2 : 1;
        this._isLoacl = data.p3 ? true : false;
        if (data.p4) {
            this._radius = data.p4;
        }
        if (data.p5 && data.p5.length > 2) {
            this._pos.x = data.p5[0];
            this._pos.y = data.p5[1];
            this._pos.z = data.p5[2];
            RuntimeConst.TempV2.x = this._pos.x;
            RuntimeConst.TempV2.y = this._pos.y;
            this._dis = RuntimeConst.TempV2.magnitude;
            RuntimeConst.TempV2 = RuntimeConst.TempV2.normalize();
            this._angel = mw.Vector2.angle(RuntimeConst.BaseDir, RuntimeConst.TempV2) / 57.296;
        }
        mw.AssetUtil.asyncDownloadAsset(this.soundId);
    }

    protected onLife(entity: ISkillEntity, line: ISkillLine, timer: ISkillTimer): void {
        let sound = timer.params[0];
        if (sound) {
            sound.obj && sound.obj.stop();
            sound.despawn();
        }
    }
    public get type(): SkillItemType {
        return SkillItemType.Sound;
    }

}