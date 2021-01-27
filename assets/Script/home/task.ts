import GameMag from "../manage/GameMag";
import AudioMag from "../manage/AudioMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";
import ConfigMag from "../manage/ConfigMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Task extends cc.Component {

    taskIndex: number = null;// 0:无尽模式 1:击杀模式 2:距离模式 3:时间模式  4:击杀+时间模式 5:距离+时间模式
    mapIndex: number = null;

    init(taskIndex, mapIndex) {
        this.taskIndex = taskIndex;
        this.mapIndex = mapIndex;
        let ps = this.node.position;
        let action = cc.repeatForever(
            cc.sequence(
                cc.moveTo(0.7, ps.x, ps.y - 3),
                cc.moveTo(0.7, ps.x, ps.y + 3)
            )
        );
        this.node.scale = 0;
        cc.tween(this.node)
            .to(0.3, { scale: 1 })
            .call((node) => {
                cc.tween(node)
                    .then(action)
                    .start();
            })
            .start();
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch, this);
    }
    onTouch() {
        AudioMag.getInstance().playSound("按钮音");
        DialogMag.Ins.show(DialogPath.FrontGameDialog, DialogScript.FrontGameDialog, [this.taskIndex,this.mapIndex]);
    }
}
