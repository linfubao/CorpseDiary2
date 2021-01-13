import GameMag from "../manage/GameMag";
import ToolsMag from "../manage/ToolsMag";
import AudioMag from "../manage/AudioMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";
import ConfigMag from "../manage/ConfigMag";
import { hts } from "../hutui/Hts";
import SdkManager from "../sdk/SdkManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResultDialog extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    failNode: cc.Node = null;
    @property(cc.Node)
    adviseNode: cc.Node = null;
    @property(cc.Node)
    popupNode: cc.Node = null;
    @property(cc.Label)
    popupText: cc.Label = null;
    @property(cc.Node)
    successNode: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    okBtn: cc.Node = null;
    @property(cc.Node)
    cancelBtn: cc.Node = null;
    @property(cc.Node)
    retryBtn: cc.Node = null;
    @property(cc.Node)
    menuBtn: cc.Node = null;
    @property(cc.Label)
    bloodLab: cc.Label = null;
    @property(cc.Label)
    killsLab: cc.Label = null;
    @property(cc.Label)
    timerLab: cc.Label = null;
    @property({ type: cc.Node, tooltip: "成功额外奖励" })
    rewardTitle: cc.Node = null;
    @property({ type: cc.Label, tooltip: "成功额外奖励" })
    rewardLab: cc.Label = null;
    @property(cc.Node)
    failIcon: cc.Node = null;
    @property(cc.Node)
    gradeBox: cc.Node = null;
    @property({ type: cc.Node, tooltip: "评级的圈圈" })
    successCircle: cc.Node = null;
    @property({ type: cc.Node, tooltip: "评级的圈圈" })
    failCircle: cc.Node = null;
    @property(cc.Node)
    missionReward: cc.Node = null;
    @property(cc.Node)
    part1: cc.Node = null;
    @property({ type: cc.Label, tooltip: "任务奖励-金币" })
    missionCoinLab: cc.Label = null;
    @property({ type: cc.Label, tooltip: "任务奖励-钻石" })
    missionDiamondLab: cc.Label = null;
    @property({ type: cc.Sprite, tooltip: "第1把试用武器图片" })
    iconImage1: cc.Sprite = null;
    @property({ type: cc.Sprite, tooltip: "第2把试用武器图片" })
    iconImage2: cc.Sprite = null;
    @property({ type: cc.Node, tooltip: "第1把的试用按钮" })
    tryBtn1: cc.Node = null;
    @property({ type: cc.Node, tooltip: "金币奖励按钮" })
    rewardBtn2: cc.Node = null;
    @property({ type: cc.Label, tooltip: "失败的金币奖励" })
    rewardNumLab: cc.Label = null;
    @property({ type: cc.ScrollView, tooltip: "左边的互推轮播" })
    leftScroll: cc.ScrollView = null;
    @property({ type: cc.ScrollView, tooltip: "右边的互推轮播" })
    rightScroll: cc.ScrollView = null;
    @property({ type: cc.Node, tooltip: "" })
    leftContent: cc.Node = null;
    @property({ type: cc.Node, tooltip: "" })
    rightContent: cc.Node = null;

    rewardNum: number = null;
    scaleTime: number = 0.25;
    gameSuccess: boolean = null;// status: true成功  false失败
    gunData: any = null;
    index: number = 0;
    speed: number = 1; //轮播速度,此值越大越慢
    bid: string = "5fdc8a6bd1b5c92d77836336";
    getBoxData: any = null;

    onInit(status) {
        // const lv = GameMag.Ins.level;
        // if (lv <= 10) {
        //     //结束游戏用户数量
        //     //@ts-ignore
        //     wx.reportUserBehaviorBranchAnalytics({
        //         branchId: 'BCBgAAoXHx5d138Ug9YRx-',
        //         branchDim: `${lv}`, // 自定义维度(可选)：类型String，取值[1,100]，必须为整数，当上传类型不符时不统计
        //         eventType: 1 // 1：曝光； 2：点击
        //     });
        // }
        this.gameSuccess = status;
        this.showMoreGame();
        DialogMag.Ins.removePlane(DialogPath.PauseDialog);
        this.okBtn.on(cc.Node.EventType.TOUCH_END, this.onOK, this);
        this.retryBtn.on(cc.Node.EventType.TOUCH_END, this.onRetry, this);
        this.cancelBtn.on(cc.Node.EventType.TOUCH_END, this.onCancel, this);
        this.menuBtn.on(cc.Node.EventType.TOUCH_END, this.onMenuBtn, this);
        this.tryBtn1.on(cc.Node.EventType.TOUCH_END, this.onTryBtn1, this);
        this.rewardBtn2.on(cc.Node.EventType.TOUCH_END, this.onRewardBtn2, this);
        if (status) {
            // GameMag.Ins.updateLevel();
            AudioMag.getInstance().playSound("胜利");
            this.showSuccess();
            return;
        }
        this.popupNode.active = true;
    }
    showMoreGame() {
        // this.getBoxData = [1, 1, 1];
        // this.loadLeftItem();
        if (cc.sys.isBrowser) return;
        let self = this;
        hts.getBox(this.bid, function (err, res) {
            if (err) {
                console.error("getBox", err);
                return;
            }
            console.log("竖轮播getBox", res[0]);
            self.getBoxData = res[0];
            self.leftScroll.node.active = true;
            self.loadLeftItem();
        });
    }
    scrollMove() {
        this.leftScroll.scrollTo(cc.v2(0, 0), this.speed, false);
        this.rightScroll.scrollTo(cc.v2(0, 0), this.speed, false);
        this.scheduleOnce(() => {
            this.leftScroll.scrollTo(cc.v2(0, 1), this.speed, false);
            this.rightScroll.scrollTo(cc.v2(0, 1), this.speed, false);
        }, this.speed + 0.5);
    }
    loadLeftItem() {
        let self = this;
        ToolsMag.Ins.getHomeResource("prefab/other/moreGameItem", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            node.getComponent("moreGameItem").init(self.getBoxData[self.index], self.bid);
            node.parent = self.leftContent;
            self.index++;
            if (self.index < self.getBoxData.length / 2) {
                self.loadLeftItem();
            } else {
                self.rightScroll.node.active = true;
                self.loadRightItem();
            }
        })
    }
    loadRightItem() {
        let self = this;
        ToolsMag.Ins.getHomeResource("prefab/other/moreGameItem", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            node.getComponent("moreGameItem").init(self.getBoxData[self.index]);
            node.parent = self.rightContent;
            self.index++;
            if (self.index < self.getBoxData.length) {
                self.loadRightItem();
            } else {
                // if (self.getBoxData.length % 2 != 0) { //为了左右个数对称,补一个
                //     const single = self.getBoxData[0];
                //     self.getBoxData.push(single);
                //     self.loadRightItem();
                //     return;
                // }
                self.speed = 5 * self.speed;
                self.scrollMove();
                self.schedule(() => {
                    self.scrollMove();
                }, self.speed * 2.2);
            }
        })
    }
    showSuccess() {
        let taskTypeArr = GameMag.Ins.taskTypeArr;
        const index = taskTypeArr.indexOf(GameMag.Ins.taskType);
        taskTypeArr.splice(index, 1); //把完成的任务从任务列表删除
        GameMag.Ins.updateTaskTypeArr(taskTypeArr);
        console.log(GameMag.Ins.taskType, index);
        if (taskTypeArr.length == 0 || (GameMag.Ins.taskTypeArr.length == 1 && GameMag.Ins.taskTypeArr[0] === 0)) {
            GameMag.Ins.updateLevel();
        }
        this.successNode.scale = 0;
        this.successNode.active = true;
        cc.tween(this.successNode)
            .to(this.scaleTime, { scale: 1 })
            .call(() => {
                this.showContent();
                this.menuBtn.active = true;
            })
            .start();
    }
    onRetry() {
        AudioMag.getInstance().playSound("按钮音");
        GameMag.Ins.tryGun = null;
        GameMag.Ins.tryGunBullet = null;
        GameMag.Ins.tryGunEquip = null;
        cc.director.loadScene(GameMag.Ins.gameScene);
    }
    /**
     * 复活
     */
    onOK() {
        AudioMag.getInstance().playSound("按钮音");
        //等哪天又想用钻石复活了再打开这段代码
        // let diamond = GameMag.Ins.currency.diamond;
        // if (diamond >= GameMag.Ins.reviveDiamod) {
        // GameMag.Ins.updateCurrency(1, -GameMag.Ins.reviveDiamod);
        // cc.director.emit("updateCurrency");
        cc.director.emit("revive");
        cc.director.emit("reviveInitRoleBlood");
        cc.director.emit("reviveInitBabyBlood");
        DialogMag.Ins.removePlane(DialogPath.ResultDialog);
        // } else {
        //     DialogMag.Ins.show(DialogPath.MessageDialog, DialogScript.MessageDialog, ["钻石不足"]);
        // }
    }
    onDestroy() {
        GameMag.Ins.gameOver = false;
    }
    onMenuBtn() {
        AudioMag.getInstance().playSound("按钮音");
        cc.director.loadScene(GameMag.Ins.homeScene);
    }
    /**
     * 不复活
     */
    onCancel() {
        AudioMag.getInstance().playSound("按钮音");
        this.popupNode.active = false;
        this.failIcon.active = true;
        this.failNode.scale = 0;
        let ac = cc.spawn(
            cc.rotateBy(this.scaleTime, 360),
            cc.scaleTo(this.scaleTime, 1.8)
        )
        cc.tween(this.failIcon)
            .then(ac)
            .to(0.04, { scale: 2.1 })
            .to(0.04, { scale: 2 })
            .delay(0.7)
            .call(() => {
                this.failIcon.active = false;
                this.failNode.active = true;
                cc.tween(this.failNode)
                    .parallel(
                        cc.tween().to(this.scaleTime, { scale: 1 }),
                        cc.tween().call(() => {
                            this.showContent();
                            this.retryBtn.active = true;
                            this.menuBtn.active = true;
                        })
                    )
                    //上移动作
                    // .delay(1)
                    // .parallel(
                    //     cc.tween().to(0.1, { position: cc.v3(0, this.failNode.y + 85, 0) }),//85:向上移动的距离
                    //     cc.tween().call(() => {
                    //         cc.tween(this.content)
                    //             .to(0.1, { position: cc.v3(0, this.content.y + 85, 0) })//85:向上移动的距离
                    //             .start();
                    //         this.showAdvise();
                    //     })
                    // )
                    .start();
            })
            .start();
    }
    //显示失败时最下面的建议使用框
    showAdvise() {
        return;
        let gunGetData = [];
        GameMag.Ins.gunData.forEach(item => {
            if (!item.geted) {
                gunGetData.push(item);
            }
        });
        const len = gunGetData.length;
        if (len != 0) {
            const index = Math.floor(Math.random() * len);
            this.gunData = gunGetData[index];
            // console.log(this.gunGetData);
            this.iconImage1.spriteFrame = this.homeAtlas.getSpriteFrame("gun_" + gunGetData[index].gunID);
        } else {
            this.part1.active = false;
        }
        this.rewardNum = Math.floor(Math.random() * (500 - 300) + 300);
        this.rewardNumLab.string = String(this.rewardNum);
        this.adviseNode.active = true;
        cc.tween(this.adviseNode)
            .to(0.1, { position: cc.v3(0, -265 + 15, 0) })
            .to(0.02, { position: cc.v3(0, -265 - 15, 0) })
            .to(0.02, { position: cc.v3(0, -265 + 8, 0) })
            .to(0.02, { position: cc.v3(0, -265 - 8, 0) })
            .start();
    }
    //试用1
    onTryBtn1() {
        AudioMag.getInstance().playSound("按钮音");
        const tryGun = this.gunData.gunID;
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
        console.log(GameMag.Ins.tryGunEquip);
        cc.director.loadScene(GameMag.Ins.gameScene);
    }
    onRewardBtn2() {
        AudioMag.getInstance().playSound("按钮音");
        GameMag.Ins.updateCurrency(0, this.rewardNum);
        cc.director.emit("updateCurrency");
        cc.tween(this.adviseNode)
            .to(0.3, { position: cc.v3(0, -520, 0) })
            .call(() => {
                cc.director.loadScene(GameMag.Ins.homeScene);
            })
            .start();
    }
    /**
     * 胜利：B:任务奖励  A 任务奖励+10%的额外奖励  S 任务奖励+20%的额外奖励
     * 失败: C 无额外奖励无任务奖励
     */
    showContent() {
        this.content.scale = 0;
        this.content.active = true;
        let timeEnd = new Date().getTime();
        timeEnd -= GameMag.Ins.timeStart;
        //数据的显示
        // console.log(GameMag.Ins.roleBlood);
        if (GameMag.Ins.roleBlood <= 0) {
            GameMag.Ins.roleBlood = 0;
        }
        let killNum = 0;
        let timeNum = 0;
        let bloodNum = 0;
        this.killsLab.string = String(killNum);
        this.bloodLab.string = "0%";
        this.timerLab.string = ToolsMag.Ins.formateSeconds(0);
        this.rewardLab.node.active = this.gameSuccess;
        this.rewardTitle.active = this.gameSuccess;
        if (!this.gameSuccess) {
            // this.missionCoinLab.string = String(0);
            // this.missionDiamondLab.string = String(0);
            this.missionReward.active = false;
        } else {
            this.showSuccessData();
        }
        cc.tween(this.content)
            .to(this.scaleTime, { scale: 1 })
            .call(() => {
                this.showGrade();
                if (GameMag.Ins.gameKillNum > 0) {
                    this.schedule(() => {
                        killNum++;
                        this.killsLab.string = String(killNum);
                    }, 0.03, GameMag.Ins.gameKillNum - 1);
                }
                if (GameMag.Ins.roleBlood > 0) {
                    this.schedule(() => {
                        bloodNum += 1;
                        this.bloodLab.string = String(bloodNum + "%");
                    }, 0.02, GameMag.Ins.roleBlood * 100 - 1);
                }
                this.schedule(() => {
                    timeNum += 2;
                    this.timerLab.string = ToolsMag.Ins.formateSeconds(timeNum);
                }, 0.02, Math.floor(Math.floor(timeEnd / 1000) - 1) / 2);
            })
            .start();
    }
    showSuccessData() {
        let missionCoin = GameMag.Ins.missionData.coinNum;
        let missionDialond = GameMag.Ins.missionData.diamondNum;
        this.missionCoinLab.string = String(missionCoin);
        this.missionDiamondLab.string = String(missionDialond);
        let reward = 0;
        switch (this.checkGrade()) {
            case 0:
                reward = Math.floor(missionCoin * 0.2);
                break;
            case 1:
                reward = Math.floor(missionCoin * 0.1);
                break;
        }
        GameMag.Ins.updateCurrency(0, missionCoin + reward);
        GameMag.Ins.updateCurrency(1, missionDialond);
        this.rewardLab.string = String(reward);
        cc.director.emit("updateCurrency");
    }
    showGrade() {
        let flag = this.checkGrade();
        let gradeBg = flag == 3 ? this.failCircle : this.successCircle;
        gradeBg.active = true;
        cc.tween(gradeBg)
            .to(0.2, { scale: 0.8 })
            .to(0.07, { scale: 1.2 })
            .to(0.07, { scale: 1 })
            .repeatForever(cc.tween().by(5, { angle: -360 }))
            .start();
        let node = this.gradeBox.children[flag];
        node.active = true;
        cc.tween(this.gradeBox)
            .to(0.2, { scale: 0.8 })
            .to(0.07, { scale: 1.2 })
            .to(0.07, { scale: 1 })
            .start();
    }
    //判断评级
    checkGrade() {
        let num = GameMag.Ins.roleBlood;
        // console.log(num);
        let grade = null;
        if (!this.gameSuccess) {
            grade = 3; //C
        } else {
            if (num == 1) {
                grade = 0; //S
            } else if (num < 1 && num >= 0.9) {
                grade = 1; //A
            } else if (num < 0.9) {
                grade = 2; //B
            }
        }
        return grade;
    }
}
