import GameMag from "../../manage/GameMag";
import ConfigMag from "../../manage/ConfigMag";
import ToolsMag from "../../manage/ToolsMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoomBullet extends cc.Component {

    @property(cc.Sprite)
    image: cc.Sprite = null;
    @property(cc.Node)
    boom: cc.Node = null;

    speed: number = 1300;//子弹移动速度
    dir: number = 0;//移动方向
    camera: cc.Node = null;
    canvas: cc.Node = null;
    cameraW: number = 0;

    init(dir) {
        this.dir = dir;
        this.node.scaleX = dir;
        this.canvas = cc.find("Canvas");
        this.camera = this.canvas.getChildByName("roleCamera");
        this.cameraW = this.camera.width / 2;
    }
    update(dt) {
        this.node.x += this.dir * this.speed * dt;
        // console.log(this.node.x);
        //判断子弹在屏幕外
        if (this.node.x > this.camera.x + this.cameraW + 200 || this.node.x < this.camera.x - this.cameraW - 200) {
            console.log("出去了");
            if (this.node) {
                this.node.destroy();
            }
        }
    }
    onCollisionEnter(other, self) {
        if (other.tag == 5) {
            let that = this;
            this.boom.active = true;
            this.image.enabled = false;
            this.speed = 0;
            ToolsMag.Ins.getGameResource("prefab/blastSmoke", function (prefab: cc.Prefab) {
                let node = cc.instantiate(prefab);
                node.scale = 2;
                node.setPosition(other.node.x, -210);
                node.parent = that.canvas;
                that.scheduleOnce(() => {
                    if(that.node){
                        that.node.active = false;
                    }
                }, 0.05);
                ToolsMag.Ins.playDragonBone(node, "blast_0", 1, function () {
                    node.destroy();
                    if (that.node) {
                        that.node.destroy();
                    }
                });
            })
        }
    }
}
