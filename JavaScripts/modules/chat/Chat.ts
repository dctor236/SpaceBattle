import { GeneralManager, } from '../../Modified027Editor/ModifiedStaticAPI';
import { GameConfig } from "../../config/GameConfig";
import { GlobalModule } from "../../const/GlobalModule";
import { PlayerMgr } from "../../ts3/player/PlayerMgr";
import Emoji_Generate from "../../ui-generate/uiTemplate/Chat/Emoji_generate";
import Word_Generate from "../../ui-generate/uiTemplate/Chat/Word_generate";
import { GridLayout } from "../../ui/commonUI/GridLayout";
import { GameModuleC } from "../gameModule/GameModuleC";
import P_GameHUD from "../gameModule/P_GameHUD";
import { MGSMsgHome } from "../mgsMsg/MgsmsgHome";

export class Chat_Client extends ModuleC<Chat_Server, null>{
	private main: P_GameHUD;					// 主画布
	private layout_emoji: GridLayout<Emoji_Generate>;	// 存放聊天表情的滚动框
	private layout_word: GridLayout<Word_Generate>;	// 存放聊天文字的滚动框
	private firstClickFlag: boolean = true;		// 判断玩家是否第一次点击快捷聊天按钮

	onStart(): void {

	}
	onEnterScene(sceneType: number): void {
		this.initMain();
	}
	/**初始化UI */
	initMain() {
		this.main = ModuleService.getModule(GameModuleC).hudPanel;
		this.main.canvas_emoji.visibility = (1);
		this.main.canvas_word.visibility = (1);

		// 如果玩家是第一次点击按钮，就初始化按钮以及滚动框
		this.main.emojiBtn.onClicked.add(() => {
			MGSMsgHome.setBtnClick("emo_btn")

			this.main.canvas_emoji.visibility = (this.main.canvas_emoji.visible ? 1 : 0);
			this.main.canvas_word.visibility = 1;

			if (this.firstClickFlag) {// 标准的初始化流程，勿改函数顺序
				this.initScrollBox();
				this.addLayoutNodes();
				this.addEmojiBtnEvents();
				this.addWordBtnEvents();
				this.layout_emoji.invalidate();
				this.layout_word.invalidate();

				this.firstClickFlag = false;
			}
		});
		this.main.wordBtn.onClicked.add(() => {
			MGSMsgHome.setBtnClick("word_btn")
			this.main.canvas_word.visibility = (this.main.canvas_word.visible ? 1 : 0);
			this.main.canvas_emoji.visibility = 1;

			if (this.firstClickFlag) {
				this.initScrollBox();
				this.addLayoutNodes();
				this.addEmojiBtnEvents();
				this.addWordBtnEvents();
				this.layout_emoji.invalidate();
				this.layout_word.invalidate();

				this.firstClickFlag = false;
			}
		});
	}

	/**初始化滚动条 */
	initScrollBox() {
		let config = GameConfig.GlobalConfig.getElement(1);

		this.layout_emoji = new GridLayout(this.main.scrollBox_emoji, true);
		this.layout_emoji.spacingX = config.ExpressionDistance;// 读表
		this.layout_emoji.spacingY = config.ExpressionDistance;// 读表
		this.layout_word = new GridLayout(this.main.scrollBox_word, true);
		if (this.main.scrollBox_word.orientation == mw.Orientation.OrientVertical)
			this.layout_word.spacingY = config.WordDistance;// 读表，纵向间距
		else
			this.layout_word.spacingX = config.WordDistance;// 读表，横向间距
	}

	/**向滚动条中添加结点 */
	addLayoutNodes() {
		let length = GameConfig.ChatExpression.getAllElement().length;
		for (let i = 0; i < length; i++) {
			this.layout_emoji.addNode(Emoji_Generate);
		}

		let length_word = GameConfig.ChatWord.getAllElement().length;
		for (let i = 0; i < length_word; i++) {
			this.layout_word.addNode(Word_Generate);
		}
	}

	/** 为每个表情按钮添加监听事件 */
	addEmojiBtnEvents() {
		let eNodes = this.layout_emoji.nodes;
		let config = GameConfig.ChatExpression.getAllElement();
		eNodes.forEach(element => {
			let btn = element.mBtn_expression;
			let index = eNodes.indexOf(element);// index如果拿到外面会溢出
			btn.touchMethod = mw.ButtonTouchMethod.PreciseTap
			btn.normalImageGuid = (config[index].ExpressionIcon);
			btn.onClicked.add(() => {
				this.main.canvas_emoji.visibility = (1);
				if (config[index].ExpressionVfx == null) {
					// console.log("fmxs:表格ChatExpression中ExpressionVfx字段值错误！id = " + index);
				}
				else {
					let player = Player.localPlayer;
					this.server.net_playEmoji(player, config[index].ExpressionVfx);
				}
			});
		});
	}

	/**为每个文字按钮添加监听事件 */
	addWordBtnEvents() {
		let config = GameConfig.ChatWord.getAllElement();
		let index = 0;
		this.layout_word.nodes.forEach(node => {
			let string = GameConfig.SquareLanguage.getElement(config[index].WordID).Value;
			node.mBtn_word.text = (string);
			node.mBtn_word.touchMethod = mw.ButtonTouchMethod.PreciseTap
			node.mBtn_word.onClicked.add(() => {
				this.main.canvas_word.visibility = (1);
				PlayerMgr.Inst.sendChat(string)
				MGSMsgHome.playerCommunication();
				// GlobalModule.MyPlayerC.HeadUI.chatBack(string);
			});
			index++;
		});
	}

	public net_PlayEmoji(player: mw.Player, guid: string) {
		let config = GameConfig.GlobalConfig.getElement(1);
		let scale = config.ExpressionScale;
		let offset = config.ExpressionHeight;
		GeneralManager.rpcPlayEffectOnPlayer(guid, player, 23, 1, new mw.Vector(0, 0, 40 + offset), mw.Rotation.zero, scale);
	}
}

export class Chat_Server extends ModuleS<Chat_Client, null>{
	public net_playEmoji(player: mw.Player, guid: string) {
		this.getAllClient().net_PlayEmoji(player, guid);
	}
	public playEmoji(player: mw.Player, guid: string) {
		this.getAllClient().net_PlayEmoji(player, guid);
	}
}