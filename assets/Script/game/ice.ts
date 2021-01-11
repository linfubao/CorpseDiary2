import GameMag from "../manage/GameMag";
import ConfigMag from "../manage/ConfigMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Ice extends cc.Component {

    @property(cc.Prefab)
    blockPre: cc.Prefab = null;

    blockPool: cc.NodePool = null;
    onLoad() {
        this.blockPool = new cc.NodePool();
        for (let i = 0; i < 10; i++) {
            let node = cc.instantiate(this.blockPre);
            this.blockPool.put(node);
        }
        cc.tween(this.node)
            .to(GameMag.Ins.frezonTime, { opacity: 50 })
            .call(()=>{
                this.node.opacity = 0;
            })
            .start();
    }
    onCollisionEnter(other, self) {
        if (other.tag == 1 || other.tag == 6 || other.tag == 8) {
            let node = this.blockPool.get();
            node.parent = this.node;
            let nodeArr = node.children;
            for (let i = 0; i < nodeArr.length; i++) {
                const item = nodeArr[i];
                const dir = i % 2 == 0 ? 1 : -1;
                const x = dir * (Math.random() * (250 - 170) + 170);
                const hight = Math.random() * (300 - 100) + 100;
                let action = cc.spawn(
                    cc.jumpTo(0.7, cc.v2(x, -140), hight, 1),
                    cc.rotateTo(0.7, 700)
                );
                item.stopAllActions();
                item.setPosition(0, 0);
                cc.tween(item)
                    .then(action)
                    .delay(0.1)
                    .call(() => {
                        this.blockPool.put(node);
                    })
                    .start();
            }
        }
    }
}
