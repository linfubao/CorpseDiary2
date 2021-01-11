import ConfigMag from "../manage/ConfigMag";
import GameMag from "../manage/GameMag";
import ToolsMag from "../manage/ToolsMag";
import AudioMag from "../manage/AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StageBox extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    box: cc.Node = null;
    @property(cc.Node)
    light: cc.Node = null;
    @property(cc.Node)
    stageAssist: cc.Node = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    enemyTag: number = 0;
    opened: boolean = false;//箱子是否打开了

    init(enemyTag) {
        this.enemyTag = enemyTag;
        let ps = this.box.position;
        cc.tween(this.box)
            .repeatForever(
                cc.tween()
                    .to(0.5, { position: cc.v3(0, ps.y - 6, 0) })
                    .to(0.5, { position: cc.v3(0, ps.y + 6, 0) })
            )
            .start();
    }
    onCollisionEnter(other, self) {
        // console.log('on collision enter', "other", other, self);
        if (other.tag == 1) {
            if (other.node) {
                GameMag.Ins.putBullet(other.node);
            }
            this.openBox();
        } else if (other.tag == 6 || other.tag == 8 || other.tag == 11 || other.tag == 14 || other.tag == 18) {
            other.node.destroy();
            this.openBox();
        } else if (other.tag == 10) { //棍棒类
            other.enabled = false;
            this.openBox();
        }
    }
    openBox() {
        this.showLight();
        this.opened = true;
        this.box.active = false;
        this.node.getComponent(cc.Collider).enabled = false;
        let type = Math.random() > 0.8 ? true : false;
        if (type) {
            cc.director.emit("loadEnemy", this.enemyTag);
            this.node.destroy();
        } else {
            this.showAssist();
        }
    }
    //开箱光效
    showLight() {
        this.light.scale = 0.6;
        this.light.active = true;
        cc.tween(this.light)
            .to(0.12, { scale: 1.6 })
            .call(() => {
                if (this.light) {
                    this.light.active = false;
                }
            })
            .start();
    }
    //显示辅助道具
    showAssist() {
        this.node.stopAllActions();
        this.stageAssist.scale = 0;
        this.stageAssist.active = true;
        const assistType = Math.floor(Math.random() * 15);
        this.stageAssist.getComponent("stageAssist").init(assistType);
        this.icon.spriteFrame = this.homeAtlas.getSpriteFrame("assistIcon_" + assistType);
        let ps = this.stageAssist.position;
        let y = ps.y + 150;
        cc.tween(this.stageAssist)
            .to(0.3, { position: cc.v3(ps.x, y, 0), scale: 1.7 })
            .repeatForever(
                cc.tween()
                    .to(0.5, { position: cc.v3(ps.x, y + 13, 0) })
                    .to(0.5, { position: cc.v3(ps.x, y, 0) })
            )
            .start();
        this.scheduleOnce(() => {
            if (this.node) {
                this.node.destroy();
            }
        }, 20);
    }
}
