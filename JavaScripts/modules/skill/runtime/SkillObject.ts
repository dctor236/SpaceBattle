import { BehaviorType, ISkillEntity, ISkillObject, SkillGroup } from "../define/SkillDefine";


export class SkillObject implements ISkillObject {
    public groups: SkillGroup[] = [];
    public behavior: (entity: ISkillEntity, type: BehaviorType, ...params: any[]) => any;
    constructor() {
    }
}