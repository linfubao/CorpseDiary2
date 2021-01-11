// import Toutiao from "./toutiao/Toutiao";
import Wechat from "./wechat/Wechat";
import ShareManager, { ShareType } from "./ShareManager";

/** 平台 */
export enum Platform {
    /** 无 */
    None = 0,
    /** 微信 */
    Wechat,
    /** qq小游戏 */
    QQGame,
    /** 头条 */
    Toutiao,
}

/** banner位置 */
export enum BannerPos {
    /** 底中 */
    Bottom,
    /** 顶中 */
    Top,
    /** 左下 */
    LeftBottom,
    /** 右下 */
    RightBottom,
}

/** 激励视频类型 */
export enum VideoType {
    /** 免费金币 */
    FreeGold,
}

/** 插屏广告类型 */
export enum InterstitialType {
    /** 匹配 */
    Match,
    /** 结算 */
    Result,
}

export default class SdkManager {
    private static _instance: SdkManager = null;
    public static get instance(): SdkManager {
        if (!this._instance) this._instance = new SdkManager();
        return this._instance;
    }

    /** 当前SDK */
    private sdk: ISdk;
    /** 平台类型 */
    public platform: Platform = Platform.None;
    /** 是否头条平台 */
    public isToutiao: boolean = false;

    public openId: number = null;

    /** 当前是否使用sdk */
    public get hasSdk(): boolean { return this.platform != Platform.None; }

    /** 当前是否授权 */
    public get hasAuth(): boolean { return this.platform == Platform.None || this.sdk.hasAuth; }

    /** 用户名 */
    public get hasOpenId(): string { return this.sdk.openId; }

    /** 是否发布版本 */
    public get isRelease(): boolean {
        if (CC_DEBUG || cc.sys.platform == cc.sys.DESKTOP_BROWSER) return false;
        return true;
    }

    public InitSDK(): void {
        // console.log(cc.sys.platform)
        // cc.sys.platform = 101
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            this.platform = this.isToutiao ? Platform.Toutiao : Platform.Wechat;
            //@ts-ignore
            this.sdk = this.isToutiao ? new Toutiao() : new Wechat();
            this.sdk.init();
        }
    }

    public LoginSDK(): void {
        if (!this.hasSdk) return;
        this.sdk.login();
    }

    public UpdateOpenId(openId: string): void {
        if (!this.hasSdk) return;
        this.sdk.openId = openId;
    }
    /** 授权 */
    public auth(): void {
        if (!this.hasSdk) return;
        this.sdk.auth();
    }

    public share(type: ShareType, callBack?: (result: boolean) => void, cbSelf?: any): void {
        if (!this.hasSdk) {
            if (callBack) callBack.call(cbSelf, true);
            return;
        }
        let data = ShareManager.instance.getShareData(type);
        this.sdk.share(data, callBack, cbSelf);
    }

    /** 
     * 暴力模式下显示banner
    */
    public bannerShow(pos: BannerPos = BannerPos.Bottom): void {
        if (!this.hasSdk) return;
        this.sdk.bannerShow(pos);
    }
    
    /** 
     * 普通模式下显示banner
    */
    public showBanner(pos: BannerPos = BannerPos.Bottom): void {
        if (!this.hasSdk) return;
        this.sdk.showBanner(pos);
    }

    /** 隐藏banner */
    public hideBanner(): void {
        if (!this.hasSdk) return;
        this.sdk.hideBanner();
    }

    /** 销毁banner */
    public destroyBanner(): void {
        if (!this.hasSdk) return;
        this.sdk.destroyBanner();
    }

    /** 显示激励视频 */
    public showVideo(type: VideoType, callBack: (success: boolean) => void, cbSelf: any, enShareOnError: boolean = false): void {
        if (!this.hasSdk) {
            callBack.call(cbSelf, true);
            return;
        }
        // let myCallback = function():boolean{
        //     return true
        // }
        this.sdk.showVideo(type, callBack, cbSelf, enShareOnError);
    }

    /** 显示插屏 */
    public showInterstitial(type: InterstitialType): void {
        if (!this.hasSdk) return;
        this.sdk.showInterstitial(type);
    }

    /** 打开其他游戏 */
    public openOtherGame(jumpInfo: any, bid: string): void {
        if (!this.hasSdk) return;
        this.sdk.openOtherGame(jumpInfo, bid);
    }

    /** 跳转其他游戏 */
    public jumpToOtherGame(obj: any): void {
        if (!this.hasSdk) return;
        this.sdk.jumpToOtherGame(obj);
    }

    /** 系统信息 */
    public get systemInfo() {
        if (!this.hasSdk) return;
        return this.sdk.systemInfo;
    }


    /** 长震动 */
    public vibrateLong() {
        if (!this.hasSdk) return;
        this.sdk.vibrateLong();
    }
    /** 短震动 */
    public vibrateShort() {
        if (!this.hasSdk) return;
        this.sdk.vibrateShort();
    }

    /**
     * 录屏
     * @param duration 秒
     */
    public StartRecorder(duration: number) {
        if (!this.hasSdk) return;
        this.sdk.StartRecorder(duration);
    }
    /**
     * 停止录屏
     */
    StopRecorder() {
        if (!this.hasSdk) return;
        this.sdk.StopRecorder();
    }

    /** 分享录屏 */
    ShareRecorder(): void {
        if (!this.hasSdk) return;
        this.sdk.ShareRecorder();
    }

    /** 弹出小游戏盒子界面 */
    ShowMoreGamesModal() {
        if (!this.hasSdk) return;
        this.sdk.ShowMoreGamesModal();
    }

}