import GameMag from "../manage/GameMag";
import AudioMag from "../manage/AudioMag";
import ToolsMag from "../manage/ToolsMag";
import ConfigMag from "../manage/ConfigMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopDialog extends cc.Component {

    @property(cc.Node)
    tabBox: cc.Node = null;
    @property(cc.Node)
    pageBox: cc.Node = null;
    @property(cc.Node)
    backBtn: cc.Node = null;
    @property(cc.Node)
    buyBtn: cc.Node = null;

    initIndex: number = 1; //初始界面下标
    lastIndex: number = null;
    nowIndex: number = null;
    initPs: cc.Vec3[] = [];
    moveDiff: cc.Vec2 = cc.v2(20, 15); //向下移动的距离

    onInit(index) {
        this.initUI(index);
        cc.director.on("shopCoinPage", this.onBuyBtn, this);
        this.backBtn.on(cc.Node.EventType.TOUCH_END, this.onBackBtn, this);
        this.buyBtn.on(cc.Node.EventType.TOUCH_END, this.onBuyBtn, this);
    }
    initUI(index) {
        this.node.zIndex = 1000;
        this.tabBox.children.forEach(item => {
            this.initPs.push(item.position);
        });
        this.nowIndex = index || this.initIndex;
        this.pageBox.children[this.nowIndex].active = true;
        const target = this.tabBox.children[this.nowIndex];
        target.getChildByName("active").active = true;
        cc.tween(target)
            .to(0.3, { position: cc.v3(target.x - this.moveDiff.x, target.y - this.moveDiff.y, 0) })
            .start();
        this.lastIndex = this.nowIndex;
    }
    onBuyBtn() {
        AudioMag.getInstance().playSound("按钮音");
        this.updatePage(4);
    }
    onBackBtn() {
        AudioMag.getInstance().playSound("按钮音");
        ToolsMag.Ins.buttonAction(this.backBtn, function () {
            DialogMag.Ins.removePlane(DialogPath.ShopDialog);
        }.bind(this));
    }
    updatePage(index) {
        AudioMag.getInstance().playSound("按钮音");
        if (this.nowIndex == index) return;
        this.nowIndex = index;
        // console.log(this.nowIndex, this.lastIndex);
        //显示页面
        this.pageBox.children[this.nowIndex].active = true;
        this.pageBox.children[this.lastIndex].active = false;
        //显示相应tab
        const tabBox = this.tabBox.children;
        const target = tabBox[this.nowIndex];
        //先把当前的移动下来
        target.getChildByName("active").active = true;
        cc.tween(target)
            .to(0.3, { position: cc.v3(target.x - this.moveDiff.x, target.y - this.moveDiff.y, 0) })
            .start();
        //同时把上一个移动上去
        const lastTarget = tabBox[this.lastIndex];
        lastTarget.getChildByName("active").active = false;
        const ps = this.initPs[this.lastIndex];
        cc.tween(lastTarget)
            .to(0.3, { position: ps })
            .start();
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
