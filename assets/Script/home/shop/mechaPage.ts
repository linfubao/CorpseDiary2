import ConfigMag, { mechaAnimate } from "../../manage/ConfigMag";
import GameMag from "../../manage/GameMag";
import ToolsMag from "../../manage/ToolsMag";
import AudioMag from "../../manage/AudioMag";
import DialogMag, { DialogPath, DialogScript } from "../../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MechaPage extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    costBox: cc.Node = null;
    @property(cc.Node)
    mechaParent: cc.Node = null;
    @property(cc.Node)
    mechaBox: cc.Node = null;
    @property(cc.Sprite)
    mechaName: cc.Sprite = null;
    @property(cc.Sprite)
    mechaDesc: cc.Sprite = null;
    @property({ type: cc.Node, tooltip: "购买机甲" })
    buyGunBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "装备" })
    equipBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "解除装备" })
    unequipBtn: cc.Node = null;
    @property(cc.Node)
    bloodNode: cc.Node = null;
    @property(cc.Node)
    powerNode: cc.Node = null;
    @property(cc.Node)
    speedNode: cc.Node = null;
    @property(cc.Node)
    mechaContent: cc.Node = null;

    @property(cc.Label)
    coinLab: cc.Label = null;
    @property(cc.Label)
    diamondLab: cc.Label = null;
    @property(cc.Prefab)
    bulletShellsPre: cc.Prefab = null;

    mecha: cc.Node = null;
    mechaData: any[] = [];
    len: number = 0;
    index: number = 0;
    clickFlag: number = null;//当前点击的是哪个武器,代表gunID

    skillConfig: number[] = [];
    bloodCount: number = 0;
    powerCount: number = 0;
    speedCount: number = 0;
    bloodMaxCount: number = 0;
    powerMaxCount: number = 0;
    speedMaxCount: number = 0;

    onEnable() {
        this.mechaContent.getComponent("UIScrollSelect").init();
        this.skillConfig = GameMag.Ins.skillConfig;
        this.mechaData = ConfigMag.Ins.getMechaData();
        this.len = this.mechaData.length;
        if (this.index < this.len) {
            this.loadItem();
        } else {
            const useMecha = GameMag.Ins.useingData.mecha;
            const data = ConfigMag.Ins.getMechaData()[useMecha];
            this.freshMechaPageUI(data);
        }
        cc.director.on("freshMechaPageUI", this.freshMechaPageUI, this);
        this.buyGunBtn.on(cc.Node.EventType.TOUCH_END, this.onBuyGunBtn, this);
        this.equipBtn.on(cc.Node.EventType.TOUCH_END, this.onEquipBtn, this);
        this.unequipBtn.on(cc.Node.EventType.TOUCH_END, this.onUnequipBtn, this);
    }
    loadItem() {
        let self = this;
        ToolsMag.Ins.getHomeResource("prefab/shop/mechaItem", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            let sf = self.homeAtlas.getSpriteFrame("mecha_" + self.index);
            let data = GameMag.Ins.mechaData;
            node.getComponent("mechaItem").init(data[self.index], self.index, sf);
            node.parent = self.mechaBox;
            self.index++;
            if (self.index < self.len) {
                self.loadItem();
            }
        })
    }
    scrollMecha(data) {
        // console.log(data);
        cc.director.emit("freshMechaItemActive", data.index);
    }
    //购买机甲
    onBuyGunBtn() {
        AudioMag.getInstance().playSound("按钮音");
        let data = this.mechaData[this.clickFlag];
        let currency = GameMag.Ins.currency;
        if (data.buyType == 0) {
            if (currency.coin < data.costNum) {
                // DialogMag.Ins.show(DialogPath.MessageDialog,DialogScript.MessageDialog,["金币不足"]);
                cc.director.emit("shopCoinPage");
                return; //钱不够买
            }
        } else {
            if (currency.diamond < data.costNum) {
                // DialogMag.Ins.show(DialogPath.MessageDialog,DialogScript.MessageDialog,["钻石不足"]);
                cc.director.emit("shopCoinPage");
                return; //钱不够买
            }
        }
        GameMag.Ins.updateCurrency(data.buyType, -data.costNum);
        GameMag.Ins.updateMechaData(this.clickFlag, 1);
        cc.director.emit("updateCurrency");
        cc.director.emit("freshMechaItemUI", this.clickFlag);
        this.freshBtns();
    }
    //装备
    onEquipBtn() {
        AudioMag.getInstance().playSound("按钮音");
        cc.director.emit("freshMechaItemUI", this.clickFlag);
        this.equipBtn.active = false;
        this.unequipBtn.active = true;
    }
    onUnequipBtn() {
        AudioMag.getInstance().playSound("按钮音");
        cc.director.emit("freshEquipIcon");
        this.equipBtn.active = true;
        this.unequipBtn.active = false;
        GameMag.Ins.updateUseingDataByMecha(this.clickFlag, -1);
    }
    /**
     * @param data 配置信息
     */
    freshMechaPageUI(data) {
        // if (this.clickFlag == data.mechaID) return;
        this.clickFlag = data.mechaID;
        this.mechaName.spriteFrame = this.homeAtlas.getSpriteFrame("mname_" + data.mechaID);
        this.mechaDesc.spriteFrame = this.homeAtlas.getSpriteFrame("mechaDesc_" + data.mechaID);
        // this.freshMechaBone(data);
        this.freshBtns();
        this.freshCostBox(data);
        this.loadSkillBlock();
    }
    /**
     * 显示机甲龙骨
     */
    count: number = 0;
    freshMechaBone(data) {
        let self = this;
        this.unschedule(this.timer1);
        this.mechaParent.removeAllChildren();
        const mechaID = data.mechaID;
        ToolsMag.Ins.getHomeResource("prefab/mecha/mecha" + mechaID, function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            node.parent = self.mechaParent;
            self.mecha = node;
            node.y = -140;
            node.scale = 1.4;
            self.switchMechaAction(node, mechaAnimate.Stay, 0);
            self.count = 0;
            self.schedule(self.timer1, 3);
        });
    }
    timer1() {
        this.schedule(this.timer2, 0.2, 3);
    }
    timer2() {
        this.count++;
        this.switchMechaAction(this.mecha, mechaAnimate.Fire, 1);
        this.showFireShells(this.mecha);
        if (this.count == 4) {
            this.count = 0;
            this.switchMechaAction(this.mecha, mechaAnimate.Stay, 0);
        }
    }
    /**
     * 显示蛋壳
     */
    showFireShells(parentNode) {
        let shellsNode = cc.instantiate(this.bulletShellsPre);
        switch (this.clickFlag) {
            case 0:
                AudioMag.getInstance().playSound("机甲");
                shellsNode.children[0].active = true;
                shellsNode.setPosition(-110, 120);
                break;
            case 1:
                AudioMag.getInstance().playSound("机甲");
                shellsNode.children[0].active = true;
                shellsNode.setPosition(10, 160);
                break;
            case 2:
                AudioMag.getInstance().playSound("RPG");
                shellsNode.children[2].active = true;
                shellsNode.setPosition(-120, 105);
                break;
            default:
                break;
        }
        shellsNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(-400, 350);
        shellsNode.parent = parentNode;
        let a = Math.random() > 0.5 ? 1 : -1;
        let agnle = 150 + Math.random() * 50;
        shellsNode.angle = agnle;
        cc.tween(shellsNode)
            .by(0.3, { angle: agnle * a })
            .repeat(3)
            .delay(1.5)
            .call(() => {
                shellsNode.destroy();
            })
            .start();
    }
    //切换机甲龙骨
    switchMechaAction(mecha, action, times) {
        let body = mecha.getChildByName("body");
        let lowNode = body.getChildByName("low");
        let inNode = body.getChildByName("in");//身体
        let upNode = body.getChildByName("up");
        ToolsMag.Ins.playDragonBone(lowNode, action, times, null);
        ToolsMag.Ins.playDragonBone(inNode, action, times, null);
        ToolsMag.Ins.playDragonBone(upNode, action, times, null);
    }
    //实时更新按钮:购买/装备/解除
    freshBtns() {
        let localData = GameMag.Ins.mechaData[this.clickFlag];
        let useringMecha = GameMag.Ins.useingData.mecha;
        // console.log(data, localData);
        if (useringMecha == localData.mechaID) {
            this.equipBtn.active = false;
            this.unequipBtn.active = true;
        } else {
            this.equipBtn.active = true;
            this.unequipBtn.active = false;
        }
        if (localData.getNum == 0) {
            this.equipBtn.active = false;
            this.unequipBtn.active = false;
        } else {
            this.buyGunBtn.active = true;
        }
    }
    freshCostBox(data) {
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
    //加载技能显示块
    loadSkillBlock() {
        const info = ConfigMag.Ins.getMechaData()[this.clickFlag];
        // console.log(info);
        this.bloodCount = 0;
        this.powerCount = 0;
        this.speedCount = 0;
        this.bloodMaxCount = info.blood * 2;
        this.powerMaxCount = info.power * 2;
        this.speedMaxCount = info.speed * 2;
        this.putBlock(this.bloodNode);
        this.putBlock(this.powerNode);
        this.putBlock(this.speedNode);
        this.unschedule(this.showSkillBlock);
        this.scheduleOnce(this.showSkillBlock, 0.3);
    }
    showSkillBlock() {
        this.loadBlood();
        this.loadPower();
        this.loadSpeed();
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
                    }
                })
                .to(self.skillConfig[2], { scale: 1 })
                .start();
        });
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
                    }
                })
                .to(self.skillConfig[2], { scale: 1 })
                .start();
        })
    }
    onDisable() {
        this.putBlock(this.bloodNode);
        this.putBlock(this.powerNode);
        this.putBlock(this.speedNode);
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
