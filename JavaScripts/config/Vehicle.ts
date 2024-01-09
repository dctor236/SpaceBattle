import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["id","des","name","isOpen","Speed","Music","Whistle","Type","SubType","SeatNum","IdleAction","moveAction","otherAction","PostOffset","Guid","HorseGuid","Scale","Rotate","Deviation","UiGuid","IconGuid","iconScale","MoveSound","showSpeed","arm","armdeviation","doorIds"],["","","Language","","","","","","","","","","","","","","","","","","","","","","","",""],[1001,"滑板","Vehicle_Name_01",1,250,118701,136263,1,0,1,200,0,0,new mw.Vector(0,0,0),"363FEA624259C1B9142621B378EF2D00",null,new mw.Vector(1,1,1),new mw.Vector(0,0,90),new mw.Vector(0,0,0),"167883",null,1,0,25,450,new mw.Vector(0,0,0),null],[1002,"滑板","Vehicle_Name_02",1,250,118701,136263,1,0,1,200,0,0,new mw.Vector(0,0,0),"E8023A80499578B92FF7FF9DC6B0C5DF",null,new mw.Vector(1,1,1),new mw.Vector(0,0,90),new mw.Vector(0,0,0),"167952",null,1,0,25,450,new mw.Vector(0,0,0),null],[1003,"飞剑","Vehicle_Name_03",1,250,181957,136263,1,1,1,200,0,0,new mw.Vector(0,0,0),"00411FD34E7DD26434D027A44108365B",null,new mw.Vector(1,1,1),new mw.Vector(0,0,90),new mw.Vector(0,0,0),null,"178618",1,0,25,450,new mw.Vector(0,0,0),null],[1004,"自行车","Vehicle_Name_04",1,300,118701,136263,1,0,1,201,202,0,new mw.Vector(0,0,0),"3535C0024A4AB595E185E696C68D7A92",null,null,new mw.Vector(0,0,180),null,null,"31526",1,0,30,450,new mw.Vector(0,0,0),null],[1005,"外卖摩托车","Vehicle_Name_05",1,350,169117,136263,1,0,1,206,206,0,new mw.Vector(0,0,0),"A27EFB2141E969E5CE452BBC09B043F5",null,null,new mw.Vector(0,0,180),null,"137808",null,1,0,30,450,new mw.Vector(0,0,0),null],[1006,"摩托车","Vehicle_Name_06",1,350,169117,136263,1,0,1,206,206,0,new mw.Vector(0,0,0),"5D4C8558496241179AA015B226EBE5B9",null,null,new mw.Vector(0,0,180),null,"167889",null,1,0,30,450,new mw.Vector(0,0,0),null],[3001,"小轿车","Vehicle_Name_08",1,0,118701,136263,3,0,2,204,0,205,null,"020E9D5D4CF31C90E8AB2A975261A063",null,null,null,null,"137782",null,1,0,64,550,new mw.Vector(0,0,0),[1,2]],[3002,"出租车","Vehicle_Name_09",1,0,118701,136263,3,0,4,204,0,205,null,"DB2E26CD4B8BA04902A9F392F16DA4A9",null,null,null,null,"154834",null,1,0,64,550,new mw.Vector(0,0,0),null],[3003,"敞篷车","Vehicle_Name_10",1,0,118701,136263,3,0,2,204,0,205,null,"614A405B4A20C2A59A6040B6913B65CF",null,null,null,null,"154835",null,1,0,64,550,new mw.Vector(0,0,0),null],[3004,"肌肉车","Vehicle_Name_11",1,0,118701,136263,3,0,2,204,0,205,null,"6A501B3E42FF57ADAC12AA8545D7DC1B",null,null,null,null,"137807",null,1,0,64,550,new mw.Vector(0,0,0),null],[3005,"蓝色小轿车","Vehicle_Name_12",1,0,118701,136263,3,0,4,204,0,205,null,"811C92484D9182E6655C44B7D287710F",null,null,null,null,"154841",null,1,0,64,550,new mw.Vector(0,0,0),null],[3006,"蓝色面包车","Vehicle_Name_13",1,0,118701,136263,3,0,2,204,0,205,null,"384431C441949DD1CF65E88327596299",null,null,null,null,"154840",null,1,0,72,550,new mw.Vector(0,0,0),[1,2]],[3007,"警车","Vehicle_Name_14",1,0,118701,136263,3,0,4,204,0,205,null,"F7F0DD924D2556A7B3658382A1085DA2",null,null,null,null,"154842",null,1,0,72,550,new mw.Vector(0,0,0),null],[3008,"乌龟车","Vehicle_Name_15",1,0,118701,136263,3,0,2,204,0,205,null,"BC0D6C07489906C441E653849087E710",null,null,null,null,"131462",null,1,0,72,550,new mw.Vector(0,0,0),null],[3009,"云车","Vehicle_Name_16",1,0,118701,136263,3,0,2,207,0,208,null,"55A0C0C2419DC859241087AF889FFF09",null,null,null,null,null,"20854",1,0,72,550,new mw.Vector(0,0,0),null],[3010,"白色皮卡车","Vehicle_Name_17",1,0,118701,136263,3,0,2,204,0,205,null,"B79B68CC4FEC9941E766B6A30A35AF7E",null,null,null,null,"137780",null,1,0,72,550,new mw.Vector(0,0,0),[1,2]],[3011,"坦克","Vehicle_Name_18",1,0,118701,136263,3,0,1,204,0,205,null,"AA637C4C48168E948972E0A8D9BE27A4",null,null,null,null,"137782",null,1,0,64,550,new mw.Vector(0,0,0),null],[3012,"吉普车","Vehicle_Name_19",1,0,118701,136263,3,0,2,204,0,205,null,"499AE74941CEEFFC676689AD24551577",null,null,null,null,"137782",null,1,0,64,550,new mw.Vector(0,0,0),null],[3013,"装甲车","Vehicle_Name_20",1,0,118701,136263,3,0,4,204,0,205,null,"873BD8754E3B32F41D205BA805528F97",null,null,null,null,"137782",null,1,0,64,550,new mw.Vector(0,0,0),[1,2,3,4]]];
export interface IVehicleElement extends IElementBase{
 	/**唯一id*/
	id:number
	/**备注*/
	des:string
	/**名字*/
	name:string
	/**是否开放*/
	isOpen:number
	/**速度*/
	Speed:number
	/**音乐*/
	Music:number
	/**鸣笛*/
	Whistle:number
	/**载具类型（1单人载具2坐骑 3多人载具）*/
	Type:number
	/**子类型(1单人飞行)*/
	SubType:number
	/**座位数*/
	SeatNum:number
	/**停止状态*/
	IdleAction:number
	/**行走状态*/
	moveAction:number
	/**其他座位状态*/
	otherAction:number
	/**下次偏移*/
	PostOffset:mw.Vector
	/**预制体guid，或，资源库的载具guid*/
	Guid:string
	/**坐骑专用*/
	HorseGuid:string
	/**缩放*/
	Scale:mw.Vector
	/**旋转*/
	Rotate:mw.Vector
	/**位置偏移*/
	Deviation:mw.Vector
	/**读取ui资源id*/
	UiGuid:string
	/**资源guid，用于获取缩略图*/
	IconGuid:string
	/**icon渲染缩放*/
	iconScale:number
	/**载具音效*/
	MoveSound:number
	/**显示载具速度*/
	showSpeed:number
	/**弹簧臂*/
	arm:number
	/**壁偏移*/
	armdeviation:mw.Vector
	/**门动画ids*/
	doorIds:Array<number>
 } 
export class VehicleConfig extends ConfigBase<IVehicleElement>{
	constructor(){
		super(EXCELDATA);
	}

}