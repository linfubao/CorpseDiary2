import AudioMag from "../manage/AudioMag";
import GameMag from "../manage/GameMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MusicSetting extends cc.Component {

    @property(cc.Node)
    musicBtn: cc.Node = null;
    @property(cc.Node)
    soundBtn: cc.Node = null;

    onLoad() {
        this.musicBtn.on(cc.Node.EventType.TOUCH_END, this.onMusicBtn, this);
        this.soundBtn.on(cc.Node.EventType.TOUCH_END, this.onSoundBtn, this);
    }

    onMusicBtn(e) {
        AudioMag.getInstance().changeMusicState();
        let status = e.target.getChildByName("off").active;
        // if (status) {
        //     console.log("打开音乐");
        //     // cc.audioEngine.resumeMusic();
        // } else {
        //     console.log("关闭音乐");
        //     // cc.audioEngine.pauseMusic();
        // }
        e.target.getChildByName("off").active = !status;
        this.musicBtn.getChildByName("on").active = status;
    }
    onSoundBtn(e) {
        AudioMag.getInstance().changeSoundState();
        let status = e.target.getChildByName("off").active;
        // if (status) {
        //     console.log("打开音效");
        //     // cc.audioEngine.resumeAllEffects();
        // } else {
        //     console.log("关闭音效");
        //     // cc.audioEngine.pauseAllEffects();
        // }
        e.target.getChildByName("off").active = !status;
        this.soundBtn.getChildByName("on").active = status;
    }
}
