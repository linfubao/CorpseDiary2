import GameMag from "../../manage/GameMag";
import AudioMag from "../../manage/AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AssistItem extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Node)
    actives: cc.Node = null;
    @property(cc.Node)
    getedIcon: cc.Node = null;
    @property(cc.Label)
    coinLab: cc.Label = null;
    @property(cc.Label)
    diamondLab: cc.Label = null;
    @property(cc.Prefab)
    coinPre: cc.Prefab = null;

    index: number = 0
    assistCigData: any = null;

    init(index, sf, data) {
        // console.log(data);
        if (index == 0) {//默认显示第一个
            this.showAction();
            cc.director.emit("freshAssistPageUI", data);
        }
        const assistData = GameMag.Ins.assistData[index];
        if (assistData.getNum > 0) {
            this.getedIcon.active = true;
        }
        this.assistCigData = data;
        this.index = index;
        this.icon.spriteFrame = sf;
        if (data.buyType === 0) {
            this.coinLab.node.parent.active = true;
            this.coinLab.string = String(data.costNum);
        } else {
            this.diamondLab.node.parent.active = true;
            this.diamondLab.string = String(data.costNum);
        }
        // let str = `${data.costNum}`
        // for (let i = 0; i < str.length; i++) {
        //     let node = cc.instantiate(this.coinPre);
        //     node.parent = this.coinBox;
        //     let num = str.substr(i, 1);
        // console.log(num);
        // node.getComponent(cc.Sprite).spriteFrame = this.homeAtlas.getSpriteFrame("goldNum_" + num);
        // }
        cc.director.on("showAssistGetedIcon" + this.index, this.showGetedIcon, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onStartTouch, this);
    }
    showAction() {
        this.actives.active = true;
        this.actives.opacity = 255;
        let _t = 0.9;
        cc.tween(this.actives)
            .repeatForever(
                cc.tween().to(_t, { opacity: 0 }).to(_t, { opacity: 255 })
            )
            .start();
    }
    showGetedIcon() {
        if (this.getedIcon.active) return;
        this.getedIcon.active = true;
        this.getedIcon.scale = 3;
        cc.tween(this.getedIcon)
            .to(0.15, { scale: 0.9 })
            .to(0.05, { scale: 1.1 })
            .to(0.025, { scale: 1 })
            .start();
    }
    onStartTouch() {
        AudioMag.getInstance().playSound("按钮音");
        this.node.parent.children.forEach(item => {
            item.getChildByName("active").active = false;
            item.getChildByName("active").stopAllActions();
        })
        this.showAction();
        cc.director.emit("freshAssistPageUI", this.assistCigData);
    }
}
