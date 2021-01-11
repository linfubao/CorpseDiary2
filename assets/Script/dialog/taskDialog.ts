import GameMag from "../manage/GameMag";
import ConfigMag from "../manage/ConfigMag";
import ToolsMag from "../manage/ToolsMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TaskDialog extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    closeBtn: cc.Node = null;
    @property(cc.Node)
    taskBox: cc.Node = null;

    screenW: number = null;
    index: number = 0;
    len: number = null;
    onInit() {
        this.node.zIndex = 5000;
        let localData = ConfigMag.Ins.getTaskData();
        this.len = localData.length;
        this.loadItem();
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onCloseBtn, this);
        this.screenW = cc.view.getVisibleSize().width;
        this.content.x = -this.screenW;
        cc.tween(this.content)
            .to(0.2, { position: cc.v3(60, -10, 0) })
            .to(0.1, { position: cc.v3(0, -10, 0) })
            .start()
    }
    loadItem() {
        let self = this;
        ToolsMag.Ins.getHomeResource("prefab/other/taskItem", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            node.getComponent("taskItem").init(self.index);
            node.parent = self.taskBox;
            self.index++;
            if (self.index < self.len) {
                self.loadItem();
            }
        })
    }
    onCloseBtn() {
        ToolsMag.Ins.buttonAction(this.closeBtn, function () {
            cc.tween(this.content)
                .to(0.25, { position: cc.v3(-this.screenW, -10, 0) })
                .call(() => {
                    DialogMag.Ins.removePlane(DialogPath.TaskDialog);
                })
                .start()
        }.bind(this));
    }
}
