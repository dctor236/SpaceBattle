import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","taskName","taskInfo","taskType","taskRewardItemType","taskRewardItemID","rewardImgGuid","taskRewardNum","TaskNPCID","FinishNPCID","clickTalkState","accNpcTalk","accTalkState","finishTalkState","taskSolvetime","acceptTip","finishTip"],["","","","","","","","","","","","","","","","",""]];
export interface ITaskElement extends IElementBase{
 	/**id*/
	id:number
	/**任务名称*/
	taskName:Array<string>
	/**任务信息*/
	taskInfo:Array<string>
	/**任务类型*/
	taskType:number
	/**任务奖励道具类型*/
	taskRewardItemType:number
	/**任务奖励道具ID(item表)*/
	taskRewardItemID:number
	/**任务奖励图片guid*/
	rewardImgGuid:string
	/**任务奖励道具数量*/
	taskRewardNum:number
	/**接取任务NPCID*/
	TaskNPCID:Array<number>
	/**完成任务NPCID*/
	FinishNPCID:Array<number>
	/**点击NpcEvent*/
	clickTalkState:Array<Array<number>>
	/**改变NpcTalk*/
	accNpcTalk:number
	/**改变NpcEvent*/
	accTalkState:number
	/**改变NpcEvent*/
	finishTalkState:number
	/**任务需要的量*/
	taskSolvetime:number
	/**任务接取诺米文本*/
	acceptTip:string
	/**到达后诺米文本*/
	finishTip:string
 } 
export class TaskConfig extends ConfigBase<ITaskElement>{
	constructor(){
		super(EXCELDATA);
	}

}