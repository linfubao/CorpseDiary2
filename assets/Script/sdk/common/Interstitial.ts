/** 插屏广告 */
export default class Interstitial
{
    /** 广告ID */
    public adId:string;
    /** 广告对象 */
    private interstitial:wx.InterstitialAd;

    /** 创建广告 */
    public create(adId:string):void
    {
        this.adId = adId;
        this.interstitial = wx.createInterstitialAd({ adUnitId:adId });
        this.interstitial.onClose(this.onClose.bind(this));
        this.interstitial.onError(this.onError.bind(this));
        this.show();
    }

    /** 显示广告 */
    public show():void
    {
        this.interstitial.show();
    }

    private onClose(res:any):void
    {
        // console.log(`[Interstitial] onClose, ${res}`);
    }

    private onError(err:any):void
    {
        console.warn(`[Interstitial] onError, msg:${err.errMsg}, code:${err.errCode}`);
    }
}