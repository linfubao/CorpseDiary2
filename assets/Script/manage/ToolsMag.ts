import GameMag from "./GameMag";
import AudioMag from "./AudioMag";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ToolsMag extends cc.Component {
    private static _instance: ToolsMag = null;
    public static get Ins(): ToolsMag {
        if (!this._instance || this._instance == null) {
            this._instance = new ToolsMag();
        }
        return this._instance;
    }
    /**
     * 动态加载home Bundle场景资源
     * @param path 
     * @param cb 
     */
    getHomeResource(path: string, cb: Function) {
        let bundle = cc.assetManager.getBundle("home");
        if (bundle) {
            bundle.load(path, cc.Asset, (finish: number, total: number, item: any) => { }, (err, res) => {
                if (err) throw new Error(`getHomeResource:${err}`);
                cb && cb(res);
            })
        } else {
            throw new Error(`该Bundle未加载!~~~`);
        }
    }
    /**
     * 动态加载game Bundle场景资源
     * @param path 
     * @param cb 
     */
    getGameResource(path: string, cb: Function) {
        let bundle = cc.assetManager.getBundle("game");
        if (bundle) {
            bundle.load(path, cc.Asset, (finish: number, total: number, item: any) => { }, (err, res) => {
                if (err) throw new Error(`getGameResource:${err}`);
                cb && cb(res);
            })
        } else {
            throw new Error(`该Bundle未加载!~~~`);
        }
    }
    /**
     * 动态加载home Bundle文件夹
     * @param path 
     * @param cb 
     */
    getHomeDir(path: string, cb: Function) {
        let bundle = cc.assetManager.getBundle("home");
        if (bundle) {
            bundle.loadDir(path, cc.Asset, (finish: number, total: number, item: any) => { }, (err, dir) => {
                if (err) throw new Error(`getHomeDir:${err}`);
                cb && cb(dir);
            })
        } else {
            throw new Error(`该Bundle未加载!~~~`);
        }
    }
    /**
     * 动态加载game Bundle文件夹
     * @param path 
     * @param cb 
     */
    getGameDir(path: string, cb: Function) {
        let bundle = cc.assetManager.getBundle("game");
        if (bundle) {
            bundle.loadDir(path, cc.Asset, (finish: number, total: number, item: any) => { }, (err, dir) => {
                if (err) throw new Error(`getGameDir:${err}`);
                cb && cb(dir);
            })
        } else {
            throw new Error(`该Bundle未加载!~~~`);
        }
    }
    /**
     * 二分查找法
     * @param arr 
     * @param target 
     */
    binarySearch(arr, key) {
        var low = 0;
        var high = arr.length - 1;
        while (low <= high) {
            var mid = Math.floor((low + high) / 2);
            if (key === arr[mid]) {
                return true;
            } else if (key > arr[mid]) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return false;
    }


    /**
     * 飞进来的方式
     * 注意飞进来的距离的控制： disY
     * @param target cc.Node 移动的节点
     * @param type number 移动的方式：0:up_to_down 1:down_to_up
     */
    flyInAction(target, type) {
        let screenH = cc.view.getVisibleSize().height;
        let initY: number = null;
        let action: cc.Action = null;
        let baseHeight = target.height / 2;
        let disY: number = baseHeight + 80;//距离屏幕的距离
        let diff: number = 10;//过渡值，多飞出去一小段然后再回来
        switch (type) {
            case 0:
                initY = screenH / 2 + target.height;
                action = cc.sequence(
                    cc.moveTo(0.4, 0, screenH / 2 - disY - diff),
                    cc.moveTo(0.05, 0, screenH / 2 - disY + diff)
                );
                break;
            case 1:
                initY = -screenH / 2 - target.height;
                action = cc.moveTo(0.3, 0, -screenH / 2 + disY);
                action = cc.sequence(
                    cc.moveTo(0.4, 0, -screenH / 2 + disY + diff),
                    cc.moveTo(0.05, 0, -screenH / 2 + disY - diff)
                );
                break;
            default:
                break;
        }
        target.setPosition(0, initY);
        target.stopAllActions();
        cc.tween(target)
            .then(action)
            .start();
    }

    /**
     * @param animateNode  
     * @param animName 
     * @param times 播放次数 -1:龙骨默认值  0:无限循环  >0:循环次数
     * @param cb 
     */
    //播放龙骨动画方法
    playDragonBone(animateNode: cc.Node, animName: string, times: number, cb: Function) {
        // console.log(animName);
        animateNode.active = true;
        animateNode.opacity = 255;
        let dragonDisplay = animateNode.getComponent(dragonBones.ArmatureDisplay);
        // console.log(dragonDisplay);
        this.removeDragonBone(animateNode);
        if (times == 0) {
            dragonDisplay.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, function () {
                cb && cb();
            }, this);
        } else {
            dragonDisplay.addEventListener(dragonBones.EventObject.COMPLETE, function () {
                cb && cb();
            }, this);
        }
        dragonDisplay.playAnimation(animName, times);
    }
    removeDragonBone(animateNode: cc.Node) {
        let dragonDisplay = animateNode.getComponent(dragonBones.ArmatureDisplay);
        // console.log(animateNode,dragonDisplay);
        dragonDisplay.removeEventListener(dragonBones.EventObject.COMPLETE);
    }
    /**
     * 下载JSON文件
     * @param data 要写入的数据
     * @param fileName 文件名
     */
    saveForBrowser(data, fileName) {
        if (cc.sys.isBrowser) {
            let textFileAsBlob = new Blob([data], { type: 'application/json' });
            let downloadLink = document.createElement("a");
            downloadLink.download = fileName;
            downloadLink.innerHTML = "Download File";
            if (window.webkitURL != null) {
                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            } else {
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                // downloadLink.onclick = destroyClickedElement;
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }
            downloadLink.click();
        }
    }
    //按钮渐隐
    buttonAction(target, cb: Function) {
        AudioMag.getInstance().playSound("按钮音");
        cc.tween(target)
            .to(0.3, { opacity: 0 })
            .call(() => {
                cb && cb();
                target.opacity = 255;
            })
            .start();
    }
    /**
     * 将秒数转换为分秒格式 00:00
     * @param time 秒数
     */
    formateSeconds(time) {
        let endTime = Math.floor(time); //将传入的秒的值转化为Number
        let min = 0; // 初始化分
        let h = 0; // 初始化小时
        let result = '';
        if (endTime > 60) { //如果秒数大于60，将秒数转换成整数
            min = Math.floor(endTime / 60); //获取分钟，除以60取整数，得到整数分钟
            endTime = Math.floor(endTime % 60); //获取秒数，秒数取佘，得到整数秒数
        }
        result = `${min.toString().padStart(2, '0')}:${endTime.toString().padStart(2, '0')}`;
        // console.log(result);
        return result;
    }
    /**
     * 将秒数转换为时分秒格式 00:00:00
     * @param time 秒数
     */
    formateTime(time) {
        let endTime = Math.floor(time); //将传入的秒的值转化为Number
        let min = 0; // 初始化分
        let h = 0; // 初始化小时
        let result = '';
        if (endTime > 60) { //如果秒数大于60，将秒数转换成整数
            min = Math.floor(endTime / 60); //获取分钟，除以60取整数，得到整数分钟
            endTime = Math.floor(endTime % 60); //获取秒数，秒数取佘，得到整数秒数
            if (min > 60) {//如果分钟大于60，将分钟转换成小时
                h = Math.floor(min / 60)//获取小时，获取分钟除以60，得到整数小时
                min = Math.floor(min % 60) //获取小时后取佘的分，获取分钟除以60取佘的分
            }
        }
        result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${endTime.toString().padStart(2, '0')}`;
        // console.log(result);
        return result;
    }
}
