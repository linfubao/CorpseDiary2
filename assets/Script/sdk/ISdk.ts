interface ISdk {
    /** 是否授权 */
    hasAuth: boolean;
    /** 昵称 */
    nickName: boolean;
    /** 头像 */
    avatarUrl: boolean;
    /** 平台ID */
    openId: string;
    /** 初始化 */
    init(): void;
    /** 登录 */
    login(): void;
    /** 授权 */
    auth(): void;
    /** 分享 */
    share(type: any, callBack?: Function, cbSelf?: any): void;
    /** 暴力模式下的banner */
    bannerShow(pos: any): void;
    /** 显示banner */
    showBanner(pos: any): void;
    /** 隐藏banner */
    hideBanner(): void;
    /** 隐藏banner */
    destroyBanner(): void;
    /** 显示激励视频 */
    showVideo(type: any, callBack: (success: boolean) => void, cbSelf: any, shareOnError?: boolean): void;
    /** 显示插屏 */
    showInterstitial(type: any): void;
    /** 打开其他游戏 */
    openOtherGame(jumpInfo: any, bid: string): void;
    /** 跳转其他游戏 */
    jumpToOtherGame(obj: any): void;
    /** 系统配置 */
    systemInfo: any;
    /** 长震动 */
    vibrateLong(): void;
    /** 短震动 */
    vibrateShort(): void;
    /** 录屏 */
    StartRecorder(duration: number): void;
    /** 停止录屏 */
    StopRecorder(): void;
    /** 分享录屏 */
    ShareRecorder(): void;
    /** 弹出小游戏盒子界面 */
    ShowMoreGamesModal(): void;
}