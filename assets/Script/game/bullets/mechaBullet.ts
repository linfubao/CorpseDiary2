import GameMag from "../../manage/GameMag";
import ConfigMag from "../../manage/ConfigMag";
import ToolsMag from "../../manage/ToolsMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MechaBullet extends cc.Component {

    @property(cc.BoxCollider)
    bulletCollider: cc.BoxCollider = null;
    @property({ type: cc.Node, tooltip: "机甲2的伤害区域" })
    range: cc.Node = null;

    speed: number = 2000;//机甲子弹的移动速度
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
            if(this.node){
                GameMag.Ins.putMechaBullet(this.node);
            }
        }
    }
    onCollisionEnter(other, self) {
        if (other.tag == 5 && GameMag.Ins.useingData.mecha == 2) {
            this.bulletCollider.enabled = false;
            this.range.active = true;
            this.speed = 0;
            this.scheduleOnce(() => {
                if (this.node) {
                    this.bulletCollider.enabled = true;
                    this.range.active = false;
                    GameMag.Ins.putMechaBullet(this.node);
                }
            }, 0.05);
        }
    }
}
