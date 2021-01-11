import GameMag from "../manage/GameMag";
import AudioMag from "../manage/AudioMag";
import ToolsMag from "../manage/ToolsMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AchieveItem extends cc.Component {

    @property(cc.Node)
    rewardBtn: cc.Node = null;
    @property(cc.Node)
    bgTrue: cc.Node = null;
    @property(cc.Node)
    bgFalse: cc.Node = null;
    @property(cc.Sprite)
    title: cc.Sprite = null;
    @property(cc.Sprite)
    text: cc.Sprite = null;
    @property(cc.Label)
    nowTarget: cc.Label = null;
    @property(cc.Label)
    target: cc.Label = null;
    @property(cc.Label)
    coinLab: cc.Label = null;
    @property(cc.Label)
    diamondLab: cc.Label = null;

    index: number = 0;
    cigData: any = null;
    init(index, cigData, titleImage, textImage) {
        this.cigData = cigData;
        this.index = index;
        this.title.spriteFrame = titleImage;
        this.text.spriteFrame = textImage;
        this.initDataUI();
        this.rewardBtn.on(cc.Node.EventType.TOUCH_END, this.onRewardBtn, this);
    }
    initDataUI() {
        this.bgTrue.active = false;
        this.bgFalse.active = true;
        let localData = GameMag.Ins.achieveRecord;
        let achieveData = GameMag.Ins.achieveData[this.index];
        let num: number = null;
        switch (this.cigData.taskType) {
            case 0:
                num = localData.killNum;
                break;
            case 1:
                num = localData.killBossNum;
                break;
            case 2:
                num = localData.timer;
                break;
            case 3:
                num = localData.level;
                break;
            case 4:
                num = localData.gunSum;
                break;
            default:
                break;
        }
        // console.log(this.cigData, num);
        if (num >= this.cigData.target) {
            num = this.cigData.target;
        }
        if (achieveData.geted) {
            this.bgTrue.active = true;
            this.bgFalse.active = false;
        } else {
            if (num == this.cigData.target) {
                this.rewardBtn.active = true;
            }
        }
        this.nowTarget.string = String(num);
        this.target.string = String(this.cigData.target);
        if (this.cigData.rewardType === 0) {
            this.coinLab.node.parent.active = true;
            this.coinLab.string = String(this.cigData.rewardNum);
        } else {
            this.diamondLab.node.parent.active = true;
            this.diamondLab.string = String(this.cigData.rewardNum);
        }
    }
    onRewardBtn() {
        let self = this;
        AudioMag.getInstance().playSound("奖励");
        ToolsMag.Ins.buttonAction(this.rewardBtn, function () {
            self.rewardBtn.active = false;
            self.bgTrue.active = true;
            self.bgFalse.active = false;
            GameMag.Ins.updateCurrency(this.cigData.rewardType, this.cigData.rewardNum);
            GameMag.Ins.updateAchieveData(self.index);
            cc.director.emit("judgeAchieve");
            cc.director.emit("updateCurrency");
        }.bind(this));
    }
}
