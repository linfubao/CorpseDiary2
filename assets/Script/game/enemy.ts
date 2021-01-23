import GameMag from "../manage/GameMag";
import { enemyAnimate } from "../manage/ConfigMag";
import ToolsMag from "../manage/ToolsMag";
import ConfigMag from "../manage/ConfigMag";
import AudioMag from "../manage/AudioMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {

    @property(dragonBones.ArmatureDisplay)
    dragon: dragonBones.ArmatureDisplay = null;

    groundY: number = -190; //尸块掉到地板的坐标
    touchRole: boolean = false; //控制伤害时机
    stopMove: boolean = false;//控制小怪移动时机
    touchTongue: boolean = false;
    frozen: boolean = false;
    die: boolean = false;
    attackComplete: boolean = true;
    tag: number = null; //敌怪的标识
    talent: number = null; //主角2的天赋
    talentToGun: number = null; //主角6的天赋
    speed: number = 0;
    blood: number = 0;
    initBlood: number = 0;
    role: cc.Node = null;
    enemyData: any = null;
    taskType: number = null;//任务内容
    corpsePool: cc.NodePool = null;
    corpseArr = [];
    canvasNode: cc.Node = null;
    corpsesBox: cc.Node = null;
    rewardNumBox: cc.Node = null;
    defenseBox: cc.Node = null; //防御模式的那个旋涡
    babyNode: cc.Node = null; //护送模式的那个小子
    babyBodyNode: cc.Node = null; //护送模式的那个小子
    iceNode: cc.Node = null;
    enemyBlood: cc.Node = null;
    enemyStatus: number = null;//0:完整形态  1:损伤状态1  2:损伤状态2
    step0: boolean = false;
    step1: boolean = false;
    step2: boolean = false;
    step3: boolean = false;
    testingRole: boolean = null;

    init(tag, roleNode) {
        this.role = roleNode;
        this.initData(tag);
        this.enemyAnimate(enemyAnimate.Walk0, 0);
    }
    //因为小怪是做了对象池回收的,所以每次拿出来用都要初始化数据
    initData(tag) {
        this.tag = tag;
        const cigData = ConfigMag.Ins.getEnemyData()[tag];
        const useSkin = GameMag.Ins.trySkin || GameMag.Ins.useingData.skin;
        const data = ConfigMag.Ins.getSkinData()[useSkin];
        if (useSkin === 2) {
            this.talent = data.talent;
        } else if (useSkin === 6) {
            this.talentToGun = data.talent;
        }
        this.speed = cigData.speed;
        this.blood = cigData.blood;
        this.initBlood = cigData.blood;
        this.enemyData = cigData;
        this.taskType = GameMag.Ins.taskType;
        this.touchRole = false;
        this.stopMove = false;
        this.touchTongue = false;
        this.frozen = false;
        this.die = false;
        this.attackComplete = true;
        this.enemyStatus = 0;
        this.step0 = false;
        this.step1 = false;
        this.step2 = false;
        this.step3 = false;
        if (this.taskType === 5 || this.taskType === 9 || this.taskType === 4) {
            this.testingRole = false; //不需要检测主角的碰撞
        } else {
            this.testingRole = true;
        }
        this.node.getComponent(cc.BoxCollider).enabled = true;
        this.canvasNode = cc.find("Canvas");
        this.corpsesBox = this.canvasNode.getChildByName("corpsesBox");
        this.rewardNumBox = this.canvasNode.getChildByName("rewardNumBox");
        this.defenseBox = this.canvasNode.getChildByName("defenseBox");
        this.babyNode = this.canvasNode.getChildByName("baby");
        this.babyBodyNode = this.canvasNode.getChildByName("baby").getChildByName("body");
        if (this.taskType === 4) { //防御模式
            this.node.scaleX = 1;
        }
    }
    onCollisionEnter(other, self) {
        // console.log('on collision enter', "other", other, self);
        // console.log(other.tag);
        if (this.die || GameMag.Ins.gameOver || GameMag.Ins.gamePause) return;
        let that = this;
        const useingMecha = GameMag.Ins.useingData.mecha;
        switch (other.tag) {
            case 1://子弹
                if (self.tag == 16) return; //舌头区域不伤害
                GameMag.Ins.putBullet(other.node);
                this.hurted();
                break;
            case 2://主角身体
                if (this.tag == 7 && !this.frozen) {//炸弹怪
                    this.showBlastSmoke();
                    cc.director.emit("hurtRole", this.enemyData.power);
                    return;
                }
                if (this.taskType === 4 || !this.testingRole) return;
                if (self.tag == 16) { //舌头
                    this.touchTongue = true;
                } else {
                    this.touchRole = true;
                    this.stopMove = true;
                }
                if (!this.frozen) {
                    this.attack();
                }
                break;
            case 3: //道具导弹
                if (self.tag == 16) return; //舌头区域不伤害
                this.hurted(ConfigMag.Ins.getMissilePower());
                break;
            case 7: // 爆炸性武器的伤害,伤害区域的显示在子弹脚本
                if (self.tag == 16) return; //舌头区域不伤害
                this.hurted();
                break;
            case 8: //火子弹
                if (self.tag == 16) return; //舌头区域不伤害
                this.hurted();
                break;
            case 10://棍棒类武器
                if (self.tag == 16) return; //舌头区域不伤害
                other.enabled = false;
                this.hurted();
                break;
            case 11://穿透性子弹
                if (self.tag == 16) return; //舌头区域不伤害
                this.hurted();
                break;
            case 12://炸弹怪的爆炸区域
                if (this.tag == 7 || self.tag == 16) return;
                const data = ConfigMag.Ins.getEnemyData();
                // console.log("炸弹怪的伤害值:::", data[7].power);
                this.hurted(data[7].power);
                break;
            case 14://机甲的子弹
                if (useingMecha == 2 || self.tag == 16) return;
                GameMag.Ins.putMechaBullet(other.node);
                const power = ConfigMag.Ins.getMechaData()[useingMecha];
                this.hurted(power.power);
                break;
            case 15://机甲的子弹伤害范围
                if (self.tag == 16) return; //舌头区域不伤害
                const res = ConfigMag.Ins.getMechaData()[useingMecha];
                this.hurted(res.power);
                break;
            case 18: //冰子弹
                if (self.tag == 16) return; //舌头区域不伤害
                this.hurted();
                this.showIce();
                break;
            case 19: //防御区域
                cc.director.emit("updateGameDefenseNum");
                if (this.node) {
                    GameMag.Ins.putEnemy(this.tag, this.node);
                }
                break;
            case 20:
                if (self.tag == 16) { //舌头
                    this.touchTongue = true;
                } else {
                    this.touchRole = true;
                    this.stopMove = true;
                }
                if (this.tag == 7 && !this.frozen) {//炸弹怪
                    this.showBlastSmoke();
                    cc.director.emit("hurtBaby", this.enemyData.power);
                    return;
                }
                if (!this.frozen) {
                    this.attack();
                }
                break;
            default:
                break;
        }
    }
    attack() {
        let self = this;
        const actions = this.judgeEnemyStatus();
        if (this.frozen || this.die || GameMag.Ins.gameOver) return;
        this.enemyAnimate(actions.ready, 1, () => {
            if (GameMag.Ins.gameOver) return;
            if (self.tag != 9) { //吐舌怪的ready不攻击玩家
                self.hurt();
            }
            self.enemyAnimate(actions.attack, 0, () => {
                self.hurt();
            });
        });
    }
    hurt() {
        if ((this.touchRole || this.touchTongue) && !this.frozen && !this.die) {
            if (this.taskType === 5 || this.taskType === 9) {
                cc.director.emit("hurtBaby", this.enemyData.power);//抬手的时候扣一次
                return;
            }
            cc.director.emit("hurtRole", this.enemyData.power);//抬手的时候扣一次
        }
    }
    //显示爆炸烟雾
    showBlastSmoke() {
        let self = this;
        this.node.getChildByName("boom").active = true;//节点在怪身上
        ToolsMag.Ins.getGameResource("prefab/blastSmoke", function (prefab: cc.Prefab) {
            AudioMag.getInstance().playSound("炸弹");
            let node = cc.instantiate(prefab);
            node.scale = 2;
            node.parent = self.node;
            self.dragon.node.active = false;
            ToolsMag.Ins.playDragonBone(node, "blast_0", 1, function () {
                node.destroy();
                if (self.node) {
                    self.dragon.node.active = true;
                    self.node.getChildByName("boom").active = false;
                    GameMag.Ins.putEnemy(self.tag, self.node);
                }
            })
        })
    }
    hurted(hurt: number = null) {
        let self = this;
        let normalPower = null;
        if (GameMag.Ins.isUseingMecha) {
            const info = ConfigMag.Ins.getMechaData()[GameMag.Ins.useingData.mecha];
            normalPower = info.power;
        } else {
            let gun = GameMag.Ins.tryGun === null ? GameMag.Ins.useingData.gun : GameMag.Ins.tryGun;
            const info = ConfigMag.Ins.getGunData()[gun];
            const talent = this.talentToGun != null ? this.talentToGun : 0;
            normalPower = info.power + (info.power * talent);
        }
        const power = normalPower + (normalPower * (GameMag.Ins.useAttackAssist / 100));//吃到增加攻击力的辅助道具
        // console.log("对怪兽的实际伤害", power);
        const talent = this.talent != null ? power * this.talent : 0;
        this.blood -= hurt || (power + talent);
        let diff = this.blood / this.initBlood;
        // console.log(diff);
        if (diff >= 0.8) {
            this.enemyStatus = 1;
            if (!this.step0) {
                this.showCorpse(0);
            }
            this.step0 = true;
        } else if (diff >= 0.6) {
            this.enemyStatus = 1;
            if (!this.step0) {
                this.step0 = true;
                this.showCorpse(0);
            }
            if (!this.step1) {
                this.step1 = true;
                this.showCorpse(1);
            }
        } else if (diff >= 0.4) {
            this.enemyStatus = 2;
            if (!this.step0) {
                this.step0 = true;
                this.showCorpse(0);
            }
            if (!this.step1) {
                this.step1 = true;
                this.showCorpse(1);
            }
            if (!this.step2) {
                this.step2 = true;
                this.showCorpse(2);
            }
        } else if (diff >= 0.2) {
            this.enemyStatus = 2;
            if (!this.step0) {
                this.step0 = true;
                this.showCorpse(0);
            }
            if (!this.step1) {
                this.step1 = true;
                this.showCorpse(1);
            }
            if (!this.step2) {
                this.step2 = true;
                this.showCorpse(2);
            }
            if (!this.step3) {
                this.step3 = true;
                this.showCorpse(3);
            }
        }
        if (diff <= 0) {
            this.enemyDie(enemyAnimate.Die0);
            if (!this.step0) {
                this.step0 = true;
                this.showCorpse(0);
            }
            if (!this.step1) {
                this.step1 = true;
                this.showCorpse(1);
            }
            if (!this.step2) {
                this.step2 = true;
                this.showCorpse(2);
            }
            if (!this.step3) {
                this.step3 = true;
                this.showCorpse(3);
            }
            this.showCorpse(4);
        } else {
            if (this.frozen || this.die || GameMag.Ins.gameOver) return;
            this.hurtedAction();
            if (this.tag == 2) { //眼镜怪被射击不直接死的话速度会瞬间加快
                this.speed = 600;
            }
            const actions = this.judgeEnemyStatus();
            if (this.touchRole) {
                // console.log(this.attackComplete);
                if (!this.attackComplete) return; //为了让怪物的攻击动作完全结束
                this.attackComplete = false;
                // console.log(actions);
                this.enemyAnimate(actions.attack, 0, () => {
                    self.attackComplete = true;
                    if ((self.touchRole || self.touchTongue) && !self.frozen && !self.die) {
                        cc.director.emit("hurtRole", self.enemyData.power);//挠的时候扣一次
                    }
                });
            } else {
                if (this.touchTongue) return;
                this.enemyAnimate(actions.walk, 0);
            }
        }
    }
    //判断下当前怪物的受伤情况
    judgeEnemyStatus() {
        let attack: string = null;
        let walk: string = null;
        let ready: string = null;
        switch (this.enemyStatus) {
            case 0:
                attack = enemyAnimate.Attack0;
                walk = enemyAnimate.Walk0;
                ready = enemyAnimate.Ready0;
                break;
            case 1:
                attack = enemyAnimate.Attack1;
                walk = enemyAnimate.Walk1;
                ready = enemyAnimate.Ready1;
                break;
            case 2:
                attack = enemyAnimate.Attack2;
                walk = enemyAnimate.Walk2;
                ready = enemyAnimate.Ready2;
                break;
            default:
                break;
        }
        return { attack: attack, walk: walk, ready: ready };
    }
    //后仰和停顿的动作
    hurtedAction() {
        let self = this;
        if (this.enemyBlood) {
            this.enemyBlood.getComponent(cc.Animation).play("blood");
        } else {
            ToolsMag.Ins.getGameResource("prefab/enemyBlood", function (prefab: cc.Prefab) {
                let node = cc.instantiate(prefab);
                node.parent = self.node;
                self.enemyBlood = node;
                node.getComponent(cc.Animation).play("blood");
            });
        }
        let flag = this.node.scaleX;
        let target = this.dragon.node;
        target.stopAllActions();
        cc.tween(target)
            .to(0.05, { angle: 3 * -flag })
            .to(0.05, { angle: 0 })
            .start();
    }
    //切换龙骨动作
    enemyAnimate(animate: string, times: number, cb: Function = null) {
        ToolsMag.Ins.playDragonBone(this.dragon.node, animate, times, function () {
            cb && cb();
        });
    }
    //死亡
    enemyDie(animate = null) {
        this.die = true;
        let self = this;
        if (this.tag == 7) {//炸弹怪
            this.showBlastSmoke();
        } else {
            if (this.iceNode) { //有冰块的话要先清除冰块
                this.dragon.timeScale = 1;
                this.iceNode.destroy();
            }
            this.node.getComponent(cc.BoxCollider).enabled = false;
            this.enemyAnimate(animate, 1, () => {
                if (self.node) {
                    GameMag.Ins.putEnemy(self.tag, self.node);
                }
            });
        }
        this.updateMission();
        GameMag.Ins.updateAchieveRecord(0);
        let rewardNum = 0;
        if (this.taskType == 0) {//无限模式才有
            rewardNum = this.enemyData.reward;
        } else {
            let arr = ConfigMag.Ins.getKillReward();
            let index = arr.indexOf(GameMag.Ins.gameKillNum);
            if (index != -1) {
                rewardNum = arr[index] * 10;
            }
        }
        this.showRewardNum(rewardNum);
        cc.director.emit("updateGameKillNum");// 更新杀敌数UI,及杀戮提示
        this.showBlood();
        this.showStageAssist();
    }
    //显示尸块
    showCorpse(index) {
        let self = this;
        GameMag.Ins.getCorpse(this.tag, function (node) {
            // console.log(node);
            node.position = cc.v3(self.node.position.x, -40, 0);
            const part = node.children[index];
            part.opacity = 255;
            let arr = part.children;
            if (arr.length == 0) {
                GameMag.Ins.putCorpse(self.tag, node);
                return;
            }
            node.parent = self.corpsesBox;
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i];
                const dir = i % 2 == 0 ? 1 : -1;
                const lastX = dir * (Math.random() * (150 - 80) + 80);//最后的滑行
                const firstJumpX = dir * (Math.random() * (400 - 120) + 120);
                const sceondJumpX = firstJumpX + (dir * (Math.random() * (130 - 80) + 80));
                const firstHight = Math.random() * (250 - 180) + 180;
                const sceondHight = Math.random() * (25 - 10) + 10;
                const firstAngle = dir * 850;
                const endAngle = Math.random() * (90 - 40) + 40;
                item.scale = 1.5;
                item.opacity = 255;
                let action = cc.sequence(
                    cc.spawn(
                        cc.jumpTo(1.3, cc.v2(firstJumpX, self.groundY), firstHight, 1),
                        cc.rotateTo(1.3, firstAngle)
                    ),
                    cc.spawn(
                        cc.jumpTo(0.4, cc.v2(sceondJumpX, self.groundY), sceondHight, 1),
                        cc.rotateTo(0.4, 100)
                    ),
                    cc.spawn(
                        cc.moveTo(0.7, sceondJumpX + lastX, self.groundY).easing(cc.easeSineOut()),
                        cc.rotateTo(0.7, endAngle)
                    ),
                );
                item.stopAllActions();
                cc.tween(item)
                    .then(action)
                    .delay(0.1)
                    .to(0.5, { opacity: 0 })
                    .call(() => {
                        item.setPosition(0, 0);
                        if (i == arr.length - 1) {
                            if (self.node) {
                                GameMag.Ins.putCorpse(self.tag, node);
                            }
                        }
                    })
                    .start();
            }
        });
    }
    //游戏中随机出现道具宝箱
    showStageAssist() {
        if (GameMag.Ins.gameKillNum % 2 == 0) {//每杀了2个怪就出现一次
            let flag = Math.random() > 0.1 ? false : true;
            if (flag) {
                let self = this;
                ToolsMag.Ins.getGameResource("prefab/stageBox", function (prefab: cc.Prefab) {
                    let node = cc.instantiate(prefab);
                    node.parent = self.canvasNode;
                    node.x = self.node.x;
                    node.getComponent("stageBox").init(self.tag);
                });
            }
        }
    }
    checkKillMission() {
        if (GameMag.Ins.gameKillNum && (GameMag.Ins.gameKillNum < GameMag.Ins.missionData.killNum)) {
            return false;
        }
        return true; //完成本关的击杀任务
    }
    //被冷冻枪击中,没有直接死的话就显示冰块
    showIce() {
        if (this.frozen || this.die || GameMag.Ins.gameOver) return;
        let self = this;
        self.frozen = true;
        ToolsMag.Ins.getGameResource("prefab/ice", function (prefab: cc.Prefab) {
            self.iceNode = cc.instantiate(prefab);
            if (self.node.scaleX > 0) {
                self.iceNode.x = self.node.x;
            } else {
                self.iceNode.x = self.node.x + 50;
            }
            if (self.tag == 10) {
                self.iceNode.scale = 1.3;
            } else if (self.tag == 12) {
                self.iceNode.scale = 1.5;
            }
            if (self.die || GameMag.Ins.gameOver) return;
            self.iceNode.y = -50;
            self.iceNode.parent = self.canvasNode;
            ToolsMag.Ins.removeDragonBone(self.dragon.node);
            self.dragon.timeScale = 0;
            self.scheduleOnce(() => {
                if (self.die || GameMag.Ins.gameOver) return;
                self.dragon.timeScale = 1;
                self.frozen = false;
                const actions = self.judgeEnemyStatus();
                if (self.touchRole || self.touchTongue) {
                    self.enemyAnimate(actions.attack, 0);
                } else {
                    self.enemyAnimate(actions.walk, 0);
                }
                if (self.iceNode) {
                    self.iceNode.destroy();
                }
            }, GameMag.Ins.frezonTime);
        })
    }
    /**
     * 实时判断杀敌任务是否完成
     */
    updateMission() {
        GameMag.Ins.gameKillNum++;
        // console.log(GameMag.Ins.gameKillNum);
        if (this.taskType == 1 || this.taskType == 7) {
            GameMag.Ins.killOver = this.checkKillMission();
            // console.log(this.checkKillMission());
            if (this.checkKillMission()) {
                cc.director.emit("gameOver", true);
            }
        }
    }
    //显示击杀后的奖励数字
    showRewardNum(reward: number) {
        if (reward <= 0) return;
        GameMag.Ins.updateCurrency(0, reward);
        cc.director.emit("updateCurrency");
        let self = this;
        GameMag.Ins.getRewardNum((node) => {
            node.parent = self.rewardNumBox;
            node.stopAllActions();
            node.setPosition(self.node.x, 0);
            node.getComponent(cc.Label).string = String("+" + reward);
            cc.tween(node)
                .to(0.7, { position: cc.v3(node.x, node.y + 120, 0) })
                .call(() => {
                    GameMag.Ins.putRewardNum(node);
                })
                .start();
        });
    }
    //喷血
    showBlood() {
        let self = this;
        ToolsMag.Ins.getGameResource("prefab/enemyBlood", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            node.parent = self.node;
            node.getComponent(cc.Animation).play("blood");
        })
    }
    touchRoleFalse() {
        this.stopMove = false;
        this.judgeExitedAnimate();
    }
    touchTongueFalse() {
        this.stopMove = false;
        this.touchTongue = false;
        this.judgeExitedAnimate();
    }
    onCollisionExit(other, self) {
        // console.log('on collision exit', "other", other.tag, self.tag);
        if (this.die || GameMag.Ins.gameOver) return;
        if (other.tag === 20) {
            this.testingExit(self);
        }
        if (!this.testingRole && other.tag === 2) return; //不检测主角
        if (other.tag === 2) {
            this.testingExit(self);
        }
    }
    testingExit(self) {
        this.touchRole = false;
        if (self.tag == 16) { //舌头怪的舌头
            this.unschedule(this.touchTongueFalse);
            this.scheduleOnce(this.touchTongueFalse, 0.05);
            return;
        }
        if (this.touchTongue) return;
        this.unschedule(this.touchRoleFalse);
        this.scheduleOnce(this.touchRoleFalse, 0.3);
    }
    //判断结束碰撞之后的小怪动作
    judgeExitedAnimate() {
        // console.log(this.enemyStatus);
        if (this.die || GameMag.Ins.gamePause || GameMag.Ins.gameOver) return;
        if (this.enemyStatus === 0) {
            this.enemyAnimate(enemyAnimate.Walk0, 0);
        } else if (this.enemyStatus === 1) {
            this.enemyAnimate(enemyAnimate.Walk1, 0);
        } else if (this.enemyStatus === 2) {
            this.enemyAnimate(enemyAnimate.Walk2, 0);
        }
    }
    update(dt) {
        if (this.frozen || this.die || GameMag.Ins.gamePause || GameMag.Ins.gameOver) return;
        if (this.taskType === 4) { //防御模式
            this.node.x -= this.speed * dt;
            return;
        }
        let x = null;
        const dis = 15;
        if (!this.testingRole) {
            x = this.babyNode.x;
            if (this.node.x > x + dis && this.node.scaleX < 0) { //怪物在baby右侧
                this.node.scaleX = 1;
            } else if (this.node.x < x - dis && this.node.scaleX > 0) {
                this.node.scaleX = -1;
            }
        } else {
            x = this.role.x;
            if (this.node.x > x + dis && this.node.scaleX < 0) { //怪物在主角右侧
                this.node.scaleX = 1;
            } else if (this.node.x < x - dis && this.node.scaleX > 0) {
                this.node.scaleX = -1;
            }
        }
        if (this.stopMove || this.touchTongue) return;
        let flag = x < this.node.x ? 1 : -1;
        this.node.x += -flag * this.speed * dt;
    }
}