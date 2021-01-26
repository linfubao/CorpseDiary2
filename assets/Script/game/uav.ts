import ToolsMag from "../manage/ToolsMag";
import SdkManager from "../sdk/SdkManager";
import AudioMag from "../manage/AudioMag";
import GameMag from "../manage/GameMag";
import ConfigMag from "../manage/ConfigMag";

enum Animate {
    Walk = "walk",
    Stay = "stay",
    StayFire = "stay_fire",
    WalkFire = "walk_fire"
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class Uav extends cc.Component {

    @property(cc.BoxCollider)
    attackTest: cc.BoxCollider = null;

    posY: number = 70;
    cameraNode: cc.Node = null;
    roleNode: cc.Node = null;
    bulletBox: cc.Node = null;
    destination: boolean = false;//目的地
    moving: boolean = false;

    onLoad() {
        GameMag.Ins.initUavBullet();
        this.bulletBox = cc.find("Canvas/bulletBox");
        this.cameraNode = cc.find("Canvas/roleCamera");
        this.roleNode = cc.find("Canvas/role");
        this.node.setPosition(-this.cameraNode.width / 2, this.posY);
        this.freshAnimate(Animate.Walk, 0);
        cc.tween(this.node)
            .to(0.3, { position: cc.v3(this.cameraNode.x, this.posY, 0) })
            .call(() => {
                this.freshAnimate(Animate.Stay, 0);
                this.destination = true;
                this.attackTest.enabled = true;//显示攻击范围,用于检测小怪进入攻击范围后进行攻击
                this.attackTest.size.width = this.cameraNode.width - 100;
            })
            .start();
        cc.director.on("uavMove", this.uavMove, this);
        cc.director.on("uavStop", this.uavStop, this);
    }
    uavMove() {
        this.moving = true;
        this.freshAnimate(Animate.Walk, 0);
    }
    uavStop() {
        this.moving = false;
        this.freshAnimate(Animate.Stay, 0);
    }
    freshAnimate(action: string, times: number, cb: Function = null) {
        let self = this;
        ToolsMag.Ins.playDragonBone(this.node, action, times, function () {
            cb && cb();
        })
    }
    enemyBox: any[] = [];
    onCollisionEnter(other, self) {
        if (other.tag === 5 && this.destination) {
            const flag = Number(other.node.getComponent("enemy").tag);
            const blood = ConfigMag.Ins.getEnemyData()[flag].blood;
            this.enemyBox.push({ target: other.node, blood: blood });
            // console.log(this.enemyBox);
        }
    }
    fire() {
        if (!this.node || this.enemyBox.length === 0) return;
        if (this.enemyBox[0].blood <= 0) {
            this.enemyBox.shift();
        }
        if (this.enemyBox.length === 0) return;
        // let enemy: cc.Node = this.enemyBox.shift();
        let enemy: cc.Node = this.enemyBox[0].target;
        if (!enemy) return;
        let self = this;
        this.node.scaleX = enemy.scaleX * 1.5;
        GameMag.Ins.getUavBullet(function (bulletNode) {
            const flag = Number(enemy.getComponent("enemy").tag);
            const blood = ConfigMag.Ins.getEnemyData()[flag].blood;
            self.enemyBox[0].blood -= blood;
            bulletNode.setPosition(self.roleNode.x, -100);
            bulletNode.getComponent("bullet").init(self.node.scaleX);
            bulletNode.parent = self.bulletBox;
            if (self.moving) {
                self.freshAnimate(Animate.WalkFire, 1, function () {
                    if (self.moving) {
                        self.freshAnimate(Animate.Walk, 0);
                    }
                });
                return;
            }
            self.freshAnimate(Animate.StayFire, 1, function () {
                if (self.moving) {
                    self.freshAnimate(Animate.Stay, 0);
                }
            });
        });
    }
    updateSche: number = 0;
    updateTime: number = 0.2;
    update(dt) {
        if (GameMag.Ins.gamePause || GameMag.Ins.gameOver || !this.destination) return;
        this.node.x = this.roleNode.x;
        if (dt < 0.2) this.updateSche += dt;
        if (this.updateSche >= this.updateTime) {
            this.updateSche -= this.updateTime;
            this.fire();
        }
    }
}
