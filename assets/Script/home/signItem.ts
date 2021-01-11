import GameMag from "../manage/GameMag";
import AudioMag from "../manage/AudioMag";

const { ccclass, property } = cc._decorator;
//每日签到
@ccclass
export default class SignItem extends cc.Component {

    @property(cc.SpriteAtlas)
    homeAtlas: cc.SpriteAtlas = null;
    @property(cc.SpriteFrame)
    normalBg: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    activeBg: cc.SpriteFrame = null;
    @property(cc.Label)
    coinNum: cc.Label = null;

    index: number = 0;
    init(index) {
        this.index = index;
        let signData = GameMag.Ins.signInData;
        if (signData[index]) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.activeBg;
        }else{
            this.node.getComponent(cc.Sprite).spriteFrame = this.normalBg;
        }
    }

}
