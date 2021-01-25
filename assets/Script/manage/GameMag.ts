import ConfigMag from "./ConfigMag";
import ToolsMag from "./ToolsMag";
import AudioMag from "./AudioMag";
import { hts } from "../hutui/Hts";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameMag extends cc.Component {
    private static _instance: GameMag = null;
    public static get Ins(): GameMag {
        if (!this._instance || this._instance == null) {
            this._instance = new GameMag();
        }
        return this._instance;
    }


    /*本地缓存*/
    /**
     * 当前货币
     */
    currency: any = null;
    /**
     * 当前等关卡
     */
    level: number = null;
    /**
     * 用来记录成就数据
     */
    achieveRecord: any = null;
    /**
     * 用来记录成就,是否领取过
     */
    achieveData: any = null;
    /**
     * 用来记录每日任务,是否领取
     */
    taskData: any = null;
    /**
     * 本地皮肤数据
     */
    skinData: any = null;
    /**
     * 本地武器数据
     */
    gunData: any = null;
    /**
     * 本地机甲数据
     */
    mechaData: any = null;
    /**
     * 本地辅助道具数据
     */
    assistData: any = null;
    /**
     * 当前在使用的皮肤
     */
    useingData: any = null;
    /**
     * 签到
     */
    signInData: any = null;
    /**
     * 记录音乐和音效开关状态
     */
    musicStatus: any = null;
    /**
     * 保存新手指导的单个步骤是否完成
     */
    guide: any = null;
    /**
     * 当日的复活次数
     */
    reviveTimes: any = null;
    /**
     * 首页的金币/钻石双倍收益的buff数据
     */
    rewardBuff: any = null;
    /**
     * 上传的打点数据
     */
    uploadData: any = null;
    /**
     * 任务列表
     */
    taskTypeArr: number[] = null;

    /*游戏数据*/
    homeScene: string = "Home";
    gameScene: string = "Game";
    gameLoaded: boolean = false; //游戏场景预加载完成
    gamePause: boolean = false;
    gameOver: boolean = false;
    mapIndex: number = null;
    useingGun: any = {}; //当前使用的枪
    useingSkin: any = {}; //当前使用的皮肤
    useingGuns: any[] = [null, null, null, null]; //带进游戏的四把枪,游戏内的显示顺序以商店装备的顺序为准
    useingAssist: any[] = [null, null, null]; //带进游戏的三个辅助道具
    isUseingMecha: boolean = false; //是否正在使用机甲
    skillConfig: number[] = [0.04, 1.11, 0.04];
    shopShowGun: number = null;
    shopShowSkin: number = null;
    scrollToSkin: number = 0; //建议使用那里点击显示商店界面
    scrollToGun: number = 0;
    scrollToAssist: number = 0;
    scrollToMecha: number = 0;
    useAttackAssist: number = 0;//游戏内使用/拾到攻击类道具
    frezonTime: number = 3;//被冰冻枪冻住的时间
    reviveDiamod: number = 5; //复活需要花费的钻石数
    trySkin: number = null; //试用的皮肤
    tryGun: number = null; //试用的武器
    tryGunBullet: number = null; //试用武器,并赠送子弹
    initTryGunBullet: number = 200; //试用武器,并赠送子弹数量
    tryGunEquip: number[] = null;//试用的武器列表
    launchData: any = null;
    showJumpToGame: boolean = false; //是否显示跳转其他游戏的弹窗
    doubleCoinTime: boolean = false; //双倍金币奖励时间
    doubleDiamondTime: boolean = false;//双倍钻石奖励时间
    nowGunIndex: number = null; //现在这把武器
    lastGunIndex: number = null;//上一把武器
    bulletWarnNum: number = 30; //小于30显示子弹不足预警

    /**
     * 仅用来记录当前关卡的击杀数
     */
    gameKillNum: number = 0;
    /**
     * taskType  0:无尽模式 1:击杀模式 2:距离模式 3:时间模式  4:击杀+时间模式 5:距离+时间模式
     */
    taskType: number = null; //当前的关卡代号
    roleBlood: number = 1;  //玩家血量
    timeStart: number = null; //结算的时候拿来显示的本关用时
    timeOver: boolean = false; //是否倒计时到了
    runOver: boolean = false; //是否到达终点
    killOver: boolean = false; //是否完成本关的击杀数任务
    defenseOver: boolean = false; //是否完成本关的防御任务
    getKeyOver: boolean = false; //是否完成本关的钥匙收集任务

    /**
     * 用来记录当前关卡的任务内容
     */
    missionData: any = { killNum: null, moveNum: null, secondNum: null, defenseNum: null, keyNum: null, coinNum: null, diamondNum: null };

    cleanMissionData() {
        this.missionData = { killNum: null, moveNum: null, secondNum: null, defenseNum: null, keyNum: null, coinNum: null, diamondNum: null };
    }
    removeAllLocalData() {
        cc.sys.localStorage.removeItem('currency');
        cc.sys.localStorage.removeItem('level');
        cc.sys.localStorage.removeItem('achieveData');
        cc.sys.localStorage.removeItem('achieveRecord');
        cc.sys.localStorage.removeItem('taskData');
        cc.sys.localStorage.removeItem('skinData');
        cc.sys.localStorage.removeItem('gunData');
        cc.sys.localStorage.removeItem('mechaData');
        cc.sys.localStorage.removeItem('assistData');
        cc.sys.localStorage.removeItem('useingData');
        cc.sys.localStorage.removeItem('signInData');
        cc.sys.localStorage.removeItem('guide');
        cc.sys.localStorage.removeItem('reviveTimes');
        cc.sys.localStorage.removeItem('rewardBuff');
        cc.sys.localStorage.removeItem('uploadData');
        cc.sys.localStorage.removeItem('taskTypeArr');
    }
    initLocalStorageData() {
        this.initLevel();
        this.initCurrency();
        this.initSkinData();
        this.initGunData();
        this.initMechaData();
        this.initAssistData();
        this.initUseingData();
        this.initAchieveData();
        this.initAchieveRecordData();
        this.initTaskData();
        this.initTaskTypeArr();
        // this.initGuide();
        // this.initSignData();
        // this.initReviveTimes();
        // this.initRewardBuff();
        // this.initUploadData();

        // this.initMusicStatus();
    }
    initTaskTypeArr() {
        let data = cc.sys.localStorage.getItem("taskTypeArr");
        if (!data) {
            cc.sys.localStorage.setItem("taskTypeArr", JSON.stringify([]));
            this.taskTypeArr = [];
        } else {
            this.taskTypeArr = JSON.parse(data);
        }
    }
    /**
     * 更新关卡列表
     * @param newData 
     */
    updateTaskTypeArr(newData) {
        this.taskTypeArr = newData;
        cc.sys.localStorage.setItem("taskTypeArr", JSON.stringify(this.taskTypeArr));
    }
    //打点数据
    initUploadData() {
        /**
         * enterTimes:第几次进入游戏;
         * playerReturn:玩家回流;
         * firstInToday:今天是否第一次进入游戏;
         * diamondGun : 钻石购买的武器
         */
        let init = { enterTimes: 0, firstInToday: { timeStamp: new Date().getTime(), status: false }, diamondGun: 0 }
        let data = cc.sys.localStorage.getItem("uploadData");
        if (!data) {
            cc.sys.localStorage.setItem("uploadData", JSON.stringify(init));
            this.uploadData = init;
        } else {
            this.uploadData = JSON.parse(data);
            let today = new Date().getDate();
            let date = new Date(this.uploadData.firstInToday.timeStamp).getDate();
            if (date != today) { //每天重置,玩家是否今日首进
                this.uploadData.firstInToday.status = false;
                this.uploadData.firstInToday.timeStamp = new Date().getTime();
                cc.sys.localStorage.setItem("uploadData", JSON.stringify(this.uploadData));
            }
        }
    }
    /**
     * 更新打点数据
     * @param newData 修改之后把新数据再传进来
     */
    updateUploadData(newData) {
        this.uploadData = newData;
        cc.sys.localStorage.setItem("uploadData", JSON.stringify(this.uploadData));
    }
    initGuide() {
        let init = [false, false, false, false, false, false, false, false];
        let data = cc.sys.localStorage.getItem("guide");
        if (!data) {
            cc.sys.localStorage.setItem("guide", JSON.stringify(init));
            this.guide = init;
        } else {
            this.guide = JSON.parse(data);
        }
    }
    initRewardBuff() {
        const init = { coinBuff: 0, diamondBuff: 0 };
        let data = cc.sys.localStorage.getItem("rewardBuff");
        if (!data) {
            cc.sys.localStorage.setItem("rewardBuff", JSON.stringify(init));
            this.rewardBuff = init;
        } else {
            this.rewardBuff = JSON.parse(data);
        }
    }
    /**
     * 开启奖励buff
     * @param flag 0:金币buff 1:钻石buff
     */
    startRewardBuff(flag: number) {
        if (flag === 0) {
            this.rewardBuff.coinBuff = new Date().getTime();
        } else {
            this.rewardBuff.diamondBuff = new Date().getTime();
        }
        cc.sys.localStorage.setItem("rewardBuff", JSON.stringify(this.rewardBuff));
    }
    /**
     * 重置奖励buff
     * @param flag 0:金币buff 1:钻石buff
     */
    resetRewardBuff(flag: number) {
        if (flag === 0) {
            this.rewardBuff.coinBuff = 0;
        } else {
            this.rewardBuff.diamondBuff = 0;
        }
        cc.sys.localStorage.setItem("rewardBuff", JSON.stringify(this.rewardBuff));
    }
    initReviveTimes() {
        const init = { timeStamp: new Date().getTime(), times: 1 };
        let data = cc.sys.localStorage.getItem("reviveTimes");
        if (!data) {
            cc.sys.localStorage.setItem("reviveTimes", JSON.stringify(init));
            this.reviveTimes = init;
        } else {
            this.reviveTimes = JSON.parse(data);
            let today = new Date().getDate();
            let date = new Date(this.reviveTimes.timeStamp).getDate();
            console.log(date, today);
            if (date != today) {
                this.reviveTimes.times = 1;
                this.reviveTimes.timeStamp = new Date().getTime();
                cc.sys.localStorage.setItem("reviveTimes", JSON.stringify(this.reviveTimes));
            }
        }
        console.log("今日复活次数", this.reviveTimes);
    }
    /**
     * 更新复活次数
     */
    updateReviveTimes() {
        this.reviveTimes.times++;
        cc.sys.localStorage.setItem("reviveTimes", JSON.stringify(this.reviveTimes));
    }
    /**
     * 更新新手指导是否完成
     * @param step 步骤编号
     */
    updateGuide(step) {
        this.guide[step] = true;
        cc.sys.localStorage.setItem("guide", JSON.stringify(this.guide));
    }
    // initMusicStatus() {
    //     let init = { bgm: true, sound: true };
    //     let data = cc.sys.localStorage.getItem("musicStatus");
    //     if (!data) {
    //         cc.sys.localStorage.setItem("musicStatus", JSON.stringify(init));
    //         this.musicStatus = init;
    //     } else {
    //         this.musicStatus = JSON.parse(data);
    //     }
    // }
    // /**
    //  * 更新背景音乐和音效开关状态
    //  * @param flag 0:背景音乐  1:音效
    //  */
    // updateMusicStatus(flag, status) {
    //     if (flag === 0) {
    //         this.musicStatus.bgm = status;
    //     }else{
    //         this.musicStatus.sound = status;
    //     }
    //     cc.sys.localStorage.setItem("musicStatus", JSON.stringify(this.musicStatus));
    // }
    /**
     * 初始化签到数据
     */
    initSignData() {
        //todaySign: 今天是否签到过  firstAround: 是否已经签到过
        let init = { timeStamp: 0, todaySign: false, firstAround: false, signDay: [false, false, false, false, false, false, false] };
        let data = cc.sys.localStorage.getItem("signInData");
        if (!data) {
            cc.sys.localStorage.setItem("signInData", JSON.stringify(init));
            this.signInData = init;
        } else {
            this.signInData = JSON.parse(data);
            let today = new Date().getDate();
            let date = new Date(this.signInData.timeStamp).getDate();
            console.log(date, today);
            if (date != today) {
                this.signInData.todaySign = false;
            }
            cc.sys.localStorage.setItem("signInData", JSON.stringify(this.signInData));
        }
        console.log("七日签到", this.signInData);
    }
    /**
     * 更新七日签到
     * @param index 下标
     */
    updateSignIn(index) {
        this.signInData.signDay[index] = true;
        if (index == 6) {
            this.signInData.firstAround = true;
            this.signInData.signDay = [false, false, false, false, false, false, false];
        }
        this.signInData.todaySign = true;
        this.signInData.timeStamp = new Date().getTime();
        cc.sys.localStorage.setItem("signInData", JSON.stringify(this.signInData));
    }
    initLevel() {
        let num = cc.sys.localStorage.getItem('level');
        if (!num) {
            cc.sys.localStorage.setItem('level', JSON.stringify(1));
            this.level = 1;
        } else {
            this.level = JSON.parse(num);
        }
    }
    //关卡+1
    updateLevel() {
        this.level++;
        this.updateAchieveRecord(3);
        cc.sys.localStorage.setItem('level', JSON.stringify(this.level));
    }
    initAssistData() {
        let len = ConfigMag.Ins.getAssistData().length;
        let data = [];
        for (let index = 0; index < len; index++) {
            data.push({ assistID: index, getNum: 0 });
        }
        let init = cc.sys.localStorage.getItem('assistData');
        if (!init) {
            cc.sys.localStorage.setItem('assistData', JSON.stringify(data));
            this.assistData = data;
        } else {
            this.assistData = JSON.parse(init);
        }
        // console.log("本地辅助道具数据", this.assistData);
    }
    initSkinData() {
        let skinCigData = ConfigMag.Ins.getSkinData();
        let data = [];
        //先把第一个默认皮肤放进来
        data.push({ skinID: 0, geted: true, blood: skinCigData[0].blood, bloodLv: 0, speed: skinCigData[0].speed, speedLv: 0, armor: skinCigData[0].armor, armorLv: 0 });
        for (let index = 1; index < skinCigData.length; index++) {
            data.push({ skinID: index, geted: false, blood: skinCigData[0].blood, bloodLv: 0, speed: skinCigData[0].speed, speedLv: 0, armor: skinCigData[0].armor, armorLv: 0 });
        }
        let init = cc.sys.localStorage.getItem('skinData');
        if (!init) {
            cc.sys.localStorage.setItem('skinData', JSON.stringify(data));
            this.skinData = data;
        } else {
            this.skinData = JSON.parse(init);
        }
        // console.log("本地皮肤数据", this.skinData);
    }
    /**
     * 更新皮肤获得数据
     * @param id 直接传入获得的皮肤id
     */
    updateSkinData(id) {
        this.skinData[id].geted = true;
        cc.sys.localStorage.setItem('skinData', JSON.stringify(this.skinData));
    }
    /**
     * 更新皮肤升级数据
     * @param id    直接传入要升级的皮肤id
     * @param type  0:血量 1:速度  2:护甲
     * @param num   升级的技能数值
     */
    updateSkinDataUpgrade(id, type, num) {
        const max: number = (ConfigMag.Ins.getSkinData()[id]).upMax;
        switch (type) {
            case 0:
                // if (this.skinData[id].bloodLv == max) {
                //     return true;
                // }
                this.skinData[id].bloodLv++;
                this.skinData[id].blood += num;
                break;
            case 1:
                // if (this.skinData[id].speedLv == max) {
                //     return true;
                // }
                this.skinData[id].speedLv++;
                this.skinData[id].speed += num;
                break;
            case 2:
                // if (this.skinData[id].armorLv == max) {
                //     return true;
                // }
                this.skinData[id].armorLv++;
                this.skinData[id].armor += num;
                break;
            default:
                break;
        }
        cc.sys.localStorage.setItem('skinData', JSON.stringify(this.skinData));
    }
    initUseingData() {
        //skin:使用中的皮肤, gun:当前正在使用的枪, gunEquip:装备中的武器列表,assistEquip:装备中的辅助道具列表,-2:空位
        let data = {
            skin: 0, gun: 3, mecha: -1, gunEquip: [3, -2, -2, -2], assistEquip: [-2, -2, -2]
        };
        let init = cc.sys.localStorage.getItem('useingData');
        if (!init) {
            cc.sys.localStorage.setItem('useingData', JSON.stringify(data));
            this.useingData = data;
        } else {
            this.useingData = JSON.parse(init);
        }
        // console.log("使用中的数据", this.useingData);
    }
    initMechaData() {
        let len = ConfigMag.Ins.getMechaData().length;
        let data = [];
        for (let index = 0; index < len; index++) {
            data.push({ mechaID: index, getNum: 0 });
        }
        let init = cc.sys.localStorage.getItem('mechaData');
        if (!init) {
            cc.sys.localStorage.setItem('mechaData', JSON.stringify(data));
            this.mechaData = data;
        } else {
            this.mechaData = JSON.parse(init);
        }
        // console.log("本地机甲数据", this.mechaData);
    }
    /**
     * 更新机甲的数据
     * @param id 直接传入mechaID
     * @param num 扣掉直接传负数
     */
    updateMechaData(id, num) {
        this.mechaData[id].getNum += num;
        cc.sys.localStorage.setItem('mechaData', JSON.stringify(this.mechaData));
    }
    /**
     * 更新辅助道具的数据
     * @param id 直接传入assistID
     * @param num 扣的话直接传负数
     */
    updateAssistData(id, num) {
        this.assistData[id].getNum += num;
        cc.sys.localStorage.setItem('assistData', JSON.stringify(this.assistData));
    }
    /**
     * 更新当前使用的武器
     * @param skinID 直接传入skinID,解除的时候传-1
     */
    updateUseingDataBySkin(skinID) {
        if (skinID < 0) {
            skinID = 0;//默认为0(第一个皮肤)
        }
        this.useingData.skin = skinID;
        cc.sys.localStorage.setItem('useingData', JSON.stringify(this.useingData));
    }
    /**
     * 更新当前使用的武器
     * @param gunID 直接传入gunID
     */
    updateUseingDataByGun(gunID) {
        this.useingData.gun = gunID;
        cc.sys.localStorage.setItem('useingData', JSON.stringify(this.useingData));
    }
    /**
     * 更新装备中的武器列表
     * @param gunID 直接传入武器id,解除装备直接传-1
     */
    updateUseingDataByGunEquip(gunID, index) {
        let gunEquip = this.useingData.gunEquip;
        gunEquip[index] = gunID;
        cc.sys.localStorage.setItem('useingData', JSON.stringify(this.useingData));
    }
    /**
     * 更新装备中的辅助道具列表
     * @param assistID 直接传入道具id,解除装备直接传-2
     * @param index 所在的下标
     */
    updateUseingDataByAssistEquip(assistID, index) {
        let assistEquip = this.useingData.assistEquip;
        assistEquip[index] = assistID;
        cc.sys.localStorage.setItem('useingData', JSON.stringify(this.useingData));
    }
    /**
     * 更新装备中的机甲
     * @param mechaID 直接传入mechaID
     */
    updateUseingDataByMecha(mechaID, index = null) {
        // console.log(index || mechaID);
        this.useingData.mecha = index || mechaID;
        cc.sys.localStorage.setItem('useingData', JSON.stringify(this.useingData));
    }
    initGunData() {
        let localGunData = ConfigMag.Ins.getGunData();
        let data = [];
        localGunData.forEach(item => {
            let num = null;
            if (item.gunType == 1) { //非枪械
                num = -1;
            } else {
                num = 0;
            }
            let geted = null;
            if (item.gunID == 3) {//第一把默认枪
                geted = true;
            } else {
                geted = true;
            }
            data.push({ gunID: item.gunID, geted: geted, bulletNum: num, lockStatus: item.lockStatus });//bulletNum: 剩余子弹
        })
        let init = cc.sys.localStorage.getItem('gunData');
        if (!init) {
            cc.sys.localStorage.setItem('gunData', JSON.stringify(data));
            this.gunData = data;
        } else {
            this.gunData = JSON.parse(init);
        }
        // console.log("本地武器数据", this.gunData);
    }
    /**
     * 解锁武器
     * @param id 直接传入gunID
     */
    updateGunDataByLockStatus(id) {
        this.gunData[id].lockStatus = true;
        cc.sys.localStorage.setItem('gunData', JSON.stringify(this.gunData));
    }
    /**
     * 购买/获得武器
     * @param id 直接传入gunID
     */
    updateGunDataByGeted(id) {
        this.gunData[id].geted = true;
        cc.sys.localStorage.setItem('gunData', JSON.stringify(this.gunData));
    }
    /**
     * 更新武器子弹
     * @param id  直接传入gunID
     * @param num 购买子弹的数量,扣的话传负数
     */
    updateGunDataByBulletNum(id, num) {
        this.gunData[id].bulletNum += num;
        cc.sys.localStorage.setItem('gunData', JSON.stringify(this.gunData));
    }
    //货币
    initCurrency() {
        let data = cc.sys.localStorage.getItem('currency');
        if (!data) {
            let init = { coin: 2000, diamond: 5, option: 3 };
            cc.sys.localStorage.setItem('currency', JSON.stringify(init));
            this.currency = init;
        } else {
            this.currency = JSON.parse(data);
        }
        // console.log("本地货币", this.currency);
    }
    /**
     * 更新本地缓存货币数据
     * @param type 0:金币 1:钻石  2:药水
     * @param addNum 扣钱直接传负数
     */
    updateCurrency(type: number, addNum: number) {
        let rate = null;
        switch (type) {
            case 0:
                rate = this.doubleCoinTime ? 2 : 1;
                this.currency.coin += (addNum * rate);
                break;
            case 1:
                rate = this.doubleDiamondTime ? 2 : 1;
                this.currency.diamond += (addNum * rate);
                break;
            case 2:
                this.currency.option += addNum;
                break;
            default:
                break;
        }
        cc.sys.localStorage.setItem('currency', JSON.stringify(this.currency));
    }
    /**
     * 本地成就数据
     */
    initAchieveData() {
        let data = ConfigMag.Ins.getAchieveData();
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            arr.push({ id: i, geted: false });
        }
        let init = cc.sys.localStorage.getItem('achieveData');
        if (!init) {
            cc.sys.localStorage.setItem('achieveData', JSON.stringify(arr));
            this.achieveData = arr;
        } else {
            this.achieveData = JSON.parse(init);
        }
        // console.log("本地成就数据", this.achieveData);
    }
    updateAchieveData(index) {
        this.achieveData[index].geted = true;
        cc.sys.localStorage.setItem('achieveData', JSON.stringify(this.achieveData));
    }
    initAchieveRecordData() {
        //killNum:击杀僵尸数   killBossNum:击杀boss数  timer:累计时长  3:天数(关卡值) 4:拥有武器数
        let data = { killNum: 0, killBossNum: 0, timer: 0, level: 1, gunSum: 1 };
        let init = cc.sys.localStorage.getItem('achieveRecord');
        if (!init) {
            cc.sys.localStorage.setItem('achieveRecord', JSON.stringify(data));
            this.achieveRecord = data;
        } else {
            this.achieveRecord = JSON.parse(init);
        }
        // console.log("本地成就的记录数据", this.achieveRecord);
    }
    /**
     * 更新本地成就数据,直接传类型
     * @param type  0:击杀僵尸数   1:击杀boss数  2:累计时长  3:天数(关卡值) 4:拥有武器数
     */
    updateAchieveRecord(type: number) {
        let data = this.achieveRecord;
        switch (type) {
            case 0:
                data.killNum++;
                this.updateTaskKills();
                break;
            case 1:
                data.killBossNum++;
                this.updateTaskKills();
                break;
            case 2:
                data.timer++;
            case 3:
                data.level = this.level;
                break;
            case 4:
                data.gunSum++;
                break;
            default:
                break;
        }
        cc.sys.localStorage.setItem('achieveRecord', JSON.stringify(data));
    }
    /**
     * 本地每日任务
     */
    initTaskData() {
        let arr = ConfigMag.Ins.getTaskData();
        let data = [];
        let today = new Date().getDate();
        for (let i = 0; i < arr.length; i++) {
            data.push({ id: i, geted: false });
        }
        let res = { day: today, killSum: 0, data: data };
        let init = cc.sys.localStorage.getItem('taskData');
        if (!init) {
            cc.sys.localStorage.setItem('taskData', JSON.stringify(res));
            this.taskData = res;
        } else {
            const oldData = JSON.parse(init);
            // console.log(oldData,data);
            if (oldData.day != today) {//每日重置
                cc.sys.localStorage.setItem('taskData', JSON.stringify(res));
                this.taskData = res;
            } else {
                this.taskData = oldData;
            }
        }
        // console.log("本地每日任务数据", this.taskData);
    }
    /**
     * 更新每日任务是否获取过
     * @param index  直接传下标
     */
    updateTaskGet(index) {
        this.taskData.data[index].geted = true;
        cc.sys.localStorage.setItem('taskData', JSON.stringify(this.taskData));
    }
    /**
     * 更新每日杀敌总数
     */
    updateTaskKills() {
        this.taskData.killSum++;
        cc.sys.localStorage.setItem('taskData', JSON.stringify(this.taskData));
    }
    /**
     * 查找武器数据
     * @param arr 
     * @param key 
     */
    searchGunData(arr, key) {
        let low = 0;
        let high = arr.length - 1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (key === arr[mid].gunID) {
                return arr[mid];
            } else if (key > arr[mid].gunID) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return false;
    }
    /**
     * 查找辅助道具数据
     * @param arr 
     * @param key 
     */
    searchAssistData(arr, key) {
        let low = 0;
        let high = arr.length - 1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (key === arr[mid].assistID) {
                return arr[mid];
            } else if (key > arr[mid].assistID) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return false;
    }
    /**
     * 查找辅助道具数据
     * @param arr 
     * @param key 
     */
    searchSkinData(arr, key) {
        let low = 0;
        let high = arr.length - 1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (key === arr[mid].skinID) {
                return arr[mid];
            } else if (key > arr[mid].skinID) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return false;
    }
    /**
     * 替换主角皮肤的龙骨
     * @param target 龙骨组件
     * @param index 皮肤id
     */
    changeSkin(bodyDragon: dragonBones.ArmatureDisplay, cb: Function) {
        let skinArr: string[] = ["chest", "front_coat", "forearm", "back_arm", "back_coat", "broken_head", "head", "forearm", "forearm_1", "forehand", "forehand_1", "backhand_1", "backhand", "back_arm"];
        let gun = this.tryGun === null ? this.useingData.gun : this.tryGun;
        // console.log("龙骨gun:",gun);
        let gunIndex = this.shopShowGun || gun;
        let armStr: string[] = [];
        let index: number = null;
        if (gunIndex <= 4 || gunIndex == 6 || gunIndex == 8) {
            armStr = ["arms"];
            if (gunIndex == 6) {
                index = 5;
            } else if (gunIndex == 8) {
                index = 6;
            } else {
                index = gunIndex;
            }
        } else {
            armStr = ["arms_1"];
            if (gunIndex == 5) {
                index = 0;
            } else if (gunIndex == 7) {
                index = 1;
            } else {
                index = gunIndex - 7;
            }
        }
        this.loadDisplayIndex(skinArr.concat(armStr), bodyDragon, index);
        cb && cb();
    }
    //脚龙骨
    changeFoot(footDragon: dragonBones.ArmatureDisplay, cb: Function = null) {
        let legArr: string[] = ["forelegs", "hind_leg"];
        // let skinIndex = GameMag.Ins.trySkin || (this.shopShowSkin === null ? this.useingData.skin : this.shopShowSkin);
        let skinIndex = 0;
        for (let i = 0, len = legArr.length; i < len; i++) {
            let robotArmature = footDragon.armature();
            let robotSlot = robotArmature.getSlot(legArr[i]);
            robotSlot.displayIndex = skinIndex; //龙骨里面的顺序
        }
        cb && cb();
    }
    loadDisplayIndex(strArr: string[], target: dragonBones.ArmatureDisplay, gunIndex: number = null) {
        // let skinIndex = GameMag.Ins.trySkin || (this.shopShowSkin === null ? this.useingData.skin : this.shopShowSkin);
        let skinIndex = 0;
        for (let i = 0, len = strArr.length; i < len; i++) {
            let robotArmature = target.armature();
            let robotSlot = robotArmature.getSlot(strArr[i]);
            if (i == len - 1) {
                robotSlot.displayIndex = gunIndex;
                break;
            }
            robotSlot.displayIndex = skinIndex; //龙骨里面的顺序
        }
    }
    /**
     * 武器音效
     */
    playGunSound() {
        let str = null;
        let num = this.tryGun === null ? this.useingData.gun : this.tryGun;
        let gun = this.shopShowGun || num;
        if (gun == 0) {
            str = "棒球";
        } else if (gun == 1 || gun == 2) {
            str = "光剑";
        } else if (gun == 3) {
            str = "初始枪";
        } else if (gun == 4 || gun == 8) {
            str = "沙漠之鹰";
        } else if (gun == 5) {
            str = "左轮";
        } else if (gun == 6) {
            str = "乌兹";
        } else if (gun == 7) {
            str = "P90";
        } else if (gun == 9 || gun == 14) {
            str = "AK";
        } else if (gun == 10 || gun == 13) {
            str = "M4";
        } else if (gun == 11 || gun == 12) {
            str = "散弹枪";
        } else if (gun == 15) {
            str = "火焰枪";
        } else if (gun == 16) {
            str = "冰冻枪";
        } else if (gun == 17) {
            str = "狙击枪";
        } else if (gun == 18) {
            str = "电锯";
        } else if (gun == 19 || gun == 20 || gun == 21) {
            str = "RPG";
        } else if (gun == 22) {
            str = "加特林";
        } else if (gun == 23) {
            str = "镭射枪";
        }
        // console.log("枪音效", str);
        AudioMag.getInstance().playSound(str);
    }
    corpsePool: cc.NodePool[] = [];
    enemyPool: cc.NodePool[] = [];
    bulletPool: cc.NodePool = null;
    mechaBulletPool: cc.NodePool = null;
    rewardNumPool: cc.NodePool = null;//击杀小怪后漂浮的奖励金额
    skillBlockPool: cc.NodePool = null;//商店的技能小方块
    initHomePools() {
        let self = this;
        this.skillBlockPool = new cc.NodePool();
        ToolsMag.Ins.getHomeResource("prefab/shop/singleSkill", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            for (let i = 0; i < 20; i++) {
                self.skillBlockPool.put(node);
            }
        })
    }
    getSkillBlock(cb) {
        let node = null;
        if (this.skillBlockPool.size() > 0) {
            node = this.skillBlockPool.get();
            cb && cb(node);
            return;
        };
        ToolsMag.Ins.getHomeResource("prefab/shop/singleSkill", function (prefab: cc.Prefab) {
            // console.log("标记:::::::", tag);
            node = cc.instantiate(prefab);
            cb && cb(node);
        });
    }
    putSkillBlock(node) {
        this.skillBlockPool.put(node);
    }
    initGamePools() {
        let self = this;
        let corpsePool0 = new cc.NodePool();
        let corpsePool1 = new cc.NodePool();
        let corpsePool2 = new cc.NodePool();
        let corpsePool3 = new cc.NodePool();
        let corpsePool4 = new cc.NodePool();
        let corpsePool5 = new cc.NodePool();
        let corpsePool6 = new cc.NodePool();
        let corpsePool7 = new cc.NodePool();
        let corpsePool8 = new cc.NodePool();
        let corpsePool9 = new cc.NodePool();
        let corpsePool10 = new cc.NodePool();
        let corpsePool11 = new cc.NodePool();
        let corpsePool12 = new cc.NodePool();
        this.corpsePool.push(corpsePool0);
        this.corpsePool.push(corpsePool1);
        this.corpsePool.push(corpsePool2);
        this.corpsePool.push(corpsePool3);
        this.corpsePool.push(corpsePool4);
        this.corpsePool.push(corpsePool5);
        this.corpsePool.push(corpsePool6);
        this.corpsePool.push(corpsePool7);
        this.corpsePool.push(corpsePool8);
        this.corpsePool.push(corpsePool9);
        this.corpsePool.push(corpsePool10);
        this.corpsePool.push(corpsePool11);
        this.corpsePool.push(corpsePool12);

        let enemy0 = new cc.NodePool();
        let enemy1 = new cc.NodePool();
        let enemy2 = new cc.NodePool();
        let enemy3 = new cc.NodePool();
        let enemy4 = new cc.NodePool();
        let enemy5 = new cc.NodePool();
        let enemy6 = new cc.NodePool();
        let enemy7 = new cc.NodePool();
        let enemy8 = new cc.NodePool();
        let enemy9 = new cc.NodePool();
        let enemy10 = new cc.NodePool();
        let enemy11 = new cc.NodePool();
        let enemy12 = new cc.NodePool();
        this.enemyPool.push(enemy0);
        this.enemyPool.push(enemy1);
        this.enemyPool.push(enemy2);
        this.enemyPool.push(enemy3);
        this.enemyPool.push(enemy4);
        this.enemyPool.push(enemy5);
        this.enemyPool.push(enemy6);
        this.enemyPool.push(enemy7);
        this.enemyPool.push(enemy8);
        this.enemyPool.push(enemy9);
        this.enemyPool.push(enemy10);
        this.enemyPool.push(enemy11);
        this.enemyPool.push(enemy12);


        this.rewardNumPool = new cc.NodePool();
        ToolsMag.Ins.getGameResource("prefab/killRewardNum", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            for (let i = 0; i < 3; i++) {
                self.rewardNumPool.put(node);
            }
        })
        this.bulletPool = new cc.NodePool();
        ToolsMag.Ins.getGameResource("prefab/bullets/bullet", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            for (let i = 0; i < 10; i++) {
                self.bulletPool.put(node);
            }
        })
        const mecha = GameMag.Ins.useingData.mecha;
        if (mecha != -1) { //有带机甲进来才生成机甲的子弹的对象池
            this.mechaBulletPool = new cc.NodePool();
            ToolsMag.Ins.getGameResource("prefab/bullets/mechaBullet", function (prefab: cc.Prefab) {
                let node = cc.instantiate(prefab);
                for (let i = 0; i < 10; i++) {
                    self.mechaBulletPool.put(node);
                }
            })
        }
    }
    getEnemy(tag: number, cb: Function) {
        let node = null;
        if (this.enemyPool[tag].size() > 0) {
            node = this.enemyPool[tag].get();
            cb && cb(node);
            return;
        };
        ToolsMag.Ins.getGameResource("prefab/enemys/enemy" + tag, function (prefab: cc.Prefab) {
            // console.log("标记:::::::", tag);
            node = cc.instantiate(prefab);
            cb && cb(node);
        });
    }
    putEnemy(tag, node) {
        this.enemyPool[tag].put(node);
    }
    getCorpse(tag, cb: Function) {
        let node = null;
        // console.log(this.corpsePool[tag].size());
        if (this.corpsePool[tag].size() > 0) {
            node = this.corpsePool[tag].get();
            cb && cb(node);
            return;
        }
        ToolsMag.Ins.getGameResource("prefab/corpse/corpse" + tag, function (prefab: cc.Prefab) {
            node = cc.instantiate(prefab);
            cb && cb(node);
        });
    }
    putCorpse(tag, node, cb: Function = null) {
        this.corpsePool[tag].put(node);
    }
    getRewardNum(cb: Function) {
        let node = null;
        if (this.rewardNumPool.size() > 0) {
            node = this.rewardNumPool.get();
            cb && cb(node);
            return;
        }
        ToolsMag.Ins.getGameResource("prefab/killRewardNum", function (prefab: cc.Prefab) {
            node = cc.instantiate(prefab);
            cb && cb(node);
        })
    }
    putRewardNum(node) {
        this.rewardNumPool.put(node);
    }
    getBullet(cb: Function) {
        let node = null;
        if (this.bulletPool.size() > 0) {
            node = this.bulletPool.get();
            cb && cb(node);
            return;
        }
        ToolsMag.Ins.getGameResource("prefab/bullets/bullet", function (prefab: cc.Prefab) {
            node = cc.instantiate(prefab);
            cb && cb(node);
        })
    }
    putBullet(node) {
        this.bulletPool.put(node);
    }
    getMechaBullet(cb: Function) {
        let node = null;
        if (this.mechaBulletPool.size() > 0) {
            node = this.mechaBulletPool.get();
            cb && cb(node);
            return;
        }
        ToolsMag.Ins.getGameResource("prefab/bullets/mechaBullet", function (prefab: cc.Prefab) {
            node = cc.instantiate(prefab);
            cb && cb(node);
        })
    }
    putMechaBullet(node) {
        this.mechaBulletPool.put(node);
    }
    machineBulletPool: cc.NodePool = null;//机枪的子弹
    initMachineBullet() {
        let self = this;
        this.machineBulletPool = new cc.NodePool();
        ToolsMag.Ins.getGameResource("prefab/bullets/machineBullet", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            for (let i = 0; i < 10; i++) {
                self.machineBulletPool.put(node);
            }
        })
    }
    getMachineBullet(cb: Function) {
        let node = null;
        if (this.machineBulletPool.size() > 0) {
            node = this.machineBulletPool.get();
            cb && cb(node);
            return;
        }
        ToolsMag.Ins.getGameResource("prefab/bullets/machineBullet", function (prefab: cc.Prefab) {
            node = cc.instantiate(prefab);
            cb && cb(node);
        })
    }
    putMachineBullet(node) {
        this.machineBulletPool.put(node);
    }
}
/**
 * other tag
 * 1.  子弹
 * 2.  主角身体
 * 3.  天降导弹爆炸区域
 * 4.  游戏中出现的道具
 * 5.  敌人的身体
 * 6.  爆炸性武器的子弹
 * 7.  爆炸性武器的伤害范围
 * 8.  火子弹
 * 9.  被冷冻枪击中,没有直接死的话就显示的冰块
 * 10. 棍棒类武器
 * 11. 穿透性子弹
 * 12. 炸弹怪的爆炸区域
 * 13. 机甲的出现和消失的爆炸区域
 * 14. 机甲的子弹伤害
 * 15. 机甲的子弹伤害区域
 * 16. 长舌怪的区域
 * 18. 冰子弹
 * 19. 防御区域(旋涡)
 * 20. 要护送的小弟身体,我叫他baby
 * 21. 游戏中出现的钥匙(钥匙任务的钥匙)
 * 22. 辅助道具机枪的爆炸区域
 * 23. 辅助道具机枪的碰撞检测区域
 * 24. 辅助道具机枪的子弹
 */
