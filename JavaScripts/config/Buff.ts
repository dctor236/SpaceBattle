import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","name","description","icon","buffEffectType","removeBuff","overlayType","lifecycleType","duration","actionGuid","actionID","effect","loop","effectDelayTime","affectProperty","param1_Model","param1","param2_Model","param2","param3_Model","param3","ps"],["","","","","","","","","","","","","","","","","","","","","",""],[1,"愤怒","攻击力上升",11111,1,null,2,1,10,null,0,0,0,0,1,1,0.25,0,0,0,0,"一个攻击提升的例子"],[2,"愤怒2","每隔一断时间触发一次, 并在主buff生成时立即施放子buff id=1",11111,0,null,3,2,0,null,0,0,0,0.5,1,1,0.25,0,0,0,0,"一个攻击提升的例子"],[3,"愤怒2","每隔一断时间触发一次,并在每次触发时施放子buff id=1",11111,0,null,3,2,0,null,0,0,0,0.5,1,1,0.25,0,0,0,0,"一个攻击提升的例子"],[4,"玩家Buff","攻击力上升，测试放在玩家身上",11111,0,null,3,1,10,null,0,0,1,0,1,1,0.25,0,0,0,0,"一个攻击提升的例子"],[5,"物体Buff","攻击力上升，测试放在物体身上",11111,1,null,1,2,0,null,0,0,1,0,1,1,0.25,0,0,0,0,"一个攻击提升的例子"],[6,"世界触发","每隔一断时间触发一次",11111,0,null,1,2,0,null,0,0,1,0,0,1,0.3,0,0,0,0,"在世界位置放一个特效"],[7,"僵直","人物无法移动跳跃2s",11111,3,null,3,1,1,"97859",0,0,0,0,0,0,0,0,0,0,0,null],[8,"眩晕","人物无法移动跳跃2s,头上一个特效",11111,3,[7],3,1,3,"47757",0,201,0,0,0,0,0,0,0,0,0,null],[9,"无敌金身","人物无敌状态,无法造成伤害 ?.播放特效",11111,1,null,0,0,99999,null,0,0,0,0,8,0,9999999999,0,0,0,0,null],[10,"免控","免控",11111,2,[7,8],3,1,10,"121603",319,211,1,0,8,0,0,0,0,0,0,null],[11,"免控无特效动作","免控无特效动作",11111,2,[7,8],0,0,99999,null,0,0,1,0,0,0,0,0,0,0,0,null],[12,"击飞","击飞",11111,4,null,3,1,0.5,"135157",0,0,0,0,0,0,0,0,0,0,0,null],[13,"受伤","受伤",11111,0,null,3,1,0.5,"47775",304,0,1,0,0,0,0,0,0,0,0,null],[14,null,null,0,0,null,0,0,0,null,0,0,0,0,0,0,0,0,0,0,0,null]];
export interface IBuffElement extends IElementBase{
 	/**id*/
	id:number
	/**名称*/
	name:string
	/**buff描述*/
	description:string
	/**图标*/
	icon:number
	/**Buff的效果类型*/
	buffEffectType:number
	/**该buff会消除的buff*/
	removeBuff:Array<number>
	/**消除全部*/
	overlayType:number
	/**buff的叠加方式*/
	lifecycleType:number
	/**buff的生命周期类型*/
	duration:number
	/**持续时间(单位s)*/
	actionGuid:string
	/**动作的guid*/
	actionID:number
	/**动作的ID*/
	effect:number
	/**buff生成时产生的特效Guid*/
	loop:number
	/**是否循环。0循环，1-不循环*/
	effectDelayTime:number
	/**buff生成时特效延迟多久出现(单位s)*/
	affectProperty:number
	/**影响的属性类型*/
	param1_Model:number
	/**参数Param1是值类型还是百分比类型*/
	param1:number
	/**参数1*/
	param2_Model:number
	/**参数Param2是值类型还是百分比类型*/
	param2:number
	/**参数2*/
	param3_Model:number
	/**参数Param3是值类型还是百分比类型*/
	param3:number
	/**参数3*/
	ps:string
 } 
export class BuffConfig extends ConfigBase<IBuffElement>{
	constructor(){
		super(EXCELDATA);
	}

}