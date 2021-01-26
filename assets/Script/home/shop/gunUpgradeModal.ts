import ConfigMag from "../../manage/ConfigMag";
import GameMag from "../../manage/GameMag";
import AudioMag from "../../manage/AudioMag";
import ToolsMag from "../../manage/ToolsMag";
import DialogMag, { DialogPath, DialogScript } from "../../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GunUpgradeModal extends cc.Component {

    @property(cc.SpriteAtlas)
    shopAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    closeBtn: cc.Node = null;
    @property(cc.Node)
    arrowNode: cc.Node = null;
    @property(cc.Node)
    downContent: cc.Node = null;
    @property(cc.Node)
    upgradeBtn: cc.Node = null;
    @property(cc.Sprite)
    gunName: cc.Sprite = null;
    @property(cc.Sprite)
    gunIcon: cc.Sprite = null;
    @property(cc.Label)
    gunLv: cc.Label = null;
    @property(cc.Sprite)
    nextGunIcon: cc.Sprite = null;
    @property(cc.Label)
    nextGunLv: cc.Label = null;
    @property(cc.Label)
    coinLab: cc.Label = null;
    @property(cc.Label)
    diamondLab: cc.Label = null;
    @property(cc.Node)
    powerNode: cc.Node = null;
    @property(cc.Node)
    speedNode: cc.Node = null;
    @property(cc.Node)
    critNode: cc.Node = null;

    gunID: number = null;
    gunCigData: any = null;
    skillConfig: number[] = [];
    powerCount: number = 0;
    speedCount: number = 0;
    critCount: number = 0;
    powerMaxCount: number = 0;
    speedMaxCount: number = 0;
    critMaxCount: number = 0;
    powerUpMaxCount: number = 0;
    speedUpMaxCount: number = 0;
    critUpMaxCount: number = 0;
    powerUpCount: number = 0;
    speedUpCount: number = 0;
    critUpCount: number = 0;

    init(gunID) {
        this.gunID = gunID;
        this.gunCigData = ConfigMag.Ins.getGunData()[gunID];
        this.skillConfig = GameMag.Ins.skillConfig;
        this.initUI();
        this.freshUI();
        this.upgradeBtn.on(cc.Node.EventType.TOUCH_END, this.onUpgradeBtn, this);
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, function () {
            cc.director.emit("freshGunPageUI", this.gunCigData);
            cc.director.emit("freshGunItemUI");
            cc.director.emit("freshGunIcon", gunID, true);
            this.node.active = false;
        }, this);
    }
    initUI() {
        this.downContent.active = true;
        this.gunIcon.node.active = true;
        this.gunLv.node.active = true;
        this.nextGunLv.node.active = true;
        this.arrowNode.active = true;
    }
    freshUI() {
        this.loadSkillBlock();
        let gunLv = GameMag.Ins.gunData[this.gunID].gunLv;
        console.log("等级", gunLv);
        if (gunLv === 3) {
            const target = this.nextGunIcon.node;
            target.opacity = 0;
            target.x = 0;
            target.scale = 4;
            cc.tween(target)
                .to(0.2, { scale: 1.9, opacity: 255 })
                .to(0.05, { scale: 2.1 })
                .to(0.05, { scale: 2 })
                .start();
            this.downContent.active = false;
            this.gunIcon.node.active = false;
            this.gunLv.node.active = false;
            this.nextGunLv.node.active = false;
            this.arrowNode.active = false;
            return;
        }
        let lv = null, nextLv = null;
        if (gunLv === 0) {
            lv = 0;
            nextLv = 1;
        } else if (gunLv === 1) {
            lv = 1;
            nextLv = 3;
        } else if (gunLv === 2) {
            lv = 1;
            nextLv = 3;
        }
        this.gunLv.string = String("LV." + gunLv);
        this.gunIcon.spriteFrame = this.shopAtlas.getSpriteFrame(`gun_${this.gunID}_${lv}`);
        this.nextGunLv.string = String("LV." + nextLv);
        this.nextGunIcon.spriteFrame = this.shopAtlas.getSpriteFrame(`gun_${this.gunID}_${nextLv}`);
        this.gunName.spriteFrame = this.shopAtlas.getSpriteFrame("gunName_" + this.gunID);
        if (this.gunCigData.upType === 0) {
            this.coinLab.node.parent.active = true;
            this.diamondLab.node.parent.active = false;
            this.coinLab.string = String(this.gunCigData.upCostNum[gunLv]);
            return;
        }
        this.coinLab.node.parent.active = false;
        this.diamondLab.node.parent.active = true;
        this.diamondLab.string = String(this.gunCigData.upCostNum[gunLv]);
    }
    //强化
    onUpgradeBtn() {
        const gunLv = GameMag.Ins.gunData[this.gunID].gunLv;
        const costNum = this.gunCigData.upCostNum[gunLv];
        let currency = GameMag.Ins.currency;
        if (this.gunCigData.buyType === 0 && (currency.coin < costNum)) {
            cc.director.emit("shopCoinPage");
            return;
        }
        if (this.gunCigData.buyType === 1 && (currency.diamond < costNum)) {
            cc.director.emit("shopCoinPage");
            return;
        }
        GameMag.Ins.updateCurrency(this.gunCigData.upType, -costNum);
        cc.director.emit("updateCurrency");
        const powerUpNum = this.gunCigData.powerUp[gunLv];
        const speedUpNum = this.gunCigData.speedUp[gunLv];
        const critUpNum = this.gunCigData.critUp[gunLv];
        GameMag.Ins.updateGunDataByLevel(this.gunID, powerUpNum, speedUpNum, critUpNum);
        this.freshUI();
    }
    loadSkillBlock() {
        const info = GameMag.Ins.gunData[this.gunID];
        const gunLv = info.gunLv;
        this.powerCount = 0;
        this.speedCount = 0;
        this.critCount = 0;
        this.powerUpCount = 0;
        this.speedUpCount = 0;
        this.critUpCount = 0;
        this.powerMaxCount = info.power * 2;
        this.speedMaxCount = info.speed * 2;
        this.critMaxCount = info.crit * 2;
        if (gunLv < 3) {
            this.powerUpMaxCount = this.gunCigData.powerUp[gunLv] * 2;
            this.speedUpMaxCount = this.gunCigData.speedUp[gunLv] * 2;
            this.critUpMaxCount = this.gunCigData.critUp[gunLv] * 2;
        } else {
            this.powerUpMaxCount = 0;
            this.speedUpMaxCount = 0;
            this.critUpMaxCount = 0;
        }
        this.putBlock(this.powerNode);
        this.putBlock(this.speedNode);
        this.putBlock(this.critNode);
        this.unschedule(this.showSkillBlock);
        this.scheduleOnce(this.showSkillBlock, 0.3);
    }
    showSkillBlock() {
        this.loadPower();
        this.loadSpeed();
        this.loadCrit();
    }
    loadPower() {
        let self = this;
        GameMag.Ins.getSkillBlock((node) => {
            node.stopAllActions();
            node.parent = self.powerNode;
            node.getChildByName("blue").active = false;
            node.scale = 0;
            cc.tween(node)
                .to(self.skillConfig[0], { scale: self.skillConfig[1] })
                .call(() => {
                    self.powerCount++;
                    if (self.powerCount < self.powerMaxCount) {
                        self.loadPower();
                    } else {
                        self.loadBluePower();
                    }
                })
                .to(self.skillConfig[2], { scale: 1 })
                .start();
        });
    }
    loadBluePower() {
        if (this.powerUpMaxCount === 0) return;
        let self = this;
        GameMag.Ins.getSkillBlock((node) => {
            node.getChildByName("blue").active = true;
            node.stopAllActions();
            node.parent = self.powerNode;
            node.scale = 0;
            cc.tween(node)
                .to(self.skillConfig[0], { scale: self.skillConfig[1] })
                .call(() => {
                    self.powerUpCount++;
                    if (self.powerUpCount < self.powerUpMaxCount) {
                        self.loadBluePower();
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
        });
    }
    loadBlueSpeed() {
        if (this.speedUpMaxCount === 0) return;
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
    loadCrit() {
        let self = this;
        GameMag.Ins.getSkillBlock((node) => {
            node.stopAllActions();
            node.parent = self.critNode;
            node.getChildByName("blue").active = false;
            node.scale = 0;
            cc.tween(node)
                .to(self.skillConfig[0], { scale: self.skillConfig[1] })
                .call(() => {
                    self.critCount++;
                    if (self.critCount < self.critMaxCount) {
                        self.loadCrit();
                    } else {
                        self.loadBlueCrit();
                    }
                })
                .to(self.skillConfig[2], { scale: 1 })
                .start();
        });
    }
    loadBlueCrit() {
        if (this.critUpMaxCount === 0) return;
        let self = this;
        GameMag.Ins.getSkillBlock((node) => {
            node.getChildByName("blue").active = true;
            node.stopAllActions();
            node.parent = self.critNode;
            node.scale = 0;
            cc.tween(node)
                .to(self.skillConfig[0], { scale: self.skillConfig[1] })
                .call(() => {
                    self.critUpCount++;
                    if (self.critUpCount < self.critUpMaxCount) {
                        self.loadBlueCrit();
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
