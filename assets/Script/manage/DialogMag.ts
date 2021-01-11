import ToolsMag from "./ToolsMag";

export enum DialogPath {
    PauseDialog = "prefab/dialog/pauseDialog",
    ResultDialog = "prefab/dialog/resultDialog",
    ShopDialog = "prefab/dialog/shopDialog",
    TaskDialog = "prefab/dialog/taskDialog", //日常任务
    AchieveDialog = "prefab/dialog/achieveDialog", //成就
    FrontGameDialog = "prefab/dialog/frontGameDialog", //开始游戏之前的界面
    SignInDialog = "prefab/dialog/signInDialog", //签到
    MessageDialog = "prefab/dialog/messageDialog", //轻提示框
    GuideDialog = "prefab/dialog/guideDialog", //新手指导框
    MoreGameDialog = "prefab/dialog/moreGameDialog", //更多游戏弹窗

}
export enum DialogScript {
    PauseDialog = "pauseDialog",
    ResultDialog = "resultDialog",
    ShopDialog = "shopDialog",
    TaskDialog = "taskDialog",
    AchieveDialog = "achieveDialog",
    FrontGameDialog = "frontGameDialog",
    SignInDialog = "signInDialog", //签到
    MessageDialog = "messageDialog",
    GuideDialog = "guideDialog", //新手指导框
    MoreGameDialog = "moreGameDialog", //更多游戏弹窗

}

const { ccclass, property } = cc._decorator;

@ccclass
export default class DialogMag extends cc.Component {
    private static instance = null;

    private uiPrefabArray: cc.Prefab[] = [];
    private uiDic: { [key: string]: cc.Node } = {};

    public static get Ins(): DialogMag {
        if (!this.instance || this.instance == null) {
            this.instance = new DialogMag();
        }
        return this.instance;
    }

    /**
     * 弹窗模块
     * @param path 弹窗预制体路径
     * @param comName 预制体挂在的脚本,脚本一定要有onInit方法
     * @param paraList [传参]，参数在脚本的onInit方法接收
     */
    show(path: string, comName: string, paraList: any[] = []) {
        if (this.uiDic[path]) return;
        let prefab = this.uiPrefabArray[path];
        // console.log(prefab);
        let self = this;
        if (prefab) {
            self._showPlane(prefab, path, comName, paraList);
        } else {
            ToolsMag.Ins.getHomeResource(path, function (data: cc.Prefab) {
                // console.log(data);
                self.uiPrefabArray[path] = data;
                self._showPlane(data, path, comName, paraList);
            });
        }
    }
    _showPlane(prefab: cc.Prefab, path: string, comName: string, paraList: any[] = []) {
        let canvas = cc.find("Canvas");
        let node: cc.Node = cc.instantiate(prefab);
        this.uiDic[path] = node;
        let self = this;
        let script = node.getComponent(comName);
        if (script.onInit) {
            script.onInit.apply(script, paraList);
        } else {
            console.error("脚本没有onInit方法");
        }
        let oldOnDestroy = script.onDestroy;
        script.onDestroy = function () {
            if (oldOnDestroy) {
                oldOnDestroy.call(script);
            }
            delete self.uiDic[path];
            // console.log(self.uiDic);
        };
        canvas.addChild(node);
    }

    removePlane(path: string) {
        let node = this.uiDic[path];
        if (!node) return;
        node.destroy();
    }

}
