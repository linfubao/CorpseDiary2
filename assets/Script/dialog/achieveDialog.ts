import GameMag from "../manage/GameMag";
import ConfigMag from "../manage/ConfigMag";
import ToolsMag from "../manage/ToolsMag";
import AudioMag from "../manage/AudioMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AchieveDialog extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    closeBtn: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property({ type: cc.Node, tooltip: "完成进度父节点" })
    progressBox: cc.Node = null;
    @property({ type: cc.Prefab, tooltip: "完成进度" })
    achieveProgress: cc.Prefab = null;

    index: number = 0;
    len: number = 0;
    cigData: any[] = [];
    onInit() {
        this.node.zIndex = 5000;
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onCloseBtn, this);
        this.cigData = ConfigMag.Ins.getAchieveData();
        this.len = this.cigData.length;
        this.loadItem();
    }
    loadItem() {
        let self = this;
        ToolsMag.Ins.getHomeResource("prefab/other/achieveItem", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            let titleImage = self.homeAtlas.getSpriteFrame("achieveTitle_" + self.index);
            let textImage = self.homeAtlas.getSpriteFrame("achieveText_" + self.index);
            node.getComponent("achieveItem").init(self.index, self.cigData[self.index], titleImage, textImage);
            node.parent = self.content;
            self.loadAchieveProgress();
            self.index++;
            if (self.index < self.len) {
                self.loadItem();
            }
        })
    }
    //加载每个成就的进度,为了优化,只能麻烦把这个文字部分单独出来了,也要记得要用字体文件才行
    loadAchieveProgress() {
        let progressNode = cc.instantiate(this.achieveProgress);
        progressNode.parent = this.progressBox;
        let localData = GameMag.Ins.achieveRecord;
        let num: number = null;
        let item = this.cigData[this.index];
        switch (item.taskType) {
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
        if (num >= item.target) {
            num = item.target;
        }
        progressNode.getChildByName("nowTarget").getComponent(cc.Label).string = String(num);
        progressNode.getChildByName("target").getComponent(cc.Label).string = String(item.target);
    }
    onCloseBtn() {
        AudioMag.getInstance().playSound("按钮音");
        cc.tween(this.closeBtn)
            .to(0.2, { opacity: 0 })
            .call(() => {
                DialogMag.Ins.removePlane(DialogPath.AchieveDialog);
                this.closeBtn.opacity = 255;
            })
            .start()
    }
    update() {
        this.progressBox.y = this.content.y;
    }
}
