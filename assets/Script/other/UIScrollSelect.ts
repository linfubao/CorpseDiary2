import GameMag from "../manage/GameMag";

const { ccclass, property } = cc._decorator;

export enum EventType {
    SCROLL_START,
    SCROLL_ING,
    SCROLL_END
}

@ccclass
export default class UIScrollSelect extends cc.Component {

    public static EventType = EventType;
    @property(cc.Node)
    content: cc.Node = null;
    @property({
        type: cc.Integer,
        tooltip: '单个控件之间的距离'
    })
    deltaX: number = 0; //间隔距离
    @property({
        tooltip: '中心点的缩放比例'
    })
    centerScale: number = 1;
    @property({
        tooltip: '边缘点的缩放比例'
    })
    minScale: number = 1;
    @property({
        tooltip: '滚动时的速度'
    })
    scrollSpeed: number = 0;
    @property({
        type: cc.Component.EventHandler,
        tooltip: "选择后的回调"
    })
    selectEvents: Array<cc.Component.EventHandler> = [];

    private childs: Array<cc.Node> = [];
    private isTouching: boolean = false;
    private hasTouchMove: boolean = false;
    private isTestX: boolean = false;
    private _touchId: any = null;
    private currentIndex: number = 0;
    private _toMoveX: number = 1; //移动方向
    private dx: number = 0;
    private moveAim: number = 0;

    init(type) {
        this.childs = [];
        for (let i = 0; i < this.content.children.length; i++) {
            this.childs[i] = this.content.children[i];
            this.childs[i].x = this.deltaX * (i - 1);
        }
        this.isTouching = false;
        this.hasTouchMove = false;
        this.isTestX = false;
        this._touchId = null;
        this.currentIndex = 0;

        const useingData = GameMag.Ins.useingData;
        let id = null;
        if (type == "skin") {
            id = useingData.skin;
        } else {
            id = useingData.mecha;
            if (id < 0) {
                id = 0;
            }
        }
        this.scrollTo(id, false);
        cc.director.on("scrollToRole", this.scrollToRole, this);
        cc.director.on("scrollToMecha", this.scrollToMecha, this);
    }
    scrollToRole(index) {
        // console.log("标记", this.currentIndex, index);
        if (this.currentIndex == index) return;
        this.currentIndex = index;
        this.scrollTo(index, false);
    }
    scrollToMecha(index) {
        // console.log("标记", this.currentIndex, index);
        if (this.currentIndex == index) return;
        this.currentIndex = index;
        this.scrollTo(index, false);
    }
    /** 滚动到指定节点 
     * @param anim 是否带移动动画
    */
    scrollTo(idx: number, anim: boolean = true) {
        // console.log("idx:", idx);
        if (idx < 0 && idx >= this.childs.length) {
            return console.error(this.node.name + '->移动超出边界面')
        }
        this.currentIndex = idx;
        this.moveAim = idx;
        if (!anim) {
            for (let i = 0; i < this.childs.length; i++) {
                this._checkChildX(this.childs[i], (i - idx) * this.deltaX);
            }
        } else {
            this.isTestX = true
            cc.Component.EventHandler.emitEvents(this.selectEvents, {
                target: this,
                type: EventType.SCROLL_START,
                index: this.currentIndex
            });
        }
    }
    /** 向左滚一个点 */
    scrollToLeft() {
        this._toMoveX = 1;
        this.scrollTo((this.currentIndex - 1 + this.childs.length) % this.childs.length);
    }

    /** 向左滚一个点 */
    scrollToRight() {
        this._toMoveX = -1;
        this.scrollTo((this.currentIndex + 1 + this.childs.length) % this.childs.length);
    }

    _checkChildX(child, x) {
        if (x > this.childs.length / 2 * this.deltaX) {
            x -= this.childs.length * this.deltaX
        } else if (x < -this.childs.length / 2 * this.deltaX) {
            x += this.childs.length * this.deltaX
        }
        child.x = x;
        const dx = Math.min(Math.abs(x), this.deltaX)
        child.scale = (1 - dx / this.deltaX) * (this.centerScale - this.minScale) + this.minScale
    }

    start() {
        this.content.on(cc.Node.EventType.TOUCH_START, this._onTouchMove, this);
        this.content.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.content.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.content.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
    }
    _onTouchMove(event) {
        if (this._touchId != null && event.touch != this._touchId) {
            return;
        }
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.isTouching = true;
            this.hasTouchMove = false;
            this.isTestX = false;
            this._touchId = event.touch;
            this.dx = event.getStartLocation().x;
            // let evt = {
            //     target: this,
            //     type: EventType.SCROLL_START,
            //     index: this.currentIndex
            // }
            // cc.Component.EventHandler.emitEvents(this.selectEvents, evt);
            return;
        }
        this.hasTouchMove = true;
        const dx = event.getLocation().x - this.dx;
        this._move(dx);
        this.dx = event.getLocation().x;
        // var evt = {
        //     target: this,
        //     type: EventType.SCROLL_ING,
        //     dx: this.dx
        // }
        // cc.Component.EventHandler.emitEvents(this.selectEvents, evt);
    }
    _onTouchEnd(event) {
        if (this._touchId != null && event.touch != this._touchId) {
            return;
        }
        this.isTouching = false;
        if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            this._touchId = null;
        }
        const lo = this.node.convertToNodeSpaceAR(event.getLocation());
        if (!this.hasTouchMove) {
            const mx = Math.ceil((lo.x - this.deltaX / 2) / this.deltaX);
            if (mx === 0) {
                var event1 = {
                    target: this,
                    type: EventType.SCROLL_END,
                    index: this.currentIndex
                }
                cc.Component.EventHandler.emitEvents(this.selectEvents, event1);
            } else {
                this.moveAim = (this.currentIndex + mx + this.childs.length) % this.childs.length;
                this._toMoveX = mx > 0 ? -1 : 1;
                this.isTestX = true;
            }
            return;
        }

        let max = this.deltaX;
        let minidx = 0;
        for (let i = 0; i < this.childs.length; i++) {
            if (Math.abs(this.childs[i].x) <= max) {
                max = Math.abs(this.childs[i].x)
                minidx = i;
            }
        }
        this.moveAim = minidx;
        this._toMoveX = this.childs[minidx].x >= 0 ? -1 : 1;
        this.isTestX = true;
    }
    _move(dt) {
        for (let i = 0; i < this.childs.length; i++) {
            this._checkChildX(this.childs[i], this.childs[i].x + dt);
        }
    }

    update(dt) {
        if (this.isTouching || !this.isTestX) {
            return;
        }
        const stepx = this._toMoveX * dt * this.scrollSpeed;
        const lx = this.childs[this.moveAim].x;
        for (var i = 0; i < this.childs.length; i++) {
            this._checkChildX(this.childs[i], this.childs[i].x + stepx);
        }
        const x = this.childs[0].x;
        const idx = Math.round(x / this.deltaX);
        const tox = this.deltaX * idx;
        let cx = this.childs[this.moveAim].x
        if (lx * cx < 0 && Math.abs(cx) < this.deltaX) {
            this.isTestX = false;
            for (let i = 0; i < this.childs.length; i++) {
                if (Math.abs(this.childs[i].x) <= Math.abs(stepx)) {
                    this.currentIndex = i;
                    break;
                }
            }
            for (let i = 0; i < this.childs.length; i++) {
                this._checkChildX(this.childs[i], this.childs[i].x + tox - x);
            }
            const event = {
                target: this,
                type: EventType.SCROLL_END,
                index: this.currentIndex
            }
            cc.Component.EventHandler.emitEvents(this.selectEvents, event);
        }
    }
}
