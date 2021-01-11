import GameMag from "../manage/GameMag";
import AudioMag from "../manage/AudioMag";
import ToolsMag from "../manage/ToolsMag";
import ConfigMag from "../manage/ConfigMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TaskItem extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.Label)
    text: cc.Label = null;
    @property(cc.Label)
    coinLab: cc.Label = null;
    @property(cc.Label)
    diamondLab: cc.Label = null;
    @property(cc.Node)
    notReward: cc.Node = null;
    @property(cc.Node)
    reward: cc.Node = null;
    @property(cc.Label)
    percent: cc.Label = null;
    @property(cc.Node)
    gouNode: cc.Node = null;
    @property(cc.Node)
    barNode: cc.Node = null;

    index: number = 0;
    cigData: any = null;
    initPs: number[] = [];
    init(index) {
        const height = this.node.height;
        this.initPs = [0, -(height + 15), -2 * (height + 15), -3 * (height + 15)];
        this.node.y = -index * (height + 15);
        this.cigData = ConfigMag.Ins.getTaskData()[index];
        this.index = index;
        // this.text.spriteFrame = this.homeAtlas.getSpriteFrame("task_" + index);
        this.text.string = String(`杀敌数${this.cigData.killNum}个`);
        this.reward.active = false;
        this.notReward.active = false;
        if (this.cigData.rewardType == 0) {
            this.coinLab.node.parent.active = true;
            this.coinLab.string = String(this.cigData.rewardNum);
        } else {
            this.diamondLab.node.parent.active = true;
            this.diamondLab.string = String(this.cigData.rewardNum);
        }
        this.progressUI();
        this.reward.on(cc.Node.EventType.TOUCH_END, this.onReward, this);
    }
    progressUI() {
        let localData = GameMag.Ins.taskData;
        const diff = localData.killSum - this.cigData.killNum;
        if (diff >= 0) {
            if (localData.data[this.index].geted) {
                this.gouNode.active = true;
                this.reward.parent.active = false;
            } else {
                this.reward.active = true;
            }
        } else {
            this.notReward.active = true;
            let num = Math.ceil((localData.killSum / this.cigData.killNum) * 100);
            this.scheduleOnce(() => {
                if (num > 0) {
                    num--;
                    this.schedule(() => {
                        let str = Number(this.percent.string);
                        str += 1;
                        this.percent.string = String(str);
                    }, 0, num);
                };
            }, 0.4);
            this.schedule(() => {
                this.barNode.width += 160 / this.cigData.killNum; //160是总长,ui调整的时候记得更改
            }, 0.016, localData.killSum - 1);
        }
    }
    onReward() {
        AudioMag.getInstance().playSound("按钮音");
        GameMag.Ins.updateTaskGet(this.index);
        GameMag.Ins.updateCurrency(this.cigData.rewardType, this.cigData.rewardNum);
        cc.director.emit("judgeTaskArrow");
        cc.director.emit("updateCurrency");
        cc.tween(this.reward.parent)
            .to(0.2, { opacity: 0 })
            .call(() => {
                this.gouNode.opacity = 0;
                this.gouNode.active = true;
                cc.tween(this.gouNode)
                    .to(0.2, { opacity: 255 })
                    .call(() => {
                        // const len1 = this.node.parent.children.length;
                        // const len2 = ConfigMag.Ins.getTaskData().length;
                        // if (len1 == len2) return;
                        // cc.tween(this.node)
                        //     .to(0.4, { position: cc.v3(this.node.x + this.node.width * 3, this.node.y, 0) })
                        //     .call(() => {
                        //         this.loadItem();
                        //     })
                        //     .start();
                    })
                    .start();
            })
            .start();
    }
    loadItem() {
        let self = this;
        self.node.active = false;
        const len = self.node.parent.children.length;
        ToolsMag.Ins.getHomeResource("prefab/other/taskItem", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            node.getComponent("taskItem").init(len);
            node.y = self.initPs[3];
            node.parent = self.node.parent;
            node.opacity = 0;
            cc.tween(node)
                .to(0.2, { opacity: 255 })
                .call(() => {
                    let arr = self.node.parent.children;
                    let nodeArr = [];
                    arr.forEach(item => {
                        if (item.active == true) {
                            nodeArr.push(item);
                        }
                    });
                    nodeArr.forEach((item, i) => {
                        cc.tween(item)
                            .to(0.35, { position: cc.v3(0, self.initPs[i], 0) })
                            .start();
                    });
                })
                .start();
        })
    }
}
