import GameMag from "../../manage/GameMag";
import ConfigMag from "../../manage/ConfigMag";
import AudioMag from "../../manage/AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MechaItem extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Label)
    getNum: cc.Label = null;
    @property(cc.Node)
    actives: cc.Node = null;
    @property(cc.Node)
    equipIcon: cc.Node = null;


    mechaData: any[] = [];
    index: number = 0;
    init(data, index, sf) {
        // console.log(data);
        if (index == 0) { //每次进来默认高亮第一个
            // this.actives.active = true;
            this.showIcon(this.actives, 0.1, 1.5);
            let arr = ConfigMag.Ins.getMechaData();
            cc.director.emit("freshMechaPageUI", arr[index]);
            // cc.director.emit("scrollToMecha", index);
        } else {
            this.actives.active = false;
        }
        let useringMecha = GameMag.Ins.useingData.mecha;
        if (data.getNum > 0 && index == useringMecha) {
            this.showIcon(this.actives, 0.1, 1.5);
            this.showIcon(this.equipIcon, 0.25, 2.5);//当前使用的是哪个皮肤,就显示打钩
            let arr = ConfigMag.Ins.getMechaData();
            cc.director.emit("freshMechaPageUI", arr[index]);
            // cc.director.emit("scrollToMecha", index);
        }else{
            this.actives.active = false;
        }
        this.mechaData = data;
        this.index = index;
        // this.icon.spriteFrame = sf;
        this.getNum.string = String("x" + data.getNum);
        cc.director.on("freshMechaItemUI", this.freshMechaItemUI, this);
        cc.director.on("freshMechaItemActive", this.showItemActive, this);
        cc.director.on("freshEquipIcon", this.freshEquipIcon, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onStartTouch, this);
    }
    showIcon(target, smallTime, bigScale) {
        target.active = true;
        target.scale = bigScale;
        cc.tween(target)
            .to(smallTime, { scale: 0.9 })
            .to(0.05, { scale: 1.1 })
            .to(0.025, { scale: 1 })
            .start();
    }
    onStartTouch() {
        AudioMag.getInstance().playSound("按钮音");
        let data = ConfigMag.Ins.getMechaData();
        cc.director.emit("freshMechaPageUI", data[this.index]);
        this.node.parent.children.forEach(item => {
            item.getChildByName("active").active = false;
        })
        this.showIcon(this.actives, 0.1, 1.5);
        cc.director.emit("scrollToMecha", this.index);
    }
    showItemActive(index) {
        if (index == this.index) {
            this.freshUI();
        }
    }
    freshUI() {
        cc.director.emit("freshMechaPageUI", ConfigMag.Ins.getMechaData()[this.index]);
        this.node.parent.children.forEach((item) => {
            item.getChildByName("active").active = false;
        })
        this.showIcon(this.actives, 0.1, 1.5);
        this.showIcon(this.icon.node, 0.1, 1.5);
        cc.director.emit("scrollToMecha", this.index);
    }
    freshEquipIcon() {
        this.equipIcon.active = false;
    }
    freshMechaItemUI(index) {
        if (this.index == index) {
            let data = GameMag.Ins.mechaData[index];
            this.getNum.string = String("x" + data.getNum);
            this.showIcon(this.equipIcon, 0.25, 2.5);//当前使用的是哪个皮肤,就显示打钩
            GameMag.Ins.updateUseingDataByMecha(index);
        } else {
            this.equipIcon.active = false;
        }
    }
}
