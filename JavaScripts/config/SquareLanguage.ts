import { ConfigBase, IElementBase } from "./ConfigBase";
const EXCELDATA:Array<Array<any>> = [["ID","Name","Value","Value_Ch","Value_J","Value_D"],["","Key|ReadByName","MainLanguage","ChildLanguage","ChildLanguage","ChildLanguage"],[100001,"Danmu_Content_1001","Solo","单人","シングルプレイヤー","Ledig"],[100002,"Danmu_Content_1002","Pair","双人","ダブル","Doppelt"],[100003,"Danmu_Content_1003","Items","道具","小道具","Stütze"],[100019,"Danmu_Content_1019","embrace","拥抱","抱擁","Umarmung"],[100020,"Danmu_Content_1020","Princess hugs","公主抱","王女の抱擁","Prinzessin umarmt"],[100021,"Danmu_Content_1021","Back people","背人","バックマン","Zurück"],[100022,"Danmu_Content_1022","Lift","举起","持ち上げる","heben"],[100023,"Danmu_Content_1023","Shoulder to shoulder","肩扛","肩甲骨","Schulter an Schulter"],[100024,"Danmu_Content_1024","Anyone","托人","受託者","Irgendjemand"],[100049,"Danmu_Content_1049","Cancel","我再想想","もう一度考えてみよう","Ich werde noch einmal darüber nachdenken"],[100050,"Danmu_Content_1050","Already using","你已经在这里了","あなたはすでにここにいます","Sie sind schon hier"],[100051,"Danmu_Content_1051","This item is in use","对不起，这里已经有人了","申し訳ありませんが、すでにここに誰かがいる","Sorry, es sind schon Leute hier"],[100052,"Danmu_Content_1052","It's too far...","距离有点远......","少し遠く...","Es ist ein bisschen weit weg..."],[100053,"Danmu_Content_1053","Please leave current player first","请先离开当前玩家","まず、現在のプレイヤーを離れてください","Bitte verlassen Sie zuerst den aktuellen Spieler"],[100054,"Danmu_Content_1054","Leave","脱离","離脱","auskuppeln"],[100055,"Danmu_Content_1055","Playlist","音乐列表","音楽のリスト","Musikliste"],[100056,"Danmu_Content_1056","Lighting","灯光列表","ライトのリスト","Liste der Leuchten"],[100057,"Danmu_Content_1057","Leave","解除","持ち上げる","erleichtern"],[100058,"Danmu_Content_1058","BGM","音乐","音楽","Musikliste"],[100059,"Danmu_Content_1059","Lighting","灯光","ライト","Lampenlicht"],[100060,"Danmu_Content_1060","Unavailable now","当前正在双人动作，无法发起！","現在2人プレイ中で、開始できません!","Derzeit in Zwei-Personen-Aktion, kann nicht initiiert werden!"],[100061,"Danmu_Content_1061","Under Construction (Sorry!)","前方区域正在施工建设中！敬请期待！","前方エリアは建設中です! ご期待ください!","Das Gebiet vor uns ist im Bau! Bleiben Sie dran!"],[100062,"Danmu_Content_1062","Lighting On/Off","灯光开关","ライトスイッチ","Lichtschalter"],[100063,"Danmu_Content_1063","BGM On/Off","音响开关","サウンドスイッチ","Soundschalter"],[100064,"Danmu_Content_1064","Please remove current item!","请卸下当前道具！","現在の小道具を降ろしてください!","Bitte entfernen Sie den aktuellen Artikel!"],[100065,"Danmu_Content_1065","Please leave current location!","请脱离当前交互物！","現在のインタラクションから外してください!","Bitte lösen Sie sich von der aktuellen Interaktion!"],[100066,"Danmu_Content_1066","Twist to the beat!","跟着节奏扭起来！","リズムに合わせてひねりを合わせる!","Twist im Takt!"],[100067,"Danmu_Content_1067","Switch Dances","切换舞蹈","ダンスを切り替えます","Switch-Tänze"],[100068,"Danmu_Content_1068","Please stop current action!","请脱离当前动作！","現在の動きから脱却してください!","Bitte raus aus der aktuellen Aktion!"],[100069,"Danmu_Content_1069","The two sides are too far apart to interact!","双方距离过远，无法交互！","双方は、相互作用するには遠すぎる!","Die beiden Seiten sind zu weit voneinander entfernt, um miteinander zu interagieren!"],[100070,"Danmu_Content_1070","The player is currently in a two-player action!","当前玩家处于双人动作中！","現在のプレイヤーは2人プレイ中!","Der Spieler befindet sich derzeit in einer Zwei-Spieler-Aktion!"],[100071,"Danmu_Content_1071","Successfully launch a successful campaign against the surrounding players and wait for the other party to accept it","向周围玩家发起成功，等待对方接受","周囲のプレイヤーに成功を開始し、相手が受け入れるのを待ちます","Starten Sie erfolgreich eine erfolgreiche Kampagne gegen die umliegenden Spieler und warten Sie, bis die andere Partei sie akzeptiert"],[100072,"Danmu_Content_1072","There are no interactive players in the current range","当前范围内无可交互玩家","現在の範囲内の対話不可能なプレイヤー","Es gibt keine interaktiven Player im aktuellen Sortiment"],[100073,"Danmu_Content_1073","Accept","接受","受け入れる","annehmen"],[100074,"Danmu_Content_1074","Refuse","拒绝","拒否します","verweigern"],[100075,"Danmu_Content_1075","Initiated to you","向您发起了","あなたに開始しました","Initiiert für Sie"],[100076,"Danmu_Content_1076","Action request","动作请求","アクション要求","Aktionsanforderung"],[100077,"Danmu_Content_1077","Hi~","你好","Hi~","Hi~"],[100078,"Danmu_Content_1078","No","不","No","No"],[100079,"Danmu_Content_1079","How the weather like today","今天天气怎么样","今日の天気はどうですか","Wie das Wetter heute ist"],[100080,"Danmu_Content_1080","Hello","你好啊","こんにちは","Hallo"],[100081,"Danmu_Content_1081","follow","跟随","従ってください","folgen"],[100082,"Danmu_Content_1082","Let's do a dance","跳个舞吧","踊りなさい","Lass uns einen Tanz machen"],[100083,"Danmu_Content_1083","Sing a song","唱个歌吧","歌を歌いなさい","Singen Sie ein Lied"],[100084,"Danmu_Content_1084","The weather was amazing today!","今天天气非常棒！","今日は天気が最高です!","Das Wetter war heute unglaublich!"],[100085,"Danmu_Content_1085","Hello, nice to meet you","你好，很高兴认识你","こんにちは、お会いできてうれしいです","Hallo, schön, dich kennenzulernen"],[100086,"Danmu_Content_1086","Welcome to Plaza 233! Here you can call a good friend and have a hassle-free game tour!","欢迎来到233广场！在这里您可以叫上好朋友，来一场无忧无虑的游戏之旅吧！","233 スクエアへようこそ ! ここでは、良い友人を呼び出すことができます, 気楽なゲームツアーに来てください!","Willkommen auf der Plaza 233! Hier können Sie einen guten Freund anrufen und eine stressfreie Spieltour machen!"],[100087,"Danmu_Content_1087","Here is the [joystick], drag the [joystick] with your left hand to move","这里是【摇杆】，左手拖动【摇杆】进行移动","ここでは【ロッカー】、左手をドラッグ【スティック】で移動します","Hier ist der [Joystick], ziehen Sie den [Joystick] mit der linken Hand, um sich zu bewegen"],[100088,"Danmu_Content_1088","Here is [Jump], right hand click [Jump] to jump","这里是【跳跃】，右手点击【跳跃】进行跳跃","ここでは「ジャンプ」で、右手で「ジャンプ」をクリックしてジャンプします","Hier ist [Springen], Rechtsklick [Springen] zum Springen"],[100089,"Danmu_Content_1089","Here is your [Action] list, which has a wealth of single and double actions, you can click the [Action] button to enter the use","这里是您的【动作】列表，里面有丰富的单双人动作，您可以点击【动作】按钮进入使用","ここでは、アクションボタンをクリックして使用できるシングルプレイヤーアクションの豊富なリストです","Hier ist Ihre [Action] -Liste, die eine Fülle von Einzel- und Doppelaktionen enthält, Sie können auf die Schaltfläche [Aktion] klicken, um die Verwendung"],[100090,"Danmu_Content_1090","Here is your [Backpack] list, which has all kinds of cool items, you can click the [Backpack] button to enter and use","这里是您的【背包】列表，里面有各类炫酷道具，您可以点击【背包】按钮进入使用","ここでは、バックパックボタンをクリックしてアクセスできるクールな小道具のすべての種類とあなたのバックパックのリストです","Hier ist Ihre [Rucksack] -Liste, die alle Arten von coolen Gegenständen enthält, Sie können auf die Schaltfläche [Rucksack] klicken, um sie einzugeben und zu verwenden"],[100091,"Danmu_Content_1091","Tap the screen to continue","点击屏幕继续","続行するには、画面をタップします","Tippen Sie auf den Bildschirm, um fortzufahren"],[100092,"Danmu_Content_1092","Tap the screen to end bootstrapping","点击屏幕结束引导","画面をタップしてブートを終了します","Tippen Sie auf den Bildschirm, um das Bootstrapping zu beenden"],[100093,"Danmu_Content_1093","Enter the theater","进入剧院","劇場に","Betreten Sie das Theater"],[100094,"Danmu_Content_1094","Leave the theater","离开剧院","劇場を出る","Verlassen Sie das Theater"],[100095,"Danmu_Content_1095","Hi~","你好~",null,null],[100096,"Danmu_Content_1096","LOL","哈哈哈",null,null],[100097,"Danmu_Content_1097","Bye","一起玩吧",null,null],[100098,"Danmu_Content_1098","See ya","很高兴认识你",null,null],[100099,"Danmu_Content_1099","LMAO","好呀",null,null],[100100,"Danmu_Content_1100","See you later!","下次再见",null,null],[100101,"Danmu_Content_1101","Square guide","广场引导员","広場のガイド","Square Führer"],[100102,"Danmu_Content_1102","The police","警察","警察だ","Die Polizei"],[100103,"Danmu_Content_1103","waiter","服务员","ウェイター","Kellner"],[100104,"Danmu_Content_1104","Let's come together","一起来","一緒に来る","Kommen wir zusammen"],[100105,"Danmu_Content_1105","Dance","跳舞","ダンス","tanzen"],[100106,"Danmu_Content_1106",null,"村民",null,null],[100107,"Danmu_Content_1107","Start typing","开始输入","入力を開始します","Beginnen Sie mit der Eingabe"],[100108,"Danmu_Content_1108","Clear title","恢复居民身份","タイトルをクリアします","Löschen des Titels"],[100109,"Danmu_Content_1109","Boss","老板","ボス","Chef"],[100110,"Danmu_Content_1110","waiter","服务员","ウェイター","Kellner"],[100111,"Danmu_Content_1111","Salesperson","销售员","セールスマン","Verkäufer"],[100112,"Danmu_Content_1112","Receptionist","接待员","受付","Rezeptionist"],[100113,"Danmu_Content_1113","Hoofer","舞者","ダンサー","Hufer"],[100114,"Danmu_Content_1114","Cook","厨师","シェフ","kochen"],[100115,"Danmu_Content_1115","The police","警察","警察だ","Die Polizei"],[100116,"Danmu_Content_1116","Security guard","保安","警備員だ","Wachmann"],[100117,"Danmu_Content_1117","Lifeguard","救生员","ライフガード","Rettungsschwimmer"],[100118,"Danmu_Content_1118","The title modification was successful","修改身份成功","タイトルの変更に成功しました","Die Titeländerung war erfolgreich"],[100119,"Danmu_Content_1119","Click the right button to enter identity","点击右侧按钮输入您的身份","右側のボタンをクリックして、ID を入力します","Klicken Sie auf die Schaltfläche auf der rechten Seite, um Ihre Identität einzugeben."],[100120,"Danmu_Content_1120","Name","名称","名前","Name"],[100121,"Danmu_Content_1121","Apparel","穿戴","着用してください","Kleidung"],[100122,"Danmu_Content_1122","Unload","卸下","取り外します","entladen"],[100123,"Danmu_Content_1123","ID","ID","ID","ID"],[100124,"Danmu_Content_1124","Is it a burger or dessert today?","今天是吃汉堡还是甜品呢?",null,null],[100125,"Danmu_Content_1125","50$ for a hamburger?For that money,it should eat me first.","一个汉堡50刀？让汉堡吃我吧！",null,null],[100126,"Danmu_Content_1126","Shop sign","招牌",null,null],[100127,"Danmu_Content_1127","Welcome to \"DIET\" to diet,lol.","我们不是泡泡玛特，我们是泡泡玛客！",null,null],[100128,"Danmu_Content_1128","play the role","扮演老板",null,null],[100129,"Danmu_Content_1129","Try to serve customers as \"Would you like that with or without Salmonella?\"","尝试和“顾客”打招呼吧：“您想在汉堡里加份沙门氏菌吗？”",null,null],[100130,"Danmu_Content_1130","With the owner gone, the store is in your hands for now.","老板跑路了，这家店就暂且托付给你了。",null,null],[100131,"Danmu_Content_1131","Can you have a new price for the hamburger?","汉堡是不是可以重新定个价？",null,null],[100132,"Danmu_Content_1132","Closing time","关店",null,null],[100133,"Danmu_Content_1133","Don't leave until you're sold out!","今天的营业额还没完成，不许下班>o<",null,null],[100134,"Danmu_Content_1134","Yeah Buddy ！Light Weight Baby ！","嘿，哥们，重量太轻了！",null,null],[100135,"Danmu_Content_1135","To be a PT","应聘私教",null,null],[100136,"Danmu_Content_1136","What would you say if one of your members did 80 pull-ups in one sitting？\"awesome\"? That sucks!","如果你的会员一口气做了80个引体向上，你会说什么——“真厉害”？太逊了！",null,null],[100137,"Danmu_Content_1137","Will Tyson's trainer be better than Tyson？","姚明的教练会比姚明更强吗？",null,null],[100138,"Danmu_Content_1138","BodySculpt","塑形课程",null,null],[100139,"Danmu_Content_1139","Searching for Pamela on YouTube might work better than buying private lessons!","去网上搜搜刘畊宏健身操，没准比买私教课更管用！",null,null],[100140,"Danmu_Content_1140","Do you prefer HITT or HICT? You don't understand, do you? I did it on purpose.","你更喜欢HITT还是HICT？听不懂吧哈哈，我是故意的。",null,null],[100141,"Danmu_Content_1141","Chubby but cute","胖胖的也很可爱",null,null],[100142,"Danmu_Content_1142","Don’t worry, you are not heavy at all.","别担心，你一点都不胖。",null,null],[100143,"Danmu_Content_1143","I！Love！Party！","接着奏乐接着舞！",null,null],[100144,"Danmu_Content_1144","I'm dancing Queen：）","我是舞王！",null,null],[100145,"Danmu_Content_1145","Wow，I like DDR~","跳舞机大魔王~",null,null],[100146,"Danmu_Content_1146","I'm hungry. Can you cook for me?","我好饿，你会做好吃的吗？",null,null],[100147,"Danmu_Content_1147","Okay","好呀",null,null],[100148,"Danmu_Content_1148","Fine","好呀",null,null],[100149,"Danmu_Content_1149","No problem","好呀",null,null],[100150,"Danmu_Content_1150","Popcorn","想吃爆米花",null,null],[100151,"Danmu_Content_1151","Cola","想喝可乐",null,null],[100152,"Danmu_Content_1152","Barbecue","想吃烤串",null,null],[100153,"Danmu_Content_1153","GUNDAM saikou！","机甲赛高！",null,null],[100154,"Danmu_Content_1154","I am Gundam！！！","我就是高达！！！",null,null],[100155,"Danmu_Content_1155","I'm Ultraman","我本是显赫世家的奥特曼，却被诡计多端的怪兽所害！奥特曼家族弃我！奥特之父逐我！甚至断我伽马射线！重生一世，我定要让伤害我的人付出血的代价！",null,null],[100156,"Danmu_Content_1156","Be safe, the water is dangerous","注意安全,水深危险",null,null],[100157,"Danmu_Content_1157","SALE!SALE!","全场2元全场2元",null,null],[100158,"Danmu_Content_1158","Rob","抢劫",null,null],[100159,"Danmu_Content_1159","Maybe you should go to the gym first","你还是先去健身房练练再来吧",null,null],[100160,"Danmu_Content_1160","FBI!","我是警察！",null,null],[100161,"Danmu_Content_1161","Can I join you?","我可以入伙吗？",null,null],[100162,"Danmu_Content_1162","play the role","扮演老板",null,null],[100163,"Danmu_Content_1163","The last guy was boss for five minutes and then he bolted","上一个家伙当了五分钟老板就跑了",null,null],[100164,"Danmu_Content_1164","Can you imagine the shop paying 5,000 a year in tax！","好好纳税！",null,null],[100165,"Danmu_Content_1165","Do you think it's a little strange that the cashier is outside the store?","收银员在店铺外面是不是有点奇怪？",null,null],[100166,"Danmu_Content_1166","One by one","有序排队，不要拥挤",null,null],[100167,"Danmu_Content_1167","......","......",null,null],[100168,"Danmu_Content_1168","God bless you poor thing","你可以带着道具上去，这样的话，远远一看，比较像两个人在一起坐摩天轮",null,null],[100169,"Danmu_Content_1169","There are companions","有同伴",null,null],[100170,"Danmu_Content_1170","Congratulations on finding your friend!","恭喜你找到了朋友！",null,null],[100171,"Danmu_Content_1171","For two, the price is halved~","两人同行，票价减半~",null,null],[100172,"Danmu_Content_1172","When the Ferris wheel goes to the top, the view is really beautiful","摩天轮转到最高处的时候，风景真的很美",null,null],[100173,"Danmu_Content_1173","Ledig","单身",null,null],[100174,"Danmu_Content_1174","Taylor","Taylor","Taylor","Taylor"],[100175,"Danmu_Content_1175","Glen","Glen","Glen","Glen"],[100176,"Danmu_Content_1176","James","James","James","James"],[100177,"Danmu_Content_1177","Nancy","Nancy","Nancy","Nancy"],[100178,"Danmu_Content_1178","Alice","Alice","Alice","Alice"],[100179,"Danmu_Content_1179","Anne","Anne","Anne","Anne"],[100180,"Danmu_Content_1180","Harvey","Harvey","Harvey","Harvey"],[100181,"Danmu_Content_1181","Fiona","Fiona","Fiona","Fiona"],[100182,"Danmu_Content_1182","Solomon","Solomon","Solomon","Solomon"],[100183,"Danmu_Content_1183","Fitness personal trainer","健身私教",null,null],[100184,"Danmu_Content_1184","Blacklist Words Detected","文本有违禁词，请重新输入",null,null],[100366,"Danmu_Content_1366","You cannot have more","数量达到上限",null,null],[100367,"Danmu_Content_1367","Inventory is Full","快捷栏已满",null,null],[100368,"Danmu_Content_1368","Excess items have been put into Bag","快捷栏已满，道具已放入背包",null,null],[100369,"Danmu_Content_1369","No players in range","附近无可接受玩家",null,null],[100370,"Danmu_Content_1370","Sent to you","向你给予",null,null],[1,"Text_Text_1","Ongoing Event","当前活动",null,null],[2,"Text_Text_2","Upcoming Event","即将开始",null,null],[3,"Text_Text_3","Event starts in {0} s","活动{0}秒后开始",null,null],[4,"Text_Text_4","Event ends in {0} s","距离活动结束：{0}",null,null],[5,"Text_Text_5","{0} is Ongoing","点击前往参与【{0}】",null,null],[6,"Text_Text_6","Ongoing","进行中",null,null],[7,"Text_Text_7","Upcoming Event","即将开始",null,null],[8,"Text_Text_8","Ends in","距离结束",null,null],[9,"Text_Text_9","Starts in","距离开始",null,null],[10,"Text_Text_10","Unknown","未知",null,null],[11,"Text_Text_11","Available in {0} s","可用倒计时：{0}秒",null,null],[12,"Text_Text_12","Music","音乐课",null,null],[13,"Text_Text_13","Dance","舞蹈课",null,null],[14,"Text_Text_14","Math class","数学课",null,null],[15,"Text_Text_15","Art Class","美术课",null,null],[16,"Text_Text_16","Language Class","语言课",null,null],[17,"Text_Text_17","Battle magic","战斗魔法",null,null],[18,"Text_Text_18","PE Class","体育课",null,null],[19,"Text_Text_19","Computer Class","计算机课",null,null],[20,"Text_Text_20","Self-learning","自习室",null,null],[21,"Text_Text_21","Swimming Class","游泳课",null,null],[22,"Text_Text_22","Lunch","午餐",null,null],[23,"Text_Text_23","School Play","校园演出",null,null],[24,"Text_Text_24","Free Time","自由活动",null,null],[25,"Text_Text_25","Console","篮球控制台",null,null],[26,"Text_Text_26","Rest time","休息时间",null,null],[27,"Text_Text_27","Enter Your Identity","输入你当前身份",null,null],[28,"Text_Text_28","Welcome to Mollywood","欢迎新同学来到魔莱坞学院",null,null],[29,"Text_Text_29","Come to me and learn what you need to know","现在跟随【箭头】到我这里来了解新生须知吧",null,null],[30,"Text_Text_30","Night party","夜间派对",null,null],[31,"Text_Text_31","Remember to take classes in teaching building","教学楼内的课程是学校生活必不可少的一环",null,null],[32,"Text_Text_32","Explore and have fun in classrooms","在课程对应的教室内探索学习内容吧",null,null],[33,"Text_Text_33","Wonder night","学园奇妙夜",null,null],[34,"Text_Text_34","We also have abundant events for students","学习之外学校还准备了许多有趣的活动",null,null],[35,"Text_Text_35","We have numerous clubs in the school, have a try","学校有许多兴趣社团，社团负责人在活动现场等着大家",null,null],[36,"Text_Text_36","Chat with leaders of clubs, find your favorite event","和社长聊聊看，找到你喜欢的活动吧",null,null],[37,"Text_Text_37","As a teacher, you are responsible for arranging the classroom.","作为老师要负责布置教室，找找看布置教室的魔法设备吧",null,null],[38,"Text_Text_38","Explore and learn what you are interested in","教室里有学生可以学习的内容，请教老师，多多练习吧",null,null],[39,"Text_Text_39","Pick a basketball and make a perfect three-pointer!","拿起篮球，来一个完美三分！",null,null],[40,"Text_Text_40","A dance on the court is perfect for warming up","在球场上跳个舞，是暖场的最佳选择",null,null],[41,"Text_Text_41","Have fun playing all these instruments","在DJ台控制全场节奏，也能用钢琴演奏名曲，更多乐器等待你尝试",null,null],[42,"Text_Text_42","Show your dancing style on the stage","在舞台上展示你的舞姿吧",null,null],[43,"Text_Text_43","Working in Café is busy but interesting","咖啡厅的打工生活，忙碌但是有趣",null,null],[44,"Text_Text_44","Teacher introduction 1","老师介绍1",null,null],[45,"Text_Text_45","Teacher introduction 2","老师介绍2",null,null],[46,"Text_Text_46","Student Introduction 1","学生介绍1",null,null],[47,"Text_Text_47","Student introduction 2","学生介绍2",null,null],[48,"Text_Text_48","Introduction to Sports Students 1","体育生介绍1",null,null],[49,"Text_Text_49","Introduction to Sports Students 2","体育生介绍2",null,null],[50,"Text_Text_50","Cheerleading Introduction 1","啦啦队介绍1",null,null],[51,"Text_Text_51","Cheerleading Introduction 2","啦啦队介绍2",null,null],[52,"Text_Text_52","Music star introduction 1","音乐明星介绍1",null,null],[53,"Text_Text_53","Music Star Introduction 2","音乐明星介绍2",null,null],[54,"Text_Text_54","Dance Star Introduction 1","舞蹈明星介绍1",null,null],[55,"Text_Text_55","Introduction to Dance Star 2","舞蹈明星介绍2",null,null],[56,"Text_Text_56","Waiter I","服务生1",null,null],[57,"Text_Text_57","Waiter II","服务生2",null,null],[58,"Text_Text_58","School abuser","校霸",null,null],[59,"Text_Text_59","Captain Jack Sparrow","杰克船长",null,null],[60,"Text_Text_60","Magician Luna","魔法师狸月",null,null],[61,"Text_Text_61","Principal","校长",null,null],[62,"Text_Text_62","A strange person","奇怪的人",null,null],[63,"Text_Text_63","Man in uniform","校警",null,null],[64,"Text_Text_64","A reading person","看书的人",null,null],[65,"Text_Text_65","Chef","厨师",null,null],[66,"Text_Text_66","Magician","校园魔法师",null,null],[67,"Text_Text_67","Photography Club Leader","摄影社社长",null,null],[68,"Text_Text_68","Lyon","狸正",null,null],[69,"Text_Text_69","Greeting","打招呼",null,null],[70,"Text_Text_70","What should I do","我该做什么",null,null],[71,"Text_Text_71","What courses do I have?","有什么课程",null,null],[72,"Text_Text_72","Soul","战斗牧师",null,null],[73,"Text_Text_73","What are you doing?","你在做什么？",null,null],[74,"Text_Text_74","What to do in classroom","在教室可以做什么",null,null],[75,"Text_Text_75",null,null,null,null],[76,"Text_Text_76","Who are you?","你是谁",null,null],[77,"Text_Text_77","What happened?","发生了什么事",null,null],[78,"Text_Text_78",null,null,null,null],[79,"Text_Text_79","What are you doing?","你在做什么？",null,null],[80,"Text_Text_80","Could you tell me the title?","请告诉我书名",null,null],[81,"Text_Text_81",null,null,null,null],[82,"Text_Text_82","Please give me lunch.","请给我一份午餐",null,null],[83,"Text_Text_83","I want special food.","我想要特别的食物",null,null],[84,"Text_Text_84",null,null,null,null],[85,"Text_Text_85","I want to learn about the magic on campus","想了解校园的魔法",null,null],[86,"Text_Text_86","Where can I find magic items","在哪里能获得魔法道具",null,null],[87,"Text_Text_87",null,null,null,null],[88,"Text_Text_88","How to take pictures","如何拍照",null,null],[89,"Text_Text_89","Learn photography skills","请教拍摄技巧",null,null],[90,"Text_Text_90",null,null,null,null],[91,"Text_Text_91",null,null,null,null],[92,"Text_Text_92","Hello, need help?","你好，需要帮助吗？",null,null],[93,"Text_Text_93","You can get route guidance every time a class starts.","每次课程开始时都会提供路线引导",null,null],[94,"Text_Text_94","You can view today's classes in the schedule.","通过课程表可以查看今日的课程",null,null],[95,"Text_Text_95",null,null,null,null],[96,"Text_Text_96",null,null,null,null],[97,"Text_Text_97",null,null,null,null],[98,"Text_Text_98",null,null,null,null],[99,"Text_Text_99",null,null,null,null],[100,"Text_Text_100","There are various clubs in academy","学校里有各种各样的学生组织",null,null],[101,"Text_Text_101","Find their leaders and you may find some secrets","找到他们的负责人，从他们那里打听校园的秘密吧",null,null],[102,"Text_Text_102",null,null,null,null],[103,"Text_Text_103","...","...",null,null],[104,"Text_Text_104",null,null,null,null],[105,"Text_Text_105",null,null,null,null],[106,"Text_Text_106",null,null,null,null],[107,"Text_Text_107",null,"从此刻，守护魔法校园！",null,null],[108,"Text_Text_108","I'm responsible for the order of the school.","我负责维持学校的治安",null,null],[109,"Text_Text_109","I'm looking for offenders who drop litter.","我正在寻找乱扔垃圾的违规者",null,null],[110,"Text_Text_110","Hello Hello, nice to meet you","你好你好，很高兴认识你们",null,null],[111,"Text_Text_111",null,null,null,null],[112,"Text_Text_112",null,null,null,null],[113,"Text_Text_113",null,null,null,null],[114,"Text_Text_114","SHH! I found a strange book. I found it by accident","嘘~我发现了一本奇怪的书，意外找到的",null,null],[115,"Text_Text_115","Ten Mysteries of Wizarding Campus. I'll show you later!","《校园的十大神秘事件》，等会给你看！",null,null],[116,"Text_Text_116",null,null,null,null],[117,"Text_Text_117",null,null,null,null],[118,"Text_Text_118","You can start dancing on Stage","走上舞台就可以跳舞了",null,null],[119,"Text_Text_119","Switch music at DJ booth, different music enables different dance moves","但是你可以在DJ台切换音乐，不同的音乐将激发你不同的舞蹈基因",null,null],[120,"Text_Text_120","You may also find the hidden track","如果能解锁隐藏曲目，你也可以引导其他人学习舞蹈哦",null,null],[121,"Text_Text_121",null,null,null,null],[122,"Text_Text_122","Today's food is on the bar","今天的食物已经摆在吧台上了",null,null],[123,"Text_Text_123","There are wines on the shelf. But only adults can drink.","架子上有酒，只有成年人才可以喝哦",null,null],[124,"Text_Text_124","I look at the stars and I will meet you","我眼望星辰，终将与你相逢",null,null],[125,"Text_Text_125","Come and be the most popular person in school!","快来成为全校最受欢迎的人！",null,null],[126,"Text_Text_126","You can play on public instruments","可以在公共乐器上直接演奏",null,null],[127,"Text_Text_127","You can also take small instruments with you","小型乐器就可以拿在手上",null,null],[128,"Text_Text_128","Work hard in music class","记得在音乐课上多学习哦",null,null],[129,"Text_Text_129","Because you are so beautiful! My ball and you spin","只因你太美！我的球而你旋转",null,null],[130,"Text_Text_130","Magic is everywhere on campus","校园里魔法无处不在",null,null],[131,"Text_Text_131","Magics can change your costume and your surroundings","魔法能够成为你的装扮，能够改变周围的环境",null,null],[132,"Text_Text_132","But to do that you will need the help of magic items","但是你需要魔法道具的帮助",null,null],[133,"Text_Text_133","Stand at attention, at ease!","立正，稍息！",null,null],[134,"Text_Text_134","Rare magic items will appear at specific locations, these items can change the environment","场景里布置有可以改变环境的大型魔法道具，他只在特定时间和地点出现",null,null],[135,"Text_Text_135","There are also some artifacts that can change the weather or your costume","同时也有一些小型道具，可以改变外观或者天气",null,null],[136,"Text_Text_136","There are lots of magic items in modeling classroom","有个秘密，造型课教室有大量的魔法道具能让你变的闪闪发光哦",null,null],[137,"Text_Text_137","It's okay, yo, yo!","还可以哦，哟哟！",null,null],[138,"Text_Text_138","Tap the Camera on screen to enter Photo Mode","点击屏幕上的【相机】，就可以打开摄像机了",null,null],[139,"Text_Text_139","Books are the only thing in the world that keep me awake","世间唯有书本才能让我清醒",null,null],[140,"Text_Text_140","There's much to explore in Photo Mode","摄像机有多种模式，有些模式能让你看到和平时不一样的风景哦",null,null],[141,"Text_Text_141","But the most important thing for photography is your imagination!","更多的拍摄技巧，都靠你发挥自己的想象力了",null,null],[142,"Text_Text_142","Study hard!","好好学习！",null,null],[143,"Text_Text_143","Hi~","同学你好~",null,"魔莱坞校长"],[144,"Text_Text_144","…","...",null,"教导主任"],[145,"Text_Text_145","Please follow the rules.","请遵守校园守则",null,"篮球社社长"],[146,"Text_Text_146","Interesting","真有趣",null,"舞蹈社社长"],[147,"Text_Text_147","Have a look at today's lunch","来看看今天的菜谱",null,"乐团团长"],[148,"Text_Text_148","Magic is miracle!","魔法就是奇迹降临！",null,"校园魔法师"],[149,"Text_Text_149","Where can I get a perfect picture?","哪里才有绝佳的拍摄视角呢",null,"摄影社社长"],[150,"Text_Text_150","Hey, look who this is? !","嘿，瞧瞧这是谁？！",null,null],[151,"Text_Text_151","Cartoon","卡通",null,null],[152,"Text_Text_152","Lovely","可爱",null,null],[153,"Text_Text_153","Wabi-sabi","和风",null,null],[154,"Text_Text_154","Sacred","神圣",null,null],[155,"Text_Text_155","Inferno","地狱",null,null],[156,"Text_Text_156","Rock","摇滚",null,null],[157,"Text_Text_157","Gorgeous","华丽",null,null],[158,"Text_Text_158","Sexy","性感",null,null],[159,"Text_Text_159","Classical","古典",null,null],[160,"Text_Text_160","Pop","流行",null,null],[161,"Text_Text_161","Ballet","芭蕾",null,null],[162,"Text_Text_162","Apprentice","魔法学生",null,null],[163,"Text_Text_163","Wizard","魔法老师",null,null],[164,"Text_Text_164","Music Student","音乐学生",null,null],[165,"Text_Text_165","Music Teacher","音乐老师",null,null],[166,"Text_Text_166","Dance Teacher","舞蹈老师",null,null],[167,"Text_Text_167","Dance Student","舞蹈学生",null,null],[168,"Text_Text_168","Modeling Teacher","造型老师",null,null],[169,"Text_Text_169","Modeling Student","造型学生",null,null],[170,"Text_Text_170","Basketball Club Member","篮球社员",null,null],[171,"Text_Text_171","Cheerleader","啦啦队",null,null],[172,"Text_Text_172","Dance Club Member","舞蹈社员",null,null],[173,"Text_Text_173","Music Club Member","音乐社员",null,null],[174,"Text_Text_174","Waiter","服务生",null,null],[175,"Text_Text_175","Remain","剩余时间",null,null],[176,"Text_Text_176","Theme","当前主题",null,null],[177,"Text_Text_177","Theme Select","场景主题选择",null,null],[178,"Text_Text_178","Try Again Later","切换主题太频繁，稍等一下~",null,null],[179,"Text_Text_179","Theme Select","场景主题选择",null,null],[180,"Text_Text_180","No Events, Console Disabled","当前区域没有活动，操作台未启用",null,null],[181,"Text_Text_181","Try Again Later","当前不可替换主题，请耐心等待一下",null,null],[182,"Text_Text_182","Event's Over","活动结束了",null,null],[183,"Text_Text_183","Theme Switched to {0}","已切换到{0}主题",null,null],[184,"Text_Text_184","Interesting, very interesting!","有趣，非常有趣！",null,null],[185,"Text_Text_185","Central Playza","233广场",null,null],[186,"Text_Text_186","Emote","动作",null,null],[187,"Text_Text_187","Emoji","表情",null,null],[188,"Text_Text_188","Filter","滤镜",null,null],[189,"Text_Text_189","Weather","天气",null,null],[190,"Text_Text_190","Tap on the screen to exit Photo Mode","截取屏幕保存相片，点击屏幕关闭拍照模式",null,null],[191,"Text_Text_191","Schedule","日程",null,null],[192,"Text_Text_192","Join","立即前往",null,null],[193,"Text_Text_193","What a buzz!","好热闹啊！",null,null],[194,"Text_Text_194","Merlin, Little assistant of Mollywood","魔莱坞小助理梅琳",null,null],[195,"Text_Text_195","You're the best!","你是最棒的！",null,null],[196,"Text_Text_196","Transcript","成绩单",null,null],[197,"Text_Text_197","A+","A+",null,null],[198,"Text_Text_198","A","A",null,null],[199,"Text_Text_199","B+","B+",null,null],[200,"Text_Text_200","B","B",null,null],[201,"Text_Text_201","C+","C+",null,null],[202,"Text_Text_202","C","C",null,null],[203,"Text_Text_203","F","F",null,null],[204,"Text_Text_204","Don't stare at me. Have a good swim","不要盯着我看，好好游泳",null,null],[205,"Text_Text_205","Go to bed now","赶快给我睡觉去",null,null],[206,"Text_Text_206","God","上帝",null,null],[207,"Text_Text_207","Heart to the bright","我是世界的光,跟从我的就不在黑暗里走",null,null],[208,"Text_Text_208",null,null,null,null],[209,"Text_Text_209","Score: {0}","得分：{0}",null,null],[210,"Text_Text_210","1","1",null,null],[211,"Text_Text_211","Monday","星期一",null,null],[212,"Text_Text_212","Tuesday","星期二",null,null],[213,"Text_Text_213","Wednesday","星期三",null,null],[214,"Text_Text_214","Thursday","星期四",null,null],[215,"Text_Text_215","Friday","星期五",null,null],[216,"Text_Text_216","Saturday","星期六",null,null],[217,"Text_Text_217","Sunday","星期日",null,null],[218,"Text_Text_218","Night break... {0}","夜晚休息中...{0}",null,null],[219,"Text_Text_219","{0} is about to start","{0}即将开始",null,null],[220,"Text_Text_220","The next class is {0}, please be on time","下一节课是{0}，请准时参加",null,null],[221,"Text_Text_221","Today's schedule","今日课程表",null,null],[222,"Text_Text_222","Tomorrow's schedule","明日课程表",null,null],[223,"Text_Text_223","Class accomplished","课程达标",null,null],[224,"Text_Text_224","Absent","缺课",null,null],[225,"Text_Text_225","Sign in","签到",null,null],[226,"Text_Text_226","Schedule","日程表",null,null],[227,"Text_Text_227","Ongoing","正在进行",null,null],[228,"Text_Text_228","Not start yet","未开始",null,null],[229,"Text_Text_229","Go to","前往",null,null],[230,"Text_Text_230","Grades","课堂成绩：",null,null],[231,"Text_Text_231","Evaluation","评价",null,null],[232,"Text_Text_232","Name","姓名",null,null],[233,"Text_Text_233","Grades","成绩",null,null],[234,"Text_Text_234","Score","分数","这个是组合用与足球游戏的拆出文本",null],[235,"Text_Text_235","Which is bigger?","比大小",null,null],[236,"Text_Text_236","Score:","分数：","这个是单独的词语",null],[237,"Text_Text_237","Music rehearsal","音乐排练",null,null],[238,"Text_Text_238","Dance imitation","舞蹈模仿",null,null],[239,"Text_Text_239","Size comparison","大小比较",null,null],[240,"Text_Text_240","Shooting practice","投篮练习",null,null],[241,"Text_Text_241","Football game","红蓝足球赛",null,null],[242,"Text_Text_242","Remember the patterns you see and click them!","记住你看到的图案，精准复制它！",null,null],[243,"Text_Text_243","Remember the patterns you see and click them!","记住你看到的图案，精准复制它！",null,null],[244,"Text_Text_244","Compare the numbers on the left and right. Which is bigger?","观察左右数字，对比他们的大小",null,null],[245,"Text_Text_245","Shoot the ball into the basket!","把篮球投入篮筐！",null,null],[246,"Text_Text_246","Shoot the ball to your team's goal (be careful of self goals)","把足球踢到你所属队伍的球门（小心乌龙球）",null,null],[247,"Text_Text_247","Select your role","选取角色",null,null],[248,"Text_Text_248","Principal","校长",null,null],[249,"Text_Text_249","Janitor","校工",null,null],[250,"Text_Text_250","Male teacher","男教师",null,null],[251,"Text_Text_251","Freshmen","新生",null,null],[252,"Text_Text_252","Athlete","运动员",null,null],[253,"Text_Text_253","Cheerleader","啦啦队员",null,null],[254,"Text_Text_254","Choose one for me","帮我挑选",null,null],[255,"Text_Text_255","I'll always be here. Please come to me if you ever have any questions.","我会一直待在这里，如果你有问题可以随时来找我",null,null],[256,"Text_Text_256","I believe you've known better about the school. Now let's take a photo.","相信你对于学校已经有了一些了解，现在让我们来拍张照片吧",null,null],[257,"Text_Text_257","Welcome to Mollywood , looking forward to a happy magical campus life here","欢迎来到Mollywood学院，期待你在这里度过一段愉快的校园生活",null,null],[258,"Text_Text_258","The lesson has begun, go to learn!","课程已经开始了，快去学习吧！",null,null],[259,"Text_Text_259","Here is the football field, where you can cooperate with other players to win the game.","这是足球场，在这里你可以和其他玩家配合取得足球比赛的胜利",null,null],[260,"Text_Text_260","Schoolmistress","女教师",null,null],[261,"Text_Text_261","Here is the music room, you can feel the charm of music here.","这是音乐教室，你可以在里面感受音乐的魅力",null,null],[262,"Text_Text_262",null,null,null,null],[263,"Text_Text_263","Here is the math classroom where you can make friends with numbers","这是数学教室，在这里你可以和数字交朋友",null,null],[264,"Text_Text_264",null,null,null,null],[265,"Text_Text_265","Here is the dancing room, where you can show your elegant gestures.","这是舞蹈教室，在这里你可以展示你优雅的舞姿",null,null],[266,"Text_Text_266",null,null,null,null],[267,"Text_Text_267","Here is the cafeteria. You can have lunch here.","这是食堂，中午你可以在里面就餐",null,null],[268,"Text_Text_268",null,null,null,null],[269,"Text_Text_269","This is the Magic Room, where you can learn combat magic","这里是魔法教室，在这里你可以学习战斗魔法",null,null],[270,"Text_Text_270",null,null,null,null],[271,"Text_Text_271",null,null,null,null],[272,"Text_Text_272","I'll wait for you in the teaching building. Please come over and get ready for class.","我在教学楼里等你，快过来准备上课了",null,null],[273,"Text_Text_273",null,null,null,null],[274,"Text_Text_274","Now I will teach you how to attend a class. First, click on your schedule.","现在我将教你如何参加课程,首先点击你的课程表",null,null],[275,"Text_Text_275","Night party","夜晚派对",null,null],[276,"Text_Text_276","Then click the Go button, and you can get the guide line to the classroom","然后点击前往按钮，参加课程",null,null],[277,"Text_Text_277",null,null,null,null],[278,"Text_Text_278","Congratulations on completing the admission guidelines. Go learn magic, alchemy, and be strong!","恭喜你完成入学指引，快去上课学习，变得更强大吧！",null,null],[279,"Text_Text_279","You can move and adjust the camera in this interface.","你可以在和这个界面，移动和设置照相机的参数，现在点击拍照按钮吧，拍照结束后，请点击屏幕",null,null],[280,"Text_Text_280","Click the shutter.","点击照相按钮",null,null],[281,"Text_Text_281","Now please click the close button","现在请点击关闭按钮",null,null],[282,"Text_Text_282","PE Class","体育课",null,null],[283,"Text_Text_283","Study room","自习室","教室名称",null],[284,"Text_Text_284","Canteen","食堂","教室名称",null],[285,"Text_Text_285","Language","语言","教室名称",null],[286,"Text_Text_286","Math","数学","教室名称",null],[287,"Text_Text_287","Basketball Court","魔法教室","教室名称",null],[288,"Text_Text_288","Swimming Pool","游泳馆","教室名称",null],[289,"Text_Text_289","Theater","剧场","教室名称",null],[290,"Text_Text_290","Dance","舞蹈","教室名称",null],[291,"Text_Text_291","Music","音乐","教室名称",null],[292,"Text_Text_292","Creation","造物","教室名称",null],[293,"Text_Text_293","Clinic","医疗室","教室名称",null],[294,"Text_Text_294","Library","图书室",null,null],[295,"Text_Text_295","Art","美术",null,null],[296,"Text_Text_296","Music - Music Theory Exercises (3.0)","音乐-乐理练习（3.0）",null,null],[297,"Text_Text_297","Dance - Group Dance (3.0)","舞蹈-团体舞（3.0）",null,null],[298,"Text_Text_298","Math - Basic Math (3.0)","数学-基础数学（3.0）",null,null],[299,"Text_Text_299","Art - Still Life Sketch (2.0)","美术-素描静物（2.0）",null,null],[300,"Text_Text_300","Language - Book Reading (2.0)","语言-图书阅读（2.0）",null,null],[301,"Text_Text_301","Combat - Target Practice (3.0)","战斗-打靶练习（3.0）",null,null],[302,"Text_Text_302","PE class - Obstacle Race (4.0)","体育课-障碍赛跑（4.0）",null,null],[303,"Text_Text_303","Computer - Animation (2.0)","计算机-动画制作（2.0）",null,null],[304,"Text_Text_304","Self-learning","自习课",null,null],[305,"Text_Text_305","Swimming - High Diving (3.0)","游泳-高空跳水（3.0）",null,null],[306,"Text_Text_306","Lunch","午餐",null,null],[307,"Text_Text_307","Theater time","剧场时间",null,null],[308,"Text_Text_308","Free time","自由活动",null,null],[309,"Text_Text_309","Magic item","神奇道具",null,null],[310,"Text_Text_310","Close","关闭",null,null],[311,"Text_Text_311","Attempts:","投篮次数：",null,null],[312,"Text_Text_312","Score:","得分：",null,null],[313,"Text_Text_313","Sure","确认",null,null],[314,"Text_Text_314","What can I do for you?","请问有什么事能够帮你吗？",null,null],[315,"Text_Text_315","Hello classmate","同学你好",null,null],[316,"Text_Text_316","I need you to help me get to a class, and then get back to me","我需要你帮我去上一节课，之后再来找我吧",null,null],[317,"Text_Text_317","What classes do you take?","那上什么课呢",null,null],[318,"Text_Text_318","Language class I don't like language class","语言课吧 我不喜欢语言课",null,null],[319,"Text_Text_319","OK","好的",null,null],[320,"Text_Text_320","Well, I don't like this class either","算了 我也不喜欢上",null,null],[321,"Text_Text_321","Thank you in advance","先谢谢你啦",null,null],[322,"Text_Text_322","All right then","那好吧",null,null],[323,"Text_Text_323","I see you've done your job. You can have this gun","看来您你已经完成了任务，这把枪就送给你玩吧",null,null],[324,"Text_Text_324","Be careful not to shoot randomly on campus!","小心不要在校园里乱开枪哦",null,null],[325,"Text_Text_325","End of class","课程结束",null,null],[326,"Text_Text_326","Tomorrow's schedule","明日课程表",null,null],[327,"Text_Text_327","Talk to the principal","跟校长对话",null,null],[328,"Text_Text_328","Welcome to the Magic world of Mollywood School Academy! Go explore the fun stuff, and I'm here to answer your questions","欢迎来到魔莱坞学院！快去探索有趣的事情吧，我也会在这里随时解答你的问题",null,null],[329,"Text_Text_329","How do I get to class?","平时上课要怎么去",null,null],[330,"Text_Text_330","Follow the arrows and the army, don't be afraid to get lost.","跟着箭头与大部队走，不要怕迷路",null,null],[331,"Text_Text_331","Can I be the principal?","我能成为校长吗？",null,null],[332,"Text_Text_332","Oh, then I'll have to magic you out of school! It's not your place to sit in my seat","噢，那我可要把你赶出校门了！还轮不到你来坐我的位置",null,null],[333,"Text_Text_333","I'm a new student. Do I get a gift?","我是新生，有入学礼物吗？",null,null],[334,"Text_Text_334","Hey, you're the best gift to the House, but until then, hold on to your magic trophy","嘿 你对于学院就是最好的礼物，不过在此之前快捧好给你的奖杯",null,null],[335,"Text_Text_335","You already have the magic trophy","你已经拿到过奖杯了",null,null],[336,"Text_Text_336","What else do you need to ask?","你还需要问什么？",null,null],[337,"Text_Text_337","No, thanks.","不用了 谢谢",null,null],[338,"Text_Text_338","Hope you have a great time at school","希望你在学院，玩得愉快",null,null],[339,"Text_Text_339","I think it's good","我觉得还不错",null,null],[340,"Text_Text_340","I want to ask you something else","我还想问其他的",null,null],[341,"Text_Text_341","Talk to campus police","跟校警对话",null,null],[342,"Text_Text_342","Hey, be careful in the hall, especially at night!","你好，在大厅要注意安全，尤其是晚上！",null,null],[343,"Text_Text_343","Has anything happened recently?","最近有发生什么事情吗",null,null],[344,"Text_Text_344","I hear you have a legend, Mr. Campus Police.","我听说校警大叔你有传奇故事",null,null],[345,"Text_Text_345","When I'm on patrol at night, I often see something really scary, maybe it's a vision, you guys stay safe","我在夜晚巡逻的时候经常会看到一些很可怕的东西，可能是眼花了，你们多注意安全",null,null],[346,"Text_Text_346","Ok, you go ahead","好的，您先忙",null,null],[347,"Text_Text_347","Good luck","祝你好运",null,null],[348,"Text_Text_348","I never thought anyone would listen to my stories","没想到还有人愿意听我讲故事",null,null],[349,"Text_Text_349","Before I was a campus cop, I was out there. I have seen the charm of the ancient East, traced the aurora of the northern snow fields, marveled at the grandeur of the western magic, and looked forward to the future on the southern horizon","我没当校警之前，曾在外面闯荡。见识了东方古国的神韵，追寻过北方雪原的极光，感叹那西方科技的宏伟，也在南方交接的海平线上展望未来",null,null],[350,"Text_Text_350","Haha, the story is over. I believe we got a connection. Here is a phone for you, if you've got one, it's in your backpack. Go and see the sights!","哈哈故事结束，看咱们有缘给你个手机，如果你已经拿到过它就在背包里，快去见识那些美景！",null,null],[351,"Text_Text_351","I hope you can follow your own dreams","希望你也能追逐自己的梦",null,null],[352,"Text_Text_352","Ok, I'll be careful","好的我会注意的",null,null],[353,"Text_Text_353","All right, I'll do my best","好的我会加油的",null,null],[354,"Text_Text_354","Talk to strange people","跟奇怪的人对话",null,null],[355,"Text_Text_355","You're running down the road. It's bugging me!","你在路上跑，影响到我了！",null,null],[356,"Text_Text_356","Sorry, I didn't know","抱歉是我不知道",null,null],[357,"Text_Text_357","Oh, I'm sorry, but it's none of your business","哦对不起，不过你管不着我",null,null],[358,"Text_Text_358","Okay, I forgive you. You want to hear something interesting?","好吧我原谅你了，想听一些有趣的事情吗？",null,null],[359,"Text_Text_359","God will not favour you if you don't act like a student.","呵呵真没点学生的样子，上帝不会眷顾你的。",null,null],[360,"Text_Text_360","Talk about it","说说看",null,null],[361,"Text_Text_361","Sorry, I'm not interested","对不起不感兴趣",null,null],[362,"Text_Text_362","You can't run into the school building at night, it's dangerous here, but there are also lots of treasures","夜晚你们不能跑到教学楼，这里很危险，但也有很多的宝藏",null,null],[363,"Text_Text_363","If you often hear someone singing in the music or art classroom at night, but there's no one in there! Be careful when you turn your head!","如果晚上经常听到音乐或者美术教室有人唱歌，但是进去没有一个人！转头的时候一定要小心！",null,null],[364,"Text_Text_364","If you meet me at night, please don't worry about me. I'm trying my best to protect this campus from the invasion of Bigfoot on the playground","如果你在夜晚遇见了我，请不要为我担心，我在尽力守护着这个校园，不被足球场上的大脚怪入侵",null,null],[365,"Text_Text_365","If you see a ghost at night, don't hesitate, run, run! You'll beat him one day, but for now, the Treehouse dorm will protect you","如果你晚上看到了鬼，不要犹豫，跑，赶快跑！总有一天你会击败他，不过现在树屋宿舍会保护你",null,null],[366,"Text_Text_366","That's all I wanna know for now","就打听这么多",null,null],[367,"Text_Text_367","That's all. I will find out more later","就这么多，其他的我还要多打听下",null,null],[368,"Text_Text_368","That's was interesting. Tell me more next time","真有趣，等你下次跟我说",null,null],[369,"Text_Text_369","Ok, you can come anytime","好的，你可以随时来",null,null],[370,"Text_Text_370","Okay, let me walk you through it","好的，我再给你讲解下",null,null],[371,"Text_Text_371","Goodbye","再见",null,null],[372,"Text_Text_372","Hurdle race","障碍赛跑",null,null],[373,"Text_Text_373","Classify","分门别类",null,null],[374,"Text_Text_374","Typing practice","打字练习",null,null],[375,"Text_Text_375","Avoid obstacles and reach the destination to get points","躲避障碍物，穿过里程点积累计分",null,null],[376,"Text_Text_376","Stack the same items together","将中间的纸片拖动，和四周相同的堆放在一起",null,null],[377,"Text_Text_377","Click according to the displayed words","根据显示单词依次点击下面的字母",null,null],[378,"Text_Text_378","Talk to the reader","跟看书的人对话",null,null],[379,"Text_Text_379","Hello, classmates","你好啊，同学",null,null],[380,"Text_Text_380","Talk to the chef","跟厨师对话",null,null],[381,"Text_Text_381","Hello, students, these are fresh baked food, what would you like to have today? After eating, you can go for a walk around the campus!","哈喽同学，这些都是新鲜出炉的美食，你今天想吃点啥？吃完可以去逛逛校园哦！",null,null],[382,"Text_Text_382","（Go on）","（继续说）",null,null],[383,"Text_Text_383","Strange knowledge accumulated","奇怪的知识增加了",null,null],[384,"Text_Text_384","More strange knowledge accumulated","奇怪的知识又增加了",null,null],[385,"Text_Text_385","Even more strange knowledge accumulated","奇怪的知识继续增加了",null,null],[386,"Text_Text_386","More and more strange knowledge","奇怪的知识越来越多了",null,null],[387,"Text_Text_387","Milestone","里程点",null,null],[388,"Text_Text_388","You already have a jetpack","你已经获得过喷气背包了",null,null],[389,"Text_Text_389","Welcome new students to the school, this is your magic world, the school for you to prepare rich courses, improve your ability, challenge knowledge and test you can play games here to improve personal performance, meet new friends, explore every corner of the campus balance study and social, harvest happiness","欢迎新同学入学，这是属于你的欢乐校园，学校为你准备了丰富的课程，提升你的能力，挑战知识和考验你可以在这里玩小游戏提升个人成绩、结实新朋友、探索校园的每个角落平衡学习和社交，收获快乐吧",null,null],[390,"Text_Text_390","Talk to the bullies","跟校霸对话",null,null],[391,"Text_Text_391","Hey! Look who it is? !","嘿！瞧瞧这是谁？！",null,null],[392,"Text_Text_392","Oh! It's the new show-off kid","噢！是那个新来的转校生！",null,null],[393,"Text_Text_393","What are you doing here? The school is our place","你来这里干什么？学校都是我们的地盘",null,null],[394,"Text_Text_394","You don't welcome me as a classmate?","作为同学你们都不欢迎我？",null,null],[395,"Text_Text_395","I know, but there's no garbage here! You're not welcome here!","我知道啊，可这里不待见你！这里也不欢迎你！",null,null],[396,"Text_Text_396","(…)","(…)",null,null],[397,"Text_Text_397","Well, listen up, we're throwing a cool party this week, with all the popular guys in school!","既然遇到那就听好了，这周我们要举办一个超酷的派对,全校所有的风云人物都会参加!",null,null],[398,"Text_Text_398","But guess who doesn't get invited?","但是你猜，谁收不到邀请？",null,null],[399,"Text_Text_399","You can't be talking about me, can you?","你说的不会是我？",null,null],[400,"Text_Text_400","It's you! Ha ha ha! You're not invited","你！哈哈哈哈！你没有被邀请",null,null],[401,"Text_Text_401","Why?","为什么？",null,null],[402,"Text_Text_402","No reason, don't be freak out, just go home and cry little garbage!","没有为什么，别被吓坏了，麻溜地回家哭去吧！",null,null],[403,"Text_Text_403","Talk to a party geek","跟派对咖对话",null,null],[404,"Text_Text_404","Hey, you're early. The party hasn't even started yet","嘿 你来早了，白天派对还没开始呢",null,null],[405,"Text_Text_405","Well, can I waltz on the side?","那我能在旁边跳华尔兹吗？",null,null],[406,"Text_Text_406","All right, look forward to your performance","好的，期待你的表演",null,null],[407,"Text_Text_407","I hear you don't get along with hip-hop kids?","听说你跟嘻哈少年关系不好？",null,null],[408,"Text_Text_408","Be my guest. I'll give you some advice","好的请便，我会给你建议的",null,null],[409,"Text_Text_409","We will live up to the expectations of our classmates","我们不会辜负同学们的期待",null,null],[410,"Text_Text_410","Oh? That stinking brother? He has a lot of talent but a little bad temper","哦？那个臭弟弟吗？他很有天赋可就是脾气差了点",null,null],[411,"Text_Text_411","Talk to the treehouse party geek","跟树屋的派对咖对话",null,null],[412,"Text_Text_412","Let me see. Are you ready? !","让我看看你们准备好了吗？！",null,null],[413,"Text_Text_413","Is there a party tonight?","晚上有派对吗？",null,null],[414,"Text_Text_414","Let's start the celebration of the night!","让我们开启属于夜晚的盛典吧！",null,null],[415,"Text_Text_415","I can't wait!","我已经等不及了！",null,null],[416,"Text_Text_416","It will be open in the evening!","晚上就开！",null,null],[417,"Text_Text_417","Talk to an athletic teenager","与运动少年对话",null,null],[418,"Text_Text_418","Do you like sports? Any interest in playing basketball?","你喜欢运动吗？有没有兴趣接触下篮球？",null,null],[419,"Text_Text_419","Actually, I like to shoot bad guys in the head, too","其实，我也喜欢打爆坏人的头",null,null],[420,"Text_Text_420","Sure. Play ball?","当然，打球吗？",null,null],[421,"Text_Text_421","Ha ha, you are very humorous! I'd like to play together sometime","哈哈，你很幽默啊！以后有机会一起打球",null,null],[422,"Text_Text_422","Then take these balls from the ground, aim for the box, and throw them in!","那快拿起地上的这些球，瞄准那个框，准准地投进去！",null,null],[423,"Text_Text_423","Full marks!","满分！",null,null],[424,"Text_Text_424","Talk to the PE teacher","跟体育老师对话",null,null],[425,"Text_Text_425","Hey, it's you. What are you doing","嘿，就是你，你怎么磨磨唧唧的",null,null],[426,"Text_Text_426","Exercise on time, hey Sir","准时运动，嘿Sir",null,null],[427,"Text_Text_427","I'm just too full to exercise","我才吃饱了不适合运动",null,null],[428,"Text_Text_428","Get off the ink and exercise. You have a good base","别墨迹，好好锻炼，你的底子很不错",null,null],[429,"Text_Text_429","Your grades are poor in PE. Go exercise! Good physical strength is the best way to use magic","你的体育成绩很差，快去锻炼！拥有好体力才能强身健体",null,null],[430,"Text_Text_430","Don't give me an excuse, a good exercise, in order to brave the invasion of dark magic","别给我找借口，好好锻炼身体，才能勇敢的面对夜晚",null,null],[431,"Text_Text_431","Talk to hip-hop kids","跟嘻哈少年对话",null,null],[432,"Text_Text_432","What's up? Yes?","咋了？有事？",null,null],[433,"Text_Text_433","I want to play hip-hop with you","我想跟你一起玩嘻哈",null,null],[434,"Text_Text_434","I heard you never go to parties","听说你从来不去参加派对",null,null],[435,"Text_Text_435","It's nothing. I'm here to dance, too, okay","没什么，我也是来练舞蹈的",null,null],[436,"Text_Text_436","Oh? It's a good idea. I'll take you to a show sometime","哦？不错是好苗子，以后有机会带你去演出",null,null],[437,"Text_Text_437","I'll see you at the dance","那我们舞会时候见",null,null],[438,"Text_Text_438","I just don't like that little piece of trash. What's the point","我就是看不惯他，没什么好说的",null,null],[439,"Text_Text_439","Why? What's your problem?","为什么，你们有什么过节？",null,null],[440,"Text_Text_440","Nothing, but you know I'm the real hip-hop party king!","没什么，不过你要知道我才是真正的嘻哈派对之王！",null,null],[441,"Text_Text_441","You can work with him","你可以跟他合作",null,null],[442,"Text_Text_442","You get out of here now! I don't want to see you again! You're with him!","你现在给我出去！ 我不想再看到你，你跟他是一伙的！",null,null],[443,"Text_Text_443","Then come on!","那你加油！",null,null],[444,"Text_Text_444","Oh, suit yourself","哦，随你的便",null,null],[445,"Text_Text_445","Talk to Good student","跟书呆子学霸对话",null,null],[446,"Text_Text_446","Hi, are you here to read, too?","你好，你也是来看书的吗？",null,null],[447,"Text_Text_447","What books do you like to read?","你喜欢看什么书？",null,null],[448,"Text_Text_448","How about your grades?","你成绩怎么样？",null,null],[449,"Text_Text_449","It's busy outside. Why don't you go out and see what they're doing?","外面很热闹，怎么不出去看看？",null,null],[450,"Text_Text_450","Recently I have been reading some books on philosophy and alchemy. Do you want to know about them?","最近在看一些哲学与炼金的书，你想了解下吗？",null,null],[451,"Text_Text_451","I mean, no. 1 GPA in school","普普通通，也就是全校绩点第一罢了",null,null],[452,"Text_Text_452","Because every certain time, our school will hold these activities","因为每到特定的时间，咱们学院就会举办这些活动",null,null],[453,"Text_Text_453","Yeah, yeah, yeah, but I've been reading Ten Mysteries from Wizarding Campus. It's a great book","好啊好啊，不过我最近在看《校园的十大神秘事件》，这本书很好看",null,null],[454,"Text_Text_454","Not very interested","不是很感兴趣",null,null],[455,"Text_Text_455","I wrote this book! Based on the true story of the night, you will encounter zombies, skeleton figures, ferocious Card monsters, and small black Bigfoot suits, and those scary demons!","这本书是我写的哦！根据夜间故事真实改编，你会在夜晚遇见丧尸，骷髅人偶，狰狞的画片怪，还有西装革履的小黑大脚怪，以及那些可怕的恶魔！",null,null],[456,"Text_Text_456","That's amazing, but can you help me study anyway?","太厉害了，不过话说回来你能帮助我学习吗？",null,null],[457,"Text_Text_457","Ok, you can also ask me if you don't understand anything in your study","好的，平时学习上如果有什么不懂的也可以来问我",null,null],[458,"Text_Text_458","Then why don't you go?","那你怎么不去参加？",null,null],[459,"Text_Text_459","Me? I had no friends, no one wanted to accompany me, and I wasn't very interested in parties and dances","我？我没有朋友，也没有谁愿意陪我，派对和舞会我也不是很感兴趣",null,null],[460,"Text_Text_460","All right, thanks. I'm gonna go find my friend","那好吧，谢谢，我先去找我的朋友了",null,null],[461,"Text_Text_461","Can I make friends with you?","那我能成为你的朋友吗？",null,null],[462,"Text_Text_462","With pleasure!! I'll take care of you","乐意至极！我会保护好你",null,null],[463,"Text_Text_463","Talk with teachers","跟教师对话",null,null],[464,"Text_Text_464","Stay focus, kid","好好上课",null,null],[465,"Text_Text_465","Of course","好的",null,null],[466,"Text_Text_466","Can I fight in the classroom?","我能在教室打架吗？",null,null],[467,"Text_Text_467","Every day to study hard, not to waste a minute, so that you can learn more powerful magic","每一天都要努力学习，不浪费每一分钟。",null,null],[468,"Text_Text_468","Your work today leaves something to be desired","你今天的成绩还有待进步",null,null],[469,"Text_Text_469","Please don't do anything unrelated to the class, or I'll kick you out!","请不要做与课堂无关的事情，不然我会把你赶出去！",null,null],[470,"Text_Text_470","Talk to the Idle student","跟空闲的学生对话",null,null],[471,"Text_Text_471","Did you hear that something mysterious will happen at school night!","听说了吗，学校晚上会有神奇事件！",null,null],[472,"Text_Text_472","Really? Well, I'm curious","真的吗？那我挺好奇的",null,null],[473,"Text_Text_473","What if I'm scared?","我害怕的话怎么办？",null,null],[474,"Text_Text_474","Don't be afraid to brave the night with your friends!","不要害怕，和朋友们一起勇闯夜晚！",null,null],[475,"Text_Text_475","Defeat everything with courage!","用勇气打败一切！",null,null],[476,"Text_Text_476","Talk to the Music student","跟玩音乐的学生对话",null,null],[477,"Text_Text_477","Sometimes there's a stage here, so I want to do it!","有时这里会搭舞台，我也好想去表演！",null,null],[478,"Text_Text_478","Wish me luck!","祝我好运！",null,null],[479,"Text_Text_479","Talk to the cheerleaders","跟啦啦队员对话",null,null],[480,"Text_Text_480","Come on, come on! There are special activities every afternoon!","加油加油！每天下午都有特色活动哦！",null,null],[481,"Text_Text_481","You can fight against magic objects to earn moon coins, go to the daytime Luna to exchange things","你可以对抗魔物赚取月亮币，去找白天的狸月换东西",null,null],[482,"Text_Text_482","You can do parkour, jump, play all over campus!","也可以去跑酷，跳高，玩遍校园！",null,null],[483,"Text_Text_483","Talk to the Cheerleaders","跟啦啦队员对话",null,null],[484,"Text_Text_484","Don't be afraid of the monsters outside, the dorm will protect you","不要害怕外面的怪物，宿舍会保护你",null,null],[485,"Text_Text_485","Come to the dormitory to let us get together, here is safe and comfortable, we do not have to be afraid! All paper monsters stand aside","来宿舍让我们相聚，这里安全又舒适，有我们在不用害怕！纸片怪统统闪开",null,null],[486,"Text_Text_486","Talk to the aunt dormitory administrator","跟宿管阿姨对话",null,null],[487,"Text_Text_487","It's the middle of the night!","大半夜的，吵什么吵！",null,null],[488,"Text_Text_488","May I leave the dormitory?","我可以离开宿舍吗？",null,null],[489,"Text_Text_489","What should I do if my roommate is not feeling well?","舍友不舒服怎么办？",null,null],[490,"Text_Text_490","Auntie, I can't sleep","阿姨我睡不着",null,null],[491,"Text_Text_491","No, go to bed, or I'll kick your ass!","不可以，快去睡觉！",null,null],[492,"Text_Text_492","I can get you back if you get out","你跑出去了我也能给你抓回来",null,null],[493,"Text_Text_493","Hold it in!","憋着，憋不住了再说！",null,null],[494,"Text_Text_494","Here's your mop! It's in your backpack! You gonna fall asleep after sweeping. Don't sleep on the floor!","给你拖把了，没找到就是在你背包里！你扫累了就睡着了，别睡地上！",null,null],[495,"Text_Text_495","Talk to the swimming coach","跟游泳教练对话",null,null],[496,"Text_Text_496","Please warm up before entering the water","下水前请注意热身",null,null],[497,"Text_Text_497","You are so handsome.","你好帅啊",null,null],[498,"Text_Text_498","Can you teach me how to swim?","你能教我游泳吗？",null,null],[499,"Text_Text_499","Why do you look like the gym teacher?","你怎么跟体育老师长得好像？",null,null],[500,"Text_Text_500","What should I do if I pull myself in swimming?","游泳拉伤了怎么办？",null,null],[501,"Text_Text_501","Thank you","谢谢",null,null],[502,"Text_Text_502","Yeah, we can talk about it when we're free","可以，等空了再说",null,null],[503,"Text_Text_503","He's my brother","他是我哥",null,null],[504,"Text_Text_504","Heal yourself with healing magic","用治疗魔法治疗自己",null,null],[505,"Text_Text_505","Talk to a magician Luna","跟魔法师狸月对话",null,null],[506,"Text_Text_506","Hello, my friend","你好，我的朋友~",null,null],[507,"Text_Text_507","Where are you from?","你从哪里来？",null,null],[508,"Text_Text_508","Can I help you?","需要帮助吗？",null,null],[509,"Text_Text_509","I'm from the depths of the galaxy. Can you do me a favor?","我从银河深处来，你可以帮我一个忙吗？",null,null],[510,"Text_Text_510","I need some gold and silver coins. As far as I know, they are scattered around the school. Can you help me find them? I will use it against dark magic","我需要一些金币和银币，据我所知,他们散落在学校各处，你能帮我找来吗？我要用它对抗黑暗",null,null],[511,"Text_Text_511","Of course","当然可以！",null,null],[512,"Text_Text_512","No, I'm busy!","不，我很忙！",null,null],[513,"Text_Text_513","Ok!","好的！",null,null],[514,"Text_Text_514","I need to make an exchange","我来兑换物品",null,null],[515,"Text_Text_515","You've been caught","你被抓住了",null,null],[516,"Text_Text_516","The magician Luna brought you back to your dormitory","魔法师狸月把你救回了宿舍",null,null],[517,"Text_Text_517","Magician Luna: Please find me some gold and silver coins, I will not mistreat you!","魔法师狸月：请帮我找些金币和银币来，我不会亏待你的！",null,null],[518,"Text_Text_518","Magician Luna: There seem to be precious gold coins hidden in some classrooms. You can go and see them!","魔法师狸月：某些教室里藏着珍贵的金币，快去看看！",null,null],[519,"Text_Text_519","Magician Luna: Whether you find gold or silver, you can come to me and exchange things!","魔法师狸月：找到金币或银币，都可以来找我兑换东西！",null,null],[520,"Text_Text_520","Don't be afraid. I'll be waiting for you here tonight","不要害怕，我晚上会在这里等你",null,null],[521,"Text_Text_521","Party Geek","派对咖",null,null],[522,"Text_Text_522","Athletic Teenager","运动少年",null,null],[523,"Text_Text_523","PE Teacher","体育老师",null,null],[524,"Text_Text_524","Hip-Hop Kid","嘻哈少年",null,null],[525,"Text_Text_525","Good student","书呆子学霸",null,null],[526,"Text_Text_526","Magic teacher","魔法教师",null,null],[527,"Text_Text_527","Idle student","空闲的学生",null,null],[528,"Text_Text_528","Music student","玩音乐的学生",null,null],[529,"Text_Text_529","Cheerleaders","啦啦队员",null,null],[530,"Text_Text_530","Cheerleaders","啦啦队员",null,null],[531,"Text_Text_531","Swimming coach","游泳教练",null,null],[532,"Text_Text_532","Aunt Dormitory administrator","宿管阿姨",null,null],[533,"Text_Text_533","The party was given by {0}","这场派对是由{0}举办的",null,null],[534,"Text_Text_534","After school","放学",null,null],[535,"Text_Text_535","Talk to God","跟上帝对话",null,null],[536,"Text_Text_536","Adventurers from far away, I never thought you'd make it here by Rainbow Road","来自远方的冒险者，没想到你能通过彩虹路来到这里，你变的更强了！",null,null],[537,"Text_Text_537","It's easy to climb up. Suggest to God you make it harder","爬上来很容易，建议上帝你加点难度，毕竟我现在有魔杖了",null,null],[538,"Text_Text_538","I'll think about it, but have you seen my angels?","我考虑考虑，你还喜欢校园生活吗",null,null],[539,"Text_Text_539","They went slacking","还不错，我很喜欢这里",null,null],[540,"Text_Text_540","I didn't see them","还可以哦，很有挑战的地方！",null,null],[541,"Text_Text_541","Oh shit, I'm gonna pull out their feathers when I find them","那就好，愿光芒与你同在！",null,null],[542,"Text_Text_542","What are you doing now","你现在做什么",null,null],[543,"Text_Text_543","It's nothing. It's just some fun after breaking up. I hope you like it tonight. I'll give you this as a reward. I don't remember if I gave it to you. Just get it and go!","没什么，我的使徒为校园带来了新的乐趣，希望你能喜欢这些挑战，变得更强！给你一个喷气背包，如果之前就拿到了它就在你的包里。",null,null],[544,"Text_Text_544","Magician Luna: Come and cash me! Out of date not wait!","魔法师狸月：快来找我兑换吧！过时不候！",null,null],[545,"Text_Text_545","Silver coin","银币",null,null],[546,"Text_Text_546","Gold coin","钞票",null,null],[547,"Text_Text_547","Exchange mall","兑换商城",null,null],[548,"Text_Text_548","Purchase","购买",null,null],[549,"Text_Text_549","Click anywhere to off","点击任意位置关闭",null,null],[550,"Text_Text_550","Converted","已兑换",null,null],[551,"Text_Text_551","Successful purchase","购买成功",null,null],[552,"Text_Text_552","Monetary deficiency","货币不足",null,null],[553,"Text_Text_553","Morning","早上",null,null],[554,"Text_Text_554","Afternoon","下午",null,null],[555,"Text_Text_555","Evening","晚上",null,null],[556,"Text_Text_556","A dangerous night of magic is coming. Be careful","危险的夜晚即将到来，要处处小心哦~",null,null],[557,"Text_Text_557","Party geek is holding a party tonight, you can go to the dormitory to join!","派对咖今晚将举办派对，晚上可以前往宿舍参加!",null,null],[558,"Text_Text_558","There's a party going on, go play!","派对正在举办，快去玩耍吧！",null,null],[559,"Text_Text_559","A new adventure on the course has begun. Go and experience it!","足球场上的新冒险已开启，快前往体验吧！",null,null],[560,"Text_Text_560","New adventures will be on the course, stay tuned!","足球场上将开启新冒险，敬请期待吧！",null,null],[561,"Text_Text_561","This is the carnival of the night, my children","这是属于夜晚的狂欢，我的孩子们",null,null],[562,"Text_Text_562","There's a new story to tell","又有新的故事可以讲述了",null,null],[563,"Text_Text_563","Be safe during play","玩耍的过程中要注意安全",null,null],[564,"Text_Text_564","Hey, I thought about it and I invited you","嘿 我想了想还是邀请了你",null,null],[565,"Text_Text_565","Enjoy a rare night out!","享受难得的夜晚时光吧！",null,null],[566,"Text_Text_566","Hum! I didn't say yes to that party guy! I came by myself","哼！我才没有答应派对咖那小子的邀请！我自己来的",null,null],[567,"Text_Text_567","It was the most beautiful party my best friend and I had ever seen","这是我和我最好的朋友所见识过的最美盛会",null,null],[568,"Text_Text_568","Come get high with us!","快和我们一起嗨起来吧！",null,null],[569,"Text_Text_569","It's nice to have a night like this","夜晚如此，甚好！",null,null],[570,"Text_Text_570","Forget the unpleasant things and enjoy yourself!","忘掉不愉快的事情，尽情享受吧！",null,null],[571,"Text_Text_571","There's good food, there's fun, don't worry about boredom","这里有好吃的，好玩的，不要担心无聊",null,null],[572,"Text_Text_572","You need to find someone else to dance the duet with","需要寻找另一个人一起才可以跳双人舞",null,null],[573,"Text_Text_573","Cancel Boot","取消引导",null,null],[574,"Text_Text_574","The magician Luna: I'm waiting for you in the dormitory pavilion!","魔法师狸月：我在宿舍的亭子里等着你！",null,null],[575,"Text_Text_575","Magic foreword","魔法预告",null,null],[576,"Text_Text_576","Magician Luna will bring you new magic! Please choose the content you are looking forward to most!","魔法师狸月将为大家带来新的魔法\n请选出你最期待的内容吧!",null,null],[577,"Text_Text_577","Tip: Only two votes per person","小提示:每人最多两票哦",null,null],[578,"Text_Text_578","I wanted to create stairs and platforms that could be built","我想要创造可以搭建的楼梯和平台~",null,null],[579,"Text_Text_579","Create lots of cute toys","创造超多超可爱的玩具~",null,null],[580,"Text_Text_580","Create poop props that can make fun of others","创造出可以恶搞别人的大便道具~",null,null],[581,"Text_Text_581","It would be nice if we could create kittens, puppys and small animals","如果能创造猫猫狗狗和小动物就好啦~",null,null],[582,"Text_Text_582","Vote","投票",null,null],[583,"Text_Text_583","Important notice","重要通知",null,null],[584,"Text_Text_584","I crossed the endless portals of time and space\nBring the magic pieces\nNew magic classrooms are being built for you\nMarch 29, 2023\nThe Luna's magic classroom will open\nPlease look forward to","我跨越了无尽的时空之门\n带来魔法碎片 \n正为你们修建新的魔法教室 \n2023年3月29日 \n狸月的魔法教室将会开启 \n敬请期待",null,null],[585,"Text_Text_585","It's from the Night Shop\nMagician Luna","来自夜晚商店的\n魔法师狸月",null,null],[586,"Text_Text_586","Good！","好的",null,null],[587,"Text_Text_587","Reset","还原服装",null,null],[588,"Text_Text_588","Profile","名片",null,null],[589,"Text_Text_589","Action","动作",null,null],[590,"Text_Text_590","Bag","背包",null,null],[591,"Text_Text_591","Return","返回校园",null,null],[592,"Text_Text_592","Back","卡住点我",null,null],[593,"Text_Text_593","Camera","相机",null,null],[594,"Newguide_1","Slide to control direction","移动控制方向",null,null],[595,"Newguide_2","Slide to control view","滑动控制视角",null,null],[596,"Text_Text_596","Tap screen to continue","点击屏幕继续",null,null],[597,"Text_Text_597","Tap to equip Creation Wand","点击装备造物魔杖",null,null],[598,"Text_Text_598","Tap on Creation Skills to open the Creation list","点击造物技能，打开造物列表",null,null],[599,"Text_Text_599","Tap the corresponding item to create","点击对应物品进行造物",null,null],[600,"Text_Text_600","Tap on the resulting creation","点击生成的造物",null,null],[601,"Text_Text_601","Tap the Use button","点击使用按钮",null,null],[602,"Text_Text_602","Tap to equip Flight Wand","点击装备飞行魔杖",null,null],[603,"Text_Text_603","Tap Flight Skills to enter flight state","点击飞行技能，进入飞行状态",null,null],[604,"Text_Text_604","Luna","狸月",null,null],[605,"Text_Text_605","Flying magic class","飞行魔法课",null,null],[606,"Text_Text_606","Creation Class","造物魔法课",null,null],[607,"Text_Text_607","Creation Class","造物魔法课",null,null],[608,"Text_Text_608","Follow the tips and use the wand to create the correct object","根据提示，用魔杖造出正确的物品",null,null],[609,"Text_Text_609","Flying magic class","飞行魔法课",null,null],[610,"Text_Text_610","Use your wand to mount the broomstick and cross the light circles as many as possible","使用魔杖骑上扫把，穿过光圈，越多越好",null,null],[611,"textSecond","Jumping force per second +{0}","每秒跳跃力+{0}",null,null],[612,"textMax","Jumping force :{0}","跳跃力:{0}",null,null],[613,"jump01","The trials of Luna","狸月的试炼",null,null],[614,"jump02","No flying in this area!","在此区域不可飞行哦！",null,null],[615,"jump03","Let's practice who can jump higher!","一起来练习谁能跳得更高吧！",null,null],[616,"jump04","That's great! Reached {0} m!","太棒啦！到达{0}米！",null,null],[617,"jumpno","The trials of the Luna open\nAt free periods!","狸月的试炼自由活动时开启！",null,null],[618,"jumptip","The trials of the Luna has been opened next to the football field. Go and experience it!","足球场旁已开启狸月的试炼，快去体验吧",null,null],[619,"Text_Text_619","I came to exchange for treasure","我来兑换宝物",null,null],[620,"Text_Text_620","It took me a lot of power to appear in daylight. Do you need my help?","我消耗了大量的法力得以在白天出现，你需要我的帮助吗？",null,null],[621,"Text_Text_621","I came to exchange the treasure","我来兑换宝物",null,null],[622,"Text_Text_622","The battle priest used magic to free you","战斗牧师用魔法将你解救下来",null,null],[623,"Text_Text_623","Talk to the battle priest","与战斗牧师对话",null,null],[624,"Text_Text_624","Hello, I am the battle priest invited by Luna to help you fight against the darkness","你好，我是狸月邀请而来的战斗牧师，协助你一同抵抗黑暗",null,null],[625,"Text_Text_625","It's time to teach you the secrets of magic, so you can fight monsters. Take your wand","是时候传授给你们魔法的奥义了，学会了就可以对抗怪物，拿好你的法杖",null,null],[626,"Text_Text_626","Now, you can go and practice your magic. You can quickly reach the area at the back of the school through the portal in the classroom. There I have magically bound several monsters for you to defeat!","现在，你可以去练习下魔法，通过教室内的传送门可以快速到达学校后方的区域，我在那里用魔法拘束了几只怪物等你击败！",null,null],[627,"Text_Text_627","What kind of magic do you have","那你会什么魔法",null,null],[628,"Text_Text_628","Ok, see you in class!","好的，上课时候再见！",null,null],[629,"Text_Text_629","The world is a big place, and all things flourish. I can do a lot of magic, depending on what you want to learn","大千世界，万物繁生，我会的魔法很多，就看你想学什么",null,null],[630,"Text_Text_630","See you later, young man. Keep an eye on the portal!","待会见，年轻人，留意传送门！",null,null],[631,"Text_Text_631","Come to me during class, and I will open a portal here, where there are bound monsters to defeat!","上课的时候来找我，我会在这里开启一个传送门，那里有被拘束的怪物等你击败！",null,null],[632,"Text_Text_632","Tap the Skills button to try it out!","已经习得魔法，快点击技能按钮试试吧！",null,null],[633,"Text_Text_633","Night monsters can also be attacked by magic oh, let's try the battle magic first","夜晚的怪物也可以被魔法攻击哦，先来试试战斗魔法吧",null,null],[634,"Text_Text_634","The course has ended.","课程已结束",null,null],[635,"Text_Text_635","Moon coin","月亮币",null,null],[636,"Text_Text_636","Lucky star","幸运星",null,null],[637,"Star_1","Lucky Star!","发现幸运星！",null,null],[638,"Star_2","When you have collected enough stars","当你收集了足够的星星",null,null],[639,"Star_3","<color=#yellow>{0} stars have been collected</color>","<color=#yellow>已经收集了{0}颗星星</color>",null,null],[640,"Star_4","exchange<color=#yellow> {0} </color> to Luna","就可以找狸月兑换<color=#yellow> {0} </color>哦",null,null],[641,"Star_5","Find <color=#yellow> Luna </color>Exchange for gifts","去找<color=#yellow> 狸月 </color>兑换礼物吧！",null,null],[642,"Star_6","Currently got<color=#yellow> {0} </color>star, still to be collected <color=#yellow> {1} </color> star","当前拥有<color=#yellow> {0} </color>颗星星，还需收集<color=#yellow> {1} </color>颗星星",null,null],[643,"Star_7","{0}","{0}",null,null],[644,"Star_8","Go claim","去兑换",null,null],[645,"Star_9","Receive","领取",null,null],[646,"Text_Shop1","Ordinary","普通",null,null],[647,"Text_Shop2","Rare","稀有",null,null],[648,"Text_Shop3","Epic","史诗",null,null],[649,"Text_Shop4","Sacred","神圣",null,null],[650,"Text_Shop5","You can only buy one!","只能买一个噢！",null,null],[651,"Text_Text_637","Let's have a look at the store!","跟狸月对话看看商店吧！",null,null],[652,"Text_Text_638","Tap here to open the store page!","点击这里打开商店页面！",null,null],[653,"Text_Text_639","Tap to receive your first Freshman gift pack!","点击领取你的第一个新生大礼包吧！",null,null],[654,"Text_Text_640","Let's equip the Star Force first!","让我们先装备上“星之力”！",null,null],[655,"Text_Text_641","Tap to use, experience the feeling of flying!","点击使用，体验飞翔的感觉吧！",null,null],[656,"Text_Text_642","Talk with Lyon Meow","与狸正喵沟通",null,null],[657,"Text_Text_643","Hello, classmate! You are also the Luna's sidekick ah?","你好啊同学喵，你也是狸月的跟班嚯呀？",null,null],[658,"Text_Text_644","What a lovely cat","好可爱的猫猫啊",null,null],[659,"Text_Text_645","This cat can talk!!","这只猫居然会说话！！",null,null],[660,"Text_Text_646","What do you mean by sidekick?","你说的跟班是什么意思？",null,null],[661,"Text_Text_647","You know i am so adorable too. Hey, why don't you come and play with me some more? Meow!","是吧，本大人也觉得自己很可爱喵，欸嘿以后常来陪我玩吧！",null,null],[662,"Text_Text_648","Meow? ! I am cool magic cat, of course, i can speak human language. Study hard to become stronger!","喵？！我是酷酷的魔法猫，当然会说人话喵，好好学习变得更强吧！",null,null],[663,"Text_Text_649","This is not important. I'm cooking up a new plan, please don't tell Luna! I'm going to surprise her and bring back something great for everyone!","这个不重要，我在酝酿如何拯救被鲨鱼污染的小鱼干，不要告诉狸月！我要给她一个惊喜，给大家带回小鱼干喵！",null,null],[664,"Text_Text_650","Then I'll bring you snacks sometime!","那我以后有机会给你带小零食！",null,null],[665,"Text_Text_651","Then you'll teach me more powerful magic!","那以后你要教我更强大魔法哦！",null,null],[666,"Text_Text_652","Ok, here's our secret!","好的，这是我们的秘密！",null,null],[667,"Text_Text_653","It's a deal! Go play with my friends, they're waiting for you at the Luna Store! Meow!","一言为定！哼唧，快去和我的朋友们玩吧，他们在狸月商店等你喵！",null,null],[668,"Text_Text_654","The cat rubs against you proudly, it looks like it already likes you","狸正喵傲娇地蹭了蹭你，看样子它已经喜欢上你了呢",null,null],[669,"Text_Text_655","I heard someone was going after the Luna? I was the first to say no, hum!","听说有人要找狸月的麻烦？我狸正第一个就不答应，哼！",null,null],[670,"Text_Kill","Player-{0}-killed monster-{1}","勇敢的-{0}-击杀了强大的怪物-{1} ！",null,null],[671,"Text_Dead","Defeated by -{0}- the Warrior!","被-{0}-勇士战胜了！",null,null],[672,"Text_Title","{0}-Hunter","{0}猎人",null,null],[673,"Text_InFight","Enter battle","进入战斗",null,null],[674,"Text_80HP","Ha ha ha ha, small little wizard also want to beat me!","哈哈哈哈，小小魔法师也想战胜我吗！",null,null],[675,"Text_50HP","No pain, no itch! Your power is too weak!","不痛不痒！你的力量太弱小了！",null,null],[676,"Text_20HP","Damn it! You get under my skin! I'm pissed off!","可恶，你成功激怒我了！我生气了！",null,null],[677,"Text_DeadF","Ah... I can't believe I lost... I'll be back again!","啊...我竟然输了...我还会再回来的！",null,null],[678,"Gift_Title","Package contents","礼包内容",null,null],[679,"Gift_TitleAll","Package Contents (All rewards claimed)","礼包内容（已领取所有奖励）",null,null],[680,"Text_Text_656","The shark is on his way to invade the school","鲨鱼正在入侵学校的路上",null,null],[681,"Text_Text_657","Ah! Damn, I can't hold on! (Spits out a mouthful of blood)","啊~可恶，要坚持不住了！(吐出一口血)",null,null],[682,"Text_Text_658","The shark is going to be defeated! Come on!!","鲨鱼快被击败了！加油！！",null,null],[683,"Text_Text_659","There are not enough tickets! Please take flying lessons","票卷数量不够哦！请上飞行课获取",null,null],[684,"Text_Text_660","Sharkbuck: Despicable Luna, my master sends his regards to you!","魔鲨:卑鄙的狸月，我的主人向你问好！",null,null],[685,"Text_Text_661","Luna: You demon! No matter how many times, your plot is doomed to failure!","狸月:恶鲨!无论多少次，你的阴谋注定失败！",null,null],[686,"Text_Text_662","Luna: Sorry, I can only use the light circle to help you attack during the day!","狸月:抱歉,狸月在白天只能用光圈来帮你进攻！",null,null],[687,"Text_Text_663","Luna: My help is here! Don't waste every light circle!","狸月:狸月的支援到啦！不要浪费每一个光圈！",null,null],[688,"Text_Text_664","Sharkbuck: You can't stop me!","魔鲨:你们是阻挡不了我的！",null,null],[689,"Text_Text_665","Luna: Sharks have rebound magic. Be careful!","狸月:鲨鱼有反弹魔法，一定要小心啊！",null,null],[690,"Text_Text_666","The shark is close again! Help! Hold the dorms!","鲨鱼又靠近了，救命！守住宿舍！",null,null],[691,"Text_Text_667","Magic Warrior","魔法勇士",null,null],[692,"Text_Text_668","Creation:","造物:",null,null],[693,"Text_Text_669","Creation Class","造物魔法课",null,null],[694,"Text_Text_670","Correct +","正确+",null,null],[695,"Text_Text_671","The Creation wand is in your backpack, you can also use the wand to create objects at the end of the course!","造物魔杖在背包里喔，课程结束也可以使用魔杖造出物品！",null,null],[696,"Text_Text_672","Congratulations on your completion of the Creation Course","恭喜你完成了造物课程的训练",null,null],[697,"Text_Text_673","Congratulations on completing the flying course, and continue to circle for more points","恭喜你完成了飞行课程的训练，继续钻圈获取更多的分数吧",null,null],[698,"Text_Text_674","A new magic course has begun!","全新魔法课程开始啦！",null,null],[699,"Text_Text_675","You need to find someone else to dance the duet with","需要寻找另一个人一起才可以跳双人舞",null,null],[700,"Text_Text_676","Flying wands are in your backpack. You can also use wands at the end of the course!","飞行魔杖在背包里喔，课程结束也可以使用魔杖！",null,null],[701,"Text_Text_677","Flying magic lesson","飞行魔法课",null,null],[702,"Prop_01","Divination card","狸月牌",null,null],[703,"Prop_02","Awaiting acception...","等待接受中...",null,null],[704,"Prop_03","Choose a nearby classmate for divination","选择附近的一名同学进行占卜",null,null],[705,"Prop_04","The Fool","愚人牌",null,null],[706,"Prop_05","The Magician","魔法师",null,null],[707,"Prop_06","The High Priestess","女祭司",null,null],[708,"Prop_07","The Empress","女皇",null,null],[709,"Prop_08","The Emperor","皇帝",null,null],[710,"Prop_09","The Hierophant","祭司",null,null],[711,"Prop_10","The Lovers","恋人",null,null],[712,"Prop_11","The Chariot","战车",null,null],[713,"Prop_12","Strength","力量",null,null],[714,"Prop_13","The Hermit","隐士",null,null],[715,"Prop_14","Wheel of Fortune","轮回",null,null],[716,"Prop_15","Justice","正义",null,null],[717,"Prop_16","The Hanged Man","倒吊人",null,null],[718,"Prop_17","Death","死神",null,null],[719,"Prop_18","Temperance","节制",null,null],[720,"Prop_19","The Devil","恶魔",null,null],[721,"Prop_20","The Tower","塔",null,null],[722,"Prop_21","The Star","星星",null,null],[723,"Prop_22","The Moon","月亮",null,null],[724,"Prop_23","The Sun","太阳",null,null],[725,"Prop_24","Judgement","审判",null,null],[726,"Prop_25","The World","世界",null,null],[727,"Prop_26","Time","时间",null,null],[728,"Prop_27","Steamer","轮船",null,null],[729,"Prop_28","Wand","权杖",null,null],[730,"Prop_29","Cups","圣杯",null,null],[731,"Prop_30","Swords","宝剑",null,null],[732,"Prop_31","Rose","玫瑰",null,null],[733,"Prop_32","The Clown","弄臣",null,null],[734,"Prop_33","The Princess","公主",null,null],[735,"Prop_34","The Witch","女巫",null,null],[736,"Prop_35","To enlighten the dawn of confusion","开导迷惘的曙光",null,null],[737,"Prop_36","A cunning mystery traveler","狡诈的谜途旅人",null,null],[738,"Prop_37","The mind and the master","精神力与掌控者",null,null],[739,"Prop_38","A proud and dictatorial noblewoman","骄纵独裁的贵妇人",null,null],[740,"Prop_39","The center of power in the whirlpool","漩涡之中的权力中心",null,null],[741,"Prop_40","False and timely aid","虚妄适时的援助",null,null],[742,"Prop_41","Pride and jealousy","高傲与妒忌",null,null],[743,"Prop_42","The dualism of power","力量的两元论",null,null],[744,"Prop_43","A potential source of accumulation and growth","厚积薄发的潜在之源",null,null],[745,"Prop_44","Introspection hidden in troubled times","隐匿于乱世的自省",null,null],[746,"Prop_45","The turn away from the phantom","脱离于幻像的转折",null,null],[747,"Prop_46","Individualism with a voice","勇于发声的个人主义",null,null],[748,"Prop_47","Reflection, freedom and inwardness","反思，自由与内在",null,null],[749,"Prop_48","The darkness before the dawn","黎明曙光之前的黑暗",null,null],[750,"Prop_49","The road of light which is dim in endurance","隐忍中缥缈的光明大道",null,null],[751,"Prop_50","Addiction and hysteria","沉溺与癔症",null,null],[752,"Prop_51","An unwarranted disaster from on high","居高临下的无妄之灾",null,null],[753,"Prop_52","Clear the bright light of hope","清透光明的期望之光",null,null],[754,"Prop_53","The answer lies deep in chaos","答案深藏在混沌之中",null,null],[755,"Prop_54","A pure, immaculate mirror lake","纯净无暇的镜像湖面",null,null],[756,"Prop_55","Rebirth and past life introspection","再生与前世的自省",null,null],[757,"Prop_56","The endless circle of seasons","无尽圆满的四季循环",null,null],[758,"Prop_57","The eternal power of faith","永恒的信念之力",null,null],[759,"Prop_58","Missing is lonely","想念是孤独的",null,null],[760,"Prop_59","Symbol of victory","胜利的象征",null,null],[761,"Prop_60","There may be universe in the cup","杯中或有宇宙",null,null],[762,"Prop_61","Hold the sword of righteousness","执仗义之剑",null,null],[763,"Prop_62","Giving is a gift","赠人有余香",null,null],[764,"Prop_63","Tease life","戏弄人生",null,null],[765,"Prop_64","A man of shining dignity","闪亮而尊贵之人",null,null],[766,"Prop_65","Magic is charm","魔法是魅力",null,null],[767,"Prop_66","Today you are a little impulsive. Act on your intuition, keep your heart pure believe in your dreams, everything will be solved","今日的你有些冲动，根据自己的直觉做事，保持自己相信梦想的纯真之心，一切便可迎刃而解",null,null],[768,"Prop_67","Creativity taps into your potential, and if used improperly, can have dire consequences!","创造力激发了你的潜在能力，使用不正当的话，可能招来可怕的后果！",null,null],[769,"Prop_68","You are intelligent and resourceful, your underlying emotions make you see the darkness, and your reason leads you to the light","聪敏机智，潜在的情感使你明辨黑暗，理性指引你走向光明",null,null],[770,"Prop_69","You're in for a fortune. You're in luck!","你将会收获一笔不小的财富，你要走运了！",null,null],[771,"Prop_70","Beware of the gossip of those around you. While you gaze into the abyss, the abyss is also gazing at you","谨防身边人的闲话，凝望着深渊的同时深渊也在凝望着你",null,null],[772,"Prop_71","A deep compassion induces a conscience in your heart to help your friends as much as you can","深沉的慈悲心诱发心底的良知，尽多帮助你的朋友",null,null],[773,"Prop_72","Love in confusion breeds both darkness and light, and you wallow in caution","迷惘中的爱恋滋生出黑暗与光明两面，在谨慎之中沉溺",null,null],[774,"Prop_73","The balance of your mind will guide you forward, and exercise will help","精神力的平衡指引着你前进，运动对你会有一定帮助",null,null],[775,"Prop_74","A true warrior dares to face the darkness within and overcome the difficulties to move forward","真正的勇士敢于直面内心的黑暗，克服困难便可向前迈进",null,null],[776,"Prop_75","The wise man looks inward for strength; it is better to be alone and seek to face his inner self","智者向内寻求力量，独处，追寻面对内在的自己",null,null],[777,"Prop_76","There's always a cause, and good luck is coming","风水轮流转，求果必有因，好运马上要降临了",null,null],[778,"Prop_77","A wide mind gives you peace of mind, and good news comes from balancing yourself","宽阔的心胸使得你得到内心的平静，平衡自我便可收获好讯",null,null],[779,"Prop_78","Contrarian thinking spurs the soul to look at things from a different Angle","逆向思考鞭策灵魂，换一个角度看问题",null,null],[780,"Prop_79","A new journey is about to begin. Focus on the future, not the present","新的旅程即将开始，着眼于未来不要拘泥于眼下",null,null],[781,"Prop_80","Nothing can be gained more than one can control","凡事不可多得，量力而行，控制得益会有意外收获",null,null],[782,"Prop_81","Look beyond appearances and you will need to watch your emotions and think before you act today","抛开表象看本质，今日的你要注意情绪的控制，凡事三思而后行",null,null],[783,"Prop_82","The extreme will reverse, the extreme will decline, be careful and cautious","物极必反，盛极而衰，细心谨慎，随机应变",null,null],[784,"Prop_83","New ideas collide with you, and hopes and promises guide you","新的思想与你碰撞，希望与诺言指引着你前行",null,null],[785,"Prop_84","The fluctuations beneath the surface of a calm lake, trust your sixth sense","平静湖面下的波动，相信自己的第六感",null,null],[786,"Prop_85","Vitality and creativity will help you find the path to truth","生命力和创造力将会辅助你寻找到通往真理的大道",null,null],[787,"Prop_86","Always open to new things, be optimistic, generous, positive","时刻接受新的事物，乐观，大方，积极向上",null,null],[788,"Prop_87","The harmony of the self radiates outward energy, and interaction with others can yield unexpected results","自我的调和向外散发能量，与人互动便可有意料外的收获",null,null],[789,"Prop_88","Time will give you answers, and good luck will always be with you","时间会带你找到答案，好运将常伴于你",null,null],[790,"Prop_89","Travel may be the cure","旅行兴许是治愈你的良方",null,null],[791,"Prop_90","Not all things can be desired, but all things are worth a try","不是所有的事情都可以如愿以偿，但所有的事情都值得一试",null,null],[792,"Prop_91","What happened recently will affect the future, and you need to be careful about your choices","最近发生的事将会影响到未来，面对选择，需慎重",null,null],[793,"Prop_92","You will make good friends in the near future, and if you get along well, you will be with them for life","近期你将收获好朋友，如果好好相处，将会相伴一生",null,null],[794,"Prop_93","But help others more, you will also reap happiness","可多帮助他人，你也会收获快乐",null,null],[795,"Prop_94","There are no signs of happiness, but keep your heart in the right place.","快乐无迹可循 但要保持初心",null,null],[796,"Prop_95","At the touch of love everyone becomes a poet, and so are you","每一个沐浴在爱河中的人都是诗人，你也是",null,null],[797,"Prop_96","Love is a kind of encounter, can not wait and can not prepare","爱是一种遇见，不能等待也不能准备",null,null],[798,"Prop_97","Grey","灰色",null,null],[799,"Prop_98","Purple","紫色",null,null],[800,"Prop_99","Rose red","玫红",null,null],[801,"Prop_100","Orange-red","橘红",null,null],[802,"Prop_101","Golden","金色",null,null],[803,"Prop_102","Dark brown","深棕",null,null],[804,"Prop_103","Pink","粉色",null,null],[805,"Prop_104","Light brown","浅咖",null,null],[806,"Prop_105","Orange","橘黄",null,null],[807,"Prop_106","White","白",null,null],[808,"Prop_107","Orange","橙",null,null],[809,"Prop_108","Agate red","玛瑙红",null,null],[810,"Prop_109","Black","黑",null,null],[811,"Prop_110","Yellow","黄",null,null],[812,"Prop_111","Cyan","青",null,null],[813,"Prop_112","Coal black","煤黑",null,null],[814,"Prop_113","Green","绿",null,null],[815,"Prop_114","Lemon yellow","柠檬黄",null,null],[816,"Prop_115","Blue","蓝",null,null],[817,"Prop_116","Light brown","米陀",null,null],[818,"Prop_117","Grey-green","灰绿",null,null],[819,"Prop_118","Cobalt blue","钴蓝",null,null],[820,"Prop_119","Ivory white","象牙白",null,null],[821,"Prop_120","Vine Purple","紫藤",null,null],[822,"Prop_121","Chrome green","铬绿",null,null],[823,"Prop_122","Lake blue","湖蓝",null,null],[824,"Prop_123","Chrome yellow","铬黄",null,null],[825,"Prop_124","Rose purple","玫瑰紫",null,null],[826,"Prop_125","Grape purple","葡萄紫",null,null],[827,"Prop_126","Peach red","桃红",null,null],[828,"Prop_127","Rose red","玫红",null,null],[829,"Prop_128","Your horoscope today","今日运势",null,null],[830,"Prop_129","Lucky color:","幸运色：",null,null],[831,"Prop_130","Good","好的",null,null],[832,"Prop_131","Please choose one according to your intuition.","请根据你的直觉选择一张吧！",null,null],[833,"Prop_132","Ask for your divination","申请为你占卜",null,null],[834,"Prop_133","Accept","接受",null,null],[835,"Prop_134","Refuse","拒绝",null,null],[836,"Prop_135","Divination for yourself","为自己占卜",null,null],[837,"Prop_136","Divination for others","为别人占卜",null,null],[838,"Prop_137","Divination for him/her","为TA占卜",null,null],[839,"Prop_138","He/She cancels the divination, please divination for others!","对方取消占卜，请为其他人占卜吧！",null,null],[840,"Prop_139","They cancel the divination. Please exit.","对方取消占卜，快关闭！",null,null],[841,"GiftName_1","Freshman Gift Pack","新生礼包",null,null],[842,"GiftName_2","Magic Apprentice Gift Pack","魔法学徒礼包",null,null],[843,"GiftName_3","Elite Apprentice Gift Pack","精英学徒礼包",null,null],[844,"GiftName_4","Legendary Apprentice Gift Pack","传奇学徒礼包",null,null],[845,"Star_10","Accept","收下",null,null],[846,"Star_11","New","新",null,null],[847,"Star_12","Received","已领取",null,null],[848,"Star_13","Collected","已收集",null,null],[849,"Monster_Name_1","Blue troll","蓝巨魔",null,null],[850,"Monster_Name_2","Skeleton man","骷髅人",null,null],[851,"Monster_Name_3","Black witch doctor","黑巫医",null,null],[852,"Monster_Name_4","Oddly Smiling Bear","怪笑小熊",null,null],[853,"Monster_Name_5","The Great Dark","大黑鬼",null,null],[854,"Monster_Name_6","Mathematical monster","数学怪魔",null,null],[855,"Monster_Name_7","Computer monster","喂饭怪魔",null,null],[856,"Monster_Name_8","Dancing monster","舞蹈怪魔",null,null],[857,"Monster_Name_9","Art monster","美术怪魔",null,null],[858,"Monster_Name_10","Grammar monster","语言怪魔",null,null],[859,"Cancel","Cancel","取消",null,null],[860,"Dorm_Text_01","The home of {0}","{0}的家",null,null],[861,"Dorm_Text_02","The home of {0} and {1}","{0}和{1}的家",null,null],[862,"Dorm_Text_03","Luna is rebuilding the dorms... Countdown :{0} minutes {1} seconds","狸月正在重建宿舍中... 倒计时:{0}分{1}秒",null,null],[863,"Dorm_Text_04","Claim dormitory","认领宿舍",null,null],[864,"Dorm_Text_05","You already have a room","您已经有房间了",null,null],[865,"Dorm_Text_06","Rent a house","租房",null,null],[866,"Dorm_Text_07","House sharing","合租",null,null],[867,"Dorm_Text_08","Cancellation","注销",null,null],[868,"Dorm_Text_09","Exit from shared accommodation","退出合租",null,null],[869,"Dorm_Text_10","You already have a room","您已经有房间了",null,null],[870,"Dorm_Text_11","The room is full at present","当前房间已满员",null,null],[871,"Dorm_Text_12","Click claim","点击认领",null,null],[872,"Dorm_Text_13","Room style","房间样式",null,null],[873,"Dorm_Text_14","Pure art","纯洁艺术",null,null],[874,"Dorm_Text_15","Sweetheart House","甜心满屋",null,null],[875,"Dorm_Text_16","Hot rhythm","火热节奏",null,null],[876,"Dorm_Text_17","Stars in the sky","夜空繁星",null,null],[877,"Dorm_Text_18","Panda hut","熊猫小屋",null,null],[878,"Dorm_Text_19","The Wizard of Oz","绿野仙踪",null,null],[879,"Dorm_Text_20","Radish rabbit","萝卜兔",null,null],[880,"Dorm_Text_21","Sea salt soda","海盐汽水",null,null],[881,"Dorm_Text_22","Christmas Story","圣诞物语",null,null],[882,"Dorm_Text_23","Sure to spend {0} gold to unlock style {1}?","确定花费{0}金币解锁样式{1}吗?",null,null],[883,"Dorm_Text_24","You do not have enough gold to unlock the room","您的金币不足,无法解锁该房间",null,null],[884,"Dorm_Text_25","Are you sure you want to cancel the {0} room, you can't cancel it again within 2 minutes after you canceled it","确认要注销{0}房间吗,注销后2分钟内不能再次注销\"",null,null],[885,"Dorm_Text_26","{0} Remaining time {1} minutes {2} seconds","{0}剩余时间{1}分{2}秒",null,null],[886,"Dorm_Text_27","Transfer","传送",null,null],[887,"Dorm_Text_28","All the rooms are occupied","全部房间都被住满",null,null],[888,"Dorm_Error_01","The room has been claimed","该房间已被认领",null,null],[889,"Dorm_Error_02","The room is full","房间已满人",null,null],[890,"Dorm_Error_03","Some players are applying for shared accommodation. Please hold on","有玩家正在申请合租,请稍后",null,null],[891,"Dorm_Error_04","The room has been canceled","该房间已经被注销",null,null],[892,"Dorm_Error_05","The homeowner has left the game","房主已经离开游戏",null,null],[893,"Dorm_Error_06","Renunciation","退租",null,null],[894,"Dorm_Request_01","Waiting for {0} to respond to your request","正在等待{0}响应你的请求",null,null],[895,"Dorm_Request_02","Player {0} requests to join your dorm","玩家{0}申请加入你的宿舍",null,null],[896,"Dorm_Request_03","You have obtained the key for {0}","您已经获取{0}的钥匙",null,null],[897,"Dorm_Request_04","{0} Denied your occupancy request","{0}拒绝了你的入住请求",null,null],[898,"Pet_Name_01","Biggie Big orange","胖胖大橘",null,null],[899,"Pet_Name_02","Sweetheart pink","甜心小粉",null,null],[900,"Pet_Name_03","Cool little black","酷酷小黑",null,null],[901,"Pet_Talk_01","Big Orange is really bad at running, meow","大橘真的不擅长跑步喵",null,null],[902,"Pet_Talk_02","So tired, so tired, so tired meow!","好累~好累~好累喵！",null,null],[903,"Pet_Talk_03","Can you feed me some fish?","主人可以喂我吃鱼干吗",null,null],[904,"Pet_Talk_04","I'm so full and I don't want to move","吃的好饱啊不想动了",null,null],[905,"Pet_Talk_05","Fish, fish, fish","鱼啊鱼啊鱼~",null,null],[906,"Pet_Talk_06","I'll start losing weight when I'm full","等我吃饱了就开始减肥喵~",null,null],[907,"Pet_Talk_07","Is the master going to take Pinky on a date?","主人要带小粉去约会吗？",null,null],[908,"Pet_Talk_08","The way you run is also fascinating","主人跑起来的样子也让人着迷喵~",null,null],[909,"Pet_Talk_09","Can you like little Pinky only?","主人可以只喜欢小粉吗？",null,null],[910,"Pet_Talk_10","You just looked at another cat!","你刚才又看别的猫咪了！",null,null],[911,"Pet_Talk_11","I am so happy with my master","和主人在一起真幸福喵~",null,null],[912,"Pet_Talk_12","Pinky always likes my master","小粉永远喜欢主人喵~",null,null],[913,"Pet_Talk_13","Don't leave me! Human!","不许丢下我！人类！",null,null],[914,"Pet_Talk_14","If I catch up with you, you're dead. Meow!","被我追上你就死定了喵！",null,null],[915,"Pet_Talk_15","I'm not your pet, meow!","我可不是你的宠物喵！",null,null],[916,"Pet_Talk_16","Why don't you touch me?!Hum!","怎么还不过来摸我！哼！",null,null],[917,"Pet_Talk_17","Someday you will submit to me","总有天一天你会臣服于我于本喵！",null,null],[918,"Pet_Talk_18","How could I ever have a crush on you?!Hum!","本喵怎么可能会喜欢上你！哼！",null,null],[919,"Text_Text_678","Fight off a shark","击退鲨鱼",null,null],[920,"Text_Text_679","The dormitory was destroyed","宿舍被摧毁",null,null],[921,"Star_14","Lack of stars","星星不足",null,null],[922,"Text_Text_680","Congratulations on getting","恭喜获得",null,null],[923,"11101","Battle wand","战斗魔杖",null,null],[924,"12102","Flying wand","飞天魔杖",null,null],[925,"13101","Creation wand","造物魔杖",null,null],[926,"14101","Snowball","雪球魔杖",null,null],[927,"50001","Rolling wheels","车轮滚滚",null,null],[928,"50002","Magic step","魔法台阶",null,null],[929,"50003","Time bomb","定时炸弹",null,null],[930,"50004","Send heart","送心",null,null],[931,"50005","Headgear","扮鬼头套",null,null],[932,"50006","Fireworks","浪漫烟花",null,null],[933,"301","Paraglider","滑翔伞",null,null],[934,"302","Skateboard","滑板",null,null],[935,"60001","Battle Pass","鲨鱼令",null,null],[936,"70001","Gold Luna card","金色狸月牌",null,null],[937,"70002","Silver Luna card","银色狸月牌",null,null],[938,"70003","Star power","星之力",null,null],[939,"70004","Orange Cat","胖胖大橘",null,null],[940,"70005","Sweet heart pink","甜心小粉",null,null],[941,"70006","Cool Black","酷酷小黑",null,null],[942,"90001","Silver coin","银币",null,null],[943,"90002","Gold coin","金币",null,null],[944,"90003","Moon coin","月亮币",null,null],[945,"90004","Star coin","星星币",null,null],[946,"Text_Text_681","Exit the course","退出课程",null,null],[947,"Action_01","Clap","鼓掌",null,null],[948,"Action_02","Bow","鞠躬",null,null],[949,"Action_03","Say hello","打招呼",null,null],[950,"Action_04","Give a like","点赞",null,null],[951,"Action_05","Blow a kiss","飞吻",null,null],[952,"Action_06","Sulk","愠怒",null,null],[953,"Action_07","Finger heart","比心",null,null],[954,"Action_08","Shake head","摇头",null,null],[955,"Action_09","Sad","难过",null,null],[956,"Action_10","Sit cross-legged","盘腿坐",null,null],[957,"Action_11","Lie down","躺下",null,null],[958,"Action_12","Somersault","翻跟头",null,null],[959,"Action_13","Seal","结印",null,null],[960,"Action_14","Lean back","向后仰",null,null],[961,"Action_15","Shake the waist","抖腰",null,null],[962,"Action_16","Lift up","举高",null,null],[963,"Action_17","Carry on shoulder","抗肩",null,null],[964,"Action_18","Towing","拖行",null,null],[965,"Action_19","Hug","怀抱",null,null],[966,"Action_20","Princess hug","公主抱",null,null],[967,"Action_21","Shoulder hug","肩抱",null,null],[968,"Action_22","Nostalgic slow dance","怀旧慢舞",null,null],[969,"Action_23","Enthusiasm beat","热情节拍",null,null],[970,"Action_24","Dance with passion","激情热舞",null,null],[971,"Action_25","Tenderness","柔情似水",null,null],[972,"Action_26","Enchanting","爱如潮水",null,null],[973,"Action_27","Nobady","Nobady",null,null],[974,"Action_28","Boxing show","拳戏",null,null],[975,"Text_Text_682","Items","物品",null,null],[976,"Text_Text_683","Wands","魔杖",null,null],[977,"Text_Text_684","Consumables","消耗品",null,null],[978,"Text_Text_685","Sacreds","圣物",null,null],[979,"Dorm_Text_29","Dorm","宿舍",null,null],[980,"Dorm_Text_30","Claim","点我认领房间",null,null],[981,"Dorm_Text_31","My room","我的房间",null,null],[982,"Dorm_Text_32","Refuse","拒绝",null,null],[983,"Dorm_Text_33","Agree","同意",null,null],[984,"Dorm_Text_34","New dormitory, Shocking opening!","全新宿舍，震撼开启！",null,null],[985,"Text_Text_686","Name card","名片",null,null],[986,"Text_Text_687","Graphic quality","画质",null,null],[987,"Text_Text_688","Volume","音量",null,null],[988,"Text_Text_689","Enter your identity in the box above","在上方框内输入你的身份",null,null],[989,"Text_Text_690","Swipe the scroll bar to adjust the graphic quality","划动滚动条调整画质",null,null],[990,"Text_Text_691","Reset","重置",null,null],[991,"Text_Text_692","Confirm","确认",null,null],[992,"Text_Text_693","Music","音乐",null,null],[993,"Text_Text_694","Sound effect","音效",null,null],[994,"Text_Text_695","Shark Event","魔鲨入侵",null,null],[995,"Text_Text_696","Reward for participating in the Magic Shark invasion","参与魔鲨入侵获得的奖励",null,null],[996,"Text_Text_697","Treasures can be exchanged at Luna's","可在狸月处兑换宝物",null,null],[997,"Text_Text_698","Go to","前往",null,null],[998,"Text_Text_699","Magic lessons have begun","魔法课程已开启",null,null],[999,"Text_Text_700","Open your schedule and get ready for magic!","打开你的课表，准备好去上魔法课吧！",null,null],[1000,"Text_Text_701","From Luna","来自魔法师狸月",null,null],[1001,"Text_Text_702","Pay attention! New monsters are coming!","注意！新的怪物即将出现！",null,null],[1002,"Text_Text_703","Magic sharks from another world are about to invade","异世界的魔鲨即将入侵",null,null],[1003,"Text_Text_704","Grab your flying wand and head to the playground!!","拿上你的飞行魔杖去操场迎战吧！！",null,null],[1004,"Text_Text_705","I'll go myself.","我自己去",null,null],[1005,"Text_Text_706","Transfer","传送",null,null],[1006,"Text_Text_707","A brand new flying lesson has begun!","全新的飞行课程开始了！",null,null],[1007,"Text_Text_708","Fight off the sharks!","击退鲨鱼！",null,null],[1008,"Text_Text_709","Thank you for guarding the dorm","谢谢你保卫了宿舍",null,null],[1009,"Text_Text_710","The shark destroyed the dormitory","鲨鱼摧毁了宿舍",null,null],[1010,"Text_Text_711","It takes three minutes to rebuild the dormitory","宿舍重建需要3分钟",null,null],[1011,"Text_Text_712","Obtain","获得",null,null],[1012,"Text_Text_713","Shoot magic arrows through magic auras to repel sharks!","穿过魔法光环，发射魔法箭击退鲨鱼！",null,null],[1013,"Text_Text_714","Lack of stars","星星不足",null,null],[1014,"Text_Text_715","You didn't use","你没有使用",null,null],[1015,"Text_Text_716","Unable to activate the Luna's magic circle","无法激活狸月的法阵",null,null],[1016,"Shark_01","The Shark Invasion","魔鲨入侵",null,null],[1017,"Shark_02","Consume 1","消耗1张",null,null],[1018,"Shark_03","Join to The Shark Invasion!","参加魔鲨入侵！",null,null],[1019,"Shark_04","The demon shark is about to invade!","异世界的魔鲨即将入侵",null,null],[1020,"Shark_05","Use your flying wand and head to\n The playground to take on the battle!","拿上你的飞行魔杖去操场迎战吧！！",null,null],[1021,"Shark_06","Cancel","我再想想",null,null],[1022,"Shark_07","I'll go for it","我自己去",null,null],[1023,"Shark_08","Transmission","传送",null,null],[1024,"Shark_09","Victory","击退鲨鱼",null,null],[1025,"Shark_10","Shark destroys dormitory……","鲨鱼摧毁了宿舍……",null,null],[1026,"Shark_11","Dormitory reconstruction takes 3 minutes","宿舍重建需要3分钟",null,null],[1027,"Shark_12","Thank you for defending the dormitory","感谢你保卫了宿舍",null,null],[1028,"Shark_13","Get","获得",null,null],[1029,"Shark_14","Go through the magic aura and fire a magic arrow to repel the shark!","穿过魔法光环，发射魔法箭击退魔鲨！",null,null],[1030,"Text_Text_717","Battle wand","战斗魔杖",null,null],[1031,"Text_Text_718","Rod of light","光之杖",null,null],[1032,"Text_Text_719","Flying wand","飞天魔杖",null,null],[1033,"Text_Text_720","Creation wand","造物魔杖",null,null],[1034,"Text_Text_721","Snowball","雪球魔杖",null,null],[1035,"Text_Text_722","Rolling wheels","车轮滚滚",null,null],[1036,"Text_Text_723","Magic step","魔法台阶",null,null],[1037,"Text_Text_724","Time bomb","定时炸弹",null,null],[1038,"Text_Text_725","Send heart","送心",null,null],[1039,"Text_Text_726","Headgear","扮鬼头套",null,null],[1040,"Text_Text_727","Fireworks","浪漫烟花",null,null],[1041,"Text_Text_728","Baby boy","男婴",null,null],[1042,"Text_Text_729","Baby girl","女婴",null,null],[1043,"Text_Text_730","Book","书",null,null],[1044,"Text_Text_731","Camera","相机",null,null],[1045,"Text_Text_732","Lightning stick","荧光棒",null,null],[1046,"Text_Text_733","Guitar","吉他",null,null],[1047,"Text_Text_734","Pistol","手枪",null,null],[1048,"Text_Text_735","Scattergun","霰弹枪",null,null],[1049,"Text_Text_736","Gun","冲锋枪",null,null],[1050,"Text_Text_737","Sprinkling can","喷水壶",null,null],[1051,"Text_Text_738","Laptop","笔记本电脑",null,null],[1052,"Text_Text_739","Cash","钱",null,null],[1053,"Text_Text_740","Mop","拖把",null,null],[1054,"Text_Text_741","Phone","手机",null,null],[1055,"Text_Text_742","Roit shield","防爆盾",null,null],[1056,"Text_Text_743","Flowers","花束",null,null],[1057,"Text_Text_744","Cart","购物车",null,null],[1058,"Text_Text_745","Board","牌子",null,null],[1059,"Text_Text_746","Stroller","婴儿车",null,null],[1060,"Text_Text_747","Suitcase","行李箱",null,null],[1061,"Text_Text_748","Umbrella","雨伞",null,null],[1062,"Text_Text_749","Burger","汉堡",null,null],[1063,"Text_Text_750","Milk","牛奶",null,null],[1064,"Text_Text_751","Bread","面包",null,null],[1065,"Text_Text_752","Bread","面包",null,null],[1066,"Text_Text_753","Beverage","饮料",null,null],[1067,"Text_Text_754","Beverage","饮料",null,null],[1068,"Text_Text_755","Beverage","饮料",null,null],[1069,"Text_Text_756","Beverage","饮料",null,null],[1070,"Text_Text_757","Seasoning","调料",null,null],[1071,"Text_Text_758","Alcohol","酒",null,null],[1072,"Text_Text_759","Cola","可乐",null,null],[1073,"Text_Text_760","Milkshake","奶昔",null,null],[1074,"Text_Text_761","Ice cream","冰淇淋",null,null],[1075,"Text_Text_762","Donut","甜甜圈",null,null],[1076,"Text_Text_763","Pizza","披萨",null,null],[1077,"Text_Text_764","Sasuage","香肠",null,null],[1078,"Text_Text_765","Skewers","烤串",null,null],[1079,"Text_Text_766","Skewers","烤串",null,null],[1080,"Text_Text_767","Steak","牛排",null,null],[1081,"Text_Text_768","Milktea","奶茶",null,null],[1082,"Text_Text_769","Milktea","奶茶",null,null],[1083,"Text_Text_770","Snack","零食",null,null],[1084,"Text_Text_771","Snack","零食",null,null],[1085,"Text_Text_772","Canned food","罐头",null,null],[1086,"Text_Text_773","Balloon","气球",null,null],[1087,"Text_Text_774","Rubber chicken","尖叫鸡",null,null],[1088,"Text_Text_775","Stuffed bunny","小白兔玩偶",null,null],[1089,"Text_Text_776","Stuffed kitty","橘猫玩偶",null,null],[1090,"Text_Text_777","Torch","火把",null,null],[1091,"Text_Text_778","Spotlight","射灯",null,null],[1092,"Text_Text_779","Flamethrower","喷火器",null,null],[1093,"Text_Text_780","Cookie","曲奇",null,null],[1094,"Text_Text_781","Cake","蛋糕",null,null],[1095,"Text_Text_782","Dessert","糕点",null,null],[1096,"Text_Text_783","Ice cream","冰淇淋",null,null],[1097,"Text_Text_784","Pudding","布丁",null,null],[1098,"Text_Text_785","Crepes","可丽饼",null,null],[1099,"Text_Text_786","Coffee","咖啡",null,null],[1100,"Text_Text_787","Beverage","饮料",null,null],[1101,"Text_Text_788","Cake","蛋糕",null,null],[1102,"Text_Text_789","Alcohol","酒",null,null],[1103,"Text_Text_790","Alcohol","酒",null,null],[1104,"Text_Text_791","Barbell","哑铃",null,null],[1105,"Text_Text_792","Curl bar","杠铃",null,null],[1106,"Text_Text_793","Stuffed kitty","白猫玩偶",null,null],[1107,"Text_Text_794","Stuffed kitty","黑猫玩偶",null,null],[1108,"Text_Text_795","Stuffed kitty","灰猫玩偶",null,null],[1109,"Text_Text_796","Trophy","奖杯",null,null],[1110,"Text_Text_797","Pad","橘猫靠垫",null,null],[1111,"Text_Text_798","Pad","灰猫靠垫",null,null],[1112,"Text_Text_799","GamePC","游戏机",null,null],[1113,"Text_Text_800","Hand Game","掌机",null,null],[1114,"Text_Text_801","Wand","法杖",null,null],[1115,"Text_Text_802","Jetpack","喷气背包",null,null],[1116,"Text_Text_803","Dark Wing","暗之翼",null,null],[1117,"Text_Text_804","Wing of Light","光之翼",null,null],[1118,"Text_Text_805","Sea Wing","海之翼",null,null],[1119,"Text_Text_806","Wing of Flame","焰之翼",null,null],[1120,"Text_Text_807","Black bone","宿命凯瑞甘",null,null],[1121,"Text_Text_808","Bright bone","光明骨",null,null],[1122,"Text_Text_809","Blue bone","海之契约",null,null],[1123,"Text_Text_810","Fire bone","盛夏烟火",null,null],[1124,"Text_Text_811","Dark night","黑夜",null,null],[1125,"Text_Text_812","Oracle","神谕",null,null],[1126,"Text_Text_813","Sea dream","海梦",null,null],[1127,"Text_Text_814","Friendship","友谊",null,null],[1128,"Text_Text_815","Angel Wings","天使之翼",null,null],[1129,"Text_Text_816","Firework","烟花",null,null],[1130,"Text_Text_817","Bomb","炸弹",null,null],[1131,"Text_Text_818","Paraglider","滑翔伞",null,null],[1132,"Text_Text_819","Skateboard","滑板",null,null],[1133,"Text_Text_820","Battle Pass","鲨鱼令",null,null],[1134,"Text_Text_821","Gold Destiny","金色狸月牌",null,null],[1135,"Text_Text_822","Silver Destiny","银色狸月牌",null,null],[1136,"Text_Text_823","Star power","星之力",null,null],[1137,"Text_Text_824","Orange Cat","胖胖大橘",null,null],[1138,"Text_Text_825","Princess Cat","甜心小粉",null,null],[1139,"Text_Text_826","Cool Cat","酷酷小黑",null,null],[1140,"Text_Text_827","Costume","魔法服饰",null,null],[1141,"Text_Text_828","Costume","魔法服饰",null,null],[1142,"Text_Text_829","Costume","魔法服饰",null,null],[1143,"Text_Text_830","College dress","学院服饰",null,null],[1144,"Text_Text_831","Costume","魔法服饰",null,null],[1145,"Text_Text_832","Silver coin","银币",null,null],[1146,"Text_Text_833","Gold coin","金币",null,null],[1147,"Text_Text_834","Moon coin","月亮币",null,null],[1148,"Text_Text_835","Star coin","星星币",null,null],[1149,"Text_Text_836","Go forth and break through the darkness with the wand with power to fight.","赐予战斗能力的法杖，去冲破黑暗吧。",null,null],[1150,"Text_Text_837","This is a wand","这是一把魔杖",null,null],[1151,"Text_Text_838","Wand for broomstick. Fly safely.","召唤飞行扫帚的魔杖，飞行请注意安全。",null,null],[1152,"Text_Text_839","The wand used to perform the magic of creation, made from the branches of the golden tree, contains the magic power to create all things.","施展造物魔法所使用的魔杖，用黄金树的树枝做成，蕴含着创造万物的魔力。",null,null],[1153,"Text_Text_840","A wand that generates snowballs, made of otherworldly cold elements","可以生成雪球的魔杖异世寒冰元素凝结而成的魔杖",null,null],[1154,"Text_Text_841","A fantastic item generated by Creation magic","造物魔法生成的奇妙道具",null,null],[1155,"Text_Text_842","A fantastic item generated by Creation magic","造物魔法生成的奇妙道具",null,null],[1156,"Text_Text_843","A fantastic item generated by Creation magic","造物魔法生成的奇妙道具",null,null],[1157,"Text_Text_844","A fantastic item generated by Creation magic","造物魔法生成的奇妙道具",null,null],[1158,"Text_Text_845","A fantastic item generated by Creation magic","造物魔法生成的奇妙道具",null,null],[1159,"Text_Text_846","A fantastic item generated by Creation magic","造物魔法生成的奇妙道具",null,null],[1160,"Text_Text_847","The sleeping baby, it's a boy","睡着的宝宝，是男孩子",null,null],[1161,"Text_Text_848","The sleeping baby, it's a girl","睡着的宝宝，是女孩子",null,null],[1162,"Text_Text_849","The House of gold is in the book","书中自有黄金屋",null,null],[1163,"Text_Text_850","Leave precious images on campus!","在校园留下珍贵影像吧！",null,null],[1164,"Text_Text_851","Lightsaber Youth Editionヾ(•ω•`)o","光剑青春版ヾ(•ω•`)o",null,null],[1165,"Text_Text_852","Time to shine","展现音乐才能的时候到了",null,null],[1166,"Text_Text_853","Boom, boom, boom, boom, boom. One shot","砰砰砰，一枪定胜负",null,null],[1167,"Text_Text_854","This gun has a bigger, bigger range!","这把枪的范围更更更大！",null,null],[1168,"Text_Text_855","Roses of War and Fire","经典永不褪色，冲锋在前的好伙伴",null,null],[1169,"Text_Text_856","Maybe you can do more with it","或许不止可以用来浇花",null,null],[1170,"Text_Text_857","Tools of life and office","日常生活的好伙伴，效率办公的好助手",null,null],[1171,"Text_Text_858","Money can, but it can't solve everything","钞能力，但不能解决所有事情",null,null],[1172,"Text_Text_859","Tools for cleaning","打扫干净，搞好卫生，共创整洁校园",null,null],[1173,"Text_Text_860","To discover and record the beauty of the world","用来发现与记录世界的美丽",null,null],[1174,"Text_Text_861","Say no to all violence!","向一切暴力说不！",null,null],[1175,"Text_Text_862","It's a bunch of flowers, about death or love","这是一束花，关乎于死亡或是爱情",null,null],[1176,"Text_Text_863","The shopping king's feast","我爱购物，我爱购物，这就是我的战车！",null,null],[1177,"Text_Text_864","Pledge your dreams","宣誓着你的梦想",null,null],[1178,"Text_Text_865","Haven as a baby","稳稳当当，四平八稳，小孩子也有远行的梦",null,null],[1179,"Text_Text_866","Pack in all your expectations for the future","装下对未来所有的期待",null,null],[1180,"Text_Text_867","Find someone to walk with in the rain","找一个能与你漫步雨中的人吧",null,null],[1181,"Text_Text_868","A burger to fill up on (Consumables)","一个汉堡，吃的饱饱（消耗品）",null,null],[1182,"Text_Text_869","Sweet milk (consumable)","上学时候睡前家里准备的牛奶（消耗品）",null,null],[1183,"Text_Text_870","Essential food for home travel (Consumables)","居家旅行的必备食粮（消耗品）",null,null],[1184,"Text_Text_871","Convenient commuting food (Consumables)","上学通勤的必备早餐（消耗品）",null,null],[1185,"Text_Text_872","Cool summer! Hey! (Consumables)","清凉一夏！欸嘿！（消耗品）",null,null],[1186,"Text_Text_873","Cool summer! Yeah! (Consumables)","清凉一夏！好耶！（消耗品）",null,null],[1187,"Text_Text_874","Cool summer! Whoop! (Consumables)","清凉一夏！呜呼！（消耗品）",null,null],[1188,"Text_Text_875","Cool summer! Ho! (Consumables)","清凉一夏！嚯呀！（消耗品）",null,null],[1189,"Text_Text_876","The soul of food (consumables)","好吃的美味千古流传，好用的调料传香万里（消耗品）",null,null],[1190,"Text_Text_877","In wine is the Story of the Ages (Consumable)","酒里是岁月的故事（消耗品）",null,null],[1191,"Text_Text_878","Burp softly (Consumable)","轻轻打出一个响嗝（消耗品）",null,null],[1192,"Text_Text_879","The fruit of summer (Consumables)","和最爱的人分享甜甜的盛夏（消耗品）",null,null],[1193,"Text_Text_880","A good helper for cooling this summer (Consumable)","冰冰凉凉的解暑好助手（消耗品）",null,null],[1194,"Text_Text_881","Crispy and deep-fried (Consumable)","你是我双手合拢的一个圈（消耗品）",null,null],[1195,"Text_Text_882","Heard some places don't like pineapple on top? ! (Consumables)","听说有些地方不喜欢在上面加菠萝？！（消耗品）",null,null],[1196,"Text_Text_883","The representative of air dried food (Consumables)","风干美味，好吃不贵，香醇品质，先到先得！（消耗品）",null,null],[1197,"Text_Text_884","Magic Campus barbecue are here! (Consumables)","魔法校园的烧烤申请出战！（消耗品）",null,null],[1198,"Text_Text_885","Crackling, steaming to meet you (Consumable)","劈里啪啦，冒着热气与你相见（消耗品）",null,null],[1199,"Text_Text_886","Feel free to eat (Consumable)","没有什么必须的礼仪，吃的开心就行（消耗品）",null,null],[1200,"Text_Text_887","The warm days of summer (Consumables)","回忆起了夏日午后的温暖时光（消耗品）",null,null],[1201,"Text_Text_888","The fighting days of summer (consumables)","回忆起了旧日操场的拼搏岁月（消耗品）",null,null],[1202,"Text_Text_889","Don't steal food in class! (Consumables)","上课的时候可不要偷吃哦！（消耗品）",null,null],[1203,"Text_Text_890","Share the delicacy of the pieces (Consumable)","和最好的朋友分享这一份美味（消耗品）",null,null],[1204,"Text_Text_891","For years, years, years! (Consumables)","可以放很多年，很多年，很多年！（消耗品）",null,null],[1205,"Text_Text_892","Use balloons to release once childlike innocence","用气球放飞曾经的童真",null,null],[1206,"Text_Text_893","Cluck! Let out a scream","咯咯哒！发出来尖叫声",null,null],[1207,"Text_Text_894","Embrace in bed white flawless guardian","怀抱在被窝里洁白无暇的守护者",null,null],[1208,"Text_Text_895","A diabolical cat cradled in bed","怀抱在被窝里狡黠暗黑的恶魔猫",null,null],[1209,"Text_Text_896","At night, watch out for candles","夜晚时分，小心火烛",null,null],[1210,"Text_Text_897","Stage spotlight","不知道在哪拿到的舞台道具，听说派对咖在找它",null,null],[1211,"Text_Text_898","Set the world on fire and fight back the darkness","点燃这个世界，击退无尽的黑暗",null,null],[1212,"Text_Text_899","Freshly baked Crispy Cookies (Consumables)","刚刚烤好的香脆曲奇（消耗品）",null,null],[1213,"Text_Text_900","A small cake to share with friends (Consumable)","下一次就和朋友分享友谊的蛋糕（消耗品）",null,null],[1214,"Text_Text_901","A small cake to share with friends(Consumables)","走亲访友必备佳品（消耗品）",null,null],[1215,"Text_Text_902","Cool for a summer! (Consumables)","冰凉一夏！（消耗品）",null,null],[1216,"Text_Text_903","QQ bounce, to eat slowly oh! (Consumables)","QQ弹弹，要慢点吃哦！（消耗品）",null,null],[1217,"Text_Text_904","Crispy and delicious (consumables)","自由搭配出属于自己的薄脆美味（消耗品）",null,null],[1218,"Text_Text_905","No longer tired, Coffee back (Consumable)","不再疲惫，咖啡回来（消耗品）",null,null],[1219,"Text_Text_906","Would you like it cold or hot? (Consumables)","你是要冰的，还是热的呢？（消耗品）",null,null],[1220,"Text_Text_907","A small cake to share with friends (Consumable)","这一次就和朋友分享友谊的蛋糕（消耗品）",null,null],[1221,"Text_Text_908","In wine is the Story of the Ages (Consumable)","酒里是岁月的故事（消耗品）",null,null],[1222,"Text_Text_909","In Wine is the Story of Youth (Consumable)","酒里是青春的故事（消耗品）",null,null],[1223,"Text_Text_910","We go gym","锻炼~锻炼~",null,null],[1224,"Text_Text_911","Champion reward","举重比赛第一名的奖品",null,null],[1225,"Text_Text_912","Holding it will make you look more cute","拿着会让自己显得更加可爱",null,null],[1226,"Text_Text_913","Holding it will make you more lovable","拿着会让自己变得更加可爱",null,null],[1227,"Text_Text_914","Holding it will make you feel cuter","拿着会让自己感觉更加可爱",null,null],[1228,"Text_Text_915","The prize of admission, a trophy of mystical power","入学的奖品，蕴含着神秘力量的奖杯",null,null],[1229,"Text_Text_916","Take a break. Take a break","休息，休息一下",null,null],[1230,"Text_Text_917","Lean on, lean on","靠着，靠着一下",null,null],[1231,"Text_Text_918","The game world in the palm of your hand","掌心中的游戏世界，玩会了就教家里人玩吧",null,null],[1232,"Text_Text_919","The game world in the palm of your hand","掌心中的游戏世界，玩累了就休息休息",null,null],[1233,"Text_Text_920","Wielding the light of fire with divine power","以神圣力量，挥舞出火焰的光芒",null,null],[1234,"Text_Text_921","God sent the winner's backpack, fly fast","上帝送给胜利者的背包，快翱翔天际吧",null,null],[1235,"Text_Text_922","The darkness will consume you","黑暗会将你吞噬",null,null],[1236,"Text_Text_923","The Illuminati grant freedom","光明会赋予自由",null,null],[1237,"Text_Text_924","The ocean will protect all beings","海洋会保护众生",null,null],[1238,"Text_Text_925","Flames inspire courage","烈焰会激发勇气",null,null],[1239,"Text_Text_926","Buried in the wings of the curse of fate","埋藏着宿命诅咒的翅膀",null,null],[1240,"Text_Text_927","The wings that shelter the light","庇护圣光的翅膀",null,null],[1241,"Text_Text_928","Dive into the ocean and give wings to breathe","潜入海洋赐予呼吸的翅膀",null,null],[1242,"Text_Text_929","Summer night sky","与最爱的人飞翔在夏日的夜空吧",null,null],[1243,"Text_Text_930","The night hidden in my heart","能够飞越黑暗的羽翼",null,null],[1244,"Text_Text_931","God said you can fly","神说，你能飞",null,null],[1245,"Text_Text_932","A dream hidden in the eyes","让你像鸟儿一样飞向天空",null,null],[1246,"Text_Text_933","The heart is beating, friendship is like fire","心在跳，友谊如烈火",null,null],[1247,"Text_Text_934","The wings of the power of the stars","星辰之力凝聚而成的圣洁羽翼",null,null],[1248,"Text_Text_935","Festival only, Put away from crowd","庆典专用，远离人群放置",null,null],[1249,"Text_Text_936","Bomb!","bomb~",null,null],[1250,"Text_Text_937","It helps you glide through the air","能帮助你在空中滑翔",null,null],[1251,"Text_Text_938","Little skateboard, big wings","小小的滑板，大大的翅膀",null,null],[1252,"Text_Text_939","Pass for [Shark Event], 1 for each [Flight Lesson] you attend","用于参加【魔鲨入侵】的令牌，每次参加【飞行魔法课】可获取1张",null,null],[1253,"Text_Text_940","Permanent divination cards with limited use","可以永久使用的占卜牌，但是有使用次数限制",null,null],[1254,"Text_Text_941","Each use will consume one, use it carefully (Consumables)","每次使用将会消耗一张，狸月提醒你要省着点用哦（消耗品）",null,null],[1255,"Text_Text_942","The power of starlight","星光闪耀的力量",null,null],[1256,"Text_Text_943","\"Why would my master feed me good fish? Meow!\"","“主人会喂我好吃的鱼干吗？喵~”",null,null],[1257,"Text_Text_944","Can you like Pinky only?","“主人可以只喜欢小粉吗？喵~”",null,null],[1258,"Text_Text_945","Stay away from me, human! But not too far away!","“离我远一点，人类！但不许离得太远！”",null,null],[1259,"Text_Text_946","Use it to change into a beautiful costume!","使用后可以换上漂亮服饰哟~",null,null],[1260,"Text_Text_947","Use it to change into a beautiful costume!","使用后可以换上漂亮服饰哟~",null,null],[1261,"Text_Text_948","Use it to change into a beautiful costume!","使用后可以换上漂亮服饰哟~",null,null],[1262,"Text_Text_949","Use it to change into a beautiful costume!","使用后可以换上漂亮服饰哟~",null,null],[1263,"Text_Text_950","Use it to change into a beautiful costume!","使用后可以换上漂亮服饰哟~",null,null],[1264,"Text_Text_951","Bright silver coins can be exchanged for treasures at Luna's Store","亮闪闪的银币，可以在狸月商店兑换宝物",null,null],[1265,"Text_Text_952","Splendid gold coins can be exchanged for treasures at Luna's Store","金灿灿的金币，可以在狸月商店兑换宝物",null,null],[1266,"Text_Text_953","Blessings from the Otherworldly Moon, redeemable for treasures at Luna's Store","来自异世月亮的祝福，可以在狸月商店兑换宝物",null,null],[1267,"Text_Text_954","Guardian of the Stars from the Twilight Zone, you can get a gift pack at Luna's Store","来自奇幻时空里星星的守护，可以在狸月商店获取礼包",null,null],[1268,"Text_Text_955","Prop giving","道具给与",null,null],[1269,"Text_Text_956","Number","圈数",null,null],[1270,"ComboTxt","{0} X Combo","{0} X 连击",null,null],[1271,"Text_Text_957","Move the rocker through the front circle","试着移动摇杆通过前面的圆圈",null,null],[1272,"Text_Text_958","I heard the magic sharks invaded? Luna told me to pick you up!","听说魔鲨入侵了？狸月通知我来接你们！",null,null],[1273,"Text_Text_959","I'm Captain Jack! I show up when there's a crisis on campus!","我是杰克船长！校园危机的时候我就会出现！",null,null],[1274,"Text_Text_960","Legend has it that gathering the pieces will yield some kind of spotted creature...","传说中集齐碎片可以获得某种斑点生物...",null,null],[1275,"Text_Text_961","You just climb the green vine, is I casually lost magic beans grow!","你刚攀登的绿藤，是我随手丢的魔豆长成的！",null,null],[1276,"Study_1","Self-study plan","自习计划",null,null],[1277,"Study_2","Practice is diligent, shortage in one; Success depends on thought and ruin.","业精于勤，荒于嬉；行成于思，毁于随。",null,null],[1278,"Study_3","Please select the duration of your study","请选择自习时长",null,null],[1279,"Study_4","Start self-study","开始自习",null,null],[1280,"Study_5","5 minutes","5分钟",null,null],[1281,"Study_6","15 minutes","15分钟",null,null],[1282,"Study_7","30 minutes","30分钟",null,null],[1283,"Study_8","1 hour","1小时",null,null],[1284,"Study_9","2 hours","2小时",null,null],[1285,"Study_10","3 hours","3小时",null,null],[1286,"Study_11","4 hours","4小时",null,null],[1287,"Study_12","5 hours","5小时",null,null],[1288,"Study_13","Self-study report","自习报告",null,null],[1289,"Study_14","You have studied by yourself this time:","你这次自习了：",null,null],[1290,"Study_15","Cumulative self-study time:","累计自习时间：",null,null],[1291,"Study_16","Where there is a will, there is a way! Insist, march forward!","有志者，事竟成！坚持，勇往直前！",null,null],[1292,"Study_17","You're already great! Keep going and you'll be a better person!","你已经很棒了！继续坚持你会成为更优秀的人！",null,null],[1293,"Study_18","You made a difference! You were focused! Keep going!","小有所成了，你很专注！继续加油吧！",null,null],[1294,"Study_19","Wow! The self-study is over. It's great! Proud of you, quick screenshots to show off the game circle!","哇哦！自习圆满结束啦，可太棒了呢！为你骄傲，快截图去游戏圈炫耀吧！",null,null],[1295,"Study_20","What perseverance! You're the next big thing! Share with everyone to learn from you!","太有毅力了！你就是明日之星！快分享给大家向你学习吧！",null,null],[1296,"Study_21","Go to the magic campus to experience the colorful campus life!","去魔法校园里体验丰富多彩的校园生活吧！",null,null],[1297,"Study_22","You can take a break between classes","可以课间休息一下噢~",null,null],[1298,"Study_23","Wonderful activities are waiting for you in the Magical campus, so go get some rest!","魔法校园里的精彩活动在等着你，快去休息一下吧！",null,null],[1299,"Study_24","Go to Magic campus play, relax yourself!","快去魔法校园游玩，放松一下自己吧！",null,null],[1300,"Study_25","Go to the magic campus to play, you need to relax, wonderful activities are waiting for you!","快去魔法校园里游玩吧，你需要好好放松一下了，精彩的活动在等着你！",null,null],[1301,"Study_26","Continue self-study","继续自习",null,null],[1302,"Study_27","leave","离开",null,null],[1303,"Study_28","Study hall announcement","自习室公告",null,null],[1304,"Study_29","This is a study room to provide a comfortable learning environment for all students, please. color=#F7B608FF&gt; Keep your phone locked for longer. /color&gt; Prevent dropped lines, open the sound, let us in the beautiful music together happy self-study!","这是一个给各位同学提供舒适的学习环境的自习室，请大家<color=#F7B608FF>延长手机的锁屏时间</color>防止掉线，打开声音，让我们在优美的音乐中一起快乐自习吧！",null,null],[1305,"Study_30","I see.","我知道了",null,null],[1306,"Study_31","The seats are full.","座位已满",null,null],[1307,"Study_32","Business is often made by perseverance, destroyed by impatience","事业常成于坚忍，毁于急躁",null,null],[1308,"Study_33","Do you really want to stop studying?","真的要结束学习吗？",null,null],[1309,"Study_34","Take a deep breath...... Start self-study","深吸一口气......开始自习",null,null],[1310,"Prop_140","Sign a contract","签订契约",null,null],[1311,"Prop_141","Display contract","展示契约",null,null],[1312,"Relation_01","You are already {1} of {0}","你已经是{0}的{1}了",null,null],[1313,"Relation_02","The remaining validity period of the current ring is only {0} days","当前戒指剩余有效期仅剩：{0}天",null,null],[1314,"Relation_03","Invites you to be their","邀请你成为TA的",null,null],[1315,"Relation_04","Wait for the other party to accept....","等待对方接受中....",null,null],[1316,"Relation_05","Please enter the title first","请先输入称号",null,null],[1317,"Relation_06","You are the TA title entry is not legal!!","你是TA的称号输入不合法！！！",null,null],[1318,"Relation_07","TA is your title input is not legal!!","TA是你的称号输入不合法！！！",null,null],[1319,"Relation_08","Existing contract","已有契约",null,null],[1320,"Relation_09","{1} of {0}","{0}的{1}",null,null],[1321,"Relation_10","Teleport to his or her side","传送到TA的身边",null,null],[1322,"Relation_11","The relationship will be terminated automatically after 7 days","关系维持7天后将自动解除",null,null],[1323,"Relation_12","Choose","选择",null,null],[1324,"Relation_13","Click enter title","点击输入称号",null,null],[1325,"Relation_14","The title cannot be changed after confirmation!","确定后称号无法更改了哦！",null,null],[1326,"Relation_15","Determine","确定",null,null],[1327,"Relation_16","Enter the title you want to set","输入你想设置的称号",null,null],[1328,"Relation_17","The ring of the contract has lapsed, and the contract can be re-purchased","契约之戒已失效，可重新购买签订契约",null,null],[1329,"Relation_18","You belong to them","你是TA的",null,null],[1330,"Relation_19","He or she is yours","TA是你的",null,null],[1331,"Relation_20","Who you want to enter into a contract with","你想要签订契约的对象",null,null],[1332,"Relation_21","Give away","赠送",null,null],[1333,"Relation_22","Reset title","重置称号",null,null],[1334,"Relation_23","The contractor is not in this room","契约者不在此房间",null,null],[1335,"Pet_Talk_19","Set sail! Full speed ahead!","扬帆！全速前进！",null,null],[1336,"Pet_Talk_20","I'm faster than the waves!","我比海浪还要快！",null,null],[1337,"Pet_Talk_21","I'm the dog that's gonna be Captain!","我是要成为船长的小狗！",null,null],[1338,"Pet_Talk_22","I miss sailing with the captain!","真怀念和船长一起航行的日子啊！",null,null],[1339,"Pet_Talk_23","Could there be a mysterious treasure in the school?","学校里会有神秘的宝藏吗？",null,null],[1340,"Pet_Talk_24","Woof woof! Sailor Puppy report!","汪汪汪！水手小狗报道!",null,null],[1341,"Captain_01","Talk to the captain","与船长对话",null,null],[1342,"Captain_02","Ha ha ha, worthy of my good people, the challenge of magic vine courage, and I was young exactly the same!","哈哈哈，不愧是我看好的人，这股挑战魔藤的勇气，简直和我年轻时一模一样！",null,null],[1343,"Captain_03","Who are you?","你是谁？",null,null],[1344,"Captain_04","Oh! Listen up, child, I am Captain Cuenca the mightiest in all the seven seas! Ha ha ha, you must have a lot of questions, let me answer for you!","噢！孩子，听好了，我可是整个七大洋最强大的昆卡船长！哈哈哈哈，你肯定有很多疑问，让我来为你解答！",null,null],[1345,"Captain_05","Why are you from the sky? Our campus is also on the cloud?","你为什么从天上来啊？我们的校园也在云上？",null,null],[1346,"Captain_06","What is the purpose of your visit?","你来这的目的是什么？",null,null],[1347,"Captain_07","Is Uyue really powerful? What exactly is the use of the gold and silver coins collected?","狸月真的很强大吗？收集的金币和银币到底有什么用？",null,null],[1348,"Captain_08","There's a treasure chest in the bow. Can I open it?","船头有个宝箱，我能打开看看吗？",null,null],[1349,"Captain_09","Good observation! You should be my first mate! It's a long story, but I really should have taken care of him......","观察力不错，你该来当我的大副！这件事说来话长，不过，我真的早该亲手解决他......",null,null],[1350,"Captain_10","Aye? Captain? (He seems to be lost in memory.)","欸？船长先生？（他似乎陷入回忆了）",null,null],[1351,"Captain_11","What a bad memory...... Both my ship and your school are in the sky because of the use of suspended magic. As far as I know, the moon consumes a lot of mana during the day to keep the school flying, only to stop at night, the child is really hard over the years......","真是一段不好的回忆啊......我的船和你们的学校都能在天上，都是因为使用了悬空魔法。据我所知，狸月白天要消耗大量的法力来维持学校的飞行，只有晚上会停止下来，这孩子这些年真是辛苦了......",null,null],[1352,"Captain_12","Why fly all the time? Is the captain on a trip?","为什么要一直飞行呢？船长先生在旅行吗？",null,null],[1353,"Captain_13","This is the Moon protecting the school from the dark arts, making time for you brave magicians to learn! And I, constantly sailing for you to find a new continent, so that you can better fight down!","这是狸月在保护学校免于黑魔法的侵蚀，为你们这些勇敢的魔法师争取学习时间！而我，不断航行着为大家寻找新大陆，让大家能更好地战斗下去！",null,null],[1354,"Captain_14","I didn't know that had happened before","原来还发生过这样的事啊",null,null],[1355,"Captain_15","I have begun Project Month by Month, searching every continent for a suitable land for us to land on, a continent full of magical energy. We'll start our lives over there.","我已经开始了“逐月计划”，在各个大陆上寻找适合我们降落的土地，一块魔法能量充盈的大陆。我们会在那里重新开始生活。",null,null],[1356,"Captain_16","Well, children, you brilliant young magicians have restored my hope for the future! I should get on with my job, and then we'll fix the tracks and build the platform, and don't forget to check out the train. Leryn will be looking for you!","好了，孩子，你们这些年轻卓越的魔法师让我对未来又重新充满了希望！我该继续去完成我的工作，到时候我们会修好轨道，建好月台，到时候别忘了去列车上看看，莱琳会来找你们！",null,null],[1357,"Captain_17","Ha ha ha ha, the purpose of my coming here is to give the school open up new routes, let us go to the wider world, soon after my daughter leryn will establish a platform!","哈哈哈哈，我这次来是为了给学校开辟新航线，让大家去更广阔的世界历练，不久后我的女儿莱琳会来建立站台的！",null,null],[1358,"Captain_18","Gold and silver coins, of course! With them, you can drink good wine, oh ho ho!","金币与银币，当然重要啦！有了它们就可以喝到好喝的美酒，哦吼吼！",null,null],[1359,"Captain_19","Are you serious, Captain......","您是认真的吗，船长先生......",null,null],[1360,"Captain_20","Ha ha ha, I like young people like you! I have watched her grow from a naughty little girl into the best student of the school. When she was a child, she did not stop climbing my mast, but poured my favorite rum into the sea and shouted ha ha ha!","哈哈哈哈，我喜欢你这样的年轻人！我和狸月丫头都来自一个遥远的魔法学院，我可是看着她从一个调皮的小女孩成长为学院最优秀的学生，这丫头小时候可没少爬我的桅杆，还把我最爱的朗姆酒往海里倒，吼哈哈哈！",null,null],[1361,"Captain_21","What happened then?","后来发生了什么呢？",null,null],[1362,"Captain_22","Listen, my child, our school of Magic used to be the most prestigious school in the world, only because of a terrible dark magic disaster many years ago, Dean Diana had to use up her powers, moved the whole school, let the Yue led everyone to leave...... (The captain, who was laughing a moment ago, now has a tear in his eye)","听好了，孩子，我们的魔法学院曾经是这个世界最负盛名的学校，只不过因为多年前的一场可怕的黑魔法劫难，戴安娜院长不得不耗尽自己的法力，迁移了整个学院，让狸月带着大家离开......（刚才还在大笑的船长，此时眼角有泪花闪过）",null,null],[1363,"Captain_23","silence","沉默",null,null],[1364,"Captain_24","So is Dean Diana...","那戴安娜院长是不是...",null,null],[1365,"Captain_25","Yes, our home died with Diana. The Academy will never forget that day! I will spend the rest of my life opening up a new course of renewal!","是的，我们的家和戴安娜一起消逝了，魔法学院永远不会忘记那一天！我将用我的余生来重新开辟一条复兴的航线！",null,null],[1366,"Captain_26","Of course, boy, there you'll meet my best mate, Bobo, whom I fought all day and all night to save","当然，孩子，在那里你会认识我最好的大副波波，我和海怪搏斗了一天一夜才将它救下，哈哈哈哈哈",null,null],[1367,"LeaderBord_Tex1","{0}s","{0}秒",null,null],[1368,"LeaderBord_Tex2","Not summit","未登顶",null,null],[1369,"Task_Acc","跟我走","跟我走",null,null],[1370,"Task_Finish","取消跟随","取消跟随",null,null],[1371,"Task_Tex1",null,"你接了任务1-1",null,null],[1372,"Task_Tex2",null,"你完成了任务1-1",null,null],[1373,"Task_Tex3",null,"你接了任务1-2",null,null],[1374,"Task_Tex4",null,"你完成了任务1-2",null,null],[1375,"Task_Tex5",null,"你接了任务1-3",null,null],[1376,"Task_Tex6",null,"你完成了任务1-4",null,null],[1395,"Change_01","Change","换装",null,null],[1396,"Change_02","Have owned","只看已拥有",null,null],[1397,"Change_03","Save all","保存全部服装",null,null],[1398,"Change_04","Reset","重置",null,null],[1399,"Change_05","Buy","购买",null,null],[1400,"Change_06","up","上装",null,null],[1401,"Change_07","down","下装",null,null],[1402,"Change_08","skirt","裙子",null,null],[1403,"Change_09","hair","头发",null,null],[1404,"Change_10","trailing","拖尾",null,null],[1405,"Change_11","wing","翅膀",null,null],[1406,"Change_12","Have obtained","已获得",null,null],[1407,"Change_13","Are you sure to buy it?","确定购买吗",null,null],[1408,"Change_14","Yes","是",null,null],[1409,"Change_15","No","否",null,null],[1410,"Change_16","Congratulations","恭喜获得！",null,null],[1411,"Change_17","OK","好的",null,null],[1412,"Change_18","Total","服饰总花费：",null,null],[1413,"Change_19","Tip: The costumes obtained during the event can only be saved after obtaining them!","提示：若有活动获得的服饰，需获取后才能保存哦！",null,null],[1414,"Change_20","Get path","获取路径",null,null],[1415,"Change_21","How to get ","查看获取路径",null,null],[1416,"Change_22","Have obtained","已获得",null,null],[1417,"Change_23","Activity acquisition","校园购买",null,null],[1418,"Change_24","Available through the {0} activity","可通过{0}活动获得",null,null],[1419,"Change_25","Exit ","退出",null,null],[1420,"Change_26",null,"确定要退出吗？退出后服装无法保存哦！",null,null],[2000,"npc1_name","旅行商人","旅行商人",null,null],[2001,"icon_touch_1","与旅行商人对话","与旅行商人对话",null,null],[2002,"npc1_talk_text1","随便看看吧，我这里的东西都是独一无二的！","随便看看吧，我这里的东西都是独一无二的！",null,null],[2003,"npc1_talk_text2","我是谁？我在哪？","我是谁？我在哪？",null,null],[2004,"npc1_talk_text3","你是谁？","你是谁？",null,null],[2005,"npc1_talk_text4","你这里卖点什么？","你这里卖点什么？",null,null],[2006,"npc1_talk_text5","查看任务","查看任务",null,null],[2007,"npc1_talk_text6","没事了","没事了",null,null],[2008,"npc1_talk_text7","你是坐车坐迷糊了吗？这里是童话小镇，一个充满乐趣与挑战的地方。","你是坐车坐迷糊了吗？这里是童话小镇，一个充满乐趣与挑战的地方。",null,null],[2009,"npc1_talk_text8","我？我是穿梭于银河中的旅行商人，哪里有买卖哪里就有我。","我？我是穿梭于银河中的旅行商人，哪里有买卖哪里就有我。",null,null],[2010,"npc1_talk_text9","当然是我不远万里，从宇宙各地搜集来的美丽服装，希望你能喜欢。","当然是我不远万里，从宇宙各地搜集来的美丽服装，希望你能喜欢。",null,null],[2011,"npc1_talk_text10","祝你玩得愉快，我的朋友！","祝你玩得愉快，我的朋友！",null,null],[2012,"npc1_talk_text11","再问问其他的","再问问其他的",null,null],[2013,"npc1_talk_text12","你这价格也太离谱了！","你这价格也太离谱了！",null,null],[2014,"npc1_talk_text13","我没钱，可以直接送我吗？","我没钱，可以直接送我吗？",null,null],[2015,"npc1_talk_text14","中间这件看着不错，怎么买不了？","中间这件看着不错，怎么买不了？",null,null],[2016,"npc1_talk_text15","这个我不喜欢，换一个","这个我不喜欢，换一个",null,null],[2017,"npc1_talk_text16","接受任务","接受任务",null,null],[2018,"npc1_talk_text17","芜湖~等你的好消息！我的朋友！","芜湖~等你的好消息！我的朋友！",null,null],[2019,"npc1_talk_text18","哈哈哈，那是自然。正所谓一分钱一分货，我摆出来这些可都是极品！","哈哈哈，那是自然。正所谓一分钱一分货，我摆出来这些可都是极品！",null,null],[2020,"npc1_talk_text19","我的老天，这当然不行。老老实实付钱，或者用蓝宝石来交换！","我的老天，这当然不行。老老实实付钱，或者用蓝宝石来交换！",null,null],[2021,"npc1_talk_text20","嗯？你眼光不错，不过这可是我的宝贝，不卖不卖。不过我今天心情好，允许你试穿一下。","嗯？你眼光不错，不过这可是我的宝贝，不卖不卖。不过我今天心情好，允许你试穿一下。",null,null],[2022,"npc1_talk_text21","这个蓝宝石怎么获得？","这个蓝宝石怎么获得？",null,null],[2023,"npc1_talk_text22","接取任务并完成它，我会给予你蓝宝石作为报酬！","接取任务并完成它，我会给予你蓝宝石作为报酬！",null,null],[2024,"npc1_talk_text23","到达巨大藤蔓的顶端，我将给予你8颗蓝宝石作为奖励。","到达巨大藤蔓的顶端，我将给予你8颗蓝宝石作为奖励。",null,null],[2025,"npc1_speak_1","我来自星辰大海","我来自星辰大海",null,null],[2026,"npc2_name","迎宾大叔","迎宾大叔",null,null],[2027,"npc3_name","门卫","门卫",null,null],[2028,"npc4_name","指引-小黎","指引-小黎",null,null],[2029,"npc5_name","热心好市民","热心好市民",null,null],[2030,"npc6_name","宠物饲养员","宠物饲养员",null,null],[2031,"npc7_name","可疑的市民","可疑的市民",null,null],[2032,"champion_statue","冠军雕像","冠军雕像",null,null],[2033,"npc1_text","瞧一瞧看一看嘞~新鲜出炉的任务嘞~","瞧一瞧看一看嘞~新鲜出炉的任务嘞~",null,null],[2034,"npc2_text","此区域暂未开放...","此区域暂未开放...",null,null],[2035,"npc3_text","请出示证件","请出示证件",null,null],[2036,"npc4_text","进入传送门，可以快速到达指定区域哦~","进入传送门，可以快速到达指定区域哦~",null,null],[2037,"npc5_text","这些衣服实在是泰裤辣！！","这些衣服实在是泰裤辣！！",null,null],[2038,"npc6_text","给可爱的小动物们买些营养的饲料吧！~","给可爱的小动物们买些营养的饲料吧！~",null,null],[2039,"npc7_text","离我远点...","离我远点...",null,null],[2040,"npc8_text","你瞅啥？","你瞅啥？",null,null],[2041,"npc9_text","瞅你咋的？","瞅你咋的？",null,null],[2042,"npc8_name","吵架中的男巨人","男巨人",null,null],[2043,"npc9_name","吵架中的女巨人","女巨人",null,null],[2044,"npc1_talk_text24","换上至少5次广场上的服装，我将给予你3颗蓝宝石作为奖励。","换上至少5次广场上的服装，我将给予你3颗蓝宝石作为奖励。",null,null],[2045,"npc1_talk_text25","骑乘至少1次向导-胖达，我将给予你1颗蓝宝石作为奖励。","骑乘至少1次向导-胖达，我将给予你1颗蓝宝石作为奖励。",null,null],[2046,"npc1_talk_text26","累计举起任意NPC至少3次，我将给予你3颗蓝宝石作为奖励。","累计举起任意NPC至少3次，我将给予你3颗蓝宝石作为奖励。",null,null],[2047,"npc1_talk_text27","找到我之前丢在某处的背包，我将给予你5颗蓝宝石作为奖励。","找到我之前丢在某处的背包，我将给予你5颗蓝宝石作为奖励。",null,null],[2048,"guide_talk_text1","吼~~！！(火龙王似乎很兴奋)","吼~~！！(火龙王似乎很兴奋)",null,null],[2049,"guide_talk_text2","救命！那条该死的火龙又来了！来自魔法学院的优秀学生啊，请帮我们赶走它！","救命！那条该死的火龙又来了！来自魔法学院的优秀学生啊，请帮我们赶走它！",null,null],[2050,"guide_talk_text3","好吧，火龙王在哪里?","好吧，火龙王在哪里?",null,null],[2051,"guide_talk_text4","不了，我只是来参观的","不了，我只是来参观的",null,null],[2052,"guide_talk_text5","火龙王位于一座巨大藤蔓的顶部。使用战斗法杖赶走它吧！","火龙王位于一座巨大藤蔓的顶部。使用战斗法杖赶走它吧！",null,null],[2053,"guide_talk_text6","求求你，击败火龙王会得到远高于其他任务的蓝宝石，这可是能用来购买稀有时装的好东西！你真的不考虑下吗？","求求你，击败火龙王会得到远高于其他任务的蓝宝石，这可是能用来购买稀有时装的好东西！你真的不考虑下吗？",null,null],[2054,"guide_talk_text7","大致了解了","大致了解了",null,null],[2055,"guide_talk_text8","精灵是什么？","精灵是什么？",null,null],[2056,"guide_talk_text9","真的不考虑","真的不考虑",null,null],[2057,"guide_talk_text10","那就快出发吧！对了，可以使用传送口快速到达藤蔓底部哦!","那就快出发吧！对了，可以使用传送口快速到达藤蔓底部哦!",null,null],[2058,"guide_talk_text11","精灵会帮助你攻击火龙王，你可以同时契约2只精灵，但每只精灵只能使用3分钟哦！","精灵会帮助你攻击火龙王，你可以同时契约2只精灵，但每只精灵只能使用3分钟哦！",null,null],[2059,"guide_talk_text12","这是力量精灵，它伤害很高但是动作较慢。它们经常在藤蔓区域活动。","这是力量精灵，它伤害很高但是动作较慢。它们经常在藤蔓区域活动。",null,null],[2060,"guide_talk_text13","这是敏捷精灵，它的特点是动作快，但是伤害较低。同样的，他们也活动于藤蔓区域哦！","这是敏捷精灵，它的特点是动作快，但是伤害较低。同样的，他们也活动于藤蔓区域哦！",null,null],[2061,"guide_talk_text14","这样吗...那好吧，火龙王我们会自己想办法，请好好享受游玩时光~可以找我接取些日常任务，也是可以获得蓝宝石的哦~","这样吗...那好吧，火龙王我们会自己想办法，请好好享受游玩时光~可以找我接取些日常任务，也是可以获得蓝宝石的哦~",null,null],[2062,"guide_talk_text15","好的我出发了","好的我出发了","好的我出发了",null],[2063,"guide_talk_text16","没听懂，重新说一遍","没听懂，重新说一遍","没听懂，重新说一遍",null],[2064,"guide_talk_text17","火龙王即将释放火球，快闪开！","火龙王即将释放火球，快闪开！","火龙王即将释放火球，快闪开！",null],[2065,"guide_talk_text18","火龙王即将释放龙之吐息，快闪开！","火龙王即将释放龙之吐息，快闪开！","火龙王即将释放龙之吐息，快闪开！",null],[2066,"guide_talk_text19","火龙王即将释放野蛮冲撞，快闪开！","火龙王即将释放野蛮冲撞，快闪开！","火龙王即将释放野蛮冲撞，快闪开！",null],[2067,"guide_talk_text20","火龙王即将释放龙卷风，快闪开！","火龙王即将释放龙卷风，快闪开！","火龙王即将释放龙卷风，快闪开！",null],[2068,"guide_talk_text21","吼~~！！！(火龙王很痛苦，迅速飞走了...)","吼~~！！！(火龙王很痛苦，迅速飞走了...)","吼~~！！！(火龙王很痛苦，迅速飞走了...)",null],[2069,"guide_talk_text22","众人齐心协力，击退了火龙王","众人齐心协力，击退了火龙王","众人齐心协力，击退了火龙王",null],[2070,"guide_talk_text23","多亏你，勇士！一路上辛苦了，快来找我，我给你介绍我们这的特色！","多亏你，勇士！一路上辛苦了，快来找我，我给你介绍我们这的特色！","多亏你，勇士！一路上辛苦了，快来找我，我给你介绍我们这的特色！",null],[2071,"guide_talk_text24","火龙王似乎很无聊，缓缓飞走了...","火龙王似乎很无聊，缓缓飞走了...","火龙王似乎很无聊，缓缓飞走了...",null],[2072,"guide_talk_text25","谢天谢地，这该死的龙终于走了。一路上辛苦了，快来找我，我给你介绍我们这的特色！","谢天谢地，这该死的龙终于走了。一路上辛苦了，快来找我，我给你介绍我们这的特色！","谢天谢地，这该死的龙终于走了。一路上辛苦了，快来找我，我给你介绍我们这的特色！",null],[2073,"guide_talk_text26","让力量精灵跟随","让力量精灵跟随","让力量精灵跟随",null],[2074,"guide_talk_text27","让敏捷精灵跟随","让敏捷精灵跟随","让敏捷精灵跟随",null],[2075,"guide_talk_text28","与力量精灵签订契约，它将跟随你3分钟","与力量精灵签订契约，它将跟随你3分钟","与力量精灵签订契约，它将跟随你3分钟",null],[2076,"guide_talk_text29","与敏捷精灵签订契约，它将跟随你3分钟","与敏捷精灵签订契约，它将跟随你3分钟","与敏捷精灵签订契约，它将跟随你3分钟",null],[2077,"guide_talk_text30","与力量精灵契约已满3分钟，它回去了...","与力量精灵契约已满3分钟，它回去了...","与力量精灵契约已满3分钟，它回去了...",null],[2078,"guide_talk_text31","与敏捷精灵契约已满3分钟，它回去了...","与敏捷精灵契约已满3分钟，它回去了...","与敏捷精灵契约已满3分钟，它回去了...",null],[2079,"guide_talk_text32","我马上来","我马上来","我马上来",null],[2080,"guide_talk_text33","好的","好的","好的",null],[2081,"npc_dragon","火龙王","火龙王","火龙王",null],[2082,"guide_talk_text34","对了，藤蔓上寄宿着很多精灵，也许他们会对你有所帮助！","对了，藤蔓上寄宿着很多精灵，也许他们会对你有所帮助！","对了，藤蔓上寄宿着很多精灵，也许他们会对你有所帮助！",null],[2083,"guide_talk_text35","不要放弃，勇士！我已将你传送到安全的地方，在这里你将不会受到伤害。休整片刻就请再次出发吧！","不要放弃，勇士！我已将你传送到安全的地方，在这里你将不会受到伤害。休整片刻就请再次出发吧！","不要放弃，勇士！我已将你传送到安全的地方，在这里你将不会受到伤害。休整片刻就请再次出发吧！",null],[2084,"npc1_talk_text28","击杀藤蔓顶部的火龙王，我将给予你20颗蓝宝石作为奖励。","击杀藤蔓顶部的火龙王，我将给予你20颗蓝宝石作为奖励。","击杀藤蔓顶部的火龙王，我将给予你20颗蓝宝石作为奖励。",null],[2085,"riped_npcname","被绑架的npc","被绑架的npc",null,null],[3001,"monster_talk_1","发现入侵者！","发现入侵者！","发现入侵者！",null],[3002,"monster_talk_2","绝不放过任何可疑人士！","绝不放过任何可疑人士！","绝不放过任何可疑人士！",null],[3003,"leader_talk_1","让你见识下香蕉组组长的厉害！~","让你见识下香蕉组组长的厉害！~","让你见识下香蕉组组长的厉害！~",null],[3004,"leader_talk_2","真是一群靠不住的家伙...","真是一群靠不住的家伙...","真是一群靠不住的家伙...",null],[3005,"boss_talk_1","你居然能找到这里，是我小看你了！","你居然能找到这里，是我小看你了！","你居然能找到这里，是我小看你了！",null],[3006,"boss_talk_2","我就是香蕉组老大，不许笑！","我就是香蕉组老大，不许笑！","我就是香蕉组老大，不许笑！",null],[3007,"boss_hurt_talk1","呜哇，疼疼疼，你来真的啊？？","呜哇，疼疼疼，你来真的啊？？","呜哇，疼疼疼，你来真的啊？？",null],[3008,"boss_hurt_talk2","认输了认输了，不打了QAQ","认输了认输了，不打了QAQ","认输了认输了，不打了QAQ",null],[3009,"boss_hurt_talk3","别打了别打了，我再也不干坏事啦~~","别打了别打了，我再也不干坏事啦~~","别打了别打了，我再也不干坏事啦~~",null],[3010,"boss_dead_talk","我一定会回来的！~~","我一定会回来的！~~","我一定会回来的！~~",null],[3011,"shop_talk_1","欢迎参观香蕉组老大的私人车库！~","欢迎参观香蕉组老大的私人车库！~","欢迎参观香蕉组老大的私人车库！~",null],[3012,"guide_npc_text1","这里就是香蕉组的秘密基地了，赶快去教训这群无恶不作的坏蛋吧！","这里就是香蕉组的秘密基地了，赶快去教训这群无恶不作的坏蛋吧！","这里就是香蕉组的秘密基地了，赶快去教训这群无恶不作的坏蛋吧！",null],[3013,"guide_npc_text2","香蕉组头目就藏在这座基地的最深处，去把他揪出来！","香蕉组头目就藏在这座基地的最深处，去把他揪出来！","香蕉组头目就藏在这座基地的最深处，去把他揪出来！",null],[3014,"guide_boss_text1","“欸嘿嘿嘿”","“欸嘿嘿嘿”","“欸嘿嘿嘿”",null],[3015,"guide_boss_text2","听说有人想教训我？有胆量就来吧，我在办公室等你哦~","听说有人想教训我？有胆量就来吧，我在办公室等你哦~","听说有人想教训我？有胆量就来吧，我在办公室等你哦~",null],[3016,"monster_name1","组员","组员","组员",null],[3017,"monster_name2","组长—白猴","组长—白猴","组长—白猴",null],[3018,"monster_name3","组长—黄猴","组长—黄猴","组长—黄猴",null],[3019,"monster_name4","头目","头目","头目",null],[3020,"guide_bossroom_enter","你居然能找到这里，是我小看你了！","你居然能找到这里，是我小看你了！","你居然能找到这里，是我小看你了！",null],[3021,"guide_boss_dead","我一定会回来的...额啊~~","我一定会回来的...额啊~~","我一定会回来的...额啊~~",null],[3022,"npc_name_system","Mysterious Voice","神秘的声音","神秘的声音",null],[3023,"npc_name_system_tip1","金库的封印解开了...","金库的封印解开了...","金库的封印解开了...",null],[3024,"npc_name_system_tip2","头目的车库现在可以进入了...","头目的车库现在可以进入了...","头目的车库现在可以进入了...",null],[3025,"npc_name_system_tip3","还有几{0}s复活","还有几{0}s复活","还有几{0}s复活",null],[5001,"npc1_name_space","Luna","狸月","狸月",null],[5002,"npc1_talk_space","Follow in the footsteps of Luna, and let's dance together!","跟随狸月的脚步，一起跳舞吧~","跟随狸月的脚步，一起跳舞吧~",null],[5003,"npc2_name_space","Luna","狸月","狸月",null],[5004,"npc2_talk_space","Daytime me or nighttime me, which do you prefer?","白天的我，和夜晚的我，你更喜欢谁？","白天的我，和夜晚的我，你更喜欢谁？",null],[5005,"Tips_1001","You're switching too fast!","你切换太快了！",null,null],[5006,"Tips_1002","You can't use Duo Actions in the universe.","宇宙内无法使用双人动作",null,null],[5007,"Tips_12","Please cancel your transformation first.","请先解除变身状态",null,null],[5008,"Tips_13","You can't change costumes while you're transformed","变身状态下无法更换服装",null,null],[5009,"Tips_1003","This item needs to be purchased at Magic School","该物品需要在梦幻魔法学院购买",null,null],[5010,"Tips_1004","This item can only be obtained by participating in events","该物品需要参与活动才能获得",null,null],[5011,"Tips_1005","Insufficient diamonds","钻石不足",null,null],[5012,"Tips_1006","This item cannot be purchased","该服装无法购买",null,null],[5013,"Tips_1007","Purchase at Magic School","梦幻魔法学院购买",null,null],[5014,"Tips_1008","No methods to get this item","暂无途径获取",null,null],[5015,"Text_Text_984","Purchase Limit {0}/{1}","限购次数 {0}/{1}",null,null],[5016,"Tips_17","Buy at least one","最少购买一个",null,null],[5017,"Tips_18","No more","没有更多了",null,null],[5018,"Tips_1009","You have entered the space station.","你已经进入空间站",null,null],[5019,"Tips_1010","You have entered the cosmic zone.","你已经进入宇宙区域",null,null],[5020,"Tips_1011","You have reached the border area. Explore later.","已到达空间站边界区域，以后再来探索吧",null,null],[5021,"Tips_1012","This item cannot be used in this area.","当前区域无法使用该道具",null,null],[5022,"Tips_1013","You already have this item!","你已拥有该道具",null,null],[5023,"Tips_1014","Successfully purchased item: {0}","成功购买了道具:{0}",null,null],[5024,"Tips_1015","Auto-attack Enabled","已开启自动攻击",null,null],[5025,"Tips_1016","Auto-attack Disabled","已关闭自动攻击",null,null],[5026,"Tips_1017","Loading.","正在搭载:",null,null],[5027,"Tips_1018","Quit loading","已退出搭载",null,null],[5028,"Tips_1019","30 seconds of usage time left!","还剩30秒的使用时间！",null,null],[5029,"SettingUI_tex_2","Input is not legal ！！！！","输入不合法！！！！",null,null],[5030,"Tips_1020","The UFO is watching you!","UFO似乎盯上你了!",null,null],[5031,"Tips_1021","CRIT","暴击",null,null],[5032,"Tips_1022","Space station Entrance","空间站 入口",null,null],[5033,"Tips_1023","Under the protection of the Magic School, you are about to resurrect:","受到来自魔法校园的庇护，你即将复活：",null,null],[5034,"Tips_1024","{0}s left to teleport back to campus.","还有{0}s传送回校园",null,null],[5035,"Tips_1025","Teleporting...","传送中",null,null],[5036,"Tips_1026","Do you want to return to Magic Campus?","要回到梦幻魔法校园吗？",null,null],[5037,"Tips_1027","{0} has reached the lease time. Please re-rent.","{0}已达租赁时间，请重新租借。",null,null],[5038,"Tips_1028","Mysterious Voice","神秘的声音",null,null],[5039,"Tips_1029","Dropped Item: {0}","已经丢弃了道具:{0}",null,null]];
export interface ISquareLanguageElement extends IElementBase{
 	/**id*/
	ID:number
	/**undefined*/
	Name:string
	/**英文*/
	Value:string
 } 
export class SquareLanguageConfig extends ConfigBase<ISquareLanguageElement>{
	constructor(){
		super(EXCELDATA);
	}
	/**单人*/
	get Danmu_Content_1001():ISquareLanguageElement{return this.getElement(100001)};
	/**双人*/
	get Danmu_Content_1002():ISquareLanguageElement{return this.getElement(100002)};
	/**道具*/
	get Danmu_Content_1003():ISquareLanguageElement{return this.getElement(100003)};
	/**拥抱*/
	get Danmu_Content_1019():ISquareLanguageElement{return this.getElement(100019)};
	/**公主抱*/
	get Danmu_Content_1020():ISquareLanguageElement{return this.getElement(100020)};
	/**背人*/
	get Danmu_Content_1021():ISquareLanguageElement{return this.getElement(100021)};
	/**举起*/
	get Danmu_Content_1022():ISquareLanguageElement{return this.getElement(100022)};
	/**肩扛*/
	get Danmu_Content_1023():ISquareLanguageElement{return this.getElement(100023)};
	/**托人*/
	get Danmu_Content_1024():ISquareLanguageElement{return this.getElement(100024)};
	/**我再想想*/
	get Danmu_Content_1049():ISquareLanguageElement{return this.getElement(100049)};
	/**你已经在这里了*/
	get Danmu_Content_1050():ISquareLanguageElement{return this.getElement(100050)};
	/**对不起，这里已经有人了*/
	get Danmu_Content_1051():ISquareLanguageElement{return this.getElement(100051)};
	/**距离有点远......*/
	get Danmu_Content_1052():ISquareLanguageElement{return this.getElement(100052)};
	/**请先离开当前玩家*/
	get Danmu_Content_1053():ISquareLanguageElement{return this.getElement(100053)};
	/**脱离*/
	get Danmu_Content_1054():ISquareLanguageElement{return this.getElement(100054)};
	/**音乐列表*/
	get Danmu_Content_1055():ISquareLanguageElement{return this.getElement(100055)};
	/**灯光列表*/
	get Danmu_Content_1056():ISquareLanguageElement{return this.getElement(100056)};
	/**解除*/
	get Danmu_Content_1057():ISquareLanguageElement{return this.getElement(100057)};
	/**音乐*/
	get Danmu_Content_1058():ISquareLanguageElement{return this.getElement(100058)};
	/**灯光*/
	get Danmu_Content_1059():ISquareLanguageElement{return this.getElement(100059)};
	/**当前正在双人动作，无法发起！*/
	get Danmu_Content_1060():ISquareLanguageElement{return this.getElement(100060)};
	/**前方区域正在施工建设中！敬请期待！*/
	get Danmu_Content_1061():ISquareLanguageElement{return this.getElement(100061)};
	/**灯光开关*/
	get Danmu_Content_1062():ISquareLanguageElement{return this.getElement(100062)};
	/**音响开关*/
	get Danmu_Content_1063():ISquareLanguageElement{return this.getElement(100063)};
	/**请卸下当前道具！*/
	get Danmu_Content_1064():ISquareLanguageElement{return this.getElement(100064)};
	/**请脱离当前交互物！*/
	get Danmu_Content_1065():ISquareLanguageElement{return this.getElement(100065)};
	/**跟着节奏扭起来！*/
	get Danmu_Content_1066():ISquareLanguageElement{return this.getElement(100066)};
	/**切换舞蹈*/
	get Danmu_Content_1067():ISquareLanguageElement{return this.getElement(100067)};
	/**请脱离当前动作！*/
	get Danmu_Content_1068():ISquareLanguageElement{return this.getElement(100068)};
	/**双方距离过远，无法交互！*/
	get Danmu_Content_1069():ISquareLanguageElement{return this.getElement(100069)};
	/**当前玩家处于双人动作中！*/
	get Danmu_Content_1070():ISquareLanguageElement{return this.getElement(100070)};
	/**向周围玩家发起成功，等待对方接受*/
	get Danmu_Content_1071():ISquareLanguageElement{return this.getElement(100071)};
	/**当前范围内无可交互玩家*/
	get Danmu_Content_1072():ISquareLanguageElement{return this.getElement(100072)};
	/**接受*/
	get Danmu_Content_1073():ISquareLanguageElement{return this.getElement(100073)};
	/**拒绝*/
	get Danmu_Content_1074():ISquareLanguageElement{return this.getElement(100074)};
	/**向您发起了*/
	get Danmu_Content_1075():ISquareLanguageElement{return this.getElement(100075)};
	/**动作请求*/
	get Danmu_Content_1076():ISquareLanguageElement{return this.getElement(100076)};
	/**你好*/
	get Danmu_Content_1077():ISquareLanguageElement{return this.getElement(100077)};
	/**不*/
	get Danmu_Content_1078():ISquareLanguageElement{return this.getElement(100078)};
	/**今天天气怎么样*/
	get Danmu_Content_1079():ISquareLanguageElement{return this.getElement(100079)};
	/**你好啊*/
	get Danmu_Content_1080():ISquareLanguageElement{return this.getElement(100080)};
	/**跟随*/
	get Danmu_Content_1081():ISquareLanguageElement{return this.getElement(100081)};
	/**跳个舞吧*/
	get Danmu_Content_1082():ISquareLanguageElement{return this.getElement(100082)};
	/**唱个歌吧*/
	get Danmu_Content_1083():ISquareLanguageElement{return this.getElement(100083)};
	/**今天天气非常棒！*/
	get Danmu_Content_1084():ISquareLanguageElement{return this.getElement(100084)};
	/**你好，很高兴认识你*/
	get Danmu_Content_1085():ISquareLanguageElement{return this.getElement(100085)};
	/**欢迎来到233广场！在这里您可以叫上好朋友，来一场无忧无虑的游戏之旅吧！*/
	get Danmu_Content_1086():ISquareLanguageElement{return this.getElement(100086)};
	/**这里是【摇杆】，左手拖动【摇杆】进行移动*/
	get Danmu_Content_1087():ISquareLanguageElement{return this.getElement(100087)};
	/**这里是【跳跃】，右手点击【跳跃】进行跳跃*/
	get Danmu_Content_1088():ISquareLanguageElement{return this.getElement(100088)};
	/**这里是您的【动作】列表，里面有丰富的单双人动作，您可以点击【动作】按钮进入使用*/
	get Danmu_Content_1089():ISquareLanguageElement{return this.getElement(100089)};
	/**这里是您的【背包】列表，里面有各类炫酷道具，您可以点击【背包】按钮进入使用*/
	get Danmu_Content_1090():ISquareLanguageElement{return this.getElement(100090)};
	/**点击屏幕继续*/
	get Danmu_Content_1091():ISquareLanguageElement{return this.getElement(100091)};
	/**点击屏幕结束引导*/
	get Danmu_Content_1092():ISquareLanguageElement{return this.getElement(100092)};
	/**进入剧院*/
	get Danmu_Content_1093():ISquareLanguageElement{return this.getElement(100093)};
	/**离开剧院*/
	get Danmu_Content_1094():ISquareLanguageElement{return this.getElement(100094)};
	/**你好~*/
	get Danmu_Content_1095():ISquareLanguageElement{return this.getElement(100095)};
	/**哈哈哈*/
	get Danmu_Content_1096():ISquareLanguageElement{return this.getElement(100096)};
	/**一起玩吧*/
	get Danmu_Content_1097():ISquareLanguageElement{return this.getElement(100097)};
	/**很高兴认识你*/
	get Danmu_Content_1098():ISquareLanguageElement{return this.getElement(100098)};
	/**好呀*/
	get Danmu_Content_1099():ISquareLanguageElement{return this.getElement(100099)};
	/**下次再见*/
	get Danmu_Content_1100():ISquareLanguageElement{return this.getElement(100100)};
	/**广场引导员*/
	get Danmu_Content_1101():ISquareLanguageElement{return this.getElement(100101)};
	/**警察*/
	get Danmu_Content_1102():ISquareLanguageElement{return this.getElement(100102)};
	/**服务员*/
	get Danmu_Content_1103():ISquareLanguageElement{return this.getElement(100103)};
	/**一起来*/
	get Danmu_Content_1104():ISquareLanguageElement{return this.getElement(100104)};
	/**跳舞*/
	get Danmu_Content_1105():ISquareLanguageElement{return this.getElement(100105)};
	/**村民*/
	get Danmu_Content_1106():ISquareLanguageElement{return this.getElement(100106)};
	/**开始输入*/
	get Danmu_Content_1107():ISquareLanguageElement{return this.getElement(100107)};
	/**恢复居民身份*/
	get Danmu_Content_1108():ISquareLanguageElement{return this.getElement(100108)};
	/**老板*/
	get Danmu_Content_1109():ISquareLanguageElement{return this.getElement(100109)};
	/**服务员*/
	get Danmu_Content_1110():ISquareLanguageElement{return this.getElement(100110)};
	/**销售员*/
	get Danmu_Content_1111():ISquareLanguageElement{return this.getElement(100111)};
	/**接待员*/
	get Danmu_Content_1112():ISquareLanguageElement{return this.getElement(100112)};
	/**舞者*/
	get Danmu_Content_1113():ISquareLanguageElement{return this.getElement(100113)};
	/**厨师*/
	get Danmu_Content_1114():ISquareLanguageElement{return this.getElement(100114)};
	/**警察*/
	get Danmu_Content_1115():ISquareLanguageElement{return this.getElement(100115)};
	/**保安*/
	get Danmu_Content_1116():ISquareLanguageElement{return this.getElement(100116)};
	/**救生员*/
	get Danmu_Content_1117():ISquareLanguageElement{return this.getElement(100117)};
	/**修改身份成功*/
	get Danmu_Content_1118():ISquareLanguageElement{return this.getElement(100118)};
	/**点击右侧按钮输入您的身份*/
	get Danmu_Content_1119():ISquareLanguageElement{return this.getElement(100119)};
	/**名称*/
	get Danmu_Content_1120():ISquareLanguageElement{return this.getElement(100120)};
	/**穿戴*/
	get Danmu_Content_1121():ISquareLanguageElement{return this.getElement(100121)};
	/**卸下*/
	get Danmu_Content_1122():ISquareLanguageElement{return this.getElement(100122)};
	/**ID*/
	get Danmu_Content_1123():ISquareLanguageElement{return this.getElement(100123)};
	/**今天是吃汉堡还是甜品呢?*/
	get Danmu_Content_1124():ISquareLanguageElement{return this.getElement(100124)};
	/**一个汉堡50刀？让汉堡吃我吧！*/
	get Danmu_Content_1125():ISquareLanguageElement{return this.getElement(100125)};
	/**招牌*/
	get Danmu_Content_1126():ISquareLanguageElement{return this.getElement(100126)};
	/**我们不是泡泡玛特，我们是泡泡玛客！*/
	get Danmu_Content_1127():ISquareLanguageElement{return this.getElement(100127)};
	/**扮演老板*/
	get Danmu_Content_1128():ISquareLanguageElement{return this.getElement(100128)};
	/**尝试和“顾客”打招呼吧：“您想在汉堡里加份沙门氏菌吗？”*/
	get Danmu_Content_1129():ISquareLanguageElement{return this.getElement(100129)};
	/**老板跑路了，这家店就暂且托付给你了。*/
	get Danmu_Content_1130():ISquareLanguageElement{return this.getElement(100130)};
	/**汉堡是不是可以重新定个价？*/
	get Danmu_Content_1131():ISquareLanguageElement{return this.getElement(100131)};
	/**关店*/
	get Danmu_Content_1132():ISquareLanguageElement{return this.getElement(100132)};
	/**今天的营业额还没完成，不许下班>o<*/
	get Danmu_Content_1133():ISquareLanguageElement{return this.getElement(100133)};
	/**嘿，哥们，重量太轻了！*/
	get Danmu_Content_1134():ISquareLanguageElement{return this.getElement(100134)};
	/**应聘私教*/
	get Danmu_Content_1135():ISquareLanguageElement{return this.getElement(100135)};
	/**如果你的会员一口气做了80个引体向上，你会说什么——“真厉害”？太逊了！*/
	get Danmu_Content_1136():ISquareLanguageElement{return this.getElement(100136)};
	/**姚明的教练会比姚明更强吗？*/
	get Danmu_Content_1137():ISquareLanguageElement{return this.getElement(100137)};
	/**塑形课程*/
	get Danmu_Content_1138():ISquareLanguageElement{return this.getElement(100138)};
	/**去网上搜搜刘畊宏健身操，没准比买私教课更管用！*/
	get Danmu_Content_1139():ISquareLanguageElement{return this.getElement(100139)};
	/**你更喜欢HITT还是HICT？听不懂吧哈哈，我是故意的。*/
	get Danmu_Content_1140():ISquareLanguageElement{return this.getElement(100140)};
	/**胖胖的也很可爱*/
	get Danmu_Content_1141():ISquareLanguageElement{return this.getElement(100141)};
	/**别担心，你一点都不胖。*/
	get Danmu_Content_1142():ISquareLanguageElement{return this.getElement(100142)};
	/**接着奏乐接着舞！*/
	get Danmu_Content_1143():ISquareLanguageElement{return this.getElement(100143)};
	/**我是舞王！*/
	get Danmu_Content_1144():ISquareLanguageElement{return this.getElement(100144)};
	/**跳舞机大魔王~*/
	get Danmu_Content_1145():ISquareLanguageElement{return this.getElement(100145)};
	/**我好饿，你会做好吃的吗？*/
	get Danmu_Content_1146():ISquareLanguageElement{return this.getElement(100146)};
	/**好呀*/
	get Danmu_Content_1147():ISquareLanguageElement{return this.getElement(100147)};
	/**好呀*/
	get Danmu_Content_1148():ISquareLanguageElement{return this.getElement(100148)};
	/**好呀*/
	get Danmu_Content_1149():ISquareLanguageElement{return this.getElement(100149)};
	/**想吃爆米花*/
	get Danmu_Content_1150():ISquareLanguageElement{return this.getElement(100150)};
	/**想喝可乐*/
	get Danmu_Content_1151():ISquareLanguageElement{return this.getElement(100151)};
	/**想吃烤串*/
	get Danmu_Content_1152():ISquareLanguageElement{return this.getElement(100152)};
	/**机甲赛高！*/
	get Danmu_Content_1153():ISquareLanguageElement{return this.getElement(100153)};
	/**我就是高达！！！*/
	get Danmu_Content_1154():ISquareLanguageElement{return this.getElement(100154)};
	/**我本是显赫世家的奥特曼，却被诡计多端的怪兽所害！奥特曼家族弃我！奥特之父逐我！甚至断我伽马射线！重生一世，我定要让伤害我的人付出血的代价！*/
	get Danmu_Content_1155():ISquareLanguageElement{return this.getElement(100155)};
	/**注意安全,水深危险*/
	get Danmu_Content_1156():ISquareLanguageElement{return this.getElement(100156)};
	/**全场2元全场2元*/
	get Danmu_Content_1157():ISquareLanguageElement{return this.getElement(100157)};
	/**抢劫*/
	get Danmu_Content_1158():ISquareLanguageElement{return this.getElement(100158)};
	/**你还是先去健身房练练再来吧*/
	get Danmu_Content_1159():ISquareLanguageElement{return this.getElement(100159)};
	/**我是警察！*/
	get Danmu_Content_1160():ISquareLanguageElement{return this.getElement(100160)};
	/**我可以入伙吗？*/
	get Danmu_Content_1161():ISquareLanguageElement{return this.getElement(100161)};
	/**扮演老板*/
	get Danmu_Content_1162():ISquareLanguageElement{return this.getElement(100162)};
	/**上一个家伙当了五分钟老板就跑了*/
	get Danmu_Content_1163():ISquareLanguageElement{return this.getElement(100163)};
	/**好好纳税！*/
	get Danmu_Content_1164():ISquareLanguageElement{return this.getElement(100164)};
	/**收银员在店铺外面是不是有点奇怪？*/
	get Danmu_Content_1165():ISquareLanguageElement{return this.getElement(100165)};
	/**有序排队，不要拥挤*/
	get Danmu_Content_1166():ISquareLanguageElement{return this.getElement(100166)};
	/**......*/
	get Danmu_Content_1167():ISquareLanguageElement{return this.getElement(100167)};
	/**你可以带着道具上去，这样的话，远远一看，比较像两个人在一起坐摩天轮*/
	get Danmu_Content_1168():ISquareLanguageElement{return this.getElement(100168)};
	/**有同伴*/
	get Danmu_Content_1169():ISquareLanguageElement{return this.getElement(100169)};
	/**恭喜你找到了朋友！*/
	get Danmu_Content_1170():ISquareLanguageElement{return this.getElement(100170)};
	/**两人同行，票价减半~*/
	get Danmu_Content_1171():ISquareLanguageElement{return this.getElement(100171)};
	/**摩天轮转到最高处的时候，风景真的很美*/
	get Danmu_Content_1172():ISquareLanguageElement{return this.getElement(100172)};
	/**单身*/
	get Danmu_Content_1173():ISquareLanguageElement{return this.getElement(100173)};
	/**Taylor*/
	get Danmu_Content_1174():ISquareLanguageElement{return this.getElement(100174)};
	/**Glen*/
	get Danmu_Content_1175():ISquareLanguageElement{return this.getElement(100175)};
	/**James*/
	get Danmu_Content_1176():ISquareLanguageElement{return this.getElement(100176)};
	/**Nancy*/
	get Danmu_Content_1177():ISquareLanguageElement{return this.getElement(100177)};
	/**Alice*/
	get Danmu_Content_1178():ISquareLanguageElement{return this.getElement(100178)};
	/**Anne*/
	get Danmu_Content_1179():ISquareLanguageElement{return this.getElement(100179)};
	/**Harvey*/
	get Danmu_Content_1180():ISquareLanguageElement{return this.getElement(100180)};
	/**Fiona*/
	get Danmu_Content_1181():ISquareLanguageElement{return this.getElement(100181)};
	/**Solomon*/
	get Danmu_Content_1182():ISquareLanguageElement{return this.getElement(100182)};
	/**健身私教*/
	get Danmu_Content_1183():ISquareLanguageElement{return this.getElement(100183)};
	/**文本有违禁词，请重新输入*/
	get Danmu_Content_1184():ISquareLanguageElement{return this.getElement(100184)};
	/**数量达到上限*/
	get Danmu_Content_1366():ISquareLanguageElement{return this.getElement(100366)};
	/**快捷栏已满*/
	get Danmu_Content_1367():ISquareLanguageElement{return this.getElement(100367)};
	/**快捷栏已满，道具已放入背包*/
	get Danmu_Content_1368():ISquareLanguageElement{return this.getElement(100368)};
	/**附近无可接受玩家*/
	get Danmu_Content_1369():ISquareLanguageElement{return this.getElement(100369)};
	/**向你给予*/
	get Danmu_Content_1370():ISquareLanguageElement{return this.getElement(100370)};
	/**当前活动*/
	get Text_Text_1():ISquareLanguageElement{return this.getElement(1)};
	/**即将开始*/
	get Text_Text_2():ISquareLanguageElement{return this.getElement(2)};
	/**活动{0}秒后开始*/
	get Text_Text_3():ISquareLanguageElement{return this.getElement(3)};
	/**距离活动结束：{0}*/
	get Text_Text_4():ISquareLanguageElement{return this.getElement(4)};
	/**点击前往参与【{0}】*/
	get Text_Text_5():ISquareLanguageElement{return this.getElement(5)};
	/**进行中*/
	get Text_Text_6():ISquareLanguageElement{return this.getElement(6)};
	/**即将开始*/
	get Text_Text_7():ISquareLanguageElement{return this.getElement(7)};
	/**距离结束*/
	get Text_Text_8():ISquareLanguageElement{return this.getElement(8)};
	/**距离开始*/
	get Text_Text_9():ISquareLanguageElement{return this.getElement(9)};
	/**未知*/
	get Text_Text_10():ISquareLanguageElement{return this.getElement(10)};
	/**可用倒计时：{0}秒*/
	get Text_Text_11():ISquareLanguageElement{return this.getElement(11)};
	/**音乐课*/
	get Text_Text_12():ISquareLanguageElement{return this.getElement(12)};
	/**舞蹈课*/
	get Text_Text_13():ISquareLanguageElement{return this.getElement(13)};
	/**数学课*/
	get Text_Text_14():ISquareLanguageElement{return this.getElement(14)};
	/**美术课*/
	get Text_Text_15():ISquareLanguageElement{return this.getElement(15)};
	/**语言课*/
	get Text_Text_16():ISquareLanguageElement{return this.getElement(16)};
	/**战斗魔法*/
	get Text_Text_17():ISquareLanguageElement{return this.getElement(17)};
	/**体育课*/
	get Text_Text_18():ISquareLanguageElement{return this.getElement(18)};
	/**计算机课*/
	get Text_Text_19():ISquareLanguageElement{return this.getElement(19)};
	/**自习室*/
	get Text_Text_20():ISquareLanguageElement{return this.getElement(20)};
	/**游泳课*/
	get Text_Text_21():ISquareLanguageElement{return this.getElement(21)};
	/**午餐*/
	get Text_Text_22():ISquareLanguageElement{return this.getElement(22)};
	/**校园演出*/
	get Text_Text_23():ISquareLanguageElement{return this.getElement(23)};
	/**自由活动*/
	get Text_Text_24():ISquareLanguageElement{return this.getElement(24)};
	/**篮球控制台*/
	get Text_Text_25():ISquareLanguageElement{return this.getElement(25)};
	/**休息时间*/
	get Text_Text_26():ISquareLanguageElement{return this.getElement(26)};
	/**输入你当前身份*/
	get Text_Text_27():ISquareLanguageElement{return this.getElement(27)};
	/**欢迎新同学来到魔莱坞学院*/
	get Text_Text_28():ISquareLanguageElement{return this.getElement(28)};
	/**现在跟随【箭头】到我这里来了解新生须知吧*/
	get Text_Text_29():ISquareLanguageElement{return this.getElement(29)};
	/**夜间派对*/
	get Text_Text_30():ISquareLanguageElement{return this.getElement(30)};
	/**教学楼内的课程是学校生活必不可少的一环*/
	get Text_Text_31():ISquareLanguageElement{return this.getElement(31)};
	/**在课程对应的教室内探索学习内容吧*/
	get Text_Text_32():ISquareLanguageElement{return this.getElement(32)};
	/**学园奇妙夜*/
	get Text_Text_33():ISquareLanguageElement{return this.getElement(33)};
	/**学习之外学校还准备了许多有趣的活动*/
	get Text_Text_34():ISquareLanguageElement{return this.getElement(34)};
	/**学校有许多兴趣社团，社团负责人在活动现场等着大家*/
	get Text_Text_35():ISquareLanguageElement{return this.getElement(35)};
	/**和社长聊聊看，找到你喜欢的活动吧*/
	get Text_Text_36():ISquareLanguageElement{return this.getElement(36)};
	/**作为老师要负责布置教室，找找看布置教室的魔法设备吧*/
	get Text_Text_37():ISquareLanguageElement{return this.getElement(37)};
	/**教室里有学生可以学习的内容，请教老师，多多练习吧*/
	get Text_Text_38():ISquareLanguageElement{return this.getElement(38)};
	/**拿起篮球，来一个完美三分！*/
	get Text_Text_39():ISquareLanguageElement{return this.getElement(39)};
	/**在球场上跳个舞，是暖场的最佳选择*/
	get Text_Text_40():ISquareLanguageElement{return this.getElement(40)};
	/**在DJ台控制全场节奏，也能用钢琴演奏名曲，更多乐器等待你尝试*/
	get Text_Text_41():ISquareLanguageElement{return this.getElement(41)};
	/**在舞台上展示你的舞姿吧*/
	get Text_Text_42():ISquareLanguageElement{return this.getElement(42)};
	/**咖啡厅的打工生活，忙碌但是有趣*/
	get Text_Text_43():ISquareLanguageElement{return this.getElement(43)};
	/**老师介绍1*/
	get Text_Text_44():ISquareLanguageElement{return this.getElement(44)};
	/**老师介绍2*/
	get Text_Text_45():ISquareLanguageElement{return this.getElement(45)};
	/**学生介绍1*/
	get Text_Text_46():ISquareLanguageElement{return this.getElement(46)};
	/**学生介绍2*/
	get Text_Text_47():ISquareLanguageElement{return this.getElement(47)};
	/**体育生介绍1*/
	get Text_Text_48():ISquareLanguageElement{return this.getElement(48)};
	/**体育生介绍2*/
	get Text_Text_49():ISquareLanguageElement{return this.getElement(49)};
	/**啦啦队介绍1*/
	get Text_Text_50():ISquareLanguageElement{return this.getElement(50)};
	/**啦啦队介绍2*/
	get Text_Text_51():ISquareLanguageElement{return this.getElement(51)};
	/**音乐明星介绍1*/
	get Text_Text_52():ISquareLanguageElement{return this.getElement(52)};
	/**音乐明星介绍2*/
	get Text_Text_53():ISquareLanguageElement{return this.getElement(53)};
	/**舞蹈明星介绍1*/
	get Text_Text_54():ISquareLanguageElement{return this.getElement(54)};
	/**舞蹈明星介绍2*/
	get Text_Text_55():ISquareLanguageElement{return this.getElement(55)};
	/**服务生1*/
	get Text_Text_56():ISquareLanguageElement{return this.getElement(56)};
	/**服务生2*/
	get Text_Text_57():ISquareLanguageElement{return this.getElement(57)};
	/**校霸*/
	get Text_Text_58():ISquareLanguageElement{return this.getElement(58)};
	/**杰克船长*/
	get Text_Text_59():ISquareLanguageElement{return this.getElement(59)};
	/**魔法师狸月*/
	get Text_Text_60():ISquareLanguageElement{return this.getElement(60)};
	/**校长*/
	get Text_Text_61():ISquareLanguageElement{return this.getElement(61)};
	/**奇怪的人*/
	get Text_Text_62():ISquareLanguageElement{return this.getElement(62)};
	/**校警*/
	get Text_Text_63():ISquareLanguageElement{return this.getElement(63)};
	/**看书的人*/
	get Text_Text_64():ISquareLanguageElement{return this.getElement(64)};
	/**厨师*/
	get Text_Text_65():ISquareLanguageElement{return this.getElement(65)};
	/**校园魔法师*/
	get Text_Text_66():ISquareLanguageElement{return this.getElement(66)};
	/**摄影社社长*/
	get Text_Text_67():ISquareLanguageElement{return this.getElement(67)};
	/**狸正*/
	get Text_Text_68():ISquareLanguageElement{return this.getElement(68)};
	/**打招呼*/
	get Text_Text_69():ISquareLanguageElement{return this.getElement(69)};
	/**我该做什么*/
	get Text_Text_70():ISquareLanguageElement{return this.getElement(70)};
	/**有什么课程*/
	get Text_Text_71():ISquareLanguageElement{return this.getElement(71)};
	/**战斗牧师*/
	get Text_Text_72():ISquareLanguageElement{return this.getElement(72)};
	/**你在做什么？*/
	get Text_Text_73():ISquareLanguageElement{return this.getElement(73)};
	/**在教室可以做什么*/
	get Text_Text_74():ISquareLanguageElement{return this.getElement(74)};
	/**null*/
	get Text_Text_75():ISquareLanguageElement{return this.getElement(75)};
	/**你是谁*/
	get Text_Text_76():ISquareLanguageElement{return this.getElement(76)};
	/**发生了什么事*/
	get Text_Text_77():ISquareLanguageElement{return this.getElement(77)};
	/**null*/
	get Text_Text_78():ISquareLanguageElement{return this.getElement(78)};
	/**你在做什么？*/
	get Text_Text_79():ISquareLanguageElement{return this.getElement(79)};
	/**请告诉我书名*/
	get Text_Text_80():ISquareLanguageElement{return this.getElement(80)};
	/**null*/
	get Text_Text_81():ISquareLanguageElement{return this.getElement(81)};
	/**请给我一份午餐*/
	get Text_Text_82():ISquareLanguageElement{return this.getElement(82)};
	/**我想要特别的食物*/
	get Text_Text_83():ISquareLanguageElement{return this.getElement(83)};
	/**null*/
	get Text_Text_84():ISquareLanguageElement{return this.getElement(84)};
	/**想了解校园的魔法*/
	get Text_Text_85():ISquareLanguageElement{return this.getElement(85)};
	/**在哪里能获得魔法道具*/
	get Text_Text_86():ISquareLanguageElement{return this.getElement(86)};
	/**null*/
	get Text_Text_87():ISquareLanguageElement{return this.getElement(87)};
	/**如何拍照*/
	get Text_Text_88():ISquareLanguageElement{return this.getElement(88)};
	/**请教拍摄技巧*/
	get Text_Text_89():ISquareLanguageElement{return this.getElement(89)};
	/**null*/
	get Text_Text_90():ISquareLanguageElement{return this.getElement(90)};
	/**null*/
	get Text_Text_91():ISquareLanguageElement{return this.getElement(91)};
	/**你好，需要帮助吗？*/
	get Text_Text_92():ISquareLanguageElement{return this.getElement(92)};
	/**每次课程开始时都会提供路线引导*/
	get Text_Text_93():ISquareLanguageElement{return this.getElement(93)};
	/**通过课程表可以查看今日的课程*/
	get Text_Text_94():ISquareLanguageElement{return this.getElement(94)};
	/**null*/
	get Text_Text_95():ISquareLanguageElement{return this.getElement(95)};
	/**null*/
	get Text_Text_96():ISquareLanguageElement{return this.getElement(96)};
	/**null*/
	get Text_Text_97():ISquareLanguageElement{return this.getElement(97)};
	/**null*/
	get Text_Text_98():ISquareLanguageElement{return this.getElement(98)};
	/**null*/
	get Text_Text_99():ISquareLanguageElement{return this.getElement(99)};
	/**学校里有各种各样的学生组织*/
	get Text_Text_100():ISquareLanguageElement{return this.getElement(100)};
	/**找到他们的负责人，从他们那里打听校园的秘密吧*/
	get Text_Text_101():ISquareLanguageElement{return this.getElement(101)};
	/**null*/
	get Text_Text_102():ISquareLanguageElement{return this.getElement(102)};
	/**...*/
	get Text_Text_103():ISquareLanguageElement{return this.getElement(103)};
	/**null*/
	get Text_Text_104():ISquareLanguageElement{return this.getElement(104)};
	/**null*/
	get Text_Text_105():ISquareLanguageElement{return this.getElement(105)};
	/**null*/
	get Text_Text_106():ISquareLanguageElement{return this.getElement(106)};
	/**从此刻，守护魔法校园！*/
	get Text_Text_107():ISquareLanguageElement{return this.getElement(107)};
	/**我负责维持学校的治安*/
	get Text_Text_108():ISquareLanguageElement{return this.getElement(108)};
	/**我正在寻找乱扔垃圾的违规者*/
	get Text_Text_109():ISquareLanguageElement{return this.getElement(109)};
	/**你好你好，很高兴认识你们*/
	get Text_Text_110():ISquareLanguageElement{return this.getElement(110)};
	/**null*/
	get Text_Text_111():ISquareLanguageElement{return this.getElement(111)};
	/**null*/
	get Text_Text_112():ISquareLanguageElement{return this.getElement(112)};
	/**null*/
	get Text_Text_113():ISquareLanguageElement{return this.getElement(113)};
	/**嘘~我发现了一本奇怪的书，意外找到的*/
	get Text_Text_114():ISquareLanguageElement{return this.getElement(114)};
	/**《校园的十大神秘事件》，等会给你看！*/
	get Text_Text_115():ISquareLanguageElement{return this.getElement(115)};
	/**null*/
	get Text_Text_116():ISquareLanguageElement{return this.getElement(116)};
	/**null*/
	get Text_Text_117():ISquareLanguageElement{return this.getElement(117)};
	/**走上舞台就可以跳舞了*/
	get Text_Text_118():ISquareLanguageElement{return this.getElement(118)};
	/**但是你可以在DJ台切换音乐，不同的音乐将激发你不同的舞蹈基因*/
	get Text_Text_119():ISquareLanguageElement{return this.getElement(119)};
	/**如果能解锁隐藏曲目，你也可以引导其他人学习舞蹈哦*/
	get Text_Text_120():ISquareLanguageElement{return this.getElement(120)};
	/**null*/
	get Text_Text_121():ISquareLanguageElement{return this.getElement(121)};
	/**今天的食物已经摆在吧台上了*/
	get Text_Text_122():ISquareLanguageElement{return this.getElement(122)};
	/**架子上有酒，只有成年人才可以喝哦*/
	get Text_Text_123():ISquareLanguageElement{return this.getElement(123)};
	/**我眼望星辰，终将与你相逢*/
	get Text_Text_124():ISquareLanguageElement{return this.getElement(124)};
	/**快来成为全校最受欢迎的人！*/
	get Text_Text_125():ISquareLanguageElement{return this.getElement(125)};
	/**可以在公共乐器上直接演奏*/
	get Text_Text_126():ISquareLanguageElement{return this.getElement(126)};
	/**小型乐器就可以拿在手上*/
	get Text_Text_127():ISquareLanguageElement{return this.getElement(127)};
	/**记得在音乐课上多学习哦*/
	get Text_Text_128():ISquareLanguageElement{return this.getElement(128)};
	/**只因你太美！我的球而你旋转*/
	get Text_Text_129():ISquareLanguageElement{return this.getElement(129)};
	/**校园里魔法无处不在*/
	get Text_Text_130():ISquareLanguageElement{return this.getElement(130)};
	/**魔法能够成为你的装扮，能够改变周围的环境*/
	get Text_Text_131():ISquareLanguageElement{return this.getElement(131)};
	/**但是你需要魔法道具的帮助*/
	get Text_Text_132():ISquareLanguageElement{return this.getElement(132)};
	/**立正，稍息！*/
	get Text_Text_133():ISquareLanguageElement{return this.getElement(133)};
	/**场景里布置有可以改变环境的大型魔法道具，他只在特定时间和地点出现*/
	get Text_Text_134():ISquareLanguageElement{return this.getElement(134)};
	/**同时也有一些小型道具，可以改变外观或者天气*/
	get Text_Text_135():ISquareLanguageElement{return this.getElement(135)};
	/**有个秘密，造型课教室有大量的魔法道具能让你变的闪闪发光哦*/
	get Text_Text_136():ISquareLanguageElement{return this.getElement(136)};
	/**还可以哦，哟哟！*/
	get Text_Text_137():ISquareLanguageElement{return this.getElement(137)};
	/**点击屏幕上的【相机】，就可以打开摄像机了*/
	get Text_Text_138():ISquareLanguageElement{return this.getElement(138)};
	/**世间唯有书本才能让我清醒*/
	get Text_Text_139():ISquareLanguageElement{return this.getElement(139)};
	/**摄像机有多种模式，有些模式能让你看到和平时不一样的风景哦*/
	get Text_Text_140():ISquareLanguageElement{return this.getElement(140)};
	/**更多的拍摄技巧，都靠你发挥自己的想象力了*/
	get Text_Text_141():ISquareLanguageElement{return this.getElement(141)};
	/**好好学习！*/
	get Text_Text_142():ISquareLanguageElement{return this.getElement(142)};
	/**同学你好~*/
	get Text_Text_143():ISquareLanguageElement{return this.getElement(143)};
	/**...*/
	get Text_Text_144():ISquareLanguageElement{return this.getElement(144)};
	/**请遵守校园守则*/
	get Text_Text_145():ISquareLanguageElement{return this.getElement(145)};
	/**真有趣*/
	get Text_Text_146():ISquareLanguageElement{return this.getElement(146)};
	/**来看看今天的菜谱*/
	get Text_Text_147():ISquareLanguageElement{return this.getElement(147)};
	/**魔法就是奇迹降临！*/
	get Text_Text_148():ISquareLanguageElement{return this.getElement(148)};
	/**哪里才有绝佳的拍摄视角呢*/
	get Text_Text_149():ISquareLanguageElement{return this.getElement(149)};
	/**嘿，瞧瞧这是谁？！*/
	get Text_Text_150():ISquareLanguageElement{return this.getElement(150)};
	/**卡通*/
	get Text_Text_151():ISquareLanguageElement{return this.getElement(151)};
	/**可爱*/
	get Text_Text_152():ISquareLanguageElement{return this.getElement(152)};
	/**和风*/
	get Text_Text_153():ISquareLanguageElement{return this.getElement(153)};
	/**神圣*/
	get Text_Text_154():ISquareLanguageElement{return this.getElement(154)};
	/**地狱*/
	get Text_Text_155():ISquareLanguageElement{return this.getElement(155)};
	/**摇滚*/
	get Text_Text_156():ISquareLanguageElement{return this.getElement(156)};
	/**华丽*/
	get Text_Text_157():ISquareLanguageElement{return this.getElement(157)};
	/**性感*/
	get Text_Text_158():ISquareLanguageElement{return this.getElement(158)};
	/**古典*/
	get Text_Text_159():ISquareLanguageElement{return this.getElement(159)};
	/**流行*/
	get Text_Text_160():ISquareLanguageElement{return this.getElement(160)};
	/**芭蕾*/
	get Text_Text_161():ISquareLanguageElement{return this.getElement(161)};
	/**魔法学生*/
	get Text_Text_162():ISquareLanguageElement{return this.getElement(162)};
	/**魔法老师*/
	get Text_Text_163():ISquareLanguageElement{return this.getElement(163)};
	/**音乐学生*/
	get Text_Text_164():ISquareLanguageElement{return this.getElement(164)};
	/**音乐老师*/
	get Text_Text_165():ISquareLanguageElement{return this.getElement(165)};
	/**舞蹈老师*/
	get Text_Text_166():ISquareLanguageElement{return this.getElement(166)};
	/**舞蹈学生*/
	get Text_Text_167():ISquareLanguageElement{return this.getElement(167)};
	/**造型老师*/
	get Text_Text_168():ISquareLanguageElement{return this.getElement(168)};
	/**造型学生*/
	get Text_Text_169():ISquareLanguageElement{return this.getElement(169)};
	/**篮球社员*/
	get Text_Text_170():ISquareLanguageElement{return this.getElement(170)};
	/**啦啦队*/
	get Text_Text_171():ISquareLanguageElement{return this.getElement(171)};
	/**舞蹈社员*/
	get Text_Text_172():ISquareLanguageElement{return this.getElement(172)};
	/**音乐社员*/
	get Text_Text_173():ISquareLanguageElement{return this.getElement(173)};
	/**服务生*/
	get Text_Text_174():ISquareLanguageElement{return this.getElement(174)};
	/**剩余时间*/
	get Text_Text_175():ISquareLanguageElement{return this.getElement(175)};
	/**当前主题*/
	get Text_Text_176():ISquareLanguageElement{return this.getElement(176)};
	/**场景主题选择*/
	get Text_Text_177():ISquareLanguageElement{return this.getElement(177)};
	/**切换主题太频繁，稍等一下~*/
	get Text_Text_178():ISquareLanguageElement{return this.getElement(178)};
	/**场景主题选择*/
	get Text_Text_179():ISquareLanguageElement{return this.getElement(179)};
	/**当前区域没有活动，操作台未启用*/
	get Text_Text_180():ISquareLanguageElement{return this.getElement(180)};
	/**当前不可替换主题，请耐心等待一下*/
	get Text_Text_181():ISquareLanguageElement{return this.getElement(181)};
	/**活动结束了*/
	get Text_Text_182():ISquareLanguageElement{return this.getElement(182)};
	/**已切换到{0}主题*/
	get Text_Text_183():ISquareLanguageElement{return this.getElement(183)};
	/**有趣，非常有趣！*/
	get Text_Text_184():ISquareLanguageElement{return this.getElement(184)};
	/**233广场*/
	get Text_Text_185():ISquareLanguageElement{return this.getElement(185)};
	/**动作*/
	get Text_Text_186():ISquareLanguageElement{return this.getElement(186)};
	/**表情*/
	get Text_Text_187():ISquareLanguageElement{return this.getElement(187)};
	/**滤镜*/
	get Text_Text_188():ISquareLanguageElement{return this.getElement(188)};
	/**天气*/
	get Text_Text_189():ISquareLanguageElement{return this.getElement(189)};
	/**截取屏幕保存相片，点击屏幕关闭拍照模式*/
	get Text_Text_190():ISquareLanguageElement{return this.getElement(190)};
	/**日程*/
	get Text_Text_191():ISquareLanguageElement{return this.getElement(191)};
	/**立即前往*/
	get Text_Text_192():ISquareLanguageElement{return this.getElement(192)};
	/**好热闹啊！*/
	get Text_Text_193():ISquareLanguageElement{return this.getElement(193)};
	/**魔莱坞小助理梅琳*/
	get Text_Text_194():ISquareLanguageElement{return this.getElement(194)};
	/**你是最棒的！*/
	get Text_Text_195():ISquareLanguageElement{return this.getElement(195)};
	/**成绩单*/
	get Text_Text_196():ISquareLanguageElement{return this.getElement(196)};
	/**A+*/
	get Text_Text_197():ISquareLanguageElement{return this.getElement(197)};
	/**A*/
	get Text_Text_198():ISquareLanguageElement{return this.getElement(198)};
	/**B+*/
	get Text_Text_199():ISquareLanguageElement{return this.getElement(199)};
	/**B*/
	get Text_Text_200():ISquareLanguageElement{return this.getElement(200)};
	/**C+*/
	get Text_Text_201():ISquareLanguageElement{return this.getElement(201)};
	/**C*/
	get Text_Text_202():ISquareLanguageElement{return this.getElement(202)};
	/**F*/
	get Text_Text_203():ISquareLanguageElement{return this.getElement(203)};
	/**不要盯着我看，好好游泳*/
	get Text_Text_204():ISquareLanguageElement{return this.getElement(204)};
	/**赶快给我睡觉去*/
	get Text_Text_205():ISquareLanguageElement{return this.getElement(205)};
	/**上帝*/
	get Text_Text_206():ISquareLanguageElement{return this.getElement(206)};
	/**我是世界的光,跟从我的就不在黑暗里走*/
	get Text_Text_207():ISquareLanguageElement{return this.getElement(207)};
	/**null*/
	get Text_Text_208():ISquareLanguageElement{return this.getElement(208)};
	/**得分：{0}*/
	get Text_Text_209():ISquareLanguageElement{return this.getElement(209)};
	/**1*/
	get Text_Text_210():ISquareLanguageElement{return this.getElement(210)};
	/**星期一*/
	get Text_Text_211():ISquareLanguageElement{return this.getElement(211)};
	/**星期二*/
	get Text_Text_212():ISquareLanguageElement{return this.getElement(212)};
	/**星期三*/
	get Text_Text_213():ISquareLanguageElement{return this.getElement(213)};
	/**星期四*/
	get Text_Text_214():ISquareLanguageElement{return this.getElement(214)};
	/**星期五*/
	get Text_Text_215():ISquareLanguageElement{return this.getElement(215)};
	/**星期六*/
	get Text_Text_216():ISquareLanguageElement{return this.getElement(216)};
	/**星期日*/
	get Text_Text_217():ISquareLanguageElement{return this.getElement(217)};
	/**夜晚休息中...{0}*/
	get Text_Text_218():ISquareLanguageElement{return this.getElement(218)};
	/**{0}即将开始*/
	get Text_Text_219():ISquareLanguageElement{return this.getElement(219)};
	/**下一节课是{0}，请准时参加*/
	get Text_Text_220():ISquareLanguageElement{return this.getElement(220)};
	/**今日课程表*/
	get Text_Text_221():ISquareLanguageElement{return this.getElement(221)};
	/**明日课程表*/
	get Text_Text_222():ISquareLanguageElement{return this.getElement(222)};
	/**课程达标*/
	get Text_Text_223():ISquareLanguageElement{return this.getElement(223)};
	/**缺课*/
	get Text_Text_224():ISquareLanguageElement{return this.getElement(224)};
	/**签到*/
	get Text_Text_225():ISquareLanguageElement{return this.getElement(225)};
	/**日程表*/
	get Text_Text_226():ISquareLanguageElement{return this.getElement(226)};
	/**正在进行*/
	get Text_Text_227():ISquareLanguageElement{return this.getElement(227)};
	/**未开始*/
	get Text_Text_228():ISquareLanguageElement{return this.getElement(228)};
	/**前往*/
	get Text_Text_229():ISquareLanguageElement{return this.getElement(229)};
	/**课堂成绩：*/
	get Text_Text_230():ISquareLanguageElement{return this.getElement(230)};
	/**评价*/
	get Text_Text_231():ISquareLanguageElement{return this.getElement(231)};
	/**姓名*/
	get Text_Text_232():ISquareLanguageElement{return this.getElement(232)};
	/**成绩*/
	get Text_Text_233():ISquareLanguageElement{return this.getElement(233)};
	/**分数*/
	get Text_Text_234():ISquareLanguageElement{return this.getElement(234)};
	/**比大小*/
	get Text_Text_235():ISquareLanguageElement{return this.getElement(235)};
	/**分数：*/
	get Text_Text_236():ISquareLanguageElement{return this.getElement(236)};
	/**音乐排练*/
	get Text_Text_237():ISquareLanguageElement{return this.getElement(237)};
	/**舞蹈模仿*/
	get Text_Text_238():ISquareLanguageElement{return this.getElement(238)};
	/**大小比较*/
	get Text_Text_239():ISquareLanguageElement{return this.getElement(239)};
	/**投篮练习*/
	get Text_Text_240():ISquareLanguageElement{return this.getElement(240)};
	/**红蓝足球赛*/
	get Text_Text_241():ISquareLanguageElement{return this.getElement(241)};
	/**记住你看到的图案，精准复制它！*/
	get Text_Text_242():ISquareLanguageElement{return this.getElement(242)};
	/**记住你看到的图案，精准复制它！*/
	get Text_Text_243():ISquareLanguageElement{return this.getElement(243)};
	/**观察左右数字，对比他们的大小*/
	get Text_Text_244():ISquareLanguageElement{return this.getElement(244)};
	/**把篮球投入篮筐！*/
	get Text_Text_245():ISquareLanguageElement{return this.getElement(245)};
	/**把足球踢到你所属队伍的球门（小心乌龙球）*/
	get Text_Text_246():ISquareLanguageElement{return this.getElement(246)};
	/**选取角色*/
	get Text_Text_247():ISquareLanguageElement{return this.getElement(247)};
	/**校长*/
	get Text_Text_248():ISquareLanguageElement{return this.getElement(248)};
	/**校工*/
	get Text_Text_249():ISquareLanguageElement{return this.getElement(249)};
	/**男教师*/
	get Text_Text_250():ISquareLanguageElement{return this.getElement(250)};
	/**新生*/
	get Text_Text_251():ISquareLanguageElement{return this.getElement(251)};
	/**运动员*/
	get Text_Text_252():ISquareLanguageElement{return this.getElement(252)};
	/**啦啦队员*/
	get Text_Text_253():ISquareLanguageElement{return this.getElement(253)};
	/**帮我挑选*/
	get Text_Text_254():ISquareLanguageElement{return this.getElement(254)};
	/**我会一直待在这里，如果你有问题可以随时来找我*/
	get Text_Text_255():ISquareLanguageElement{return this.getElement(255)};
	/**相信你对于学校已经有了一些了解，现在让我们来拍张照片吧*/
	get Text_Text_256():ISquareLanguageElement{return this.getElement(256)};
	/**欢迎来到Mollywood学院，期待你在这里度过一段愉快的校园生活*/
	get Text_Text_257():ISquareLanguageElement{return this.getElement(257)};
	/**课程已经开始了，快去学习吧！*/
	get Text_Text_258():ISquareLanguageElement{return this.getElement(258)};
	/**这是足球场，在这里你可以和其他玩家配合取得足球比赛的胜利*/
	get Text_Text_259():ISquareLanguageElement{return this.getElement(259)};
	/**女教师*/
	get Text_Text_260():ISquareLanguageElement{return this.getElement(260)};
	/**这是音乐教室，你可以在里面感受音乐的魅力*/
	get Text_Text_261():ISquareLanguageElement{return this.getElement(261)};
	/**null*/
	get Text_Text_262():ISquareLanguageElement{return this.getElement(262)};
	/**这是数学教室，在这里你可以和数字交朋友*/
	get Text_Text_263():ISquareLanguageElement{return this.getElement(263)};
	/**null*/
	get Text_Text_264():ISquareLanguageElement{return this.getElement(264)};
	/**这是舞蹈教室，在这里你可以展示你优雅的舞姿*/
	get Text_Text_265():ISquareLanguageElement{return this.getElement(265)};
	/**null*/
	get Text_Text_266():ISquareLanguageElement{return this.getElement(266)};
	/**这是食堂，中午你可以在里面就餐*/
	get Text_Text_267():ISquareLanguageElement{return this.getElement(267)};
	/**null*/
	get Text_Text_268():ISquareLanguageElement{return this.getElement(268)};
	/**这里是魔法教室，在这里你可以学习战斗魔法*/
	get Text_Text_269():ISquareLanguageElement{return this.getElement(269)};
	/**null*/
	get Text_Text_270():ISquareLanguageElement{return this.getElement(270)};
	/**null*/
	get Text_Text_271():ISquareLanguageElement{return this.getElement(271)};
	/**我在教学楼里等你，快过来准备上课了*/
	get Text_Text_272():ISquareLanguageElement{return this.getElement(272)};
	/**null*/
	get Text_Text_273():ISquareLanguageElement{return this.getElement(273)};
	/**现在我将教你如何参加课程,首先点击你的课程表*/
	get Text_Text_274():ISquareLanguageElement{return this.getElement(274)};
	/**夜晚派对*/
	get Text_Text_275():ISquareLanguageElement{return this.getElement(275)};
	/**然后点击前往按钮，参加课程*/
	get Text_Text_276():ISquareLanguageElement{return this.getElement(276)};
	/**null*/
	get Text_Text_277():ISquareLanguageElement{return this.getElement(277)};
	/**恭喜你完成入学指引，快去上课学习，变得更强大吧！*/
	get Text_Text_278():ISquareLanguageElement{return this.getElement(278)};
	/**你可以在和这个界面，移动和设置照相机的参数，现在点击拍照按钮吧，拍照结束后，请点击屏幕*/
	get Text_Text_279():ISquareLanguageElement{return this.getElement(279)};
	/**点击照相按钮*/
	get Text_Text_280():ISquareLanguageElement{return this.getElement(280)};
	/**现在请点击关闭按钮*/
	get Text_Text_281():ISquareLanguageElement{return this.getElement(281)};
	/**体育课*/
	get Text_Text_282():ISquareLanguageElement{return this.getElement(282)};
	/**自习室*/
	get Text_Text_283():ISquareLanguageElement{return this.getElement(283)};
	/**食堂*/
	get Text_Text_284():ISquareLanguageElement{return this.getElement(284)};
	/**语言*/
	get Text_Text_285():ISquareLanguageElement{return this.getElement(285)};
	/**数学*/
	get Text_Text_286():ISquareLanguageElement{return this.getElement(286)};
	/**魔法教室*/
	get Text_Text_287():ISquareLanguageElement{return this.getElement(287)};
	/**游泳馆*/
	get Text_Text_288():ISquareLanguageElement{return this.getElement(288)};
	/**剧场*/
	get Text_Text_289():ISquareLanguageElement{return this.getElement(289)};
	/**舞蹈*/
	get Text_Text_290():ISquareLanguageElement{return this.getElement(290)};
	/**音乐*/
	get Text_Text_291():ISquareLanguageElement{return this.getElement(291)};
	/**造物*/
	get Text_Text_292():ISquareLanguageElement{return this.getElement(292)};
	/**医疗室*/
	get Text_Text_293():ISquareLanguageElement{return this.getElement(293)};
	/**图书室*/
	get Text_Text_294():ISquareLanguageElement{return this.getElement(294)};
	/**美术*/
	get Text_Text_295():ISquareLanguageElement{return this.getElement(295)};
	/**音乐-乐理练习（3.0）*/
	get Text_Text_296():ISquareLanguageElement{return this.getElement(296)};
	/**舞蹈-团体舞（3.0）*/
	get Text_Text_297():ISquareLanguageElement{return this.getElement(297)};
	/**数学-基础数学（3.0）*/
	get Text_Text_298():ISquareLanguageElement{return this.getElement(298)};
	/**美术-素描静物（2.0）*/
	get Text_Text_299():ISquareLanguageElement{return this.getElement(299)};
	/**语言-图书阅读（2.0）*/
	get Text_Text_300():ISquareLanguageElement{return this.getElement(300)};
	/**战斗-打靶练习（3.0）*/
	get Text_Text_301():ISquareLanguageElement{return this.getElement(301)};
	/**体育课-障碍赛跑（4.0）*/
	get Text_Text_302():ISquareLanguageElement{return this.getElement(302)};
	/**计算机-动画制作（2.0）*/
	get Text_Text_303():ISquareLanguageElement{return this.getElement(303)};
	/**自习课*/
	get Text_Text_304():ISquareLanguageElement{return this.getElement(304)};
	/**游泳-高空跳水（3.0）*/
	get Text_Text_305():ISquareLanguageElement{return this.getElement(305)};
	/**午餐*/
	get Text_Text_306():ISquareLanguageElement{return this.getElement(306)};
	/**剧场时间*/
	get Text_Text_307():ISquareLanguageElement{return this.getElement(307)};
	/**自由活动*/
	get Text_Text_308():ISquareLanguageElement{return this.getElement(308)};
	/**神奇道具*/
	get Text_Text_309():ISquareLanguageElement{return this.getElement(309)};
	/**关闭*/
	get Text_Text_310():ISquareLanguageElement{return this.getElement(310)};
	/**投篮次数：*/
	get Text_Text_311():ISquareLanguageElement{return this.getElement(311)};
	/**得分：*/
	get Text_Text_312():ISquareLanguageElement{return this.getElement(312)};
	/**确认*/
	get Text_Text_313():ISquareLanguageElement{return this.getElement(313)};
	/**请问有什么事能够帮你吗？*/
	get Text_Text_314():ISquareLanguageElement{return this.getElement(314)};
	/**同学你好*/
	get Text_Text_315():ISquareLanguageElement{return this.getElement(315)};
	/**我需要你帮我去上一节课，之后再来找我吧*/
	get Text_Text_316():ISquareLanguageElement{return this.getElement(316)};
	/**那上什么课呢*/
	get Text_Text_317():ISquareLanguageElement{return this.getElement(317)};
	/**语言课吧 我不喜欢语言课*/
	get Text_Text_318():ISquareLanguageElement{return this.getElement(318)};
	/**好的*/
	get Text_Text_319():ISquareLanguageElement{return this.getElement(319)};
	/**算了 我也不喜欢上*/
	get Text_Text_320():ISquareLanguageElement{return this.getElement(320)};
	/**先谢谢你啦*/
	get Text_Text_321():ISquareLanguageElement{return this.getElement(321)};
	/**那好吧*/
	get Text_Text_322():ISquareLanguageElement{return this.getElement(322)};
	/**看来您你已经完成了任务，这把枪就送给你玩吧*/
	get Text_Text_323():ISquareLanguageElement{return this.getElement(323)};
	/**小心不要在校园里乱开枪哦*/
	get Text_Text_324():ISquareLanguageElement{return this.getElement(324)};
	/**课程结束*/
	get Text_Text_325():ISquareLanguageElement{return this.getElement(325)};
	/**明日课程表*/
	get Text_Text_326():ISquareLanguageElement{return this.getElement(326)};
	/**跟校长对话*/
	get Text_Text_327():ISquareLanguageElement{return this.getElement(327)};
	/**欢迎来到魔莱坞学院！快去探索有趣的事情吧，我也会在这里随时解答你的问题*/
	get Text_Text_328():ISquareLanguageElement{return this.getElement(328)};
	/**平时上课要怎么去*/
	get Text_Text_329():ISquareLanguageElement{return this.getElement(329)};
	/**跟着箭头与大部队走，不要怕迷路*/
	get Text_Text_330():ISquareLanguageElement{return this.getElement(330)};
	/**我能成为校长吗？*/
	get Text_Text_331():ISquareLanguageElement{return this.getElement(331)};
	/**噢，那我可要把你赶出校门了！还轮不到你来坐我的位置*/
	get Text_Text_332():ISquareLanguageElement{return this.getElement(332)};
	/**我是新生，有入学礼物吗？*/
	get Text_Text_333():ISquareLanguageElement{return this.getElement(333)};
	/**嘿 你对于学院就是最好的礼物，不过在此之前快捧好给你的奖杯*/
	get Text_Text_334():ISquareLanguageElement{return this.getElement(334)};
	/**你已经拿到过奖杯了*/
	get Text_Text_335():ISquareLanguageElement{return this.getElement(335)};
	/**你还需要问什么？*/
	get Text_Text_336():ISquareLanguageElement{return this.getElement(336)};
	/**不用了 谢谢*/
	get Text_Text_337():ISquareLanguageElement{return this.getElement(337)};
	/**希望你在学院，玩得愉快*/
	get Text_Text_338():ISquareLanguageElement{return this.getElement(338)};
	/**我觉得还不错*/
	get Text_Text_339():ISquareLanguageElement{return this.getElement(339)};
	/**我还想问其他的*/
	get Text_Text_340():ISquareLanguageElement{return this.getElement(340)};
	/**跟校警对话*/
	get Text_Text_341():ISquareLanguageElement{return this.getElement(341)};
	/**你好，在大厅要注意安全，尤其是晚上！*/
	get Text_Text_342():ISquareLanguageElement{return this.getElement(342)};
	/**最近有发生什么事情吗*/
	get Text_Text_343():ISquareLanguageElement{return this.getElement(343)};
	/**我听说校警大叔你有传奇故事*/
	get Text_Text_344():ISquareLanguageElement{return this.getElement(344)};
	/**我在夜晚巡逻的时候经常会看到一些很可怕的东西，可能是眼花了，你们多注意安全*/
	get Text_Text_345():ISquareLanguageElement{return this.getElement(345)};
	/**好的，您先忙*/
	get Text_Text_346():ISquareLanguageElement{return this.getElement(346)};
	/**祝你好运*/
	get Text_Text_347():ISquareLanguageElement{return this.getElement(347)};
	/**没想到还有人愿意听我讲故事*/
	get Text_Text_348():ISquareLanguageElement{return this.getElement(348)};
	/**我没当校警之前，曾在外面闯荡。见识了东方古国的神韵，追寻过北方雪原的极光，感叹那西方科技的宏伟，也在南方交接的海平线上展望未来*/
	get Text_Text_349():ISquareLanguageElement{return this.getElement(349)};
	/**哈哈故事结束，看咱们有缘给你个手机，如果你已经拿到过它就在背包里，快去见识那些美景！*/
	get Text_Text_350():ISquareLanguageElement{return this.getElement(350)};
	/**希望你也能追逐自己的梦*/
	get Text_Text_351():ISquareLanguageElement{return this.getElement(351)};
	/**好的我会注意的*/
	get Text_Text_352():ISquareLanguageElement{return this.getElement(352)};
	/**好的我会加油的*/
	get Text_Text_353():ISquareLanguageElement{return this.getElement(353)};
	/**跟奇怪的人对话*/
	get Text_Text_354():ISquareLanguageElement{return this.getElement(354)};
	/**你在路上跑，影响到我了！*/
	get Text_Text_355():ISquareLanguageElement{return this.getElement(355)};
	/**抱歉是我不知道*/
	get Text_Text_356():ISquareLanguageElement{return this.getElement(356)};
	/**哦对不起，不过你管不着我*/
	get Text_Text_357():ISquareLanguageElement{return this.getElement(357)};
	/**好吧我原谅你了，想听一些有趣的事情吗？*/
	get Text_Text_358():ISquareLanguageElement{return this.getElement(358)};
	/**呵呵真没点学生的样子，上帝不会眷顾你的。*/
	get Text_Text_359():ISquareLanguageElement{return this.getElement(359)};
	/**说说看*/
	get Text_Text_360():ISquareLanguageElement{return this.getElement(360)};
	/**对不起不感兴趣*/
	get Text_Text_361():ISquareLanguageElement{return this.getElement(361)};
	/**夜晚你们不能跑到教学楼，这里很危险，但也有很多的宝藏*/
	get Text_Text_362():ISquareLanguageElement{return this.getElement(362)};
	/**如果晚上经常听到音乐或者美术教室有人唱歌，但是进去没有一个人！转头的时候一定要小心！*/
	get Text_Text_363():ISquareLanguageElement{return this.getElement(363)};
	/**如果你在夜晚遇见了我，请不要为我担心，我在尽力守护着这个校园，不被足球场上的大脚怪入侵*/
	get Text_Text_364():ISquareLanguageElement{return this.getElement(364)};
	/**如果你晚上看到了鬼，不要犹豫，跑，赶快跑！总有一天你会击败他，不过现在树屋宿舍会保护你*/
	get Text_Text_365():ISquareLanguageElement{return this.getElement(365)};
	/**就打听这么多*/
	get Text_Text_366():ISquareLanguageElement{return this.getElement(366)};
	/**就这么多，其他的我还要多打听下*/
	get Text_Text_367():ISquareLanguageElement{return this.getElement(367)};
	/**真有趣，等你下次跟我说*/
	get Text_Text_368():ISquareLanguageElement{return this.getElement(368)};
	/**好的，你可以随时来*/
	get Text_Text_369():ISquareLanguageElement{return this.getElement(369)};
	/**好的，我再给你讲解下*/
	get Text_Text_370():ISquareLanguageElement{return this.getElement(370)};
	/**再见*/
	get Text_Text_371():ISquareLanguageElement{return this.getElement(371)};
	/**障碍赛跑*/
	get Text_Text_372():ISquareLanguageElement{return this.getElement(372)};
	/**分门别类*/
	get Text_Text_373():ISquareLanguageElement{return this.getElement(373)};
	/**打字练习*/
	get Text_Text_374():ISquareLanguageElement{return this.getElement(374)};
	/**躲避障碍物，穿过里程点积累计分*/
	get Text_Text_375():ISquareLanguageElement{return this.getElement(375)};
	/**将中间的纸片拖动，和四周相同的堆放在一起*/
	get Text_Text_376():ISquareLanguageElement{return this.getElement(376)};
	/**根据显示单词依次点击下面的字母*/
	get Text_Text_377():ISquareLanguageElement{return this.getElement(377)};
	/**跟看书的人对话*/
	get Text_Text_378():ISquareLanguageElement{return this.getElement(378)};
	/**你好啊，同学*/
	get Text_Text_379():ISquareLanguageElement{return this.getElement(379)};
	/**跟厨师对话*/
	get Text_Text_380():ISquareLanguageElement{return this.getElement(380)};
	/**哈喽同学，这些都是新鲜出炉的美食，你今天想吃点啥？吃完可以去逛逛校园哦！*/
	get Text_Text_381():ISquareLanguageElement{return this.getElement(381)};
	/**（继续说）*/
	get Text_Text_382():ISquareLanguageElement{return this.getElement(382)};
	/**奇怪的知识增加了*/
	get Text_Text_383():ISquareLanguageElement{return this.getElement(383)};
	/**奇怪的知识又增加了*/
	get Text_Text_384():ISquareLanguageElement{return this.getElement(384)};
	/**奇怪的知识继续增加了*/
	get Text_Text_385():ISquareLanguageElement{return this.getElement(385)};
	/**奇怪的知识越来越多了*/
	get Text_Text_386():ISquareLanguageElement{return this.getElement(386)};
	/**里程点*/
	get Text_Text_387():ISquareLanguageElement{return this.getElement(387)};
	/**你已经获得过喷气背包了*/
	get Text_Text_388():ISquareLanguageElement{return this.getElement(388)};
	/**欢迎新同学入学，这是属于你的欢乐校园，学校为你准备了丰富的课程，提升你的能力，挑战知识和考验你可以在这里玩小游戏提升个人成绩、结实新朋友、探索校园的每个角落平衡学习和社交，收获快乐吧*/
	get Text_Text_389():ISquareLanguageElement{return this.getElement(389)};
	/**跟校霸对话*/
	get Text_Text_390():ISquareLanguageElement{return this.getElement(390)};
	/**嘿！瞧瞧这是谁？！*/
	get Text_Text_391():ISquareLanguageElement{return this.getElement(391)};
	/**噢！是那个新来的转校生！*/
	get Text_Text_392():ISquareLanguageElement{return this.getElement(392)};
	/**你来这里干什么？学校都是我们的地盘*/
	get Text_Text_393():ISquareLanguageElement{return this.getElement(393)};
	/**作为同学你们都不欢迎我？*/
	get Text_Text_394():ISquareLanguageElement{return this.getElement(394)};
	/**我知道啊，可这里不待见你！这里也不欢迎你！*/
	get Text_Text_395():ISquareLanguageElement{return this.getElement(395)};
	/**(…)*/
	get Text_Text_396():ISquareLanguageElement{return this.getElement(396)};
	/**既然遇到那就听好了，这周我们要举办一个超酷的派对,全校所有的风云人物都会参加!*/
	get Text_Text_397():ISquareLanguageElement{return this.getElement(397)};
	/**但是你猜，谁收不到邀请？*/
	get Text_Text_398():ISquareLanguageElement{return this.getElement(398)};
	/**你说的不会是我？*/
	get Text_Text_399():ISquareLanguageElement{return this.getElement(399)};
	/**你！哈哈哈哈！你没有被邀请*/
	get Text_Text_400():ISquareLanguageElement{return this.getElement(400)};
	/**为什么？*/
	get Text_Text_401():ISquareLanguageElement{return this.getElement(401)};
	/**没有为什么，别被吓坏了，麻溜地回家哭去吧！*/
	get Text_Text_402():ISquareLanguageElement{return this.getElement(402)};
	/**跟派对咖对话*/
	get Text_Text_403():ISquareLanguageElement{return this.getElement(403)};
	/**嘿 你来早了，白天派对还没开始呢*/
	get Text_Text_404():ISquareLanguageElement{return this.getElement(404)};
	/**那我能在旁边跳华尔兹吗？*/
	get Text_Text_405():ISquareLanguageElement{return this.getElement(405)};
	/**好的，期待你的表演*/
	get Text_Text_406():ISquareLanguageElement{return this.getElement(406)};
	/**听说你跟嘻哈少年关系不好？*/
	get Text_Text_407():ISquareLanguageElement{return this.getElement(407)};
	/**好的请便，我会给你建议的*/
	get Text_Text_408():ISquareLanguageElement{return this.getElement(408)};
	/**我们不会辜负同学们的期待*/
	get Text_Text_409():ISquareLanguageElement{return this.getElement(409)};
	/**哦？那个臭弟弟吗？他很有天赋可就是脾气差了点*/
	get Text_Text_410():ISquareLanguageElement{return this.getElement(410)};
	/**跟树屋的派对咖对话*/
	get Text_Text_411():ISquareLanguageElement{return this.getElement(411)};
	/**让我看看你们准备好了吗？！*/
	get Text_Text_412():ISquareLanguageElement{return this.getElement(412)};
	/**晚上有派对吗？*/
	get Text_Text_413():ISquareLanguageElement{return this.getElement(413)};
	/**让我们开启属于夜晚的盛典吧！*/
	get Text_Text_414():ISquareLanguageElement{return this.getElement(414)};
	/**我已经等不及了！*/
	get Text_Text_415():ISquareLanguageElement{return this.getElement(415)};
	/**晚上就开！*/
	get Text_Text_416():ISquareLanguageElement{return this.getElement(416)};
	/**与运动少年对话*/
	get Text_Text_417():ISquareLanguageElement{return this.getElement(417)};
	/**你喜欢运动吗？有没有兴趣接触下篮球？*/
	get Text_Text_418():ISquareLanguageElement{return this.getElement(418)};
	/**其实，我也喜欢打爆坏人的头*/
	get Text_Text_419():ISquareLanguageElement{return this.getElement(419)};
	/**当然，打球吗？*/
	get Text_Text_420():ISquareLanguageElement{return this.getElement(420)};
	/**哈哈，你很幽默啊！以后有机会一起打球*/
	get Text_Text_421():ISquareLanguageElement{return this.getElement(421)};
	/**那快拿起地上的这些球，瞄准那个框，准准地投进去！*/
	get Text_Text_422():ISquareLanguageElement{return this.getElement(422)};
	/**满分！*/
	get Text_Text_423():ISquareLanguageElement{return this.getElement(423)};
	/**跟体育老师对话*/
	get Text_Text_424():ISquareLanguageElement{return this.getElement(424)};
	/**嘿，就是你，你怎么磨磨唧唧的*/
	get Text_Text_425():ISquareLanguageElement{return this.getElement(425)};
	/**准时运动，嘿Sir*/
	get Text_Text_426():ISquareLanguageElement{return this.getElement(426)};
	/**我才吃饱了不适合运动*/
	get Text_Text_427():ISquareLanguageElement{return this.getElement(427)};
	/**别墨迹，好好锻炼，你的底子很不错*/
	get Text_Text_428():ISquareLanguageElement{return this.getElement(428)};
	/**你的体育成绩很差，快去锻炼！拥有好体力才能强身健体*/
	get Text_Text_429():ISquareLanguageElement{return this.getElement(429)};
	/**别给我找借口，好好锻炼身体，才能勇敢的面对夜晚*/
	get Text_Text_430():ISquareLanguageElement{return this.getElement(430)};
	/**跟嘻哈少年对话*/
	get Text_Text_431():ISquareLanguageElement{return this.getElement(431)};
	/**咋了？有事？*/
	get Text_Text_432():ISquareLanguageElement{return this.getElement(432)};
	/**我想跟你一起玩嘻哈*/
	get Text_Text_433():ISquareLanguageElement{return this.getElement(433)};
	/**听说你从来不去参加派对*/
	get Text_Text_434():ISquareLanguageElement{return this.getElement(434)};
	/**没什么，我也是来练舞蹈的*/
	get Text_Text_435():ISquareLanguageElement{return this.getElement(435)};
	/**哦？不错是好苗子，以后有机会带你去演出*/
	get Text_Text_436():ISquareLanguageElement{return this.getElement(436)};
	/**那我们舞会时候见*/
	get Text_Text_437():ISquareLanguageElement{return this.getElement(437)};
	/**我就是看不惯他，没什么好说的*/
	get Text_Text_438():ISquareLanguageElement{return this.getElement(438)};
	/**为什么，你们有什么过节？*/
	get Text_Text_439():ISquareLanguageElement{return this.getElement(439)};
	/**没什么，不过你要知道我才是真正的嘻哈派对之王！*/
	get Text_Text_440():ISquareLanguageElement{return this.getElement(440)};
	/**你可以跟他合作*/
	get Text_Text_441():ISquareLanguageElement{return this.getElement(441)};
	/**你现在给我出去！ 我不想再看到你，你跟他是一伙的！*/
	get Text_Text_442():ISquareLanguageElement{return this.getElement(442)};
	/**那你加油！*/
	get Text_Text_443():ISquareLanguageElement{return this.getElement(443)};
	/**哦，随你的便*/
	get Text_Text_444():ISquareLanguageElement{return this.getElement(444)};
	/**跟书呆子学霸对话*/
	get Text_Text_445():ISquareLanguageElement{return this.getElement(445)};
	/**你好，你也是来看书的吗？*/
	get Text_Text_446():ISquareLanguageElement{return this.getElement(446)};
	/**你喜欢看什么书？*/
	get Text_Text_447():ISquareLanguageElement{return this.getElement(447)};
	/**你成绩怎么样？*/
	get Text_Text_448():ISquareLanguageElement{return this.getElement(448)};
	/**外面很热闹，怎么不出去看看？*/
	get Text_Text_449():ISquareLanguageElement{return this.getElement(449)};
	/**最近在看一些哲学与炼金的书，你想了解下吗？*/
	get Text_Text_450():ISquareLanguageElement{return this.getElement(450)};
	/**普普通通，也就是全校绩点第一罢了*/
	get Text_Text_451():ISquareLanguageElement{return this.getElement(451)};
	/**因为每到特定的时间，咱们学院就会举办这些活动*/
	get Text_Text_452():ISquareLanguageElement{return this.getElement(452)};
	/**好啊好啊，不过我最近在看《校园的十大神秘事件》，这本书很好看*/
	get Text_Text_453():ISquareLanguageElement{return this.getElement(453)};
	/**不是很感兴趣*/
	get Text_Text_454():ISquareLanguageElement{return this.getElement(454)};
	/**这本书是我写的哦！根据夜间故事真实改编，你会在夜晚遇见丧尸，骷髅人偶，狰狞的画片怪，还有西装革履的小黑大脚怪，以及那些可怕的恶魔！*/
	get Text_Text_455():ISquareLanguageElement{return this.getElement(455)};
	/**太厉害了，不过话说回来你能帮助我学习吗？*/
	get Text_Text_456():ISquareLanguageElement{return this.getElement(456)};
	/**好的，平时学习上如果有什么不懂的也可以来问我*/
	get Text_Text_457():ISquareLanguageElement{return this.getElement(457)};
	/**那你怎么不去参加？*/
	get Text_Text_458():ISquareLanguageElement{return this.getElement(458)};
	/**我？我没有朋友，也没有谁愿意陪我，派对和舞会我也不是很感兴趣*/
	get Text_Text_459():ISquareLanguageElement{return this.getElement(459)};
	/**那好吧，谢谢，我先去找我的朋友了*/
	get Text_Text_460():ISquareLanguageElement{return this.getElement(460)};
	/**那我能成为你的朋友吗？*/
	get Text_Text_461():ISquareLanguageElement{return this.getElement(461)};
	/**乐意至极！我会保护好你*/
	get Text_Text_462():ISquareLanguageElement{return this.getElement(462)};
	/**跟教师对话*/
	get Text_Text_463():ISquareLanguageElement{return this.getElement(463)};
	/**好好上课*/
	get Text_Text_464():ISquareLanguageElement{return this.getElement(464)};
	/**好的*/
	get Text_Text_465():ISquareLanguageElement{return this.getElement(465)};
	/**我能在教室打架吗？*/
	get Text_Text_466():ISquareLanguageElement{return this.getElement(466)};
	/**每一天都要努力学习，不浪费每一分钟。*/
	get Text_Text_467():ISquareLanguageElement{return this.getElement(467)};
	/**你今天的成绩还有待进步*/
	get Text_Text_468():ISquareLanguageElement{return this.getElement(468)};
	/**请不要做与课堂无关的事情，不然我会把你赶出去！*/
	get Text_Text_469():ISquareLanguageElement{return this.getElement(469)};
	/**跟空闲的学生对话*/
	get Text_Text_470():ISquareLanguageElement{return this.getElement(470)};
	/**听说了吗，学校晚上会有神奇事件！*/
	get Text_Text_471():ISquareLanguageElement{return this.getElement(471)};
	/**真的吗？那我挺好奇的*/
	get Text_Text_472():ISquareLanguageElement{return this.getElement(472)};
	/**我害怕的话怎么办？*/
	get Text_Text_473():ISquareLanguageElement{return this.getElement(473)};
	/**不要害怕，和朋友们一起勇闯夜晚！*/
	get Text_Text_474():ISquareLanguageElement{return this.getElement(474)};
	/**用勇气打败一切！*/
	get Text_Text_475():ISquareLanguageElement{return this.getElement(475)};
	/**跟玩音乐的学生对话*/
	get Text_Text_476():ISquareLanguageElement{return this.getElement(476)};
	/**有时这里会搭舞台，我也好想去表演！*/
	get Text_Text_477():ISquareLanguageElement{return this.getElement(477)};
	/**祝我好运！*/
	get Text_Text_478():ISquareLanguageElement{return this.getElement(478)};
	/**跟啦啦队员对话*/
	get Text_Text_479():ISquareLanguageElement{return this.getElement(479)};
	/**加油加油！每天下午都有特色活动哦！*/
	get Text_Text_480():ISquareLanguageElement{return this.getElement(480)};
	/**你可以对抗魔物赚取月亮币，去找白天的狸月换东西*/
	get Text_Text_481():ISquareLanguageElement{return this.getElement(481)};
	/**也可以去跑酷，跳高，玩遍校园！*/
	get Text_Text_482():ISquareLanguageElement{return this.getElement(482)};
	/**跟啦啦队员对话*/
	get Text_Text_483():ISquareLanguageElement{return this.getElement(483)};
	/**不要害怕外面的怪物，宿舍会保护你*/
	get Text_Text_484():ISquareLanguageElement{return this.getElement(484)};
	/**来宿舍让我们相聚，这里安全又舒适，有我们在不用害怕！纸片怪统统闪开*/
	get Text_Text_485():ISquareLanguageElement{return this.getElement(485)};
	/**跟宿管阿姨对话*/
	get Text_Text_486():ISquareLanguageElement{return this.getElement(486)};
	/**大半夜的，吵什么吵！*/
	get Text_Text_487():ISquareLanguageElement{return this.getElement(487)};
	/**我可以离开宿舍吗？*/
	get Text_Text_488():ISquareLanguageElement{return this.getElement(488)};
	/**舍友不舒服怎么办？*/
	get Text_Text_489():ISquareLanguageElement{return this.getElement(489)};
	/**阿姨我睡不着*/
	get Text_Text_490():ISquareLanguageElement{return this.getElement(490)};
	/**不可以，快去睡觉！*/
	get Text_Text_491():ISquareLanguageElement{return this.getElement(491)};
	/**你跑出去了我也能给你抓回来*/
	get Text_Text_492():ISquareLanguageElement{return this.getElement(492)};
	/**憋着，憋不住了再说！*/
	get Text_Text_493():ISquareLanguageElement{return this.getElement(493)};
	/**给你拖把了，没找到就是在你背包里！你扫累了就睡着了，别睡地上！*/
	get Text_Text_494():ISquareLanguageElement{return this.getElement(494)};
	/**跟游泳教练对话*/
	get Text_Text_495():ISquareLanguageElement{return this.getElement(495)};
	/**下水前请注意热身*/
	get Text_Text_496():ISquareLanguageElement{return this.getElement(496)};
	/**你好帅啊*/
	get Text_Text_497():ISquareLanguageElement{return this.getElement(497)};
	/**你能教我游泳吗？*/
	get Text_Text_498():ISquareLanguageElement{return this.getElement(498)};
	/**你怎么跟体育老师长得好像？*/
	get Text_Text_499():ISquareLanguageElement{return this.getElement(499)};
	/**游泳拉伤了怎么办？*/
	get Text_Text_500():ISquareLanguageElement{return this.getElement(500)};
	/**谢谢*/
	get Text_Text_501():ISquareLanguageElement{return this.getElement(501)};
	/**可以，等空了再说*/
	get Text_Text_502():ISquareLanguageElement{return this.getElement(502)};
	/**他是我哥*/
	get Text_Text_503():ISquareLanguageElement{return this.getElement(503)};
	/**用治疗魔法治疗自己*/
	get Text_Text_504():ISquareLanguageElement{return this.getElement(504)};
	/**跟魔法师狸月对话*/
	get Text_Text_505():ISquareLanguageElement{return this.getElement(505)};
	/**你好，我的朋友~*/
	get Text_Text_506():ISquareLanguageElement{return this.getElement(506)};
	/**你从哪里来？*/
	get Text_Text_507():ISquareLanguageElement{return this.getElement(507)};
	/**需要帮助吗？*/
	get Text_Text_508():ISquareLanguageElement{return this.getElement(508)};
	/**我从银河深处来，你可以帮我一个忙吗？*/
	get Text_Text_509():ISquareLanguageElement{return this.getElement(509)};
	/**我需要一些金币和银币，据我所知,他们散落在学校各处，你能帮我找来吗？我要用它对抗黑暗*/
	get Text_Text_510():ISquareLanguageElement{return this.getElement(510)};
	/**当然可以！*/
	get Text_Text_511():ISquareLanguageElement{return this.getElement(511)};
	/**不，我很忙！*/
	get Text_Text_512():ISquareLanguageElement{return this.getElement(512)};
	/**好的！*/
	get Text_Text_513():ISquareLanguageElement{return this.getElement(513)};
	/**我来兑换物品*/
	get Text_Text_514():ISquareLanguageElement{return this.getElement(514)};
	/**你被抓住了*/
	get Text_Text_515():ISquareLanguageElement{return this.getElement(515)};
	/**魔法师狸月把你救回了宿舍*/
	get Text_Text_516():ISquareLanguageElement{return this.getElement(516)};
	/**魔法师狸月：请帮我找些金币和银币来，我不会亏待你的！*/
	get Text_Text_517():ISquareLanguageElement{return this.getElement(517)};
	/**魔法师狸月：某些教室里藏着珍贵的金币，快去看看！*/
	get Text_Text_518():ISquareLanguageElement{return this.getElement(518)};
	/**魔法师狸月：找到金币或银币，都可以来找我兑换东西！*/
	get Text_Text_519():ISquareLanguageElement{return this.getElement(519)};
	/**不要害怕，我晚上会在这里等你*/
	get Text_Text_520():ISquareLanguageElement{return this.getElement(520)};
	/**派对咖*/
	get Text_Text_521():ISquareLanguageElement{return this.getElement(521)};
	/**运动少年*/
	get Text_Text_522():ISquareLanguageElement{return this.getElement(522)};
	/**体育老师*/
	get Text_Text_523():ISquareLanguageElement{return this.getElement(523)};
	/**嘻哈少年*/
	get Text_Text_524():ISquareLanguageElement{return this.getElement(524)};
	/**书呆子学霸*/
	get Text_Text_525():ISquareLanguageElement{return this.getElement(525)};
	/**魔法教师*/
	get Text_Text_526():ISquareLanguageElement{return this.getElement(526)};
	/**空闲的学生*/
	get Text_Text_527():ISquareLanguageElement{return this.getElement(527)};
	/**玩音乐的学生*/
	get Text_Text_528():ISquareLanguageElement{return this.getElement(528)};
	/**啦啦队员*/
	get Text_Text_529():ISquareLanguageElement{return this.getElement(529)};
	/**啦啦队员*/
	get Text_Text_530():ISquareLanguageElement{return this.getElement(530)};
	/**游泳教练*/
	get Text_Text_531():ISquareLanguageElement{return this.getElement(531)};
	/**宿管阿姨*/
	get Text_Text_532():ISquareLanguageElement{return this.getElement(532)};
	/**这场派对是由{0}举办的*/
	get Text_Text_533():ISquareLanguageElement{return this.getElement(533)};
	/**放学*/
	get Text_Text_534():ISquareLanguageElement{return this.getElement(534)};
	/**跟上帝对话*/
	get Text_Text_535():ISquareLanguageElement{return this.getElement(535)};
	/**来自远方的冒险者，没想到你能通过彩虹路来到这里，你变的更强了！*/
	get Text_Text_536():ISquareLanguageElement{return this.getElement(536)};
	/**爬上来很容易，建议上帝你加点难度，毕竟我现在有魔杖了*/
	get Text_Text_537():ISquareLanguageElement{return this.getElement(537)};
	/**我考虑考虑，你还喜欢校园生活吗*/
	get Text_Text_538():ISquareLanguageElement{return this.getElement(538)};
	/**还不错，我很喜欢这里*/
	get Text_Text_539():ISquareLanguageElement{return this.getElement(539)};
	/**还可以哦，很有挑战的地方！*/
	get Text_Text_540():ISquareLanguageElement{return this.getElement(540)};
	/**那就好，愿光芒与你同在！*/
	get Text_Text_541():ISquareLanguageElement{return this.getElement(541)};
	/**你现在做什么*/
	get Text_Text_542():ISquareLanguageElement{return this.getElement(542)};
	/**没什么，我的使徒为校园带来了新的乐趣，希望你能喜欢这些挑战，变得更强！给你一个喷气背包，如果之前就拿到了它就在你的包里。*/
	get Text_Text_543():ISquareLanguageElement{return this.getElement(543)};
	/**魔法师狸月：快来找我兑换吧！过时不候！*/
	get Text_Text_544():ISquareLanguageElement{return this.getElement(544)};
	/**银币*/
	get Text_Text_545():ISquareLanguageElement{return this.getElement(545)};
	/**钞票*/
	get Text_Text_546():ISquareLanguageElement{return this.getElement(546)};
	/**兑换商城*/
	get Text_Text_547():ISquareLanguageElement{return this.getElement(547)};
	/**购买*/
	get Text_Text_548():ISquareLanguageElement{return this.getElement(548)};
	/**点击任意位置关闭*/
	get Text_Text_549():ISquareLanguageElement{return this.getElement(549)};
	/**已兑换*/
	get Text_Text_550():ISquareLanguageElement{return this.getElement(550)};
	/**购买成功*/
	get Text_Text_551():ISquareLanguageElement{return this.getElement(551)};
	/**货币不足*/
	get Text_Text_552():ISquareLanguageElement{return this.getElement(552)};
	/**早上*/
	get Text_Text_553():ISquareLanguageElement{return this.getElement(553)};
	/**下午*/
	get Text_Text_554():ISquareLanguageElement{return this.getElement(554)};
	/**晚上*/
	get Text_Text_555():ISquareLanguageElement{return this.getElement(555)};
	/**危险的夜晚即将到来，要处处小心哦~*/
	get Text_Text_556():ISquareLanguageElement{return this.getElement(556)};
	/**派对咖今晚将举办派对，晚上可以前往宿舍参加!*/
	get Text_Text_557():ISquareLanguageElement{return this.getElement(557)};
	/**派对正在举办，快去玩耍吧！*/
	get Text_Text_558():ISquareLanguageElement{return this.getElement(558)};
	/**足球场上的新冒险已开启，快前往体验吧！*/
	get Text_Text_559():ISquareLanguageElement{return this.getElement(559)};
	/**足球场上将开启新冒险，敬请期待吧！*/
	get Text_Text_560():ISquareLanguageElement{return this.getElement(560)};
	/**这是属于夜晚的狂欢，我的孩子们*/
	get Text_Text_561():ISquareLanguageElement{return this.getElement(561)};
	/**又有新的故事可以讲述了*/
	get Text_Text_562():ISquareLanguageElement{return this.getElement(562)};
	/**玩耍的过程中要注意安全*/
	get Text_Text_563():ISquareLanguageElement{return this.getElement(563)};
	/**嘿 我想了想还是邀请了你*/
	get Text_Text_564():ISquareLanguageElement{return this.getElement(564)};
	/**享受难得的夜晚时光吧！*/
	get Text_Text_565():ISquareLanguageElement{return this.getElement(565)};
	/**哼！我才没有答应派对咖那小子的邀请！我自己来的*/
	get Text_Text_566():ISquareLanguageElement{return this.getElement(566)};
	/**这是我和我最好的朋友所见识过的最美盛会*/
	get Text_Text_567():ISquareLanguageElement{return this.getElement(567)};
	/**快和我们一起嗨起来吧！*/
	get Text_Text_568():ISquareLanguageElement{return this.getElement(568)};
	/**夜晚如此，甚好！*/
	get Text_Text_569():ISquareLanguageElement{return this.getElement(569)};
	/**忘掉不愉快的事情，尽情享受吧！*/
	get Text_Text_570():ISquareLanguageElement{return this.getElement(570)};
	/**这里有好吃的，好玩的，不要担心无聊*/
	get Text_Text_571():ISquareLanguageElement{return this.getElement(571)};
	/**需要寻找另一个人一起才可以跳双人舞*/
	get Text_Text_572():ISquareLanguageElement{return this.getElement(572)};
	/**取消引导*/
	get Text_Text_573():ISquareLanguageElement{return this.getElement(573)};
	/**魔法师狸月：我在宿舍的亭子里等着你！*/
	get Text_Text_574():ISquareLanguageElement{return this.getElement(574)};
	/**魔法预告*/
	get Text_Text_575():ISquareLanguageElement{return this.getElement(575)};
	/**魔法师狸月将为大家带来新的魔法
请选出你最期待的内容吧!*/
	get Text_Text_576():ISquareLanguageElement{return this.getElement(576)};
	/**小提示:每人最多两票哦*/
	get Text_Text_577():ISquareLanguageElement{return this.getElement(577)};
	/**我想要创造可以搭建的楼梯和平台~*/
	get Text_Text_578():ISquareLanguageElement{return this.getElement(578)};
	/**创造超多超可爱的玩具~*/
	get Text_Text_579():ISquareLanguageElement{return this.getElement(579)};
	/**创造出可以恶搞别人的大便道具~*/
	get Text_Text_580():ISquareLanguageElement{return this.getElement(580)};
	/**如果能创造猫猫狗狗和小动物就好啦~*/
	get Text_Text_581():ISquareLanguageElement{return this.getElement(581)};
	/**投票*/
	get Text_Text_582():ISquareLanguageElement{return this.getElement(582)};
	/**重要通知*/
	get Text_Text_583():ISquareLanguageElement{return this.getElement(583)};
	/**我跨越了无尽的时空之门
带来魔法碎片 
正为你们修建新的魔法教室 
2023年3月29日 
狸月的魔法教室将会开启 
敬请期待*/
	get Text_Text_584():ISquareLanguageElement{return this.getElement(584)};
	/**来自夜晚商店的
魔法师狸月*/
	get Text_Text_585():ISquareLanguageElement{return this.getElement(585)};
	/**好的*/
	get Text_Text_586():ISquareLanguageElement{return this.getElement(586)};
	/**还原服装*/
	get Text_Text_587():ISquareLanguageElement{return this.getElement(587)};
	/**名片*/
	get Text_Text_588():ISquareLanguageElement{return this.getElement(588)};
	/**动作*/
	get Text_Text_589():ISquareLanguageElement{return this.getElement(589)};
	/**背包*/
	get Text_Text_590():ISquareLanguageElement{return this.getElement(590)};
	/**返回校园*/
	get Text_Text_591():ISquareLanguageElement{return this.getElement(591)};
	/**卡住点我*/
	get Text_Text_592():ISquareLanguageElement{return this.getElement(592)};
	/**相机*/
	get Text_Text_593():ISquareLanguageElement{return this.getElement(593)};
	/**移动控制方向*/
	get Newguide_1():ISquareLanguageElement{return this.getElement(594)};
	/**滑动控制视角*/
	get Newguide_2():ISquareLanguageElement{return this.getElement(595)};
	/**点击屏幕继续*/
	get Text_Text_596():ISquareLanguageElement{return this.getElement(596)};
	/**点击装备造物魔杖*/
	get Text_Text_597():ISquareLanguageElement{return this.getElement(597)};
	/**点击造物技能，打开造物列表*/
	get Text_Text_598():ISquareLanguageElement{return this.getElement(598)};
	/**点击对应物品进行造物*/
	get Text_Text_599():ISquareLanguageElement{return this.getElement(599)};
	/**点击生成的造物*/
	get Text_Text_600():ISquareLanguageElement{return this.getElement(600)};
	/**点击使用按钮*/
	get Text_Text_601():ISquareLanguageElement{return this.getElement(601)};
	/**点击装备飞行魔杖*/
	get Text_Text_602():ISquareLanguageElement{return this.getElement(602)};
	/**点击飞行技能，进入飞行状态*/
	get Text_Text_603():ISquareLanguageElement{return this.getElement(603)};
	/**狸月*/
	get Text_Text_604():ISquareLanguageElement{return this.getElement(604)};
	/**飞行魔法课*/
	get Text_Text_605():ISquareLanguageElement{return this.getElement(605)};
	/**造物魔法课*/
	get Text_Text_606():ISquareLanguageElement{return this.getElement(606)};
	/**造物魔法课*/
	get Text_Text_607():ISquareLanguageElement{return this.getElement(607)};
	/**根据提示，用魔杖造出正确的物品*/
	get Text_Text_608():ISquareLanguageElement{return this.getElement(608)};
	/**飞行魔法课*/
	get Text_Text_609():ISquareLanguageElement{return this.getElement(609)};
	/**使用魔杖骑上扫把，穿过光圈，越多越好*/
	get Text_Text_610():ISquareLanguageElement{return this.getElement(610)};
	/**每秒跳跃力+{0}*/
	get textSecond():ISquareLanguageElement{return this.getElement(611)};
	/**跳跃力:{0}*/
	get textMax():ISquareLanguageElement{return this.getElement(612)};
	/**狸月的试炼*/
	get jump01():ISquareLanguageElement{return this.getElement(613)};
	/**在此区域不可飞行哦！*/
	get jump02():ISquareLanguageElement{return this.getElement(614)};
	/**一起来练习谁能跳得更高吧！*/
	get jump03():ISquareLanguageElement{return this.getElement(615)};
	/**太棒啦！到达{0}米！*/
	get jump04():ISquareLanguageElement{return this.getElement(616)};
	/**狸月的试炼自由活动时开启！*/
	get jumpno():ISquareLanguageElement{return this.getElement(617)};
	/**足球场旁已开启狸月的试炼，快去体验吧*/
	get jumptip():ISquareLanguageElement{return this.getElement(618)};
	/**我来兑换宝物*/
	get Text_Text_619():ISquareLanguageElement{return this.getElement(619)};
	/**我消耗了大量的法力得以在白天出现，你需要我的帮助吗？*/
	get Text_Text_620():ISquareLanguageElement{return this.getElement(620)};
	/**我来兑换宝物*/
	get Text_Text_621():ISquareLanguageElement{return this.getElement(621)};
	/**战斗牧师用魔法将你解救下来*/
	get Text_Text_622():ISquareLanguageElement{return this.getElement(622)};
	/**与战斗牧师对话*/
	get Text_Text_623():ISquareLanguageElement{return this.getElement(623)};
	/**你好，我是狸月邀请而来的战斗牧师，协助你一同抵抗黑暗*/
	get Text_Text_624():ISquareLanguageElement{return this.getElement(624)};
	/**是时候传授给你们魔法的奥义了，学会了就可以对抗怪物，拿好你的法杖*/
	get Text_Text_625():ISquareLanguageElement{return this.getElement(625)};
	/**现在，你可以去练习下魔法，通过教室内的传送门可以快速到达学校后方的区域，我在那里用魔法拘束了几只怪物等你击败！*/
	get Text_Text_626():ISquareLanguageElement{return this.getElement(626)};
	/**那你会什么魔法*/
	get Text_Text_627():ISquareLanguageElement{return this.getElement(627)};
	/**好的，上课时候再见！*/
	get Text_Text_628():ISquareLanguageElement{return this.getElement(628)};
	/**大千世界，万物繁生，我会的魔法很多，就看你想学什么*/
	get Text_Text_629():ISquareLanguageElement{return this.getElement(629)};
	/**待会见，年轻人，留意传送门！*/
	get Text_Text_630():ISquareLanguageElement{return this.getElement(630)};
	/**上课的时候来找我，我会在这里开启一个传送门，那里有被拘束的怪物等你击败！*/
	get Text_Text_631():ISquareLanguageElement{return this.getElement(631)};
	/**已经习得魔法，快点击技能按钮试试吧！*/
	get Text_Text_632():ISquareLanguageElement{return this.getElement(632)};
	/**夜晚的怪物也可以被魔法攻击哦，先来试试战斗魔法吧*/
	get Text_Text_633():ISquareLanguageElement{return this.getElement(633)};
	/**课程已结束*/
	get Text_Text_634():ISquareLanguageElement{return this.getElement(634)};
	/**月亮币*/
	get Text_Text_635():ISquareLanguageElement{return this.getElement(635)};
	/**幸运星*/
	get Text_Text_636():ISquareLanguageElement{return this.getElement(636)};
	/**发现幸运星！*/
	get Star_1():ISquareLanguageElement{return this.getElement(637)};
	/**当你收集了足够的星星*/
	get Star_2():ISquareLanguageElement{return this.getElement(638)};
	/**<color=#yellow>已经收集了{0}颗星星</color>*/
	get Star_3():ISquareLanguageElement{return this.getElement(639)};
	/**就可以找狸月兑换<color=#yellow> {0} </color>哦*/
	get Star_4():ISquareLanguageElement{return this.getElement(640)};
	/**去找<color=#yellow> 狸月 </color>兑换礼物吧！*/
	get Star_5():ISquareLanguageElement{return this.getElement(641)};
	/**当前拥有<color=#yellow> {0} </color>颗星星，还需收集<color=#yellow> {1} </color>颗星星*/
	get Star_6():ISquareLanguageElement{return this.getElement(642)};
	/**{0}*/
	get Star_7():ISquareLanguageElement{return this.getElement(643)};
	/**去兑换*/
	get Star_8():ISquareLanguageElement{return this.getElement(644)};
	/**领取*/
	get Star_9():ISquareLanguageElement{return this.getElement(645)};
	/**普通*/
	get Text_Shop1():ISquareLanguageElement{return this.getElement(646)};
	/**稀有*/
	get Text_Shop2():ISquareLanguageElement{return this.getElement(647)};
	/**史诗*/
	get Text_Shop3():ISquareLanguageElement{return this.getElement(648)};
	/**神圣*/
	get Text_Shop4():ISquareLanguageElement{return this.getElement(649)};
	/**只能买一个噢！*/
	get Text_Shop5():ISquareLanguageElement{return this.getElement(650)};
	/**跟狸月对话看看商店吧！*/
	get Text_Text_637():ISquareLanguageElement{return this.getElement(651)};
	/**点击这里打开商店页面！*/
	get Text_Text_638():ISquareLanguageElement{return this.getElement(652)};
	/**点击领取你的第一个新生大礼包吧！*/
	get Text_Text_639():ISquareLanguageElement{return this.getElement(653)};
	/**让我们先装备上“星之力”！*/
	get Text_Text_640():ISquareLanguageElement{return this.getElement(654)};
	/**点击使用，体验飞翔的感觉吧！*/
	get Text_Text_641():ISquareLanguageElement{return this.getElement(655)};
	/**与狸正喵沟通*/
	get Text_Text_642():ISquareLanguageElement{return this.getElement(656)};
	/**你好啊同学喵，你也是狸月的跟班嚯呀？*/
	get Text_Text_643():ISquareLanguageElement{return this.getElement(657)};
	/**好可爱的猫猫啊*/
	get Text_Text_644():ISquareLanguageElement{return this.getElement(658)};
	/**这只猫居然会说话！！*/
	get Text_Text_645():ISquareLanguageElement{return this.getElement(659)};
	/**你说的跟班是什么意思？*/
	get Text_Text_646():ISquareLanguageElement{return this.getElement(660)};
	/**是吧，本大人也觉得自己很可爱喵，欸嘿以后常来陪我玩吧！*/
	get Text_Text_647():ISquareLanguageElement{return this.getElement(661)};
	/**喵？！我是酷酷的魔法猫，当然会说人话喵，好好学习变得更强吧！*/
	get Text_Text_648():ISquareLanguageElement{return this.getElement(662)};
	/**这个不重要，我在酝酿如何拯救被鲨鱼污染的小鱼干，不要告诉狸月！我要给她一个惊喜，给大家带回小鱼干喵！*/
	get Text_Text_649():ISquareLanguageElement{return this.getElement(663)};
	/**那我以后有机会给你带小零食！*/
	get Text_Text_650():ISquareLanguageElement{return this.getElement(664)};
	/**那以后你要教我更强大魔法哦！*/
	get Text_Text_651():ISquareLanguageElement{return this.getElement(665)};
	/**好的，这是我们的秘密！*/
	get Text_Text_652():ISquareLanguageElement{return this.getElement(666)};
	/**一言为定！哼唧，快去和我的朋友们玩吧，他们在狸月商店等你喵！*/
	get Text_Text_653():ISquareLanguageElement{return this.getElement(667)};
	/**狸正喵傲娇地蹭了蹭你，看样子它已经喜欢上你了呢*/
	get Text_Text_654():ISquareLanguageElement{return this.getElement(668)};
	/**听说有人要找狸月的麻烦？我狸正第一个就不答应，哼！*/
	get Text_Text_655():ISquareLanguageElement{return this.getElement(669)};
	/**勇敢的-{0}-击杀了强大的怪物-{1} ！*/
	get Text_Kill():ISquareLanguageElement{return this.getElement(670)};
	/**被-{0}-勇士战胜了！*/
	get Text_Dead():ISquareLanguageElement{return this.getElement(671)};
	/**{0}猎人*/
	get Text_Title():ISquareLanguageElement{return this.getElement(672)};
	/**进入战斗*/
	get Text_InFight():ISquareLanguageElement{return this.getElement(673)};
	/**哈哈哈哈，小小魔法师也想战胜我吗！*/
	get Text_80HP():ISquareLanguageElement{return this.getElement(674)};
	/**不痛不痒！你的力量太弱小了！*/
	get Text_50HP():ISquareLanguageElement{return this.getElement(675)};
	/**可恶，你成功激怒我了！我生气了！*/
	get Text_20HP():ISquareLanguageElement{return this.getElement(676)};
	/**啊...我竟然输了...我还会再回来的！*/
	get Text_DeadF():ISquareLanguageElement{return this.getElement(677)};
	/**礼包内容*/
	get Gift_Title():ISquareLanguageElement{return this.getElement(678)};
	/**礼包内容（已领取所有奖励）*/
	get Gift_TitleAll():ISquareLanguageElement{return this.getElement(679)};
	/**鲨鱼正在入侵学校的路上*/
	get Text_Text_656():ISquareLanguageElement{return this.getElement(680)};
	/**啊~可恶，要坚持不住了！(吐出一口血)*/
	get Text_Text_657():ISquareLanguageElement{return this.getElement(681)};
	/**鲨鱼快被击败了！加油！！*/
	get Text_Text_658():ISquareLanguageElement{return this.getElement(682)};
	/**票卷数量不够哦！请上飞行课获取*/
	get Text_Text_659():ISquareLanguageElement{return this.getElement(683)};
	/**魔鲨:卑鄙的狸月，我的主人向你问好！*/
	get Text_Text_660():ISquareLanguageElement{return this.getElement(684)};
	/**狸月:恶鲨!无论多少次，你的阴谋注定失败！*/
	get Text_Text_661():ISquareLanguageElement{return this.getElement(685)};
	/**狸月:抱歉,狸月在白天只能用光圈来帮你进攻！*/
	get Text_Text_662():ISquareLanguageElement{return this.getElement(686)};
	/**狸月:狸月的支援到啦！不要浪费每一个光圈！*/
	get Text_Text_663():ISquareLanguageElement{return this.getElement(687)};
	/**魔鲨:你们是阻挡不了我的！*/
	get Text_Text_664():ISquareLanguageElement{return this.getElement(688)};
	/**狸月:鲨鱼有反弹魔法，一定要小心啊！*/
	get Text_Text_665():ISquareLanguageElement{return this.getElement(689)};
	/**鲨鱼又靠近了，救命！守住宿舍！*/
	get Text_Text_666():ISquareLanguageElement{return this.getElement(690)};
	/**魔法勇士*/
	get Text_Text_667():ISquareLanguageElement{return this.getElement(691)};
	/**造物:*/
	get Text_Text_668():ISquareLanguageElement{return this.getElement(692)};
	/**造物魔法课*/
	get Text_Text_669():ISquareLanguageElement{return this.getElement(693)};
	/**正确+*/
	get Text_Text_670():ISquareLanguageElement{return this.getElement(694)};
	/**造物魔杖在背包里喔，课程结束也可以使用魔杖造出物品！*/
	get Text_Text_671():ISquareLanguageElement{return this.getElement(695)};
	/**恭喜你完成了造物课程的训练*/
	get Text_Text_672():ISquareLanguageElement{return this.getElement(696)};
	/**恭喜你完成了飞行课程的训练，继续钻圈获取更多的分数吧*/
	get Text_Text_673():ISquareLanguageElement{return this.getElement(697)};
	/**全新魔法课程开始啦！*/
	get Text_Text_674():ISquareLanguageElement{return this.getElement(698)};
	/**需要寻找另一个人一起才可以跳双人舞*/
	get Text_Text_675():ISquareLanguageElement{return this.getElement(699)};
	/**飞行魔杖在背包里喔，课程结束也可以使用魔杖！*/
	get Text_Text_676():ISquareLanguageElement{return this.getElement(700)};
	/**飞行魔法课*/
	get Text_Text_677():ISquareLanguageElement{return this.getElement(701)};
	/**狸月牌*/
	get Prop_01():ISquareLanguageElement{return this.getElement(702)};
	/**等待接受中...*/
	get Prop_02():ISquareLanguageElement{return this.getElement(703)};
	/**选择附近的一名同学进行占卜*/
	get Prop_03():ISquareLanguageElement{return this.getElement(704)};
	/**愚人牌*/
	get Prop_04():ISquareLanguageElement{return this.getElement(705)};
	/**魔法师*/
	get Prop_05():ISquareLanguageElement{return this.getElement(706)};
	/**女祭司*/
	get Prop_06():ISquareLanguageElement{return this.getElement(707)};
	/**女皇*/
	get Prop_07():ISquareLanguageElement{return this.getElement(708)};
	/**皇帝*/
	get Prop_08():ISquareLanguageElement{return this.getElement(709)};
	/**祭司*/
	get Prop_09():ISquareLanguageElement{return this.getElement(710)};
	/**恋人*/
	get Prop_10():ISquareLanguageElement{return this.getElement(711)};
	/**战车*/
	get Prop_11():ISquareLanguageElement{return this.getElement(712)};
	/**力量*/
	get Prop_12():ISquareLanguageElement{return this.getElement(713)};
	/**隐士*/
	get Prop_13():ISquareLanguageElement{return this.getElement(714)};
	/**轮回*/
	get Prop_14():ISquareLanguageElement{return this.getElement(715)};
	/**正义*/
	get Prop_15():ISquareLanguageElement{return this.getElement(716)};
	/**倒吊人*/
	get Prop_16():ISquareLanguageElement{return this.getElement(717)};
	/**死神*/
	get Prop_17():ISquareLanguageElement{return this.getElement(718)};
	/**节制*/
	get Prop_18():ISquareLanguageElement{return this.getElement(719)};
	/**恶魔*/
	get Prop_19():ISquareLanguageElement{return this.getElement(720)};
	/**塔*/
	get Prop_20():ISquareLanguageElement{return this.getElement(721)};
	/**星星*/
	get Prop_21():ISquareLanguageElement{return this.getElement(722)};
	/**月亮*/
	get Prop_22():ISquareLanguageElement{return this.getElement(723)};
	/**太阳*/
	get Prop_23():ISquareLanguageElement{return this.getElement(724)};
	/**审判*/
	get Prop_24():ISquareLanguageElement{return this.getElement(725)};
	/**世界*/
	get Prop_25():ISquareLanguageElement{return this.getElement(726)};
	/**时间*/
	get Prop_26():ISquareLanguageElement{return this.getElement(727)};
	/**轮船*/
	get Prop_27():ISquareLanguageElement{return this.getElement(728)};
	/**权杖*/
	get Prop_28():ISquareLanguageElement{return this.getElement(729)};
	/**圣杯*/
	get Prop_29():ISquareLanguageElement{return this.getElement(730)};
	/**宝剑*/
	get Prop_30():ISquareLanguageElement{return this.getElement(731)};
	/**玫瑰*/
	get Prop_31():ISquareLanguageElement{return this.getElement(732)};
	/**弄臣*/
	get Prop_32():ISquareLanguageElement{return this.getElement(733)};
	/**公主*/
	get Prop_33():ISquareLanguageElement{return this.getElement(734)};
	/**女巫*/
	get Prop_34():ISquareLanguageElement{return this.getElement(735)};
	/**开导迷惘的曙光*/
	get Prop_35():ISquareLanguageElement{return this.getElement(736)};
	/**狡诈的谜途旅人*/
	get Prop_36():ISquareLanguageElement{return this.getElement(737)};
	/**精神力与掌控者*/
	get Prop_37():ISquareLanguageElement{return this.getElement(738)};
	/**骄纵独裁的贵妇人*/
	get Prop_38():ISquareLanguageElement{return this.getElement(739)};
	/**漩涡之中的权力中心*/
	get Prop_39():ISquareLanguageElement{return this.getElement(740)};
	/**虚妄适时的援助*/
	get Prop_40():ISquareLanguageElement{return this.getElement(741)};
	/**高傲与妒忌*/
	get Prop_41():ISquareLanguageElement{return this.getElement(742)};
	/**力量的两元论*/
	get Prop_42():ISquareLanguageElement{return this.getElement(743)};
	/**厚积薄发的潜在之源*/
	get Prop_43():ISquareLanguageElement{return this.getElement(744)};
	/**隐匿于乱世的自省*/
	get Prop_44():ISquareLanguageElement{return this.getElement(745)};
	/**脱离于幻像的转折*/
	get Prop_45():ISquareLanguageElement{return this.getElement(746)};
	/**勇于发声的个人主义*/
	get Prop_46():ISquareLanguageElement{return this.getElement(747)};
	/**反思，自由与内在*/
	get Prop_47():ISquareLanguageElement{return this.getElement(748)};
	/**黎明曙光之前的黑暗*/
	get Prop_48():ISquareLanguageElement{return this.getElement(749)};
	/**隐忍中缥缈的光明大道*/
	get Prop_49():ISquareLanguageElement{return this.getElement(750)};
	/**沉溺与癔症*/
	get Prop_50():ISquareLanguageElement{return this.getElement(751)};
	/**居高临下的无妄之灾*/
	get Prop_51():ISquareLanguageElement{return this.getElement(752)};
	/**清透光明的期望之光*/
	get Prop_52():ISquareLanguageElement{return this.getElement(753)};
	/**答案深藏在混沌之中*/
	get Prop_53():ISquareLanguageElement{return this.getElement(754)};
	/**纯净无暇的镜像湖面*/
	get Prop_54():ISquareLanguageElement{return this.getElement(755)};
	/**再生与前世的自省*/
	get Prop_55():ISquareLanguageElement{return this.getElement(756)};
	/**无尽圆满的四季循环*/
	get Prop_56():ISquareLanguageElement{return this.getElement(757)};
	/**永恒的信念之力*/
	get Prop_57():ISquareLanguageElement{return this.getElement(758)};
	/**想念是孤独的*/
	get Prop_58():ISquareLanguageElement{return this.getElement(759)};
	/**胜利的象征*/
	get Prop_59():ISquareLanguageElement{return this.getElement(760)};
	/**杯中或有宇宙*/
	get Prop_60():ISquareLanguageElement{return this.getElement(761)};
	/**执仗义之剑*/
	get Prop_61():ISquareLanguageElement{return this.getElement(762)};
	/**赠人有余香*/
	get Prop_62():ISquareLanguageElement{return this.getElement(763)};
	/**戏弄人生*/
	get Prop_63():ISquareLanguageElement{return this.getElement(764)};
	/**闪亮而尊贵之人*/
	get Prop_64():ISquareLanguageElement{return this.getElement(765)};
	/**魔法是魅力*/
	get Prop_65():ISquareLanguageElement{return this.getElement(766)};
	/**今日的你有些冲动，根据自己的直觉做事，保持自己相信梦想的纯真之心，一切便可迎刃而解*/
	get Prop_66():ISquareLanguageElement{return this.getElement(767)};
	/**创造力激发了你的潜在能力，使用不正当的话，可能招来可怕的后果！*/
	get Prop_67():ISquareLanguageElement{return this.getElement(768)};
	/**聪敏机智，潜在的情感使你明辨黑暗，理性指引你走向光明*/
	get Prop_68():ISquareLanguageElement{return this.getElement(769)};
	/**你将会收获一笔不小的财富，你要走运了！*/
	get Prop_69():ISquareLanguageElement{return this.getElement(770)};
	/**谨防身边人的闲话，凝望着深渊的同时深渊也在凝望着你*/
	get Prop_70():ISquareLanguageElement{return this.getElement(771)};
	/**深沉的慈悲心诱发心底的良知，尽多帮助你的朋友*/
	get Prop_71():ISquareLanguageElement{return this.getElement(772)};
	/**迷惘中的爱恋滋生出黑暗与光明两面，在谨慎之中沉溺*/
	get Prop_72():ISquareLanguageElement{return this.getElement(773)};
	/**精神力的平衡指引着你前进，运动对你会有一定帮助*/
	get Prop_73():ISquareLanguageElement{return this.getElement(774)};
	/**真正的勇士敢于直面内心的黑暗，克服困难便可向前迈进*/
	get Prop_74():ISquareLanguageElement{return this.getElement(775)};
	/**智者向内寻求力量，独处，追寻面对内在的自己*/
	get Prop_75():ISquareLanguageElement{return this.getElement(776)};
	/**风水轮流转，求果必有因，好运马上要降临了*/
	get Prop_76():ISquareLanguageElement{return this.getElement(777)};
	/**宽阔的心胸使得你得到内心的平静，平衡自我便可收获好讯*/
	get Prop_77():ISquareLanguageElement{return this.getElement(778)};
	/**逆向思考鞭策灵魂，换一个角度看问题*/
	get Prop_78():ISquareLanguageElement{return this.getElement(779)};
	/**新的旅程即将开始，着眼于未来不要拘泥于眼下*/
	get Prop_79():ISquareLanguageElement{return this.getElement(780)};
	/**凡事不可多得，量力而行，控制得益会有意外收获*/
	get Prop_80():ISquareLanguageElement{return this.getElement(781)};
	/**抛开表象看本质，今日的你要注意情绪的控制，凡事三思而后行*/
	get Prop_81():ISquareLanguageElement{return this.getElement(782)};
	/**物极必反，盛极而衰，细心谨慎，随机应变*/
	get Prop_82():ISquareLanguageElement{return this.getElement(783)};
	/**新的思想与你碰撞，希望与诺言指引着你前行*/
	get Prop_83():ISquareLanguageElement{return this.getElement(784)};
	/**平静湖面下的波动，相信自己的第六感*/
	get Prop_84():ISquareLanguageElement{return this.getElement(785)};
	/**生命力和创造力将会辅助你寻找到通往真理的大道*/
	get Prop_85():ISquareLanguageElement{return this.getElement(786)};
	/**时刻接受新的事物，乐观，大方，积极向上*/
	get Prop_86():ISquareLanguageElement{return this.getElement(787)};
	/**自我的调和向外散发能量，与人互动便可有意料外的收获*/
	get Prop_87():ISquareLanguageElement{return this.getElement(788)};
	/**时间会带你找到答案，好运将常伴于你*/
	get Prop_88():ISquareLanguageElement{return this.getElement(789)};
	/**旅行兴许是治愈你的良方*/
	get Prop_89():ISquareLanguageElement{return this.getElement(790)};
	/**不是所有的事情都可以如愿以偿，但所有的事情都值得一试*/
	get Prop_90():ISquareLanguageElement{return this.getElement(791)};
	/**最近发生的事将会影响到未来，面对选择，需慎重*/
	get Prop_91():ISquareLanguageElement{return this.getElement(792)};
	/**近期你将收获好朋友，如果好好相处，将会相伴一生*/
	get Prop_92():ISquareLanguageElement{return this.getElement(793)};
	/**可多帮助他人，你也会收获快乐*/
	get Prop_93():ISquareLanguageElement{return this.getElement(794)};
	/**快乐无迹可循 但要保持初心*/
	get Prop_94():ISquareLanguageElement{return this.getElement(795)};
	/**每一个沐浴在爱河中的人都是诗人，你也是*/
	get Prop_95():ISquareLanguageElement{return this.getElement(796)};
	/**爱是一种遇见，不能等待也不能准备*/
	get Prop_96():ISquareLanguageElement{return this.getElement(797)};
	/**灰色*/
	get Prop_97():ISquareLanguageElement{return this.getElement(798)};
	/**紫色*/
	get Prop_98():ISquareLanguageElement{return this.getElement(799)};
	/**玫红*/
	get Prop_99():ISquareLanguageElement{return this.getElement(800)};
	/**橘红*/
	get Prop_100():ISquareLanguageElement{return this.getElement(801)};
	/**金色*/
	get Prop_101():ISquareLanguageElement{return this.getElement(802)};
	/**深棕*/
	get Prop_102():ISquareLanguageElement{return this.getElement(803)};
	/**粉色*/
	get Prop_103():ISquareLanguageElement{return this.getElement(804)};
	/**浅咖*/
	get Prop_104():ISquareLanguageElement{return this.getElement(805)};
	/**橘黄*/
	get Prop_105():ISquareLanguageElement{return this.getElement(806)};
	/**白*/
	get Prop_106():ISquareLanguageElement{return this.getElement(807)};
	/**橙*/
	get Prop_107():ISquareLanguageElement{return this.getElement(808)};
	/**玛瑙红*/
	get Prop_108():ISquareLanguageElement{return this.getElement(809)};
	/**黑*/
	get Prop_109():ISquareLanguageElement{return this.getElement(810)};
	/**黄*/
	get Prop_110():ISquareLanguageElement{return this.getElement(811)};
	/**青*/
	get Prop_111():ISquareLanguageElement{return this.getElement(812)};
	/**煤黑*/
	get Prop_112():ISquareLanguageElement{return this.getElement(813)};
	/**绿*/
	get Prop_113():ISquareLanguageElement{return this.getElement(814)};
	/**柠檬黄*/
	get Prop_114():ISquareLanguageElement{return this.getElement(815)};
	/**蓝*/
	get Prop_115():ISquareLanguageElement{return this.getElement(816)};
	/**米陀*/
	get Prop_116():ISquareLanguageElement{return this.getElement(817)};
	/**灰绿*/
	get Prop_117():ISquareLanguageElement{return this.getElement(818)};
	/**钴蓝*/
	get Prop_118():ISquareLanguageElement{return this.getElement(819)};
	/**象牙白*/
	get Prop_119():ISquareLanguageElement{return this.getElement(820)};
	/**紫藤*/
	get Prop_120():ISquareLanguageElement{return this.getElement(821)};
	/**铬绿*/
	get Prop_121():ISquareLanguageElement{return this.getElement(822)};
	/**湖蓝*/
	get Prop_122():ISquareLanguageElement{return this.getElement(823)};
	/**铬黄*/
	get Prop_123():ISquareLanguageElement{return this.getElement(824)};
	/**玫瑰紫*/
	get Prop_124():ISquareLanguageElement{return this.getElement(825)};
	/**葡萄紫*/
	get Prop_125():ISquareLanguageElement{return this.getElement(826)};
	/**桃红*/
	get Prop_126():ISquareLanguageElement{return this.getElement(827)};
	/**玫红*/
	get Prop_127():ISquareLanguageElement{return this.getElement(828)};
	/**今日运势*/
	get Prop_128():ISquareLanguageElement{return this.getElement(829)};
	/**幸运色：*/
	get Prop_129():ISquareLanguageElement{return this.getElement(830)};
	/**好的*/
	get Prop_130():ISquareLanguageElement{return this.getElement(831)};
	/**请根据你的直觉选择一张吧！*/
	get Prop_131():ISquareLanguageElement{return this.getElement(832)};
	/**申请为你占卜*/
	get Prop_132():ISquareLanguageElement{return this.getElement(833)};
	/**接受*/
	get Prop_133():ISquareLanguageElement{return this.getElement(834)};
	/**拒绝*/
	get Prop_134():ISquareLanguageElement{return this.getElement(835)};
	/**为自己占卜*/
	get Prop_135():ISquareLanguageElement{return this.getElement(836)};
	/**为别人占卜*/
	get Prop_136():ISquareLanguageElement{return this.getElement(837)};
	/**为TA占卜*/
	get Prop_137():ISquareLanguageElement{return this.getElement(838)};
	/**对方取消占卜，请为其他人占卜吧！*/
	get Prop_138():ISquareLanguageElement{return this.getElement(839)};
	/**对方取消占卜，快关闭！*/
	get Prop_139():ISquareLanguageElement{return this.getElement(840)};
	/**新生礼包*/
	get GiftName_1():ISquareLanguageElement{return this.getElement(841)};
	/**魔法学徒礼包*/
	get GiftName_2():ISquareLanguageElement{return this.getElement(842)};
	/**精英学徒礼包*/
	get GiftName_3():ISquareLanguageElement{return this.getElement(843)};
	/**传奇学徒礼包*/
	get GiftName_4():ISquareLanguageElement{return this.getElement(844)};
	/**收下*/
	get Star_10():ISquareLanguageElement{return this.getElement(845)};
	/**新*/
	get Star_11():ISquareLanguageElement{return this.getElement(846)};
	/**已领取*/
	get Star_12():ISquareLanguageElement{return this.getElement(847)};
	/**已收集*/
	get Star_13():ISquareLanguageElement{return this.getElement(848)};
	/**蓝巨魔*/
	get Monster_Name_1():ISquareLanguageElement{return this.getElement(849)};
	/**骷髅人*/
	get Monster_Name_2():ISquareLanguageElement{return this.getElement(850)};
	/**黑巫医*/
	get Monster_Name_3():ISquareLanguageElement{return this.getElement(851)};
	/**怪笑小熊*/
	get Monster_Name_4():ISquareLanguageElement{return this.getElement(852)};
	/**大黑鬼*/
	get Monster_Name_5():ISquareLanguageElement{return this.getElement(853)};
	/**数学怪魔*/
	get Monster_Name_6():ISquareLanguageElement{return this.getElement(854)};
	/**喂饭怪魔*/
	get Monster_Name_7():ISquareLanguageElement{return this.getElement(855)};
	/**舞蹈怪魔*/
	get Monster_Name_8():ISquareLanguageElement{return this.getElement(856)};
	/**美术怪魔*/
	get Monster_Name_9():ISquareLanguageElement{return this.getElement(857)};
	/**语言怪魔*/
	get Monster_Name_10():ISquareLanguageElement{return this.getElement(858)};
	/**取消*/
	get Cancel():ISquareLanguageElement{return this.getElement(859)};
	/**{0}的家*/
	get Dorm_Text_01():ISquareLanguageElement{return this.getElement(860)};
	/**{0}和{1}的家*/
	get Dorm_Text_02():ISquareLanguageElement{return this.getElement(861)};
	/**狸月正在重建宿舍中... 倒计时:{0}分{1}秒*/
	get Dorm_Text_03():ISquareLanguageElement{return this.getElement(862)};
	/**认领宿舍*/
	get Dorm_Text_04():ISquareLanguageElement{return this.getElement(863)};
	/**您已经有房间了*/
	get Dorm_Text_05():ISquareLanguageElement{return this.getElement(864)};
	/**租房*/
	get Dorm_Text_06():ISquareLanguageElement{return this.getElement(865)};
	/**合租*/
	get Dorm_Text_07():ISquareLanguageElement{return this.getElement(866)};
	/**注销*/
	get Dorm_Text_08():ISquareLanguageElement{return this.getElement(867)};
	/**退出合租*/
	get Dorm_Text_09():ISquareLanguageElement{return this.getElement(868)};
	/**您已经有房间了*/
	get Dorm_Text_10():ISquareLanguageElement{return this.getElement(869)};
	/**当前房间已满员*/
	get Dorm_Text_11():ISquareLanguageElement{return this.getElement(870)};
	/**点击认领*/
	get Dorm_Text_12():ISquareLanguageElement{return this.getElement(871)};
	/**房间样式*/
	get Dorm_Text_13():ISquareLanguageElement{return this.getElement(872)};
	/**纯洁艺术*/
	get Dorm_Text_14():ISquareLanguageElement{return this.getElement(873)};
	/**甜心满屋*/
	get Dorm_Text_15():ISquareLanguageElement{return this.getElement(874)};
	/**火热节奏*/
	get Dorm_Text_16():ISquareLanguageElement{return this.getElement(875)};
	/**夜空繁星*/
	get Dorm_Text_17():ISquareLanguageElement{return this.getElement(876)};
	/**熊猫小屋*/
	get Dorm_Text_18():ISquareLanguageElement{return this.getElement(877)};
	/**绿野仙踪*/
	get Dorm_Text_19():ISquareLanguageElement{return this.getElement(878)};
	/**萝卜兔*/
	get Dorm_Text_20():ISquareLanguageElement{return this.getElement(879)};
	/**海盐汽水*/
	get Dorm_Text_21():ISquareLanguageElement{return this.getElement(880)};
	/**圣诞物语*/
	get Dorm_Text_22():ISquareLanguageElement{return this.getElement(881)};
	/**确定花费{0}金币解锁样式{1}吗?*/
	get Dorm_Text_23():ISquareLanguageElement{return this.getElement(882)};
	/**您的金币不足,无法解锁该房间*/
	get Dorm_Text_24():ISquareLanguageElement{return this.getElement(883)};
	/**确认要注销{0}房间吗,注销后2分钟内不能再次注销"*/
	get Dorm_Text_25():ISquareLanguageElement{return this.getElement(884)};
	/**{0}剩余时间{1}分{2}秒*/
	get Dorm_Text_26():ISquareLanguageElement{return this.getElement(885)};
	/**传送*/
	get Dorm_Text_27():ISquareLanguageElement{return this.getElement(886)};
	/**全部房间都被住满*/
	get Dorm_Text_28():ISquareLanguageElement{return this.getElement(887)};
	/**该房间已被认领*/
	get Dorm_Error_01():ISquareLanguageElement{return this.getElement(888)};
	/**房间已满人*/
	get Dorm_Error_02():ISquareLanguageElement{return this.getElement(889)};
	/**有玩家正在申请合租,请稍后*/
	get Dorm_Error_03():ISquareLanguageElement{return this.getElement(890)};
	/**该房间已经被注销*/
	get Dorm_Error_04():ISquareLanguageElement{return this.getElement(891)};
	/**房主已经离开游戏*/
	get Dorm_Error_05():ISquareLanguageElement{return this.getElement(892)};
	/**退租*/
	get Dorm_Error_06():ISquareLanguageElement{return this.getElement(893)};
	/**正在等待{0}响应你的请求*/
	get Dorm_Request_01():ISquareLanguageElement{return this.getElement(894)};
	/**玩家{0}申请加入你的宿舍*/
	get Dorm_Request_02():ISquareLanguageElement{return this.getElement(895)};
	/**您已经获取{0}的钥匙*/
	get Dorm_Request_03():ISquareLanguageElement{return this.getElement(896)};
	/**{0}拒绝了你的入住请求*/
	get Dorm_Request_04():ISquareLanguageElement{return this.getElement(897)};
	/**胖胖大橘*/
	get Pet_Name_01():ISquareLanguageElement{return this.getElement(898)};
	/**甜心小粉*/
	get Pet_Name_02():ISquareLanguageElement{return this.getElement(899)};
	/**酷酷小黑*/
	get Pet_Name_03():ISquareLanguageElement{return this.getElement(900)};
	/**大橘真的不擅长跑步喵*/
	get Pet_Talk_01():ISquareLanguageElement{return this.getElement(901)};
	/**好累~好累~好累喵！*/
	get Pet_Talk_02():ISquareLanguageElement{return this.getElement(902)};
	/**主人可以喂我吃鱼干吗*/
	get Pet_Talk_03():ISquareLanguageElement{return this.getElement(903)};
	/**吃的好饱啊不想动了*/
	get Pet_Talk_04():ISquareLanguageElement{return this.getElement(904)};
	/**鱼啊鱼啊鱼~*/
	get Pet_Talk_05():ISquareLanguageElement{return this.getElement(905)};
	/**等我吃饱了就开始减肥喵~*/
	get Pet_Talk_06():ISquareLanguageElement{return this.getElement(906)};
	/**主人要带小粉去约会吗？*/
	get Pet_Talk_07():ISquareLanguageElement{return this.getElement(907)};
	/**主人跑起来的样子也让人着迷喵~*/
	get Pet_Talk_08():ISquareLanguageElement{return this.getElement(908)};
	/**主人可以只喜欢小粉吗？*/
	get Pet_Talk_09():ISquareLanguageElement{return this.getElement(909)};
	/**你刚才又看别的猫咪了！*/
	get Pet_Talk_10():ISquareLanguageElement{return this.getElement(910)};
	/**和主人在一起真幸福喵~*/
	get Pet_Talk_11():ISquareLanguageElement{return this.getElement(911)};
	/**小粉永远喜欢主人喵~*/
	get Pet_Talk_12():ISquareLanguageElement{return this.getElement(912)};
	/**不许丢下我！人类！*/
	get Pet_Talk_13():ISquareLanguageElement{return this.getElement(913)};
	/**被我追上你就死定了喵！*/
	get Pet_Talk_14():ISquareLanguageElement{return this.getElement(914)};
	/**我可不是你的宠物喵！*/
	get Pet_Talk_15():ISquareLanguageElement{return this.getElement(915)};
	/**怎么还不过来摸我！哼！*/
	get Pet_Talk_16():ISquareLanguageElement{return this.getElement(916)};
	/**总有天一天你会臣服于我于本喵！*/
	get Pet_Talk_17():ISquareLanguageElement{return this.getElement(917)};
	/**本喵怎么可能会喜欢上你！哼！*/
	get Pet_Talk_18():ISquareLanguageElement{return this.getElement(918)};
	/**击退鲨鱼*/
	get Text_Text_678():ISquareLanguageElement{return this.getElement(919)};
	/**宿舍被摧毁*/
	get Text_Text_679():ISquareLanguageElement{return this.getElement(920)};
	/**星星不足*/
	get Star_14():ISquareLanguageElement{return this.getElement(921)};
	/**恭喜获得*/
	get Text_Text_680():ISquareLanguageElement{return this.getElement(922)};
	/**战斗魔杖*/
	get 11101():ISquareLanguageElement{return this.getElement(923)};
	/**飞天魔杖*/
	get 12102():ISquareLanguageElement{return this.getElement(924)};
	/**造物魔杖*/
	get 13101():ISquareLanguageElement{return this.getElement(925)};
	/**雪球魔杖*/
	get 14101():ISquareLanguageElement{return this.getElement(926)};
	/**车轮滚滚*/
	get 50001():ISquareLanguageElement{return this.getElement(927)};
	/**魔法台阶*/
	get 50002():ISquareLanguageElement{return this.getElement(928)};
	/**定时炸弹*/
	get 50003():ISquareLanguageElement{return this.getElement(929)};
	/**送心*/
	get 50004():ISquareLanguageElement{return this.getElement(930)};
	/**扮鬼头套*/
	get 50005():ISquareLanguageElement{return this.getElement(931)};
	/**浪漫烟花*/
	get 50006():ISquareLanguageElement{return this.getElement(932)};
	/**滑翔伞*/
	get 301():ISquareLanguageElement{return this.getElement(933)};
	/**滑板*/
	get 302():ISquareLanguageElement{return this.getElement(934)};
	/**鲨鱼令*/
	get 60001():ISquareLanguageElement{return this.getElement(935)};
	/**金色狸月牌*/
	get 70001():ISquareLanguageElement{return this.getElement(936)};
	/**银色狸月牌*/
	get 70002():ISquareLanguageElement{return this.getElement(937)};
	/**星之力*/
	get 70003():ISquareLanguageElement{return this.getElement(938)};
	/**胖胖大橘*/
	get 70004():ISquareLanguageElement{return this.getElement(939)};
	/**甜心小粉*/
	get 70005():ISquareLanguageElement{return this.getElement(940)};
	/**酷酷小黑*/
	get 70006():ISquareLanguageElement{return this.getElement(941)};
	/**银币*/
	get 90001():ISquareLanguageElement{return this.getElement(942)};
	/**金币*/
	get 90002():ISquareLanguageElement{return this.getElement(943)};
	/**月亮币*/
	get 90003():ISquareLanguageElement{return this.getElement(944)};
	/**星星币*/
	get 90004():ISquareLanguageElement{return this.getElement(945)};
	/**退出课程*/
	get Text_Text_681():ISquareLanguageElement{return this.getElement(946)};
	/**鼓掌*/
	get Action_01():ISquareLanguageElement{return this.getElement(947)};
	/**鞠躬*/
	get Action_02():ISquareLanguageElement{return this.getElement(948)};
	/**打招呼*/
	get Action_03():ISquareLanguageElement{return this.getElement(949)};
	/**点赞*/
	get Action_04():ISquareLanguageElement{return this.getElement(950)};
	/**飞吻*/
	get Action_05():ISquareLanguageElement{return this.getElement(951)};
	/**愠怒*/
	get Action_06():ISquareLanguageElement{return this.getElement(952)};
	/**比心*/
	get Action_07():ISquareLanguageElement{return this.getElement(953)};
	/**摇头*/
	get Action_08():ISquareLanguageElement{return this.getElement(954)};
	/**难过*/
	get Action_09():ISquareLanguageElement{return this.getElement(955)};
	/**盘腿坐*/
	get Action_10():ISquareLanguageElement{return this.getElement(956)};
	/**躺下*/
	get Action_11():ISquareLanguageElement{return this.getElement(957)};
	/**翻跟头*/
	get Action_12():ISquareLanguageElement{return this.getElement(958)};
	/**结印*/
	get Action_13():ISquareLanguageElement{return this.getElement(959)};
	/**向后仰*/
	get Action_14():ISquareLanguageElement{return this.getElement(960)};
	/**抖腰*/
	get Action_15():ISquareLanguageElement{return this.getElement(961)};
	/**举高*/
	get Action_16():ISquareLanguageElement{return this.getElement(962)};
	/**抗肩*/
	get Action_17():ISquareLanguageElement{return this.getElement(963)};
	/**拖行*/
	get Action_18():ISquareLanguageElement{return this.getElement(964)};
	/**怀抱*/
	get Action_19():ISquareLanguageElement{return this.getElement(965)};
	/**公主抱*/
	get Action_20():ISquareLanguageElement{return this.getElement(966)};
	/**肩抱*/
	get Action_21():ISquareLanguageElement{return this.getElement(967)};
	/**怀旧慢舞*/
	get Action_22():ISquareLanguageElement{return this.getElement(968)};
	/**热情节拍*/
	get Action_23():ISquareLanguageElement{return this.getElement(969)};
	/**激情热舞*/
	get Action_24():ISquareLanguageElement{return this.getElement(970)};
	/**柔情似水*/
	get Action_25():ISquareLanguageElement{return this.getElement(971)};
	/**爱如潮水*/
	get Action_26():ISquareLanguageElement{return this.getElement(972)};
	/**Nobady*/
	get Action_27():ISquareLanguageElement{return this.getElement(973)};
	/**拳戏*/
	get Action_28():ISquareLanguageElement{return this.getElement(974)};
	/**物品*/
	get Text_Text_682():ISquareLanguageElement{return this.getElement(975)};
	/**魔杖*/
	get Text_Text_683():ISquareLanguageElement{return this.getElement(976)};
	/**消耗品*/
	get Text_Text_684():ISquareLanguageElement{return this.getElement(977)};
	/**圣物*/
	get Text_Text_685():ISquareLanguageElement{return this.getElement(978)};
	/**宿舍*/
	get Dorm_Text_29():ISquareLanguageElement{return this.getElement(979)};
	/**点我认领房间*/
	get Dorm_Text_30():ISquareLanguageElement{return this.getElement(980)};
	/**我的房间*/
	get Dorm_Text_31():ISquareLanguageElement{return this.getElement(981)};
	/**拒绝*/
	get Dorm_Text_32():ISquareLanguageElement{return this.getElement(982)};
	/**同意*/
	get Dorm_Text_33():ISquareLanguageElement{return this.getElement(983)};
	/**全新宿舍，震撼开启！*/
	get Dorm_Text_34():ISquareLanguageElement{return this.getElement(984)};
	/**名片*/
	get Text_Text_686():ISquareLanguageElement{return this.getElement(985)};
	/**画质*/
	get Text_Text_687():ISquareLanguageElement{return this.getElement(986)};
	/**音量*/
	get Text_Text_688():ISquareLanguageElement{return this.getElement(987)};
	/**在上方框内输入你的身份*/
	get Text_Text_689():ISquareLanguageElement{return this.getElement(988)};
	/**划动滚动条调整画质*/
	get Text_Text_690():ISquareLanguageElement{return this.getElement(989)};
	/**重置*/
	get Text_Text_691():ISquareLanguageElement{return this.getElement(990)};
	/**确认*/
	get Text_Text_692():ISquareLanguageElement{return this.getElement(991)};
	/**音乐*/
	get Text_Text_693():ISquareLanguageElement{return this.getElement(992)};
	/**音效*/
	get Text_Text_694():ISquareLanguageElement{return this.getElement(993)};
	/**魔鲨入侵*/
	get Text_Text_695():ISquareLanguageElement{return this.getElement(994)};
	/**参与魔鲨入侵获得的奖励*/
	get Text_Text_696():ISquareLanguageElement{return this.getElement(995)};
	/**可在狸月处兑换宝物*/
	get Text_Text_697():ISquareLanguageElement{return this.getElement(996)};
	/**前往*/
	get Text_Text_698():ISquareLanguageElement{return this.getElement(997)};
	/**魔法课程已开启*/
	get Text_Text_699():ISquareLanguageElement{return this.getElement(998)};
	/**打开你的课表，准备好去上魔法课吧！*/
	get Text_Text_700():ISquareLanguageElement{return this.getElement(999)};
	/**来自魔法师狸月*/
	get Text_Text_701():ISquareLanguageElement{return this.getElement(1000)};
	/**注意！新的怪物即将出现！*/
	get Text_Text_702():ISquareLanguageElement{return this.getElement(1001)};
	/**异世界的魔鲨即将入侵*/
	get Text_Text_703():ISquareLanguageElement{return this.getElement(1002)};
	/**拿上你的飞行魔杖去操场迎战吧！！*/
	get Text_Text_704():ISquareLanguageElement{return this.getElement(1003)};
	/**我自己去*/
	get Text_Text_705():ISquareLanguageElement{return this.getElement(1004)};
	/**传送*/
	get Text_Text_706():ISquareLanguageElement{return this.getElement(1005)};
	/**全新的飞行课程开始了！*/
	get Text_Text_707():ISquareLanguageElement{return this.getElement(1006)};
	/**击退鲨鱼！*/
	get Text_Text_708():ISquareLanguageElement{return this.getElement(1007)};
	/**谢谢你保卫了宿舍*/
	get Text_Text_709():ISquareLanguageElement{return this.getElement(1008)};
	/**鲨鱼摧毁了宿舍*/
	get Text_Text_710():ISquareLanguageElement{return this.getElement(1009)};
	/**宿舍重建需要3分钟*/
	get Text_Text_711():ISquareLanguageElement{return this.getElement(1010)};
	/**获得*/
	get Text_Text_712():ISquareLanguageElement{return this.getElement(1011)};
	/**穿过魔法光环，发射魔法箭击退鲨鱼！*/
	get Text_Text_713():ISquareLanguageElement{return this.getElement(1012)};
	/**星星不足*/
	get Text_Text_714():ISquareLanguageElement{return this.getElement(1013)};
	/**你没有使用*/
	get Text_Text_715():ISquareLanguageElement{return this.getElement(1014)};
	/**无法激活狸月的法阵*/
	get Text_Text_716():ISquareLanguageElement{return this.getElement(1015)};
	/**魔鲨入侵*/
	get Shark_01():ISquareLanguageElement{return this.getElement(1016)};
	/**消耗1张*/
	get Shark_02():ISquareLanguageElement{return this.getElement(1017)};
	/**参加魔鲨入侵！*/
	get Shark_03():ISquareLanguageElement{return this.getElement(1018)};
	/**异世界的魔鲨即将入侵*/
	get Shark_04():ISquareLanguageElement{return this.getElement(1019)};
	/**拿上你的飞行魔杖去操场迎战吧！！*/
	get Shark_05():ISquareLanguageElement{return this.getElement(1020)};
	/**我再想想*/
	get Shark_06():ISquareLanguageElement{return this.getElement(1021)};
	/**我自己去*/
	get Shark_07():ISquareLanguageElement{return this.getElement(1022)};
	/**传送*/
	get Shark_08():ISquareLanguageElement{return this.getElement(1023)};
	/**击退鲨鱼*/
	get Shark_09():ISquareLanguageElement{return this.getElement(1024)};
	/**鲨鱼摧毁了宿舍……*/
	get Shark_10():ISquareLanguageElement{return this.getElement(1025)};
	/**宿舍重建需要3分钟*/
	get Shark_11():ISquareLanguageElement{return this.getElement(1026)};
	/**感谢你保卫了宿舍*/
	get Shark_12():ISquareLanguageElement{return this.getElement(1027)};
	/**获得*/
	get Shark_13():ISquareLanguageElement{return this.getElement(1028)};
	/**穿过魔法光环，发射魔法箭击退魔鲨！*/
	get Shark_14():ISquareLanguageElement{return this.getElement(1029)};
	/**战斗魔杖*/
	get Text_Text_717():ISquareLanguageElement{return this.getElement(1030)};
	/**光之杖*/
	get Text_Text_718():ISquareLanguageElement{return this.getElement(1031)};
	/**飞天魔杖*/
	get Text_Text_719():ISquareLanguageElement{return this.getElement(1032)};
	/**造物魔杖*/
	get Text_Text_720():ISquareLanguageElement{return this.getElement(1033)};
	/**雪球魔杖*/
	get Text_Text_721():ISquareLanguageElement{return this.getElement(1034)};
	/**车轮滚滚*/
	get Text_Text_722():ISquareLanguageElement{return this.getElement(1035)};
	/**魔法台阶*/
	get Text_Text_723():ISquareLanguageElement{return this.getElement(1036)};
	/**定时炸弹*/
	get Text_Text_724():ISquareLanguageElement{return this.getElement(1037)};
	/**送心*/
	get Text_Text_725():ISquareLanguageElement{return this.getElement(1038)};
	/**扮鬼头套*/
	get Text_Text_726():ISquareLanguageElement{return this.getElement(1039)};
	/**浪漫烟花*/
	get Text_Text_727():ISquareLanguageElement{return this.getElement(1040)};
	/**男婴*/
	get Text_Text_728():ISquareLanguageElement{return this.getElement(1041)};
	/**女婴*/
	get Text_Text_729():ISquareLanguageElement{return this.getElement(1042)};
	/**书*/
	get Text_Text_730():ISquareLanguageElement{return this.getElement(1043)};
	/**相机*/
	get Text_Text_731():ISquareLanguageElement{return this.getElement(1044)};
	/**荧光棒*/
	get Text_Text_732():ISquareLanguageElement{return this.getElement(1045)};
	/**吉他*/
	get Text_Text_733():ISquareLanguageElement{return this.getElement(1046)};
	/**手枪*/
	get Text_Text_734():ISquareLanguageElement{return this.getElement(1047)};
	/**霰弹枪*/
	get Text_Text_735():ISquareLanguageElement{return this.getElement(1048)};
	/**冲锋枪*/
	get Text_Text_736():ISquareLanguageElement{return this.getElement(1049)};
	/**喷水壶*/
	get Text_Text_737():ISquareLanguageElement{return this.getElement(1050)};
	/**笔记本电脑*/
	get Text_Text_738():ISquareLanguageElement{return this.getElement(1051)};
	/**钱*/
	get Text_Text_739():ISquareLanguageElement{return this.getElement(1052)};
	/**拖把*/
	get Text_Text_740():ISquareLanguageElement{return this.getElement(1053)};
	/**手机*/
	get Text_Text_741():ISquareLanguageElement{return this.getElement(1054)};
	/**防爆盾*/
	get Text_Text_742():ISquareLanguageElement{return this.getElement(1055)};
	/**花束*/
	get Text_Text_743():ISquareLanguageElement{return this.getElement(1056)};
	/**购物车*/
	get Text_Text_744():ISquareLanguageElement{return this.getElement(1057)};
	/**牌子*/
	get Text_Text_745():ISquareLanguageElement{return this.getElement(1058)};
	/**婴儿车*/
	get Text_Text_746():ISquareLanguageElement{return this.getElement(1059)};
	/**行李箱*/
	get Text_Text_747():ISquareLanguageElement{return this.getElement(1060)};
	/**雨伞*/
	get Text_Text_748():ISquareLanguageElement{return this.getElement(1061)};
	/**汉堡*/
	get Text_Text_749():ISquareLanguageElement{return this.getElement(1062)};
	/**牛奶*/
	get Text_Text_750():ISquareLanguageElement{return this.getElement(1063)};
	/**面包*/
	get Text_Text_751():ISquareLanguageElement{return this.getElement(1064)};
	/**面包*/
	get Text_Text_752():ISquareLanguageElement{return this.getElement(1065)};
	/**饮料*/
	get Text_Text_753():ISquareLanguageElement{return this.getElement(1066)};
	/**饮料*/
	get Text_Text_754():ISquareLanguageElement{return this.getElement(1067)};
	/**饮料*/
	get Text_Text_755():ISquareLanguageElement{return this.getElement(1068)};
	/**饮料*/
	get Text_Text_756():ISquareLanguageElement{return this.getElement(1069)};
	/**调料*/
	get Text_Text_757():ISquareLanguageElement{return this.getElement(1070)};
	/**酒*/
	get Text_Text_758():ISquareLanguageElement{return this.getElement(1071)};
	/**可乐*/
	get Text_Text_759():ISquareLanguageElement{return this.getElement(1072)};
	/**奶昔*/
	get Text_Text_760():ISquareLanguageElement{return this.getElement(1073)};
	/**冰淇淋*/
	get Text_Text_761():ISquareLanguageElement{return this.getElement(1074)};
	/**甜甜圈*/
	get Text_Text_762():ISquareLanguageElement{return this.getElement(1075)};
	/**披萨*/
	get Text_Text_763():ISquareLanguageElement{return this.getElement(1076)};
	/**香肠*/
	get Text_Text_764():ISquareLanguageElement{return this.getElement(1077)};
	/**烤串*/
	get Text_Text_765():ISquareLanguageElement{return this.getElement(1078)};
	/**烤串*/
	get Text_Text_766():ISquareLanguageElement{return this.getElement(1079)};
	/**牛排*/
	get Text_Text_767():ISquareLanguageElement{return this.getElement(1080)};
	/**奶茶*/
	get Text_Text_768():ISquareLanguageElement{return this.getElement(1081)};
	/**奶茶*/
	get Text_Text_769():ISquareLanguageElement{return this.getElement(1082)};
	/**零食*/
	get Text_Text_770():ISquareLanguageElement{return this.getElement(1083)};
	/**零食*/
	get Text_Text_771():ISquareLanguageElement{return this.getElement(1084)};
	/**罐头*/
	get Text_Text_772():ISquareLanguageElement{return this.getElement(1085)};
	/**气球*/
	get Text_Text_773():ISquareLanguageElement{return this.getElement(1086)};
	/**尖叫鸡*/
	get Text_Text_774():ISquareLanguageElement{return this.getElement(1087)};
	/**小白兔玩偶*/
	get Text_Text_775():ISquareLanguageElement{return this.getElement(1088)};
	/**橘猫玩偶*/
	get Text_Text_776():ISquareLanguageElement{return this.getElement(1089)};
	/**火把*/
	get Text_Text_777():ISquareLanguageElement{return this.getElement(1090)};
	/**射灯*/
	get Text_Text_778():ISquareLanguageElement{return this.getElement(1091)};
	/**喷火器*/
	get Text_Text_779():ISquareLanguageElement{return this.getElement(1092)};
	/**曲奇*/
	get Text_Text_780():ISquareLanguageElement{return this.getElement(1093)};
	/**蛋糕*/
	get Text_Text_781():ISquareLanguageElement{return this.getElement(1094)};
	/**糕点*/
	get Text_Text_782():ISquareLanguageElement{return this.getElement(1095)};
	/**冰淇淋*/
	get Text_Text_783():ISquareLanguageElement{return this.getElement(1096)};
	/**布丁*/
	get Text_Text_784():ISquareLanguageElement{return this.getElement(1097)};
	/**可丽饼*/
	get Text_Text_785():ISquareLanguageElement{return this.getElement(1098)};
	/**咖啡*/
	get Text_Text_786():ISquareLanguageElement{return this.getElement(1099)};
	/**饮料*/
	get Text_Text_787():ISquareLanguageElement{return this.getElement(1100)};
	/**蛋糕*/
	get Text_Text_788():ISquareLanguageElement{return this.getElement(1101)};
	/**酒*/
	get Text_Text_789():ISquareLanguageElement{return this.getElement(1102)};
	/**酒*/
	get Text_Text_790():ISquareLanguageElement{return this.getElement(1103)};
	/**哑铃*/
	get Text_Text_791():ISquareLanguageElement{return this.getElement(1104)};
	/**杠铃*/
	get Text_Text_792():ISquareLanguageElement{return this.getElement(1105)};
	/**白猫玩偶*/
	get Text_Text_793():ISquareLanguageElement{return this.getElement(1106)};
	/**黑猫玩偶*/
	get Text_Text_794():ISquareLanguageElement{return this.getElement(1107)};
	/**灰猫玩偶*/
	get Text_Text_795():ISquareLanguageElement{return this.getElement(1108)};
	/**奖杯*/
	get Text_Text_796():ISquareLanguageElement{return this.getElement(1109)};
	/**橘猫靠垫*/
	get Text_Text_797():ISquareLanguageElement{return this.getElement(1110)};
	/**灰猫靠垫*/
	get Text_Text_798():ISquareLanguageElement{return this.getElement(1111)};
	/**游戏机*/
	get Text_Text_799():ISquareLanguageElement{return this.getElement(1112)};
	/**掌机*/
	get Text_Text_800():ISquareLanguageElement{return this.getElement(1113)};
	/**法杖*/
	get Text_Text_801():ISquareLanguageElement{return this.getElement(1114)};
	/**喷气背包*/
	get Text_Text_802():ISquareLanguageElement{return this.getElement(1115)};
	/**暗之翼*/
	get Text_Text_803():ISquareLanguageElement{return this.getElement(1116)};
	/**光之翼*/
	get Text_Text_804():ISquareLanguageElement{return this.getElement(1117)};
	/**海之翼*/
	get Text_Text_805():ISquareLanguageElement{return this.getElement(1118)};
	/**焰之翼*/
	get Text_Text_806():ISquareLanguageElement{return this.getElement(1119)};
	/**宿命凯瑞甘*/
	get Text_Text_807():ISquareLanguageElement{return this.getElement(1120)};
	/**光明骨*/
	get Text_Text_808():ISquareLanguageElement{return this.getElement(1121)};
	/**海之契约*/
	get Text_Text_809():ISquareLanguageElement{return this.getElement(1122)};
	/**盛夏烟火*/
	get Text_Text_810():ISquareLanguageElement{return this.getElement(1123)};
	/**黑夜*/
	get Text_Text_811():ISquareLanguageElement{return this.getElement(1124)};
	/**神谕*/
	get Text_Text_812():ISquareLanguageElement{return this.getElement(1125)};
	/**海梦*/
	get Text_Text_813():ISquareLanguageElement{return this.getElement(1126)};
	/**友谊*/
	get Text_Text_814():ISquareLanguageElement{return this.getElement(1127)};
	/**天使之翼*/
	get Text_Text_815():ISquareLanguageElement{return this.getElement(1128)};
	/**烟花*/
	get Text_Text_816():ISquareLanguageElement{return this.getElement(1129)};
	/**炸弹*/
	get Text_Text_817():ISquareLanguageElement{return this.getElement(1130)};
	/**滑翔伞*/
	get Text_Text_818():ISquareLanguageElement{return this.getElement(1131)};
	/**滑板*/
	get Text_Text_819():ISquareLanguageElement{return this.getElement(1132)};
	/**鲨鱼令*/
	get Text_Text_820():ISquareLanguageElement{return this.getElement(1133)};
	/**金色狸月牌*/
	get Text_Text_821():ISquareLanguageElement{return this.getElement(1134)};
	/**银色狸月牌*/
	get Text_Text_822():ISquareLanguageElement{return this.getElement(1135)};
	/**星之力*/
	get Text_Text_823():ISquareLanguageElement{return this.getElement(1136)};
	/**胖胖大橘*/
	get Text_Text_824():ISquareLanguageElement{return this.getElement(1137)};
	/**甜心小粉*/
	get Text_Text_825():ISquareLanguageElement{return this.getElement(1138)};
	/**酷酷小黑*/
	get Text_Text_826():ISquareLanguageElement{return this.getElement(1139)};
	/**魔法服饰*/
	get Text_Text_827():ISquareLanguageElement{return this.getElement(1140)};
	/**魔法服饰*/
	get Text_Text_828():ISquareLanguageElement{return this.getElement(1141)};
	/**魔法服饰*/
	get Text_Text_829():ISquareLanguageElement{return this.getElement(1142)};
	/**学院服饰*/
	get Text_Text_830():ISquareLanguageElement{return this.getElement(1143)};
	/**魔法服饰*/
	get Text_Text_831():ISquareLanguageElement{return this.getElement(1144)};
	/**银币*/
	get Text_Text_832():ISquareLanguageElement{return this.getElement(1145)};
	/**金币*/
	get Text_Text_833():ISquareLanguageElement{return this.getElement(1146)};
	/**月亮币*/
	get Text_Text_834():ISquareLanguageElement{return this.getElement(1147)};
	/**星星币*/
	get Text_Text_835():ISquareLanguageElement{return this.getElement(1148)};
	/**赐予战斗能力的法杖，去冲破黑暗吧。*/
	get Text_Text_836():ISquareLanguageElement{return this.getElement(1149)};
	/**这是一把魔杖*/
	get Text_Text_837():ISquareLanguageElement{return this.getElement(1150)};
	/**召唤飞行扫帚的魔杖，飞行请注意安全。*/
	get Text_Text_838():ISquareLanguageElement{return this.getElement(1151)};
	/**施展造物魔法所使用的魔杖，用黄金树的树枝做成，蕴含着创造万物的魔力。*/
	get Text_Text_839():ISquareLanguageElement{return this.getElement(1152)};
	/**可以生成雪球的魔杖异世寒冰元素凝结而成的魔杖*/
	get Text_Text_840():ISquareLanguageElement{return this.getElement(1153)};
	/**造物魔法生成的奇妙道具*/
	get Text_Text_841():ISquareLanguageElement{return this.getElement(1154)};
	/**造物魔法生成的奇妙道具*/
	get Text_Text_842():ISquareLanguageElement{return this.getElement(1155)};
	/**造物魔法生成的奇妙道具*/
	get Text_Text_843():ISquareLanguageElement{return this.getElement(1156)};
	/**造物魔法生成的奇妙道具*/
	get Text_Text_844():ISquareLanguageElement{return this.getElement(1157)};
	/**造物魔法生成的奇妙道具*/
	get Text_Text_845():ISquareLanguageElement{return this.getElement(1158)};
	/**造物魔法生成的奇妙道具*/
	get Text_Text_846():ISquareLanguageElement{return this.getElement(1159)};
	/**睡着的宝宝，是男孩子*/
	get Text_Text_847():ISquareLanguageElement{return this.getElement(1160)};
	/**睡着的宝宝，是女孩子*/
	get Text_Text_848():ISquareLanguageElement{return this.getElement(1161)};
	/**书中自有黄金屋*/
	get Text_Text_849():ISquareLanguageElement{return this.getElement(1162)};
	/**在校园留下珍贵影像吧！*/
	get Text_Text_850():ISquareLanguageElement{return this.getElement(1163)};
	/**光剑青春版ヾ(•ω•`)o*/
	get Text_Text_851():ISquareLanguageElement{return this.getElement(1164)};
	/**展现音乐才能的时候到了*/
	get Text_Text_852():ISquareLanguageElement{return this.getElement(1165)};
	/**砰砰砰，一枪定胜负*/
	get Text_Text_853():ISquareLanguageElement{return this.getElement(1166)};
	/**这把枪的范围更更更大！*/
	get Text_Text_854():ISquareLanguageElement{return this.getElement(1167)};
	/**经典永不褪色，冲锋在前的好伙伴*/
	get Text_Text_855():ISquareLanguageElement{return this.getElement(1168)};
	/**或许不止可以用来浇花*/
	get Text_Text_856():ISquareLanguageElement{return this.getElement(1169)};
	/**日常生活的好伙伴，效率办公的好助手*/
	get Text_Text_857():ISquareLanguageElement{return this.getElement(1170)};
	/**钞能力，但不能解决所有事情*/
	get Text_Text_858():ISquareLanguageElement{return this.getElement(1171)};
	/**打扫干净，搞好卫生，共创整洁校园*/
	get Text_Text_859():ISquareLanguageElement{return this.getElement(1172)};
	/**用来发现与记录世界的美丽*/
	get Text_Text_860():ISquareLanguageElement{return this.getElement(1173)};
	/**向一切暴力说不！*/
	get Text_Text_861():ISquareLanguageElement{return this.getElement(1174)};
	/**这是一束花，关乎于死亡或是爱情*/
	get Text_Text_862():ISquareLanguageElement{return this.getElement(1175)};
	/**我爱购物，我爱购物，这就是我的战车！*/
	get Text_Text_863():ISquareLanguageElement{return this.getElement(1176)};
	/**宣誓着你的梦想*/
	get Text_Text_864():ISquareLanguageElement{return this.getElement(1177)};
	/**稳稳当当，四平八稳，小孩子也有远行的梦*/
	get Text_Text_865():ISquareLanguageElement{return this.getElement(1178)};
	/**装下对未来所有的期待*/
	get Text_Text_866():ISquareLanguageElement{return this.getElement(1179)};
	/**找一个能与你漫步雨中的人吧*/
	get Text_Text_867():ISquareLanguageElement{return this.getElement(1180)};
	/**一个汉堡，吃的饱饱（消耗品）*/
	get Text_Text_868():ISquareLanguageElement{return this.getElement(1181)};
	/**上学时候睡前家里准备的牛奶（消耗品）*/
	get Text_Text_869():ISquareLanguageElement{return this.getElement(1182)};
	/**居家旅行的必备食粮（消耗品）*/
	get Text_Text_870():ISquareLanguageElement{return this.getElement(1183)};
	/**上学通勤的必备早餐（消耗品）*/
	get Text_Text_871():ISquareLanguageElement{return this.getElement(1184)};
	/**清凉一夏！欸嘿！（消耗品）*/
	get Text_Text_872():ISquareLanguageElement{return this.getElement(1185)};
	/**清凉一夏！好耶！（消耗品）*/
	get Text_Text_873():ISquareLanguageElement{return this.getElement(1186)};
	/**清凉一夏！呜呼！（消耗品）*/
	get Text_Text_874():ISquareLanguageElement{return this.getElement(1187)};
	/**清凉一夏！嚯呀！（消耗品）*/
	get Text_Text_875():ISquareLanguageElement{return this.getElement(1188)};
	/**好吃的美味千古流传，好用的调料传香万里（消耗品）*/
	get Text_Text_876():ISquareLanguageElement{return this.getElement(1189)};
	/**酒里是岁月的故事（消耗品）*/
	get Text_Text_877():ISquareLanguageElement{return this.getElement(1190)};
	/**轻轻打出一个响嗝（消耗品）*/
	get Text_Text_878():ISquareLanguageElement{return this.getElement(1191)};
	/**和最爱的人分享甜甜的盛夏（消耗品）*/
	get Text_Text_879():ISquareLanguageElement{return this.getElement(1192)};
	/**冰冰凉凉的解暑好助手（消耗品）*/
	get Text_Text_880():ISquareLanguageElement{return this.getElement(1193)};
	/**你是我双手合拢的一个圈（消耗品）*/
	get Text_Text_881():ISquareLanguageElement{return this.getElement(1194)};
	/**听说有些地方不喜欢在上面加菠萝？！（消耗品）*/
	get Text_Text_882():ISquareLanguageElement{return this.getElement(1195)};
	/**风干美味，好吃不贵，香醇品质，先到先得！（消耗品）*/
	get Text_Text_883():ISquareLanguageElement{return this.getElement(1196)};
	/**魔法校园的烧烤申请出战！（消耗品）*/
	get Text_Text_884():ISquareLanguageElement{return this.getElement(1197)};
	/**劈里啪啦，冒着热气与你相见（消耗品）*/
	get Text_Text_885():ISquareLanguageElement{return this.getElement(1198)};
	/**没有什么必须的礼仪，吃的开心就行（消耗品）*/
	get Text_Text_886():ISquareLanguageElement{return this.getElement(1199)};
	/**回忆起了夏日午后的温暖时光（消耗品）*/
	get Text_Text_887():ISquareLanguageElement{return this.getElement(1200)};
	/**回忆起了旧日操场的拼搏岁月（消耗品）*/
	get Text_Text_888():ISquareLanguageElement{return this.getElement(1201)};
	/**上课的时候可不要偷吃哦！（消耗品）*/
	get Text_Text_889():ISquareLanguageElement{return this.getElement(1202)};
	/**和最好的朋友分享这一份美味（消耗品）*/
	get Text_Text_890():ISquareLanguageElement{return this.getElement(1203)};
	/**可以放很多年，很多年，很多年！（消耗品）*/
	get Text_Text_891():ISquareLanguageElement{return this.getElement(1204)};
	/**用气球放飞曾经的童真*/
	get Text_Text_892():ISquareLanguageElement{return this.getElement(1205)};
	/**咯咯哒！发出来尖叫声*/
	get Text_Text_893():ISquareLanguageElement{return this.getElement(1206)};
	/**怀抱在被窝里洁白无暇的守护者*/
	get Text_Text_894():ISquareLanguageElement{return this.getElement(1207)};
	/**怀抱在被窝里狡黠暗黑的恶魔猫*/
	get Text_Text_895():ISquareLanguageElement{return this.getElement(1208)};
	/**夜晚时分，小心火烛*/
	get Text_Text_896():ISquareLanguageElement{return this.getElement(1209)};
	/**不知道在哪拿到的舞台道具，听说派对咖在找它*/
	get Text_Text_897():ISquareLanguageElement{return this.getElement(1210)};
	/**点燃这个世界，击退无尽的黑暗*/
	get Text_Text_898():ISquareLanguageElement{return this.getElement(1211)};
	/**刚刚烤好的香脆曲奇（消耗品）*/
	get Text_Text_899():ISquareLanguageElement{return this.getElement(1212)};
	/**下一次就和朋友分享友谊的蛋糕（消耗品）*/
	get Text_Text_900():ISquareLanguageElement{return this.getElement(1213)};
	/**走亲访友必备佳品（消耗品）*/
	get Text_Text_901():ISquareLanguageElement{return this.getElement(1214)};
	/**冰凉一夏！（消耗品）*/
	get Text_Text_902():ISquareLanguageElement{return this.getElement(1215)};
	/**QQ弹弹，要慢点吃哦！（消耗品）*/
	get Text_Text_903():ISquareLanguageElement{return this.getElement(1216)};
	/**自由搭配出属于自己的薄脆美味（消耗品）*/
	get Text_Text_904():ISquareLanguageElement{return this.getElement(1217)};
	/**不再疲惫，咖啡回来（消耗品）*/
	get Text_Text_905():ISquareLanguageElement{return this.getElement(1218)};
	/**你是要冰的，还是热的呢？（消耗品）*/
	get Text_Text_906():ISquareLanguageElement{return this.getElement(1219)};
	/**这一次就和朋友分享友谊的蛋糕（消耗品）*/
	get Text_Text_907():ISquareLanguageElement{return this.getElement(1220)};
	/**酒里是岁月的故事（消耗品）*/
	get Text_Text_908():ISquareLanguageElement{return this.getElement(1221)};
	/**酒里是青春的故事（消耗品）*/
	get Text_Text_909():ISquareLanguageElement{return this.getElement(1222)};
	/**锻炼~锻炼~*/
	get Text_Text_910():ISquareLanguageElement{return this.getElement(1223)};
	/**举重比赛第一名的奖品*/
	get Text_Text_911():ISquareLanguageElement{return this.getElement(1224)};
	/**拿着会让自己显得更加可爱*/
	get Text_Text_912():ISquareLanguageElement{return this.getElement(1225)};
	/**拿着会让自己变得更加可爱*/
	get Text_Text_913():ISquareLanguageElement{return this.getElement(1226)};
	/**拿着会让自己感觉更加可爱*/
	get Text_Text_914():ISquareLanguageElement{return this.getElement(1227)};
	/**入学的奖品，蕴含着神秘力量的奖杯*/
	get Text_Text_915():ISquareLanguageElement{return this.getElement(1228)};
	/**休息，休息一下*/
	get Text_Text_916():ISquareLanguageElement{return this.getElement(1229)};
	/**靠着，靠着一下*/
	get Text_Text_917():ISquareLanguageElement{return this.getElement(1230)};
	/**掌心中的游戏世界，玩会了就教家里人玩吧*/
	get Text_Text_918():ISquareLanguageElement{return this.getElement(1231)};
	/**掌心中的游戏世界，玩累了就休息休息*/
	get Text_Text_919():ISquareLanguageElement{return this.getElement(1232)};
	/**以神圣力量，挥舞出火焰的光芒*/
	get Text_Text_920():ISquareLanguageElement{return this.getElement(1233)};
	/**上帝送给胜利者的背包，快翱翔天际吧*/
	get Text_Text_921():ISquareLanguageElement{return this.getElement(1234)};
	/**黑暗会将你吞噬*/
	get Text_Text_922():ISquareLanguageElement{return this.getElement(1235)};
	/**光明会赋予自由*/
	get Text_Text_923():ISquareLanguageElement{return this.getElement(1236)};
	/**海洋会保护众生*/
	get Text_Text_924():ISquareLanguageElement{return this.getElement(1237)};
	/**烈焰会激发勇气*/
	get Text_Text_925():ISquareLanguageElement{return this.getElement(1238)};
	/**埋藏着宿命诅咒的翅膀*/
	get Text_Text_926():ISquareLanguageElement{return this.getElement(1239)};
	/**庇护圣光的翅膀*/
	get Text_Text_927():ISquareLanguageElement{return this.getElement(1240)};
	/**潜入海洋赐予呼吸的翅膀*/
	get Text_Text_928():ISquareLanguageElement{return this.getElement(1241)};
	/**与最爱的人飞翔在夏日的夜空吧*/
	get Text_Text_929():ISquareLanguageElement{return this.getElement(1242)};
	/**能够飞越黑暗的羽翼*/
	get Text_Text_930():ISquareLanguageElement{return this.getElement(1243)};
	/**神说，你能飞*/
	get Text_Text_931():ISquareLanguageElement{return this.getElement(1244)};
	/**让你像鸟儿一样飞向天空*/
	get Text_Text_932():ISquareLanguageElement{return this.getElement(1245)};
	/**心在跳，友谊如烈火*/
	get Text_Text_933():ISquareLanguageElement{return this.getElement(1246)};
	/**星辰之力凝聚而成的圣洁羽翼*/
	get Text_Text_934():ISquareLanguageElement{return this.getElement(1247)};
	/**庆典专用，远离人群放置*/
	get Text_Text_935():ISquareLanguageElement{return this.getElement(1248)};
	/**bomb~*/
	get Text_Text_936():ISquareLanguageElement{return this.getElement(1249)};
	/**能帮助你在空中滑翔*/
	get Text_Text_937():ISquareLanguageElement{return this.getElement(1250)};
	/**小小的滑板，大大的翅膀*/
	get Text_Text_938():ISquareLanguageElement{return this.getElement(1251)};
	/**用于参加【魔鲨入侵】的令牌，每次参加【飞行魔法课】可获取1张*/
	get Text_Text_939():ISquareLanguageElement{return this.getElement(1252)};
	/**可以永久使用的占卜牌，但是有使用次数限制*/
	get Text_Text_940():ISquareLanguageElement{return this.getElement(1253)};
	/**每次使用将会消耗一张，狸月提醒你要省着点用哦（消耗品）*/
	get Text_Text_941():ISquareLanguageElement{return this.getElement(1254)};
	/**星光闪耀的力量*/
	get Text_Text_942():ISquareLanguageElement{return this.getElement(1255)};
	/**“主人会喂我好吃的鱼干吗？喵~”*/
	get Text_Text_943():ISquareLanguageElement{return this.getElement(1256)};
	/**“主人可以只喜欢小粉吗？喵~”*/
	get Text_Text_944():ISquareLanguageElement{return this.getElement(1257)};
	/**“离我远一点，人类！但不许离得太远！”*/
	get Text_Text_945():ISquareLanguageElement{return this.getElement(1258)};
	/**使用后可以换上漂亮服饰哟~*/
	get Text_Text_946():ISquareLanguageElement{return this.getElement(1259)};
	/**使用后可以换上漂亮服饰哟~*/
	get Text_Text_947():ISquareLanguageElement{return this.getElement(1260)};
	/**使用后可以换上漂亮服饰哟~*/
	get Text_Text_948():ISquareLanguageElement{return this.getElement(1261)};
	/**使用后可以换上漂亮服饰哟~*/
	get Text_Text_949():ISquareLanguageElement{return this.getElement(1262)};
	/**使用后可以换上漂亮服饰哟~*/
	get Text_Text_950():ISquareLanguageElement{return this.getElement(1263)};
	/**亮闪闪的银币，可以在狸月商店兑换宝物*/
	get Text_Text_951():ISquareLanguageElement{return this.getElement(1264)};
	/**金灿灿的金币，可以在狸月商店兑换宝物*/
	get Text_Text_952():ISquareLanguageElement{return this.getElement(1265)};
	/**来自异世月亮的祝福，可以在狸月商店兑换宝物*/
	get Text_Text_953():ISquareLanguageElement{return this.getElement(1266)};
	/**来自奇幻时空里星星的守护，可以在狸月商店获取礼包*/
	get Text_Text_954():ISquareLanguageElement{return this.getElement(1267)};
	/**道具给与*/
	get Text_Text_955():ISquareLanguageElement{return this.getElement(1268)};
	/**圈数*/
	get Text_Text_956():ISquareLanguageElement{return this.getElement(1269)};
	/**{0} X 连击*/
	get ComboTxt():ISquareLanguageElement{return this.getElement(1270)};
	/**试着移动摇杆通过前面的圆圈*/
	get Text_Text_957():ISquareLanguageElement{return this.getElement(1271)};
	/**听说魔鲨入侵了？狸月通知我来接你们！*/
	get Text_Text_958():ISquareLanguageElement{return this.getElement(1272)};
	/**我是杰克船长！校园危机的时候我就会出现！*/
	get Text_Text_959():ISquareLanguageElement{return this.getElement(1273)};
	/**传说中集齐碎片可以获得某种斑点生物...*/
	get Text_Text_960():ISquareLanguageElement{return this.getElement(1274)};
	/**你刚攀登的绿藤，是我随手丢的魔豆长成的！*/
	get Text_Text_961():ISquareLanguageElement{return this.getElement(1275)};
	/**自习计划*/
	get Study_1():ISquareLanguageElement{return this.getElement(1276)};
	/**业精于勤，荒于嬉；行成于思，毁于随。*/
	get Study_2():ISquareLanguageElement{return this.getElement(1277)};
	/**请选择自习时长*/
	get Study_3():ISquareLanguageElement{return this.getElement(1278)};
	/**开始自习*/
	get Study_4():ISquareLanguageElement{return this.getElement(1279)};
	/**5分钟*/
	get Study_5():ISquareLanguageElement{return this.getElement(1280)};
	/**15分钟*/
	get Study_6():ISquareLanguageElement{return this.getElement(1281)};
	/**30分钟*/
	get Study_7():ISquareLanguageElement{return this.getElement(1282)};
	/**1小时*/
	get Study_8():ISquareLanguageElement{return this.getElement(1283)};
	/**2小时*/
	get Study_9():ISquareLanguageElement{return this.getElement(1284)};
	/**3小时*/
	get Study_10():ISquareLanguageElement{return this.getElement(1285)};
	/**4小时*/
	get Study_11():ISquareLanguageElement{return this.getElement(1286)};
	/**5小时*/
	get Study_12():ISquareLanguageElement{return this.getElement(1287)};
	/**自习报告*/
	get Study_13():ISquareLanguageElement{return this.getElement(1288)};
	/**你这次自习了：*/
	get Study_14():ISquareLanguageElement{return this.getElement(1289)};
	/**累计自习时间：*/
	get Study_15():ISquareLanguageElement{return this.getElement(1290)};
	/**有志者，事竟成！坚持，勇往直前！*/
	get Study_16():ISquareLanguageElement{return this.getElement(1291)};
	/**你已经很棒了！继续坚持你会成为更优秀的人！*/
	get Study_17():ISquareLanguageElement{return this.getElement(1292)};
	/**小有所成了，你很专注！继续加油吧！*/
	get Study_18():ISquareLanguageElement{return this.getElement(1293)};
	/**哇哦！自习圆满结束啦，可太棒了呢！为你骄傲，快截图去游戏圈炫耀吧！*/
	get Study_19():ISquareLanguageElement{return this.getElement(1294)};
	/**太有毅力了！你就是明日之星！快分享给大家向你学习吧！*/
	get Study_20():ISquareLanguageElement{return this.getElement(1295)};
	/**去魔法校园里体验丰富多彩的校园生活吧！*/
	get Study_21():ISquareLanguageElement{return this.getElement(1296)};
	/**可以课间休息一下噢~*/
	get Study_22():ISquareLanguageElement{return this.getElement(1297)};
	/**魔法校园里的精彩活动在等着你，快去休息一下吧！*/
	get Study_23():ISquareLanguageElement{return this.getElement(1298)};
	/**快去魔法校园游玩，放松一下自己吧！*/
	get Study_24():ISquareLanguageElement{return this.getElement(1299)};
	/**快去魔法校园里游玩吧，你需要好好放松一下了，精彩的活动在等着你！*/
	get Study_25():ISquareLanguageElement{return this.getElement(1300)};
	/**继续自习*/
	get Study_26():ISquareLanguageElement{return this.getElement(1301)};
	/**离开*/
	get Study_27():ISquareLanguageElement{return this.getElement(1302)};
	/**自习室公告*/
	get Study_28():ISquareLanguageElement{return this.getElement(1303)};
	/**这是一个给各位同学提供舒适的学习环境的自习室，请大家<color=#F7B608FF>延长手机的锁屏时间</color>防止掉线，打开声音，让我们在优美的音乐中一起快乐自习吧！*/
	get Study_29():ISquareLanguageElement{return this.getElement(1304)};
	/**我知道了*/
	get Study_30():ISquareLanguageElement{return this.getElement(1305)};
	/**座位已满*/
	get Study_31():ISquareLanguageElement{return this.getElement(1306)};
	/**事业常成于坚忍，毁于急躁*/
	get Study_32():ISquareLanguageElement{return this.getElement(1307)};
	/**真的要结束学习吗？*/
	get Study_33():ISquareLanguageElement{return this.getElement(1308)};
	/**深吸一口气......开始自习*/
	get Study_34():ISquareLanguageElement{return this.getElement(1309)};
	/**签订契约*/
	get Prop_140():ISquareLanguageElement{return this.getElement(1310)};
	/**展示契约*/
	get Prop_141():ISquareLanguageElement{return this.getElement(1311)};
	/**你已经是{0}的{1}了*/
	get Relation_01():ISquareLanguageElement{return this.getElement(1312)};
	/**当前戒指剩余有效期仅剩：{0}天*/
	get Relation_02():ISquareLanguageElement{return this.getElement(1313)};
	/**邀请你成为TA的*/
	get Relation_03():ISquareLanguageElement{return this.getElement(1314)};
	/**等待对方接受中....*/
	get Relation_04():ISquareLanguageElement{return this.getElement(1315)};
	/**请先输入称号*/
	get Relation_05():ISquareLanguageElement{return this.getElement(1316)};
	/**你是TA的称号输入不合法！！！*/
	get Relation_06():ISquareLanguageElement{return this.getElement(1317)};
	/**TA是你的称号输入不合法！！！*/
	get Relation_07():ISquareLanguageElement{return this.getElement(1318)};
	/**已有契约*/
	get Relation_08():ISquareLanguageElement{return this.getElement(1319)};
	/**{0}的{1}*/
	get Relation_09():ISquareLanguageElement{return this.getElement(1320)};
	/**传送到TA的身边*/
	get Relation_10():ISquareLanguageElement{return this.getElement(1321)};
	/**关系维持7天后将自动解除*/
	get Relation_11():ISquareLanguageElement{return this.getElement(1322)};
	/**选择*/
	get Relation_12():ISquareLanguageElement{return this.getElement(1323)};
	/**点击输入称号*/
	get Relation_13():ISquareLanguageElement{return this.getElement(1324)};
	/**确定后称号无法更改了哦！*/
	get Relation_14():ISquareLanguageElement{return this.getElement(1325)};
	/**确定*/
	get Relation_15():ISquareLanguageElement{return this.getElement(1326)};
	/**输入你想设置的称号*/
	get Relation_16():ISquareLanguageElement{return this.getElement(1327)};
	/**契约之戒已失效，可重新购买签订契约*/
	get Relation_17():ISquareLanguageElement{return this.getElement(1328)};
	/**你是TA的*/
	get Relation_18():ISquareLanguageElement{return this.getElement(1329)};
	/**TA是你的*/
	get Relation_19():ISquareLanguageElement{return this.getElement(1330)};
	/**你想要签订契约的对象*/
	get Relation_20():ISquareLanguageElement{return this.getElement(1331)};
	/**赠送*/
	get Relation_21():ISquareLanguageElement{return this.getElement(1332)};
	/**重置称号*/
	get Relation_22():ISquareLanguageElement{return this.getElement(1333)};
	/**契约者不在此房间*/
	get Relation_23():ISquareLanguageElement{return this.getElement(1334)};
	/**扬帆！全速前进！*/
	get Pet_Talk_19():ISquareLanguageElement{return this.getElement(1335)};
	/**我比海浪还要快！*/
	get Pet_Talk_20():ISquareLanguageElement{return this.getElement(1336)};
	/**我是要成为船长的小狗！*/
	get Pet_Talk_21():ISquareLanguageElement{return this.getElement(1337)};
	/**真怀念和船长一起航行的日子啊！*/
	get Pet_Talk_22():ISquareLanguageElement{return this.getElement(1338)};
	/**学校里会有神秘的宝藏吗？*/
	get Pet_Talk_23():ISquareLanguageElement{return this.getElement(1339)};
	/**汪汪汪！水手小狗报道!*/
	get Pet_Talk_24():ISquareLanguageElement{return this.getElement(1340)};
	/**与船长对话*/
	get Captain_01():ISquareLanguageElement{return this.getElement(1341)};
	/**哈哈哈，不愧是我看好的人，这股挑战魔藤的勇气，简直和我年轻时一模一样！*/
	get Captain_02():ISquareLanguageElement{return this.getElement(1342)};
	/**你是谁？*/
	get Captain_03():ISquareLanguageElement{return this.getElement(1343)};
	/**噢！孩子，听好了，我可是整个七大洋最强大的昆卡船长！哈哈哈哈，你肯定有很多疑问，让我来为你解答！*/
	get Captain_04():ISquareLanguageElement{return this.getElement(1344)};
	/**你为什么从天上来啊？我们的校园也在云上？*/
	get Captain_05():ISquareLanguageElement{return this.getElement(1345)};
	/**你来这的目的是什么？*/
	get Captain_06():ISquareLanguageElement{return this.getElement(1346)};
	/**狸月真的很强大吗？收集的金币和银币到底有什么用？*/
	get Captain_07():ISquareLanguageElement{return this.getElement(1347)};
	/**船头有个宝箱，我能打开看看吗？*/
	get Captain_08():ISquareLanguageElement{return this.getElement(1348)};
	/**观察力不错，你该来当我的大副！这件事说来话长，不过，我真的早该亲手解决他......*/
	get Captain_09():ISquareLanguageElement{return this.getElement(1349)};
	/**欸？船长先生？（他似乎陷入回忆了）*/
	get Captain_10():ISquareLanguageElement{return this.getElement(1350)};
	/**真是一段不好的回忆啊......我的船和你们的学校都能在天上，都是因为使用了悬空魔法。据我所知，狸月白天要消耗大量的法力来维持学校的飞行，只有晚上会停止下来，这孩子这些年真是辛苦了......*/
	get Captain_11():ISquareLanguageElement{return this.getElement(1351)};
	/**为什么要一直飞行呢？船长先生在旅行吗？*/
	get Captain_12():ISquareLanguageElement{return this.getElement(1352)};
	/**这是狸月在保护学校免于黑魔法的侵蚀，为你们这些勇敢的魔法师争取学习时间！而我，不断航行着为大家寻找新大陆，让大家能更好地战斗下去！*/
	get Captain_13():ISquareLanguageElement{return this.getElement(1353)};
	/**原来还发生过这样的事啊*/
	get Captain_14():ISquareLanguageElement{return this.getElement(1354)};
	/**我已经开始了“逐月计划”，在各个大陆上寻找适合我们降落的土地，一块魔法能量充盈的大陆。我们会在那里重新开始生活。*/
	get Captain_15():ISquareLanguageElement{return this.getElement(1355)};
	/**好了，孩子，你们这些年轻卓越的魔法师让我对未来又重新充满了希望！我该继续去完成我的工作，到时候我们会修好轨道，建好月台，到时候别忘了去列车上看看，莱琳会来找你们！*/
	get Captain_16():ISquareLanguageElement{return this.getElement(1356)};
	/**哈哈哈哈，我这次来是为了给学校开辟新航线，让大家去更广阔的世界历练，不久后我的女儿莱琳会来建立站台的！*/
	get Captain_17():ISquareLanguageElement{return this.getElement(1357)};
	/**金币与银币，当然重要啦！有了它们就可以喝到好喝的美酒，哦吼吼！*/
	get Captain_18():ISquareLanguageElement{return this.getElement(1358)};
	/**您是认真的吗，船长先生......*/
	get Captain_19():ISquareLanguageElement{return this.getElement(1359)};
	/**哈哈哈哈，我喜欢你这样的年轻人！我和狸月丫头都来自一个遥远的魔法学院，我可是看着她从一个调皮的小女孩成长为学院最优秀的学生，这丫头小时候可没少爬我的桅杆，还把我最爱的朗姆酒往海里倒，吼哈哈哈！*/
	get Captain_20():ISquareLanguageElement{return this.getElement(1360)};
	/**后来发生了什么呢？*/
	get Captain_21():ISquareLanguageElement{return this.getElement(1361)};
	/**听好了，孩子，我们的魔法学院曾经是这个世界最负盛名的学校，只不过因为多年前的一场可怕的黑魔法劫难，戴安娜院长不得不耗尽自己的法力，迁移了整个学院，让狸月带着大家离开......（刚才还在大笑的船长，此时眼角有泪花闪过）*/
	get Captain_22():ISquareLanguageElement{return this.getElement(1362)};
	/**沉默*/
	get Captain_23():ISquareLanguageElement{return this.getElement(1363)};
	/**那戴安娜院长是不是...*/
	get Captain_24():ISquareLanguageElement{return this.getElement(1364)};
	/**是的，我们的家和戴安娜一起消逝了，魔法学院永远不会忘记那一天！我将用我的余生来重新开辟一条复兴的航线！*/
	get Captain_25():ISquareLanguageElement{return this.getElement(1365)};
	/**当然，孩子，在那里你会认识我最好的大副波波，我和海怪搏斗了一天一夜才将它救下，哈哈哈哈哈*/
	get Captain_26():ISquareLanguageElement{return this.getElement(1366)};
	/**{0}秒*/
	get LeaderBord_Tex1():ISquareLanguageElement{return this.getElement(1367)};
	/**未登顶*/
	get LeaderBord_Tex2():ISquareLanguageElement{return this.getElement(1368)};
	/**跟我走*/
	get Task_Acc():ISquareLanguageElement{return this.getElement(1369)};
	/**取消跟随*/
	get Task_Finish():ISquareLanguageElement{return this.getElement(1370)};
	/**你接了任务1-1*/
	get Task_Tex1():ISquareLanguageElement{return this.getElement(1371)};
	/**你完成了任务1-1*/
	get Task_Tex2():ISquareLanguageElement{return this.getElement(1372)};
	/**你接了任务1-2*/
	get Task_Tex3():ISquareLanguageElement{return this.getElement(1373)};
	/**你完成了任务1-2*/
	get Task_Tex4():ISquareLanguageElement{return this.getElement(1374)};
	/**你接了任务1-3*/
	get Task_Tex5():ISquareLanguageElement{return this.getElement(1375)};
	/**你完成了任务1-4*/
	get Task_Tex6():ISquareLanguageElement{return this.getElement(1376)};
	/**换装*/
	get Change_01():ISquareLanguageElement{return this.getElement(1395)};
	/**只看已拥有*/
	get Change_02():ISquareLanguageElement{return this.getElement(1396)};
	/**保存全部服装*/
	get Change_03():ISquareLanguageElement{return this.getElement(1397)};
	/**重置*/
	get Change_04():ISquareLanguageElement{return this.getElement(1398)};
	/**购买*/
	get Change_05():ISquareLanguageElement{return this.getElement(1399)};
	/**上装*/
	get Change_06():ISquareLanguageElement{return this.getElement(1400)};
	/**下装*/
	get Change_07():ISquareLanguageElement{return this.getElement(1401)};
	/**裙子*/
	get Change_08():ISquareLanguageElement{return this.getElement(1402)};
	/**头发*/
	get Change_09():ISquareLanguageElement{return this.getElement(1403)};
	/**拖尾*/
	get Change_10():ISquareLanguageElement{return this.getElement(1404)};
	/**翅膀*/
	get Change_11():ISquareLanguageElement{return this.getElement(1405)};
	/**已获得*/
	get Change_12():ISquareLanguageElement{return this.getElement(1406)};
	/**确定购买吗*/
	get Change_13():ISquareLanguageElement{return this.getElement(1407)};
	/**是*/
	get Change_14():ISquareLanguageElement{return this.getElement(1408)};
	/**否*/
	get Change_15():ISquareLanguageElement{return this.getElement(1409)};
	/**恭喜获得！*/
	get Change_16():ISquareLanguageElement{return this.getElement(1410)};
	/**好的*/
	get Change_17():ISquareLanguageElement{return this.getElement(1411)};
	/**服饰总花费：*/
	get Change_18():ISquareLanguageElement{return this.getElement(1412)};
	/**提示：若有活动获得的服饰，需获取后才能保存哦！*/
	get Change_19():ISquareLanguageElement{return this.getElement(1413)};
	/**获取路径*/
	get Change_20():ISquareLanguageElement{return this.getElement(1414)};
	/**查看获取路径*/
	get Change_21():ISquareLanguageElement{return this.getElement(1415)};
	/**已获得*/
	get Change_22():ISquareLanguageElement{return this.getElement(1416)};
	/**校园购买*/
	get Change_23():ISquareLanguageElement{return this.getElement(1417)};
	/**可通过{0}活动获得*/
	get Change_24():ISquareLanguageElement{return this.getElement(1418)};
	/**退出*/
	get Change_25():ISquareLanguageElement{return this.getElement(1419)};
	/**确定要退出吗？退出后服装无法保存哦！*/
	get Change_26():ISquareLanguageElement{return this.getElement(1420)};
	/**旅行商人*/
	get npc1_name():ISquareLanguageElement{return this.getElement(2000)};
	/**与旅行商人对话*/
	get icon_touch_1():ISquareLanguageElement{return this.getElement(2001)};
	/**随便看看吧，我这里的东西都是独一无二的！*/
	get npc1_talk_text1():ISquareLanguageElement{return this.getElement(2002)};
	/**我是谁？我在哪？*/
	get npc1_talk_text2():ISquareLanguageElement{return this.getElement(2003)};
	/**你是谁？*/
	get npc1_talk_text3():ISquareLanguageElement{return this.getElement(2004)};
	/**你这里卖点什么？*/
	get npc1_talk_text4():ISquareLanguageElement{return this.getElement(2005)};
	/**查看任务*/
	get npc1_talk_text5():ISquareLanguageElement{return this.getElement(2006)};
	/**没事了*/
	get npc1_talk_text6():ISquareLanguageElement{return this.getElement(2007)};
	/**你是坐车坐迷糊了吗？这里是童话小镇，一个充满乐趣与挑战的地方。*/
	get npc1_talk_text7():ISquareLanguageElement{return this.getElement(2008)};
	/**我？我是穿梭于银河中的旅行商人，哪里有买卖哪里就有我。*/
	get npc1_talk_text8():ISquareLanguageElement{return this.getElement(2009)};
	/**当然是我不远万里，从宇宙各地搜集来的美丽服装，希望你能喜欢。*/
	get npc1_talk_text9():ISquareLanguageElement{return this.getElement(2010)};
	/**祝你玩得愉快，我的朋友！*/
	get npc1_talk_text10():ISquareLanguageElement{return this.getElement(2011)};
	/**再问问其他的*/
	get npc1_talk_text11():ISquareLanguageElement{return this.getElement(2012)};
	/**你这价格也太离谱了！*/
	get npc1_talk_text12():ISquareLanguageElement{return this.getElement(2013)};
	/**我没钱，可以直接送我吗？*/
	get npc1_talk_text13():ISquareLanguageElement{return this.getElement(2014)};
	/**中间这件看着不错，怎么买不了？*/
	get npc1_talk_text14():ISquareLanguageElement{return this.getElement(2015)};
	/**这个我不喜欢，换一个*/
	get npc1_talk_text15():ISquareLanguageElement{return this.getElement(2016)};
	/**接受任务*/
	get npc1_talk_text16():ISquareLanguageElement{return this.getElement(2017)};
	/**芜湖~等你的好消息！我的朋友！*/
	get npc1_talk_text17():ISquareLanguageElement{return this.getElement(2018)};
	/**哈哈哈，那是自然。正所谓一分钱一分货，我摆出来这些可都是极品！*/
	get npc1_talk_text18():ISquareLanguageElement{return this.getElement(2019)};
	/**我的老天，这当然不行。老老实实付钱，或者用蓝宝石来交换！*/
	get npc1_talk_text19():ISquareLanguageElement{return this.getElement(2020)};
	/**嗯？你眼光不错，不过这可是我的宝贝，不卖不卖。不过我今天心情好，允许你试穿一下。*/
	get npc1_talk_text20():ISquareLanguageElement{return this.getElement(2021)};
	/**这个蓝宝石怎么获得？*/
	get npc1_talk_text21():ISquareLanguageElement{return this.getElement(2022)};
	/**接取任务并完成它，我会给予你蓝宝石作为报酬！*/
	get npc1_talk_text22():ISquareLanguageElement{return this.getElement(2023)};
	/**到达巨大藤蔓的顶端，我将给予你8颗蓝宝石作为奖励。*/
	get npc1_talk_text23():ISquareLanguageElement{return this.getElement(2024)};
	/**我来自星辰大海*/
	get npc1_speak_1():ISquareLanguageElement{return this.getElement(2025)};
	/**迎宾大叔*/
	get npc2_name():ISquareLanguageElement{return this.getElement(2026)};
	/**门卫*/
	get npc3_name():ISquareLanguageElement{return this.getElement(2027)};
	/**指引-小黎*/
	get npc4_name():ISquareLanguageElement{return this.getElement(2028)};
	/**热心好市民*/
	get npc5_name():ISquareLanguageElement{return this.getElement(2029)};
	/**宠物饲养员*/
	get npc6_name():ISquareLanguageElement{return this.getElement(2030)};
	/**可疑的市民*/
	get npc7_name():ISquareLanguageElement{return this.getElement(2031)};
	/**冠军雕像*/
	get champion_statue():ISquareLanguageElement{return this.getElement(2032)};
	/**瞧一瞧看一看嘞~新鲜出炉的任务嘞~*/
	get npc1_text():ISquareLanguageElement{return this.getElement(2033)};
	/**此区域暂未开放...*/
	get npc2_text():ISquareLanguageElement{return this.getElement(2034)};
	/**请出示证件*/
	get npc3_text():ISquareLanguageElement{return this.getElement(2035)};
	/**进入传送门，可以快速到达指定区域哦~*/
	get npc4_text():ISquareLanguageElement{return this.getElement(2036)};
	/**这些衣服实在是泰裤辣！！*/
	get npc5_text():ISquareLanguageElement{return this.getElement(2037)};
	/**给可爱的小动物们买些营养的饲料吧！~*/
	get npc6_text():ISquareLanguageElement{return this.getElement(2038)};
	/**离我远点...*/
	get npc7_text():ISquareLanguageElement{return this.getElement(2039)};
	/**你瞅啥？*/
	get npc8_text():ISquareLanguageElement{return this.getElement(2040)};
	/**瞅你咋的？*/
	get npc9_text():ISquareLanguageElement{return this.getElement(2041)};
	/**男巨人*/
	get npc8_name():ISquareLanguageElement{return this.getElement(2042)};
	/**女巨人*/
	get npc9_name():ISquareLanguageElement{return this.getElement(2043)};
	/**换上至少5次广场上的服装，我将给予你3颗蓝宝石作为奖励。*/
	get npc1_talk_text24():ISquareLanguageElement{return this.getElement(2044)};
	/**骑乘至少1次向导-胖达，我将给予你1颗蓝宝石作为奖励。*/
	get npc1_talk_text25():ISquareLanguageElement{return this.getElement(2045)};
	/**累计举起任意NPC至少3次，我将给予你3颗蓝宝石作为奖励。*/
	get npc1_talk_text26():ISquareLanguageElement{return this.getElement(2046)};
	/**找到我之前丢在某处的背包，我将给予你5颗蓝宝石作为奖励。*/
	get npc1_talk_text27():ISquareLanguageElement{return this.getElement(2047)};
	/**吼~~！！(火龙王似乎很兴奋)*/
	get guide_talk_text1():ISquareLanguageElement{return this.getElement(2048)};
	/**救命！那条该死的火龙又来了！来自魔法学院的优秀学生啊，请帮我们赶走它！*/
	get guide_talk_text2():ISquareLanguageElement{return this.getElement(2049)};
	/**好吧，火龙王在哪里?*/
	get guide_talk_text3():ISquareLanguageElement{return this.getElement(2050)};
	/**不了，我只是来参观的*/
	get guide_talk_text4():ISquareLanguageElement{return this.getElement(2051)};
	/**火龙王位于一座巨大藤蔓的顶部。使用战斗法杖赶走它吧！*/
	get guide_talk_text5():ISquareLanguageElement{return this.getElement(2052)};
	/**求求你，击败火龙王会得到远高于其他任务的蓝宝石，这可是能用来购买稀有时装的好东西！你真的不考虑下吗？*/
	get guide_talk_text6():ISquareLanguageElement{return this.getElement(2053)};
	/**大致了解了*/
	get guide_talk_text7():ISquareLanguageElement{return this.getElement(2054)};
	/**精灵是什么？*/
	get guide_talk_text8():ISquareLanguageElement{return this.getElement(2055)};
	/**真的不考虑*/
	get guide_talk_text9():ISquareLanguageElement{return this.getElement(2056)};
	/**那就快出发吧！对了，可以使用传送口快速到达藤蔓底部哦!*/
	get guide_talk_text10():ISquareLanguageElement{return this.getElement(2057)};
	/**精灵会帮助你攻击火龙王，你可以同时契约2只精灵，但每只精灵只能使用3分钟哦！*/
	get guide_talk_text11():ISquareLanguageElement{return this.getElement(2058)};
	/**这是力量精灵，它伤害很高但是动作较慢。它们经常在藤蔓区域活动。*/
	get guide_talk_text12():ISquareLanguageElement{return this.getElement(2059)};
	/**这是敏捷精灵，它的特点是动作快，但是伤害较低。同样的，他们也活动于藤蔓区域哦！*/
	get guide_talk_text13():ISquareLanguageElement{return this.getElement(2060)};
	/**这样吗...那好吧，火龙王我们会自己想办法，请好好享受游玩时光~可以找我接取些日常任务，也是可以获得蓝宝石的哦~*/
	get guide_talk_text14():ISquareLanguageElement{return this.getElement(2061)};
	/**好的我出发了*/
	get guide_talk_text15():ISquareLanguageElement{return this.getElement(2062)};
	/**没听懂，重新说一遍*/
	get guide_talk_text16():ISquareLanguageElement{return this.getElement(2063)};
	/**火龙王即将释放火球，快闪开！*/
	get guide_talk_text17():ISquareLanguageElement{return this.getElement(2064)};
	/**火龙王即将释放龙之吐息，快闪开！*/
	get guide_talk_text18():ISquareLanguageElement{return this.getElement(2065)};
	/**火龙王即将释放野蛮冲撞，快闪开！*/
	get guide_talk_text19():ISquareLanguageElement{return this.getElement(2066)};
	/**火龙王即将释放龙卷风，快闪开！*/
	get guide_talk_text20():ISquareLanguageElement{return this.getElement(2067)};
	/**吼~~！！！(火龙王很痛苦，迅速飞走了...)*/
	get guide_talk_text21():ISquareLanguageElement{return this.getElement(2068)};
	/**众人齐心协力，击退了火龙王*/
	get guide_talk_text22():ISquareLanguageElement{return this.getElement(2069)};
	/**多亏你，勇士！一路上辛苦了，快来找我，我给你介绍我们这的特色！*/
	get guide_talk_text23():ISquareLanguageElement{return this.getElement(2070)};
	/**火龙王似乎很无聊，缓缓飞走了...*/
	get guide_talk_text24():ISquareLanguageElement{return this.getElement(2071)};
	/**谢天谢地，这该死的龙终于走了。一路上辛苦了，快来找我，我给你介绍我们这的特色！*/
	get guide_talk_text25():ISquareLanguageElement{return this.getElement(2072)};
	/**让力量精灵跟随*/
	get guide_talk_text26():ISquareLanguageElement{return this.getElement(2073)};
	/**让敏捷精灵跟随*/
	get guide_talk_text27():ISquareLanguageElement{return this.getElement(2074)};
	/**与力量精灵签订契约，它将跟随你3分钟*/
	get guide_talk_text28():ISquareLanguageElement{return this.getElement(2075)};
	/**与敏捷精灵签订契约，它将跟随你3分钟*/
	get guide_talk_text29():ISquareLanguageElement{return this.getElement(2076)};
	/**与力量精灵契约已满3分钟，它回去了...*/
	get guide_talk_text30():ISquareLanguageElement{return this.getElement(2077)};
	/**与敏捷精灵契约已满3分钟，它回去了...*/
	get guide_talk_text31():ISquareLanguageElement{return this.getElement(2078)};
	/**我马上来*/
	get guide_talk_text32():ISquareLanguageElement{return this.getElement(2079)};
	/**好的*/
	get guide_talk_text33():ISquareLanguageElement{return this.getElement(2080)};
	/**火龙王*/
	get npc_dragon():ISquareLanguageElement{return this.getElement(2081)};
	/**对了，藤蔓上寄宿着很多精灵，也许他们会对你有所帮助！*/
	get guide_talk_text34():ISquareLanguageElement{return this.getElement(2082)};
	/**不要放弃，勇士！我已将你传送到安全的地方，在这里你将不会受到伤害。休整片刻就请再次出发吧！*/
	get guide_talk_text35():ISquareLanguageElement{return this.getElement(2083)};
	/**击杀藤蔓顶部的火龙王，我将给予你20颗蓝宝石作为奖励。*/
	get npc1_talk_text28():ISquareLanguageElement{return this.getElement(2084)};
	/**被绑架的npc*/
	get riped_npcname():ISquareLanguageElement{return this.getElement(2085)};
	/**发现入侵者！*/
	get monster_talk_1():ISquareLanguageElement{return this.getElement(3001)};
	/**绝不放过任何可疑人士！*/
	get monster_talk_2():ISquareLanguageElement{return this.getElement(3002)};
	/**让你见识下香蕉组组长的厉害！~*/
	get leader_talk_1():ISquareLanguageElement{return this.getElement(3003)};
	/**真是一群靠不住的家伙...*/
	get leader_talk_2():ISquareLanguageElement{return this.getElement(3004)};
	/**你居然能找到这里，是我小看你了！*/
	get boss_talk_1():ISquareLanguageElement{return this.getElement(3005)};
	/**我就是香蕉组老大，不许笑！*/
	get boss_talk_2():ISquareLanguageElement{return this.getElement(3006)};
	/**呜哇，疼疼疼，你来真的啊？？*/
	get boss_hurt_talk1():ISquareLanguageElement{return this.getElement(3007)};
	/**认输了认输了，不打了QAQ*/
	get boss_hurt_talk2():ISquareLanguageElement{return this.getElement(3008)};
	/**别打了别打了，我再也不干坏事啦~~*/
	get boss_hurt_talk3():ISquareLanguageElement{return this.getElement(3009)};
	/**我一定会回来的！~~*/
	get boss_dead_talk():ISquareLanguageElement{return this.getElement(3010)};
	/**欢迎参观香蕉组老大的私人车库！~*/
	get shop_talk_1():ISquareLanguageElement{return this.getElement(3011)};
	/**这里就是香蕉组的秘密基地了，赶快去教训这群无恶不作的坏蛋吧！*/
	get guide_npc_text1():ISquareLanguageElement{return this.getElement(3012)};
	/**香蕉组头目就藏在这座基地的最深处，去把他揪出来！*/
	get guide_npc_text2():ISquareLanguageElement{return this.getElement(3013)};
	/**“欸嘿嘿嘿”*/
	get guide_boss_text1():ISquareLanguageElement{return this.getElement(3014)};
	/**听说有人想教训我？有胆量就来吧，我在办公室等你哦~*/
	get guide_boss_text2():ISquareLanguageElement{return this.getElement(3015)};
	/**组员*/
	get monster_name1():ISquareLanguageElement{return this.getElement(3016)};
	/**组长—白猴*/
	get monster_name2():ISquareLanguageElement{return this.getElement(3017)};
	/**组长—黄猴*/
	get monster_name3():ISquareLanguageElement{return this.getElement(3018)};
	/**头目*/
	get monster_name4():ISquareLanguageElement{return this.getElement(3019)};
	/**你居然能找到这里，是我小看你了！*/
	get guide_bossroom_enter():ISquareLanguageElement{return this.getElement(3020)};
	/**我一定会回来的...额啊~~*/
	get guide_boss_dead():ISquareLanguageElement{return this.getElement(3021)};
	/**神秘的声音*/
	get npc_name_system():ISquareLanguageElement{return this.getElement(3022)};
	/**金库的封印解开了...*/
	get npc_name_system_tip1():ISquareLanguageElement{return this.getElement(3023)};
	/**头目的车库现在可以进入了...*/
	get npc_name_system_tip2():ISquareLanguageElement{return this.getElement(3024)};
	/**还有几{0}s复活*/
	get npc_name_system_tip3():ISquareLanguageElement{return this.getElement(3025)};
	/**狸月*/
	get npc1_name_space():ISquareLanguageElement{return this.getElement(5001)};
	/**跟随狸月的脚步，一起跳舞吧~*/
	get npc1_talk_space():ISquareLanguageElement{return this.getElement(5002)};
	/**狸月*/
	get npc2_name_space():ISquareLanguageElement{return this.getElement(5003)};
	/**白天的我，和夜晚的我，你更喜欢谁？*/
	get npc2_talk_space():ISquareLanguageElement{return this.getElement(5004)};
	/**你切换太快了！*/
	get Tips_1001():ISquareLanguageElement{return this.getElement(5005)};
	/**宇宙内无法使用双人动作*/
	get Tips_1002():ISquareLanguageElement{return this.getElement(5006)};
	/**请先解除变身状态*/
	get Tips_12():ISquareLanguageElement{return this.getElement(5007)};
	/**变身状态下无法更换服装*/
	get Tips_13():ISquareLanguageElement{return this.getElement(5008)};
	/**该物品需要在梦幻魔法学院购买*/
	get Tips_1003():ISquareLanguageElement{return this.getElement(5009)};
	/**该物品需要参与活动才能获得*/
	get Tips_1004():ISquareLanguageElement{return this.getElement(5010)};
	/**钻石不足*/
	get Tips_1005():ISquareLanguageElement{return this.getElement(5011)};
	/**该服装无法购买*/
	get Tips_1006():ISquareLanguageElement{return this.getElement(5012)};
	/**梦幻魔法学院购买*/
	get Tips_1007():ISquareLanguageElement{return this.getElement(5013)};
	/**暂无途径获取*/
	get Tips_1008():ISquareLanguageElement{return this.getElement(5014)};
	/**限购次数 {0}/{1}*/
	get Text_Text_984():ISquareLanguageElement{return this.getElement(5015)};
	/**最少购买一个*/
	get Tips_17():ISquareLanguageElement{return this.getElement(5016)};
	/**没有更多了*/
	get Tips_18():ISquareLanguageElement{return this.getElement(5017)};
	/**你已经进入空间站*/
	get Tips_1009():ISquareLanguageElement{return this.getElement(5018)};
	/**你已经进入宇宙区域*/
	get Tips_1010():ISquareLanguageElement{return this.getElement(5019)};
	/**已到达空间站边界区域，以后再来探索吧*/
	get Tips_1011():ISquareLanguageElement{return this.getElement(5020)};
	/**当前区域无法使用该道具*/
	get Tips_1012():ISquareLanguageElement{return this.getElement(5021)};
	/**你已拥有该道具*/
	get Tips_1013():ISquareLanguageElement{return this.getElement(5022)};
	/**成功购买了道具:{0}*/
	get Tips_1014():ISquareLanguageElement{return this.getElement(5023)};
	/**已开启自动攻击*/
	get Tips_1015():ISquareLanguageElement{return this.getElement(5024)};
	/**已关闭自动攻击*/
	get Tips_1016():ISquareLanguageElement{return this.getElement(5025)};
	/**正在搭载:*/
	get Tips_1017():ISquareLanguageElement{return this.getElement(5026)};
	/**已退出搭载*/
	get Tips_1018():ISquareLanguageElement{return this.getElement(5027)};
	/**还剩30秒的使用时间！*/
	get Tips_1019():ISquareLanguageElement{return this.getElement(5028)};
	/**输入不合法！！！！*/
	get SettingUI_tex_2():ISquareLanguageElement{return this.getElement(5029)};
	/**UFO似乎盯上你了!*/
	get Tips_1020():ISquareLanguageElement{return this.getElement(5030)};
	/**暴击*/
	get Tips_1021():ISquareLanguageElement{return this.getElement(5031)};
	/**空间站 入口*/
	get Tips_1022():ISquareLanguageElement{return this.getElement(5032)};
	/**受到来自魔法校园的庇护，你即将复活：*/
	get Tips_1023():ISquareLanguageElement{return this.getElement(5033)};
	/**还有{0}s传送回校园*/
	get Tips_1024():ISquareLanguageElement{return this.getElement(5034)};
	/**传送中*/
	get Tips_1025():ISquareLanguageElement{return this.getElement(5035)};
	/**要回到梦幻魔法校园吗？*/
	get Tips_1026():ISquareLanguageElement{return this.getElement(5036)};
	/**{0}已达租赁时间，请重新租借。*/
	get Tips_1027():ISquareLanguageElement{return this.getElement(5037)};
	/**神秘的声音*/
	get Tips_1028():ISquareLanguageElement{return this.getElement(5038)};
	/**已经丢弃了道具:{0}*/
	get Tips_1029():ISquareLanguageElement{return this.getElement(5039)};

}