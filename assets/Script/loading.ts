import GameMag from "../Script/manage/GameMag";
import AudioMag from "../Script/manage/AudioMag";
import SdkManager from "../Script/sdk/SdkManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Node)
    falseBar: cc.Node = null;
    @property(cc.ProgressBar)
    progress: cc.ProgressBar = null;
    @property(cc.Label)
    str: cc.Label = null;

    loadOver: boolean = false;
    onLoad() {
        const startTime = new Date().getTime();
        SdkManager.instance.InitSDK();
        GameMag.Ins.initLocalStorageData();
        if (!cc.sys.isBrowser) {
            this.uploadData();
            //@ts-ignore
            GameMag.Ins.launchData = wx.getLaunchOptionsSync();//获取小游戏启动时的参数
            cc.game.off(cc.game.EVENT_SHOW);
            cc.game.on(cc.game.EVENT_SHOW, function () {
                console.log("进入游戏");

            }.bind(this), this);
            cc.game.off(cc.game.EVENT_HIDE);
            cc.game.on(cc.game.EVENT_HIDE, function () {
                console.log("退出游戏");
                if (!this.loadOver) {
                    //还没有加载完就退出游戏,上传数据
                    // @ts-ignore
                    wx.reportUserBehaviorBranchAnalytics({
                        branchId: 'BCBgAAoXHx5d138Ug9YRx4',
                        branchDim: `1`, // 自定义维度(可选)：类型String，取值[1,100]，必须为整数，当上传类型不符时不统计
                        eventType: 1 // 1：曝光； 2：点击
                    });
                }
            }.bind(this), this);
        }
        this.scheduleOnce(() => {
            this.load();
        }, 0);
    }
    //收集打点数据
    uploadData() {
        const data = GameMag.Ins.uploadData;
        data.enterTimes++;
        //进入游戏的次数
        //@ts-ignore
        wx.reportUserBehaviorBranchAnalytics({
            branchId: 'BCBgAAoXHx5d138Ug9YRxo',
            branchDim: `${data.enterTimes}`, // 自定义维度(可选)：类型String，取值[1,100]，必须为整数，当上传类型不符时不统计
            eventType: 1 // 1：曝光； 2：点击
        });
        if (!data.firstInToday.status) { //是今日首次进入游戏,上传数据
            data.firstInToday.status = true;
        }
        GameMag.Ins.updateUploadData(data);//并更新本地数据
    }
    load() {
        this.schedule(this.fun, 0.02);
        let homeScene = GameMag.Ins.homeScene;
        let self = this;
        const time = new Date().getTime();
        cc.assetManager.loadBundle("home", (err, bundle) => {
            console.log("加载home", err, bundle);
            AudioMag.getInstance().init();
            // console.log(err, bundle);
            cc.assetManager.loadBundle("main", (err, bundle) => {
                self.unschedule(self.fun);
                console.log("加载main", err, bundle);
                cc.director.preloadScene(homeScene, (finish: number, total: number, item) => {
                    // console.log(finish, total);
                    self.falseBar.active = false;
                    self.progress.node.active = true;
                    let percent = Number((finish / total).toFixed(2));
                    self.progress.progress = percent;
                    // self.str.string = `${Math.ceil(percent * 100)}%`;
                }, (err) => {
                    self.loadOver = true;
                    console.log("主场景预加载完成");
                    if (!cc.sys.isBrowser) {
                        const _t = new Date().getTime();
                        const diff = Math.floor((_t - time) / 1000);
                        //加载页的游戏加载耗时时间(秒数)
                        // @ts-ignore
                        wx.reportUserBehaviorBranchAnalytics({
                            branchId: 'BCBgAAoXHx5d138Ug9YRx5',
                            branchDim: `${diff}`, // 自定义维度(可选)：类型String，取值[1,100]，必须为整数，当上传类型不符时不统计
                            eventType: 1 // 1：曝光； 2：点击
                        });
                    }
                    if (err) throw new Error(`${err}`);
                    cc.director.loadScene(homeScene);
                });
            })
        })
    }
    // text: string = null;
    fun() {
        this.falseBar.getChildByName("bar").width += 1;
        // let num = this.falseBar.getChildByName("bar").width;
        // this.text = ((num / 300) * 100).toFixed(0);
        // this.falseBar.getChildByName("percent").getComponent(cc.Label).string = String(`${this.text}%`);
        // console.log(this.text);
        // if (Number(this.text) >= 99) {
        //     this.unschedule(this.fun);
        // }
    }

}
