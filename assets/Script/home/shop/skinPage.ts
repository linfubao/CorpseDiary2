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
    @property({ type: cc.Node, tooltip: "解除装备" })
    unequipBtn: cc.Node = null;
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
    @property(cc.Prefab)
    singlePre: cc.Prefab = null;
    @property(cc.Node)
    armorNode: cc.Node = null;
    @property(cc.Node)
    speedNode: cc.Node = null;
    @property(cc.Node)
    bloodNode: cc.Node = null;
    @property({ type: cc.Prefab, tooltip: "蛋壳预制体" })
    bulletShellsPre: cc.Prefab = null;
    @property({ type: cc.Node, tooltip: "蛋壳父节点" })
    shellsBox: cc.Node = null;

    skinData: any[] = [];
    clickFlag: number = null;//当前点击的是哪个武器,代表gunID
    index: number = 0;
    len: number = 0;
    pool: cc.NodePool = null;
    skillConfig: number[] = [];
    armorCount: number = 0;
    speedCount: number = 0;
    bloodCount: number = 0;

    onEnable() {
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
        this.pool = new cc.NodePool();
        for (let i = 0; i < 35; i++) {
            let node = cc.instantiate(this.singlePre);
            this.pool.put(node);
        }
        cc.director.on("freshSkinPageUI", this.freshSkinPageUI, this);
        this.buyBtn.on(cc.Node.EventType.TOUCH_END, this.onBuy, this);
        this.equipBtn.on(cc.Node.EventType.TOUCH_END, this.onEquip, this);
        this.unequipBtn.on(cc.Node.EventType.TOUCH_END, this.onUnequip, this);
        this.tryBtn.on(cc.Node.EventType.TOUCH_END, this.onTrySkin, this);
    }
    onTrySkin() {
        console.log(this.clickFlag);
        GameMag.Ins.trySkin = this.clickFlag;
        this.freshBtns();
    }
    loadItem() {
        let self = this;
        ToolsMag.Ins.getHomeResource("prefab/shop/skinItem", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            let sp = self.homeAtlas.getSpriteFrame("skin_" + self.index);
            node.getComponent("skinItem").init(self.index, sp);
            node.parent = self.skinBox;
            self.index++;
            if (self.index < self.len) {
                self.loadItem();
            }
        })
    }
    /**
     * @param data 配置信息
     */
    freshSkinPageUI(data) {
        if (this.clickFlag == data.skinID) {
            this.showRole(data);
            return;
        }
        this.clickFlag = data.skinID;
        this.skinName.spriteFrame = this.homeAtlas.getSpriteFrame("sname_" + data.skinID);
        this.skinDesc.spriteFrame = this.homeAtlas.getSpriteFrame("skinDesc_" + data.skinID);
        this.showRole(data);
        this.freshBtns();
        this.loadSkillBlock(data);
        this.freshCostBox(data);
    }
    showRole(data) {
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
        if (!localData.geted) {
            this.buyBtn.active = true;
        } else {
            this.buyBtn.active = false;
            if (useSkin == localData.skinID) {
                this.unequipBtn.active = true;
                this.equipBtn.active = false;
            } else {
                this.unequipBtn.active = false;
                this.equipBtn.active = true;
            }
        }
        if (GameMag.Ins.trySkin === this.clickFlag || this.clickFlag === 0) {
            this.tryBtn.active = false;
        } else {
            this.tryBtn.active = true;
        }
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
    onUnequip() {
        AudioMag.getInstance().playSound("按钮音");
        GameMag.Ins.updateUseingDataBySkin(-1);
        this.freshBtns();
        cc.director.emit("freshSkinItemUI", 0);
    }
    //加载技能显示块
    loadSkillBlock(data) {
        this.armorCount = 0;
        this.speedCount = 0;
        this.bloodCount = 0;
        this.armorNode.destroyAllChildren();
        this.speedNode.destroyAllChildren();
        this.bloodNode.destroyAllChildren();
        this.scheduleOnce(() => {
            this.loadArmor(data);
            this.loadSpeed(data);
            this.loadBlood(data);
        }, 0);
    }
    getSkillNode() {
        let node = null;
        if (this.pool.size() > 0) {
            node = this.pool.get();
        } else {
            node = cc.instantiate(this.singlePre);
        }
        return node;
    }
    loadArmor(data) {
        let armorNum = data.armor;
        let node = this.getSkillNode();
        node.stopAllActions();
        node.getChildByName("bg").color = cc.color(255, 179, 0);
        node.parent = this.armorNode;
        node.scale = 0;
        cc.tween(node)
            .to(this.skillConfig[0], { scale: this.skillConfig[1] })
            .call(() => {
                this.armorCount++;
                if (this.armorCount < armorNum) {
                    this.loadArmor(data);
                }
            })
            .to(this.skillConfig[2], { scale: 1 })
            .start();
    }
    loadSpeed(data) {
        let speedNum = data.speed;
        let node = this.getSkillNode();
        node.stopAllActions();
        node.getChildByName("bg").color = cc.color(50, 223, 17);
        node.parent = this.speedNode;
        node.scale = 0;
        cc.tween(node)
            .to(this.skillConfig[0], { scale: this.skillConfig[1] })
            .call(() => {
                this.speedCount++;
                if (this.speedCount < speedNum) {
                    this.loadSpeed(data);
                }
            })
            .to(this.skillConfig[2], { scale: 1 })
            .start();
    }
    loadBlood(data) {
        let bloodNum = data.blood;
        let node = this.getSkillNode();
        node.stopAllActions();
        node.getChildByName("bg").color = cc.color(0, 134, 240);
        node.parent = this.bloodNode;
        node.scale = 0;
        cc.tween(node)
            .to(this.skillConfig[0], { scale: this.skillConfig[1] })
            .call(() => {
                this.bloodCount++;
                if (this.bloodCount < bloodNum) {
                    this.loadBlood(data);
                }
            })
            .to(this.skillConfig[2], { scale: 1 })
            .start();
    }
    onDisable() {
        GameMag.Ins.shopShowGun = null;
        GameMag.Ins.shopShowSkin = null;
        this.armorCount = 0;
        this.speedCount = 0;
        this.bloodCount = 0;
        this.armorNode.destroyAllChildren();
        this.speedNode.destroyAllChildren();
        this.bloodNode.destroyAllChildren();
        this.loadArmor(this.skinData[this.clickFlag]);
        this.loadSpeed(this.skinData[this.clickFlag]);
        this.loadBlood(this.skinData[this.clickFlag]);
    }
}
