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
    countTime: number = null;//计时
    assistTime: number = null;
    mechaTime: number = null;

    init(assistID, index, sf) {
        this.assistID = assistID;
        this.index = index;
        this.icon.spriteFrame = sf;
        this.cigData = ConfigMag.Ins.getAssistData()[assistID];
        this.assistTime = this.cigData.assistTime;
        this.countTime = this.assistTime;
        this.initUI();
        cc.director.on("useingMecha", this.useingMecha, this);
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
        this.schedule(this.countDown, 1);
        GameMag.Ins.updateAssistData(this.assistID, -1);
        this.lastNum--;
        this.bulletNum.string = String(this.lastNum);
        // console.log(this.lastNum);
        if (this.lastNum == 0) {
            this.icon.node.color = cc.color(115, 115, 115);
            GameMag.Ins.updateUseingDataByAssistEquip(-2, this.index);
        }
    }
    useingMecha(status) {
        if (!status) {
            this.countTime = null;
            this.node.resumeSystemEvents(true);
            this.unschedule(this.countDown);
            return;
        }
        this.node.pauseSystemEvents(true);
        this.buffer.node.active = true;
        this.buffer.progress = 1;
        const useMecha = GameMag.Ins.useingData.mecha;
        const mechaCigData = ConfigMag.Ins.getMechaData()[useMecha];
        this.countTime = mechaCigData.keepTime;
        this.mechaTime = mechaCigData.keepTime;
        this.unschedule(this.countDown);
        this.schedule(this.countDown, 1);
    }
    useAssist() {
        let info = this.cigData;
        // console.log(info);
        let assistType = info.assistType;
        let effectNum = info.effectNum;
        let assistTime = info.assistTime;
        let assistSize = info.assistSize;
        switch (assistType) {
            case 0://加血
                cc.director.emit("useAssistBlood", effectNum);
                break;
            case 1://减伤
                cc.director.emit("useAssistHurt", effectNum, assistTime);
                break;
            case 2://增加攻击
                cc.director.emit("useAssist", 2, effectNum, assistTime);
                break;
            case 3://增加移动速度
                cc.director.emit("useAssist", 3, effectNum, assistTime);
                break;
            case 4://导弹
                cc.director.emit("useAssistMissile", 3);
                break;
            default:
                break;
        }
    }
    countDown() {
        if (!this.countTime) return;
        this.countTime--;
        const time = this.mechaTime || this.assistTime;
        this.buffer.progress -= 1 / time;
        if (this.countTime <= 0) {
            this.countTime = null;
            this.node.resumeSystemEvents(true);
            this.unschedule(this.countDown);
        }
    }
    onDisable() {
        this.unschedule(this.countDown);
    }
}
