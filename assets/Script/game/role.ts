import GameMag from "../manage/GameMag";
import AudioMag from "../manage/AudioMag";
import ToolsMag from "../manage/ToolsMag";
import ConfigMag, { roleAnimate } from "../manage/ConfigMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Role extends cc.Component {

    @property(cc.SpriteAtlas)
    gameAtlas: cc.SpriteAtlas = null;
    @property(cc.ProgressBar)
    bloodBar: cc.ProgressBar = null;
    @property(cc.Node)
    gameRoleBlood: cc.Node = null;
    @property({ type: cc.Sprite, tooltip: "吃了随机出现的辅助道具后出现在头上的玩意" })
    assistStatus: cc.Sprite = null;

    blood: number = 0;
    recordBloodBar: number = 0;
    mechaBlood: number = null;
    useMecha: boolean = false;
    info: any = null;
    assistHurtNum: number = null;
    roleDie: boolean = false;

    onLoad() {
        this.bloodBar.progress = 1;
        const useSkin = GameMag.Ins.trySkin || GameMag.Ins.useingData.skin;
        let info = ConfigMag.Ins.getSkinData()[useSkin];
        this.info = info;
        let baseBlood = info.blood + 10;
        if (useSkin === 3) {
            baseBlood += baseBlood * info.talent;
        } else if (useSkin === 5) {
            this.schedule(this.addBloodSche, 1);
        }
        this.blood = baseBlood;
        cc.director.on("hurtRole", this.hurtRole, this);
        cc.director.on("reviveInitRoleBlood", this.reviveInitRoleBlood, this);
        cc.director.on("useAssistBlood", this.useAssistBlood, this);
        cc.director.on("useAssistHurt", this.useAssistHurt, this);
        cc.director.on("useingMecha", this.useingMecha, this);
    }
    addBloodSche() {
        this.bloodBar.progress += this.info.talent;
        if (this.bloodBar.progress > 1) {
            this.bloodBar.progress = 1;
            GameMag.Ins.roleBlood = 1;
        }
    }
    //复活之后的血量重置
    reviveInitRoleBlood() {
        this.roleDie = false;
        GameMag.Ins.roleBlood = 1;
        this.bloodBar.progress = 1;
        const useSkin = GameMag.Ins.trySkin || GameMag.Ins.useingData.skin;
        if (useSkin === 5) {
            this.unschedule(this.addBloodSche);
            this.schedule(this.addBloodSche, 1);
        }
    }
    //使用了补血道具
    useAssistBlood(num) {
        this.showShine();
        this.bloodBar.progress += (num / 100);
        if (this.bloodBar.progress > 1) {
            this.bloodBar.progress = 1;
            GameMag.Ins.roleBlood = 1;
        }
        // console.log("标记", this.bloodBar.progress);
    }
    //使用增加防御道具
    useAssistHurt(assistNum, assistTime) {
        this.showShine();
        const target = this.assistStatus.node;
        target.active = true;
        this.assistStatus.spriteFrame = this.gameAtlas.getSpriteFrame("status_1");
        let action = cc.sequence(
            cc.scaleTo(0.25, 1.1),
            cc.scaleTo(0.25, 1)
        ).repeat(50);
        target.stopAllActions();
        cc.tween(target)
            .then(action)
            .start();
        this.assistHurtNum = assistNum;
        this.scheduleOnce(() => {
            target.stopAllActions();
            target.active = false;
            this.assistHurtNum = null;
        }, assistTime);
    }
    useingMecha(status) {
        this.useMecha = status;
        if (!status) {
            this.bloodBar.progress = this.recordBloodBar;
            return;
        }
        this.recordBloodBar = this.bloodBar.progress;
        this.bloodBar.progress = 1;
        const useMecha = GameMag.Ins.useingData.mecha;
        const mechaCigData = ConfigMag.Ins.getMechaData()[useMecha];
        this.mechaBlood = mechaCigData.blood + 10;
    }
    //扣血
    hurtRole(num) {
        if (GameMag.Ins.gamePause || GameMag.Ins.gameOver || this.roleDie) return;
        cc.director.emit("showRoleBlood");
        AudioMag.getInstance().playSound("被攻击受伤");
        let hurt = this.assistHurtNum ? num - (num * (this.assistHurtNum / 100)) : num;//暂时减少x%伤害，持续10秒 : 实际伤害
        let hurtNum = hurt - hurt * (this.info.armor / 10); //实际伤害 - 扣除护甲后的实际伤害 = 最后的真正伤害值, 除以10的意思是:护甲2说明伤害减伤20%
        if (this.useMecha) {
            let rate = Number((hurtNum / this.mechaBlood).toFixed(2));
            this.bloodBar.progress -= rate;
            if (this.bloodBar.progress <= 0) { //机甲死亡
                cc.director.emit("hideMecha");
            }
            return;
        }
        let rate = Number((hurtNum / this.blood).toFixed(2));
        this.bloodBar.progress -= rate;
        GameMag.Ins.roleBlood = Number(this.bloodBar.progress.toFixed(2));
        // console.log(this.bloodBar.progress, "血量:", GameMag.Ins.roleBlood);
        if (this.bloodBar.progress <= 0) {
            AudioMag.getInstance().playSound("死亡");
            this.roleDie = true;
            this.unschedule(this.addBloodSche);
            cc.director.emit("gameOver", false);
        }
    }
    //闪耀
    showShine() {
        let self = this;
        ToolsMag.Ins.getGameResource("prefab/shine", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            node.parent = self.node;
        })
    }
    onCollisionEnter(other, self) {
        // console.log('on collision enter', "other", other, self);
        if (other.tag === 21) { //钥匙
            other.node.active = false;
            cc.director.emit("showGameKey");
        }
    }
}
