
/*
 * @Author: 王嵘 rong.wang@appshahe.com
 * @Date: 2022-12-12 14:11:40
 * @LastEditTime: 2023-06-24 10:21:34
 * @Description: Avatar Creator Development
 */

import { GameConfig } from '../../config/GameConfig';
import { ITaskElement } from "../../config/Task";
import { EmTaskState, EmTaskType } from '../../const/GameEnum';
import { GlobalData } from '../../const/GlobalData';
import GameUtils from '../../utils/GameUtils';
import { TaskModuleC } from "./TaskModuleC";
import { TaskData } from './TaskModuleDataHelper';
export class TaskModuleS extends ModuleS<TaskModuleC, null>{
	private _branchTasks: TaskData[] = [];//rpc
	private _playerAssign: Map<number, TaskData[]> = new Map()
	private _taskElems: ITaskElement[] = [];
	/**初始生成的任务数 */
	/**初始给玩家分配的任务数 */
	public InitAssignNum: number = 1
	/**随机任务id*/
	private _ranNumList: number[] = []

	protected onStart(): void {
		// Actions.onTimeChangedS.add(time => {
		// 	if (time.hour == 8) {
		// 		this.refreshBranchTask();
		// 		this.assignAllTasks()
		// 	}
		// });
	}

	private initTask() {
		this._taskElems = GameConfig.Task.getAllElement()
		this._ranNumList.length = 0;
		this._branchTasks.length = 0;
	}

	protected onPlayerEnterGame(player: mw.Player): void {
		if (this._taskElems.length == 0) {
			this.initTask()
		}
		if (!this._playerAssign.has(player.playerId)) {
			this._playerAssign.set(player.playerId, [])
		}
	}

	protected onPlayerLeft(player: mw.Player): void {
		let assigns = this._playerAssign.get(player.playerId)
		assigns.forEach(e => {
			e.taskState = EmTaskState.NoFetch
		})
		this._playerAssign.delete(player.playerId)
	}

	public net_refreshOnAPlayer(replace: number, pid: number) {
		let tmpReplace = replace
		let p: mw.Player = null
		if (pid != -1) {
			p = Player.getPlayer(pid)
		}

		if (replace == 0) {
			let assigns = this._playerAssign.get(pid == -1 ? this.currentPlayerId : pid)
			if (assigns && assigns.length > 0) {
				tmpReplace = assigns[0].taskConfig
			}
		}

		let replaceIndex = this._branchTasks.findIndex(task => task.taskConfig === tmpReplace && task.taskState === EmTaskState.NoAccept)
		if (replaceIndex >= 0) {
			this._branchTasks[replaceIndex].taskState = EmTaskState.NoFetch
		}
		let playerTasks: TaskData[] = []//[].concat(beforeList)
		let canFetchTasks = this.refreshBranchTask().filter(task => {
			if (task.taskConfig != tmpReplace) {
				if (!GlobalData.isBoss) {
					if (task.taskType == EmTaskType.Dragon) {
						return false
					} else {
						return true
					}
				} else {
					return true
				}
			} else {
				return false
			}
		})
		for (let i = 0; i < this.InitAssignNum; i++) {
			let tmpTask: TaskData = null
			tmpTask = canFetchTasks[MathUtil.randomInt(0, canFetchTasks.length)]
			tmpTask.taskState = EmTaskState.NoAccept
			playerTasks.push(tmpTask)
		}
		this._playerAssign.set(pid == -1 ? this.currentPlayerId : pid, playerTasks)
		if (pid != -1) {
			this.getClient(p).net_OnAssign(JSON.stringify(playerTasks))
		} else {
			this.getClient(this.currentPlayerId).net_OnAssign(JSON.stringify(playerTasks))
		}
	}

	public net_AssignAPlayer(taskID: number) {
		let index = this._taskElems.findIndex(e => e.id == taskID)
		if (index == -1) {
			return
		}
		let vec: TaskData[] = []
		let task = this.createNewTask(index)
		vec.push(task)
		task.taskState = EmTaskState.NoAccept
		this._playerAssign.set(this.currentPlayerId, vec)
		this.getClient(this.currentPlayer).net_OnAssign(JSON.stringify([task]), true)
	}


	//龙来了
	private dragonTaskAssign() {
		let vec: TaskData[] = []
		for (let i = 0; i < Player.getAllPlayers().length; i++) {
			const play = Player.getAllPlayers()[i]
			if (play) {
				let task = this.createNewTask(this._taskElems.length - 1)
				vec.push(task)
				task.taskState = EmTaskState.NoAccept
				this._playerAssign.set(play.playerId, vec)
				this.getClient(play).net_OnAssign(JSON.stringify([task]))
			}
		}
	}

	//判断是否接取了屠龙任务
	public hasDragonTask(pid: number) {
		if (!this._playerAssign.has(pid)) {
			return false
		} else {
			const tasks = this._playerAssign.get(pid)
			return tasks.findIndex(e => e.taskType == EmTaskType.Dragon) != -1
		}
	}


	private createNewTask(index: number) {
		const element = this._taskElems[index]
		let tmpTask: TaskData = this._branchTasks.find(e => e.taskConfig === element.id && e.taskState === EmTaskState.NoFetch)
		if (!tmpTask) {
			const id = element.id;
			const accNpcID = element.TaskNPCID[MathUtil.randomInt(0, element.TaskNPCID.length)];
			let finishNpcID = 0
			if (element.FinishNPCID) {
				finishNpcID = element.FinishNPCID[MathUtil.randomInt(0, element.FinishNPCID.length)];
			}
			tmpTask = new TaskData();
			tmpTask.id = MathUtil.randomInt(1, 500001)
			while (this._ranNumList.indexOf(tmpTask.id) != -1) {
				tmpTask.id = MathUtil.randomInt(1, 500001)
			}
			this._ranNumList.push(tmpTask.id)
			tmpTask.taskConfig = id;
			tmpTask.curSolveTime = 0;
			tmpTask.totalSolveTime = element.taskSolvetime;
			tmpTask.taskType = element.taskType;
			tmpTask.taskState = EmTaskState.NoFetch;
			tmpTask.acceptNpc = accNpcID;
			tmpTask.finishNpc = finishNpcID
			this._branchTasks.push(tmpTask);
		}
		return tmpTask
	}

	/**
	 * 刷新任务
	 */
	private refreshBranchTask() {
		const taskNum = this._taskElems.length * this.InitAssignNum;
		let tasksPool: ITaskElement[] = []
		for (let i = 0; i < this.InitAssignNum; i++) {
			const taskElems = GameUtils.getRandomObjects(this._taskElems, this._taskElems.length) as ITaskElement[];
			tasksPool = tasksPool.concat(taskElems)
		}
		let tasks: TaskData[] = []
		for (let i = 0; i < taskNum; i++) {
			const element = this._taskElems.indexOf(tasksPool[i]);
			if (element != -1) {
				let task = this.createNewTask(element)
				tasks.push(task)
			}
		}
		return tasks
	}

	/**
	 * 刷新在线玩家任务
	 */
	private assignAllTasks() {
		let assignTasks = GameUtils.getRandomObjects(this._branchTasks, this._branchTasks.length) as TaskData[];
		let index: number = 0
		for (let i = 0; i < Player.getAllPlayers().length; i++) {
			const play = Player.getAllPlayers()[i]
			if (play) {
				let playerTasks: TaskData[] = []
				for (let j = 0; j < this.InitAssignNum; j++) {
					let task = assignTasks[index++]
					task.taskState = EmTaskState.NoAccept
					playerTasks.push(task)
				}
				this.getClient(play).net_OnAssign(JSON.stringify(playerTasks))
			}
		}
	}

	net_setBranchTaskState(taskID: number, state: EmTaskState) {
		let taskIdnex = this._branchTasks.findIndex(task => task.id == taskID)
		let task = this._branchTasks[taskIdnex]
		if (!task) {
			return
		} else {
			if ((state === EmTaskState.Doing && task.taskState === EmTaskState.NoAccept)
				|| (state === EmTaskState.Finish && task.taskState === EmTaskState.Doing)) {
				task.taskState = state
				if (state === EmTaskState.Finish) {
					//刷新一个任务
					this.net_refreshOnAPlayer(task.taskConfig, this.currentPlayerId)
					console.log("刷新一个任务", task.taskState)
				}
			}
		}

	}
	setBranchTaskStateFinish(taskConfig: number, pid: number) {
		let task = this._branchTasks.find(task => task.taskConfig == taskConfig && task.taskState == EmTaskState.Doing)
		if (task) {
			this.getClient(pid).net_finishBranchTask()
		}
	}
}
