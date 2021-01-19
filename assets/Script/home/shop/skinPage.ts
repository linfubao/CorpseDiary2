import ConfigMag from "../../manage/ConfigMag";
import GameMag from "../../manage/GameMag";
import AudioMag from "../../manage/AudioMag";
import ToolsMag from "../../manage/ToolsMag";
import DialogMag, { DialogPath, DialogScript } from "../../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkinPage extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    skinBox: cc.Node = null;
    @property(dragonBones.ArmatureDisplay)
    footDragon: dragonBones.ArmatureDisplay = null;
    @property(dragonBones.ArmatureDisplay)
    bodyDragon: dragonBones.ArmatureDisplay = null;
    @property({ type: cc.Node, tooltip: "购买皮肤" })
    buyBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "装备" })
    equipBtn: cc.Node = null;
    // @property({ type: cc.Node, tooltip: "解除装备" })
    // unequipBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "试用" })
    tryBtn: cc.Node = null;
    @property(cc.Node)
    costBox: cc.Node = null;
    @property(cc.Label)
    coinLab: cc.Label = null;
    @property(cc.Label)
    diamondLab: cc.Label = null;
    @property(cc.Sprite)
    skinName: cc.Sprite = null;
    @property(cc.Sprite)
    skinDesc: cc.Sprite = null;
    @property(cc.Node)
    bloodNode: cc.Node = null;
    @property(cc.Node)
    speedNode: cc.Node = null;
    @property(cc.Node)
    armorNode: cc.Node = null;
    @property({ type: cc.Prefab, tooltip: "蛋壳预制体" })
    bulletShellsPre: cc.Prefab = null;
    @property({ type: cc.Node, tooltip: "蛋壳父节点" })
    shellsBox: cc.Node = null;
    @property({ type: cc.Label, tooltip: "药水数量" })
    optionLab: cc.Label = null;
    @property({ type: cc.Node, tooltip: "打开升级界面的按钮" })
    upgradeBtn: cc.Node = null; //属性全升级满了就隐藏
    @property({ type: cc.Node, tooltip: "升级界面" })
    upgradeModal: cc.Node = null;
    @property(cc.Node)
    roleContent: cc.Node = null;

    skinData: any[] = [];
    clickFlag: number = null;//当前点击的是哪个皮肤,代表skinID
    index: number = 0;
    len: number = 0;
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

    onEnable() {
        this.roleContent.getComponent("UIScrollSelect").init();
        this.skillConfig = GameMag.Ins.skillConfig;
        this.skinData = ConfigMag.Ins.getSkinData();
        this.len = this.skinData.length;
        if (this.index < this.len) {
            this.loadItem();
        } else {
            const useSkin = GameMag.Ins.useingData.skin;
            const data = ConfigMag.Ins.getSkinData()[useSkin];
            this.freshSkinPageUI(data);
        }
        this.freshOption();
        this.gameEvent();
    }
    loadItem() {
        let self = this;
        ToolsMag.Ins.getHomeResource("prefab/shop/skinItem", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            let sp = self.homeAtlas.getSpriteFrame("skinIcon_" + self.index);
            node.getComponent("skinItem").init(self.index, sp);
            node.parent = self.skinBox;
            self.index++;
            if (self.index < self.len) {
                self.loadItem();
            }
        })
    }
    gameEvent() {
        cc.director.on("freshSkinPageUI", this.freshSkinPageUI, this);
        cc.director.on("freshOption", this.freshOption, this);
        this.buyBtn.on(cc.Node.EventType.TOUCH_END, this.onBuy, this);
        this.equipBtn.on(cc.Node.EventType.TOUCH_END, this.onEquip, this);
        // this.unequipBtn.on(cc.Node.EventType.TOUCH_END, this.onUnequip, this);
        this.tryBtn.on(cc.Node.EventType.TOUCH_END, this.onTrySkin, this);
        this.upgradeBtn.on(cc.Node.EventType.TOUCH_END, this.showUpgradeModal, this);
    }
    showUpgradeModal() {
        const modal = this.upgradeModal;
        modal.active = true;
        modal.getComponent("upgradeModal").init(this.clickFlag);
        modal.parent = this.node;
    }
    onTrySkin() {
        console.log(this.clickFlag);
        GameMag.Ins.trySkin = this.clickFlag;
        this.freshBtns();
    }
    /**
     * @param data 配置信息
     */
    freshSkinPageUI(data) {
        // console.log(this.clickFlag, data.skinID);
        // if (this.clickFlag == data.skinID) {
        //     this.showRole(data);
        //     return;
        // }
        this.clickFlag = data.skinID;
        this.skinName.spriteFrame = this.homeAtlas.getSpriteFrame("sname_" + data.skinID);
        this.skinDesc.spriteFrame = this.homeAtlas.getSpriteFrame("skinDesc_" + data.skinID);
        this.showRole(data);
        this.freshBtns();
        this.loadSkillBlock(data);
        this.freshCostBox(data);
    }
    freshOption() {
        const currency = GameMag.Ins.currency;
        this.optionLab.string = String(currency.option);
    }
    scrollSkin(data) {
        // console.log(data);
        cc.director.emit("freshSkinItemActive", data.index);
    }
    showRole(data) {
        return;
        let gun = 0;
        GameMag.Ins.shopShowSkin = data.skinID;
        switch (data.skinID) {
            case 0:
                gun = 4;
                break;
            case 1:
                gun = 18;
                break;
            case 2:
                gun = 9;
                break;
            case 3:
                gun = 11;
                break;
            case 4:
                gun = 2;
                break;
            default:
                break;
        }
        GameMag.Ins.shopShowGun = gun;
        this.shellsBox.removeAllChildren();
        this.freshRole(0, 0);
        this.unschedule(this.fire1);
        this.unschedule(this.fire2_cb);
        this.unschedule(this.fire2);
        if (gun <= 2 || gun == 18) {
            this.schedule(this.fire1, 2.5);
        } else {
            this.schedule(this.fire2, 3);
        }
    }
    //棍棒类
    fire1() {
        GameMag.Ins.playGunSound();
        this.freshRole(1, 1);
        this.scheduleOnce(() => {
            this.freshRole(0, 0);
        }, 0.5);
    }
    //枪类
    fire2_cb() {
        GameMag.Ins.playGunSound();
        this.freshRole(1, 1);
        this.showFireShells();
        this.scheduleOnce(() => {
            this.freshRole(0, 0);
        }, 0.7);
    }
    //拿枪的
    fire2() {
        this.unschedule(this.fire2_cb);
        this.schedule(this.fire2_cb, 0.8, 1);
    }
    /**
     * 切换龙骨
     * @param actionFlag number stay:0  fire:1  walk:2  walkFire:3  die:4
     */
    freshRole(actionFlag, times: number, cb: Function = null) {
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
        this.freshRoleDragon(action, times);
    }
    freshRoleDragon(action, times, cb: Function = null) {
        let self = this;
        GameMag.Ins.changeSkin(this.bodyDragon, function () {
            ToolsMag.Ins.playDragonBone(self.bodyDragon.node, action, times, function () {
                cb && cb();
            });
        });
        GameMag.Ins.changeFoot(this.footDragon);
        ToolsMag.Ins.playDragonBone(this.footDragon.node, "stay", 0, function () { }.bind(this));
    }
    showFireShells() {
        let shellsNode = cc.instantiate(this.bulletShellsPre);
        shellsNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(-400, 350);
        shellsNode.parent = this.shellsBox;
        const shopShowGun = GameMag.Ins.shopShowGun;
        if (shopShowGun == 11) {
            shellsNode.children[1].active = true;
        } else {
            shellsNode.children[0].active = true;
        }
        let a = Math.random() > 0.5 ? 1 : -1;
        let agnle = 150 + Math.random() * 50;
        shellsNode.angle = agnle;
        shellsNode.scale = 0.7;
        cc.tween(shellsNode)
            .by(0.3, { angle: agnle * a })
            .repeat(3)
            .delay(1.5)
            .call(() => {
                shellsNode.destroy();
            })
            .start();
    }
    freshCostBox(data) {
        let info = GameMag.Ins.searchSkinData(GameMag.Ins.skinData, data.skinID);
        if (info) {
            if (info.geted) {
                this.costBox.active = false;
                return;
            } else {
                this.costBox.active = true;
            }
        }
        switch (data.buyType) {
            case 0:
                this.costBox.children[0].active = true;
                this.coinLab.string = String(data.costNum);
                this.costBox.children[1].active = false;
                break;
            case 1:
                this.costBox.children[1].active = true;
                this.diamondLab.string = String(data.costNum);
                this.costBox.children[0].active = false;
                break;
            default:
                break;
        }
    }
    //实时更新按钮:购买/装备/解除/免费试用
    freshBtns() {
        const localData = GameMag.Ins.skinData[this.clickFlag];
        const useSkin = GameMag.Ins.useingData.skin;
        // console.log(localData);
        if (!localData.geted) {
            this.buyBtn.active = true;
            this.upgradeBtn.active = false;
            this.equipBtn.active = false;
        } else {
            this.buyBtn.active = false;
            this.upgradeBtn.active = true;
            if (useSkin == localData.skinID) {
                this.equipBtn.active = false;
            } else {
                this.equipBtn.active = true;
            }
            const cigData = ConfigMag.Ins.getSkinData()[this.clickFlag];
            const upMax = cigData.upMax;
            let isMax = true;
            if (localData.bloodLv < upMax || localData.speedLv < upMax || localData.armorLv < upMax) {
                isMax = false;
            }
            this.upgradeBtn.active = !isMax;
        }
        // if (GameMag.Ins.trySkin === this.clickFlag || this.clickFlag === 0) {
        //     this.tryBtn.active = false;
        // } else {
        //     this.tryBtn.active = true;
        // }
    }
    //购买皮肤
    onBuy() {
        AudioMag.getInstance().playSound("按钮音");
        let currency = GameMag.Ins.currency;
        let data = ConfigMag.Ins.getSkinData()[this.clickFlag];
        // console.log(data);
        if (data.buyType == 0) {
            if (currency.coin < data.costNum) {
                // DialogMag.Ins.show(DialogPath.MessageDialog, DialogScript.MessageDialog, ["金币不足"]);
                cc.director.emit("shopCoinPage");
                return; //钱不够买
            }
        } else {
            if (currency.diamond < data.costNum) {
                // DialogMag.Ins.show(DialogPath.MessageDialog, DialogScript.MessageDialog, ["钻石不足"]);
                cc.director.emit("shopCoinPage");
                return; //钱不够买
            }
        }
        GameMag.Ins.updateSkinData(this.clickFlag);
        GameMag.Ins.updateCurrency(data.buyType, -data.costNum);
        GameMag.Ins.updateUseingDataBySkin(this.clickFlag);
        cc.director.emit("freshSkinItemUI", this.clickFlag);
        cc.director.emit("updateCurrency");
        this.freshBtns();
        this.freshCostBox(data);
    }
    //装备
    onEquip() {
        AudioMag.getInstance().playSound("按钮音");
        GameMag.Ins.updateUseingDataBySkin(this.clickFlag);
        this.freshBtns();
        cc.director.emit("freshSkinItemUI", this.clickFlag);
    }
    //解除装备
    // onUnequip() {
    //     AudioMag.getInstance().playSound("按钮音");
    //     GameMag.Ins.updateUseingDataBySkin(-1);
    //     this.freshBtns();
    //     cc.director.emit("freshSkinItemUI", 0);
    // }
    //加载技能显示块
    loadSkillBlock(data) {
        const info = GameMag.Ins.skinData[this.clickFlag];
        // console.log(data);
        this.bloodCount = 0;
        this.speedCount = 0;
        this.armorCount = 0;
        this.bloodUpCount = 0;
        this.speedUpCount = 0;
        this.armorUpCount = 0;
        this.bloodMaxCount = info.blood * 2;
        this.speedMaxCount = info.speed * 2;
        this.armorMaxCount = info.armor * 2;
        this.bloodUpMaxCount = data.bloodUp * 2;
        this.speedUpMaxCount = data.speedUp * 2;
        this.armorUpMaxCount = data.armorUp * 2;
        this.putBlock(this.bloodNode);
        this.putBlock(this.speedNode);
        this.putBlock(this.armorNode);
        this.unschedule(this.showSkillBlock);
        this.scheduleOnce(this.showSkillBlock, 0.3);
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
    onDisable() {
        GameMag.Ins.shopShowGun = null;
        GameMag.Ins.shopShowSkin = null;
        this.putBlock(this.bloodNode);
        this.putBlock(this.speedNode);
        this.putBlock(this.armorNode);
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
