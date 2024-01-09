/*
 * @Description: 
 * @Version: 2.0
 * @Autor: guan.wang
 * @Date: 2022-01-09 14:29:36
 * @LastEditors: guan.wang
 * @LastEditTime: 2022-03-02 17:48:17
 */

import { Axis } from "../const/GameEnum";
import { MyAction } from "../ExtensionType";

export class RotateScript {
    private target: mw.GameObject;
    private axis: Axis;
    private speed: number;
    private rot: mw.Rotation;

    private startR: mw.Rotation;
    /**
     * 初始化
     * @param target 旋转的物体
     * @param axis 旋转的轴向
     * @param speed 旋转速度
     */
    public constructor(target: mw.GameObject, axis: Axis, speed: number) {
        this.target = target;
        this.axis = axis;
        this.speed = speed;
        this.startR = new mw.Rotation(this.target.worldTransform.rotation);
        this.rot = this.target.worldTransform.rotation;
    }
    public onReset() {
        this.target.worldTransform.rotation = new mw.Rotation(this.startR);
    }
    public onUpdate(dt: number) {
        //let rotation = this.target.rotation;
        switch (this.axis) {
            case Axis.X:
                this.rot = this.rot.add(new mw.Rotation(new mw.Vector(this.speed * dt, 0, 0)));
                //rotation.x += this.speed * dt;
                break;
            case Axis.Y:
                this.rot = this.rot.add(new mw.Rotation(new mw.Vector(0, this.speed * dt, 0)));
                //rotation.y += this.speed * dt;
                break;
            case Axis.Z:
                this.rot = this.rot.add(new mw.Rotation(new mw.Vector(0, 0, this.speed * dt)));
                //rotation.z += this.speed * dt;
                break;
        }
        this.target.worldTransform.rotation = this.rot;
    }
}

export class RotateScript2 {
    private target: mw.GameObject;
    private startR: mw.Rotation;
    private endR: mw.Rotation;
    private rotateTime: number;
    private timer: number;

    public endAC: MyAction = new MyAction();

    /**
 * 初始化
 * @param target 旋转的物体
 * @param axis 旋转的轴向
 * @param speed 旋转速度
 */
    public constructor(target: mw.GameObject, axis: Axis, speed: number, startR: mw.Rotation, endR: mw.Rotation) {
        this.target = target;
        this.startR = new mw.Rotation(startR);
        this.endR = new mw.Rotation(endR);
        let rotateAngle = 0;
        switch (axis) {
            case Axis.X:
                rotateAngle = endR.x - startR.x;
                break;
            case Axis.Y:
                rotateAngle = endR.y - startR.y;
                break;
            case Axis.Z:
                rotateAngle = endR.z - startR.z;
                break;
        }
        rotateAngle = Math.abs(rotateAngle);
        this.rotateTime = rotateAngle / speed;
        this.timer = 0;
    }
    public onReset() {
        this.timer = 0;
        this.target.localTransform.rotation = (this.startR);
    }
    public onUpdate(dt: number) {
        this.timer += dt;
        let ratio = this.timer / this.rotateTime;
        if (ratio > 1.00) {
            this.target.localTransform.rotation = (new mw.Rotation(this.endR));

            let pos = new mw.Rotation(this.endR);
            this.endR = new mw.Rotation(this.startR);
            this.startR = pos;
            this.timer = 0;
            this.endAC?.call();
            return;
        }

        this.target.localTransform.rotation = (mw.Rotation.lerp(this.startR, this.endR, ratio));
    }
}
