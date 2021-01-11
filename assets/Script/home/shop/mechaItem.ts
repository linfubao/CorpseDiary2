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
            this.actives.active = true;
            let arr = ConfigMag.Ins.getMechaData();
            cc.director.emit("freshMechaPageUI", arr[index]);
        } else {
            this.actives.active = false;
        }
        let useringMecha = GameMag.Ins.useingData.mecha;
        if (data.getNum > 0 && index == useringMecha) {
            this.equipIcon.active = true;
        }
        this.mechaData = data;
        this.index = index;
        this.icon.spriteFrame = sf;
        this.getNum.string = String("x" + data.getNum);
        cc.director.on("freshMechaItemUI", this.freshMechaItemUI, this);
        cc.director.on("freshEquipIcon", this.freshEquipIcon, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onStartTouch, this);
    }
    onStartTouch() {
        AudioMag.getInstance().playSound("按钮音");
        let data = ConfigMag.Ins.getMechaData();
        cc.director.emit("freshMechaPageUI", data[this.index]);
        this.node.parent.children.forEach(item => {
            item.getChildByName("active").active = false;
        })
        this.actives.active = true;
    }
    freshEquipIcon() {
        this.equipIcon.active = false;
    }
    freshMechaItemUI(index) {
        if (this.index == index) {
            let data = GameMag.Ins.mechaData[index];
            this.getNum.string = String("x" + data.getNum);
            this.equipIcon.active = true;
            GameMag.Ins.updateUseingDataByMecha(index);
        }else{
            this.equipIcon.active = false;
        }
    }
}
