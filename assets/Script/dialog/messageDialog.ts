
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MessagePanel extends cc.Component {
    @property({ type: cc.Node, tooltip: "消息预制" })
    pfbMsg: cc.Node = null;

    /** 动画位置坐标 */
    private y0 = 0;
    private y1 = 150;

    /** 空闲的 */
    private idelMsgs: cc.Node[] = [];
    /** 使用中 */
    private usedMsgs: cc.Node[] = [];

    onLoad() {
        this.pfbMsg.active = false;
    }

    public onInit(content: string): void {
        console.log(content);
        this.node.zIndex = 10000;
        let msg = this.getMsg();
        let txtMsg = msg.getChildByName(`txtMsg`).getComponent(cc.Label);
        txtMsg.string = content;
        msg.setSiblingIndex(msg.parent.childrenCount - 1);
        this.playAction(msg);
    }

    private getMsg(): cc.Node {
        let msg: cc.Node;
        if (this.idelMsgs.length > 0) msg = this.idelMsgs.pop();
        else msg = cc.instantiate(this.pfbMsg);
        msg.active = true;
        msg.parent = this.pfbMsg.parent;
        this.usedMsgs.push(msg);
        return msg;
    }

    private playAction(msg: cc.Node): void {
        msg.y = this.y0;
        msg.opacity = 255;
        cc.Tween.stopAllByTarget(msg);
        cc.tween(msg)
            .set({ position: cc.v3(0, this.y0, 0), opacity: 255 })
            .delay(0.5)
            .to(0.5, { position: cc.v3(0, this.y1, 0), opacity: 0 })
            .call(() => { this.endAction(msg) })
            .start();
    }

    private endAction(msg: cc.Node): void {
        msg.active = false;
        for (let i = 0; i < this.usedMsgs.length; i++) {
            if (msg == this.usedMsgs[i]) {
                this.usedMsgs.splice(i, 1);
                break;
            }
        }
        this.idelMsgs.push(msg);
        if (this.usedMsgs.length > 0) return;
        DialogMag.Ins.removePlane(DialogPath.MessageDialog);
        // PanelManager.instance.Close(PanelId.messge);
    }
}