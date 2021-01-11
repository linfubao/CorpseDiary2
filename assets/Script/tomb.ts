

const { ccclass, property } = cc._decorator;
//主页的坟墓小点点
@ccclass
export default class Tomb extends cc.Component {

    onLoad() {
        let t = Math.random() * (5 - 1) + 1;
        cc.tween(this.node)
            .repeatForever(
                cc.tween().to(1.5, { scale: 0 }).delay(0.5).to(1.5, { scale: 2.5 }).delay(t)
            )
            .start();
    }
}
