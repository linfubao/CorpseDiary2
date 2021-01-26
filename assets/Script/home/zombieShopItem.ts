import GameMag from "../manage/GameMag";
import ToolsMag from "../manage/ToolsMag";
import ConfigMag from "../manage/ConfigMag";
import AudioMag from "../manage/AudioMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ZombieShopItem extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    init () {

    }

    // update (dt) {}
}
