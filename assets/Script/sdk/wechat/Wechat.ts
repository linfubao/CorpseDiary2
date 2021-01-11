import { BannerPos, VideoType, InterstitialType } from "../SdkManager";
import Video from "../common/Video";
import Interstitial from "../common/Interstitial";
// import UserManager from "../../core/UserManager";
// import EventManager, { EventId } from "../../core/EventManager";
// import PanelManager from "../../core/PanelManager";
import ShareManager, { ShareType, ShareData } from "../ShareManager";
import { hts } from "../../hutui/Hts";
import DialogMag, { DialogPath, DialogScript } from "../../manage/DialogMag";
import GameMag from "../../manage/GameMag";


export default class Wechat implements ISdk {
    private static _instance: Wechat = null;
    public static get instance(): Wechat {
        if (Wechat._instance == null) Wechat._instance = new Wechat();
        return Wechat._instance;
    }

    /** 是否授权 */
    public hasAuth: boolean;
    /** 授权按钮 */
    private authButton: wx.UserInfoButton;
    /** 昵称 */
    public nickName: boolean;
    /** 头像 */
    public avatarUrl: boolean;
    /** 平台ID */
    public openId: string;
    /** 系统信息 */
    public systemInfo: any;
    /** 本次分享的时间点*/
    private shareTime: number = 0;
    private shareCb: Function;
    private shareCbSelf: any;
    /** banner */
    private banner: wx.BannerAd;
    private bannerArr: wx.BannerAd[] = [];
    private bannerWidth: number = 280;
    private bannerHeight: number = 100;
    private bannerPos: BannerPos;
    /** 激励视频 */
    private videos: Video[] = [];
    /** 插屏广告 */
    private interstitials: Interstitial[] = [];

    /** 初始化 */
    public init(): void {
        this.getSetting();
        wx.setKeepScreenOn({ keepScreenOn: true });//设置屏幕常亮
        wx.updateShareMenu({ withShareTicket: true });
        wx.showShareMenu({ withShareTicket: true });
        this.systemInfo = wx.getSystemInfoSync();
        this.getLaunchOptions();
        wx.onShow(this.onShow.bind(this));

        // 监听用户点击右上角菜单的“转发”按钮时触发的事件
        wx.onShareAppMessage(this.onShareAppMessage.bind(this));
        //@ts-ignore
        // wx.mtOnShareAppMessage(this.mtOnShareAppMessage.bind(this));
        try {
            // 监听子域调用wx.shareMessageToFriend的结果
            wx.onShareMessageToFriend(this.onShareMessageToFriend.bind(this));
        } catch (error) { }
    }

    /** 获取设置信息 */
    private getSetting(): void {
        let self = this;
        wx.getSetting({
            success(res: any) {
                // console.log(`wx.getSetting, res=${JSON.stringify(res)}`);
                self.hasAuth = res.authSetting[`scope.userInfo`] == true;
                self.getUserInfo();
            }
        });
    }

    /** 获取用户信息 */
    private getUserInfo(): void {
        if (!this.hasAuth) return;//未授权
        let self = this;
        wx.getUserInfo({
            success(res: any) {
                // console.log(`wx.getUserInfo, res=${JSON.stringify(res)}`);
                self.nickName = res.userInfo.nickName;
                self.avatarUrl = res.userInfo.avatarUrl;
                // UserManager.instance.UpdateAuthInfo([self.nickName, self.avatarUrl]);
                // EventManager.instance.dispatchEvent(EventId.UpdateAuthInfo, [self.nickName, self.avatarUrl]);
            }
        });
    }

    private getLaunchOptions(): void {
        // let data = wx.getLaunchOptionsSync();
        // let query = data.query;
        // console.log(`[getLaunchOptions], query=${JSON.stringify(query)}`);
    }

    private onShow(res: any): void {
        // let query = res.query;
        // console.log(`[onShow], query=${JSON.stringify(query)}`);
        this.checkShareState();
    }
    private mtOnShareAppMessage(): any {
        let shareData = ShareManager.instance.shareData;
        return {
            title: shareData.title,
            imageUrl: shareData.image,
            imageUrlId: '', // 审核通过的图片 ID
            query: `type=${shareData.type}&tableId=${shareData.tableId}`, // 查询字符串，必须是 key1=val1&key2=val2 的格式
        }
    }
    /** 监听用户点击右上角菜单的「转发」按钮时触发的事件 */
    private onShareAppMessage(): any {
        let shareData = ShareManager.instance.shareData;
        // let query = `from=${UserManager.instance.uname}`;
        return {
            title: shareData.title,
            imageUrl: shareData.image,
            // query: query
        };
    }

    /** 监听子域调用wx.shareMessageToFriend的结果 */
    private onShareMessageToFriend(res: any): void {
        // console.log(`监听子域发送分享的结果, res=${JSON.stringify(res)}`);
        if (!res.success) return;
        // EventManager.instance.dispatchEvent(EventId.shareFriendSuccess);
    }

    /** 登录 */
    public login(): void {
        wx.login({
            success(res: any) {
                // EventManager.instance.dispatchEvent(EventId.Login, res.code);
            },
            fail(msg: any) {
                console.error(`login fail:${msg.errMsg}`);
                // EventManager.instance.dispatchEvent(EventId.OfflineLogin);
            }
        })
    }

    /** 检查分享状态 */
    private checkShareState(): void {
        if (!this.shareCb) return;
        let time = new Date().getTime();
        let isSuccess = time - this.shareTime > 3000;//分享之后3秒回来才算成功
        // SystemTools.log(`检查分享状态, shareTime=${this.shareTime}, nowTime=${time}, isSuccess=${isSuccess}`);
        // if (!isSuccess) PanelManager.instance.OpenMessage("请分享到不同的群");
        if (!isSuccess) console.log("请分享到不同的群");
        this.shareCb.call(this.shareCbSelf, isSuccess);
        this.shareCb = null;
    }

    /** 分享 */
    //callback?: Function, cbSelf?: any
    //public share(data: ShareData): void {
    public share(data: ShareData, callback?: Function, cbSelf?: any): void {
        // console.log(`分享, type=${data.type}, title=${data.title}, tableId=${data.tableId}`);
        // console.log("分享", data)
        this.shareTime = new Date().getTime();
        this.shareCb = callback;
        this.shareCbSelf = cbSelf;
        //@ts-ignore
        // wx.mtShareAppMessage({
        //     title: data.title,
        //     imageUrl: data.image, // 图片 URL
        //     imageUrlId: '', // 审核通过的图片 ID
        //     query: `type=${data.type}&tableId=${data.tableId}`, // 查询字符串，必须是 key1=val1&key2=val2 的格式
        // })

        let shareData = {
            title: data.title,
            imageUrl: data.image,
            query: `type=${data.type}&tableId=${data.tableId}`
        };
        wx.shareAppMessage(shareData);
    }


    /** 授权 */
    public auth(): void {
        if (this.hasAuth) {
            return;//已授权
        }
        if (this.authButton) return;//已创建授权按钮
        //一张全屏的透明图片
        let frameSize = cc.view.getFrameSize();//设备实际尺寸
        let parma = {
            type: 'image',
            style: { left: 0, top: 0, width: frameSize.width, height: frameSize.height }
        };
        this.authButton = wx.createUserInfoButton(parma);
        let self = this;
        this.authButton.onTap((res: any) => {
            self.removeAuthButton();
            console.log(`授权结果, res=${JSON.stringify(res)}`);
            let hasAuth = res.errMsg == "getUserInfo:ok";
            if (hasAuth) {
                let name = res.userInfo.nickName;
                let head = res.userInfo.avatarUrl;
                this.hasAuth = true;
                // console.log(`授权成功, name=${name}, head=${head}`);
                // UserManager.instance.UpdateAuthInfo([name, head]);
                // EventManager.instance.dispatchEvent(EventId.UpdateAuthInfo, [name, head]);
            }
        });
    }

    /** 移除授权按钮 */
    private removeAuthButton(): void {
        if (!this.authButton) return;//未创建授权按钮
        this.authButton.destroy();
        this.authButton = null;
    }
    /** 
     * 暴力模式下显示banner
    */
    public bannerShow(pos: BannerPos): void {
        if (this.bannerArr.length == 0) {//如果要误触的时候，没有banner可用，才重新获取一个新的banner拿来误触。
            this.showBanner(pos);
            return;
        }
        console.log("显示暴力banner");
        //如果要误触的时候,有banner可用,就随机拿一个banner出来显示
        let index = Math.floor(Math.random() * this.bannerArr.length);
        this.banner = this.bannerArr[index];
        this.banner.show();
        if (this.bannerPos != pos) this.setBannerPosition(pos);
    }
    /** 
     * 普通模式下显示banner
    */
    public showBanner(pos: BannerPos): void {
        // if (this.banner != null) {
        //     this.banner.show();
        //     if (this.bannerPos != pos) this.setBannerPosition(pos);
        //     return;
        // }
        console.log("显示banner");
        let adId = this.getBannerId();
        let screenWidth = this.systemInfo.screenWidth;
        let screenHeight = this.systemInfo.screenHeight;
        let adWidth = this.bannerWidth;
        let adHeight = this.bannerHeight;
        this.banner = wx.createBannerAd({ adUnitId: adId, adIntervals: 150, style: { left: (screenWidth - adWidth) / 2, top: screenHeight - adHeight, width: adWidth, height: adHeight } });
        this.bannerArr.push(this.banner);
        // console.log("标记!!!!!!!", this.bannerArr);
        let self = this;
        this.banner.onResize(function (res: any) {
            let width = res.width;
            let height = res.height;
            self.bannerWidth = width;
            self.bannerHeight = height;
            let model: string = self.systemInfo.model;
            let isIphone = model.indexOf(`iPhone`) != -1;
            let left = (screenWidth - width) / 2;
            let top = screenHeight - height - (isIphone ? -1 : 0);//距离底部0个像素间距
            self.banner.style.left = left;
            self.banner.style.top = top;
            self.setBannerPosition(pos);
        });
        this.banner.onError(function (err: any) {
            console.warn(`[showBanner] onError, code:${err.errCode}, msg:${err.errMsg}`);
        });
        this.banner.show();
        this.setBannerPosition(pos);
        //@ts-ignore
        // wx.mtBannerShowEvent();
    }

    /** 设置banner位置 */
    private setBannerPosition(pos: BannerPos): void {
        if (!this.banner) return;
        let width = this.bannerWidth;
        let height = this.bannerHeight;
        let screenWidth = this.systemInfo.screenWidth;
        let screenHeight = this.systemInfo.screenHeight;
        let model: string = this.systemInfo.model;
        let isIphone = model.indexOf(`iPhone`) != -1;
        let left = pos == BannerPos.LeftBottom ? 10 : pos == BannerPos.RightBottom ? screenWidth - width - 30 : (screenWidth - width) / 2;
        let top = pos == BannerPos.Top ? 0 : screenHeight - height - (isIphone ? -1 : 0);//距离底部0个像素间距
        this.banner.style.left = left;
        this.banner.style.top = top;
        this.bannerPos = pos;
        // console.log(`[setBannerPosition], type=${type}, left=${left}, top=${top}, width=${width}, height=${height}, screenWidth=${screenWidth}, screenHeight=${screenHeight}`);
    }

    /** 隐藏banner */
    public hideBanner(): void {
        // console.log("隐藏banner",this.banner);
        if (!this.banner) return;
        this.banner.hide();
    }
    /** 销毁banner */
    public destroyBanner(): void {
        // console.log("销毁banner",this.banner);
        if (!this.banner) return;
        // this.banner.destroy();
        // this.bannerArr.shift();
        // let banner = this.bannerArr.pop();
        // banner.destroy();
        // console.log(this.bannerArr);
    }

    /** 显示激励视频 */
    public showVideo(type: VideoType, callBack: (success: boolean) => void, cbSelf: any, shareOnError: boolean = false): void {
        //@ts-ignore
        // wx.mtVideoShowEvent();

        let adId = this.getVideoId(type);
        let find = this.videos.filter((e) => { return e.adId == adId });
        if (find.length > 0) find[0].show(callBack, cbSelf, shareOnError);
        else {
            let video = new Video();
            video.create(adId, callBack, cbSelf, shareOnError);
            this.videos.push(video);
        }
    }

    /** 显示插屏 */
    public showInterstitial(type: InterstitialType): void {
        let adId = this.getInterstitialId(type);
        let find = this.interstitials.filter((e) => { return e.adId == adId });
        if (find.length > 0) find[0].show();
        else {
            let interstitial = new Interstitial();
            interstitial.create(adId);
            this.interstitials.push(interstitial);
        }
    }

    private getBannerId(): string {
        // return `adunit-861ea87cc45a48b7`;
        return "adunit-251ef8372da60282";
    }

    private getVideoId(type: VideoType): string {
        switch (type) {
            // case VideoType.FreeGold: return `adunit-3f89697d448b55ad`;
            case VideoType.FreeGold: return `adunit-270ec0e31407c95b`;
        }
    }

    private getInterstitialId(type: InterstitialType): string {
        switch (type) {
            //case InterstitialType.Match: return `adunit-729983ee03b5291d`;
            case InterstitialType.Result: return `adunit-729983ee03b5291d`;
        }
    }

    /** 打开其他游戏 */
    public openOtherGame(jumpInfo: any, bid: string): void {
        console.log("跳转",jumpInfo);
        const gid = '5fdc8980d1b5c92d77836329';
        wx.navigateToMiniProgram({
            appId: jumpInfo.jumpKey,
            path: '?' + jumpInfo.query,
            extraData: {
                from: 'pageA'
            },
            success: function () {
                console.log("跳转成功");
                GameMag.Ins.showJumpToGame = false;
                hts.navTo(gid, bid, jumpInfo.mid);//上报跳转数据
            },
            fail: function (res) {
                console.log("跳转失败", JSON.stringify(res));
                GameMag.Ins.showJumpToGame = false;
                hts.navTo(gid, bid, jumpInfo.mid, true);//上报跳转数据
                DialogMag.Ins.show(DialogPath.MoreGameDialog, DialogScript.MoreGameDialog, ["5fdc8a9dd1b5c92d77836339"]);
            }
        });
    }
    // public openOtherGame(appId: string, path: string): void {
    //     wx.navigateToMiniProgram({
    //         appId: appId,
    //         path: path,
    //     });
    // }
    /** 跳转其他游戏 */
    public jumpToOtherGame(obj: any) {
        //@ts-ignore
        // wx.mtShowJumpMiniProgramEvent(obj);//跳转其他小程序(小游戏)事件（显示弹框）
    }

    /** 长震动 */
    public vibrateLong(): void {
        wx.vibrateLong();
    }
    /** 短震动 */
    public vibrateShort(): void {
        wx.vibrateShort();
    }

    /** 录屏 */
    StartRecorder(duration: number) { }
    /** 停止录屏*/
    StopRecorder() { }
    /** 分享录屏 */
    ShareRecorder() { }
    /** 弹出小游戏盒子界面 */
    ShowMoreGamesModal() {

    }

}