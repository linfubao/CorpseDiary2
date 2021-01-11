import GameMag from "../manage/GameMag";
import ConfigMag from "../manage/ConfigMag";
import ToolsMag from "../manage/ToolsMag";
import AudioMag from "../manage/AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class gameAssistItem extends cc.Component {

    @property(cc.Label)
    bulletNum: cc.Label = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property({ type: cc.ProgressBar, tooltip: "圆形进度" })
    buffer: cc.ProgressBar = null;

    assistID: number = null;
    index: number = null;
    cigData: any = null;
    lastNum: number = 0;//剩余子弹
    _t: number = 15;

    init(assistID, index, sf) {
        this.assistID = assistID;
        this.index = index;
        this.icon.spriteFrame = sf;
        this.cigData = ConfigMag.Ins.getAssistData();
        this.initUI();
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch, this);
    }
    initUI() {
        let localData = GameMag.Ins.assistData;
        let res = GameMag.Ins.searchAssistData(localData, this.assistID);
        // console.log(res);
        if (res) {
            if (res.getNum > 0) {
                this.node.active = true;
            }
            this.lastNum = res.getNum;
            this.bulletNum.string = String(res.getNum);
        }
    }
    onTouch() {
        AudioMag.getInstance().playSound("按钮音");
        if (this.lastNum <= 0) return;
        this.node.pauseSystemEvents(true);
        this.useAssist();
        this.buffer.node.active = true;
        this.buffer.progress = 1;
        this.unschedule(this.countDown);
        this.schedule(this.countDown, 1 / this._t);
        GameMag.Ins.updateAssistData(this.assistID, -1);
        this.lastNum--;
        this.bulletNum.string = String(this.lastNum);
        // console.log(this.lastNum);
        if (this.lastNum == 0) {
            this.icon.node.color = cc.color(115, 115, 115);
            GameMag.Ins.updateUseingDataByAssistEquip(-1, this.index);
        }
    }
    useAssist() {
        let info = GameMag.Ins.searchAssistData(this.cigData, this.assistID);
        // console.log(info);
        let assistType = info.assistType;
        let assistNum = info.assistNum;
        let assistTime = info.assistTime;
        let assistSize = info.assistSize;
        switch (assistType) {
            case 0://加血
                cc.director.emit("useAssistBlood", assistNum);
                break;
            case 1://减伤
                cc.director.emit("useAssistHurt", assistNum, assistTime);
                break;
            case 2://增加攻击
                cc.director.emit("useAssist", 2, assistNum, assistTime);
                break;
            case 3://增加移动速度
                cc.director.emit("useAssist", 3, assistNum, assistTime);
                break;
            case 4://导弹
                cc.director.emit("useAssistMissile", assistSize);
                break;
            default:
                break;
        }
    }
    countDown() {
        this.buffer.progress -= 1 / this._t / this._t;
        if (this.buffer.progress <= 0) {
            this.unschedule(this.countDown);
            this.node.resumeSystemEvents(true);
        }
    }
    onDisable() {
        this.unschedule(this.countDown);
    }
}
