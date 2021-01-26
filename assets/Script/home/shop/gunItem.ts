import GameMag from "../../manage/GameMag";
import AudioMag from "../../manage/AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GunItem extends cc.Component {

    @property(cc.SpriteAtlas)
    shopAtlas: cc.SpriteAtlas = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Sprite)
    gunName: cc.Sprite = null;
    @property(cc.Node)
    actives: cc.Node = null;
    @property(cc.Node)
    coin: cc.Node = null;
    @property(cc.Node)
    diamond: cc.Node = null;
    @property(cc.Label)
    coinLab: cc.Label = null;
    @property(cc.Label)
    diamondLab: cc.Label = null;
    @property(cc.Node)
    lock: cc.Node = null;
    @property({ type: cc.Node, tooltip: "已经获得的武器" })
    getedIcon: cc.Node = null;

    index: number = 0
    gunCigData: any = null;

    init(index, data, gunNameSf) {
        // const gun = GameMag.Ins.useingData.gun;
        // if (data.gunID == gun) { //默认显示最近使用过的武器
        //     this.showAction();
        //     cc.director.emit("freshGunPageUI", data);
        // }
        if (data.gunID == 6) { //默认显示初始枪
            this.showAction();
            cc.director.emit("freshGunPageUI", data);
        }
        this.gunCigData = data;
        this.index = index;
        // this.icon.spriteFrame = sf;
        this.gunName.spriteFrame = gunNameSf;
        this.freshGunItemUI();
        cc.director.on("freshGunItemUI", this.freshGunItemUI, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onStartTouch, this);
    }
    freshGunItemUI() {
        let localGunData = GameMag.Ins.gunData[this.index];
        this.lock.active = !localGunData.lockStatus;
        this.getedIcon.active = localGunData.geted;
        let status = this.gunCigData.costNum == 0 || localGunData.geted ? true : false;
        let gunLv = localGunData.gunLv;
        if (gunLv === 2) {
            gunLv = 1;
        }
        this.icon.spriteFrame = this.shopAtlas.getSpriteFrame(`gun_${this.index}_${gunLv}`);
        // console.log(status);
        if (!status) {
            if (this.gunCigData.buyType == 0) {
                this.coinLab.string = String(this.gunCigData.costNum);
                this.coin.active = true;
                this.diamond.active = false;
            } else {
                this.diamondLab.string = String(this.gunCigData.costNum);
                this.coin.active = false;
                this.diamond.active = true;
            }
        } else {
            this.coin.active = !status;
            this.diamond.active = !status;
        }
    }
    onStartTouch() {
        AudioMag.getInstance().playSound("按钮音");
        this.node.parent.children.forEach(item => {
            item.getChildByName("active").active = false;
            item.getChildByName("active").stopAllActions();
        })
        this.showAction();
        cc.director.emit("freshGunPageUI", this.gunCigData);
    }
    //选中的边框闪烁效果
    showAction() {
        this.actives.active = true;
        this.actives.opacity = 255;
        let _t = 0.8;
        cc.tween(this.actives)
            .repeatForever(
                cc.tween().to(_t, { opacity: 0 }).to(_t, { opacity: 255 })
            )
            .start();
    }
}
