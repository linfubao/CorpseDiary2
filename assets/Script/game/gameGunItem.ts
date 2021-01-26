import GameMag from "../manage/GameMag";
import ConfigMag from "../manage/ConfigMag";
import AudioMag from "../manage/AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class gameGunItem extends cc.Component {

    @property(cc.Label)
    bulletNum: cc.Label = null;
    @property({ type: cc.Prefab, tooltip: "显示购买一次子弹花费多少金币" })
    addBulletNumPre: cc.Prefab = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;
    @property(cc.Node)
    actives: cc.Node = null;
    @property({ type: cc.Node, tooltip: "无尽子弹图标" })
    endlessNode: cc.Node = null;

    index: number = 0;
    gunID: number = 0;
    lastNum: number = 0;//剩余子弹
    cigData: any[] = [];
    recordTryGun: number = null;

    init(gunID, index, sf) {
        this.index = index;
        this.gunID = gunID;
        this.icon.spriteFrame = sf;
        this.cigData = ConfigMag.Ins.getGunData();
        this.initUI();
        cc.director.on("showGunActive" + index, this.showGunActive, this);
        cc.director.on("updateBulletNum" + gunID, this.updateBulletNum, this);
        cc.director.on("switchGun" + index, this.switchGun, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouch, this);
    }
    initUI() {
        this.recordTryGun = GameMag.Ins.tryGun;
        let info = this.cigData[this.gunID];
        if (info.buyOnceCost == 0) {
            this.bulletNum.node.active = false;
            this.endlessNode.active = true;
        } else {
            this.endlessNode.active = false;
            this.bulletNum.node.active = true;
            let localData = GameMag.Ins.gunData;
            let num = null; //子弹数量
            if (GameMag.Ins.tryGun !== null && GameMag.Ins.tryGun == this.gunID) {
                if (GameMag.Ins.tryGunBullet === 0) {
                    this.bulletNum.node.active = false;
                    return;
                }
                num = GameMag.Ins.initTryGunBullet;
            } else {
                num = localData[this.gunID].bulletNum;
            }
            this.lastNum = num;
            if (this.lastNum <= 0) {
                console.log("没有子弹了,图标置黑");
                this.icon.node.color = cc.color(115, 115, 115);
            }
            this.bulletNum.string = String(num);
        }
    }
    showGunActive(index, gunID) {
        this.actives.active = true;
        cc.director.emit("freshRoleGun", index);
        GameMag.Ins.nowGunIndex = index;
        GameMag.Ins.lastGunIndex = index;
        this.scheduleOnce(() => {
            this.checkBulletTip();
        }, 0)
    }
    switchGun() {
        AudioMag.getInstance().playSound("更换枪支");
        let gunList = [];
        let gunEquip = GameMag.Ins.tryGunEquip || GameMag.Ins.useingData.gunEquip;
        gunEquip.forEach(element => {
            if (element >= 0) {
                gunList.push(element);
            }
        });
        // console.log(gunList);
        let i = GameMag.Ins.nowGunIndex;
        if (i == gunList.length - 1) {
            i = 0;
        } else {
            i++;
        }
        GameMag.Ins.nowGunIndex = i;
        this.actives.active = false;
        cc.director.emit("showGunActive" + i, i);
        if (!GameMag.Ins.tryGunEquip) {
            GameMag.Ins.updateUseingDataByGun(gunList[i]);
        } else {
            GameMag.Ins.tryGun = gunList[i];
        }


        // for (let i = 0, len = gunList.length; i < len; i++) {
        //     if (gunList[i] == this.gunID) {
        //         this.actives.active = false;
        //         let arr = this.node.parent.children;
        //         i++;
        //         let index = null;
        //         if (i < len) {
        //             index = i;
        //         } else {
        //             index = 0;
        //         }
        //         if (!GameMag.Ins.tryGunEquip) {
        //             GameMag.Ins.updateUseingDataByGun(gunList[index]);
        //         } else {
        //             GameMag.Ins.tryGun = gunList[index];
        //         }
        //         arr[index].getChildByName("showActive").active = true;
        //         this.iconAction(arr[index].getChildByName("icon"));
        //         cc.director.emit("freshRoleGun", index);
        //         break;
        //     }
        // }
    }
    //更新子弹数量
    updateBulletNum() {
        let gun = GameMag.Ins.tryGun === null ? this.gunID : GameMag.Ins.tryGun;
        let info = this.cigData[gun];
        if (info.buyOnceCost == 0 || this.lastNum <= 0) return;//不需要买子弹的武器
        // console.log(this.recordTryGun, gun);
        if (this.recordTryGun && this.recordTryGun == gun) {
            // console.log("试用的武器");
            GameMag.Ins.tryGunBullet--;
            if (GameMag.Ins.tryGunBullet == 0) {//试用枪的子弹用完后直接清除掉
                this.switchGun();
                GameMag.Ins.tryGun = null;
                this.recordTryGun = null;
                GameMag.Ins.tryGunBullet = null;
                GameMag.Ins.tryGunEquip = null;
                this.node.destroy();
            }
        } else {
            GameMag.Ins.updateGunDataByBulletNum(this.gunID, -1);
        }
        this.lastNum--;
        this.bulletNum.string = String(this.lastNum);
        this.checkBulletTip();
        if (this.lastNum <= 0) {
            console.log("子弹数量不够了");
            this.icon.node.color = cc.color(115, 115, 115);
        }
    }
    //购买子弹
    buyBullet() {
        let info = GameMag.Ins.searchGunData(this.cigData, this.gunID);
        let coin = GameMag.Ins.currency.coin;
        if (info && info.buyOnceCost != 0 && coin >= info.buyOnceCost) {//buyOnceCost:说明这是把可以买子弹的枪
            // console.log(info);
            AudioMag.getInstance().playSound("购买子弹");
            GameMag.Ins.updateGunDataByBulletNum(this.gunID, info.buyOnceNum);
            GameMag.Ins.updateCurrency(0, -info.buyOnceCost);
            cc.director.emit("updateCurrency");
            this.lastNum += info.buyOnceNum;
            this.checkBulletTip();
            this.bulletNum.string = String(this.lastNum);
            this.icon.node.color = cc.color(255, 255, 255);
            //显示扣的钱
            let node = cc.instantiate(this.addBulletNumPre);
            node.getComponent(cc.Label).string = String("-" + info.buyOnceCost);
            node.opacity = 255;
            node.parent = cc.find("Canvas");
            let wps = this.node.parent.convertToWorldSpaceAR(this.node.position);
            let lps = node.convertToNodeSpaceAR(wps);
            node.setPosition(lps.x, lps.y - 200);
            cc.tween(node)
                .to(1, { position: cc.v3(lps.x, lps.y + 200, 0) })
                .call((node) => {
                    node.destroy();
                })
                .start();
        }
    }
    onTouch() {
        if (this.actives.active) {
            console.log("购买子弹");
            if (this.recordTryGun && this.recordTryGun == this.gunID) {
                console.log("试用的枪支不让买子弹");
                return;
            }
            this.buyBullet();
            return;
        }
        AudioMag.getInstance().playSound("按钮音");
        GameMag.Ins.nowGunIndex = this.index;
        // this.node.parent.children.forEach(item => {
        //     item.getChildByName("showActive").active = false;
        // })
        const lastItem = this.node.parent.children[GameMag.Ins.lastGunIndex];
        lastItem.getChildByName("showActive").active = false;
        this.actives.active = true;
        if (!GameMag.Ins.tryGunEquip) {
            GameMag.Ins.updateUseingDataByGun(this.gunID);
        } else {
            GameMag.Ins.tryGun = this.gunID;
        }
        this.iconAction(this.icon.node);
        cc.director.emit("freshRoleGun", this.index);
        GameMag.Ins.lastGunIndex = this.index;
        this.checkBulletTip();
    }
    checkBulletTip() {
        cc.director.emit("buyBulletTip", false);
        let gun = GameMag.Ins.tryGun === null ? this.gunID : GameMag.Ins.tryGun;
        let info = this.cigData[gun];
        if (this.lastNum < GameMag.Ins.bulletWarnNum && info.buyOnceCost > 0) {
            cc.director.emit("buyBulletTip", true, this.node);
        } else if (this.lastNum >= GameMag.Ins.bulletWarnNum) {
            cc.director.emit("buyBulletTip", false);
        }
    }
    iconAction(node) {
        cc.tween(node)
            .to(0.1, { scale: 1.8 })
            .to(0.05, { scale: 1.4 })
            .start();
    }
}
