import ConfigMag from "../../manage/ConfigMag";
import GameMag from "../../manage/GameMag";
import AudioMag from "../../manage/AudioMag";
import ToolsMag from "../../manage/ToolsMag";
import DialogMag, { DialogPath, DialogScript } from "../../manage/DialogMag";
import gameAssistItem from "../../game/gameAssistItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UpgradeModal extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;
    @property({ type: cc.Node, tooltip: "关闭升级界面按钮" })
    closeUpgradeModal: cc.Node = null;
    @property({ type: cc.Label, tooltip: "血量等级" })
    bloodLv: cc.Label = null;
    @property({ type: cc.Label, tooltip: "速度等级" })
    speedLv: cc.Label = null;
    @property({ type: cc.Label, tooltip: "护甲等级" })
    armorLv: cc.Label = null;
    @property({ type: cc.Node, tooltip: "血量升级按钮" })
    bloodUpBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "速度升级按钮" })
    speedUpBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "护甲升级按钮" })
    armorUpBtn: cc.Node = null;
    @property({ type: cc.Label, tooltip: "血量升级需要的药水数量" })
    bloodUpCost: cc.Label = null;
    @property({ type: cc.Label, tooltip: "速度升级需要的药水数量" })
    speedUpCost: cc.Label = null;
    @property({ type: cc.Label, tooltip: "护甲升级需要的药水数量" })
    armorUpCost: cc.Label = null;
    @property(cc.Node)
    bloodNode: cc.Node = null;
    @property(cc.Node)
    speedNode: cc.Node = null;
    @property(cc.Node)
    armorNode: cc.Node = null;
    @property(cc.Node)
    upgradeUpBtns: cc.Node = null;
    @property(cc.Node)
    levelBox: cc.Node = null;
    @property(cc.Node)
    upgradeCost: cc.Node = null;
    @property({ type: cc.Node, tooltip: "购买药剂界面" })
    optionModal: cc.Node = null;
    @property({ type: cc.Node, tooltip: "关闭升级界面按钮" })
    closeOptionModal: cc.Node = null;
    @property({ type: cc.Node, tooltip: "左边的购买药水按钮" })
    leftBuyBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "右边的购买药水按钮" })
    rightBuyBtn: cc.Node = null;
    @property({ type: cc.Label, tooltip: "左边的购买一次药水获得几个" })
    leftAddLab: cc.Label = null;
    @property({ type: cc.Label, tooltip: "左边的购买一次药水花费多少钱" })
    leftCostLab: cc.Label = null;
    @property({ type: cc.Label, tooltip: "右边的购买一次药水获得几个" })
    rightAddLab: cc.Label = null;
    @property({ type: cc.Label, tooltip: "右边的购买一次药水花费多少钱" })
    rightCostLab: cc.Label = null;

    skillConfig: number[] = [];
    bloodCount: number = 0;
    speedCount: number = 0;
    armorCount: number = 0;
    bloodMaxCount: number = 0;
    speedMaxCount: number = 0;
    armorMaxCount: number = 0;
    bloodUpMaxCount: number = 0;
    speedUpMaxCount: number = 0;
    armorUpMaxCount: number = 0;
    bloodUpCount: number = 0;
    speedUpCount: number = 0;
    armorUpCount: number = 0;

    index: number = null;
    screenWidth: number = null;
    ciginfo: any = null;
    leftAdd: number = 1;
    leftCost: number = 5;
    rightAdd: number = 10;
    rightCost: number = 45;

    init(index) {//index 哪个皮肤
        this.screenWidth = cc.view.getVisibleSize().width;
        this.skillConfig = GameMag.Ins.skillConfig;
        this.ciginfo = ConfigMag.Ins.getSkinData()[index];
        console.log(this.ciginfo);
        this.index = index;
        this.initUI();
        this.bloodUpBtn.on(cc.Node.EventType.TOUCH_END, this.onBloodUp, this);
        this.speedUpBtn.on(cc.Node.EventType.TOUCH_END, this.onSpeedUp, this);
        this.armorUpBtn.on(cc.Node.EventType.TOUCH_END, this.onArmorUp, this);
        this.leftBuyBtn.on(cc.Node.EventType.TOUCH_END, this.onLeftBuy, this);
        this.rightBuyBtn.on(cc.Node.EventType.TOUCH_END, this.onRightBuy, this);
        this.closeOptionModal.on(cc.Node.EventType.TOUCH_END, this.hideBuyOptionModal, this);
        this.closeUpgradeModal.on(cc.Node.EventType.TOUCH_END, function () {
            cc.director.emit("freshSkinPageUI", this.ciginfo);
            this.node.active = false;
        }, this);
    }
    initUI() {
        this.loadSkillBlock();
        this.refreshSkillLv();
        this.bloodUpCost.string = "x" + this.ciginfo.bloodUpCost;
        this.speedUpCost.string = "x" + this.ciginfo.speedUpCost;
        this.armorUpCost.string = "x" + this.ciginfo.armorUpCost;
    }
    refreshSkillLv() {
        const info = GameMag.Ins.skinData[this.index];
        const upMax = this.ciginfo.upMax;
        if (info.bloodLv == upMax) {
            this.updateUI(0, false);
        } else {
            this.updateUI(0);
        }
        if (info.speedLv == upMax) {
            this.updateUI(1, false);
        } else {
            this.updateUI(1);
        }
        if (info.armorLv == upMax) {
            this.updateUI(2, false);
        } else {
            this.updateUI(2);
        }
        this.bloodLv.string = "LV." + info.bloodLv;
        this.speedLv.string = "LV." + info.speedLv;
        this.armorLv.string = "LV." + info.armorLv;
    }
    updateUI(i, showActive = true) {
        this.upgradeUpBtns.children[i].active = showActive;
        this.levelBox.children[i].active = showActive;
        this.upgradeCost.children[i].active = showActive;
    }
    onLeftBuy() {
        const num = GameMag.Ins.currency.diamond;
        if (num >= this.leftCost) {
            GameMag.Ins.updateCurrency(1, -this.leftCost);
            GameMag.Ins.updateCurrency(2, this.leftAdd);
            cc.director.emit("updateCurrency");
            cc.director.emit("freshOption");
            DialogMag.Ins.show(DialogPath.MessageDialog, DialogScript.MessageDialog, ["购买成功"]);
            return;
        }
        cc.director.emit("shopCoinPage");
    }
    onRightBuy() {
        const num = GameMag.Ins.currency.diamond;
        if (num >= this.rightCost) {
            GameMag.Ins.updateCurrency(1, -this.rightCost);
            GameMag.Ins.updateCurrency(2, this.rightAdd);
            cc.director.emit("updateCurrency");
            cc.director.emit("freshOption");
            DialogMag.Ins.show(DialogPath.MessageDialog, DialogScript.MessageDialog, ["购买成功"]);
            return;
        }
        cc.director.emit("shopCoinPage");
    }
    //显示购买药水的弹窗
    showBuyOptionModal() {
        this.leftAddLab.string = String(`X${this.leftAdd}`);
        this.leftCostLab.string = String(this.leftCost);
        this.rightAddLab.string = String(`X${this.rightAdd}`);
        this.rightCostLab.string = String(this.rightCost);
        this.optionModal.active = true;
        cc.tween(this.optionModal)
            .parallel(
                cc.tween().call(() => {
                    cc.tween(this.content).to(0.3, { position: cc.v3(-this.screenWidth / 2, 0, 0), scale: 0.7 }).start();
                }),
                cc.tween().to(0.2, { position: cc.v3(0, 0, 0) })
            )
            .start();
    }
    //隐藏购买药水的弹窗
    hideBuyOptionModal() {
        cc.tween(this.optionModal)
            .parallel(
                cc.tween().call(() => {
                    cc.tween(this.content).to(0.3, { position: cc.v3(0, 0, 0), scale: 1 }).start();
                }),
                cc.tween().to(0.2, { position: cc.v3(1400, 0, 0) })
            )
            .call(() => {
                this.optionModal.active = false;
            })
            .start();
    }
    //判断够不够买药水
    checkOption(costNum): boolean {
        let num = GameMag.Ins.currency.option;
        if (num >= costNum) {
            return true;
        }
        return false;
    }
    onBloodUp() {
        const status = this.checkOption(this.ciginfo.bloodUpCost);
        if (status) {
            GameMag.Ins.updateCurrency(2, -this.ciginfo.bloodUpCost);
            GameMag.Ins.updateSkinDataUpgrade(this.index, 0, this.ciginfo.bloodUp);
            this.refreshSkillLv();
            this.initBloodData();
            this.unschedule(this.loadBlood);
            this.scheduleOnce(this.loadBlood, 0.1);
            return;
        }
        this.showBuyOptionModal();
    }
    onSpeedUp() {
        const status = this.checkOption(this.ciginfo.speedUpCost);
        if (status) {
            GameMag.Ins.updateCurrency(2, -this.ciginfo.speedUpCost);
            GameMag.Ins.updateSkinDataUpgrade(this.index, 1, this.ciginfo.speedUp);
            this.refreshSkillLv();
            this.initSpeedData();
            this.unschedule(this.loadSpeed);
            this.scheduleOnce(this.loadSpeed, 0.1);
            return;
        }
        this.showBuyOptionModal();
    }
    onArmorUp() {
        const status = this.checkOption(this.ciginfo.armorUpCost);
        if (status) {
            GameMag.Ins.updateCurrency(2, -this.ciginfo.armorUpCost);
            GameMag.Ins.updateSkinDataUpgrade(this.index, 2, this.ciginfo.armorUp);
            this.refreshSkillLv();
            this.initArmorData();
            this.unschedule(this.loadArmor);
            this.scheduleOnce(this.loadArmor, 0.1);
            return;
        }
        this.showBuyOptionModal();
    }
    //加载技能显示块
    loadSkillBlock() {
        this.initBloodData();
        this.initSpeedData();
        this.initArmorData();
        this.unschedule(this.showSkillBlock);
        this.scheduleOnce(this.showSkillBlock, 0.3);
    }
    initBloodData() {
        const info = GameMag.Ins.skinData[this.index];
        this.bloodCount = 0;
        this.bloodUpCount = 0;
        this.bloodMaxCount = info.blood * 2;
        this.bloodUpMaxCount = this.ciginfo.bloodUp * 2;
        this.putBlock(this.bloodNode);
    }
    initSpeedData() {
        const info = GameMag.Ins.skinData[this.index];
        this.speedCount = 0;
        this.speedUpCount = 0;
        this.speedMaxCount = info.speed * 2;
        this.speedUpMaxCount = this.ciginfo.speedUp * 2;
        this.putBlock(this.speedNode);
    }
    initArmorData() {
        const info = GameMag.Ins.skinData[this.index];
        this.armorCount = 0;
        this.armorUpCount = 0;
        this.armorMaxCount = info.armor * 2;
        this.armorUpMaxCount = this.ciginfo.armorUp * 2;
        this.putBlock(this.armorNode);
    }
    showSkillBlock() {
        this.loadBlood();
        this.loadSpeed();
        this.loadArmor();
    }
    loadBlood() {
        let self = this;
        GameMag.Ins.getSkillBlock((node) => {
            node.stopAllActions();
            node.parent = self.bloodNode;
            node.getChildByName("blue").active = false;
            node.scale = 0;
            cc.tween(node)
                .to(self.skillConfig[0], { scale: self.skillConfig[1] })
                .call(() => {
                    self.bloodCount++;
                    if (self.bloodCount < self.bloodMaxCount) {
                        self.loadBlood();
                    } else {
                        self.loadBlueBlood();
                    }
                })
                .to(self.skillConfig[2], { scale: 1 })
                .start();
        });
    }
    loadBlueBlood() {
        let self = this;
        GameMag.Ins.getSkillBlock((node) => {
            node.getChildByName("blue").active = true;
            node.stopAllActions();
            node.parent = self.bloodNode;
            node.scale = 0;
            cc.tween(node)
                .to(self.skillConfig[0], { scale: self.skillConfig[1] })
                .call(() => {
                    self.bloodUpCount++;
                    if (self.bloodUpCount < self.bloodUpMaxCount) {
                        self.loadBlueBlood();
                    }
                })
                .to(self.skillConfig[2], { scale: 1 })
                .start();
        })
    }
    loadSpeed() {
        let self = this;
        GameMag.Ins.getSkillBlock((node) => {
            node.stopAllActions();
            node.parent = self.speedNode;
            node.getChildByName("blue").active = false;
            node.scale = 0;
            cc.tween(node)
                .to(self.skillConfig[0], { scale: self.skillConfig[1] })
                .call(() => {
                    self.speedCount++;
                    if (self.speedCount < self.speedMaxCount) {
                        self.loadSpeed();
                    } else {
                        self.loadBlueSpeed();
                    }
                })
                .to(self.skillConfig[2], { scale: 1 })
                .start();
        })
    }
    loadBlueSpeed() {
        let self = this;
        GameMag.Ins.getSkillBlock((node) => {
            node.getChildByName("blue").active = true;
            node.stopAllActions();
            node.parent = self.speedNode;
            node.scale = 0;
            cc.tween(node)
                .to(self.skillConfig[0], { scale: self.skillConfig[1] })
                .call(() => {
                    self.speedUpCount++;
                    if (self.speedUpCount < self.speedUpMaxCount) {
                        self.loadBlueSpeed();
                    }
                })
                .to(self.skillConfig[2], { scale: 1 })
                .start();
        })
    }
    loadArmor() {
        let self = this;
        GameMag.Ins.getSkillBlock((node) => {
            node.stopAllActions();
            node.parent = self.armorNode;
            node.getChildByName("blue").active = false;
            node.scale = 0;
            cc.tween(node)
                .to(self.skillConfig[0], { scale: self.skillConfig[1] })
                .call(() => {
                    self.armorCount++;
                    if (self.armorCount < self.armorMaxCount) {
                        self.loadArmor();
                    } else {
                        self.loadBlueArmor();
                    }
                })
                .to(self.skillConfig[2], { scale: 1 })
                .start();
        })
    }
    loadBlueArmor() {
        let self = this;
        GameMag.Ins.getSkillBlock((node) => {
            node.getChildByName("blue").active = true;
            node.stopAllActions();
            node.parent = self.armorNode;
            node.scale = 0;
            cc.tween(node)
                .to(self.skillConfig[0], { scale: self.skillConfig[1] })
                .call(() => {
                    self.armorUpCount++;
                    if (self.armorUpCount < self.armorUpMaxCount) {
                        self.loadBlueArmor();
                    }
                })
                .to(self.skillConfig[2], { scale: 1 })
                .start();
        })
    }
    //回收
    putBlock(parentNode: cc.Node) {
        parentNode.children.forEach(item => {
            item.getChildByName("blue").active = false;
            item.stopAllActions();
            this.scheduleOnce(() => {
                GameMag.Ins.putSkillBlock(item);
            }, 0)
        });
    }
}
