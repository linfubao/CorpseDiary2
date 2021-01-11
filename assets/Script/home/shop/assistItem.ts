import GameMag from "../../manage/GameMag";
import AudioMag from "../../manage/AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AssistItem extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Node)
    actives: cc.Node = null;
    @property(cc.Node)
    coinBox: cc.Node = null;
    @property(cc.Prefab)
    coinPre: cc.Prefab = null;

    index: number = 0
    assistData: any = null;
    init(index, data) {
        if (index == 0) {//默认显示第一个
            this.showAction();
            cc.director.emit("freshAssistPageUI", data);
        }
        this.assistData = data;
        this.index = index;
        this.icon.spriteFrame = this.homeAtlas.getSpriteFrame("assistIcon_" + this.index);
        let str = `${data.costNum}`
        for (let i = 0; i < str.length; i++) {
            let node = cc.instantiate(this.coinPre);
            node.parent = this.coinBox;            
            let num = str.substr(i,1);
            // console.log(num);
            node.getComponent(cc.Sprite).spriteFrame = this.homeAtlas.getSpriteFrame("goldNum_"+num);
        }
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
    onStartTouch() {
        AudioMag.getInstance().playSound("按钮音");
        this.node.parent.children.forEach(item => {
            item.getChildByName("active").active = false;
            item.getChildByName("active").stopAllActions();
        })
        this.showAction();
        cc.director.emit("freshAssistPageUI", this.assistData);
    }
}
