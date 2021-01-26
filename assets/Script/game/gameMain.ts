import GameMag from "../manage/GameMag";
import ToolsMag from "../manage/ToolsMag";
import AudioMag from "../manage/AudioMag";
import ConfigMag, { roleAnimate, mechaAnimate } from "../manage/ConfigMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";
import SdkManager from "../sdk/SdkManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMain extends cc.Component {

    @property(cc.Sprite)
    headImg: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    shopAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    gameAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    gameMainAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    roleCamera: cc.Node = null;
    @property({ type: [cc.Prefab], tooltip: "地图预制" })
    bgs: cc.Prefab[] = [];
    @property(cc.Node)
    bgBox: cc.Node = null;
    @property({ type: cc.Node, tooltip: "怪的父节点" })
    enemyBox: cc.Node = null;
    @property({ type: cc.Node, tooltip: "子弹壳父节点" })
    shellsBox: cc.Node = null;
    @property({ type: cc.Prefab, tooltip: "子弹壳" })
    bulletShellsPre: cc.Prefab = null;
    @property({ type: cc.Node, tooltip: "任务父节点" })
    taskBox: cc.Node = null;
    @property(cc.PhysicsBoxCollider)
    ground: cc.PhysicsBoxCollider = null;
    @property(cc.Node)
    role: cc.Node = null;
    @property(cc.ProgressBar)
    bloodBar: cc.ProgressBar = null;
    @property({ type: cc.Node, tooltip: "攻击或发射" })
    attackBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "切换武器" })
    switchBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "武器装备列表" })
    gunBox: cc.Node = null;
    @property({ type: cc.Node, tooltip: "道具装备列表" })
    assistBox: cc.Node = null;
    @property({ type: cc.Node, tooltip: "机甲装备列表" })
    mechaBox: cc.Node = null;
    @property(cc.Node)
    leftBox: cc.Node = null;
    @property(cc.Node)
    rightBox: cc.Node = null;
    @property(cc.Node)
    leftBtn: cc.Node = null;
    @property(cc.Node)
    rightBtn: cc.Node = null;
    @property(cc.Node)
    pauseBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "所有子弹的父节点" })
    bulletBox: cc.Node = null;
    /**
     * 子弹类型:0:普通子弹 1:冰/火枪子弹 2:爆炸子弹大 3:爆炸子弹小(MGL) 4.穿透型(狙击和激光)
     */
    @property({ type: [cc.Prefab], tooltip: "子弹类型:0:火枪子弹 1:冰枪子弹 2:爆炸子弹大 3:爆炸子弹小(MGL) 4.穿透型(狙击和激光)" })
    bulletArr: cc.Prefab[] = [];
    @property({ type: cc.Prefab, tooltip: "机甲子弹" })
    mechaBulletPre: cc.Prefab = null;
    @property(dragonBones.ArmatureDisplay)
    footDragon: dragonBones.ArmatureDisplay = null;
    @property(dragonBones.ArmatureDisplay)
    bodyDragon: dragonBones.ArmatureDisplay = null;
    @property({ type: cc.Node, tooltip: "击杀模式" })
    killTextNode: cc.Node = null;
    @property({ type: cc.Label, tooltip: "小怪的计数数值,击杀模式/防御模式都会用" })
    countText: cc.Label = null;
    @property({ type: cc.Node, tooltip: "距离模式" })
    runTextNode: cc.Node = null;
    @property({ type: cc.Label, tooltip: "距离模式数值" })
    runText: cc.Label = null;
    @property({ type: cc.Node, tooltip: "时间模式" })
    timerTextNode: cc.Node = null;
    @property({ type: cc.Label, tooltip: "时间模式数值" })
    timerText: cc.Label = null;
    @property({ type: cc.Node, tooltip: "钥匙模式" })
    keyTextNode: cc.Node = null;
    @property({ type: cc.Label, tooltip: "钥匙模式数值" })
    keyText: cc.Label = null;
    @property({ type: cc.Sprite, tooltip: "杀戮提示" })
    killingTip: cc.Sprite = null;
    @property(cc.Node)
    runLogo: cc.Node = null;
    @property({ type: cc.PolygonCollider, tooltip: "武器的碰撞体" })
    weapon: cc.PolygonCollider = null;
    @property({ type: cc.Sprite, tooltip: "吃了随机出现的辅助道具后出现在头上的玩意" })
    assistStatus: cc.Sprite = null;
    @property({ type: cc.Prefab, tooltip: "导弹(复活/道具)" })
    missilePre: cc.Prefab = null;
    @property({ type: cc.Node, tooltip: "防御区域" })
    defenseBox: cc.Node = null;
    @property(cc.Node)
    babyNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: "主角被攻击时屏幕左右两边的血" })
    gameRoleBlood: cc.Node = null;
    @property({ type: cc.Node, tooltip: "钥匙模式随机出现的钥匙" })
    gameKey: cc.Node = null;
    @property({ type: cc.Node, tooltip: "子弹不足提示" })
    buyBulletTip: cc.Node = null;
    @property({ type: cc.Node, tooltip: "提示玩家长按射击" })
    longPressTip: cc.Node = null;
    @property({ type: cc.Node, tooltip: "子弹不足预警" })
    bulletWarn: cc.Node = null;

    moveSpeed: number = 0;
    moveLeft: boolean = false;
    moveRight: boolean = false;
    bulletShellsPool: cc.NodePool = null;
    missilePool: cc.NodePool = null;
    roleSkin: cc.Node = null;
    roleFoot: cc.Node = null;
    attackTime: number = 0;
    /**
     * 0:无尽模式 1:击杀模式 2:距离模式 3:时间模式 4.防御模式 5.护送模式 6 钥匙模式  7:击杀+时间模式 8:距离+时间模式  9:护送+时间  10:钥匙+时间
     */
    taskIndex: number = 0;
    runDis: number = 200;//计算移动距离的基本单位
    secondNum: number = 0;
    keyNum: number = 0;
    defenseNum: number = null;
    mechaNode: cc.Node = null;
    mecheTime: number = 0;//显示机甲的倒计时初始时间
    mecheCountTime: number = 0;//显示机甲的倒计时时间
    mechaSpeed: number = null;//机甲的攻击速度
    mecheShowTime: boolean = false;//是否正在显示机甲,就是从天上掉下来到地面的这段时间,主要是为了不让玩家进行别的移动等操作
    mecheAttacking: boolean = false; //机甲是否正在攻击中,控制攻击频率
    assistSpeed: number = null;//使用了加速道具后的速度
    recordTryGun: number = null;//因为GameMag.Ins.tryGun会一直变,所以用这个变量记录最初的试用武器
    initBabyPs: number = -160; //要护卫的那小子的初始位置
    initBabyDiff: number = 350; //要护卫的那小子和主角之间的固定距离

    gunList: number[] = [];
    gunItemIndex: number = 0;
    gunItemLen: number = 0;
    assistList: number[] = [];
    assistItemIndex: number = 0;
    assistItemLen: number = 0;

    enemyData: any[] = null;
    enemyTime0: number = null;
    enemyTime1: number = null;
    enemyTime2: number = null;
    enemyTime3: number = null;
    enemyTime4: number = null;
    enemyTime5: number = null;
    enemyTime6: number = null;
    enemyTime7: number = null;
    enemyTime8: number = null;
    enemyTime9: number = null;
    enemyTime10: number = null;
    enemyTime11: number = null;
    enemyTime12: number = null;

    onLoad() {
        // DialogMag.Ins.show(DialogPath.ResultDialog, DialogScript.ResultDialog, [false]);
        AudioMag.getInstance().playBGM("gameBGM");
        this.initData();
        this.initUI();
        this.gameEvents();
        // const lv = GameMag.Ins.level;
        // if (lv <= 10) {
        //     //开始游戏用户数量
        //     //@ts-ignore
        //     wx.reportUserBehaviorBranchAnalytics({
        //         branchId: 'BCBgAAoXHx5d138Ug9YRxh',
        //         branchDim: `${lv}`, // 自定义维度(可选)：类型String，取值[1,100]，必须为整数，当上传类型不符时不统计
        //         eventType: 1 // 1：曝光； 2：点击
        //     });
        // }
    }
    initData() {
        GameMag.Ins.initGamePools();
        this.recordTryGun = GameMag.Ins.tryGun;
        GameMag.Ins.isUseingMecha = false;
        GameMag.Ins.gameOver = false;
        GameMag.Ins.timeOver = false;
        GameMag.Ins.runOver = false;
        GameMag.Ins.killOver = false;
        GameMag.Ins.defenseOver = false;
        GameMag.Ins.gameKillNum = 0;
        GameMag.Ins.roleBlood = 1;
        GameMag.Ins.timeStart = new Date().getTime();
        let useSkin = GameMag.Ins.trySkin || GameMag.Ins.useingData.skin;
        const info = GameMag.Ins.skinData[useSkin];
        const cigInfo = ConfigMag.Ins.getSkinData()[useSkin];
        let baseSpeed = info.speed * 80;
        if (useSkin === 1) {
            baseSpeed += baseSpeed * cigInfo.talent;
        }
        this.moveSpeed = baseSpeed;
    }
    initUI() {
        this.roleSkin = this.role.getChildByName("body");
        this.roleFoot = this.role.getChildByName("foot");
        let useingData = GameMag.Ins.useingData;
        this.headImg.spriteFrame = this.shopAtlas.getSpriteFrame("skinIcon_" + useingData.skin);
        this.roleCamera.width = cc.view.getVisibleSize().width;
        this.initPoos();
        this.initTask();
        this.initBackground();
        this.loadGunList();
        this.loadAssistList(useingData);
        this.loadMechaList(useingData);
        // const lv = GameMag.Ins.level;
        // if (lv == 1) {
        //     const ps = cc.v2(this.leftBox.x + 200, this.leftBox.y);
        //     DialogMag.Ins.show(DialogPath.GuideDialog, DialogScript.GuideDialog, [4, 90, cc.v2(0, 0), ps]);
        //     cc.director.on("showGuideStep5", function () {
        //         this.scheduleOnce(() => {
        //             const pos = cc.v2(this.rightBox.x - 200, this.rightBox.y);
        //             DialogMag.Ins.show(DialogPath.GuideDialog, DialogScript.GuideDialog, [5, -90, cc.Vec2.ZERO, pos]);
        //         }, 0.1);
        //     }.bind(this), this);
        //     cc.director.on("showGuideStep6", function () {
        //         this.scheduleOnce(() => {
        //             const pos = cc.v2(this.taskBox.x + 300, this.taskBox.y - 45);
        //             DialogMag.Ins.show(DialogPath.GuideDialog, DialogScript.GuideDialog, [6, 90, cc.v2(50, -70), pos]);
        //         }, 0.1);
        //     }.bind(this), this);
        //     cc.director.on("showEnemy", this.showEnemy, this); //道具箱子随机出怪
        // } else {
        this.showEnemy();
        // }
    }
    gameEvents() {
        cc.director.on("freshRoleGun", this.freshRoleGun, this);//动态加载武器
        cc.director.on("updateGameKillNum", this.updateGameKillNum, this);//更新杀敌数UI(任务显示用)
        cc.director.on("updateGameDefenseNum", this.updateGameDefenseNum, this);//更新进入旋涡的敌人数(任务显示用)
        cc.director.on("revive", this.revive, this);//复活
        cc.director.on("gameOver", this.gameOver, this);//游戏结算
        cc.director.on("resumeGame", this.resumeGame, this);//游戏暂停后的恢复
        cc.director.on("useAssist", this.useAssist, this); //使用辅助道具
        cc.director.on("useAssistMissile", this.useAssistMissile, this); //使用辅助道具的天降导弹
        cc.director.on("loadEnemy", this.loadEnemy, this); //道具箱子随机出怪
        cc.director.on("showRoleBlood", this.showRoleBlood, this); //显示主角(或baby)被攻击时屏幕左右两边的血
        cc.director.on("showGameKey", this.showGameKey, this); //钥匙模式随机出现的钥匙
        cc.director.on("hideMecha", this.hideMecha, this); //机甲消失
        cc.director.on("buyBulletTip", this.showBuyBulletTip, this); //显示子弹不足提示
        cc.director.on("onShowMecha", this.onShowMecha, this); //随机掉落的机甲
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.leftBtn.on(cc.Node.EventType.TOUCH_START, this.onMoveLeftStart, this);
        this.leftBtn.on(cc.Node.EventType.TOUCH_END, this.onMoveLeftEnd, this);
        this.leftBtn.on(cc.Node.EventType.TOUCH_CANCEL, this.onMoveLeftEnd, this);
        this.rightBtn.on(cc.Node.EventType.TOUCH_START, this.onMoveRightStart, this);
        this.rightBtn.on(cc.Node.EventType.TOUCH_END, this.onMoveRightEnd, this);
        this.rightBtn.on(cc.Node.EventType.TOUCH_CANCEL, this.onMoveRightEnd, this);
        this.switchBtn.on(cc.Node.EventType.TOUCH_START, this.onSwitchGun, this);
        this.mechaBox.on(cc.Node.EventType.TOUCH_START, this.onShowMecha, this);
        this.attackBtn.on(cc.Node.EventType.TOUCH_START, this.onAttack, this);
        this.attackBtn.on(cc.Node.EventType.TOUCH_END, this.onAttackEnd, this);
        this.attackBtn.on(cc.Node.EventType.TOUCH_CANCEL, this.onAttackEnd, this);
        this.pauseBtn.on(cc.Node.EventType.TOUCH_START, this.onPauseBtn, this);
    }
    showBuyBulletTip(status: boolean, target: cc.Node = null) {
        this.buyBulletTip.active = status;
        this.bulletWarn.active = status;
        if (!status) return;
        // console.log("展示子弹不足");
        const action = cc.blink(3, 8);
        this.bulletWarn.stopAllActions();
        cc.tween(this.bulletWarn)
            .to(0.1, { scale: 1 })
            .repeatForever(
                cc.tween()
                    .to(0.25, { scale: 0.8 })
                    .to(0.25, { scale: 1 })
            )
            .then(action)
            .start();
        let wps = target.parent.convertToWorldSpaceAR(target.position);
        let lps = this.node.convertToNodeSpaceAR(wps);
        const hand = this.buyBulletTip.getChildByName("hand");
        this.buyBulletTip.setPosition(lps);
        hand.stopAllActions();
        cc.tween(hand)
            .repeatForever(
                cc.tween().to(0.35, { scale: 1.2 }).delay(0.2).to(0.35, { scale: 1 }).delay(0.2)
            )
            .start();
    }
    /**
     * 显示主角(或baby)被攻击时屏幕左右两边的血
     */
    showRoleBlood() {
        this.gameRoleBlood.children.forEach(item => {
            item.stopAllActions();
            cc.tween(item)
                .to(0.3, { opacity: 255 })
                .to(0.3, { opacity: 0 })
                .start();
        })
    }
    initPoos() {
        this.missilePool = new cc.NodePool();
        this.bulletShellsPool = new cc.NodePool();
        for (let i = 0; i < 10; i++) {
            if (i < 3) {
                let node = cc.instantiate(this.missilePre);
                this.missilePool.put(node);
            }
            let bulletShells = cc.instantiate(this.bulletShellsPre);
            this.bulletShellsPool.put(bulletShells);
        }
    }
    showEnemy() {
        // this.loadEnemy(0);
        // this.loadEnemy(1);
        // this.loadEnemy(2);
        // return
        const level = GameMag.Ins.level;
        const enemyData = ConfigMag.Ins.getEnemyData();
        this.enemyData = enemyData;
        // console.log(enemyData);
        this.enemyTime0 = this.enemyTime0 || enemyData[0].time;
        this.enemyTime1 = this.enemyTime1 || enemyData[1].time;
        this.enemyTime2 = this.enemyTime2 || enemyData[2].time;
        this.enemyTime3 = this.enemyTime3 || enemyData[3].time;
        this.enemyTime4 = this.enemyTime4 || enemyData[4].time;
        this.enemyTime5 = this.enemyTime5 || enemyData[5].time;
        this.enemyTime6 = this.enemyTime6 || enemyData[6].time;
        this.enemyTime7 = this.enemyTime7 || enemyData[7].time;
        this.enemyTime8 = this.enemyTime8 || enemyData[8].time;
        this.enemyTime9 = this.enemyTime9 || enemyData[9].time;
        this.enemyTime10 = this.enemyTime10 || enemyData[10].time;
        this.enemyTime11 = this.enemyTime11 || enemyData[11].time;
        this.enemyTime12 = this.enemyTime12 || enemyData[12].time;
        this.loadSchedule0(enemyData[0]);
        this.loadSchedule1(enemyData[1]);
        // if (GameMag.Ins.switchData && !GameMag.Ins.switchData.blood) return; //绿色模式不出下面的怪
        this.loadSchedule2(enemyData[2]);
        // if (level < 5) return;
        this.loadSchedule3(enemyData[3]);
        this.loadSchedule4(enemyData[4]);
        this.loadSchedule5(enemyData[5]);
        this.loadSchedule6(enemyData[6]);
        this.loadSchedule7();
        this.loadSchedule8(enemyData[8]);
        this.loadSchedule9(enemyData[9]);
        this.loadSchedule10(enemyData[10]);
        this.loadSchedule11(enemyData[11]);
        this.loadSchedule12(enemyData[12]);
    }
    loadEnemy(tag) {
        let self = this;
        GameMag.Ins.getEnemy(tag, function (node) {
            node.getComponent("enemy").init(tag, self.role);
            let camera = self.roleCamera;
            let flag = Math.random() < 0.3 ? -1 : 1;
            if (self.taskIndex === 4) {
                flag = 1;
            }
            let x = camera.x + (flag * (camera.width / 2 + 200));
            node.setPosition(x, self.role.y);
            node.parent = self.enemyBox.children[tag]; //每个怪都有对应的节点存放
        }.bind(this));
    }
    enemyTimer(flag) {
        // if (GameMag.Ins.gamePause || GameMag.Ins.gameOver) return;
        this.loadEnemy(this.enemyData[flag].id);
        switch (flag) {
            case 0:
                this.loadSchedule0(this.enemyData[0]);
                break;
            case 1:
                this.loadSchedule1(this.enemyData[1]);
                break;
            case 2:
                this.loadSchedule2(this.enemyData[2]);
                break;
            case 3:
                this.loadSchedule3(this.enemyData[3]);
                break;
            case 4:
                this.loadSchedule4(this.enemyData[4]);
                break;
            case 5:
                this.loadSchedule5(this.enemyData[5]);
                break;
            case 6:
                this.loadSchedule6(this.enemyData[6]);
                break;
            case 7:
                this.loadSchedule7();
                break;
            case 8:
                this.loadSchedule8(this.enemyData[8]);
                break;
            case 9:
                this.loadSchedule9(this.enemyData[9]);
                break;
            case 10:
                this.loadSchedule10(this.enemyData[10]);
                break;
            case 11:
                this.loadSchedule11(this.enemyData[11]);
                break;
            case 12:
                this.loadSchedule12(this.enemyData[12]);
                break;
            default:
                break;
        }
    }
    loadSchedule0(data) {
        let time = data.finalTime;
        // console.log(this.enemyTime0);
        if (this.enemyTime0 < data.finalTime) {
            this.enemyTime0 += data.time * (data.rate / 100);
            this.enemyTime0 = Number(this.enemyTime0.toFixed(1));
            time = Math.floor(this.enemyTime0);
        }
        // console.log("time", time, this.enemyTime0);
        this.unschedule(this.enemyTimer0);
        this.schedule(this.enemyTimer0, time);
    }
    enemyTimer0() {
        this.enemyTimer(0);
    }
    loadSchedule1(data) {
        let time = data.finalTime;
        if (this.enemyTime1 < data.finalTime) {
            this.enemyTime1 += data.time * (data.rate / 100);
            this.enemyTime1 = Number(this.enemyTime1.toFixed(1));
            time = Math.floor(this.enemyTime1);
        }
        // console.log("time", time, this.enemyTime1);
        this.unschedule(this.enemyTimer1);
        this.schedule(this.enemyTimer1, time);
    }
    enemyTimer1() {
        this.enemyTimer(1);
    }
    //眼镜
    loadSchedule2(data) {
        let time = data.finalTime;
        if (this.enemyTime2 < data.finalTime) {
            this.enemyTime2 += data.time * (data.rate / 100);
            this.enemyTime2 = Number(this.enemyTime2.toFixed(1));
            time = Math.floor(this.enemyTime2);
        }
        this.unschedule(this.enemyTimer2);
        this.schedule(this.enemyTimer2, time);
    }
    enemyTimer2() {
        this.enemyTimer(2);
    }
    //囚衣
    loadSchedule3(data) {
        let time = data.finalTime;
        if (this.enemyTime3 > data.finalTime) {
            if (this.enemyTime3 === data.time) {
                time = this.enemyTime3;
            } else {
                this.enemyTime3 += data.time * (data.rate / 100);
                this.enemyTime3 = Number(this.enemyTime3.toFixed(1));
                time = Math.floor(this.enemyTime3);
            }
        }
        this.unschedule(this.enemyTimer3);
        this.schedule(this.enemyTimer3, time);
    }
    enemyTimer3() {
        this.enemyTimer(3);
    }
    //耳机
    loadSchedule4(data) {
        let time = data.finalTime;
        if (this.enemyTime4 > data.finalTime) {
            if (this.enemyTime4 === data.time) {
                time = this.enemyTime4;
            } else {
                this.enemyTime4 += data.time * (data.rate / 100);
                this.enemyTime4 = Number(this.enemyTime4.toFixed(1));
                time = Math.floor(this.enemyTime4);
            }
        }
        this.unschedule(this.enemyTimer4);
        this.schedule(this.enemyTimer4, time);
    }
    enemyTimer4() {
        this.enemyTimer(4);
    }
    //棒球帽
    loadSchedule5(data) {
        let time = data.finalTime;
        if (this.enemyTime5 > data.finalTime) {
            if (this.enemyTime5 === data.time) {
                time = this.enemyTime5;
            } else {
                this.enemyTime5 += data.time * (data.rate / 100);
                this.enemyTime5 = Number(this.enemyTime5.toFixed(1));
                time = Math.floor(this.enemyTime5);
            }
        }
        this.unschedule(this.enemyTimer5);
        this.schedule(this.enemyTimer5, time);
    }
    enemyTimer5() {
        this.enemyTimer(5);
    }
    //锅盖
    loadSchedule6(data) {
        let time = data.finalTime;
        if (this.enemyTime6 > data.finalTime) {
            if (this.enemyTime6 === data.time) {
                time = this.enemyTime6;
            } else {
                this.enemyTime6 += data.time * (data.rate / 100);
                this.enemyTime6 = Number(this.enemyTime6.toFixed(1));
                time = Math.floor(this.enemyTime6);
            }
        }
        this.unschedule(this.enemyTimer6);
        this.schedule(this.enemyTimer6, time);
    }
    enemyTimer6() {
        this.enemyTimer(6);
    }
    //炸弹怪时间不变
    loadSchedule7() {
        this.unschedule(this.enemyTimer7);
        this.schedule(this.enemyTimer7, this.enemyTime7);
    }
    enemyTimer7() {
        this.enemyTimer(7);
    }
    loadSchedule8(data) {
        let time = data.finalTime;
        if (this.enemyTime8 > data.finalTime) {
            if (this.enemyTime8 === data.time) {
                time = this.enemyTime8;
            } else {
                this.enemyTime8 += data.time * (data.rate / 100);
                this.enemyTime8 = Number(this.enemyTime8.toFixed(1));
                time = Math.floor(this.enemyTime8);
            }
        }
        this.unschedule(this.enemyTimer8);
        this.schedule(this.enemyTimer8, time);
    }
    enemyTimer8() {
        this.enemyTimer(8);
    }
    //吐舌怪
    loadSchedule9(data) {
        let time = data.finalTime;
        if (this.enemyTime9 > data.finalTime) {
            if (this.enemyTime9 === data.time) {
                time = this.enemyTime9;
            } else {
                this.enemyTime9 += data.time * (data.rate / 100);
                this.enemyTime9 = Number(this.enemyTime9.toFixed(1));
                time = Math.floor(this.enemyTime9);
            }
        }
        this.unschedule(this.enemyTimer9);
        this.schedule(this.enemyTimer9, time);
    }
    enemyTimer9() {
        this.enemyTimer(9);
    }
    //双刀
    loadSchedule10(data) {
        let time = data.finalTime;
        if (this.enemyTime10 > data.finalTime) {
            if (this.enemyTime10 === data.time) {
                time = this.enemyTime10;
            } else {
                this.enemyTime10 += data.time * (data.rate / 100);
                this.enemyTime10 = Number(this.enemyTime10.toFixed(1));
                time = Math.floor(this.enemyTime10);
            }
        }
        this.unschedule(this.enemyTimer10);
        this.schedule(this.enemyTimer10, time);
    }
    enemyTimer10() {
        this.enemyTimer(10);
    }
    //绿皮
    loadSchedule11(data) {
        let time = data.finalTime;
        if (this.enemyTime11 > data.finalTime) {
            if (this.enemyTime11 === data.time) {
                time = this.enemyTime11;
            } else {
                this.enemyTime11 += data.time * (data.rate / 100);
                this.enemyTime11 = Number(this.enemyTime11.toFixed(1));
                time = Math.floor(this.enemyTime11);
            }
        }
        this.unschedule(this.enemyTimer11);
        this.schedule(this.enemyTimer11, time);
    }
    enemyTimer11() {
        this.enemyTimer(11);
    }
    loadSchedule12(data) {
        let time = data.finalTime;
        if (this.enemyTime12 > data.finalTime) {
            if (this.enemyTime12 === data.time) {
                time = this.enemyTime12;
            } else {
                this.enemyTime12 += data.time * (data.rate / 100);
                this.enemyTime12 = Number(this.enemyTime12.toFixed(1));
                time = Math.floor(this.enemyTime12);
            }
        }
        this.unschedule(this.enemyTimer12);
        this.schedule(this.enemyTimer12, time);
    }
    enemyTimer12() {
        this.enemyTimer(12);
    }
    //加载枪支列表
    loadGunList() {
        const gunEquip = GameMag.Ins.tryGunEquip || GameMag.Ins.useingData.gunEquip;
        gunEquip.forEach(element => {
            if (element >= 0) {
                this.gunList.push(element);
            }
        });
        this.gunItemLen = this.gunList.length;
        if (this.gunItemLen == 0) { //当玩家一把枪都没装备的时候,进游戏默认使用初始枪
            GameMag.Ins.updateUseingDataByGun(3);
            GameMag.Ins.updateUseingDataByGunEquip(3, 0);
            this.gunList = [3];
        }
        this.loadGunItem();
    }
    loadGunItem() {
        let self = this;
        ToolsMag.Ins.getGameResource("prefab/gameGunItem", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            let gunID = self.gunList[self.gunItemIndex];
            let gunLv = GameMag.Ins.gunData[gunID].gunLv;
            if (gunLv === 2) {
                gunLv = 1;
            }
            let sp = self.shopAtlas.getSpriteFrame(`gun_${gunID}_${gunLv}`);
            node.getComponent("gameGunItem").init(gunID, self.gunItemIndex, sp);
            node.parent = self.gunBox;
            self.gunItemIndex++;
            if (self.gunItemIndex < self.gunItemLen) {
                self.loadGunItem();
            } else {
                // 这些操作就是为了记住最近使用的那把枪,好在进游戏的时候直接高亮且使用那一把
                const useingGun = GameMag.Ins.tryGun === null ? GameMag.Ins.useingData.gun : GameMag.Ins.tryGun;
                for (let i = 0, len = self.gunList.length; i < len; i++) {
                    if (useingGun == self.gunList[i]) { //最近使用的那把有在装备列表
                        cc.director.emit("showGunActive" + i, i, self.gunList[i]);
                        break;
                    }
                    if (i == len - 1) { //最近使用的那把没有在装备列表,直接指定第一把
                        GameMag.Ins.updateUseingDataByGun(self.gunList[0]);
                        cc.director.emit("showGunActive0", 0, self.gunList[0]);
                    }
                }
            }
        })
    }
    //加载辅助道具列表
    loadAssistList(useingData) {
        this.assistList = useingData.assistEquip;
        if (this.assistList.length == 0) {
            return;
        }
        this.assistItemLen = this.assistList.length;
        this.loadAssistItem();
    }
    loadAssistItem() {
        let self = this;
        ToolsMag.Ins.getGameResource("prefab/gameAssistItem", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            let assistID = self.assistList[self.assistItemIndex];
            if (assistID < 0) {
                self.assistItemIndex++;
                if (self.assistItemIndex < self.assistItemLen) {
                    self.loadAssistItem();
                }
                return;
            }
            let sf = self.shopAtlas.getSpriteFrame("assistIcon_" + assistID);
            node.parent = self.assistBox;
            node.getComponent("gameAssistItem").init(assistID, self.assistItemIndex, sf);
            self.assistItemIndex++;
            if (self.assistItemIndex < self.assistItemLen) {
                self.loadAssistItem();
            }
        })
    }
    //加载机甲列表
    loadMechaList(useingData) {
        let id = useingData.mecha;
        let mechaBox = this.mechaBox;
        if (id < 0) {
            mechaBox.active = false;
            return;
        }
        mechaBox.getChildByName("skin").getComponent(cc.Sprite).spriteFrame = this.shopAtlas.getSpriteFrame("mechaIcon_" + id);
        let mechaData = GameMag.Ins.mechaData;
        for (let index = 0; index < mechaData.length; index++) {
            const element = mechaData[index];
            if (element.mechaID == id && element.getNum > 0) {
                mechaBox.active = true;
                let node = mechaBox.getChildByName("getNum");
                node.getComponent(cc.Label).string = String(element.getNum);
                break;
            }
        }
    }
    //初始化关卡任务的数据,0:无尽模式 1:击杀模式 2:距离模式 3:时间模式 4.防御(有计时)模式 5.护送模式 6 钥匙模式  7:击杀+时间模式 8:距离+时间模式  9:护送+时间  10:钥匙+时间
    initTask() {
        let taskIndex = GameMag.Ins.taskType;
        this.taskIndex = taskIndex;
        if (taskIndex == 0) { //无限模式
            this.killTextNode.active = true;
            this.countText.string = "0";
            return;
        };
        let missionData = GameMag.Ins.missionData;
        this.secondNum = missionData.secondNum;
        if (taskIndex == 4) {
            this.countText.string = String(`${missionData.defenseNum}`);
        } else {
            this.countText.string = String(`${0}/${missionData.killNum}`);
        }
        this.runText.string = String(`${missionData.moveNum}m`);
        let timeStr = ToolsMag.Ins.formateSeconds(this.secondNum);
        this.timerText.string = String(timeStr);
        this.keyText.string = String(`0/${missionData.keyNum}`);
        switch (taskIndex) {
            case 0:
                this.killTextNode.active = true;
                break;
            case 1:
                this.killTextNode.active = true;
                break;
            case 2:
                this.runTextNode.active = true;
                this.showRunLogo();
                break;
            case 3:
                this.timerTextNode.active = true;
                this.schedule(this.taskCountDown, 1);
                break;
            case 4:
                this.defenseNum = GameMag.Ins.missionData.defenseNum;
                this.defenseBox.active = true;
                this.killTextNode.active = true;
                this.timerTextNode.active = true;
                this.schedule(this.taskCountDown, 1);
                break;
            case 5:
                this.babyNode.x = this.initBabyPs;
                this.babyNode.active = true;
                this.runTextNode.active = true;
                // let x = this.runDis * 5; //5m
                // console.log(x);
                break;
            case 6:
                this.keyTextNode.active = true;
                this.loadGameKey();
                break;
            case 7:
                this.killTextNode.active = true;
                this.timerTextNode.active = true;
                this.schedule(this.taskCountDown, 1);
                break;
            case 8:
                this.runTextNode.active = true;
                this.timerTextNode.active = true;
                this.schedule(this.taskCountDown, 1);
                this.showRunLogo();
                break;
            case 9:
                this.babyNode.x = this.initBabyPs;
                this.babyNode.active = true;
                this.timerTextNode.active = true;
                this.runTextNode.active = true;
                this.schedule(this.taskCountDown, 1);
                break;
            case 10:
                this.keyTextNode.active = true;
                this.timerTextNode.active = true;
                this.loadGameKey();
                this.schedule(this.taskCountDown, 1);
                break;
            default:
                break;
        }
    }
    /**
     * 钥匙任务的定时刷新
     */
    showGameKey() {
        this.keyNum++;
        this.keyText.string = String(`${this.keyNum}/${GameMag.Ins.missionData.keyNum}`);
        if (this.keyNum == GameMag.Ins.missionData.keyNum) {
            GameMag.Ins.getKeyOver = true;
            this.gameOver(true);
            return;
        }
        this.loadGameKey();
    }
    loadGameKey() {
        let _t = Math.floor(Math.random() * (6 - 3) + 3);
        // console.log(_t);
        this.scheduleOnce(function () {
            console.log("出钥匙");
            let camera = this.roleCamera;
            let x = camera.x + (camera.width / 2 + 200);
            this.gameKey.x = x;
            this.gameKey.active = true;
            const iconNode: cc.Node = this.gameKey.getChildByName("icon");
            let ps = iconNode.position;
            cc.tween(iconNode)
                .repeatForever(
                    cc.tween()
                        .to(0.5, { position: cc.v3(0, ps.y - 6, 0) })
                        .to(0.5, { position: cc.v3(0, ps.y + 6, 0) })
                )
                .start();
        }.bind(this), _t);
    }
    /**
     * 关卡任务的计时任务
     */
    taskCountDown() {
        if (GameMag.Ins.gameOver || GameMag.Ins.gamePause) return;
        this.secondNum--;
        // console.log(this.secondNum);
        if (this.secondNum <= 0) { //时间到了
            GameMag.Ins.timeOver = true;
            if (this.taskIndex == 3) {
                this.gameOver(true);
            } else if (this.taskIndex == 4) { //防御模式
                if (!GameMag.Ins.defenseOver) {
                    this.gameOver(true);
                } else {
                    this.gameOver(false);
                }
            } else {
                // console.log(GameMag.Ins.killOver, GameMag.Ins.runOver);
                if (GameMag.Ins.killOver || GameMag.Ins.runOver) {
                    this.gameOver(true);
                } else {
                    this.gameOver(false);
                }
            }
        }
        this.timerText.string = String(ToolsMag.Ins.formateSeconds(this.secondNum));
    }
    /**
     * 判断要显示几张背景图
     */
    initBackground() {
        //有距离模式时,提前计算应该放几块背景图,其他的统一默认3块背景图,包括无限模式
        let diff: number = null;
        let missionData = GameMag.Ins.missionData; //2 5 6 8 9 10 
        if (this.taskIndex == 0 || this.taskIndex == 1 || this.taskIndex == 3 || this.taskIndex == 4 || this.taskIndex == 7) { //距离不相关的模式
            diff = 0;
        } else {
            let moveNum = missionData.moveNum;
            diff = Math.ceil(moveNum / 15) + 2;
            console.log("增加几屏", diff);
        }
        for (let i = 0; i <= diff; i++) {
            // let node = cc.instantiate(this.bgs[GameMag.Ins.mapIndex]);
            let node = cc.instantiate(this.bgs[0]);
            node.parent = this.bgBox;
        }
        //然后更新地板长度
        this.scheduleOnce(() => {
            let width = this.bgBox.width;
            this.ground.node.width = width;
            this.ground.size.width = width;
            this.ground.offset.x = width / 2;
            this.ground.apply();
            // console.log(width, this.ground.offset);
        }, 0.1);
    }
    showRunLogo() {
        const node = this.runLogo;
        node.active = true;
        let action = cc.sequence(
            cc.moveBy(0.4, -30, node.y),
            cc.moveBy(0.4, 30, node.y),
        ).repeat(4);
        cc.tween(node)
            .delay(0.1)
            .then(action)
            .call(() => {
                node.active = false;
            })
            .start();
    }
    //暂停
    onPauseBtn() {
        AudioMag.getInstance().playSound("按钮音");
        if (this.isMoving()) return;
        this.onAttackEnd();
        this.onMoveLeftEnd();
        this.onMoveRightEnd();
        DialogMag.Ins.show(DialogPath.PauseDialog, DialogScript.PauseDialog, []);
    }
    //暂停之后的恢复游戏
    resumeGame() {
        this.showEnemy();
        this.roleStay();
    }
    /**
     * 显示爆炸烟雾
     * @param cb 
     */
    showBlastSmoke(cb: Function = null) {
        let self = this;
        ToolsMag.Ins.getGameResource("prefab/blastSmoke", function (prefab: cc.Prefab) {
            AudioMag.getInstance().playSound("炸弹");
            let node = cc.instantiate(prefab);
            node.scale = 3;
            node.setPosition(self.role.x, -250);
            node.parent = self.node;
            ToolsMag.Ins.playDragonBone(node, "blast_0", 1, function () {
                node.destroy();
                cb && cb();
            })
        })
    }
    /**
     * 吃了或使用辅助道具
     * @param type 1:增加防御status_1; 2:增加攻击status_2; 3:增加速度status_3
     * @param effectNum  增加数值
     * @param assistTime  持续时间
     */
    useAssist(type, effectNum, assistTime) {
        this.showShine();
        const target = this.assistStatus.node;
        target.active = true;
        if (this.mechaNode) {
            target.y = 260;
        } else {
            target.y = 185;
        }
        this.assistStatus.spriteFrame = this.gameMainAtlas.getSpriteFrame("status_" + type);
        if (type == 2) {
            GameMag.Ins.useAttackAssist = effectNum;
        } else if (type == 3) {
            this.assistSpeed = effectNum;
        }
        let action = cc.sequence(
            cc.scaleTo(0.3, 1.1),
            cc.scaleTo(0.3, 1)
        ).repeat(60);
        target.stopAllActions();
        cc.tween(target)
            .then(action)
            .start();
        this.scheduleOnce(() => {
            target.stopAllActions();
            if (type == 2) {
                GameMag.Ins.useAttackAssist = 0;
            } else {
                this.assistSpeed = null;
            }
            target.active = false;
        }, assistTime);
    }
    //天降导弹
    useAssistMissile(size) {
        // console.log("导弹的size", size);
        let node = this.missilePool.get();
        node.parent = this.node;
        for (let i = 0; i < size; i++) {
            node.children[i].active = true;
        }
        node.x = this.role.x;
        cc.tween(node)
            .to(0.4, { position: cc.v3(this.role.x, -140, 0) })
            .call(() => {
                this.showBlastSmoke();
                SdkManager.instance.vibrateShort();
                AudioMag.getInstance().playSound("炸弹");
                for (let i = 0; i < 3; i++) {
                    node.children[i].active = false;
                }
                node.y = 500;
                this.missilePool.put(node);
            })
            .start();
    }
    //死亡之后的复活
    revive() {
        this.scheduleOnce(() => {
            GameMag.Ins.gameOver = false;
        }, 1);
        this.showEnemy();
        this.roleStay();
        this.useAssistMissile(3);
        const missionData = GameMag.Ins.missionData;
        GameMag.Ins.defenseOver = false;
        if (this.taskIndex == 3 || this.taskIndex == 4 || this.taskIndex >= 7) {//和时间相关的模式
            if (this.taskIndex == 4) {
                this.defenseNum = missionData.defenseNum;
            }
            GameMag.Ins.timeOver = false;
            this.unschedule(this.taskCountDown);
            this.secondNum = missionData.secondNum;
            this.timerText.string = String(ToolsMag.Ins.formateSeconds(this.secondNum));
            this.schedule(this.taskCountDown, 1);
        }
    }
    /**
     * 游戏结束,并传入游戏成功还是失败
     * @param status true 游戏成功/false 游戏失败
     */
    gameOver(status) {
        this.moveLeft = false;
        this.moveRight = false;
        GameMag.Ins.gameOver = true;
        if (!status) { //失败
            this.freshRole(4, 1);
            this.freshFootDragon("stay");
        }
        this.onAttackEnd();
        this.onMoveLeftEnd();
        this.onMoveRightEnd();
        this.scheduleOnce(() => {
            DialogMag.Ins.show(DialogPath.ResultDialog, DialogScript.ResultDialog, [status]);
        }, 0.5);
    }
    //使用机甲
    onShowMecha(event, useMecha = null) {
        AudioMag.getInstance().playSound("按钮音");
        if (this.mechaNode || this.mecheShowTime) return;
        const mechaData = GameMag.Ins.mechaData;
        const id = useMecha || GameMag.Ins.useingData.mecha;
        for (let index = 0; index < mechaData.length; index++) {
            const element = mechaData[index];
            if (element.mechaID == id && element.getNum > 0) {
                console.log("加载机甲");
                this.mecheShowTime = true;
                const mechaCigData = ConfigMag.Ins.getMechaData()[index];
                console.log(mechaCigData);
                this.mecheTime = mechaCigData.keepTime;
                this.mecheCountTime = mechaCigData.keepTime;
                // this.mechaSpeed = mechaCigData.speed * 40;
                this.mechaSpeed = mechaCigData.speed;
                let node = this.mechaBox.getChildByName("getNum");
                let num = Number(node.getComponent(cc.Label).string);
                num--;
                GameMag.Ins.updateMechaData(id, -1);
                node.getComponent(cc.Label).string = String(num);
                this.showMecha(id);
                break;
            }
        }
    }
    //显示机甲
    showMecha(mechaID) {
        let self = this;
        ToolsMag.Ins.getHomeResource("prefab/mecha/mecha" + mechaID, function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            self.mechaNode = node;
            node.parent = self.role;
            node.scaleX = self.roleSkin.scaleX;
            cc.tween(node)
                .to(0.2, { position: cc.v3(0, -10, 0) })
                .call(() => { //机甲落地
                    self.showBlastSmoke();
                    SdkManager.instance.vibrateShort();
                    GameMag.Ins.isUseingMecha = true;
                    cc.director.emit("useingMecha", true);
                    self.roleSkin.active = false;
                    self.roleFoot.active = false;
                    self.mechaBox.getChildByName("buffer").active = true;
                    self.mechaNode.getChildByName("test").active = false;//下落时候的伤害区域
                    self.schedule(self.mechaShowTimeCb, 1);//不能放回调里面进行,不然有概率会被remove
                    self.switchMechaAction(mechaAnimate.ShopUp, 1, function () {
                        if (self.isMoving()) {
                            self.switchMechaAction(mechaAnimate.Walk, 0);
                        } else {
                            self.switchMechaAction(mechaAnimate.Stay, 0);
                        }
                        self.mecheShowTime = false;
                    });
                })
                .start();
        })
    }
    //显示机甲倒计时
    mechaShowTimeCb() {
        this.mecheCountTime--;
        // console.log(this.mecheCountTime);
        const progress = this.mechaBox.getChildByName("buffer").getComponent(cc.ProgressBar);
        progress.progress -= 1 / this.mecheTime;
        if (this.mecheCountTime <= 0) { //机甲消失,显示主角
            this.hideMecha();
        }
    }
    //机甲消失
    hideMecha() {
        this.showBlastSmoke();
        GameMag.Ins.isUseingMecha = false;
        cc.director.emit("useingMecha", false);
        this.mechaBox.getChildByName("buffer").active = false;
        this.mechaNode.getChildByName("test").active = true;
        this.unschedule(this.mechaShowTimeCb);
        this.roleSkin.active = true;
        this.roleFoot.active = true;
        this.scheduleOnce(() => {
            this.mechaNode.removeFromParent();
            this.mechaNode = null;
            this.mecheCountTime = null;
            this.mechaSpeed = null;
            if (this.isMoving()) {
                this.roleWalk()
            } else {
                this.roleStay();
            }
        }, 0);
    }
    //切换机甲龙骨
    switchMechaAction(action, times, cb: Function = null) {
        console.log(action);
        let self = this;
        let body = this.mechaNode.getChildByName("body");
        if (this.isRobotMecha()) {
            const parts = body.children;
            if (action == mechaAnimate.WalkFire) {
                this.robotMechaAction(parts, action, times, function () {
                    if (self.isMoving()) {
                        if (self.isRobotMecha()) {
                            self.mecheAttacking = false;
                        }
                        self.robotMechaAction(parts, mechaAnimate.Walk, 0);
                    } else {
                        self.roleStay();
                    }
                });
                return;
            }
            this.robotMechaAction(parts, action, times, cb);
            return;
        }
        const useMecha = GameMag.Ins.useingData.mecha;
        let lowNode = null, inNode = null, upNode = null;
        const skin = GameMag.Ins.trySkin || GameMag.Ins.useingData.skin;
        if (useMecha == 0 || useMecha == 1 || useMecha == 4) {
            lowNode = body.getChildByName("low");
            inNode = body.getChildByName("in");//身体
            upNode = body.getChildByName("up");
            GameMag.Ins.loadDisplayIndex(["lead"], inNode.getComponent(dragonBones.ArmatureDisplay), skin);//切换机甲上的头
            ToolsMag.Ins.playDragonBone(lowNode, action, times, null);
            ToolsMag.Ins.playDragonBone(upNode, action, times, null);
            if (action == mechaAnimate.WalkFire) {
                ToolsMag.Ins.playDragonBone(inNode, action, times, function () {
                    if (self.isMoving()) {
                        ToolsMag.Ins.playDragonBone(inNode, mechaAnimate.Walk, 0, null);
                    } else {
                        self.roleStay();
                    }
                });
                return;
            }
            ToolsMag.Ins.playDragonBone(inNode, action, times, function () {
                cb && cb();
            }.bind(this));
        } else {
            lowNode = body.getChildByName("low");
            upNode = body.getChildByName("up");
            GameMag.Ins.loadDisplayIndex(["lead"], lowNode.getComponent(dragonBones.ArmatureDisplay), skin);//切换机甲上的头
            ToolsMag.Ins.playDragonBone(lowNode, action, times, null);
            if (action == mechaAnimate.WalkFire) {
                ToolsMag.Ins.playDragonBone(upNode, action, times, function () {
                    if (self.isMoving()) {
                        ToolsMag.Ins.playDragonBone(upNode, mechaAnimate.Walk, 0, null);
                    } else {
                        self.roleStay();
                    }
                });
                return;
            }
            ToolsMag.Ins.playDragonBone(upNode, action, times, function () {
                cb && cb();
            }.bind(this));
        }
    }
    robotMechaAction(parts: cc.Node[], action: string, times: number, cb: Function = null) {
        ToolsMag.Ins.playDragonBone(parts[0], action, times, null);
        ToolsMag.Ins.playDragonBone(parts[1], action, times, null);
        ToolsMag.Ins.playDragonBone(parts[2], action, times, null);
        ToolsMag.Ins.playDragonBone(parts[3], action, times, null);
        ToolsMag.Ins.playDragonBone(parts[4], action, times, function () {
            cb && cb();
        });
    }
    otherMechaAction(body: cc.Node, head: cc.Node) {

    }
    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.onMoveLeftStart();
                break;
            case cc.macro.KEY.d:
                this.onMoveRightStart();
                break;
            case cc.macro.KEY.j:
                this.onAttack();
                break;
            case cc.macro.KEY.k:
                this.onSwitchGun();
                break;
            case cc.macro.KEY.l:
                // this.onShowMecha();
                break;
            case cc.macro.KEY.q:
                this.onPauseBtn();
                break;
        }
    }
    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.onMoveLeftEnd();
                break;
            case cc.macro.KEY.d:
                this.onMoveRightEnd();
                break;
            case cc.macro.KEY.j:
                this.onAttackEnd();
                break;
        }
    }
    /**
     * 切换主角动作龙骨
     * @param actionFlag number stay:0  fire:1  walk:2  walkFire:3  die:4
     */
    freshRole(actionFlag, times: number, cb: Function = null) {
        if (this.mechaNode) return;
        const res = ConfigMag.Ins.roleAnimate();
        // console.log(res);
        let action: string = null;
        switch (actionFlag) {
            case 0:
                action = res.stay;
                break;
            case 1:
                action = res.fire;
                break;
            case 2:
                action = res.walk;
                break;
            case 3:
                action = res.walkFire;
                break;
            case 4:
                action = res.die;
                break;
        }
        this.freshRoleDragon(action, times, cb);
    }
    //主角上半身龙骨
    freshRoleDragon(action, times, cb: Function = null) {
        let self = this;
        GameMag.Ins.changeSkin(this.bodyDragon, function () {
            ToolsMag.Ins.playDragonBone(self.bodyDragon.node, action, times, function () {
                cb && cb();
            });
        });
        GameMag.Ins.changeFoot(this.footDragon);
    }
    //主角下半身龙骨
    freshFootDragon(action) {
        ToolsMag.Ins.playDragonBone(this.footDragon.node, action, 0, null);
    }
    /**
     * 判断角色是否在移动中
     */
    isMoving(): boolean {
        let state = false;
        if (this.moveLeft || this.moveRight) {
            state = true;
        }
        return state;
    }
    //行走
    roleWalk() {
        if (this.mechaNode) {
            if (this.isRobotMecha()) {
                this.mecheAttacking = false;
            }
            this.switchMechaAction(mechaAnimate.Walk, 0);
            return;
        }
        this.freshRole(2, 0);
        this.freshFootDragon("walk");
    }
    //待机
    roleStay() {
        if (this.mechaNode) {
            if (this.isRobotMecha()) {
                this.mecheAttacking = false;
            }
            this.switchMechaAction(mechaAnimate.Stay, 0);
            return;
        }
        this.freshRole(0, 0);
        this.freshFootDragon("stay");
    }
    //开火
    roleFire() {
        let animate = null;
        let self = this;
        let flag: number = null;
        if (this.mechaNode) {
            if (this.isMoving()) {
                animate = mechaAnimate.WalkFire;
            } else {
                animate = mechaAnimate.Fire;
            }
            if (this.isRobotMecha()) {
                this.mecheAttacking = true;
            }
            this.switchMechaAction(animate, 1, function () {
                if (self.isMoving()) {
                    self.roleWalk();
                } else {
                    self.roleStay();
                }
            });
            return;
        }
        if (this.isMoving()) {
            flag = 3;
        } else {
            flag = 1;
        }
        let useGun = GameMag.Ins.tryGun === null ? GameMag.Ins.useingData.gun : GameMag.Ins.tryGun;
        if (useGun <= 2 || useGun == 18) {
            //棒子类武器举起来的时候再打开碰撞体
            this.scheduleOnce(() => {
                this.weapon.enabled = true;
            }, 0.2);
        }
        this.freshRole(flag, 1, function () {
            if (useGun <= 2 || useGun == 18) {
                self.weapon.enabled = false;
            } else if (useGun == 15 || useGun == 16) {
                self.bulletBox.removeAllChildren();
            }
            if (self.isMoving()) {
                self.roleWalk();
            } else {
                self.roleStay();
            }
        });
    }
    onMoveLeftStart() {
        this.onMoveRightEnd();
        AudioMag.getInstance().playSound("按钮音");
        this.buttonAction(this.leftBtn);
        if (this.mecheShowTime || GameMag.Ins.gameOver) return true;
        cc.director.emit("uavMove");//无人机
        this.moveLeft = true;
        if (this.isMoving) {
            this.roleWalk();
        }
        if (this.mechaNode && this.mechaNode.scale == 1 && this.isRobotMecha()) {
            this.mechaNode.getChildByName("attack").active = false;
        }
        return true;
    }
    onMoveLeftEnd() {
        // console.log("leftEnd");
        this.leftBtn.stopAllActions();
        this.leftBtn.scale = 1;
        cc.director.emit("uavStop");
        if (this.mecheShowTime || GameMag.Ins.gameOver) return;
        this.moveLeft = false;
        if (!this.moveRight) {
            this.roleStay();
        }
    }
    onMoveRightStart() {
        this.onMoveLeftEnd();
        AudioMag.getInstance().playSound("按钮音");
        this.buttonAction(this.rightBtn);
        if (this.mecheShowTime || GameMag.Ins.gameOver) return true;
        cc.director.emit("uavMove");
        this.moveRight = true;
        if (this.isMoving) {
            this.roleWalk();
        }
        if (this.mechaNode && this.mechaNode.scale == -1 && this.isRobotMecha()) {
            this.mechaNode.getChildByName("attack").active = false;
        }
        return true;
    }
    onMoveRightEnd() {
        // console.log("rightEnd");
        this.rightBtn.stopAllActions();
        this.rightBtn.scale = 1;
        cc.director.emit("uavStop");
        if (this.mecheShowTime || GameMag.Ins.gameOver) return;
        this.moveRight = false;
        if (!this.moveLeft) {
            this.roleStay();
        }
    }
    buttonAction(node) {
        node.scale = 1;
        node.stopAllActions();
        cc.tween(node)
            .to(0.1, { scale: 1.15 })
            .start();
    }
    //实时更新移动距离
    updateDistance() {
        let x = null;
        if (this.taskIndex == 2 || this.taskIndex == 8) { //距离相关的模式
            x = this.role.x;
        } else if (this.taskIndex == 5 || this.taskIndex == 9) {
            x = this.babyNode.x;
        }
        if (x < 0) return;
        x = Math.floor(x / this.runDis);
        // console.log(x);
        let meter = GameMag.Ins.missionData.moveNum - x;
        this.runText.string = String(`${meter}m`);
        if (meter === 0) {//到达终点
            console.log("到达终点了,时间:", GameMag.Ins.timeOver);
            GameMag.Ins.runOver = true;
            if (this.taskIndex == 2 || this.taskIndex == 5) {
                this.gameOver(true);
            } else if (this.taskIndex == 8 || this.taskIndex == 9) {
                if (!GameMag.Ins.timeOver) {
                    this.gameOver(true);
                }
            }
        }
    }
    //更新进入旋涡的敌人数
    updateGameDefenseNum() {
        this.defenseNum--;
        let num = this.defenseNum;
        this.countText.string = String(num);
        if (num <= 0 && !GameMag.Ins.timeOver) {
            this.countText.string = "0";
            GameMag.Ins.defenseOver = true;
            this.gameOver(false);
        }
    }
    // 更新杀敌数UI,及杀戮提示
    updateGameKillNum() {
        let gameKillNum = GameMag.Ins.gameKillNum;
        if (this.taskIndex == 0) {
            this.countText.string = String(gameKillNum);
        } else if (this.taskIndex == 1 || this.taskIndex == 7) {
            this.countText.string = String(`${gameKillNum}/${GameMag.Ins.missionData.killNum}`);
        }
        // console.log("杀敌数",GameMag.Ins.gameKillNum);
        let arr = ConfigMag.Ins.getKillReward();
        let index = arr.indexOf(gameKillNum);
        // console.log(index);
        if (index != -1) {
            let parentNode = this.killingTip.node;
            parentNode.opacity = 255;
            this.killingTip.spriteFrame = this.gameAtlas.getSpriteFrame("killTip_" + index);
            cc.tween(parentNode)
                .to(0.2, { scale: 0.9 })
                .to(0.03, { scale: 1.1 })
                .to(0.02, { scale: 1 })
                .delay(1)
                .call((node) => {
                    node.opacity = 0;
                    node.scale = 4;
                })
                .start();
        }
    }
    //闪耀
    showShine() {
        let self = this;
        ToolsMag.Ins.getGameResource("prefab/shine", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            node.parent = self.role;
        })
    }
    //实时更新主角朝向
    moveDir(dir: number) {
        if (this.mechaNode) {
            this.mechaNode.scaleX = dir;
        }
        this.roleSkin.scaleX = dir;
        this.roleFoot.scaleX = dir;
    }
    update(dt) {
        if (GameMag.Ins.gameOver || GameMag.Ins.gamePause || this.mecheShowTime) return;
        // let speed = this.mechaSpeed ? this.mechaSpeed : this.moveSpeed;
        let speed = this.moveSpeed;
        if (this.assistSpeed) {
            speed += speed * this.assistSpeed / 100;
        }
        // console.log(speed);
        if (this.moveLeft && (this.role.x > this.bgBox.x + 100)) {
            this.role.x -= dt * speed;
            this.moveDir(-1);
        } else if (this.moveRight && (this.role.x < (this.roleCamera.x + (this.roleCamera.width / 2)))) {
            this.role.x += dt * speed;
            this.moveDir(1);
        }
        if (this.taskIndex == 2 || this.taskIndex == 5 || this.taskIndex == 8 || this.taskIndex == 9) {
            this.updateDistance();
        }
        this.roleCamera.x = cc.misc.clampf(this.role.x, 0, this.bgBox.width - 1300 - 500);
    }
    //控制发射速率,含机甲
    checkAttackTime() {
        if (this.mechaNode) {
            if (this.isRobotMecha() && this.mecheAttacking) {
                return false;
            }
            return true;
        }
        let gunID = GameMag.Ins.tryGun === null ? GameMag.Ins.useingData.gun : GameMag.Ins.tryGun;
        let info = GameMag.Ins.gunData[gunID];
        let diff = 1 / info.speed * 1000;
        let timer = new Date().getTime();
        // console.log(diff);
        if (this.attackTime == 0) {
            this.attackTime = timer;
            return true;
        } else {
            // console.log(timer - this.attackTime);
            if (timer - this.attackTime < diff) {
                return false;
            } else {
                this.attackTime = timer;
                return true;
            }
        }
    }
    fire() {
        let useGun = GameMag.Ins.tryGun === null ? GameMag.Ins.useingData.gun : GameMag.Ins.tryGun;
        let localData = GameMag.Ins.gunData[useGun];
        let cigData = ConfigMag.Ins.getGunData()[useGun];
        let bulletNum: number = null;
        if (!GameMag.Ins.tryGunBullet || GameMag.Ins.tryGunBullet <= 0) {
            this.recordTryGun = null;
            bulletNum = 0;
        }
        if (this.recordTryGun && this.recordTryGun === GameMag.Ins.tryGun) {
            bulletNum = GameMag.Ins.tryGunBullet;
        } else {
            bulletNum = localData.bulletNum;
        }
        // console.log(bulletNum);
        if (localData && bulletNum <= 0 && cigData.buyOnceNum > 0) {
            this.onAttackEnd();
            return;
        }
        GameMag.Ins.playGunSound();
        this.roleFire();
        if (cigData.gunType == 0) {
            this.showBullet(useGun);
            cc.director.emit("updateBulletNum" + useGun);//更新子弹数量
        }
    }
    onAttack() {
        this.buttonAction(this.attackBtn);
        if (GameMag.Ins.gameOver || GameMag.Ins.gamePause || this.mecheShowTime) return true;
        let status = this.checkAttackTime();
        if (!status) return true;
        this.unschedule(this.fire);
        if (this.mechaNode) {//机甲存在的时候不消耗子弹
            this.roleFire();
            this.showMechaBullet();
            return true;
        }
        this.fire();
        let gun = GameMag.Ins.tryGun === null ? GameMag.Ins.useingData.gun : GameMag.Ins.tryGun;
        let cigData = ConfigMag.Ins.getGunData()[gun];
        if (cigData.gunDescType == 3) {//全自动武器可以长按连发
            let gunData = ConfigMag.Ins.getGunData();
            let info = gunData[gun];
            let diff = 1 / info.speed * 1000;
            this.unschedule(this.fire);
            this.schedule(this.fire, diff / 1000);
        }
        return true;
    }
    //结束攻击
    onAttackEnd() {
        // console.log("攻击结束");
        this.attackBtn.stopAllActions();
        this.attackBtn.scale = 1;
        this.unschedule(this.fire);
    }
    isRobotMecha(): boolean {
        const useMecha = GameMag.Ins.useingData.mecha;
        if ((useMecha == 2 || useMecha == 3 || useMecha == 5) && this.mechaNode) {
            return true;
        }
        return false;
    }
    //显示发射机甲子弹
    showMechaBullet() {
        if (this.isRobotMecha()) {
            this.mechaNode.getChildByName("attack").active = true;
            this.unschedule(this.hideMechaAttack);
            this.scheduleOnce(this.hideMechaAttack, 2.5);
            return;
        }
        let self = this;
        GameMag.Ins.getMechaBullet(function (mechaBullet) {
            mechaBullet.parent = self.bulletBox;
            mechaBullet.setPosition(self.role.x, -50);
            const dir = self.mechaNode.scaleX;
            mechaBullet.getComponent("mechaBullet").init(dir);
            self.showFireShells(dir);
        }.bind(this));
    }
    hideMechaAttack() {
        if (this.mechaNode) {
            this.mechaNode.getChildByName("attack").active = false;
        }
    }
    //显示枪子弹
    showBullet(useGun) {
        const dir = this.roleSkin.scaleX;
        let self = this;
        let bulletNode = null;
        let x = this.role.x;
        let index = null;
        let root: string = null; //0:普通子弹 1:冰/火枪子弹 2:爆炸子弹大 3:爆炸子弹小(MGL) 4.穿透型(狙击和激光)
        if (useGun == 15) {//火子弹
            root = "fireAndiceBullet";
            // x = this.role.x;
            index = 0;
        } else if (useGun == 16) {
            root = "fireAndiceBullet";
            // x = this.role.x;
            index = 1;
        } else if (useGun == 19 || useGun == 21) {
            root = "boomBullet";//爆炸型子弹大
            // x = this.role.x;
            index = 2;
        } else if (useGun == 20) {
            root = "boomMGLBullet";//爆炸型子弹小
            // x = this.role.x;
            index = 3;
        } else if (useGun == 17 || useGun == 23) {
            root = "passBullet";//穿透型子弹(激光枪,狙击枪)
            // x = this.role.x;
            index = 4;
        } else {
            root = "bullet";
            // x = this.role.x;
            this.showFireShells(dir);
        }
        // console.log(this.role.getSiblingIndex(), this.bulletBox.getSiblingIndex());
        if (index === null) {
            this.role.setSiblingIndex(16);
            this.bulletBox.setSiblingIndex(19);
            GameMag.Ins.getBullet((bullet) => {
                bullet.parent = self.bulletBox;
                bullet.getComponent(root).init(dir);
                bullet.setPosition(x, -80);
            })
            return;
        }
        this.role.setSiblingIndex(19);
        this.bulletBox.setSiblingIndex(16);
        bulletNode = cc.instantiate(this.bulletArr[index]);
        bulletNode.parent = this.bulletBox;
        bulletNode.getComponent(root).init(dir);
        bulletNode.setPosition(x, -80);
    }
    /**
     * 显示蛋壳
     * @param dir 根据主角朝向来确定方向
     */
    showFireShells(dir) {
        let shellsNode = null;//蛋壳
        let shellsIndex: number = null;//蛋壳的样式
        let ps: cc.Vec2 = null;
        let dis: number = null; //蛋壳飞出去的距离
        if (this.bulletShellsPool.size() > 0) {
            shellsNode = this.bulletShellsPool.get();
        } else {
            shellsNode = cc.instantiate(this.bulletShellsPre);
        }
        if (this.mechaNode) {
            switch (GameMag.Ins.useingData.mecha) {
                case 0:
                    AudioMag.getInstance().playSound("机甲");
                    shellsIndex = 0;
                    ps = cc.v2(0, -60);
                    break;
                case 1:
                    AudioMag.getInstance().playSound("RPG");
                    shellsIndex = 0;
                    ps = cc.v2(0, 40);
                    break;
                case 4:
                    AudioMag.getInstance().playSound("RPG");
                    shellsIndex = 2;
                    ps = cc.v2(0, -60);
                    break;
                case 6:
                    AudioMag.getInstance().playSound("RPG");
                    shellsIndex = 2;
                    ps = cc.v2(0, 0);
                    break;
                default:
                    break;
            }
            dis = 500;
        } else { //常规枪支的蛋壳
            shellsNode.setPosition(this.role.x, -30);
            let gun = GameMag.Ins.tryGun === null ? GameMag.Ins.useingData.gun : GameMag.Ins.tryGun;
            if (gun == 11 || gun == 12) {
                shellsIndex = 1;
            } else {
                shellsIndex = 0;
            }
            ps = cc.v2(0, -60);
            dis = 400;
        }
        shellsNode.setPosition(this.role.x, ps.y);
        shellsNode.children[shellsIndex].active = true;
        shellsNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(-dir * dis, 340);
        shellsNode.parent = this.shellsBox;
        //确定飞出去的方向
        let a = Math.random() > 0.5 ? 1 : -1;
        let agnle = 150 + Math.random() * 50;
        shellsNode.stopAllActions();
        cc.tween(shellsNode)
            .by(0.3, { angle: agnle * a })
            .repeat(3)
            .delay(1.5)
            .call(() => {
                shellsNode.children[shellsIndex].active = false;
                this.bulletShellsPool.put(shellsNode);
            })
            .start();
    }
    /**
     * 武器切换
     */
    onSwitchGun() {
        // console.log("切换枪支", this.gunListIndex);
        AudioMag.getInstance().playSound("按钮音");
        this.onAttackEnd();
        cc.director.emit("switchGun" + this.gunListIndex);
    }
    /**
     * 切换更新武器 onSwitchGun=>freshRoleGun
     * @param index 当前武器在装备列表的下标位置
     */
    gunListIndex: number = null;
    freshRoleGun(index, gunID) {
        this.gunListIndex = index;
        // const gunData = ConfigMag.Ins.getGunData()[gunID];
        // //是否显示长按连击UI
        // if (gunData.gunDescType === 3) { //全自动武器
        //     this.longPressTip.active = true;
        //     const ac = cc.blink(4, 4);
        //     cc.tween(this.longPressTip)
        //         .then(ac)
        //         .call(() => {
        //             this.longPressTip.active = false;
        //             this.longPressTip.stopAllActions();
        //         })
        //         .start();
        // } else {
        //     this.longPressTip.active = false;
        //     this.longPressTip.stopAllActions();
        // }
        this.freshRole(0, 0);
        if (!this.moveLeft && !this.moveRight) {
            this.freshFootDragon("stay");
        }
    }
    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}
