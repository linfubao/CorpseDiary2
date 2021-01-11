import GameMag from "../../manage/GameMag";
import AudioMag from "../../manage/AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AssistEquip extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Node)
    showNode: cc.Node = null;
    @property(cc.Node)
    hideNode: cc.Node = null;

    index: number = null;
    init(assistID, index, sf) {
        this.index = index;
        if (assistID < 0) {
            this.showNode.active = false;
        } else {
            this.showNode.active = true;
        }
        this.icon.spriteFrame = sf;
        this.node.on(cc.Node.EventType.TOUCH_END, this.onStartTouch, this);
    }
    onStartTouch() {
        AudioMag.getInstance().playSound("按钮音");
        cc.tween(this.icon.node)
            .to(0.2, { scale: 1.2 })
            .to(0.2, { scale: 0 })
            .call((node) => {
                this.showNode.active = false;
                node.scale = 1;
                GameMag.Ins.updateUseingDataByAssistEquip(-1, this.index)
                cc.director.emit("freshAssistEquipBtns");
            })
            .start();
    }

}
