import { hts } from "../hutui/Hts";
import ToolsMag from "../manage/ToolsMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class moreGameDialog extends cc.Component {

    @property(cc.Node)
    closeBtn: cc.Node = null;
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    content: cc.Node = null;

    index: number = 0;
    getBoxData: any = null;
    speed: number = 0.3;
    bid: string = null;

    onInit(bid) {
        // this.getBoxData = [1, 1, 1, 1];
        // this.loadItem();
        if (cc.sys.isBrowser) return;
        this.node.zIndex = 8000;
        this.node.active = false;
        this.bid = bid;
        let self = this;
        hts.getBox(bid, function (err, res) {
            if (err) {
                console.error("getBox", err);
                return;
            }
            console.log("更多游戏getBox", res[0]);
            self.node.active = true;
            self.getBoxData = res[0];
            self.loadItem();
        });
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, function () {
            ToolsMag.Ins.buttonAction(this.closeBtn, function () {
                DialogMag.Ins.removePlane(DialogPath.MoreGameDialog);
            }.bind(this));
        }, this);
    }
    scrollMove() {
        this.scrollView.scrollTo(cc.v2(1, 0), this.speed, false);
        this.scheduleOnce(() => {
            this.scrollView.scrollTo(cc.v2(0, 0), this.speed, false);
        }, this.speed + 0.4);
    }
    loadItem() {
        let self = this;
        ToolsMag.Ins.getHomeResource("prefab/other/moreGameItem", function (prefab: cc.Prefab) {
            let node = cc.instantiate(prefab);
            node.getComponent("moreGameItem").init(self.getBoxData[self.index], self.bid);
            node.parent = self.content;
            self.index++;
            if (self.index < self.getBoxData.length) {
                self.loadItem();
            } else {
                self.speed = self.getBoxData.length * self.speed;
                self.scrollMove();
                self.schedule(() => {
                    self.scrollMove();
                }, self.speed * 2.15);
            }
        })
    }
}
