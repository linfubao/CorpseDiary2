import GameMag from "../../manage/GameMag";
import ConfigMag from "../../manage/ConfigMag";
import ToolsMag from "../../manage/ToolsMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {

    speed: number = 2000;//子弹移动速度
    dir: number = 0;//移动方向
    camera: cc.Node = null;
    cameraW: number = 0;

    init(dir) {
        this.dir = dir;
        this.camera = cc.find("Canvas/roleCamera");
        this.cameraW = this.camera.width / 2;
    }
    update(dt) {
        this.node.x += this.dir * this.speed * dt;
        // console.log(this.node.x);
        //判断子弹在屏幕外
        if (this.node.x > this.camera.x + this.cameraW + 200 || this.node.x < this.camera.x - this.cameraW - 200) {
            // console.log("出去了");
            // this.node.destroy();
            if (this.node) {
                GameMag.Ins.putBullet(this.node);
            }
        }
    }
    // onCollisionEnter(other, self) {
    // console.log(other.tag, this.type);
    // }
}
