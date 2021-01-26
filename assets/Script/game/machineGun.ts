import ToolsMag from "../manage/ToolsMag";
import SdkManager from "../sdk/SdkManager";
import AudioMag from "../manage/AudioMag";
import GameMag from "../manage/GameMag";
import ConfigMag from "../manage/ConfigMag";

enum Animate {
    ShowUp = "show_up",
    Stay = "stay",
    Fire = "fire"
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class MachineGun extends cc.Component {

    @property(cc.BoxCollider)
    attackTest: cc.BoxCollider = null;
    @property(cc.Node)
    boomTest: cc.Node = null;
    @property(cc.Node)
    blastSmoke: cc.Node = null;
    @property(cc.Prefab)
    machineBullet: cc.Prefab = null;
    @property(cc.Node)
    shellsPos: cc.Node = null;

    keepTime: number = 0;
    showEnd: boolean = false;
    roleNode: cc.Node = null;
    cameraNode: cc.Node = null;
    bulletBox: cc.Node = null;

    init(keepTime) {
        this.keepTime = keepTime;
        GameMag.Ins.initMachineBullet();
        this.cameraNode = cc.find("Canvas/roleCamera");
        this.roleNode = cc.find("Canvas/role");
        this.bulletBox = cc.find("Canvas/bulletBox");
        this.node.setPosition(this.roleNode.x + 170, 800);
        this.showUp();
        // this.schedule(() => {
        //     if (GameMag.Ins.gamePause || GameMag.Ins.gameOver) {
        //         this.freshAnimate(Animate.Stay, 0);
        //         return;
        //     };
        //     const cameraRect = this.cameraNode.getBoundingBoxToWorld();
        //     const bool = cameraRect.containsRect(this.node.getBoundingBoxToWorld());
        //     // console.log(bool);
        //     // if (!this.ShowEnd) return;
        // }, 0.5);
        this.scheduleOnce(() => {
            if (this.node)
                this.node.destroy();
        }, keepTime);
    }
    showUp() {
        let self = this;
        this.boomTest.active = true;
        cc.tween(this.node)
            .to(0.2, { position: cc.v3(this.roleNode.x + 170, -190, 0) })
            .call(() => { //机甲落地
                SdkManager.instance.vibrateShort();
                this.showBlastSmoke();
                this.freshAnimate(Animate.ShowUp, 1, function () {
                    self.showEnd = true;
                    self.attackTest.enabled = true;//显示攻击范围,用于检测小怪进入攻击范围后进行攻击
                    self.attackTest.size.width = self.cameraNode.width - 100;
                    // GameMag.Ins.getMachineBullet(function (bulletNode) {
                    //     bulletNode.setPosition(self.roleNode.x,-100);
                    //     bulletNode.getComponent("bullet").init(self.node.scaleX);
                    //     bulletNode.parent = self.bulletBox;
                    // });
                });
            })
            .start();
    }
    /**
    * 显示爆炸烟雾
    * @param cb 
    */
    showBlastSmoke(cb: Function = null) {
        let self = this;
        AudioMag.getInstance().playSound("炸弹");
        ToolsMag.Ins.playDragonBone(this.blastSmoke, "blast_0", 1, function () {
            self.blastSmoke.active = false;
            self.boomTest.active = false;
            cb && cb();
        })
    }
    freshAnimate(action: string, times: number, cb: Function = null) {
        let self = this;
        ToolsMag.Ins.playDragonBone(this.node, action, times, function () {
            cb && cb();
        })
    }
    enemyBox: any[] = [];
    onCollisionEnter(other, self) {
        if (other.tag === 5 && this.showEnd) {
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
        GameMag.Ins.getMachineBullet(function (bulletNode) {
            const flag = Number(enemy.getComponent("enemy").tag);
            const blood = ConfigMag.Ins.getEnemyData()[flag].blood;
            self.enemyBox[0].blood -= blood;
            bulletNode.setPosition(self.roleNode.x, -100);
            bulletNode.getComponent("bullet").init(self.node.scaleX);
            bulletNode.parent = self.bulletBox;
            self.freshAnimate(Animate.Fire, 1);
        });
    }
    updateSche: number = 0;
    updateTime: number = 0.2;
    update(dt) {
        if (GameMag.Ins.gamePause || GameMag.Ins.gameOver || !this.showEnd) return;
        // this.attackTest.offset.x = -this.cameraNode.x;
        // console.log(this.attackTest.offset.x);
        if (dt < 0.2) this.updateSche += dt;
        if (this.updateSche >= this.updateTime) {
            this.updateSche -= this.updateTime;
            this.fire();
        }
    }
}
