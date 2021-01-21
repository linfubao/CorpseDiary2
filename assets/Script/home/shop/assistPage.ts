import ConfigMag from "../../manage/ConfigMag";
import GameMag from "../../manage/GameMag";
import ToolsMag from "../../manage/ToolsMag";
import AudioMag from "../../manage/AudioMag";
import DialogMag, { DialogPath, DialogScript } from "../../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AssistPage extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    shopAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    assistBox: cc.Node = null;
    @property(cc.Node)
    equipBox: cc.Node = null;
    @property(cc.Sprite)
    assistName: cc.Sprite = null;
    @property(cc.Sprite)
    assistDesc: cc.Sprite = null;
    @property({ type: cc.Node, tooltip: "购买辅助道具" })
    buyAssistBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "装备" })
    equipBtn: cc.Node = null;
    @property({ type: cc.Node, tooltip: "解除装备" })
    unequipBtn: cc.Node = null;
    @property(cc.Label)
    getNumLab: cc.Label = null;

    index: number = 0;
    equipIndex: number = 0;
    len: number = 0;
    equipLen: number = 0;
    assistData: any[] = [];
    equipData: any[] = [];
    clickFlag: number = 0;//当前点击的是哪个服务道具,代表assistID

    onLoad() {
        this.equipBtn.active = false;
        this.unequipBtn.active = false;
        this.assistData = ConfigMag.Ins.getAssistData();
        this.len = this.assistData.length;
        this.equipData = GameMag.Ins.useingData.assistEquip;
        this.equipLen = this.equipData.length;
        if (this.index < this.len) {
            this.loadItem();
        }
        this.loadEquipItem();
        cc.director.on("freshAssistPageUI", this.freshAssistPageUI, this);
        cc.director.on("freshAssistEquipBtns", this.freshEquipBtns, this);
        this.buyAssistBtn.on(cc.Node.EventType.TOUCH_END, this.onBuyAssistBtn, this);
        this.equipBtn.on(cc.Node.EventType.TOUCH_END, this.onEquipBtn, this);
        this.unequipBtn.on(cc.Node.EventType.TOUCH_END, this.onUnequipBtn, this);
    }
    loadItem() {
        let self = this;
        ToolsMag.Ins.getHomeResource("prefab/shop/assistItem", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            let sf = self.shopAtlas.getSpriteFrame("assistIcon_" + self.index);
            node.getComponent("assistItem").init(self.index, sf, self.assistData[self.index]);
            node.parent = self.assistBox;
            self.index++;
            if (self.index < self.len) {
                self.loadItem();
            }
        })
    }
    //动态加载装备中的武器列表
    loadEquipItem() {
        let self = this;
        ToolsMag.Ins.getHomeResource("prefab/shop/assistEquip", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            let assistID = self.equipData[self.equipIndex];
            node.getComponent("assistEquip").init(assistID, self.equipIndex);
            node.parent = self.equipBox;
            self.equipIndex++;
            if (self.equipIndex < self.equipLen) {
                self.loadEquipItem();
            }
        })
    }
    freshAssistPageUI(data) {
        let assistID = data.assistID
        this.clickFlag = assistID;
        let localData = GameMag.Ins.assistData[assistID];
        this.getNumLab.string = String(localData.getNum);
        // console.log(data, localData);
        this.assistName.spriteFrame = this.shopAtlas.getSpriteFrame("assistName_" + assistID);
        this.assistDesc.spriteFrame = this.shopAtlas.getSpriteFrame("assistDesc_" + assistID);
        this.freshEquipBtns();
    }
    /**
     * 查找是否已经在装备列表上了,true:在
     */
    searchEquipData(): boolean {
        let flag = false;
        let data = GameMag.Ins.useingData.assistEquip;
        for (let i = 0; i < data.length; i++) {
            if (data[i] == this.clickFlag) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    /**
    * 判断装备列表满了没有, false:没满  true:满了
    */
    checkEquipFull(): boolean {
        let equipData = GameMag.Ins.useingData.assistEquip;
        let status = true;
        for (let i = 0; i < equipData.length; i++) {
            if (equipData[i] < 0) {
                status = false;
                break;
            }
        }
        return status;
    }
    //更新购买/装备/解除装备的按钮
    freshEquipBtns() {
        let localData = GameMag.Ins.assistData[this.clickFlag];
        if (localData.getNum == 0) {
            this.unequipBtn.active = false;
            this.equipBtn.active = false;
        } else {
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
        }
    }
    //购买道具
    onBuyAssistBtn() {
        console.log("购买道具");
        AudioMag.getInstance().playSound("按钮音");
        let data = this.assistData[this.clickFlag];
        let currency = GameMag.Ins.currency;
        if (data.buyType === 0 && (currency.coin < data.costNum)) {
            cc.director.emit("shopCoinPage");
            return;
        }
        if (data.buyType === 1 && (currency.diamond < data.costNum)) {
            cc.director.emit("shopCoinPage");
            return;
        }
        GameMag.Ins.updateAssistData(this.clickFlag, 1);
        GameMag.Ins.updateCurrency(data.buyType, -data.costNum);
        let localData = GameMag.Ins.assistData[this.clickFlag];
        this.getNumLab.string = String(localData.getNum);
        cc.director.emit("updateCurrency");
        this.onEquipBtn();
        this.freshEquipBtns();
    }
    //装备
    onEquipBtn() {
        console.log("装备");
        AudioMag.getInstance().playSound("按钮音");
        let equipData = GameMag.Ins.useingData.assistEquip;
        let equipIndex = equipData.indexOf(-2);
        let isEquip = equipData.indexOf(this.clickFlag);
        if (isEquip >= 0) {//在装备列表上,只更新文字
            cc.director.emit("upAssistEquip" + isEquip, this.clickFlag, false);
        } else {
            cc.director.emit("showAssistGetedIcon" + this.clickFlag);
            if (equipIndex >= 0) { //有空位
                GameMag.Ins.updateUseingDataByAssistEquip(this.clickFlag, equipIndex);
                cc.director.emit("upAssistEquip" + equipIndex, this.clickFlag, true);
            } else {
                // console.log("已经没空位了");
            }
        }
        this.freshEquipBtns();
    }
    onUnequipBtn() {
        console.log("解除装备");
        AudioMag.getInstance().playSound("按钮音");
        let equipData = GameMag.Ins.useingData.assistEquip;
        let isEquip = equipData.indexOf(this.clickFlag);
        if (isEquip >= 0) {//已经在装备列表上
            cc.director.emit("downAssistEquip" + isEquip);
            GameMag.Ins.updateUseingDataByAssistEquip(-2, isEquip);
            this.freshEquipBtns();
        }
    }
}
