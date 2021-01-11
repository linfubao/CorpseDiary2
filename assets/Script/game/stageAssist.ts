import ConfigMag from "../manage/ConfigMag";
import GameMag from "../manage/GameMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StageAssist extends cc.Component {

    assistType: number = null; //打开的是哪个辅助道具
    init(assistType) {
        this.assistType = assistType;
    }
    onCollisionEnter(other, self) {
        if (other.tag == 2) {            
            this.useAssist();
        }
    }
    useAssist() {
        const cigData = ConfigMag.Ins.getAssistData();
        let info = GameMag.Ins.searchAssistData(cigData, this.assistType);
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
        this.node.parent.destroy();
    }
}
