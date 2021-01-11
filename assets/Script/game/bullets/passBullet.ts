import GameMag from "../../manage/GameMag";
import ConfigMag from "../../manage/ConfigMag";
import ToolsMag from "../../manage/ToolsMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PassBullet extends cc.Component {

    @property(cc.BoxCollider)
    passBulletCollider: cc.BoxCollider = null;

    dir: number = 0;//移动方向

    init(dir) {
        this.dir = dir;
        this.node.scaleX = dir;
        const screenW = cc.view.getVisibleSize().width - 110;
        this.node.width = screenW / 2;
        this.passBulletCollider.size.width = screenW / 2;
        this.passBulletCollider.offset.x = screenW / 2 / 2;
        this.scheduleOnce(() => {
            if (this.node) {
                this.node.destroy();
            }
        }, 0.3);
    }
    // onCollisionEnter(other, self) {
    //     console.log(other.tag);

    // }
}
