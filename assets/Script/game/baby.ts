import GameMag from "../manage/GameMag";
import ToolsMag from "../manage/ToolsMag";
import AudioMag from "../manage/AudioMag";
import ConfigMag, { roleAnimate, mechaAnimate } from "../manage/ConfigMag";

enum BabyAnimation {
    Stay = "stay",
    Walk = "walk",
    Hurt = "injured"
}
const { ccclass, property } = cc._decorator;
//要护送的小弟,我叫他baby
@ccclass
export default class Baby extends cc.Component {

    @property(cc.Node)
    role: cc.Node = null;
    @property(cc.Node)
    body: cc.Node = null;
    @property(cc.ProgressBar)
    bloodBar: cc.ProgressBar = null;
    @property(dragonBones.ArmatureDisplay)
    babyDragon: dragonBones.ArmatureDisplay = null;

    blood: number = 20;
    touchRole: boolean = false;
    roleBody: cc.Node = null;
    mecha: cc.Node = null;
    initBabyDiff: number = 300;
    moveSpeed: number = 150;
    walkStatus: boolean = null;
    stayStatus: boolean = null;

    onLoad() {
        this.bloodBar.progress = 1;
        this.roleBody = this.role.getChildByName("body");
        this.freshBabyUI();
        this.schedule(() => {
            if (this.walkStatus) return;
            this.freshBabyAnimate(BabyAnimation.Stay, 1);
        }, 0.62);
        cc.director.on("hurtBaby", this.hurted, this);
        cc.director.on("reviveInitBabyBlood", this.reviveInitBabyBlood, this);
    }
    freshBabyUI() {
        const strArr = ["foreleg", "hind_leg", "chest", "back_arm", "head", "head_injured", "forearm"];
        const index = Math.floor(Math.random() * 2);
        for (let i = 0, len = strArr.length; i < len; i++) {
            let robotArmature = this.babyDragon.armature();
            let robotSlot = robotArmature.getSlot(strArr[i]);
            robotSlot.displayIndex = index; //龙骨里面的顺序
        }
    }
    freshBabyAnimate(action: string, times: number, cb: Function = null) {
        ToolsMag.Ins.playDragonBone(this.babyDragon.node, action, times, function () {
            cb && cb();
        });
    }
    //被小怪攻击
    hurted(hurtNum) {
        if (GameMag.Ins.gamePause || GameMag.Ins.gameOver || this.bloodBar.progress <= 0) return;
        let self = this;
        cc.director.emit("showRoleBlood");
        AudioMag.getInstance().playSound("被攻击受伤");
        let rate = Number((hurtNum / this.blood).toFixed(2));
        this.bloodBar.progress -= rate;
        this.freshBabyAnimate(BabyAnimation.Hurt, 0, function () {
            self.freshBabyAnimate(BabyAnimation.Stay, 0);
        });
        // console.log(this.bloodBar.progress, "血量:", GameMag.Ins.roleBlood);
        if (this.bloodBar.progress <= 0) {
            AudioMag.getInstance().playSound("死亡");
            cc.director.emit("gameOver", false);
        }
    }
    reviveInitBabyBlood() {
        this.bloodBar.progress = 1;
    }
    onCollisionEnter(other, self) {
        // console.log(other.tag);
        if (other.tag == 2) {
            const scaleX = this.roleBody.scaleX < 0 ? -1 : 1;
            this.body.scaleX = scaleX;
        }
    }
    update(dt) {
        let babyX = this.node.x;
        const diff = this.role.x - babyX; //主角和baby之间的距离
        if (diff > this.initBabyDiff) {
            this.node.x += dt * this.moveSpeed;
            if (!this.walkStatus) {
                this.walkStatus = true;
                this.freshBabyAnimate(BabyAnimation.Walk, 0);
            }
            return;
        }
        if (diff < -this.initBabyDiff) {
            this.node.x -= dt * this.moveSpeed;
            if (!this.walkStatus) {
                this.walkStatus = true;
                this.freshBabyAnimate(BabyAnimation.Walk, 0);
            }
            return;
        }
        this.walkStatus = false;
    }
}
