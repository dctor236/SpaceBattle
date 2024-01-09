import SkillMgr from "../SkillMgr";
import SkillBase from "./SkillBase";

/**
 * 根据GUID返回全局唯一POOL
 */
export namespace SkillPool {
    const pools: Map<number, Pool> = new Map();
    export function getPool(skill: number): Pool {
        let pool = pools.get(skill);
        if (!pool) {
            pool = new Pool(skill);
            pools.set(skill, pool);
        }
        return pool as Pool;
    }
    export function clear() {
        for (let k of pools) {
            k[1].clear();
        }
        pools.clear();
    }
}
export interface IPool<T> {
    spawn(): T;
    despawn(skill: T);
    clear();
}

class Pool implements IPool<SkillBase> {
    /**
     * 技能ID
     */
    private skill: number;

    private cache: SkillBase[];

    constructor(skill: number) {
        this.skill = skill;
        this.cache = [];
    }
    /**
     * 从对象池获取一个物体
     * @returns 
     */
    public spawn(): SkillBase {
        let skill: SkillBase
        if (this.cache.length > 0) {
            skill = this.cache.shift()
        }
        // skill = new (SkillMgr.Inst.skillClassMap.get(this.skill))(this.skill);
        SkillMgr.Inst.skillArr.push(skill)
        return skill
    }
    /**
     * 归还一个物体到对象池
     * @returns 
     */
    public despawn(skill: SkillBase) {
        const skillArr = SkillMgr.Inst.skillArr
        if (skillArr.includes(skill)) {
            skillArr.splice(skillArr.indexOf(skill), 1)
        }
        this.cache.push(skill);
    }
    public clear() {
        for (let i = 0; i < this.cache.length; i++) {
            let skill = this.cache[i];
            // if (skill)
            // skill.clear();
        }
        this.cache = [];
    }
}