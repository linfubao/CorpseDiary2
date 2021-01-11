import GameMag from "../manage/GameMag";
import AudioMag from "../manage/AudioMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GuideDialog extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;
    @property(cc.Node)
    hand: cc.Node = null;
    @property(cc.Node)
    closeBtn: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Node)
    texts: cc.Node = null;
    // @property({ type: [cc.Vec2], tooltip: "" })
    // posArr: cc.Vec2[] = [];
    @property({ type: [cc.Vec2], tooltip: "" })
    handPosArr: cc.Vec2[] = [];

    flag: number = null;
    onInit(flag: number, angle: number, tipPos: cc.Vec2, handPos = null) {
        this.node.zIndex = 2000;
        this.flag = flag;
        this.texts.children[flag].active = true;
        this.content.setPosition(tipPos);
        if (handPos) {
            this.hand.active = true;
            this.hand.angle = angle;
            this.hand.setPosition(handPos);
            cc.tween(this.hand)
                .repeatForever(
                    cc.tween().to(0.5, { scale: 1.2 }).delay(0.1).to(0.5, { scale: 1 }).delay(0.1)
                )
                .start();
        }
        // this.bg.on(cc.Node.EventType.TOUCH_END, this.onClose, this);
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClose, this);
    }
    onClose() {
        switch (this.flag) {
            case 0:
                cc.director.emit("initBackground");
                break;
            case 1:
                let todaySign = GameMag.Ins.signInData.todaySign;
                if (!todaySign) {
                    DialogMag.Ins.show(DialogPath.SignInDialog, DialogScript.SignInDialog, []);
                }
                break;
            case 2:
                cc.director.emit("showGuideStep3");
                break;
            case 4:
                cc.director.emit("showGuideStep5");
                break;
            case 5:
                cc.director.emit("showGuideStep6");
                break;
            case 6:
                cc.director.emit("showEnemy");
                break;
            default:
                break;
        }
        GameMag.Ins.updateGuide(this.flag);
        DialogMag.Ins.removePlane(DialogPath.GuideDialog);
    }
}
