import GameMag from "../../manage/GameMag";
import AudioMag from "../../manage/AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GunEquip extends cc.Component {

    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.SpriteAtlas)
    shopAtlas: cc.SpriteAtlas = null;

    index: number = null;
    gunID: number = null;

    init(gunID, index) {
        this.index = index;
        this.gunID = gunID;
        this.freshGunIcon(gunID);
        cc.director.on("freshGunIcon", this.freshGunIcon, this);
        cc.director.on("refreshGunIcon" + this.index, this.refreshGunIcon, this);
        cc.director.on("upGunEquip" + index, this.upGunEquip, this);
        cc.director.on("downGunEquip" + index, this.downGunEquip, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onStartTouch, this);
    }
    freshGunIcon(gunID) {
        if (gunID < 0) return;
        let gunLv = GameMag.Ins.gunData[gunID].gunLv;
        if (gunLv === 2) {
            gunLv = 1;
        }
        this.icon.spriteFrame = this.shopAtlas.getSpriteFrame(`gun_${gunID}_${gunLv}`);
    }
    //关闭升级界面的时候更新
    refreshGunIcon(gunID) {
        this.freshGunIcon(gunID);
    }
    //武器装备
    upGunEquip(gunID) {
        this.freshGunIcon(gunID);
        GameMag.Ins.updateUseingDataByGunEquip(gunID, this.index);
    }
    //解除装备
    downGunEquip() {
        cc.tween(this.icon.node)
            .to(0.2, { scale: 1.2 })
            .to(0.2, { scale: 0 })
            .call((node) => {
                this.icon.spriteFrame = null;
                node.scale = 1;
                GameMag.Ins.updateUseingDataByGunEquip(-2, this.index);
                cc.director.emit("freshEquipBtns");
            })
            .start();
    }
    onStartTouch() {
        AudioMag.getInstance().playSound("按钮音");
        this.downGunEquip();
    }
}
