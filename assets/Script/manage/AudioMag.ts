export default class AudioMag {
    private static _instance: AudioMag;

    public static bgm: string = "";
    //音效文件路径
    private path: string = "";
    //按钮音效
    private btn: string = "btn";
    //音效缓存
    private static _caseSoundsRes: any = {};
    //是否开启背景音乐
    public isOpenMusic: boolean = true;
    //是否开启音效
    public isOpenSound: boolean = true;

    private bundle: cc.AssetManager.Bundle = null;

    public static getInstance(): AudioMag {
        if (!this._instance) {
            this._instance = new AudioMag();
        }
        return this._instance;
    }

    /**
     * 加载音效bundle
     */
    init() {
        cc.assetManager.loadBundle('music', (err, bundle) => {
            if (err) {
                console.log(err, "加载音效bundle失败");
                return;
            }
            this.bundle = bundle;
            AudioMag.getInstance().playBGM("BGM");
            console.log("加载音效bundle完成");
        })
    }

    /**
     * 播放音效
     * @param name 文件名
     * @param loop 循环
     * @param volume 音量
     */
    public playSound(name: string, loop?: boolean, volume?: number) {
        if (!this.isOpenSound) return;
        let clip = AudioMag._caseSoundsRes[name];
        if (clip) {
            cc.audioEngine.play(clip, loop ? loop : false, volume ? volume : 1);
            return;
        }
        if (!this.bundle) return;
        this.bundle.load(this.path + name, cc.AudioClip, function (err, clip: cc.AudioClip) {
            if (err) {
                cc.log(err);
                return;
            }
            let soundName = clip.name;
            AudioMag._caseSoundsRes[soundName] = clip;
            cc.audioEngine.play(clip, loop ? loop : false, volume ? volume : 1);
        })
    }

    /**
     * 播放BGM
     * @param name
     */
    public playBGM(name: string): void {        
        if (!this.isOpenMusic) return;
        cc.audioEngine.setMusicVolume(1);
        if (AudioMag.bgm == name) {
            return;
        }
        cc.audioEngine.stopMusic();
        AudioMag.bgm = name;
        let clip = AudioMag._caseSoundsRes[name];
        if (clip) {
            cc.audioEngine.playMusic(clip, true);
            return;
        }
        if (!this.bundle) return;
        this.bundle.load(this.path + name, cc.AudioClip, function (err, clip: cc.AudioClip) {
            if (err) {
                cc.log(err);
                return;
            }
            let soundName = clip.name;
            AudioMag._caseSoundsRes[soundName] = clip;
            if (AudioMag.bgm == soundName) {
                cc.audioEngine.playMusic(clip, true);
            }
        });
    }

    /**
     * 预加载资源
     */
    public preLoadSound(soundName: string): void {
        let path = this.path + soundName;
        this.bundle.load(path, cc.AudioClip, function (err, clip) {
            if (err) {
                cc.error(err);
                return;
            } else {
            }
        });
    }

    public stopAll() {
        cc.audioEngine.stopAll();
    }

    public pauseAll() {
        cc.audioEngine.pauseAll();
    }

    public resumeAll() {
        cc.audioEngine.resumeAll();
    }


    /**
     * 按钮点击
     */
    public click(): void {
        this.playSound(this.btn);
    }


    /**
     * 开启关闭音效
     */
    changeSoundState() {
        this.isOpenSound = !this.isOpenSound;
    }

    /**
     * 开启关闭音乐
     */
    changeMusicState() {
        if (this.isOpenMusic) {
            this.pauseAll();
            this.isOpenMusic = false;
        } else {
            this.resumeAll();
            this.isOpenMusic = true;
        }
    }
}