import GameMag from "../../manage/GameMag";
import ConfigMag from "../../manage/ConfigMag";
import AudioMag from "../../manage/AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AssistEquip extends cc.Component {

    @property(cc.SpriteAtlas)
    shopAtlas: cc.SpriteAtlas = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Label)
    getNumLab: cc.Label = null;

    index: number = null;

    init(equipID, index) {
        this.index = index;
        let sf = this.shopAtlas.getSpriteFrame("assistIcon_" + equipID);
        this.icon.spriteFrame = sf;
        if (equipID != -2) {
            const assistData = GameMag.Ins.assistData[equipID];
            this.getNumLab.string = String("X" + assistData.getNum);
        }
        cc.director.on("upAssistEquip" + this.index, this.upAssistEquip, this);
        cc.director.on("downAssistEquip" + this.index, this.downAssistEquip, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onStartTouch, this);
    }
    //装备到列表
    upAssistEquip(equipID, flag) {
        this.icon.node.active = true;
        if(flag){ //不在装备列表,就显示图标
            let sf = this.shopAtlas.getSpriteFrame("assistIcon_" + equipID);
            this.icon.spriteFrame = sf;
        }
        const assistData = GameMag.Ins.assistData[equipID];
        this.getNumLab.string = String("X" + assistData.getNum);
    }
    //解除装备
    downAssistEquip() {
        this.onStartTouch();
    }
    onStartTouch() {
        AudioMag.getInstance().playSound("按钮音");
        cc.tween(this.icon.node)
            .to(0.1, { scale: 1.2 })
            .to(0.15, { scale: 0 })
            .call((node) => {
                this.icon.node.active = false;
                node.scale = 1;
                GameMag.Ins.updateUseingDataByAssistEquip(-2, this.index)
                cc.director.emit("freshAssistEquipBtns");
            })
            .start();
    }

}
