import GameMag from "../manage/GameMag";
import ToolsMag from "../manage/ToolsMag";
import AudioMag from "../manage/AudioMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";
import ConfigMag from "../manage/ConfigMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FrontGameDialog extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    homeMainAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    frontAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    left: cc.Node = null;
    @property(cc.Node)
    right: cc.Node = null;
    @property(cc.Node)
    missionBox: cc.Node = null;
    @property(cc.Node)
    closeBtn: cc.Node = null;
    @property(cc.Node)
    enterBtn: cc.Node = null;
    @property(cc.Label)
    coinLab: cc.Label = null;
    @property(cc.Label)
    diamondLab: cc.Label = null;
    @property(cc.Sprite)
    mapName: cc.Sprite = null;
    @property(cc.Sprite)
    mapBg: cc.Sprite = null;
    @property(cc.Node)
    endlessImg: cc.Node = null;
    @property(cc.Node)
    rewardContent: cc.Node = null;
    @property({ type: cc.Label, tooltip: "任务内容" })
    missionLab: cc.Label = null;
    @property(cc.Sprite)
    iconName: cc.Sprite = null;
    @property(cc.Sprite)
    iconImage: cc.Sprite = null;
    @property({ type: cc.Node, tooltip: "试用按钮" })
    tryBtn: cc.Node = null;

    recommendData: any = null;
    showActionEnd: boolean = false;

    onInit(taskIndex, mapIndex) {
        AudioMag.getInstance().playSound("任务打开");
        GameMag.Ins.taskType = taskIndex;
        GameMag.Ins.mapIndex = mapIndex;
        this.initRecommendUI();
        this.initUI(taskIndex, mapIndex);
        this.showAction();
        this.enterBtn.on(cc.Node.EventType.TOUCH_END, this.onEnterGame, this);
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onCloseBtn, this);
        this.tryBtn.on(cc.Node.EventType.TOUCH_END, this.onTryBtn, this);
        // if (!GameMag.Ins.guide[3]) {
        //     cc.director.on("showGuideStep3", function () {
        //         this.scheduleOnce(() => {
        //             const pos = cc.v2(this.enterBtn.x + 330, this.enterBtn.y);
        //             DialogMag.Ins.show(DialogPath.GuideDialog, DialogScript.GuideDialog, [3, 90, cc.Vec2.ZERO, pos]);
        //         }, 0.1);
        //     }.bind(this), this);
        // }
    }
    // 0:无尽模式 1:击杀模式 2:距离模式 3:时间模式 4.防御模式 5.护送模式 6 钥匙模式  7:击杀+时间模式 8:距离+时间模式  9:护送+时间  10:钥匙+时间
    initUI(taskIndex, mapIndex) {
        GameMag.Ins.gameKillNum = 0;
        let lv = GameMag.Ins.level;
        let killNum = 10 + (lv - 1) * 5;
        let moveNum = 10 + (lv - 1) * 5;
        let secondNum = 20 + (lv - 1) * 5;
        let coinNum = taskIndex < 4 ? 800 + (lv - 1) * 50 : 1000 + (lv - 1) * 150;
        let diamondNum = 1 + Math.floor(lv / 10);
        let keyNum = Math.floor(lv / 2);

        this.mapBg.spriteFrame = this.homeMainAtlas.getSpriteFrame("bg" + mapIndex);
        this.mapName.spriteFrame = this.homeMainAtlas.getSpriteFrame("mapName_" + mapIndex);
        GameMag.Ins.cleanMissionData();
        let str = "";
        switch (taskIndex) {
            case 0:
                console.log("无尽模式");
                this.endlessImg.active = true;
                this.rewardContent.active = false;
                GameMag.Ins.missionData = null;
                return;
            case 1:
                console.log("击杀模式");
                str = `任务:击杀${killNum}个僵尸`;
                GameMag.Ins.missionData.killNum = killNum;
                break;
            case 2:
                console.log("距离模式");
                str = `任务:向前跑${moveNum}米`;
                GameMag.Ins.missionData.moveNum = moveNum;
                break;
            case 3:
                console.log("时间模式");
                str = `任务:坚持${secondNum}秒`;
                GameMag.Ins.missionData.secondNum = secondNum;
                break;
            case 4:
                console.log("防御模式");
                str = `在${secondNum}秒内阻止${killNum}个僵尸进入旋涡`;
                GameMag.Ins.missionData.defenseNum = killNum;
                GameMag.Ins.missionData.secondNum = secondNum;
                break;
            case 5:
                console.log("护送模式");
                str = `任务:护送路人到达指定地点`;
                GameMag.Ins.missionData.moveNum = moveNum;
                break;
            case 6:
                console.log("钥匙模式");
                str = `任务:收集${keyNum}个钥匙`;
                GameMag.Ins.missionData.keyNum = keyNum;
                break;
            case 7:
                console.log("击杀+时间模式");
                const time = 20 + (lv - 1) * 8;
                str = `任务:${time}秒内击杀${killNum}个僵尸`;
                GameMag.Ins.missionData.killNum = killNum;
                GameMag.Ins.missionData.secondNum = time;
                break;
            case 8:
                console.log("距离+时间模式");
                str = `任务:${secondNum}秒内移动${moveNum}米`;
                GameMag.Ins.missionData.moveNum = moveNum;
                GameMag.Ins.missionData.secondNum = secondNum;
                break;
            case 9:
                console.log("护送+时间模式");
                str = `任务:${secondNum}秒内护送路人到达指定地点`;
                GameMag.Ins.missionData.secondNum = secondNum;
                GameMag.Ins.missionData.moveNum = moveNum;
                break;
            case 10:
                console.log("钥匙+时间模式");
                str = `任务:${secondNum}秒内收集${keyNum}个钥匙`;
                GameMag.Ins.missionData.secondNum = secondNum;
                GameMag.Ins.missionData.keyNum = keyNum;
                break;
            default:
                break;
        }
        GameMag.Ins.missionData.coinNum = coinNum;
        GameMag.Ins.missionData.diamondNum = diamondNum;
        this.coinLab.string = String(coinNum);
        this.diamondLab.string = String(diamondNum);
        this.missionLab.string = str;
    }
    trySkin: number = null;
    //建议使用
    initRecommendUI() {
        return
        let data = GameMag.Ins.skinData;
        let arr = [];
        data.forEach(item => {
            if (!item.geted) {
                arr.push(item);
            }
        });
        let skinID = null;
        if (arr.length == 0) {
            skinID = 4;
        } else {
            const index = Math.floor(Math.random() * arr.length);
            skinID = arr[index].skinID;
        }
        this.trySkin = skinID;
        this.iconName.spriteFrame = this.homeAtlas.getSpriteFrame("skinDesc_" + skinID);
        this.iconImage.spriteFrame = this.homeAtlas.getSpriteFrame("skin_" + skinID);
    }
    //出场动效
    showAction() {
        const height = cc.view.getVisibleSize().height / 2;
        cc.tween(this.left)
            .to(0.2, { position: cc.v3(0, height - 15, 0) })
            .to(0.05, { position: cc.v3(0, height + 15, 0) })
            .call(() => {
                cc.tween(this.right)
                    .to(0.12, { position: cc.v3(0, -height + 10, 0) })
                    .to(0.05, { position: cc.v3(0, -height - 10, 0) })
                    .call(() => {
                        this.showActionEnd = true;
                        // if (!GameMag.Ins.guide[2]) {
                        //     const ps = this.missionLab.node.position;
                        //     DialogMag.Ins.show(DialogPath.GuideDialog, DialogScript.GuideDialog, [2, 90, cc.v2(0, -245), cc.v2(ps.x + 450, ps.y - 30)]);
                        // }
                    })
                    .start();
            })
            .start();
    }
    onTryBtn() {
        ToolsMag.Ins.buttonAction(this.tryBtn, function () {
            GameMag.Ins.trySkin = this.trySkin;
            if (!GameMag.Ins.gameLoaded) return;
            let gamescene = GameMag.Ins.gameScene;
            cc.director.loadScene(gamescene);
        }.bind(this));
    }
    onEnterGame() {
        if (!this.showActionEnd) return;
        ToolsMag.Ins.buttonAction(this.enterBtn, function () {
            if (!GameMag.Ins.gameLoaded) return;
            let gamescene = GameMag.Ins.gameScene;
            cc.director.loadScene(gamescene);
        }.bind(this));
    }
    onCloseBtn() {
        this.trySkin = null;
        ToolsMag.Ins.buttonAction(this.closeBtn, function () {
            cc.tween(this.left)
                .to(0.2, { position: cc.v3(0, 1000, 0) })
                .start();
            cc.tween(this.right)
                .to(0.2, { position: cc.v3(0, -620, 0) })
                .call(() => {
                    DialogMag.Ins.removePlane(DialogPath.FrontGameDialog);
                })
                .start();
        }.bind(this));
    }
}
