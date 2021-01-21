import GameMag from "../../manage/GameMag";
import ToolsMag from "../../manage/ToolsMag";
import ConfigMag from "../../manage/ConfigMag";
import AudioMag from "../../manage/AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SkinItem extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Node)
    actives: cc.Node = null;
    @property(cc.Node)
    equipIcon: cc.Node = null;

    index: number = 0;
    init(index, sf) {
        this.index = index;
        this.icon.spriteFrame = sf;
        const useSkin = GameMag.Ins.useingData.skin;
        let info = GameMag.Ins.skinData[useSkin];
        // console.log(info);
        if (index == info.skinID && info.geted) {
            this.showScale(this.actives, 0.15, 1.5);
            this.showScale(this.equipIcon, 0.25, 2.5);//当前使用的是哪个皮肤,就显示打钩
            this.showIcon();
        }
        const cigData = ConfigMag.Ins.getSkinData()[useSkin];
        if (useSkin == index) { //当前使用的是哪个皮肤,就首先显示哪个皮肤
            cc.director.emit("freshSkinPageUI", cigData);
        }
        cc.director.on("freshSkinItemUI", this.freshSkinItemUI, this);
        cc.director.on("freshSkinItemActive", this.showItemActive, this);
        this.icon.node.on(cc.Node.EventType.TOUCH_END, this.onStartTouch, this);
    }
    showScale(target, smallTime, bigScale) {
        target.active = true;
        target.scale = bigScale;
        cc.tween(target)
            .to(smallTime, { scale: 0.9 })
            .to(0.05, { scale: 1.1 })
            .to(0.025, { scale: 1 })
            .start();
    }
    showIcon() {
        this.icon.node.scale = 1;
        cc.tween(this.icon.node)
            .to(0.07, { scale: 1.3 })
            .to(0.07, { scale: 1 })
            .start();
    }
    onStartTouch() {
        AudioMag.getInstance().playSound("按钮音");
        this.freshUI();
    }
    showItemActive(index) {
        if (index == this.index) {
            this.showScale(this.equipIcon, 0.25, 2.5);
            this.freshUI();
        }
    }
    freshUI() {
        cc.director.emit("freshSkinPageUI", ConfigMag.Ins.getSkinData()[this.index]);
        this.node.parent.children.forEach((item) => {
            item.getChildByName("active").active = false;
        })
        this.showScale(this.actives, 0.15, 1.5);
        this.showIcon();
        cc.director.emit("scrollToRole", this.index);
    }
    freshSkinItemUI(skinID) {
        if (skinID == this.index) {
            this.node.parent.children.forEach((item) => {
                item.getChildByName("active").active = false;
                item.getChildByName("equipIcon").active = false;
            })
            this.showScale(this.equipIcon, 0.25, 2.5);
            this.showScale(this.actives, 0.15, 1.5);
        }
    }
}
