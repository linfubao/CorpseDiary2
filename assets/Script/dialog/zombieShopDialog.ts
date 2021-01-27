import GameMag from "../manage/GameMag";
import ToolsMag from "../manage/ToolsMag";
import ConfigMag from "../manage/ConfigMag";
import AudioMag from "../manage/AudioMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ZombieShopDialog extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.Node)
    upNode: cc.Node = null;
    @property(cc.Node)
    buttomNode: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    closeBtn: cc.Node = null;
    @property(cc.Node)
    getNumBox: cc.Node = null;

    index: number = 0;
    len: number = 0;
    costArr: number[] = [5, 5, 5, 3, 4, 5, 5, 10];

    onInit() {
        this.freshZombieNum();
        this.freshRewardUI();
        this.showAction();
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, function () {
            ToolsMag.Ins.buttonAction(this.closeBtn, function () {
                DialogMag.Ins.removePlane(DialogPath.ZombieShopDialog);
            }.bind(this));
        }, this);
    }
    //出场动效
    showAction() {
        // const height = cc.view.getVisibleSize().height / 2;
        cc.tween(this.buttomNode)
            .to(0.2, { position: cc.v3(0, -90, 0) })
            .to(0.05, { position: cc.v3(0, -100, 0) })
            .call(() => {
                cc.tween(this.upNode)
                    .to(0.12, { position: cc.v3(0, 260, 0) })
                    .to(0.05, { position: cc.v3(0, 270, 0) })
                    .call(() => {
                        
                    })
                    .start();
            })
            .start();
    }
    freshZombieNum() {
        const zombieShopData = GameMag.Ins.zombieShopData;
        zombieShopData.forEach((item, index) => {
            this.getNumBox.children[index].getComponent(cc.Label).string = String("x" + item);
        });
    }
    freshRewardUI() {
        this.content.children.forEach((item, index) => {
            const res = this.freshRewardData(index);
            item.getChildByName("exchange").active = res;
        });
    }
    freshRewardData(tag): boolean {
        let res = false;
        const zombieShopData = GameMag.Ins.zombieShopData;//0:眼睛  1:大脑  2:心脏
        const eysNum = zombieShopData[0];
        const brainNum = zombieShopData[1];
        const heartNum = zombieShopData[2];
        const costNum = this.costArr[tag];
        switch (Number(tag)) {
            case 0:
                if (eysNum >= costNum) {
                    res = true;
                }
                break;
            case 1:
                if (brainNum >= costNum) {
                    res = true;
                }
                break;
            case 2:
                if (heartNum >= costNum) {
                    res = true;
                }
                break;
            case 3:
                if (eysNum >= costNum && brainNum >= costNum) {
                    res = true;
                }
                break;
            case 4:
                if (brainNum >= costNum && heartNum >= costNum) {
                    res = true;
                }
                break;
            case 5:
                if (eysNum >= costNum && heartNum >= costNum) {
                    res = true;
                }
                break;
            case 6:
                if (eysNum >= costNum && brainNum >= costNum && heartNum >= costNum) {
                    res = true;
                }
                break;
            case 7:
                if (eysNum >= costNum && brainNum >= costNum && heartNum >= costNum) {
                    res = true;
                }
                break;
            default:
                break;
        }
        return res;
    }
    reward(tag) {
        switch (Number(tag)) {
            case 0:
                GameMag.Ins.updateAssistData(0, 1);
                GameMag.Ins.updateZombieShopData(0, -this.costArr[tag]);
                break;
            case 1:
                GameMag.Ins.updateAssistData(2, 1);
                GameMag.Ins.updateZombieShopData(1, -this.costArr[tag]);
                break;
            case 2:
                GameMag.Ins.updateAssistData(6, 1);
                GameMag.Ins.updateZombieShopData(2, -this.costArr[tag]);
                break;
            case 3:
                GameMag.Ins.updateAssistData(4, 1);
                GameMag.Ins.updateZombieShopData(0, -this.costArr[tag]);
                GameMag.Ins.updateZombieShopData(1, -this.costArr[tag]);
                break;
            case 4:
                GameMag.Ins.updateAssistData(8, 1);
                GameMag.Ins.updateZombieShopData(0, -this.costArr[tag]);
                GameMag.Ins.updateZombieShopData(1, -this.costArr[tag]);
                break;
            case 5:
                GameMag.Ins.updateAssistData(10, 1);
                GameMag.Ins.updateZombieShopData(0, -this.costArr[tag]);
                GameMag.Ins.updateZombieShopData(1, -this.costArr[tag]);
                break;
            case 6:
                GameMag.Ins.updateCurrency(2, 1);
                GameMag.Ins.updateZombieShopData(0, -this.costArr[tag]);
                GameMag.Ins.updateZombieShopData(1, -this.costArr[tag]);
                GameMag.Ins.updateZombieShopData(2, -this.costArr[tag]);
                break;
            case 7:
                GameMag.Ins.updateCurrency(1, 10);
                GameMag.Ins.updateZombieShopData(0, -this.costArr[tag]);
                GameMag.Ins.updateZombieShopData(1, -this.costArr[tag]);
                GameMag.Ins.updateZombieShopData(2, -this.costArr[tag]);
                break;
            default:
                break;
        }
        this.freshZombieNum();
        this.freshRewardUI();
    }
    exchange0(e, tag) {
        this.reward(tag);
    }
    exchange1(e, tag) {
        this.reward(tag);
    }
    exchange2(e, tag) {
        this.reward(tag);
    }
    exchange3(e, tag) {
        this.reward(tag);
    }
    exchange4(e, tag) {
        this.reward(tag);
    }
    exchange5(e, tag) {
        this.reward(tag);
    }
    exchange6(e, tag) {
        this.reward(tag);
    }
    exchange7(e, tag) {
        this.reward(tag);
    }
}
