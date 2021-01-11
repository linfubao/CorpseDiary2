import GameMag from "../../manage/GameMag";
import ToolsMag from "../../manage/ToolsMag";
import AudioMag from "../../manage/AudioMag";

const { ccclass, property } = cc._decorator;
//钻石金币销售界面
@ccclass
export default class CoinPage extends cc.Component {

    @property(cc.Label)
    coinLab: cc.Label = null;
    @property(cc.Label)
    diamondLab: cc.Label = null;
    @property(cc.Node)
    leftGet: cc.Node = null;
    @property(cc.Node)
    rightGet: cc.Node = null;

    coinNum: number = 5000; //奖励的金币数
    diamondNum: number = 50;//奖励的钻石数

    onLoad() {
        this.coinLab.string = String(this.coinNum);
        this.diamondLab.string = String("+" + this.diamondNum);
        this.leftGet.on(cc.Node.EventType.TOUCH_END, this.onLeftGet, this);
        this.rightGet.on(cc.Node.EventType.TOUCH_END, this.onRightGet, this);
    }
    onLeftGet() {
        AudioMag.getInstance().playSound("按钮音");
        GameMag.Ins.updateCurrency(0, this.coinNum);
        cc.director.emit("updateCurrency");
    }
    onRightGet() {
        AudioMag.getInstance().playSound("按钮音");
        GameMag.Ins.updateCurrency(1, this.diamondNum);
        cc.director.emit("updateCurrency");
    }
}
