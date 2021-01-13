import GameMag from "../manage/GameMag";
import ToolsMag from "../manage/ToolsMag";
import AudioMag from "../manage/AudioMag";
import ConfigMag, { roleAnimate, mechaAnimate } from "../manage/ConfigMag";

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

    blood: number = 20;
    touchRole: boolean = false;
    roleBody: cc.Node = null;
    mecha: cc.Node = null;

    onLoad() {
        this.bloodBar.progress = 1;
        this.roleBody = this.role.getChildByName("body");
        cc.director.on("hurtBaby", this.hurted, this);
        cc.director.on("reviveInitBabyBlood", this.reviveInitBabyBlood, this);
    }
    //被小怪攻击
    hurted(hurtNum) {
        if (GameMag.Ins.gamePause || GameMag.Ins.gameOver || this.bloodBar.progress <= 0 || GameMag.Ins.isUseingMecha) return;
        cc.director.emit("showRoleBlood");
        AudioMag.getInstance().playSound("被攻击受伤");    
        let rate = Number((hurtNum / this.blood).toFixed(2));
        this.bloodBar.progress -= rate;
        // console.log(this.bloodBar.progress, "血量:", GameMag.Ins.roleBlood);
        if (this.bloodBar.progress <= 0) {
            AudioMag.getInstance().playSound("死亡");
            cc.director.emit("gameOver", false);
        }
    }
    reviveInitBabyBlood(){
        this.bloodBar.progress = 1;
    }
    onCollisionEnter(other, self) {
        // console.log(other.tag);
        switch (other.tag) {
            case 2:
                const scaleX = this.roleBody.scaleX < 0 ? -1 : 1;
                this.body.scaleX = scaleX;
                break;
            case 5:

                break;
            default:
                break;
        }
    }
}
