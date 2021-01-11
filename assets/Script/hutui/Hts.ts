
const ht = require('./htSdk');

class Hts {

    private htSdk = ht.default;
    private static me: Hts;

    static instance(): Hts {
        if (Hts.me) {
            return Hts.me;
        }
        Hts.me = new Hts();
        return Hts.me;
    }

    getUid(): string {
        return this.htSdk.getUid();
    }
    //初始化，必须调用，可在getLaunchOptionsSync获得query填入，否则query填null
    init(gid: string, query?: string, callback?: (err?: any, re?: any) => void): void {
        this.htSdk.init(gid, query, callback);
    }
    //得到每个位置的媒体数组,注意是2维数组,如果某一位置的长度大于1，则需要实现轮播
    getBox(bid: string, callback?: (err?: any, re?: any) => void): void {
        this.htSdk.getBox(bid, callback);
    }
    //如果init时无法传入query，可使用此接口回传query
    navFrom(gid: string, query?: string): void {
        this.htSdk.navFrom(gid, query);
    }
    //在执行navigateToMiniGame等方法进行跳转时调用，上报跳转数据，注意取值要正确
    navTo(gid: string, bid: string, mid: string, isFail?: boolean): void {
        this.htSdk.navTo(gid, bid, mid, isFail);
    }


    jlog(act: string, data?: any, user?: any): void {
        this.htSdk.jlog(act, data, user);
    }
    getSharePic(act: string, callback?: (err?: any, re?: any) => void): void {
        this.htSdk.getSharePic(act, callback);
    }
    shareTo(wxPicId: string): void {
        this.htSdk.shareTo(wxPicId);
    }
    shareFrom(wxPicId: string): void {
        this.htSdk.shareFrom(wxPicId);
    }
    jreq(url: string, data: any, callback: (err?: any, re?: any) => void) {
        this.htSdk.jreq(url, data, callback);
    }


}
export const hts = Hts.instance();