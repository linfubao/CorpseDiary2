import ConfigMag from "../../manage/ConfigMag";
import GameMag from "../../manage/GameMag";
import ToolsMag from "../../manage/ToolsMag";
import AudioMag from "../../manage/AudioMag";
import DialogMag, { DialogPath, DialogScript } from "../../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GunPage extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    gunBox: cc.Node = null;
    @property(cc.Sprite)
    gunName: cc.Sprite = null;
    @property(cc.Sprite)
    gunDesc: cc.Sprite = null;
    @property({ type: cc.Node, tooltip: "购买子弹栏" })
    downContent: cc.Node = null;
    @property({ type: cc.Label, tooltip: "剩余子弹" })
    bulletNumLab: cc.Label = null;
    @property({ type: cc.Label, tooltip: "买一次子弹增加多少子弹数量" })
    onceNumLab: cc.Label = null;
    @property({ type: cc.Label, tooltip: "买一次子弹花费多少金币" })
    onceCostLab: cc.Label = null;
    @property(cc.Node)
    addBulletBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "解锁" })
    unlockBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "购买武器" })
    buyGunBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "装备" })
    equipBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "解除装备" })
    unequipBtn: cc.Node = null;
    @property(cc.Node)
    equipBox: cc.Node = null;
    @property({ type: cc.Label, tooltip: "解锁条件" })
    lockText: cc.Label = null;
    @property(cc.Node)
    powerNode: cc.Node = null;
    @property(cc.Node)
    speedNode: cc.Node = null;
    @property(cc.Prefab)
    singlePre: cc.Prefab = null;

    index: number = 0;
    equipIndex: number = 0;
    len: number = 0;
    equipLen: number = 0;
    gunData: any[] = [];
    equipData: any[] = [];
    clickFlag: number = 0;//当前点击的是哪个武器,代表gunID
    pool: cc.NodePool = null;
    skillConfig: number[] = [];
    speedCount: number = 0;
    powerCount: number = 0;

    onLoad() {
        this.initUI();
        cc.director.on("freshGunPageUI", this.freshGunPageUI, this);
        cc.director.on("freshEquipBtns", this.freshEquipBtns, this);
        this.addBulletBtn.on(cc.Node.EventType.TOUCH_END, this.onAddBulletBtn, this);
        this.unlockBtn.on(cc.Node.EventType.TOUCH_END, this.onUnlockBtn, this);
        this.buyGunBtn.on(cc.Node.EventType.TOUCH_END, this.onBuyGunBtn, this);
        this.equipBtn.on(cc.Node.EventType.TOUCH_END, this.onEquipBtn, this);
        this.unequipBtn.on(cc.Node.EventType.TOUCH_END, this.onUnequipBtn, this);
    }
    initUI() {
        this.skillConfig = GameMag.Ins.skillConfig;
        this.downContent.active = false;
        this.gunData = ConfigMag.Ins.getGunData();
        this.len = this.gunData.length;
        this.equipData = GameMag.Ins.useingData.gunEquip;
        this.equipLen = this.equipData.length;
        this.loadItem();
        this.loadEquipItem();
        this.pool = new cc.NodePool();
        for (let i = 0; i < 35; i++) {
            let node = cc.instantiate(this.singlePre);
            this.pool.put(node);
        }
    }
    scrollTo() {
        // if (GameMag.Ins.scrollToGun === null) {
        //     return;
        // }
        // let index = 1 - GameMag.Ins.scrollToGun * 0.045;
        // this.scrollView.scrollTo(cc.v2(0, index), 0, true);
        const gun = GameMag.Ins.useingData.gun;
        let index = null;
        if (gun >= 22) {
            index = 0;
        } else {
            index = (1 - gun * 0.04).toFixed(2);
        }
        this.scrollView.scrollTo(cc.v2(0, Number(index)), 0, true);
    }
    //动态加载装备中的武器列表
    loadEquipItem() {
        let self = this;
        ToolsMag.Ins.getHomeResource("prefab/shop/gunEquip", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            let gunID = self.equipData[self.equipIndex];
            let lv = 0;
            let sf = self.homeAtlas.getSpriteFrame(`gunName_${gunID}_${lv}`);
            node.getComponent("gunEquip").init(gunID, self.equipIndex, sf);
            node.parent = self.equipBox;
            self.equipIndex++;
            if (self.equipIndex < self.equipLen) {
                self.loadEquipItem();
            }
        })
    }
    //购买子弹
    onAddBulletBtn() {
        console.log("购买子弹");
        AudioMag.getInstance().playSound("购买子弹");
        let data = this.gunData[this.clickFlag];
        let coin = GameMag.Ins.currency.coin;
        if (coin < data.buyOnceCost) {
            DialogMag.Ins.show(DialogPath.MessageDialog, DialogScript.MessageDialog, ["金币不足"]);
            return;
        };
        GameMag.Ins.updateGunDataByBulletNum(this.clickFlag, data.buyOnceNum);
        GameMag.Ins.updateCurrency(0, -data.buyOnceCost);
        let localData = GameMag.Ins.gunData[this.clickFlag];
        this.bulletNumLab.string = String(`${localData.bulletNum}`);
        cc.director.emit("updateCurrency");
        this.freshGunPageUI(data);
    }
    //解锁
    onUnlockBtn() {
        AudioMag.getInstance().playSound("按钮音");
        let data = this.gunData[this.clickFlag];
        // console.log("解锁", data);
        let unlockLevel = data.unlockLevel;
        let unlockDiamond = data.unlockDiamond;
        let lv = GameMag.Ins.level;
        let diamond = GameMag.Ins.currency.diamond;
        if (lv >= unlockLevel) {
            this.unlockSuccess();
        } else if (diamond >= unlockDiamond) {
            GameMag.Ins.updateCurrency(1, -unlockDiamond);
            cc.director.emit("updateCurrency");
            this.unlockSuccess();
        } else {
            DialogMag.Ins.show(DialogPath.MessageDialog, DialogScript.MessageDialog, ["sorry,未达成解锁条件"]);
        }
    }
    //解锁成功
    unlockSuccess() {
        GameMag.Ins.updateGunDataByLockStatus(this.clickFlag);
        this.gunBox.children[this.clickFlag].getChildByName("lock").active = false;
        this.unlockBtn.active = false;
        this.lockText.node.active = false;
    }
    //购买武器
    onBuyGunBtn() {
        console.log("购买武器");
        AudioMag.getInstance().playSound("按钮音");
        const data = this.gunData[this.clickFlag];
        let costNum = data.costNum;
        let currency = GameMag.Ins.currency;
        if (data.buyType === 0 && (currency.coin < costNum)) {
            // DialogMag.Ins.show(DialogPath.MessageDialog, DialogScript.MessageDialog, ["金币不足"]);
            cc.director.emit("shopCoinPage");
            return;
        }
        if (data.buyType === 1 && (currency.diamond < costNum)) {
            cc.director.emit("shopCoinPage");
            return;
        }
        if (data.buyOnceNum != 0) { //需要买子弹的枪
            GameMag.Ins.updateGunDataByBulletNum(this.clickFlag, 50);
            this.bulletNumLab.string = String(50);
            this.freshGunPageUI(data);
        }
        GameMag.Ins.updateUseingDataByGun(this.clickFlag);
        GameMag.Ins.updateGunDataByGeted(this.clickFlag);
        GameMag.Ins.updateCurrency(data.buyType, -data.costNum);
        cc.director.emit("updateCurrency");
        cc.director.emit("freshGunItemUI");
        this.freshDownContent();
        this.freshEquipBtns();
        this.onEquipBtn();
        // if (data.buyType === 1 && !cc.sys.isBrowser) {
        //     const data = GameMag.Ins.uploadData;
        //     data.diamondGun++;
        //     GameMag.Ins.updateUploadData(data);//更新本地数据
        //     //玩家使用钻石武器的数量
        //     //@ts-ignore
        //     wx.reportUserBehaviorBranchAnalytics({
        //         branchId: 'BCBgAAoXHx5d138Ug9YRx8',
        //         branchDim: `${data.diamondGun}`, // 自定义维度(可选)：类型String，取值[1,100]，必须为整数，当上传类型不符时不统计
        //         eventType: 2 // 1：曝光； 2：点击
        //     })
        // }
    }
    //武器装备
    onEquipBtn() {
        console.log("装备");
        AudioMag.getInstance().playSound("按钮音");
        let equipData = GameMag.Ins.useingData.gunEquip;
        let equipBoxArr = this.equipBox.children;
        for (let i = 0; i < equipData.length; i++) {
            let flag = this.searchEquipData();
            if (equipData[i] < 0 && !flag) {
                let itemShow = equipBoxArr[i].getChildByName("show");
                itemShow.active = true;
                let sf = this.homeAtlas.getSpriteFrame("gun_" + this.clickFlag);
                itemShow.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = sf;
                GameMag.Ins.updateUseingDataByGunEquip(this.clickFlag, i);
            }
        }
        this.freshEquipBtns();
    }
    //武器解除装备
    onUnequipBtn() {
        console.log("解除装备");
        AudioMag.getInstance().playSound("按钮音");
        let equipData = GameMag.Ins.useingData.gunEquip;
        for (let i = 0; i < equipData.length; i++) {
            if (equipData[i] == this.clickFlag) {
                let showNode = this.equipBox.children[i].getChildByName("show");
                let iconNode = showNode.getChildByName("icon");
                cc.tween(iconNode)
                    .to(0.2, { scale: 1.2 })
                    .to(0.2, { scale: 0 })
                    .call((node) => {
                        showNode.active = false;
                        node.scale = 1;
                        GameMag.Ins.updateUseingDataByGunEquip(-1, i);
                        this.freshEquipBtns();
                    })
                    .start();
                break;
            }
        }
    }
    //动态加载武器列表
    loadItem() {
        let self = this;
        ToolsMag.Ins.getHomeResource("prefab/shop/gunItem", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            let sf = self.homeAtlas.getSpriteFrame("gunIcon_" + self.index);
            let lv = 0;
            let gunNameSf = self.homeAtlas.getSpriteFrame(`gunName_${self.index}_${lv}`);
            node.getComponent("gunItem").init(self.index, self.gunData[self.index], sf, gunNameSf);
            node.parent = self.gunBox;
            self.index++;
            if (self.index < self.len) {
                self.loadItem();
            } else {
                self.scheduleOnce(() => {
                    self.scrollTo();
                }, 0);
            }
        })
    }
    freshGunPageUI(data) {
        if (this.clickFlag == data.gunID) return;
        this.clickFlag = data.gunID;
        let localData = GameMag.Ins.gunData[data.gunID];
        // console.log(data, localData);
        this.gunName.spriteFrame = this.homeAtlas.getSpriteFrame("gunName_" + data.gunID);
        this.gunDesc.spriteFrame = this.homeAtlas.getSpriteFrame("gunDesc_" + data.gunDescType);
        let lockStatus = localData.lockStatus;
        // console.log("lockStatus", lockStatus);
        this.buyGunBtn.active = !lockStatus;
        this.unlockBtn.active = !lockStatus;
        if (data.unlockLevel != 0 && !lockStatus) {
            this.lockText.node.active = true;
            this.lockText.string = `第${data.unlockLevel}天解锁或消耗${data.unlockDiamond}钻石解锁`;
        } else {
            this.lockText.node.active = false;
        }
        this.freshDownContent();
        this.freshEquipBtns();
        this.loadSkillBlock(data);
    }
    /**
     * 更新购买子弹栏
     */
    freshDownContent() {
        let data = this.gunData[this.clickFlag];
        let localData = GameMag.Ins.gunData[this.clickFlag];
        let buyOnceCost = data.buyOnceCost;
        let lockStatus = localData.lockStatus;
        let geted = localData.geted;
        if (buyOnceCost == 0 || !lockStatus || !geted) {
            this.downContent.active = false;

        } else {
            this.downContent.active = true;
            this.bulletNumLab.string = String(`${localData.bulletNum}`);
            this.onceNumLab.string = String(`+${data.buyOnceNum}`);
            this.onceCostLab.string = String(`-${data.buyOnceCost}`);
        }
    }
    /**
     * 判断装备列表满了没有, false:没满  true:满了
     */
    checkEquipFull(): boolean {
        let equipData = GameMag.Ins.useingData.gunEquip;
        let status = true;
        for (let i = 0; i < equipData.length; i++) {
            if (equipData[i] < 0) {
                status = false;
                break;
            }
        }
        return status;
    }
    /**
     * 查找是否在装备列表上: false:不在
     */
    searchEquipData(): boolean {
        let flag = false;
        let data = GameMag.Ins.useingData.gunEquip;
        for (let i = 0; i < data.length; i++) {
            if (data[i] == this.clickFlag) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    //更新购买/装备/解除装备的按钮
    freshEquipBtns() {
        let localData = GameMag.Ins.gunData[this.clickFlag];
        // console.log(localData);
        if (localData.geted) {
            this.buyGunBtn.active = false;
            let full = this.checkEquipFull();
            let flag = this.searchEquipData();
            if (flag) {
                this.unequipBtn.active = true;
                this.equipBtn.active = false;
            } else {
                if (full) {
                    this.unequipBtn.active = false;
                    this.equipBtn.active = false;
                } else {
                    this.unequipBtn.active = false;
                    this.equipBtn.active = true;
                }
            }
        } else {
            this.buyGunBtn.active = true;
        }
    }
    //加载技能显示块
    loadSkillBlock(data) {
        this.powerCount = 0;
        this.speedCount = 0;
        this.powerNode.destroyAllChildren();
        this.speedNode.destroyAllChildren();
        this.scheduleOnce(() => {
            this.loadPower(data);
            this.loadSpeed(data);
        }, 0);
    }
    //获取技能小格子
    getSkillNode() {
        let node = null;
        if (this.pool.size() > 0) {
            node = this.pool.get();
        } else {
            node = cc.instantiate(this.singlePre);
        }
        return node;
    }
    loadSpeed(data) {
        let speedNum = data.speed;
        let node = this.getSkillNode();
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
    loadPower(data) {
        let powerNum = data.power;
        let node = this.getSkillNode();
        node.getChildByName("bg").color = cc.color(255, 179, 0);
        node.parent = this.powerNode;
        node.scale = 0;
        cc.tween(node)
            .to(this.skillConfig[0], { scale: this.skillConfig[1] })
            .call(() => {
                this.powerCount++;
                if (this.powerCount < powerNum) {
                    this.loadPower(data);
                }
            })
            .to(this.skillConfig[2], { scale: 1 })
            .start();
    }
    onDisable() {
        this.speedNode.destroyAllChildren();
        this.powerNode.destroyAllChildren();
        this.powerCount = 0;
        this.speedCount = 0;
        this.loadPower(this.gunData[this.clickFlag]);
        this.loadSpeed(this.gunData[this.clickFlag]);
    }
}
