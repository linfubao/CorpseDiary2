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
        this.mechaData = data;
        this.index = index;
        this.icon.spriteFrame = sf;
        this.getNum.string = String("x" + data.getNum);
        let useringMecha = GameMag.Ins.useingData.mecha;
        if (data.getNum > 0 && index == useringMecha) {
            this.showScale(this.actives, 0.1, 1.5);
            this.showScale(this.equipIcon, 0.25, 2.5);//当前使用的是哪个皮肤,就显示打钩
            this.showIcon();
            let arr = ConfigMag.Ins.getMechaData();
            cc.director.emit("freshMechaPageUI", arr[index]);
        }
        if (index == 0) { //每次进来默认高亮第一个
            this.showScale(this.actives, 0.1, 1.5);
            let arr = ConfigMag.Ins.getMechaData();
            cc.director.emit("freshMechaPageUI", arr[index]);
        } else {
            this.actives.active = false;
        }

        cc.director.on("freshMechaItemUI", this.freshMechaItemUI, this);
        cc.director.on("freshMechaItemActive", this.showItemActive, this);
        cc.director.on("freshEquipIcon", this.freshEquipIcon, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onStartTouch, this);
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
            this.freshUI();
        }
    }
    freshUI() {
        cc.director.emit("freshMechaPageUI", ConfigMag.Ins.getMechaData()[this.index]);
        this.node.parent.children.forEach((item) => {
            item.getChildByName("active").active = false;
        })
        this.showScale(this.actives, 0.1, 1.5);
        this.showIcon();
        cc.director.emit("scrollToMecha", this.index);
    }
    freshEquipIcon() {
        this.equipIcon.active = false;
    }
    freshMechaItemUI(index) {
        if (this.index == index) {
            let data = GameMag.Ins.mechaData[index];
            this.getNum.string = String("x" + data.getNum);
            if (!this.equipIcon.active) {
                this.showScale(this.equipIcon, 0.25, 2.5);//当前使用的是哪个皮肤,就显示打钩
            }
            this.showScale(this.actives, 0.1, 1.5);
            GameMag.Ins.updateUseingDataByMecha(index);
        } else {
            this.equipIcon.active = false;
        }
    }
}
