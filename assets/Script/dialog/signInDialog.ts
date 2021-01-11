import GameMag from "../manage/GameMag";
import ToolsMag from "../manage/ToolsMag";
import AudioMag from "../manage/AudioMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";
import ConfigMag from "../manage/ConfigMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SignInDialog extends cc.Component {

    @property({ type: cc.Node, tooltip: "" })
    closeBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "提示框" })
    tipModal: cc.Node = null;
    @property({ type: cc.Node, tooltip: "普通领取" })
    normalBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "视频领取" })
    videoBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "" })
    content: cc.Node = null;
    @property(cc.Node)
    rewardModal: cc.Node = null;
    @property(cc.Node)
    closeRewardModal: cc.Node = null;
    @property(cc.Node)
    rewardIcons: cc.Node = null;

    showSignFlag: number = null;//显示的是哪天
    rewardNumForDay1: number = 2500; //第1天要奖励的金币
    rewardNumForDay2: number = 2; //第2天要奖励的机甲数量
    rewardNumForDay3: number = 500; //第3天要奖励的钻石
    rewardGun: number = 14; //第4天要奖励的枪id
    rewardSkin: number = 2; //第5天要奖励的皮肤id
    rewardNumForDay6: number = 5; //第6天要奖励的炸弹个数
    rewardNumForDay7: number = 10; //第7天要奖励的机甲个数

    onInit() {
        this.initUI();
        this.normalBtn.on(cc.Node.EventType.TOUCH_END, this.onNormalGet, this);
        this.videoBtn.on(cc.Node.EventType.TOUCH_END, this.onVideoGet, this);
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClose, this);
        this.closeRewardModal.on(cc.Node.EventType.TOUCH_END, function () {
            DialogMag.Ins.removePlane(DialogPath.SignInDialog);
            DialogMag.Ins.removePlane(DialogPath.SignInDialog);
        }.bind(this), this);
    }
    onClose() {
        let todaySign = GameMag.Ins.signInData.todaySign;
        if (!todaySign) {
            this.showModal(this.tipModal);
            return;
        }
        ToolsMag.Ins.buttonAction(this.closeBtn, function () {
            DialogMag.Ins.removePlane(DialogPath.SignInDialog);
        }.bind(this));
    }
    //普通领取
    onNormalGet() {
        const flag = this.showSignFlag;
        switch (flag) {
            case 0:
                this.rewardDay1(flag);
                break;
            case 1:
                this.rewardDay2(flag);
                break;
            case 2:
                this.rewardDay3(flag);
                break;
            case 3:
                this.rewardDay4(flag);
                break;
            case 4:
                this.rewardDay5(flag);
                break;
            case 5:
                this.rewardDay6(flag);
                break;
            case 6:
                this.rewardDay7(flag);
                break;
            default:
                break;
        }
        this.tipModal.active = false;
    }
    //视屏双倍领取
    onVideoGet() {
        const flag = this.showSignFlag;
        switch (flag) {
            case 0:
                this.rewardDay1(flag, 2);
                break;
            case 1:
                this.rewardDay2(flag, 2);
                break;
            case 2:
                this.rewardDay3(flag, 2);
                break;
            case 3:
                this.rewardDay4(flag, 2);
                break;
            case 4:
                this.rewardDay5(flag, 2);
                break;
            case 5:
                this.rewardDay6(flag, 2);
                break;
            case 6:
                this.rewardDay7(flag, 2);
                break;
            default:
                break;
        }
        this.tipModal.active = false;
    }
    initUI() {
        let signInData = GameMag.Ins.signInData;
        let data = signInData.signDay;
        if (signInData.todaySign) {
            for (let i = 0; i < data.length; i++) {
                if (data[i]) {
                    const target = this.content.children[i].getChildByName("mask");
                    target.active = true;
                };
            };
            this.updateDayUI();
            return;
        }
        for (let i = 0; i < data.length; i++) {
            if (!data[i]) {
                this.showSignFlag = i;
                const target = this.content.children[i].getChildByName("active");
                target.active = true;
                this.lightAction(target);
                break;
            } else {
                const target = this.content.children[i].getChildByName("mask");
                target.active = true;
            }
        };
        this.updateDayUI();
    }
    updateDayUI() {
        const gunGeted = GameMag.Ins.gunData[this.rewardGun].geted;
        const firstAround = GameMag.Ins.signInData.firstAround;
        if (gunGeted && firstAround) { //如果获得了,就直接奖励对应的常规下需要花费的金额
            this.content.getChildByName("day4").getChildByName("day").getChildByName("geted").active = true;
        } else { //直接奖励
            this.content.getChildByName("day4").getChildByName("day").getChildByName("noget").active = true;
        }
        const skinGeted = GameMag.Ins.skinData[this.rewardSkin].geted;
        if (skinGeted && firstAround) {
            this.content.getChildByName("day5").getChildByName("day").getChildByName("geted").active = true;
        } else {
            this.content.getChildByName("day5").getChildByName("day").getChildByName("noget").active = true;
        }
    }
    //做个呼吸效果
    lightAction(node) {
        cc.tween(node)
            .repeatForever(
                cc.tween().to(0.8, { scale: 1.03, opacity: 150 }).delay(0.1).to(0.8, { scale: 0.98, opacity: 100 }).delay(0.15)
            )
            .start();
    }
    closeDialog() {
        AudioMag.getInstance().playSound("按钮音");
        DialogMag.Ins.removePlane(DialogPath.SignInDialog);
    }
    showRewardModal(index) {
        this.showModal(this.rewardModal);
        this.rewardIcons.children[index].active = true;
    }
    rewardDay1(tag, rate = 1) {
        GameMag.Ins.updateSignIn(tag);
        this.showRewardModal(tag);
        GameMag.Ins.updateCurrency(0, this.rewardNumForDay1 * rate);
        cc.director.emit("updateCurrency");
    }
    rewardDay2(tag, rate = 1) {
        GameMag.Ins.updateSignIn(tag);
        this.showRewardModal(tag);
        GameMag.Ins.updateMechaData(0, this.rewardNumForDay2 * rate);
    }
    rewardDay3(tag, rate = 1) {
        GameMag.Ins.updateSignIn(tag);
        this.showRewardModal(tag);
        GameMag.Ins.updateCurrency(1, this.rewardNumForDay3 * rate);
        cc.director.emit("updateCurrency");
    }
    rewardDay4(tag, rate = 1) {
        GameMag.Ins.updateSignIn(tag);
        const gunData = GameMag.Ins.gunData[this.rewardGun];
        if (gunData.geted) {
            this.showRewardModal(2);
            const cigData = ConfigMag.Ins.getGunData()[this.rewardGun];
            GameMag.Ins.updateCurrency(cigData.buyType, cigData.costNum * rate);
            cc.director.emit("updateCurrency");
        } else {
            this.showRewardModal(tag);
            GameMag.Ins.updateGunDataByGeted(this.rewardGun);//黄金AK
        }
    }
    rewardDay5(tag, rate = 1) {
        GameMag.Ins.updateSignIn(tag);
        const skinData = GameMag.Ins.skinData[this.rewardSkin];
        if (skinData.geted) {
            this.showRewardModal(0);
            const cigData = ConfigMag.Ins.getSkinData()[this.rewardSkin];
            GameMag.Ins.updateCurrency(cigData.buyType, cigData.costNum * rate);
            cc.director.emit("updateCurrency");
        } else {
            this.showRewardModal(tag);
            GameMag.Ins.updateSkinData(this.rewardSkin);
        }
    }
    rewardDay6(tag, rate = 1) {
        GameMag.Ins.updateSignIn(tag);
        this.showRewardModal(tag);
        GameMag.Ins.updateAssistData(14, this.rewardNumForDay6 * rate);
    }
    rewardDay7(tag, rate = 1) {
        GameMag.Ins.updateSignIn(tag);
        this.showRewardModal(tag);
        GameMag.Ins.updateMechaData(2, this.rewardNumForDay7 * rate);
    }
    onDay1(e, tag) {
        AudioMag.getInstance().playSound("按钮音");
        if (this.showSignFlag != tag) return;
        this.rewardDay1(tag);
    }
    onDay2(e, tag) {
        AudioMag.getInstance().playSound("按钮音");
        if (this.showSignFlag != tag) return;
        this.rewardDay2(tag);
    }
    onDay3(e, tag) {
        AudioMag.getInstance().playSound("按钮音");
        if (this.showSignFlag != tag) return;
        this.rewardDay3(tag);
    }
    onDay4(e, tag) {
        AudioMag.getInstance().playSound("按钮音");
        if (this.showSignFlag != tag) return;
        this.rewardDay4(tag);
    }
    onDay5(e, tag) {
        AudioMag.getInstance().playSound("按钮音");
        if (this.showSignFlag != tag) return;
        this.rewardDay5(tag);
    }
    onDay6(e, tag) {
        AudioMag.getInstance().playSound("按钮音");
        if (this.showSignFlag != tag) return;
        this.rewardDay6(tag);
    }
    onDay7(e, tag) {
        AudioMag.getInstance().playSound("按钮音");
        if (this.showSignFlag != tag) return;
        this.rewardDay7(tag);
    }
    showModal(target) {
        target.scale = 0;
        target.active = true;
        cc.tween(target)
            .to(0.1, { scale: 1 })
            .start();
    }
}
