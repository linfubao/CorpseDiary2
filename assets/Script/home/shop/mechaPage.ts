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
    @property(cc.SpriteAtlas)
    shopAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    costBox: cc.Node = null;
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
    mechaCigData: any[] = [];
    len: number = 0;
    index: number = 0;
    clickFlag: number = null;//当前点击的是哪个武器,代表gunID
    showMechaIndex: number = null;
    shellsPool: cc.NodePool = null;

    skillConfig: number[] = [];
    bloodCount: number = 0;
    powerCount: number = 0;
    speedCount: number = 0;
    bloodMaxCount: number = 0;
    powerMaxCount: number = 0;
    speedMaxCount: number = 0;

    onLoad() {
        this.shellsPool = new cc.NodePool();
        for (let i = 0; i < 4; i++) {
            let node = cc.instantiate(this.bulletShellsPre);
            this.shellsPool.put(node);
        }
    }
    onEnable() {
        this.mechaContent.getComponent("UIScrollSelect").init("mecha");
        this.skillConfig = GameMag.Ins.skillConfig;
        this.mechaCigData = ConfigMag.Ins.getMechaData();
        this.len = this.mechaCigData.length;
        if (this.index < this.len) {
            this.loadItem();
        } else {
            this.freshMechaPageUI(this.mechaCigData[this.clickFlag]);
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
            let sf = self.shopAtlas.getSpriteFrame("mechaIcon_" + self.index);
            let data = GameMag.Ins.mechaData;
            node.getComponent("mechaItem").init(data[self.index], self.index, sf);
            node.parent = self.mechaBox;
            self.index++;
            if (self.index < self.len) {
                self.loadItem();
            } else {
                let flag = false;
                let flag2 = false;
                const useringMecha = GameMag.Ins.useingData.mecha;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].getNum > 0) {
                        flag = true;
                        break;
                    }
                }
                for (let i = 0; i < data.length; i++) {
                    if (useringMecha == data[i]) {
                        flag2 = true;
                    }
                }
                if (!flag || !flag2) {
                    cc.director.emit("freshMechaItemActive", 0);
                }
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
        let data = this.mechaCigData[this.clickFlag];
        let currency = GameMag.Ins.currency;
        if (data.buyType === 0 && (currency.coin < data.costNum)) {
            cc.director.emit("shopCoinPage");
            return;
        }
        if (data.buyType === 1 && (currency.diamond < data.costNum)) {
            cc.director.emit("shopCoinPage");
            return;
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
    //解除装备
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
        this.mechaName.spriteFrame = this.shopAtlas.getSpriteFrame("mechaName_" + data.mechaID);
        this.mechaDesc.spriteFrame = this.shopAtlas.getSpriteFrame("mechaDesc_" + data.mechaID);
        this.freshMechaBone(data);
        this.freshBtns();
        this.freshCostBox(data);
        this.loadSkillBlock();
    }
    /**
     * 显示机甲龙骨
     */
    count: number = 0;
    freshMechaBone(data) {
        this.unschedule(this.armorMechaSche);
        this.unschedule(this.armorMechaSche1);
        this.unschedule(this.robotMechaSche);
        this.mecha = this.mechaContent.children[this.clickFlag];
        this.switchMechaAction(this.mecha, mechaAnimate.Stay, 0);
        if (this.clickFlag == 0 || this.clickFlag == 1 || this.clickFlag == 4) {
            this.count = 0;
            this.schedule(this.armorMechaSche, 3);
        } else if (this.clickFlag == 2 || this.clickFlag == 3 || this.clickFlag == 5) {
            this.schedule(this.robotMechaSche, 4);
        } else {
            this.count = 0;
            this.schedule(this.armorMechaSche, 3);
        }

        // const mechaID = data.mechaID;
        // ToolsMag.Ins.getHomeResource("prefab/mecha/mecha" + mechaID, function (prefab: cc.Prefab) {
        //     let node = cc.instantiate(prefab);
        //     node.parent = self.mechaParent;
        //     self.mecha = node;
        //     node.y = -140;
        //     node.scale = 1.4;
        //     self.switchMechaAction(node, mechaAnimate.Stay, 0);
        //     self.count = 0;
        //     self.schedule(self.timer1, 3);
        // });
    }
    robotMechaSche() {
        let self = this;
        this.switchMechaAction(this.mecha, mechaAnimate.Fire, 1, function () {
            self.switchMechaAction(self.mecha, mechaAnimate.Stay, 0);
        });
    }
    armorMechaSche() {
        this.schedule(this.armorMechaSche1, 0.2, 3);
    }
    armorMechaSche1() {
        this.count++;
        this.switchMechaAction(this.mecha, mechaAnimate.Fire, 1);
        this.showFireShells();
        if (this.count == 4) {
            this.count = 0;
            this.switchMechaAction(this.mecha, mechaAnimate.Stay, 0);
        }
    }
    /**
     * 显示蛋壳
     */
    showFireShells() {
        let shellsNode = null;
        if (this.shellsPool.size() > 0) {
            shellsNode = this.shellsPool.get();
        } else {
            shellsNode = cc.instantiate(this.bulletShellsPre);
        }
        if (this.clickFlag === 0) {
            AudioMag.getInstance().playSound("机甲");
            shellsNode.children[0].active = true;
        } else {
            AudioMag.getInstance().playSound("RPG");
            shellsNode.children[2].active = true;
        }
        shellsNode.setPosition(this.mecha.getChildByName("shellsPos").position);
        shellsNode.getComponent(cc.RigidBody).linearVelocity = cc.v2(-400, 350);
        shellsNode.parent = this.mecha;
        let a = Math.random() > 0.5 ? 1 : -1;
        let agnle = 150 + Math.random() * 50;
        shellsNode.scale = 0.8;
        shellsNode.angle = agnle;
        shellsNode.stopAllActions();
        cc.tween(shellsNode)
            .by(0.3, { angle: agnle * a })
            .repeat(3)
            .delay(1.5)
            .call(() => {
                this.shellsPool.put(shellsNode);
            })
            .start();
    }
    //切换机甲龙骨
    switchMechaAction(mecha, action, times, cb = null) {
        // console.log(this.clickFlag);
        let body = mecha.getChildByName("body");
        if (this.clickFlag == 2 || this.clickFlag == 3 || this.clickFlag == 5) {
            let part1 = body.getChildByName("part1");
            let part2 = body.getChildByName("part2");
            let part3 = body.getChildByName("part3");
            let part4 = body.getChildByName("part4");
            let part5 = body.getChildByName("part5");
            ToolsMag.Ins.playDragonBone(part1, action, times, null);
            ToolsMag.Ins.playDragonBone(part2, action, times, null);
            ToolsMag.Ins.playDragonBone(part3, action, times, null);
            ToolsMag.Ins.playDragonBone(part4, action, times, null);
            ToolsMag.Ins.playDragonBone(part5, action, times, function () {
                cb && cb();
            });
            return;
        }
        let lowNode = null, inNode = null, upNode = null;
        if (this.clickFlag == 0 || this.clickFlag == 1 || this.clickFlag == 4) {
            lowNode = body.getChildByName("low");
            inNode = body.getChildByName("in");//身体
            upNode = body.getChildByName("up");
            ToolsMag.Ins.playDragonBone(inNode, action, times, null);
        } else {
            lowNode = body.getChildByName("low");
            upNode = body.getChildByName("up");
        }
        ToolsMag.Ins.playDragonBone(lowNode, action, times, null);
        ToolsMag.Ins.playDragonBone(upNode, action, times, null);
    }
    //实时更新按钮:购买/装备/解除
    freshBtns() {
        let localData = GameMag.Ins.mechaData[this.clickFlag];
        let useingMecha = GameMag.Ins.useingData.mecha;
        // console.log(localData);
        if (localData.getNum < 1) {
            this.equipBtn.active = false;
            this.unequipBtn.active = false;
        } else {
            if (useingMecha == localData.mechaID) {
                this.equipBtn.active = false;
                this.unequipBtn.active = true;
            } else {
                this.equipBtn.active = true;
                this.unequipBtn.active = false;
            }
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
