import GameMag from "../manage/GameMag";
import AudioMag from "../manage/AudioMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseDialog extends cc.Component {

    @property(cc.Node)
    resumeBtn: cc.Node = null;
    @property(cc.Node)
    retryBtn: cc.Node = null;
    @property(cc.Node)
    menuBtn: cc.Node = null;

    onInit () {
        GameMag.Ins.gamePause = true;
        this.resumeBtn.on(cc.Node.EventType.TOUCH_START, this.onResumeBtn, this);
        this.retryBtn.on(cc.Node.EventType.TOUCH_START, this.onRetryBtn, this);
        this.menuBtn.on(cc.Node.EventType.TOUCH_START, this.onMenuBtn, this);
    }

    onResumeBtn () {
        AudioMag.getInstance().playSound("按钮音");
        cc.director.emit("resumeGame");
        DialogMag.Ins.removePlane(DialogPath.PauseDialog);
    }
    onRetryBtn () {
        AudioMag.getInstance().playSound("按钮音");
        cc.director.loadScene(GameMag.Ins.gameScene);
    }
    onMenuBtn () {
        AudioMag.getInstance().playSound("按钮音");
        cc.director.loadScene(GameMag.Ins.homeScene);
    }
    onDisable(){
        GameMag.Ins.gamePause = false;
    }
}
