import GameMag from "../manage/GameMag";
import SdkManager from "../sdk/SdkManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class moreGameItem extends cc.Component {

    @property(cc.Sprite)
    moreGameImg: cc.Sprite = null;
    @property(cc.Label)
    moreGameName: cc.Label = null;
    @property({ type: cc.Node, tooltip: "热门角标" })
    hotIcon: cc.Node = null;

    init(data, bid) {
        if (cc.sys.isBrowser) return;
        let self = this;
        cc.assetManager.loadRemote(data.iconUrl, function (err, texture) {
            if (err) {
                console.error("loadRemote出错", err);
                return;
            }
            self.moreGameImg.spriteFrame = new cc.SpriteFrame(texture);
            self.moreGameName.string = String(data.txt);
            if (data.mark.length > 0) {
                self.hotIcon.active = true;
            }
        });
        this.node.on(cc.Node.EventType.TOUCH_END, function () {
            if (GameMag.Ins.showJumpToGame) return;
            GameMag.Ins.showJumpToGame = true;
            // GameMag.Ins.jumpToReport(data, bid);
            SdkManager.instance.openOtherGame(data, bid);
        }, this);
    }
}
