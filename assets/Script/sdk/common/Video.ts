/*
 * @Descripttion: 
 * @Author: xzk
 * @Date: 2020-07-29 11:10:17
 * @LastEditTime: 2020-08-05 18:56:00
 */
import SdkManager from "../SdkManager";
// import PanelManager from "../../core/PanelManager";
import { ShareType } from "../ShareManager";

/** 激励视频 */
export default class Video {
    /** 广告ID */
    public adId: string;
    /** 广告对象 */
    private video: wx.RewardedVideoAd;
    /** 回调 */
    private callback: Function;
    private cbSelf: any;
    /** 看广告失败转为分享 */
    private errorToShare: boolean;
    /** 播放完成 */
    private isPlayFinish: boolean;

    /** 创建广告 */
    public create(adId: string, callback: (success: boolean) => void, cbSelf: any, errorToShare: boolean = false): void {
        this.adId = adId;
        this.video = wx.createRewardedVideoAd({ adUnitId: adId, multiton: true });
        this.video.onLoad(this.onLoad.bind(this));
        this.video.onClose(this.onClose.bind(this));
        this.video.onError(this.onError.bind(this));
        this.show(callback, cbSelf, errorToShare);
    }

    /** 显示广告 */
    public show(callback: (success: boolean) => void, cbSelf: any, errorToShare: boolean = false): void {
        this.callback = callback
        this.cbSelf = cbSelf;
        this.errorToShare = errorToShare;
        this.video.show().catch(err => {
            this.video.load().then(() => this.video.show());
        });
    }

    private onLoad(): void {
        // 加载成功
        // console.log(`[Video] onLoad, 加载成功`);
    }

    private onClose(res: any): void {
        // 用户点击了【关闭广告】按钮
        // 小于 2.1.0 的基础库版本，res 是一个 undefined

        if (res && res.isEnded || res === undefined) {
            // 正常播放结束，可以下发游戏奖励
            this.isPlayFinish = true;
        }
        else {
            // 播放中途退出，不下发游戏奖励
            this.isPlayFinish = false;
            // PanelManager.instance.OpenMessage("广告中途退出，无游戏奖励");
        }
        // console.log(`[Video] onClose, videoPlayFinish=${this.isPlayFinish}`);
        this.callback.call(this.cbSelf, this.isPlayFinish);
    }

    private onError(err: any): void {
        console.warn(`[Video] onError, code:${err.errCode}, msg:${err.errMsg}`);
        if (this.errorToShare) {
            SdkManager.instance.share(ShareType.Normal, (success: boolean) => {
                this.callback.call(this.cbSelf, success);
            }, this);
        }
        else {
            // PanelManager.instance.OpenMessage("填充广告失败");
            this.callback.call(this.cbSelf, false);
        }
    }

    private clear(): void {
        if (!this.video) return;
        this.video.offLoad(this.onLoad);
        this.video.offClose(this.onClose);
        this.video.offError(this.onError);
        this.video = null;
    }
}