import AudioMag from "../manage/AudioMag";
import GameMag from "../manage/GameMag";
import DialogMag, { DialogPath, DialogScript } from "../manage/DialogMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Currency extends cc.Component {
    @property(cc.Node)
    coinNode: cc.Node = null;
    @property(cc.Node)
    diamondNode: cc.Node = null;
    @property(cc.Label)
    coinLab: cc.Label = null;
    @property(cc.Label)
    diamondLab: cc.Label = null;
    @property(cc.Node)
    buyBtn: cc.Node = null;

    onLoad() {
        this.updateCurrency();
        cc.director.on("updateCurrency", this.updateCurrency, this);
        if (this.buyBtn) {
            this.buyBtn.on(cc.Node.EventType.TOUCH_END, this.onBuyBtn, this);
        };
        this.coinNode.on(cc.Node.EventType.TOUCH_END, function () {
            GameMag.Ins.updateCurrency(0, 100000);
            this.updateCurrency();
        }, this);
        this.diamondNode.on(cc.Node.EventType.TOUCH_END, function () {
            GameMag.Ins.updateCurrency(1, 500);
            this.updateCurrency();
        }, this);
    }
    onBuyBtn() {
        AudioMag.getInstance().playSound("按钮音");
        DialogMag.Ins.show(DialogPath.ShopDialog, DialogScript.ShopDialog, [2]);
    }
    updateCurrency() {
        let currency = GameMag.Ins.currency;
        this.coinLab.string = String(currency.coin);
        this.diamondLab.string = String(currency.diamond);
    }
}
