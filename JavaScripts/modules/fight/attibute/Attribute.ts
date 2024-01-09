/*
 * @Author: 代纯 chun.dai@appshahe.com
 * @Date: 2023-06-12 20:09:21
 * @LastEditors: 代纯 chun.dai@appshahe.com
 * @LastEditTime: 2023-06-12 23:01:42
 * @FilePath: \vine-valley\JavaScripts\modules\fight\attibute\Attribute.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%A
 */
export namespace Attribute {
    export enum EAttType {
        // 血量
        hp = 1,
        // 最大生命值
        maxHp = 2,
        // 攻击力
        atk = 3,
        //攻击频率 
        atkFreq = 4,
        // 暴击率[0-100]
        crit = 5,
        // 暴击伤害(百分比)
        critDamage = 6,
        // 移动速度, 怪物:(一个逻辑帧移动长度为x个单位的向量), 角色:(编辑器默认速度+speed)(增量)
        speed = 7,
        // 防御力(玩家/怪物)
        defense = 8,
        // 攻击力加成倍数(百分比)
        atkMultiple = 9,
        // 等级
        lv = 10,
        // 经验值
        exp = 11,
        // 钱
        money = 12,
    }

    // 存储属性
    const PlayerStashAttribute: Set<EAttType> = new Set([
        Attribute.EAttType.exp,
        Attribute.EAttType.lv,
        Attribute.EAttType.money,
    ])

    // 此属性是否需要存储
    export function IsStashAttribute(type: Attribute.EAttType): boolean {
        return PlayerStashAttribute.has(type)
    }

    // type:属性类型-value:属性值
    export type AttributeArray = { [type: number]: number }

    // 属性集合
    export class AttributeValueObject {
        attributeArray: Attribute.AttributeArray
        public readonly onHpChangeCb: Action1<number> = new Action1();//RMB变化
        constructor() {
            this.attributeArray = {}
        }

        setAttribute(type: Attribute.EAttType, value: number) {
            this.attributeArray[type] = value
            if (type == Attribute.EAttType.hp) {
                this.onHpChangeCb.call(value)
            }
        }

        getValue(type: Attribute.EAttType): number {
            return this.attributeArray[type] ? this.attributeArray[type] : 0
        }

        addValue(type: Attribute.EAttType, value: number) {
            if (value == 0) return
            let val = this.getValue(type)
            this.setAttribute(type, value + val)
        }

        reduceValue(type: Attribute.EAttType, value: number) {
            let val = this.getValue(type)
            this.setAttribute(type, Math.max(0, val - value))
        }

        // 合并other属性
        bringIn(other: AttributeValueObject) {
            for (let type in other.attributeArray) {
                let val = other.attributeArray[type];
                this.addValue(Number(type), val);
            }
        }

        // 清空(值)复用
        clear(): AttributeValueObject {
            for (const key in this.attributeArray) {
                this.attributeArray[key] = 0
            }
            return this
        }
    }
}
