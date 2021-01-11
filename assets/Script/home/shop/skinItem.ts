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
    init(index, sp) {
        const useSkin = GameMag.Ins.useingData.skin;
        let info = GameMag.Ins.skinData[useSkin];
        if (index == info.skinID && info.geted) {
            this.equipIcon.active = true; //当前使用的是哪个皮肤,就显示打钩
            this.actives.active = true;
        }
        const cigData = ConfigMag.Ins.getSkinData()[useSkin];
        if (useSkin == cigData.skinID) { //当前使用的是哪个皮肤,就首先显示哪个皮肤
            cc.director.emit("freshSkinPageUI", cigData);
        }
        this.index = index;
        this.icon.spriteFrame = sp;
        cc.director.on("freshSkinItemUI", this.freshSkinItemUI, this);
        this.icon.node.on(cc.Node.EventType.TOUCH_END, this.onStartTouch, this);
    }
    onStartTouch() {
        AudioMag.getInstance().playSound("按钮音");
        cc.director.emit("freshSkinPageUI", ConfigMag.Ins.getSkinData()[this.index]);
        this.node.parent.children.forEach((item) => {
            item.getChildByName("active").active = false;
        })
        this.actives.active = true;
    }
    freshSkinItemUI(skinID) {
        this.equipIcon.active = false;
        if (skinID == this.index) {
            this.equipIcon.active = true;
        }
    }
}
