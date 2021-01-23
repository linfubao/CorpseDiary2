import GameMag from "../../manage/GameMag";
import AudioMag from "../../manage/AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GunItem extends cc.Component {

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
    gunData: any = null;
    init(index, data, sf, gunNameSf) {
        const gun = GameMag.Ins.useingData.gun;
        if (data.gunID == gun) { //默认显示最近使用过的武器
            this.showAction();
            cc.director.emit("freshGunPageUI", data);
        }
        // if (data.gunID == 3) { //默认显示第一把初始枪
        //     this.showAction();
        //     cc.director.emit("freshGunPageUI", data);
        // }
        this.gunData = data;
        this.index = index;
        this.icon.spriteFrame = sf;
        // this.gunName.spriteFrame = gunNameSf;
        this.freshGunItemUI();
        this.node.on(cc.Node.EventType.TOUCH_END, this.onStartTouch, this);
        cc.director.on("freshGunItemUI", this.freshGunItemUI, this);
    }
    freshGunItemUI() {
        let localGunData = GameMag.Ins.gunData[this.index];
        this.lock.active = !localGunData.lockStatus;
        this.getedIcon.active = localGunData.geted;
        let status = this.gunData.costNum == 0 || localGunData.geted ? true : false;
        // console.log(status);
        if (!status) {
            if (this.gunData.buyType == 0) {
                this.coinLab.string = String(this.gunData.costNum);
                this.coin.active = true;
                this.diamond.active = false;
            } else {
                this.diamondLab.string = String(this.gunData.costNum);
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
        cc.director.emit("freshGunPageUI", this.gunData);
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
