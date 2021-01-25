import GameMag from "../manage/GameMag";
import AudioMag from "../manage/AudioMag";
import ToolsMag from "../manage/ToolsMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";
import ConfigMag from "../manage/ConfigMag";
import { hts } from "../hutui/Hts";
import SdkManager from "../sdk/SdkManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeMain extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    loginPage: cc.Node = null;
    @property(cc.Node)
    taskArrow: cc.Node = null;
    @property(cc.Node)
    achieveCup: cc.Node = null;
    @property(cc.Node)
    backBtn: cc.Node = null;
    @property(cc.Node)
    startBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "签到按钮" })
    signInBtn: cc.Node = null;
    @property(cc.Node)
    shopBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "成就按钮" })
    achieveBtn: cc.Node = null;
    @property(cc.Node)
    taskBtnLight: cc.Node = null;
    @property({ type: cc.Node, tooltip: "日常任务" })
    taskBtn: cc.Node = null;
    @property(cc.Label)
    levelLab: cc.Label = null;
    @property({ type: [cc.Vec2], tooltip: "显示任务图标的坐标" })
    taskPos: cc.Vec2[] = []; //从左到右
    @property(cc.Node)
    taskBox: cc.Node = null;
    @property(cc.Prefab)
    circle: cc.Prefab = null;
    @property({ type: cc.Node, tooltip: "单个的互推icon轮播" })
    singleCarousel: cc.Node = null;
    @property(cc.Sprite)
    moreGameImg: cc.Sprite = null;
    @property(cc.Label)
    moreGameName: cc.Label = null;
    @property({ type: cc.Node, tooltip: "热门角标" })
    hotIcon: cc.Node = null;
    @property({ type: cc.Node, tooltip: "更多游戏" })
    moreGameBtn: cc.Node = null;
    @property({ type: cc.Sprite, tooltip: "试用的武器" })
    gunIcon: cc.Sprite = null;
    @property({ type: cc.Node, tooltip: "金币buff按钮" })
    coinBuffBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "钻石buff按钮" })
    diamondBuffBtn: cc.Node = null;
    @property({ type: cc.Label, tooltip: "金币buff倒计时" })
    coinBuffTimer: cc.Label = null;
    @property({ type: cc.Label, tooltip: "钻石buff倒计时" })
    diamondBuffTimer: cc.Label = null;

    screenW: number = 0;
    updateBgDis: number = 22;//绿屏的移动速度
    gunNogetData: any = null; //首页的试用武器下标
    buffInitTime: number = 6 * 60 * 60; //buff重置时间:6小时
    // startTime: number = 0;
    singleCaroData: any = null;
    singleData: any = null;

    //计算在线时长用的
    timer() {
        GameMag.Ins.updateAchieveRecord(2);
    }
    onLoad() {
        // this.startTime = new Date().getTime();
        AudioMag.getInstance().playBGM("BGM");
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit | cc.PhysicsManager.DrawBits.e_jointBit | cc.PhysicsManager.DrawBits.e_shapeBit;
        this.initUI();
        // this.initTryGun();
        this.showLevelTask();
        this.judgeTaskArrow();
        this.judgeAchieve();
        // this.initMoreGame();
        // this.initRewardBuff();
        this.gameEvents();
        GameMag.Ins.initHomePools();
    }
    initRewardBuff() {
        this.coinBuffBtn.on(cc.Node.EventType.TOUCH_END, this.onGetCoinBuff, this);
        this.diamondBuffBtn.on(cc.Node.EventType.TOUCH_END, this.onGetDiamondBuff, this);
        let coinStamp = GameMag.Ins.rewardBuff.coinBuff;
        let diamondStamp = GameMag.Ins.rewardBuff.diamondBuff;
        let stamp = new Date().getTime();
        let coinDiff = Math.floor((stamp - coinStamp) / 1000);
        let diamondDiff = Math.floor((stamp - diamondStamp) / 1000);
        if (coinDiff >= this.buffInitTime) { //超过了时间就重置
            GameMag.Ins.doubleCoinTime = false;
            GameMag.Ins.resetRewardBuff(0);
            this.coinBuffBtn.pauseSystemEvents(true);
            this.coinBuffTimer.node.active = false;
            this.coinBuffBtn.active = true;
        } else {//显示倒计时
            GameMag.Ins.doubleCoinTime = true;
            this.coinBuffBtn.resumeSystemEvents(true);
            this.coinBuffTimer.node.active = true;
            this.coinBuffBtn.active = false; //隐藏按钮
            this.coinBuffTimer.string = String(ToolsMag.Ins.formateTime(this.buffInitTime - coinDiff));
            this.schedule(this.coinBuffSche, 1);
        }
        if (diamondDiff >= this.buffInitTime) { //超过了时间就重置
            GameMag.Ins.doubleDiamondTime = false;
            GameMag.Ins.resetRewardBuff(1);
            this.diamondBuffBtn.pauseSystemEvents(true);
        } else {//显示倒计时
            GameMag.Ins.doubleDiamondTime = true;
            this.diamondBuffBtn.resumeSystemEvents(true);
            this.diamondBuffTimer.node.active = true;
            this.diamondBuffBtn.active = false;
            this.diamondBuffTimer.string = String(ToolsMag.Ins.formateTime(this.buffInitTime - diamondDiff));
            this.schedule(this.diamondBuffSche, 1);
        }
    }
    onGetCoinBuff() {
        GameMag.Ins.doubleCoinTime = true;
        GameMag.Ins.startRewardBuff(0);
        this.coinBuffTimer.node.active = true;
        this.coinBuffBtn.active = false; //隐藏按钮
        this.coinBuffTimer.string = String(ToolsMag.Ins.formateTime(this.buffInitTime));
        this.schedule(this.coinBuffSche, 1);
    }
    coinBuffSche() {
        let stamp = GameMag.Ins.rewardBuff.coinBuff;
        let nowStamp = new Date().getTime();
        let diff = Math.floor((nowStamp - stamp) / 1000);
        if (this.buffInitTime - diff <= 0) { //奖励时间到了
            GameMag.Ins.doubleCoinTime = false;
            this.coinBuffTimer.node.active = false;
            this.coinBuffBtn.active = true; //隐藏按钮
            GameMag.Ins.resetRewardBuff(0);
            this.coinBuffBtn.resumeSystemEvents(true);
            this.unschedule(this.coinBuffSche);
        } else {
            this.coinBuffBtn.pauseSystemEvents(true);
        }
        this.coinBuffTimer.string = String(ToolsMag.Ins.formateTime(this.buffInitTime - diff + 1));
    }
    onGetDiamondBuff() {
        GameMag.Ins.doubleDiamondTime = true;
        GameMag.Ins.startRewardBuff(1);
        this.diamondBuffTimer.node.active = true;
        this.diamondBuffBtn.active = false; //隐藏按钮
        this.diamondBuffTimer.string = String(ToolsMag.Ins.formateTime(this.buffInitTime));
        this.schedule(this.diamondBuffSche, 1);
    }
    diamondBuffSche() {
        let stamp = GameMag.Ins.rewardBuff.diamondBuff;
        let nowStamp = new Date().getTime();
        let diff = Math.floor((nowStamp - stamp) / 1000);
        if (this.buffInitTime - diff <= 0) {//奖励时间到了
            GameMag.Ins.doubleDiamondTime = false;
            this.diamondBuffTimer.node.active = false;
            this.diamondBuffBtn.active = true; //隐藏按钮
            GameMag.Ins.resetRewardBuff(1);
            this.diamondBuffBtn.resumeSystemEvents(true);
            this.unschedule(this.diamondBuffSche);
        } else {
            this.diamondBuffBtn.pauseSystemEvents(true);
        }
        this.diamondBuffTimer.string = String(ToolsMag.Ins.formateTime(this.buffInitTime - diff + 1));
    }
    initUI() {
        GameMag.Ins.trySkin = null;
        GameMag.Ins.tryGun = null;
        GameMag.Ins.tryGunBullet = null;
        GameMag.Ins.tryGunEquip = null;
        const lv = GameMag.Ins.level;
        this.levelLab.string = String("第" + lv + "天");
        // if (!GameMag.Ins.guide[0]) {
        //     DialogMag.Ins.show(DialogPath.GuideDialog, DialogScript.GuideDialog, [0, 0, cc.v2(0, -230)]);
        // }
        // if (GameMag.Ins.guide[0]) {
        //     this.initBackground();
        // }
        // this.initBackground();
        // if (lv > 1 && !GameMag.Ins.guide[7]) {
        //     const ps = cc.v2(this.shopBtn.x, this.shopBtn.y - 70);
        //     DialogMag.Ins.show(DialogPath.GuideDialog, DialogScript.GuideDialog, [7, 0, cc.Vec2.ZERO, cc.v2(ps.x, ps.y)]);
        // }
        cc.tween(this.taskBtnLight)
            .repeatForever(
                cc.tween().to(1.5, { scale: 2, opacity: 130 }).delay(0.1).to(1.5, { scale: 1.7, opacity: 80 }).delay(0.15)
            )
            .start();
        this.shakeIcon(this.taskBtn);
    }
    onDestroy() {
        this.unschedule(this.coinBuffSche);
        this.unschedule(this.diamondBuffSche);
        this.unschedule(this.singleCarouselTimer);
    }
    singleCarouselTimer() {
        let self = this;
        let data = this.singleCaroData;
        const index = Math.floor(Math.random() * data.length);
        const rest = data[index];
        this.singleData = rest;
        // console.log("icon轮播位单个数据", rest);
        cc.assetManager.loadRemote(rest.iconUrl, function (err, texture) {
            if (err) {
                console.error("loadRemote出错", err);
                return;
            }
            self.singleCarousel.active = true;
            self.moreGameImg.spriteFrame = new cc.SpriteFrame(texture);
            self.moreGameName.string = String(rest.txt);
            if (rest.mark.length > 0) {
                self.hotIcon.active = true;
            }
        });
    }
    //互推和更多游戏
    initMoreGame() {
        if (cc.sys.isBrowser) return;
        let self = this;
        this.singleCarousel.active = false;
        console.log("launchData", GameMag.Ins.launchData);
        hts.init("5fdc8980d1b5c92d77836329", GameMag.Ins.launchData.path, function (err, res) {
            if (err) {
                console.error("互推初始化出错", err);
                return;
            }
            console.log("互推初始化", res);
            const bid = "5fdc89aad1b5c92d7783632b";
            hts.getBox(bid, function (err, res) {
                if (err) {
                    console.error("getBox", err);
                    return;
                }
                console.log("icon轮播位getBox", res[0]);
                self.singleCaroData = res[0];
                self.singleCarouselTimer();
                self.unschedule(self.singleCarouselTimer);
                self.schedule(self.singleCarouselTimer, 3);
                self.shakeIcon(self.singleCarousel);
            });
        });
        this.singleCarousel.on(cc.Node.EventType.TOUCH_END, function () {
            if (GameMag.Ins.showJumpToGame) return;
            GameMag.Ins.showJumpToGame = true;
            const data = self.singleData;
            const bid = "5fdc89aad1b5c92d7783632b";
            SdkManager.instance.openOtherGame(data, bid);
        }, this);
    }
    gameEvents() {
        this.levelLab.node.on(cc.Node.EventType.TOUCH_END, function () {
            GameMag.Ins.removeAllLocalData(); //上线后记得代码删除
        }, this);
        cc.game.off(cc.game.EVENT_SHOW);
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("进入游戏");
            AudioMag.getInstance().playBGM("BGM");
            this.schedule(this.timer, 60);
        }.bind(this), this);
        cc.game.off(cc.game.EVENT_HIDE);
        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("退出游戏");
            this.unschedule(this.timer);
            // const data = GameMag.Ins.uploadData;
            // if (!cc.sys.isBrowser && !data.firstInToday.status) {
            //     const t = new Date().getTime();
            //     const diff = Math.floor((t - this.startTime) / 1000);
            //     // 每个用户每日首次进入使用时长
            //     //@ts-ignore
            //     wx.reportUserBehaviorBranchAnalytics({
            //         branchId: 'BCBgAAoXHx5d138Ug9YRx6',
            //         branchDim: `${diff}`, // 自定义维度(可选)：类型String，取值[1,100]，必须为整数，当上传类型不符时不统计
            //         eventType: 1 // 1：曝光； 2：点击
            //     });
            // }
        }.bind(this), this);

        // cc.director.on("initBackground", this.initBackground, this);
        cc.director.on("judgeTaskArrow", this.judgeTaskArrow, this);
        cc.director.on("judgeAchieve", this.judgeAchieve, this);
        this.backBtn.on(cc.Node.EventType.TOUCH_END, this.onBack, this);
        // this.startBtn.on(cc.Node.EventType.TOUCH_END, this.onStartGame, this);
        this.shopBtn.on(cc.Node.EventType.TOUCH_END, this.onShopBtn, this);
        this.achieveBtn.on(cc.Node.EventType.TOUCH_END, this.onAchieveBtn, this);
        this.taskBtn.on(cc.Node.EventType.TOUCH_END, this.onTaskBtn, this);
        this.gunIcon.node.on(cc.Node.EventType.TOUCH_END, this.onBuffGet, this);
        this.signInBtn.on(cc.Node.EventType.TOUCH_END, function () {
            ToolsMag.Ins.buttonAction(this.signInBtn, function () {
                DialogMag.Ins.show(DialogPath.SignInDialog, DialogScript.SignInDialog, []);
            }.bind(this));
        }, this);
        this.moreGameBtn.on(cc.Node.EventType.TOUCH_END, function () {
            ToolsMag.Ins.buttonAction(this.moreGameBtn, function () {
                DialogMag.Ins.show(DialogPath.MoreGameDialog, DialogScript.MoreGameDialog, ["5fdc89d7d1b5c92d7783632d"]);
            }.bind(this));
        }, this);
    }
    // initBackground() {
    //     this.taskBox.children.forEach(item => {
    //         item.active = false;
    //     })
    //     this.scheduleOnce(() => {
    //         this.showUpdateBg();
    //     }, 0.3);
    // }
    // showUpdateBg() {
    //     AudioMag.getInstance().playSound("地图");
    //     this.schedule(this.bgMoveLeft, 0.016);
    // }
    // bgMoveLeft() {
    //     this.updateBg.width += this.updateBgDis;
    //     this.updateBg.getChildByName("light").x = this.updateBg.width;
    //     if (this.updateBg.width >= this.defaultBg.width) {
    //         this.unschedule(this.bgMoveLeft);
    //         this.showLevelTask();
    //         this.schedule(this.bgMoveRight, 0.016);
    //     }
    // }
    // bgMoveRight() {
    //     this.updateBg.width -= this.updateBgDis;
    //     this.updateBg.getChildByName("light").x = this.updateBg.width;
    //     if (this.updateBg.width < 0) {
    //         // let todaySign = GameMag.Ins.signInData.todaySign;
    //         // if (!todaySign && GameMag.Ins.guide[1]) {
    //         //     DialogMag.Ins.show(DialogPath.SignInDialog, DialogScript.SignInDialog, []);
    //         // }
    //         this.unschedule(this.bgMoveRight);
    //     }
    // }
    onBack() {
        ToolsMag.Ins.buttonAction(this.backBtn, function () {
            this.loginPage.active = true;
        }.bind(this));
    }
    start() {
        cc.assetManager.loadBundle("game", (err, bundle) => {
            console.log(err, bundle);
            cc.director.preloadScene(GameMag.Ins.gameScene, function (completedCount: number, totalCount: number, item: any) { }, function (err) {
                if (err) throw new Error(`${err}`);
                GameMag.Ins.gameLoaded = true;
                console.log("游戏场景预加载完成");
            }.bind(this));
        })
    }
    // onStartGame() {
    //     let self = this;
    //     ToolsMag.Ins.buttonAction(this.startBtn, function () {
    //         self.loginPage.active = false;
    //         self.initBackground();
    //     }.bind(this));
    // }
    onShopBtn() {
        ToolsMag.Ins.buttonAction(this.shopBtn, function () {
            DialogMag.Ins.show(DialogPath.ShopDialog, DialogScript.ShopDialog, []);
        }.bind(this));
    }
    onAchieveBtn() {
        this.achieveCup.stopAllActions();
        this.achieveCup.opacity = 255;
        ToolsMag.Ins.buttonAction(this.achieveBtn, function () {
            DialogMag.Ins.show(DialogPath.AchieveDialog, DialogScript.AchieveDialog, []);
        }.bind(this));
    }
    onTaskBtn() {
        ToolsMag.Ins.buttonAction(this.taskBtn, function () {
            DialogMag.Ins.show(DialogPath.TaskDialog, DialogScript.TaskDialog, []);
        }.bind(this));
    }
    //每日任务的箭头
    judgeTaskArrow() {
        let taskData = GameMag.Ins.taskData;
        let cigData = ConfigMag.Ins.getTaskData();
        for (let index = 0; index < cigData.length; index++) {
            const item = cigData[index];
            if (taskData.killSum >= item.killNum && !taskData.data[index].geted) {
                // this.taskArrow.active = true;
                // const ps = this.taskArrow.position;
                // let action = cc.repeatForever(
                //     cc.sequence(
                //         cc.moveTo(0.5, ps.x, ps.y - 6),
                //         cc.moveTo(0.5, ps.x, ps.y + 6)
                //     )
                // )
                // this.taskArrow.stopAllActions();
                // cc.tween(this.taskArrow)
                //     .then(action)
                //     .start();
                return;
            } else {
                this.taskArrow.active = false;
                return;
            }
        }
    }
    judgeAchieve() {
        const achieveData = GameMag.Ins.achieveData;
        const localData = GameMag.Ins.achieveRecord;
        const cigData = ConfigMag.Ins.getAchieveData();
        for (let i = 0; i < cigData.length; i++) {
            let num = null;
            switch (cigData[i].taskType) {
                case 0:
                    num = localData.killNum;
                    break;
                case 1:
                    num = localData.killBossNum;
                    break;
                case 2:
                    num = localData.timer;
                    break;
                case 3:
                    num = localData.level;
                    break;
                case 4:
                    num = localData.gunSum;
                    break;
                default:
                    break;
            }
            if (num >= cigData[i].target && !achieveData[i].geted) {
                // this.achieveCup.stopAllActions();
                // this.achieveCup.opacity = 255;
                // const _t = 0.7;
                // let ac = cc.tween().to(_t, { opacity: 0 }).to(_t, { opacity: 255 }).delay(_t);
                // cc.tween(this.achieveCup)
                //     .then(ac)
                //     .repeatForever()
                //     .start();
                break;
            }
        }
    }
    initTryGun() {
        let gunNogetData = [];
        GameMag.Ins.gunData.forEach(item => {
            if (!item.geted) {
                gunNogetData.push(item);
            }
        });
        const len = gunNogetData.length;
        if (len != 0) {
            const index = Math.floor(Math.random() * len);
            this.gunNogetData = gunNogetData[index];
            // console.log(this.gunNogetData);
            this.gunIcon.spriteFrame = this.homeAtlas.getSpriteFrame("gun_" + gunNogetData[index].gunID);
            this.shakeIcon(this.gunIcon.node.parent);
        } else {
            this.gunIcon.node.parent.active = false;
        }
    }
    onBuffGet() {
        DialogMag.Ins.show(DialogPath.MessageDialog, DialogScript.MessageDialog, ["已领取试用武器,前往杀敌"]);
        this.gunIcon.node.parent.active = false;
        console.log(this.gunNogetData);
        const tryGun = this.gunNogetData.gunID;
        const gunEquip = JSON.parse(JSON.stringify(GameMag.Ins.useingData)).gunEquip;
        let arr = gunEquip;
        if (arr.length < 4) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == tryGun) {
                    break;
                }
                if (arr[i] == -1) {
                    arr[i] = tryGun;
                    break;
                }
            }
        } else {
            arr[3] = tryGun; //如果装备列表满了,就把最后一个武器替换成试用武器
        }
        GameMag.Ins.tryGunEquip = arr;
        GameMag.Ins.tryGun = tryGun;
        const data = ConfigMag.Ins.getGunData()[tryGun];
        if (data.buyOnceNum == 0) {
            GameMag.Ins.tryGunBullet = 0;
        } else {
            GameMag.Ins.tryGunBullet = GameMag.Ins.initTryGunBullet; //试用武器赠送子弹
        }
    }
    shakeIcon(target) {
        let action = cc.repeatForever(
            cc.sequence(
                cc.repeat(
                    cc.sequence(
                        cc.scaleTo(0.2, 1.1),
                        cc.rotateTo(0.07, 5),
                        cc.rotateTo(0.07, -5),
                        cc.rotateTo(0.03, 0),
                        cc.scaleTo(0.2, 1)
                    ), 2),
                cc.delayTime(2)
            )
        );
        cc.tween(target)
            .then(action)
            .start();
    }
    /**
     * 规则
     * 1.
     * 
     */
    getTaskRandom(): number[] {
        let len = null; //出现的任务个数,不含无尽模式
        let lv = GameMag.Ins.level;
        let arr = null; //任务内容,规定哪些关卡应该只出现哪些任务
        if (lv == 1) {
            arr = [1]; //第一关固定分配击杀任务
            len = 1;
        } else if (lv == 2) {
            arr = [1, 2, 3, 4, 5];
            len = 2;
        } else if (lv == 3 || lv == 4) {
            arr = [1, 2, 3, 4, 5];
            len = 3;
        } else if (lv == 5) { //第6关之前不出现复合任务和钥匙任务
            arr = [1, 2, 3, 4, 5];
            len = 4;
        } else { //第6关之后才开始有钥匙相关模式
            arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            len = 5;
        }
        arr.sort(() => Math.random() - 0.5);//随机打乱
        let flag = 6;  //第6关才开始有无尽模式
        if (lv >= flag) {
            arr.unshift(0);
        }
        let newArr = arr.slice(0, len);//随机打乱后直接截取需要的前几个
        // console.log(newArr);
        return newArr;
    }
    /**
     * 显示首页的任务图标
     * 注意:节点的排序也得按这个顺序
     * 0:无尽模式 1:击杀模式 2:距离模式 3:时间模式 4.防御(时间)模式 5.护送模式 6 钥匙模式  7:击杀+时间模式 8:距离+时间模式  9:护送+时间  10:钥匙+时间
     */
    showLevelTask() {
        let initArr = null;
        const lv = GameMag.Ins.level;
        if (GameMag.Ins.taskTypeArr.length == 0) {
            initArr = this.getTaskRandom();
        } else {
            if (GameMag.Ins.taskTypeArr.length == 1 && GameMag.Ins.taskTypeArr[0] === 0) {
                initArr = this.getTaskRandom();
            } else {
                initArr = GameMag.Ins.taskTypeArr;
            }
        }
        GameMag.Ins.updateTaskTypeArr(initArr);
        console.log("任务列表:", initArr);
        GameMag.Ins.taskTypeArr = initArr;
        let arr = [0, 1, 2, 3, 4, 5];//主页地图坐标的下标
        if (lv == 1) {
            arr = [0]; //第一关固定放在第一个位置
        } else {
            arr.sort(() => Math.random() - 0.5);
        }
        let psArr = arr.slice(0, initArr.length);//随机分配坐标位置   
        console.log(psArr);
        for (let i = 0; i < initArr.length; i++) {
            let node = this.taskBox.children[initArr[i]];
            let ps = this.taskPos[psArr[i]];
            // if (!GameMag.Ins.guide[1]) {
            //     this.scheduleOnce(() => {
            //         DialogMag.Ins.show(DialogPath.GuideDialog, DialogScript.GuideDialog, [1, 0, cc.v2(0, -230), cc.v2(ps.x, ps.y - 150)]);
            //     }, 0.4);
            // }
            node.active = true;
            node.setPosition(ps);
            node.getComponent("task").init(initArr[i], psArr[i]);//任务编号,地图编号(逆时针)
            let circle = cc.instantiate(this.circle);
            circle.setPosition(ps.x, ps.y - 90);
            circle.parent = this.node;
        }
    }
}
