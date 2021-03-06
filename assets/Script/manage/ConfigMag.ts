import GameMag from "./GameMag";

/**
 * killNum       杀敌数
 * rewardType    奖励类型  0:金币  1:砖石
 * rewardNum     奖励金额
 */
const taskData = [
    {
        "id": 0,
        "killNum": 100,
        "rewardType": 0,
        "rewardNum": 500
    },
    {
        "id": 1,
        "killNum": 250,
        "rewardType": 0,
        "rewardNum": 1000
    },
    {
        "id": 2,
        "killNum": 500,
        "rewardType": 0,
        "rewardNum": 2500
    },
    {
        "id": 3,
        "killNum": 1000,
        "rewardType": 1,
        "rewardNum": 5
    },
    {
        "id": 4,
        "killNum": 2000,
        "rewardType": 1,
        "rewardNum": 10
    }
];
/**
 * 成就任务
 * rewardType  奖励类型  0:金币  1:砖石
 * rewardNum   奖励金额
 * taskType    0:僵尸 1:boss 2:累计时长 3:天数 4:拥有武器数
 * target      总进度
 */
const achieveData = [
    {
        "id": 0,
        "rewardType": 0,
        "rewardNum": 500,
        "taskType": 0,
        "target": 1
    },
    {
        "id": 1,
        "rewardType": 0,
        "rewardNum": 1000,
        "taskType": 0,
        "target": 100
    },
    {
        "id": 2,
        "rewardType": 0,
        "rewardNum": 2500,
        "taskType": 0,
        "target": 500
    },
    {
        "id": 3,
        "rewardType": 0,
        "rewardNum": 2500,
        "taskType": 1,
        "target": 10
    },
    {
        "id": 4,
        "rewardType": 0,
        "rewardNum": 5000,
        "taskType": 0,
        "target": 1000
    },
    {
        "id": 5,
        "rewardType": 1,
        "rewardNum": 10,
        "taskType": 1,
        "target": 50
    },
    {
        "id": 6,
        "rewardType": 0,
        "rewardNum": 20000,
        "taskType": 0,
        "target": 5000
    },
    {
        "id": 7,
        "rewardType": 1,
        "rewardNum": 10,
        "taskType": 0,
        "target": 10000
    },
    {
        "id": 8,
        "rewardType": 0,
        "rewardNum": 50000,
        "taskType": 0,
        "target": 50000
    },
    {
        "id": 9,
        "rewardType": 1,
        "rewardNum": 100,
        "taskType": 0,
        "target": 100000
    },
    {
        "id": 10,
        "rewardType": 0,
        "rewardNum": 500,
        "taskType": 2,
        "target": 10
    },
    {
        "id": 11,
        "rewardType": 0,
        "rewardNum": 1000,
        "taskType": 2,
        "target": 30
    },
    {
        "id": 12,
        "rewardType": 0,
        "rewardNum": 5000,
        "taskType": 2,
        "target": 60
    },
    {
        "id": 13,
        "rewardType": 1,
        "rewardNum": 10,
        "taskType": 2,
        "target": 120
    },
    {
        "id": 14,
        "rewardType": 0,
        "rewardNum": 30000,
        "taskType": 2,
        "target": 300
    },
    {
        "id": 15,
        "rewardType": 1,
        "rewardNum": 50,
        "taskType": 2,
        "target": 600
    },
    {
        "id": 16,
        "rewardType": 0,
        "rewardNum": 500,
        "taskType": 3,
        "target": 5
    },
    {
        "id": 17,
        "rewardType": 0,
        "rewardNum": 1000,
        "taskType": 3,
        "target": 10
    },
    {
        "id": 18,
        "rewardType": 0,
        "rewardNum": 1000,
        "taskType": 3,
        "target": 15
    },
    {
        "id": 19,
        "rewardType": 0,
        "rewardNum": 2000,
        "taskType": 3,
        "target": 20
    },
    {
        "id": 20,
        "rewardType": 1,
        "rewardNum": 10,
        "taskType": 3,
        "target": 25
    },
    {
        "id": 21,
        "rewardType": 0,
        "rewardNum": 3000,
        "taskType": 3,
        "target": 30
    },
    {
        "id": 22,
        "rewardType": 0,
        "rewardNum": 5000,
        "taskType": 3,
        "target": 40
    },
    {
        "id": 23,
        "rewardType": 1,
        "rewardNum": 30,
        "taskType": 3,
        "target": 60
    },
    {
        "id": 24,
        "rewardType": 0,
        "rewardNum": 100000,
        "taskType": 4,
        "target": 10
    },
    {
        "id": 25,
        "rewardType": 1,
        "rewardNum": 100,
        "taskType": 4,
        "target": 24
    }
]
/**
 * 武器数据
 * gunDescType   武器效果类型 0:近战  1:范围  2:半自动  3:全自动  4:穿透  5:爆炸性 6:范围+冰冻
 * gunType       0:枪械  1: 非枪械
 * power         攻击
 * speed         速度
 * buyOnceNum    买一次子弹增加多少数量
 * buyOnceCost   买一次子弹花费多少钱
 * buyType       购买方式0:金币  1:砖石
 * costNum       购买花费的金额
 * lockStatus    0: 已解锁   1:未解锁
 * unlockLevel   通过几关才能解锁,这游戏的关卡值用天数表示的
 * unlockDiamond 或者花费多少砖石解锁,关卡数到了就直接解锁
 */
const gunData = [
    {
        "gunID": 0,
        "gunDescType": 0,
        "gunType": 1,
        "power": 2,
        "speed": 2,
        "buyOnceNum": 0,
        "buyOnceCost": 0,
        "buyType": 0,
        "costNum": 3000,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 1,
        "gunDescType": 1,
        "gunType": 1,
        "power": 8,
        "speed": 2,
        "buyOnceNum": 0,
        "buyOnceCost": 0,
        "buyType": 1,
        "costNum": 100,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 2,
        "gunDescType": 1,
        "gunType": 1,
        "power": 9,
        "speed": 2,
        "buyOnceNum": 0,
        "buyOnceCost": 0,
        "buyType": 1,
        "costNum": 200,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 3,
        "gunDescType": 2,
        "gunType": 0,
        "power": 1,
        "speed": 2,
        "buyOnceNum": 0,
        "buyOnceCost": 0,
        "buyType": 0,
        "costNum": 0,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 4,
        "gunDescType": 2,
        "gunType": 0,
        "power": 3,
        "speed": 3,
        "buyOnceNum": 30,
        "buyOnceCost": 100,
        "buyType": 0,
        "costNum": 6000,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 5,
        "gunDescType": 2,
        "gunType": 0,
        "power": 6,
        "speed": 3,
        "buyOnceNum": 20,
        "buyOnceCost": 200,
        "buyType": 0,
        "costNum": 15000,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 6,
        "gunDescType": 3,
        "gunType": 0,
        "power": 1,
        "speed": 7,
        "buyOnceNum": 30,
        "buyOnceCost": 100,
        "buyType": 0,
        "costNum": 7500,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 7,
        "gunDescType": 3,
        "gunType": 0,
        "power": 2,
        "speed": 8,
        "buyOnceNum": 75,
        "buyOnceCost": 150,
        "buyType": 0,
        "costNum": 13500,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 8,
        "gunDescType": 2,
        "gunType": 0,
        "power": 5,
        "speed": 3,
        "buyOnceNum": 30,
        "buyOnceCost": 100,
        "buyType": 1,
        "costNum": 150,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 9,
        "gunDescType": 3,
        "gunType": 0,
        "power": 4,
        "speed": 5,
        "buyOnceNum": 50,
        "buyOnceCost": 300,
        "buyType": 0,
        "costNum": 30000,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 10,
        "gunDescType": 3,
        "gunType": 0,
        "power": 5,
        "speed": 6,
        "buyOnceNum": 40,
        "buyOnceCost": 450,
        "buyType": 0,
        "costNum": 50000,
        "lockStatus": false,
        "unlockLevel": 5,
        "unlockDiamond": 10
    },
    {
        "gunID": 11,
        "gunDescType": 2,
        "gunType": 0,
        "power": 7,
        "speed": 1,
        "buyOnceNum": 25,
        "buyOnceCost": 500,
        "buyType": 0,
        "costNum": 45000,
        "lockStatus": false,
        "unlockLevel": 5,
        "unlockDiamond": 10
    },
    {
        "gunID": 12,
        "gunDescType": 3,
        "gunType": 0,
        "power": 5,
        "speed": 1,
        "buyOnceNum": 30,
        "buyOnceCost": 1200,
        "buyType": 1,
        "costNum": 50,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 13,
        "gunDescType": 3,
        "gunType": 0,
        "power": 4,
        "speed": 9,
        "buyOnceNum": 55,
        "buyOnceCost": 2000,
        "buyType": 0,
        "costNum": 80000,
        "lockStatus": false,
        "unlockLevel": 10,
        "unlockDiamond": 20
    },
    {
        "gunID": 14,
        "gunDescType": 3,
        "gunType": 0,
        "power": 6,
        "speed": 7,
        "buyOnceNum": 0,
        "buyOnceCost": 0,
        "buyType": 1,
        "costNum": 300,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 15,
        "gunDescType": 1,
        "gunType": 0,
        "power": 5,
        "speed": 3,
        "buyOnceNum": 20,
        "buyOnceCost": 1500,
        "buyType": 0,
        "costNum": 90000,
        "lockStatus": false,
        "unlockLevel": 12,
        "unlockDiamond": 25
    },
    {
        "gunID": 16,
        "gunDescType": 6,
        "gunType": 0,
        "power": 7,
        "speed": 3,
        "buyOnceNum": 20,
        "buyOnceCost": 1500,
        "buyType": 1,
        "costNum": 200,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 17,
        "gunDescType": 4,
        "gunType": 0,
        "power": 8,
        "speed": 1,
        "buyOnceNum": 35,
        "buyOnceCost": 2000,
        "buyType": 0,
        "costNum": 100000,
        "lockStatus": false,
        "unlockLevel": 15,
        "unlockDiamond": 30
    },
    {
        "gunID": 18,
        "gunDescType": 1,
        "gunType": 1,
        "power": 8,
        "speed": 2,
        "buyOnceNum": 0,
        "buyOnceCost": 0,
        "buyType": 0,
        "costNum": 120000,
        "lockStatus": false,
        "unlockLevel": 20,
        "unlockDiamond": 35
    },
    {
        "gunID": 19,
        "gunDescType": 5,
        "gunType": 0,
        "power": 9,
        "speed": 1,
        "buyOnceNum": 35,
        "buyOnceCost": 2000,
        "buyType": 0,
        "costNum": 180000,
        "lockStatus": false,
        "unlockLevel": 20,
        "unlockDiamond": 35
    },
    {
        "gunID": 20,
        "gunDescType": 5,
        "gunType": 0,
        "power": 10,
        "speed": 1,
        "buyOnceNum": 30,
        "buyOnceCost": 2000,
        "buyType": 0,
        "costNum": 250000,
        "lockStatus": false,
        "unlockLevel": 25,
        "unlockDiamond": 40
    },
    {
        "gunID": 21,
        "gunDescType": 5,
        "gunType": 0,
        "power": 10,
        "speed": 2,
        "buyOnceNum": 20,
        "buyOnceCost": 2000,
        "buyType": 1,
        "costNum": 500,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    },
    {
        "gunID": 22,
        "gunDescType": 3,
        "gunType": 0,
        "power": 9,
        "speed": 10,
        "buyOnceNum": 20,
        "buyOnceCost": 1500,
        "buyType": 0,
        "costNum": 500000,
        "lockStatus": false,
        "unlockLevel": 30,
        "unlockDiamond": 50
    },
    {
        "gunID": 23,
        "gunDescType": 4,
        "gunType": 0,
        "power": 10,
        "speed": 5,
        "buyOnceNum": 35,
        "buyOnceCost": 2500,
        "buyType": 1,
        "costNum": 1500,
        "lockStatus": true,
        "unlockLevel": 0,
        "unlockDiamond": 0
    }
]
/**
 * armor    护甲
 * speed    速度
 * blood    血量
 * buyType     购买方式0:金币  1:砖石
 * costNum     购买花费的金额
 */
const skinData = [
    {
        "skinID": 0,
        "armor": 2,
        "speed": 5,
        "blood": 2,
        "buyType": 0,
        "costNum": 0
    },
    {
        "skinID": 1,
        "armor": 3,
        "speed": 8,
        "blood": 3,
        "buyType": 0,
        "costNum": 30000
    },
    {
        "skinID": 2,
        "armor": 3,
        "speed": 6,
        "blood": 5,
        "buyType": 0,
        "costNum": 100000
    },
    {
        "skinID": 3,
        "armor": 6,
        "speed": 6,
        "blood": 8,
        "buyType": 1,
        "costNum": 200
    },
    {
        "skinID": 4,
        "armor": 8,
        "speed": 8,
        "blood": 10,
        "buyType": 1,
        "costNum": 500
    }
];
/**
 * 机甲数据
 * power       攻击
 * speed       速度 
 * keepTime    出现持续时间
 * buyType     购买方式0:金币  1:砖石
 * costNum     购买花费的金额
 */
const mechaData = [
    {
        "mechaID": 0,
        "power": 7,
        "speed": 5,
        "keepTime": 35,
        "buyType": 0,
        "costNum": 5000
    },
    {
        "mechaID": 1,
        "power": 7,
        "speed": 7,
        "keepTime": 70,
        "buyType": 1,
        "costNum": 15
    },
    {
        "mechaID": 2,
        "power": 10,
        "speed": 4,
        "keepTime": 90,
        "buyType": 1,
        "costNum": 20
    }
];
/**
 * 辅助道具数据
 * assistType  "类型"   0:恢复血量  1:减少伤害  2:增加攻击  3:增加移动速度  4:呼叫支援  
 * assistSize  小中大:123
 * assistNum   效果数值百分比  当前剩余的血量+角色总量*百分比
 * assistTime  效果持续时间
 * buyType     购买方式0:金币  1:砖石
 * costNum     购买花费的金额
 */
const assistData = [
    {
        "assistID": 0,
        "assistType": 0,
        "assistSize": 1,
        "assistNum": 50,
        "assistTime": 0,
        "buyType": 0,
        "costNum": 500
    },
    {
        "assistID": 1,
        "assistType": 0,
        "assistSize": 2,
        "assistNum": 75,
        "assistTime": 0,
        "buyType": 0,
        "costNum": 750
    },
    {
        "assistID": 2,
        "assistType": 0,
        "assistSize": 3,
        "assistNum": 100,
        "assistTime": 0,
        "buyType": 0,
        "costNum": 1000
    },
    {
        "assistID": 3,
        "assistType": 1,
        "assistSize": 1,
        "assistNum": 75,
        "assistTime": 10,
        "buyType": 0,
        "costNum": 1000
    },
    {
        "assistID": 4,
        "assistType": 1,
        "assistSize": 2,
        "assistNum": 90,
        "assistTime": 20,
        "buyType": 0,
        "costNum": 2000
    },
    {
        "assistID": 5,
        "assistType": 1,
        "assistSize": 3,
        "assistNum": 100,
        "assistTime": 30,
        "buyType": 0,
        "costNum": 3000
    },
    {
        "assistID": 6,
        "assistType": 2,
        "assistSize": 1,
        "assistNum": 75,
        "assistTime": 10,
        "buyType": 0,
        "costNum": 1000
    },
    {
        "assistID": 7,
        "assistType": 2,
        "assistSize": 2,
        "assistNum": 90,
        "assistTime": 20,
        "buyType": 0,
        "costNum": 2000
    },
    {
        "assistID": 8,
        "assistType": 2,
        "assistSize": 3,
        "assistNum": 100,
        "assistTime": 30,
        "buyType": 0,
        "costNum": 3000
    },
    {
        "assistID": 9,
        "assistType": 3,
        "assistSize": 1,
        "assistNum": 75,
        "assistTime": 10,
        "buyType": 0,
        "costNum": 1000
    },
    {
        "assistID": 10,
        "assistType": 3,
        "assistSize": 2,
        "assistNum": 90,
        "assistTime": 20,
        "buyType": 0,
        "costNum": 2000
    },
    {
        "assistID": 11,
        "assistType": 3,
        "assistSize": 3,
        "assistNum": 100,
        "assistTime": 30,
        "buyType": 0,
        "costNum": 3000
    },
    {
        "assistID": 12,
        "assistType": 4,
        "assistSize": 1,
        "assistNum": 1,
        "assistTime": 0,
        "buyType": 0,
        "costNum": 1000
    },
    {
        "assistID": 13,
        "assistType": 4,
        "assistSize": 2,
        "assistNum": 2,
        "assistTime": 0,
        "buyType": 0,
        "costNum": 2000
    },
    {
        "assistID": 14,
        "assistType": 4,
        "assistSize": 3,
        "assistNum": 3,
        "assistTime": 0,
        "buyType": 0,
        "costNum": 3000
    }
];
/**
 * 
 * time  出现间隔 正数的去怪越出越慢,负数的怪越出越快
 * rate  慢慢按比例增加数量
 */
const enemyData = [
    {
        "id": 0,
        "blood": 2,
        "power": 1,
        "speed": 100,
        "reward": 8,
        "time": 1,
        "rate": 10,
        "finalTime": 10
    },
    {
        "id": 1,
        "blood": 2,
        "power": 1,
        "speed": 300,
        "reward": 10,
        "time": 2,
        "rate": 20,
        "finalTime": 15
    },
    {
        "id": 2,
        "blood": 3,
        "power": 1,
        "speed": 150,
        "reward": 12,
        "time": 15,
        "rate": 10,
        "finalTime": 20
    },
    {
        "id": 3,
        "blood": 5,
        "power": 1,
        "speed": 150,
        "reward": 25,
        "time": 25,
        "rate": -10,
        "finalTime": 5
    },
    {
        "id": 4,
        "blood": 10,
        "power": 1,
        "speed": 150,
        "reward": 30,
        "time": 30,
        "rate": -10,
        "finalTime": 10
    },
    {
        "id": 5,
        "blood": 15,
        "power": 2,
        "speed": 200,
        "reward": 35,
        "time": 55,
        "rate": 0,
        "finalTime": 15
    },
    {
        "id": 6,
        "blood": 15,
        "power": 1,
        "speed": 100,
        "reward": 70,
        "time": 45,
        "rate": -10,
        "finalTime": 20
    },
    {
        "id": 7, //炸弹怪
        "blood": 5,
        "power": 10,
        "speed": 300,
        "reward": 60,
        "time": 60,
        "rate": -10,
        "finalTime": 60
    },
    {
        "id": 8,
        "blood": 30,
        "power": 2,
        "speed": 100,
        "reward": 160,
        "time": 80,
        "rate": -10,
        "finalTime": 30
    },
    {
        "id": 9,
        "blood": 80,
        "power": 4,
        "speed": 250,
        "reward": 600,
        "time": 90,
        "rate": -10,
        "finalTime": 45
    },
    {
        "id": 10,
        "blood": 120,
        "power": 5,
        "speed": 250,
        "reward": 1200,
        "time": 120,
        "rate": -10,
        "finalTime": 60
    },
    {
        "id": 11,
        "blood": 200,
        "power": 5,
        "speed": 300,
        "reward": 1800,
        "time": 140,
        "rate": -10,
        "finalTime": 70
    },
    {
        "id": 12,
        "blood": 300,
        "power": 10,
        "speed": 250,
        "reward": 1800,
        "time": 180,
        "rate": -10,
        "finalTime": 90
    }
]
const signInData = [500, 1000, 1500, 2000, 3000];
export enum roleAnimate {
    Stay = "stay",
    Walk = "walk",
    Fire = "fier",
    WalkFire = "walk_fier",
    Die = "die"
}
/** 
 * Walk
  *  Injure
  *  Die0
  *  Die1
  *  DieBlack0
  *  DieBlack1
  *  InjureBlack
  *  WalkBlack
 */
export enum enemyAnimate {
    Walk0 = "walk_0",
    Walk1 = "walk_1",
    Walk2 = "walk_2",
    Ready0 = "ready_0",
    Ready1 = "ready_1",
    Ready2 = "ready_2",
    Attack0 = "attack_0",
    Attack1 = "attack_1",
    Attack2 = "attack_2",
    Die0 = "die_0",
    Die1 = "die_1",
}

export enum mechaAnimate {
    Stay = "stay",
    Walk = "walk",
    ShopUp = "show_up", //出场,落地的时候播放,紧接着播待机
    Fire = "stay_fier",
    WalkFire = "walk_fier"

}
const { ccclass, property } = cc._decorator;

@ccclass
export default class ConfigMag extends cc.Component {

    private static _instance: ConfigMag = null;
    public static get Ins(): ConfigMag {
        if (!this._instance || this._instance == null) {
            this._instance = new ConfigMag();
        }
        return this._instance;
    }

    /**
     * 获取日常任务奖励配置表
     */
    getTaskData() {
        return taskData;
    }
    /**
     * 获取成就配置表
     */
    getAchieveData() {
        return achieveData;
    }
    /**
     * 获取枪械配置表
     */
    getGunData() {
        return gunData;
    }
    /**
     * 获取皮肤配置表
     */
    getSkinData() {
        return skinData;
    }
    /**
     * 获取机甲配置表
     */
    getMechaData() {
        return mechaData;
    }
    /**
     * 获取辅助道具配置表
     */
    getAssistData() {
        return assistData;
    }
    /**
     * 获取敌怪的配置表
     */
    getEnemyData() {
        return enemyData;
    }
    /**
     * 签到奖励的金额
     */
    getSignData() {
        return signInData;
    }
    /**
     * 击杀数的奖励  [5, 10, 20, 30, 45, 60, 100]
     */
    getKillReward(): number[] {
        return [20, 50, 100, 200, 500, 800, 1500];
    }
    roleAnimate() {
        let gun = GameMag.Ins.tryGun === null ? GameMag.Ins.useingData.gun : GameMag.Ins.tryGun;
        let gunID = GameMag.Ins.shopShowGun || gun;
        let actions = { die: "", fire: "", stay: "", walk: "", walkFire: "" };
        let str = "";
        let str2 = "";
        if (gunID == 3 || gunID == 4 || gunID == 6 || gunID == 8) {
            str = "";
        } else if (gunID == 0 || gunID == 1 || gunID == 2) {
            str = "_0";
        } else if (gunID == 7 || gunID == 9 || gunID == 10 || gunID == 13 || gunID == 14 || gunID == 15 || gunID == 16 || gunID == 17 || gunID == 20 || gunID == 23) {
            str = "_1";
        } else if (gunID == 5) {
            str = "_2";
        } else if (gunID == 11) {
            str = "_3";
        } else if (gunID == 12) {
            str = "_4";
        } else if (gunID == 18) {
            str = "_5";
        } else if (gunID == 19 || gunID == 21) {
            str = "_6";
        } else if (gunID == 22) {
            str = "_7";
        }
        if (gunID == 3 || gunID == 4 || gunID == 8) {
            str2 = "";
        } else if (gunID == 0 || gunID == 1 || gunID == 2) {
            str2 = "_0";
        } else if (gunID == 6) {
            str2 = "_1";
        } else if (gunID == 7) {
            str2 = "_2";
        } else if (gunID == 5) {
            str2 = "_3";
        } else if (gunID == 9 || gunID == 10 || gunID == 13 || gunID == 14) {
            str2 = "_4";
        } else if (gunID == 11) {
            str2 = "_5";
        } else if (gunID == 12) {
            str2 = "_6";
        } else if (gunID == 15) {
            str2 = "_7";
        } else if (gunID == 16) {
            str2 = "_8";
        } else if (gunID == 17) {
            str2 = "_9";
        } else if (gunID == 18) {
            str2 = "_10";
        } else if (gunID == 19 || gunID == 21) {
            str2 = "_11";
        } else if (gunID == 20) {
            str2 = "_12";
        } else if (gunID == 22) {
            str2 = "_13";
        } else if (gunID == 23) {
            str2 = "_14";
        }
        actions.die = "die" + str;
        actions.stay = "stay" + str;
        actions.walk = "walk" + str;
        actions.fire = "fier" + str2;
        actions.walkFire = "walk_fier" + str2;
        return actions;
    }
    /**
     * 天降的导弹伤害
     */
    getMissilePower() {
        return 10;
    }
}
