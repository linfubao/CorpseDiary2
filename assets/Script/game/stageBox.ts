import ConfigMag from "../manage/ConfigMag";
import GameMag from "../manage/GameMag";
import ToolsMag from "../manage/ToolsMag";
import AudioMag from "../manage/AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StageBox extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    shopAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteAtlas)
    homeMainAtlas: cc.SpriteAtlas = null;
    // @property(cc.Node)
    // box: cc.Node = null;
    // @property(cc.Node)
    // light: cc.Node = null;
    @property(cc.Node)
    stageAssist: cc.Node = null;
    @property(cc.Sprite)
    icon: cc.Sprite = null;

    enemyTag: number = null;
    opened: boolean = false;//箱子是否打开了
    assistData: any = null;
    mechaData: any = null;
    zombieData: number = -1;

    init(enemyTag) {
        this.enemyTag = null;
        this.opened = false;//箱子是否打开了
        this.assistData = null;
        this.mechaData = null;
        this.zombieData = -1;
        this.initUI();
        this.enemyTag = enemyTag;
    }
    initUI() {
        this.stageAssist.stopAllActions();
        const num = Math.floor(Math.random() * 150);
        if (num <= 11) {
            this.showAssist();
        } else if (num >= 12 && num <= 18) {
            this.showMecha();
        } else if (num >= 19 && num <= 21) {
            this.showZombie(0);
        } else if (num >= 22 && num <= 24) {
            this.showZombie(1);
        } else if (num >= 25 && num <= 27) {
            this.showZombie(2);
        } else {
            GameMag.Ins.putStageBox(this.node);
            return;
        }
        this.stageIconAction();
        this.scheduleOnce(() => {
            if (this.node) {
                GameMag.Ins.putStageBox(this.node);
            }
        }, 20);
    }
    stageIconAction() {
        let ps = this.stageAssist.position;
        this.stageAssist.stopAllActions();
        cc.tween(this.stageAssist)
            .repeatForever(
                cc.tween()
                    .to(0.6, { position: cc.v3(0, ps.y + 10, 0) })
                    .to(0.6, { position: cc.v3(0, ps.y - 10, 0) })
            )
            .start();
    }
    //僵尸商店的物品 type: 0:眼睛 1:脑子  2:心脏
    showZombie(type) {
        this.icon.spriteFrame = this.homeMainAtlas.getSpriteFrame("zombie_" + type);
        this.zombieData = type;
    }
    //显示机甲图标
    showMecha() {
        const mechaData = ConfigMag.Ins.getMechaData();
        const i = Math.floor(Math.random() * mechaData.length);
        this.mechaData = mechaData[i];
        this.icon.spriteFrame = this.shopAtlas.getSpriteFrame("mechaIcon_" + i);
    }
    //显示辅助道具图标
    showAssist() {
        const assistData = ConfigMag.Ins.getAssistData();
        const i = Math.floor(Math.random() * assistData.length);
        this.assistData = assistData[i];
        this.icon.spriteFrame = this.shopAtlas.getSpriteFrame("assistIcon_" + i);
    }
    useAssist() {
        // console.log(info);
        let assistType = this.assistData.assistType;
        let assistNum = this.assistData.assistNum;
        let assistTime = this.assistData.assistTime;
        let assistSize = this.assistData.assistSize;
        switch (assistType) {
            case 0://加血
                cc.director.emit("useAssistBlood", assistNum);
                break;
            case 1://减伤
                cc.director.emit("useAssistHurt", assistNum, assistTime);
                break;
            case 2://增加攻击
                cc.director.emit("useAssist", 2, assistNum, assistTime);
                break;
            case 3://增加移动速度
                cc.director.emit("useAssist", 3, assistNum, assistTime);
                break;
            case 4://导弹
                cc.director.emit("useAssistMissile", 3);
                break;
            case 5://机枪
                // cc.director.emit("useAssistMachineGun", assistTime);
                ToolsMag.Ins.getGameResource("prefab/machineGun", function (res: cc.Prefab) {
                    let machineGun = cc.instantiate(res);
                    machineGun.parent = cc.find("Canvas");
                    machineGun.getComponent("machineGun").init(assistTime);
                })
                break;
            case 6:
                ToolsMag.Ins.getGameResource("prefab/uav" + this.assistData.assistSize, function (res: cc.Prefab) {
                    let machineGun = cc.instantiate(res);
                    machineGun.parent = cc.find("Canvas");
                    cc.director.emit("useingUav");
                })
                break;
            default:
                break;
        }
    }
    onCollisionEnter(other, self) {
        // console.log('on collision enter', "other", other, self);
        // if (other.tag == 1) {
        //     if (other.node) {
        //         GameMag.Ins.putBullet(other.node);
        //     }
        //     this.openBox();
        // } else if (other.tag == 6 || other.tag == 8 || other.tag == 11 || other.tag == 14 || other.tag == 18) {
        //     other.node.destroy();
        //     this.openBox();
        // } else if (other.tag == 10) { //棍棒类
        //     other.enabled = false;
        //     this.openBox();
        // }
        if (other.tag === 2) {
            if (this.assistData) {
                this.useAssist();
                return;
            }
            if (this.mechaData) {
                cc.director.emit("onShowMecha", this.mechaData.mechaID);
                return;
            }
            if (this.zombieData >= 0) {
                GameMag.Ins.updateZombieShopData(this.zombieData, 1);
            }
        }
    }
    // openBox() {
    //     this.showLight();
    //     this.opened = true;
    //     this.box.active = false;
    //     this.node.getComponent(cc.Collider).enabled = false;
    //     let type = Math.random() > 0.8 ? true : false;
    //     if (type) {
    //         cc.director.emit("loadEnemy", this.enemyTag);
    //         this.node.destroy();
    //     } else {
    //         this.showAssistAction();
    //     }
    // }
    //开箱光效
    // showLight() {
    //     this.light.scale = 0.6;
    //     this.light.active = true;
    //     cc.tween(this.light)
    //         .to(0.12, { scale: 1.6 })
    //         .call(() => {
    //             if (this.light) {
    //                 this.light.active = false;
    //             }
    //         })
    //         .start();
    // }

}
