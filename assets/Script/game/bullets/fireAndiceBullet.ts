import GameMag from "../../manage/GameMag";
import ConfigMag from "../../manage/ConfigMag";
import ToolsMag from "../../manage/ToolsMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FireAndiceBullet extends cc.Component {

    dir: number = 0;//移动方向

    init(dir) {
        this.dir = dir;
        this.node.scaleX = dir;
        this.scheduleOnce(() => {
            if (this.node) {
                this.node.destroy();//这边时间销毁,龙骨动作完也会销毁,双重保障
            }
        }, 0.4);
    }
    onCollisionEnter(other, self) {
        // console.log(other.tag);

    }
}
