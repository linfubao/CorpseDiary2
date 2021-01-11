declare module wx 
{


    

    /**
     * 监听横竖屏切换事件
     * @link https://q.qq.com/wiki/develop/game/API/equipment/orientation.html
     */
    export function onDeviceOrientationChange(object:any):void
    /**
     * 发起 HTTPS 网络请求
     * @link https://q.qq.com/wiki/develop/game/API/network/request.html#qq-request
     */
    export function request(object:any):void
    /**
     * 设置是否保持常亮状态。仅在当前小程序生效，离开小程序后设置失效
     * @link https://q.qq.com/wiki/develop/game/API/equipment/screen.html#qq-setkeepscreenon
     */
    export function setKeepScreenOn(object:any):void
    /**
     * 返回小程序启动参数
     * @link https://developers.weixin.qq.com/minigame/dev/document/system/life-cycle/wx.getLaunchOptionsSync.html
     */
    export function getLaunchOptionsSync():any
    /**
     * 可以修改渲染帧率。默认渲染帧率为 60 帧每秒。修改后，requestAnimationFrame 的回调频率会发生改变。
     * @link https://developers.weixin.qq.com/minigame/dev/document/render/frame/wx.setPreferredFramesPerSecond.html
     */
    export function setPreferredFramesPerSecond(num:number):void
    /**
     * 提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。
     * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/authorize/wx.authorize.html
     */
    export function authorize(object:any):void
    /**
     * 调用接口获取登录凭证（code）进而换取用户登录态信息，包括用户的唯一标识（openid） 及本次登录的 会话密钥（session_key）等。用户数据的加解密通讯需要依赖会话密钥完成。
     * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/login/wx.login.html
     */
    export function login(object:any):void
    /**
     * 获取用户信息，withCredentials 为 true 时需要先调用 wx.login 接口。需要用户授权 scope.userInfo
     * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/user-info/wx.getUserInfo.html
     */
    export function getUserInfo(object:any):void
    export function requestSubscribeMessage(object:any):void
    export function getSystemInfoSync():any;
    export function getMenuButtonLayout():void
    export function postMessage(object:any):void
    /**
     * 打开另一个小程序
     * @link https://developers.weixin.qq.com/minigame/dev/api/wx.navigateToMiniProgram.html
     */
    export function navigateToMiniProgram(object:any):void
    /**
     * 将本地资源上传到开发者服务器，客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data.
     * @link https://developers.weixin.qq.com/minigame/dev/document/network/upload/wx.uploadFile.html
     */
    export function uploadFile(object:any):void
    /**
     * 通过 wx.login 接口获得的用户登录态拥有一定的时效性。用户越久未使用小程序，用户登录态越有可能失效。
     * 反之如果用户一直在使用小程序，则用户登录态一直保持有效。具体时效逻辑由微信维护，对开发者透明。
     * 开发者只需要调用 wx.checkSession 接口检测当前用户登录态是否有效。
     * 登录态过期后开发者可以再调用 wx.login 获取新的用户登录态。
     * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/login/wx.checkSession.html
     */
    export function checkSession(object:any):void
    /**
     * 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
     * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/setting/wx.getSetting.html
     */
    export function getSetting(object:any):void
    /**
     * 调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限。
     * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/setting/wx.openSetting.html
     */
    export function openSetting(object:any):void
    /**
     * 从本地相册选择图片或使用相机拍照。
     * @link https://developers.weixin.qq.com/minigame/dev/document/media/image/wx.chooseImage.html
     */
    export function chooseImage(object:any):void
    /**
     * 保存图片到系统相册。需要用户授权 scope.writePhotosAlbum
     * @link https://developers.weixin.qq.com/minigame/dev/document/media/image/wx.saveImageToPhotosAlbum.html
     */
    export function saveImageToPhotosAlbum(object:any):void
    /**
     * 获取全局唯一的 RecorderManager
     * @link https://developers.weixin.qq.com/minigame/dev/document/media/recorder/wx.getRecorderManager.html
     */
    export function getRecorderManager():RecorderManager
    /**
     * 显示当前页面的转发按钮
     * @link https://developers.weixin.qq.com/minigame/dev/document/share/wx.showShareMenu.html
     */
    export function showShareMenu(object:any):void
    /**
     * 隐藏转发按钮
     * @link https://developers.weixin.qq.com/minigame/dev/document/share/wx.hideShareMenu.html
     */
    export function hideShareMenu(object:any):void
    /**
     * 获取转发详细信息
     * @link https://developers.weixin.qq.com/minigame/dev/document/share/wx.getShareInfo.html
     */
    export function getShareInfo(object:any):void
    /**
     * 监听用户点击右上角菜单的“转发”按钮时触发的事件
     * @link https://developers.weixin.qq.com/minigame/dev/document/share/wx.onShareAppMessage.html
     */
    export function onShareAppMessage(cb:Function):void
    export function onShareMessageToFriend(cb:Function):void
    /**
     * 取消监听用户点击右上角菜单的“转发”按钮时触发的事件
     * @link https://developers.weixin.qq.com/minigame/dev/document/share/wx.offShareAppMessage.html
     */
    export function offShareAppMessage(cb:Function):void
    /**
     * 主动拉起转发，进入选择通讯录界面。
     * @link https://developers.weixin.qq.com/minigame/dev/document/share/wx.shareAppMessage.html
     */
    export function shareAppMessage(object:any):void
    /**
     * 更新转发属性
     * @link https://developers.weixin.qq.com/minigame/dev/document/share/wx.updateShareMenu.html
     */
    export function updateShareMenu(object:any):void
    /**
     * 创建一个 InnerAudioContext 实例
     * @link https://developers.weixin.qq.com/minigame/dev/document/media/audio/wx.createInnerAudioContext.html
     */
    export function createInnerAudioContext():InnerAudioContext
    /**
     * 退出当前小游戏
     * @link https://developers.weixin.qq.com/minigame/dev/document/system/life-cycle/wx.exitMiniProgram.html
     */
    export function exitMiniProgram(object:any):void;
    /**
     * 监听小游戏隐藏到后台事件。锁屏、按 HOME 键退到桌面、显示在聊天顶部等操作会触发此事件。
     * @link https://developers.weixin.qq.com/minigame/dev/document/system/life-cycle/wx.onHide.html
     */
    export function onHide(callback:Function):void
    /**
     * 监听小游戏回到前台的事件
     * @param callback callback 回调函数 {scene:string(场景值);query:Object(查询参数);shareTicket:string}
     */
    export function onShow(callback:Function):void
    /**
     * 创建用户信息按钮
     * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/user-info/wx.createUserInfoButton.html
     */
    export function createUserInfoButton(object:any):UserInfoButton
    /**
     * 只有开放数据域能调用，获取主域和开放数据域共享的 sharedCanvas
     * @link https://developers.weixin.qq.com/minigame/dev/document/render/canvas/wx.getSharedCanvas.md
     */
    export function getSharedCanvas():Canvas
    /**
     * 监听主域发送的消息
     * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/context/wx.onMessage.html
     */
    export function onMessage(callBack:Function);
    /**
     * 获取开放数据域
     * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/context/wx.getOpenDataContext.html
     */
    export function getOpenDataContext():OpenDataContext;
    /**
     * 在小游戏是通过群分享卡片打开的情况下，可以通过调用该接口获取群同玩成员的游戏数据。该接口只可在开放数据域下使用。
     * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getGroupCloudStorage.html
     */
    export function getUserCloudStorage(obj:any):void
    /**
     * 拉取当前用户所有同玩好友的托管数据。该接口只可在开放数据域下使用
     * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getFriendCloudStorage.html
     */
    export function getFriendCloudStorage(obj:any):void
    /**
     * 对用户托管数据进行写数据操作，允许同时写多组 KV 数据。
     * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.setUserCloudStorage.html
     */
    export function setUserCloudStorage(obj:any):void
    /**
     * 创建激励视频广告组件。请通过 wx.getSystemInfoSync() 返回对象的 SDKVersion 判断基础库版本号 >= 2.0.4 后再使用该 API。同时，开发者工具上暂不支持调试该 API，请直接在真机上进行调试。
     * @link https://developers.weixin.qq.com/minigame/dev/document/ad/wx.createRewardedVideoAd.html
     */
    export function createRewardedVideoAd(obj:any):RewardedVideoAd
    /**
     * 创建 banner 广告组件。请通过 wx.getSystemInfoSync() 返回对象的 SDKVersion 判断基础库版本号 >= 2.0.4 后再使用该 API。同时，开发者工具上暂不支持调试该 API，请直接在真机上进行调试。
     * @link https://developers.weixin.qq.com/minigame/dev/api/wx.createBannerAd.html
     */
    export function createBannerAd(obj:any):BannerAd
    /**
     * 创建插屏广告。
     * @link https://developers.weixin.qq.com/minigame/dev/guide/open-ability/ad/interstitialAd-ad.html
     */
    export function createInterstitialAd(obj:any):InterstitialAd
    /**
     * 开发者可以通过游戏圈组件，在小游戏内为用户提供游戏交流、用户互动、反馈收集等社区能力
     * @link https://developers.weixin.qq.com/minigame/dev/guide/open-ability/game-club.html
     */
    export function createGameClubButton(obj:any):any
    /**
     * 进入客服会话。要求在用户发生过至少一次 touch 事件后才能调用。后台接入方式与小程序一致
     * @link https://developers.weixin.qq.com/minigame/dev/api/open-api/customer-message/wx.openCustomerServiceConversation.html
     */
    export function openCustomerServiceConversation(obj:any):any
    /**
     * 发起米大师支付
     * @link https://developers.weixin.qq.com/minigame/dev/api/midas-payment/wx.requestMidasPayment.html
     */
    export function requestMidasPayment(obj:any):void
    /**
     * (阿拉丁统计)监听用户点击右上角菜单的“转发”按钮时触发的事件
     * @link http://doc.aldwx.com/aldwx/src/game.html
     */
    export function aldOnShareAppMessage(cb:Function):void
    /**
     * (阿拉丁统计)主动拉起转发，进入选择通讯录界面
     * @link http://doc.aldwx.com/aldwx/src/game.html
     */
    export function aldShareAppMessage(object:any):void
    /**
     * (阿拉丁统计)自定义事件埋点
     * @link http://doc.aldwx.com/aldwx/src/game.html
     */
    export function aldSendEvent(eventName:string, object:any):void
    export class RecorderManager
    {
        /**
         * 监听录音暂停事件
         */
        onPause(cb:Function):void;
        /**
         * 监听录音结束事件
         * @link https://developers.weixin.qq.com/minigame/dev/document/media/recorder/RecorderManager.onStop.html
         */
        onStop(cb:(data:wx.InnerAudioData) => void):void;
        /**
         * 监听已录制完指定帧大小的文件事件。如果设置了 frameSize，则会回调此事件。
         */
        onFrameRecorded(cb:(frameBuffer:ArrayBuffer,isLastFrame:boolean) => void):void
        /**
         * 监听录音错误事件
         */
        onError(cb:(errMsg:string) => void):void
        /**
         * 监听录音开始事件
         */
        onStart(cb:Function):void
        /**
         * 暂停录音
         */
        pause():void
        /**
         * 继续录音
         */
        resume():void
        /**
         * 停止录音
         */
        stop():void
        /**
         * 开始录音
         * @link https://developers.weixin.qq.com/minigame/dev/document/media/recorder/RecorderManager.start.html
         */
        start(obj:any):void
    }

    export class ImageFile
    {
        /**
         * 本地文件路径
         */
        path:string;
        /**
         * 本地文件大小，单位 B
         */
        size:number
    }

    export class UserInfoSuccessData
    {
        /**
         * 用户信息对象，不包含 openid 等敏感信息
         * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/user-info/UserInfo.html
         */
        userInfo:UserInfo;
        /**
         * 不包括敏感信息的原始数据字符串，用于计算签名
         */
        rawData:string;
        /**
         * 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息，参考文档signature(https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/http-signature.html)
         */
        signature:string;
        /**
         * 包括敏感数据在内的完整用户信息的加密数据，详细见加密数据解密算法(https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/signature.html)
         */
        encryptedData:string;
        /**
         * 加密算法的初始向量，详细见加密数据解密算法(https://developers.weixin.qq.com/minigame/dev/tutorial/open-ability/signature.html)
         */
        iv:string;
    }

    export class UserInfo
    {
        /**
         * 显示 country province city 所用的语言
         */
        language:string;
        /**
         * 用户昵称
         */
        nickName:string;
        /**
         * 用户头像图片 url。最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像 url 将失效。
         */
        avatarUrl:string;
        /**
         * 用户性别
         */
        gender:string;
        /**
         * 用户所在国家
         */
        country:string;
        /**
         * 用户所在省份
         */
        province:string;
        /**
         * 用户所在城市
         */
        city:string;
    }
    /**
     * InnerAudioContext 实例，可通过 wx.createInnerAudioContext 接口获取实例。
     * @link https://developers.weixin.qq.com/minigame/dev/document/media/audio/InnerAudioContext.html
     */
    export class InnerAudioContext
    {
        /**
         * 音频资源的地址
         */
        src:string;
        /**
         * 是否自动播放
         */
        autoplay:boolean;
        /**
         * 是否循环播放
         */
        loop:boolean;
        /**
         * 是否遵循系统静音开关，当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音
         */
        obeyMuteSwitch:boolean;
        /**
         * 当前音频的长度，单位 s。只有在当前有合法的 src 时返回
         */
        duration:number;
        /**
         * 当前音频的播放位置，单位 s。只有在当前有合法的 src 时返回，时间不取整，保留小数点后 6 位
         */
        currentTime:number;
        /**
         * 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
         */
        paused:boolean;
        /**
         * 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲
         */
        buffered:number;
        /**
         * 音量。范围 0~1。
         */
        volume:number;
        /**
         * 播放
         */
        play();
        /**
         * 暂停。暂停后的音频再播放会从暂停处开始播放
         */
        pause();
        /**
         * 停止。停止后的音频再播放会从头开始播放。
         */
        stop();
        /**
         * 跳转到指定位置，单位 s
         */
        seek(position:number);
        /**
         * 销毁当前实例
         */
        destroy();
        /**
         * 监听音频进入可以播放状态的事件
         */
        onCanplay(callback:Function);
        /**
         * 取消监听音频进入可以播放状态的事件
         */
        offCanplay(callback:Function);
        /**
         * 监听音频播放事件
         */
        onPlay(callback:Function);
        /**
         * 取消监听音频播放事件
         */
        offPlay(callback:Function);
        /**
         * 监听音频暂停事件
         */
        onPause(callback:Function);
        /**
         * 取消监听音频暂停事件
         */
        offPause(callback:Function);
        /**
         * 监听音频停止事件
         */
        onStop(callback:Function);
        /**
         * 取消监听音频停止事件
         */
        offStop(callback:Function);
        /**
         * 监听音频自然播放至结束的事件
         */
        onEnded(callback:Function);
        /**
         * 取消监听音频自然播放至结束的事件
         */
        offEnded(callback:Function);
        /**
         * 监听音频播放进度更新事件
         */
        onTimeUpdate(callback:Function);
        /**
         * 取消监听音频播放进度更新事件
         */
        offTimeUpdate(callback:Function);
        /**
         * 监听音频播放错误事件
         */
        onError(callback:Function);
        /**
         * 取消监听音频播放错误事件
         */
        offError(callback:Function);
        /**
         * 监听音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
         */
        onWaiting(callback:Function);
        /**
         * 取消监听音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
         */
        offWaiting(callback:Function);
        /**
         * 监听音频进行跳转操作的事件
         */
        onSeeking(callback:Function);
        /**
         * 取消监听音频进行跳转操作的事件
         */
        offSeeking(callback:Function);
        /**
         * 监听音频完成跳转操作的事件
         */
        onSeeked(callback:Function);
        /**
         * 取消监听音频完成跳转操作的事件
         */
        offSeeked(callback:Function);
    }

    export class InnerAudioData
    {
        /**
         * 持续时间
         */
        duration:number;
        /**
         * 临时路径
         */
        tempFilePath:string;
        /**
         * 文件大小
         */
        fileSize:number;
    }

    export class UserInfoButton
    {
        /**
         * 按钮上的文本，仅当 type 为 text 时有效
         */
        text:string;
        /**
         * 按钮的背景图片，仅当 type 为 image 时有效
         */
        image:string;
        /**
         * 按钮的样式
         */
        style:any;
        /**
         * 显示用户信息按钮
         */
        show();
        /**
         * 隐藏用户信息按钮
         */
        hide();
        /**
         * 销毁用户信息按钮
         */
        destroy();
        /**
         * 监听用户信息按钮点击事件
         */
        onTap(callback:Function);
        /**
         * 取消监听用户信息按钮点击事件
         */
        offTap(callback:Function);
    }
    /**
     * 开放数据域对象
     * @link https://developers.weixin.qq.com/minigame/dev/document/open-api/context/OpenDataContext.html
     */
    export class OpenDataContext
    {
        /**
         * 开放数据域和主域共享的 sharedCanvas
         */
        canvas:Canvas;
        /**
         * 向开放数据域发送消息
         */
        postMessage(message:any);
        /**
         * 获取开放数据域
         */
        getOpenDataContext();
    }
    /**
     * 画布对象
     */
    export class Canvas
    {
        width:number;
        height:number;
        /**
         * 将当前 Canvas 保存为一个临时文件，并生成相应的临时文件路径。
         */
        toTempFilePath(object:any);
        /**
         * 把画布上的绘制内容以一个 data URI 的格式返回
         */
        toDataURL():string;
    }
    /**
     * 激励视频广告组件。激励视频广告组件是一个原生组件，并且是一个全局单例。层级比上屏 Canvas 高，会覆盖在上屏 Canvas 上。激励视频 广告组件默认是隐藏的，需要调用 RewardedVideoAd.show() 将其显示。
     */
    export class RewardedVideoAd
    {
        /**
         * 广告单元 id
         */
        adUnitId:string;
        /**
         * 隐藏激励视频广告
         */
        load();
        /**
         * 显示激励视频广告。激励视频广告将从屏幕下方推入。
         */
        show();
        /**
         * 监听激励视频广告加载事件
         */
        onLoad(callback:Function);
        /**
         * 监听激励视频广告加载事件
         */
        onError(callback:Function);
        /**
         * 取消监听激励视频错误事件
         */
        offError(callback:Function);
        /**
         * 监听用户点击 关闭广告 按钮的事件
         */
        onClose(callback:Function);
        /**
         * 取消监听用户点击 关闭广告 按钮的事件
         */
        offClose(callback:Function);
        /**
         * 取消监听激励视频广告加载事件
         */
        offLoad(callBack:Function);
    }
    /**
     * banner 广告组件。banner 广告组件是一个原生组件，层级比上屏 Canvas 高，会覆盖在上屏 Canvas 上。banner 广告组件默认是隐藏的，
     * 需要调用 BannerAd.show() 将其显示。banner 广告会根据开发者设置的宽度进行等比缩放，缩放后的尺寸将通过 BannerAd.onResize() 事件中提供。
     */
    export class BannerAd
    {
        /**
         * 广告组件的样式
         */
        style:BannerStyle;
        /**
         * 显示 banner 广告
         */
        show();
        /**
         * 隐藏 banner 广告
         */
        hide();
        /**
         * 销毁 banner 广告
         */
        destroy();
        /**
         * 监听 banner 广告尺寸变化事件
         */
        onResize(callback:Function);
        /**
         * 取消监听 banner 广告尺寸变化事件
         */
        offResize(callback:Function);
        /**
         * 监听 banner 广告加载事件
         */
        onLoad(callback:Function);
        /**
         * 取消监听 banner 广告加载事件
         */
        offLoad(callback:Function);
        /**
         * 监听 banner 广告错误事件
         */
        onError(callback:Function);
        /**
         * 取消监听 banner 广告错误事件
         */
        offError(callback:Function);
    }
    export class BannerStyle
    {
        /**
         * banner 广告组件的左上角横坐标
         */
        left:number;
        /**
         * banner 广告组件的左上角纵坐标
         */
        top:number;
        /**
         * banner 广告组件的宽度。最小 300，最大至 屏幕宽度（屏幕宽度可以通过 qq.getSystemInfoSync() 获取）。
         */
        width:number;
        /**
         * banner 广告组件的高度
         */
        height:number;
        /**
         * banner 广告组件经过缩放后真实的宽度
         */
        realWidth:number;
        /**
         * banner 广告组件经过缩放后真实的高度
         */
        realHeight:number;
    }
    /** 插屏广告 */
    export class InterstitialAd
    {
        show();
        onError(callback:Function);
        onClose(callback:Function);
    }

    /**
     * 短震动
     */
    export function vibrateShort():void
    /**
     * 长震动
     */
    export function vibrateLong():void
    /** 录屏 */
    export function getGameRecorderManager():GameRecorderManager 
    export class GameRecorderManager
    {
        /**
         * 开始录屏
         */
        start(object:any);
        /**
         * 监听录屏开始事件
         */
        onStart(callback:Function);
        /**
         * 记录精彩的视频片段
         */
        recordClip(object:any);
        /**
         * 剪辑精彩的视频片段
         */
        clipVideo(object:any);
        /**
         * 暂停录屏
         */
        pause();
        /**
         * 监听录屏暂停事件
         */
        onPause(callback:Function);
        /**
         * 继续录屏
         */
        resume();
        /**
         * 监听录屏继续事件
         */
        onResume(callback:Function);
        /**
         * 停止录屏
         */
        stop();
        /**
         * 监听录屏结束事件
         */
        onStop(callback:Function);
        /**
         * 监听录屏错误事件
         */
        onError(callback:Function);
        /**
         * 监听录屏中断开始
         */
        onInterruptionBegin(callback:Function);
        /**
         * 监听录屏中断开始
         */
        onInterruptionEnd(callback:Function);
    }
    /** 更多游戏 */
    export function showMoreGamesModal(object:any):void

}
