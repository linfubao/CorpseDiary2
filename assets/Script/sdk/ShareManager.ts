export default class ShareManager {
    private static _instance: ShareManager;

    public static get instance(): ShareManager {
        if (this._instance == null) this._instance = new ShareManager();
        return this._instance;
    }

    /** 默认分享数据 */
    private _shareData: ShareData;
    public get shareData(): ShareData {
        if (!this._shareData) this._shareData = this.getShareData(ShareType.Normal);
        return this._shareData;
    }

    public getShareData(type: ShareType): ShareData {
        let data = new ShareData(`【有人@我】快来一起玩！`, `invite1`, type);
        return data;
    }
}

export enum ShareType {
    /** 普通分享 */
    Normal = 2,
    /** 对战 */
    DZ = 4,
}

export class ShareData {
    public title: string;
    public image: string;
    public type: ShareType;
    public tableId: string;

    constructor(title: string, image: string, type: ShareType, tableId: string = ``) {
        this.title = title;
        this.image = image;
        this.type = type;
        this.tableId = tableId;
    }
}