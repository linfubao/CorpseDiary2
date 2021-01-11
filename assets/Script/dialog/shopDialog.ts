import GameMag from "../manage/GameMag";
import AudioMag from "../manage/AudioMag";
import ConfigMag from "../manage/ConfigMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopDialog extends cc.Component {

    @property(cc.Node)
    tabActiveBox: cc.Node = null;
    @property(cc.Node)
    pageBox: cc.Node = null;
    @property(cc.Node)
    backBtn: cc.Node = null;
    @property(cc.Node)
    buyBtn: cc.Node = null;

    lastIndex: number = null;
    nowIndex: number = null;

    onInit(index) {
        this.initUI(index);
        cc.director.on("shopCoinPage", this.onBuyBtn, this);
        this.backBtn.on(cc.Node.EventType.TOUCH_END, this.onBackBtn, this);
        this.buyBtn.on(cc.Node.EventType.TOUCH_END, this.onBuyBtn, this);
    }
    initUI(index) {
        this.node.zIndex = 1000;
        this.nowIndex = index || 0;
        this.tabActiveBox.children[this.nowIndex].active = true;
        this.pageBox.children[this.nowIndex].active = true;
        this.lastIndex = this.nowIndex;
    }
    onBuyBtn() {
        AudioMag.getInstance().playSound("按钮音");
        this.updatePage(4);
    }
    onBackBtn() {
        AudioMag.getInstance().playSound("按钮音");
        cc.tween(this.backBtn)
            .to(0.3, { opacity: 0 })
            .call(() => {
                this.backBtn.opacity = 255;
                DialogMag.Ins.removePlane(DialogPath.ShopDialog);
            })
            .start();
    }
    updatePage(index) {
        AudioMag.getInstance().playSound("按钮音");
        if (this.nowIndex == index) return;
        this.nowIndex = index;
        // console.log(this.nowIndex,this.lastIndex);
        this.pageBox.children[this.nowIndex].active = true;
        this.pageBox.children[this.lastIndex].active = false;
        this.tabActiveBox.children[this.nowIndex].active = true;
        this.tabActiveBox.children[this.lastIndex].active = false;
        this.lastIndex = this.nowIndex;
    }
    skinBtn(e, index) {
        this.updatePage(Number(index));
    }
    gunBtn(e, index) {
        this.updatePage(Number(index));
    }
    assistBtn(e, index) {
        this.updatePage(Number(index));
    }
    mechaBtn(e, index) {
        this.updatePage(Number(index));
    }
    coinBtn(e, index) {
        this.updatePage(Number(index));
    }
    onDisable() {
        GameMag.Ins.scrollToSkin = null;
        GameMag.Ins.scrollToGun = null;
        GameMag.Ins.scrollToAssist = null;
        GameMag.Ins.scrollToMecha = null;
    }
}
